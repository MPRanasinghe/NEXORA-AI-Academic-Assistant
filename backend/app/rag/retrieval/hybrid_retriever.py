from typing import List, Dict, Any, Optional


class HybridRetriever:
    """
    Combine TF-IDF and dense retrieval using
    Reciprocal Rank Fusion (RRF).
    """

    def __init__(self, tfidf_retriever, dense_retriever):
        self.tfidf_retriever = tfidf_retriever
        self.dense_retriever = dense_retriever

    def retrieve(
        self,
        query: str,
        top_k: int = 3,
        candidate_k: Optional[int] = None,
        rrf_k: int = 60
    ) -> List[Dict[str, Any]]:
        """
        Retrieve and combine relevant chunks from
        TF-IDF and dense retrievers using RRF.
        """

        if not isinstance(query, str):
            raise TypeError("Query must be a string.")

        if not query.strip():
            raise ValueError("Query cannot be empty.")

        if top_k <= 0:
            raise ValueError("top_k must be greater than zero.")

        if rrf_k <= 0:
            raise ValueError("rrf_k must be greater than zero.")

        if candidate_k is None:
            candidate_k = max(top_k, 10)

        if candidate_k <= 0:
            raise ValueError(
                "candidate_k must be greater than zero."
            )

        # Retrieve candidates from both retrievers.
        tfidf_results = self.tfidf_retriever.retrieve(
            query,
            top_k=candidate_k
        )

        dense_results = self.dense_retriever.retrieve(
            query,
            top_k=candidate_k
        )

        # Store combined RRF scores.
        fused_results = {}

        # Process TF-IDF rankings.
        for rank, result in enumerate(tfidf_results, start=1):

            chunk = result["chunk"]

            if chunk not in fused_results:
                fused_results[chunk] = {
                    "chunk": chunk,
                    "score": 0.0,
                    "tfidf_rank": None,
                    "dense_rank": None
                }

            fused_results[chunk]["score"] += (
                1 / (rrf_k + rank)
            )

            fused_results[chunk]["tfidf_rank"] = rank

        # Process dense retrieval rankings.
        for rank, result in enumerate(dense_results, start=1):

            chunk = result["chunk"]

            if chunk not in fused_results:
                fused_results[chunk] = {
                    "chunk": chunk,
                    "score": 0.0,
                    "tfidf_rank": None,
                    "dense_rank": None
                }

            fused_results[chunk]["score"] += (
                1 / (rrf_k + rank)
            )

            fused_results[chunk]["dense_rank"] = rank

        # Sort by combined RRF score.
        ranked_results = sorted(
            fused_results.values(),
            key=lambda result: result["score"],
            reverse=True
        )

        return ranked_results[:top_k]
