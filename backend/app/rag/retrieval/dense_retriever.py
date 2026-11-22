
from typing import List, Dict, Any, Optional

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from app.rag.embeddings.gemini_embeddings import (
    generate_embedding,
    generate_embeddings
)


class DenseRetriever:
    """
    Retrieve document chunks using dense embeddings.

    Supports:
    1. In-memory cosine similarity search.
    2. Persistent ChromaDB vector search.
    """

    def __init__(
        self,
        client,
        model: str,
        vector_store=None
    ):
        self.client = client
        self.model = model
        self.vector_store = vector_store

        self.chunks = []
        self.chunk_embeddings = None
        self.chunk_metadata = []

    def index_chunks(
        self,
        chunks: List[str],
        metadata: Optional[List[Dict[str, Any]]] = None
    ) -> None:
        """Generate embeddings and preserve chunk metadata."""

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

        embeddings = generate_embeddings(
            texts=chunks,
            client=self.client,
            model=self.model
        )

        self.chunk_embeddings = np.array(embeddings)
        self.chunks = list(chunks)
        self.chunk_metadata = [
            dict(item) for item in metadata
        ]

    def retrieve(
        self,
        query: str,
        top_k: int = 3
    ) -> List[Dict[str, Any]]:
        """Retrieve relevant chunks using ChromaDB or memory."""

        if not isinstance(query, str):
            raise TypeError("Query must be a string.")

        if not query.strip():
            raise ValueError("Query cannot be empty.")

        if (
            isinstance(top_k, bool)
            or not isinstance(top_k, int)
            or top_k <= 0
        ):
            raise ValueError("top_k must be a positive integer.")

        # Generate the query embedding.
        query_embedding = generate_embedding(
            text=query,
            client=self.client,
            model=self.model
        )

        # Use persistent ChromaDB retrieval when available.
        if self.vector_store is not None:
            return self.vector_store.search(
                query_embedding=query_embedding,
                top_k=top_k
            )

        # Otherwise, use the existing in-memory retrieval.
        if self.chunk_embeddings is None:
            raise ValueError("Index chunks before retrieving.")

        query_vector = np.array([query_embedding])

        similarities = cosine_similarity(
            query_vector,
            self.chunk_embeddings
        ).flatten()

        ranked_indices = similarities.argsort()[::-1][:top_k]

        results = []

        for index in ranked_indices:
            results.append({
                "chunk": self.chunks[index],
                "score": float(similarities[index]),
                **self.chunk_metadata[index]
            })

        return results
