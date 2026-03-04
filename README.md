<div align="center">

# MoodMate

### Your AI-Powered Journaling Companion

*Write your thoughts. Let AI understand your mood. Track your emotional journey.*

<br />

![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-phi3:mini-7C3AED?style=for-the-badge&logo=ollama&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

<br />

[Features](#-features) &nbsp;&bull;&nbsp; [Quick Start](#-quick-start) &nbsp;&bull;&nbsp; [Tech Stack](#-tech-stack) &nbsp;&bull;&nbsp; [API Docs](#-api-reference) &nbsp;&bull;&nbsp; [Project Structure](#-project-structure)

<br />

</div>

---

## &#x2728; Features

<table>
<tr>
<td width="50%">

### &#x1F9E0; AI Mood Detection
Automatically detects your mood from journal text using **Ollama phi3:mini**. Classifies into 7 moods with color-coded indicators. Toggle between AI auto-detection and manual selection anytime.

</td>
<td width="50%">

### &#x1F4AC; AI Chat Companion
Chat with MoodMate — a warm, emotionally intelligent AI friend. It references your recent diary entries naturally, like a friend who remembers things.

</td>
</tr>
<tr>
<td width="50%">

### &#x1F4C5; Calendar View
Monthly calendar grid with mood-colored dots on each day. Navigate months, click any day to see entries with timestamps. Your mood history at a glance.

</td>
<td width="50%">

### &#x1F4D3; Smart Journaling
Write entries with optional titles, real-time word count, search by content, and filter by mood. Every entry shows date and time.

</td>
</tr>
<tr>
<td width="50%">

### &#x1F525; Stats & Streaks
Track your total entries, writing streak (consecutive days), and mood distribution. Stay motivated with your journaling habit.

</td>
<td width="50%">

### &#x1F3A8; 3 Beautiful Themes
**Dark** — warm blacks & beige accents<br/>
**Light** — clean off-white & brown<br/>
**Midnight** — deep blue & purple

</td>
</tr>
</table>

---

## &#x1F3AF; Mood System

<div align="center">

| Mood | Color | Preview |
|:----:|:-----:|:-------:|
| Happy | `#8abf7e` | ![happy](https://img.shields.io/badge/-%20%20%20%20-8abf7e?style=flat-square) |
| Sad | `#7b9fc9` | ![sad](https://img.shields.io/badge/-%20%20%20%20-7b9fc9?style=flat-square) |
| Anxious | `#c9b36e` | ![anxious](https://img.shields.io/badge/-%20%20%20%20-c9b36e?style=flat-square) |
| Angry | `#c97b7b` | ![angry](https://img.shields.io/badge/-%20%20%20%20-c97b7b?style=flat-square) |
| Calm | `#7bbab0` | ![calm](https://img.shields.io/badge/-%20%20%20%20-7bbab0?style=flat-square) |
| Loved | `#c9899b` | ![loved](https://img.shields.io/badge/-%20%20%20%20-c9899b?style=flat-square) |
| Neutral | `#8a8680` | ![neutral](https://img.shields.io/badge/-%20%20%20%20-8a8680?style=flat-square) |

</div>

---

## &#x1F680; Quick Start

### Prerequisites

| Tool | Version | Required |
|------|---------|:--------:|
| Python | 3.12+ | Yes |
| Node.js | 22+ | Yes |
| npm | 10+ | Yes |
| Ollama | Latest | Optional* |

> \* *The app works without Ollama — mood detection falls back to "neutral" and chat shows an error. All other features work normally.*

### 1. Clone & Install

```bash
git clone https://github.com/Ujjwal-varshney/MoodMate.git
cd MoodMate
```

<details>
<summary><b>Backend Setup</b></summary>

```bash
cd backend

# Create & activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

</details>

<details>
<summary><b>Frontend Setup</b></summary>

```bash
cd frontend
npm install
```

</details>

<details>
<summary><b>Ollama Setup (Optional)</b></summary>

```bash
# Install from https://ollama.com

# Pull the model
ollama pull phi3:mini

# Start the server
ollama serve
```

</details>

### 2. Run

Open **3 terminals** and run:

```bash
# Terminal 1 — Ollama (optional)
ollama serve

# Terminal 2 — Backend
cd backend && uvicorn main:app --reload
# => http://localhost:8000

# Terminal 3 — Frontend
cd frontend && npm run dev
# => http://localhost:3000
```

Open **http://localhost:3000** and start journaling!

---

## &#x1F6E0;&#xFE0F; Tech Stack

<div align="center">

```
 Frontend                    Backend                     AI
 ────────                    ───────                     ──
 Next.js 16                  FastAPI                     Ollama
 React 19                    SQLAlchemy                  phi3:mini
 TypeScript 5                SQLite
 Tailwind CSS 4              JWT Auth
 Framer Motion               Python 3.12+
 Lucide Icons
```

</div>

---

## &#x1F4C1; Project Structure

```
MoodMate/
│
├── backend/
│   ├── main.py                    # FastAPI app + CORS + routers
│   ├── database.py                # SQLite engine & session
│   ├── models.py                  # User & Entry models
│   ├── auth.py                    # JWT tokens & password hashing
│   ├── requirements.txt
│   ├── routes/
│   │   ├── auth_routes.py         # /signup, /login, /me
│   │   ├── entry_routes.py        # CRUD + /calendar/{year}/{month}
│   │   ├── chat_routes.py         # AI chat with diary context
│   │   ├── mood_routes.py         # /mood/predict
│   │   └── stats_routes.py        # /stats
│   └── services/
│       └── mood_predictor.py      # Ollama mood classification
│
├── frontend/src/
│   ├── app/
│   │   ├── page.tsx               # Home dashboard
│   │   ├── write/page.tsx         # New entry + AI mood detect
│   │   ├── entries/page.tsx       # History with search & filters
│   │   ├── calendar/page.tsx      # Monthly mood calendar
│   │   ├── chat/page.tsx          # AI companion chat
│   │   ├── login/page.tsx         # Login
│   │   └── signup/page.tsx        # Registration
│   ├── components/
│   │   ├── AppShell.tsx           # Auth guard + layout
│   │   ├── Sidebar.tsx            # Nav sidebar + mobile nav
│   │   ├── EntryCard.tsx          # Entry preview card
│   │   ├── Loader.tsx             # Skeletons & spinners
│   │   └── PageTransition.tsx     # Page animations
│   ├── context/
│   │   ├── AuthContext.tsx         # Auth state management
│   │   └── ThemeContext.tsx        # Theme switching
│   └── lib/
│       ├── api.ts                 # API client
│       └── utils.ts               # Date formatting
│
└── README.md
```

---

## &#x1F4DA; API Reference

> All endpoints (except auth) require `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `POST` | `/api/auth/signup` | Create account |
| `POST` | `/api/auth/login` | Login & get JWT |
| `GET` | `/api/auth/me` | Current user info |

<details>
<summary>Request / Response examples</summary>

**Signup:**
```json
{ "name": "John", "email": "john@example.com", "password": "secret123" }
```

**Login:**
```json
{ "email": "john@example.com", "password": "secret123" }
```

**Response:**
```json
{
  "token": "eyJhbG...",
  "user": { "id": 1, "name": "John", "email": "john@example.com" }
}
```

</details>

### Entries

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `GET` | `/api/entries` | List entries (?mood, ?search) |
| `POST` | `/api/entries` | Create entry |
| `GET` | `/api/entries/calendar/{year}/{month}` | Entries grouped by day |
| `GET` | `/api/entries/{id}` | Single entry |
| `PUT` | `/api/entries/{id}` | Update entry |
| `DELETE` | `/api/entries/{id}` | Delete entry |

<details>
<summary>Request / Response examples</summary>

**Create entry:**
```json
{
  "title": "Great day",
  "content": "Today was amazing, I got promoted!",
  "mood": "auto"
}
```
> `"auto"` = AI detects mood. Or pass: `happy`, `sad`, `anxious`, `angry`, `calm`, `loved`, `neutral`

**Response:**
```json
{
  "id": 1,
  "title": "Great day",
  "content": "Today was amazing, I got promoted!",
  "mood": "happy",
  "word_count": 7,
  "created_at": "2026-03-04T10:30:00Z",
  "updated_at": "2026-03-04T10:30:00Z"
}
```

**Calendar response** (`GET /api/entries/calendar/2026/3`):
```json
{
  "4": [{ "id": 1, "mood": "happy", "content": "..." }],
  "5": [{ "id": 2, "mood": "calm", "content": "..." }]
}
```

</details>

### Mood Prediction

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `POST` | `/api/mood/predict` | Predict mood from text |

<details>
<summary>Request / Response examples</summary>

```json
// Request
{ "content": "I had the best day ever!" }

// Response
{ "mood": "happy" }
```

</details>

### Chat

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `POST` | `/api/chat` | Chat with AI companion |

<details>
<summary>Request / Response examples</summary>

```json
// Request
{ "message": "Hey, I've been feeling off lately" }

// Response
{ "reply": "Hey, I noticed from your recent entries things have been tough. Want to talk about what's going on?" }
```

</details>

### Statistics

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `GET` | `/api/stats` | User stats & mood breakdown |

<details>
<summary>Response example</summary>

```json
{
  "total_entries": 42,
  "streak": 7,
  "moods": { "happy": 15, "calm": 12, "sad": 5, "anxious": 4, "neutral": 3, "loved": 2, "angry": 1 }
}
```

</details>

---

## &#x1F5C3;&#xFE0F; Database Schema

```sql
CREATE TABLE users (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    name             VARCHAR(100) NOT NULL,
    email            VARCHAR(255) UNIQUE NOT NULL,
    hashed_password  VARCHAR(255) NOT NULL,
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
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

## &#x1F522; Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Dashboard with stats, quick actions, recent entries |
| `/write` | Write | New journal entry with AI mood detection |
| `/chat` | Chat | AI companion conversation |
| `/calendar` | Calendar | Monthly view with mood-colored dots |
| `/entries` | Entries | Full history with search & mood filters |
| `/login` | Login | Email & password login |
| `/signup` | Sign Up | New account registration |

---

## &#x2699;&#xFE0F; Configuration

| Setting | Value | File |
|---------|-------|------|
| JWT Secret | `moodmate-local-secret-key-*` | `backend/auth.py` |
| JWT Expiry | 30 days | `backend/auth.py` |
| Database | `./moodmate.db` | `backend/database.py` |
| Backend Port | `8000` | uvicorn |
| Frontend Port | `3000` | Next.js |
| Ollama Port | `11434` | Ollama |
| AI Model | `phi3:mini` | `backend/services/mood_predictor.py` |
| CORS Origin | `http://localhost:3000` | `backend/main.py` |

---

<div align="center">

### Built with &#x2764;&#xFE0F; by [Ujjwal Varshney](https://github.com/Ujjwal-varshney)

*MoodMate — because your feelings matter.*

</div>
