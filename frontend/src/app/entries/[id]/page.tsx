"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Edit3, Trash2, Save, X, Download } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import MoodRecommendationCard from "@/components/MoodRecommendationCard";
import ExportModal from "@/components/ExportModal";
import { apiGetEntry, apiUpdateEntry, apiDeleteEntry } from "@/lib/api";
import { formatDate } from "@/lib/utils";

const moodOptions = [
  { value: "happy", label: "Happy", dot: "bg-mood-happy" },
  { value: "sad", label: "Sad", dot: "bg-mood-sad" },
  { value: "anxious", label: "Anxious", dot: "bg-mood-anxious" },
  { value: "angry", label: "Angry", dot: "bg-mood-angry" },
  { value: "calm", label: "Calm", dot: "bg-mood-calm" },
  { value: "loved", label: "Loved", dot: "bg-mood-loved" },
  { value: "neutral", label: "Neutral", dot: "bg-mood-neutral" },
];

const moodDots: Record<string, string> = {
  happy: "bg-mood-happy",
  sad: "bg-mood-sad",
  anxious: "bg-mood-anxious",
  angry: "bg-mood-angry",
  calm: "bg-mood-calm",
  loved: "bg-mood-loved",
  neutral: "bg-mood-neutral",
};

const moodLabels: Record<string, string> = {
  happy: "Happy",
  sad: "Sad",
  anxious: "Anxious",
  angry: "Angry",
  calm: "Calm",
  loved: "Loved",
  neutral: "Neutral",
};

interface EntryData {
  id: number;
  title: string;
  content: string;
  mood: string;
  word_count: number;
  created_at: string;
  updated_at: string;
}

export default function EntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [entry, setEntry] = useState<EntryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExport, setShowExport] = useState(false);

  // Edit state
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editMood, setEditMood] = useState("");

  useEffect(() => {
    if (!id) return;
    apiGetEntry(id)
      .then((data) => {
        setEntry(data);
        setEditTitle(data.title);
        setEditContent(data.content);
        setEditMood(data.mood);
      })
      .catch(() => router.push("/entries"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleSave = async () => {
    if (!entry) return;
    setSaving(true);
    try {
      const updated = await apiUpdateEntry(entry.id, {
        title: editTitle,
        content: editContent,
        mood: editMood,
      });
      setEntry(updated);
      setEditing(false);
    } catch {
      // keep editing
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!entry) return;
    try {
      await apiDeleteEntry(entry.id);
      router.push("/entries");
    } catch {
      setShowDeleteConfirm(false);
    }
  };

  const cancelEdit = () => {
    if (!entry) return;
    setEditTitle(entry.title);
    setEditContent(entry.content);
    setEditMood(entry.mood);
    setEditing(false);
  };

  const wordCount = editing
    ? editContent.trim() ? editContent.trim().split(/\s+/).length : 0
    : entry?.word_count || 0;

  if (loading) {
    return (
      <PageTransition>
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-32 bg-bg-card rounded" />
            <div className="h-8 w-2/3 bg-bg-card rounded" />
            <div className="h-40 bg-bg-card rounded-xl" />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!entry) return null;

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/entries"
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to entries
          </Link>
          <div className="flex items-center gap-2">
            {!editing && (
              <>
                <button
                  onClick={() => setShowExport(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover border border-border transition-colors"
                >
                  <Download size={14} />
                  Export
                </button>
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover border border-border transition-colors"
                >
                  <Edit3 size={14} />
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-mood-angry/70 hover:text-mood-angry hover:bg-mood-angry/5 border border-border transition-colors"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </>
            )}
            {editing && (
              <>
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover border border-border transition-colors"
                >
                  <X size={14} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !editContent.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-accent text-bg-primary hover:bg-accent-hover transition-colors disabled:opacity-40"
                >
                  <Save size={14} />
                  {saving ? "Saving..." : "Save"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Date & Mood */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-text-muted text-sm">{formatDate(entry.created_at)}</span>
          {!editing && (
            <span className="flex items-center gap-1.5 text-xs text-text-secondary px-2 py-1 rounded-md card-elevated">
              <span className={`w-2 h-2 rounded-full ${moodDots[entry.mood] || moodDots.neutral}`} />
              {moodLabels[entry.mood] || "Neutral"}
            </span>
          )}
        </div>

        {/* Mood picker (edit mode) */}
        {editing && (
          <div className="flex gap-2 flex-wrap mb-4">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setEditMood(mood.value)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                  editMood === mood.value
                    ? "border-accent/30 bg-accent-dim text-accent"
                    : "border-border bg-bg-card text-text-secondary hover:border-border-hover"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${mood.dot}`} />
                {mood.label}
              </button>
            ))}
          </div>
        )}

        {/* Title */}
        {editing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title (optional)"
            className="w-full bg-transparent text-lg font-medium text-text-primary placeholder:text-text-muted border-none outline-none mb-4"
          />
        ) : entry.title ? (
          <h1 className="text-lg font-medium text-text-primary mb-4">{entry.title}</h1>
        ) : null}

        {/* Content */}
        {editing ? (
          <div className="card-elevated rounded-xl p-4 sm:p-5 mb-4">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-56 sm:h-72 bg-transparent text-text-primary/90 text-sm leading-relaxed border-none outline-none resize-none"
            />
          </div>
        ) : (
          <div className="card-elevated rounded-xl p-4 sm:p-5 mb-4">
            <p className="text-text-primary/90 text-sm leading-relaxed whitespace-pre-wrap">
              {entry.content}
            </p>
          </div>
        )}

        {/* Word count */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-text-muted text-xs">{wordCount} words</span>
        </div>

        {/* Mood Recommendations */}
        {!editing && entry.mood && (
          <div className="mb-4">
            <MoodRecommendationCard mood={entry.mood} />
          </div>
        )}

        <ExportModal open={showExport} onClose={() => setShowExport(false)} entryId={entry.id} />

        {/* Delete confirmation */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDeleteConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-bg-secondary border border-border rounded-xl p-6 max-w-sm w-full"
              >
                <h3 className="text-text-primary font-semibold mb-2">Delete entry?</h3>
                <p className="text-text-secondary text-sm mb-5">
                  This action cannot be undone. This entry will be permanently deleted.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 rounded-md text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover border border-border transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-md text-sm bg-mood-angry text-white hover:bg-mood-angry/90 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
