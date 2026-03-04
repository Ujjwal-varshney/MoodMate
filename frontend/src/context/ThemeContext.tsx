"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "light" | "midnight";

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const themes: Record<Theme, Record<string, string>> = {
  dark: {
    "--bg-primary": "#0f0e0c",
    "--bg-secondary": "#161513",
    "--bg-card": "#1c1b18",
    "--bg-hover": "#24231f",
    "--bg-input": "#1a1916",
    "--accent": "#c9a87c",
    "--accent-hover": "#dbbf9a",
    "--accent-dim": "rgba(201, 168, 124, 0.08)",
    "--accent-border": "rgba(201, 168, 124, 0.15)",
    "--text-primary": "#ece8e1",
    "--text-secondary": "#a09a90",
    "--text-muted": "#5c5850",
    "--border": "#262420",
    "--border-hover": "#343230",
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
    "--text-primary": "#e1e3ec",
    "--text-secondary": "#8a8ea0",
    "--text-muted": "#505468",
    "--border": "#202030",
    "--border-hover": "#2e2e42",
  },
};

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
