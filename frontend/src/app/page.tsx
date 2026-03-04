"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PenLine, MessageCircle, Flame, BookOpen } from "lucide-react";
import EntryCard from "@/components/EntryCard";
import PageTransition from "@/components/PageTransition";
import { EntryListSkeleton, StatSkeleton } from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";
import { apiGetEntries, apiGetStats } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";

interface EntryData {
  id: number;
  title: string;
  content: string;
  mood: string;
  word_count: number;
  created_at: string;
}

export default function Home() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<EntryData[]>([]);
  const [stats, setStats] = useState({ total_entries: 0, streak: 0 });
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    apiGetEntries()
      .then(setEntries)
      .catch(() => {})
      .finally(() => setLoadingEntries(false));
    apiGetStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-text-primary">
            Welcome back, {user?.name || "friend"}
          </h2>
          <p className="text-text-secondary text-sm mt-1">{today}</p>
        </div>

        {/* Stats */}
        <div className="flex gap-4 sm:gap-6 mb-8 sm:mb-10">
          {loadingStats ? (
            <>
              <StatSkeleton />
              <div className="w-px bg-border" />
              <StatSkeleton />
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center shrink-0">
                  <BookOpen size={16} className="text-accent" />
                </div>
                <div>
                  <p className="text-text-primary font-semibold text-lg leading-tight">{stats.total_entries}</p>
                  <p className="text-text-muted text-xs">Entries</p>
                </div>
              </div>
              <div className="w-px bg-border" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center shrink-0">
                  <Flame size={16} className="text-accent" />
                </div>
                <div>
                  <p className="text-text-primary font-semibold text-lg leading-tight">{stats.streak} day{stats.streak !== 1 ? "s" : ""}</p>
                  <p className="text-text-muted text-xs">Streak</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 sm:mb-10">
          <Link href="/write">
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="p-4 rounded-lg border border-accent-border bg-accent-dim hover:bg-accent/[0.06] transition-colors cursor-pointer">
              <PenLine size={18} className="text-accent mb-2.5" />
              <p className="text-text-primary text-sm font-medium">Write entry</p>
              <p className="text-text-muted text-xs mt-0.5">What&apos;s on your mind?</p>
            </motion.div>
          </Link>
          <Link href="/chat">
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="p-4 rounded-lg border border-border bg-bg-card hover:border-border-hover transition-colors cursor-pointer">
              <MessageCircle size={18} className="text-text-secondary mb-2.5" />
              <p className="text-text-primary text-sm font-medium">Talk to MoodMate</p>
              <p className="text-text-muted text-xs mt-0.5">Chat with your AI friend</p>
            </motion.div>
          </Link>
        </div>

        {/* Recent Entries */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">Recent entries</h3>
            <Link href="/entries" className="text-accent text-xs hover:text-accent-hover transition-colors">View all</Link>
          </div>
          {loadingEntries ? (
            <EntryListSkeleton count={3} />
          ) : entries.length > 0 ? (
            <div className="space-y-2">
              {entries.slice(0, 5).map((entry, i) => (
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
            <div className="text-center py-12 border border-border border-dashed rounded-lg">
              <p className="text-text-muted text-sm">No entries yet</p>
              <Link href="/write" className="text-accent text-sm mt-1 inline-block hover:text-accent-hover">Write your first entry →</Link>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
