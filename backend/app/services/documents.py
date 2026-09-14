from pathlib import Path
from uuid import UUID, uuid4

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.document import Document, DocumentStatus
from app.repositories.documents import DocumentRepository
from app.schemas.document import DocumentUpdate
from app.storage.local import FileTooLargeError, LocalDocumentStorage
from app.services.document_processing import DocumentProcessingService

ALLOWED_TYPES = {".pdf": "application/pdf", ".txt": "text/plain"}


class DocumentService:
    def __init__(self, db: Session) -> None:
        self.repository = DocumentRepository(db)
        self.storage = LocalDocumentStorage(settings.document_storage_path, settings.max_upload_size_mb * 1024 * 1024)

    @staticmethod
    def validate_upload(upload: UploadFile) -> str:
        extension = Path(upload.filename or "").suffix.lower()
        expected_type = ALLOWED_TYPES.get(extension)
        if not expected_type or upload.content_type != expected_type:
            raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail="Only PDF and TXT files are supported")
        return extension

    async def upload(self, user_id: UUID, upload: UploadFile) -> Document:
        self.validate_upload(upload)
        document_id = uuid4()
        saved_path: str | None = None
        try:
            saved_path, file_size = await self.storage.save(document_id, upload)
            filename = Path(upload.filename or "upload").name
            document = self.repository.create(
                id=document_id, user_id=user_id, name=Path(filename).stem[:255], original_filename=filename[:255],
                file_path=saved_path, file_size=file_size, mime_type=upload.content_type,
                status=DocumentStatus.PROCESSING.value,
            )
            try:
                return DocumentProcessingService(self.repository.db).process(document)
            except Exception:
                return document
        except FileTooLargeError:
            raise HTTPException(status_code=status.HTTP_413_CONTENT_TOO_LARGE, detail="File exceeds the maximum upload size") from None
        except SQLAlchemyError:
            if saved_path:
                self.storage.delete(document_id, saved_path)
            raise HTTPException(status_code=500, detail="Could not create document") from None

    def get(self, user_id: UUID, document_id: UUID) -> Document:
        document = self.repository.get_by_id_for_user(document_id, user_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        return document

    def list(self, user_id: UUID) -> list[Document]:
        return self.repository.list_for_user(user_id)

    def rename(self, user_id: UUID, document_id: UUID, data: DocumentUpdate) -> Document:
        document = self.get(user_id, document_id)
        return self.repository.update(document, name=data.name)

    def delete(self, user_id: UUID, document_id: UUID) -> None:
        document = self.get(user_id, document_id)
        self.storage.delete(document.id, document.file_path)
        self.repository.delete(document)
