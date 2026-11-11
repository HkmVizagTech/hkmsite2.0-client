"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Compass, HeartHandshake, Scale, Sun } from "lucide-react";
import Embers from "./Embers";
import { EpicTitle, Eyebrow, FadeIn, Panel } from "./Epic";
import { KK } from "./KkHero";
import { CHAPTERS, CHAPTER_IMAGES, CHAPTER_PLACEHOLDERS, CHAPTER_SUMMARIES, VERSE } from "@/lib/understandGita";

const ease = [0.22, 0.8, 0.3, 1] as const;

function RegisterButton({ label = "Register Free", className = "" }: { label?: string; className?: string }) {
  return (
    <a href="#register" className={`vk-btn-gold inline-flex h-12 items-center gap-2 px-7 text-[15px] font-bold ${className}`}>
      {label} <ArrowRight className="h-5 w-5" />
    </a>
  );
}

/* ── Act 1: Arjuna's dilemma ─────────────────────────────────────────── */
const QUESTIONS = [
  "How do I stay calm when life gets heavy?",
  "What is my real purpose?",
  "How do I know the right decision?",
  "Why do I feel empty, even after success?",
];

export function Dilemma() {
  const reduce = useReducedMotion();
  return (
    <section id="dilemma" className="relative isolate scroll-mt-16 overflow-hidden bg-[#06080F] py-24 text-white md:py-36">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image src="/assets/gita/kk-despair.webp" alt="" fill sizes="100vw" className="object-cover object-[30%_60%] [filter:brightness(.55)_saturate(.85)]" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#06080F_0%,rgba(6,8,15,.72)_22%,rgba(6,8,15,.55)_55%,#06080F_100%)]" />
      <Embers className="absolute inset-0 -z-10 h-full w-full opacity-60" count={28} />
      <div className="vk-container max-w-4xl text-center">
        <Eyebrow>The dilemma</Eyebrow>
        <EpicTitle text="Arjuna had the same questions you have" className="mx-auto mt-6 max-w-3xl text-3xl md:text-5xl" />
        <FadeIn delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-8 text-white/75 md:text-lg">
            Standing between two armies, the greatest warrior of his age put down his bow. He did not know what was right, what to choose, or why any of it mattered. Five thousand years later, we still ask the same things.
          </p>
        </FadeIn>
        <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-2">
          {QUESTIONS.map((q, i) => (
            <motion.div key={q} initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay: 0.12 * i, ease }}>
              <Panel className="px-5 py-4 text-left font-serif-display text-lg italic text-[#FFE6A3]/90">&ldquo;{q}&rdquo;</Panel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Act 2: Krishna's answer ─────────────────────────────────────────── */
export function Moment() {
  const reduce = useReducedMotion();
  return (
    <section className="relative isolate overflow-hidden bg-[#070A16] py-24 text-white md:py-32">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_25%_50%,rgba(246,199,82,.16),transparent_70%)]" />
      <div className="vk-container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={reduce ? false : { clipPath: "inset(10% 10% 10% 10% round 1.5rem)", opacity: 0, scale: 1.05 }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0% round 1.5rem)", opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.4, ease }}
          className="relative mx-auto aspect-square w-full max-w-[580px] overflow-hidden rounded-3xl ring-1 ring-[#F6C752]/40 shadow-[0_0_80px_-10px_rgba(246,199,82,.35)]"
        >
          <Image src={KK.moment} alt="Lord Krishna speaking the Bhagavad-gita to Arjuna on the chariot" fill sizes="(min-width:1024px) 580px, 92vw" className="object-cover" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#070A16]/60 via-transparent to-transparent" />
        </motion.div>
        <div className="text-center lg:text-left">
          <Eyebrow className="lg:justify-start">The answer</Eyebrow>
          <EpicTitle text="Then Krishna spoke" className="mt-6 text-4xl md:text-6xl" />
          <FadeIn delay={0.15}>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-8 text-white/75 md:text-lg lg:mx-0">
              On that chariot, Lord Krishna gave Arjuna the wisdom we now call the Bhagavad-gita: how to act without fear, how to find peace, and who we really are.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <blockquote className="mt-8 border-l-2 border-[#F6C752] pl-6 text-left">
              <p lang="sa" className="kk-gold-text font-serif-display text-2xl font-semibold leading-snug md:text-4xl">{VERSE.sanskrit}</p>
              <p className="mt-2 text-sm italic text-white/55">{VERSE.translit}</p>
              <p className="mt-4 text-[17px] leading-relaxed text-white/90">&ldquo;{VERSE.meaning}&rdquo;</p>
              <footer className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-[#F6C752]">{VERSE.ref}</footer>
            </blockquote>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p className="mt-10 font-serif-display text-lg italic text-[#FFE6A3]">The same answers are waiting for you.</p>
            <RegisterButton className="mt-4" />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ── Act 3: the 18-day journey: one full-screen scene per chapter, dissolving into the next as you scroll ── */
const chapterImage = (i: number) => CHAPTER_IMAGES[i] || CHAPTER_PLACEHOLDERS[i % CHAPTER_PLACEHOLDERS.length];

export function Journey() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [day, setDay] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const d = Math.min(17, Math.max(0, Math.floor(p * 18)));
    setDay((prev) => (prev === d ? prev : d));
  });

  if (reduce) {
    return (
      <section id="journey" className="scroll-mt-16 bg-[#06080F] py-20 text-white">
        <div className="vk-container">
          <EpicTitle text="Your 18-day journey" className="text-center text-3xl" />
          <ChapterGrid />
        </div>
      </section>
    );
  }

  return (
    <section id="journey" ref={ref} className="relative scroll-mt-16 bg-[#06080F]" style={{ height: `${18 * 60 + 40}vh` }}>
      <div className="sticky top-[var(--header-h)] h-[calc(100svh-var(--header-h)-var(--bottom-nav-space,0px))] overflow-hidden text-white md:h-[calc(100svh-var(--header-h))]">
        {/* scenes: only the current one and its neighbours are mounted */}
        {CHAPTERS.map((_, i) =>
          Math.abs(i - day) <= 1 ? (
            <div key={i} aria-hidden className="absolute inset-0 transition-opacity duration-1000 ease-out" style={{ opacity: i === day ? 1 : 0 }}>
              <div className="absolute inset-0 transition-transform ease-out" style={{ transform: i === day ? "scale(1.09)" : "scale(1.0)", transitionDuration: i === day ? "9000ms" : "0ms" }}>
                <Image src={chapterImage(i)} alt="" fill sizes="100vw" className="object-cover" />
              </div>
            </div>
          ) : null
        )}
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,14,.78)_0%,rgba(4,6,14,.15)_38%,rgba(4,6,14,.25)_62%,rgba(4,6,14,.92)_100%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_200px_70px_rgba(4,6,14,.85)]" />
        <Embers className="absolute inset-0 h-full w-full opacity-70" count={26} />

        {/* title at the top */}
        <div className="vk-container relative z-[1] pt-7 text-center md:pt-12">
          <Eyebrow>The 18-day journey</Eyebrow>
          <div className="mt-3 min-h-[120px] md:min-h-[160px]">
            <AnimatePresence mode="wait">
              <motion.p key={day} initial={{ opacity: 0, y: 12, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8, filter: "blur(6px)" }} transition={{ duration: 0.45 }} className="kk-gold-text font-[family-name:var(--font-cinzel)] text-6xl font-bold md:text-8xl">
                Day {day + 1}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* chapter text at the bottom */}
        <div className="absolute inset-x-0 bottom-0 z-[1] pb-10 md:pb-14">
          <div className="vk-container text-center">
            <AnimatePresence mode="wait">
              <motion.div key={day} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, delay: 0.1 }}>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#F6C752]">Chapter {day + 1} · {CHAPTERS[day].sa}</p>
                <h3 className="mx-auto mt-3 max-w-3xl font-[family-name:var(--font-cinzel)] text-2xl font-bold uppercase leading-tight tracking-[0.04em] [text-shadow:0_2px_20px_rgba(0,0,0,.7)] md:text-4xl">{CHAPTERS[day].en}</h3>
                <p className="mx-auto mt-3 max-w-2xl font-serif-display text-base italic text-[#FFE6A3] [text-shadow:0_2px_14px_rgba(0,0,0,.8)] md:text-xl">{CHAPTER_SUMMARIES[day]}</p>
              </motion.div>
            </AnimatePresence>
            {/* 18 gold ticks */}
            <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-1.5 md:mt-8" aria-hidden>
              {CHAPTERS.map((_, i) => (
                <span key={i} className={`h-1 rounded-full transition-all duration-500 ${i === day ? "w-6 bg-[#F6C752]" : i < day ? "w-2 bg-[#F6C752]/70" : "w-2 bg-white/25"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** All 18 chapters as a plain list (for reading, search engines and reduced motion). */
export function ChapterGrid() {
  return (
    <ol className="mx-auto mt-8 grid max-w-6xl gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
      {CHAPTERS.map((c, i) => (
        <li key={c.en} className="flex items-center gap-3 rounded-2xl border border-[#F6C752]/15 bg-white/[0.03] p-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F6C752]/50 font-[family-name:var(--font-cinzel)] text-sm font-bold text-[#F6C752]">{i + 1}</span>
          <span className="min-w-0">
            <span className="block text-[14px] font-semibold leading-snug text-white">{c.en}</span>
            <span className="block text-[12px] italic text-[#FFE6A3]/60">{c.sa}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ── Act 4: what changes for you ─────────────────────────────────────── */
const BENEFITS = [
  { icon: Sun, title: "Peace of mind", text: "Learn why the mind gets restless and practical ways to steady it, every day." },
  { icon: Compass, title: "Clear purpose", text: "Understand who you are beyond your job and roles, and what life is really for." },
  { icon: Scale, title: "Better decisions", text: "Act with confidence, like Arjuna did, guided by wisdom instead of fear." },
  { icon: HeartHandshake, title: "Stronger relationships", text: "Bring patience, gratitude and service into your family and work." },
];

export function Benefits() {
  const reduce = useReducedMotion();
  return (
    <section className="relative isolate overflow-hidden bg-[#06080F] py-24 text-white md:py-32">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(47,91,211,.22),transparent_70%)]" />
      <div className="vk-container">
        <div className="text-center">
          <Eyebrow>After 18 days</Eyebrow>
          <EpicTitle text="What changes for you" className="mt-6 text-3xl md:text-5xl" />
        </div>
        <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <motion.div key={b.title} initial={reduce ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay: i * 0.1, ease }}>
              <Panel className="group h-full p-7 transition-colors duration-300 hover:border-[#F6C752]/50 hover:bg-white/[0.06]">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#F6C752]/40 text-[#F6C752] transition-shadow duration-300 group-hover:shadow-[0_0_30px_rgba(246,199,82,.35)]"><b.icon className="h-6 w-6" /></span>
                <h3 className="mt-5 font-[family-name:var(--font-cinzel)] text-lg font-bold uppercase tracking-[0.04em] text-white">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{b.text}</p>
              </Panel>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 text-center"><RegisterButton label="Start my 18 days" /></div>
      </div>
    </section>
  );
}

/* ── Close: the chariot rides into the sunset ────────────────────────── */
export function SunsetClose() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["-30%", "40%"]);
  return (
    <section id="kk-close" ref={ref} className="relative isolate overflow-hidden py-24 text-center text-white md:py-36">
      <div className="absolute inset-0 -z-20">
        <Image src={KK.sky} alt="" fill sizes="100vw" className="object-cover object-[70%_80%] [filter:saturate(1.25)_hue-rotate(-12deg)_brightness(.78)]" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,18,51,.65),rgba(10,18,51,.25)_55%,rgba(10,18,51,.55))]" />
      <motion.div aria-hidden style={reduce ? undefined : { x }} className="absolute bottom-[6%] left-[10%] -z-10 w-[60vw] opacity-90 md:w-[28vw]">
        <Image src={KK.chariot} alt="" width={1316} height={699} sizes="(min-width:768px) 28vw, 60vw" className="h-auto w-full [filter:brightness(.15)_sepia(.4)]" />
      </motion.div>
      <Embers className="absolute inset-0 -z-10 h-full w-full" count={35} />
      <div className="vk-container relative">
        <p className="font-serif-display text-lg italic text-[#FFE6A3] md:text-2xl">Arjuna&apos;s doubts ended in 18 chapters.</p>
        <EpicTitle text="Your 18-day journey begins today" className="mx-auto mt-4 max-w-4xl text-3xl md:text-6xl" />
        <p className="mt-4 text-white/85">Free · Live · Online · For adults, youth and kids</p>
        <RegisterButton className="mt-8" label="Register Free" />
      </div>
    </section>
  );
}
