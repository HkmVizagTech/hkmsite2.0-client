"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LIFE, PRABHUPADA_PORTRAIT } from "@/lib/srilaPrabhupada";
import { useT } from "@/components/i18n/LocaleProvider";

const GOLD_TEXT = "bg-[linear-gradient(180deg,#FFF1C9_0%,#F6C752_50%,#C98B1E_100%)] bg-clip-text text-transparent";

/**
 * His life as a journey: on desktop a sticky panel on the left shows the year of the milestone being read (large,
 * gold) over his portrait, while the milestones scroll past on the right. On phones each milestone is a card with
 * its year in large gold numerals, joined by a gold thread.
 */
export default function LifeJourney() {
  const t = useT();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    // The active milestone is the last one whose top has passed the middle of the screen, so the year is right even
    // when the page is opened or reloaded below the timeline.
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let i = 0;
      refs.current.forEach((el, k) => { if (el && el.getBoundingClientRect().top < mid) i = k; });
      setActive(i);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const m = LIFE[active];
  return (
    <section id="life" className="relative isolate scroll-mt-16 overflow-clip bg-[#0A1233] py-16 text-white md:py-24">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(50%_40%_at_20%_30%,rgba(246,199,82,.14),transparent_70%),radial-gradient(40%_50%_at_90%_80%,rgba(47,91,211,.35),transparent_70%)]" />
      <div className="vk-container">
        <div className="text-center">
          <p className="flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#F6C752]">
            <span aria-hidden className="h-px w-10 bg-gradient-to-r from-transparent to-[#F6C752]" /> {t("A life of pure devotion")} <span aria-hidden className="h-px w-10 bg-gradient-to-l from-transparent to-[#F6C752]" />
          </p>
          <h2 className={`mx-auto mt-4 max-w-3xl font-serif-display text-4xl font-bold leading-tight md:text-6xl ${GOLD_TEXT}`}>{t("From Calcutta to the whole world")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">{t("How one devotee, at the age of seventy, gave Krishna consciousness to every continent.")}</p>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
          {/* desktop: sticky year + portrait */}
          <div className="hidden lg:block">
            <div className="sticky top-[calc(var(--header-h)+40px)]">
              <div className="relative overflow-hidden rounded-[2rem] border border-[#F6C752]/30">
                <div className="relative aspect-[4/5]">
                  <Image src={PRABHUPADA_PORTRAIT} alt="" fill sizes="480px" className="object-cover object-top opacity-40 grayscale-[30%]" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0A1233] via-[#0A1233]/60 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <AnimatePresence mode="wait">
                    <motion.div key={active} initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
                      <p className={`font-serif-display text-8xl font-bold leading-none ${GOLD_TEXT}`}>{m.year}</p>
                      <p className="mt-3 font-serif-display text-2xl italic text-white">{t(m.title)}</p>
                    </motion.div>
                  </AnimatePresence>
                  <div className="mt-6 flex gap-1.5" aria-hidden>
                    {LIFE.map((_, i) => <span key={i} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= active ? "bg-[#F6C752]" : "bg-white/20"}`} />)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* phones: sticky portrait strip with the year being read */}
          <div className="sticky top-[calc(var(--header-h)+12px)] z-20 -mb-4 lg:hidden">
            <div className="flex items-center gap-4 rounded-2xl border border-[#F6C752]/35 bg-[#0A1233]/[.97] p-3 pr-4 shadow-[0_12px_40px_rgba(0,0,0,.45)] backdrop-blur-md">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-[#F6C752] ring-offset-2 ring-offset-[#0A1233]">
                <Image src={PRABHUPADA_PORTRAIT} alt={t("Srila Prabhupada")} fill sizes="64px" className="object-cover object-top" />
              </div>
              <div className="min-w-0 flex-1">
                <AnimatePresence mode="wait">
                  <motion.div key={active} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
                    <p className={`font-serif-display text-3xl font-bold leading-none ${GOLD_TEXT}`}>{m.year}</p>
                    <p className="mt-1 truncate font-serif-display text-sm italic text-white/85">{t(m.title)}</p>
                  </motion.div>
                </AnimatePresence>
                <div className="mt-2 flex gap-1" aria-hidden>
                  {LIFE.map((_, i) => <span key={i} className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${i <= active ? "bg-[#F6C752]" : "bg-white/20"}`} />)}
                </div>
              </div>
            </div>
          </div>

          {/* milestones */}
          <ol className="relative">
            <span aria-hidden className="absolute bottom-6 left-[19px] top-6 w-px bg-gradient-to-b from-[#F6C752] via-[#F6C752]/40 to-transparent lg:left-[23px]" />
            {LIFE.map((x, i) => (
              <motion.li
                key={x.year}
                data-i={i}
                ref={(el) => { refs.current[i] = el; }}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6 }}
                className="relative pb-6 pl-14 lg:pb-8 lg:pl-16"
              >
                <span className={`absolute left-0 top-5 flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 lg:h-12 lg:w-12 ${i === active ? "border-[#F6C752] bg-[#F6C752] shadow-[0_0_30px_rgba(246,199,82,.55)]" : "border-[#F6C752]/40 bg-[#0A1233]"}`}>
                  <span className={`h-2 w-2 rounded-full ${i === active ? "bg-[#0A1233]" : "bg-[#F6C752]"}`} />
                </span>
                <div className={`rounded-2xl border p-5 transition-all duration-500 md:p-6 ${i === active ? "border-[#F6C752]/50 bg-white/[0.07]" : "border-white/10 bg-white/[0.03]"}`}>
                  <p className={`font-serif-display text-4xl font-bold leading-none md:text-5xl lg:hidden ${GOLD_TEXT}`}>{x.year}</p>
                  <p className="hidden text-xs font-bold uppercase tracking-[0.22em] text-[#F6C752] lg:block">{x.year}</p>
                  <h3 className="mt-2 font-serif-display text-xl font-semibold text-white md:text-2xl">{t(x.title)}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/70">{t(x.text)}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
