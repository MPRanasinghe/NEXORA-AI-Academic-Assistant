from fastapi import HTTPException, Request, status

from app.rag.services import RAGServices


def get_rag_services(request: Request) -> RAGServices:
    services = getattr(request.app.state, "rag_services", None)
    if services is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The academic assistant is currently unavailable.",
        )
    return services
