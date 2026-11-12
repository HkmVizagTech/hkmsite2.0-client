"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, CalendarHeart, HandHeart, Heart, Sparkles, Utensils } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import CountUp from "@/components/bhajans/CountUp";
import Reveal from "@/components/site/Reveal";
import { GoldPetals } from "@/components/home/HomeMagic";
import { useT } from "@/components/i18n/LocaleProvider";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

/**
 * Closing band: the temple's impact in large gold numbers that count up as they scroll in (only figures the site
 * already states, plus the live sq.ft offered for the new temple), then the two ways to join: Donate and Volunteer.
 */
export default function JoinCTA() {
  const t = useT();
  const [sqft, setSqft] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/seva-stats/sqft-campaign`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && Number.isFinite(Number(d.sqftRaised)) && Number(d.sqftRaised) > 0 && setSqft(Number(d.sqftRaised)))
      .catch(() => {});
  }, []);

  const stats: { icon: typeof Utensils; value: number; suffix: string; label: string; live?: boolean }[] = [
    { icon: Utensils, value: 2, suffix: ` ${t("Lakh+")}`, label: t("Meals served every day") },
    { icon: CalendarHeart, value: 21, suffix: "+", label: t("Festivals a year") },
    { icon: Sparkles, value: 2026 - 2008, suffix: "+", label: t("Years of seva in Vizag") },
    ...(sqft ? [{ icon: Building2, value: sqft, suffix: "", label: t("Sq.ft offered for the new temple"), live: true }] : []),
  ];

  return (
    <section className="relative isolate mt-6 overflow-hidden bg-[radial-gradient(70%_80%_at_50%_0%,#22409A_0%,#11225E_50%,#0A1640_100%)] py-16 text-white md:mt-10 md:py-24">
      <div aria-hidden className="sp-rays absolute left-1/2 top-0 -z-10 aspect-square w-[140vmax] -translate-x-1/2 -translate-y-1/2 opacity-60" />
      <GoldPetals count={14} />

      <div className="vk-container relative">
        <Reveal className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#F6C752]">✦ {t("Join Our Divine Journey")} ✦</p>
          <h2 className="vk-h2 hm-gold mx-auto mt-3 max-w-3xl md:!text-[3.2rem]">{t("Join thousands who serve every day")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/75 md:text-base">
            {t("Every contribution and every visit is an offering at the lotus feet of the Lord. Help us build Hare Krishna Vaikuntham — a centre of devotion, simplicity and spiritual awakening for Visakhapatnam.")}
          </p>
        </Reveal>

        {/* impact numbers */}
        <div className={`mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 md:gap-5 ${stats.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="relative h-full overflow-hidden rounded-2xl bg-white/[0.06] p-5 text-center ring-1 ring-[#F6C752]/30 backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.1] hover:ring-[#F6C752]/70 md:p-7">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#F6C752]/15 text-[#F6C752] ring-1 ring-[#F6C752]/50">
                  <s.icon className="h-5 w-5" />
                </span>
                <p className="mt-4 font-serif-display text-[2rem] font-bold leading-none sm:text-4xl md:text-5xl">
                  <CountUp value={s.value} className="hm-gold" />
                  <span className="hm-gold">{s.suffix}</span>
                </p>
                <p className="mt-2 text-[12.5px] font-medium leading-snug text-white/70 md:text-sm">{s.label}</p>
                {s.live && (
                  <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> {t("Live")}
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        {/* two ways to join */}
        <Reveal delay={0.2}>
          <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
            <Link href="/donate" className="group flex items-center gap-4 rounded-2xl bg-gradient-to-r from-[#F6C752] to-[#F2B41F] p-5 text-[#1A1240] shadow-[0_0_40px_-8px_rgba(246,199,82,.7)] transition-transform hover:-translate-y-1 md:p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1A1240] text-[#F6C752]"><Heart className="h-5 w-5 fill-current" /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-extrabold leading-tight md:text-xl">{t("Donate Now")}</span>
                <span className="block text-[13px] font-medium opacity-80">{t("Temple, Anna Daan, Gau Seva, Gita Daan · 80G")}</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/volunteer" className="group flex items-center gap-4 rounded-2xl bg-white/[0.08] p-5 ring-1 ring-[#F6C752]/50 backdrop-blur transition-all hover:-translate-y-1 hover:bg-white/[0.12] md:p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F6C752] text-[#1A1240]"><HandHeart className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-extrabold leading-tight text-[#FFE6A3] md:text-xl">{t("Volunteer to Serve")}</span>
                <span className="block text-[13px] text-white/70">{t("Festivals, prasadam and outreach")}</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-[#F6C752] transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <p className="mt-6 text-center">
            <a href="https://whatsapp.com/channel/0029VaZDEG67T8bWHjibTy2u" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 hover:text-white">
              <WhatsAppIcon className="h-4 w-4 fill-current" /> {t("Follow our WhatsApp Channel")}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
