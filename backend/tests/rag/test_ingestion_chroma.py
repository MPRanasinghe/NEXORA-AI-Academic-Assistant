
import tempfile

import numpy as np

from app.rag.ingestion.ingestion_pipeline import DocumentIngestionPipeline
from app.rag.retrieval.tfidf_retriever import TFIDFRetriever
from app.rag.vector_store.chroma_store import ChromaVectorStore


class MockDenseRetriever:
    """Generate fake embeddings without calling the Gemini API."""

    def __init__(self):
        self.chunk_embeddings = None

    def index_chunks(self, chunks, metadata=None):
        self.chunk_embeddings = np.array([
            [1.0, 0.0, 0.0] if "database" in chunk.lower()
            else [0.0, 1.0, 0.0]
            for chunk in chunks
        ])


def test_ingestion_with_chroma():
    with tempfile.TemporaryDirectory() as temp_dir:

        tfidf_retriever = TFIDFRetriever()
        dense_retriever = MockDenseRetriever()

        vector_store = ChromaVectorStore(
            persist_directory=temp_dir,
            collection_name="nexora_test"
        )

        pipeline = DocumentIngestionPipeline(
            tfidf_retriever=tfidf_retriever,
            dense_retriever=dense_retriever,
            vector_store=vector_store
        )

        document_text = """
        Database systems organize and manage structured information.
        SQL is used to query and manage relational databases.
        Machine learning allows computers to learn patterns from data.
        """

        result = pipeline.ingest_document(
            text=document_text,
            filename="Database_Test.pdf",
            document_id=101,
            chunk_size=20,
            overlap=3
        )

        print("\nINGESTION RESULT:")
        print(result)

        print("\nCHROMA DATABASE COUNT:")
        print(vector_store.count())

        assert result["status"] == "success"
        assert result["chunk_count"] > 0
        assert vector_store.count() == result["chunk_count"]

        stored_results = vector_store.search(
            query_embedding=[1.0, 0.0, 0.0],
            top_k=3
        )

        print("\nCHROMA SEARCH RESULTS:")
        for item in stored_results:
            print(item)

        assert len(stored_results) > 0
        assert stored_results[0]["filename"] == "Database_Test.pdf"
        assert stored_results[0]["document_id"] == 101

        print("\nINGESTION + CHROMA INTEGRATION: PASSED")


if __name__ == "__main__":
    test_ingestion_with_chroma()
