"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, PenLine, MessageCircle, Calendar, Archive, LogOut, Settings, X, Sun, Moon, Monitor } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/write", label: "Write", icon: PenLine },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/entries", label: "Entries", icon: Archive },
];

const themeOptions = [
  { value: "dark" as const, label: "Dark", icon: Moon },
  { value: "light" as const, label: "Light", icon: Sun },
  { value: "midnight" as const, label: "Midnight", icon: Monitor },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showThemes, setShowThemes] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleNav = () => {
    onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-[240px] bg-bg-secondary border-r border-border flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-2 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" onClick={handleNav}>
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <span className="text-bg-primary font-bold text-sm">M</span>
            </div>
            <span className="text-text-primary font-semibold text-[15px] tracking-tight">MoodMate</span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 text-text-muted hover:text-text-primary">
            <X size={18} />
          </button>
        </div>

        {/* User */}
        {user && (
          <div className="mx-4 mt-3 mb-2 px-3 py-2.5 rounded-lg bg-bg-card border border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center text-accent font-medium text-xs shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-text-primary text-sm font-medium truncate leading-tight">{user.name}</p>
                <p className="text-text-muted text-[11px] truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 mt-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNav}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                  isActive
                    ? "bg-accent-dim text-accent"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Theme Picker */}
        <AnimatePresence>
          {showThemes && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 overflow-hidden"
            >
              <div className="p-2 rounded-lg bg-bg-card border border-border mb-2">
                <p className="text-text-muted text-[10px] uppercase tracking-wider font-medium px-2 mb-1.5">Theme</p>
                {themeOptions.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => { setTheme(t.value); setShowThemes(false); }}
                    className={`flex items-center gap-2.5 w-full px-2 py-2 rounded-md text-sm transition-colors ${
                      theme === t.value
                        ? "bg-accent-dim text-accent"
                        : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                    }`}
                  >
                    <t.icon size={15} />
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom */}
        <div className="px-3 pb-4 space-y-0.5">
          <button
            onClick={() => setShowThemes(!showThemes)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors w-full text-sm"
          >
            <Settings size={18} strokeWidth={1.5} />
            <span>Theme</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted hover:text-mood-angry hover:bg-mood-angry/5 transition-colors w-full text-sm"
          >
            <LogOut size={18} strokeWidth={1.5} />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// Mobile bottom nav
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-border flex items-center justify-around py-2 px-4 z-40 lg:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
              isActive ? "text-accent" : "text-text-muted"
            }`}
          >
            <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
