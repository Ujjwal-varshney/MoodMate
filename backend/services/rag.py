import chromadb
from sentence_transformers import SentenceTransformer

# Lazy-loaded singletons
_model: SentenceTransformer | None = None
_collection = None


def _get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def _get_collection():
    global _collection
    if _collection is None:
        client = chromadb.PersistentClient(path="./chromadb_data")
        _collection = client.get_or_create_collection(
            name="diary_entries",
            metadata={"hnsw:space": "cosine"},
        )
    return _collection


def add_entry(entry_id: int, user_id: int, content: str, mood: str, created_at: str):
    """Embed and store a diary entry in ChromaDB."""
    model = _get_model()
    collection = _get_collection()

    doc_id = f"entry_{entry_id}"
    embedding = model.encode(content).tolist()

    # Upsert so updates work too
    collection.upsert(
        ids=[doc_id],
        embeddings=[embedding],
        documents=[content],
        metadatas=[{
            "entry_id": entry_id,
            "user_id": user_id,
            "mood": mood,
            "created_at": created_at,
        }],
    )


def remove_entry(entry_id: int):
    """Remove an entry from ChromaDB."""
    collection = _get_collection()
    doc_id = f"entry_{entry_id}"
    try:
        collection.delete(ids=[doc_id])
    except Exception:
        pass


def search_similar(query: str, user_id: int, top_k: int = 5) -> list[dict]:
    """Find most relevant diary entries for a query."""
    model = _get_model()
    collection = _get_collection()

    embedding = model.encode(query).tolist()

    results = collection.query(
        query_embeddings=[embedding],
        n_results=top_k,
        where={"user_id": user_id},
    )

    entries = []
    if results and results["documents"] and results["documents"][0]:
        for i, doc in enumerate(results["documents"][0]):
            meta = results["metadatas"][0][i] if results["metadatas"] else {}
            distance = results["distances"][0][i] if results["distances"] else 0
            entries.append({
                "content": doc,
                "mood": meta.get("mood", ""),
                "created_at": meta.get("created_at", ""),
                "entry_id": meta.get("entry_id", 0),
                "relevance": round(1 - distance, 3),
            })

    return entries


def embed_all_entries(db_session):
    """Bulk-embed all existing entries (for initial setup / migration)."""
    from models import Entry

    entries = db_session.query(Entry).all()
    model = _get_model()
    collection = _get_collection()

    if not entries:
        return 0

    ids = []
    embeddings = []
    documents = []
    metadatas = []

    for e in entries:
        ids.append(f"entry_{e.id}")
        embeddings.append(model.encode(e.content).tolist())
        documents.append(e.content)
        metadatas.append({
            "entry_id": e.id,
            "user_id": e.user_id,
            "mood": e.mood,
            "created_at": e.created_at.isoformat(),
        })

    collection.upsert(ids=ids, embeddings=embeddings, documents=documents, metadatas=metadatas)
    return len(entries)
