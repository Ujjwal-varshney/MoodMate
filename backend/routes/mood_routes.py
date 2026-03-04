from fastapi import APIRouter, Depends
from pydantic import BaseModel
from models import User
from auth import get_current_user
from services.mood_predictor import predict_mood

router = APIRouter(prefix="/api/mood", tags=["mood"])


class MoodPredictRequest(BaseModel):
    content: str


@router.post("/predict")
def predict(
    req: MoodPredictRequest,
    user: User = Depends(get_current_user),
):
    mood = predict_mood(req.content)
    return {"mood": mood}
