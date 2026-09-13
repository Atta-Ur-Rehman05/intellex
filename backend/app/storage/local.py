from pathlib import Path
from uuid import UUID

from fastapi import UploadFile


class FileTooLargeError(Exception):
    pass


class LocalDocumentStorage:
    def __init__(self, root: str | Path, max_size_bytes: int) -> None:
        self.root = Path(root)
        self.max_size_bytes = max_size_bytes

    async def save(self, document_id: UUID, upload: UploadFile) -> tuple[str, int]:
        safe_name = Path(upload.filename or "upload").name or "upload"
        target_dir = self.root / str(document_id)
        target_dir.mkdir(parents=True, exist_ok=True)
        target = target_dir / safe_name
        size = 0
        try:
            with target.open("wb") as destination:
                while chunk := await upload.read(1024 * 1024):
                    size += len(chunk)
                    if size > self.max_size_bytes:
                        raise FileTooLargeError
                    destination.write(chunk)
        except Exception:
            self.delete(document_id, target)
            raise
        return str(target), size

    def delete(self, document_id: UUID, file_path: str | Path | None = None) -> None:
        target = Path(file_path) if file_path else self.root / str(document_id)
        if target.is_file():
            target.unlink(missing_ok=True)
            target.parent.rmdir() if target.parent != self.root and target.parent.exists() and not any(target.parent.iterdir()) else None
        elif target.is_dir():
            for child in target.iterdir():
                if child.is_file():
                    child.unlink(missing_ok=True)
            target.rmdir()

    def exists(self, file_path: str) -> bool:
        return Path(file_path).is_file()
