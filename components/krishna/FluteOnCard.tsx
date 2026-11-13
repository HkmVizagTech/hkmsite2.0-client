"use client";

import { useEffect, useRef, useState } from "react";
import { CycleSprite, mascotScale, type Sheet } from "./RunSprite";
import { Glow } from "./Fx";

// playing-the-flute loop from a Gemini video: 30 frames (1.25 s) of 151x272, legs swinging, head swaying
const FLUTE: Sheet = { file: "flute-play", frames: 30, w: 151, h: 272, ms: 1250, stridePerSec: 0 };

/**
 * Krishna sits on the top edge of a real card or section on screen, legs dangling, playing his flute; golden notes
 * float up from the flute. He follows the card if the page scrolls. Tap him: the notes burst into gold sparkles and
 * he hops away. Finds no suitable card -> calls onDone at once (the caller then simply skips the moment).
 */

const RATIO = FLUTE.w / FLUTE.h;
const SEAT = 0.69; // how far down the frame he sits (the edge passes under his thighs)
const FLUTE_TIP = { x: 0.07, y: 0.54 }; // the flute's far end, as fractions of the frame

/** True when there is a card on screen he could sit on right now (checked before choosing this moment). */
export function fluteHasCard(): boolean {
  const kidH = Math.round(170 * mascotScale());
  return !!findCard(kidH * RATIO, kidH);
}

function findCard(kidW: number, kidH: number): HTMLElement | null {
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const list = [...document.querySelectorAll<HTMLElement>("main .vk-card, main [class*='rounded-2xl'], main [class*='rounded-3xl'], main img")]
    .filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.width < Math.max(200, kidW * 1.6) || r.height < 90) return false;
      // his head must stay below the header and his card edge above the bottom bars
      if (r.top < kidH * 0.75 + 70 || r.top > vh * 0.8) return false;
      if (r.right > vw - 8 || r.left < 8) return false;
      if (el.closest("form, [role='dialog'], header, nav, footer")) return false;
      const cs = getComputedStyle(el);
      return cs.visibility !== "hidden" && cs.display !== "none" && Number(cs.opacity) > 0.5;
    });
  // prefer a wide one near the middle of the screen
  list.sort((a, b) => Math.abs(a.getBoundingClientRect().top - vh / 2) - Math.abs(b.getBoundingClientRect().top - vh / 2));
  return list[0] || null;
}

type Note = { id: number; x: number; y: number; dx: number; ch: string };

export default function FluteOnCard({ leave, onDone }: { leave: boolean; onDone: () => void }) {
  const kid = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLElement | null>(null);
  const pos = useRef({ x: 0, y: 0 });
  const [notes, setNotes] = useState<Note[]>([]);
  const [burst, setBurst] = useState(false);
  const phone = typeof window !== "undefined" && window.innerWidth < 768;
  const kidH = Math.round(170 * mascotScale());
  const kidW = kidH * RATIO;

  useEffect(() => {
    card.current = findCard(kidW, kidH);
    if (!card.current) { onDone(); return; }
    let raf = 0;
    const place = () => {
      const r = card.current!.getBoundingClientRect();
      const x = r.right - kidW - Math.min(40, r.width * 0.08);
      const y = r.top - kidH * SEAT;
      pos.current = { x, y };
      if (kid.current) kid.current.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(place);
    };
    place();
    let n = 0;
    const id = window.setInterval(() => {
      const { x, y } = pos.current;
      n++;
      setNotes((list) => [...list.slice(-8), { id: n, x: x + kidW * FLUTE_TIP.x, y: y + kidH * FLUTE_TIP.y, dx: -10 - Math.random() * 30, ch: ["♪", "♫", "♩", "♬"][n % 4] }]);
    }, 520);
    const end = window.setTimeout(onDone, 6200);
    return () => { cancelAnimationFrame(raf); window.clearInterval(id); window.clearTimeout(end); };
  }, [kidH, kidW, onDone]);

  useEffect(() => {
    if (!leave) return;
    setBurst(true);
    const t = window.setTimeout(onDone, 700);
    return () => window.clearTimeout(t);
  }, [leave, onDone]);

  const { x, y } = pos.current;
  return (
    <>
      {notes.map((m) => (
        <span key={m.id} className="kc-note pointer-events-none absolute left-0 top-0 font-serif text-2xl text-[#E3A92B] [text-shadow:0_0_10px_rgba(246,199,82,.8)]"
          style={{ transform: `translate(${m.x}px, ${m.y}px)`, ["--dx" as string]: `${m.dx}px` }}>
          {m.ch}
        </span>
      ))}
      {burst &&
        Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="kc-spark pointer-events-none absolute left-0 top-0 h-2 w-2 rounded-full bg-[#F6C752] shadow-[0_0_10px_#F6C752]"
            style={{ transform: `translate(${x + kidW * 0.5}px, ${y + kidH * 0.4}px)`, ["--a" as string]: `${i * 36}deg` }} />
        ))}
      <div ref={kid} className="pointer-events-auto absolute left-0 top-0" style={{ willChange: "transform" }}>
        <Glow size={kidH * 1.2} />
        <CycleSprite sheet={FLUTE} height={kidH} className={`drop-shadow-[0_10px_14px_rgba(10,22,64,.28)] ${burst ? "kc-fade-up" : "kc-sit"}`} />
      </div>
    </>
  );
}
