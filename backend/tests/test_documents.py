from pathlib import Path
from uuid import UUID

from fastapi.testclient import TestClient

from app.core.database import Base, SessionLocal, engine
from app.main import app
from app.models.document import Document
from app.models.document_chunk import DocumentChunk
from app.models.user import User

Base.metadata.create_all(bind=engine)
client = TestClient(app)


def register_and_login(email: str) -> dict[str, str]:
    client.post("/api/v1/auth/register", json={"email": email, "password": "strong-password", "full_name": "Test User"})
    token = client.post("/api/v1/auth/login", json={"email": email, "password": "strong-password"}).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def cleanup() -> None:
    with SessionLocal() as db:
        db.query(DocumentChunk).delete()
        db.query(Document).delete()
        db.query(User).delete()
        db.commit()


def test_upload_list_rename_and_delete_document() -> None:
    cleanup()
    headers = register_and_login("documents@example.com")
    response = client.post("/api/v1/documents", headers=headers, files={"file": ("notes.txt", b"hello", "text/plain")})
    assert response.status_code == 201
    document = response.json()
    assert document["status"] == "ready"
    with SessionLocal() as db:
        assert db.query(DocumentChunk).filter(DocumentChunk.document_id == UUID(document["id"])).count() == 1
    with SessionLocal() as db:
        stored = db.get(Document, UUID(document["id"]))
        assert stored is not None and Path(stored.file_path).is_file()
    assert client.get("/api/v1/documents", headers=headers).json()[0]["id"] == document["id"]
    renamed = client.patch(f"/api/v1/documents/{document['id']}", headers=headers, json={"name": "Renamed"})
    assert renamed.status_code == 200
    assert renamed.json()["name"] == "Renamed"
    stored_path = stored.file_path
    assert client.delete(f"/api/v1/documents/{document['id']}", headers=headers).status_code == 204
    assert not Path(stored_path).exists()
    assert client.get(f"/api/v1/documents/{document['id']}", headers=headers).status_code == 404


def test_unauthenticated_and_oversized_uploads_are_rejected() -> None:
    cleanup()
    assert client.get("/api/v1/documents").status_code == 401
    headers = register_and_login("limits@example.com")
    oversized = b"x" * (10 * 1024 * 1024 + 1)
    response = client.post("/api/v1/documents", headers=headers, files={"file": ("large.txt", oversized, "text/plain")})
    assert response.status_code == 413


def test_document_upload_validation_and_ownership() -> None:
    cleanup()
    owner = register_and_login("owner@example.com")
    other = register_and_login("other@example.com")
    uploaded = client.post("/api/v1/documents", headers=owner, files={"file": ("file.pdf", b"%PDF", "application/pdf")})
    assert uploaded.status_code == 201
    assert uploaded.json()["status"] == "failed"
    document_id = uploaded.json()["id"]
    assert client.get(f"/api/v1/documents/{document_id}", headers=other).status_code == 404
    assert client.patch(f"/api/v1/documents/{document_id}", headers=other, json={"name": "Nope"}).status_code == 404
    assert client.delete(f"/api/v1/documents/{document_id}", headers=other).status_code == 404
    assert client.post("/api/v1/documents", headers=owner, files={"file": ("bad.exe", b"bad", "application/octet-stream")}).status_code == 415
