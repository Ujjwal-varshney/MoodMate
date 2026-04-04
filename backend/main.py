from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes.auth_routes import router as auth_router
from routes.entry_routes import router as entry_router
from routes.chat_routes import router as chat_router
from routes.stats_routes import router as stats_router
from routes.mood_routes import router as mood_router
from routes.search_routes import router as search_router
from routes.improve_routes import router as improve_router
from routes.export_routes import router as export_router
from routes.tag_routes import router as tag_router
from routes.rag_routes import router as rag_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MoodMate API")

# CORS — allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth_router)
app.include_router(entry_router)
app.include_router(chat_router)
app.include_router(stats_router)
app.include_router(mood_router)
app.include_router(search_router)
app.include_router(improve_router)
app.include_router(export_router)
app.include_router(tag_router)
app.include_router(rag_router)


@app.get("/")
def root():
    return {"status": "MoodMate API running"}
