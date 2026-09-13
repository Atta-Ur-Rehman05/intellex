from uuid import UUID

from fastapi import APIRouter, Depends, File, UploadFile, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.document import DocumentResponse, DocumentUpdate
from app.services.documents import DocumentService

router = APIRouter()


@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> DocumentResponse:
    return await DocumentService(db).upload(current_user.id, file)


@router.get("", response_model=list[DocumentResponse])
def list_documents(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> list[DocumentResponse]:
    return DocumentService(db).list(current_user.id)


@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(document_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> DocumentResponse:
    return DocumentService(db).get(current_user.id, document_id)


@router.patch("/{document_id}", response_model=DocumentResponse)
def rename_document(document_id: UUID, data: DocumentUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> DocumentResponse:
    return DocumentService(db).rename(current_user.id, document_id, data)


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(document_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> None:
    DocumentService(db).delete(current_user.id, document_id)
