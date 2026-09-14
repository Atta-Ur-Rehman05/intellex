from app.processors.errors import ProcessingError


class TextChunker:
    def __init__(self, chunk_size: int, chunk_overlap: int) -> None:
        if chunk_size <= 0 or chunk_overlap < 0 or chunk_overlap >= chunk_size:
            raise ProcessingError("Invalid chunk configuration")
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk(self, text: str) -> list[str]:
        if not text:
            return []
        chunks: list[str] = []
        start = 0
        while start < len(text):
            end = min(start + self.chunk_size, len(text))
            content = text[start:end]
            if content:
                chunks.append(content)
            if end == len(text):
                break
            next_start = end - self.chunk_overlap
            if next_start <= start:
                raise ProcessingError("Invalid chunk configuration")
            start = next_start
        return chunks
