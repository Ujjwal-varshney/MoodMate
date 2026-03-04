# MoodMate

A personal AI-powered journaling app that understands how you feel. Write your thoughts, let AI detect your mood, chat with a caring AI friend, and track your emotional journey over time.

![Python](https://img.shields.io/badge/Python-3.12+-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)
![Ollama](https://img.shields.io/badge/Ollama-phi3:mini-purple)

---

## Features

### AI Mood Detection
- Automatically detects your mood from journal text using Ollama's phi3:mini model
- Classifies into 7 moods: Happy, Sad, Anxious, Angry, Calm, Loved, Neutral
- Toggle between AI auto-detection and manual mood selection
- Animated mood reveal after saving an entry
- Falls back to "neutral" gracefully if Ollama is unavailable

### AI Chat Companion
- Chat with MoodMate — a warm, emotionally intelligent AI friend
- Contextually aware: references your recent diary entries
- Natural, casual conversation style (not a therapist, a friend)
- Powered by Ollama phi3:mini running locally

### Calendar View
- Monthly calendar grid with mood-colored dots on each day
- Navigate between months with prev/next arrows
- Today highlighted automatically
- Click any day to see that day's entries with timestamps
- Visual mood history at a glance

### Journal Entries
- Write diary entries with optional titles
- Real-time word count
- Search entries by content
- Filter entries by mood
- Timestamps with date and time on every entry

### Statistics & Streaks
- Total entry count
- Writing streak tracker (consecutive days)
- Mood distribution breakdown

### Themes
- **Dark** — warm blacks and beige accents (default)
- **Light** — clean off-white with brown accents
- **Midnight** — deep blue with purple accents

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4, Framer Motion |
| Icons | Lucide React |
| Backend | FastAPI (Python 3.12+) |
| Database | SQLite via SQLAlchemy |
| AI Model | Ollama with phi3:mini |
| Auth | JWT (python-jose) |

---

## Project Structure

```
MoodMate/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── database.py              # SQLite + SQLAlchemy setup
│   ├── models.py                # User & Entry ORM models
│   ├── auth.py                  # JWT auth + password hashing
│   ├── requirements.txt         # Python dependencies
│   ├── routes/
│   │   ├── auth_routes.py       # POST /signup, /login, GET /me
│   │   ├── entry_routes.py      # CRUD entries + calendar endpoint
│   │   ├── chat_routes.py       # POST /chat (AI companion)
│   │   ├── mood_routes.py       # POST /mood/predict
│   │   └── stats_routes.py      # GET /stats
│   └── services/
│       └── mood_predictor.py    # Ollama mood classification
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.tsx         # Home / Dashboard
│       │   ├── write/page.tsx   # New journal entry
│       │   ├── entries/page.tsx # Entry history
│       │   ├── calendar/page.tsx# Calendar view
│       │   ├── chat/page.tsx    # AI chat
│       │   ├── login/page.tsx   # Login
│       │   ├── signup/page.tsx  # Sign up
│       │   ├── layout.tsx       # Root layout
│       │   └── globals.css      # Theme CSS variables
│       ├── components/
│       │   ├── AppShell.tsx     # Auth guard + layout wrapper
│       │   ├── Sidebar.tsx      # Navigation sidebar + mobile nav
│       │   ├── EntryCard.tsx    # Reusable entry preview card
│       │   ├── Loader.tsx       # Spinners + skeleton loaders
│       │   └── PageTransition.tsx # Page animations
│       ├── context/
│       │   ├── AuthContext.tsx   # Auth state + login/logout
│       │   └── ThemeContext.tsx  # Theme switching
│       └── lib/
│           ├── api.ts           # API client (all endpoints)
│           └── utils.ts         # Shared formatDate utility
│
└── README.md
```

---

## Prerequisites

- **Python** 3.12+
- **Node.js** 22+
- **npm** 10+
- **Ollama** (for AI features)

---

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd MoodMate
```

### 2. Backend setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

### 4. Ollama setup (for AI features)

```bash
# Install Ollama from https://ollama.com

# Pull the phi3:mini model
ollama pull phi3:mini

# Start Ollama server (runs on port 11434)
ollama serve
```

> **Note:** The app works without Ollama — mood detection falls back to "neutral" and the chat feature will show an error message. All other features work normally.

---

## Running the App

Open **three terminals**:

**Terminal 1 — Ollama** (optional, for AI features):
```bash
ollama serve
```

**Terminal 2 — Backend**:
```bash
cd backend
# Activate venv first (see above)
uvicorn main:app --reload
# Runs on http://localhost:8000
```

**Terminal 3 — Frontend**:
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

Open **http://localhost:3000** in your browser.

---

## API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current user info |

**Signup / Login request:**
```json
{
  "name": "John",        // signup only
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response:**
```json
{
  "token": "eyJhbG...",
  "user": { "id": 1, "name": "John", "email": "john@example.com" }
}
```

All endpoints below require `Authorization: Bearer <token>` header.

---

### Entries

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/entries` | List all entries (filterable) |
| POST | `/api/entries` | Create new entry |
| GET | `/api/entries/calendar/{year}/{month}` | Entries grouped by day |
| GET | `/api/entries/{id}` | Get single entry |
| PUT | `/api/entries/{id}` | Update entry |
| DELETE | `/api/entries/{id}` | Delete entry |

**Create entry:**
```json
{
  "title": "Great day",        // optional, defaults to ""
  "content": "Today was amazing...",
  "mood": "auto"               // "auto" = AI detects, or: happy/sad/anxious/angry/calm/loved/neutral
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Great day",
  "content": "Today was amazing...",
  "mood": "happy",
  "word_count": 4,
  "created_at": "2026-03-04T10:30:00Z",
  "updated_at": "2026-03-04T10:30:00Z"
}
```

**GET `/api/entries`** supports query params:
- `?mood=happy` — filter by mood
- `?search=keyword` — search entry content

**GET `/api/entries/calendar/2026/3`** returns:
```json
{
  "4": [{ "id": 1, "mood": "happy", ... }],
  "5": [{ "id": 2, "mood": "calm", ... }, { "id": 3, "mood": "sad", ... }]
}
```

---

### Mood Prediction

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/mood/predict` | Predict mood from text |

**Request:**
```json
{ "content": "I had the best day ever!" }
```

**Response:**
```json
{ "mood": "happy" }
```

---

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Chat with AI companion |

**Request:**
```json
{ "message": "Hey, I've been feeling off lately" }
```

**Response:**
```json
{ "reply": "Hey, I noticed from your recent entries that things have been tough. Want to talk about what's been going on?" }
```

---

### Statistics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Get user statistics |

**Response:**
```json
{
  "total_entries": 42,
  "streak": 7,
  "moods": { "happy": 15, "calm": 12, "sad": 5, "anxious": 4, "neutral": 3, "loved": 2, "angry": 1 }
}
```

---

## Database Schema

```sql
CREATE TABLE users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE entries (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    title       VARCHAR(255) DEFAULT '',
    content     TEXT NOT NULL,
    mood        VARCHAR(50) DEFAULT 'neutral',
    word_count  INTEGER DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## Mood System

| Mood | Color | Hex |
|------|-------|-----|
| Happy | Green | `#8abf7e` |
| Sad | Blue | `#7b9fc9` |
| Anxious | Yellow | `#c9b36e` |
| Angry | Red | `#c97b7b` |
| Calm | Teal | `#7bbab0` |
| Loved | Pink | `#c9899b` |
| Neutral | Gray | `#8a8680` |

---

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Dashboard with stats, quick actions, recent entries |
| `/write` | Write | New journal entry with AI mood detection |
| `/chat` | Chat | AI companion conversation |
| `/calendar` | Calendar | Monthly view with mood dots |
| `/entries` | Entries | Full history with search & filters |
| `/login` | Login | Email/password login |
| `/signup` | Sign Up | New account registration |

---

## Configuration

| Setting | Value | Location |
|---------|-------|----------|
| JWT Secret | `moodmate-local-secret-key-change-in-production` | `backend/auth.py` |
| JWT Expiry | 30 days | `backend/auth.py` |
| Database | `./moodmate.db` (SQLite) | `backend/database.py` |
| Backend Port | 8000 | uvicorn default |
| Frontend Port | 3000 | Next.js default |
| Ollama Port | 11434 | Ollama default |
| AI Model | phi3:mini | `backend/services/mood_predictor.py` |
| CORS Origin | `http://localhost:3000` | `backend/main.py` |

---

## License

This project is for personal/educational use.
