"use client";

import { useEffect, useRef } from "react";

// Krishna pictures and motion sheets live on Cloudflare R2 (versioned folder: upload changes as mascot/v2/ etc.)
export const MASCOT_BASE = "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/mascot/v1";
export const IMG = (n: string) => `${MASCOT_BASE}/krishna-${n}.webp`;

/** A looping motion cut from a Gemini (Veo) green-screen video: `frames` frames of w x h side by side. */
export type Sheet = { file: string; frames: number; w: number; h: number; ms: number; stridePerSec: number };

// stridePerSec: how far he really travels per second, as a multiple of his on-screen height (so feet never slide)
export const RUN_SHEET: Sheet = { file: "run-cycle", frames: 20, w: 178, h: 280, ms: 830, stridePerSec: 2.2 };
export const BRICK_SHEET: Sheet = { file: "brick-walk", frames: 26, w: 169, h: 280, ms: 1083, stridePerSec: 1.05 };
export const CALF_SHEET: Sheet = { file: "calf-gallop", frames: 17, w: 318, h: 280, ms: 708, stridePerSec: 2.2 };
export const WAVE_SHEET: Sheet = { file: "wave-loop", frames: 23, w: 196, h: 272, ms: 1917, stridePerSec: 0 };
export const RUN_RATIO = RUN_SHEET.w / RUN_SHEET.h;

/** Seconds to cross the screen at the speed that matches the steps. */
export function crossSeconds(sheet: Sheet, height: number, distancePx: number): number {
  return Math.max(2.6, distancePx / (height * sheet.stridePerSec));
}

/** Plays a motion loop in place (the caller moves him across the screen). Pure CSS, smooth in every browser. */
export function CycleSprite({ sheet, height, className = "" }: { sheet: Sheet; height: number; className?: string }) {
  const w = height * (sheet.w / sheet.h);
  return (
    <span
      aria-hidden
      className={`kc-cycle block select-none ${className}`}
      style={{
        width: w,
        height,
        backgroundImage: `url(${IMG(sheet.file)})`,
        backgroundSize: `${w * sheet.frames}px ${height}px`,
        ["--kc-end" as string]: `${-w * sheet.frames}px`,
        animationDuration: `${sheet.ms}ms`,
        animationTimingFunction: `steps(${sheet.frames})`,
      }}
    />
  );
}

/** Running Krishna (the real run cycle). */
export default function RunSprite({ height, className = "" }: { height: number; className?: string }) {
  return <CycleSprite sheet={RUN_SHEET} height={height} className={className} />;
}

/** A grid sheet (cols x rows) played once at `fps`; calls onEnd after the last frame. */
export type SeqSheet = { file: string; frames: number; cols: number; rows: number; w: number; h: number; fps: number };

export function SeqSprite({ sheet, height, className = "", onEnd }: { sheet: SeqSheet; height: number; className?: string; onEnd?: () => void }) {
  const el = useRef<HTMLSpanElement>(null);
  const w = height * (sheet.w / sheet.h);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    let ended = false;
    const tick = (now: number) => {
      const f = Math.min(sheet.frames - 1, Math.floor(((now - t0) / 1000) * sheet.fps));
      if (el.current) el.current.style.backgroundPosition = `${-(f % sheet.cols) * w}px ${-Math.floor(f / sheet.cols) * height}px`;
      if (f >= sheet.frames - 1) { if (!ended) { ended = true; onEnd?.(); } return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [sheet, w, height, onEnd]);
  return (
    <span ref={el} aria-hidden className={`block select-none ${className}`}
      style={{ width: w, height, backgroundImage: `url(${IMG(sheet.file)})`, backgroundSize: `${w * sheet.cols}px ${height * sheet.rows}px`, backgroundRepeat: "no-repeat" }} />
  );
}

/**
 * One size rule for every moment, so he looks right on any screen: phones ~0.78, tablets ~0.9, laptops 1, large
 * screens 1.1, and landscape phones / short windows scaled down to fit their height.
 */
export function mascotScale(): number {
  if (typeof window === "undefined") return 1;
  const vw = window.innerWidth, vh = window.innerHeight;
  let s = vw < 768 ? 0.78 : vw < 1100 ? 0.9 : vw > 1700 ? 1.1 : 1;
  if (vh < 600) s = Math.min(s, (vh / 600) * 0.82);
  return s;
}
