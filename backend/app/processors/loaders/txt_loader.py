from pathlib import Path

from app.processors.errors import ProcessingError
from app.processors.loaders.base import BaseDocumentLoader


class TXTLoader(BaseDocumentLoader):
    def load(self, file_path: str) -> str:
        try:
            text = Path(file_path).read_text(encoding="utf-8")
        except (OSError, UnicodeError) as exc:
            raise ProcessingError("Could not read text document") from exc
        if not text.strip():
            raise ProcessingError("Document contains no usable text")
        return text
