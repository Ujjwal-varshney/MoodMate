"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";
import { saveCustomTemplate } from "@/lib/templates";

const ICONS = ["📝", "💭", "🌟", "🔥", "💪", "🎨", "📚", "🧘", "💡", "🌈", "☀️", "🎵"];

interface TemplateEditorProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function TemplateEditor({ open, onClose, onSaved }: TemplateEditorProps) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📝");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState<string[]>(["", ""]);

  const addSection = () => setSections([...sections, ""]);
  const removeSection = (i: number) => setSections(sections.filter((_, idx) => idx !== i));
  const updateSection = (i: number, val: string) => {
    const updated = [...sections];
    updated[i] = val;
    setSections(updated);
  };

  const handleSave = () => {
    if (!name.trim() || sections.every((s) => !s.trim())) return;
    saveCustomTemplate({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      icon,
      description: description.trim() || "Custom template",
      sections: sections.filter((s) => s.trim()),
      isCustom: true,
    });
    setName("");
    setIcon("📝");
    setDescription("");
    setSections(["", ""]);
    onSaved();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-bg-secondary border border-border rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-text-primary font-semibold text-lg">Create Template</h3>
              <button onClick={onClose} className="p-1 text-text-muted hover:text-text-primary transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Icon picker */}
            <div className="mb-4">
              <label className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-2 block">Icon</label>
              <div className="flex gap-1.5 flex-wrap">
                {ICONS.map((ic) => (
                  <button
                    key={ic}
                    onClick={() => setIcon(ic)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all ${
                      icon === ic ? "bg-accent-dim border border-accent-border scale-110" : "hover:bg-bg-hover border border-transparent"
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-2 block">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Morning Pages"
                className="w-full px-3 py-2 rounded-lg bg-bg-card border border-border text-text-primary text-sm outline-none focus:border-accent/30 transition-colors placeholder:text-text-muted"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-2 block">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description..."
                className="w-full px-3 py-2 rounded-lg bg-bg-card border border-border text-text-primary text-sm outline-none focus:border-accent/30 transition-colors placeholder:text-text-muted"
              />
            </div>

            {/* Sections */}
            <div className="mb-5">
              <label className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-2 block">Sections / Prompts</label>
              <div className="space-y-2">
                {sections.map((s, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={s}
                      onChange={(e) => updateSection(i, e.target.value)}
                      placeholder={`Section ${i + 1}...`}
                      className="flex-1 px-3 py-2 rounded-lg bg-bg-card border border-border text-text-primary text-sm outline-none focus:border-accent/30 transition-colors placeholder:text-text-muted"
                    />
                    {sections.length > 1 && (
                      <button onClick={() => removeSection(i)} className="p-2 text-text-muted hover:text-mood-angry transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addSection}
                className="flex items-center gap-1.5 mt-2 text-xs text-text-muted hover:text-accent transition-colors"
              >
                <Plus size={12} /> Add section
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button onClick={onClose} className="px-4 py-2 rounded-md text-sm text-text-secondary hover:text-text-primary border border-border transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!name.trim()}
                className="px-4 py-2 rounded-md text-sm bg-accent text-bg-primary hover:bg-accent-hover transition-colors disabled:opacity-40"
              >
                Save template
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
