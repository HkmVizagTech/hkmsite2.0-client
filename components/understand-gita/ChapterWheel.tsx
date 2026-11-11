"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { CHAPTERS } from "@/lib/understandGita";

// three.js is only downloaded when this section is about to scroll into view.
const Wheel3D = dynamic(() => import("./Wheel3D"), { ssr: false });

function canWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Flat wheel shown when 3D is unavailable (no WebGL, reduced motion) and while the 3D one loads. */
function FlatWheel({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  return (
    <svg viewBox="-260 -260 520 520" className="h-full w-full" role="img" aria-label="Wheel of the 18 chapters">
      <circle r="200" fill="none" stroke="#F6C752" strokeWidth="16" />
      <circle r="242" fill="none" stroke="#F6C752" strokeWidth="4" opacity=".6" />
      {CHAPTERS.map((_, i) => {
        const a = (i / 18) * Math.PI * 2;
        // Rounded so the server and the browser print exactly the same numbers (no hydration mismatch).
        const x = Math.round(Math.sin(a) * 200 * 100) / 100, y = Math.round(-Math.cos(a) * 200 * 100) / 100;
        const on = i === active;
        return (
          <g key={i} onClick={() => onSelect(i)} className="cursor-pointer">
            <line x1="0" y1="0" x2={x} y2={y} stroke="#fff" strokeWidth="5" opacity=".85" />
            <circle cx={x} cy={y} r={on ? 22 : 17} fill={on ? "#F6C752" : "#2448B4"} />
            <text x={x} y={y + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill={on ? "#0A1233" : "#fff"}>{i + 1}</text>
          </g>
        );
      })}
      <circle r="38" fill="#F6C752" />
      <circle r="20" fill="#2448B4" />
    </svg>
  );
}

export default function ChapterWheel() {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false); // load three.js
  const [visible, setVisible] = useState(false); // run the render loop
  const [webgl, setWebgl] = useState(false);
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? active;

  useEffect(() => {
    setWebgl(canWebGL());
    const el = box.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) setNear(true);
        setVisible(e.isIntersecting);
      });
    }, { rootMargin: "300px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const use3d = webgl && !reduce && near;
  const c = CHAPTERS[shown];

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_.9fr]">
      <div ref={box} className="relative mx-auto aspect-square w-full max-w-[560px]">
        {use3d ? <Wheel3D active={active} onHover={setHover} onSelect={setActive} running={visible} /> : <FlatWheel active={active} onSelect={setActive} />}
      </div>

      <div className="text-center lg:text-left">
        <div className="min-h-[170px] rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm md:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={shown} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[hsl(var(--gold))]">Chapter {shown + 1} of 18</p>
              <h3 className="mt-2 font-heading text-2xl font-extrabold leading-tight text-white md:text-3xl">{c.en}</h3>
              <p className="mt-1 text-base italic text-white/70">{c.sa}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="mt-3 text-sm text-white/60">{use3d ? "Hover a spoke to read its chapter, click to hold it." : "Tap a number to read its chapter."}</p>

        <div className="mt-5 flex flex-wrap justify-center gap-1.5 lg:justify-start" role="tablist" aria-label="Chapters">
          {CHAPTERS.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`h-9 w-9 rounded-full text-[13px] font-bold transition ${i === active ? "bg-[hsl(var(--gold))] text-vk-900" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <a href="#journey" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--gold))] hover:underline">
          See the full chapter timeline <ArrowDown className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
