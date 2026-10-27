"use client";

import { useEffect, useRef } from "react";

/**
 * "Bound by love": Mother Yashoda's rope, drawn down the left edge of the page as the visitor scrolls, with a lit lamp at its
 * end. It runs from the top of the page to the last section, so how far the visitor has come is always visible.
 * Cheap on purpose: one small SVG, updated from a passive scroll listener inside requestAnimationFrame.
 */
export default function RopeRail() {
  const trackRef = useRef<SVGPathElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const lampRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const fill = fillRef.current;
    const lamp = lampRef.current;
    if (!track || !fill || !lamp) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let H = window.innerHeight;
    let len = 1;
    const X = 9;
    const wave = (y: number) => X + 3.2 * Math.sin(y / 34);

    const build = () => {
      H = window.innerHeight;
      const pts: string[] = [];
      for (let y = 0; y <= H; y += 6) pts.push(`${pts.length ? "L" : "M"}${wave(y).toFixed(1)} ${y}`);
      const d = pts.join(" ");
      track.setAttribute("d", d);
      fill.setAttribute("d", d);
      len = fill.getTotalLength();
      fill.style.strokeDasharray = `${len}`;
      draw();
    };

    let raf = 0;
    const draw = () => {
      raf = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      fill.style.strokeDashoffset = `${len * (1 - p)}`;
      const y = p * H;
      lamp.style.transform = `translate3d(${wave(y) - 8}px, ${y - 12}px, 0)`;
      lamp.style.opacity = p > 0.004 ? "1" : "0";
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    build();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", build);
    if (reduce) lamp.style.transition = "none";
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", build);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed bottom-0 left-0 top-0 z-40 w-[18px] md:w-[22px]">
      <svg className="absolute inset-0 h-full w-full overflow-visible" width="18" height="100%">
        <path ref={trackRef} fill="none" stroke="hsl(43 89% 54% / 0.22)" strokeWidth="2.5" strokeLinecap="round" />
        <path ref={fillRef} fill="none" stroke="hsl(43 89% 54%)" strokeWidth="2.5" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 3px rgba(255,190,60,.7))" }} />
      </svg>
      <div ref={lampRef} className="absolute left-0 top-0 h-6 w-4 opacity-0 transition-opacity duration-300 will-change-transform">
        <svg viewBox="0 0 48 56" className="h-full w-full overflow-visible">
          <defs>
            <radialGradient id="km-rail-glow">
              <stop offset="0" stopColor="#FFC24D" stopOpacity="0.9" />
              <stop offset="1" stopColor="#FFC24D" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="24" cy="18" rx="22" ry="22" fill="url(#km-rail-glow)" />
          <path d="M24 2c5 6 8 11 8 16a8 8 0 0 1-16 0c0-4 3-8 8-16Z" fill="#FF9A1F" />
          <path d="M24 11c2.4 3 3.6 5.3 3.6 7.6a3.6 3.6 0 0 1-7.2 0c0-2.3 1.2-4.6 3.6-7.6Z" fill="#FFF7D6" />
          <path d="M5 30h38c0 11-8 18-19 18S5 41 5 30Z" fill="#E4A91F" />
          <path d="M5 30h38" stroke="#FFE49A" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
