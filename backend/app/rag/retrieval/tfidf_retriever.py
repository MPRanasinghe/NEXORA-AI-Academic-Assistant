
from typing import List, Dict, Any, Optional

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class TFIDFRetriever:
    """
    Retrieve relevant document chunks using TF-IDF
    vectorization and cosine similarity while preserving
    document metadata.
    """

    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            stop_words="english"
        )
        self.chunk_vectors = None
        self.chunks = []
        self.chunk_metadata = []

    def index_chunks(
        self,
        chunks: List[str],
        metadata: Optional[List[Dict[str, Any]]] = None
    ) -> None:
        """
        Convert document chunks into TF-IDF vectors
        and preserve their corresponding metadata.
        """

        if not chunks:
            raise ValueError("Cannot index an empty chunk collection.")

        if not all(
            isinstance(chunk, str) and chunk.strip()
            for chunk in chunks
        ):
            raise ValueError("All chunks must be non-empty strings.")

        if metadata is None:
            metadata = [{} for _ in chunks]

        if len(metadata) != len(chunks):
            raise ValueError(
                "Metadata count must match the number of chunks."
            )

        if not all(isinstance(item, dict) for item in metadata):
            raise TypeError(
                "Every metadata entry must be a dictionary."
            )

        # Generate TF-IDF vectors.
        chunk_vectors = self.vectorizer.fit_transform(chunks)

        # Store chunks, vectors, and metadata.
        self.chunks = list(chunks)
        self.chunk_vectors = chunk_vectors
        self.chunk_metadata = [
            dict(item) for item in metadata
        ]

    def clear_index(self) -> None:
        """Clear the in-memory index."""

        self.vectorizer = TfidfVectorizer(
            stop_words="english"
        )
        self.chunk_vectors = None
        self.chunks = []
        self.chunk_metadata = []

    def retrieve(
        self,
        query: str,
        top_k: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Retrieve the most relevant document chunks.

        Chunks with zero similarity are excluded.
        Document metadata is included in each result.
        """

        if self.chunk_vectors is None:
            raise ValueError("Index chunks before retrieving.")

        if not isinstance(query, str):
            raise TypeError("Query must be a string.")

        if not query.strip():
            raise ValueError("Query cannot be empty.")

        if (
            isinstance(top_k, bool)
            or not isinstance(top_k, int)
            or top_k <= 0
        ):
            raise ValueError(
                "top_k must be a positive integer."
            )

        # Convert the query into a TF-IDF vector.
        query_vector = self.vectorizer.transform([query])

        # Calculate cosine similarity.
        similarities = cosine_similarity(
            query_vector,
            self.chunk_vectors
        ).flatten()

        # Rank chunks by similarity.
        ranked_indices = similarities.argsort()[::-1]

        results = []

        for index in ranked_indices:

            # Ignore chunks with no query similarity.
            if similarities[index] <= 0:
                continue

            results.append({
                "chunk": self.chunks[index],
                "score": float(similarities[index]),
                **self.chunk_metadata[index]
            })

            if len(results) >= top_k:
                break

        return results
