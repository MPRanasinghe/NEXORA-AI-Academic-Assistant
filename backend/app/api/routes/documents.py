import logging
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from sqlalchemy.orm import Session

from app.api.dependencies.rag import get_rag_services
from app.database.connection import get_db
from app.api.routes.auth import require_roles
from app.core.config import settings
from app.repositories.document_repository import DocumentRepository

from app.services.pdf_service import PDFService


logger = logging.getLogger(__name__)
router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload")
async def upload_document(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _user=Depends(require_roles("academic_staff", "administrator")),
):
    # Validate file extension
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    # Read file contents
    content = await file.read()

    # Validate PDF signature
    if not content.startswith(b"%PDF-"):
        raise HTTPException(
            status_code=400,
            detail="Invalid PDF file."
        )

    services = get_rag_services(request)

    # Generate a unique filename
    stored_filename = f"{uuid4().hex}.pdf"
    upload_directory = Path(settings.upload_directory)
    upload_directory.mkdir(parents=True, exist_ok=True)
    file_path = upload_directory / stored_filename

    # Save file locally
    file_path.write_bytes(content)

    # Save document metadata to database
    document = DocumentRepository.create(
        db=db,
        filename=file.filename,
        file_path=str(file_path)
    )

    try:
        extracted_data = PDFService.extract_text(str(file_path))
        ingestion_result = services.ingestion_pipeline.ingest_document(
            text=extracted_data["text"],
            filename=document.filename,
            document_id=document.id,
        )
        if ingestion_result.get("status") != "success":
            raise RuntimeError("The ingestion pipeline did not complete.")
    except Exception:
        logger.exception(
            "PDF extraction or indexing failed for document %s.",
            document.id,
        )
        db.rollback()
        failed_document = DocumentRepository.get_by_id(
            db=db,
            document_id=document.id,
        )
        if failed_document is not None:
            failed_document.status = "ingestion_failed"
            db.commit()
        raise HTTPException(
            status_code=500,
            detail="The PDF was saved, but text extraction or indexing failed.",
        ) from None

    document.status = "processed"
    db.commit()
    db.refresh(document)

    return {
        "message": "Document uploaded and indexed successfully.",
        "document_id": document.id,
        "filename": document.filename,
        "stored_filename": stored_filename,
        "status": document.status,
        "extraction": {
            "page_count": extracted_data["page_count"],
            "character_count": extracted_data["character_count"],
        },
        "ingestion": {
            "chunk_count": ingestion_result["chunk_count"],
            "total_indexed_chunks": ingestion_result[
                "total_indexed_chunks"
            ],
            "status": ingestion_result["status"],
        },
    }


@router.get("/")
def get_all_documents(
    db: Session = Depends(get_db),
    _user=Depends(require_roles("academic_staff", "administrator")),
):
    documents = DocumentRepository.get_all(db=db)

    return [
        {
            "id": document.id,
            "filename": document.filename,
            "uploaded_at": document.uploaded_at,
            "status": document.status
        }
        for document in documents
    ]

@router.get("/{document_id}")
def get_document_by_id(
    document_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_roles("academic_staff", "administrator")),
):
    document = DocumentRepository.get_by_id(
        db=db,
        document_id=document_id
    )

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    return {
        "id": document.id,
        "filename": document.filename,
        "uploaded_at": document.uploaded_at,
        "status": document.status
    }

@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_roles("administrator")),
):
    document = DocumentRepository.get_by_id(
        db=db,
        document_id=document_id
    )

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    file_path = Path(document.file_path)

    if file_path.exists():
        file_path.unlink()

    DocumentRepository.delete(
        db=db,
        document_id=document_id
    )

    return {
        "message": "Document deleted successfully.",
        "document_id": document_id
    }