
import hashlib
from typing import List, Dict, Any

import chromadb


class ChromaVectorStore:
    """
    Manage persistent academic document embeddings
    and metadata using ChromaDB.
    """

    def __init__(
        self,
        persist_directory: str = "./data/chroma",
        collection_name: str = "nexora_academic_chunks"
    ):
        if not isinstance(persist_directory, str) or not persist_directory.strip():
            raise ValueError("Persist directory cannot be empty.")

        if not isinstance(collection_name, str) or not collection_name.strip():
            raise ValueError("Collection name cannot be empty.")

        # Create a persistent ChromaDB client.
        self.client = chromadb.PersistentClient(
            path=persist_directory
        )

        # Create or retrieve the academic document collection.
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"}
        )

    @staticmethod
    def _generate_id(
        chunk: str,
        metadata: Dict[str, Any]
    ) -> str:
        """
        Generate a deterministic unique ID for each chunk.
        """

        identity = (
            f"{metadata.get('document_id', 'unknown')}:"
            f"{metadata.get('filename', 'unknown')}:"
            f"{metadata.get('chunk_index', 0)}:"
            f"{chunk}"
        )

        return hashlib.sha256(
            identity.encode("utf-8")
        ).hexdigest()

    def add_chunks(
        self,
        chunks: List[str],
        embeddings: List[List[float]],
        metadata: List[Dict[str, Any]]
    ) -> None:
        """
        Store document chunks, embeddings and metadata.
        """

        if not chunks:
            raise ValueError("Chunks cannot be empty.")

        if len(chunks) != len(embeddings) or len(chunks) != len(metadata):
            raise ValueError(
                "Chunks, embeddings and metadata counts must match."
            )

        if not all(isinstance(chunk, str) and chunk.strip() for chunk in chunks):
            raise ValueError("All chunks must be non-empty strings.")

        if not all(isinstance(item, dict) for item in metadata):
            raise TypeError("Metadata entries must be dictionaries.")

        ids = []
        clean_metadata = []

        for chunk, item in zip(chunks, metadata):

            # ChromaDB metadata supports scalar values,
            # so omit optional values such as None.
            stored_metadata = {
                key: value
                for key, value in item.items()
                if value is not None
                and isinstance(value, (str, int, float, bool))
            }

            ids.append(self._generate_id(chunk, item))
            clean_metadata.append(stored_metadata)

        # Upsert inserts new chunks or updates existing ones.
        self.collection.upsert(
            ids=ids,
            documents=chunks,
            embeddings=embeddings,
            metadatas=clean_metadata
        )

    def search(
        self,
        query_embedding: List[float],
        top_k: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Search for similar academic document chunks.
        """

        if not query_embedding:
            raise ValueError("Query embedding cannot be empty.")

        if (
            isinstance(top_k, bool)
            or not isinstance(top_k, int)
            or top_k <= 0
        ):
            raise ValueError("top_k must be a positive integer.")

        if self.collection.count() == 0:
            return []

        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=min(top_k, self.collection.count()),
            include=[
                "documents",
                "metadatas",
                "distances"
            ]
        )

        retrieved_chunks = []

        for index, chunk in enumerate(results["documents"][0]):

            metadata = results["metadatas"][0][index] or {}
            distance = results["distances"][0][index]

            retrieved_chunks.append({
                "chunk": chunk,
                "score": float(1.0 - distance),
                "distance": float(distance),
                **metadata
            })

        return retrieved_chunks

    def count(self) -> int:
        """Return the number of stored document chunks."""

        return self.collection.count()
