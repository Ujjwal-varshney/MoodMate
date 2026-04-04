"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "light" | "midnight" | "forest" | "rose" | "ocean" | "lavender" | "ember";

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const themes: Record<Theme, Record<string, string>> = {
  dark: {
    "--bg-primary": "#0a0a0b",
    "--bg-secondary": "#111113",
    "--bg-card": "#18181b",
    "--bg-hover": "#1f1f23",
    "--bg-input": "#141416",
    "--accent": "#c9a87c",
    "--accent-hover": "#dbbf9a",
    "--accent-dim": "rgba(201, 168, 124, 0.08)",
    "--accent-border": "rgba(201, 168, 124, 0.15)",
    "--accent-glow": "rgba(201, 168, 124, 0.12)",
    "--text-primary": "#f0ece4",
    "--text-secondary": "#a09a90",
    "--text-muted": "#5c5850",
    "--border": "#262420",
    "--border-hover": "#3a3830",
  },
  light: {
    "--bg-primary": "#f8f6f3",
    "--bg-secondary": "#ffffff",
    "--bg-card": "#ffffff",
    "--bg-hover": "#f0ede8",
    "--bg-input": "#f4f2ef",
    "--accent": "#8b6b3d",
    "--accent-hover": "#a07d4a",
    "--accent-dim": "rgba(139, 107, 61, 0.06)",
    "--accent-border": "rgba(139, 107, 61, 0.15)",
    "--accent-glow": "rgba(139, 107, 61, 0.1)",
    "--text-primary": "#1a1816",
    "--text-secondary": "#6b6560",
    "--text-muted": "#a09a94",
    "--border": "#e5e0d8",
    "--border-hover": "#d0cac0",
  },
  midnight: {
    "--bg-primary": "#0a0a10",
    "--bg-secondary": "#101018",
    "--bg-card": "#161622",
    "--bg-hover": "#1e1e2e",
    "--bg-input": "#131320",
    "--accent": "#7c8cc9",
    "--accent-hover": "#99a6d9",
    "--accent-dim": "rgba(124, 140, 201, 0.08)",
    "--accent-border": "rgba(124, 140, 201, 0.15)",
    "--accent-glow": "rgba(124, 140, 201, 0.12)",
    "--text-primary": "#e1e3ec",
    "--text-secondary": "#8a8ea0",
    "--text-muted": "#505468",
    "--border": "#202030",
    "--border-hover": "#2e2e42",
  },
  forest: {
    "--bg-primary": "#0b100d",
    "--bg-secondary": "#111a14",
    "--bg-card": "#162019",
    "--bg-hover": "#1d2a20",
    "--bg-input": "#131c15",
    "--accent": "#6dbf7b",
    "--accent-hover": "#8ad496",
    "--accent-dim": "rgba(109, 191, 123, 0.08)",
    "--accent-border": "rgba(109, 191, 123, 0.15)",
    "--accent-glow": "rgba(109, 191, 123, 0.12)",
    "--text-primary": "#e4ede6",
    "--text-secondary": "#8fa893",
    "--text-muted": "#4e6652",
    "--border": "#1e2e22",
    "--border-hover": "#2c4030",
  },
  rose: {
    "--bg-primary": "#100a0c",
    "--bg-secondary": "#181113",
    "--bg-card": "#201819",
    "--bg-hover": "#2a1f21",
    "--bg-input": "#1a1214",
    "--accent": "#d4899a",
    "--accent-hover": "#e2a3b2",
    "--accent-dim": "rgba(212, 137, 154, 0.08)",
    "--accent-border": "rgba(212, 137, 154, 0.15)",
    "--accent-glow": "rgba(212, 137, 154, 0.12)",
    "--text-primary": "#ede4e6",
    "--text-secondary": "#a8909a",
    "--text-muted": "#665058",
    "--border": "#2e2024",
    "--border-hover": "#402e34",
  },
  ocean: {
    "--bg-primary": "#080c10",
    "--bg-secondary": "#0e1318",
    "--bg-card": "#141a22",
    "--bg-hover": "#1a222c",
    "--bg-input": "#111820",
    "--accent": "#5ba4d9",
    "--accent-hover": "#7db8e4",
    "--accent-dim": "rgba(91, 164, 217, 0.08)",
    "--accent-border": "rgba(91, 164, 217, 0.15)",
    "--accent-glow": "rgba(91, 164, 217, 0.12)",
    "--text-primary": "#e1e8f0",
    "--text-secondary": "#8a9aad",
    "--text-muted": "#4a5a6e",
    "--border": "#1c2430",
    "--border-hover": "#283444",
  },
  lavender: {
    "--bg-primary": "#0d0a10",
    "--bg-secondary": "#141118",
    "--bg-card": "#1a1620",
    "--bg-hover": "#221e2a",
    "--bg-input": "#161220",
    "--accent": "#a98ad4",
    "--accent-hover": "#bea4e2",
    "--accent-dim": "rgba(169, 138, 212, 0.08)",
    "--accent-border": "rgba(169, 138, 212, 0.15)",
    "--accent-glow": "rgba(169, 138, 212, 0.12)",
    "--text-primary": "#e8e4f0",
    "--text-secondary": "#9a90a8",
    "--text-muted": "#585066",
    "--border": "#242030",
    "--border-hover": "#342e44",
  },
  ember: {
    "--bg-primary": "#100a08",
    "--bg-secondary": "#181110",
    "--bg-card": "#201816",
    "--bg-hover": "#2a201c",
    "--bg-input": "#1a1210",
    "--accent": "#d9885b",
    "--accent-hover": "#e4a37d",
    "--accent-dim": "rgba(217, 136, 91, 0.08)",
    "--accent-border": "rgba(217, 136, 91, 0.15)",
    "--accent-glow": "rgba(217, 136, 91, 0.12)",
    "--text-primary": "#f0e8e4",
    "--text-secondary": "#a8968a",
    "--text-muted": "#665850",
    "--border": "#2e2420",
    "--border-hover": "#403430",
  },
};

export const themeList: { value: Theme; label: string; color: string }[] = [
  { value: "dark", label: "Dark", color: "#c9a87c" },
  { value: "light", label: "Light", color: "#8b6b3d" },
  { value: "midnight", label: "Midnight", color: "#7c8cc9" },
  { value: "forest", label: "Forest", color: "#6dbf7b" },
  { value: "rose", label: "Rosé", color: "#d4899a" },
  { value: "ocean", label: "Ocean", color: "#5ba4d9" },
  { value: "lavender", label: "Lavender", color: "#a98ad4" },
  { value: "ember", label: "Ember", color: "#d9885b" },
];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("moodmate_theme") as Theme;
    if (saved && themes[saved]) setThemeState(saved);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("moodmate_theme", t);
  };

  useEffect(() => {
    const root = document.documentElement;
    const vars = themes[theme];
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
