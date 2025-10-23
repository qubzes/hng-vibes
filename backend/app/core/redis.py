from redis import Redis
from rq import Queue

from app.core.config import settings

redis_client: Redis = Redis.from_url(settings.REDIS_URL)


QUEUE = { }
