from typing import List, Dict, Any

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from app.rag.embeddings.gemini_embeddings import (
    generate_embedding,
    generate_embeddings
)


class DenseRetriever:
    """
    Retrieve relevant document chunks using dense embeddings
    and cosine similarity.
    """

    def __init__(self, client, model: str):
        self.client = client
        self.model = model
        self.chunks = []
        self.chunk_embeddings = None

    def index_chunks(self, chunks: List[str]) -> None:
        """
        Generate and store embeddings for document chunks.
        """

        if not chunks:
            raise ValueError("Cannot index an empty chunk collection.")

        if not all(
            isinstance(chunk, str) and chunk.strip()
            for chunk in chunks
        ):
            raise ValueError("All chunks must be non-empty strings.")

        self.chunks = chunks

        embeddings = generate_embeddings(
            texts=chunks,
            client=self.client,
            model=self.model
        )

        self.chunk_embeddings = np.array(embeddings)

    def retrieve(
        self,
        query: str,
        top_k: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Retrieve the most semantically relevant chunks.
        """

        if self.chunk_embeddings is None:
            raise ValueError("Index chunks before retrieving.")

        if not isinstance(query, str):
            raise TypeError("Query must be a string.")

        if not query.strip():
            raise ValueError("Query cannot be empty.")

        if top_k <= 0:
            raise ValueError("top_k must be greater than zero.")

        query_embedding = generate_embedding(
            text=query,
            client=self.client,
            model=self.model
        )

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
                "score": float(similarities[index])
            })

        return results
