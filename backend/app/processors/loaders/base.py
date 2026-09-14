from abc import ABC, abstractmethod


class BaseDocumentLoader(ABC):
    @abstractmethod
    def load(self, file_path: str) -> str:
        raise NotImplementedError
