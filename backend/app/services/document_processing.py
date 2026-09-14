import logging
from pathlib import Path

from sqlalchemy.orm import Session

from app.core.config import settings
from app.embeddings.service import EmbeddingService
from app.models.document import Document, DocumentStatus
from app.processors.chunkers import TextChunker
from app.processors.cleaners import TextCleaner
from app.processors.errors import ProcessingError
from app.processors.loaders import PDFLoader, TXTLoader
from app.repositories.document_chunks import DocumentChunkRepository

logger = logging.getLogger(__name__)


class DocumentProcessingService:
    def __init__(self, db: Session, embedding_service: EmbeddingService | None = None) -> None:
        self.db = db
        self.chunks = DocumentChunkRepository(db)
        self.cleaner = TextCleaner()
        self.chunker: TextChunker | None = None
        self.embedding_service = embedding_service

    def process(self, document: Document) -> Document:
        try:
            suffix = Path(document.original_filename).suffix.lower()
            loader = {".pdf": PDFLoader(), ".txt": TXTLoader()}.get(suffix)
            if loader is None:
                raise ProcessingError("Unsupported document type")
            self.chunker = TextChunker(settings.chunk_size, settings.chunk_overlap)
            cleaned = self.cleaner.clean(loader.load(document.file_path))
            if not cleaned:
                raise ProcessingError("Document contains no usable text")
            contents = self.chunker.chunk(cleaned)
            if not contents:
                raise ProcessingError("Document produced no chunks")
            embedding_service = self.embedding_service or EmbeddingService()
            embeddings = embedding_service.embed_documents(contents)
            values = [
                {"document_id": document.id, "chunk_index": index, "content": content, "embedding": embeddings[index], "metadata_json": {"source": document.original_filename}}
                for index, content in enumerate(contents)
            ]
            self.chunks.delete_by_document_id(document.id)
            self.chunks.create_many(values)
            document.status = DocumentStatus.READY.value
            self.db.commit()
            self.db.refresh(document)
            return document
        except ProcessingError as exc:
            logger.warning("Document processing failed: %s", exc, extra={"document_id": str(document.id)})
            self._mark_failed(document)
            raise
        except Exception as exc:
            logger.exception("Document processing failed", extra={"document_id": str(document.id)})
            self._mark_failed(document)
            raise ProcessingError("Document processing failed") from exc

    def _mark_failed(self, document: Document) -> None:
        self.db.rollback()
        document.status = DocumentStatus.FAILED.value
        self.db.add(document)
        self.db.commit()
        self.db.refresh(document)
