from sqlalchemy.orm import Session

from app.models import AcademicResource


class AcademicResourceRepository:

    @staticmethod
    def create(
        db: Session,
        course_id: int,
        document_id: int,
        uploaded_by: int,
        title: str,
        resource_type: str = "lecture_note",
        description: str | None = None
    ) -> AcademicResource:

        resource = AcademicResource(
            course_id=course_id,
            document_id=document_id,
            uploaded_by=uploaded_by,
            title=title.strip(),
            resource_type=resource_type,
            description=description
        )

        db.add(resource)
        db.commit()
        db.refresh(resource)

        return resource

    @staticmethod
    def get_by_id(
        db: Session,
        resource_id: int
    ) -> AcademicResource | None:

        return db.query(AcademicResource).filter(
            AcademicResource.id == resource_id
        ).first()

    @staticmethod
    def get_by_course(
        db: Session,
        course_id: int
    ) -> list[AcademicResource]:

        return db.query(AcademicResource).filter(
            AcademicResource.course_id == course_id
        ).order_by(AcademicResource.created_at.desc()).all()

    @staticmethod
    def get_all(db: Session) -> list[AcademicResource]:

        return db.query(AcademicResource).order_by(
            AcademicResource.created_at.desc()
        ).all()

    @staticmethod
    def delete(
        db: Session,
        resource_id: int
    ) -> bool:

        resource = AcademicResourceRepository.get_by_id(db, resource_id)

        if resource is None:
            return False

        db.delete(resource)
        db.commit()

        return True