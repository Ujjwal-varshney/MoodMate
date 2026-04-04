# MoodMate — Claude Code Context

## Project Overview
MoodMate is a personal AI-powered emotional journal web app. Users write daily diary entries, the app detects emotions, and an AI friend chats based on past entries. **100% local — no external APIs.**

## Tech Stack
- **Frontend:** Next.js 14 + React + TypeScript + Tailwind CSS
- **Backend:** FastAPI (Python)
- **Database:** SQLite + SQLAlchemy
- **Local LLM:** Ollama + Phi-3 Mini (3.8B)
- **Embeddings:** all-MiniLM-L6-v2 (sentence-transformers)
- **Vector Store:** ChromaDB (local)
- **Emotion Model:** distilbert-base-uncased (fine-tuned)

## Project Structure
```
MoodMate/
├── frontend/                  # Next.js app
│   └── src/
│       ├── app/               # Pages (Next.js App Router)
│       │   ├── page.tsx       # Home/Dashboard
│       │   ├── write/         # Write diary entry
│       │   ├── entries/       # View past entries
│       │   ├── chat/          # AI friend chat
│       │   ├── analytics/     # Mood analytics
│       │   ├── calendar/      # Calendar view
│       │   ├── login/         # Auth
│       │   ├── signup/        # Auth
│       │   └── onboarding/    # First-time setup
│       ├── components/        # Shared UI components
│       │   ├── AppShell.tsx
│       │   ├── Sidebar.tsx
│       │   ├── EntryCard.tsx
│       │   ├── Loader.tsx
│       │   ├── MilestoneModal.tsx
│       │   ├── NotificationToast.tsx
│       │   └── PageTransition.tsx
│       ├── context/           # React contexts
│       │   ├── AuthContext.tsx
│       │   └── ThemeContext.tsx
│       └── lib/               # Utilities
│           ├── api.ts
│           ├── utils.ts
│           ├── milestones.ts
│           └── notifications.ts
├── 01-discussion-notes.md     # Project inception notes
└── 02-BRD-project-plan.md    # Full BRD & phased plan
```

## System Constraints
- Windows 11, 8GB RAM, GTX 1650 (4GB VRAM)
- All AI models must run locally
- App must work fully offline

## Conventions
- Language in docs: Hinglish (Hindi + English mix)
- Code: English only
- Use TypeScript for frontend, Python for backend
- Tailwind CSS for styling (no CSS modules)
- Next.js App Router (not Pages Router)
- Components in `src/components/`, pages in `src/app/`

## Key Commands
```bash
# Frontend
cd MoodMate/frontend && npm run dev     # Start dev server
cd MoodMate/frontend && npm run build   # Production build
cd MoodMate/frontend && npm run lint    # Lint check
```

## Current Status
- Frontend: Basic UI with pages (home, write, entries, chat, analytics, calendar, auth, onboarding)
- Backend: Not yet started
- AI Integration: Not yet started
- Phase 1 focus: Frontend UI completion
