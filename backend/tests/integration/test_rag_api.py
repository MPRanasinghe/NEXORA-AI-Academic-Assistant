from types import SimpleNamespace

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import settings
from app.core.security import create_access_token
from app.database.connection import Base, get_db
from app.main import app
from app.models import Document, User
from app.services.pdf_service import PDFService


@pytest.fixture
def api_environment():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    test_session = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )

    def override_get_db():
        db = test_session()
        try:
            yield db
        finally:
            db.close()

    previous_overrides = app.dependency_overrides.copy()
    app.dependency_overrides[get_db] = override_get_db
    missing_state = object()
    previous_rag_services = getattr(app.state, "rag_services", missing_state)
    app.state.rag_services = None

    db = test_session()
    users = {}
    for role in ("student", "academic_staff", "administrator"):
        user = User(
            full_name=f"Test {role}",
            email=f"{role}@example.test",
            hashed_password="unused-in-this-test",
            role=role,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        users[role] = {
            "id": user.id,
            "token": create_access_token(user.id),
        }
    db.close()

    client = TestClient(app)
    try:
        yield client, users, test_session
    finally:
        client.close()
        app.dependency_overrides.clear()
        app.dependency_overrides.update(previous_overrides)
        if previous_rag_services is missing_state:
            delattr(app.state, "rag_services")
        else:
            app.state.rag_services = previous_rag_services
        engine.dispose()


class StubRAGPipeline:
    def __init__(self, result):
        self.result = result
        self.questions = []

    def answer_question(self, query):
        self.questions.append(query)
        return self.result


def install_pipeline(result):
    pipeline = StubRAGPipeline(result)
    app.state.rag_services = SimpleNamespace(rag_pipeline=pipeline)
    return pipeline


def test_chat_requires_a_student_token_and_rejects_other_roles(api_environment):
    client, users, _ = api_environment

    missing = client.post("/api/v1/chat/ask", json={"question": "What is AI?"})
    forbidden = client.post(
        "/api/v1/chat/ask",
        headers={
            "Authorization": f"Bearer {users['academic_staff']['token']}"
        },
        json={"question": "What is AI?"},
    )

    assert missing.status_code == 401
    assert forbidden.status_code == 403


def test_chat_rejects_empty_question(api_environment):
    client, users, _ = api_environment

    response = client.post(
        "/api/v1/chat/ask",
        headers={"Authorization": f"Bearer {users['student']['token']}"},
        json={"question": "   "},
    )

    assert response.status_code == 422


def test_chat_reports_unavailable_rag_service(api_environment):
    client, users, _ = api_environment

    response = client.post(
        "/api/v1/chat/ask",
        headers={"Authorization": f"Bearer {users['student']['token']}"},
        json={"question": "What is machine learning?"},
    )

    assert response.status_code == 503
    assert response.json()["detail"] == (
        "The academic assistant is currently unavailable."
    )


def test_chat_returns_grounded_answer_and_normalized_document_sources(
    api_environment,
):
    client, users, _ = api_environment
    pipeline = install_pipeline(
        {
            "answer": "Machine learning finds patterns in data. [Source 1]",
            "sources": [
                {"filename": "ML Lecture.pdf", "rerank_score": 0.873},
                {"filename": "Missing score.pdf", "rerank_score": None},
            ],
            "context_used": True,
        }
    )

    response = client.post(
        "/api/v1/chat/ask",
        headers={"Authorization": f"Bearer {users['student']['token']}"},
        json={"question": "  What is machine learning?  "},
    )

    assert response.status_code == 200
    assert pipeline.questions == ["What is machine learning?"]
    assert response.json() == {
        "answer": "Machine learning finds patterns in data. [Source 1]",
        "sources": [
            {
                "title": "ML Lecture.pdf",
                "category": "Academic Document",
                "relevance": 87.3,
            }
        ],
        "context_used": True,
    }


def test_chat_preserves_the_no_context_answer(api_environment):
    client, users, _ = api_environment
    install_pipeline(
        {
            "answer": (
                "I couldn't find sufficient relevant information in the "
                "available academic documents to answer your question."
            ),
            "sources": [],
            "context_used": False,
            "retrieval": {
                "attempt_history": [
                    {"strategy": "hybrid", "status": "insufficient"}
                ]
            },
        }
    )

    response = client.post(
        "/api/v1/chat/ask",
        headers={"Authorization": f"Bearer {users['student']['token']}"},
        json={"question": "What is an unrelated topic?"},
    )

    assert response.status_code == 200
    assert response.json()["context_used"] is False
    assert response.json()["sources"] == []
    assert "couldn't find sufficient relevant information" in (
        response.json()["answer"]
    )


def test_chat_hides_rag_failures_from_the_client(api_environment):
    client, users, _ = api_environment

    class FailedPipeline:
        def answer_question(self, query):
            raise RuntimeError("internal provider details")

    app.state.rag_services = SimpleNamespace(rag_pipeline=FailedPipeline())
    response = client.post(
        "/api/v1/chat/ask",
        headers={"Authorization": f"Bearer {users['student']['token']}"},
        json={"question": "What is machine learning?"},
    )

    assert response.status_code == 503
    assert "internal provider details" not in response.text


def test_staff_pdf_upload_extracts_and_indexes_document(
    api_environment,
    monkeypatch,
    tmp_path,
):
    client, users, test_session = api_environment
    monkeypatch.setattr(settings, "upload_directory", str(tmp_path))
    monkeypatch.setattr(
        PDFService,
        "extract_text",
        staticmethod(
            lambda _path: {
                "text": "Database systems organize structured information.",
                "page_count": 1,
                "character_count": 49,
            }
        ),
    )

    class StubIngestionPipeline:
        def __init__(self):
            self.ingested = []

        def ingest_document(self, **kwargs):
            self.ingested.append(kwargs)
            return {
                "status": "success",
                "chunk_count": 1,
                "total_indexed_chunks": 4,
            }

    ingestion_pipeline = StubIngestionPipeline()
    app.state.rag_services = SimpleNamespace(
        ingestion_pipeline=ingestion_pipeline
    )
    response = client.post(
        "/api/v1/documents/upload",
        headers={
            "Authorization": f"Bearer {users['academic_staff']['token']}"
        },
        files={"file": ("Database.pdf", b"%PDF-1.4 test", "application/pdf")},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "processed"
    assert payload["ingestion"] == {
        "chunk_count": 1,
        "total_indexed_chunks": 4,
        "status": "success",
    }
    assert ingestion_pipeline.ingested[0]["text"].startswith("Database")
    assert ingestion_pipeline.ingested[0]["filename"] == "Database.pdf"
    assert ingestion_pipeline.ingested[0]["document_id"] == payload["document_id"]
    assert (tmp_path / payload["stored_filename"]).exists()

    db = test_session()
    try:
        document = db.query(Document).filter_by(id=payload["document_id"]).one()
        assert document.status == "processed"
        assert document.filename == "Database.pdf"
    finally:
        db.close()


def test_failed_pdf_ingestion_is_not_reported_as_success(
    api_environment,
    monkeypatch,
    tmp_path,
):
    client, users, test_session = api_environment
    monkeypatch.setattr(settings, "upload_directory", str(tmp_path))
    monkeypatch.setattr(
        PDFService,
        "extract_text",
        staticmethod(
            lambda _path: {
                "text": "Document text that cannot be indexed.",
                "page_count": 1,
                "character_count": 37,
            }
        ),
    )

    class FailedIngestionPipeline:
        def ingest_document(self, **kwargs):
            raise RuntimeError("internal embedding failure")

    app.state.rag_services = SimpleNamespace(
        ingestion_pipeline=FailedIngestionPipeline()
    )
    response = client.post(
        "/api/v1/documents/upload",
        headers={
            "Authorization": f"Bearer {users['academic_staff']['token']}"
        },
        files={"file": ("Unindexed.pdf", b"%PDF-1.4 test", "application/pdf")},
    )

    assert response.status_code == 500
    assert "internal embedding failure" not in response.text

    db = test_session()
    try:
        document = db.query(Document).filter_by(filename="Unindexed.pdf").one()
        assert document.status == "ingestion_failed"
    finally:
        db.close()


def test_student_cannot_upload_through_staff_endpoint(api_environment):
    client, users, _ = api_environment

    response = client.post(
        "/api/v1/documents/upload",
        headers={"Authorization": f"Bearer {users['student']['token']}"},
        files={"file": ("Database.pdf", b"%PDF-1.4 test", "application/pdf")},
    )

    assert response.status_code == 403
