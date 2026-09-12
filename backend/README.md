# Intellex Backend

Phase 1 provides the maintainable FastAPI foundation for Intellex. It includes centralized configuration, PostgreSQL/SQLAlchemy wiring, Alembic, CORS, logging, error handling, API versioning, and a health endpoint. Business features are intentionally deferred.

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

## Database migrations

```bash
alembic upgrade head
```

The initial migration is intentionally empty; future models will be registered through `app.core.database.Base`.

## Tests

```bash
pytest
```

## Architecture

Requests enter `app/api`, then future features can follow the `services -> repositories -> database` boundary. `app/core` owns settings, logging, security foundations, and database setup. `models`, `schemas`, `services`, and `repositories` are intentionally empty extension points for later phases.
