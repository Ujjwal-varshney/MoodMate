"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Music, ChevronDown, ChevronUp } from "lucide-react";
import { getRecommendations } from "@/lib/recommendations";

interface MoodRecommendationCardProps {
  mood: string;
}

export default function MoodRecommendationCard({ mood }: MoodRecommendationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<"quotes" | "songs">("quotes");
  const recs = getRecommendations(mood);

  return (
    <div className="card-elevated rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-bg-hover transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-accent text-sm">✨</span>
          <span className="text-sm font-medium text-text-primary">Mood Recommendations</span>
        </div>
        {expanded ? <ChevronUp size={14} className="text-text-muted" /> : <ChevronDown size={14} className="text-text-muted" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border">
              {/* Tabs */}
              <div className="flex border-b border-border">
                <button
                  onClick={() => setTab("quotes")}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
                    tab === "quotes" ? "text-accent border-b-2 border-accent" : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  <Quote size={12} /> Quotes
                </button>
                <button
                  onClick={() => setTab("songs")}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
                    tab === "songs" ? "text-accent border-b-2 border-accent" : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  <Music size={12} /> Songs
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <AnimatePresence mode="wait">
                  {tab === "quotes" ? (
                    <motion.div key="quotes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                      {recs.quotes.map((q, i) => (
                        <div key={i} className="p-3 rounded-md bg-bg-hover/50">
                          <p className="text-text-primary text-sm italic leading-relaxed">&ldquo;{q.text}&rdquo;</p>
                          {q.author && <p className="text-text-muted text-xs mt-1.5">— {q.author}</p>}
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div key="songs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                      {recs.songs.map((s, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-bg-hover/50">
                          <div className="w-8 h-8 rounded-lg bg-accent-dim flex items-center justify-center flex-shrink-0">
                            <Music size={14} className="text-accent" />
                          </div>
                          <div>
                            <p className="text-text-primary text-sm font-medium">{s.text}</p>
                            {s.artist && <p className="text-text-muted text-xs">{s.artist}</p>}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
