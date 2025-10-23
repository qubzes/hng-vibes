from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter()

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # Make a simple query to check the database connection
        db.execute('SELECT 1')
        db_status = "healthy"
    except Exception:
        db_status = "unhealthy"

    return {"api_status": "healthy", "db_status": db_status}
