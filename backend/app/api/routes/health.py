from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models import Document

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "application": "NEXORA AI Academic Assistant"
    }


@router.get("/health/database")
async def database_health(db: Session = Depends(get_db)):
    document_count = db.query(Document).count()

    return {
        "status": "connected",
        "database": "SQLite",
        "documents_table": "available",
        "document_count": document_count
    }