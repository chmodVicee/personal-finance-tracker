from pydantic import BaseModel, ConfigDict

from app.db.models import TransactionType


class CategoryCreate(BaseModel):
    name: str
    type: TransactionType
    color: str = "#6366f1"


class CategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int | None
    name: str
    type: TransactionType
    color: str
