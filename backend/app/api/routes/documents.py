from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.repositories.document_repository import DocumentRepository

from app.services.pdf_service import PDFService


router = APIRouter(prefix="/documents", tags=["Documents"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
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

    # Generate a unique filename
    stored_filename = f"{uuid4().hex}.pdf"
    file_path = UPLOAD_DIR / stored_filename

    # Save file locally
    file_path.write_bytes(content)

    # Save document metadata to database
    document = DocumentRepository.create(
        db=db,
        filename=file.filename,
        file_path=str(file_path)
    )

    # Extract text from the uploaded PDF
    extracted_data = PDFService.extract_text(str(file_path))

    return {
    "message": "Document uploaded and processed successfully",
    "document_id": document.id,
    "filename": document.filename,
    "stored_filename": stored_filename,
    "status": document.status,
    "extraction": {
        "page_count": extracted_data["page_count"],
        "character_count": extracted_data["character_count"]
    }
}

@router.get("/")
def get_all_documents(
    db: Session = Depends(get_db)
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
    db: Session = Depends(get_db)
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
    db: Session = Depends(get_db)
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