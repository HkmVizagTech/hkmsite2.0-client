"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Bus, CalendarDays, Check, Clock, Copy, ExternalLink, Flower2, Globe, Grid2x2, Landmark,
  MapPin, Navigation, Plane, Plus, Sparkles, TrainFront,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useT } from "@/components/i18n/LocaleProvider";
import type { Temple } from "@/lib/templesData";
import { Lightbox, type Photo, TempleArt } from "./parts";
import type { TempleCardData } from "./TemplesList";

/*
 * A temple page in the style of a premium travel guide, on white with the site's Vaikuntham blue and gold:
 * title block → photo mosaic → sticky section menu → long-form content beside a sticky "Plan your visit" card.
 */

const ease = [0.22, 0.8, 0.3, 1] as const;

function Rise({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.7, ease, delay }} className={className}>
      {children}
    </motion.div>
  );
}

/** Small-caps label with a gold diamond, used above every section. */
function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#B8862A]"><span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-[#F6C752]" />{children}</p>;
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-3 font-heading text-[1.6rem] font-bold leading-tight tracking-tight text-[#0A1233] md:text-[2rem]">{children}</h2>;
}

const SECTIONS = [
  ["overview", "Overview"],
  ["history", "History"],
  ["photos", "Photos"],
  ["timings", "Timings"],
  ["reach", "How to reach"],
  ["map", "Map"],
  ["faq", "FAQ"],
] as const;

/** Section menu that sticks under the site header and follows the reader. */
function SectionNav({ have }: { have: Set<string> }) {
  const t = useT();
  const [on, setOn] = useState("overview");
  useEffect(() => {
    const els = SECTIONS.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setOn(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    els.forEach((el) => io.observe(el));
    // above the first section (back at the top), "Overview" is the current one
    const top = () => { if (els[0] && els[0].getBoundingClientRect().top > window.innerHeight * 0.5) setOn("overview"); };
    window.addEventListener("scroll", top, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", top); };
  }, []);
  return (
    <div className="sticky top-[var(--header-h)] z-30 border-y border-[#E6EBF7] bg-white/90 backdrop-blur-md">
      <div className="vk-container">
        <nav aria-label="On this page" className="mx-auto flex max-w-6xl gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SECTIONS.filter(([id]) => have.has(id)).map(([id, label]) => (
            <a key={id} href={`#${id}`} className={`relative shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition ${on === id ? "bg-[#0A1233] text-white" : "text-[#0A1233]/60 hover:bg-[#F2F5FC] hover:text-[#0A1233]"}`}>{t(label)}</a>
          ))}
        </nav>
      </div>
    </div>
  );
}

/** One big photo + four small ones; the button opens the full gallery. */
function Mosaic({ photos, name, onOpen, fallback }: { photos: Photo[]; name: string; onOpen: (i: number) => void; fallback: React.ReactNode }) {
  const t = useT();
  if (!photos.length) return <div className="aspect-[16/7] overflow-hidden rounded-[1.6rem]">{fallback}</div>;
  const small = photos.slice(1, 5);
  return (
    <div className="relative">
      {/* phones: one swipeable row */}
      <div className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
        {photos.map((p, i) => (
          <button key={p.src} type="button" onClick={() => onOpen(i)} className="w-[86%] shrink-0 snap-center overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={i === 0 ? name : p.alt ?? ""} loading={i ? "lazy" : "eager"} className="aspect-[4/3] w-full object-cover" />
          </button>
        ))}
      </div>
      {/* larger screens: mosaic */}
      <div className="hidden h-[420px] gap-2.5 overflow-hidden rounded-[1.6rem] md:grid"
        style={{ gridTemplateColumns: small.length >= 4 ? "2fr 1fr 1fr" : small.length >= 2 ? "2fr 1fr" : "1fr", gridTemplateRows: small.length >= 2 ? "1fr 1fr" : "1fr", gridAutoFlow: "column" }}>
        <button type="button" onClick={() => onOpen(0)} className="group relative overflow-hidden" style={small.length >= 2 ? { gridRow: "1 / span 2", gridColumn: "1" } : undefined}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[0].src} alt={name} className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] group-hover:scale-[1.04]" />
          <span aria-hidden className="absolute inset-0 bg-[#0A1233]/0 transition group-hover:bg-[#0A1233]/10" />
        </button>
        {small.length >= 2 && small.slice(0, small.length >= 4 ? 4 : 2).map((p, k) => (
          <button key={p.src} type="button" onClick={() => onOpen(k + 1)} className="group relative min-h-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.alt ?? ""} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] group-hover:scale-[1.06]" />
            <span aria-hidden className="absolute inset-0 bg-[#0A1233]/0 transition group-hover:bg-[#0A1233]/10" />
          </button>
        ))}
      </div>
      {photos.length > 1 && (
        <button type="button" onClick={() => onOpen(0)} className="absolute bottom-4 right-4 hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-bold text-[#0A1233] shadow-[0_10px_30px_-10px_rgba(10,18,51,.5)] ring-1 ring-[#E6EBF7] transition hover:-translate-y-0.5 md:inline-flex">
          <Grid2x2 className="h-4 w-4" />{t("Show all")} {photos.length} {t("photos")}
        </button>
      )}
    </div>
  );
}

export default function TempleView({ temple: tm, photos, nearby }: { temple: Temple; photos: Photo[]; nearby: TempleCardData[] }) {
  const t = useT();
  const reduce = useReducedMotion();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const q = encodeURIComponent(tm.placeQuery);
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
  const mapSearch = `https://www.google.com/maps/search/?api=1&query=${q}`;
  const mapEmbed = `https://www.google.com/maps?q=${q}&output=embed`;
  const fromVizagShort = tm.fromVizag.split(/(?<=\.)\s/)[0];
  const have = new Set(["overview", "history", ...(photos.length > 1 ? ["photos"] : []), "timings", "reach", "map", ...(tm.faqs.length ? ["faq"] : [])]);
  const copy = async () => { try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ } };

  return (
    <PageLayout background="#ffffff">
      <div className="relative overflow-x-clip bg-white pt-[var(--header-h)]">
        {/* ══ CINEMATIC HERO: the temple photo full width, title over it ══ */}
        <section className="relative isolate">
          <div className="relative h-[520px] overflow-hidden bg-[#0A1233] md:h-[620px]">
            {photos[0] ? (
              <motion.img src={photos[0].src} alt={tm.name} initial={reduce ? false : { scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 6, ease: "easeOut" }}
                className="absolute inset-0 h-full w-full object-cover" />
            ) : <div className="absolute inset-0"><TempleArt telugu={tm.teluguName} form={tm.form} /></div>}
            <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,18,51,.55)_0%,rgba(10,18,51,.1)_35%,rgba(10,18,51,.25)_60%,rgba(10,18,51,.92)_100%)]" />
            <div className="vk-container relative flex h-full flex-col">
              <nav aria-label="Breadcrumb" className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-1.5 pt-6 text-[12.5px] font-semibold text-white/70">
                <Link href="/temples" className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/20 backdrop-blur-md hover:bg-white/20"><ArrowLeft className="h-3.5 w-3.5" />{t("Hindu Temples in India")}</Link>
                <span className="hidden sm:inline">/ {t(tm.state)} / {tm.shortName}</span>
              </nav>
              <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.2 }} className="mx-auto mt-auto w-full max-w-6xl pb-24 md:pb-28">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#F6C752] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0A1233]">{tm.form}</span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white ring-1 ring-white/25 backdrop-blur-md">{tm.district} · {t(tm.state)}</span>
                </div>
                <h1 className="mt-4 max-w-4xl font-heading text-[2.2rem] font-extrabold leading-[1.03] tracking-[-0.02em] text-white [text-shadow:0_8px_30px_rgba(0,0,0,.4)] sm:text-[2.8rem] md:text-[3.8rem]">{tm.name}</h1>
                <p className="mt-2 font-heading text-[17px] font-semibold text-[#F6E3B0]">{tm.teluguName}</p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <a href={directions} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#F6C752] px-5 py-3 text-[13.5px] font-bold text-[#0A1233] shadow-[0_14px_30px_-12px_rgba(246,199,82,.7)] transition hover:-translate-y-0.5 hover:bg-[#FFD777]"><Navigation className="h-4 w-4" />{t("Get directions")}</a>
                  {photos.length > 1 && <button type="button" onClick={() => setLightbox(0)} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-3 text-[13.5px] font-bold text-white ring-1 ring-white/30 backdrop-blur-md transition hover:bg-white/25"><Grid2x2 className="h-4 w-4" />{photos.length} {t("photos")}</button>}
                  <button type="button" onClick={copy} aria-label={t("Copy link")} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-3 text-[13.5px] font-bold text-white ring-1 ring-white/30 backdrop-blur-md transition hover:bg-white/25">
                    {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}<span className="hidden sm:inline">{copied ? t("Copied") : t("Share")}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* floating quick-facts card over the hero's lower edge */}
          <div className="vk-container relative z-10 -mt-14 md:-mt-16">
            <motion.dl initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.35 }}
              className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] bg-[#E6EBF7] shadow-[0_40px_80px_-40px_rgba(10,18,51,.55)] ring-1 ring-[#E6EBF7] lg:grid-cols-4">
              {[
                { icon: Flower2, k: t("Presiding deity"), v: tm.deity },
                { icon: MapPin, k: t("Location"), v: `${tm.town}, ${tm.district}` },
                { icon: Clock, k: t("Darshan"), v: tm.timings[0] ? tm.timings[0].time : "—" },
                { icon: Navigation, k: t("From Visakhapatnam"), v: (fromVizagShort.match(/about [^,;.]+/i)?.[0] ?? fromVizagShort).replace(/^about/i, "About") },
              ].map((f) => (
                <div key={f.k} className="flex gap-3 bg-white p-4 md:p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#1E3A8A]"><f.icon className="h-[18px] w-[18px]" /></span>
                  <div className="min-w-0"><dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0A1233]/45">{f.k}</dt><dd className="mt-0.5 line-clamp-2 text-[13px] font-semibold leading-snug text-[#0A1233]">{f.v}</dd></div>
                </div>
              ))}
            </motion.dl>
          </div>
        </section>

        <div className="mt-10 md:mt-12"><SectionNav have={have} /></div>

        {/* ══ BODY + STICKY SIDEBAR ══ */}
        <div className="vk-container">
          <div className="mx-auto grid max-w-6xl gap-10 py-10 md:py-14 lg:grid-cols-[1fr_360px] lg:gap-14">
            <main className="min-w-0 space-y-16 md:space-y-20">
              {/* overview */}
              <section id="overview" className="scroll-mt-40">
                <Kicker>{t("Overview")}</Kicker>
                <p className="mt-4 font-heading text-[1.35rem] font-semibold leading-[1.55] text-[#0A1233] md:text-[1.6rem]">{tm.summary}</p>
              </section>

              {/* history */}
              <section id="history" className="scroll-mt-40">
                <Rise>
                  <Kicker>{t("History & significance")}</Kicker>
                  <H2>{t("The story of")} {tm.shortName}</H2>
                  <div className="mt-6 space-y-5 text-[16px] leading-[1.95] text-[#0A1233]/80">
                    {tm.history.map((p, k) => (
                      <p key={k} className={k === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-heading first-letter:text-[3.6rem] first-letter:font-extrabold first-letter:leading-[0.8] first-letter:text-[#1E3A8A]" : ""}>{p}</p>
                    ))}
                  </div>
                </Rise>
                {tm.highlights.length > 0 && (
                  <Rise className="mt-9">
                    <div className="relative overflow-hidden rounded-[1.4rem] bg-[#0A1233] p-6 text-white md:p-8">
                      <span aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgba(246,199,82,.22),transparent)]" />
                      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#F6C752]"><Sparkles className="h-4 w-4" />{t("Highlights")}</p>
                      <ul className="mt-5 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
                        {tm.highlights.map((h) => (
                          <li key={h} className="flex gap-3 text-[14px] leading-6 text-white/85"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-[#F6C752]" />{h}</li>
                        ))}
                      </ul>
                    </div>
                  </Rise>
                )}
              </section>

              {/* photos */}
              {photos.length > 1 && (
                <section id="photos" className="scroll-mt-40">
                  <Kicker>{t("Gallery")}</Kicker>
                  <H2>{tm.shortName} {t("in pictures")}</H2>
                  <div className="mt-6">
                    <Mosaic photos={photos} name={tm.name} onOpen={setLightbox} fallback={<TempleArt telugu={tm.teluguName} form={tm.form} />} />
                  </div>
                </section>
              )}

              {/* timings */}
              <section id="timings" className="scroll-mt-40">
                <Rise>
                  <Kicker>{t("Plan your darshan")}</Kicker>
                  <H2>{t("Darshan & seva timings")}</H2>
                  <ol className="relative mt-7 space-y-3 before:absolute before:bottom-4 before:left-[19px] before:top-4 before:w-px before:bg-[#DCE3F4]">
                    {tm.timings.map((x) => (
                      <li key={x.label} className="relative flex items-center gap-4">
                        <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#1E3A8A] ring-1 ring-[#DCE3F4]"><Clock className="h-4 w-4" /></span>
                        <div className="flex flex-1 flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#F7F9FE] px-5 py-3.5 ring-1 ring-[#E6EBF7]">
                          <span className="text-[14.5px] font-semibold text-[#0A1233]">{x.label}</span>
                          <span className="font-heading text-[15px] font-bold tabular-nums text-[#1E3A8A]">{x.time}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-5 flex gap-2.5 rounded-2xl bg-[#FFF8E6] px-5 py-4 text-[13px] leading-6 text-[#7A5A12] ring-1 ring-[#F6E3B0]"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0" />{tm.timingsNote}</p>
                </Rise>
                {tm.festivals.length > 0 && (
                  <Rise className="mt-10">
                    <h3 className="font-heading text-lg font-bold text-[#0A1233]">{t("Main festivals")}</h3>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                      {tm.festivals.map((f) => (
                        <li key={f.name} className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-[#E6EBF7] transition hover:ring-[#F6C752]">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFF3D1] to-[#FFE4A3] text-[#A87A1E]"><CalendarDays className="h-5 w-5" /></span>
                          <div><p className="font-heading text-[15px] font-bold leading-snug text-[#0A1233]">{f.name}</p><p className="mt-0.5 text-[13px] leading-5 text-[#0A1233]/55">{f.when}</p></div>
                        </li>
                      ))}
                    </ul>
                  </Rise>
                )}
              </section>

              {/* how to reach */}
              <section id="reach" className="scroll-mt-40">
                <Rise>
                  <Kicker>{t("How to reach")}</Kicker>
                  <H2>{t("Getting to")} {tm.shortName}</H2>
                  <p className="mt-5 text-[16px] leading-8 text-[#0A1233]/75">{tm.fromVizag}</p>
                  <div className="mt-7 grid gap-3">
                    {[
                      { icon: Bus, k: t("By road"), v: tm.howToReach.road },
                      { icon: TrainFront, k: t("By train"), v: tm.howToReach.rail },
                      { icon: Plane, k: t("By air"), v: tm.howToReach.air },
                    ].map((m) => (
                      <div key={m.k} className="flex gap-4 rounded-2xl bg-white p-5 ring-1 ring-[#E6EBF7] transition hover:shadow-[0_20px_40px_-30px_rgba(10,18,51,.5)]">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1E3A8A] text-white"><m.icon className="h-5 w-5" /></span>
                        <div><p className="font-heading text-[15px] font-bold text-[#0A1233]">{m.k}</p><p className="mt-1 text-[14px] leading-6 text-[#0A1233]/65">{m.v}</p></div>
                      </div>
                    ))}
                  </div>
                </Rise>
              </section>

              {/* map */}
              <section id="map" className="scroll-mt-40">
                <Rise>
                  <Kicker>{t("Location")}</Kicker>
                  <H2>{t("Location & directions")}</H2>
                  <div className="mt-6 overflow-hidden rounded-[1.4rem] ring-1 ring-[#E6EBF7]">
                    <div className="relative h-[340px] bg-[#EEF2FF] md:h-[400px]">
                      <iframe title={`${tm.shortName}: ${t("map")}`} src={mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0" allowFullScreen />
                    </div>
                    <div className="flex flex-col gap-3 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="flex items-start gap-2 text-[14px] leading-6 text-[#0A1233]/75"><MapPin className="mt-1 h-4 w-4 shrink-0 text-[#1E3A8A]" />{tm.address}</p>
                      <div className="flex shrink-0 gap-2">
                        <a href={directions} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#1E3A8A] px-4 py-2 text-[13px] font-bold text-white hover:bg-[#172B6E]"><Navigation className="h-4 w-4" />{t("Directions")}</a>
                        <a href={mapSearch} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-bold text-[#1E3A8A] ring-1 ring-[#DCE3F4] hover:ring-[#1E3A8A]">{t("Open map")}<ExternalLink className="h-3.5 w-3.5" /></a>
                      </div>
                    </div>
                  </div>
                </Rise>
              </section>

              {/* faq */}
              {tm.faqs.length > 0 && (
                <section id="faq" className="scroll-mt-40">
                  <Kicker>{t("Good to know")}</Kicker>
                  <H2>{t("Frequently asked questions")}</H2>
                  <div className="mt-6 divide-y divide-[#E6EBF7] border-y border-[#E6EBF7]">
                    {tm.faqs.map((f) => (
                      <details key={f.q} className="group py-5">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15.5px] font-bold text-[#0A1233] [&::-webkit-details-marker]:hidden">
                          {f.q}<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F2F5FC] text-[#1E3A8A] transition group-open:rotate-45 group-open:bg-[#1E3A8A] group-open:text-white"><Plus className="h-4 w-4" /></span>
                        </summary>
                        <p className="mt-3 pr-10 text-[15px] leading-7 text-[#0A1233]/70">{f.a}</p>
                      </details>
                    ))}
                  </div>
                </section>
              )}
            </main>

            {/* sticky plan card */}
            <aside className="lg:sticky lg:top-[calc(var(--header-h)+5rem)] lg:self-start">
              <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_40px_80px_-50px_rgba(10,18,51,.6)] ring-1 ring-[#E6EBF7]">
                <div className="relative bg-[#0A1233] px-6 py-5 text-white">
                  <span aria-hidden className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[radial-gradient(closest-side,rgba(246,199,82,.3),transparent)]" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#F6C752]">{t("Plan your visit")}</p>
                  <p className="mt-1 font-heading text-lg font-bold">{tm.shortName}</p>
                </div>
                <div className="space-y-4 p-6">
                  <ul className="space-y-2.5">
                    {tm.timings.slice(0, 4).map((x) => (
                      <li key={x.label} className="flex items-baseline justify-between gap-3 text-[13.5px]"><span className="text-[#0A1233]/65">{x.label}</span><span className="text-right font-bold tabular-nums text-[#0A1233]">{x.time}</span></li>
                    ))}
                  </ul>
                  <div className="space-y-2 border-t border-[#E6EBF7] pt-4 text-[13.5px] text-[#0A1233]/70">
                    <p className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#1E3A8A]" />{tm.town}, {tm.district}</p>
                    <p className="flex gap-2"><Navigation className="mt-0.5 h-4 w-4 shrink-0 text-[#1E3A8A]" />{fromVizagShort}</p>
                  </div>
                  <a href={directions} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-3 text-[14px] font-bold text-white transition hover:bg-[#172B6E]"><Navigation className="h-4 w-4" />{t("Get directions")}</a>
                  {tm.website && <a href={tm.website} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-[14px] font-bold text-[#1E3A8A] ring-1 ring-[#DCE3F4] hover:ring-[#1E3A8A]"><Globe className="h-4 w-4" />{t("Official website")}</a>}
                  <p className="text-[11.5px] leading-5 text-[#0A1233]/45">{t("Timings can change on festival days; please confirm with the temple before you travel.")}</p>
                </div>
              </div>
              <Link href="/iskcon-vizag-temple" className="group mt-4 flex items-center gap-4 rounded-[1.3rem] bg-gradient-to-br from-[#FFF8E6] to-[#FFF1CC] p-5 ring-1 ring-[#F6E3B0] transition hover:-translate-y-0.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A1233] text-[#F6C752]"><Landmark className="h-5 w-5" /></span>
                <span className="min-w-0">
                  <span className="block text-[13.5px] font-bold leading-snug text-[#0A1233]">{t("Visiting Vizag? Take darshan at ISKCON Vizag")}</span>
                  <span className="mt-0.5 block text-[12px] text-[#0A1233]/55">{t("Sri Sri Radha Madan Mohan, Gambheeram")}</span>
                </span>
                <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-[#A87A1E] transition group-hover:rotate-45" />
              </Link>
            </aside>
          </div>
        </div>

        {/* ══ MORE TEMPLES ══ */}
        {nearby.length > 0 && (
          <section className="border-t border-[#E6EBF7] bg-[#FAFBFE] py-16 md:py-20">
            <div className="vk-container">
              <div className="mx-auto max-w-6xl">
                <div className="flex items-end justify-between gap-4">
                  <div><Kicker>{t("Continue your yatra")}</Kicker><H2>{t("More temples you may like")}</H2></div>
                  <Link href="/temples" className="hidden items-center gap-1.5 text-[13.5px] font-bold text-[#1E3A8A] hover:underline sm:inline-flex">{t("All temples")}<ArrowRight className="h-4 w-4" /></Link>
                </div>
                <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {nearby.map((n) => (
                    <li key={n.slug}>
                      <Link href={`/temples/${n.slug}`} className="group block">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.3rem] bg-[#EEF2FF]">
                          {n.photo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={n.photo} alt={n.shortName} loading="lazy" className="h-full w-full object-cover transition duration-[1200ms] group-hover:scale-105" />
                          ) : <TempleArt telugu={n.teluguName} form={n.form} />}
                          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-[#1E3A8A]">{n.form}</span>
                        </div>
                        <p className="mt-4 font-heading text-[1.15rem] font-bold text-[#0A1233] group-hover:text-[#1E3A8A]">{n.shortName}</p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-[#0A1233]/55"><MapPin className="h-3.5 w-3.5" />{n.town}, {n.district}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}
      </div>
      <Lightbox photos={photos} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} title={tm.shortName} kicker={t("Temple photos")} />
    </PageLayout>
  );
}
