"""
Response utilities for consistent API responses and error handling.

This module provides clean, sharp-named functions for:
- Creating standardized JSON responses
"""

import datetime
import json
from typing import Any, Generic, TypeVar, Optional

from fastapi.responses import JSONResponse
from pydantic import BaseModel

T = TypeVar("T")


class Respond(BaseModel, Generic[T]):
    """Generic response model for type safety"""

    message: str
    data: Optional[T] = None


class ResponseException(Exception):
    """
    Custom exception that immediately stops execution when raised.
    """

    def __init__(self, status_code: int, error: str):
        self.status_code = status_code
        self.error = error
        super().__init__(error)


class CustomJSONEncoder(json.JSONEncoder):
    """Custom JSON encoder that handles datetime objects and other special types."""
    
    def default(self, o):
        if isinstance(o, (datetime.datetime, datetime.date, datetime.time)):
            return o.isoformat()
        if isinstance(o, BaseModel):
            return o.model_dump()
        if hasattr(o, "model_dump"):
            return o.model_dump()
        if hasattr(o, "__dict__"):
            return {
                k: v for k, v in o.__dict__.items() if not k.startswith("_")
            }
        return super().default(o)


def _serialize(obj: Any) -> Any:
    """
    Recursively serialize objects to make them JSON serializable.
    Handles datetime, date, time, Pydantic models, dicts, lists, tuples, and custom objects.
    """
    if obj is None:
        return None
    if isinstance(obj, (str, int, float, bool)):
        return obj
    if isinstance(obj, (datetime.datetime, datetime.date, datetime.time)):
        return obj.isoformat()
    if isinstance(obj, BaseModel):
        return {k: _serialize(v) for k, v in obj.model_dump().items()}
    if isinstance(obj, dict):
        return {k: _serialize(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple, set)):
        return [_serialize(item) for item in obj]
    if hasattr(obj, "model_dump"):
        return {k: _serialize(v) for k, v in obj.model_dump().items()}
    if hasattr(obj, "__dict__"):
        return {
            k: _serialize(v) for k, v in obj.__dict__.items() if not k.startswith("_")
        }
    return str(obj)


def respond(
    status_code: int = 200, 
    message: str | None = None, 
    error: str | None = None, 
    data: Any = None
) -> JSONResponse:
    """
    Create a standardized JSON response with proper serialization.

    Args:
        status_code: HTTP status code (default: 200)
        message: Response message (used for success responses)
        error: Error message (used for error responses)
        data: Optional data payload (will be properly serialized, None if not provided)

    Returns:
        JSONResponse with standardized format
    """
    serialized_data = _serialize(data) if data is not None else {}
    
    response_message = error if error is not None else (message if message is not None else "Success")
    
    response_data = {
        "error" if error is not None else "message": response_message,
        "data": serialized_data,
    }
    
    # Use custom JSON encoder to handle datetime objects
    content = json.loads(json.dumps(response_data, cls=CustomJSONEncoder))
    
    return JSONResponse(status_code=status_code, content=content)


def throw(
    status_code: int, error: str
) -> None:
    """
    Throw an exception that immediately stops execution.

    Args:
        status_code: HTTP status code
        error: Error message

    Raises:
        ResponseException: Always raises, never returns
    """
    raise ResponseException(status_code=status_code, error=error)
