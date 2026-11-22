
from typing import Dict, Any

from app.rag.agentic.agentic_retrieval import (
    AgenticRetrievalEngine
)
from app.rag.reranking.reranker import TfidfReranker
from app.rag.context.context_builder import ContextBuilder
from app.rag.generation.answer_generator import (
    GeminiAnswerGenerator
)


class RAGPipeline:
    """
    Coordinate retrieval, reranking, context construction,
    and Gemini answer generation.
    """

    def __init__(
        self,
        retrieval_engine: AgenticRetrievalEngine,
        reranker: TfidfReranker,
        context_builder: ContextBuilder,
        answer_generator: GeminiAnswerGenerator
    ):
        self.retrieval_engine = retrieval_engine
        self.reranker = reranker
        self.context_builder = context_builder
        self.answer_generator = answer_generator

    def answer_question(
        self,
        query: str,
        retrieval_top_k: int = 10,
        final_top_k: int = 5
    ) -> Dict[str, Any]:
        """
        Process a student question through the complete RAG workflow.
        """

        if not isinstance(query, str) or not query.strip():
            raise ValueError("Query cannot be empty.")

        if (
            isinstance(retrieval_top_k, bool)
            or not isinstance(retrieval_top_k, int)
            or retrieval_top_k <= 0
        ):
            raise ValueError(
                "retrieval_top_k must be a positive integer."
            )

        if (
            isinstance(final_top_k, bool)
            or not isinstance(final_top_k, int)
            or final_top_k <= 0
        ):
            raise ValueError(
                "final_top_k must be a positive integer."
            )

        # Step 1: Retrieve relevant document chunks.
        retrieval_output = self.retrieval_engine.retrieve(
            query=query,
            top_k=retrieval_top_k
        )

        retrieved_chunks = retrieval_output["retrieved_results"]

        # Step 2: Stop if retrieval did not find sufficient results.
        if not retrieval_output["evaluation"]["is_sufficient"]:
            return {
                "query": query,
                "answer": (
                    "I couldn't find sufficient relevant information "
                    "in the available academic documents to answer "
                    "your question."
                ),
                "sources": [],
                "retrieval": retrieval_output,
                "context_used": False
            }

        # Step 3: Rerank the retrieved candidates.
        reranked_chunks = self.reranker.rerank(
            query=query,
            candidates=retrieved_chunks
        )

        # Step 4: Construct context from the best candidates.
        context_output = self.context_builder.build_context(
            query=query,
            retrieved_chunks=reranked_chunks,
            top_k=final_top_k
        )

        # Step 5: Generate a grounded academic answer.
        generation_output = self.answer_generator.generate_answer(
            query=query,
            context=context_output["context"],
            sources=context_output["sources"]
        )

        # Step 6: Return the complete response.
        return {
            "query": query,
            "answer": generation_output["answer"],
            "sources": generation_output["sources"],
            "retrieval": retrieval_output,
            "context": context_output,
            "context_used": generation_output["context_used"]
        }
