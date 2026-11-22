import logging
import math

from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.api.routes.auth import require_roles
from app.api.dependencies.rag import get_rag_services
from app.schemas.chat import ChatAskRequest, ChatAskResponse, ChatSource


logger = logging.getLogger(__name__)
router = APIRouter(prefix="/chat", tags=["Academic Assistant"])


@router.post("/ask", response_model=ChatAskResponse)
def ask_question(
    payload: ChatAskRequest,
    request: Request,
    _student=Depends(require_roles("student")),
) -> ChatAskResponse:
    services = get_rag_services(request)
    try:
        result = services.rag_pipeline.answer_question(
            query=payload.question
        )
    except Exception:
        logger.exception("Academic assistant request failed.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The academic assistant is temporarily unavailable.",
        ) from None

    retrieval = result.get("retrieval", {})
    attempts = retrieval.get("attempt_history", [])
    if (
        not result.get("context_used", False)
        and attempts
        and any(attempt.get("status") == "error" for attempt in attempts)
    ):
        logger.error("An academic retrieval strategy failed without context.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Academic document retrieval is temporarily unavailable.",
        )

    sources = []
    for source in result.get("sources", []):
        filename = source.get("filename")
        relevance = source.get("rerank_score")
        if (
            not isinstance(filename, str)
            or not filename.strip()
            or isinstance(relevance, bool)
            or not isinstance(relevance, (int, float))
            or not math.isfinite(relevance)
        ):
            continue

        sources.append(
            ChatSource(
                title=filename,
                category="Academic Document",
                relevance=round(max(0.0, min(float(relevance), 1.0)) * 100, 2),
            )
        )

    return ChatAskResponse(
        answer=result["answer"],
        sources=sources,
        context_used=bool(result.get("context_used", False)),
    )
