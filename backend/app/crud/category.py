from sqlalchemy.orm import Session

from app.db.models import Category
from app.schemas.category import CategoryCreate


def get_categories(db: Session, user_id: int) -> list[Category]:
    return (
        db.query(Category)
        .filter((Category.user_id == user_id) | (Category.user_id.is_(None)))
        .all()
    )


def get_category(db: Session, category_id: int, user_id: int) -> Category | None:
    return (
        db.query(Category)
        .filter(Category.id == category_id)
        .filter((Category.user_id == user_id) | (Category.user_id.is_(None)))
        .first()
    )


def create_category(db: Session, category_in: CategoryCreate, user_id: int) -> Category:
    category = Category(**category_in.model_dump(), user_id=user_id)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, category: Category) -> None:
    db.delete(category)
    db.commit()
