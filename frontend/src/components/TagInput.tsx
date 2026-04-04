"use client";

import { useState, useEffect, useRef } from "react";
import { X, Sparkles, Plus } from "lucide-react";
import { apiGetTags, apiSuggestTags } from "@/lib/api";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  content?: string;
}

export default function TagInput({ tags, onChange, content }: TagInputProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<{ name: string; count: number }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    apiGetTags().then(setSuggestions).catch(() => {});
  }, []);

  const addTag = (tag: string) => {
    const normalized = tag.trim().toLowerCase();
    if (normalized && !tags.includes(normalized)) {
      onChange([...tags, normalized]);
    }
    setInput("");
    setShowSuggestions(false);
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleAiSuggest = async () => {
    if (!content?.trim() || suggesting) return;
    setSuggesting(true);
    try {
      const result = await apiSuggestTags(content);
      if (result.tags?.length) {
        const newTags = result.tags.filter((t: string) => !tags.includes(t.toLowerCase()));
        if (newTags.length) onChange([...tags, ...newTags]);
      }
    } catch {
      // ignore
    } finally {
      setSuggesting(false);
    }
  };

  const filteredSuggestions = suggestions.filter(
    (s) => s.name.includes(input.toLowerCase()) && !tags.includes(s.name)
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-text-secondary text-xs font-medium uppercase tracking-wider">Tags</label>
        {content && (
          <button
            onClick={handleAiSuggest}
            disabled={suggesting}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium text-accent hover:bg-accent-dim transition-colors disabled:opacity-40"
          >
            <Sparkles size={10} />
            {suggesting ? "Suggesting..." : "AI suggest"}
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg bg-bg-card border border-border min-h-[38px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-accent-dim text-accent border border-accent-border"
          >
            {tag}
            <button onClick={() => removeTag(tag)} className="hover:text-accent-hover">
              <X size={10} />
            </button>
          </span>
        ))}
        <div className="relative flex-1 min-w-[100px]">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length ? "Add more..." : "Type a tag and press Enter..."}
            className="w-full bg-transparent text-text-primary text-xs outline-none placeholder:text-text-muted"
          />
          {showSuggestions && input && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 mt-1 z-10 bg-bg-card border border-border rounded-lg shadow-lg py-1 min-w-[150px]">
              {filteredSuggestions.slice(0, 5).map((s) => (
                <button
                  key={s.name}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => addTag(s.name)}
                  className="w-full text-left px-3 py-1.5 text-xs text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors flex items-center justify-between"
                >
                  <span>{s.name}</span>
                  <span className="text-text-muted text-[10px]">{s.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
