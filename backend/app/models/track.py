from datetime import datetime, timezone
from typing import List
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, Integer, String, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel

# Association tables for many-to-many relationships
track_genre_association = Table(
    "track_genre",
    BaseModel.metadata,
    Column("track_id", String, ForeignKey("track.id"), primary_key=True),
    Column("genre_name", String, ForeignKey("genre.name"), primary_key=True),
)

track_mood_association = Table(
    "track_mood",
    BaseModel.metadata,
    Column("track_id", String, ForeignKey("track.id"), primary_key=True),
    Column("mood_name", String, ForeignKey("mood.name"), primary_key=True),
)


class AddedBy(BaseModel):
    """Model representing the user who added a track."""
    __tablename__ = "added_by"

    id: Mapped[str] = mapped_column(
        String, primary_key=True, default=lambda: str(uuid4())
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    avatar: Mapped[str] = mapped_column(String(500), nullable=False)

    # Relationship to tracks
    tracks: Mapped[List["Track"]] = relationship(
        "Track", back_populates="added_by", cascade="all, delete-orphan"
    )


class Genre(BaseModel):
    """Model representing music genres."""
    __tablename__ = "genre"

    name: Mapped[str] = mapped_column(String(100), primary_key=True)

    # Many-to-many relationship with Track
    tracks: Mapped[List["Track"]] = relationship(
        "Track",
        secondary=track_genre_association,
        back_populates="genres"
    )


class Mood(BaseModel):
    """Model representing music moods."""
    __tablename__ = "mood"

    name: Mapped[str] = mapped_column(String(100), primary_key=True)

    # Many-to-many relationship with Track
    tracks: Mapped[List["Track"]] = relationship(
        "Track",
        secondary=track_mood_association,
        back_populates="moods"
    )

class Track(BaseModel):
    """Model representing a music track."""
    __tablename__ = "track"
    
    SEARCH_FIELDS = ["title"]

    id: Mapped[str] = mapped_column(
        String, primary_key=True, default=lambda: str(uuid4())
    )
    title: Mapped[str] = mapped_column(String(500), nullable=False, index=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    duration_ms: Mapped[int] = mapped_column(Integer, nullable=False)
    cover_url: Mapped[str] = mapped_column(String(1000), nullable=False)
    audio_url: Mapped[str] = mapped_column(String(1000), nullable=False)
    spotify_url: Mapped[str] = mapped_column(String(1000), nullable=False)
    added_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True
    )

    # Foreign key to added_by
    added_by_name: Mapped[str] = mapped_column(
        String(255), ForeignKey("added_by.name"), nullable=False
    )

    # Relationships
    added_by: Mapped["AddedBy"] = relationship("AddedBy", back_populates="tracks")
    
    genres: Mapped[List["Genre"]] = relationship(
        "Genre",
        secondary=track_genre_association,
        back_populates="tracks"
    )
    
    moods: Mapped[List["Mood"]] = relationship(
        "Mood",
        secondary=track_mood_association,
        back_populates="tracks"
    )