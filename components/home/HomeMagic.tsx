"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Small decorative layers for the home page, in the temple's blue and gold. They are drawn only after the page has
 * loaded in the browser (random positions would not match the server HTML) and never for reduced motion.
 */

type Dot = { id: number; left: number; top: number; delay: number; dur: number; size: number };

function useDots(count: number, seed: number): Dot[] {
  const reduce = useReducedMotion();
  const [dots, setDots] = useState<Dot[]>([]);
  useEffect(() => {
    if (reduce) return;
    setDots(
      Array.from({ length: count }, (_, i) => ({
        id: i + seed,
        left: Math.random() * 100,
        top: 10 + Math.random() * 85,
        delay: Math.random() * 6,
        dur: 4 + Math.random() * 4,
        size: 4 + Math.random() * 6,
      }))
    );
  }, [count, seed, reduce]);
  return dots;
}

/** Gold sparkles that twinkle and drift upward over a picture. */
export function GoldSparkles({ count = 16, className = "" }: { count?: number; className?: string }) {
  const dots = useDots(count, 0);
  if (!dots.length) return null;
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {dots.map((d) => (
        <span key={d.id} className="hm-spark" style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s` }} />
      ))}
    </div>
  );
}

/** Gold and white petals falling gently, like a pushpanjali (dark sections). */
export function GoldPetals({ count = 14 }: { count?: number }) {
  const dots = useDots(count, 100);
  if (!dots.length) return null;
  const hues = ["#F6C752", "#FFD873", "#F2B41F"];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <span
          key={d.id}
          className="sp-petal absolute -top-6 rounded-[60%_40%_60%_40%] opacity-45 shadow-[0_0_6px_rgba(246,199,82,.6)]"
          style={{ left: `${d.left}%`, width: d.size + 4, height: (d.size + 4) * 0.7, background: hues[i % hues.length], animationDelay: `${d.delay * 1.6}s`, animationDuration: `${d.dur * 2.6}s` }}
        />
      ))}
    </div>
  );
}

/** Thin gold bar at the top of the window that fills as the page is read (CSS scroll timeline). */
export function ReadingProgress() {
  return <div aria-hidden className="hm-progress" />;
}
