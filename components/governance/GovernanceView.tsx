"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useT } from "@/components/i18n/LocaleProvider";
import { COUNCIL, COUNCIL_BANNER, COUNCIL_BANNER_MOBILE, type CouncilMember } from "@/lib/governance";

/*
 * Governance, in the "ivory & ink" look (deliberately different from the Srila Prabhupada page's navy, rays and
 * arch): warm ivory paper, deep-ink serif type, hairline gold rules, and transparent portrait cut-outs that rise out
 * of their tiles.
 */
export const IVORY = "#FBF7EE";
export const INK = "#0F1E4A";
const ease = [0.22, 0.8, 0.3, 1] as const;

/** Small caps eyebrow with a gold hairline in front. */
export function Eyebrow({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <p className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-[#A87A1E] ${center ? "justify-center" : ""}`}>
      <span aria-hidden className="h-px w-8 bg-[#C9962B]" />
      {children}
      {center && <span aria-hidden className="h-px w-8 bg-[#C9962B]" />}
    </p>
  );
}

/** A cut-out portrait standing in front of an ink disc ringed with fine gold lines; the head rises above the disc. */
export function Medallion({ m, size, priority = false }: { m: CouncilMember; size: string; priority?: boolean }) {
  return (
    <div className="relative mx-auto aspect-square w-full">
      <svg aria-hidden viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        <circle cx="100" cy="112" r="88" fill="none" stroke="#C9962B" strokeOpacity=".35" strokeWidth=".6" />
        <circle cx="100" cy="112" r="94" fill="none" stroke="#C9962B" strokeOpacity=".2" strokeWidth=".5" strokeDasharray="1 3" />
      </svg>
      <div className="absolute inset-x-[9%] bottom-0 top-[18%] overflow-hidden rounded-full bg-[radial-gradient(80%_80%_at_50%_25%,#2A4BA8_0%,#14286A_55%,#0A1640_100%)] shadow-[0_30px_60px_-30px_rgba(15,30,74,.7)]" />
      {/* the cut-out is clipped only at the bottom, so the head can rise above the disc */}
      <div className="absolute inset-x-0 bottom-0 top-0 overflow-hidden" style={{ clipPath: "inset(0 0 0 0 round 0 0 50% 50%)" }}>
        <Image src={m.cutout} alt={m.name} fill priority={priority} sizes={size} className="object-contain object-bottom drop-shadow-[0_12px_18px_rgba(10,22,64,.35)]" />
      </div>
    </div>
  );
}

function CouncilCard({ m, i }: { m: CouncilMember; i: number }) {
  const t = useT();
  const reduce = useReducedMotion();
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, ease, delay: (i % 4) * 0.08 }}
    >
      <Link href={`/governance/${m.slug}`} className="group block">
        {/* tile with the cut-out rising out of its top edge */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-[radial-gradient(90%_70%_at_50%_15%,#2A4BA8_0%,#14286A_60%,#0A1640_100%)] shadow-[0_26px_50px_-30px_rgba(15,30,74,.75)] ring-1 ring-[#C9962B]/0 transition-all duration-500 group-hover:ring-[#C9962B]/70">
          <svg aria-hidden viewBox="0 0 100 125" className="absolute inset-0 h-full w-full"><circle cx="50" cy="52" r="34" fill="none" stroke="#F6C752" strokeOpacity=".22" strokeWidth=".4" /><circle cx="50" cy="52" r="40" fill="none" stroke="#F6C752" strokeOpacity=".12" strokeWidth=".3" strokeDasharray="1 2" /></svg>
          <div className="absolute inset-x-[6%] bottom-0 top-[10%] transition-transform duration-700 ease-out group-hover:scale-[1.04]" style={{ transformOrigin: "50% 100%" }}>
            <Image src={m.cutout} alt={m.name} fill sizes="(min-width: 1280px) 280px, (min-width: 768px) 30vw, 46vw" className="object-contain object-bottom drop-shadow-[0_14px_16px_rgba(5,10,30,.45)]" />
          </div>
          <span className="absolute right-3 top-3 rounded-full bg-[#FBF7EE]/95 px-2.5 py-1 text-[10.5px] font-bold text-[#0F1E4A] shadow">
            {m.years}+ {t("yrs")}
          </span>
        </div>
        <div className="px-1 pt-4">
          <h3 className="font-serif-display text-[17px] font-bold leading-snug text-[#0F1E4A] md:text-xl">{m.name}</h3>
          <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-[#0F1E4A]/65 md:text-[13px]">{t(m.roles[0])}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-bold uppercase tracking-[0.12em] text-[#A87A1E]">
            {t("View profile")} <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.li>
  );
}

export default function GovernanceView() {
  const t = useT();
  const reduce = useReducedMotion();
  const [chair, ...rest] = COUNCIL;

  return (
    <PageLayout background={IVORY}>
      <div className="overflow-x-clip pt-[var(--header-h)]" style={{ background: IVORY }}>
        {/* ══ HERO: the council photograph, with an ivory plaque over its lower edge ══ */}
        <section className="relative pt-4 md:pt-8">
          <div className="vk-container">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease }}
              className="relative overflow-hidden rounded-[1.75rem] shadow-[0_40px_80px_-50px_rgba(15,30,74,.8)] md:rounded-[2.25rem]"
            >
              <div className="relative aspect-[1000/962] md:hidden">
                <Image src={COUNCIL_BANNER_MOBILE} alt={t("The Governing Council of the Hare Krishna Movement")} fill priority sizes="100vw" className="object-cover" />
              </div>
              <div className="relative hidden aspect-[2400/596] md:block">
                <Image src={COUNCIL_BANNER} alt={t("The Governing Council of the Hare Krishna Movement")} fill priority sizes="(min-width: 1312px) 1280px, 100vw" className="object-cover" />
              </div>
              <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,22,64,.12)_0%,transparent_40%,transparent_80%,rgba(251,247,238,.85)_100%)]" />
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.2 }}
              className="relative mx-auto -mt-8 max-w-3xl rounded-[1.75rem] bg-white px-6 py-8 text-center shadow-[0_30px_60px_-38px_rgba(15,30,74,.55)] ring-1 ring-[#E7DCC3] md:-mt-10 md:px-14 md:py-11"
            >
              <Eyebrow center>{t("Hare Krishna Movement")}</Eyebrow>
              <h1 className="mt-4 font-serif-display text-[2.6rem] font-bold leading-none text-[#0F1E4A] md:text-7xl">{t("Governance")}</h1>
              <div aria-hidden className="mx-auto mt-5 flex items-center justify-center gap-2 text-[#C9962B]">
                <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#C9962B]" />◆<span className="h-px w-16 bg-gradient-to-l from-transparent to-[#C9962B]" />
              </div>
              <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-[#0F1E4A]/75 md:text-[17px] md:leading-8">
                {t("Every movement thrives through inspired leadership. These are the torchbearers, teachers, and guides who transform timeless wisdom into living practice, bringing Krishna consciousness to life across the world.")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ══ THE CHAIRMAN ══ */}
        <section className="py-16 md:py-24">
          <div className="vk-container">
            <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
              <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, ease }} className="order-2 lg:order-1">
                <Eyebrow>{t("Chairman")}</Eyebrow>
                <h2 className="mt-4 font-serif-display text-4xl font-bold leading-[1.05] text-[#0F1E4A] md:text-6xl">{chair.name}</h2>
                <p className="mt-5 text-[16px] leading-8 text-[#0F1E4A]/75 md:text-[17px]">{chair.summary}</p>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {chair.roles.map((r) => (
                    <li key={r} className="flex gap-3 border-l-2 border-[#C9962B] pl-3 text-[14px] font-semibold leading-snug text-[#0F1E4A]">{t(r)}</li>
                  ))}
                </ul>
                {chair.honours.length > 0 && (
                  <p className="mt-6 text-[12px] font-bold uppercase leading-6 tracking-[0.16em] text-[#A87A1E]">
                    {chair.honours.join("  ·  ")}
                  </p>
                )}
                <Link href={`/governance/${chair.slug}`} className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#0F1E4A] px-6 py-3 text-sm font-bold text-[#FBF7EE] transition hover:bg-[#1E3A8A]">
                  {t("Read his story")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
              <motion.div initial={reduce ? false : { opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 1, ease }} className="relative order-1 mx-auto w-full max-w-[340px] md:max-w-[420px] lg:order-2">
                <Medallion m={chair} size="420px" priority />
                <div className="absolute -left-2 bottom-6 rounded-2xl bg-white px-4 py-3 text-center shadow-[0_20px_40px_-20px_rgba(15,30,74,.5)] ring-1 ring-[#E7DCC3] md:-left-6">
                  <p className="font-serif-display text-3xl font-bold leading-none text-[#0F1E4A]">{chair.years}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A87A1E]">{t("Years of devotion")}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══ THE COUNCIL ══ */}
        <section className="border-t border-[#E7DCC3] bg-white py-16 md:py-24">
          <div className="vk-container">
            <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
              <Eyebrow center>{t("Governing Council")}</Eyebrow>
              <h2 className="mt-4 font-serif-display text-3xl font-bold leading-tight text-[#0F1E4A] md:text-5xl">{t("Guided by devotion, serving with excellence")}</h2>
            </div>
            <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-14">
              {rest.map((m, i) => <CouncilCard key={m.slug} m={m} i={i} />)}
            </ul>
          </div>
        </section>

        {/* ══ CLOSING ══ */}
        <section className="py-16 md:py-24" style={{ background: IVORY }}>
          <div className="vk-container text-center">
            <p aria-hidden className="font-serif-display text-7xl leading-none text-[#C9962B]/60">&ldquo;</p>
            <p className="mx-auto -mt-4 max-w-3xl font-serif-display text-2xl italic leading-snug text-[#0F1E4A] md:text-[2.2rem]">
              {t("The real need is to awaken our love for Krishna.")}
            </p>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-[#A87A1E]">— {t("Srila Prabhupada")}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/founder" className="inline-flex items-center gap-2 rounded-full bg-[#0F1E4A] px-6 py-3 text-sm font-bold text-[#FBF7EE] hover:bg-[#1E3A8A]">{t("Our Founder-Acharya")} <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/about" className="inline-flex items-center rounded-full px-6 py-3 text-sm font-bold text-[#0F1E4A] ring-1 ring-[#0F1E4A]/25 hover:ring-[#0F1E4A]">{t("About us")}</Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
