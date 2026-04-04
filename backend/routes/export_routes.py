from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime, timezone
from database import get_db
from models import User, Entry
from auth import get_current_user
import json
import io

router = APIRouter(prefix="/api/export", tags=["export"])


def entry_to_export_dict(e: Entry) -> dict:
    return {
        "id": e.id,
        "title": e.title or "",
        "content": e.content,
        "mood": e.mood,
        "word_count": e.word_count,
        "created_at": e.created_at.isoformat() + "Z",
        "updated_at": e.updated_at.isoformat() + "Z",
    }


@router.get("/json")
def export_json_range(
    start: str = Query(None, description="Start date YYYY-MM-DD"),
    end: str = Query(None, description="End date YYYY-MM-DD"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    q = db.query(Entry).filter(Entry.user_id == user.id)
    if start:
        q = q.filter(Entry.created_at >= datetime.strptime(start, "%Y-%m-%d"))
    if end:
        end_dt = datetime.strptime(end, "%Y-%m-%d").replace(hour=23, minute=59, second=59)
        q = q.filter(Entry.created_at <= end_dt)
    entries = q.order_by(desc(Entry.created_at)).all()

    data = {
        "exported_at": datetime.now(timezone.utc).isoformat() + "Z",
        "total_entries": len(entries),
        "entries": [entry_to_export_dict(e) for e in entries],
    }
    content = json.dumps(data, indent=2, ensure_ascii=False)
    return StreamingResponse(
        io.BytesIO(content.encode("utf-8")),
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=moodmate_entries.json"},
    )


@router.get("/json/{entry_id}")
def export_json_single(
    entry_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.user_id == user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    data = entry_to_export_dict(entry)
    content = json.dumps(data, indent=2, ensure_ascii=False)
    return StreamingResponse(
        io.BytesIO(content.encode("utf-8")),
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=moodmate_entry_{entry_id}.json"},
    )


@router.get("/pdf")
def export_pdf_range(
    start: str = Query(None, description="Start date YYYY-MM-DD"),
    end: str = Query(None, description="End date YYYY-MM-DD"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    from fpdf import FPDF

    q = db.query(Entry).filter(Entry.user_id == user.id)
    if start:
        q = q.filter(Entry.created_at >= datetime.strptime(start, "%Y-%m-%d"))
    if end:
        end_dt = datetime.strptime(end, "%Y-%m-%d").replace(hour=23, minute=59, second=59)
        q = q.filter(Entry.created_at <= end_dt)
    entries = q.order_by(desc(Entry.created_at)).all()

    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)

    # Title page
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 24)
    pdf.cell(0, 40, "MoodMate Journal", ln=True, align="C")
    pdf.set_font("Helvetica", "", 12)
    pdf.cell(0, 10, f"Exported: {datetime.now().strftime('%B %d, %Y')}", ln=True, align="C")
    pdf.cell(0, 10, f"Total Entries: {len(entries)}", ln=True, align="C")

    for entry in entries:
        pdf.add_page()
        # Date & mood
        pdf.set_font("Helvetica", "", 10)
        date_str = entry.created_at.strftime("%B %d, %Y at %I:%M %p")
        pdf.set_text_color(120, 120, 120)
        pdf.cell(0, 8, f"{date_str}  |  Mood: {entry.mood.capitalize()}  |  {entry.word_count} words", ln=True)
        pdf.set_text_color(0, 0, 0)

        # Title
        if entry.title:
            pdf.set_font("Helvetica", "B", 16)
            pdf.cell(0, 12, entry.title.encode("latin-1", "replace").decode("latin-1"), ln=True)

        # Content
        pdf.set_font("Helvetica", "", 11)
        pdf.ln(4)
        safe_content = entry.content.encode("latin-1", "replace").decode("latin-1")
        pdf.multi_cell(0, 6, safe_content)

    buf = io.BytesIO(pdf.output())
    return StreamingResponse(
        buf,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=moodmate_journal.pdf"},
    )


@router.get("/pdf/{entry_id}")
def export_pdf_single(
    entry_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    from fpdf import FPDF

    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.user_id == user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # Date & mood
    pdf.set_font("Helvetica", "", 10)
    date_str = entry.created_at.strftime("%B %d, %Y at %I:%M %p")
    pdf.set_text_color(120, 120, 120)
    pdf.cell(0, 8, f"{date_str}  |  Mood: {entry.mood.capitalize()}  |  {entry.word_count} words", ln=True)
    pdf.set_text_color(0, 0, 0)

    if entry.title:
        pdf.set_font("Helvetica", "B", 16)
        pdf.cell(0, 12, entry.title.encode("latin-1", "replace").decode("latin-1"), ln=True)

    pdf.set_font("Helvetica", "", 11)
    pdf.ln(4)
    safe_content = entry.content.encode("latin-1", "replace").decode("latin-1")
    pdf.multi_cell(0, 6, safe_content)

    buf = io.BytesIO(pdf.output())
    return StreamingResponse(
        buf,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=moodmate_entry_{entry_id}.pdf"},
    )
