"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Sparkles,
  ChevronDown,
  Wand2,
  Undo2,
  Type,
  Palette,
  Highlighter,
  Minus,
  Plus,
  X,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  CaseSensitive,
  Smile,
  Space,
  Lightbulb,
  RefreshCw,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import TemplateSelector from "@/components/TemplateSelector";
import TemplateEditor from "@/components/TemplateEditor";
import MoodRecommendationModal from "@/components/MoodRecommendationModal";
import { apiCreateEntry, apiImproveEntry } from "@/lib/api";
import { templateToContent, type Template } from "@/lib/templates";

// ─── Suggestions Data ─────────────────────────────────────────
const WRITING_PROMPTS = [
  {
    category: "✨ Start here",
    prompts: [
      "Aaj ka din ek word mein describe karo toh?",
      "What made you smile today — even a little?",
      "Agar aaj ka din ek color hota, which one?",
      "3 cheezein jo aaj achi hui...",
    ],
  },
  {
    category: "💭 Deep thoughts",
    prompts: [
      "What are you overthinking about right now?",
      "Koi ek baat jo aaj kisi se nahi keh paaye...",
      "If you could redo one moment today, which one?",
      "What would 'future you' say about today?",
    ],
  },
  {
    category: "🌊 Feelings",
    prompts: [
      "Right now mera mood hai _____ kyunki _____",
      "Something that stressed me out today...",
      "A moment when I felt truly peaceful today...",
      "Kisi ne aaj kuch aisa kaha jo dil ko touch kar gaya...",
    ],
  },
  {
    category: "🎯 Gratitude",
    prompts: [
      "One person I'm grateful for today and why...",
      "Ek choti si cheez jisne aaj mera din bana diya...",
      "What's something I take for granted but shouldn't?",
      "A comfort I enjoyed today that I want to remember...",
    ],
  },
  {
    category: "🔮 Looking ahead",
    prompts: [
      "Kal ke liye ek goal — bas ek, simple sa...",
      "What do I want to feel more of tomorrow?",
      "One thing I'll do differently tomorrow...",
      "A small win I'm aiming for this week...",
    ],
  },
];

// ─── Mood & Toolbar Data ──────────────────────────────────────
const moodOptions = [
  { value: "happy", label: "Happy", dot: "bg-mood-happy", emoji: "😊" },
  { value: "sad", label: "Sad", dot: "bg-mood-sad", emoji: "😔" },
  { value: "anxious", label: "Anxious", dot: "bg-mood-anxious", emoji: "😰" },
  { value: "angry", label: "Angry", dot: "bg-mood-angry", emoji: "😤" },
  { value: "calm", label: "Calm", dot: "bg-mood-calm", emoji: "😌" },
  { value: "loved", label: "Loved", dot: "bg-mood-loved", emoji: "🥰" },
  { value: "neutral", label: "Neutral", dot: "bg-mood-neutral", emoji: "😐" },
];

const moodLabels: Record<string, string> = {
  happy: "Happy", sad: "Sad", anxious: "Anxious", angry: "Angry",
  calm: "Calm", loved: "Loved", neutral: "Neutral",
};
const moodDots: Record<string, string> = {
  happy: "bg-mood-happy", sad: "bg-mood-sad", anxious: "bg-mood-anxious",
  angry: "bg-mood-angry", calm: "bg-mood-calm", loved: "bg-mood-loved",
  neutral: "bg-mood-neutral",
};

const FONT_SIZES = [
  { label: "Small", value: 12 },
  { label: "Medium", value: 14 },
  { label: "Large", value: 16 },
  { label: "XL", value: 18 },
  { label: "2XL", value: 22 },
];
const TEXT_COLORS = [
  { label: "Default", value: "", className: "bg-text-primary" },
  { label: "Blue", value: "#60a5fa", className: "bg-blue-400" },
  { label: "Green", value: "#4ade80", className: "bg-green-400" },
  { label: "Purple", value: "#c084fc", className: "bg-purple-400" },
  { label: "Rose", value: "#fb7185", className: "bg-rose-400" },
  { label: "Amber", value: "#fbbf24", className: "bg-amber-400" },
  { label: "Cyan", value: "#22d3ee", className: "bg-cyan-400" },
  { label: "White", value: "#f8fafc", className: "bg-slate-100" },
];
const HIGHLIGHT_COLORS = [
  { label: "None", value: "", className: "bg-transparent border border-border" },
  { label: "Yellow", value: "#fef08a20", className: "bg-yellow-200" },
  { label: "Green", value: "#bbf7d020", className: "bg-green-200" },
  { label: "Blue", value: "#bfdbfe20", className: "bg-blue-200" },
  { label: "Pink", value: "#fbcfe820", className: "bg-pink-200" },
  { label: "Orange", value: "#fed7aa20", className: "bg-orange-200" },
  { label: "Lavender", value: "#e9d5ff20", className: "bg-purple-200" },
];
const FONT_FAMILIES = [
  { label: "Sans", value: "ui-sans-serif, system-ui, sans-serif" },
  { label: "Serif", value: "ui-serif, Georgia, serif" },
  { label: "Mono", value: "ui-monospace, monospace" },
  { label: "Cursive", value: "'Segoe Script', 'Comic Sans MS', cursive" },
];
const LINE_HEIGHTS = [
  { label: "Tight", value: 1.4 },
  { label: "Normal", value: 1.6 },
  { label: "Relaxed", value: 1.8 },
  { label: "Loose", value: 2.2 },
];
const EMOJI_SETS = [
  ["😊", "😢", "😠", "😰", "😌", "❤️", "😐", "🎉", "💪", "🌟"],
  ["🌈", "☀️", "🌙", "🔥", "💭", "✨", "🎯", "💡", "🎵", "📝"],
  ["🤗", "😴", "🤔", "😤", "🥰", "😎", "🙏", "👏", "💖", "🌸"],
];

// ─── Component ────────────────────────────────────────────────
export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [manualMode, setManualMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [detectedMood, setDetectedMood] = useState("");
  const [improving, setImproving] = useState(false);
  const [originalContent, setOriginalContent] = useState<string | null>(null);
  const [improvedContent, setImprovedContent] = useState<string | null>(null);
  const [showDiff, setShowDiff] = useState(false);

  // Toolbar state
  const [fontSize, setFontSize] = useState(14);
  const [textColor, setTextColor] = useState("");
  const [highlightColor, setHighlightColor] = useState("");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");
  const [fontFamily, setFontFamily] = useState(FONT_FAMILIES[0].value);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [activeToolbarMenu, setActiveToolbarMenu] = useState<string | null>(null);

  // Suggestions panel
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);
  const [shuffledPrompts, setShuffledPrompts] = useState<string[][]>([]);

  // Templates
  const [showTemplates, setShowTemplates] = useState(true);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);

  // Recommendations modal
  const [showRecommendations, setShowRecommendations] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const isAutoMode = !manualMode && !selectedMood;

  // Shuffle prompts on mount
  useEffect(() => {
    const shuffled = WRITING_PROMPTS.map((cat) =>
      [...cat.prompts].sort(() => Math.random() - 0.5)
    );
    setShuffledPrompts(shuffled);
  }, []);

  const reshufflePrompts = () => {
    setShuffledPrompts(
      WRITING_PROMPTS.map((cat) =>
        [...cat.prompts].sort(() => Math.random() - 0.5)
      )
    );
  };

  const insertPrompt = (prompt: string) => {
    const prefix = content.trim() ? content + "\n\n" : "";
    setContent(prefix + prompt + " ");
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleTemplateSelect = (template: Template) => {
    setContent(templateToContent(template));
    setTitle(template.name);
    setShowTemplates(false);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleSkipTemplates = () => {
    setShowTemplates(false);
  };

  // ─── Handlers ─────────────────────────────────────────────
  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      const mood = isAutoMode ? "auto" : selectedMood;
      const result = await apiCreateEntry({ title: title || undefined, content, mood });
      setDetectedMood(result.mood);
      setSaving(false);
      setSaved(true);
      setShowRecommendations(true);
    } catch {
      setSaving(false);
    }
  };

  const handleRecommendationsClose = () => {
    setShowRecommendations(false);
    router.push("/");
  };

  const handleImprove = async () => {
    if (!content.trim() || improving) return;
    setImproving(true);
    try {
      const result = await apiImproveEntry(content);
      setOriginalContent(content);
      setImprovedContent(result.improved);
      setShowDiff(true);
    } catch {
      // keep original
    } finally {
      setImproving(false);
    }
  };

  const handleAcceptImprove = () => {
    if (improvedContent !== null) {
      setContent(improvedContent);
      setShowDiff(false);
    }
  };

  const handleRejectImprove = () => {
    setOriginalContent(null);
    setImprovedContent(null);
    setShowDiff(false);
  };

  const handleUndoImprove = () => {
    if (originalContent !== null) {
      setContent(originalContent);
      setOriginalContent(null);
      setImprovedContent(null);
    }
  };

  const toggleManual = () => {
    if (manualMode) { setManualMode(false); setSelectedMood(""); }
    else { setManualMode(true); }
  };

  const toggleToolbarMenu = (menu: string) => {
    setActiveToolbarMenu(activeToolbarMenu === menu ? null : menu);
  };

  const adjustFontSize = (delta: number) => {
    setFontSize((prev) => Math.min(28, Math.max(10, prev + delta)));
  };

  const insertEmoji = (emoji: string) => {
    const ta = textareaRef.current;
    if (!ta) { setContent((prev) => prev + emoji); return; }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newContent = content.slice(0, start) + emoji + content.slice(end);
    setContent(newContent);
    setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + emoji.length; ta.focus(); }, 0);
  };

  // ─── Diff helpers ─────────────────────────────────────────
  const computeDiff = (original: string, improved: string) => {
    const origSet = new Set(original.split(/(\s+)/).filter((w) => w.trim()));
    const impSet = new Set(improved.split(/(\s+)/).filter((w) => w.trim()));
    const removed: string[] = [];
    const added: string[] = [];
    origSet.forEach((w) => { if (!impSet.has(w)) removed.push(w); });
    impSet.forEach((w) => { if (!origSet.has(w)) added.push(w); });
    return { removed: new Set(removed), added: new Set(added) };
  };

  const renderDiffText = (text: string, diffSet: Set<string>, type: "removed" | "added") => {
    return text.split(/(\s+)/).map((word, i) => {
      if (!word.trim()) return <span key={i}>{word}</span>;
      const isChanged = diffSet.has(word);
      return (
        <span key={i} className={isChanged ? (type === "removed" ? "bg-red-500/20 text-red-400 line-through" : "bg-green-500/20 text-green-400") : ""}>
          {word}
        </span>
      );
    });
  };

  // ─── Toolbar helpers ──────────────────────────────────────
  const ToolBtn = ({ active, onClick, title: t, children }: { active?: boolean; onClick: () => void; title: string; children: React.ReactNode }) => (
    <button onClick={onClick} className={`p-1.5 rounded hover:bg-bg-hover transition-colors ${active ? "bg-bg-hover text-accent" : "text-text-muted hover:text-text-secondary"}`} title={t}>
      {children}
    </button>
  );
  const Divider = () => <div className="w-px h-4 bg-border mx-0.5" />;

  return (
    <PageTransition>
      <div className="flex gap-5 max-w-5xl mx-auto">

        {/* ═══════ Left Suggestions Panel ═══════ */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.aside
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 260 }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.25 }}
              className="hidden lg:block flex-shrink-0 overflow-hidden"
            >
              <div className="w-[260px] sticky top-8">
                <div className="card-elevated rounded-xl overflow-hidden">
                  {/* Panel Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-accent/[0.03]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-accent/15 flex items-center justify-center">
                        <Lightbulb size={12} className="text-accent" />
                      </div>
                      <span className="text-xs font-semibold text-text-primary">Writing Ideas</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={reshufflePrompts}
                        className="p-1.5 rounded-lg hover:bg-bg-hover text-text-muted hover:text-accent transition-colors"
                        title="Shuffle prompts"
                      >
                        <RefreshCw size={12} />
                      </button>
                      <button
                        onClick={() => setShowSuggestions(false)}
                        className="p-1.5 rounded-lg hover:bg-bg-hover text-text-muted hover:text-text-secondary transition-colors"
                        title="Hide panel"
                      >
                        <PanelLeftClose size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Category Tabs */}
                  <div className="flex flex-wrap gap-1 px-3 py-2.5 border-b border-border">
                    {WRITING_PROMPTS.map((cat, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveCategory(i)}
                        className={`px-2.5 py-1 text-[10px] whitespace-nowrap transition-all rounded-md ${
                          activeCategory === i
                            ? "bg-accent/10 text-accent font-semibold"
                            : "text-text-muted hover:text-text-secondary hover:bg-bg-hover"
                        }`}
                      >
                        {cat.category}
                      </button>
                    ))}
                  </div>

                  {/* Prompts List */}
                  <div className="p-2.5 max-h-[420px] overflow-y-auto">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="space-y-1"
                      >
                        {(shuffledPrompts[activeCategory] || WRITING_PROMPTS[activeCategory].prompts).map((prompt, pi) => (
                          <motion.button
                            key={pi}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: pi * 0.05 }}
                            onClick={() => insertPrompt(prompt)}
                            className="w-full text-left px-3 py-2.5 rounded-lg text-[11px] leading-relaxed text-text-secondary hover:bg-accent/[0.05] hover:text-text-primary transition-all group border border-transparent hover:border-accent/10"
                          >
                            <div className="flex items-start gap-2.5">
                              <ArrowRight size={10} className="mt-0.5 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                              <span>{prompt}</span>
                            </div>
                          </motion.button>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Tip */}
                  <div className="px-4 py-2.5 border-t border-border bg-bg-hover/30">
                    <p className="text-[10px] text-text-muted leading-relaxed">
                      Click any prompt to add it to your entry
                    </p>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ═══════ Main Editor ═══════ */}
        <div className="flex-1 min-w-0">
          {/* Show panel toggle when hidden */}
          {!showSuggestions && (
            <button
              onClick={() => setShowSuggestions(true)}
              className="hidden lg:flex items-center gap-2 mb-4 px-3 py-2 rounded-xl text-[11px] text-text-muted hover:text-accent border border-border hover:border-accent/20 hover:bg-accent/[0.03] transition-all"
            >
              <PanelLeftOpen size={13} />
              Show writing ideas
            </button>
          )}

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">New entry</h2>
            <p className="text-text-muted text-sm mt-1.5">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              {" · "}
              {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
            </p>
          </div>

          {/* Template Picker */}
          <AnimatePresence mode="wait">
            {showTemplates && !content && (
              <motion.div key="templates" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-text-secondary text-xs font-semibold uppercase tracking-wider">Start with a template</label>
                  <button onClick={handleSkipTemplates} className="text-text-muted text-xs hover:text-accent transition-colors">
                    Skip — blank entry
                  </button>
                </div>
                <TemplateSelector onSelect={handleTemplateSelect} onCreateNew={() => setShowTemplateEditor(true)} />
              </motion.div>
            )}
          </AnimatePresence>

          <TemplateEditor open={showTemplateEditor} onClose={() => setShowTemplateEditor(false)} onSaved={() => {}} />

          {/* Mood Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-text-secondary text-xs font-semibold uppercase tracking-wider">Mood</label>
              <button onClick={toggleManual} className="text-text-muted text-xs hover:text-accent transition-colors flex items-center gap-1">
                {manualMode ? "Let AI detect" : "Choose manually"}
                <ChevronDown size={12} className={`transition-transform ${manualMode ? "rotate-180" : ""}`} />
              </button>
            </div>
            <AnimatePresence mode="wait">
              {manualMode ? (
                <motion.div key="manual" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex gap-2 flex-wrap">
                  {moodOptions.map((mood) => (
                    <button key={mood.value} onClick={() => setSelectedMood(mood.value)} className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all ${selectedMood === mood.value ? "border-accent/30 bg-accent/[0.08] text-accent scale-105" : "border-border bg-bg-card text-text-secondary hover:border-border-hover hover:scale-[1.02]"}`} style={selectedMood === mood.value ? { boxShadow: "0 2px 8px rgba(201, 168, 124, 0.12)" } : undefined}>
                      <span className="text-base">{mood.emoji}</span>
                      {mood.label}
                    </button>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-accent/[0.06] border border-accent/15 text-accent text-xs font-medium w-fit" style={{ boxShadow: "0 0 12px rgba(201, 168, 124, 0.06)" }}>
                  <Sparkles size={14} />
                  AI will detect your mood
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Suggestions (collapsible) */}
          <div className="lg:hidden mb-5">
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-text-secondary hover:text-accent border border-border hover:border-accent/20 hover:bg-accent/[0.03] transition-all w-full justify-center"
            >
              <Lightbulb size={13} className="text-accent" />
              {showSuggestions ? "Hide writing ideas" : "Need writing ideas?"}
              <ChevronDown size={12} className={`text-text-muted transition-transform ${showSuggestions ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2.5 overflow-hidden"
                >
                  <div className="card-elevated rounded-xl p-3">
                    {/* Category pills */}
                    <div className="flex overflow-x-auto gap-1.5 mb-3 pb-1 scrollbar-hide">
                      {WRITING_PROMPTS.map((cat, i) => (
                        <button key={i} onClick={() => setActiveCategory(i)} className={`px-2.5 py-1.5 text-[10px] whitespace-nowrap rounded-lg transition-all flex-shrink-0 ${activeCategory === i ? "bg-accent/10 text-accent font-semibold" : "text-text-muted hover:bg-bg-hover"}`}>
                          {cat.category}
                        </button>
                      ))}
                    </div>
                    {/* Prompts */}
                    <div className="space-y-1">
                      {(shuffledPrompts[activeCategory] || WRITING_PROMPTS[activeCategory].prompts).slice(0, 3).map((prompt, pi) => (
                        <button key={pi} onClick={() => insertPrompt(prompt)} className="w-full text-left px-3 py-2.5 rounded-lg text-[11px] text-text-secondary hover:bg-accent/[0.05] hover:text-text-primary transition-all flex items-start gap-2.5 group border border-transparent hover:border-accent/10">
                          <ArrowRight size={10} className="mt-0.5 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                          <span>{prompt}</span>
                        </button>
                      ))}
                    </div>
                    {/* Shuffle */}
                    <button onClick={reshufflePrompts} className="flex items-center gap-1.5 text-[10px] text-text-muted hover:text-accent mt-2 px-3 py-1.5 transition-colors">
                      <RefreshCw size={10} />
                      More ideas
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <input type="text" placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-transparent text-xl font-semibold text-text-primary placeholder:text-text-muted/50 border-none outline-none mb-5 tracking-tight" />

          {/* Editor Card with Toolbar */}
          <div className="card-elevated rounded-xl mb-4 overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-3 py-2 border-b border-border bg-bg-secondary/50 relative flex-wrap">
              <div className="flex items-center gap-0.5">
                <button onClick={() => adjustFontSize(-1)} className="p-1.5 rounded hover:bg-bg-hover text-text-muted hover:text-text-secondary transition-colors" title="Decrease font size"><Minus size={12} /></button>
                <span className="text-[10px] text-text-muted min-w-[26px] text-center font-mono">{fontSize}</span>
                <button onClick={() => adjustFontSize(1)} className="p-1.5 rounded hover:bg-bg-hover text-text-muted hover:text-text-secondary transition-colors" title="Increase font size"><Plus size={12} /></button>
              </div>
              <Divider />
              <ToolBtn active={activeToolbarMenu === "fontSize"} onClick={() => toggleToolbarMenu("fontSize")} title="Font size"><Type size={14} /></ToolBtn>
              <ToolBtn active={activeToolbarMenu === "fontFamily"} onClick={() => toggleToolbarMenu("fontFamily")} title="Font style"><CaseSensitive size={14} /></ToolBtn>
              <Divider />
              <ToolBtn active={isBold} onClick={() => setIsBold(!isBold)} title="Bold"><Bold size={14} /></ToolBtn>
              <ToolBtn active={isItalic} onClick={() => setIsItalic(!isItalic)} title="Italic"><Italic size={14} /></ToolBtn>
              <ToolBtn active={isUnderline} onClick={() => setIsUnderline(!isUnderline)} title="Underline"><Underline size={14} /></ToolBtn>
              <Divider />
              <ToolBtn active={textAlign === "left"} onClick={() => setTextAlign("left")} title="Align left"><AlignLeft size={14} /></ToolBtn>
              <ToolBtn active={textAlign === "center"} onClick={() => setTextAlign("center")} title="Align center"><AlignCenter size={14} /></ToolBtn>
              <ToolBtn active={textAlign === "right"} onClick={() => setTextAlign("right")} title="Align right"><AlignRight size={14} /></ToolBtn>
              <Divider />
              <ToolBtn active={activeToolbarMenu === "textColor"} onClick={() => toggleToolbarMenu("textColor")} title="Text color">
                <div className="relative">
                  <Palette size={14} />
                  {textColor && <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: textColor }} />}
                </div>
              </ToolBtn>
              <ToolBtn active={activeToolbarMenu === "highlight"} onClick={() => toggleToolbarMenu("highlight")} title="Highlight"><Highlighter size={14} /></ToolBtn>
              <ToolBtn active={activeToolbarMenu === "lineHeight"} onClick={() => toggleToolbarMenu("lineHeight")} title="Line spacing"><Space size={14} /></ToolBtn>
              <Divider />
              <ToolBtn active={activeToolbarMenu === "emoji"} onClick={() => toggleToolbarMenu("emoji")} title="Insert emoji"><Smile size={14} /></ToolBtn>

              {/* Dropdown Menus */}
              <AnimatePresence>
                {activeToolbarMenu === "fontSize" && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute top-full left-0 mt-1 z-10 bg-bg-card border border-border rounded-lg shadow-lg p-1.5 flex gap-1">
                    {FONT_SIZES.map((fs) => (
                      <button key={fs.value} onClick={() => { setFontSize(fs.value); setActiveToolbarMenu(null); }} className={`px-2.5 py-1.5 rounded text-xs transition-colors ${fontSize === fs.value ? "bg-accent-dim text-accent border border-accent-border" : "text-text-secondary hover:bg-bg-hover"}`}>{fs.label}</button>
                    ))}
                  </motion.div>
                )}
                {activeToolbarMenu === "fontFamily" && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute top-full left-0 mt-1 z-10 bg-bg-card border border-border rounded-lg shadow-lg p-1.5 flex flex-col gap-0.5 min-w-[120px]">
                    {FONT_FAMILIES.map((ff) => (
                      <button key={ff.label} onClick={() => { setFontFamily(ff.value); setActiveToolbarMenu(null); }} style={{ fontFamily: ff.value }} className={`px-3 py-1.5 rounded text-xs text-left transition-colors ${fontFamily === ff.value ? "bg-accent-dim text-accent border border-accent-border" : "text-text-secondary hover:bg-bg-hover"}`}>{ff.label}</button>
                    ))}
                  </motion.div>
                )}
                {activeToolbarMenu === "textColor" && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute top-full left-0 mt-1 z-10 bg-bg-card border border-border rounded-lg shadow-lg p-2 flex gap-2 flex-wrap max-w-[200px]">
                    {TEXT_COLORS.map((c) => (
                      <button key={c.label} onClick={() => { setTextColor(c.value); setActiveToolbarMenu(null); }} className={`w-6 h-6 rounded-full transition-all ${c.className} ${textColor === c.value ? "ring-2 ring-accent ring-offset-1 ring-offset-bg-card scale-110" : "hover:scale-110"}`} title={c.label} />
                    ))}
                  </motion.div>
                )}
                {activeToolbarMenu === "highlight" && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute top-full left-0 mt-1 z-10 bg-bg-card border border-border rounded-lg shadow-lg p-2 flex gap-2">
                    {HIGHLIGHT_COLORS.map((c) => (
                      <button key={c.label} onClick={() => { setHighlightColor(c.value); setActiveToolbarMenu(null); }} className={`w-6 h-6 rounded-full transition-all ${c.className} ${highlightColor === c.value ? "ring-2 ring-accent ring-offset-1 ring-offset-bg-card scale-110" : "hover:scale-110"}`} title={c.label} />
                    ))}
                  </motion.div>
                )}
                {activeToolbarMenu === "lineHeight" && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute top-full left-0 mt-1 z-10 bg-bg-card border border-border rounded-lg shadow-lg p-1.5 flex gap-1">
                    {LINE_HEIGHTS.map((lh) => (
                      <button key={lh.value} onClick={() => { setLineHeight(lh.value); setActiveToolbarMenu(null); }} className={`px-2.5 py-1.5 rounded text-xs transition-colors ${lineHeight === lh.value ? "bg-accent-dim text-accent border border-accent-border" : "text-text-secondary hover:bg-bg-hover"}`}>{lh.label}</button>
                    ))}
                  </motion.div>
                )}
                {activeToolbarMenu === "emoji" && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute top-full right-0 mt-1 z-10 bg-bg-card border border-border rounded-lg shadow-lg p-2">
                    {EMOJI_SETS.map((row, ri) => (
                      <div key={ri} className="flex gap-1 mb-1 last:mb-0">
                        {row.map((emoji) => (
                          <button key={emoji} onClick={() => { insertEmoji(emoji); setActiveToolbarMenu(null); }} className="w-7 h-7 rounded hover:bg-bg-hover transition-colors flex items-center justify-center text-sm">{emoji}</button>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Textarea */}
            <div className="p-4 sm:p-5" style={{ backgroundColor: highlightColor || undefined }}>
              <textarea
                ref={textareaRef}
                placeholder="What happened today? How did it make you feel? Write anything — this is your safe space..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onClick={() => setActiveToolbarMenu(null)}
                style={{ fontSize: `${fontSize}px`, color: textColor || undefined, fontWeight: isBold ? 700 : 400, fontStyle: isItalic ? "italic" : "normal", textDecoration: isUnderline ? "underline" : "none", textAlign, fontFamily, lineHeight }}
                className="w-full h-56 sm:h-72 bg-transparent text-text-primary/90 placeholder:text-text-muted border-none outline-none resize-none"
              />
            </div>
          </div>

          {/* Diff / Comparison View */}
          <AnimatePresence>
            {showDiff && originalContent !== null && improvedContent !== null && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-4">
                <div className="bg-bg-card border border-accent-border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-accent-dim">
                    <div className="flex items-center gap-2">
                      <Wand2 size={14} className="text-accent" />
                      <span className="text-xs font-medium text-accent">AI Suggestions</span>
                    </div>
                    <button onClick={handleRejectImprove} className="p-1 rounded hover:bg-bg-hover text-text-muted hover:text-text-secondary transition-colors"><X size={14} /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
                    <div className="p-3">
                      <p className="text-[10px] uppercase tracking-wider text-text-muted font-medium mb-2">Original</p>
                      <p className="text-xs leading-relaxed text-text-secondary">{renderDiffText(originalContent, computeDiff(originalContent, improvedContent).removed, "removed")}</p>
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] uppercase tracking-wider text-green-400 font-medium mb-2">Improved</p>
                      <p className="text-xs leading-relaxed text-text-secondary">{renderDiffText(improvedContent, computeDiff(originalContent, improvedContent).added, "added")}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 px-4 py-2.5 border-t border-border">
                    <button onClick={handleRejectImprove} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-text-secondary hover:text-text-primary border border-border hover:border-border-hover transition-colors"><X size={12} /> Discard</button>
                    <button onClick={handleAcceptImprove} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-accent text-bg-primary hover:bg-accent-hover transition-colors"><Check size={12} /> Accept changes</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-text-muted text-xs">{wordCount} words</span>
              <span className="text-text-muted text-xs">{charCount} chars</span>
            </div>
            <div className="flex items-center gap-2">
              {originalContent !== null && !showDiff ? (
                <button onClick={handleUndoImprove} className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium text-text-secondary hover:text-text-primary border border-border hover:border-border-hover transition-colors">
                  <Undo2 size={14} /> Undo improve
                </button>
              ) : !showDiff ? (
                <button onClick={handleImprove} disabled={!content.trim() || improving || saving || saved} className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium text-text-secondary hover:text-text-primary border border-border hover:border-border-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  <Wand2 size={14} /> {improving ? "Improving..." : "Improve with AI"}
                </button>
              ) : null}
              <button onClick={handleSave} disabled={!content.trim() || saving || saved || showDiff} className="btn-accent px-5 py-2.5 text-sm flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
                <AnimatePresence mode="wait">
                  {saved && detectedMood ? (
                    <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${moodDots[detectedMood] || moodDots.neutral}`} />
                      {moodLabels[detectedMood] || "Saved"} <Check size={14} />
                    </motion.span>
                  ) : saved ? (
                    <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5"><Check size={14} /> Saved</motion.span>
                  ) : saving ? (
                    <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{isAutoMode ? "Detecting mood..." : "Saving..."}</motion.span>
                  ) : (
                    <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Save entry</motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </div>

      <MoodRecommendationModal mood={showRecommendations ? detectedMood : null} onClose={handleRecommendationsClose} />
    </PageTransition>
  );
}
