# Intellex Backend

Phase 2 adds focused authentication to the Phase 1 foundation: users, Argon2 password hashing, JWT access tokens, protected current-user access, and stateless logout. Documents and other business features remain deferred.

## Requirements

Python 3.11+, PostgreSQL, and a virtual environment.

## Setup

```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
pip install -e ".[dev]"
copy .env.example .env
```

Set `DATABASE_URL` in `.env` to the PostgreSQL database used by the backend.

## Run

```bash
uvicorn app.main:app --reload
```

The API is available at `http://localhost:8000`; Swagger UI is at `/docs` and the basic health check is `GET /health`.

## Authentication

Authentication follows `Router -> Service -> Repository -> Database`.

- `POST /api/v1/auth/register` creates a user.
- `POST /api/v1/auth/login` accepts `{ "email": "user@example.com", "password": "strong-password" }` and returns a bearer access token.
- `GET /api/v1/auth/me` returns the authenticated user and requires `Authorization: Bearer <token>`.
- `POST /api/v1/auth/logout` returns success; because access tokens are stateless, the client must discard its token.

Passwords are hashed with Argon2 and never appear in responses. JWT settings are configured with `JWT_SECRET_KEY`, `JWT_ALGORITHM`, and `JWT_ACCESS_TOKEN_EXPIRE_MINUTES`.

In Swagger, register a user, log in, copy the returned token, select **Authorize**, enter `Bearer <token>`, and call `/auth/me`.

## Database migrations

```bash
alembic upgrade head
```

The initial migration is intentionally empty; future models will be registered through `app.core.database.Base`.

## Tests

```bash
pytest
```

Authentication tests use an isolated in-memory SQLite database and do not modify PostgreSQL data.

## Architecture

Requests enter `app/api`, then future features can follow the `services -> repositories -> database` boundary. `app/core` owns settings, logging, security foundations, and database setup. `models`, `schemas`, `services`, and `repositories` are intentionally empty extension points for later phases.
