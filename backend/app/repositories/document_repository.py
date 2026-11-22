
from sqlalchemy.orm import Session

from app.models import Document


class DocumentRepository:

    @staticmethod
    def create(db: Session, filename: str, file_path: str) -> Document:
        document = Document(
            filename=filename,
            file_path=file_path
        )

        db.add(document)
        db.commit()
        db.refresh(document)

        return document

    @staticmethod
    def get_by_id(db: Session, document_id: int) -> Document | None:
        return (
            db.query(Document)
            .filter(Document.id == document_id)
            .first()
        )

    @staticmethod
    def get_all(db: Session) -> list[Document]:
        return db.query(Document).all()

    @staticmethod
    def count(db: Session) -> int:
        return db.query(Document).count()

    @staticmethod
    def delete(db: Session, document_id: int) -> bool:
        document = DocumentRepository.get_by_id(
            db=db,
            document_id=document_id
        )

        if document is None:
            return False

        db.delete(document)
        db.commit()

        return True

@staticmethod
def delete(db: Session, document_id: int) -> bool:
    document = DocumentRepository.get_by_id(
        db=db,
        document_id=document_id
    )

    if document is None:
        return False

    db.delete(document)
    db.commit()

    return True