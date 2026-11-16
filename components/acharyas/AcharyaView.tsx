"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, ChevronDown, Flower2, Layers, MapPin, Sparkles } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useT } from "@/components/i18n/LocaleProvider";
import { ACHARYAS, acharyaBySlug, asList, isPhoto, type Acharya, type Block, type Pastime } from "@/lib/acharyas";
import { scrollToTopNow } from "@/lib/scrollTop";
import { Divider, Eyebrow, HaloPortrait, IVORY, Rise, ease } from "./shared";

type Chapter = { h?: string; ps: string[] };
/** Long-form blocks as chapters: each heading with the paragraphs that follow it. */
function chapters(blocks: Block[]): Chapter[] {
  const out: Chapter[] = [];
  for (const b of blocks) {
    if ("h" in b) out.push({ h: b.h, ps: [] });
    else if (out.length) out[out.length - 1].ps.push(b.p);
    else out.push({ ps: [b.p] });
  }
  return out;
}
const isIntro = (h?: string) => !h || /^introduction$/i.test(h);
/** "1. Fearlessness" -> ["1", "Fearlessness"] */
const numbered = (h: string) => h.match(/^(\d+)\.\s*(.+)$/)?.slice(1) as [string, string] | undefined;

const anchor = "scroll-mt-[calc(var(--header-h)+24px)]";

function SectionTitle({ id, kicker, children }: { id: string; kicker: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 md:mb-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#A87A1E]">{kicker}</p>
      <h2 id={`${id}-heading`} className="mt-2 font-heading text-[1.75rem] font-bold leading-tight text-[#0F1E4A] md:text-[2.3rem]">{children}</h2>
      <span aria-hidden className="mt-4 block h-[3px] w-12 rounded-full bg-gradient-to-r from-[#F6C752] to-[#C9962B]" />
    </div>
  );
}

/* ══ HERO ══ */
function Hero({ a }: { a: Acharya }) {
  const t = useT();
  const reduce = useReducedMotion();
  return (
    <section className="relative isolate overflow-hidden" style={{ background: "linear-gradient(165deg,#172B6E 0%,#0F1E4A 50%,#0A1233 100%)" }}>
      {/* the acharya's own painting, deeply veiled, as the backdrop */}
      <div aria-hidden className="absolute inset-0 -z-20 opacity-[.22]">
        <Image src={a.banner} alt="" fill sizes="100vw" className="object-cover blur-[2px]" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0A1233_0%,rgba(10,18,51,.85)_45%,rgba(10,18,51,.55)_100%),radial-gradient(40%_60%_at_80%_40%,rgba(246,199,82,.18),transparent_70%)]" />
      <div className="vk-container">
        <div className="mx-auto grid max-w-6xl items-center gap-10 pb-24 pt-8 md:pb-28 md:pt-12 lg:grid-cols-[1.2fr_.8fr] lg:gap-14">
          <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="order-2 min-w-0 lg:order-1">
            <nav aria-label={t("Breadcrumb")} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] font-semibold text-white/55">
              <Link href="/" className="hover:text-white">{t("Home")}</Link><span aria-hidden>/</span>
              <Link href="/acharyas" className="hover:text-white">{t("Acharyas")}</Link><span aria-hidden>/</span>
              <span className="min-w-0 truncate text-white/80">{a.shortName}</span>
            </nav>
            <p className="mt-6"><span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#F6C752] ring-1 ring-[#F6C752]/30">{a.sampradaya}</span></p>
            <h1 className="mt-4 break-words font-heading text-[2.05rem] font-bold leading-[1.06] tracking-tight text-[#FBF7EE] min-[400px]:text-[2.4rem] md:text-[3.6rem] lg:text-[4rem]">{a.name}</h1>
            <p className="mt-4 text-[16px] font-semibold leading-snug text-[#F6C752] md:text-[19px]">{a.title}</p>
            <p className="mt-3 text-[14px] text-white/60">{t("Also known as")} <b className="font-semibold text-white/90">{a.shortName}</b></p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/acharyas#parampara" className="group inline-flex items-center gap-2 rounded-full bg-[#F6C752] px-5 py-2.5 text-sm font-bold text-[#0F1E4A] transition hover:bg-[#FFE6A3]">
                {t("See the parampara")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/acharyas#acharyas" className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-bold text-[#FBF7EE] ring-1 ring-white/25 transition hover:ring-white/60">{t("All acharyas")}</Link>
            </div>
          </motion.div>
          <motion.div initial={reduce ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease, delay: 0.1 }}
            className="relative order-1 mx-auto w-full max-w-[250px] min-[400px]:max-w-[290px] lg:order-2 lg:max-w-[380px]">
            <div aria-hidden className="absolute -inset-8 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(246,199,82,.32),transparent)] blur-2xl" />
            <div aria-hidden className="absolute -left-3 -top-3 bottom-3 right-3 rounded-[2rem] ring-1 ring-[#F6C752]/40" />
            <HaloPortrait src={a.portrait} alt={a.name} halo={!isPhoto(a)} sizes="(min-width: 1024px) 380px, 290px" priority className="rounded-[2rem] shadow-[0_40px_70px_-30px_rgba(0,0,0,.85)]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══ FACTS ══ four cards that overlap the foot of the hero */
function Facts({ a }: { a: Acharya }) {
  const t = useT();
  const items = [
    a.appearance && { icon: CalendarDays, label: t("Appearance"), value: a.appearance.date ?? "—", sub: a.appearance.place },
    a.disappearance && { icon: CalendarDays, label: t("Disappearance"), value: a.disappearance.date ?? "—", sub: a.disappearance.place },
    { icon: Flower2, label: t("Sampradaya"), value: a.sampradaya, sub: t("The disciplic line this acharya belongs to") },
    { icon: Layers, label: t("Category"), value: t(a.category), href: "/acharyas#acharyas" },
  ].filter(Boolean) as { icon: typeof CalendarDays; label: string; value: string; sub?: string; href?: string }[];
  return (
    <div className="vk-container relative z-10 -mt-14 md:-mt-16">
      <ul className={`mx-auto grid max-w-6xl grid-cols-2 gap-3 md:gap-4 ${items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        {items.map((f, i) => (
          <Rise as="li" key={f.label} delay={i * 0.06} className="min-w-0 rounded-2xl bg-white p-4 shadow-[0_24px_50px_-30px_rgba(15,30,74,.55)] ring-1 ring-[#E7DCC3] md:p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FBF2DC] text-[#A87A1E]"><f.icon className="h-[18px] w-[18px]" /></span>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1E3A8A] md:text-[10.5px]">{f.label}</p>
            <p className="mt-1 break-words font-heading text-[14.5px] font-bold leading-snug text-[#0F1E4A] md:text-[16.5px]">{f.value}</p>
            {f.sub && <p className="mt-1 text-[11.5px] leading-[1.45] text-[#0F1E4A]/55 md:text-[12.5px]">{f.sub}</p>}
            {f.href && <Link href={f.href} className="mt-2 inline-flex items-center gap-1 text-[11.5px] font-bold text-[#1E3A8A] hover:underline">{t("More in this category")} <ArrowRight className="h-3 w-3" /></Link>}
          </Rise>
        ))}
      </ul>
    </div>
  );
}

/* ══ LONG-FORM: biography with chapter headings and a drop cap ══ */
function Biography({ blocks }: { blocks: Block[] }) {
  const ch = chapters(blocks);
  const firstCh = ch.findIndex((c) => c.ps.length > 0);
  return (
    <div className="space-y-8">
      {ch.map((c, i) => (
        <Rise key={i}>
          {c.h && !isIntro(c.h) && <h3 className="mb-3 flex items-center gap-3 font-heading text-[1.2rem] font-bold leading-snug text-[#0F1E4A] md:text-[1.4rem]"><span aria-hidden className="h-2 w-2 shrink-0 rotate-45 bg-[#C9962B]" />{c.h}</h3>}
          <div className="space-y-4">
            {c.ps.map((p, k) => {
              const cap = i === firstCh && k === 0;
              return (
                <p key={k} className={`text-[15.5px] leading-[1.85] text-[#0F1E4A]/80 md:text-[16.5px] ${cap ? "first-letter:float-left first-letter:mr-2.5 first-letter:mt-1 first-letter:font-heading first-letter:text-[3.4rem] first-letter:font-bold first-letter:leading-[.85] first-letter:text-[#C9962B]" : ""}`}>{p}</p>
              );
            })}
          </div>
        </Rise>
      ))}
    </div>
  );
}

/** Teachings or qualities: numbered cards when long-form, an illuminated panel when it is a single statement. */
function Principles({ blocks, chips }: { blocks: Block[]; chips?: boolean }) {
  const list = chips ? asList(blocks) : null;
  if (list)
    return (
      <Rise as="div">
        <ul className="flex flex-wrap gap-2.5">
          {list.map((q) => (
            <li key={q} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13.5px] font-semibold text-[#0F1E4A] shadow-[0_10px_24px_-18px_rgba(15,30,74,.6)] ring-1 ring-[#E7DCC3]">
              <Sparkles aria-hidden className="h-3.5 w-3.5 shrink-0 text-[#C9962B]" />{q}
            </li>
          ))}
        </ul>
      </Rise>
    );
  const ch = chapters(blocks);
  if (ch.length === 1 && !ch[0].h)
    return (
      <Rise className="relative overflow-hidden rounded-[1.6rem] bg-[#0F1E4A] p-6 text-[#FBF7EE] shadow-[0_30px_60px_-36px_rgba(15,30,74,.9)] md:p-9">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_80%_at_100%_0%,rgba(246,199,82,.18),transparent_70%)]" />
        <p aria-hidden className="relative font-heading text-6xl leading-[.6] text-[#F6C752]/70">&ldquo;</p>
        {ch[0].ps.map((p, k) => <p key={k} className="relative mt-2 font-heading text-[17px] leading-[1.7] md:text-[20px]">{p}</p>)}
      </Rise>
    );
  const intro = ch.filter((c) => isIntro(c.h));
  const rest = ch.filter((c) => !isIntro(c.h));
  return (
    <div>
      {intro.map((c, i) => (
        <Rise key={i} className="mb-6 space-y-4">
          {c.ps.map((p, k) => <p key={k} className="font-heading text-[17px] leading-[1.7] text-[#0F1E4A] md:text-[19px]">{p}</p>)}
        </Rise>
      ))}
      <ol className="grid gap-4 md:grid-cols-2">
        {rest.map((c, i) => {
          const [n, title] = numbered(c.h ?? "") ?? [String(i + 1), c.h ?? ""];
          return (
            <Rise as="li" key={i} delay={(i % 2) * 0.06} className="group relative min-w-0 overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-[#E7DCC3] transition hover:ring-[#C9962B]/70 md:p-6">
              <span aria-hidden className="absolute -right-2 -top-4 font-heading text-[5.5rem] font-bold leading-none text-[#F6C752]/15">{n.padStart(2, "0")}</span>
              <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#0F1E4A] font-heading text-[13px] font-bold text-[#F6C752]">{n}</span>
              <h3 className="relative mt-3 font-heading text-[17px] font-bold leading-snug text-[#0F1E4A] md:text-[18px]">{title}</h3>
              {c.ps.map((p, k) => <p key={k} className="relative mt-2 text-[14px] leading-[1.75] text-[#0F1E4A]/70">{p}</p>)}
            </Rise>
          );
        })}
      </ol>
    </div>
  );
}

function Timeline({ a }: { a: Acharya }) {
  const t = useT();
  return (
    <ol className="relative">
      <span aria-hidden className="absolute bottom-3 left-[11px] top-3 w-[2px] rounded-full bg-gradient-to-b from-[#F6C752] via-[#C9962B] to-[#E7DCC3]" />
      {a.timeline.map((e, i) => (
        <Rise as="li" key={i} className="relative pb-7 pl-10 last:pb-0">
          <span aria-hidden className="absolute left-[4px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white ring-2 ring-[#C9962B]"><span className="h-1.5 w-1.5 rounded-full bg-[#C9962B]" /></span>
          <div className="flex flex-wrap items-center gap-2">
            {e.year && <span className="rounded-full bg-[#0F1E4A] px-2.5 py-0.5 font-heading text-[12px] font-bold text-[#F6C752]">{e.year}</span>}
            {e.date && e.date !== e.year && <span className="text-[12px] font-semibold text-[#A87A1E]">{e.date}</span>}
          </div>
          <h3 className="mt-2 font-heading text-[16.5px] font-bold leading-snug text-[#0F1E4A] md:text-[18px]">{e.title}</h3>
          {e.place && <p className="mt-1 flex items-start gap-1.5 text-[12.5px] font-medium text-[#1E3A8A]"><MapPin aria-label={t("Place")} className="mt-0.5 h-3.5 w-3.5 shrink-0" />{e.place}</p>}
          {e.text && <p className="mt-1.5 text-[14px] leading-[1.75] text-[#0F1E4A]/70">{e.text}</p>}
        </Rise>
      ))}
    </ol>
  );
}

function Lineage({ a }: { a: Acharya }) {
  const t = useT();
  const rows = [
    a.lineage?.guru && { label: t("Guru"), x: acharyaBySlug(a.lineage.guru) },
    a.lineage?.disciple && { label: t("Disciple"), x: acharyaBySlug(a.lineage.disciple) },
  ].filter((r): r is { label: string; x: Acharya } => !!r && !!r.x);
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {rows.map(({ label, x }) => (
        <Rise as="li" key={x.slug} className="min-w-0">
          <Link href={`/acharyas/${x.slug}`} className="group flex h-full items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-[#E7DCC3] transition hover:-translate-y-0.5 hover:ring-[#C9962B]">
            <span className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-[#E7DCC3]">
              <Image src={x.portrait} alt="" fill sizes="64px" className="object-cover object-top" />
            </span>
            <span className="min-w-0">
              <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#A87A1E]">{label}</span>
              <span className="mt-1 block font-heading text-[15.5px] font-bold leading-snug text-[#0F1E4A] group-hover:text-[#1E3A8A]">{x.name}</span>
              {x.years && <span className="mt-1 block text-[12px] text-[#0F1E4A]/55">{x.years}</span>}
            </span>
          </Link>
        </Rise>
      ))}
    </ul>
  );
}

const BOOKS_SHOWN = 6;
function Books({ a }: { a: Acharya }) {
  const t = useT();
  const [all, setAll] = useState(false);
  const list = all ? a.books : a.books.slice(0, BOOKS_SHOWN);
  return (
    <>
    <ul className="grid gap-3 sm:grid-cols-2">
      {list.map((b, i) => (
        <Rise as="li" key={b.title} delay={(i % 2) * 0.05} className="flex min-w-0 gap-4 rounded-2xl bg-white p-4 ring-1 ring-[#E7DCC3] md:p-5">
          <span aria-hidden className="relative flex h-14 w-11 shrink-0 items-center justify-center rounded-r-md rounded-l-sm bg-gradient-to-br from-[#1E3A8A] to-[#0A1233] text-[#F6C752] shadow-[3px_4px_0_-1px_#E7DCC3]">
            <span className="absolute inset-y-0 left-1 w-px bg-[#F6C752]/40" />
            <BookOpen className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h3 className="break-words font-heading text-[15.5px] font-bold leading-snug text-[#0F1E4A]">{b.title}</h3>
            {b.year && <p className="mt-0.5 text-[11.5px] font-bold text-[#A87A1E]">{b.year}</p>}
            {b.text && <p className="mt-1.5 text-[13.5px] leading-[1.65] text-[#0F1E4A]/65">{b.text}</p>}
          </div>
        </Rise>
      ))}
    </ul>
    {a.books.length > BOOKS_SHOWN && (
      <button type="button" aria-expanded={all} onClick={() => setAll((v) => !v)} className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[13px] font-bold text-[#0F1E4A] ring-1 ring-[#C9962B]/50 hover:ring-[#C9962B]">
        {all ? t("Show fewer books") : `${t("Show all books")} (${a.books.length})`} <ChevronDown className={`h-4 w-4 transition-transform ${all ? "rotate-180" : ""}`} />
      </button>
    )}
    </>
  );
}

function PastimeCard({ p }: { p: Pastime }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  return (
    <Rise as="li" className="min-w-0 overflow-hidden rounded-[1.4rem] bg-white ring-1 ring-[#E7DCC3]">
      <div className="relative aspect-[16/9] bg-[#0F1E4A]">
        <Image src={p.image} alt="" fill sizes="(min-width: 768px) 360px, 100vw" className="object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-[#F6C752] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0F1E4A]">{t("Pastime")}</span>
      </div>
      <div className="p-5">
        <h3 className="font-heading text-[17px] font-bold leading-snug text-[#0F1E4A]">{p.title}</h3>
        <p className="mt-2 text-[14px] leading-[1.7] text-[#0F1E4A]/70">{p.summary}</p>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={reduce ? undefined : { height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
              <div className="mt-3 space-y-3 border-t border-[#F1E8D3] pt-3">
                {p.body.map((x, k) => <p key={k} className="text-[14px] leading-[1.75] text-[#0F1E4A]/80">{x}</p>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-[#1E3A8A] hover:text-[#0F1E4A]">
          {open ? t("Show less") : t("Read the full pastime")} <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
    </Rise>
  );
}

/* ══ PAGE ══ */
export default function AcharyaView({ a }: { a: Acharya }) {
  const t = useT();
  useEffect(() => { scrollToTopNow(); }, [a.slug]);
  const i = ACHARYAS.findIndex((x) => x.slug === a.slug);
  const prev = ACHARYAS[(i - 1 + ACHARYAS.length) % ACHARYAS.length];
  const next = ACHARYAS[(i + 1) % ACHARYAS.length];
  const more = [...ACHARYAS.filter((x) => x.category === a.category && x.slug !== a.slug), ...ACHARYAS.filter((x) => x.category !== a.category)].slice(0, 4);

  const sections = [
    { id: "biography", label: t("Biography"), kicker: t("His life"), show: a.biography.length > 0, body: <Biography blocks={a.biography} /> },
    { id: "teachings", label: t("Teachings"), kicker: t("His instructions"), show: a.teachings.length > 0, body: <Principles blocks={a.teachings} /> },
    { id: "qualities", label: t("Qualities"), kicker: t("His character"), show: a.qualities.length > 0, body: <Principles blocks={a.qualities} chips /> },
    { id: "timeline", label: t("Timeline"), kicker: t("Through the years"), show: a.timeline.length > 0, body: <Timeline a={a} /> },
    { id: "lineage", label: t("Lineage"), kicker: t("Disciplic succession"), show: !!a.lineage, body: <Lineage a={a} /> },
    { id: "books", label: t("Books"), kicker: t("His writings"), show: a.books.length > 0, body: <Books a={a} /> },
    { id: "pastimes", label: t("Pastimes"), kicker: t("Stories of his life"), show: !!a.pastimes?.length, body: <ul className="grid gap-5 sm:grid-cols-2">{a.pastimes?.map((p) => <PastimeCard key={p.title} p={p} />)}</ul> },
  ].filter((s) => s.show);

  return (
    <PageLayout background={IVORY}>
      <div className="overflow-x-clip pt-[var(--header-h)]" style={{ background: IVORY }}>
        <Hero a={a} />
        <Facts a={a} />

        <div className="vk-container py-14 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14">
            <article className="min-w-0">
              {/* lead + the wide painting */}
              <Rise>
                <p className="border-l-[3px] border-[#C9962B] pl-5 font-heading text-[1.2rem] leading-[1.6] text-[#0F1E4A] md:text-[1.45rem]">{a.summary}</p>
              </Rise>
              <Rise className="mt-8">
                <figure className="rounded-[1.4rem] bg-gradient-to-br from-[#F6C752] via-[#C9962B] to-[#A87A1E] p-[2px] shadow-[0_30px_60px_-36px_rgba(15,30,74,.7)]">
                  <div className="relative aspect-[1000/429] overflow-hidden rounded-[1.3rem]">
                    <Image src={a.banner} alt={a.name} fill sizes="(min-width: 1024px) 760px, 100vw" className="object-cover" />
                    <span aria-hidden className="pointer-events-none absolute inset-[6px] rounded-[1rem] ring-1 ring-inset ring-[#FFE6A3]/40" />
                  </div>
                </figure>
              </Rise>

              {/* on phones the contents sit here as chips */}
              <nav aria-label={t("On this page")} className="mt-8 flex flex-wrap gap-2 lg:hidden">
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className="rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-[#0F1E4A] ring-1 ring-[#E7DCC3] hover:ring-[#C9962B]">{s.label}</a>
                ))}
              </nav>

              {sections.map((s) => (
                <section key={s.id} id={s.id} aria-labelledby={`${s.id}-heading`} className={`${anchor} mt-14 border-t border-[#E7DCC3] pt-12 first-of-type:mt-12 md:mt-16 md:pt-14`}>
                  <SectionTitle id={s.id} kicker={s.kicker}>{s.label}</SectionTitle>
                  {s.body}
                </section>
              ))}
            </article>

            {/* sticky contents + details on desktop */}
            <aside className="hidden lg:block">
              <div className="sticky top-[calc(var(--header-h)+24px)] space-y-5">
                <nav aria-label={t("On this page")} className="rounded-2xl bg-white p-5 ring-1 ring-[#E7DCC3]">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#A87A1E]">{t("On this page")}</p>
                  <ul className="mt-3 space-y-1">
                    {sections.map((s) => (
                      <li key={s.id}><a href={`#${s.id}`} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[14px] font-medium text-[#0F1E4A]/75 hover:bg-[#FBF7EE] hover:text-[#0F1E4A]"><span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-[#C9962B]" />{s.label}</a></li>
                    ))}
                  </ul>
                </nav>
                <dl className="space-y-3 rounded-2xl bg-[#0F1E4A] p-5 text-[#FBF7EE]">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#F6C752]">{t("Details")}</p>
                  {[[t("Also known as"), a.shortName], [t("Role"), a.title], [t("Years"), a.years], [t("Category"), t(a.category)]].map(([k, v]) =>
                    v ? (
                      <div key={k} className="border-t border-white/10 pt-3">
                        <dt className="text-[11px] font-semibold text-white/50">{k}</dt>
                        <dd className="mt-0.5 text-[14px] font-semibold leading-snug">{v}</dd>
                      </div>
                    ) : null,
                  )}
                </dl>
              </div>
            </aside>
          </div>
        </div>

        {/* ══ CONTINUE ══ previous / next and more acharyas */}
        <section className="border-t border-[#E7DCC3] bg-white py-14 md:py-20">
          <div className="vk-container">
            <div className="mx-auto max-w-6xl">
              <div className="grid grid-cols-2 gap-3 md:gap-5">
                {[prev, next].map((x, k) => (
                  <Link key={x.slug} href={`/acharyas/${x.slug}`} className={`group flex min-w-0 items-center gap-3 rounded-2xl bg-[#FBF7EE] p-3 ring-1 ring-[#E7DCC3] transition hover:ring-[#C9962B] md:gap-4 md:p-4 ${k ? "flex-row-reverse text-right" : ""}`}>
                    <span className="relative hidden h-16 w-14 shrink-0 overflow-hidden rounded-xl min-[400px]:block md:h-20 md:w-16">
                      <Image src={x.portrait} alt="" fill sizes="64px" className="object-cover object-top" />
                    </span>
                    <span className="min-w-0">
                      <span className={`flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#A87A1E] ${k ? "justify-end" : ""}`}>
                        {k ? <>{t("Next")} <ArrowRight className="h-3 w-3" /></> : <><ArrowLeft className="h-3 w-3" /> {t("Previous")}</>}
                      </span>
                      <span className="mt-1 line-clamp-3 block font-heading text-[13.5px] font-bold leading-snug text-[#0F1E4A] group-hover:text-[#1E3A8A] md:text-[16px]">{x.name}</span>
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-14 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <Eyebrow>{t("The acharyas")}</Eyebrow>
                  <h2 className="mt-3 font-heading text-[1.75rem] font-bold text-[#0F1E4A] md:text-4xl">{t("More acharyas")}</h2>
                  <p className="mt-2 text-[14.5px] text-[#0F1E4A]/60">{t("Continue along the disciplic succession.")}</p>
                </div>
                <Link href="/acharyas#acharyas" className="inline-flex items-center gap-2 rounded-full bg-[#0F1E4A] px-5 py-2.5 text-sm font-bold text-[#FBF7EE] hover:bg-[#1E3A8A]">{t("All acharyas")} <ArrowRight className="h-4 w-4" /></Link>
              </div>
              <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 lg:grid-cols-4">
                {more.map((x, k) => (
                  <Rise as="li" key={x.slug} delay={k * 0.06} className="min-w-0">
                    <Link href={`/acharyas/${x.slug}`} className="group block">
                      <HaloPortrait src={x.portrait} alt={x.name} halo={!isPhoto(x)} sizes="(min-width: 1024px) 270px, 50vw" className="rounded-[1.25rem] shadow-[0_24px_44px_-30px_rgba(15,30,74,.75)]" zoom />
                      <h3 className="mt-3 break-words font-heading text-[14px] font-bold leading-snug text-[#0F1E4A] group-hover:text-[#1E3A8A] md:text-[16px]">{x.name}</h3>
                      <p className="mt-1 line-clamp-2 text-[12px] leading-[1.45] text-[#0F1E4A]/60 md:text-[13px]">{x.title}</p>
                    </Link>
                  </Rise>
                ))}
              </ul>
              <Divider className="mt-14" />
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
