"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

interface Notif {
  id: number;
  emoji: string;
  title: string;
  body: string;
  cta?: string;
  route?: string;
}

// Zomato / Swiggy style funny shayari & one-liners for journaling
const NOTIFICATIONS: Omit<Notif, "id">[] = [
  // Hindi shayari style
  {
    emoji: "📝",
    title: "Dil ki baat",
    body: "Dil mein jo hai woh kagaz pe likh do, warna mood bhi bolega — 'mujhe koi samajhta nahi' 😤",
    cta: "Likh do abhi",
    route: "/write",
  },
  {
    emoji: "🌙",
    title: "Shaam ho gayi",
    body: "Suno, din bhar itna kiya lekin apne liye 2 minute nahi nikale? Journal likh lo, dil halka hoga ✨",
    cta: "Chalo likhte hain",
    route: "/write",
  },
  {
    emoji: "☕",
    title: "Chai pe charcha?",
    body: "Chai toh pi li, ab zindagi ka hisaab bhi likh lo. Ek entry = ek therapy session FREE 🫖",
    cta: "Free therapy lo",
    route: "/write",
  },
  {
    emoji: "🧠",
    title: "Brain bolta hai...",
    body: "Itne thoughts head mein ghoom rahe hain, parking ke paise lagenge. Journal mein unload karo! 🅿️",
    cta: "Unload karo",
    route: "/write",
  },
  {
    emoji: "💭",
    title: "Aaj ka mood kya hai?",
    body: "Khush ho? Sad ho? Ya 'pata nahi yaar' wala mood hai? Jo bhi hai, likh do — AI samjhega 🤖",
    cta: "Mood batao",
    route: "/write",
  },
  {
    emoji: "🔥",
    title: "Streak mat todo!",
    body: "Tumhara journal streak chal raha hai! Aaj skip kiya toh streak bolega 'tu mujhe deserve nahi karta' 💔",
    cta: "Streak bachao",
    route: "/write",
  },
  {
    emoji: "🌟",
    title: "2 minute ka kaam hai",
    body: "Netflix ke liye 2 ghante hain, journal ke liye 2 minute nahi? Priorities check karo boss 😏",
    cta: "2 min do",
    route: "/write",
  },
  {
    emoji: "🎭",
    title: "Feelings ka traffic jam",
    body: "Andar itni feelings hain ki signal tod ke nikal rahi hain. Journal mein green signal do 🚦",
    cta: "Signal do",
    route: "/write",
  },
  {
    emoji: "📖",
    title: "Dear Diary...",
    body: "Diary bol rahi hai — 'itne din baad yaad aaya? Chal koi nahi, likh de kuch' 😅",
    cta: "Likh do kuch",
    route: "/write",
  },
  {
    emoji: "🎯",
    title: "Self-care reminder",
    body: "Skincare karte ho, haircare karte ho, par mindcare? Aaj journal likh ke apna khayal rakho 💆",
    cta: "Mindcare karo",
    route: "/write",
  },
  {
    emoji: "🌸",
    title: "Subah ki baat",
    body: "Good morning! Uthte hi phone scroll karne se acha, 3 lines likh do — mood set ho jayega 🌅",
    cta: "3 lines likho",
    route: "/write",
  },
  {
    emoji: "🤔",
    title: "Overthinking alert!",
    body: "Dimaag mein 47 tabs khule hain? Sab journal mein paste karo aur browser band karo 🧹",
    cta: "Tabs band karo",
    route: "/write",
  },
  {
    emoji: "💪",
    title: "Champion ho tum!",
    body: "Pata hai tum kitne strong ho? Nahi pata? Purani entries padho — khud pe proud feel hoga 🏆",
    cta: "Entries dekho",
    route: "/entries",
  },
  {
    emoji: "🎵",
    title: "Dard-e-journal",
    body: "Dard tha toh gaana suna, ab dard hai toh journal likho. Beats therapy is writing therapy 🎶",
    cta: "Likh do",
    route: "/write",
  },
  {
    emoji: "🌈",
    title: "Mood check!",
    body: "Analytics mein dekho apna mood pattern — kya pata tum Tuesday ko zyada happy rehte ho 📊",
    cta: "Analytics dekho",
    route: "/analytics",
  },
];

let notifCounter = 0;

export default function NotificationToast() {
  const [notifications, setNotifications] = useState<Notif[]>([]);
  const router = useRouter();

  const showRandomNotif = useCallback(() => {
    const template = NOTIFICATIONS[Math.floor(Math.random() * NOTIFICATIONS.length)];
    const notif: Notif = { ...template, id: ++notifCounter };
    setNotifications((prev) => [...prev.slice(-2), notif]); // max 3
    // Auto dismiss after 8 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
    }, 8000);
  }, []);

  useEffect(() => {
    // Show first notification after 30 seconds
    const initial = setTimeout(() => showRandomNotif(), 30000);
    // Then every 3-5 minutes randomly
    const interval = setInterval(
      () => showRandomNotif(),
      (180 + Math.random() * 120) * 1000
    );
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [showRandomNotif]);

  const dismiss = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleCta = (notif: Notif) => {
    dismiss(notif.id);
    if (notif.route) router.push(notif.route);
  };

  return (
    <div className="fixed bottom-20 lg:bottom-4 right-4 z-50 flex flex-col gap-2 max-w-[340px]">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Top accent bar */}
            <div className="h-0.5 bg-gradient-to-r from-accent via-mood-happy to-mood-loved" />

            <div className="p-3.5">
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">{notif.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-text-primary">{notif.title}</p>
                    <button
                      onClick={() => dismiss(notif.id)}
                      className="p-0.5 rounded hover:bg-bg-hover text-text-muted hover:text-text-secondary transition-colors flex-shrink-0"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <p className="text-[11px] leading-relaxed text-text-secondary mb-2.5">{notif.body}</p>
                  {notif.cta && (
                    <button
                      onClick={() => handleCta(notif)}
                      className="flex items-center gap-1.5 text-[11px] font-medium text-accent hover:text-accent-hover transition-colors"
                    >
                      <Pencil size={10} />
                      {notif.cta}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
