"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const moodConfig: Record<string, { dot: string; label: string; emoji: string }> = {
  happy: { dot: "bg-mood-happy", label: "Happy", emoji: "😊" },
  sad: { dot: "bg-mood-sad", label: "Sad", emoji: "😔" },
  anxious: { dot: "bg-mood-anxious", label: "Anxious", emoji: "😰" },
  angry: { dot: "bg-mood-angry", label: "Angry", emoji: "😤" },
  calm: { dot: "bg-mood-calm", label: "Calm", emoji: "😌" },
  neutral: { dot: "bg-mood-neutral", label: "Neutral", emoji: "😐" },
  loved: { dot: "bg-mood-loved", label: "Loved", emoji: "🥰" },
};

interface EntryCardProps {
  id: string;
  date: string;
  preview: string;
  mood: string;
  wordCount: number;
  index?: number;
}

export default function EntryCard({ id, date, preview, mood, wordCount, index = 0 }: EntryCardProps) {
  const m = moodConfig[mood] || moodConfig.neutral;

  return (
    <Link href={`/entries/${id}`}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06, duration: 0.3 }}
        className="card-elevated p-4 rounded-xl cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-text-muted text-xs font-medium">{date}</span>
          <span className="flex items-center gap-1.5 text-xs text-text-secondary px-2.5 py-1 rounded-full bg-bg-hover/50">
            <span className="text-[11px]">{m.emoji}</span>
            {m.label}
          </span>
        </div>
        <p className="text-text-primary/85 line-clamp-2 text-sm leading-relaxed">
          {preview}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-text-muted text-xs">{wordCount} words</span>
          <span className="text-accent text-xs font-medium opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 -translate-x-1">
            Read →
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
