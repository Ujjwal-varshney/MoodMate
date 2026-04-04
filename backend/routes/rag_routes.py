from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User
from auth import get_current_user
from services.rag import embed_all_entries, search_similar

router = APIRouter(prefix="/api/rag", tags=["rag"])


@router.post("/embed-all")
def embed_all(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Bulk-embed all existing entries into ChromaDB. Run once for migration."""
    count = embed_all_entries(db)
    return {"message": f"Embedded {count} entries into ChromaDB"}


@router.get("/search")
def search(
    q: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Search diary entries using semantic similarity."""
    results = search_similar(q, user.id, top_k=5)
    return results
