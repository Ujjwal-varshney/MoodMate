export interface Milestone {
  id: string;
  icon: string;
  title: string;
  description: string;
  check: (stats: { total_entries: number; streak: number; longest_streak: number }) => boolean;
}

export const milestones: Milestone[] = [
  {
    id: "streak-7",
    icon: "🔥",
    title: "Week Warrior",
    description: "7-day journaling streak! You're building a habit.",
    check: (s) => s.streak >= 7 || s.longest_streak >= 7,
  },
  {
    id: "streak-30",
    icon: "⚡",
    title: "Monthly Master",
    description: "30-day streak! Journaling is part of your life now.",
    check: (s) => s.streak >= 30 || s.longest_streak >= 30,
  },
  {
    id: "streak-100",
    icon: "👑",
    title: "Centurion",
    description: "100-day streak! You're truly dedicated.",
    check: (s) => s.streak >= 100 || s.longest_streak >= 100,
  },
  {
    id: "entries-10",
    icon: "📝",
    title: "Getting Started",
    description: "10 entries written! Your journal is growing.",
    check: (s) => s.total_entries >= 10,
  },
  {
    id: "entries-50",
    icon: "📖",
    title: "Reflector",
    description: "50 entries! You're a dedicated reflector.",
    check: (s) => s.total_entries >= 50,
  },
  {
    id: "entries-100",
    icon: "📚",
    title: "Storyteller",
    description: "100 entries! What an incredible journey.",
    check: (s) => s.total_entries >= 100,
  },
];

const SEEN_KEY = "moodmate_milestones_seen";

function getSeenIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getEarnedMilestones(stats: { total_entries: number; streak: number; longest_streak: number }) {
  return milestones.filter((m) => m.check(stats));
}

export function getNewMilestones(stats: { total_entries: number; streak: number; longest_streak: number }) {
  const seen = getSeenIds();
  return getEarnedMilestones(stats).filter((m) => !seen.includes(m.id));
}

export function markMilestoneSeen(id: string) {
  const seen = getSeenIds();
  if (!seen.includes(id)) {
    seen.push(id);
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  }
}
