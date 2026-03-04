# MoodMate — Discussion Notes (Puri Baat-Cheet)

## Project Idea (User ki soch)

**MoodMate** — Ek **personal diary / journal app** banana hai jo **emotion-based** ho.

**Problem Statement:**
Bahut log akele hote hain — unke paas koi nahi hota apni baatein share karne ke liye. Yeh app unke liye ek **safe space** hogi jahan wo apna dil khol ke likh sakein.

**How it works:**
1. User **day-wise** apna din likhega — kya hua, kya feel kiya, sab kuch
2. App **emotions detect** karega entries se (khush, udaas, anxious, gussa, etc.)
3. Sare dino ki entries ke basis pe app **ek friend ki tarah baat karega** — generic nahi, **personalized**
4. AI ko yaad rehna chahiye ki user ne pehle kya likha tha

---

## Key Decisions (User ne decide kiya)

| Question | Decision |
|---|---|
| Web ya Mobile? | **Dono** — but pehle **Web App** banayenge, mobile baad mein |
| AI kaunsa? | **Sab Local** — koi external API nahi (privacy first) |
| Free ya Paid? | **Free** shuru mein |
| Text ya Voice? | **Pehle Text**, fir dheere dheere **Voice** bhi add karenge |
| Project size? | **Bada project** — ek ek feature add karte jayenge |

---

## System Specs (Checked)

| Component | Detail |
|---|---|
| **OS** | Windows 11 |
| **CPU** | Intel Core i5-10200H @ 2.40GHz |
| **RAM** | 8 GB |
| **GPU** | NVIDIA GeForce GTX 1650 (4GB VRAM) + Intel UHD |
| **Python** | 3.12.10 (primary), 3.14.3 |
| **Node.js** | v22.18.0 |
| **npm** | 10.9.3 |
| **Git** | 2.50.1 |
| **pip** | 25.0.1 |
| **Ollama** | NOT INSTALLED (install karna padega) |

---

## Tech Stack Discussion

### AI (Sab Local)
- **LLM:** Ollama + lightweight model (Phi-3 Mini ya Llama 3.2 3B) — 8GB RAM aur 4GB VRAM ke liye optimized
- **Emotion Detection:** Local sentiment analysis model
- **Voice to Text:** Whisper (locally) — pehle text, baad mein voice
- **Memory/Context:** RAG (Retrieval Augmented Generation) — purani entries smart tarike se AI ko dena

### Frontend (Web — pehle yahi)
- **Framework:** React / Next.js
- **Styling:** Tailwind CSS
- **Design:** Clean, minimal, calming (dark mode bhi)

### Backend
- **Server:** Python FastAPI ya Node.js Express
- **Database:** SQLite (local, free, no setup)
- **AI Server:** Ollama (localhost pe chalega)

### Mobile (Baad mein)
- React Native ya Flutter
- PC backend se connect karega

---

## Challenges Discussed

### 1. Local LLM + 8GB RAM
- Bade models (Llama 3 8B = ~5GB RAM) tight honge
- **Solution:** Chhote optimized models use karenge — Phi-3 Mini (3.8B), Llama 3.2 3B
- GTX 1650 (4GB VRAM) se GPU acceleration milega

### 2. AI ki Memory
- Saari entries ek saath bhejoge toh context window bhar jayega
- **Solution:** RAG system — entries ko embed karke store karo, relevant entries hi AI ko do

### 3. Personalized Friend-like Chat
- AI ko empathetic banana, robotic nahi
- User ke writing style, emotions, patterns samajhna
- **Solution:** Custom system prompts + user profile build karna entries se

### 4. Privacy & Security
- Bahut sensitive personal data hai
- Sab local hai toh internet pe kuch nahi jayega — good
- Local encryption bhi add karenge

### 5. Voice (Future)
- Whisper local mein GPU se fast chalta hai
- Hinglish (Hindi + English mix) support thoda challenging
- **Solution:** Whisper large model ya fine-tuned version

---

## What's Installed vs What's Needed

| Tool | Status |
|---|---|
| Python 3.12 | Installed |
| Node.js 22 | Installed |
| npm | Installed |
| Git | Installed |
| pip | Installed |
| **Ollama** | **INSTALL KARNA HAI** |
| **SQLite** | Python ke saath aata hai (built-in) |
| **React/Next.js** | npm se install karenge |
| **Tailwind CSS** | npm se install karenge |
| **Whisper** | Baad mein install karenge |

---

*Last Updated: 2026-03-03*
*Project Status: Discussion Complete — Ready for Phase 1*
