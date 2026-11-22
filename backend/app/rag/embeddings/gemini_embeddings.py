
from typing import List

from google import genai
from google.genai import types


def generate_embedding(
    text: str,
    client: genai.Client,
    model: str,
    task_type: str = "RETRIEVAL_QUERY",
) -> List[float]:
    """Generate a dense embedding for a single text."""

    if not isinstance(text, str):
        raise TypeError("Text must be a string.")

    if not text.strip():
        raise ValueError("Text cannot be empty.")

    response = client.models.embed_content(
        model=model,
        contents=text,
        config=types.EmbedContentConfig(
            task_type=task_type
        ),
    )

    if not response.embeddings:
        raise ValueError("No embedding returned by the API.")

    return response.embeddings[0].values


def generate_embeddings(
    texts: List[str],
    client: genai.Client,
    model: str,
    task_type: str = "RETRIEVAL_DOCUMENT",
) -> List[List[float]]:
    """Generate dense embeddings for multiple texts."""

    if not isinstance(texts, list) or not texts:
        raise ValueError("Text list cannot be empty.")

    if not all(
        isinstance(text, str) and text.strip()
        for text in texts
    ):
        raise ValueError(
            "All texts must be non-empty strings."
        )

    # Each text must be a separate Content object.
    # A list of strings is grouped into one content by the SDK.
    contents = [
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=text)]
        )
        for text in texts
    ]

    response = client.models.embed_content(
        model=model,
        contents=contents,
        config=types.EmbedContentConfig(
            task_type=task_type
        ),
    )

    if not response.embeddings:
        raise ValueError("No embeddings returned by the API.")

    if len(response.embeddings) != len(texts):
        raise ValueError(
            f"Expected {len(texts)} embeddings, "
            f"received {len(response.embeddings)}."
        )

    embeddings = [
        embedding.values
        for embedding in response.embeddings
    ]

    if any(embedding is None for embedding in embeddings):
        raise ValueError("One or more embeddings have no values.")

    return embeddings
