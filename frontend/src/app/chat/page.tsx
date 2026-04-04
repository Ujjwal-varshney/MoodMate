"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { apiChat } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hey! I'm here whenever you want to talk. No judgments, no advice unless you ask. Just a friend who listens. How's your day been?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const send = async () => {
    if (!input.trim() || isTyping) return;

    const msg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((p) => [...p, msg]);
    const userMessage = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsTyping(true);

    try {
      const data = await apiChat(userMessage);
      setMessages((p) => [...p, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } catch {
      setMessages((p) => [...p, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I couldn't respond right now. Make sure Ollama is running.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    }
    setIsTyping(false);
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto h-[calc(100vh-8rem)] sm:h-[calc(100vh-6rem)] lg:h-[calc(100vh-4rem)] flex flex-col">
        {/* Chat header */}
        <div className="mb-4 flex items-center gap-3 px-1">
          <div
            className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0"
            style={{ boxShadow: "0 4px 12px rgba(201, 168, 124, 0.2)" }}
          >
            <Sparkles size={16} className="text-bg-primary" />
          </div>
          <div>
            <p className="text-text-primary text-sm font-semibold leading-tight">MoodMate AI</p>
            <p className="text-text-muted text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-mood-happy animate-pulse" />
              Online — remembers your entries
            </p>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto rounded-xl bg-bg-secondary/50 border border-border p-4 sm:p-5 space-y-4 mb-3" style={{ boxShadow: "inset 0 2px 8px rgba(0,0,0,0.1)" }}>
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] ${msg.role === "user" ? "" : "flex gap-2.5"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles size={12} className="text-accent" />
                    </div>
                  )}
                  <div>
                    {msg.role === "assistant" && (
                      <p className="text-text-muted text-[10px] mb-1 font-medium">MoodMate</p>
                    )}
                    <div className={`rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-accent text-bg-primary rounded-br-md"
                        : "bg-bg-card border border-border text-text-primary rounded-bl-md"
                    }`}
                    style={msg.role === "user"
                      ? { boxShadow: "0 2px 8px rgba(201, 168, 124, 0.15)" }
                      : { boxShadow: "var(--shadow-sm)" }
                    }>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                    <p className={`text-[10px] text-text-muted mt-1.5 ${msg.role === "user" ? "text-right" : ""} mx-1`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
                  <Sparkles size={12} className="text-accent" />
                </div>
                <div className="bg-bg-card border border-border rounded-2xl rounded-bl-md px-5 py-3.5" style={{ boxShadow: "var(--shadow-sm)" }}>
                  <div className="flex gap-1.5">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input bar */}
        <div className="glass-card rounded-xl p-3 flex items-end gap-2.5">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
                textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 100) + "px";
              }
            }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted text-sm outline-none resize-none max-h-[100px] py-1.5 px-2"
          />
          <button
            onClick={send}
            disabled={!input.trim() || isTyping}
            className="p-2.5 rounded-xl bg-accent text-bg-primary hover:bg-accent-hover transition-all disabled:opacity-30 shrink-0"
            style={input.trim() && !isTyping ? { boxShadow: "0 2px 10px rgba(201, 168, 124, 0.25)" } : undefined}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
