"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PenLine, ArrowRight, Sparkles, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiCreateEntry } from "@/lib/api";

const ONBOARDING_KEY = "moodmate_onboarding_done";

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(ONBOARDING_KEY)) {
      router.push("/");
    }
  }, [router]);

  const handleWriteEntry = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      await apiCreateEntry({ title: title || undefined, content, mood: "auto" });
      setStep(2);
    } catch {
      // continue anyway
      setStep(2);
    } finally {
      setSaving(false);
    }
  };

  const handleFinish = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg-primary">
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-6"
              >
                <span className="text-bg-primary font-bold text-2xl">M</span>
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary mb-3">
                Welcome, {user?.name || "friend"}!
              </h1>
              <p className="text-text-secondary text-sm leading-relaxed max-w-sm mx-auto mb-8">
                MoodMate is your personal journaling companion. Write your thoughts, track your moods, and get AI-powered insights into your emotional well-being.
              </p>
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-lg bg-accent text-bg-primary text-sm font-medium hover:bg-accent-hover transition-colors inline-flex items-center gap-2"
              >
                Get started <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent-dim flex items-center justify-center mx-auto mb-4">
                  <PenLine size={18} className="text-accent" />
                </div>
                <h2 className="text-xl font-semibold text-text-primary mb-1">Write your first entry</h2>
                <p className="text-text-secondary text-sm">How are you feeling right now? No pressure - just write.</p>
              </div>

              <input
                type="text"
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent text-lg font-medium text-text-primary placeholder:text-text-muted border-none outline-none mb-3"
              />
              <div className="card-elevated rounded-xl p-4 mb-4">
                <textarea
                  placeholder="What's on your mind today?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-40 bg-transparent text-text-primary/90 placeholder:text-text-muted text-sm leading-relaxed border-none outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-accent-dim border border-accent-border text-accent text-xs font-medium w-fit mb-5">
                <Sparkles size={14} />
                AI will detect your mood
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleWriteEntry}
                  disabled={!content.trim() || saving}
                  className="px-5 py-2.5 rounded-lg bg-accent text-bg-primary text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-40 flex items-center gap-2"
                >
                  {saving ? "Saving..." : "Save & Continue"}
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 text-text-muted text-sm hover:text-text-secondary transition-colors"
                >
                  Skip for now
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                className="text-5xl mb-4"
              >
                <Check className="w-16 h-16 text-accent mx-auto p-3 bg-accent-dim rounded-full" />
              </motion.div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">You&apos;re all set!</h2>
              <p className="text-text-secondary text-sm leading-relaxed max-w-sm mx-auto mb-6">
                Here are some tips to get the most out of MoodMate:
              </p>
              <div className="text-left max-w-sm mx-auto space-y-3 mb-8">
                <div className="flex items-start gap-3 text-sm">
                  <span className="text-accent mt-0.5">1.</span>
                  <p className="text-text-secondary">Write daily to build a journaling streak</p>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <span className="text-accent mt-0.5">2.</span>
                  <p className="text-text-secondary">Chat with MoodMate when you need someone to talk to</p>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <span className="text-accent mt-0.5">3.</span>
                  <p className="text-text-secondary">Check Analytics to discover your mood patterns</p>
                </div>
              </div>
              <button
                onClick={handleFinish}
                className="px-6 py-3 rounded-lg bg-accent text-bg-primary text-sm font-medium hover:bg-accent-hover transition-colors inline-flex items-center gap-2"
              >
                Start Journaling <ArrowRight size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === step ? "w-6 bg-accent" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
