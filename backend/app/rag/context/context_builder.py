
from typing import List, Dict, Any, Optional


class ContextBuilder:
    """
    Build structured context from retrieved and reranked
    academic document chunks.
    """

    def __init__(self, max_context_chars: int = 12000):
        if (
            isinstance(max_context_chars, bool)
            or not isinstance(max_context_chars, int)
            or max_context_chars <= 0
        ):
            raise ValueError(
                "max_context_chars must be a positive integer."
            )

        self.max_context_chars = max_context_chars

    def build_context(
        self,
        query: str,
        retrieved_chunks: List[Dict[str, Any]],
        top_k: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Select and combine relevant chunks into context.

        Each chunk may contain:
        - chunk: Text content
        - filename: Source document name
        - document_id: Database document ID
        - rerank_score: Reranking relevance score
        - original_rank: Original retrieval position
        """

        if not isinstance(query, str) or not query.strip():
            raise ValueError("Query cannot be empty.")

        if not isinstance(retrieved_chunks, list):
            raise TypeError("Retrieved chunks must be a list.")

        if top_k is not None:
            if (
                isinstance(top_k, bool)
                or not isinstance(top_k, int)
                or top_k <= 0
            ):
                raise ValueError("top_k must be a positive integer.")

        # Keep only candidates containing valid text.
        valid_chunks = [
            item for item in retrieved_chunks
            if (
                isinstance(item, dict)
                and isinstance(item.get("chunk"), str)
                and item["chunk"].strip()
            )
        ]

        # Sort by reranking score when available.
        valid_chunks.sort(
            key=lambda item: item.get("rerank_score", 0.0),
            reverse=True
        )

        # Select the most relevant chunks.
        if top_k is not None:
            valid_chunks = valid_chunks[:top_k]

        context_parts = []
        sources = []
        used_chars = 0

        # Build context while respecting the size limit.
        for index, item in enumerate(valid_chunks, start=1):

            chunk_text = item["chunk"].strip()

            filename = item.get(
                "filename",
                "Unknown document"
            )

            document_id = item.get("document_id")

            source_header = f"[Source {index}: {filename}]"

            formatted_chunk = (
                f"{source_header}\n{chunk_text}"
            )

            separator = "\n\n" if context_parts else ""
            required_chars = len(separator) + len(formatted_chunk)

            remaining_chars = (
                self.max_context_chars - used_chars
            )

            if required_chars > remaining_chars:
                # Include a partial chunk if some space remains.
                available_chars = remaining_chars - len(separator)

                if available_chars > len(source_header) + 1:
                    partial_text_length = (
                        available_chars - len(source_header) - 1
                    )

                    formatted_chunk = (
                        f"{source_header}\n"
                        f"{chunk_text[:partial_text_length]}"
                    )

                    context_parts.append(
                        separator + formatted_chunk
                    )

                    used_chars += (
                        len(separator) + len(formatted_chunk)
                    )

                    sources.append({
                        "source": index,
                        "filename": filename,
                        "document_id": document_id,
                        "rerank_score": item.get("rerank_score"),
                        "truncated": True
                    })

                break

            context_parts.append(separator + formatted_chunk)
            used_chars += required_chars

            sources.append({
                "source": index,
                "filename": filename,
                "document_id": document_id,
                "rerank_score": item.get("rerank_score"),
                "truncated": False
            })

        return {
            "query": query,
            "context": "".join(context_parts),
            "sources": sources,
            "chunk_count": len(sources),
            "context_char_count": used_chars
        }
