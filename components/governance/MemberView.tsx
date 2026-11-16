"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Play, X } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useT } from "@/components/i18n/LocaleProvider";
import { COUNCIL, type CouncilMember, type Video } from "@/lib/governance";
import { scrollToTopNow } from "@/lib/scrollTop";
import { Eyebrow, INK, IVORY, Medallion } from "./GovernanceView";

const ease = [0.22, 0.8, 0.3, 1] as const;

function Rise({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={reduce ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.75, ease, delay }} className={className}>
      {children}
    </motion.div>
  );
}

/** YouTube player in a dialog (privacy-enhanced embed, loads only when opened). */
function VideoDialog({ v, onClose }: { v: Video | null; onClose: () => void }) {
  const t = useT();
  useEffect(() => {
    if (!v) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [v, onClose]);
  return (
    <AnimatePresence>
      {v && (
        <motion.div role="dialog" aria-modal="true" aria-label={v.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#0A1640]/90 p-4 backdrop-blur-sm" onClick={onClose}>
          <button type="button" aria-label={t("Close")} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" onClick={onClose}><X className="h-6 w-6" /></button>
          <motion.div initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl">
              <iframe src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`} title={v.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="h-full w-full" />
            </div>
            <p className="mt-4 text-center font-serif-display text-lg text-white">{v.title}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const thumb = (id: string, hi = false) => `https://i.ytimg.com/vi/${id}/${hi ? "maxresdefault" : "hqdefault"}.jpg`;

/** Thumbnail with a play button; the large one asks YouTube for the HD frame and falls back if there isn't one. */
function Thumb({ v, big = false }: { v: Video; big?: boolean }) {
  const [src, setSrc] = useState(thumb(v.id, big));
  return (
    <span className="relative block aspect-video overflow-hidden rounded-2xl bg-[#0A1640] ring-1 ring-white/15 transition group-hover:ring-[#F6C752]/70">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" onError={() => setSrc(thumb(v.id))} onLoad={(e) => big && e.currentTarget.naturalWidth < 200 && setSrc(thumb(v.id))}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0A1640]/80 via-[#0A1640]/10 to-transparent" />
      <span className={`absolute flex items-center justify-center rounded-full bg-[#F6C752] text-[#0F1E4A] shadow-[0_0_0_8px_rgba(246,199,82,.18),0_10px_30px_rgba(0,0,0,.45)] transition-transform duration-300 group-hover:scale-110 ${big ? "bottom-5 left-5 h-16 w-16 md:bottom-7 md:left-7 md:h-20 md:w-20" : "left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2"}`}>
        <Play className={`ml-0.5 fill-current ${big ? "h-7 w-7 md:h-8 md:w-8" : "h-4 w-4"}`} />
      </span>
    </span>
  );
}

/** One feature video large on the left, the rest as a playlist on the right. */
function Videos({ m, onPlay }: { m: CouncilMember; onPlay: (v: Video) => void }) {
  const t = useT();
  const [lead, ...more] = m.videos;
  return (
    <section className="relative isolate overflow-hidden py-16 text-white md:py-24" style={{ background: INK }}>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(55%_70%_at_10%_0%,rgba(42,75,168,.6),transparent_70%),radial-gradient(45%_60%_at_100%_100%,rgba(201,150,43,.2),transparent_70%)]" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-[#F6C752]/50 to-transparent" />
      <div className="vk-container">
        <div className="mx-auto max-w-6xl">
          <Rise className="mb-10 md:mb-12">
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-[#F6C752]"><span aria-hidden className="h-px w-8 bg-[#F6C752]" />{t("Featured Videos")}</p>
            <h2 className="mt-4 font-serif-display text-3xl font-bold md:text-5xl">{t("Hear from")} {m.name.replace(/^Sri /, "")}</h2>
          </Rise>
          <div className="grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-10">
            <Rise>
              <button type="button" onClick={() => onPlay(lead)} className="group block w-full text-left" aria-label={`${t("Play")}: ${lead.title}`}>
                <Thumb v={lead} big />
                <span className="mt-5 block font-serif-display text-2xl font-bold leading-snug group-hover:text-[#FFE6A3] md:text-[1.75rem]">{lead.title}</span>
                <span className="mt-3 block max-w-2xl text-[15px] leading-7 text-white/70">{lead.text}</span>
              </button>
            </Rise>
            {more.length > 0 && (
              <Rise delay={0.1}>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.24em] text-white/45">{t("More videos")}</p>
                <ul className="divide-y divide-white/10 rounded-2xl bg-white/[.04] ring-1 ring-white/10">
                  {more.map((v) => (
                    <li key={v.id}>
                      <button type="button" onClick={() => onPlay(v)} className="group grid w-full grid-cols-[42%_1fr] items-start gap-4 p-4 text-left transition hover:bg-white/[.05]" aria-label={`${t("Play")}: ${v.title}`}>
                        <Thumb v={v} />
                        <span className="min-w-0">
                          <span className="line-clamp-3 font-serif-display text-[15.5px] font-bold leading-snug group-hover:text-[#FFE6A3]">{v.title}</span>
                          <span className="mt-1.5 line-clamp-2 text-[12.5px] leading-5 text-white/60">{v.text}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </Rise>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function MemberView({ m }: { m: CouncilMember }) {
  const t = useT();
  const reduce = useReducedMotion();
  const [video, setVideo] = useState<Video | null>(null);
  // moving to another member (Previous / Next) always starts at the top of their profile
  useEffect(() => { scrollToTopNow(); }, [m.slug]);
  const i = COUNCIL.findIndex((x) => x.slug === m.slug);
  const prev = COUNCIL[(i - 1 + COUNCIL.length) % COUNCIL.length];
  const next = COUNCIL[(i + 1) % COUNCIL.length];

  return (
    <PageLayout background={IVORY}>
      <div className="overflow-x-clip pt-[var(--header-h)]" style={{ background: IVORY }}>
        {/* ══ HERO ══ */}
        <section className="relative pb-14 pt-8 md:pb-20 md:pt-14">
          <div aria-hidden className="absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(60%_60%_at_80%_20%,rgba(201,150,43,.10),transparent_70%)]" />
          <div className="vk-container relative">
            <Link href="/governance" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0F1E4A]/60 hover:text-[#0F1E4A]">
              <ArrowLeft className="h-4 w-4" /> {t("Governing Council")}
            </Link>
            <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-14">
              <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="order-2 lg:order-1">
                <Eyebrow>{t(m.roles[0])}</Eyebrow>
                <h1 className="mt-4 font-serif-display text-[2.5rem] font-bold leading-[1.05] text-[#0F1E4A] md:text-[4.2rem]">{m.name}</h1>
                <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[#0F1E4A]/75 md:text-[17.5px]">{m.summary}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {m.roles.map((r) => (
                    <li key={r} className="rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-[#0F1E4A] ring-1 ring-[#E7DCC3]">{t(r)}</li>
                  ))}
                </ul>
                {m.honours.length > 0 && <p className="mt-5 text-[12px] font-bold uppercase leading-6 tracking-[0.16em] text-[#A87A1E]">{m.honours.join("  ·  ")}</p>}
              </motion.div>
              <motion.div initial={reduce ? false : { opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease, delay: 0.1 }} className="relative order-1 mx-auto w-full max-w-[320px] md:max-w-[400px] lg:order-2">
                <Medallion m={m} size="400px" priority />
                <div className="absolute -left-2 bottom-6 rounded-2xl bg-white px-4 py-3 text-center shadow-[0_20px_40px_-20px_rgba(15,30,74,.5)] ring-1 ring-[#E7DCC3] md:-left-6">
                  <p className="font-serif-display text-3xl font-bold leading-none text-[#0F1E4A]">{m.years}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A87A1E]">{t("Years of devotion")}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══ BIOGRAPHY (right after the hero: their photograph beside the story) ══ */}
        <section className="border-t border-[#E7DCC3] bg-white py-14 md:py-20">
          <div className="vk-container">
            <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[.7fr_1.3fr] md:gap-14">
              <Rise className="md:sticky md:top-[calc(var(--header-h)+2rem)] md:self-start">
                <Eyebrow>{t("Biography")}</Eyebrow>
                <h2 className="mt-4 font-serif-display text-3xl font-bold leading-tight text-[#0F1E4A] md:text-4xl">{t("His journey")}</h2>
                <div className="relative mt-6 hidden aspect-[4/5] max-w-[300px] overflow-hidden rounded-[1.4rem] bg-[#0A1640] shadow-[0_30px_60px_-36px_rgba(15,30,74,.7)] md:block">
                  <Image src={m.image} alt={m.name} fill sizes="300px" className="object-cover object-top" />
                </div>
              </Rise>
              <Rise delay={0.08}>
                <div className="space-y-5 text-[16px] leading-[1.9] text-[#0F1E4A]/80 md:text-[17px]">
                  {m.bio.map((p, k) => (
                    <p key={k} className={k === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif-display first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-[#A87A1E]" : ""}>{p}</p>
                  ))}
                </div>
              </Rise>
            </div>
          </div>
        </section>

        {/* ══ SERVICE & VISION + AREAS OF SERVICE ══ */}
        <section className="border-y border-[#E7DCC3] py-14 md:py-20">
          <div className="vk-container">
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_.8fr] lg:gap-16">
              <Rise>
                <Eyebrow>{t("Service & Vision")}</Eyebrow>
                <p className="mt-5 font-serif-display text-xl leading-[1.6] text-[#0F1E4A] md:text-[1.6rem] md:leading-[1.55]">{m.vision}</p>
              </Rise>
              <Rise delay={0.1}>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#0F1E4A]/50">{t("Areas of service")}</p>
                <ul className="mt-4 grid gap-2.5">
                  {m.expertise.map((x) => (
                    <li key={x} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-[14.5px] font-semibold text-[#0F1E4A] ring-1 ring-[#E7DCC3]">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0F1E4A] text-[#F6C752]"><Check className="h-3.5 w-3.5" /></span>
                      {x}
                    </li>
                  ))}
                </ul>
              </Rise>
            </div>
          </div>
        </section>

        {/* ══ CONTRIBUTIONS ══ */}
        <section className="bg-white py-16 md:py-24">
          <div className="vk-container">
            <div className="mx-auto max-w-6xl">
              <Rise className="mb-10 md:mb-14">
                <Eyebrow>{t("Contributions")}</Eyebrow>
                <h2 className="mt-4 font-serif-display text-3xl font-bold text-[#0F1E4A] md:text-5xl">{t("A life given to seva")}</h2>
              </Rise>
              <ol className="grid gap-5 md:grid-cols-2 md:gap-6">
                {m.contributions.map((c, k) => (
                  <Rise key={c.title} delay={(k % 2) * 0.08}>
                    <li className="group relative h-full overflow-hidden rounded-[1.5rem] bg-[#FBF7EE] p-6 ring-1 ring-[#E7DCC3] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_50px_-30px_rgba(15,30,74,.55)] hover:ring-[#C9962B]/60 md:p-8">
                      <span aria-hidden className="absolute -right-2 -top-6 font-serif-display text-[7rem] font-bold leading-none text-[#C9962B]/10 transition-colors group-hover:text-[#C9962B]/20">{String(k + 1).padStart(2, "0")}</span>
                      <p className="font-serif-display text-sm font-bold text-[#A87A1E]">{String(k + 1).padStart(2, "0")}</p>
                      <h3 className="relative mt-2 font-serif-display text-xl font-bold leading-snug text-[#0F1E4A] md:text-2xl">{c.title}</h3>
                      <p className="relative mt-3 text-[15px] leading-7 text-[#0F1E4A]/70">{c.text}</p>
                    </li>
                  </Rise>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ══ FEATURED VIDEOS ══ */}
        {m.videos.length > 0 && <Videos m={m} onPlay={setVideo} />}

        {/* ══ MORE COUNCIL MEMBERS ══ */}
        <section className="py-12 md:py-16">
          <div className="vk-container">
            <nav className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2" aria-label={t("More council members")}>
              {[prev, next].map((x, k) => (
                <Link key={x.slug} href={`/governance/${x.slug}`} className={`group flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-[#E7DCC3] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-28px_rgba(15,30,74,.6)] hover:ring-[#C9962B]/70 ${k ? "sm:flex-row-reverse sm:text-right" : ""}`}>
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_30%,#2A4BA8,#0A1640)]">
                    <Image src={x.cutout} alt="" fill sizes="64px" className="object-cover object-top" />
                  </span>
                  <span className="min-w-0">
                    <span className={`flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#0F1E4A]/45 ${k ? "sm:justify-end" : ""}`}>
                      {k ? <>{t("Next")} <ArrowRight className="h-3 w-3" /></> : <><ArrowLeft className="h-3 w-3" /> {t("Previous")}</>}
                    </span>
                    <span className="block truncate font-serif-display text-lg font-bold text-[#0F1E4A]">{x.name}</span>
                    <span className="block truncate text-[12.5px] text-[#0F1E4A]/55">{t(x.roles[0])}</span>
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </section>
      </div>
      <VideoDialog v={video} onClose={() => setVideo(null)} />
    </PageLayout>
  );
}
