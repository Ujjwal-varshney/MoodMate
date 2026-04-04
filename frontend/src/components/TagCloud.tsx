"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiGetTags } from "@/lib/api";

interface TagData {
  id: number;
  name: string;
  count: number;
}

export default function TagCloud() {
  const [tags, setTags] = useState<TagData[]>([]);

  useEffect(() => {
    apiGetTags().then(setTags).catch(() => {});
  }, []);

  if (tags.length === 0) return null;

  const maxCount = Math.max(...tags.map((t) => t.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated p-5 rounded-xl"
    >
      <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4">Tag Cloud</h3>
      <div className="flex flex-wrap gap-2">
        {tags
          .sort((a, b) => b.count - a.count)
          .map((tag, i) => {
            const scale = 0.7 + (tag.count / maxCount) * 0.6;
            const opacity = 0.5 + (tag.count / maxCount) * 0.5;
            return (
              <motion.span
                key={tag.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="px-2.5 py-1 rounded-md bg-accent-dim text-accent border border-accent-border font-medium cursor-default"
                style={{ fontSize: `${scale * 13}px`, opacity }}
              >
                {tag.name}
                <span className="ml-1 text-accent/50 text-[10px]">{tag.count}</span>
              </motion.span>
            );
          })}
      </div>
    </motion.div>
  );
}
