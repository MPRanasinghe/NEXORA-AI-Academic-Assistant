
from typing import List, Dict, Any


def evaluate_retrieval(
    results: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Evaluate retrieved results to determine whether
    they are suitable for further processing.
    """

    if not isinstance(results, list):
        raise TypeError("Results must be a list.")

    # Check whether retrieval returned any results.
    if not results:
        return {
            "is_sufficient": False,
            "reason": "No results were retrieved.",
            "result_count": 0
        }

    # Check whether all results contain valid text.
    valid_results = [
        result for result in results
        if isinstance(result, dict)
        and isinstance(result.get("chunk"), str)
        and result["chunk"].strip()
    ]

    if not valid_results:
        return {
            "is_sufficient": False,
            "reason": "No valid text chunks were found.",
            "result_count": 0
        }

    # Identify duplicate chunks.
    unique_chunks = {
        result["chunk"].strip()
        for result in valid_results
    }

    if len(unique_chunks) < len(valid_results):
        return {
            "is_sufficient": False,
            "reason": "Duplicate chunks were detected.",
            "result_count": len(valid_results)
        }

    # Retrieval passed basic validation.
    return {
        "is_sufficient": True,
        "reason": "Retrieved results passed basic validation.",
        "result_count": len(valid_results)
    }
