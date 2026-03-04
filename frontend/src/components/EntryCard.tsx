"use client";

import { motion } from "framer-motion";

const moodConfig: Record<string, { dot: string; label: string }> = {
  happy: { dot: "bg-mood-happy", label: "Happy" },
  sad: { dot: "bg-mood-sad", label: "Sad" },
  anxious: { dot: "bg-mood-anxious", label: "Anxious" },
  angry: { dot: "bg-mood-angry", label: "Angry" },
  calm: { dot: "bg-mood-calm", label: "Calm" },
  neutral: { dot: "bg-mood-neutral", label: "Neutral" },
  loved: { dot: "bg-mood-loved", label: "Loved" },
};

interface EntryCardProps {
  id: string;
  date: string;
  preview: string;
  mood: string;
  wordCount: number;
  index?: number;
}

export default function EntryCard({ date, preview, mood, wordCount, index = 0 }: EntryCardProps) {
  const m = moodConfig[mood] || moodConfig.neutral;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="p-4 rounded-lg bg-bg-card border border-border hover:border-border-hover transition-colors cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-text-muted text-xs">{date}</span>
        <span className="flex items-center gap-1.5 text-xs text-text-secondary">
          <span className={`w-2 h-2 rounded-full ${m.dot}`} />
          {m.label}
        </span>
      </div>
      <p className="text-text-primary/85 line-clamp-2 text-sm leading-relaxed">
        {preview}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-text-muted text-xs">{wordCount} words</span>
        <span className="text-accent text-xs opacity-0 group-hover:opacity-100 transition-opacity">
          Read →
        </span>
      </div>
    </motion.div>
  );
}
