from fastapi import APIRouter, Depends
from pydantic import BaseModel
from models import User
from auth import get_current_user
import ollama

router = APIRouter(prefix="/api/entries", tags=["improve"])

IMPROVE_PROMPT = """Improve this journal entry. Fix grammar, make it more expressive and vivid, but keep the writer's voice and meaning. Return ONLY the improved text, nothing else.

Original:
{content}

Improved:"""


class ImproveRequest(BaseModel):
    content: str


@router.post("/improve")
def improve_entry(
    req: ImproveRequest,
    user: User = Depends(get_current_user),
):
    try:
        response = ollama.chat(
            model="phi3:mini",
            messages=[{"role": "user", "content": IMPROVE_PROMPT.format(content=req.content[:2000])}],
        )
        improved = response["message"]["content"].strip()
        return {"improved": improved, "original": req.content}
    except Exception:
        return {"improved": req.content, "original": req.content}
