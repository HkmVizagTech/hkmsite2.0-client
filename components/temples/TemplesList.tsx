"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown, Landmark, MapPin, Navigation, Search, X } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useT } from "@/components/i18n/LocaleProvider";
import type { Temple } from "@/lib/templesData";
import { TempleArt } from "./parts";

export type TempleCardData = Pick<Temple, "slug" | "name" | "shortName" | "teluguName" | "deity" | "form" | "town" | "state" | "district" | "region" | "summary" | "fromVizag"> & {
  photo?: string; // our own photo on R2
  rating?: number;
  ratingCount?: number;
};

const ease = [0.22, 0.8, 0.3, 1] as const;
const firstSentence = (s: string) => s.split(/(?<=\.)\s/)[0];

/** Small-caps label with a gold diamond. */
function Kicker({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] ${light ? "text-[#F6C752]" : "text-[#B8862A]"}`}><span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-[#F6C752]" />{children}</p>;
}

/** Temple card: photo with name over it; on hover the summary slides up. */
function Card({ c, i }: { c: TempleCardData; i: number }) {
  const t = useT();
  const reduce = useReducedMotion();
  return (
    <motion.li layout initial={reduce ? false : { opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.65, ease, delay: (i % 3) * 0.07 }}>
      <Link href={`/temples/${c.slug}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-[#EEF2FF] shadow-[0_30px_60px_-40px_rgba(10,18,51,.7)]">
          {c.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.photo} alt={c.name} loading="lazy" className="h-full w-full object-cover transition duration-[1400ms] ease-out group-hover:scale-[1.08]" />
          ) : <TempleArt telugu={c.teluguName} form={c.form} />}
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0A1233]/95 via-[#0A1233]/25 to-transparent transition duration-500 group-hover:from-[#0A1233] group-hover:via-[#0A1233]/55" />
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-[#1E3A8A] backdrop-blur">{c.form}</span>
          <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur transition duration-500 group-hover:rotate-45 group-hover:bg-[#F6C752] group-hover:text-[#0A1233]"><ArrowUpRight className="h-4 w-4" /></span>
          <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
            <p className="flex items-center gap-1.5 text-[12px] font-semibold text-white/70"><MapPin className="h-3.5 w-3.5 text-[#F6C752]" />{c.town}, {c.district}</p>
            <h3 className="mt-1.5 font-heading text-[1.5rem] font-bold leading-tight text-white">{c.shortName}</h3>
            <p className="mt-0.5 truncate text-[13px] text-white/70">{c.deity}</p>
            <div className="grid grid-rows-[0fr] transition-all duration-500 group-hover:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <p className="pt-3 text-[13px] leading-6 text-white/80">{c.summary}</p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#F6C752]"><Navigation className="h-3.5 w-3.5" />{firstSentence(c.fromVizag).slice(0, 70)}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <span className="sr-only">{t("View temple")}</span>
    </motion.li>
  );
}

/** Large featured temple (closest to Vizag): text panel + clear photo side by side. */
function Featured({ c }: { c: TempleCardData }) {
  const t = useT();
  return (
    <Link href={`/temples/${c.slug}`} className="group grid overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_90px_-55px_rgba(10,18,51,.6)] ring-1 ring-[#E6EBF7] lg:grid-cols-[.85fr_1.15fr]">
      <div className="order-2 flex flex-col justify-center p-7 md:p-11 lg:order-1">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#FFF4D6] px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#8A6414] ring-1 ring-[#F6E3B0]"><Landmark className="h-3.5 w-3.5" />{t("Closest to Vizag")}</span>
        <h2 className="mt-5 font-heading text-[2.1rem] font-extrabold leading-[1.04] tracking-tight text-[#0A1233] md:text-[2.8rem]">{c.shortName}</h2>
        <p className="mt-1.5 font-heading text-[16px] font-semibold text-[#1E3A8A]">{c.deity}</p>
        <p className="mt-1 font-heading text-[14px] font-semibold text-[#0A1233]/40">{c.teluguName}</p>
        <p className="mt-5 text-[15.5px] leading-7 text-[#0A1233]/70">{c.summary}</p>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-semibold text-[#0A1233]/60">
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#1E3A8A]" />{c.town}</span>
          <span className="inline-flex items-center gap-1.5"><Navigation className="h-4 w-4 text-[#1E3A8A]" />{(firstSentence(c.fromVizag).match(/about [^,;.]+/i)?.[0] ?? "").replace(/^about/i, "About")}</span>
        </div>
        <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#0A1233] px-6 py-3 text-[14px] font-bold text-white transition group-hover:bg-[#1E3A8A]">{t("Explore the temple")}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
      </div>
      <div className="relative order-1 aspect-[4/3] overflow-hidden lg:order-2 lg:aspect-auto lg:min-h-[460px]">
        {c.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.photo} alt={c.name} className="absolute inset-0 h-full w-full object-cover transition duration-[1600ms] ease-out group-hover:scale-105" />
        ) : <TempleArt telugu={c.teluguName} form={c.form} />}
        <span className="absolute bottom-4 right-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#0A1233] shadow-sm">{c.form} · {c.district}</span>
      </div>
    </Link>
  );
}

/** Full-width hero that slowly cross-fades through temple photos. */
function HeroSlides({ photos }: { photos: { src: string; name: string }[] }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce || photos.length < 2) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % photos.length), 5500);
    return () => window.clearInterval(id);
  }, [photos.length, reduce]);
  if (!photos.length) return <div className="absolute inset-0 bg-[#0A1233]" />;
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0A1233]">
      <AnimatePresence initial={false}>
        <motion.img key={photos[i].src} src={photos[i].src} alt="" aria-hidden
          initial={{ opacity: 0, scale: 1.12 }} animate={{ opacity: 1, scale: 1.02 }} exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.4 }, scale: { duration: 7, ease: "linear" } }}
          className="absolute inset-0 h-full w-full object-cover" />
      </AnimatePresence>
      <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,18,51,.6)_0%,rgba(10,18,51,.45)_45%,rgba(10,18,51,.9)_100%)]" />
      <div className="absolute bottom-24 right-6 hidden items-center gap-2 md:flex">
        {photos.map((p, k) => (
          <button key={p.src} type="button" aria-label={p.name} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-[#F6C752]" : "w-1.5 bg-white/50 hover:bg-white"}`} />
        ))}
      </div>
      <p className="absolute bottom-24 left-6 hidden text-[12px] font-semibold text-white/70 md:block">{photos[i].name}</p>
    </div>
  );
}

export default function TemplesList({ temples }: { temples: TempleCardData[] }) {
  const t = useT();
  const reduce = useReducedMotion();
  const [state, setState] = useState<string>("all");
  const [district, setDistrict] = useState<string>("all");
  const [form, setForm] = useState<string>("all");
  const [q, setQ] = useState("");
  const [featured, ...others] = temples;
  const states = useMemo(() => [...new Set(temples.map((c) => c.state))].sort(), [temples]);
  const districts = useMemo(() => [...new Set(temples.filter((c) => state === "all" || c.state === state).map((c) => c.district))].sort(), [temples, state]);
  const forms = useMemo(() => {
    const m = new Map<string, number>();
    temples.forEach((c) => m.set(c.form, (m.get(c.form) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [temples]);
  const filtering = state !== "all" || district !== "all" || form !== "all" || q.trim() !== "";
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    const pool = filtering ? temples : others;
    return pool.filter((c) => (state === "all" || c.state === state) && (district === "all" || c.district === district) && (form === "all" || c.form === form)
      && (!s || `${c.name} ${c.shortName} ${c.deity} ${c.town} ${c.district} ${c.state} ${c.teluguName}`.toLowerCase().includes(s)));
  }, [temples, others, state, district, form, q, filtering]);
  const slides = useMemo(() => temples.filter((c) => c.photo).slice(0, 6).map((c) => ({ src: c.photo!, name: c.shortName })), [temples]);
  const reset = () => { setState("all"); setDistrict("all"); setForm("all"); setQ(""); };

  return (
    <PageLayout background="#ffffff">
      <div className="relative overflow-x-clip bg-white pt-[var(--header-h)]">
        {/* ══ CINEMATIC HERO ══ */}
        <section className="relative isolate flex min-h-[560px] items-center md:min-h-[640px]">
          <HeroSlides photos={slides} />
          <div className="vk-container relative z-10 w-full pb-28 pt-16 text-center md:pb-32">
            <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }}>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#F6E3B0] ring-1 ring-white/25 backdrop-blur-md"><Landmark className="h-3.5 w-3.5 text-[#F6C752]" />{t("Temple guide")}</span>
              <h1 className="mx-auto mt-6 max-w-4xl font-heading text-[2.7rem] font-extrabold leading-[1.02] tracking-[-0.025em] text-white [text-shadow:0_10px_40px_rgba(0,0,0,.35)] md:text-[5rem]">
                {t("Hindu Temples in")}{" "}
                <span className="relative inline-block text-[#F6C752]">
                  {t("India")}
                  <svg aria-hidden viewBox="0 0 200 14" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full text-[#F6C752]/80"><path d="M2 10 C 50 2, 150 2, 198 9" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" /></svg>
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-8 text-white/85 md:text-[18px]">
                {t("Your guide to India's sacred temples: when to go for darshan and aarti, the deities who reside there, and the way to reach each holy place.")}
              </p>
              <p className="mx-auto mt-8 flex w-fit flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[14px] font-semibold text-white/85">
                <span><b className="font-heading text-xl font-extrabold text-white">{temples.length}</b> {t("temples")}</span>
                <span aria-hidden className="h-1 w-1 rotate-45 bg-[#F6C752]" />
                <span><b className="font-heading text-xl font-extrabold text-white">{states.length}</b> {states.length === 1 ? t("state") : t("states")}</span>
                <span aria-hidden className="h-1 w-1 rotate-45 bg-[#F6C752]" />
                <span><b className="font-heading text-xl font-extrabold text-white">{new Set(temples.map((c) => c.district)).size}</b> {t("districts")}</span>
              </p>
            </motion.div>
          </div>
        </section>

        {/* ══ SEARCH (floats over the hero) ══ */}
        <section className="relative z-20 -mt-16 md:-mt-20">
          <div className="vk-container">
            <div className="mx-auto max-w-4xl rounded-[1.4rem] bg-white p-2 shadow-[0_30px_70px_-35px_rgba(10,18,51,.55)] ring-1 ring-[#E3E9F7] md:rounded-full">
              <div className="flex flex-col md:flex-row md:items-center">
                <label className="relative flex-1">
                  <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1E3A8A]" />
                  <span className="sr-only">{t("Search temples")}</span>
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Search a temple, deity or town")}
                    className="w-full rounded-full bg-transparent py-4 pl-14 pr-4 text-[15px] text-[#0F1E4A] outline-none placeholder:text-[#0F1E4A]/40" />
                </label>
                <span aria-hidden className="mx-1 hidden h-8 w-px bg-[#E3E9F7] md:block" />
                <label className="relative border-t border-[#E3E9F7] md:border-0">
                  <span className="sr-only">{t("State")}</span>
                  <select value={state} onChange={(e) => { setState(e.target.value); setDistrict("all"); }}
                    className="w-full appearance-none truncate bg-transparent py-4 pl-5 pr-10 text-[14px] font-semibold text-[#0F1E4A] outline-none md:w-[170px]">
                    <option value="all">{t("All states")}</option>
                    {states.map((x) => <option key={x} value={x}>{t(x)}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1E3A8A]" />
                </label>
                <span aria-hidden className="mx-1 hidden h-8 w-px bg-[#E3E9F7] md:block" />
                <label className="relative border-t border-[#E3E9F7] md:border-0">
                  <span className="sr-only">{t("District")}</span>
                  <select value={district} onChange={(e) => setDistrict(e.target.value)}
                    className="w-full appearance-none truncate bg-transparent py-4 pl-5 pr-10 text-[14px] font-semibold text-[#0F1E4A] outline-none md:w-[170px]">
                    <option value="all">{t("All districts")}</option>
                    {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1E3A8A]" />
                </label>
                <span className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#0A1233] px-6 py-3.5 text-[14px] font-bold text-white md:ml-1 md:mt-0"><Search className="h-4 w-4" />{shown.length + (filtering ? 0 : 1)} {t("temples")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══ BROWSE BY DEITY ══ */}
        <section className="pt-12 md:pt-16">
          <div className="vk-container">
            <div className="mx-auto max-w-6xl">
              <Kicker>{t("Browse by deity")}</Kicker>
              <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
                {[["all", temples.length] as [string, number], ...forms].map(([f, n]) => (
                  <button key={f} type="button" onClick={() => setForm(f)}
                    className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13.5px] font-semibold transition ${form === f ? "border-[#0A1233] bg-[#0A1233] text-white" : "border-[#E3E9F7] bg-white text-[#0A1233]/75 hover:border-[#1E3A8A]/50 hover:text-[#0A1233]"}`}>
                    {f === "all" ? t("All") : f}
                    <span className={`rounded-full px-1.5 text-[11px] font-bold leading-5 ${form === f ? "bg-[#F6C752] text-[#0A1233]" : "bg-[#F2F5FC] text-[#1E3A8A]"}`}>{n}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ FEATURED + GRID ══ */}
        <section className="pb-16 pt-10 md:pb-24 md:pt-12">
          <div className="vk-container">
            <div className="mx-auto max-w-6xl">
              {!filtering && featured && (
                <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease }} className="mb-14">
                  <Featured c={featured} />
                </motion.div>
              )}
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <Kicker>{filtering ? t("Results") : t("Explore")}</Kicker>
                  <h2 className="mt-3 font-heading text-[1.7rem] font-bold tracking-tight text-[#0A1233] md:text-[2.2rem]">{filtering ? `${shown.length} ${t("temples")}` : t("All temples")}</h2>
                </div>
                {filtering && <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F7FF] px-4 py-2 text-[13px] font-bold text-[#1E3A8A] ring-1 ring-[#E3E9F7] hover:ring-[#1E3A8A]"><X className="h-4 w-4" />{t("Clear filters")}</button>}
              </div>
              <motion.ul layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map((c, i) => <Card key={c.slug} c={c} i={i} />)}
              </motion.ul>
              {shown.length === 0 && <p className="py-16 text-center text-[#0F1E4A]/60">{t("No temple matches your search.")}</p>}
            </div>
          </div>
        </section>

        {/* ══ OUR TEMPLE ══ */}
        <section className="pb-20 md:pb-28">
          <div className="vk-container">
            <div className="relative mx-auto grid max-w-6xl items-center gap-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#FFF8E6] via-[#FFF3D6] to-[#FFEBC2] p-8 ring-1 ring-[#F6E3B0] md:grid-cols-[1fr_auto] md:p-12">
              <span aria-hidden className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,.8),transparent)]" />
              <div className="relative flex gap-5">
                <span className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#0A1233] text-[#F6C752] shadow-lg sm:flex"><Landmark className="h-8 w-8" /></span>
                <div>
                  <Kicker>{t("In Visakhapatnam")}</Kicker>
                  <p className="mt-2 font-heading text-2xl font-bold leading-tight text-[#0A1233] md:text-[2rem]">{t("Begin your pilgrimage with darshan at ISKCON Vizag")}</p>
                  <p className="mt-2 max-w-2xl text-[15px] leading-7 text-[#0A1233]/65">{t("Sri Sri Radha Madan Mohan await you at Gambheeram, with daily aartis, kirtan and prasadam.")}</p>
                </div>
              </div>
              <div className="relative flex flex-wrap gap-3">
                <Link href="/iskcon-vizag-temple" className="inline-flex items-center gap-2 rounded-full bg-[#0A1233] px-6 py-3 text-[14px] font-bold text-white hover:bg-[#1E3A8A]">{t("Plan your visit")}<ArrowUpRight className="h-4 w-4" /></Link>
                <Link href="/anna-daan-seva" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-[14px] font-bold text-[#0A1233] ring-1 ring-[#E9D49B] hover:ring-[#0A1233]">{t("Offer Anna Daan")}</Link>
              </div>
            </div>
            <p className="mx-auto mt-6 max-w-6xl text-right text-[11px] text-[#0A1233]/35"><Link href="/temples/photo-credits" className="hover:text-[#0A1233]/60">{t("Photo credits")}</Link></p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
