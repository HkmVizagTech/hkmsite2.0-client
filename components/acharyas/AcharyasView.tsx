"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, MapPin, Search, X } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useT } from "@/components/i18n/LocaleProvider";
import { ACHARYAS, ACHARYAS_PAINTING, CATEGORIES, PARAMPARA, acharyaBySlug, isPhoto, type Acharya, type AcharyaCategory } from "@/lib/acharyas";
import { Divider, Eyebrow, HaloPortrait, IVORY, Rise, ease } from "./shared";

const prabhupada = ACHARYAS.find((a) => a.featured) ?? ACHARYAS[0];
const MANTRA = "Hare Kṛṣṇa Hare Kṛṣṇa Kṛṣṇa Kṛṣṇa Hare Hare / Hare Rāma Hare Rāma Rāma Rāma Hare Hare";

/* ══ HERO ══ the acharyas' group painting as a wide framed panorama on ivory; on phones it slowly pans across ══ */
function Hero() {
  const t = useT();
  const reduce = useReducedMotion();
  return (
    <section className="relative isolate overflow-hidden pb-14 pt-10 md:pb-20 md:pt-16">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(246,199,82,.20),transparent_70%),radial-gradient(50%_40%_at_100%_60%,rgba(47,91,211,.08),transparent_70%)]" />
      <div className="vk-container">
        <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="mx-auto max-w-3xl text-center">
          <Eyebrow center>{t("Disciplic succession")}</Eyebrow>
          <h1 className="mt-5 font-heading text-[2.7rem] font-bold leading-[1.02] tracking-tight text-[#0F1E4A] min-[380px]:text-[3.1rem] md:text-[5.4rem]">
            {t("Our")}{" "}
            <span className="bg-gradient-to-br from-[#C9962B] via-[#E7B847] to-[#A87A1E] bg-clip-text text-transparent">{t("Acharyas")}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-[#0F1E4A]/70 md:text-[17px] md:leading-8">
            {t("The spiritual teachers through whom the teachings of Lord Chaitanya have come down to us: their lives, their instructions, their books and their pastimes.")}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="#acharyas" className="group inline-flex items-center gap-2 rounded-full bg-[#0F1E4A] px-6 py-3 text-sm font-bold text-[#FBF7EE] shadow-[0_14px_30px_-14px_rgba(15,30,74,.8)] transition hover:bg-[#1E3A8A]">
              {t("Meet the acharyas")} <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </a>
            <a href="#parampara" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0F1E4A] ring-1 ring-[#C9962B]/50 transition hover:ring-[#C9962B]">
              {t("See the parampara")}
            </a>
          </div>
        </motion.div>

        <motion.figure initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.2, ease, delay: 0.15 }}
          className="relative mx-auto mt-10 max-w-6xl md:mt-14">
          {/* gold double frame */}
          <div className="rounded-[1.6rem] bg-gradient-to-br from-[#F6C752] via-[#C9962B] to-[#A87A1E] p-[3px] shadow-[0_40px_80px_-40px_rgba(15,30,74,.65)] md:rounded-[2.2rem]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.45rem] bg-[#0F1E4A] min-[480px]:aspect-[16/9] md:aspect-[1526/375] md:rounded-[2.05rem]">
              <Image src={ACHARYAS_PAINTING} alt={t("A painting of Srila Prabhupada and the acharyas before him seated in a riverside garden")} fill priority quality={90}
                sizes="(min-width: 1152px) 1152px, 100vw"
                className={`object-cover object-[30%_50%] md:object-center ${reduce ? "" : "max-md:animate-[acharya-pan_38s_ease-in-out_infinite_alternate]"}`} />
              <span aria-hidden className="pointer-events-none absolute inset-[7px] rounded-[1.1rem] ring-1 ring-inset ring-[#FFE6A3]/45 md:inset-[10px] md:rounded-[1.7rem]" />
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0A1233]/75 to-transparent" />
              <figcaption className="absolute inset-x-4 bottom-4 text-[11.5px] font-semibold leading-snug text-[#FBF7EE]/90 md:inset-x-8 md:bottom-6 md:text-[13px]">
                {t("Srila Prabhupada and the acharyas before him")}
              </figcaption>
            </div>
          </div>
        </motion.figure>

        <Rise className="mx-auto mt-10 grid max-w-3xl grid-cols-3 divide-x divide-[#E7DCC3] text-center md:mt-12">
          {[
            [String(ACHARYAS.length), t("Acharyas")],
            [String(CATEGORIES.length), t("Categories")],
            [String(PARAMPARA.length), t("Generations")],
          ].map(([n, l]) => (
            <div key={l} className="min-w-0 px-2">
              <p className="font-heading text-3xl font-bold leading-none text-[#0F1E4A] md:text-[2.6rem]">{n}</p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A87A1E] md:text-[11px] md:tracking-[0.2em]">{l}</p>
            </div>
          ))}
        </Rise>
      </div>
    </section>
  );
}

/* ══ FOUNDER-ACHARYA ══ a deep-blue feature; the portrait stands in a gold frame with light behind it ══ */
function Feature() {
  const t = useT();
  const a = prabhupada;
  return (
    <section className="relative isolate overflow-hidden bg-[#0A1233] py-16 text-[#FBF7EE] md:py-24">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(45%_60%_at_25%_40%,rgba(47,91,211,.45),transparent_70%),radial-gradient(40%_50%_at_90%_100%,rgba(201,150,43,.18),transparent_70%),linear-gradient(160deg,#0F1E4A,#0A1233)]" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F6C752]/60 to-transparent" />
      <div className="vk-container">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
          <Rise className="relative mx-auto w-full max-w-[300px] min-[400px]:max-w-[340px] lg:max-w-[420px]">
            <div aria-hidden className="absolute -inset-6 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(246,199,82,.28),transparent)] blur-2xl" />
            <div aria-hidden className="absolute -right-3 -top-3 bottom-3 left-3 rounded-[2rem] ring-1 ring-[#F6C752]/40 md:-right-4 md:-top-4" />
            <Link href={`/acharyas/${a.slug}`} className="group block">
              <HaloPortrait src={a.portrait} alt={a.name} halo={!isPhoto(a)} sizes="(min-width: 1024px) 420px, 340px" className="rounded-[2rem] shadow-[0_40px_70px_-30px_rgba(0,0,0,.8)]" zoom />
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
              <Link href={`/acharyas/${a.slug}`} className="group inline-flex items-center gap-2 rounded-full bg-[#F6C752] px-6 py-3 text-sm font-bold text-[#0F1E4A] transition hover:bg-[#FFE6A3]">
                {t("Read his life")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/founder" className="inline-flex items-center rounded-full px-6 py-3 text-sm font-bold text-[#FBF7EE] ring-1 ring-white/25 transition hover:ring-white/60">
                {t("Our Founder-Acharya")}
              </Link>
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}

/* ══ PARAMPARA ══ guru to disciple, generation by generation, on a gold line that draws itself as you scroll ══ */
function Parampara() {
  const t = useT();
  const reduce = useReducedMotion();
  return (
    <section id="parampara" className="scroll-mt-[calc(var(--header-h)+8px)] py-16 md:py-24" style={{ background: IVORY }}>
      <div className="vk-container">
        <Rise className="mx-auto max-w-2xl text-center">
          <Eyebrow center>{t("Disciplic succession")}</Eyebrow>
          <h2 className="mt-4 font-heading text-[2rem] font-bold leading-tight text-[#0F1E4A] md:text-5xl">{t("The Parampara")}</h2>
          <p className="mt-4 text-[15px] leading-7 text-[#0F1E4A]/70 md:text-[16px]">
            {t("The disciplic succession, generation by generation, as the teaching has come down from guru to disciple. Each acharya's card names the teachers their line came through: the guru who initiated them, or a predecessor whose instruction they carried on.")}
          </p>
        </Rise>

        <ol className="relative mx-auto mt-12 max-w-4xl md:mt-16">
          {/* the line: left on phones, centred on desktop */}
          <span aria-hidden className="absolute bottom-6 left-[27px] top-6 w-px bg-[#E7DCC3] md:left-1/2 md:-translate-x-1/2" />
          <motion.span aria-hidden initial={reduce ? false : { scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 2.2, ease }}
            className="absolute bottom-6 left-[26px] top-6 w-[3px] origin-top rounded-full bg-gradient-to-b from-[#F6C752] via-[#C9962B] to-[#A87A1E] md:left-1/2 md:-translate-x-1/2" />
          {PARAMPARA.map((a, i) => {
            const guru = a.lineage?.guru ? acharyaBySlug(a.lineage.guru) : undefined;
            const right = i % 2 === 1;
            const last = i === PARAMPARA.length - 1;
            return (
              <li key={a.slug} className="relative grid grid-cols-[56px_1fr] gap-4 pb-10 last:pb-0 md:grid-cols-[1fr_88px_1fr] md:gap-0 md:pb-14">
                {/* node */}
                <div className="relative z-10 md:col-start-2 md:row-start-1 md:flex md:justify-center">
                  <Link href={`/acharyas/${a.slug}`} aria-label={a.name}
                    className={`relative block h-14 w-14 overflow-hidden rounded-full ring-[3px] ${last ? "ring-[#F6C752]" : "ring-white"} shadow-[0_0_0_6px_rgba(246,199,82,.18),0_12px_24px_-10px_rgba(15,30,74,.6)] md:h-[72px] md:w-[72px]`}>
                    <Image src={a.portrait} alt="" fill sizes="72px" className="object-cover object-top" />
                  </Link>
                </div>
                {/* desktop: the generation's numeral fills the empty side */}
                <div aria-hidden className={`hidden min-w-0 items-center md:row-start-1 md:flex ${right ? "md:col-start-1 md:justify-end md:pr-8" : "md:col-start-3 md:pl-8"}`}>
                  <span className="font-heading text-[5.5rem] font-bold leading-none text-[#C9962B]/15">{String(i + 1).padStart(2, "0")}</span>
                </div>
                {/* card */}
                <Rise className={`min-w-0 md:row-start-1 ${right ? "md:col-start-3 md:pl-8" : "md:col-start-1 md:pr-8 md:text-right"}`}>
                  <Link href={`/acharyas/${a.slug}`}
                    className={`group block rounded-2xl bg-white p-5 shadow-[0_24px_50px_-34px_rgba(15,30,74,.55)] ring-1 transition hover:-translate-y-0.5 hover:shadow-[0_30px_60px_-34px_rgba(15,30,74,.7)] md:p-6 ${last ? "ring-[#C9962B]/60" : "ring-[#E7DCC3] hover:ring-[#C9962B]/60"}`}>
                    <span className="inline-flex rounded-full bg-[#0F1E4A] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#F6C752]">
                      {t("Generation")} {i + 1}
                    </span>
                    <h3 className="mt-3 font-heading text-[18px] font-bold leading-snug text-[#0F1E4A] group-hover:text-[#1E3A8A] md:text-[21px]">{a.name}</h3>
                    <p className="mt-1.5 text-[13.5px] leading-6 text-[#0F1E4A]/65">{a.title}</p>
                    {a.years && <p className="mt-2 text-[12px] font-semibold text-[#A87A1E]">{a.years}</p>}
                    {guru && (
                      <p className={`mt-3 flex flex-wrap items-center gap-x-1.5 border-t border-[#F1E8D3] pt-3 text-[12.5px] text-[#0F1E4A]/70 ${right ? "" : "md:justify-end"}`}>
                        <span className="font-bold uppercase tracking-[0.14em] text-[#A87A1E]">{t("Guru")}:</span> {guru.shortName}
                      </p>
                    )}
                  </Link>
                </Rise>
              </li>
            );
          })}
        </ol>
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
      <Link href={`/acharyas/${a.slug}`} className="group block h-full">
        <div className="relative overflow-hidden rounded-[1.25rem] shadow-[0_26px_50px_-30px_rgba(15,30,74,.75)] ring-1 ring-[#E7DCC3] transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_34px_60px_-30px_rgba(15,30,74,.85)] group-hover:ring-[#C9962B] md:rounded-[1.5rem]">
          <HaloPortrait src={a.portrait} alt={a.name} halo={!isPhoto(a)} sizes="(min-width: 1280px) 300px, (min-width: 768px) 30vw, 50vw" className="rounded-[inherit]" zoom />
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[#081236] via-[#0A1640]/80 to-transparent" />
          <span className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#FBF7EE]/90 text-[#0F1E4A] opacity-0 shadow transition duration-300 group-hover:rotate-45 group-hover:opacity-100 max-md:hidden">
            <ArrowUpRight className="h-4 w-4" />
          </span>
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 md:p-5">
            <h3 className="break-words font-heading text-[13.5px] font-bold leading-tight text-white min-[380px]:text-[14.5px] sm:text-[16px] md:text-[18px]">{a.name}</h3>
            {a.years && <p className="mt-1 line-clamp-2 text-[10.5px] font-semibold text-[#F6C752] sm:text-[11.5px]">{a.years}</p>}
          </div>
        </div>
        <p className="mt-3 line-clamp-2 px-1 text-[12px] leading-[1.45] text-[#0F1E4A]/70 sm:text-[13px]">{a.title}</p>
        <span className="mt-2 inline-flex items-center gap-1 px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#A87A1E] transition group-hover:gap-2">
          {t("Read more")} <ArrowRight className="h-3 w-3" />
        </span>
      </Link>
    </motion.li>
  );
}

function AllAcharyas() {
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
