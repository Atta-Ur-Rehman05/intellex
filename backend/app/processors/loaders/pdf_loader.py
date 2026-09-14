from pypdf import PdfReader

from app.processors.errors import ProcessingError
from app.processors.loaders.base import BaseDocumentLoader


class PDFLoader(BaseDocumentLoader):
    def load(self, file_path: str) -> str:
        try:
            reader = PdfReader(file_path)
            pages = [(page.extract_text() or "") for page in reader.pages]
        except Exception as exc:
            raise ProcessingError("Could not extract PDF text") from exc
        text = "\n".join(pages)
        if not text.strip():
            raise ProcessingError("Document contains no usable text")
        return text
