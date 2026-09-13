from datetime import datetime, timedelta, timezone

import jwt
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.core.security import hash_password
from app.main import app
from app.models.user import User

Base.metadata.create_all(bind=engine)
client = TestClient(app)


@pytest.fixture(autouse=True)
def clean_database() -> None:
    with SessionLocal() as db:
        db.query(User).delete()
        db.commit()


def register_user(email: str = "user@example.com", password: str = "strong-password") -> dict:
    response = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": password, "full_name": "Test User"},
    )
    assert response.status_code == 201
    return response.json()


def test_registration_hashes_password_and_hides_it() -> None:
    data = register_user()
    assert "password" not in data
    assert "hashed_password" not in data
    with SessionLocal() as db:
        user = db.query(User).one()
        assert user.hashed_password != "strong-password"
        assert user.hashed_password.startswith("$argon2")


def test_duplicate_and_invalid_email_rejected() -> None:
    register_user()
    duplicate = client.post(
        "/api/v1/auth/register",
        json={"email": "USER@example.com", "password": "strong-password", "full_name": "Other"},
    )
    invalid = client.post(
        "/api/v1/auth/register",
        json={"email": "not-an-email", "password": "strong-password", "full_name": "Other"},
    )
    assert duplicate.status_code == 409
    assert invalid.status_code == 422


def test_login_me_and_logout() -> None:
    register_user()
    login = client.post("/api/v1/auth/login", json={"email": "user@example.com", "password": "strong-password"})
    assert login.status_code == 200
    token = login.json()["access_token"]
    assert login.json()["token_type"] == "bearer"
    headers = {"Authorization": f"Bearer {token}"}
    assert client.get("/api/v1/auth/me", headers=headers).status_code == 200
    assert client.post("/api/v1/auth/logout", headers=headers).json() == {"message": "Successfully logged out"}


def test_authenticated_user_can_update_full_name() -> None:
    register_user()
    login = client.post("/api/v1/auth/login", json={"email": "user@example.com", "password": "strong-password"})
    headers = {"Authorization": f"Bearer {login.json()['access_token']}"}
    response = client.patch("/api/v1/auth/me", headers=headers, json={"full_name": "Updated User"})
    assert response.status_code == 200
    assert response.json()["full_name"] == "Updated User"


def test_swagger_oauth2_form_login() -> None:
    register_user()
    login = client.post(
        "/api/v1/auth/login",
        data={"username": "user@example.com", "password": "strong-password"},
    )
    assert login.status_code == 200
    assert login.json()["token_type"] == "bearer"


def test_invalid_credentials_and_missing_token_rejected() -> None:
    register_user()
    assert client.post("/api/v1/auth/login", json={"email": "user@example.com", "password": "wrong-password"}).status_code == 401
    assert client.post("/api/v1/auth/login", json={"email": "missing@example.com", "password": "strong-password"}).status_code == 401
    assert client.get("/api/v1/auth/me").status_code == 401
    assert client.get("/api/v1/auth/me", headers={"Authorization": "Bearer invalid"}).status_code == 401


def test_expired_and_nonexistent_user_tokens_rejected() -> None:
    register_user()
    expired = jwt.encode(
        {"sub": "00000000-0000-0000-0000-000000000001", "exp": datetime.now(timezone.utc) - timedelta(minutes=1)},
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )
    assert client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {expired}"}).status_code == 401

    with SessionLocal() as db:
        user = db.query(User).one()
        user.is_active = False
        db.commit()
    login = client.post("/api/v1/auth/login", json={"email": "user@example.com", "password": "strong-password"})
    assert login.status_code == 401
