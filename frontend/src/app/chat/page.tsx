"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
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
        <div className="mb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-bg-primary font-bold text-xs">M</span>
          </div>
          <div>
            <p className="text-text-primary text-sm font-medium leading-tight">MoodMate</p>
            <p className="text-text-muted text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-mood-happy" />
              Online
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto rounded-lg bg-bg-secondary border border-border p-3 sm:p-4 space-y-3 mb-3">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[75%]">
                  {msg.role === "assistant" && (
                    <p className="text-text-muted text-[10px] mb-1 ml-1">MoodMate</p>
                  )}
                  <div className={`rounded-lg px-4 py-2.5 ${
                    msg.role === "user"
                      ? "bg-accent text-bg-primary"
                      : "bg-bg-card border border-border text-text-primary"
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                  <p className={`text-[10px] text-text-muted mt-1 ${msg.role === "user" ? "text-right" : ""} mx-1`}>
                    {msg.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-bg-card border border-border rounded-lg px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 bg-text-muted rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={endRef} />
        </div>

        <div className="bg-bg-card border border-border rounded-lg p-2.5 flex items-end gap-2">
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
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted text-sm outline-none resize-none max-h-[100px] py-1.5 px-1.5"
          />
          <button
            onClick={send}
            disabled={!input.trim() || isTyping}
            className="p-2 rounded-md bg-accent text-bg-primary hover:bg-accent-hover transition-colors disabled:opacity-30 shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
