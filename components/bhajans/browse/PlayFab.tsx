"use client";

import { Loader2, Pause, Play } from "lucide-react";
import { FOCUS } from "./tones";
import { usePlaySlug } from "./usePlaySlug";

export function PlayIcon({ busy, pause, className = "h-5 w-5" }: { busy?: boolean; pause?: boolean; className?: string }) {
  if (busy) return <Loader2 className={`${className} animate-spin`} aria-hidden />;
  if (pause) return <Pause className={className} fill="currentColor" aria-hidden />;
  return <Play className={`${className} translate-x-[1px]`} fill="currentColor" aria-hidden />;
}

/** Gold circular play button (44px+ target). */
export default function PlayFab({ slug, title, className = "", size = "md" }: { slug: string; title: string; className?: string; size?: "sm" | "md" }) {
  const { showPause, busy, onPlay } = usePlaySlug(slug);
  return (
    <button
      type="button"
      aria-label={`${showPause ? "Pause" : "Play"} ${title}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void onPlay();
      }}
      className={`inline-flex ${size === "md" ? "h-12 w-12" : "h-11 w-11"} items-center justify-center rounded-full bg-[#F6C752] text-[#0b1745] shadow-[0_6px_14px_-6px_rgba(15,31,92,.28)] transition duration-150 motion-reduce:transition-none [@media(hover:hover)]:hover:scale-105 [@media(hover:hover)]:hover:brightness-105 active:scale-95 ${FOCUS} ${className}`}
    >
      <PlayIcon busy={busy} pause={showPause} />
    </button>
  );
}
