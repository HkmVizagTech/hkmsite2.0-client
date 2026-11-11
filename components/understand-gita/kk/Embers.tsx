"use client";

import { useEffect, useRef } from "react";

/** Glowing embers rising and flickering, like sparks over a battlefield at dawn. Paused off screen; off for reduced motion. */
export default function Embers({ className = "", count = 60 }: { className?: string; count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0, h = 0, raf = 0, running = false;
    const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.25 : 2);
    const resize = () => { w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 32;
    const sg = sprite.getContext("2d")!;
    const grd = sg.createRadialGradient(16, 16, 0, 16, 16, 16);
    grd.addColorStop(0, "rgba(255,214,120,1)");
    grd.addColorStop(0.4, "rgba(255,170,60,.55)");
    grd.addColorStop(1, "rgba(255,140,40,0)");
    sg.fillStyle = grd;
    sg.fillRect(0, 0, 32, 32);
    const spawn = (y?: number) => ({ x: rand(0, w), y: y ?? h + rand(0, 40), r: rand(0.8, 2.2), vy: rand(0.25, 0.9), vx: rand(-0.25, 0.25), life: rand(0, Math.PI * 2), hue: rand(28, 46) });
    const ps = Array.from({ length: count }, () => spawn(rand(0, h)));
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.y -= p.vy; p.x += p.vx + Math.sin(p.life) * 0.2; p.life += 0.05;
        if (p.y < -10) ps[i] = spawn();
        const fade = Math.min(1, p.y / (h * 0.6));
        const a = (0.45 + Math.sin(p.life * 2) * 0.35) * fade;
        ctx.globalAlpha = Math.max(0, Math.min(1, a));
        const size = p.r * 8;
        ctx.drawImage(sprite, p.x - size / 2, p.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(tick); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(canvas);
    window.addEventListener("resize", resize);
    return () => { stop(); io.disconnect(); window.removeEventListener("resize", resize); };
  }, [count]);
  return <canvas ref={ref} aria-hidden className={`pointer-events-none ${className}`} />;
}
