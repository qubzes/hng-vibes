from fastapi import FastAPI
from app.api.routes import health

app = FastAPI()

app.include_router(health.router, tags=["Health"])

@app.get("/")
def read_root():
    return {"message": "Welcome to HNG-Vibes API"}