"use client";

import { useEffect, useRef } from "react";

/**
 * Golden battlefield dust drifting on the wind, drawn on a small canvas. Pauses when off screen,
 * stays off for visitors who ask for reduced motion.
 */
export default function Dust({ className = "", count = 70, wind = -0.35 }: { className?: string; count?: number; wind?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, raf = 0, running = false;
    const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.25 : 2);
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 32;
    const sg = sprite.getContext("2d")!;
    const grd = sg.createRadialGradient(16, 16, 0, 16, 16, 16);
    grd.addColorStop(0, "rgba(255,214,140,1)");
    grd.addColorStop(1, "rgba(255,214,140,0)");
    sg.fillStyle = grd;
    sg.fillRect(0, 0, 32, 32);
    const ps = Array.from({ length: count }, () => ({ x: rand(0, w), y: rand(h * 0.25, h), r: rand(0.6, 2.4), s: rand(0.4, 1.3), o: rand(0.15, 0.55), p: rand(0, Math.PI * 2) }));

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const q of ps) {
        q.x += wind * q.s;
        q.p += 0.01;
        q.y += Math.sin(q.p) * 0.15 - 0.04 * q.s;
        if (q.x < -10) { q.x = w + 10; q.y = rand(h * 0.25, h); }
        if (q.x > w + 10) q.x = -10;
        if (q.y < h * 0.1) q.y = h;
        ctx.globalAlpha = q.o;
        const size = q.r * 6;
        ctx.drawImage(sprite, q.x - size / 2, q.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(tick); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(canvas);
    window.addEventListener("resize", resize);
    return () => { stop(); io.disconnect(); window.removeEventListener("resize", resize); };
  }, [count, wind]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none ${className}`} />;
}
