"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin, Search } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useT } from "@/components/i18n/LocaleProvider";
import type { Temple, TempleRegion } from "@/lib/templesData";
import { Eyebrow, HERO_BG, IVORY, Stars, TempleArt } from "./parts";

export type TempleCardData = Pick<Temple, "slug" | "name" | "shortName" | "teluguName" | "deity" | "form" | "town" | "district" | "region" | "summary" | "fromVizag"> & {
  photo?: string; // our /api/place-photo URL
  rating?: number;
  ratingCount?: number;
};

const REGIONS: TempleRegion[] = ["North Coastal Andhra", "Godavari Districts", "Krishna & Guntur", "Rayalaseema"];
const ease = [0.22, 0.8, 0.3, 1] as const;

function Card({ c, i }: { c: TempleCardData; i: number }) {
  const t = useT();
  const reduce = useReducedMotion();
  return (
    <motion.li initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, ease, delay: (i % 3) * 0.06 }}>
      <Link href={`/temples/${c.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] bg-white shadow-[0_24px_50px_-34px_rgba(15,30,74,.6)] ring-1 ring-[#E7DCC3] transition duration-500 hover:-translate-y-1 hover:ring-[#C9962B]/70">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#0F1E4A]">
          {c.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.photo} alt={c.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          ) : (
            <TempleArt telugu={c.teluguName} form={c.form} />
          )}
          <span className="absolute left-3 top-3 rounded-full bg-[#0F1E4A]/80 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-[#F6E3B0] backdrop-blur">{t(c.region)}</span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#A87A1E]">{c.form}</p>
          <h3 className="mt-1.5 font-heading text-lg font-bold leading-snug text-[#0F1E4A]">{c.shortName}</h3>
          <p className="mt-0.5 text-[13px] font-semibold text-[#0F1E4A]/70">{c.deity}</p>
          <p className="mt-2 flex items-center gap-1 text-[12.5px] text-[#0F1E4A]/55"><MapPin className="h-3.5 w-3.5" />{c.town}, {c.district}</p>
          <p className="mt-3 line-clamp-2 text-[13.5px] leading-6 text-[#0F1E4A]/70">{c.summary}</p>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#E7DCC3] pt-4">
            {c.rating ? <Stars rating={c.rating} count={c.ratingCount} /> : <span className="text-[12.5px] font-semibold text-[#0F1E4A]/50">{t("Timings, history & how to reach")}</span>}
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F1E4A] text-[#F6C752] transition group-hover:rotate-45"><ArrowUpRight className="h-4 w-4" /></span>
          </div>
        </div>
      </Link>
    </motion.li>
  );
}

export default function TemplesList({ temples }: { temples: TempleCardData[] }) {
  const t = useT();
  const [region, setRegion] = useState<TempleRegion | "all">("all");
  const [q, setQ] = useState("");
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return temples.filter((c) => (region === "all" || c.region === region) && (!s || `${c.name} ${c.shortName} ${c.deity} ${c.town} ${c.district} ${c.teluguName}`.toLowerCase().includes(s)));
  }, [temples, region, q]);

  return (
    <PageLayout background={IVORY}>
      <div className="overflow-x-clip pt-[var(--header-h)]" style={{ background: IVORY }}>
        {/* ══ HERO ══ */}
        <section className="relative isolate overflow-hidden pb-24 pt-12 text-center md:pb-28 md:pt-16" style={{ background: HERO_BG }}>
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(55%_70%_at_50%_100%,rgba(47,91,211,.5),transparent_75%),radial-gradient(35%_45%_at_50%_0%,rgba(201,150,43,.14),transparent_70%)]" />
          <div className="vk-container">
            <Eyebrow light center>{t("Pilgrimage guide")}</Eyebrow>
            <h1 className="mx-auto mt-4 max-w-4xl font-heading text-[2.3rem] font-bold leading-[1.05] tracking-tight text-[#FBF7EE] md:text-[4rem]">{t("Vaishnava Temples of Andhra Pradesh")}</h1>
            <p className="mx-auto mt-5 max-w-2xl text-[15.5px] leading-8 text-white/70 md:text-[17px]">
              {t("The holy places of Lord Vishnu across Andhra Pradesh, from Simhachalam near Vizag to Tirumala and Ahobilam: their history, darshan timings and how to reach them.")}
            </p>
          </div>
        </section>

        {/* ══ FILTERS (overlapping the hero) ══ */}
        <section className="relative -mt-12">
          <div className="vk-container">
            <div className="mx-auto flex max-w-5xl flex-col gap-3 rounded-[1.4rem] bg-white p-3 shadow-[0_30px_60px_-36px_rgba(15,30,74,.7)] ring-1 ring-[#E7DCC3] md:flex-row md:items-center md:p-4">
              <label className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0F1E4A]/40" />
                <span className="sr-only">{t("Search temples")}</span>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Search a temple, deity or town")}
                  className="w-full rounded-xl bg-[#FBF7EE] py-3 pl-10 pr-3 text-[14px] text-[#0F1E4A] outline-none ring-1 ring-[#E7DCC3] placeholder:text-[#0F1E4A]/40 focus:ring-[#C9962B]" />
              </label>
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:pb-0">
                {(["all", ...REGIONS] as const).map((r) => (
                  <button key={r} type="button" onClick={() => setRegion(r)}
                    className={`shrink-0 rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition ${region === r ? "bg-[#0F1E4A] text-[#F6E3B0]" : "bg-[#FBF7EE] text-[#0F1E4A]/75 ring-1 ring-[#E7DCC3] hover:ring-[#C9962B]"}`}>
                    {r === "all" ? t("All regions") : t(r)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ TEMPLES ══ */}
        <section className="py-12 md:py-16">
          <div className="vk-container">
            <p className="mx-auto mb-6 max-w-6xl text-[13px] font-semibold text-[#0F1E4A]/55">{shown.length} {t("temples")}</p>
            <ul className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {shown.map((c, i) => <Card key={c.slug} c={c} i={i} />)}
            </ul>
            {shown.length === 0 && <p className="py-16 text-center text-[#0F1E4A]/60">{t("No temple matches your search.")}</p>}
          </div>
        </section>

        {/* ══ OUR TEMPLE ══ */}
        <section className="pb-16 md:pb-24">
          <div className="vk-container">
            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[1.8rem] px-6 py-10 text-white md:px-12 md:py-14" style={{ background: HERO_BG }}>
              <div aria-hidden className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(246,199,82,.25),transparent)]" />
              <Eyebrow light>{t("In Visakhapatnam")}</Eyebrow>
              <h2 className="mt-4 max-w-2xl font-heading text-2xl font-bold leading-tight md:text-4xl">{t("Begin your pilgrimage with darshan at ISKCON Vizag")}</h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/70">{t("Sri Sri Radha Madan Mohan await you at Gambheeram, with daily aartis, kirtan and prasadam.")}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/iskcon-vizag-temple" className="inline-flex items-center gap-2 rounded-full bg-[#F6C752] px-6 py-3 text-sm font-bold text-[#0F1E4A] hover:bg-[#FFD777]">{t("Plan your visit")} <ArrowUpRight className="h-4 w-4" /></Link>
                <Link href="/anna-daan-seva" className="inline-flex items-center rounded-full px-6 py-3 text-sm font-bold text-white ring-1 ring-white/30 hover:ring-white">{t("Offer Anna Daan")}</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
