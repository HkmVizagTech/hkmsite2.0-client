"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, BookOpen, CalendarDays, ChevronDown, Flower2, Layers, MapPin, Sparkles, Users } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useT } from "@/components/i18n/LocaleProvider";
import { asList, type Acharya, type Block, type Pastime } from "@/lib/acharyas";
import { useAcharyaData } from "./data";
import { scrollToTopNow } from "@/lib/scrollTop";
import { CtaPill, Divider, Eyebrow, Portrait, IVORY, Rise, ease } from "./shared";

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

const anchor = "scroll-mt-[calc(var(--header-h)+8px)]";

/* ══ HERO ══ the painting is never cropped at the head. Phones: the full 4:5 painting first, edge to edge, then the
   title below on ivory. Large screens: title on the left, the sharp painting framed on the right, over a soft blurred
   copy of the acharya's wide painting. ══ */
function Hero({ a }: { a: Acharya }) {
  const t = useT();
  const reduce = useReducedMotion();
  const founder = a.category === "Founder-Acharya";
  return (
    <section className="relative isolate overflow-hidden lg:bg-[#0A1233]">
      <div aria-hidden className="absolute inset-0 -z-10 hidden lg:block">
        <Image src={a.banner} alt="" fill quality={60} sizes="50vw" className="scale-110 object-cover blur-2xl" />
        <span className="absolute inset-0 bg-[#0A1233]/55" />
      </div>
      <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-14 lg:px-6 lg:pb-28 lg:pt-14">
        {/* the painting */}
        <div className="relative overflow-hidden bg-[#0A1233] sm:px-6 sm:py-8 lg:order-2 lg:overflow-visible lg:bg-transparent lg:p-0">
          <div aria-hidden className="absolute inset-0 hidden sm:block lg:hidden">
            <Image src={a.banner} alt="" fill quality={60} sizes="50vw" className="scale-110 object-cover blur-2xl" />
            <span className="absolute inset-0 bg-[#0A1233]/45" />
          </div>
          <motion.div initial={reduce ? false : { opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease }}
            className="relative mx-auto aspect-[1208/1521] w-full overflow-hidden sm:max-w-[420px] sm:rounded-[2rem] sm:shadow-[0_40px_70px_-30px_rgba(0,0,0,.85)] lg:ml-auto lg:mr-0 lg:max-w-[440px]">
            <Image src={a.portrait} alt={`Painting of ${a.name}`} fill loading="eager" fetchPriority="high" quality={90} sizes="(min-width: 640px) 440px, 100vw" className="object-cover object-top" />
          </motion.div>
        </div>

        {/* the title */}
        <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.15 }}
          className="min-w-0 px-4 pb-8 pt-7 text-[#0F1E4A] sm:px-6 lg:order-1 lg:p-0 lg:text-[#FBF7EE]">
          <nav aria-label={t("Breadcrumb")} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] font-semibold text-[#0F1E4A]/55 lg:text-white/60">
            <Link href="/" className="hover:underline">{t("Home")}</Link><span aria-hidden>/</span>
            <Link href="/acharyas" className="hover:underline">{t("Acharyas")}</Link><span aria-hidden>/</span>
            <span className="min-w-0 truncate">{a.shortName}</span>
          </nav>
          <p className="mt-4"><span className="inline-flex rounded-full bg-[#0F1E4A] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#F6C752] lg:bg-white/10 lg:ring-1 lg:ring-inset lg:ring-[#F6C752]/30">{a.sampradaya}</span></p>
          <h1 className="mt-3 break-words font-heading text-[2.1rem] font-bold leading-[1.06] tracking-tight min-[400px]:text-[2.4rem] md:text-[3.2rem] lg:text-[3.6rem]">{a.name}</h1>
          <p className="mt-3 text-[15.5px] font-semibold leading-snug text-[#A87A1E] md:text-[18px] lg:text-[#F6C752]">{a.title}</p>
          <p className="mt-2 text-[13.5px] text-[#0F1E4A]/65 lg:text-white/65">{t("Also known as")} <b className="font-semibold text-[#0F1E4A] lg:text-white">{a.shortName}</b></p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/acharyas#parampara" className="group/btn rounded-full"><CtaPill label={t("See the parampara")} /></Link>
            <Link href={founder ? "/founder" : "/acharyas#acharyas"} className="group/btn rounded-full bg-[#0F1E4A] lg:bg-white/5">
              <CtaPill label={founder ? t("Our Founder-Acharya") : t("All acharyas")} variant="ghost" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ══ QUICK FACTS ══ one floating bar across the foot of the hero */
function Facts({ a }: { a: Acharya }) {
  const { acharyaBySlug } = useAcharyaData();
  const t = useT();
  const guru = a.lineage?.guru ? acharyaBySlug(a.lineage.guru) : undefined;
  const items = [
    a.appearance && { icon: CalendarDays, label: t("Appearance"), value: a.appearance.date ?? "—", sub: a.appearance.place },
    a.disappearance && { icon: CalendarDays, label: t("Disappearance"), value: a.disappearance.date ?? "—", sub: a.disappearance.place },
    guru
      ? { icon: Users, label: t("Guru"), value: guru.shortName, href: `/acharyas/${guru.slug}` }
      : { icon: Flower2, label: t("Sampradaya"), value: a.sampradaya },
    { icon: Layers, label: t("Category"), value: t(a.category), href: "/acharyas#acharyas" },
  ].filter(Boolean) as { icon: typeof CalendarDays; label: string; value: string; sub?: string; href?: string }[];
  return (
    <div className="vk-container relative z-10 lg:-mt-16">
      <Rise className="mx-auto max-w-6xl">
        <ul className={`grid grid-cols-2 overflow-hidden rounded-[1.4rem] bg-white shadow-[0_30px_60px_-30px_rgba(15,30,74,.55)] ${items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {items.map((f, i) => {
            const body = (
              <>
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A87A1E] md:text-[10.5px]"><f.icon aria-hidden className="h-3.5 w-3.5 shrink-0" />{f.label}</p>
                <p className="mt-1.5 break-words font-heading text-[14.5px] font-bold leading-snug text-[#0F1E4A] md:text-[17px]">{f.value}</p>
                {f.sub && <p className="mt-1 text-[11.5px] leading-[1.45] text-[#0F1E4A]/55 md:text-[12.5px]">{f.sub}</p>}
                {f.href && <span className="mt-1.5 inline-flex items-center gap-1 text-[11.5px] font-bold text-[#1E3A8A]">{t("View")} <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" /></span>}
              </>
            );
            const cls = `block h-full min-w-0 p-4 md:p-5 ${i % 2 ? "border-l border-[#F1E8D3]" : ""} ${i > 1 ? "border-t border-[#F1E8D3] lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`;
            return (
              <li key={f.label} className="min-w-0">
                {f.href ? <Link href={f.href} className={`group transition hover:bg-[#FBF7EE] ${cls}`}>{body}</Link> : <div className={cls}>{body}</div>}
              </li>
            );
          })}
        </ul>
      </Rise>
    </div>
  );
}

/* ══ LONG-FORM: biography with chapter headings and a drop cap ══ */
function Biography({ blocks }: { blocks: Block[] }) {
  const t = useT();
  const ch = chapters(blocks);
  const firstCh = ch.findIndex((c) => c.ps.length > 0);
  const long = blocks.length > 12;
  const [open, setOpen] = useState(false);
  return (
    <div>
      {/* the whole text is always in the page (for readers and search); a long life folds after its opening chapters */}
      <div className={`relative space-y-8 ${long && !open ? "max-h-[1500px] overflow-hidden" : ""}`}>
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
        {long && !open && <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#FBF7EE] via-[#FBF7EE]/90 to-transparent" />}
      </div>
      {long && (
        <div className="mt-6 flex justify-center">
          <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="group/btn rounded-full">
            <CtaPill label={open ? t("Show less") : t("Read the full biography")} />
          </button>
        </div>
      )}
    </div>
  );
}

/** Teachings or qualities: numbered cards when long-form, an illuminated panel when it is a single statement. */
/** One numbered teaching/quality: number + title, the text clamped to three lines with a "Read more" toggle. */
function PrincipleItem({ n, title, ps, dark, delay }: { n: string; title: string; ps: string[]; dark: boolean; delay: number }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const long = ps.join(" ").length > 180;
  const sub = dark ? "text-[#FBF7EE]/72" : "text-[#0F1E4A]/70";
  return (
    <Rise as="li" delay={delay} className={`min-w-0 rounded-2xl p-5 md:p-6 ${dark ? "bg-white/[.06] text-[#FBF7EE] ring-1 ring-inset ring-white/10" : "bg-white text-[#0F1E4A] shadow-[0_18px_40px_-30px_rgba(15,30,74,.6)]"}`}>
      <div className="flex items-start gap-3.5">
        <span className="font-heading text-[1.6rem] font-bold leading-none text-[#F6C752]">{n.padStart(2, "0")}</span>
        <h3 className="min-w-0 pt-0.5 font-heading text-[16.5px] font-bold leading-snug md:text-[18px]">{title}</h3>
      </div>
      <div className={`mt-3 space-y-2 text-[14.5px] leading-[1.75] ${sub} ${long && !open ? "line-clamp-3" : ""}`}>
        {ps.map((p, k) => <p key={k} className={long && !open ? "inline" : ""}>{p}{long && !open && k < ps.length - 1 ? " " : ""}</p>)}
      </div>
      {long && (
        <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}
          className={`mt-2 inline-flex min-h-9 items-center gap-1 text-[12px] font-bold uppercase tracking-[0.12em] ${dark ? "text-[#F6C752]" : "text-[#1E3A8A]"}`}>
          {open ? t("Show less") : t("Read more")} <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      )}
    </Rise>
  );
}

function Principles({ blocks, chips, dark = false }: { blocks: Block[]; chips?: boolean; dark?: boolean }) {
  const list = chips ? asList(blocks) : null;
  if (list)
    return (
      <Rise as="div">
        <ul className="flex flex-wrap justify-center gap-2.5">
          {list.map((q) => (
            <li key={q} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13.5px] font-semibold text-[#0F1E4A] shadow-[0_12px_26px_-18px_rgba(15,30,74,.7)]">
              <Sparkles aria-hidden className="h-3.5 w-3.5 shrink-0 text-[#C9962B]" />{q}
            </li>
          ))}
        </ul>
      </Rise>
    );
  const ch = chapters(blocks);
  const ink = dark ? "text-[#FBF7EE]" : "text-[#0F1E4A]";
  if (ch.length === 1 && !ch[0].h)
    return (
      <Rise className="mx-auto max-w-3xl text-left md:text-center">
        <p aria-hidden className="font-heading text-7xl leading-[.5] text-[#F6C752]">&ldquo;</p>
        {ch[0].ps.map((p, k) => <p key={k} className={`mt-4 font-heading text-[1.3rem] leading-[1.6] md:text-[1.75rem] ${ink}`}>{p}</p>)}
      </Rise>
    );
  const intro = ch.filter((c) => isIntro(c.h));
  const rest = ch.filter((c) => !isIntro(c.h));
  return (
    <div>
      {intro.map((c, i) => (
        <Rise key={i} className="mx-auto mb-8 max-w-3xl space-y-4 text-left md:text-center">
          {c.ps.map((p, k) => <p key={k} className={`font-heading text-[17px] leading-[1.7] md:text-[19px] ${dark ? "text-[#FBF7EE]/85" : "text-[#0F1E4A]"}`}>{p}</p>)}
        </Rise>
      ))}
      <ol className="grid gap-3 md:grid-cols-2 md:gap-4">
        {rest.map((c, i) => {
          const [n, title] = numbered(c.h ?? "") ?? [String(i + 1), c.h ?? ""];
          return <PrincipleItem key={i} n={n} title={title} ps={c.ps} dark={dark} delay={(i % 2) * 0.06} />;
        })}
      </ol>
    </div>
  );
}

function Timeline({ a }: { a: Acharya }) {
  const t = useT();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const grow = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.4 });
  return (
    <ol ref={ref} className="relative">
      <span aria-hidden className="absolute bottom-3 left-[11px] top-3 w-[2px] rounded-full bg-[#E7DCC3]" />
      <motion.span aria-hidden style={reduce ? undefined : { scaleY: grow }} className="absolute bottom-3 left-[11px] top-3 w-[2px] origin-top rounded-full bg-gradient-to-b from-[#F6C752] via-[#C9962B] to-[#A87A1E]" />
      {a.timeline.map((e, i) => (
        <Rise as="li" key={i} className="relative pb-8 pl-10 last:pb-0">
          <motion.span aria-hidden initial={reduce ? false : { scale: 0.5, opacity: 0.4 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, margin: "-35% 0px -45% 0px" }} transition={{ duration: 0.5, ease }}
            className="absolute left-[3px] top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-[#F6C752] to-[#C9962B] shadow-[0_0_16px_2px_rgba(246,199,82,.55)]">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </motion.span>
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

/** Guru → this acharya → disciple, as linked portrait cards (stacked on phones). */
function Lineage({ a }: { a: Acharya }) {
  const { acharyaBySlug } = useAcharyaData();
  const t = useT();
  const guru = a.lineage?.guru ? acharyaBySlug(a.lineage.guru) : undefined;
  const disciple = a.lineage?.disciple ? acharyaBySlug(a.lineage.disciple) : undefined;
  const chain = [guru && { label: t("Guru"), x: guru }, { label: t("This acharya"), x: a, self: true }, disciple && { label: t("Disciple"), x: disciple }]
    .filter(Boolean) as { label: string; x: Acharya; self?: boolean }[];
  return (
    <ol className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
      {chain.map(({ label, x, self }, k) => {
        const card = (
          <span className={`flex h-full items-center gap-3.5 rounded-2xl p-3 ${self ? "bg-[#0F1E4A] text-[#FBF7EE]" : "bg-white text-[#0F1E4A] shadow-[0_18px_40px_-30px_rgba(15,30,74,.7)] transition group-hover:-translate-y-0.5 group-hover:shadow-[0_24px_50px_-28px_rgba(15,30,74,.8)]"}`}>
            <span className="relative h-[72px] w-[58px] shrink-0 overflow-hidden rounded-xl">
              <Image src={x.portrait} alt={`Portrait of ${x.name}`} fill sizes="58px" className="object-cover object-top" />
            </span>
            <span className="min-w-0">
              <span className={`text-[10px] font-bold uppercase tracking-[0.18em] ${self ? "text-[#F6C752]" : "text-[#A87A1E]"}`}>{label}</span>
              <span className="mt-0.5 block font-heading text-[14.5px] font-bold leading-snug">{x.shortName}</span>
              {x.years && <span className={`mt-0.5 block text-[11.5px] ${self ? "text-white/60" : "text-[#0F1E4A]/55"}`}>{x.years}</span>}
            </span>
          </span>
        );
        return (
          <li key={x.slug} className="contents">
            {k > 0 && (
              <span aria-hidden className="flex justify-center text-[#C9962B] md:px-1">
                <ArrowDown className="h-5 w-5 md:hidden" /><ArrowRight className="hidden h-5 w-5 md:block" />
              </span>
            )}
            <Rise className="min-w-0 md:flex-1">
              {self ? card : <Link href={`/acharyas/${x.slug}`} className="group block h-full">{card}</Link>}
            </Rise>
          </li>
        );
      })}
    </ol>
  );
}

const COVERS = ["from-[#1E3A8A] to-[#0A1233]", "from-[#0F1E4A] to-[#2F5BD3]", "from-[#7A1F2B] to-[#3A0D14]", "from-[#14532D] to-[#062016]", "from-[#A87A1E] to-[#5C3F0B]"];
/** Books on a shelf: book-cover cards in a row you can scroll. */
function Books({ a }: { a: Acharya }) {
  const t = useT();
  return (
    <div>
      <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 pt-1 [scrollbar-width:thin] md:mx-0 md:px-0">
        {a.books.map((b, i) => (
          <li key={b.title} className="w-[150px] shrink-0 snap-start sm:w-[168px]">
            <div className={`relative flex aspect-[2/3] flex-col overflow-hidden rounded-l-[4px] rounded-r-[10px] bg-gradient-to-br ${COVERS[i % COVERS.length]} p-3 text-center text-[#FBF7EE] shadow-[6px_10px_20px_-8px_rgba(15,30,74,.6),inset_6px_0_0_rgba(0,0,0,.25)]`}>
              <span aria-hidden className="absolute inset-y-0 left-[6px] w-px bg-white/20" />
              <span aria-hidden className="absolute inset-[10px] left-[14px] rounded-sm border border-[#F6C752]/45" />
              <BookOpen aria-hidden className="relative mx-auto mt-4 h-4 w-4 text-[#F6C752]" />
              <h3 className="relative mt-auto break-words px-1 font-heading text-[13.5px] font-bold leading-tight sm:text-[14.5px]">{b.title}</h3>
              <span aria-hidden className="relative mx-auto mt-2 h-px w-8 bg-[#F6C752]/70" />
              <p className="relative mb-3 mt-2 min-h-[14px] text-[10.5px] font-bold text-[#F6C752]">{b.year ?? ""}</p>
            </div>
            {b.text && <p className="mt-3 line-clamp-4 text-[12.5px] leading-[1.55] text-[#0F1E4A]/70">{b.text}</p>}
          </li>
        ))}
      </ul>
      {a.books.length > 2 && <p className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-[#0F1E4A]/50">{t("Scroll the shelf")} <ArrowRight className="h-3.5 w-3.5" /></p>}
    </div>
  );
}

function PastimeCard({ p }: { p: Pastime }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  return (
    <Rise as="li" className="min-w-0 overflow-hidden rounded-[1.4rem] bg-white ring-1 ring-[#E7DCC3]">
      <div className="relative aspect-[16/9] bg-[#0F1E4A]">
        <Image src={p.image} alt={`${p.title}: a pastime of Srila Prabhupada`} fill sizes="(min-width: 768px) 360px, 100vw" className="object-cover" />
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

/**
 * Section navigation that never reads as a second header:
 * - wide screens: a slim rail of gold dots fixed at the right edge; the active dot glows and shows its label;
 * - phones/tablets: a small white floating pill of chips under the site header, shown once past the hero while
 *   scrolling up (hidden while scrolling down), with the active chip auto-centred.
 */
function SectionNav({ sections, startId }: { sections: { id: string; label: string }[]; startId: string }) {
  const t = useT();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(sections[0]?.id);
  const [past, setPast] = useState(false);
  const [up, setUp] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-35% 0px -60% 0px" });
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    const onScroll = () => {
      const y = window.scrollY;
      const start = document.getElementById(startId);
      const endEl = document.getElementById(sections[sections.length - 1]?.id ?? "");
      const top = start ? start.getBoundingClientRect().top : 1;
      const bottom = endEl ? endEl.getBoundingClientRect().bottom : 1;
      setPast(top < 80 && bottom > 120);
      if (Math.abs(y - lastY.current) > 6) { setUp(y < lastY.current); lastY.current = y; }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, [sections, startId]);
  useEffect(() => {
    const chip = bar.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    const b = bar.current;
    if (chip && b) b.scrollTo({ left: chip.offsetLeft - b.clientWidth / 2 + chip.clientWidth / 2, behavior: reduce ? "auto" : "smooth" });
  }, [active, up, reduce]);
  const showPill = past && up;
  return (
    <>
      {/* wide screens: the rail */}
      <nav aria-label={t("On this page")}
        className={`fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-500 xl:block ${past ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <ul className="flex flex-col gap-1 rounded-full bg-white/95 px-2 py-3 shadow-[0_18px_40px_-18px_rgba(15,30,74,.45)] ring-1 ring-[#C9962B]/25 backdrop-blur">
          {sections.map((s) => {
            const on = active === s.id;
            return (
              <li key={s.id} className="relative">
                <a href={`#${s.id}`} aria-current={on ? "true" : undefined} className="group relative flex h-7 w-7 items-center justify-center">
                  {on && <motion.span layoutId="acharya-rail" transition={{ type: "spring", stiffness: 420, damping: 34 }} className="absolute inset-0 rounded-full bg-[#0F1E4A]" />}
                  <span className={`relative h-2 w-2 rounded-full transition ${on ? "bg-[#F6C752] shadow-[0_0_10px_3px_rgba(246,199,82,.7)]" : "bg-[#0F1E4A]/25 group-hover:bg-[#C9962B]"}`} />
                  <span className={`pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full px-3 py-1 text-[12px] font-semibold shadow-[0_8px_20px_-10px_rgba(15,30,74,.5)] transition ${on ? "bg-[#0F1E4A] text-[#F6C752] opacity-100" : "bg-white text-[#0F1E4A] opacity-0 group-hover:opacity-100"}`}>
                    {s.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* phones and tablets: a solid white strip snug under the header (shown when scrolling up) */}
      <AnimatePresence>
        {showPill && (
          <motion.nav aria-label={t("On this page")} initial={reduce ? false : { opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }} transition={{ duration: 0.25, ease }}
            className="fixed inset-x-0 top-[var(--header-h)] z-40 bg-white shadow-[0_10px_24px_-14px_rgba(15,30,74,.45)] before:absolute before:inset-x-0 before:bottom-full before:h-[var(--header-h)] before:bg-white xl:hidden">
            <div className="relative mx-auto max-w-3xl">
              <div ref={bar} className="flex h-12 items-center gap-1 overflow-x-auto px-3 pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {sections.map((s) => {
                  const on = active === s.id;
                  return (
                    <a key={s.id} data-id={s.id} href={`#${s.id}`} aria-current={on ? "true" : undefined}
                      className={`relative flex h-9 shrink-0 items-center rounded-full px-3.5 text-[12.5px] font-semibold transition-colors ${on ? "text-[#F6C752]" : "text-[#0F1E4A]/70"}`}>
                      {on && <motion.span layoutId="acharya-pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} className="absolute inset-0 rounded-full bg-[#0F1E4A]" />}
                      <span className="relative">{s.label}</span>
                    </a>
                  );
                })}
              </div>
              <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

/** A full-width band holding one section; its title sits centred over the content. */
function Band({ id, kicker, label, tone, wide = false, children }: { id: string; kicker: string; label: string; tone: "ivory" | "white" | "ink"; wide?: boolean; children: React.ReactNode }) {
  const bg = tone === "ink" ? "relative isolate overflow-hidden bg-[#0A1233]" : tone === "white" ? "bg-white" : "";
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={`${anchor} py-14 md:py-20 ${bg}`}>
      {tone === "ink" && <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_15%_0%,rgba(47,91,211,.45),transparent_70%),radial-gradient(40%_50%_at_100%_100%,rgba(201,150,43,.2),transparent_70%)]" />}
      <div className="vk-container">
        <div className={`mx-auto ${wide ? "max-w-6xl" : "max-w-3xl"}`}>
          <div className="mb-8 text-center md:mb-10">
            <p className={`text-[11px] font-bold uppercase tracking-[0.26em] ${tone === "ink" ? "text-[#F6C752]" : "text-[#A87A1E]"}`}>{kicker}</p>
            <h2 id={`${id}-heading`} className={`mt-2 font-heading text-[1.85rem] font-bold leading-tight md:text-[2.6rem] ${tone === "ink" ? "text-[#FBF7EE]" : "text-[#0F1E4A]"}`}>{label}</h2>
            <Divider className="mt-4" />
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

/* ══ PAGE ══ */
export default function AcharyaView({ a }: { a: Acharya }) {
  const { ACHARYAS } = useAcharyaData();
  const t = useT();
  useEffect(() => { scrollToTopNow(); }, [a.slug]);
  const i = ACHARYAS.findIndex((x) => x.slug === a.slug);
  const prev = ACHARYAS[(i - 1 + ACHARYAS.length) % ACHARYAS.length];
  const next = ACHARYAS[(i + 1) % ACHARYAS.length];
  const more = [...ACHARYAS.filter((x) => x.category === a.category && x.slug !== a.slug), ...ACHARYAS.filter((x) => x.category !== a.category)].slice(0, 4);
  const traits = asList(a.qualities);

  const sections = useMemo(() => [
    { id: "biography", label: t("Biography"), kicker: t("His life"), tone: "ivory" as const, show: a.biography.length > 0, body: <Biography blocks={a.biography} /> },
    { id: "teachings", label: t("Teachings"), kicker: t("His instructions"), tone: "ink" as const, wide: true, show: a.teachings.length > 0, body: <Principles blocks={a.teachings} dark /> },
    { id: "qualities", label: t("Qualities"), kicker: t("His character"), tone: "ivory" as const, wide: true, show: a.qualities.length > 0 && !traits, body: <Principles blocks={a.qualities} /> },
    { id: "timeline", label: t("Timeline"), kicker: t("Through the years"), tone: "white" as const, show: a.timeline.length > 0, body: <Timeline a={a} /> },
    { id: "lineage", label: t("Lineage"), kicker: t("Disciplic succession"), tone: "ivory" as const, wide: true, show: !!a.lineage, body: <Lineage a={a} /> },
    { id: "books", label: t("Books"), kicker: t("His writings"), tone: "white" as const, wide: true, show: a.books.length > 0, body: <Books a={a} /> },
    { id: "pastimes", label: t("Pastimes"), kicker: t("Stories of his life"), tone: "ivory" as const, wide: true, show: !!a.pastimes?.length, body: <ul className="grid gap-5 sm:grid-cols-2">{a.pastimes?.map((p) => <PastimeCard key={p.title} p={p} />)}</ul> },
  ].filter((s) => s.show), [a, t, traits]);

  return (
    <PageLayout background={IVORY}>
      <div className="overflow-x-clip pt-[var(--header-h)]" style={{ background: IVORY }}>
        <Hero a={a} />
        <Facts a={a} />

        {/* the essence: summary as a pull-quote, with the qualities as chips beneath */}
        <section className="vk-container pb-6 pt-14 md:pt-20">
          <Rise className="mx-auto max-w-3xl text-left md:text-center">
            <p aria-hidden className="font-heading text-[5rem] leading-[.45] text-[#C9962B]/80">&ldquo;</p>
            <p className="mt-6 font-heading text-[1.35rem] font-semibold leading-[1.5] text-[#0F1E4A] md:text-[2rem] md:leading-[1.45]">{a.summary}</p>
          </Rise>
          {traits && <div className="mx-auto mt-8 max-w-3xl"><Principles blocks={a.qualities} chips /></div>}
        </section>

        <div id="acharya-sections" className="mt-8">
          <SectionNav sections={sections} startId="acharya-sections" />
          {sections.map((s) => (
            <Band key={s.id} id={s.id} kicker={s.kicker} label={s.label} tone={s.tone} wide={"wide" in s ? s.wide : false}>{s.body}</Band>
          ))}
        </div>

        {/* ══ CONTINUE ══ previous / next and more acharyas */}
        <section className="border-t border-[#E7DCC3] bg-white py-14 md:py-20">
          <div className="vk-container">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
                {[prev, next].map((x, k) => (
                  <Link key={x.slug} href={`/acharyas/${x.slug}`} className="group relative isolate block h-44 overflow-hidden rounded-[1.4rem] shadow-[0_26px_50px_-30px_rgba(15,30,74,.8)] md:h-56">
                    <Image src={x.banner} alt={`Painting of ${x.name}`} fill sizes="(min-width: 640px) 50vw, 100vw" className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(10,18,51,.88)_0%,rgba(10,18,51,.45)_40%,transparent_70%)]" />
                    <span className={`absolute inset-x-0 bottom-0 flex items-end gap-3 p-4 text-[#FBF7EE] [text-shadow:0_1px_10px_rgba(0,0,0,.5)] md:p-5 ${k ? "flex-row-reverse text-right" : ""}`}>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F6C752] text-[#0F1E4A] transition-transform duration-300 group-hover:scale-110">
                        {k ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#F6C752]">{k ? t("Next acharya") : t("Previous acharya")}</span>
                        <span className="mt-1 block font-heading text-[17px] font-bold leading-snug md:text-[20px]">{x.name}</span>
                      </span>
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
                      <Portrait src={x.portrait} alt={x.name} sizes="(min-width: 1024px) 270px, 50vw" className="rounded-[1.25rem] shadow-[0_24px_44px_-30px_rgba(15,30,74,.75)]" zoom />
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
