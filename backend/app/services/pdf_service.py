import fitz
from pathlib import Path


class PDFService:

    @staticmethod
    def extract_text(file_path: str) -> dict:
        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError("PDF file not found.")

        text = ""
        page_count = 0

        with fitz.open(path) as pdf:
            page_count = len(pdf)

            for page in pdf:
                page_text = page.get_text()
                text += page_text + "\n"

        return {
            "text": text.strip(),
            "page_count": page_count,
            "character_count": len(text.strip())
        }