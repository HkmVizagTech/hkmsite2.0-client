"use client";

import { useState } from "react";
import { Loader2, Pause, Play } from "lucide-react";
import { clientFetchBhajan, tracksToQueue, type QueueItem } from "@/lib/bhajans";
import { usePlayer, usePlayerActions } from "./playerContext";

/** Gold primary Play button for a known queue (detail page, hero). */
export function PlayQueueButton({
  queue,
  startIndex = 0,
  label = "Play",
  className = "",
  size = "lg",
}: {
  queue: QueueItem[];
  startIndex?: number;
  label?: string;
  className?: string;
  size?: "md" | "lg";
}) {
  const { current, playing } = usePlayer();
  const { play, toggle } = usePlayerActions();
  const item = queue[startIndex];
  const isCurrent = !!item && current?.key === item.key;
  const showPause = isCurrent && playing;
  if (!item) return null;
  return (
    <button
      type="button"
      onClick={() => (isCurrent ? toggle() : play(queue, startIndex))}
      className={`vk-btn-gold inline-flex items-center justify-center gap-2 rounded-full font-semibold ${size === "lg" ? "min-h-[52px] px-7 text-base" : "min-h-[44px] px-5 text-sm"} ${className}`}
    >
      {showPause ? <Pause className="h-5 w-5" fill="currentColor" aria-hidden /> : <Play className="h-5 w-5" fill="currentColor" aria-hidden />}
      {showPause ? "Pause" : label}
    </button>
  );
}

/** Round play button for cards: fetches the track list on demand. */
export function CardPlay({ slug, title }: { slug: string; title: string }) {
  const { current, playing } = usePlayer();
  const { play, toggle } = usePlayerActions();
  const [busy, setBusy] = useState(false);
  const isCurrent = current?.slug === slug;
  const showPause = isCurrent && playing;
  return (
    <button
      type="button"
      aria-label={`${showPause ? "Pause" : "Play"} ${title}`}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isCurrent) return toggle();
        setBusy(true);
        const d = await clientFetchBhajan(slug);
        setBusy(false);
        const q = d ? tracksToQueue(d) : [];
        if (q.length) play(q, 0);
      }}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#F5C451] text-[#0b1745] shadow-lg transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95"
    >
      {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : showPause ? <Pause className="h-5 w-5" fill="currentColor" aria-hidden /> : <Play className="h-5 w-5 translate-x-[1px]" fill="currentColor" aria-hidden />}
    </button>
  );
}
