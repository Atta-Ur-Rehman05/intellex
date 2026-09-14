import re


class TextCleaner:
    def clean(self, text: str) -> str:
        normalized = text.replace("\r\n", "\n").replace("\r", "\n")
        lines = [re.sub(r"[ \t]+", " ", line).strip() for line in normalized.split("\n")]
        return "\n".join(line for line in lines if line).strip()
