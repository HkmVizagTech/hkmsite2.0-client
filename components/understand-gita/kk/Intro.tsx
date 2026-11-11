"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LINES = ["5,000 years ago", "on the field of Kurukshetra", "a warrior lost his way."];
const KEY = "kk-intro-seen";
export const INTRO_DONE = "kk-intro-done";

/** Opening title sequence: gold lines on black, then it lifts to reveal the battlefield. Once per visit, skippable. */
export default function Intro() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === "1"; } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      window.dispatchEvent(new Event(INTRO_DONE));
      return;
    }
    setShow(true);
    const t = [setTimeout(() => setStep(1), 900), setTimeout(() => setStep(2), 1800), setTimeout(() => finish(), 3300)];
    return () => t.forEach(clearTimeout);
  }, []);

  function finish() {
    try { sessionStorage.setItem(KEY, "1"); } catch {}
    setShow(false);
    window.dispatchEvent(new Event(INTRO_DONE));
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div key="intro" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.1, ease: "easeInOut" }} className="fixed inset-0 z-[80] flex items-center justify-center bg-[#04060E] px-6 text-center">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_55%,rgba(246,199,82,.10),transparent_70%)]" />
          <div className="relative space-y-3">
            {LINES.map((l, i) => (
              <motion.p
                key={l}
                initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                animate={step >= i ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={i === 2 ? "kk-gold-text font-[family-name:var(--font-cinzel)] text-2xl font-bold uppercase tracking-[0.06em] md:text-5xl" : "font-serif-display text-lg italic text-[#FFE6A3]/85 md:text-3xl"}
              >
                {l}
              </motion.p>
            ))}
          </div>
          <button type="button" onClick={finish} className="absolute bottom-8 right-6 rounded-full border border-white/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 hover:text-white">
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
