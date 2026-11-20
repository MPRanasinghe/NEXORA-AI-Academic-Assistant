
import re


def clean_text(text: str) -> str:
    """
    Clean extracted academic document text.

    Preserves meaningful punctuation, numbers, and terminology
    while removing unnecessary whitespace and control characters.

    Args:
        text: Raw text extracted from a document.

    Returns:
        Cleaned text.
    """
    if not isinstance(text, str):
        raise TypeError("Input text must be a string.")

    if not text.strip():
        return ""

    # Remove unwanted control characters while preserving
    # normal whitespace characters.
    text = "".join(
        char for char in text
        if char in "\n\t" or ord(char) >= 32
    )

    # Normalize different line-ending formats.
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    # Replace tabs and repeated spaces with a single space.
    text = re.sub(r"[^\S\n]+", " ", text)
    text = re.sub(r" *\n *", "\n", text)

    # Remove excessive blank lines.
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()
