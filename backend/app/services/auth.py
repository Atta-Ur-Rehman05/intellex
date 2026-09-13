from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.repositories.users import UserRepository
from app.schemas.auth import UserCreate
from app.schemas.auth import UserUpdate

INVALID_CREDENTIALS = "Invalid email or password"


class AuthService:
    def __init__(self, db: Session) -> None:
        self.users = UserRepository(db)

    def register_user(self, data: UserCreate) -> User:
        if self.users.get_by_email(data.email):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered")
        try:
            return self.users.create(
                email=data.email,
                hashed_password=hash_password(data.password),
                full_name=data.full_name,
            )
        except IntegrityError:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered") from None

    def authenticate_user(self, email: str, password: str) -> User:
        user = self.users.get_by_email(email)
        if not user or not verify_password(password, user.hashed_password) or not user.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=INVALID_CREDENTIALS)
        return user

    def create_access_token(self, user: User) -> str:
        return create_access_token(user.id)

    def update_user(self, user: User, data: UserUpdate) -> User:
        return self.users.update(user, full_name=data.full_name)
