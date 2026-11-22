from jose import jwt
from datetime import datetime, timedelta, timezone
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.connection import Base, get_db
from app.models import User
from app.core.config import settings


engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_password_hashing():
    from app.core.security import hash_password, verify_password

    hashed = hash_password("SecurePass123")
    assert verify_password("SecurePass123", hashed)
    assert not verify_password("WrongPass123", hashed)

    expired_token = jwt.encode(
        {
            "sub": "1",
            "exp": datetime.now(timezone.utc) - timedelta(minutes=1),
        },
        settings.secret_key,
        algorithm="HS256",
    )
    expired = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {expired_token}"},
    )
    assert expired.status_code == 401


def test_registration_duplicate_login_me_and_role_restriction():
    staff_self_registration = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Unauthorized Staff",
            "email": "staff@example.com",
            "password": "SecurePass123",
            "role": "academic_staff",
        },
    )
    assert staff_self_registration.status_code == 403

    administrator_self_registration = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Unauthorized Admin",
            "email": "admin@example.com",
            "password": "SecurePass123",
            "role": "administrator",
        },
    )
    assert administrator_self_registration.status_code == 403

    registration = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Test Student",
            "email": "Student@Example.com",
            "password": "SecurePass123",
            "role": "student",
        },
    )
    assert registration.status_code == 201
    registered = registration.json()
    assert registered["role"] == "student"
    assert "hashed_password" not in registered
    assert "password" not in registered

    duplicate_role_escalation = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Changed Existing Student",
            "email": "student@example.com",
            "password": "DifferentPass123",
            "role": "academic_staff",
        },
    )
    assert duplicate_role_escalation.status_code == 403

    db = TestingSessionLocal()
    existing_student = db.query(User).filter_by(
        email="student@example.com"
    ).one()
    assert existing_student.full_name == "Test Student"
    assert existing_student.role == "student"
    assert db.query(User).filter_by(email="staff@example.com").first() is None
    assert db.query(User).filter_by(email="admin@example.com").first() is None
    db.close()

    duplicate = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Other Student",
            "email": "student@example.com",
            "password": "SecurePass123",
        },
    )
    assert duplicate.status_code == 409

    wrong = client.post(
        "/api/v1/auth/login",
        json={"email": "student@example.com", "password": "WrongPass123"},
    )
    assert wrong.status_code == 401

    login = client.post(
        "/api/v1/auth/login",
        json={"email": "STUDENT@EXAMPLE.COM", "password": "SecurePass123"},
    )
    assert login.status_code == 200
    token = login.json()["access_token"]

    me = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me.status_code == 200
    assert me.json()["email"] == "student@example.com"

    forbidden_upload = client.post(
        "/api/v1/documents/upload",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("sample.pdf", b"%PDF-1.4", "application/pdf")},
    )
    assert forbidden_upload.status_code == 403

    invalid = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer invalid.token.value"},
    )
    assert invalid.status_code == 401


def test_inactive_account_rejected():
    db = TestingSessionLocal()
    user = db.query(User).filter(User.email == "student@example.com").first()
    user.is_active = False
    db.commit()
    db.close()

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "student@example.com", "password": "SecurePass123"},
    )
    assert response.status_code == 403
