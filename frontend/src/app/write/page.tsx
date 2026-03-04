"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import { apiCreateEntry } from "@/lib/api";

const moodOptions = [
  { value: "happy", label: "Happy", dot: "bg-mood-happy" },
  { value: "sad", label: "Sad", dot: "bg-mood-sad" },
  { value: "anxious", label: "Anxious", dot: "bg-mood-anxious" },
  { value: "angry", label: "Angry", dot: "bg-mood-angry" },
  { value: "calm", label: "Calm", dot: "bg-mood-calm" },
  { value: "loved", label: "Loved", dot: "bg-mood-loved" },
  { value: "neutral", label: "Neutral", dot: "bg-mood-neutral" },
];

const moodLabels: Record<string, string> = {
  happy: "Happy",
  sad: "Sad",
  anxious: "Anxious",
  angry: "Angry",
  calm: "Calm",
  loved: "Loved",
  neutral: "Neutral",
};

const moodDots: Record<string, string> = {
  happy: "bg-mood-happy",
  sad: "bg-mood-sad",
  anxious: "bg-mood-anxious",
  angry: "bg-mood-angry",
  calm: "bg-mood-calm",
  loved: "bg-mood-loved",
  neutral: "bg-mood-neutral",
};

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [manualMode, setManualMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [detectedMood, setDetectedMood] = useState("");
  const router = useRouter();

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const isAutoMode = !manualMode && !selectedMood;

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      const mood = isAutoMode ? "auto" : selectedMood;
      const result = await apiCreateEntry({ title: title || undefined, content, mood });
      setDetectedMood(result.mood);
      setSaving(false);
      setSaved(true);
      setTimeout(() => router.push("/"), 1500);
    } catch {
      setSaving(false);
    }
  };

  const toggleManual = () => {
    if (manualMode) {
      setManualMode(false);
      setSelectedMood("");
    } else {
      setManualMode(true);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-text-primary">New entry</h2>
          <p className="text-text-secondary text-sm mt-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            {" · "}
            {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
          </p>
        </div>

        {/* Mood Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-text-secondary text-xs font-medium uppercase tracking-wider">Mood</label>
            <button
              onClick={toggleManual}
              className="text-text-muted text-xs hover:text-text-secondary transition-colors flex items-center gap-1"
            >
              {manualMode ? "Let AI detect" : "Choose manually"}
              <ChevronDown size={12} className={`transition-transform ${manualMode ? "rotate-180" : ""}`} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {manualMode ? (
              <motion.div
                key="manual"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2 flex-wrap"
              >
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                      selectedMood === mood.value
                        ? "border-accent/30 bg-accent-dim text-accent"
                        : "border-border bg-bg-card text-text-secondary hover:border-border-hover"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${mood.dot}`} />
                    {mood.label}
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-accent-dim border border-accent-border text-accent text-xs font-medium w-fit"
              >
                <Sparkles size={14} />
                AI will detect your mood
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-lg font-medium text-text-primary placeholder:text-text-muted border-none outline-none mb-4"
        />

        <div className="bg-bg-card border border-border rounded-lg p-4 sm:p-5 mb-4">
          <textarea
            placeholder="What happened today? How did it make you feel? Write anything — this is your safe space..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-56 sm:h-72 bg-transparent text-text-primary/90 placeholder:text-text-muted text-sm leading-relaxed border-none outline-none resize-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-text-muted text-xs">{wordCount} words</span>
          <button
            onClick={handleSave}
            disabled={!content.trim() || saving || saved}
            className="px-5 py-2 rounded-md bg-accent text-bg-primary text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <AnimatePresence mode="wait">
              {saved && detectedMood ? (
                <motion.span
                  key="done"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5"
                >
                  <span className={`w-2 h-2 rounded-full ${moodDots[detectedMood] || moodDots.neutral}`} />
                  {moodLabels[detectedMood] || "Saved"}
                  <Check size={14} />
                </motion.span>
              ) : saved ? (
                <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5">
                  <Check size={14} /> Saved
                </motion.span>
              ) : saving ? (
                <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {isAutoMode ? "Detecting mood..." : "Saving..."}
                </motion.span>
              ) : (
                <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Save entry</motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
