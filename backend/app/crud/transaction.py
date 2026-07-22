from sqlalchemy.orm import Session

from app.db.models import Transaction
from app.schemas.transaction import TransactionCreate, TransactionUpdate


def get_transactions(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> list[Transaction]:
    return (
        db.query(Transaction)
        .filter(Transaction.user_id == user_id)
        .order_by(Transaction.date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_transaction(db: Session, transaction_id: int, user_id: int) -> Transaction | None:
    return db.query(Transaction).filter(
        Transaction.id == transaction_id, Transaction.user_id == user_id
    ).first()


def create_transaction(db: Session, transaction_in: TransactionCreate, user_id: int) -> Transaction:
    transaction = Transaction(**transaction_in.model_dump(), user_id=user_id)
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


def update_transaction(db: Session, transaction: Transaction, transaction_in: TransactionUpdate) -> Transaction:
    for field, value in transaction_in.model_dump(exclude_unset=True).items():
        setattr(transaction, field, value)
    db.commit()
    db.refresh(transaction)
    return transaction


def delete_transaction(db: Session, transaction: Transaction) -> None:
    db.delete(transaction)
    db.commit()
