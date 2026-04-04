from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from pydantic import BaseModel
from database import get_db
from models import User, Entry
from auth import get_current_user
import ollama

router = APIRouter(prefix="/api/entries", tags=["search"])

SEARCH_PROMPT = """Parse this search query for a mood journal app. Extract structured filters.

Query: "{query}"

Respond in this exact format (one per line, no extra text):
mood: <one of: happy, sad, anxious, angry, calm, loved, neutral, or none>
keywords: <comma-separated search terms, or none>

Examples:
Query: "when was I last happy"
mood: happy
keywords: none

Query: "entries about work stress"
mood: anxious
keywords: work, stress

Query: "times I felt loved by family"
mood: loved
keywords: family
"""


class SearchRequest(BaseModel):
    query: str


def _entry_to_dict(e: Entry) -> dict:
    return {
        "id": e.id,
        "title": e.title or "",
        "content": e.content,
        "mood": e.mood,
        "word_count": e.word_count,
        "created_at": e.created_at.isoformat() + "Z",
        "updated_at": e.updated_at.isoformat() + "Z",
    }


def _parse_ai_response(text: str):
    mood = None
    keywords = []
    for line in text.strip().split("\n"):
        line = line.strip().lower()
        if line.startswith("mood:"):
            val = line.split(":", 1)[1].strip()
            if val != "none":
                mood = val
        elif line.startswith("keywords:"):
            val = line.split(":", 1)[1].strip()
            if val != "none":
                keywords = [k.strip() for k in val.split(",") if k.strip()]
    return mood, keywords


@router.post("/search")
def search_entries(
    req: SearchRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    mood_filter = None
    keywords = []

    try:
        response = ollama.chat(
            model="phi3:mini",
            messages=[{"role": "user", "content": SEARCH_PROMPT.format(query=req.query[:500])}],
        )
        raw = response["message"]["content"]
        mood_filter, keywords = _parse_ai_response(raw)
    except Exception:
        # Fallback to plain text search
        keywords = req.query.split()

    q = db.query(Entry).filter(Entry.user_id == user.id)

    if mood_filter:
        q = q.filter(Entry.mood == mood_filter)

    if keywords:
        for kw in keywords:
            q = q.filter(
                (Entry.content.ilike(f"%{kw}%")) | (Entry.title.ilike(f"%{kw}%"))
            )

    entries = q.order_by(desc(Entry.created_at)).limit(50).all()
    return [_entry_to_dict(e) for e in entries]
