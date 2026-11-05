"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, RotateCw, X, Timer, AlertTriangle } from "lucide-react";

export interface SyncVerse { preview: string }

const fmt = (s: number) => {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${(s - m * 60).toFixed(1).padStart(4, "0")}`;
};
const r2 = (n: number) => Math.round(n * 100) / 100;
const SPEEDS = [0.75, 0.9, 1, 1.1, 1.25];

/**
 * Tap-to-sync tool. `times` is the contiguous list of verse start times (index = verse index);
 * its length is the number of synced verses. Edits go straight to the editor form, so they
 * are saved by the normal Save button and covered by the unsaved-changes guard.
 */
export default function SyncLyrics({
  title, url, verses, times, onChange, onClose,
}: {
  title: string;
  url: string;
  verses: SyncVerse[];
  times: number[];
  onChange: (t: number[]) => void;
  onClose: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [now, setNow] = useState(0);
  const [dur, setDur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timesRef = useRef(times);
  timesRef.current = times;
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const cur = () => audioRef.current?.currentTime ?? 0;
  const seek = (t: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.max(0, Math.min(t, a.duration || t));
    setNow(a.currentTime);
  };
  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {}); else a.pause();
  };

  const synced = times.length;
  const next = synced < verses.length ? synced : -1;

  const tap = useCallback(() => {
    const t = timesRef.current;
    if (t.length >= verses.length) return;
    onChange([...t, r2(cur())]);
  }, [verses.length, onChange]);

  const setAt = (i: number, v: number) => {
    const t = [...times];
    t[i] = r2(Math.max(0, v));
    onChange(t);
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if (e.key === "Escape") { onClose(); return; }
      if (e.code === "Space") { e.preventDefault(); if (!e.repeat) tap(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [tap, onClose]);

  // Lock page scroll behind the modal.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Which verse is active at the current playback time.
  let active = -1;
  for (let i = 0; i < times.length; i++) if (times[i] <= now) active = i;
  useEffect(() => {
    if (active >= 0) rowRefs.current[active]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [active]);

  const unordered = times.some((t, i) => i > 0 && t < times[i - 1]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center" role="dialog" aria-modal="true" aria-label="Sync lyrics">
      <div className="flex max-h-[100dvh] w-full max-w-2xl flex-col overflow-hidden bg-background shadow-xl sm:max-h-[92vh] sm:rounded-xl">
        <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-sm font-semibold"><Timer className="h-4 w-4 text-primary" /> Sync lyrics</p>
            <p className="truncate text-xs text-muted-foreground">{title}</p>
          </div>
          <Button type="button" size="sm" onClick={onClose}><X className="mr-1 h-4 w-4" /> Done</Button>
        </div>

        {/* Player */}
        <div className="space-y-2 border-b px-4 py-3">
          <audio
            ref={audioRef}
            src={url}
            preload="auto"
            onTimeUpdate={(e) => setNow(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDur(e.currentTarget.duration || 0)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onSeeked={(e) => setNow(e.currentTarget.currentTime)}
          />
          <div className="flex items-center gap-2">
            <span className="w-14 font-mono text-xs tabular-nums">{fmt(now)}</span>
            <input
              type="range" min={0} max={dur || 1} step={0.1} value={Math.min(now, dur || 1)}
              onChange={(e) => seek(Number(e.target.value))}
              className="h-6 flex-1 accent-[hsl(var(--primary))]" aria-label="Seek"
            />
            <span className="w-14 text-right font-mono text-xs tabular-nums text-muted-foreground">{fmt(dur)}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => seek(cur() - 5)}><RotateCcw className="mr-1 h-4 w-4" /> 5s</Button>
            <Button type="button" size="sm" className="min-w-20" onClick={toggle}>
              {playing ? <Pause className="mr-1 h-4 w-4" /> : <Play className="mr-1 h-4 w-4" />}{playing ? "Pause" : "Play"}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => seek(cur() + 5)}>5s <RotateCw className="ml-1 h-4 w-4" /></Button>
            <select
              value={speed} aria-label="Speed"
              onChange={(e) => { const s = Number(e.target.value); setSpeed(s); if (audioRef.current) audioRef.current.playbackRate = s; }}
              className="h-9 rounded-md border bg-background px-2 text-base sm:text-sm"
            >
              {SPEEDS.map((s) => <option key={s} value={s}>{s}x</option>)}
            </select>
          </div>
        </div>

        {/* Tap */}
        <div className="space-y-2 border-b px-4 py-3">
          <Button
            type="button" className="h-16 w-full text-base" disabled={next < 0 || !verses.length} onClick={tap}
          >
            {next < 0 ? "All verses synced" : `Tap: verse ${next + 1} starts now`}
          </Button>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-medium">{synced} of {verses.length} verses synced <span className="font-normal text-muted-foreground">(Space also taps)</span></span>
            <Button
              type="button" size="sm" variant="outline" className="h-7 text-xs text-red-600 hover:bg-red-50" disabled={!synced}
              onClick={() => { if (window.confirm("Clear all sync times for this track?")) onChange([]); }}
            >
              Reset all
            </Button>
          </div>
          {unordered && (
            <p className="flex items-center gap-1.5 rounded bg-amber-50 px-2 py-1 text-xs text-amber-800">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> Some times are not increasing. Fix the highlighted rows before saving.
            </p>
          )}
        </div>

        {/* Verse list */}
        <div className="flex-1 space-y-1.5 overflow-y-auto px-4 py-3">
          {verses.length === 0 && <p className="text-sm text-muted-foreground">Add verses first, then sync them here.</p>}
          {verses.map((v, i) => {
            const has = i < times.length;
            const bad = has && i > 0 && times[i] < times[i - 1];
            return (
              <div
                key={i}
                ref={(el) => { rowRefs.current[i] = el; }}
                className={`rounded-lg border p-2 ${i === active ? "border-primary bg-primary/10" : ""} ${bad ? "border-amber-400 bg-amber-50" : ""} ${i === next ? "ring-1 ring-primary/40" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-muted px-1 text-xs font-semibold">{i + 1}</span>
                  <p className="min-w-0 flex-1 truncate text-sm">{v.preview}</p>
                  <span className={`shrink-0 font-mono text-xs tabular-nums ${has ? "" : "text-muted-foreground"}`}>{has ? fmt(times[i]) : "--:--.-"}</span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-xs" disabled={i > times.length} onClick={() => setAt(i, cur())}>Set now</Button>
                  <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-xs" disabled={!has} onClick={() => setAt(i, times[i] - 0.25)}>-0.25</Button>
                  <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-xs" disabled={!has} onClick={() => setAt(i, times[i] + 0.25)}>+0.25</Button>
                  <Button
                    type="button" size="sm" variant="outline" className="h-7 px-2 text-xs" disabled={!has}
                    onClick={() => { seek(times[i]); audioRef.current?.play().catch(() => {}); }}
                  >
                    <Play className="mr-1 h-3 w-3" /> Play
                  </Button>
                  <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-xs text-red-600" disabled={!has} onClick={() => onChange(times.slice(0, i))}>Clear from here</Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
