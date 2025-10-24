from typing import Any, Dict, List, Optional, TypeVar

from sqlalchemy import and_, func, inspect, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import Base
from app.core.response import throw

T = TypeVar("T", bound="BaseModel")


class BaseModel(Base):
    __abstract__ = True

    def model_dump(self, include_relationships: bool = False) -> dict[str, Any]:
        result = {c.name: getattr(self, c.name) for c in self.__table__.columns}

        if include_relationships:
            for relationship in self.__mapper__.relationships:
                rel_name = relationship.key
                rel_value = getattr(self, rel_name)

                if rel_value is not None:
                    if hasattr(rel_value, "model_dump"):
                        result[rel_name] = rel_value.model_dump()
                    elif isinstance(rel_value, list):
                        result[rel_name] = [
                            item.model_dump() if hasattr(item, "model_dump") else item
                            for item in rel_value
                        ]
                    else:
                        result[rel_name] = rel_value

        return result

    @classmethod
    async def get(
        cls: type[T],
        db: AsyncSession,
        load_relationships: bool = False,
        **filters: Any,
    ) -> T | None:
        query = select(cls)

        if load_relationships:
            query = query.options(selectinload("*"))

        for attr, value in filters.items():
            if hasattr(cls, attr):
                query = query.where(getattr(cls, attr) == value)

        result = await db.execute(query)
        return result.scalar_one_or_none()

    @classmethod
    async def get_all(
        cls: type[T],
        db: AsyncSession,
        page: int = 1,
        size: int = 100,
        sort_by: Optional[str] = None,
        descending: bool = False,
        use_or: bool = True,
        filters: Optional[Dict[str, Any]] = None,
        search: Optional[str] = None,
        load_relationships: bool = False,
    ) -> tuple[List[T], int]:
        skip = (page - 1) * size
        query = select(cls)
        conditions: List[Any] = []

        if load_relationships:
            mapper = inspect(cls)
            relationship_options = [
                selectinload(getattr(cls, rel.key)) for rel in mapper.relationships
            ]
            query = query.options(*relationship_options)
        if filters:
            filter_conditions: List[Any] = []
            for attr, value in filters.items():
                if hasattr(cls, attr):
                    filter_conditions.append(getattr(cls, attr) == value)
                else:
                    throw(400, f"Invalid filter attribute: {attr}")
            if filter_conditions:
                conditions.append(
                    or_(*filter_conditions) if use_or else and_(*filter_conditions)
                )

        if search:
            search_fields = getattr(cls, "SEARCH_FIELDS", [])
            if search_fields:
                search_conditions: List[Any] = []
                for field in search_fields:
                    if hasattr(cls, field):
                        search_conditions.append(
                            getattr(cls, field).ilike(f"%{search}%")
                        )
                    else:
                        throw(400, f"Invalid search field: {field}")
                if search_conditions:
                    conditions.append(or_(*search_conditions))

        if conditions:
            for condition in conditions:
                query = query.where(condition)

        count_query = select(func.count())
        if query.whereclause is not None:
            if hasattr(query.whereclause, "clauses"):
                count_query = count_query.select_from(
                    select(cls).where(*query.whereclause.clauses).subquery()
                )
            else:
                count_query = count_query.select_from(
                    select(cls).where(query.whereclause).subquery()
                )
        else:
            count_query = count_query.select_from(select(cls).subquery())

        count_result = await db.execute(count_query)
        total = count_result.scalar_one()

        if sort_by:
            if not hasattr(cls, sort_by):
                throw(400, f"Invalid sort attribute: {sort_by}")
            order_attr = getattr(cls, sort_by)
            query = query.order_by(order_attr.desc() if descending else order_attr)

        query = query.offset(skip).limit(size)
        result = await db.execute(query)
        data = list(result.scalars().all())

        return (data, total)

    async def save(self: T, db: AsyncSession) -> T:
        if not self.id:
            db.add(self)
        await db.commit()
        await db.refresh(self)
        return self

    async def delete(self, db: AsyncSession) -> bool:
        await db.delete(self)
        await db.commit()
        return True
