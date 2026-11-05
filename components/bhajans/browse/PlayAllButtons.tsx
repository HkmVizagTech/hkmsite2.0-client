"use client";

import { Loader2, Play, Shuffle } from "lucide-react";
import { usePlayAll } from "./usePlayAll";
import { FOCUS } from "./tones";

/** Gold "Play all" and pale-gold "Shuffle" buttons. Icon-only below sm so headers stay on one line at 360px. */
export default function PlayAllButtons({ getSlugs, label }: { getSlugs: () => string[] | Promise<string[]>; label: string }) {
  const { busy, run } = usePlayAll();
  const base = `inline-flex h-11 items-center justify-center gap-2 rounded-full text-sm font-bold text-[#0b1745] transition duration-150 active:scale-95 motion-reduce:transition-none disabled:opacity-60 max-sm:w-11 sm:px-5 ${FOCUS}`;
  return (
    <div className="flex shrink-0 items-center gap-2">
      <button type="button" disabled={!!busy} onClick={() => void run(getSlugs, false)} aria-label={`Play all: ${label}`} className={`${base} bg-[#F6C752] [@media(hover:hover)]:hover:brightness-105`}>
        {busy === "play" ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Play className="h-5 w-5" fill="currentColor" aria-hidden />}
        <span className="max-sm:sr-only">Play all</span>
      </button>
      <button type="button" disabled={!!busy} onClick={() => void run(getSlugs, true)} aria-label={`Shuffle: ${label}`} className={`${base} bg-[#FDF3D2] ring-1 ring-[#F6C752] [@media(hover:hover)]:hover:bg-[#FBE9B0]`}>
        {busy === "shuffle" ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Shuffle className="h-5 w-5" aria-hidden />}
        <span className="max-sm:sr-only">Shuffle</span>
      </button>
    </div>
  );
}
