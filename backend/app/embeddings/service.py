from numbers import Real

from app.core.config import settings
from app.embeddings.base import EmbeddingProvider
from functools import lru_cache

from app.embeddings.sentence_transformer import SentenceTransformerProvider
from app.processors.errors import ProcessingError


class EmbeddingService:
    def __init__(self, provider: EmbeddingProvider | None = None) -> None:
        self.provider = provider or get_default_provider()
        self.dimension = settings.embedding_dimension

    def embed_text(self, text: str) -> list[float]:
        if not text or not text.strip():
            raise ProcessingError("Cannot embed empty text")
        return self._validate(self.provider.embed_text(text))

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        if not texts or any(not text or not text.strip() for text in texts):
            raise ProcessingError("Cannot embed empty text")
        vectors = self._validate_batch(self.provider.embed_documents(texts))
        if len(vectors) != len(texts):
            raise ProcessingError("Embedding provider returned an invalid number of vectors")
        return vectors

    def _validate_batch(self, vectors: object) -> list[list[float]]:
        if not isinstance(vectors, list) or not vectors:
            raise ProcessingError("Embedding provider returned no vectors")
        return [self._validate(vector) for vector in vectors]

    def _validate(self, vector: object) -> list[float]:
        if not isinstance(vector, (list, tuple)) or len(vector) != self.dimension:
            raise ProcessingError("Embedding dimension does not match configuration")
        if not all(isinstance(value, Real) and not isinstance(value, bool) for value in vector):
            raise ProcessingError("Embedding contains non-numeric values")
        return [float(value) for value in vector]


@lru_cache(maxsize=1)
def get_default_provider() -> EmbeddingProvider:
    """Load the local model once per application process."""
    return SentenceTransformerProvider()
