"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Award, Quote, Sparkles } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useT } from "@/components/i18n/LocaleProvider";
import { COUNCIL, type CouncilMember } from "@/lib/governance";

const GOLD = "bg-[linear-gradient(180deg,#FFF1C9_0%,#F6C752_50%,#C98B1E_100%)] bg-clip-text text-transparent";
const ease = [0.22, 0.8, 0.3, 1] as const;

/** A portrait in a gold arch, with a soft halo; used for the Chairman and on profile pages. */
export function ArchPortrait({ m, sizes, priority = false }: { m: CouncilMember; sizes: string; priority?: boolean }) {
  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-6 rounded-t-[999px] rounded-b-[2.5rem] bg-[radial-gradient(circle,rgba(246,199,82,.35),transparent_70%)] blur-2xl" />
      <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[2rem] border-[3px] border-[#F6C752]/80 bg-[#0A1640] p-2 shadow-[0_0_60px_-12px_rgba(246,199,82,.55)]">
        <div className="relative aspect-[5/6] overflow-hidden rounded-t-[999px] rounded-b-[1.6rem]">
          <Image src={m.image} alt={m.name} fill priority={priority} sizes={sizes} className="object-cover object-top" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#0A1640]/55 to-transparent" />
        </div>
      </div>
    </div>
  );
}

function MemberCard({ m, i }: { m: CouncilMember; i: number }) {
  const t = useT();
  const reduce = useReducedMotion();
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease, delay: (i % 4) * 0.08 }}
    >
      <Link
        href={`/governance/${m.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_50px_-30px_rgba(10,22,64,.55)] ring-1 ring-[#F6C752]/35 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_34px_60px_-28px_rgba(10,22,64,.6)] hover:ring-[#F6C752]/80"
      >
        <div className="relative aspect-[5/6] overflow-hidden bg-[#0A1640]">
          <Image src={m.image} alt={m.name} fill sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw" className="object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0A1640] via-[#0A1640]/55 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
            <h3 className="font-serif-display text-[15px] font-bold leading-tight text-white sm:text-lg md:text-xl">{m.name}</h3>
            <p className="mt-1 line-clamp-2 text-[11.5px] font-medium leading-snug text-[#FFE6A3] sm:text-[12.5px]">{t(m.roles[0])}</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4 md:p-5">
          {m.roles.length > 1 && (
            <ul className="hidden space-y-1.5 sm:block">
              {m.roles.slice(1, 3).map((r) => (
                <li key={r} className="flex gap-2 text-[13px] leading-snug text-ink/70">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F6C752]" />
                  {t(r)}
                </li>
              ))}
            </ul>
          )}
          <span className="mt-auto inline-flex items-center gap-1.5 pt-0 text-[13px] font-bold text-vk-700 group-hover:text-vk-500 sm:pt-4 sm:text-sm">
            {t("Read more")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
    <PageLayout background="#ffffff">
      <div className="overflow-x-clip bg-white pt-[var(--header-h)]">
        {/* ══ HERO ══ */}
        <section className="relative isolate overflow-hidden bg-[radial-gradient(70%_90%_at_50%_0%,#22409A_0%,#11225E_55%,#0A1640_100%)] text-white">
          <div aria-hidden className="sp-rays absolute left-1/2 top-[-40%] -z-10 aspect-square w-[150vmax] -translate-x-1/2 opacity-50" />
          <div className="vk-container py-16 text-center md:py-24">
            <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}>
              <p className="flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#F6C752]">
                <span aria-hidden className="h-px w-10 bg-gradient-to-r from-transparent to-[#F6C752]" /> {t("Hare Krishna Movement")} <span aria-hidden className="h-px w-10 bg-gradient-to-l from-transparent to-[#F6C752]" />
              </p>
              <h1 className={`mt-4 font-serif-display text-5xl font-bold leading-[1.1] md:text-7xl ${GOLD}`}>{t("Governance")}</h1>
              <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-white/80 md:text-lg md:leading-8">
                {t("Every movement thrives through inspired leadership. These are the torchbearers, teachers, and guides who transform timeless wisdom into living practice, bringing Krishna consciousness to life across the world.")}
              </p>
            </motion.div>
          </div>
          <div aria-hidden className="h-10 bg-gradient-to-b from-transparent to-white/0" />
        </section>

        {/* ══ CHAIRMAN ══ */}
        <section className="relative -mt-6 pb-6 md:-mt-10">
          <div className="vk-container">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease }}
              className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#FFF9EC_0%,#FFFFFF_45%,#EEF3FF_100%)] p-6 shadow-[0_40px_80px_-46px_rgba(10,22,64,.6)] ring-1 ring-[#F6C752]/45 md:p-12"
            >
              <div aria-hidden className="sp-rays absolute -right-40 -top-40 h-[520px] w-[520px] opacity-30" />
              <div className="relative grid items-center gap-10 lg:grid-cols-[.8fr_1.2fr]">
                <div className="mx-auto w-full max-w-[300px] md:max-w-[340px]">
                  <ArchPortrait m={chair} priority sizes="340px" />
                </div>
                <div className="text-center lg:text-left">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#0A1640] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFE6A3] ring-1 ring-[#F6C752]/60">
                    <Sparkles className="h-3.5 w-3.5 text-[#F6C752]" /> {t("Chairman")}
                  </span>
                  <h2 className="mt-4 font-serif-display text-4xl font-bold leading-tight text-vk-800 md:text-5xl">{chair.name}</h2>
                  <ul className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                    {chair.roles.map((r) => (
                      <li key={r} className="rounded-full bg-white px-3 py-1.5 text-[12.5px] font-semibold text-vk-700 shadow-sm ring-1 ring-vk-100">{t(r)}</li>
                    ))}
                  </ul>
                  <p className="mx-auto mt-5 line-clamp-5 max-w-2xl text-left text-[15px] leading-7 text-ink/75 sm:line-clamp-none sm:text-center lg:mx-0 lg:text-left">{chair.bio[0]}</p>
                  {chair.honours.length > 0 && (
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                      <Award className="h-4 w-4 text-[hsl(var(--gold-deep))]" />
                      {chair.honours.map((h) => (
                        <span key={h} className="rounded-full bg-[#FFF4D6] px-3 py-1 text-[12px] font-bold text-[#8A5A0B] ring-1 ring-[#F6C752]/60">{h}</span>
                      ))}
                    </div>
                  )}
                  <Link href={`/governance/${chair.slug}`} className="vk-btn-gold mt-7 inline-flex">
                    {t("Read his story")} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══ COUNCIL ══ */}
        <section className="vk-section">
          <div className="vk-container">
            <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
              <span className="vk-pill mb-3">{t("Governing Council")}</span>
              <h2 className="vk-h2">{t("Guided by devotion, serving with excellence")}</h2>
            </div>
            <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {rest.map((m, i) => <MemberCard key={m.slug} m={m} i={i} />)}
            </ul>
          </div>
        </section>

        {/* ══ PRABHUPADA ══ */}
        <section className="relative isolate overflow-hidden bg-[#0A1640] py-16 text-white md:py-20">
          <div aria-hidden className="sp-rays absolute left-1/2 top-1/2 -z-10 aspect-square w-[110vmax] -translate-x-1/2 -translate-y-1/2 opacity-40" />
          <div className="vk-container text-center">
            <Quote className="mx-auto h-8 w-8 text-[#F6C752]" />
            <p className="mx-auto mt-4 max-w-3xl font-serif-display text-2xl italic leading-snug md:text-[2rem]">
              &ldquo;{t("The real need is to awaken our love for Krishna.")}&rdquo;
            </p>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.24em] text-[#F6C752]">— {t("Srila Prabhupada")}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/founder" className="vk-btn-gold">{t("Our Founder-Acharya")} <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/about" className="vk-btn-ghost-light">{t("About us")}</Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
