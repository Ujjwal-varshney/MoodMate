"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, PenLine, MessageCircle, Calendar, Archive, BarChart3, Bell, BellOff, LogOut, Palette, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme, themeList } from "@/context/ThemeContext";
import { isNotificationSupported, isReminderEnabled, setReminderEnabled, requestNotificationPermission } from "@/lib/notifications";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/write", label: "Write", icon: PenLine },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/entries", label: "Entries", icon: Archive },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];


export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showThemes, setShowThemes] = useState(false);
  const [reminderOn, setReminderOn] = useState(false);
  const [showNotifSupport, setShowNotifSupport] = useState(false);

  useEffect(() => {
    setReminderOn(isReminderEnabled());
    setShowNotifSupport(isNotificationSupported());
  }, []);

  const toggleReminder = async () => {
    if (!reminderOn) {
      const granted = await requestNotificationPermission();
      if (!granted) return;
    }
    const next = !reminderOn;
    setReminderEnabled(next);
    setReminderOn(next);
  };

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-[250px] bg-bg-secondary border-r border-border flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-2 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" onClick={handleNav}>
            <div
              className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shrink-0"
              style={{ boxShadow: "0 4px 12px rgba(201, 168, 124, 0.2)" }}
            >
              <span className="text-bg-primary font-bold text-sm">M</span>
            </div>
            <span className="text-text-primary font-bold text-[15px] tracking-tight">MoodMate</span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-hover transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* User */}
        {user && (
          <div className="mx-4 mt-3 mb-2 px-3 py-3 rounded-xl bg-bg-card border border-border" style={{ boxShadow: "var(--shadow-sm)" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent font-semibold text-xs shrink-0 ring-2 ring-accent/10">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-text-primary text-sm font-semibold truncate leading-tight">{user.name}</p>
                <p className="text-text-muted text-[11px] truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 mt-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNav}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${
                  isActive
                    ? "bg-accent/[0.08] text-accent font-medium"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                }`}
                style={isActive ? { boxShadow: "inset 0 0 0 1px rgba(201, 168, 124, 0.1)" } : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-accent"
                    style={{ boxShadow: "0 0 8px rgba(201, 168, 124, 0.4)" }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                <span>{item.label}</span>
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
              <div className="p-3 rounded-xl bg-bg-card border border-border mb-2" style={{ boxShadow: "var(--shadow-sm)" }}>
                <p className="text-text-muted text-[10px] uppercase tracking-wider font-semibold mb-2.5">Theme</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {themeList.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => { setTheme(t.value); }}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all ${
                        theme === t.value
                          ? "bg-accent/[0.1] ring-1 ring-accent/30"
                          : "hover:bg-bg-hover"
                      }`}
                      title={t.label}
                    >
                      <div
                        className="w-5 h-5 rounded-full shrink-0"
                        style={{
                          background: t.color,
                          boxShadow: theme === t.value ? `0 0 8px ${t.color}50, 0 0 0 2px var(--bg-card), 0 0 0 3.5px ${t.color}` : undefined,
                        }}
                      />
                      <span className={`text-[9px] leading-none ${theme === t.value ? "text-accent font-semibold" : "text-text-muted"}`}>
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom */}
        <div className="px-3 pb-4 space-y-0.5 border-t border-border/50 pt-3 mt-2">
          <button
            onClick={() => setShowThemes(!showThemes)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-all w-full text-sm"
          >
            <Palette size={18} strokeWidth={1.5} />
            <span>Themes</span>
            <div
              className="w-3 h-3 rounded-full ml-auto"
              style={{ background: themeList.find(t => t.value === theme)?.color }}
            />
          </button>
          {showNotifSupport && (
            <button
              onClick={toggleReminder}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-all w-full text-sm"
            >
              {reminderOn ? <Bell size={18} strokeWidth={1.5} /> : <BellOff size={18} strokeWidth={1.5} />}
              <span>{reminderOn ? "Reminders on" : "Reminders off"}</span>
            </button>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-muted hover:text-mood-angry hover:bg-mood-angry/[0.06] transition-all w-full text-sm"
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
    <nav className="fixed bottom-0 left-0 right-0 glass-card flex items-center justify-around py-2 px-4 z-40 lg:hidden"
      style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
              isActive ? "text-accent" : "text-text-muted"
            }`}
          >
            <div className="relative">
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-dot"
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                  style={{ boxShadow: "0 0 6px rgba(201, 168, 124, 0.5)" }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
