from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.crud.transaction import (
    create_transaction, delete_transaction, get_transaction, get_transactions, update_transaction,
)
from app.db.models import User
from app.schemas.transaction import TransactionCreate, TransactionResponse, TransactionUpdate

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("/", response_model=list[TransactionResponse])
def list_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_transactions(db, current_user.id, skip=skip, limit=limit)


@router.post("/", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create(transaction_in: TransactionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_transaction(db, transaction_in, current_user.id)


@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_one(transaction_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    transaction = get_transaction(db, transaction_id, current_user.id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


@router.put("/{transaction_id}", response_model=TransactionResponse)
def update(transaction_id: int, transaction_in: TransactionUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    transaction = get_transaction(db, transaction_id, current_user.id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return update_transaction(db, transaction, transaction_in)


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(transaction_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    transaction = get_transaction(db, transaction_id, current_user.id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    delete_transaction(db, transaction)
