from uuid import UUID

from sqlalchemy import delete, func, select
from sqlalchemy.orm import Session

from app.models.document_chunk import DocumentChunk


class DocumentChunkRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, **values: object) -> DocumentChunk:
        chunk = DocumentChunk(**values)
        self.db.add(chunk)
        self.db.flush()
        return chunk

    def create_many(self, chunks: list[dict[str, object]]) -> list[DocumentChunk]:
        models = [DocumentChunk(**values) for values in chunks]
        self.db.add_all(models)
        self.db.flush()
        return models

    def get_by_document_id(self, document_id: UUID) -> list[DocumentChunk]:
        return list(self.db.scalars(select(DocumentChunk).where(DocumentChunk.document_id == document_id).order_by(DocumentChunk.chunk_index)))

    def delete_by_document_id(self, document_id: UUID) -> None:
        self.db.execute(delete(DocumentChunk).where(DocumentChunk.document_id == document_id))

    def count_by_document_id(self, document_id: UUID) -> int:
        return int(self.db.scalar(select(func.count()).select_from(DocumentChunk).where(DocumentChunk.document_id == document_id)) or 0)
