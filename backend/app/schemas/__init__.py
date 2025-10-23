from typing import Generic, List, Optional, TypeVar

from pydantic import BaseModel, ConfigDict, Field

T = TypeVar("T")


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
