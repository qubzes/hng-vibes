from typing import Generic, List, Optional, TypeVar

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.track import (
    AddedByBase,
    AddedByCreate,
    AddedByResponse,
    GenreBase,
    GenreCreate,
    GenreResponse,
    MoodBase,
    MoodCreate,
    MoodResponse,
    ReactionsBase,
    ReactionsCreate,
    ReactionsResponse,
    ReactionsUpdate,
    TrackBase,
    TrackCreate,
    TrackListResponse,
    TrackResponse,
    TrackUpdate,
)

T = TypeVar("T")

__all__ = [
    # Base classes
    "BaseRequest",
    "BaseResponse",
    "PaginatedRequest",
    "PaginatedResponse",
    # Track schemas
    "AddedByBase",
    "AddedByCreate",
    "AddedByResponse",
    "GenreBase",
    "GenreCreate",
    "GenreResponse",
    "MoodBase",
    "MoodCreate",
    "MoodResponse",
    "ReactionsBase",
    "ReactionsCreate",
    "ReactionsResponse",
    "ReactionsUpdate",
    "TrackBase",
    "TrackCreate",
    "TrackListResponse",
    "TrackResponse",
    "TrackUpdate",
]


class BaseRequest(BaseModel):
    pass


class BaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class PaginatedRequest(BaseRequest):
    page: int = 1
    size: int = Field(gt=0, default=100)
    sort_by: str = "created_at"
    descending: bool = False
    use_or: bool = False
    search: Optional[str] = None


class PaginatedResponse(BaseResponse, Generic[T]):
    data: List[T]
    total: int
    page: int
    pages: int
