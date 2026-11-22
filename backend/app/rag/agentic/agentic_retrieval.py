
from typing import Dict, Any

from app.rag.agentic.query_analyzer import analyze_query
from app.rag.agentic.retrieval_router import RetrievalRouter
from app.rag.agentic.retrieval_evaluator import evaluate_retrieval


class AgenticRetrievalEngine:
    """
    Coordinate query analysis, retrieval routing,
    evaluation, and automatic fallback.
    """

    def __init__(
        self,
        tfidf_retriever,
        dense_retriever=None,
        hybrid_retriever=None,
        max_attempts: int = 3
    ):
        if (
            isinstance(max_attempts, bool)
            or not isinstance(max_attempts, int)
            or max_attempts <= 0
        ):
            raise ValueError("max_attempts must be a positive integer.")

        self.router = RetrievalRouter(
            tfidf_retriever=tfidf_retriever,
            dense_retriever=dense_retriever,
            hybrid_retriever=hybrid_retriever
        )

        self.max_attempts = max_attempts

    def retrieve(
        self,
        query: str,
        top_k: int = 3
    ) -> Dict[str, Any]:
        """
        Execute retrieval with automatic fallback
        when a strategy returns insufficient results.
        """

        if not isinstance(query, str) or not query.strip():
            raise ValueError("Query cannot be empty.")

        if (
            isinstance(top_k, bool)
            or not isinstance(top_k, int)
            or top_k <= 0
        ):
            raise ValueError("top_k must be a positive integer.")

        # Step 1: Analyze the student's query.
        query_analysis = analyze_query(query)

        # Step 2: Select the preferred retrieval strategy.
        preferred_strategy = self.router.select_strategy(query)

        # Step 3: Get available strategies in priority order.
        strategies = self.router.get_available_strategies(
            preferred_strategy
        )

        # Limit the number of retrieval attempts.
        strategies = strategies[:self.max_attempts]

        attempt_history = []
        final_results = []
        final_evaluation = None
        successful_strategy = None

        # Step 4: Try strategies until sufficient results are found.
        for attempt_number, strategy in enumerate(
            strategies,
            start=1
        ):
            try:
                retrieval_output = self.router.retrieve_with_strategy(
                    query=query,
                    strategy=strategy,
                    top_k=top_k
                )

                results = retrieval_output["results"]

                evaluation = evaluate_retrieval(results)

                attempt_history.append({
                    "attempt": attempt_number,
                    "strategy": strategy,
                    "evaluation": evaluation,
                    "status": "success" if evaluation["is_sufficient"]
                    else "insufficient"
                })

                final_results = results
                final_evaluation = evaluation

                if evaluation["is_sufficient"]:
                    successful_strategy = strategy
                    break

            except Exception as error:
                attempt_history.append({
                    "attempt": attempt_number,
                    "strategy": strategy,
                    "status": "error",
                    "error": str(error)
                })

                final_results = []
                final_evaluation = {
                    "is_sufficient": False,
                    "reason": f"Retrieval failed: {error}",
                    "result_count": 0
                }

        # Step 5: Return the final retrieval information.
        if final_evaluation is None:
            final_evaluation = {
                "is_sufficient": False,
                "reason": "No retrieval strategies were available.",
                "result_count": 0
            }

        return {
            "query": query,
            "query_analysis": query_analysis,
            "retrieval_strategy": successful_strategy or preferred_strategy,
            "successful_strategy": successful_strategy,
            "retrieved_results": final_results,
            "evaluation": final_evaluation,
            "attempt_history": attempt_history,
            "attempt_count": len(attempt_history),
            "fallback_used": len(attempt_history) > 1
        }
