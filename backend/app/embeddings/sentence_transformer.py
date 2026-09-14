from typing import Any

from app.core.config import settings
from app.embeddings.base import EmbeddingProvider
from app.processors.errors import ProcessingError


class SentenceTransformerProvider(EmbeddingProvider):
    def __init__(self, model_name: str | None = None, batch_size: int | None = None) -> None:
        try:
            from sentence_transformers import SentenceTransformer
        except ImportError as exc:
            raise ProcessingError("Embedding model dependency is not installed") from exc
        try:
            self.model: Any = SentenceTransformer(model_name or settings.embedding_model_name)
        except Exception as exc:
            raise ProcessingError("Embedding model could not be loaded") from exc
        self.batch_size = batch_size or settings.embedding_batch_size

    def embed_text(self, text: str) -> list[float]:
        return self.embed_documents([text])[0]

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
        try:
            encoded = self.model.encode(
                texts,
                batch_size=self.batch_size,
                convert_to_numpy=True,
                normalize_embeddings=True,
                show_progress_bar=False,
            )
            return [vector.tolist() for vector in encoded]
        except Exception as exc:
            raise ProcessingError("Embedding generation failed") from exc
