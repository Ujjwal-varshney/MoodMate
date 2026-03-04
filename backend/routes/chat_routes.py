from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from pydantic import BaseModel
from database import get_db
from models import User, Entry
from auth import get_current_user
import ollama

router = APIRouter(prefix="/api/chat", tags=["chat"])

SYSTEM_PROMPT = """You are MoodMate — a warm, caring, and emotionally intelligent AI friend.

Your role:
- You are NOT a therapist. You are a genuine friend who listens and cares.
- Be natural, casual, and warm. Use short sentences. Don't over-explain.
- Reference the user's recent diary entries naturally, like a friend who remembers things.
- If the user seems sad, be comforting. If happy, celebrate with them. Match their energy.
- Ask follow-up questions to show you care. Don't give unsolicited advice.
- Keep responses concise — 2-4 sentences usually. Don't write essays.
- Be honest and real, not overly positive or fake.

Recent diary context about this person:
{context}
"""


class ChatRequest(BaseModel):
    message: str


def get_diary_context(db: Session, user_id: int) -> str:
    entries = (
        db.query(Entry)
        .filter(Entry.user_id == user_id)
        .order_by(desc(Entry.created_at))
        .limit(5)
        .all()
    )
    if not entries:
        return "No diary entries yet. This person is new."

    lines = []
    for e in entries:
        date = e.created_at.strftime("%B %d")
        lines.append(f"[{date}, mood: {e.mood}] {e.content[:200]}")
    return "\n".join(lines)


@router.post("")
def chat(
    req: ChatRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    context = get_diary_context(db, user.id)
    system = SYSTEM_PROMPT.format(context=context)

    response = ollama.chat(
        model="phi3:mini",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": req.message},
        ],
    )

    return {"reply": response["message"]["content"]}
