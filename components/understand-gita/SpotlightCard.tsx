"use client";

import { useRef, type ReactNode } from "react";

/** Card with a soft blue glow that follows the cursor (desktop hover only). Flat otherwise. */
export default function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - r.left}px`);
    el.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} onPointerMove={move} className={`group/spot relative overflow-hidden rounded-3xl border border-vk-100 bg-white ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover/spot:opacity-100"
        style={{ background: "radial-gradient(260px circle at var(--sx,50%) var(--sy,50%), rgba(47,91,211,.12), transparent 70%)" }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
