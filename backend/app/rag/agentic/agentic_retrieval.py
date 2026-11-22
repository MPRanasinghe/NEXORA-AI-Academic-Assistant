
from typing import Dict, Any

from app.rag.agentic.query_analyzer import analyze_query
from app.rag.agentic.retrieval_router import RetrievalRouter
from app.rag.agentic.retrieval_evaluator import evaluate_retrieval


class AgenticRetrievalEngine:
    """
    Coordinate query analysis, retrieval routing,
    and retrieval evaluation.
    """

    def __init__(
        self,
        tfidf_retriever,
        dense_retriever=None,
        hybrid_retriever=None
    ):
        self.router = RetrievalRouter(
            tfidf_retriever=tfidf_retriever,
            dense_retriever=dense_retriever,
            hybrid_retriever=hybrid_retriever
        )

    def retrieve(
        self,
        query: str,
        top_k: int = 3
    ) -> Dict[str, Any]:
        """
        Execute the complete agentic retrieval workflow.
        """

        # Step 1: Analyze the student's query.
        query_analysis = analyze_query(query)

        # Step 2: Select and execute a retrieval strategy.
        retrieval_output = self.router.retrieve(
            query=query,
            top_k=top_k
        )

        # Step 3: Evaluate the retrieved results.
        evaluation = evaluate_retrieval(
            retrieval_output["results"]
        )

        # Step 4: Return the complete retrieval information.
        return {
            "query": query,
            "query_analysis": query_analysis,
            "retrieval_strategy": retrieval_output["strategy"],
            "retrieved_results": retrieval_output["results"],
            "evaluation": evaluation
        }
