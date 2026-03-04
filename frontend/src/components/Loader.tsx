"use client";

import { motion } from "framer-motion";

export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <div
      className="border-2 border-border border-t-accent rounded-full animate-spin"
      style={{ width: size, height: size }}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <Spinner size={24} />
    </div>
  );
}

export function FullScreenLoader() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center gap-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
          <span className="text-bg-primary font-bold text-sm">M</span>
        </div>
        <Spinner size={20} />
      </motion.div>
    </div>
  );
}

export function EntrySkeleton() {
  return (
    <div className="p-4 rounded-lg bg-bg-card border border-border animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-24 bg-bg-hover rounded" />
        <div className="h-5 w-16 bg-bg-hover rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-bg-hover rounded" />
        <div className="h-3 w-3/4 bg-bg-hover rounded" />
      </div>
      <div className="mt-3 flex justify-between">
        <div className="h-3 w-16 bg-bg-hover rounded" />
      </div>
    </div>
  );
}

export function EntryListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <EntrySkeleton key={i} />
      ))}
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="w-9 h-9 rounded-lg bg-bg-hover" />
      <div>
        <div className="h-5 w-10 bg-bg-hover rounded mb-1" />
        <div className="h-3 w-14 bg-bg-hover rounded" />
      </div>
    </div>
  );
}

export function ChatBubbleSkeleton() {
  return (
    <div className="flex justify-start animate-pulse">
      <div className="max-w-[75%]">
        <div className="h-2.5 w-16 bg-bg-hover rounded mb-1.5 ml-1" />
        <div className="bg-bg-card border border-border rounded-lg px-4 py-3 space-y-2">
          <div className="h-3 w-48 bg-bg-hover rounded" />
          <div className="h-3 w-32 bg-bg-hover rounded" />
        </div>
      </div>
    </div>
  );
}
