
from typing import List, Dict, Any, Optional

from app.rag.processing.preprocessing import clean_text
from app.rag.processing.chunking import split_into_chunks


class DocumentIngestionPipeline:
    """
    Clean, chunk, and index extracted academic documents
    using TF-IDF, dense retrieval, and persistent storage.
    """

    def __init__(
        self,
        tfidf_retriever,
        dense_retriever=None,
        vector_store=None
    ):
        if vector_store is not None and dense_retriever is None:
            raise ValueError(
                "A dense retriever is required when using ChromaDB."
            )

        self.tfidf_retriever = tfidf_retriever
        self.dense_retriever = dense_retriever
        self.vector_store = vector_store

        self.document_chunks = []
        self.chunk_metadata = []

    def ingest_document(
        self,
        text: str,
        filename: str,
        document_id: Optional[int] = None,
        chunk_size: int = 500,
        overlap: int = 50
    ) -> Dict[str, Any]:

        if not isinstance(text, str) or not text.strip():
            raise ValueError("Document text cannot be empty.")

        if not isinstance(filename, str) or not filename.strip():
            raise ValueError("Filename cannot be empty.")

        # Step 1: Clean extracted document text.
        cleaned_text = clean_text(text)

        if not cleaned_text:
            raise ValueError("No usable text found in document.")

        # Step 2: Split text into chunks.
        chunks = split_into_chunks(
            cleaned_text,
            chunk_size=chunk_size,
            overlap=overlap
        )

        if not chunks:
            raise ValueError("No chunks were generated.")

        # Step 3: Generate metadata for every chunk.
        metadata = [
            {
                "filename": filename,
                "document_id": document_id,
                "chunk_index": index
            }
            for index in range(len(chunks))
        ]

        # Step 4: Combine existing and new documents.
        all_chunks = self.document_chunks + chunks
        all_metadata = self.chunk_metadata + metadata

        # Step 5: Index using TF-IDF.
        self.tfidf_retriever.index_chunks(
            chunks=all_chunks,
            metadata=all_metadata
        )

        # Step 6: Generate and index dense embeddings.
        if self.dense_retriever is not None:
            self.dense_retriever.index_chunks(
                chunks=all_chunks,
                metadata=all_metadata
            )

        # Step 7: Persist embeddings and metadata in ChromaDB.
        if self.vector_store is not None:
            embeddings = (
                self.dense_retriever.chunk_embeddings.tolist()
            )

            self.vector_store.add_chunks(
                chunks=all_chunks,
                embeddings=embeddings,
                metadata=all_metadata
            )

        # Step 8: Update stored collections.
        self.document_chunks = all_chunks
        self.chunk_metadata = all_metadata

        return {
            "filename": filename,
            "document_id": document_id,
            "chunk_count": len(chunks),
            "total_indexed_chunks": len(self.document_chunks),
            "metadata": metadata,
            "persistent_storage": self.vector_store is not None,
            "status": "success"
        }
