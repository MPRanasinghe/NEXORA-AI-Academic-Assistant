
from typing import List


def split_into_chunks(
    text: str,
    chunk_size: int = 500,
    overlap: int = 50
) -> List[str]:
    """
    Split text into overlapping word-based chunks.

    Args:
        text: Input document text.
        chunk_size: Maximum number of words per chunk.
        overlap: Number of words shared between chunks.

    Returns:
        A list of text chunks.
    """

    if not isinstance(text, str):
        raise TypeError("Input text must be a string.")

    if chunk_size <= 0:
        raise ValueError("Chunk size must be greater than zero.")

    if overlap < 0 or overlap >= chunk_size:
        raise ValueError(
            "Overlap must be non-negative and smaller than chunk size."
        )

    words = text.split()

    if not words:
        return []

    chunks = []
    start = 0

    while start < len(words):
        end = start + chunk_size

        chunk = " ".join(words[start:end])
        chunks.append(chunk)

        if end >= len(words):
            break

        start = end - overlap

    return chunks
