<div align="center">

# MoodMate

### Your AI-Powered Journaling Companion

*Write your thoughts. Let AI understand your mood. Track your emotional journey — 100% private, runs locally.*

<br />

![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-phi3:mini-7C3AED?style=for-the-badge&logo=ollama&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)

<br />

[Features](#-features) &nbsp;&bull;&nbsp; [Quick Start](#-quick-start) &nbsp;&bull;&nbsp; [Tech Stack](#%EF%B8%8F-tech-stack) &nbsp;&bull;&nbsp; [Architecture](#-architecture) &nbsp;&bull;&nbsp; [API Docs](#-api-reference) &nbsp;&bull;&nbsp; [Project Structure](#-project-structure) &nbsp;&bull;&nbsp; [Configuration](#%EF%B8%8F-configuration)

<br />

</div>

---

## &#x2728; Features

<table>
<tr>
<td width="50%">

### &#x1F9E0; AI Mood Detection
Automatically detects your mood from journal text using **Ollama phi3:mini**. Classifies into 7 moods with color-coded indicators throughout the app. Toggle between AI auto-detection and manual selection anytime.

</td>
<td width="50%">

### &#x1F4AC; AI Chat Companion
Chat with MoodMate — a warm, emotionally intelligent AI friend. It references your recent diary entries naturally, like a friend who remembers things. Contextual conversations powered by your last 5 entries.

</td>
</tr>
<tr>
<td width="50%">

### &#x1F4C5; Calendar View
Monthly calendar grid with mood-colored dots on each day. Shows entry count & time per day. Navigate months, click any day to see full entries with timestamps. Your mood history at a glance.

</td>
<td width="50%">

### &#x1F4DD; Rich Text Editor
Full formatting toolbar — **bold**, *italic*, <u>underline</u>, text alignment, font size/family, text color (8 options), background highlight (7 colors), line spacing, emoji picker (30 emojis). Your journal, your style.

</td>
</tr>
<tr>
<td width="50%">

### &#x2728; AI Writing Improvement
One-click AI enhancement for your journal entries. Shows a **side-by-side diff** — removed words in red strikethrough, added words in green. Accept or discard changes with full undo support.

</td>
<td width="50%">

### &#x1F4A1; Writing Suggestions Panel
Stuck on what to write? A collapsible left panel with **5 categories** of writing prompts (Hindi + English mix). Click to insert, shuffle for new ideas. Categories: Start here, Deep thoughts, Feelings, Gratitude, Looking ahead.

</td>
</tr>
<tr>
<td width="50%">

### &#x1F525; Stats, Streaks & Achievements
Track total entries, daily writing streak, longest streak ever, and mood distribution. **6 milestone badges**: Week Warrior (7-day), Monthly Master (30-day), Centurion (100-day), Getting Started (10 entries), Reflector (50), Storyteller (100).

</td>
<td width="50%">

### &#x1F4CA; Analytics Dashboard
Weekly entry summary with top mood. **Mood distribution pie chart** (Recharts). **30-day entry trends** area chart. All color-coded with the 7-mood system. See patterns in your emotional journey.

</td>
</tr>
<tr>
<td width="50%">

### &#x1F3A8; 3 Beautiful Themes
**Dark** — warm blacks & golden beige accents<br/>
**Light** — clean off-white & brown tones<br/>
**Midnight** — deep navy & cool purple<br/>
Persistent across sessions, switchable from sidebar.

</td>
<td width="50%">

### &#x1F514; Smart Notifications
**15+ funny Hindi/English shayari** notifications — Zomato/Swiggy-style witty reminders that nudge you to journal. Examples: *"Dimaag mein 47 tabs khule hain? Journal mein paste karo!"*, *"Chai toh pi li, ab zindagi ka hisaab bhi likh lo"*. Non-intrusive, auto-dismiss, with CTA buttons.

</td>
</tr>
<tr>
<td width="50%">

### &#x1F50D; Smart Search
Two search modes: **plain text search** across all entries, or toggle **AI-powered semantic search** that understands natural language like *"when was I last happy"* — extracts mood + keywords automatically.

</td>
<td width="50%">

### &#x1F512; 100% Private & Local
All data stays on YOUR machine. SQLite database, local Ollama AI, no cloud APIs, no tracking. JWT authentication for multi-user support. Your feelings, your data, your control.

</td>
</tr>
</table>

---

## &#x1F3AF; Mood System

MoodMate uses a 7-mood classification system, color-coded throughout the entire application:

<div align="center">

| Mood | Color | Hex | Used In |
|:----:|:-----:|:---:|---------|
| Happy | ![happy](https://img.shields.io/badge/-%20%20%20%20-8abf7e?style=flat-square) | `#8abf7e` | Calendar dots, entry cards, analytics charts, chat |
| Sad | ![sad](https://img.shields.io/badge/-%20%20%20%20-7b9fc9?style=flat-square) | `#7b9fc9` | Calendar dots, entry cards, analytics charts, chat |
| Anxious | ![anxious](https://img.shields.io/badge/-%20%20%20%20-c9b36e?style=flat-square) | `#c9b36e` | Calendar dots, entry cards, analytics charts, chat |
| Angry | ![angry](https://img.shields.io/badge/-%20%20%20%20-c97b7b?style=flat-square) | `#c97b7b` | Calendar dots, entry cards, analytics charts, chat |
| Calm | ![calm](https://img.shields.io/badge/-%20%20%20%20-7bbab0?style=flat-square) | `#7bbab0` | Calendar dots, entry cards, analytics charts, chat |
| Loved | ![loved](https://img.shields.io/badge/-%20%20%20%20-c9899b?style=flat-square) | `#c9899b` | Calendar dots, entry cards, analytics charts, chat |
| Neutral | ![neutral](https://img.shields.io/badge/-%20%20%20%20-8a8680?style=flat-square) | `#8a8680` | Default fallback when AI is unavailable |

</div>

---

## &#x1F680; Quick Start

### Prerequisites

| Tool | Version | Required | Purpose |
|------|---------|:--------:|---------|
| Python | 3.12+ | Yes | Backend server |
| Node.js | 22+ | Yes | Frontend server |
| npm | 10+ | Yes | Package management |
| Ollama | Latest | Optional* | AI features (mood, chat, improve, search) |

> \* *MoodMate works without Ollama — mood detection defaults to "neutral", chat shows a friendly error, and search falls back to keyword matching. All journaling features work normally.*

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

**Dependencies installed:**
| Package | Version | Purpose |
|---------|---------|---------|
| fastapi | 0.115 | Web framework |
| uvicorn | latest | ASGI server |
| sqlalchemy | 2.0.35 | ORM & database |
| pydantic[email] | latest | Data validation |
| python-jose[cryptography] | latest | JWT tokens |
| ollama | latest | Local AI integration |

</details>

<details>
<summary><b>Frontend Setup</b></summary>

```bash
cd frontend
npm install
```

**Dependencies installed:**
| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.1.6 | React framework |
| react | 19.2.3 | UI library |
| typescript | 5.x | Type safety |
| tailwindcss | 4.x | Styling |
| framer-motion | 12.34.5 | Animations |
| lucide-react | 0.576.0 | Icons |
| recharts | 3.7.0 | Charts |

</details>

<details>
<summary><b>Ollama Setup (Optional)</b></summary>

```bash
# Install from https://ollama.com

# Pull the model (~2.3 GB)
ollama pull phi3:mini

# Start the server (runs on port 11434)
ollama serve
```

</details>

### 2. Run

Open **3 terminals** and run:

```bash
# Terminal 1 — Ollama (optional, for AI features)
ollama serve

# Terminal 2 — Backend (API server)
cd backend && uvicorn main:app --reload
# => http://localhost:8000

# Terminal 3 — Frontend (web app)
cd frontend && npm run dev
# => http://localhost:3000
```

### 3. Use

1. Open **http://localhost:3000**
2. **Sign up** with name, email & password
3. Complete the **onboarding** flow
4. Start **writing** your first journal entry!

---

## &#x1F6E0;&#xFE0F; Tech Stack

<div align="center">

```
 Frontend                    Backend                     AI                    Storage
 ────────                    ───────                     ──                    ───────
 Next.js 16 (App Router)     FastAPI 0.115               Ollama                SQLite
 React 19                    SQLAlchemy 2.0              phi3:mini             localStorage
 TypeScript 5                Pydantic                    (runs locally)        (themes, tokens)
 Tailwind CSS 4              JWT (python-jose)
 Framer Motion 12            Python 3.12+
 Lucide React Icons
 Recharts 3
```

</div>

---

## &#x1F3D7; Architecture

### High-Level Overview

```
┌──────────────────────────────────────────────────────────────┐
│                        Browser                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Next.js Frontend (port 3000)               │  │
│  │  ┌──────┐ ┌───────┐ ┌────────┐ ┌──────┐ ┌──────────┐  │  │
│  │  │ Home │ │ Write │ │Calendar│ │ Chat │ │Analytics │  │  │
│  │  └──┬───┘ └──┬────┘ └──┬─────┘ └──┬───┘ └──┬───────┘  │  │
│  │     └────────┴─────────┴──────────┴────────┘           │  │
│  │                    API Client (lib/api.ts)               │  │
│  └────────────────────────┬────────────────────────────────┘  │
│                           │ HTTP (Bearer JWT)                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
┌───────────────────────────┼──────────────────────────────────┐
│               FastAPI Backend (port 8000)                      │
│  ┌────────────────────────┴────────────────────────────────┐  │
│  │                    CORS Middleware                        │  │
│  │  ┌──────┐ ┌───────┐ ┌──────┐ ┌──────┐ ┌─────┐ ┌─────┐ │  │
│  │  │ Auth │ │Entries│ │ Chat │ │ Mood │ │Stats│ │Impro│ │  │
│  │  │Routes│ │Routes │ │Route │ │Route │ │Route│ │Route│ │  │
│  │  └──┬───┘ └──┬────┘ └──┬───┘ └──┬───┘ └──┬──┘ └──┬──┘ │  │
│  │     └────────┴─────────┴────────┴────────┴───────┘     │  │
│  │              SQLAlchemy ORM + Auth Layer                  │  │
│  └──────────┬────────────────────────────┬─────────────────┘  │
│             │                            │                      │
│  ┌──────────▼──────────┐    ┌────────────▼───────────────┐    │
│  │  SQLite Database    │    │  Ollama (port 11434)        │    │
│  │  (moodmate.db)      │    │  phi3:mini model            │    │
│  │  - users table      │    │  - Mood prediction          │    │
│  │  - entries table    │    │  - Entry improvement        │    │
│  └─────────────────────┘    │  - Chat conversation        │    │
│                              │  - Semantic search           │    │
│                              └────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
┌────────┐                    ┌────────┐                 ┌──────────┐
│  User  │                    │Frontend│                 │ Backend  │
└───┬────┘                    └───┬────┘                 └────┬─────┘
    │  Enter credentials          │                           │
    │────────────────────────────>│                           │
    │                             │  POST /api/auth/login     │
    │                             │──────────────────────────>│
    │                             │                           │  Verify password
    │                             │                           │  (SHA256 + salt)
    │                             │     { token, user }       │
    │                             │<──────────────────────────│
    │                             │                           │
    │                             │  Store token in           │
    │                             │  localStorage             │
    │  Redirect to home           │                           │
    │<────────────────────────────│                           │
    │                             │                           │
    │  Subsequent requests        │  Authorization:           │
    │                             │  Bearer <token>           │
    │                             │──────────────────────────>│
    │                             │                           │  Decode JWT
    │                             │                           │  Extract user_id
    │                             │     { data }              │
    │                             │<──────────────────────────│
```

### Data Flow: Writing an Entry

```
┌──────┐     ┌──────────┐     ┌────────┐     ┌──────┐     ┌────────┐
│ User │     │Write Page│     │  API   │     │Models│     │ Ollama │
└──┬───┘     └────┬─────┘     └───┬────┘     └──┬───┘     └───┬────┘
   │              │               │              │             │
   │ Type content │               │              │             │
   │─────────────>│               │              │             │
   │              │               │              │             │
   │ Click Save   │               │              │             │
   │─────────────>│               │              │             │
   │              │               │              │             │
   │              │  POST /entries│              │             │
   │              │  {content,    │              │             │
   │              │   mood:"auto"}│              │             │
   │              │──────────────>│              │             │
   │              │               │              │             │
   │              │               │ predict_mood(content)      │
   │              │               │────────────────────────────>│
   │              │               │              │             │
   │              │               │    "happy"   │             │
   │              │               │<────────────────────────────│
   │              │               │              │             │
   │              │               │ Create Entry │             │
   │              │               │─────────────>│             │
   │              │               │              │ Save to DB  │
   │              │               │              │             │
   │              │ {mood:"happy"}│              │             │
   │              │<──────────────│              │             │
   │              │               │              │             │
   │ Show mood    │               │              │             │
   │ + redirect   │               │              │             │
   │<─────────────│               │              │             │
```

---

## &#x1F4C1; Project Structure

```
MoodMate/
│
├── backend/
│   ├── main.py                       # FastAPI app, CORS config, router registration
│   ├── database.py                   # SQLite engine, SessionLocal factory, Base
│   ├── models.py                     # SQLAlchemy ORM models (User, Entry)
│   ├── auth.py                       # JWT creation/validation, password hashing (SHA256+salt)
│   ├── moodmate.db                   # SQLite database file (auto-created)
│   ├── requirements.txt              # Python dependencies
│   ├── routes/
│   │   ├── auth_routes.py            # POST /signup, POST /login, GET /me
│   │   ├── entry_routes.py           # CRUD + GET /calendar/{year}/{month}
│   │   ├── chat_routes.py            # POST /chat — AI conversation with diary context
│   │   ├── mood_routes.py            # POST /mood/predict — AI mood classification
│   │   ├── stats_routes.py           # GET /stats, GET /mood-trends
│   │   ├── search_routes.py          # POST /entries/search — AI semantic search
│   │   └── improve_routes.py         # POST /entries/improve — AI writing enhancement
│   └── services/
│       └── mood_predictor.py         # Ollama phi3:mini integration wrapper
│
├── frontend/
│   ├── package.json                  # Node.js dependencies & scripts
│   ├── tsconfig.json                 # TypeScript config (strict, path aliases)
│   ├── next.config.ts                # Next.js 16 configuration
│   ├── postcss.config.mjs            # PostCSS + Tailwind plugin
│   └── src/
│       ├── app/
│       │   ├── globals.css           # Tailwind CSS, theme variables, scrollbar, fonts
│       │   ├── layout.tsx            # Root layout — wraps children in AppShell
│       │   ├── page.tsx              # Home dashboard — stats, recent entries, milestones
│       │   ├── write/page.tsx        # New entry — rich editor, toolbar, suggestions panel
│       │   ├── entries/
│       │   │   ├── page.tsx          # Entry history — search, mood filter, entry list
│       │   │   └── [id]/page.tsx     # Entry detail — view, edit, delete
│       │   ├── calendar/page.tsx     # Monthly calendar — mood dots, entry count, time
│       │   ├── chat/page.tsx         # AI chat — message bubbles, typing indicator
│       │   ├── analytics/page.tsx    # Analytics — pie chart, area chart, weekly summary
│       │   ├── login/page.tsx        # Login form — email, password, split layout
│       │   ├── signup/page.tsx       # Signup form — name, email, password
│       │   └── onboarding/page.tsx   # Welcome flow — 3-step intro sequence
│       ├── components/
│       │   ├── AppShell.tsx          # Auth guard, layout wrapper, daily reminder logic
│       │   ├── Sidebar.tsx           # Desktop sidebar (240px) + MobileNav (bottom bar)
│       │   ├── EntryCard.tsx         # Entry preview card — date, mood, preview, words
│       │   ├── Loader.tsx            # Spinner, FullScreenLoader, skeletons (6 variants)
│       │   ├── MilestoneModal.tsx    # Achievement popup — emoji, title, description
│       │   ├── NotificationToast.tsx # Funny Hindi/English push notifications (15+ msgs)
│       │   └── PageTransition.tsx    # Framer Motion page animation wrapper
│       ├── context/
│       │   ├── AuthContext.tsx       # Auth state — user, login, signup, logout, token
│       │   └── ThemeContext.tsx      # Theme switching — dark/light/midnight, CSS vars
│       └── lib/
│           ├── api.ts               # API client — all endpoints, Bearer auth, error handling
│           ├── utils.ts             # formatDate() — "March 4, 2026 · 10:30 AM"
│           ├── milestones.ts        # Achievement tracking — 6 milestones, localStorage
│           └── notifications.ts     # Browser Notification API — daily reminders
│
├── README.md                        # This file
├── 01-discussion-notes.md           # Project discussion notes
└── 02-BRD-project-plan.md           # Business requirements document
```

---

## &#x1F4DA; API Reference

> **Base URL:** `http://localhost:8000/api`
>
> All endpoints except auth require `Authorization: Bearer <token>` header.
> Token expires after 30 days.

### Auth Endpoints

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `POST` | `/api/auth/signup` | Create new account |
| `POST` | `/api/auth/login` | Login & get JWT token |
| `GET` | `/api/auth/me` | Get current user info |

<details>
<summary><b>Signup</b></summary>

```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "Ujjwal",
  "email": "ujjwal@example.com",
  "password": "secret123"
}
```

**Success (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Ujjwal",
    "email": "ujjwal@example.com"
  }
}
```

**Error (400):** `{ "detail": "Email already registered" }`

</details>

<details>
<summary><b>Login</b></summary>

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "ujjwal@example.com",
  "password": "secret123"
}
```

**Success (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "name": "Ujjwal", "email": "ujjwal@example.com" }
}
```

**Error (401):** `{ "detail": "Invalid email or password" }`

</details>

### Entry Endpoints

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `GET` | `/api/entries` | List all entries (optional `?mood=happy&search=keyword`) |
| `POST` | `/api/entries` | Create new entry |
| `GET` | `/api/entries/calendar/{year}/{month}` | Entries grouped by day number |
| `GET` | `/api/entries/{id}` | Get single entry |
| `PUT` | `/api/entries/{id}` | Update entry |
| `DELETE` | `/api/entries/{id}` | Delete entry |

<details>
<summary><b>Create Entry</b></summary>

```http
POST /api/entries
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Great day at work",
  "content": "Today was amazing! I got promoted and my team celebrated with cake.",
  "mood": "auto"
}
```

> **Mood options:** `"auto"` (AI detects), `"happy"`, `"sad"`, `"anxious"`, `"angry"`, `"calm"`, `"loved"`, `"neutral"`

**Response (200):**
```json
{
  "id": 1,
  "title": "Great day at work",
  "content": "Today was amazing! I got promoted and my team celebrated with cake.",
  "mood": "happy",
  "word_count": 13,
  "created_at": "2026-03-04T10:30:00Z",
  "updated_at": "2026-03-04T10:30:00Z"
}
```

</details>

<details>
<summary><b>Calendar Entries</b></summary>

```http
GET /api/entries/calendar/2026/3
Authorization: Bearer <token>
```

**Response (200):** *(entries grouped by day number as keys)*
```json
{
  "1": [
    {
      "id": 5,
      "title": "Weekend vibes",
      "content": "Relaxed all day...",
      "mood": "calm",
      "word_count": 45,
      "created_at": "2026-03-01T14:20:00Z",
      "updated_at": "2026-03-01T14:20:00Z"
    }
  ],
  "4": [
    { "id": 8, "mood": "happy", "..." : "..." },
    { "id": 9, "mood": "loved", "..." : "..." }
  ]
}
```

</details>

<details>
<summary><b>Update Entry</b></summary>

```http
PUT /api/entries/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "content": "Updated content with more details...",
  "mood": "calm"
}
```

> All fields are optional — only send what you want to change. Word count auto-recalculates if content changes.

</details>

### AI Endpoints

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `POST` | `/api/mood/predict` | Classify mood from text |
| `POST` | `/api/entries/improve` | AI-enhance writing |
| `POST` | `/api/entries/search` | AI semantic search |
| `POST` | `/api/chat` | AI companion conversation |

<details>
<summary><b>Mood Prediction</b></summary>

```http
POST /api/mood/predict
Authorization: Bearer <token>
Content-Type: application/json

{ "content": "I had the best day ever! Everything went right." }
```

**Response:** `{ "mood": "happy" }`

> Validates against 7 moods. Falls back to `"neutral"` if Ollama is unavailable or returns an invalid mood.

</details>

<details>
<summary><b>Entry Improvement</b></summary>

```http
POST /api/entries/improve
Authorization: Bearer <token>
Content-Type: application/json

{ "content": "today was ok i went to park and ate icecream it was nice" }
```

**Response:**
```json
{
  "improved": "Today was a pleasant day. I visited the park and treated myself to some ice cream — it was lovely.",
  "original": "today was ok i went to park and ate icecream it was nice"
}
```

> Fixes grammar, makes text more expressive while preserving the writer's voice. Max input: 2000 characters. Falls back to original if Ollama unavailable.

</details>

<details>
<summary><b>Semantic Search</b></summary>

```http
POST /api/entries/search
Authorization: Bearer <token>
Content-Type: application/json

{ "query": "when was I last happy about work" }
```

**Response:** Array of matching entries

> AI extracts mood filter (`happy`) and keywords (`work`) from natural language. Falls back to keyword search if Ollama unavailable. Returns up to 50 results.

</details>

<details>
<summary><b>Chat</b></summary>

```http
POST /api/chat
Authorization: Bearer <token>
Content-Type: application/json

{ "message": "Hey, I've been feeling off lately" }
```

**Response:**
```json
{
  "reply": "Hey, I noticed from your recent entries that things have been a bit heavy. Want to talk about what's going on?"
}
```

> The AI receives your last 5 diary entries as context. It acts as a warm, caring friend — NOT a therapist. Responds in 2-4 sentences, matching your energy.

</details>

### Statistics Endpoints

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `GET` | `/api/stats` | User stats, streak, mood breakdown |
| `GET` | `/api/stats/mood-trends?days=30` | Daily mood trends |

<details>
<summary><b>Stats</b></summary>

```http
GET /api/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "total_entries": 42,
  "streak": 7,
  "longest_streak": 15,
  "moods": {
    "happy": 15,
    "calm": 12,
    "sad": 5,
    "anxious": 4,
    "neutral": 3,
    "loved": 2,
    "angry": 1
  }
}
```

</details>

<details>
<summary><b>Mood Trends</b></summary>

```http
GET /api/stats/mood-trends?days=30
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "date": "2026-03-04",
    "entries": 2,
    "dominant_mood": "happy",
    "moods": { "happy": 2, "calm": 1 }
  },
  {
    "date": "2026-03-03",
    "entries": 1,
    "dominant_mood": "calm",
    "moods": { "calm": 1 }
  }
]
```

</details>

---

## &#x1F5C3;&#xFE0F; Database Schema

```sql
-- Users table
CREATE TABLE users (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    name             VARCHAR(100) NOT NULL,
    email            VARCHAR(255) UNIQUE NOT NULL,
    hashed_password  VARCHAR(255) NOT NULL,          -- SHA256 with random salt
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Journal entries table
CREATE TABLE entries (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    title       VARCHAR(255) DEFAULT '',              -- Optional title
    content     TEXT NOT NULL,                         -- Journal body (required)
    mood        VARCHAR(50) DEFAULT 'neutral',         -- AI-detected or manual
    word_count  INTEGER DEFAULT 0,                     -- Auto-calculated server-side
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,    -- UTC timezone-aware
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP     -- Auto-updates on edit
);
```

### Relationships

```
users (1) ──── (N) entries
  │                  │
  ├─ id              ├─ id
  ├─ name            ├─ user_id (FK → users.id)
  ├─ email           ├─ title
  ├─ hashed_password ├─ content
  └─ created_at      ├─ mood
                      ├─ word_count
                      ├─ created_at
                      └─ updated_at
```

---

## &#x1F522; Pages

| Route | Page | Key Features |
|-------|------|-------------|
| `/` | **Home** | Stats cards (entries, streak, longest streak), recent entries, milestone badges, quick action buttons |
| `/write` | **Write** | Rich text editor with toolbar, AI mood detect/manual select, writing suggestions panel, AI improve with diff, emoji picker |
| `/entries` | **Entries** | Entry list, mood filter (7 moods), text/AI search toggle, infinite scroll |
| `/entries/[id]` | **Entry Detail** | Full entry view, edit mode, delete with confirmation, mood display |
| `/calendar` | **Calendar** | Monthly grid, mood dots per day, entry count & time, click to expand day |
| `/chat` | **Chat** | AI conversation, message bubbles, typing animation, context-aware responses |
| `/analytics` | **Analytics** | Mood distribution pie chart, 30-day trends area chart, weekly summary |
| `/login` | **Login** | Email/password form, split layout (desktop), show/hide password |
| `/signup` | **Sign Up** | Name/email/password, validation, redirects to onboarding |
| `/onboarding` | **Onboarding** | 3-step welcome flow, write first entry (optional), tips |

---

## &#x1F3A8; Theme System

MoodMate supports 3 themes, switchable from the sidebar. Theme preference persists in `localStorage`.

<details>
<summary><b>Dark Theme (Default)</b></summary>

```css
--bg-primary:      #0f0e0c     /* Deep warm black */
--bg-secondary:    #161513     /* Slightly lighter */
--bg-card:         #1c1b18     /* Card surfaces */
--bg-hover:        #24231f     /* Hover states */
--accent:          #c9a87c     /* Warm golden beige */
--accent-hover:    #dbbf9a     /* Lighter accent */
--text-primary:    #ece8e1     /* Warm white */
--text-secondary:  #a09a90     /* Muted text */
--text-muted:      #5c5850     /* Very subtle text */
--border:          #262420     /* Borders */
```

</details>

<details>
<summary><b>Light Theme</b></summary>

```css
--bg-primary:      #f8f6f3     /* Warm off-white */
--bg-secondary:    #ffffff     /* Pure white */
--bg-card:         #ffffff     /* White cards */
--accent:          #8b6b3d     /* Deep brown */
--text-primary:    #1a1816     /* Near black */
--text-secondary:  #6b6560     /* Medium gray */
--border:          #e8e4df     /* Light border */
```

</details>

<details>
<summary><b>Midnight Theme</b></summary>

```css
--bg-primary:      #0a0a10     /* Deep navy */
--bg-secondary:    #101018     /* Dark navy */
--bg-card:         #14141e     /* Navy card */
--accent:          #7c8cc9     /* Cool blue/purple */
--text-primary:    #e1e3ec     /* Cool white */
--text-secondary:  #8085a0     /* Muted blue-gray */
--border:          #1e1e2a     /* Navy border */
```

</details>

---

## &#x1F514; Notification System

### In-App Toast Notifications

MoodMate features **15+ funny Hindi/English motivational notifications** inspired by Zomato/Swiggy's witty notification style:

| Emoji | Title | Sample Message |
|:-----:|-------|---------------|
| &#x1F4DD; | Dil ki baat | *"Dil mein jo hai woh kagaz pe likh do, warna mood bhi bolega — 'mujhe koi samajhta nahi' 😤"* |
| &#x2615; | Chai pe charcha? | *"Chai toh pi li, ab zindagi ka hisaab bhi likh lo. Ek entry = ek therapy session FREE 🫖"* |
| &#x1F9E0; | Brain bolta hai... | *"Itne thoughts head mein ghoom rahe hain, parking ke paise lagenge. Journal mein unload karo! 🅿️"* |
| &#x1F31F; | 2 minute ka kaam hai | *"Netflix ke liye 2 ghante hain, journal ke liye 2 minute nahi? Priorities check karo boss 😏"* |
| &#x1F525; | Streak mat todo! | *"Tumhara journal streak chal raha hai! Aaj skip kiya toh streak bolega 'tu mujhe deserve nahi karta' 💔"* |
| &#x1F3AD; | Feelings ka traffic jam | *"Andar itni feelings hain ki signal tod ke nikal rahi hain. Journal mein green signal do 🚦"* |
| &#x1F319; | Shaam ho gayi | *"Din bhar itna kiya lekin apne liye 2 minute nahi nikale? Journal likh lo, dil halka hoga ✨"* |
| &#x1F914; | Overthinking alert! | *"Dimaag mein 47 tabs khule hain? Sab journal mein paste karo aur browser band karo 🧹"* |

**Behavior:**
- First notification after 30 seconds
- Then every 3-5 minutes (randomized)
- Auto-dismiss after 8 seconds
- Max 3 on screen
- Each has a CTA button linking to relevant page
- Positioned bottom-right (above mobile nav)

### Browser Notifications (Daily Reminder)

- Uses Web Notification API
- Triggers at 8 PM if user hasn't journaled today
- Toggle on/off from sidebar
- Requires browser permission

---

## &#x1F6E1;&#xFE0F; Security

| Feature | Implementation |
|---------|---------------|
| **Password Hashing** | SHA256 with random 16-byte salt. Format: `{salt_hex}:{hash_hex}` |
| **JWT Tokens** | HS256 algorithm, 30-day expiry, user_id in payload |
| **CORS** | Restricted to `http://localhost:3000` only |
| **User Isolation** | All database queries filtered by `user_id` — users only see their own data |
| **Token Storage** | `localStorage` key: `moodmate_token` |
| **Input Limits** | Improve endpoint caps input at 2000 characters |
| **Local Only** | No external API calls, no tracking, no cloud storage |

---

## &#x2699;&#xFE0F; Configuration

| Setting | Value | Location |
|---------|-------|----------|
| JWT Secret | `moodmate-local-secret-key-change-in-production` | `backend/auth.py` |
| JWT Expiry | 30 days | `backend/auth.py` |
| Database URL | `sqlite:///./moodmate.db` | `backend/database.py` |
| Backend Port | `8000` | uvicorn CLI |
| Frontend Port | `3000` | Next.js dev server |
| Ollama Port | `11434` | Ollama default |
| AI Model | `phi3:mini` | `backend/services/mood_predictor.py` |
| CORS Origin | `http://localhost:3000` | `backend/main.py` |
| Theme Storage | `moodmate_theme` | `localStorage` |
| Auth Token | `moodmate_token` | `localStorage` |
| Milestones | `moodmate_milestones_seen` | `localStorage` |
| Reminders | `moodmate_reminder_enabled` | `localStorage` |

---

## &#x1F4A1; AI Prompts

<details>
<summary><b>Mood Prediction Prompt</b></summary>

```
Classify the mood of this journal entry into exactly one of:
happy, sad, anxious, angry, calm, loved, neutral

Reply with ONLY the mood word, nothing else.

Entry: {content}
```

</details>

<details>
<summary><b>Entry Improvement Prompt</b></summary>

```
Improve this journal entry. Fix grammar, make it more expressive
and vivid, but keep the writer's voice and meaning.
Return ONLY the improved text, nothing else.

Original:
{content}

Improved:
```

</details>

<details>
<summary><b>Chat System Prompt</b></summary>

```
You are MoodMate — a warm, caring AI friend who knows the user
through their diary. You are NOT a therapist — just a supportive friend.

Guidelines:
- Reference recent diary entries naturally
- Be concise (2-4 sentences)
- Match the user's energy
- Ask follow-up questions instead of giving advice

Recent diary context:
{last 5 entries with dates and moods}
```

</details>

<details>
<summary><b>Semantic Search Prompt</b></summary>

```
Parse this search query for a mood journal. Extract:
mood: <one of: happy, sad, anxious, angry, calm, loved, neutral, or none>
keywords: <comma-separated search terms, or none>

Example: "when was I last happy" → mood: happy, keywords: none
Example: "entries about work stress" → mood: anxious, keywords: work, stress

Query: {query}
```

</details>

---

## &#x1F6A7; Milestones & Achievements

| Badge | Trigger | Emoji |
|-------|---------|:-----:|
| Week Warrior | 7-day streak | &#x1F525; |
| Monthly Master | 30-day streak | &#x26A1; |
| Centurion | 100-day streak | &#x1F451; |
| Getting Started | 10 entries | &#x1F4DD; |
| Reflector | 50 entries | &#x1F4D6; |
| Storyteller | 100 entries | &#x1F4DA; |

Milestones are tracked client-side in `localStorage`. A modal celebration appears when a new milestone is achieved for the first time.

---

## &#x1F527; npm Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start Next.js dev server with Turbopack |
| `build` | `npm run build` | Production build |
| `start` | `npm run start` | Start production server |
| `lint` | `npm run lint` | Run ESLint |

---

## &#x1F4C8; Code Statistics

| Category | Count |
|----------|-------|
| Frontend Pages | 11 |
| React Components | 7 |
| Context Providers | 2 |
| Library Utilities | 4 |
| Backend Route Files | 7 |
| Backend Services | 1 |
| API Endpoints | 15 |
| Mood Types | 7 |
| Themes | 3 |
| Milestones | 6 |
| Notification Messages | 15+ |
| Writing Prompts | 20 |

---

<div align="center">

### Built with &#x2764;&#xFE0F; by [Ujjwal Varshney](https://github.com/Ujjwal-varshney)

*MoodMate — because your feelings matter.*

</div>
