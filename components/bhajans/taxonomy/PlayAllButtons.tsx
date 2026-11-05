"use client";

import { useState } from "react";
import { Loader2, Pause, Play, Shuffle } from "lucide-react";
import { type BhajanQuery } from "@/lib/bhajans";
import { usePlayer, usePlayerActions } from "../playerContext";
import { loadQueue, shuffled } from "./queue";
import { FOCUS, GOLD_BTN } from "./ui";

type Src = { query: BhajanQuery } | { slugs: string[] };

/** Gold Play (and optional Shuffle) for a set of bhajans: loads the first recording of each audio bhajan as the queue. */
export default function PlayAllButtons({ src, disabled = false, shuffle = true, label = "Play", className = "" }: { src: Src; disabled?: boolean; shuffle?: boolean; label?: string; className?: string }) {
  const { playing, queue, current } = usePlayer();
  const { play, toggle } = usePlayerActions();
  const [busy, setBusy] = useState<"" | "play" | "shuffle">("");
  const [none, setNone] = useState(false);
  const srcKey = JSON.stringify(src);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const active = lastKey === srcKey && !!current && queue.some((q) => q.key === current.key);

  async function go(mode: "play" | "shuffle") {
    if (mode === "play" && active) return toggle();
    setBusy(mode);
    setNone(false);
    const q = await loadQueue(src);
    setBusy("");
    if (!q.length) return setNone(true);
    setLastKey(srcKey);
    play(mode === "shuffle" ? shuffled(q) : q, 0);
  }
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <button type="button" disabled={disabled || !!busy} onClick={() => go("play")} className={GOLD_BTN}>
        {busy === "play" ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : active && playing ? <Pause className="h-5 w-5" fill="currentColor" aria-hidden /> : <Play className="h-5 w-5" fill="currentColor" aria-hidden />}
        {active && playing ? "Pause" : label}
      </button>
      {shuffle && (
        <button type="button" disabled={disabled || !!busy} onClick={() => go("shuffle")} className={`inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-vk-800 ring-1 ring-vk-300 hover:bg-vk-50 disabled:opacity-50 ${FOCUS}`}>
          {busy === "shuffle" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Shuffle className="h-4 w-4" aria-hidden />}
          Shuffle
        </button>
      )}
      {none && <p role="status" className="basis-full text-sm text-vk-800">No audio recordings here yet.</p>}
    </div>
  );
}

