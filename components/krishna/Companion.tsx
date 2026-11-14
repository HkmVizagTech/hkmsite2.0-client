"use client";

import { useEffect, useState } from "react";
import { CycleSprite, IMG, mascotScale, type Sheet } from "./RunSprite";

/**
 * The little Krishna who keeps the visitor company: sits small in the bottom-left corner of every public page,
 * mostly playing his flute (gold notes drifting up); every so often he does something else from ACTS (wave, eat
 * butter, ...). Purely decorative (not clickable). Steps aside while a moment plays (`away`).
 * Light by design: the flute and wave loops (~100 KB) load after the page settles; other acts load when they start.
 * Testing: ?companion=wave|eat|clap. To add an act: make a small loop sheet (height 112) from a Gemini clip, upload it, and add it to ACTS.
 */

const FLUTE: Sheet = { file: "companion-flute", frames: 15, w: 62, h: 112, ms: 1250, stridePerSec: 0 };
const WAVE: Sheet = { file: "companion-wave", frames: 12, w: 81, h: 112, ms: 1917, stridePerSec: 0 };
const CLAP: Sheet = { file: "companion-clap", frames: 31, w: 76, h: 112, ms: 2583, stridePerSec: 0 };
const EAT: Sheet = { file: "companion-eat", frames: 49, w: 87, h: 112, ms: 4083, stridePerSec: 0 };

// things he does between flute playing: the sheet and how many times to play it
const SLEEP: Sheet = { file: "companion-sleep", frames: 61, w: 78, h: 112, ms: 5083, stridePerSec: 0 };
const BALL: Sheet = { file: "companion-ball2", frames: 24, w: 87, h: 112, ms: 2000, stridePerSec: 0 };
// Gau Seva pages: feeding and patting the calf, continuously (wider: Krishna + calf)
const GAU: Sheet = { file: "companion-gau", frames: 27, w: 158, h: 112, ms: 2208, stridePerSec: 0 };

const ACTS: { sheet: Sheet; times: number }[] = [
  { sheet: WAVE, times: 2 },
  { sheet: EAT, times: 1 },
  { sheet: CLAP, times: 2 },
  { sheet: SLEEP, times: 1 },
  { sheet: BALL, times: 2 },
];

export default function Companion({ lift, away, gau = false }: { lift: number; away: boolean; gau?: boolean }) {
  const BASE = gau ? GAU : FLUTE;
  const [ready, setReady] = useState(false);
  const [act, setAct] = useState<Sheet | null>(null);
  const [notes, setNotes] = useState<{ id: number; dx: number }[]>([]);

  // appear only after the page has settled, and only once both loops have loaded
  useEffect(() => {
    let off = false;
    const t = window.setTimeout(() => {
      const imgs = (gau ? [GAU] : [FLUTE, WAVE]).map((s) => { const i = new Image(); i.src = IMG(s.file); return i; });
      Promise.all(imgs.map((i) => (i.complete ? Promise.resolve() : new Promise((r) => { i.onload = r; i.onerror = r; })))).then(() => {
        if (!off) setReady(true);
      });
    }, 2500);
    return () => { off = true; window.clearTimeout(t); };
  }, [gau]);

  // mostly flute; every ~16-24 s another act (never the same twice in a row), loaded just before it starts
  useEffect(() => {
    if (!ready || gau) return; // on Gau Seva he just keeps feeding the calf
    let t = 0;
    let last = -1;
    // testing: ?companion=wave|eat|clap|sleep|ball plays that act first, after a second
    const force = new URLSearchParams(window.location.search).get("companion");
    let forced = ACTS.findIndex((a) => a.sheet.file.replace(/\d+$/, "") === "companion-" + force);
    const loop = () => {
      t = window.setTimeout(() => {
        let i = Math.floor(Math.random() * ACTS.length);
        if (forced >= 0) { i = forced; forced = -1; }
        if (ACTS.length > 1 && i === last) i = (i + 1) % ACTS.length;
        last = i;
        const a = ACTS[i];
        const img = new Image();
        img.src = IMG(a.sheet.file);
        const go = () => {
          setAct(a.sheet);
          t = window.setTimeout(() => { setAct(null); loop(); }, a.sheet.ms * a.times);
        };
        if (img.complete) go(); else { img.onload = go; img.onerror = () => loop(); }
      }, forced >= 0 ? 1000 : 16000 + Math.random() * 8000);
    };
    loop();
    return () => window.clearTimeout(t);
  }, [ready]);

  // a gold note now and then while he plays
  useEffect(() => {
    if (!ready || act || away || gau) return;
    let n = 0;
    const id = window.setInterval(() => {
      n++;
      setNotes((l) => [...l.slice(-3), { id: n, dx: -6 - Math.random() * 14 }]);
    }, 1400);
    return () => window.clearInterval(id);
  }, [ready, act, away]);

  // drawn only in the browser (sizes depend on the screen), once his loops have loaded
  if (!ready) return null;
  const sc = mascotScale();
  const h = Math.round((gau ? 92 : 84) * Math.max(0.8, sc));
  const show = ready && !away;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute left-1.5 transition-all duration-500 md:left-3 ${show ? "kc-enter translate-y-0 opacity-100" : "invisible translate-y-3 opacity-0"}`}
      style={{ bottom: lift + 4 }}
    >
      <div className="relative block">
        <span aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 h-2.5 w-[70%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(10,22,64,.28),transparent)]" />
        {notes.map((m) => (
          <span key={m.id} aria-hidden className="kc-note pointer-events-none absolute left-[8%] top-[34%] font-serif text-base text-[#E3A92B] [text-shadow:0_0_8px_rgba(246,199,82,.8)]"
            style={{ ["--dx" as string]: `${m.dx}px` }}>♪</span>
        ))}
        <span className="block">
          <CycleSprite key={(act ?? BASE).file} sheet={act ?? BASE} height={h} className="drop-shadow-[0_6px_8px_rgba(10,22,64,.25)]" />
        </span>
      </div>
    </div>
  );
}
