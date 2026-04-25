from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "EcoRuta API"
    app_version: str = "0.1.0"

    db_host: str = "db"
    db_port: int = 5432
    db_name: str = "ecoruta"
    db_user: str = "ecoruta"
    db_password: str = "cambia_esto"

    telegram_bot_token: str | None = None
    ors_api_key: str | None = None

    ciudadano_token: str = "ciudadano-dev-token"
    reciclador_token: str = "reciclador-dev-token"
    admin_token: str = "admin-dev-token"

    cors_origins: list[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
