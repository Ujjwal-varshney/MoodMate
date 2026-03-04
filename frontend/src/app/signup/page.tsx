"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
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
      router.push("/");
    } else {
      setError(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex w-1/2 bg-bg-secondary items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--accent) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }} />
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md px-12 relative z-10"
        >
          <h1 className="text-5xl font-bold text-text-primary leading-tight">
            Start your<br />journey to<br /><span className="text-accent">self-discovery.</span>
          </h1>
          <p className="text-text-secondary mt-6 text-lg leading-relaxed">
            Every great story begins with a single entry. Yours starts today.
          </p>
        </motion.div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-bg-primary font-bold text-sm">M</span>
            </div>
            <span className="text-text-primary font-semibold tracking-tight">MoodMate</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-text-primary">Create your space</h2>
            <p className="text-text-secondary mt-1">Set up your MoodMate account</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-1.5 block">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should we call you?"
                required
                className="w-full px-4 py-3 rounded-lg bg-bg-input border border-border text-text-primary placeholder:text-text-muted text-sm outline-none transition-colors focus:border-accent/40"
              />
            </div>

            <div>
              <label className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-bg-input border border-border text-text-primary placeholder:text-text-muted text-sm outline-none transition-colors focus:border-accent/40"
              />
            </div>

            <div>
              <label className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-bg-input border border-border text-text-primary placeholder:text-text-muted text-sm outline-none transition-colors focus:border-accent/40 pr-11"
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
                className="text-mood-angry text-sm bg-mood-angry/5 border border-mood-angry/10 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-accent text-bg-primary font-medium text-sm flex items-center justify-center gap-2 hover:bg-accent-hover transition-colors disabled:opacity-50 mt-6"
            >
              {loading ? <Spinner size={16} /> : <>Create account <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center mt-8 text-text-muted text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:text-accent-hover transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
