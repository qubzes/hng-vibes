from contextlib import asynccontextmanager
from typing import AsyncGenerator, Callable

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.api import api_router
from app.core.config import settings
from app.core.database import engine
from app.core.logging import logger
from app.core.redis import redis_client
from app.core.response import ResponseException, respond


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncGenerator[None, None]:
    """Manage application startup and shutdown."""
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        logger.info("Database connection established")

        redis_client.ping()
        logger.info("Redis connection established")

        logger.info(f"{settings.APP_NAME} v{settings.APP_VERSION} started successfully")
        yield

    except Exception as e:
        logger.error(f"Startup failed: {e}")
        raise

    finally:
        try:
            await engine.dispose()
            logger.info("Database connection closed")
        except Exception as e:
            logger.error(f"Error closing database connection: {e}")

        try:
            redis_client.close()
            logger.info("Redis connection closed")
        except Exception as e:
            logger.error(f"Error closing Redis connection: {e}")

        logger.info(f"{settings.APP_NAME} shutdown complete")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=settings.APP_DESCRIPTION,
    openapi_url="/openapi.json" if settings.is_development else None,
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
    lifespan=lifespan,
)


@app.middleware("http")
async def global_exception_handler(
    request: Request, call_next: Callable
) -> JSONResponse:
    """Global middleware for exception handling."""
    try:
        return await call_next(request)
    except ResponseException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in {request.method} {request.url.path}: {e}")
        return respond(status_code=500, message="Internal server error", data=None)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.exception_handler(ResponseException)
async def response_exception_handler(
    request: Request, exc: ResponseException
) -> JSONResponse:
    """Handle ResponseException and return proper JSON response."""
    return respond(
        status_code=exc.status_code,
        error=exc.error,
    )


@app.get("/", tags=["Health Check"])
async def health_check() -> dict[str, str]:
    """Health check endpoint to verify API status."""
    return {
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }
