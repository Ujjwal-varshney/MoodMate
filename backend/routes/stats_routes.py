from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta, timezone
from collections import defaultdict
from database import get_db
from models import User, Entry
from auth import get_current_user

router = APIRouter(prefix="/api/stats", tags=["stats"])


def _calculate_longest_streak(db: Session, user_id: int) -> int:
    dates = (
        db.query(func.date(Entry.created_at))
        .filter(Entry.user_id == user_id)
        .distinct()
        .order_by(func.date(Entry.created_at))
        .all()
    )
    if not dates:
        return 0

    date_set = set()
    for (d,) in dates:
        if isinstance(d, str):
            date_set.add(datetime.strptime(d, "%Y-%m-%d").date())
        else:
            date_set.add(d)

    sorted_dates = sorted(date_set)
    longest = 1
    current = 1
    for i in range(1, len(sorted_dates)):
        if (sorted_dates[i] - sorted_dates[i - 1]).days == 1:
            current += 1
            longest = max(longest, current)
        else:
            current = 1
    return longest


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

    longest_streak = _calculate_longest_streak(db, user.id)

    return {
        "total_entries": total,
        "streak": streak,
        "longest_streak": longest_streak,
        "moods": moods,
    }


@router.get("/mood-trends")
def get_mood_trends(
    days: int = Query(default=30, ge=1, le=365),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    start_date = datetime.now(timezone.utc) - timedelta(days=days)
    entries = (
        db.query(Entry)
        .filter(Entry.user_id == user.id, Entry.created_at >= start_date)
        .order_by(Entry.created_at)
        .all()
    )

    grouped: dict[str, list] = defaultdict(list)
    for e in entries:
        day = e.created_at.strftime("%Y-%m-%d")
        grouped[day].append(e)

    result = []
    for date_str in sorted(grouped.keys()):
        day_entries = grouped[date_str]
        mood_counts: dict[str, int] = defaultdict(int)
        for e in day_entries:
            mood_counts[e.mood] += 1
        dominant_mood = max(mood_counts, key=mood_counts.get) if mood_counts else "neutral"
        result.append({
            "date": date_str,
            "entries": len(day_entries),
            "dominant_mood": dominant_mood,
            "moods": dict(mood_counts),
        })

    return result
