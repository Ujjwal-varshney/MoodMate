# MoodMate — BRD & Project Plan

## Business Requirements Document (BRD)

### Project Name: MoodMate
### Project Type: Personal AI-Powered Emotional Journal
### Platform: Web App (Phase 1) → Mobile App (Future)
### AI Approach: 100% Local — No External APIs

---

## Vision

> Ek aisi jagah jahan koi bhi insaan apni baatein likh sake, aur ek AI friend
> usse samjhe, yaad rakhe, aur sahi waqt pe sahi baat kare.

---

## Core Features (Overall)

| # | Feature | Description | Priority |
|---|---|---|---|
| F1 | Day-wise Diary | Roz ka din likhna — text editor | Must Have |
| F2 | Emotion Detection | Likhe hue text se mood detect karna | Must Have |
| F3 | AI Friend Chat | Diary entries ke basis pe personalized baat-cheet | Must Have |
| F4 | Entry History | Purane din ki entries dekhna, search karna | Must Have |
| F5 | Mood Timeline | Visual graph — mood ka pattern over time | Should Have |
| F6 | Voice Input | Bol ke diary likhna (Whisper) | Nice to Have (Phase 3) |
| F7 | Data Export | Apna data download karna (JSON/PDF) | Should Have |
| F8 | Dark Mode | Calming dark theme | Must Have |
| F9 | Local Encryption | Diary entries encrypted storage | Should Have |
| F10 | Mobile App | Phone se diary likhna | Future (Phase 4) |

---

## Non-Functional Requirements

| Requirement | Detail |
|---|---|
| **Privacy** | 100% local — koi data internet pe nahi jayega |
| **Performance** | AI response 5-10 seconds ke andar (local LLM) |
| **Storage** | SQLite — lightweight, no server needed |
| **Security** | Local encryption for diary entries |
| **Scalability** | Modular architecture — features easily add ho sakein |
| **Offline** | Pura app offline chalega (no internet needed) |

---

## Tech Stack (Final)

| Layer | Technology | Reason |
|---|---|---|
| **Frontend** | Next.js 14 + React | Modern, fast, SSR support |
| **Styling** | Tailwind CSS | Rapid UI development, clean design |
| **Backend** | FastAPI (Python) | AI/ML ke saath best integration |
| **Database** | SQLite + SQLAlchemy | Local, free, zero config |
| **Local LLM** | Ollama + Phi-3 Mini (3.8B) | 8GB RAM mein smoothly chalega |
| **Embeddings** | all-MiniLM-L6-v2 (sentence-transformers) | Entries ko vector mein convert (for RAG) |
| **Vector Store** | ChromaDB (local) | RAG ke liye — relevant entries search |
| **Emotion Model** | distilbert-base-uncased (fine-tuned) | Fast emotion classification |
| **Voice (Future)** | Whisper Small/Medium | Local speech-to-text |

---

## Architecture Overview

```
+------------------+         +-------------------+
|                  |  API    |                   |
|   Next.js App    | ------> |   FastAPI Backend  |
|   (Frontend)     | <------ |   (Python)         |
|                  |         |                   |
+------------------+         +--------+----------+
                                      |
                    +-----------------+-----------------+
                    |                 |                 |
              +-----+----+    +------+-----+    +------+------+
              |          |    |            |    |             |
              |  SQLite  |    |  Ollama    |    |  ChromaDB   |
              |  (Data)  |    |  (LLM)    |    |  (Vectors)  |
              |          |    |            |    |             |
              +----------+    +------------+    +-------------+
```

**Flow:**
1. User likhta hai diary entry → Frontend se Backend pe jaata hai
2. Backend entry ko SQLite mein save karta hai
3. Emotion model mood detect karta hai
4. Entry ka embedding banakar ChromaDB mein store hota hai
5. Jab user chat karta hai → Backend relevant entries ChromaDB se laata hai (RAG)
6. Ollama LLM ko context + relevant entries deke response generate hota hai
7. Response frontend pe display hota hai

---

# Phase-Wise Plan

---

## PHASE 1 — Foundation (Week 1-2)
> **Goal:** Basic diary likhna + AI se simple chat

### Tasks:
- [ ] Ollama install karna + Phi-3 Mini model download
- [ ] Project structure setup (monorepo)
- [ ] FastAPI backend setup
  - [ ] SQLite database schema (users, entries table)
  - [ ] API: Create diary entry
  - [ ] API: Get entries (day-wise, list)
  - [ ] API: Delete/Edit entry
- [ ] Next.js frontend setup
  - [ ] Home page — diary entries list
  - [ ] Write page — text editor for new entry
  - [ ] Entry detail page
- [ ] Basic AI chat integration
  - [ ] Ollama se connect karna (API call to localhost)
  - [ ] Simple chat page — user types, AI replies
  - [ ] System prompt: "You are a caring friend"
- [ ] Dark mode (default theme)
- [ ] Basic styling with Tailwind

### Deliverable: User diary likh sakta hai aur AI se basic baat kar sakta hai

---

## PHASE 2 — Smart Friend (Week 3-4)
> **Goal:** Emotion detection + Personalized AI responses

### Tasks:
- [ ] Emotion Detection System
  - [ ] Sentiment analysis model integrate (distilbert ya similar)
  - [ ] Har entry ka mood detect aur save karna
  - [ ] Mood label show on each entry (Happy, Sad, Anxious, etc.)
- [ ] RAG System (Memory for AI)
  - [ ] Sentence-transformers se entry embeddings banana
  - [ ] ChromaDB setup — embeddings store karna
  - [ ] Chat ke time relevant past entries retrieve karna
  - [ ] AI ko context dena: "User ne 3 din pehle yeh likha tha..."
- [ ] Personalized AI Responses
  - [ ] Better system prompt — empathetic, friend-like tone
  - [ ] User profile build karna (frequent emotions, topics)
  - [ ] AI response mein past context reference karna
- [ ] Mood Timeline UI
  - [ ] Calendar view with mood colors
  - [ ] Simple graph — mood over time

### Deliverable: AI friend jaisa feel karega — yaad rakhega, samjhega

---

## PHASE 3 — Voice & Polish (Week 5-6)
> **Goal:** Voice input + Better UI/UX

### Tasks:
- [ ] Voice Input (Whisper)
  - [ ] Whisper model local install
  - [ ] Record button on diary page
  - [ ] Speech-to-text conversion
  - [ ] Hinglish support testing
- [ ] UI/UX Improvements
  - [ ] Smooth animations (Framer Motion)
  - [ ] Better text editor (rich text — bold, italic, lists)
  - [ ] Entry templates ("How was your day?", prompts)
  - [ ] Onboarding flow for new users
- [ ] Analytics Dashboard
  - [ ] Most common emotions (pie chart)
  - [ ] Writing streak tracker
  - [ ] Word cloud from entries
- [ ] Data Export
  - [ ] Export as JSON
  - [ ] Export as PDF

### Deliverable: Polished app with voice input aur detailed analytics

---

## PHASE 4 — Mobile App (Week 7-8)
> **Goal:** Phone se diary likhna

### Tasks:
- [ ] React Native setup
- [ ] Core screens port karna (diary, chat, history)
- [ ] PC backend se connect (local network)
- [ ] Push notifications ("Aaj diary likhi?")
- [ ] Mobile-optimized UI

### Deliverable: Mobile app working — PC backend se connected

---

## PHASE 5 — Scale & Security (Week 9-10)
> **Goal:** Production-ready banana

### Tasks:
- [ ] Local encryption (diary entries encrypt karna)
- [ ] PIN/Password lock on app
- [ ] Backup & Restore feature
- [ ] Performance optimization
- [ ] Model optimization (quantized models for speed)
- [ ] Error handling & edge cases
- [ ] Documentation

### Deliverable: Secure, fast, production-ready app

---

## Requirements Checklist

### Already Installed
- [x] Python 3.12
- [x] Node.js v22
- [x] npm 10.9
- [x] Git 2.50
- [x] pip 25.0

### Need to Install (Phase 1 start se pehle)
- [ ] **Ollama** — https://ollama.com (download installer for Windows)
- [ ] **Phi-3 Mini model** — `ollama pull phi3:mini` (after Ollama install)
- [ ] **Next.js project** — `npx create-next-app@latest`
- [ ] **FastAPI + dependencies** — `pip install fastapi uvicorn sqlalchemy`
- [ ] **Tailwind CSS** — Next.js ke saath auto setup

### Need to Install (Phase 2)
- [ ] **ChromaDB** — `pip install chromadb`
- [ ] **Sentence Transformers** — `pip install sentence-transformers`
- [ ] **Transformers** — `pip install transformers` (emotion model ke liye)

### Need to Install (Phase 3)
- [ ] **Whisper** — `pip install openai-whisper`

---

## Folder Structure (Planned)

```
emotion-diary/
├── 01-discussion-notes.md          # Puri baat-cheet
├── 02-BRD-project-plan.md          # Yeh file (plan)
├── backend/                        # FastAPI Python Backend
│   ├── main.py                     # FastAPI app entry
│   ├── database.py                 # SQLite connection
│   ├── models.py                   # Database models
│   ├── routes/
│   │   ├── entries.py              # Diary entry APIs
│   │   └── chat.py                 # AI chat APIs
│   ├── services/
│   │   ├── emotion.py              # Emotion detection
│   │   ├── llm.py                  # Ollama integration
│   │   └── rag.py                  # RAG system
│   └── requirements.txt
├── frontend/                       # Next.js Frontend
│   ├── src/
│   │   ├── app/                    # Pages
│   │   ├── components/             # UI components
│   │   └── lib/                    # Utilities
│   ├── public/
│   ├── tailwind.config.js
│   └── package.json
└── models/                         # Local model configs
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|---|---|---|
| 8GB RAM tight for LLM | AI slow response | Phi-3 Mini (3.8B) use — fits in 4GB |
| GTX 1650 limited VRAM | Slow inference | Quantized models (Q4) use karenge |
| SQLite scaling limits | Large data slow | Enough for personal use, no issue |
| Whisper Hinglish accuracy | Wrong transcription | Test karenge, fallback to text |
| User data loss | Diary entries lost | Auto-backup feature add karenge |

---

*Created: 2026-03-03*
*Status: Plan Ready — Phase 1 Start karne ke liye Ollama install karo*
*Next Step: Ollama install → Phase 1 coding shuru*
