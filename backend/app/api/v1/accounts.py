from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.crud.account import create_account, delete_account, get_account, get_accounts, update_account
from app.db.models import User
from app.schemas.account import AccountCreate, AccountResponse, AccountUpdate

router = APIRouter(prefix="/accounts", tags=["accounts"])


@router.get("/", response_model=list[AccountResponse])
def list_accounts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_accounts(db, current_user.id)


@router.post("/", response_model=AccountResponse, status_code=status.HTTP_201_CREATED)
def create(account_in: AccountCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_account(db, account_in, current_user.id)


@router.get("/{account_id}", response_model=AccountResponse)
def get_one(account_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    account = get_account(db, account_id, current_user.id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account


@router.put("/{account_id}", response_model=AccountResponse)
def update(account_id: int, account_in: AccountUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    account = get_account(db, account_id, current_user.id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return update_account(db, account, account_in)


@router.delete("/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(account_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    account = get_account(db, account_id, current_user.id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    delete_account(db, account)
