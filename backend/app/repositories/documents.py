from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models.document import Document


class DocumentRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, **values: object) -> Document:
        document = Document(**values)
        self.db.add(document)
        self.db.commit()
        self.db.refresh(document)
        return document

    def get_by_id(self, document_id: UUID) -> Document | None:
        return self.db.scalar(select(Document).where(Document.id == document_id))

    def get_by_id_for_user(self, document_id: UUID, user_id: UUID) -> Document | None:
        return self.db.scalar(select(Document).where(Document.id == document_id, Document.user_id == user_id))

    def list_for_user(self, user_id: UUID) -> list[Document]:
        return list(self.db.scalars(select(Document).where(Document.user_id == user_id).order_by(Document.created_at.desc())))

    def update(self, document: Document, **values: object) -> Document:
        for key, value in values.items():
            setattr(document, key, value)
        self.db.commit()
        self.db.refresh(document)
        return document

    def delete(self, document: Document) -> None:
        self.db.execute(delete(Document).where(Document.id == document.id))
        self.db.commit()
