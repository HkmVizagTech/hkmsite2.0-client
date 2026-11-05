"use client";

import { useState } from "react";
import { Loader2, Pause, Play, Repeat, Repeat1, Shuffle } from "lucide-react";
import { SPEEDS, usePlayer, usePlayerActions, usePlayerTime } from "../playerContext";
import { fmtDuration } from "@/lib/bhajans";

export const PLAYER_CSS = `
html[data-player="on"] { --player-h: 72px; }
@media (min-width: 1024px) { html[data-player="on"] { --player-h: 84px; } }
html[data-player="on"] body { padding-bottom: calc(var(--bottom-nav-space) + var(--player-h)) !important; }
html[data-player="on"] a.fixed[href^="https://wa.me/"] { bottom: calc(var(--bottom-nav-space) + var(--player-h) + 20px) !important; }
html[data-player="on"] button.fixed[aria-label^="Switch to"] { bottom: calc(var(--bottom-nav-space) + var(--player-h) + 80px) !important; }
@media (min-width: 1024px) {
  html[data-player="on"] a.fixed[href^="https://wa.me/"] { bottom: calc(var(--player-h) + 24px) !important; }
  html[data-player="on"] button.fixed[aria-label^="Switch to"] { bottom: calc(var(--player-h) + 88px) !important; }
}
.bh-range { -webkit-appearance: none; appearance: none; width: 100%; height: 20px; background: transparent; cursor: pointer; --p: 0%; --on: #1E3A8A; --off: #DCE4FF; }
.bh-range:focus-visible { outline: 2px solid #2F5BD3; outline-offset: 3px; border-radius: 6px; }
.bh-range::-webkit-slider-runnable-track { height: 4px; border-radius: 9999px; background: linear-gradient(to right, var(--on) var(--p), var(--off) var(--p)); }
.bh-range::-moz-range-track { height: 4px; border-radius: 9999px; background: var(--off); }
.bh-range::-moz-range-progress { height: 4px; border-radius: 9999px; background: var(--on); }
.bh-range::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; margin-top: -4px; border-radius: 9999px; background: var(--on); box-shadow: 0 1px 4px rgba(11,23,69,.3); opacity: 0; transition: opacity .15s; }
.bh-range::-moz-range-thumb { width: 12px; height: 12px; border: 0; border-radius: 9999px; background: var(--on); opacity: 0; }
.bh-range:hover::-webkit-slider-thumb, .bh-range:focus-visible::-webkit-slider-thumb, .bh-range.bh-thumb::-webkit-slider-thumb { opacity: 1; }
.bh-range:hover::-moz-range-thumb, .bh-range:focus-visible::-moz-range-thumb, .bh-range.bh-thumb::-moz-range-thumb { opacity: 1; }
.bh-line { position: absolute; left: 0; right: 0; top: -9px; width: 100%; height: 20px; --on: #2F5BD3; --off: #DCE4FF; }
.bh-line::-webkit-slider-runnable-track { height: 2px; border-radius: 0; transition: height .15s; }
.bh-line:hover::-webkit-slider-runnable-track, .bh-line:focus-visible::-webkit-slider-runnable-track { height: 4px; }
.bh-line::-moz-range-track { height: 2px; border-radius: 0; }
.bh-line::-moz-range-progress { height: 2px; border-radius: 0; }
.bh-line:hover::-moz-range-track, .bh-line:hover::-moz-range-progress { height: 4px; }
.bh-line::-webkit-slider-thumb { margin-top: -5px; }
.bh-seek { height: 24px; --on: #1E3A8A; }
.bh-seek::-webkit-slider-runnable-track { height: 6px; }
.bh-seek::-moz-range-track, .bh-seek::-moz-range-progress { height: 6px; }
.bh-seek::-webkit-slider-thumb { width: 16px; height: 16px; margin-top: -5px; opacity: 1; background: #fff; border: 3px solid var(--on); box-sizing: border-box; }
.bh-seek::-moz-range-thumb { width: 16px; height: 16px; opacity: 1; background: #fff; border: 3px solid var(--on); box-sizing: border-box; }
@keyframes bh-up { from { transform: translateY(24px); opacity: 0 } to { transform: none; opacity: 1 } }
.bh-up { animation: bh-up .28s cubic-bezier(.2,.8,.2,1) both; }
@keyframes bh-sheet { from { transform: translateY(40px); opacity: 0 } to { transform: none; opacity: 1 } }
.bh-sheet { animation: bh-sheet .34s cubic-bezier(.2,.8,.2,1) both; }
@keyframes bh-sheet-out { from { transform: none; opacity: 1 } to { transform: translateY(32px); opacity: 0 } }
.bh-sheet[data-closing="true"] { animation: bh-sheet-out .2s ease-in both; }
@keyframes bh-eq { 0%,100% { transform: scaleY(.25) } 50% { transform: scaleY(1) } }
.bh-eq { display: inline-flex; align-items: flex-end; gap: 2px; height: 14px; width: 16px; }
.bh-eq i { display: block; flex: 1; height: 100%; border-radius: 1px; background: currentColor; transform-origin: bottom; animation: bh-eq 1s ease-in-out infinite; }
.bh-eq i:nth-child(2) { animation-duration: .8s; animation-delay: -.3s; }
.bh-eq i:nth-child(3) { animation-duration: 1.2s; animation-delay: -.6s; }
.bh-eq[data-paused="true"] i { animation-play-state: paused; transform: scaleY(.3); }
@media (prefers-reduced-motion: reduce) { .bh-up, .bh-sheet, .bh-sheet[data-closing="true"] { animation: none; } .bh-eq i { animation: none; transform: scaleY(.6); } }
`;

export const ICON_BTN =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink/85 transition-colors hover:text-vk-700 hover:bg-vk-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-vk-500 disabled:opacity-35 disabled:hover:bg-transparent";

/** Animated three-bar equaliser. Bars stop animating when paused. */
export function Equaliser({ paused = false, className = "" }: { paused?: boolean; className?: string }) {
  return (
    <span aria-hidden className={`bh-eq ${className}`} data-paused={paused}>
      <i />
      <i />
      <i />
    </span>
  );
}

export function Seek({ label = "Seek", className = "" }: { label?: string; className?: string }) {
  const { time, duration } = usePlayerTime();
  const { seek } = usePlayerActions();
  const [drag, setDrag] = useState<number | null>(null);
  const max = duration || 0;
  const val = drag ?? time;
  const pct = max ? Math.min(100, (val / max) * 100) : 0;
  const commit = () => {
    if (drag !== null) seek(drag);
    setDrag(null);
  };
  return (
    <input
      type="range"
      aria-label={label}
      aria-valuetext={`${fmtDuration(val)} of ${fmtDuration(max)}`}
      className={`bh-range ${className}`}
      min={0}
      max={max || 1}
      step={0.5}
      disabled={!max}
      value={Math.min(val, max || 1)}
      style={{ ["--p" as string]: `${pct}%` }}
      onChange={(e) => setDrag(Number(e.target.value))}
      onPointerUp={commit}
      onKeyUp={(e) => {
        if (e.key.startsWith("Arrow") || e.key === "Home" || e.key === "End") commit();
      }}
      onBlur={commit}
    />
  );
}

export function TimeText({ which, className = "" }: { which: "time" | "duration"; className?: string }) {
  const t = usePlayerTime();
  return <span className={`tabular-nums ${className}`}>{fmtDuration(t[which])}</span>;
}

export function SpeedButton({ className = "" }: { className?: string }) {
  const { rate } = usePlayer();
  const { setRate } = usePlayerActions();
  return (
    <button
      type="button"
      onClick={() => setRate(SPEEDS[(SPEEDS.indexOf(rate) + 1) % SPEEDS.length] ?? 1)}
      aria-label={`Playback speed ${rate}x, change`}
      title="Playback speed"
      className={`inline-flex h-11 min-w-[56px] items-center justify-center rounded-full bg-vk-50 px-3 text-sm font-bold tabular-nums text-vk-800 ring-1 ring-vk-200 transition-colors duration-150 hover:bg-vk-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-vk-500 ${className}`}
    >
      {rate}x
    </button>
  );
}

/** Play/pause circle. variant "gold" is the sheet's primary button, "white" the Spotify-style bar button. */
export function PlayToggle({ size = 44, variant = "gold" }: { size?: number; variant?: "gold" | "white" }) {
  const { playing, buffering } = usePlayer();
  const { toggle } = usePlayerActions();
  const icon = Math.round(size * 0.42);
  const cls = variant === "gold" ? "bg-[#F6C752] text-[#0b1745] shadow-[0_6px_14px_-8px_rgba(184,140,20,.55)]" : "bg-vk-700 text-white shadow-[0_6px_16px_-6px_rgba(30,58,138,.6)]";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Pause" : "Play"}
      style={{ width: size, height: size }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${cls} transition-transform hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vk-500`}
    >
      {buffering ? (
        <Loader2 style={{ width: icon, height: icon }} className="animate-spin" aria-hidden />
      ) : playing ? (
        <Pause style={{ width: icon, height: icon }} fill="currentColor" aria-hidden />
      ) : (
        <Play style={{ width: icon, height: icon }} className="translate-x-[1px]" fill="currentColor" aria-hidden />
      )}
    </button>
  );
}

const ON_BTN = "!bg-vk-100 !text-vk-700";

export function ShuffleButton({ className = "" }: { className?: string }) {
  const { shuffle } = usePlayer();
  const { setShuffle } = usePlayerActions();
  return (
    <button type="button" onClick={() => setShuffle(!shuffle)} aria-pressed={shuffle} aria-label="Shuffle" title="Shuffle (S)" className={`${ICON_BTN} ${shuffle ? ON_BTN : ""} ${className}`}>
      <Shuffle className="h-5 w-5" aria-hidden />
    </button>
  );
}

export function RepeatButton({ className = "" }: { className?: string }) {
  const { repeat } = usePlayer();
  const { cycleRepeat } = usePlayerActions();
  const Icon = repeat === "one" ? Repeat1 : Repeat;
  return (
    <button
      type="button"
      onClick={cycleRepeat}
      aria-pressed={repeat !== "off"}
      aria-label={`Repeat: ${repeat === "off" ? "off" : repeat === "all" ? "all" : "one track"}`}
      title="Repeat (R)"
      className={`${ICON_BTN} ${repeat !== "off" ? ON_BTN : ""} ${className}`}
    >
      <Icon className="h-5 w-5" aria-hidden />
    </button>
  );
}
