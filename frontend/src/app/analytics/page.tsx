"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { apiGetStats, apiGetMoodTrends } from "@/lib/api";
import {
  PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const moodColors: Record<string, string> = {
  happy: "#8abf7e",
  sad: "#7b9fc9",
  anxious: "#c9a84c",
  angry: "#c97b7b",
  calm: "#7bc9b5",
  loved: "#c97bb5",
  neutral: "#9e9e9e",
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

interface TrendDay {
  date: string;
  entries: number;
  dominant_mood: string;
  moods: Record<string, number>;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<{ moods: Record<string, number> } | null>(null);
  const [trends, setTrends] = useState<TrendDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiGetStats(), apiGetMoodTrends(30)])
      .then(([s, t]) => {
        setStats(s);
        setTrends(t);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pieData = stats?.moods
    ? Object.entries(stats.moods).map(([mood, count]) => ({
        name: moodLabels[mood] || mood,
        value: count,
        color: moodColors[mood] || moodColors.neutral,
      }))
    : [];

  const areaData = trends.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    entries: d.entries,
    mood: moodLabels[d.dominant_mood] || d.dominant_mood,
  }));

  // Weekly summary
  const thisWeekEntries = trends
    .filter((d) => {
      const date = new Date(d.date);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return date >= weekAgo;
    });
  const weekTotal = thisWeekEntries.reduce((sum, d) => sum + d.entries, 0);
  const weekMoods: Record<string, number> = {};
  thisWeekEntries.forEach((d) => {
    Object.entries(d.moods).forEach(([m, c]) => {
      weekMoods[m] = (weekMoods[m] || 0) + c;
    });
  });
  const topWeekMood = Object.entries(weekMoods).sort((a, b) => b[1] - a[1])[0]?.[0];

  if (loading) {
    return (
      <PageTransition>
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-40 bg-bg-card rounded" />
            <div className="h-64 bg-bg-card rounded-xl" />
            <div className="h-64 bg-bg-card rounded-xl" />
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-text-primary">Analytics</h2>
          <p className="text-text-secondary text-sm mt-1">Insights into your journaling patterns</p>
        </div>

        {/* Weekly Summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="card-elevated p-4 rounded-xl">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">This week</p>
            <p className="text-text-primary font-semibold text-2xl">{weekTotal}</p>
            <p className="text-text-muted text-xs">entries</p>
          </div>
          <div className="card-elevated p-4 rounded-xl">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Top mood</p>
            <div className="flex items-center gap-2">
              {topWeekMood && (
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: moodColors[topWeekMood] || moodColors.neutral }}
                />
              )}
              <p className="text-text-primary font-semibold text-lg">
                {topWeekMood ? moodLabels[topWeekMood] || topWeekMood : "—"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Mood Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-5 rounded-xl mb-6"
        >
          <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4">Mood Distribution</h3>
          {pieData.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--text-primary)",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-text-secondary text-xs">
                      {d.name} ({d.value})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-text-muted text-sm text-center py-8">No mood data yet</p>
          )}
        </motion.div>

        {/* Mood Trends */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-5 rounded-xl"
        >
          <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4">
            Entry Trends (Last 30 Days)
          </h3>
          {areaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="entries"
                  stroke="var(--accent)"
                  fill="var(--accent)"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-text-muted text-sm text-center py-8">No trend data yet</p>
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}
