from types import SimpleNamespace

from app.rag.ingestion.ingestion_pipeline import DocumentIngestionPipeline
from app.rag.retrieval.dense_retriever import DenseRetriever
from app.rag.retrieval.hybrid_retriever import HybridRetriever
from app.rag.retrieval.tfidf_retriever import TFIDFRetriever
from app.rag.vector_store.chroma_store import ChromaVectorStore


def embedding_for(text):
    normalized = text.lower()
    if "machine" in normalized or "learning" in normalized:
        return [0.0, 1.0, 0.0]
    if "database" in normalized:
        return [1.0, 0.0, 0.0]
    return [0.0, 0.0, 1.0]


class FakeEmbeddingClient:
    def __init__(self):
        self.models = self

    def embed_content(self, model, contents, config):
        del model, config
        if isinstance(contents, str):
            texts = [contents]
        else:
            texts = [
                part.text
                for content in contents
                for part in content.parts
            ]
        return SimpleNamespace(
            embeddings=[
                SimpleNamespace(values=embedding_for(text))
                for text in texts
            ]
        )


def test_multiple_documents_are_retrievable_after_store_reinitialization(
    tmp_path,
):
    client = FakeEmbeddingClient()
    first_store = ChromaVectorStore(
        persist_directory=str(tmp_path),
        collection_name="restart_test",
    )
    first_tfidf = TFIDFRetriever()
    first_dense = DenseRetriever(
        client=client,
        model="test-model",
        vector_store=first_store,
    )
    first_ingestion = DocumentIngestionPipeline(
        tfidf_retriever=first_tfidf,
        dense_retriever=first_dense,
        vector_store=first_store,
    )

    first_ingestion.ingest_document(
        text="Database systems organize reliable tables and records.",
        filename="Database.pdf",
        document_id=101,
        chunk_size=20,
        overlap=2,
    )
    first_ingestion.ingest_document(
        text="Machine learning models identify patterns from training data.",
        filename="MachineLearning.pdf",
        document_id=102,
        chunk_size=20,
        overlap=2,
    )
    assert first_store.count() == 2
    first_store.close()

    second_store = ChromaVectorStore(
        persist_directory=str(tmp_path),
        collection_name="restart_test",
    )
    second_tfidf = TFIDFRetriever()
    second_dense = DenseRetriever(
        client=client,
        model="test-model",
        vector_store=second_store,
    )
    second_ingestion = DocumentIngestionPipeline(
        tfidf_retriever=second_tfidf,
        dense_retriever=second_dense,
        vector_store=second_store,
    )
    hybrid_retriever = HybridRetriever(second_tfidf, second_dense)

    assert len(second_ingestion.document_chunks) == 2
    assert second_store.count() == 2
    tfidf_results = second_tfidf.retrieve("machine learning", top_k=3)
    dense_results = second_dense.retrieve("database", top_k=3)
    hybrid_results = hybrid_retriever.retrieve(
        "machine learning",
        top_k=3,
    )

    assert any(item["filename"] == "MachineLearning.pdf" for item in tfidf_results)
    assert any(item["filename"] == "Database.pdf" for item in dense_results)
    assert any(item["filename"] == "MachineLearning.pdf" for item in hybrid_results)

    second_ingestion.ingest_document(
        text="Database systems organize reliable tables and records.",
        filename="Database.pdf",
        document_id=101,
        chunk_size=20,
        overlap=2,
    )
    assert second_store.count() == 2
    second_store.close()
