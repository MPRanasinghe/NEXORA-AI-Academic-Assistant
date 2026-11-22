
from typing import List, Dict, Any, Optional

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class TfidfReranker:
    """
    Rerank retrieved academic document chunks
    using TF-IDF similarity against the original query.
    """

    def rerank(
        self,
        query: str,
        candidates: List[Dict[str, Any]],
        top_k: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """
        Reorder candidate chunks according to their
        lexical relevance to the original query.

        Args:
            query: Original student question.
            candidates: Retrieved candidate chunks.
            top_k: Maximum number of results to return.

        Returns:
            Reranked candidate chunks with reranking scores.
        """

        if not isinstance(query, str) or not query.strip():
            raise ValueError("Query cannot be empty.")

        if not isinstance(candidates, list):
            raise TypeError("Candidates must be a list.")

        if top_k is not None:
            if (
                isinstance(top_k, bool)
                or not isinstance(top_k, int)
                or top_k <= 0
            ):
                raise ValueError("top_k must be a positive integer.")

        # Validate and collect candidate chunks.
        valid_candidates = [
            (index, candidate)
            for index, candidate in enumerate(candidates)
            if (
                isinstance(candidate, dict)
                and isinstance(candidate.get("chunk"), str)
                and candidate["chunk"].strip()
            )
        ]

        if not valid_candidates:
            return []

        chunks = [
            candidate["chunk"]
            for _, candidate in valid_candidates
        ]

        # Create TF-IDF vectors for the candidate chunks.
        vectorizer = TfidfVectorizer(
            stop_words="english"
        )

        try:
            chunk_vectors = vectorizer.fit_transform(chunks)
            query_vector = vectorizer.transform([query])

        except ValueError:
            # Preserve the original candidate order
            # when TF-IDF vectorization is not possible.
            fallback_results = []

            for rank, (original_index, candidate) in enumerate(
                valid_candidates,
                start=1
            ):
                fallback_results.append({
                    **candidate,
                    "rerank_score": 0.0,
                    "original_rank": original_index + 1,
                    "rerank_rank": rank
                })

            if top_k is not None:
                return fallback_results[:top_k]

            return fallback_results

        # Calculate similarity between the query
        # and every candidate chunk.
        similarities = cosine_similarity(
            query_vector,
            chunk_vectors
        ).flatten()

        # Attach reranking scores while preserving
        # the original retrieval information.
        scored_candidates = []

        for position, (original_index, candidate) in enumerate(
            valid_candidates
        ):
            updated_candidate = {
                **candidate,
                "rerank_score": float(similarities[position]),
                "original_rank": original_index + 1
            }

            scored_candidates.append(updated_candidate)

        # Sort by reranking score, preserving original
        # order when scores are equal.
        scored_candidates.sort(
            key=lambda result: result["rerank_score"],
            reverse=True
        )

        # Assign final reranking positions.
        for rank, result in enumerate(
            scored_candidates,
            start=1
        ):
            result["rerank_rank"] = rank

        if top_k is not None:
            return scored_candidates[:top_k]

        return scored_candidates
