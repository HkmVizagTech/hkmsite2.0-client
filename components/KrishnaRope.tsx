"use client";

import { useEffect, useRef } from "react";
import { IMG, mascotScale } from "@/components/krishna/RunSprite";
import { ROPE_SWING as SH, ROPE_TOP } from "@/components/krishna/ropeSwing";

/**
 * Krishna on a real rope. A Verlet-physics rope drops from the top of the screen with Krishna on it (first video
 * frame), stretches and settles; then the video performance plays (swing, giggle, wink, wave) while the physics rope
 * stays joined to wherever the rope leaves the top of each video frame; then he is pulled back up. Tap -> pulled up.
 */

type P = { x: number; y: number; px: number; py: number; w: number };

export default function KrishnaRope({ leave, onDone }: { leave: boolean; onDone: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const kid = useRef<HTMLDivElement>(null);
  const leaveRef = useRef(leave);
  leaveRef.current = leave;

  const phone = typeof window !== "undefined" && window.innerWidth < 768;
  const boxH = Math.round(236 * mascotScale());
  const boxW = boxH * (SH.w / SH.h);

  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    cv.width = vw * dpr;
    cv.height = vh * dpr;
    ctx.scale(dpr, dpr);

    const ropeW = Math.max(3, boxW * 0.045);
    const L = Math.min(vh * (phone ? 0.2 : 0.24), 240);
    const N = 16;
    const seg = L / N;
    const anchor = { x: vw * (phone ? 0.74 : 0.84), y: -4 };

    const pts: P[] = Array.from({ length: N + 1 }, (_, i) => {
      const x = anchor.x + (Math.random() - 0.5) * 4;
      const y = anchor.y - i * 0.6;
      return { x, y, px: x, py: y, w: i === 0 ? 0 : i === N ? 0.2 : 1 };
    });

    const DROP_MS = 1500;
    const PLAY_MS = (SH.frames / SH.fps) * 1000;
    const PULL_MS = 1200;
    const t0 = performance.now();
    let mode: "drop" | "play" | "pull" = "drop";
    let playStart = 0;
    let pullStart = 0;
    let box = { x: 0, y: 0 };
    let tilt = 0;
    let frame = 0;
    let raf = 0;
    let done = false;

    const setFrame = (f: number) => {
      if (!kid.current) return;
      const col = f % SH.cols;
      const row = Math.floor(f / SH.cols);
      kid.current.style.backgroundPosition = `${-col * boxW}px ${-row * boxH}px`;
    };

    const step = (now: number) => {
      const t = now - t0;
      if (mode === "drop" && (t > DROP_MS || leaveRef.current)) {
        if (leaveRef.current) { mode = "pull"; pullStart = now; }
        else {
          mode = "play";
          playStart = now;
          // freeze his box where the drop left him
          const end = pts[N];
          box = { x: end.x - ROPE_TOP[0] * boxW, y: end.y };
        }
      }
      if (mode === "play") {
        frame = Math.min(SH.frames - 1, Math.floor(((now - playStart) / 1000) * SH.fps));
        if (now - playStart >= PLAY_MS || leaveRef.current) { mode = "pull"; pullStart = now; }
      }
      if (mode === "pull") {
        const k = Math.min(1, (now - pullStart) / PULL_MS);
        const e = k * k * (3 - 2 * k);
        anchor.y = -4 - e * (L + boxH + 120);
        if (k >= 1 && !done) { done = true; onDone(); return; }
      }

      // integrate
      const damping = mode === "drop" ? 0.975 : 0.985;
      for (let i = 1; i <= N; i++) {
        const p = pts[i];
        const vx = (p.x - p.px) * damping;
        const vy = (p.y - p.py) * damping;
        p.px = p.x; p.py = p.y;
        p.x += vx; p.y += vy + 0.55;
      }
      const pinned = mode === "play";
      const pin = { x: box.x + ROPE_TOP[frame] * boxW, y: box.y };
      for (let it = 0; it < 14; it++) {
        pts[0].x = anchor.x; pts[0].y = anchor.y;
        for (let i = 0; i < N; i++) {
          const a = pts[i], b = pts[i + 1];
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.0001;
          // while playing, the rope may stretch a little so it can follow the video's rope
          const target = pinned ? Math.max(seg, Math.hypot(pin.x - anchor.x, pin.y - anchor.y) / N) : seg;
          const diff = ((d - target) / d) * 0.97;
          const wa = i === 0 ? 0 : a.w, wb = i + 1 === N && pinned ? 0 : b.w;
          const sum = wa + wb || 1;
          a.x += dx * diff * (wa / sum); a.y += dy * diff * (wa / sum);
          b.x -= dx * diff * (wb / sum); b.y -= dy * diff * (wb / sum);
        }
        if (pinned) { pts[N].x = pin.x; pts[N].y = pin.y; }
      }

      // draw the rope (colour matched to the rope in the video)
      ctx.clearRect(0, 0, vw, vh);
      const path = () => {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < N; i++) ctx.quadraticCurveTo(pts[i].x, pts[i].y, (pts[i].x + pts[i + 1].x) / 2, (pts[i].y + pts[i + 1].y) / 2);
        ctx.lineTo(pts[N].x, pts[N].y + 2);
      };
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.shadowColor = "rgba(10,22,64,.22)"; ctx.shadowBlur = 5; ctx.shadowOffsetX = 2;
      path(); ctx.strokeStyle = "#9C6E2C"; ctx.lineWidth = ropeW; ctx.stroke();
      ctx.shadowColor = "transparent";
      path(); ctx.strokeStyle = "#D7A55A"; ctx.lineWidth = ropeW * 0.6; ctx.stroke();
      path(); ctx.strokeStyle = "rgba(115,75,25,.5)"; ctx.lineWidth = ropeW * 0.7;
      ctx.setLineDash([ropeW * 0.7, ropeW * 1.05]); ctx.lineDashOffset = -anchor.y * 0.6; ctx.stroke(); ctx.setLineDash([]);

      // place Krishna: hanging from the rope end (tilting) while dropping / pulled, fixed while the video plays
      if (kid.current) {
        let x: number, y: number;
        if (mode === "play") {
          tilt *= 0.85;
          x = box.x; y = box.y;
        } else {
          const a = pts[N - 2], b = pts[N];
          const ang = Math.max(-0.35, Math.min(0.35, Math.atan2(b.x - a.x, b.y - a.y)));
          tilt += (-ang - tilt) * 0.3;
          x = b.x - ROPE_TOP[frame] * boxW; y = b.y;
        }
        kid.current.style.transform = `translate(${x}px, ${y}px) rotate(${tilt}rad)`;
        kid.current.style.transformOrigin = `${ROPE_TOP[frame] * 100}% 0%`;
        kid.current.style.opacity = "1";
        setFrame(frame);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [boxH, boxW, phone, onDone]);

  return (
    <>
      <canvas ref={canvas} className="pointer-events-none absolute inset-0 h-full w-full" />
      <div
        ref={kid}
        className="pointer-events-auto absolute left-0 top-0 opacity-0 drop-shadow-[0_10px_14px_rgba(10,22,64,.28)]"
        style={{
          width: boxW,
          height: boxH,
          backgroundImage: `url(${IMG(SH.file)})`,
          backgroundSize: `${boxW * SH.cols}px ${boxH * SH.rows}px`,
          backgroundRepeat: "no-repeat",
          willChange: "transform",
        }}
      />
    </>
  );
}
