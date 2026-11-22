from dataclasses import dataclass

from google import genai

from app.core.config import Settings
from app.rag.agentic.agentic_retrieval import AgenticRetrievalEngine
from app.rag.context.context_builder import ContextBuilder
from app.rag.generation.answer_generator import GeminiAnswerGenerator
from app.rag.ingestion.ingestion_pipeline import DocumentIngestionPipeline
from app.rag.rag_pipeline import RAGPipeline
from app.rag.reranking.reranker import TfidfReranker
from app.rag.retrieval.dense_retriever import DenseRetriever
from app.rag.retrieval.hybrid_retriever import HybridRetriever
from app.rag.retrieval.tfidf_retriever import TFIDFRetriever
from app.rag.vector_store.chroma_store import ChromaVectorStore


@dataclass
class RAGServices:
    client: genai.Client
    tfidf_retriever: TFIDFRetriever
    dense_retriever: DenseRetriever
    vector_store: ChromaVectorStore
    hybrid_retriever: HybridRetriever
    retrieval_engine: AgenticRetrievalEngine
    ingestion_pipeline: DocumentIngestionPipeline
    rag_pipeline: RAGPipeline
    _closed: bool = False

    def close(self) -> None:
        if self._closed:
            return

        try:
            self.vector_store.close()
        finally:
            self.client.close()
        self._closed = True


def build_rag_services(config: Settings) -> RAGServices:
    missing = [
        setting
        for setting, value in (
            ("GEMINI_API_KEY", config.gemini_api_key),
            ("GEMINI_MODEL", config.gemini_model),
            ("EMBEDDING_MODEL", config.embedding_model),
        )
        if not value.strip()
    ]
    if missing:
        raise ValueError(
            "Missing required RAG configuration: " + ", ".join(missing)
        )

    client = genai.Client(api_key=config.gemini_api_key)
    vector_store = None
    try:
        vector_store = ChromaVectorStore(
            persist_directory=config.chroma_persist_directory
        )
        tfidf_retriever = TFIDFRetriever()
        dense_retriever = DenseRetriever(
            client=client,
            model=config.embedding_model,
            vector_store=vector_store,
        )
        hybrid_retriever = HybridRetriever(
            tfidf_retriever=tfidf_retriever,
            dense_retriever=dense_retriever,
        )
        retrieval_engine = AgenticRetrievalEngine(
            tfidf_retriever=tfidf_retriever,
            dense_retriever=dense_retriever,
            hybrid_retriever=hybrid_retriever,
            max_attempts=config.max_agent_iterations,
        )
        ingestion_pipeline = DocumentIngestionPipeline(
            tfidf_retriever=tfidf_retriever,
            dense_retriever=dense_retriever,
            vector_store=vector_store,
        )
        rag_pipeline = RAGPipeline(
            retrieval_engine=retrieval_engine,
            reranker=TfidfReranker(),
            context_builder=ContextBuilder(),
            answer_generator=GeminiAnswerGenerator(
                client=client,
                model=config.gemini_model,
            ),
        )

        return RAGServices(
            client=client,
            tfidf_retriever=tfidf_retriever,
            dense_retriever=dense_retriever,
            vector_store=vector_store,
            hybrid_retriever=hybrid_retriever,
            retrieval_engine=retrieval_engine,
            ingestion_pipeline=ingestion_pipeline,
            rag_pipeline=rag_pipeline,
        )
    except Exception:
        if vector_store is not None:
            vector_store.close()
        client.close()
        raise
