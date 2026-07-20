# Personal Finance Tracker

> **Currently in development**

Web app to track income, expenses, and personal accounts.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.12 + FastAPI |
| Database | PostgreSQL + SQLAlchemy + Alembic |
| Frontend | React + Vite |
| Containers | Docker + Docker Hub |

## Prerequisites

- Python 3.12
- PostgreSQL (running locally on port 5432)
- Node.js 20+

## Backend Setup

### 1. Clone the repository

```bash
git clone https://github.com/vicealvarezzz/personal-finance-tracker.git
cd personal-finance-tracker
```

### 2. Environment variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and adjust the values. Generate a secure key for `SECRET_KEY`:

```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### 3. Create database

Requires PostgreSQL to be installed and running. The script automatically reads the values from `backend/.env`:

```bash
./scripts/setup_db.sh
```

### 4. Virtual environment and dependency installation

```bash
cd backend
python -m venv .venv
.venv/bin/pip install -r requirements.txt
```

### 5. Apply migrations

```bash
.venv/bin/alembic upgrade head
```

Creates the `users`, `accounts`, `categories`, and `transactions` tables in the database.

### 6. Start the server

```bash
.venv/bin/uvicorn app.main:app --reload
```

API available at `http://localhost:8000`  
Interactive documentation at `http://localhost:8000/docs`

## Project Structure

```text
personal-finance-tracker/
├── scripts/
│   └── setup_db.sh         # Creates user and database in PostgreSQL
├── backend/
│   ├── app/
│   │   ├── main.py         # FastAPI entry point
│   │   ├── core/
│   │   │   └── config.py   # Environment variables
│   │   ├── db/
│   │   │   ├── database.py # SQLAlchemy connection
│   │   │   └── models.py   # DB models
│   │   ├── schemas/        # Data validation (Pydantic)
│   │   ├── crud/           # Database operations
│   │   └── api/            # REST endpoints
│   ├── alembic/            # Database migrations
│   ├── requirements.txt
│   └── .env.example
└── frontend/               # React + Vite (coming soon)
```

## Git Workflow

```text
main        ← production
  └── dev   ← integration
        └── feature/name  ← development of each module
```

Each feature is developed in a `feature/` branch. A Pull Request is opened towards `dev`, and upon completing a release, `dev` is merged → `main`.

## Migrations

Whenever a model is modified in `app/db/models.py`:

```bash
# Generate new migration
.venv/bin/alembic revision --autogenerate -m "description of the change"

# Apply
.venv/bin/alembic upgrade head

# Revert last migration
.venv/bin/alembic downgrade -1