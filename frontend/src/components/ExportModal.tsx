"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileJson, FileText } from "lucide-react";
import { apiExportDownload } from "@/lib/api";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  entryId?: number;
}

export default function ExportModal({ open, onClose, entryId }: ExportModalProps) {
  const [format, setFormat] = useState<"json" | "pdf">("pdf");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [downloading, setDownloading] = useState(false);

  const handleExport = async () => {
    setDownloading(true);
    try {
      await apiExportDownload(format, startDate || undefined, endDate || undefined, entryId);
      onClose();
    } catch {
      // keep modal open
    } finally {
      setDownloading(false);
    }
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
            className="bg-bg-secondary border border-border rounded-xl p-6 max-w-sm w-full"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-text-primary font-semibold text-lg">Export {entryId ? "Entry" : "Entries"}</h3>
              <button onClick={onClose} className="p-1 text-text-muted hover:text-text-primary transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Format picker */}
            <div className="mb-4">
              <label className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-2 block">Format</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFormat("pdf")}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-colors ${
                    format === "pdf" ? "border-accent/30 bg-accent-dim text-accent" : "border-border bg-bg-card text-text-secondary hover:border-border-hover"
                  }`}
                >
                  <FileText size={16} /> PDF
                </button>
                <button
                  onClick={() => setFormat("json")}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-colors ${
                    format === "json" ? "border-accent/30 bg-accent-dim text-accent" : "border-border bg-bg-card text-text-secondary hover:border-border-hover"
                  }`}
                >
                  <FileJson size={16} /> JSON
                </button>
              </div>
            </div>

            {/* Date range (only for bulk export) */}
            {!entryId && (
              <div className="mb-5">
                <label className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-2 block">Date Range (optional)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-bg-card border border-border text-text-primary text-sm outline-none focus:border-accent/30 transition-colors"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-bg-card border border-border text-text-primary text-sm outline-none focus:border-accent/30 transition-colors"
                  />
                </div>
                <p className="text-text-muted text-[10px] mt-1.5">Leave empty to export all entries</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button onClick={onClose} className="px-4 py-2 rounded-md text-sm text-text-secondary hover:text-text-primary border border-border transition-colors">
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={downloading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm bg-accent text-bg-primary hover:bg-accent-hover transition-colors disabled:opacity-40"
              >
                <Download size={14} />
                {downloading ? "Exporting..." : "Download"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
