
from typing import Dict, Any, Optional

from app.rag.agentic.query_analyzer import analyze_query


class RetrievalRouter:
    """
    Route user queries to the most suitable retrieval method.
    """

    def __init__(
        self,
        tfidf_retriever,
        dense_retriever=None,
        hybrid_retriever=None
    ):
        self.tfidf_retriever = tfidf_retriever
        self.dense_retriever = dense_retriever
        self.hybrid_retriever = hybrid_retriever

    def select_strategy(self, query: str) -> str:
        """
        Select a retrieval strategy based on query characteristics.
        """

        analysis = analyze_query(query)

        # Comparison and explanation questions benefit
        # from combining keyword and semantic retrieval.
        if (
            analysis["is_comparison"]
            or analysis["is_explanation"]
        ):
            if self.hybrid_retriever is not None:
                return "hybrid"

            if self.dense_retriever is not None:
                return "dense"

            return "tfidf"

        # Definition questions use semantic retrieval
        # when it is available.
        if analysis["is_definition"]:
            if self.dense_retriever is not None:
                return "dense"

            return "tfidf"

        # General questions use hybrid retrieval when available.
        if self.hybrid_retriever is not None:
            return "hybrid"

        if self.dense_retriever is not None:
            return "dense"

        return "tfidf"

    def retrieve(
        self,
        query: str,
        top_k: int = 3
    ) -> Dict[str, Any]:
        """
        Execute retrieval using the selected strategy.
        """

        if top_k <= 0:
            raise ValueError("top_k must be greater than zero.")

        strategy = self.select_strategy(query)

        # Select the appropriate retriever.
        if strategy == "hybrid":
            retriever = self.hybrid_retriever

        elif strategy == "dense":
            retriever = self.dense_retriever

        else:
            retriever = self.tfidf_retriever

        results = retriever.retrieve(
            query=query,
            top_k=top_k
        )

        return {
            "query": query,
            "strategy": strategy,
            "results": results
        }
