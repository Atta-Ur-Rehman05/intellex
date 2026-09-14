from pathlib import Path

import pytest

from app.processors.chunkers import TextChunker
from app.processors.cleaners import TextCleaner
from app.processors.errors import ProcessingError
from app.processors.loaders import PDFLoader, TXTLoader
from app.embeddings.service import EmbeddingService


class FakeProvider:
    def __init__(self, vectors: list[list[float]]) -> None:
        self.vectors = vectors

    def embed_text(self, text: str) -> list[float]:
        return self.vectors[0]

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return self.vectors


def test_embedding_service_validates_single_and_batch_vectors() -> None:
    vector = [float(index) for index in range(384)]
    service = EmbeddingService(FakeProvider([vector, vector]))
    assert len(service.embed_text("hello")) == 384
    assert service.embed_documents(["one", "two"]) == [vector, vector]

    with pytest.raises(ProcessingError):
        service.embed_text(" ")
    with pytest.raises(ProcessingError):
        EmbeddingService(FakeProvider([[0.0] * 3])).embed_text("hello")


def test_txt_loader_reads_utf8_and_rejects_empty(tmp_path: Path) -> None:
    path = tmp_path / "notes.txt"
    path.write_text("hello\nworld", encoding="utf-8")
    assert TXTLoader().load(str(path)) == "hello\nworld"

    empty = tmp_path / "empty.txt"
    empty.write_text("  \n", encoding="utf-8")
    with pytest.raises(ProcessingError):
        TXTLoader().load(str(empty))


def test_pdf_loader_rejects_corrupt_file(tmp_path: Path) -> None:
    path = tmp_path / "bad.pdf"
    path.write_bytes(b"not a PDF")
    with pytest.raises(ProcessingError):
        PDFLoader().load(str(path))


def test_cleaner_normalizes_whitespace() -> None:
    assert TextCleaner().clean(" Hello  \r\n\r\n This   is a document. \n\n Intellex ") == "Hello\nThis is a document.\nIntellex"


def test_chunker_is_ordered_overlapping_and_non_empty() -> None:
    chunks = TextChunker(10, 3).chunk("0123456789ABCDEFGHIJ")
    assert chunks == ["0123456789", "789ABCDEFG", "EFGHIJ"]
    assert all(chunks)


def test_chunker_handles_small_text_and_rejects_invalid_configuration() -> None:
    assert TextChunker(100, 20).chunk("small") == ["small"]
    with pytest.raises(ProcessingError):
        TextChunker(0, 0)
    with pytest.raises(ProcessingError):
        TextChunker(10, 10)
