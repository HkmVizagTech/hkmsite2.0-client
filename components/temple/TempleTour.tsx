"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";

type Chapter = { src: string; title: string; caption: string; points: string[]; focus: number };

const CHAPTERS: Chapter[] = [
  {
    src: "/assets/temple-tour/temple-morning-01.webp",
    title: "The Entrance Gopuram",
    caption: "A white-and-gold gopuram marks the entrance to the temple campus, rising above the palms of the approach.",
    points: ["White & gold gopuram", "Grand carved doors", "Palm-lined approach"],
    focus: 0.5,
  },
  {
    src: "/assets/temple-tour/temple-morning-02.webp",
    title: "The Temple from Above",
    caption: "A raised side view: the golden vimana, the twin stairways and the elephant guardians at the front.",
    points: ["Golden vimana tower", "Twin grand stairways", "Elephant guardians"],
    focus: 0.48,
  },
  {
    src: "/assets/temple-tour/temple-morning-03.webp",
    title: "The Golden Dhwaja Stambham",
    caption: "ధ్వజస్తంభం: the sacred golden pillar, gilded from base to crown, stands in the open stone courtyard before the temple.",
    points: ["Gilded from base to crown", "Granite pedestal", "Open stone courtyard"],
    focus: 0.46,
  },
  {
    src: "/assets/temple-tour/temple-morning-04.webp",
    title: "The Gold-Trimmed Façade",
    caption: "The front of the temple from the right: carved white stone picked out in gold, under a crown of towers.",
    points: ["Gold-trimmed white stone", "Ornate tower crown", "Sculpted elephants"],
    focus: 0.53,
  },
  {
    src: "/assets/temple-tour/temple-morning-05.webp",
    title: "The Grand Stairway",
    caption: "A wide central stairway, guarded on both sides by elephants, rises to the main entrance.",
    points: ["Wide central stairway", "Elephant guardians", "Main entrance above"],
    focus: 0.5,
  },
  {
    src: "/assets/temple-tour/temple-morning-06.webp",
    title: "Across the Courtyard",
    caption: "Looking across the courtyard: the golden dhwaja stambham in the foreground and the temple beyond it.",
    points: ["Dhwaja stambham and temple", "Paved courtyard", "Landscaped edges"],
    focus: 0.46,
  },
  {
    src: "/assets/temple-tour/temple-morning-07.webp",
    title: "Temple & Gateway",
    caption: "From the air, the main temple, the gateway tower and the dhwaja stambham sit together around the courtyard.",
    points: ["Temple and gateway", "Golden dhwaja stambham", "Hedged courtyard"],
    focus: 0.55,
  },
  {
    src: "/assets/temple-tour/temple-morning-08.webp",
    title: "The Whole Campus",
    caption: "The full campus from above: temple, gopuram, courtyard, gardens and parking.",
    points: ["Temple and gopuram", "Gardens and lawns", "Parking and access"],
    focus: 0.5,
  },
];

const N = CHAPTERS.length;
const EASE = [0.76, 0, 0.24, 1] as const;

export default function TempleTour() {
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(-1);
  const indexRef = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setActive = useCallback((i: number) => {
    if (i === indexRef.current) return;
    setPrev(indexRef.current);
    indexRef.current = i;
    setIndex(i);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setPrev(-1), 1100);
  }, []);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => setActive(Math.min(N - 1, Math.max(0, Math.floor(p * N * 0.999)))));

  // the buttons scroll the page to that chapter, so the scroll position and the picture never disagree
  const goTo = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const clamped = Math.min(N - 1, Math.max(0, i));
    const scrollable = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY + ((clamped + 0.5) / N) * scrollable;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  }, [reduce]);

  // warm the next chapter's photo
  useEffect(() => {
    const nxt = String(Math.min(N - 1, index + 1) + 1).padStart(2, "0");
    const im = new window.Image(); im.src = `/assets/temple-3d/photo-${nxt}.webp`;
  }, [index]);

  const c = CHAPTERS[index];
  const num = String(index + 1).padStart(2, "0");

  return (
    <section id="temple-tour" aria-label="A walk through the temple campus" className="relative bg-gradient-to-b from-white via-[#F4F7FF] to-white">
      {/* phones and tablets: one chapter after another, each photo shown whole and as wide as the screen allows */}
      <div className="lg:hidden">
        <div className="vk-container pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">A walk through the temple</p>
          <h2 className="mt-2 font-serif-display text-3xl font-semibold leading-tight text-foreground">Eight views of the campus</h2>
        </div>
        <div className="mt-6 space-y-10 pb-16">
          {CHAPTERS.map((ch, i) => (
            <motion.article
              key={ch.title}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mx-auto max-w-3xl"
            >
              <div className="relative aspect-video overflow-hidden bg-vk-100 shadow-[0_22px_40px_-26px_rgba(10,18,51,0.55)] sm:mx-4 sm:rounded-3xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/assets/temple-3d/photo-${String(i + 1).padStart(2, "0")}.webp`}
                  alt={ch.title}
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="px-5 pt-4 sm:px-8">
                <div className="flex items-baseline gap-3">
                  <span style={{ fontVariantNumeric: "lining-nums" }} className="bg-gradient-to-b from-[#F6C752] to-[#C98A0B] bg-clip-text pb-1 font-serif-display text-5xl font-semibold leading-none text-transparent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif-display text-[1.45rem] font-semibold leading-tight text-foreground">{ch.title}</h3>
                </div>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink/70">{ch.caption}</p>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                  {ch.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-1.5 text-[13px] font-semibold text-[#8A5A00]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#E8A317]" /> {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <div ref={track} style={{ height: `${N * 78 + 22}svh` }} className="relative hidden lg:block">
        <div className="sticky top-[calc(var(--header-h)+8px)] flex h-[calc(100svh-var(--header-h)-96px)] min-h-[520px] items-stretch lg:h-[calc(100svh-var(--header-h)-24px)] lg:min-h-[560px]">
          <div className="vk-container grid h-full w-full grid-rows-[minmax(0,1fr)_auto] gap-3 py-2 lg:grid-cols-[0.62fr_1.5fr] lg:grid-rows-none lg:gap-8 lg:py-4">
            {/* chapter text */}
            <div className="order-2 flex min-h-0 flex-col justify-between lg:order-1 lg:py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">A walk through the temple</p>
                <div className="relative mt-2 hidden lg:block">
                  <motion.span
                    key={num}
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    style={{ fontVariantNumeric: "lining-nums" }}
                    className="block bg-gradient-to-b from-[#F6C752] to-[#C98A0B] bg-clip-text pb-3 font-serif-display text-[7.5rem] font-semibold leading-[1] text-transparent"
                  >
                    {num}
                  </motion.span>
                </div>
                <motion.div
                  key={index}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
                  aria-live="polite"
                >
                  <h2 className="mt-1 font-serif-display text-[1.7rem] font-semibold leading-tight text-foreground md:text-4xl lg:mt-3">
                    <span className="mr-2 text-[#C98A0B] lg:hidden" style={{ fontVariantNumeric: "lining-nums" }}>{num}</span>
                    {c.title}
                  </h2>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink/70 md:text-base">{c.caption}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {c.points.map((p) => (
                      <li key={p} className="rounded-full border border-[#F0D58A] bg-[#FFF8E1] px-3.5 py-1.5 text-xs font-semibold text-[#8A5A00] md:text-[13px]">
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              <div className="mt-4 lg:mt-0">
                {/* progress */}
                <div className="flex gap-1.5" role="tablist" aria-label="Chapters">
                  {CHAPTERS.map((ch, i) => (
                    <button
                      key={ch.src}
                      type="button"
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`Chapter ${i + 1}: ${ch.title}`}
                      onClick={() => goTo(i)}
                      className="group relative h-6 flex-1"
                    >
                      <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-vk-100 transition-all group-hover:h-1.5">
                        <span
                          className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-[#F6C752] to-[#E8A317] transition-transform duration-700"
                          style={{ transform: `scaleX(${i <= index ? 1 : 0})` }}
                        />
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    {num} / {String(N).padStart(2, "0")} · <span className="hidden sm:inline">Scroll to continue</span>
                    <span className="sm:hidden">Scroll on</span>
                    <ArrowDown className="ml-1 inline h-3.5 w-3.5 animate-bounce" aria-hidden />
                  </p>
                  <div className="hidden gap-2 sm:flex">
                    <button
                      type="button"
                      aria-label="Previous chapter"
                      disabled={index === 0}
                      onClick={() => goTo(index - 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-vk-100 bg-white text-vk-700 shadow-sm transition hover:bg-vk-50 disabled:opacity-30"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next chapter"
                      disabled={index === N - 1}
                      onClick={() => goTo(index + 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b from-[#F6C752] to-[#E8A317] text-vk-900 shadow-[0_10px_22px_-10px_rgba(232,163,23,0.9)] transition hover:brightness-105 disabled:opacity-40"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* the photograph, shown whole */}
            <div className="relative order-1 flex min-h-0 items-center lg:order-2">
              <div aria-hidden className="absolute inset-x-[-0.5rem] top-1/2 aspect-video -translate-y-1/2 scale-[1.02] rounded-[2.2rem] bg-gradient-to-br from-[#F6D98C] via-white to-[#BFD0FF] opacity-70 blur-[2px]" />
              <div data-tour-frame className="relative aspect-video w-full overflow-hidden rounded-[1.75rem] bg-vk-100 shadow-[0_40px_80px_-40px_rgba(10,18,51,0.65)] ring-1 ring-white/70">
                {CHAPTERS.map((ch, i) => {
                  const active = i === index;
                  const showing = active || i === prev;
                  if (!showing) return null; // only the current and outgoing chapters are mounted
                  return (
                    <motion.div
                      key={ch.src}
                      className="absolute inset-0"
                      style={{ zIndex: active ? 30 : i === prev ? 20 : 0, visibility: showing ? "visible" : "hidden" }}
                      initial={false}
                      animate={showing ? { clipPath: "inset(0% 0% 0% 0%)" } : { clipPath: "inset(0% 100% 0% 0%)" }}
                      transition={showing ? (reduce ? { duration: 0 } : { duration: 1, ease: EASE }) : { duration: 0 }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/assets/temple-3d/photo-${String(i + 1).padStart(2, "0")}.webp`} alt={ch.title} className="absolute inset-0 h-full w-full object-cover" />
                    </motion.div>
                  );
                })}
                <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-24 bg-gradient-to-t from-black/25 to-transparent" />
                <span className="pointer-events-none absolute bottom-4 right-4 z-40 rounded-full bg-black/40 px-3 py-1.5 text-[11px] font-bold tracking-[0.16em] text-white backdrop-blur">
                  {num} / {String(N).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
