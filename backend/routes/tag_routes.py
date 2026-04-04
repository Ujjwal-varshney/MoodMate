from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import Optional
from database import get_db
from models import User, Tag, EntryTag, Entry
from auth import get_current_user

router = APIRouter(prefix="/api/tags", tags=["tags"])


class TagCreate(BaseModel):
    name: str


class TagUpdate(BaseModel):
    name: str


@router.get("")
def get_tags(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    tags = db.query(Tag).filter(Tag.user_id == user.id).all()
    result = []
    for tag in tags:
        count = db.query(func.count(EntryTag.id)).filter(EntryTag.tag_id == tag.id).scalar()
        result.append({"id": tag.id, "name": tag.name, "count": count})
    return result


@router.post("")
def create_tag(req: TagCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    name = req.name.strip().lower()
    if not name:
        raise HTTPException(status_code=400, detail="Tag name is required")

    existing = db.query(Tag).filter(Tag.user_id == user.id, func.lower(Tag.name) == name).first()
    if existing:
        return {"id": existing.id, "name": existing.name, "count": 0}

    tag = Tag(name=name, user_id=user.id)
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return {"id": tag.id, "name": tag.name, "count": 0}


@router.delete("/{tag_id}")
def delete_tag(tag_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    tag = db.query(Tag).filter(Tag.id == tag_id, Tag.user_id == user.id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    db.delete(tag)
    db.commit()
    return {"message": "Tag deleted"}


@router.post("/suggest")
def suggest_tags(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    content: dict = None,
):
    text = content.get("content", "") if content else ""
    if not text:
        return {"tags": []}

    try:
        import ollama
        response = ollama.chat(
            model="phi3:mini",
            messages=[{
                "role": "user",
                "content": f"Suggest 3-5 short tags (1-2 words each) for this diary entry. Return ONLY comma-separated tags, nothing else.\n\nEntry: {text[:500]}"
            }],
        )
        raw = response["message"]["content"].strip()
        tags = [t.strip().lower().strip("#") for t in raw.split(",") if t.strip()]
        return {"tags": tags[:5]}
    except Exception:
        return {"tags": []}
