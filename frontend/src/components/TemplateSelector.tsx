"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { getAllTemplates, type Template } from "@/lib/templates";

interface TemplateSelectorProps {
  onSelect: (template: Template) => void;
  onCreateNew: () => void;
}

export default function TemplateSelector({ onSelect, onCreateNew }: TemplateSelectorProps) {
  const templates = getAllTemplates();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {templates.map((template, i) => (
        <motion.button
          key={template.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onSelect(template)}
          className="card-elevated p-4 rounded-xl text-left group hover:border-accent/20 hover:bg-accent/[0.03]"
        >
          <span className="text-2xl mb-2.5 block">{template.icon}</span>
          <p className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
            {template.name}
          </p>
          <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
            {template.description}
          </p>
          {template.isCustom && (
            <span className="inline-block mt-2 px-2 py-0.5 rounded-md text-[9px] font-semibold bg-accent/10 text-accent">
              Custom
            </span>
          )}
        </motion.button>
      ))}
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: templates.length * 0.05 }}
        onClick={onCreateNew}
        className="p-4 rounded-xl border border-dashed border-border hover:border-accent/30 hover:bg-accent/[0.03] transition-all text-left group flex flex-col items-center justify-center min-h-[120px]"
      >
        <div className="w-9 h-9 rounded-lg bg-bg-hover flex items-center justify-center mb-2 group-hover:bg-accent/10 transition-colors">
          <Plus size={16} className="text-text-muted group-hover:text-accent transition-colors" />
        </div>
        <p className="text-xs font-medium text-text-muted group-hover:text-accent transition-colors">
          Create template
        </p>
      </motion.button>
    </div>
  );
}
