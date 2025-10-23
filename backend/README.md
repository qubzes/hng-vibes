# HNG Vibes: Community Music Discovery Platform

HNG Vibes is a community music discovery platform designed to streamline the process of curating and exploring music. It automatically captures Spotify links shared in a Slack #music channel, creating an intelligent and searchable music library.

## Features

- **Automated Spotify Link Capture:** Monitors a designated Slack channel for Spotify links.
- **Intelligent Music Library:** Organizes and stores captured music tracks.
- **Searchable Database:** Easily find and discover music within the curated library.
- **AI-Powered Features:** (Placeholder - specific AI features can be detailed here later)

## Technologies Used

- **FastAPI:** A modern, fast (high-performance) web framework for building APIs with Python 3.7+.
- **SQLAlchemy:** A powerful and flexible Object Relational Mapper (ORM) for interacting with databases.
- **PostgreSQL:** A robust, open-source relational database system.
- **Alembic:** A lightweight database migration tool for SQLAlchemy.
- **Redis Queue (RQ):** A simple Python library for queueing jobs and processing them in the background with Redis.
- **python-dotenv:** Manages environment variables for configuration.
- **Uvicorn:** An ASGI server for running FastAPI applications.
- **Spotipy:** A Python library for the Spotify Web API.
- **Slack Bolt:** A framework for building Slack apps.

## Quick Start

Follow these steps to get your HNG Vibes project up and running.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd hng-vibes/backend
```

### 2. Set up Environment Variables

Copy the `.env.example` file to `.env` in the `backend/` directory:

```bash
cp .env.example .env
```

### 3. Install Dependencies

Ensure you have `uv` (or `pip`) installed.

```bash
# Using uv (recommended)
uv sync

# Or using pip
pip install -r requirements.txt # You might need to generate a requirements.txt first
```

### 4. Database Migrations

Apply the database migrations:

```bash
alembic upgrade head
```

### 5. Run the Application

Start the FastAPI application:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 6. Run the RQ Worker (for background tasks)

In a separate terminal, start the RQ worker:

```bash
python worker.py
```

## Contributing

(Placeholder for contribution guidelines)

## License

(Placeholder for license information)
