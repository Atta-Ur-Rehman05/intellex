import os

import pytest

os.environ["DATABASE_URL"] = "sqlite://"
os.environ["DEBUG"] = "false"
os.environ["JWT_SECRET_KEY"] = "test-secret-key-that-is-at-least-32-bytes"


class FakeEmbeddingService:
    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return [[0.0] * 384 for _ in texts]


@pytest.fixture(autouse=True)
def use_test_embeddings(monkeypatch: pytest.MonkeyPatch) -> None:
    import app.services.document_processing as processing

    monkeypatch.setattr(processing, "EmbeddingService", FakeEmbeddingService)
