from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from pydantic import BaseModel
from database import get_db
from models import User, Entry
from auth import get_current_user
from services.rag import search_similar
import ollama

router = APIRouter(prefix="/api/chat", tags=["chat"])

SYSTEM_PROMPT = """You are MoodMate — a warm, caring, and emotionally intelligent AI friend.

Your role:
- You are NOT a therapist. You are a genuine friend who listens and cares.
- Be natural, casual, and warm. Use short sentences. Don't over-explain.
- Reference the user's past diary entries naturally, like a friend who remembers things.
- If the user seems sad, be comforting. If happy, celebrate with them. Match their energy.
- Ask follow-up questions to show you care. Don't give unsolicited advice.
- Keep responses concise — 2-4 sentences usually. Don't write essays.
- Be honest and real, not overly positive or fake.
- If you mention something from their diary, be subtle — "I remember you mentioned..." not "According to your entry on..."

Recent diary entries (most relevant to this conversation):
{context}

User's overall mood pattern: {mood_summary}
"""


class ChatRequest(BaseModel):
    message: str


def _get_mood_summary(db: Session, user_id: int) -> str:
    """Get a quick summary of user's recent mood patterns."""
    entries = (
        db.query(Entry.mood)
        .filter(Entry.user_id == user_id)
        .order_by(desc(Entry.created_at))
        .limit(20)
        .all()
    )
    if not entries:
        return "No entries yet — new user."

    moods = [e[0] for e in entries]
    mood_counts = {}
    for m in moods:
        mood_counts[m] = mood_counts.get(m, 0) + 1

    top_mood = max(mood_counts, key=mood_counts.get)
    return f"Mostly {top_mood} lately ({mood_counts[top_mood]}/{len(moods)} recent entries). Distribution: {mood_counts}"


def _get_context(db: Session, user_id: int, message: str) -> str:
    """Get relevant context using RAG + recent entries."""
    lines = []

    # RAG: find entries most relevant to user's message
    try:
        similar = search_similar(message, user_id, top_k=3)
        if similar:
            lines.append("--- Relevant past entries ---")
            for s in similar:
                lines.append(f"[{s['created_at'][:10]}, mood: {s['mood']}, relevance: {s['relevance']}] {s['content'][:300]}")
    except Exception:
        pass

    # Also get latest 3 entries for recency
    recent = (
        db.query(Entry)
        .filter(Entry.user_id == user_id)
        .order_by(desc(Entry.created_at))
        .limit(3)
        .all()
    )
    if recent:
        lines.append("\n--- Most recent entries ---")
        for e in recent:
            date = e.created_at.strftime("%B %d")
            lines.append(f"[{date}, mood: {e.mood}] {e.content[:200]}")

    if not lines:
        return "No diary entries yet. This person is new."

    return "\n".join(lines)


@router.post("")
def chat(
    req: ChatRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    context = _get_context(db, user.id, req.message)
    mood_summary = _get_mood_summary(db, user.id)
    system = SYSTEM_PROMPT.format(context=context, mood_summary=mood_summary)

    response = ollama.chat(
        model="phi3:mini",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": req.message},
        ],
    )

    return {"reply": response["message"]["content"]}
