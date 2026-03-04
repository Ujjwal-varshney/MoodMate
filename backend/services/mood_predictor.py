import ollama

VALID_MOODS = {"happy", "sad", "anxious", "angry", "calm", "loved", "neutral"}

MOOD_PROMPT = """Classify the mood of this journal entry into exactly ONE of these categories:
happy, sad, anxious, angry, calm, loved, neutral

Rules:
- Reply with ONLY the mood word, nothing else.
- If unsure, pick the closest match.

Journal entry:
{content}

Mood:"""


def predict_mood(content: str) -> str:
    """Predict mood from journal text using Ollama phi3:mini. Falls back to 'neutral'."""
    try:
        response = ollama.chat(
            model="phi3:mini",
            messages=[{"role": "user", "content": MOOD_PROMPT.format(content=content[:500])}],
        )
        raw = response["message"]["content"].strip().lower().split()[0]
        # Strip any punctuation
        mood = "".join(c for c in raw if c.isalpha())
        if mood in VALID_MOODS:
            return mood
        return "neutral"
    except Exception:
        return "neutral"
