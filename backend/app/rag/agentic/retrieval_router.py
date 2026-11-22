
from typing import Dict, Any, Optional, List

from app.rag.agentic.query_analyzer import analyze_query


class RetrievalRouter:
    """
    Route user queries to the most suitable retrieval method
    and provide controlled access to available retrievers.
    """

    def __init__(
        self,
        tfidf_retriever,
        dense_retriever=None,
        hybrid_retriever=None
    ):
        self.retrievers = {
            "tfidf": tfidf_retriever,
            "dense": dense_retriever,
            "hybrid": hybrid_retriever
        }

    def select_strategy(self, query: str) -> str:
        """
        Select the preferred retrieval strategy based
        on the characteristics of the query.
        """

        analysis = analyze_query(query)

        if (
            analysis["is_comparison"]
            or analysis["is_explanation"]
        ):
            if self.retrievers["hybrid"] is not None:
                return "hybrid"

            if self.retrievers["dense"] is not None:
                return "dense"

            return "tfidf"

        if analysis["is_definition"]:
            if self.retrievers["dense"] is not None:
                return "dense"

            return "tfidf"

        if self.retrievers["hybrid"] is not None:
            return "hybrid"

        if self.retrievers["dense"] is not None:
            return "dense"

        return "tfidf"


    def get_available_strategies(
        self,
        preferred_strategy: str
    ) -> List[str]:
        """
        Return available strategies in a defined fallback order.
        """

        fallback_order = {
            "hybrid": ["hybrid", "dense", "tfidf"],
            "dense": ["dense", "hybrid", "tfidf"],
            "tfidf": ["tfidf", "dense", "hybrid"]
        }

        if preferred_strategy not in fallback_order:
            raise ValueError("Unknown retrieval strategy.")

        return [
            strategy
            for strategy in fallback_order[preferred_strategy]
            if self.retrievers[strategy] is not None
        ]


    def retrieve_with_strategy(
        self,
        query: str,
        strategy: str,
        top_k: int = 3
    ) -> Dict[str, Any]:
        """
        Execute retrieval using a specified strategy.
        """

        if not isinstance(query, str) or not query.strip():
            raise ValueError("Query cannot be empty.")

        if top_k <= 0:
            raise ValueError("top_k must be greater than zero.")

        if strategy not in self.retrievers:
            raise ValueError("Unknown retrieval strategy.")

        retriever = self.retrievers[strategy]

        if retriever is None:
            raise ValueError(
                f"The {strategy} retriever is not available."
            )

        results = retriever.retrieve(
            query=query,
            top_k=top_k
        )

        return {
            "query": query,
            "strategy": strategy,
            "results": results
        }

    def retrieve(
        self,
        query: str,
        top_k: int = 3
    ) -> Dict[str, Any]:
        """
        Execute retrieval using the preferred strategy.
        """

        strategy = self.select_strategy(query)

        return self.retrieve_with_strategy(
            query=query,
            strategy=strategy,
            top_k=top_k
        )
