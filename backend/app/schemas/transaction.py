from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.db.models import TransactionType


class TransactionCreate(BaseModel):
    account_id: int
    category_id: int | None = None
    amount: float
    type: TransactionType
    description: str | None = None
    date: datetime


class TransactionUpdate(BaseModel):
    category_id: int | None = None
    amount: float | None = None
    description: str | None = None
    date: datetime | None = None


class TransactionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    account_id: int
    category_id: int | None
    amount: float
    type: TransactionType
    description: str | None
    date: datetime
    created_at: datetime
