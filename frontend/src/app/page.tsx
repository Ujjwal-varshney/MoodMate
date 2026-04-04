"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PenLine, MessageCircle, Flame, BookOpen, Trophy, Sparkles } from "lucide-react";
import EntryCard from "@/components/EntryCard";
import MilestoneModal from "@/components/MilestoneModal";
import PageTransition from "@/components/PageTransition";
import { EntryListSkeleton, StatSkeleton } from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";
import { apiGetEntries, apiGetStats } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { getEarnedMilestones, getNewMilestones, markMilestoneSeen } from "@/lib/milestones";
import type { Milestone } from "@/lib/milestones";
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
  const [stats, setStats] = useState({ total_entries: 0, streak: 0, longest_streak: 0 });
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    apiGetEntries()
      .then(setEntries)
      .catch(() => {})
      .finally(() => setLoadingEntries(false));
    apiGetStats()
      .then((s) => {
        setStats(s);
        const newOnes = getNewMilestones(s);
        if (newOnes.length > 0) {
          setActiveMilestone(newOnes[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  }, []);

  const handleMilestoneClose = () => {
    if (activeMilestone) {
      markMilestoneSeen(activeMilestone.id);
    }
    setActiveMilestone(null);
  };

  const earned = getEarnedMilestones(stats);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        {/* Greeting */}
        <div className="mb-8 sm:mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight"
          >
            {greeting()}, {user?.name || "friend"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-text-muted text-sm mt-1.5"
          >
            {today}
          </motion.p>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 sm:mb-10"
        >
          {loadingStats ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
            </>
          ) : (
            <>
              <div className="card-elevated p-4 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                  <BookOpen size={16} className="text-accent" />
                </div>
                <p className="text-text-primary font-bold text-2xl leading-tight">{stats.total_entries}</p>
                <p className="text-text-muted text-xs mt-0.5">Total Entries</p>
              </div>

              <div className="card-elevated p-4 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-mood-happy/10 flex items-center justify-center mb-3">
                  <Flame size={16} className="text-mood-happy" />
                </div>
                <p className="text-text-primary font-bold text-2xl leading-tight">
                  {stats.streak}
                  <span className="text-sm font-normal text-text-muted ml-1">day{stats.streak !== 1 ? "s" : ""}</span>
                </p>
                <p className="text-text-muted text-xs mt-0.5">Current Streak</p>
              </div>

              {stats.longest_streak > stats.streak && (
                <div className="card-elevated p-4 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-mood-calm/10 flex items-center justify-center mb-3">
                    <Trophy size={16} className="text-mood-calm" />
                  </div>
                  <p className="text-text-primary font-bold text-2xl leading-tight">
                    {stats.longest_streak}
                    <span className="text-sm font-normal text-text-muted ml-1">day{stats.longest_streak !== 1 ? "s" : ""}</span>
                  </p>
                  <p className="text-text-muted text-xs mt-0.5">Best Streak</p>
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Milestone badges */}
        {!loadingStats && earned.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex gap-2 flex-wrap mb-8 sm:mb-10"
          >
            {earned.map((m) => (
              <span
                key={m.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium card-elevated text-text-secondary"
                style={{ boxShadow: "var(--shadow-sm)" }}
              >
                <span>{m.icon}</span>
                {m.title}
              </span>
            ))}
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 sm:mb-10"
        >
          <Link href="/write">
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-xl border border-accent/20 bg-accent/[0.04] hover:bg-accent/[0.08] transition-all cursor-pointer group"
              style={{ boxShadow: "0 2px 12px rgba(201, 168, 124, 0.06)" }}
            >
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
                <PenLine size={18} className="text-accent" />
              </div>
              <p className="text-text-primary text-sm font-semibold">Write entry</p>
              <p className="text-text-muted text-xs mt-1">What&apos;s on your mind today?</p>
            </motion.div>
          </Link>
          <Link href="/chat">
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="card-elevated p-5 rounded-xl cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-mood-calm/10 flex items-center justify-center mb-3 group-hover:bg-mood-calm/15 transition-colors">
                <MessageCircle size={18} className="text-mood-calm" />
              </div>
              <p className="text-text-primary text-sm font-semibold">Talk to MoodMate</p>
              <p className="text-text-muted text-xs mt-1">Chat with your AI friend</p>
            </motion.div>
          </Link>
        </motion.div>

        {/* Recent Entries */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Recent entries</h3>
            <Link href="/entries" className="text-accent text-xs font-medium hover:text-accent-hover transition-colors">
              View all →
            </Link>
          </div>
          {loadingEntries ? (
            <EntryListSkeleton count={3} />
          ) : entries.length > 0 ? (
            <div className="space-y-2.5">
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
            <div className="text-center py-16 card-elevated rounded-xl">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={20} className="text-accent" />
              </div>
              <p className="text-text-secondary text-sm font-medium">No entries yet</p>
              <p className="text-text-muted text-xs mt-1 mb-4">Start your journaling journey today</p>
              <Link href="/write" className="btn-accent text-xs inline-flex items-center gap-1.5 px-4 py-2.5">
                Write your first entry <PenLine size={14} />
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      <MilestoneModal milestone={activeMilestone} onClose={handleMilestoneClose} />
    </PageTransition>
  );
}
