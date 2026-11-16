"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Award } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useT } from "@/components/i18n/LocaleProvider";
import { COUNCIL, type CouncilMember } from "@/lib/governance";
import { ArchPortrait } from "./GovernanceView";

const GOLD = "bg-[linear-gradient(180deg,#FFF1C9_0%,#F6C752_50%,#C98B1E_100%)] bg-clip-text text-transparent";
const ease = [0.22, 0.8, 0.3, 1] as const;

export default function MemberView({ m }: { m: CouncilMember }) {
  const t = useT();
  const reduce = useReducedMotion();
  const i = COUNCIL.findIndex((x) => x.slug === m.slug);
  const prev = COUNCIL[(i - 1 + COUNCIL.length) % COUNCIL.length];
  const next = COUNCIL[(i + 1) % COUNCIL.length];
  const others = COUNCIL.filter((x) => x.slug !== m.slug);

  return (
    <PageLayout background="#ffffff">
      <div className="overflow-x-clip bg-white pt-[var(--header-h)]">
        {/* ══ HERO ══ */}
        <section className="relative isolate overflow-hidden bg-[radial-gradient(70%_90%_at_30%_10%,#22409A_0%,#11225E_55%,#0A1640_100%)] text-white">
          <div aria-hidden className="sp-rays absolute left-[22%] top-1/2 -z-10 aspect-square w-[120vmax] -translate-x-1/2 -translate-y-1/2 opacity-45 md:w-[90vmax]" />
          <div className="vk-container grid items-center gap-10 py-12 md:py-20 lg:grid-cols-[.75fr_1.25fr]">
            <motion.div initial={reduce ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease }} className="mx-auto w-full max-w-[280px] md:max-w-[340px]">
              <ArchPortrait m={m} priority sizes="340px" />
            </motion.div>
            <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.1 }} className="text-center lg:text-left">
              <Link href="/governance" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/75 hover:text-white">
                <ArrowLeft className="h-4 w-4" /> {t("Governing Council")}
              </Link>
              <h1 className={`mt-4 font-serif-display text-4xl font-bold leading-[1.1] md:text-6xl ${GOLD}`}>{m.name}</h1>
              <ul className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
                {m.roles.map((r) => (
                  <li key={r} className="rounded-full bg-white/10 px-3.5 py-1.5 text-[12.5px] font-semibold text-[#FFE6A3] ring-1 ring-[#F6C752]/45 backdrop-blur">{t(r)}</li>
                ))}
              </ul>
              {m.honours.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                  <Award className="h-4 w-4 text-[#F6C752]" />
                  {m.honours.map((h) => (
                    <span key={h} className="rounded-full bg-[#F6C752] px-3 py-1 text-[12px] font-bold text-[#1A1240]">{h}</span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* ══ BIOGRAPHY ══ */}
        <section className="vk-section">
          <div className="vk-container">
            <article className="mx-auto max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[hsl(var(--gold-deep))]">✦ {t("Biography")}</p>
              <div className="mt-5 space-y-5 text-[16px] leading-[1.85] text-ink/80 md:text-[17px]">
                {m.bio.map((p, k) => (
                  <motion.p
                    key={k}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, ease }}
                    className={k === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif-display first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-[hsl(var(--gold-deep))]" : ""}
                  >
                    {p}
                  </motion.p>
                ))}
              </div>

              {/* previous / next */}
              <nav className="mt-12 grid gap-3 border-t border-vk-100 pt-6 sm:grid-cols-2" aria-label={t("More council members")}>
                {[prev, next].map((x, k) => (
                  <Link key={x.slug} href={`/governance/${x.slug}`} className={`group flex items-center gap-3 rounded-2xl p-3 ring-1 ring-vk-100 transition hover:ring-[#F6C752]/70 ${k ? "sm:flex-row-reverse sm:text-right" : ""}`}>
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-[#F6C752]/70">
                      <Image src={x.image} alt="" fill sizes="56px" className="object-cover object-top" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-ink/45 sm:inline-flex">
                        {k ? <>{t("Next")} <ArrowRight className="h-3 w-3" /></> : <><ArrowLeft className="h-3 w-3" /> {t("Previous")}</>}
                      </span>
                      <span className="block truncate font-serif-display text-base font-bold text-vk-800 group-hover:text-vk-600">{x.name}</span>
                    </span>
                  </Link>
                ))}
              </nav>
            </article>
          </div>
        </section>

        {/* ══ THE COUNCIL ══ */}
        <section className="bg-[linear-gradient(180deg,#FFFBF2,#F3F6FF)] py-14 md:py-16">
          <div className="vk-container">
            <h2 className="text-center font-serif-display text-2xl font-bold text-vk-800 md:text-3xl">{t("The Governing Council")}</h2>
            <ul className="mx-auto mt-8 flex max-w-6xl flex-wrap justify-center gap-4 md:gap-5">
              {others.map((x) => (
                <li key={x.slug}>
                  <Link href={`/governance/${x.slug}`} className="group flex w-24 flex-col items-center text-center md:w-28">
                    <span className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-[#F6C752]/60 ring-offset-2 ring-offset-[#FFFBF2] transition group-hover:ring-[#F6C752] md:h-24 md:w-24">
                      <Image src={x.image} alt={x.name} fill sizes="96px" className="object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                    </span>
                    <span className="mt-2 text-[12.5px] font-semibold leading-tight text-ink/80 group-hover:text-vk-700">{x.name.replace(/^Sri /, "")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
