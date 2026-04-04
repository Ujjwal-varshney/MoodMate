from fastapi import APIRouter, Depends
from pydantic import BaseModel
from models import User
from auth import get_current_user
from services.emotion import detect_emotion

router = APIRouter(prefix="/api/mood", tags=["mood"])


class MoodPredictRequest(BaseModel):
    content: str


@router.post("/predict")
def predict(
    req: MoodPredictRequest,
    user: User = Depends(get_current_user),
):
    result = detect_emotion(req.content)
    return {
        "mood": result["mood"],
        "confidence": result["confidence"],
        "emotions": result["all_emotions"],
    }
