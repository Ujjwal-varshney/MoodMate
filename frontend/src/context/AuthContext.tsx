"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiLogin, apiSignup, apiMe } from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("moodmate_token");
    if (token) {
      apiMe()
        .then((u) => setUser(u))
        .catch(() => {
          localStorage.removeItem("moodmate_token");
          localStorage.removeItem("moodmate_user");
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      const data = await apiLogin(email, password);
      localStorage.setItem("moodmate_token", data.token);
      localStorage.setItem("moodmate_user", JSON.stringify(data.user));
      setUser(data.user);
      return null;
    } catch (e: unknown) {
      return e instanceof Error ? e.message : "Login failed";
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<string | null> => {
    try {
      const data = await apiSignup(name, email, password);
      localStorage.setItem("moodmate_token", data.token);
      localStorage.setItem("moodmate_user", JSON.stringify(data.user));
      setUser(data.user);
      return null;
    } catch (e: unknown) {
      return e instanceof Error ? e.message : "Signup failed";
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("moodmate_token");
    localStorage.removeItem("moodmate_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
