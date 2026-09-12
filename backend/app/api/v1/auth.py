from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.auth import LoginRequest, LogoutResponse, TokenResponse, UserCreate, UserResponse
from app.services.auth import AuthService

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, db: Session = Depends(get_db)) -> User:
    return AuthService(db).register_user(data)


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    service = AuthService(db)
    user = service.authenticate_user(data.email, data.password)
    return TokenResponse(access_token=service.create_access_token(user))


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user


@router.post("/logout", response_model=LogoutResponse)
def logout(current_user: User = Depends(get_current_user)) -> LogoutResponse:
    return LogoutResponse(message="Successfully logged out")
