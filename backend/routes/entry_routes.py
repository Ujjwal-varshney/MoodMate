from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, extract
from pydantic import BaseModel
from typing import Optional
from collections import defaultdict
from database import get_db
from models import User, Entry, Tag, EntryTag
from auth import get_current_user
from services.mood_predictor import predict_mood
from services.emotion import detect_emotion
from services.rag import add_entry as rag_add_entry, remove_entry as rag_remove_entry

router = APIRouter(prefix="/api/entries", tags=["entries"])


class EntryCreate(BaseModel):
    title: Optional[str] = ""
    content: str
    mood: Optional[str] = "auto"
    tags: Optional[list[str]] = None


class EntryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    mood: Optional[str] = None
    tags: Optional[list[str]] = None


class EntryResponse(BaseModel):
    id: int
    title: str
    content: str
    mood: str
    word_count: int
    created_at: str
    updated_at: str


def entry_to_dict(e: Entry, db: Session = None) -> dict:
    tags = []
    if db:
        tag_rows = (
            db.query(Tag.name)
            .join(EntryTag, EntryTag.tag_id == Tag.id)
            .filter(EntryTag.entry_id == e.id)
            .all()
        )
        tags = [t[0] for t in tag_rows]
    return {
        "id": e.id,
        "title": e.title or "",
        "content": e.content,
        "mood": e.mood,
        "word_count": e.word_count,
        "created_at": e.created_at.isoformat() + "Z",
        "updated_at": e.updated_at.isoformat() + "Z",
        "tags": tags,
    }


def _sync_tags(db: Session, entry: Entry, user: User, tag_names: list[str]):
    # Remove existing tags
    db.query(EntryTag).filter(EntryTag.entry_id == entry.id).delete()

    for name in tag_names:
        name = name.strip().lower()
        if not name:
            continue
        tag = db.query(Tag).filter(Tag.user_id == user.id, Tag.name == name).first()
        if not tag:
            tag = Tag(name=name, user_id=user.id)
            db.add(tag)
            db.flush()
        db.add(EntryTag(entry_id=entry.id, tag_id=tag.id))


@router.get("")
def get_entries(
    mood: Optional[str] = None,
    search: Optional[str] = None,
    tag: Optional[str] = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    q = db.query(Entry).filter(Entry.user_id == user.id)
    if mood and mood != "all":
        q = q.filter(Entry.mood == mood)
    if search:
        q = q.filter(Entry.content.ilike(f"%{search}%"))
    if tag:
        q = q.join(EntryTag).join(Tag).filter(Tag.name == tag.lower())
    entries = q.order_by(desc(Entry.created_at)).all()
    return [entry_to_dict(e, db) for e in entries]


@router.post("")
def create_entry(
    req: EntryCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    word_count = len(req.content.strip().split()) if req.content.strip() else 0
    mood = req.mood or "auto"
    if mood == "auto":
        # Use ML model for emotion detection (faster + better than LLM)
        result = detect_emotion(req.content)
        mood = result["mood"]
    entry = Entry(
        user_id=user.id,
        title=req.title or "",
        content=req.content,
        mood=mood,
        word_count=word_count,
    )
    db.add(entry)
    db.flush()

    if req.tags:
        _sync_tags(db, entry, user, req.tags)

    db.commit()
    db.refresh(entry)

    # Embed into ChromaDB for RAG (non-blocking, don't fail if it errors)
    try:
        rag_add_entry(entry.id, user.id, entry.content, entry.mood, entry.created_at.isoformat())
    except Exception:
        pass

    return entry_to_dict(entry, db)


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
    return entry_to_dict(entry, db)


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
    if req.tags is not None:
        _sync_tags(db, entry, user, req.tags)

    db.commit()
    db.refresh(entry)

    # Re-embed updated entry in ChromaDB
    try:
        rag_add_entry(entry.id, user.id, entry.content, entry.mood, entry.created_at.isoformat())
    except Exception:
        pass

    return entry_to_dict(entry, db)


@router.delete("/{entry_id}")
def delete_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.user_id == user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    # Remove from ChromaDB
    try:
        rag_remove_entry(entry.id)
    except Exception:
        pass

    db.delete(entry)
    db.commit()
    return {"message": "Entry deleted"}
