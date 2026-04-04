"use client";

import EntryCard from "@/components/EntryCard";
import PageTransition from "@/components/PageTransition";
import { EntryListSkeleton } from "@/components/Loader";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, Download } from "lucide-react";
import ExportModal from "@/components/ExportModal";
import { apiGetEntries, apiSearchEntries } from "@/lib/api";
import { formatDate } from "@/lib/utils";

interface EntryData {
  id: number;
  title: string;
  content: string;
  mood: string;
  word_count: number;
  created_at: string;
}

const moods = ["all", "happy", "sad", "anxious", "angry", "calm", "loved", "neutral"];

export default function EntriesPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState<EntryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiMode, setAiMode] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const fetchEntries = useCallback(() => {
    setLoading(true);
    if (aiMode && search.trim()) {
      apiSearchEntries(search)
        .then(setEntries)
        .catch(() => {
          // Fallback to regular search
          apiGetEntries(filter, search).then(setEntries).catch(() => {});
        })
        .finally(() => setLoading(false));
    } else {
      apiGetEntries(filter, search)
        .then(setEntries)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [filter, search, aiMode]);

  useEffect(() => {
    const delay = aiMode && search ? 500 : search ? 300 : 0;
    const timer = setTimeout(fetchEntries, delay);
    return () => clearTimeout(timer);
  }, [fetchEntries, search, aiMode]);

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-text-primary">Entries</h2>
          <div className="flex items-center justify-between mt-1">
            <p className="text-text-secondary text-sm">
              {loading ? "Loading..." : `${entries.length} journal entries`}
            </p>
            <button
              onClick={() => setShowExport(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-text-secondary hover:text-text-primary border border-border hover:border-border-hover transition-colors"
            >
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        <div className="relative mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={aiMode ? "Ask anything... e.g., 'when was I last happy'" : "Search entries..."}
            className="w-full pl-9 pr-20 py-2.5 rounded-xl bg-bg-card border border-border text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-accent/30 transition-colors"
          />
          <button
            onClick={() => setAiMode(!aiMode)}
            className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
              aiMode
                ? "bg-accent-dim text-accent border border-accent-border"
                : "text-text-muted hover:text-text-secondary border border-transparent"
            }`}
          >
            <Sparkles size={12} />
            AI
          </button>
        </div>

        <div className="flex gap-1.5 mb-6 flex-wrap">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setFilter(m)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
                filter === m
                  ? "bg-accent-dim text-accent border border-accent-border"
                  : "bg-bg-card border border-border text-text-secondary hover:border-border-hover"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {loading ? (
          <EntryListSkeleton count={4} />
        ) : entries.length > 0 ? (
          <div className="space-y-2">
            {entries.map((entry, i) => (
              <EntryCard
                key={entry.id}
                id={String(entry.id)}
                date={formatDate(entry.created_at)}
                preview={entry.content}
                mood={entry.mood}
                wordCount={entry.word_count}
                index={i}
              />
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <p className="text-text-muted text-sm">No entries found</p>
          </motion.div>
        )}
        <ExportModal open={showExport} onClose={() => setShowExport(false)} />
      </div>
    </PageTransition>
  );
}
