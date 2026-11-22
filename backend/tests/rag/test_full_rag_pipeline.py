
import os
import tempfile
import traceback
from pathlib import Path

from dotenv import load_dotenv
from google import genai

from app.rag.retrieval.tfidf_retriever import TFIDFRetriever
from app.rag.retrieval.dense_retriever import DenseRetriever
from app.rag.retrieval.hybrid_retriever import HybridRetriever

from app.rag.vector_store.chroma_store import ChromaVectorStore
from app.rag.ingestion.ingestion_pipeline import DocumentIngestionPipeline

from app.rag.agentic.agentic_retrieval import AgenticRetrievalEngine
from app.rag.reranking.reranker import TfidfReranker
from app.rag.context.context_builder import ContextBuilder
from app.rag.generation.answer_generator import GeminiAnswerGenerator
from app.rag.rag_pipeline import RAGPipeline


def run_full_pipeline_test():

    print("\n========== NEXORA FULL RAG PIPELINE TEST ==========\n")

    # 1. Load environment configuration
    load_dotenv(Path(".env").resolve(), override=True)

    api_key = os.getenv("GEMINI_API_KEY")
    embedding_model = os.getenv("GEMINI_EMBEDDING_MODEL")
    generation_model = os.getenv("GEMINI_MODEL")

    if not api_key:
        raise ValueError("GEMINI_API_KEY is not configured.")

    if not embedding_model:
        raise ValueError("GEMINI_EMBEDDING_MODEL is not configured.")

    if not generation_model:
        raise ValueError("GEMINI_MODEL is not configured.")

    print("1. Environment configuration: PASSED")

    # 2. Create Gemini client
    client = genai.Client(api_key=api_key)

    print("2. Gemini client: CREATED")

    # 3. Prepare sample academic document
    document_text = """
    Relational databases organize information into structured tables.

    Each table contains rows and columns. Rows represent individual
    records, while columns represent attributes of those records.

    SQL stands for Structured Query Language. It allows users to
    retrieve, insert, update and delete records in relational databases.

    A primary key uniquely identifies each record in a table.

    A foreign key creates a relationship between tables by referring
    to the primary key of another table.

    Database normalization helps reduce data redundancy and improve
    data consistency.

    A relational database management system, also known as an RDBMS,
    is software used to create, manage and interact with relational
    databases.
    """

    # 4. Create temporary persistent ChromaDB storage
    with tempfile.TemporaryDirectory() as temp_dir:

        tfidf_retriever = TFIDFRetriever()

        vector_store = ChromaVectorStore(
            persist_directory=temp_dir,
            collection_name="nexora_full_pipeline_test"
        )

        dense_retriever = DenseRetriever(
            client=client,
            model=embedding_model,
            vector_store=vector_store
        )

        hybrid_retriever = HybridRetriever(
            tfidf_retriever,
            dense_retriever
        )

        print("3. Retrieval components: CREATED")

        # 5. Ingest the academic document
        ingestion_pipeline = DocumentIngestionPipeline(
            tfidf_retriever=tfidf_retriever,
            dense_retriever=dense_retriever,
            vector_store=vector_store
        )

        ingestion_result = ingestion_pipeline.ingest_document(
            text=document_text,
            filename="Relational_Database_Test.pdf",
            document_id=999,
            chunk_size=45,
            overlap=8
        )

        print("\nINGESTION RESULT:")
        print(ingestion_result)

        assert ingestion_result["status"] == "success"
        assert vector_store.count() > 0

        print("\n4. Document ingestion and ChromaDB storage: PASSED")

        # 6. Create agentic retrieval engine
        retrieval_engine = AgenticRetrievalEngine(
            tfidf_retriever=tfidf_retriever,
            dense_retriever=dense_retriever,
            hybrid_retriever=hybrid_retriever
        )

        print("5. Agentic retrieval engine: CREATED")

        # 7. Create complete RAG pipeline
        rag_pipeline = RAGPipeline(
            retrieval_engine=retrieval_engine,
            reranker=TfidfReranker(),
            context_builder=ContextBuilder(),
            answer_generator=GeminiAnswerGenerator(
                client=client,
                model=generation_model,
                temperature=0.2
            )
        )

        print("6. RAG pipeline: CREATED")

        # 8. Ask an academic question
        query = (
            "What is a relational database, and how does SQL "
            "help users manage its records?"
        )

        print("\nQUESTION:")
        print(query)

        result = rag_pipeline.answer_question(
            query=query,
            retrieval_top_k=10,
            final_top_k=5
        )

        # 9. Display results
        print("\n========== FINAL ANSWER ==========\n")
        print(result["answer"])

        print("\n========== SOURCES ==========\n")
        for source in result.get("sources", []):
            print(source)

        print("\n========== RETRIEVAL DETAILS ==========\n")

        retrieval = result.get("retrieval", {})

        print("Strategy:", retrieval.get("retrieval_strategy"))
        print("Successful strategy:", retrieval.get("successful_strategy"))
        print("Attempts:", retrieval.get("attempt_count"))
        print("Fallback used:", retrieval.get("fallback_used"))

        print("\nContext used:", result.get("context_used"))

        # 10. Verify final result
        assert result.get("context_used") is True
        assert result.get("answer")
        assert result.get("sources")

        assert any(
            source.get("filename") == "Relational_Database_Test.pdf"
            for source in result["sources"]
        )

        print("\n========== TEST SUMMARY ==========")
        print("Document ingestion: PASSED")
        print("ChromaDB storage: PASSED")
        print("Agentic retrieval: PASSED")
        print("Reranking and context building: PASSED")
        print("Gemini answer generation: PASSED")
        print("Source metadata: PASSED")

        print("\nNEXORA FULL RAG PIPELINE TEST: PASSED")


if __name__ == "__main__":
    try:
        run_full_pipeline_test()
    except Exception:
        print("\nNEXORA FULL RAG PIPELINE TEST: FAILED")
        traceback.print_exc()
        raise
