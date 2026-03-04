from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, extract
from pydantic import BaseModel
from typing import Optional
from collections import defaultdict
from database import get_db
from models import User, Entry
from auth import get_current_user
from services.mood_predictor import predict_mood

router = APIRouter(prefix="/api/entries", tags=["entries"])


class EntryCreate(BaseModel):
    title: Optional[str] = ""
    content: str
    mood: Optional[str] = "auto"


class EntryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    mood: Optional[str] = None


class EntryResponse(BaseModel):
    id: int
    title: str
    content: str
    mood: str
    word_count: int
    created_at: str
    updated_at: str


def entry_to_dict(e: Entry) -> dict:
    return {
        "id": e.id,
        "title": e.title or "",
        "content": e.content,
        "mood": e.mood,
        "word_count": e.word_count,
        "created_at": e.created_at.isoformat() + "Z",
        "updated_at": e.updated_at.isoformat() + "Z",
    }


@router.get("")
def get_entries(
    mood: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    q = db.query(Entry).filter(Entry.user_id == user.id)
    if mood and mood != "all":
        q = q.filter(Entry.mood == mood)
    if search:
        q = q.filter(Entry.content.ilike(f"%{search}%"))
    entries = q.order_by(desc(Entry.created_at)).all()
    return [entry_to_dict(e) for e in entries]


@router.post("")
def create_entry(
    req: EntryCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    word_count = len(req.content.strip().split()) if req.content.strip() else 0
    mood = req.mood or "auto"
    if mood == "auto":
        mood = predict_mood(req.content)
    entry = Entry(
        user_id=user.id,
        title=req.title or "",
        content=req.content,
        mood=mood,
        word_count=word_count,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry_to_dict(entry)


@router.get("/calendar/{year}/{month}")
def get_calendar_entries(
    year: int,
    month: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    entries = (
        db.query(Entry)
        .filter(
            Entry.user_id == user.id,
            extract("year", Entry.created_at) == year,
            extract("month", Entry.created_at) == month,
        )
        .order_by(desc(Entry.created_at))
        .all()
    )
    grouped: dict[str, list] = defaultdict(list)
    for e in entries:
        day = str(e.created_at.day)
        grouped[day].append(entry_to_dict(e))
    return grouped


@router.get("/{entry_id}")
def get_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.user_id == user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry_to_dict(entry)


@router.put("/{entry_id}")
def update_entry(
    entry_id: int,
    req: EntryUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.user_id == user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    if req.title is not None:
        entry.title = req.title
    if req.content is not None:
        entry.content = req.content
        entry.word_count = len(req.content.strip().split()) if req.content.strip() else 0
    if req.mood is not None:
        entry.mood = req.mood

    db.commit()
    db.refresh(entry)
    return entry_to_dict(entry)


@router.delete("/{entry_id}")
def delete_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.user_id == user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(entry)
    db.commit()
    return {"message": "Entry deleted"}
