from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    app_name: str = "NEXORA AI Academic Assistant"
    app_env: str = "development"
    debug: bool = True
    api_v1_prefix: str = "/api/v1"

    database_url: str = "sqlite:///./nexora.db"

    gemini_api_key: str = ""
    gemini_model: str = ""

    embedding_model: str = ""

    chroma_persist_directory: str = "./storage/chroma"

    upload_directory: str = "./storage/uploads"
    export_directory: str = "./storage/exports"

    top_k: int = 5
    max_agent_iterations: int = 3

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )


settings = Settings()