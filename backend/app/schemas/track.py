"""
Pydantic schemas for Track-related models.
"""
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class AddedByBase(BaseModel):
    """Base schema for AddedBy."""
    name: str = Field(..., max_length=255, description="Name of the user who added the track")
    avatar: str = Field(..., max_length=500, description="URL to user's avatar image")


class AddedByCreate(AddedByBase):
    """Schema for creating a new AddedBy user."""
    pass


class AddedByResponse(AddedByBase):
    """Schema for AddedBy responses."""
    
    class Config:
        from_attributes = True


class GenreBase(BaseModel):
    """Base schema for Genre."""
    name: str = Field(..., max_length=100, description="Genre name")


class GenreCreate(GenreBase):
    """Schema for creating a new Genre."""
    pass


class GenreResponse(GenreBase):
    """Schema for Genre responses."""
    
    class Config:
        from_attributes = True


class MoodBase(BaseModel):
    """Base schema for Mood."""
    name: str = Field(..., max_length=100, description="Mood name")


class MoodCreate(MoodBase):
    """Schema for creating a new Mood."""
    pass


class MoodResponse(MoodBase):
    """Schema for Mood responses."""
    
    class Config:
        from_attributes = True


class ReactionsBase(BaseModel):
    """Base schema for Reactions."""
    like: int = Field(default=0, ge=0, description="Number of likes")
    fire: int = Field(default=0, ge=0, description="Number of fire reactions")
    heart: int = Field(default=0, ge=0, description="Number of heart reactions")


class ReactionsCreate(ReactionsBase):
    """Schema for creating Reactions."""
    pass


class ReactionsUpdate(BaseModel):
    """Schema for updating Reactions."""
    like: Optional[int] = Field(None, ge=0)
    fire: Optional[int] = Field(None, ge=0)
    heart: Optional[int] = Field(None, ge=0)


class ReactionsResponse(ReactionsBase):
    """Schema for Reactions responses."""
    id: str
    track_id: str
    
    class Config:
        from_attributes = True


class TrackBase(BaseModel):
    """Base schema for Track."""
    title: str = Field(..., max_length=500, description="Track title")
    album: str = Field(..., max_length=500, description="Album name")
    year: int = Field(..., ge=1900, le=2100, description="Release year")
    duration_ms: int = Field(..., gt=0, description="Track duration in milliseconds")
    cover_url: str = Field(..., max_length=1000, description="URL to album cover image")
    audio_url: str = Field(..., max_length=1000, description="URL to audio file")
    spotify_url: str = Field(..., max_length=1000, description="Spotify track URL")


class TrackCreate(TrackBase):
    """Schema for creating a new Track."""
    added_by_name: str = Field(..., description="Name of the user who added the track")
    genre_names: List[str] = Field(default_factory=list, description="List of genre names")
    mood_names: List[str] = Field(default_factory=list, description="List of mood names")


class TrackUpdate(BaseModel):
    """Schema for updating a Track."""
    title: Optional[str] = Field(None, max_length=500)
    album: Optional[str] = Field(None, max_length=500)
    year: Optional[int] = Field(None, ge=1900, le=2100)
    duration_ms: Optional[int] = Field(None, gt=0)
    cover_url: Optional[str] = Field(None, max_length=1000)
    audio_url: Optional[str] = Field(None, max_length=1000)
    spotify_url: Optional[str] = Field(None, max_length=1000)
    genre_names: Optional[List[str]] = None
    mood_names: Optional[List[str]] = None


class TrackResponse(TrackBase):
    """Schema for Track responses."""
    id: str
    added_at: datetime
    added_by_name: str
    
    # Related data
    added_by: Optional[AddedByResponse] = None
    reactions: Optional[ReactionsResponse] = None
    genres: List[GenreResponse] = Field(default_factory=list)
    moods: List[MoodResponse] = Field(default_factory=list)
    
    class Config:
        from_attributes = True


class TrackListResponse(BaseModel):
    """Schema for paginated Track list responses."""
    data: List[TrackResponse]
    total: int
    page: int
    size: int
    pages: int
    
    class Config:
        from_attributes = True
