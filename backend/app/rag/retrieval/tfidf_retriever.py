
from typing import List, Dict, Any

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class TFIDFRetriever:
    """
    Retrieve relevant document chunks using TF-IDF
    vectorization and cosine similarity.
    """

    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            stop_words="english"
        )
        self.chunk_vectors = None
        self.chunks = []

    def index_chunks(self, chunks: List[str]) -> None:
        """
        Convert document chunks into TF-IDF vectors.
        """

        if not chunks:
            raise ValueError("Cannot index an empty chunk collection.")

        if not all(isinstance(chunk, str) for chunk in chunks):
            raise TypeError("Every chunk must be a string.")

        if not any(chunk.strip() for chunk in chunks):
            raise ValueError("Chunks cannot all be empty.")

        self.chunks = chunks

        self.chunk_vectors = self.vectorizer.fit_transform(
            chunks
        )

    def retrieve(
        self,
        query: str,
        top_k: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Retrieve the most relevant chunks for a query.
        """

        if self.chunk_vectors is None:
            raise ValueError("Index chunks before retrieving.")

        if not isinstance(query, str):
            raise TypeError("Query must be a string.")

        if not query.strip():
            raise ValueError("Query cannot be empty.")

        if top_k <= 0:
            raise ValueError("top_k must be greater than zero.")

        query_vector = self.vectorizer.transform([query])

        similarities = cosine_similarity(
            query_vector,
            self.chunk_vectors
        ).flatten()

        ranked_indices = similarities.argsort()[::-1][:top_k]

        results = []

        for index in ranked_indices:
            results.append({
                "chunk": self.chunks[index],
                "score": float(similarities[index])
            })

        return results
