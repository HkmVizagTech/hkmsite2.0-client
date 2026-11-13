"use client";

import { useEffect, useRef, useState } from "react";
import RunSprite, { IMG, RUN_RATIO, mascotScale } from "./RunSprite";
import { GroundShadow, Puff } from "./Fx";
import { BUTTER_ROPE_TOP, BUTTER_STEAL as ST } from "./butterSteal";

// licking-the-butter clip (Gemini video) at the full 24 fps: 97 frames, 10-column grid of 158x204; his body fills
// 94.6% of the frame height with 2% under him
const EAT = { file: "butter-eat-24", frames: 97, cols: 10, rows: 10, w: 158, h: 204, fps: 24, kidSpan: 0.946, footGap: 0.02 };

/**
 * Makhan Chor: a clay butter pot is lowered on a real (physics) rope to the floor of the screen; little Krishna runs
 * in, kneels and dips his hand into the butter (holding the rope), then sits back licking his fingers with joy while
 * the empty rope is pulled away; then he hops off. About 7.5 seconds. Tap anywhere on him to end it early.
 *
 */

const POT_ROPE_X = 0.505;
const RATIO = { pot: 192 / 360, run: RUN_RATIO };

type Phase = "lower" | "run" | "reach" | "eat" | "leave";
type P = { x: number; y: number; px: number; py: number };

export default function MakhanChor({ lift, leave, onDone }: { lift: number; leave: boolean; onDone: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const potEl = useRef<HTMLImageElement>(null);
  const eatEl = useRef<HTMLDivElement>(null);
  const stealEl = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("lower");
  const [landed, setLanded] = useState(false);
  const landedRef = useRef(false);
  const phaseRef = useRef<Phase>("lower");
  const leaveRef = useRef(leave);
  leaveRef.current = leave;
  const liftRef = useRef(lift);
  liftRef.current = lift;

  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const phone = vw < 768;
  const sc = mascotScale();
  const kidH = Math.round(146 * sc);
  const potH = Math.round(118 * sc);
  const anchorX = vw * (phone ? 0.74 : 0.8);
  // where the run ends: his right edge just left of the pot
  const runEndX = anchorX - potH * RATIO.pot * 0.5 - kidH * RATIO.run * 0.95;
  // reach picture placed so its rope meets the rope from above
  // the stealing video: sized so his body matches the other pictures; its rope sits under the screen rope
  const stealH = kidH / ST.kidSpan;
  const stealW = stealH * (ST.w / ST.h);
  const stealLeft = anchorX - BUTTER_ROPE_TOP[0] * stealW;
  const STEAL_MS = (ST.frames / ST.fps) * 1000;
  const eatH = (kidH * 1.02) / EAT.kidSpan;
  const eatW = eatH * (EAT.w / EAT.h);
  const eatLeft = anchorX - eatW * 0.6;
  const EAT_MS = (EAT.frames / EAT.fps) * 1000;

  const go = (p: Phase) => { phaseRef.current = p; setPhase(p); };

  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = window.innerWidth;
    const H = window.innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    ctx.scale(dpr, dpr);

    const N = 16;
    const anchor = { x: anchorX, y: -4 };
    // start as a short coil just above the screen (points must not coincide, or the rope cannot unfold)
    const pts: P[] = Array.from({ length: N + 1 }, (_, i) => {
      const x = anchorX + (Math.random() - 0.5) * 4;
      const y = -4 - i * 0.6;
      return { x, y, px: x, py: y };
    });
    const ground = () => H - liftRef.current - 10;
    let ropeLen = 10;
    const t0 = performance.now();
    let raf = 0;
    let pullFrom = 0;
    let finished = false;
    let potAng = 0;

    const timeline: [number, Phase][] = [[1700, "run"], [3200, "reach"], [3200 + STEAL_MS, "eat"], [3200 + STEAL_MS + EAT_MS, "leave"]];
    let eatStart = 0;
    let reachStart = 0;

    const step = (now: number) => {
      const t = now - t0;
      const ph = phaseRef.current;
      if (leaveRef.current && ph !== "leave") go("leave");
      for (const [at, p] of timeline) {
        const order: Phase[] = ["lower", "run", "reach", "eat", "leave"];
        if (t >= at && order.indexOf(phaseRef.current) < order.indexOf(p)) go(p);
      }
      if (phaseRef.current === "leave" && !finished) {
        finished = true;
        window.setTimeout(onDone, 650);
      }

      // the rope pays out until the pot rests on the floor, then stays; pulled up once he has the butter
      const fullLen = ground() - potH - anchor.y;
      const p2 = phaseRef.current;
      if (p2 === "lower") ropeLen = Math.min(fullLen, ropeLen + (fullLen - ropeLen) * 0.06 + 2);
      else if (p2 === "run" || p2 === "reach") ropeLen = fullLen;
      if (p2 === "eat" || p2 === "leave") {
        if (!pullFrom) pullFrom = now;
        const k = Math.min(1, (now - pullFrom) / 1100);
        anchor.y = -4 - k * k * (fullLen + 160);
      }
      const seg = ropeLen / N;

      // integrate (the pot end is heavy; in "reach" the end is held by his hand)
      for (let i = 1; i <= N; i++) {
        const p = pts[i];
        const vx = (p.x - p.px) * 0.985;
        const vy = (p.y - p.py) * 0.985;
        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy + 0.6;
      }
      const held = p2 === "reach";
      let handX = anchorX;
      const handY = ground() - stealH;
      if (p2 === "eat" || p2 === "leave") {
        if (!eatStart) eatStart = now;
        const f = Math.min(EAT.frames - 1, Math.floor(((now - eatStart) / 1000) * EAT.fps));
        if (eatEl.current) eatEl.current.style.backgroundPosition = `${-(f % EAT.cols) * eatW}px ${-Math.floor(f / EAT.cols) * eatH}px`;
      }
      if (held) {
        if (!reachStart) reachStart = now;
        const f = Math.min(ST.frames - 1, Math.floor(((now - reachStart) / 1000) * ST.fps));
        handX = stealLeft + BUTTER_ROPE_TOP[f] * stealW;
        if (stealEl.current) stealEl.current.style.backgroundPosition = `${-(f % ST.cols) * stealW}px ${-Math.floor(f / ST.cols) * stealH}px`;
      }
      for (let it = 0; it < 14; it++) {
        pts[0].x = anchor.x;
        pts[0].y = anchor.y;
        for (let i = 0; i < N; i++) {
          const a = pts[i];
          const b = pts[i + 1];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.0001;
          const diff = (d - seg) / d;
          const wa = i === 0 ? 0 : 1;
          const wb = i + 1 === N ? (held ? 0 : 0.25) : 1;
          const sum = wa + wb || 1;
          a.x += dx * diff * (wa / sum);
          a.y += dy * diff * (wa / sum);
          b.x -= dx * diff * (wb / sum);
          b.y -= dy * diff * (wb / sum);
        }
        if (held) { pts[N].x = handX; pts[N].y = handY; }
        // the pot cannot go through the floor
        if (!held && pts[N].y > ground() - potH) pts[N].y = ground() - potH;
      }

      // draw the rope
      ctx.clearRect(0, 0, W, H);
      const ropeW = phone ? 3.2 : 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const path = () => {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < N; i++) ctx.quadraticCurveTo(pts[i].x, pts[i].y, (pts[i].x + pts[i + 1].x) / 2, (pts[i].y + pts[i + 1].y) / 2);
        ctx.lineTo(pts[N].x, pts[N].y);
      };
      ctx.shadowColor = "rgba(10,22,64,.22)";
      ctx.shadowBlur = 5;
      path();
      ctx.strokeStyle = "#A87A2E";
      ctx.lineWidth = ropeW;
      ctx.stroke();
      ctx.shadowColor = "transparent";
      path();
      ctx.strokeStyle = "#E2B055";
      ctx.lineWidth = ropeW * 0.55;
      ctx.stroke();
      path();
      ctx.strokeStyle = "rgba(120,80,25,.5)";
      ctx.lineWidth = ropeW * 0.7;
      ctx.setLineDash([ropeW * 0.7, ropeW]);
      ctx.lineDashOffset = -anchor.y * 0.5;
      ctx.stroke();
      ctx.setLineDash([]);

      // the hanging pot follows the rope end until he takes over
      if (potEl.current) {
        const a = pts[N - 2];
        const b = pts[N];
        // swings with the rope while hanging; settles upright once it rests on the floor
        const onFloor = b.y >= ground() - potH - 1.5;
        if (onFloor && !landedRef.current) { landedRef.current = true; setLanded(true); }
        const target = onFloor ? 0 : Math.max(-0.35, Math.min(0.35, Math.atan2(b.x - a.x, b.y - a.y)));
        potAng += (target - potAng) * (onFloor ? 0.12 : 0.35);
        const ang = potAng;
        potEl.current.style.transform = `translate(${b.x - potH * RATIO.pot * POT_ROPE_X}px, ${b.y - 2}px) rotate(${-ang}rad)`;
        potEl.current.style.opacity = p2 === "lower" || p2 === "run" ? "1" : "0";
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [anchorX, kidH, potH, phone, onDone, stealH, stealW, stealLeft, STEAL_MS, eatH, eatW, EAT_MS]);

  const bottom = `${lift + 10}px`;
  const shadow = "drop-shadow-[0_10px_14px_rgba(10,22,64,.28)]";

  return (
    <>
      <canvas ref={canvas} className="pointer-events-none absolute inset-0 h-full w-full" />
      <img
        ref={potEl}
        src={IMG("pot")}
        alt=""
        draggable={false}
        className={`pointer-events-none absolute left-0 top-0 w-auto select-none opacity-0 ${shadow}`}
        style={{ height: potH, transformOrigin: `${POT_ROPE_X * 100}% 0%`, willChange: "transform" }}
      />

      {/* runs in from the left */}
      {phase === "run" && (
        <span className="pointer-events-auto absolute left-0 kc-run-in" style={{ bottom, ["--kc-to" as string]: `${runEndX}px` }}>
          <RunSprite height={kidH} className={shadow} />
        </span>
      )}

      {/* kneels and dips his hand into the butter */}
      {(phase === "reach" || phase === "eat") && (
        <div ref={stealEl} className={`pointer-events-auto absolute ${phase === "eat" ? "kc-xfade-out" : "kc-pop"} ${shadow}`}
          style={{ width: stealW, height: stealH, left: stealLeft, bottom, backgroundImage: `url(${IMG(ST.file)})`, backgroundSize: `${stealW * ST.cols}px ${stealH * ST.rows}px`, backgroundRepeat: "no-repeat" }} />
      )}

      {/* sits back and licks his fingers */}
      {(phase === "eat" || phase === "leave") && (
        <div ref={eatEl}
          className={`pointer-events-auto absolute ${phase === "leave" ? "kc-hop-off" : "kc-xfade-in"} ${shadow}`}
          style={{ width: eatW, height: eatH, left: eatLeft, bottom: lift + 10 - eatH * EAT.footGap, backgroundImage: `url(${IMG(EAT.file)})`, backgroundSize: `${eatW * EAT.cols}px ${eatH * EAT.rows}px`, backgroundRepeat: "no-repeat" }} />
      )}
      {phase === "eat" && (
        <span className="pointer-events-none absolute kc-heart text-2xl" style={{ left: eatLeft + eatW * 0.72, bottom: lift + 10 + eatH * 0.8 }}>💛</span>
      )}
      {/* gold dust when the pot touches down; soft shadows on the floor */}
      {landed && (phase === "lower" || phase === "run") && (
        <span className="pointer-events-none absolute" style={{ left: anchorX, bottom: lift + 10 }}><Puff size={sc} /></span>
      )}
      {landed && (
        <span className="pointer-events-none absolute block" style={{ left: anchorX - potH * 0.6, bottom: lift + 10, width: potH * 1.2, height: 0 }}>
          <GroundShadow width={potH * 1.5} />
        </span>
      )}
      {phase === "run" && (
        <span className="pointer-events-none absolute left-0 kc-run-in block" style={{ bottom, width: kidH * RATIO.run, height: 0, ["--kc-to" as string]: `${runEndX}px` }}>
          <GroundShadow width={kidH * RATIO.run} bob />
        </span>
      )}
    </>
  );
}
