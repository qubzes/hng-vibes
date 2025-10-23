from redis import Redis

from app.core.config import settings

redis_client: Redis = Redis.from_url(settings.REDIS_URL)
