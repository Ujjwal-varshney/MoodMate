"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Sparkles, Lock, Zap } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/Loader";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signup } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);

    const err = await signup(name, email, password);
    if (!err) {
      router.push("/onboarding");
    } else {
      setError(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-15%] right-[-5%] w-[450px] h-[450px] rounded-full bg-mood-calm/[0.03] blur-[100px]" />
        <div className="absolute bottom-[-15%] left-[-5%] w-[350px] h-[350px] rounded-full bg-accent/[0.03] blur-[100px]" />
      </div>

      {/* Left - Branding */}
      <div className="hidden lg:flex w-1/2 bg-bg-secondary items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--accent) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }} />

        <div className="absolute top-32 left-20 w-28 h-28 rounded-full bg-mood-loved/[0.06] blur-[35px] animate-float" />
        <div className="absolute bottom-24 right-24 w-20 h-20 rounded-full bg-accent/[0.06] blur-[25px] animate-float" style={{ animationDelay: "1.5s" }} />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-md px-12 relative z-10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-8"
            style={{ boxShadow: "0 8px 32px rgba(201, 168, 124, 0.25)" }}
          >
            <span className="text-bg-primary font-bold text-xl">M</span>
          </motion.div>

          <h1 className="text-5xl font-bold text-text-primary leading-[1.15] tracking-tight">
            Start your<br />journey to<br />
            <span className="text-accent relative">
              self-discovery.
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute -bottom-1 left-0 h-[2px] bg-accent/30 rounded-full"
              />
            </span>
          </h1>
          <p className="text-text-secondary mt-6 text-lg leading-relaxed">
            Every great story begins with a single entry. Yours starts today.
          </p>

          <div className="mt-10 flex flex-col gap-3">
            {[
              { icon: Sparkles, text: "Emotion Detection", desc: "AI understands how you feel" },
              { icon: Lock, text: "Fully Offline", desc: "No internet needed, ever" },
              { icon: Zap, text: "Instant Insights", desc: "Mood patterns at a glance" },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-card/50 border border-border/50"
              >
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <item.icon size={16} className="text-accent" />
                </div>
                <div>
                  <p className="text-text-primary text-sm font-medium">{item.text}</p>
                  <p className="text-text-muted text-xs">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center" style={{ boxShadow: "0 4px 16px rgba(201, 168, 124, 0.2)" }}>
              <span className="text-bg-primary font-bold text-base">M</span>
            </div>
            <span className="text-text-primary font-semibold text-lg tracking-tight">MoodMate</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">Create your space</h2>
            <p className="text-text-secondary mt-1.5 text-sm">Set up your MoodMate account</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-2 block">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should we call you?"
                required
                className="input-glow w-full text-sm"
              />
            </div>

            <div>
              <label className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-glow w-full text-sm"
              />
            </div>

            <div>
              <label className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  className="input-glow w-full text-sm pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-mood-angry text-sm bg-mood-angry/[0.08] border border-mood-angry/15 rounded-xl px-4 py-2.5"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-accent w-full py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none mt-2"
            >
              {loading ? <Spinner size={16} /> : <>Create account <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center mt-8 text-text-muted text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:text-accent-hover transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
