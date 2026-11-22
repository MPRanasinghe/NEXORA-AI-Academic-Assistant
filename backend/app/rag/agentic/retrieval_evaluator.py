
from typing import List, Dict, Any, Optional
import math


def evaluate_retrieval(
    results: List[Dict[str, Any]],
    min_score: Optional[float] = None
) -> Dict[str, Any]:
    """
    Evaluate retrieval results using structural validation,
    duplicate detection, and optional score threshold checking.

    Args:
        results: Retrieved chunks and their scores.
        min_score: Optional minimum score threshold.
                  Score checking is disabled by default.

    Returns:
        Evaluation information indicating whether results
        are sufficient for further processing.
    """

    if not isinstance(results, list):
        raise TypeError("Results must be a list.")

    if min_score is not None:
        if (
            isinstance(min_score, bool)
            or not isinstance(min_score, (int, float))
            or not math.isfinite(min_score)
        ):
            raise ValueError("min_score must be a finite number.")

    # 1. Check whether any results were retrieved.
    if not results:
        return {
            "is_sufficient": False,
            "reason": "No results were retrieved.",
            "result_count": 0,
            "valid_count": 0,
            "duplicate_count": 0
        }

    # 2. Validate the structure and content of every result.
    valid_results = []

    for result in results:
        if not isinstance(result, dict):
            continue

        chunk = result.get("chunk")

        if not isinstance(chunk, str) or not chunk.strip():
            continue

        valid_results.append(result)

    if not valid_results:
        return {
            "is_sufficient": False,
            "reason": "No valid text chunks were found.",
            "result_count": len(results),
            "valid_count": 0,
            "duplicate_count": 0
        }

    # 3. Detect duplicate chunks.
    normalized_chunks = [
        " ".join(result["chunk"].lower().split())
        for result in valid_results
    ]

    unique_chunks = set(normalized_chunks)

    duplicate_count = len(normalized_chunks) - len(unique_chunks)

    if duplicate_count > 0:
        return {
            "is_sufficient": False,
            "reason": "Duplicate chunks were detected.",
            "result_count": len(results),
            "valid_count": len(valid_results),
            "duplicate_count": duplicate_count
        }

    # 4. Optionally check retrieval scores.
    if min_score is not None:

        scores = []

        for result in valid_results:
            score = result.get("score")

            if (
                isinstance(score, bool)
                or not isinstance(score, (int, float))
                or not math.isfinite(score)
            ):
                return {
                    "is_sufficient": False,
                    "reason": "Missing or invalid retrieval scores.",
                    "result_count": len(results),
                    "valid_count": len(valid_results),
                    "duplicate_count": 0
                }

            scores.append(score)

        if any(score < min_score for score in scores):
            return {
                "is_sufficient": False,
            "reason": "Retrieval scores are below the minimum threshold.",
            "result_count": len(results),
            "valid_count": len(valid_results),
            "duplicate_count": 0,
            "minimum_score": min(scores),
            "score_threshold": min_score
            }

    # 5. Results passed all enabled checks.
    return {
        "is_sufficient": True,
        "reason": "Retrieved results passed evaluation.",
        "result_count": len(results),
        "valid_count": len(valid_results),
        "duplicate_count": 0
    }
