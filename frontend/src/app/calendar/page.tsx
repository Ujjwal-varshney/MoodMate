"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { apiGetCalendarEntries } from "@/lib/api";
import { formatDate } from "@/lib/utils";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
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

export default function CalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-indexed
  const [entries, setEntries] = useState<Record<string, EntryData[]>>({});
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const today = now.getDate();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;

  useEffect(() => {
    setLoading(true);
    setSelectedDay(null);
    apiGetCalendarEntries(year, month)
      .then(setEntries)
      .catch(() => setEntries({}))
      .finally(() => setLoading(false));
  }, [year, month]);

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  // Calendar grid calculations
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selectedEntries = selectedDay ? entries[String(selectedDay)] || [] : [];

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-text-primary">Calendar</h2>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-bg-hover text-text-secondary transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <h3 className="text-text-primary font-medium text-sm">
            {MONTH_NAMES[month - 1]} {year}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-bg-hover text-text-secondary transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-bg-card border border-border rounded-lg p-3 sm:p-4 mb-5">
          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-text-muted text-[10px] font-medium uppercase tracking-wider py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} className="aspect-square" />;
              }

              const dayEntries = entries[String(day)] || [];
              const hasEntries = dayEntries.length > 0;
              const isToday = isCurrentMonth && day === today;
              const isSelected = selectedDay === day;

              // Get unique moods for this day
              const moods = [...new Set(dayEntries.map((e) => e.mood))];

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-sm transition-all relative ${
                    isSelected
                      ? "bg-accent-dim border border-accent-border text-accent"
                      : isToday
                        ? "bg-accent/10 text-accent font-medium"
                        : hasEntries
                          ? "hover:bg-bg-hover text-text-primary cursor-pointer"
                          : "text-text-muted"
                  }`}
                >
                  <span className="text-xs">{day}</span>
                  {hasEntries && (
                    <div className="flex gap-0.5">
                      {moods.slice(0, 3).map((mood, mi) => (
                        <span
                          key={mi}
                          className={`w-1.5 h-1.5 rounded-full ${moodDots[mood] || moodDots.neutral}`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Entries */}
        <AnimatePresence mode="wait">
          {selectedDay !== null && (
            <motion.div
              key={selectedDay}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h4 className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-3">
                {MONTH_NAMES[month - 1]} {selectedDay}, {year}
                <span className="text-text-muted ml-2">
                  {selectedEntries.length} {selectedEntries.length === 1 ? "entry" : "entries"}
                </span>
              </h4>

              {selectedEntries.length > 0 ? (
                <div className="space-y-2">
                  {selectedEntries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-bg-card border border-border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-text-muted text-xs">
                          {formatDate(entry.created_at)}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                          <span className={`w-2 h-2 rounded-full ${moodDots[entry.mood] || moodDots.neutral}`} />
                          {moodLabels[entry.mood] || "Neutral"}
                        </span>
                      </div>
                      {entry.title && (
                        <p className="text-text-primary text-sm font-medium mb-1">{entry.title}</p>
                      )}
                      <p className="text-text-primary/85 line-clamp-3 text-sm leading-relaxed">
                        {entry.content}
                      </p>
                      <p className="text-text-muted text-xs mt-2">{entry.word_count} words</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-border border-dashed rounded-lg">
                  <p className="text-text-muted text-sm">No entries on this day</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-4">
            <p className="text-text-muted text-sm">Loading entries...</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
