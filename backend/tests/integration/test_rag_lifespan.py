from fastapi.testclient import TestClient
from sqlalchemy import create_engine

from app import main
from app.database.connection import Base


class StubRAGServices:
    def __init__(self):
        self.close_calls = 0

    def close(self):
        self.close_calls += 1


def test_lifespan_initializes_and_closes_shared_rag_services(monkeypatch):
    engine = create_engine("sqlite://")
    services = StubRAGServices()
    monkeypatch.setattr(main, "engine", engine)
    monkeypatch.setattr(
        main,
        "build_rag_services",
        lambda _settings: services,
    )

    with TestClient(main.app):
        assert main.app.state.rag_services is services

    assert services.close_calls == 1
    assert main.app.state.rag_services is None
    engine.dispose()
