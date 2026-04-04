"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Quote, Music } from "lucide-react";
import { useState } from "react";
import { getRecommendations } from "@/lib/recommendations";

const moodLabels: Record<string, string> = {
  happy: "Happy", sad: "Sad", anxious: "Anxious", angry: "Angry",
  calm: "Calm", loved: "Loved", neutral: "Neutral",
};

interface MoodRecommendationModalProps {
  mood: string | null;
  onClose: () => void;
}

export default function MoodRecommendationModal({ mood, onClose }: MoodRecommendationModalProps) {
  const [tab, setTab] = useState<"quotes" | "songs">("quotes");

  if (!mood) return null;
  const recs = getRecommendations(mood);

  return (
    <AnimatePresence>
      {mood && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-bg-secondary border border-border rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h3 className="text-text-primary font-semibold">Entry saved!</h3>
                <p className="text-text-muted text-xs mt-0.5">
                  Mood detected: <span className="text-accent font-medium">{moodLabels[mood] || mood}</span>
                </p>
              </div>
              <button onClick={onClose} className="p-1 text-text-muted hover:text-text-primary transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setTab("quotes")}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
                  tab === "quotes" ? "text-accent border-b-2 border-accent" : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <Quote size={12} /> Quotes for you
              </button>
              <button
                onClick={() => setTab("songs")}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
                  tab === "songs" ? "text-accent border-b-2 border-accent" : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <Music size={12} /> Songs for you
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto space-y-3">
              <AnimatePresence mode="wait">
                {tab === "quotes" ? (
                  <motion.div key="quotes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                    {recs.quotes.map((q, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="p-3 rounded-lg bg-bg-card border border-border"
                      >
                        <p className="text-text-primary text-sm italic leading-relaxed">&ldquo;{q.text}&rdquo;</p>
                        {q.author && <p className="text-text-muted text-xs mt-1.5">— {q.author}</p>}
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div key="songs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                    {recs.songs.map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-bg-card border border-border"
                      >
                        <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center flex-shrink-0">
                          <Music size={16} className="text-accent" />
                        </div>
                        <div>
                          <p className="text-text-primary text-sm font-medium">{s.text}</p>
                          {s.artist && <p className="text-text-muted text-xs">{s.artist}</p>}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-border">
              <button onClick={onClose} className="w-full px-4 py-2.5 rounded-lg bg-accent text-bg-primary text-sm font-medium hover:bg-accent-hover transition-colors">
                Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
