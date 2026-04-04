from transformers import pipeline

# Lazy-loaded singleton
_classifier = None

# Map model labels to our mood categories
LABEL_MAP = {
    "joy": "happy",
    "happiness": "happy",
    "love": "loved",
    "surprise": "happy",
    "sadness": "sad",
    "grief": "sad",
    "anger": "angry",
    "annoyance": "angry",
    "disgust": "angry",
    "fear": "anxious",
    "nervousness": "anxious",
    "anxiety": "anxious",
    "worry": "anxious",
    "relief": "calm",
    "calm": "calm",
    "gratitude": "happy",
    "pride": "happy",
    "optimism": "happy",
    "excitement": "happy",
    "amusement": "happy",
    "caring": "loved",
    "admiration": "loved",
    "desire": "loved",
    "approval": "calm",
    "disapproval": "angry",
    "embarrassment": "anxious",
    "confusion": "anxious",
    "curiosity": "calm",
    "realization": "calm",
    "remorse": "sad",
    "disappointment": "sad",
    "neutral": "neutral",
}

VALID_MOODS = {"happy", "sad", "anxious", "angry", "calm", "loved", "neutral"}


def _get_classifier():
    global _classifier
    if _classifier is None:
        _classifier = pipeline(
            "text-classification",
            model="bhadresh-savani/distilbert-base-uncased-emotion",
            top_k=3,
            device=-1,  # CPU — safe for 8GB RAM
        )
    return _classifier


def detect_emotion(text: str) -> dict:
    """Detect emotion from text. Returns {mood, confidence, all_emotions}."""
    try:
        classifier = _get_classifier()
        # Truncate to avoid issues with long text
        results = classifier(text[:512])

        if not results or not results[0]:
            return {"mood": "neutral", "confidence": 0.0, "all_emotions": []}

        emotions = []
        for r in results[0]:
            label = r["label"].lower()
            mapped = LABEL_MAP.get(label, "neutral")
            emotions.append({
                "label": label,
                "mood": mapped,
                "score": round(r["score"], 3),
            })

        # Top prediction
        top = emotions[0]
        mood = top["mood"] if top["mood"] in VALID_MOODS else "neutral"

        return {
            "mood": mood,
            "confidence": top["score"],
            "all_emotions": emotions,
        }
    except Exception:
        return {"mood": "neutral", "confidence": 0.0, "all_emotions": []}
