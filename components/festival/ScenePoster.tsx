"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A light, static stand-in for the 3D lamp in a hero. It is plain HTML/SVG, so it paints with the first HTML (no three.js
 * download needed) and the visitor sees the lit lamp straight away on a slow phone. It fades out the moment the 3D scene
 * has drawn its first frame (the scene fires a bubbling "scene-ready" event on its host element, which sits in the same
 * section as this poster).
 */
export default function ScenePoster({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const on = () => setReady(true);
    parent.addEventListener("scene-ready", on);
    return () => parent.removeEventListener("scene-ready", on);
  }, []);

  return (
    <div ref={ref} aria-hidden className={`pointer-events-none absolute z-[1] transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"} ${className}`}>
      <svg viewBox="0 0 320 300" className="h-auto w-full overflow-visible">
        <defs>
          <radialGradient id="sp-glow" cx="50%" cy="38%" r="55%">
            <stop offset="0" stopColor="#FFC24D" stopOpacity="0.55" />
            <stop offset="1" stopColor="#FFC24D" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sp-brass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F6C752" />
            <stop offset="1" stopColor="#B8860B" />
          </linearGradient>
          <linearGradient id="sp-flame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFE9A8" />
            <stop offset="1" stopColor="#FF8A1F" />
          </linearGradient>
          <linearGradient id="sp-petal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F6A6C6" />
            <stop offset="1" stopColor="#FFF3F0" />
          </linearGradient>
        </defs>
        <ellipse cx="160" cy="120" rx="150" ry="140" fill="url(#sp-glow)" />
        {/* lotus */}
        <g fill="url(#sp-petal)" stroke="#E58FB1" strokeOpacity="0.5" strokeWidth="1">
          <path d="M160 270c-58-6-100-32-122-70 44 4 82 24 122 70Z" />
          <path d="M160 270c58-6 100-32 122-70-44 4-82 24-122 70Z" />
          <path d="M160 270c-34-20-52-58-48-104 30 22 48 56 48 104Z" />
          <path d="M160 270c34-20 52-58 48-104-30 22-48 56-48 104Z" />
          <path d="M160 270c-16-32-16-76 0-118 16 42 16 86 0 118Z" />
        </g>
        {/* diya */}
        <path d="M70 168h180c0 40-40 70-90 70s-90-30-90-70Z" fill="url(#sp-brass)" />
        <path d="M70 168h180" stroke="#FFE49A" strokeWidth="4" strokeLinecap="round" />
        {/* flame */}
        <path d="M160 70c20 26 32 46 32 66a32 32 0 0 1-64 0c0-20 12-40 32-66Z" fill="url(#sp-flame)" />
        <path d="M160 108c9 12 14 21 14 30a14 14 0 0 1-28 0c0-9 5-18 14-30Z" fill="#FFF7D6" />
      </svg>
    </div>
  );
}
