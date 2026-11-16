"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, GitBranch, Layers, MapPin, Search, Users, X } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useT } from "@/components/i18n/LocaleProvider";
import { ACHARYAS_PAINTING, type Acharya, type AcharyaCategory } from "@/lib/acharyas";
import { useAcharyaData } from "./data";
import { CtaPill, Divider, Eyebrow, Portrait, IVORY, Rise, ease } from "./shared";

function usePrabhupada() {
  const { ACHARYAS } = useAcharyaData();
  return ACHARYAS.find((a) => a.featured) ?? ACHARYAS[0];
}
const MANTRA = "Hare Kṛṣṇa Hare Kṛṣṇa Kṛṣṇa Kṛṣṇa Hare Hare / Hare Rāma Hare Rāma Rāma Rāma Hare Hare";

/* ══ HERO ══ the acharyas' group painting is the hero: full-bleed, drifting slowly across so every acharya is seen,
   the title on a soft fade at its foot and a glass strip of counts beneath ══ */

/** Counts up from zero once on screen (shows the final number straight away for reduced motion and in the HTML). */
function CountUp({ to }: { to: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true });
  const [n, setN] = useState(to);
  useEffect(() => {
    if (reduce || !seen) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / 1400);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, reduce, to]);
  return <span ref={ref}>{n}</span>;
}

const FAN = ["srila-bhaktivinoda-thakura", "srila-bhaktisiddhanta-sarasvati-thakura", "srila-prabhupada"];

/** Three portraits of the most recent acharyas, fanned like cards; each links to its profile. */
function PortraitFan() {
  const { ACHARYAS } = useAcharyaData();
  const reduce = useReducedMotion();
  const cards = FAN.map((slug) => ACHARYAS.find((a) => a.slug === slug)).filter(Boolean) as Acharya[];
  // left, top, width (%), rotation (deg), stacking
  const pose: [number, number, number, number, number][] = [[0, 16, 42, -9, 10], [58, 16, 42, 9, 10], [23, 0, 54, 0, 20]];
  return (
    <div className="relative mx-auto aspect-[6/5] w-full max-w-[460px] lg:max-w-[520px]">
      <div aria-hidden className="absolute left-[7%] top-[4%] h-[86%] w-[86%] rounded-full bg-[radial-gradient(closest-side,rgba(246,199,82,.35),rgba(246,199,82,.08)_60%,transparent)]" />
      {cards.map((a, i) => {
        const [l, tp, w, r, z] = pose[i];
        return (
          <div key={a.slug} className="absolute" style={{ left: `${l}%`, top: `${tp}%`, width: `${w}%`, zIndex: z }}>
            <motion.div initial={reduce ? false : { opacity: 0, y: 40 }} animate={reduce ? { opacity: 1 } : { opacity: 1, y: [0, i === 2 ? -10 : -6, 0] }}
              transition={reduce ? undefined : { opacity: { duration: 0.8, delay: 0.2 + i * 0.15 }, y: { duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: 0.2 + i * 0.15 } }}>
              <div style={{ transform: `rotate(${r}deg)` }}>
                <Link href={`/acharyas/${a.slug}`} className="group block rounded-[1.4rem] bg-white p-1.5 shadow-[0_30px_60px_-28px_rgba(15,30,74,.55)] ring-1 ring-[#E7DCC3] transition hover:ring-[#C9962B]">
                  <Portrait src={a.portrait} alt={a.name} sizes="(min-width: 1024px) 280px, 45vw" priority={i === 2} zoom className="rounded-[1.1rem]" />
                  <span className="block truncate px-2 pb-1.5 pt-2 text-center font-heading text-[11px] font-bold text-[#0F1E4A] min-[400px]:text-[12.5px]">{a.shortName}</span>
                </Link>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

function Hero() {
  const { ACHARYAS, CATEGORIES, PARAMPARA } = useAcharyaData();
  const t = useT();
  const reduce = useReducedMotion();
  return (
    <section className="relative">
      <div className="relative isolate overflow-hidden" style={{ background: IVORY }}>
        {/* the group painting as a cinematic band, vivid and untouched */}
        <motion.figure initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, ease }} className="relative">
          <div className="relative h-[clamp(200px,60vw,320px)] overflow-hidden lg:h-auto lg:aspect-[1526/375]">
            <div className={`absolute inset-y-0 left-0 aspect-[1526/375] lg:inset-0 lg:aspect-auto ${reduce ? "" : "animate-[acharya-hero-pan_40s_ease-in-out_infinite_alternate] lg:animate-none"}`}>
              <Image src={ACHARYAS_PAINTING} alt={t("A painting of Srila Prabhupada and the acharyas before him seated in a riverside garden")} fill loading="eager" fetchPriority="high" quality={90} sizes="(min-width: 1024px) 100vw, 1400px" className="object-cover" />
            </div>
            <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#FBF7EE] to-transparent" />
          </div>
        </motion.figure>

        {/* soft gold light and a faint lotus-mandala line drawing behind the title */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(45%_60%_at_80%_40%,rgba(246,199,82,.22),transparent_70%),radial-gradient(40%_50%_at_0%_0%,rgba(47,91,211,.08),transparent_70%)]" />
        <svg aria-hidden viewBox="0 0 200 200" className="absolute -left-24 top-1/2 -z-10 h-[520px] w-[520px] -translate-y-1/2 text-[#C9962B]/[.09]">
          {Array.from({ length: 16 }).map((_, i) => (
            <ellipse key={i} cx="100" cy="60" rx="14" ry="40" fill="none" stroke="currentColor" strokeWidth=".8" transform={`rotate(${i * 22.5} 100 100)`} />
          ))}
          <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth=".6" />
          <circle cx="100" cy="100" r="22" fill="none" stroke="currentColor" strokeWidth=".8" />
        </svg>

        <div className="vk-container grid items-center gap-10 pb-12 pt-10 md:pb-16 md:pt-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-6">
          <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}
            className="order-2 text-center lg:order-1 lg:text-left">
            <div className="lg:[&>p]:justify-start"><Eyebrow center>{t("Disciplic succession")}</Eyebrow></div>
            <h1 className="mt-4 font-heading text-[2.8rem] font-bold leading-[0.98] tracking-tight text-[#0F1E4A] min-[380px]:text-[3.3rem] md:text-[5.6rem]">
              {t("Our")}<br className="hidden lg:block" />{" "}
              <span className="bg-gradient-to-br from-[#C9962B] via-[#E7B847] to-[#A87A1E] bg-clip-text text-transparent">{t("Acharyas")}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 text-[#0F1E4A]/70 md:text-[17px] md:leading-8 lg:mx-0">
              {t("The spiritual teachers through whom the teachings of Lord Chaitanya have come down to us: their lives, their instructions, their books and their pastimes.")}
            </p>
            <div className="mx-auto mt-7 flex max-w-sm flex-col gap-2.5 min-[400px]:max-w-none min-[400px]:flex-row min-[400px]:justify-center lg:justify-start">
              <a href="#acharyas" className="group/btn rounded-full"><CtaPill label={t("Meet the acharyas")} className="w-full justify-between min-[400px]:w-auto" /></a>
              <a href="#parampara" className="group/btn rounded-full"><CtaPill label={t("See the parampara")} variant="outline" className="w-full justify-between min-[400px]:w-auto" /></a>
            </div>
          </motion.div>
          <div className="order-1 lg:order-2"><PortraitFan /></div>
        </div>

      </div>

      {/* glass strip of counts across the hero's foot, with clear space before the next section */}
      <div className="vk-container relative z-10 -mt-7 pb-14 md:pb-20">
        <Rise className="mx-auto grid max-w-3xl grid-cols-3 divide-x divide-[#E7DCC3] rounded-[1.4rem] bg-white py-4 shadow-[0_24px_50px_-26px_rgba(15,30,74,.55)] ring-1 ring-[#E7DCC3]/60 md:py-5">
          {[
            [ACHARYAS.length, t("Acharyas"), Users],
            [CATEGORIES.length, t("Categories"), Layers],
            [PARAMPARA.length, t("Generations"), GitBranch],
          ].map(([n, l, Icon]) => {
            const I = Icon as typeof Users;
            return (
              <div key={l as string} className="flex min-w-0 flex-col items-center px-2 text-center">
                <I aria-hidden className="h-4 w-4 text-[#C9962B]" />
                <p className="mt-1.5 font-heading text-[1.9rem] font-bold leading-none text-[#0F1E4A] md:text-[2.5rem]"><CountUp to={n as number} /></p>
                <p className="mt-1.5 text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#A87A1E] md:text-[11px]">{l as string}</p>
              </div>
            );
          })}
        </Rise>
      </div>
    </section>
  );
}

/* ══ FOUNDER-ACHARYA ══ a deep-blue feature; the portrait stands in a gold frame with light behind it ══ */
function Feature() {
  const t = useT();
  const a = usePrabhupada();
  return (
    <section className="relative isolate overflow-hidden bg-[#0A1233] py-16 text-[#FBF7EE] md:py-24">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(45%_60%_at_25%_40%,rgba(47,91,211,.45),transparent_70%),radial-gradient(40%_50%_at_90%_100%,rgba(201,150,43,.18),transparent_70%),linear-gradient(160deg,#0F1E4A,#0A1233)]" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F6C752]/60 to-transparent" />
      <div className="vk-container">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
          <Rise className="relative mx-auto w-full max-w-[300px] min-[400px]:max-w-[340px] lg:max-w-[420px]">
            <Link href={`/acharyas/${a.slug}`} className="group block">
              <Portrait src={a.portrait} alt={a.name} sizes="(min-width: 1024px) 420px, 340px" className="rounded-[2rem] shadow-[0_40px_70px_-30px_rgba(0,0,0,.8)]" zoom />
            </Link>
            <div className="absolute -bottom-5 left-1/2 w-max max-w-[92%] -translate-x-1/2 rounded-full bg-[#F6C752] px-4 py-2 text-center text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#0F1E4A] shadow-[0_14px_30px_-12px_rgba(0,0,0,.6)]">
              {t(a.category)}
            </div>
          </Rise>
          <Rise delay={0.1} className="min-w-0 pt-4 lg:pt-0">
            <Eyebrow light>{t("Featured")}</Eyebrow>
            <h2 className="mt-4 break-words font-heading text-[2rem] font-bold leading-[1.08] min-[400px]:text-[2.3rem] md:text-[3.4rem]">{a.name}</h2>
            <p className="mt-3 text-[15px] font-semibold text-[#F6C752] md:text-[17px]">{a.title}</p>
            <p className="mt-5 text-[15px] leading-7 text-[#FBF7EE]/75 md:text-[17px] md:leading-8">{a.summary}</p>
            <dl className="mt-7 grid gap-3 sm:grid-cols-2">
              {[[t("Appearance"), a.appearance], [t("Disappearance"), a.disappearance]].map(([label, v]) =>
                v && typeof v === "object" ? (
                  <div key={label as string} className="min-w-0 rounded-2xl bg-white/[.06] p-4 ring-1 ring-white/10">
                    <dt className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#E9C46A]">{label as string}</dt>
                    <dd className="mt-1.5 font-heading text-[17px] font-bold">{v.date}</dd>
                    {v.place && <dd className="mt-1 flex items-start gap-1.5 text-[12.5px] leading-5 text-[#FBF7EE]/60"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />{v.place}</dd>}
                  </div>
                ) : null,
              )}
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/acharyas/${a.slug}`} className="group/btn rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6C752] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1233]">
                <CtaPill label={t("Read his life")} />
              </Link>
              <Link href="/founder" className="group/btn rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6C752]">
                <CtaPill label={t("Our Founder-Acharya")} variant="ghost" />
              </Link>
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}

/* ══ PARAMPARA ══ the centrepiece. Each generation is an image-led panel (its painting, a deep-blue veil, a portrait
   medallion, the name in large type and its guru/disciple links), ending on Srila Prabhupada in gold.
   Phones: a swipeable story carousel with five gold progress segments. Desktop: an accordion of five panels; the
   one hovered or chosen opens wide, the others fold into slim portrait strips. ══ */
function Links({ a, light = true }: { a: Acharya; light?: boolean }) {
  const { acharyaBySlug } = useAcharyaData();
  const t = useT();
  const guru = a.lineage?.guru ? acharyaBySlug(a.lineage.guru) : undefined;
  const disciple = a.lineage?.disciple ? acharyaBySlug(a.lineage.disciple) : undefined;
  const row = "flex min-w-0 items-start gap-2 text-[12.5px] leading-snug";
  return (
    <div className={`space-y-1.5 ${light ? "text-[#FBF7EE]/80" : ""}`}>
      {guru && <p className={row}><ArrowUp aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#F6C752]" /><span className="min-w-0"><span className="font-semibold text-[#F6C752]">{t("Disciple of")}</span> {guru.shortName}</span></p>}
      {disciple && <p className={row}><ArrowDown aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#F6C752]" /><span className="min-w-0"><span className="font-semibold text-[#F6C752]">{t("Guru of")}</span> {disciple.shortName}</span></p>}
    </div>
  );
}

/** One generation as a tall panel: the painting in full, a soft gradient only behind the text at the foot. */
const SHADE = "bg-[linear-gradient(to_top,rgba(10,18,51,.9)_0%,rgba(10,18,51,.72)_25%,rgba(10,18,51,.25)_45%,transparent_58%)]";
const TEXT_SHADOW = "[text-shadow:0_1px_12px_rgba(0,0,0,.55)]";
function StoryPanel({ a, i, active }: { a: Acharya; i: number; active: boolean }) {
  const { PARAMPARA } = useAcharyaData();
  const t = useT();
  const end = i === PARAMPARA.length - 1;
  return (
    <article className={`relative h-full overflow-hidden rounded-[1.6rem] bg-[#0A1233] text-[#FBF7EE] shadow-[0_30px_60px_-30px_rgba(10,18,51,.9)] ${end ? "ring-2 ring-inset ring-[#F6C752]" : ""}`}>
      <Image src={a.portrait} alt={a.name} fill sizes="(min-width: 480px) 400px, 86vw" className={`object-cover object-top motion-safe:transition-transform motion-safe:duration-[1400ms] ${active ? "scale-[1.04]" : "scale-100"}`} />
      <span aria-hidden className={`absolute inset-0 ${SHADE}`} />
      <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] shadow ${end ? "bg-[#F6C752] text-[#0F1E4A]" : "bg-[#0A1233]/75 text-[#F6C752] backdrop-blur"}`}>
        {t("Generation")} {i + 1}
      </span>
      <div className={`absolute inset-x-0 bottom-0 p-5 ${TEXT_SHADOW}`}>
        <h3 className="font-heading text-[1.35rem] font-bold leading-[1.15] min-[380px]:text-[1.5rem]">{a.name}</h3>
        <p className="mt-1 text-[12.5px] font-semibold leading-snug text-[#F6C752]">{a.title}</p>
        {a.years && <p className="mt-1 text-[11.5px] font-semibold text-[#FBF7EE]/75">{a.years}</p>}
        <div className="mt-3"><Links a={a} /></div>
        <Link href={`/acharyas/${a.slug}`} className="group/btn mt-4 inline-block rounded-full [text-shadow:none]" tabIndex={active ? 0 : -1}>
          <CtaPill label={t("Read his life")} />
        </Link>
      </div>
    </article>
  );
}

function StoryCarousel() {
  const { PARAMPARA } = useAcharyaData();
  const t = useT();
  const ref = useRef<HTMLOListElement>(null);
  const n = PARAMPARA.length;
  const [idx, setIdx] = useState(0);
  const go = (k: number) => {
    const el = ref.current;
    const item = el?.children[Math.max(0, Math.min(n - 1, k))] as HTMLElement | undefined;
    if (el && item) el.scrollTo({ left: item.offsetLeft - el.offsetLeft - (el.clientWidth - item.clientWidth) / 2, behavior: "smooth" });
  };
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0, dist = Infinity;
    Array.from(el.children).forEach((c, k) => {
      const h = c as HTMLElement;
      const d = Math.abs(h.offsetLeft - el.offsetLeft + h.clientWidth / 2 - mid);
      if (d < dist) { dist = d; best = k; }
    });
    setIdx(best);
  };
  return (
    <div className="mt-10 lg:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <div className="flex flex-1 gap-1.5" aria-hidden>
          {PARAMPARA.map((a, k) => (
            <span key={a.slug} className="h-1 flex-1 overflow-hidden rounded-full bg-[#0F1E4A]/10">
              <span className={`block h-full rounded-full bg-gradient-to-r from-[#F6C752] to-[#C9962B] motion-safe:transition-transform motion-safe:duration-500 origin-left ${k <= idx ? "scale-x-100" : "scale-x-0"}`} />
            </span>
          ))}
        </div>
        <p aria-live="polite" className="shrink-0 text-[11px] font-bold uppercase tracking-[0.14em] text-[#A87A1E]">
          {t("Generation")} {idx + 1} {t("of")} {n}
        </p>
      </div>
      <ol ref={ref} onScroll={onScroll} aria-label={t("The Parampara")}
        className="-mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-[7%] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mx-6">
        {PARAMPARA.map((a, k) => (
          <li key={a.slug} className={`h-[540px] w-[86%] max-w-[400px] shrink-0 snap-center motion-safe:transition motion-safe:duration-500 min-[380px]:h-[560px] ${k === idx ? "opacity-100" : "scale-[.96] opacity-60"}`}>
            <StoryPanel a={a} i={k} active={k === idx} />
          </li>
        ))}
      </ol>
      <div className="mt-2 flex items-center justify-center gap-3">
        <button type="button" onClick={() => go(idx - 1)} disabled={idx === 0} aria-label={t("Previous")}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0F1E4A] shadow-[0_10px_24px_-12px_rgba(15,30,74,.6)] disabled:opacity-35"><ArrowLeft className="h-5 w-5" /></button>
        <p className="text-[12px] font-semibold text-[#0F1E4A]/55">{t("Swipe through the generations")}</p>
        <button type="button" onClick={() => go(idx + 1)} disabled={idx === n - 1} aria-label={t("Next")}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0F1E4A] text-[#F6C752] shadow-[0_10px_24px_-12px_rgba(15,30,74,.6)] disabled:opacity-35"><ArrowRight className="h-5 w-5" /></button>
      </div>
    </div>
  );
}

function Accordion() {
  const { PARAMPARA } = useAcharyaData();
  const t = useT();
  const last = PARAMPARA.length - 1;
  const [open, setOpen] = useState(last);
  return (
    <ol className="mx-auto mt-14 hidden h-[580px] max-w-6xl gap-3 lg:flex">
      {PARAMPARA.map((a, i) => {
        const on = i === open;
        const end = i === last;
        return (
          <li key={a.slug} onMouseEnter={() => setOpen(i)} onFocus={() => setOpen(i)}
            className={`relative min-w-0 overflow-hidden rounded-[1.8rem] bg-[#0A1233] text-[#FBF7EE] shadow-[0_30px_60px_-34px_rgba(10,18,51,.9)] motion-safe:transition-[flex-grow] motion-safe:duration-700 motion-safe:ease-[cubic-bezier(.22,.8,.3,1)] ${on ? "grow-[5]" : "grow"} basis-0 ${end ? "ring-2 ring-inset ring-[#F6C752]" : ""}`}>
            {/* background: the wide painting when open, the portrait when folded; shade only behind the text */}
            <Image src={a.banner} alt={`Painting of ${a.name}`} fill sizes="720px" className={`object-cover motion-safe:transition-opacity motion-safe:duration-700 ${on ? "opacity-100" : "opacity-0"}`} />
            <Image src={a.portrait} alt={`Portrait of ${a.name}`} fill sizes="160px" className={`object-cover object-top motion-safe:transition-opacity motion-safe:duration-700 ${on ? "opacity-0" : "opacity-100"}`} />
            <span aria-hidden className={`absolute inset-0 ${SHADE}`} />

            {/* folded strip */}
            <button type="button" onClick={() => setOpen(i)} aria-expanded={on} aria-label={`${t("Generation")} ${i + 1}: ${a.name}`}
              className={`absolute inset-0 flex flex-col items-center justify-end pb-6 motion-safe:transition-opacity motion-safe:duration-500 ${on ? "pointer-events-none opacity-0" : "opacity-100"}`}>
              <span className={`mb-4 flex h-9 w-9 items-center justify-center rounded-full font-heading text-[14px] font-bold ${end ? "bg-[#F6C752] text-[#0F1E4A]" : "bg-white/15 text-[#F6C752] backdrop-blur"}`}>{i + 1}</span>
              <span className="max-h-[300px] overflow-hidden font-heading text-[17px] font-bold leading-none [writing-mode:vertical-rl] rotate-180">{a.shortName}</span>
            </button>

            {/* open panel: text on the foot of the painting */}
            <div className={`absolute inset-x-0 bottom-0 p-8 ${TEXT_SHADOW} motion-safe:transition motion-safe:duration-700 ${on ? "translate-y-0 opacity-100 delay-200" : "pointer-events-none translate-y-4 opacity-0"}`}>
              <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
                <div className="min-w-0 max-w-[480px]">
                  <span className={`inline-flex rounded-full px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.2em] shadow [text-shadow:none] ${end ? "bg-[#F6C752] text-[#0F1E4A]" : "bg-[#0A1233]/75 text-[#F6C752] backdrop-blur"}`}>
                    {t("Generation")} {i + 1} {t("of")} {PARAMPARA.length}
                  </span>
                  <h3 className="mt-3 font-heading text-[2.2rem] font-bold leading-[1.05]">{a.name}</h3>
                  <p className="mt-2 text-[15px] font-semibold text-[#F6C752]">{a.title}{a.years ? <span className="font-medium text-[#FBF7EE]/75"> · {a.years}</span> : null}</p>
                  <div className="mt-3"><Links a={a} /></div>
                </div>
                <Link href={`/acharyas/${a.slug}`} tabIndex={on ? 0 : -1} className="group/btn shrink-0 rounded-full [text-shadow:none]"><CtaPill label={t("Read his life")} /></Link>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Parampara() {
  const t = useT();
  return (
    <section id="parampara" className="relative isolate scroll-mt-[calc(var(--header-h)+8px)] overflow-hidden py-16 md:py-24" style={{ background: IVORY }}>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(50%_40%_at_50%_100%,rgba(47,91,211,.10),transparent_70%)]" />
      <div className="vk-container">
        <Rise className="mx-auto max-w-2xl text-center">
          <Eyebrow center>{t("Disciplic succession")}</Eyebrow>
          <h2 className="mt-4 font-heading text-[2rem] font-bold leading-tight text-[#0F1E4A] md:text-5xl">{t("The Parampara")}</h2>
          <p className="mt-4 text-[15px] leading-7 text-[#0F1E4A]/70 md:text-[16px]">
            {t("The disciplic succession, generation by generation, as the teaching has come down from guru to disciple. Each acharya's card names the teachers their line came through: the guru who initiated them, or a predecessor whose instruction they carried on.")}
          </p>
        </Rise>
        <StoryCarousel />
        <Accordion />
      </div>
    </section>
  );
}

/* ══ ALL ACHARYAS ══ */
function AcharyaCard({ a, i }: { a: Acharya; i: number }) {
  const t = useT();
  const reduce = useReducedMotion();
  return (
    <motion.li layout={!reduce} initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.55, ease, delay: Math.min(i, 8) * 0.04 }} className="min-w-0">
      <Link href={`/acharyas/${a.slug}`} className="group group/btn flex h-full flex-col">
        <div className="relative overflow-hidden rounded-[1.25rem] shadow-[0_26px_50px_-30px_rgba(15,30,74,.75)] transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_34px_60px_-30px_rgba(15,30,74,.85)] md:rounded-[1.5rem]">
          <Portrait src={a.portrait} alt={a.name} sizes="(min-width: 1280px) 300px, (min-width: 768px) 30vw, 50vw" className="rounded-[inherit]" zoom />
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[#081236] via-[#0A1640]/80 to-transparent" />
          <span className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#FBF7EE]/90 text-[#0F1E4A] opacity-0 shadow transition duration-300 group-hover:rotate-45 group-hover:opacity-100 max-md:hidden">
            <ArrowUpRight className="h-4 w-4" />
          </span>
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 md:p-5">
            <h3 className="break-words font-heading text-[13.5px] font-bold leading-tight text-white min-[380px]:text-[14.5px] sm:text-[16px] md:text-[18px]">{a.name}</h3>
            {a.years && <p className="mt-1 line-clamp-2 text-[10.5px] font-semibold text-[#F6C752] sm:text-[11.5px]">{a.years}</p>}
          </div>
        </div>
        <p className="mb-3 mt-3 line-clamp-2 px-1 text-[12px] leading-[1.45] text-[#0F1E4A]/70 sm:text-[13px]">{a.title}</p>
        <CtaPill label={t("Read his life")} variant="card" className="mt-auto" />
      </Link>
    </motion.li>
  );
}

function AllAcharyas() {
  const { ACHARYAS, CATEGORIES } = useAcharyaData();
  const t = useT();
  const [cat, setCat] = useState<AcharyaCategory | "all">("all");
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const groups = useMemo(
    () =>
      CATEGORIES.filter((c) => cat === "all" || c === cat)
        .map((c) => ({
          c,
          list: ACHARYAS.filter((a) => a.category === c && (!query || `${a.name} ${a.shortName} ${a.title}`.toLowerCase().includes(query))),
        }))
        .filter((g) => g.list.length),
    [cat, query],
  );
  const shown = groups.reduce((n, g) => n + g.list.length, 0);
  const chip = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition ${active ? "bg-[#0F1E4A] text-[#FBF7EE] shadow-[0_10px_20px_-12px_rgba(15,30,74,.8)]" : "bg-white text-[#0F1E4A] ring-1 ring-[#E7DCC3] hover:ring-[#C9962B]"}`;
  const count = (active: boolean) => `rounded-full px-1.5 text-[10.5px] font-bold ${active ? "bg-[#F6C752] text-[#0F1E4A]" : "bg-[#F4ECDA] text-[#A87A1E]"}`;

  return (
    <section id="acharyas" className="scroll-mt-[calc(var(--header-h)+8px)] border-t border-[#E7DCC3] bg-white py-16 md:py-24">
      <div className="vk-container">
        <div className="mx-auto max-w-7xl">
          <Rise className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-2xl">
              <Eyebrow>{t("All acharyas")}</Eyebrow>
              <h2 className="mt-4 font-heading text-[2rem] font-bold leading-tight text-[#0F1E4A] md:text-5xl">{t("Meet the acharyas")}</h2>
              <p className="mt-3 text-[15px] leading-7 text-[#0F1E4A]/65">{t("Browse by category, then open a page to read an acharya's life, teachings and books.")}</p>
            </div>
            <label className="relative block w-full md:w-80">
              <span className="sr-only">{t("Search acharyas")}</span>
              <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A87A1E]" />
              <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder={t("Search by name")}
                className="h-12 w-full rounded-full border-0 bg-[#FBF7EE] pl-11 pr-10 text-[16px] text-[#0F1E4A] ring-1 ring-[#E7DCC3] placeholder:text-[#0F1E4A]/40 focus:outline-none focus:ring-2 focus:ring-[#C9962B] md:text-[14px]" />
              {q && (
                <button type="button" onClick={() => setQ("")} aria-label={t("Clear search")} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#0F1E4A]/50 hover:text-[#0F1E4A]">
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
          </Rise>

          <div role="group" aria-label={t("Filter by category")} className="mt-8 flex flex-wrap gap-2">
            <button type="button" aria-pressed={cat === "all"} onClick={() => setCat("all")} className={chip(cat === "all")}>
              {t("All")} <span className={count(cat === "all")}>{ACHARYAS.length}</span>
            </button>
            {CATEGORIES.map((c) => (
              <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={chip(cat === c)}>
                {t(c)} <span className={count(cat === c)}>{ACHARYAS.filter((a) => a.category === c).length}</span>
              </button>
            ))}
          </div>
          <p aria-live="polite" className="mt-4 text-[12.5px] text-[#0F1E4A]/55">
            {t("Showing")} <b className="text-[#0F1E4A]">{shown}</b> {shown === 1 ? t("acharya") : t("acharyas")}
          </p>

          {groups.map((g) => (
            <div key={g.c} className="mt-10 md:mt-14">
              <div className="mb-5 flex items-center gap-4 md:mb-7">
                <h3 className="shrink-0 font-heading text-[19px] font-bold text-[#0F1E4A] md:text-2xl">{t(g.c)}</h3>
                <span aria-hidden className="h-px min-w-0 flex-1 bg-gradient-to-r from-[#C9962B]/60 to-transparent" />
                <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.18em] text-[#A87A1E]">{g.list.length}</span>
              </div>
              <motion.ul layout className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
                <AnimatePresence mode="popLayout">
                  {g.list.map((a, i) => <AcharyaCard key={a.slug} a={a} i={i} />)}
                </AnimatePresence>
              </motion.ul>
            </div>
          ))}
          {shown === 0 && (
            <p className="mt-12 rounded-2xl bg-[#FBF7EE] p-8 text-center text-[15px] text-[#0F1E4A]/70 ring-1 ring-[#E7DCC3]">{t("No acharya matches your search.")}</p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ══ CLOSING ══ the maha-mantra, from Srila Prabhupada's teachings ══ */
function Closing() {
  const prabhupada = usePrabhupada();
  const t = useT();
  const [l1, l2] = MANTRA.split(" / ");
  return (
    <section className="relative isolate overflow-hidden py-16 text-center md:py-24" style={{ background: IVORY }}>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(246,199,82,.18),transparent_70%)]" />
      <div className="vk-container">
        <Rise>
          <Eyebrow center>{t("Chant Hare Kṛṣṇa")}</Eyebrow>
          <Divider className="mt-6" />
          <p className="mx-auto mt-6 max-w-4xl font-heading text-[1.35rem] font-bold leading-snug text-[#0F1E4A] min-[400px]:text-[1.55rem] md:text-[2.5rem] md:leading-tight">
            {[l1, l2].map((l, k) => {
              const w = l.split(" ");
              return (
                <span key={k} className={`block ${k ? "text-[#A87A1E]" : ""}`}>
                  <span className="block md:inline">{w.slice(0, 4).join(" ")}</span> <span className="block md:inline">{w.slice(4).join(" ")}</span>
                </span>
              );
            })}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-[14px] leading-7 text-[#0F1E4A]/65 md:text-[15px]">
            {t("The scriptures recommend the congregational chanting of the Hare Kṛṣṇa mahā-mantra as the yuga-dharma, the religious process for the present age of Kali. It is the easiest and most sublime way to attain spiritual perfection, open to everyone regardless of background.")}
          </p>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#A87A1E]">— {t("From Srila Prabhupada's teachings")}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href={`/acharyas/${prabhupada.slug}`} className="inline-flex items-center gap-2 rounded-full bg-[#0F1E4A] px-6 py-3 text-sm font-bold text-[#FBF7EE] hover:bg-[#1E3A8A]">
              {t("Srila Prabhupada's teachings")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/governance" className="inline-flex items-center rounded-full px-6 py-3 text-sm font-bold text-[#0F1E4A] ring-1 ring-[#0F1E4A]/25 hover:ring-[#0F1E4A]">{t("Governance")}</Link>
          </div>
        </Rise>
      </div>
    </section>
  );
}

export default function AcharyasView() {
  return (
    <PageLayout background={IVORY}>
      <div className="overflow-x-clip pt-[var(--header-h)]" style={{ background: IVORY }}>
        <Hero />
        <Feature />
        <Parampara />
        <AllAcharyas />
        <Closing />
      </div>
    </PageLayout>
  );
}
