from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.db.models import AccountType


class AccountCreate(BaseModel):
    name: str
    type: AccountType
    balance: float = 0.0
    currency: str = "CLP"


class AccountUpdate(BaseModel):
    name: str | None = None
    balance: float | None = None
    currency: str | None = None


class AccountResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    name: str
    type: AccountType
    balance: float
    currency: str
    created_at: datetime
