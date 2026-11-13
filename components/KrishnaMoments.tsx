"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import KrishnaRope from "@/components/KrishnaRope";
import RunSprite, { BRICK_SHEET, CALF_SHEET, CycleSprite, SeqSprite, WAVE_SHEET, mascotScale, type SeqSheet, IMG, RUN_SHEET, crossSeconds } from "@/components/krishna/RunSprite";
import MakhanChor from "@/components/krishna/MakhanChor";
import FluteOnCard, { fluteHasCard } from "@/components/krishna/FluteOnCard";
import PetalShower from "@/components/krishna/PetalShower";
import { Glow, GoldDust, GroundShadow } from "@/components/krishna/Fx";
import Companion from "@/components/krishna/Companion";

// peeking from the left screen edge (Gemini video): 64 frames at 12 fps, 10-column grid of 220x272, played once
const PEEK: SeqSheet = { file: "peek-play", frames: 64, cols: 10, rows: 7, w: 220, h: 272, fps: 12 };

/**
 * Little Krishna moments: once in a while, a cute baby Krishna runs, peeks, swings on a rope, carries a golden brick
 * or waves somewhere at the edge of the screen, for a few seconds, then leaves.
 *
 * Kept rare on purpose: at most one moment per page view, only after the visitor has spent ~5-10s on the page, and
 * then not again for 5 minutes (across all pages). Never in admin/dashboards/checkout, never while a dialog is open
 * or the visitor is typing, never for reduced motion. Tap Krishna and he hops away.
 *
 * Moments: run, calf (running with a calf), rope (physics rope), peek, brick (donation pages), wave, butter (Makhan
 * Chor: pot lowered on a rope, Krishna steals butter), flute (sits on a real card playing, notes float up) and petals
 * (thank-you pages only, played once there).
 *
 * Testing: add ?krishna=<moment> (or ?krishna=1 for a random one) to any URL to play it right away.
 */

type Kind = "run" | "calf" | "rope" | "peek" | "brick" | "wave" | "butter" | "flute" | "petals";
const KINDS: Kind[] = ["run", "calf", "rope", "peek", "brick", "wave", "butter", "flute", "petals"];
const IMAGES: Record<Kind, string[]> = {
  run: ["run-cycle"], calf: ["run-cycle", "calf-gallop"], rope: ["rope-swing"], peek: ["peek-play"], brick: ["brick-walk"], wave: ["wave-loop"],
  butter: ["pot", "run-cycle", "butter-steal", "butter-eat-24"], flute: ["flute-play"], petals: ["petals"],
};

const LAST_KEY = "hkm_krishna_last";
const GAP_MS = 5 * 60 * 1000;
const EXCLUDE = /^\/(te\/)?(admin|preacher|donor|payment|track|login|checkout)(\/|$)/;
const THANKS = /\/thank-you(\/|$)/;
// Gau Seva pages: Krishna always runs with the calf there (and only there)
const GAU_PAGES = /gau-seva/i;

// safety limits; the scene components end themselves earlier
const DURATION: Record<Kind, number> = { run: 5200, calf: 6200, brick: 7600, rope: 11500, peek: 6200, wave: 5800, butter: 16500, flute: 7500, petals: 7200 };

// temple-construction pages: Krishna always carries a golden brick there
const BRICK_PAGES = /(sqft|square-?f|brick)/i;

function pickKind(path: string): Kind {
  if (BRICK_PAGES.test(path)) return "brick";
  if (GAU_PAGES.test(path)) return "calf";
  // everywhere else: no calf, no brick
  const pool: Kind[] = ["run", "rope", "peek", "wave", "butter", "butter", "flute", "flute"];
  // the flute needs a card on screen to sit on; without one, choose something else (never a silent no-show)
  const usable = typeof window !== "undefined" && !fluteHasCard() ? pool.filter((k) => k !== "flute") : pool;
  return usable[Math.floor(Math.random() * usable.length)];
}

function busy(): boolean {
  if (document.querySelector('[role="dialog"][aria-modal="true"], [data-state="open"][role="dialog"]')) return true;
  const a = document.activeElement as HTMLElement | null;
  return !!a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA" || a.tagName === "SELECT" || a.isContentEditable);
}

/** Height of whatever is fixed along the bottom of the screen (bottom nav, sticky donate bars), so he walks above it. */
function bottomClearance(): number {
  const vh = window.innerHeight, vw = window.innerWidth;
  let top = vh;
  for (const el of document.body.querySelectorAll<HTMLElement>("*")) {
    const cs = getComputedStyle(el);
    if (cs.position !== "fixed" && cs.position !== "sticky") continue;
    if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) continue;
    const r = el.getBoundingClientRect();
    if (r.bottom >= vh - 4 && r.top > vh * 0.5 && r.width > vw * 0.5) top = Math.min(top, r.top);
  }
  return Math.max(0, vh - top);
}

export default function KrishnaMoments() {
  const path = usePathname() || "/";
  const reduce = useReducedMotion();
  const [kind, setKind] = useState<Kind | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [lift, setLift] = useState(0);
  // crossing times that match his steps on this screen (set when a moment starts)
  const [cross, setCross] = useState({ run: 5.2, calf: 6.2, brick: 7.6 });
  const te = path === "/te" || path.startsWith("/te/");
  const timers = useRef<number[]>([]);

  const clear = () => { timers.current.forEach((t) => window.clearTimeout(t)); timers.current = []; };

  const play = useCallback((k: Kind, celebration = false) => {
    // warm the image first so he never appears half-loaded
    const imgs = IMAGES[k].map((n) => { const i = new Image(); i.src = IMG(n); return i; });
    const img = imgs[0];
    const start = () => {
      setLift(bottomClearance());
      setLeaving(false);
      setKind(k);
      if (!celebration) { try { localStorage.setItem(LAST_KEY, String(Date.now())); } catch {} }
      const vw = window.innerWidth;
      const rh = Math.round(140 * mascotScale());
      const c = { run: crossSeconds(RUN_SHEET, rh, vw + 260), calf: crossSeconds(RUN_SHEET, rh, vw + 480), brick: crossSeconds(BRICK_SHEET, rh, vw + 260) };
      setCross(c);
      const ms = k === "run" || k === "calf" || k === "brick" ? c[k] * 1000 + 300 : DURATION[k];
      timers.current.push(window.setTimeout(() => setKind(null), ms));
    };
    Promise.all(imgs.map((i) => (i.complete ? Promise.resolve() : new Promise((r) => { i.onload = r; i.onerror = r; })))).then(start);
  }, []);

  useEffect(() => {
    clear();
    setKind(null);
    const thanks = THANKS.test(path);
    if (reduce || (EXCLUDE.test(path) && !thanks)) return;

    const force = new URLSearchParams(window.location.search).get("krishna");
    if (force) {
      const k = (KINDS as string[]).includes(force) ? (force as Kind) : pickKind(path);
      timers.current.push(window.setTimeout(() => play(k), 1200));
      return clear;
    }

    // thank-you pages (every donation flow lands on one): the petal shower, every time, as the page opens. It does
    // not count against the rare-moment limit.
    if (thanks) {
      timers.current.push(window.setTimeout(() => play("petals", true), 700));
      return clear;
    }

    // Gau Seva / Square Foot / Brick: the calf or brick moment plays when the donation cards come into view (once per
    // visit to the page, not limited by the 5-minute gap), a moment after any scroll to them has settled
    if (BRICK_PAGES.test(path) || GAU_PAGES.test(path)) {
      let io: IntersectionObserver | null = null;
      let fired = false;
      const watch = () => {
        const target = document.getElementById("donate");
        if (!target) { timers.current.push(window.setTimeout(watch, 500)); return; }
        io = new IntersectionObserver((entries) => {
          if (fired || !entries.some((e) => e.isIntersecting)) return;
          fired = true;
          io?.disconnect();
          timers.current.push(window.setTimeout(() => play(pickKind(path), true), 1200));
        }, { threshold: 0.2 });
        io.observe(target);
      };
      watch();
      return () => { io?.disconnect(); clear(); };
    }

    let last = 0;
    try { last = Number(localStorage.getItem(LAST_KEY)) || 0; } catch {}
    if (Date.now() - last < GAP_MS) return;

    // count only time the tab is actually visible
    let visibleMs = 0;
    const target = 5000 + Math.random() * 5000;
    const tick = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      visibleMs += 1000;
      if (visibleMs < target) return;
      if (busy()) return; // try again next second
      window.clearInterval(tick);
      play(pickKind(path));
    }, 1000);
    timers.current.push(tick as unknown as number);
    return () => { window.clearInterval(tick); clear(); };
  }, [path, reduce, play]);

  // bars can slide in or out while he is on screen (e.g. a sticky donate bar after scrolling): keep above them
  useEffect(() => {
    const id = window.setInterval(() => setLift(bottomClearance()), kind ? 300 : 900);
    return () => window.clearInterval(id);
  }, [kind]);

  const endNow = useCallback(() => { clear(); setKind(null); }, []);

  // tap: hop away early (on the rope he is pulled up instead)
  const shoo = () => {
    if (!kind || leaving) return;
    setLeaving(true);
    clear();
    if (kind === "rope" || kind === "butter" || kind === "flute") return; // these scenes leave on their own
    if (kind === "petals") return;
    timers.current.push(window.setTimeout(() => setKind(null), 450));
  };

  const hopAway = leaving ? { y: -60, opacity: 0, scale: 0.8, transition: { duration: 0.4, ease: "easeIn" as const } } : undefined;
  const bottom = `${lift + 10}px`;
  const sc = mascotScale();
  const runH = Math.round(140 * sc);
  const runW = runH * (178 / 280);
  const dust = <GoldDust size={sc} />;

  return (
    <>
    <div aria-hidden className={`pointer-events-none fixed inset-0 overflow-hidden ${kind === "petals" ? "z-[200]" : "z-[60]"}`}>
      <AnimatePresence>
        {kind === "run" && (
          <motion.button key="run" type="button" tabIndex={-1} onClick={shoo} className="pointer-events-auto absolute left-0 transition-[bottom] duration-300" style={{ bottom }}
            initial={{ x: "-180px" }} animate={hopAway ?? { x: "calc(100vw + 40px)" }} exit={{ opacity: 0 }} transition={{ duration: cross.run, ease: "linear" }}>
            <span className="relative block">
              {dust}
              <GroundShadow width={runW} bob />
              <RunSprite height={runH} className="relative drop-shadow-[0_8px_10px_rgba(10,22,64,.22)]" />
            </span>
          </motion.button>
        )}

        {kind === "calf" && (
          <motion.button key="calf" type="button" tabIndex={-1} onClick={shoo} className="pointer-events-auto absolute left-0 flex items-end transition-[bottom] duration-300" style={{ bottom }}
            initial={{ x: "-460px" }} animate={hopAway ?? { x: "calc(100vw + 40px)" }} exit={{ opacity: 0 }} transition={{ duration: cross.calf, ease: "linear" }}>
            {/* the calf bounds along behind him */}
            <span className="relative -mr-2 block">
              <GroundShadow width={runH * 0.8 * (318 / 280)} bob />
              <CycleSprite sheet={CALF_SHEET} height={Math.round(runH * 0.8)} className="relative drop-shadow-[0_8px_10px_rgba(10,22,64,.2)]" />
            </span>
            <span className="relative block">
              {dust}
              <GroundShadow width={runW} bob />
              <RunSprite height={runH} className="relative drop-shadow-[0_8px_10px_rgba(10,22,64,.22)]" />
            </span>
          </motion.button>
        )}

        {kind === "butter" && (
          <motion.div key="butter" className="absolute inset-0" onClick={shoo} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
            <MakhanChor lift={lift} leave={leaving} onDone={endNow} />
          </motion.div>
        )}

        {kind === "flute" && (
          <motion.div key="flute" className="absolute inset-0" onClick={shoo} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
            <FluteOnCard leave={leaving} onDone={endNow} />
          </motion.div>
        )}

        {kind === "petals" && (
          <motion.div key="petals" className="absolute inset-0" exit={{ opacity: 0, transition: { duration: 0.4 } }}>
            <PetalShower lift={lift} onDone={endNow} />
          </motion.div>
        )}

        {kind === "brick" && (
          <motion.button key="brick" type="button" tabIndex={-1} onClick={shoo} className="pointer-events-auto absolute left-0 transition-[bottom] duration-300" style={{ bottom }}
            initial={{ x: "-180px" }} animate={hopAway ?? { x: "calc(100vw + 40px)" }} exit={{ opacity: 0 }} transition={{ duration: cross.brick, ease: "linear" }}>
            <span className="relative block">
              <GroundShadow width={runH * (169 / 280)} />
              <CycleSprite sheet={BRICK_SHEET} height={runH} className="relative drop-shadow-[0_8px_10px_rgba(10,22,64,.22)]" />
            </span>
          </motion.button>
        )}

        {kind === "rope" && (
          <motion.div key="rope" className="absolute inset-0" onClick={shoo} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
            <KrishnaRope leave={leaving} onDone={endNow} />
          </motion.div>
        )}

        {kind === "peek" && (
          <motion.button key="peek" type="button" tabIndex={-1} onClick={shoo} className="pointer-events-auto absolute -left-1"
            style={{ top: "44%" }}
            initial={{ opacity: 1 }} animate={hopAway ? { x: -80, opacity: 0, transition: { duration: 0.35 } } : { opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
            <Glow size={Math.round(250 * sc)} className="!left-[30%]" />
            <SeqSprite sheet={PEEK} height={Math.round(240 * sc)} onEnd={endNow} className="drop-shadow-[0_8px_14px_rgba(10,22,64,.25)]" />
          </motion.button>
        )}

        {kind === "wave" && (
          <motion.button key="wave" type="button" tabIndex={-1} onClick={shoo} className="pointer-events-auto absolute left-3 md:left-6" style={{ bottom }}
            initial={{ scale: 0, opacity: 0, y: 30 }}
            animate={hopAway ?? { scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0, y: 20, transition: { duration: 0.35 } }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}>
            <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="absolute -top-2 left-[78%] whitespace-nowrap rounded-2xl rounded-bl-sm bg-white px-3 py-1.5 text-[13px] font-bold text-[#1E3A8A] shadow-[0_8px_20px_-8px_rgba(10,22,64,.45)] ring-1 ring-[#F6C752]/70">
              {te ? "హరే కృష్ణ 🙏" : "Hare Krishna 🙏"}
            </motion.span>
            <span className="relative block">
              <Glow size={runH * 1.3} />
              <GroundShadow width={runH * (196 / 280)} />
              <CycleSprite sheet={WAVE_SHEET} height={runH} className="relative drop-shadow-[0_8px_10px_rgba(10,22,64,.22)]" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>

    {/* the little companion, always there on public pages (tap him for a moment); own layer so his buttons stay accessible */}
    {!reduce && !EXCLUDE.test(path) && (
      <div className="pointer-events-none fixed inset-0 z-[59] overflow-hidden">
        <Companion lift={lift} away={!!kind} />
      </div>
    )}
    </>
  );
}
