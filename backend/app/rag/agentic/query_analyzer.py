
from typing import Dict, Any


def analyze_query(query: str) -> Dict[str, Any]:
    """
    Analyze a user's query and identify its characteristics.

    Returns information about the query type and
    recommended retrieval strategy.
    """

    if not isinstance(query, str):
        raise TypeError("Query must be a string.")

    if not query.strip():
        raise ValueError("Query cannot be empty.")

    normalized_query = query.lower().strip()

    # Identify whether the query asks for a comparison.
    comparison_keywords = [
        "compare",
        "difference",
        "differences",
        "versus",
        "vs"
    ]

    is_comparison = any(
        keyword in normalized_query
        for keyword in comparison_keywords
    )

    # Identify whether the query asks for a definition.
    definition_keywords = [
        "what is",
        "what are",
        "define",
        "definition of"
    ]

    is_definition = any(
        keyword in normalized_query
        for keyword in definition_keywords
    )

    # Identify whether the query asks for an explanation.
    explanation_keywords = [
        "explain",
        "how does",
        "how do",
        "describe",
        "why"
    ]

    is_explanation = any(
        keyword in normalized_query
        for keyword in explanation_keywords
    )

    # Identify whether the query contains technical identifiers.
    has_technical_identifier = any(
        character.isdigit() for character in query
    ) or "_" in query

    # Determine the query type.
    if is_comparison:
        query_type = "comparison"
    elif is_definition:
        query_type = "definition"
    elif is_explanation:
        query_type = "explanation"
    else:
        query_type = "general"

    return {
        "original_query": query,
        "normalized_query": normalized_query,
        "query_type": query_type,
        "is_comparison": is_comparison,
        "is_definition": is_definition,
        "is_explanation": is_explanation,
        "has_technical_identifier": has_technical_identifier
    }
