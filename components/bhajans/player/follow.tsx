"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { usePlayer, usePlayerTime } from "../playerContext";
import type { Bhajan, LangCode } from "@/lib/bhajans";

export type FollowMode = "exact" | "approx" | null;

/** Cumulative character-weight fractions per verse (used to estimate the position when no verse times exist). */
function cumulative(doc: Bhajan, lang: string): number[] {
  const w = (doc.verses || []).map((v) => {
    const own = v.text?.[lang as LangCode] || [];
    const any = own.length ? own : Object.values(v.text || {}).find((l) => l && l.length) || [];
    return Math.max(1, any.join(" ").length);
  });
  const total = w.reduce((a, b) => a + b, 0) || 1;
  let run = 0;
  return w.map((x) => (run += x) / total);
}

/**
 * Headless: watches the playback position and reports the active verse index (-1 = none) and whether it is
 * exact (track has verseTimes) or approximate. Only calls `onChange` when something changes, so the lyrics
 * do not re-render on every time tick.
 */
export function FollowTracker({ doc, lang, onChange }: { doc: Bhajan; lang: string; onChange: (index: number, mode: FollowMode) => void }) {
  const { current } = usePlayer();
  const { time, duration } = usePlayerTime();
  const cum = useMemo(() => cumulative(doc, lang), [doc, lang]);
  const last = useRef<{ i: number; m: FollowMode }>({ i: -2, m: null });

  let idx = -1;
  let mode: FollowMode = null;
  if (current && current.slug === doc.slug) {
    const vt = current.verseTimes;
    if (vt && vt.length) {
      mode = "exact";
      for (let k = 0; k < vt.length; k++) {
        if (typeof vt[k] !== "number") continue;
        if (vt[k] <= time) idx = k;
        else break;
      }
    } else {
      mode = "approx";
      const dur = duration || current.duration || 0;
      if (dur > 0 && cum.length) {
        const intro = dur * 0.03;
        if (time >= intro) {
          const f = Math.min(1, (time - intro) / (dur - intro));
          const k = cum.findIndex((c) => c >= f);
          idx = k === -1 ? cum.length - 1 : k;
        }
      }
    }
  }
  useEffect(() => {
    if (last.current.i === idx && last.current.m === mode) return;
    last.current = { i: idx, m: mode };
    onChange(idx, mode);
  });
  return null;
}

/**
 * Smoothly centres the active verse while `enabled`, except for ~4 s after the visitor scrolls, drags or touches.
 * `away` is true during that pause (drives the "Back to current verse" chip).
 */
export function useAutoFollow({ enabled, index, rootRef, listenOnWindow = false }: { enabled: boolean; index: number; rootRef: RefObject<HTMLElement | null>; listenOnWindow?: boolean }) {
  const pausedUntil = useRef(0);
  const timer = useRef<number | null>(null);
  const [away, setAway] = useState(false);

  const scrollTo = useCallback(
    (i: number) => {
      const el = rootRef.current?.querySelector<HTMLElement>(`[data-verse="${i}"]`);
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    },
    [rootRef],
  );

  useEffect(() => {
    const target: EventTarget | null = listenOnWindow ? window : rootRef.current;
    if (!target) return;
    const mark = () => {
      pausedUntil.current = Date.now() + 4000;
      setAway(true);
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setAway(false), 4000);
    };
    const evts = ["wheel", "touchstart", "touchmove"];
    evts.forEach((e) => target.addEventListener(e, mark, { passive: true }));
    return () => {
      evts.forEach((e) => target.removeEventListener(e, mark));
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [listenOnWindow, rootRef]);

  useEffect(() => {
    if (!enabled || index < 0 || Date.now() < pausedUntil.current) return;
    scrollTo(index);
  }, [enabled, index, scrollTo]);

  const resume = useCallback(() => {
    pausedUntil.current = 0;
    setAway(false);
    if (index >= 0) scrollTo(index);
  }, [index, scrollTo]);

  return { away: away && enabled && index >= 0, resume };
}

/** Small "Follow along" toggle with a subtle Synced / Approx. label. */
export function FollowChip({ on, onToggle, mode }: { on: boolean; onToggle: () => void; mode: FollowMode }) {
  if (!mode) return null;
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onToggle}
      className={`inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[13px] font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-vk-500 motion-reduce:transition-none ${
        on ? "bg-vk-700 text-white" : "bg-white text-vk-800 ring-1 ring-vk-200 hover:bg-vk-50"
      }`}
    >
      Follow along
      <span className={`text-[12px] font-medium ${on ? "text-white/85" : "text-vk-700"}`}>{mode === "exact" ? "· Synced" : "· Approx."}</span>
    </button>
  );
}

/** localStorage-backed boolean preference (SSR-safe: starts at `def`, then reads). */
export function useStoredFlag(key: string, def: boolean): [boolean, (v: boolean) => void] {
  const [v, setV] = useState(def);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === "1") setV(true);
      else if (raw === "0") setV(false);
    } catch {
      /* ignore */
    }
  }, [key]);
  const set = useCallback(
    (x: boolean) => {
      setV(x);
      try {
        localStorage.setItem(key, x ? "1" : "0");
      } catch {
        /* ignore */
      }
    },
    [key],
  );
  return [v, set];
}
