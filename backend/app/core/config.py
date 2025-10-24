from typing import Any, List

from pydantic import PostgresDsn, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Application Settings
    APP_NAME: str = "HNG Vibes API"
    APP_VERSION: str = "0.1.0"
    APP_DESCRIPTION: str = (
        "Community music discovery platform that curates Spotify links from Slack"
    )
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:3000"
    ALLOWED_ORIGINS: List[str] | str = ["http://localhost:3000"]

    # JWT Settings
    SECRET_KEY: str = "change-this-secret-key"

    # Database Settings
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "hng_user"
    POSTGRES_PASSWORD: str = "hng_password"
    POSTGRES_DB: str = "hng_vibes"
    POSTGRES_PORT: int = 5432

    DATABASE_URL: str = ""
    SYNC_DATABASE_URL: str = ""

    # Redis Settings
    REDIS_URL: str = "redis://localhost:6379/0"

    # Spotify Settings
    SPOTIPY_CLIENT_ID: str = ""
    SPOTIPY_CLIENT_SECRET: str = ""

    # Slack Settings
    SLACK_BOT_TOKEN: str = ""
    SLACK_SIGNING_SECRET: str = ""
    SLACK_APP_TOKEN: str = ""
    SLACK_MUSIC_CHANNEL_ID: str = ""

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: str | List[str]) -> List[str] | str:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: str | None, info) -> Any:
        if isinstance(v, str) and v:
            return v

        values = info.data
        return str(
            PostgresDsn.build(
                scheme="postgresql+asyncpg",
                username=values.get("POSTGRES_USER"),
                password=values.get("POSTGRES_PASSWORD"),
                host=values.get("POSTGRES_SERVER"),
                port=values.get("POSTGRES_PORT"),
                path=f"{values.get('POSTGRES_DB') or ''}",
            )
        )

    @field_validator("SYNC_DATABASE_URL", mode="before")
    @classmethod
    def assemble_sync_db_connection(cls, v: str | None, info) -> Any:
        if isinstance(v, str) and v:
            return v

        values = info.data
        return (
            f"postgresql://{values.get('POSTGRES_USER')}:{values.get('POSTGRES_PASSWORD')}"
            f"@{values.get('POSTGRES_SERVER')}:{values.get('POSTGRES_PORT')}"
            f"/{values.get('POSTGRES_DB')}"
        )

    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT == "development"

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"


settings = Settings()
