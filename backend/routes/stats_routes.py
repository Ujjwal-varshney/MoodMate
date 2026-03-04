from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta, timezone
from database import get_db
from models import User, Entry
from auth import get_current_user

router = APIRouter(prefix="/api/stats", tags=["stats"])


@router.get("")
def get_stats(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    total = db.query(func.count(Entry.id)).filter(Entry.user_id == user.id).scalar()

    mood_counts = (
        db.query(Entry.mood, func.count(Entry.id))
        .filter(Entry.user_id == user.id)
        .group_by(Entry.mood)
        .all()
    )
    moods = {mood: count for mood, count in mood_counts}

    # Calculate streak
    streak = 0
    today = datetime.now(timezone.utc).date()
    check_date = today
    while True:
        has_entry = (
            db.query(Entry)
            .filter(
                Entry.user_id == user.id,
                func.date(Entry.created_at) == check_date,
            )
            .first()
        )
        if has_entry:
            streak += 1
            check_date -= timedelta(days=1)
        else:
            break

    return {
        "total_entries": total,
        "streak": streak,
        "moods": moods,
    }
