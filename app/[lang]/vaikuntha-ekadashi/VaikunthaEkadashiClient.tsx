"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, CalendarDays, Check, Copy, FileCheck2, Heart, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { useT } from "@/components/i18n/LocaleProvider";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import PhonePeUpiCard from "@/components/PhonePeUpiCard";
import FaqSection from "@/components/sqft-campaign/FaqSection";
import DonorPrivilegesSection from "@/components/sqft-campaign/DonorPrivilegesSection";
import OtherDonationsCarousel from "@/components/pitru-paksha/OtherDonationsCarousel";
import FestivalSevaGrid, { type SevaSelection } from "@/components/festival/FestivalSevaGrid";
import FestivalCheckoutModal from "@/components/festival/FestivalCheckoutModal";
import { OrnamentDivider, PetalFall } from "@/components/festival/FestivalDecor";
import {
  ABOUT,
  BANK_DETAILS,
  BANNER_DESKTOP,
  BANNER_MOBILE,
  EVENT_DATE_LABEL,
  FACTS,
  FAQS,
  IMPACTS,
  OBSERVANCE,
  OG_IMAGE,
  PRIVILEGE_CONFIG,
  SEVAS,
  SHLOKA,
  WHY_GIVE,
} from "@/lib/vaikunthaEkadashi";

const SLUG = "vaikuntha-ekadashi";
const FACT_ICONS = [CalendarDays, MapPin, FileCheck2, ShieldCheck];

export default function VaikunthaEkadashiClient() {
  const t = useT();
  const [selected, setSelected] = useState<SevaSelection | null>(null);
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [pastHero, setPastHero] = useState(false);
  const [inSevas, setInSevas] = useState(false);
  const scrolledRef = useRef(false);

  // A ?seva= deep link (the pending-payment reminder) goes to that seva's card; everyone else stays at the top.
  useEffect(() => {
    if (scrolledRef.current) return;
    scrolledRef.current = true;
    const slug = new URLSearchParams(window.location.search).get("seva");
    const matched = slug && SEVAS.some((s) => s.slug === slug) ? slug : null;
    if (!matched) return;
    setHighlightedSlug(matched);
    const timer = window.setTimeout(() => document.getElementById(`seva-card-${matched}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 450);
    return () => window.clearTimeout(timer);
  }, []);

  // The floating "Offer Seva" bar appears after the hero and hides while the seva cards are on screen.
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const el = document.getElementById("offer-seva");
    const io = el ? new IntersectionObserver((e) => setInSevas(e[0]?.isIntersecting ?? false), { threshold: 0.1 }) : null;
    if (el && io) io.observe(el);
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  const scrollToDonate = () => document.getElementById("offer-seva")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const copyField = (label: string, value: string) => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopiedField(label);
    window.setTimeout(() => setCopiedField(null), 1500);
  };
  const hasBanner = Boolean(BANNER_DESKTOP);

  return (
    <PageLayout>
      <div className="overflow-x-clip bg-white pt-[var(--header-h)]">
        {/* ══ HERO ═══════════════════════════════════════════════════════ */}
        {hasBanner ? (
          <section className="bg-[#0a0d2e]">
            <h1 className="sr-only">
              {t("Vaikuntha Ekadashi")}, {t(EVENT_DATE_LABEL)}
            </h1>
            <a href="#offer-seva" className="block" aria-label={t("Offer Your Seva")}>
              <picture>
                {BANNER_MOBILE && <source media="(max-width: 640px)" srcSet={BANNER_MOBILE} />}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={BANNER_DESKTOP as string} alt={t("Vaikuntha Ekadashi")} fetchPriority="high" className="block h-auto w-full" />
              </picture>
            </a>
          </section>
        ) : (
          <section className="bg-gradient-to-b from-amber-50 to-white py-14 text-center">
            <h1 className="vk-h1">{t("Vaikuntha Ekadashi")}</h1>
          </section>
        )}

        {/* ══ FACTS ══════════════════════════════════════════════════════ */}
        <section className="border-b border-[hsl(var(--gold)/0.35)] bg-gradient-to-r from-amber-50 via-white to-amber-50">
          <dl className="vk-container grid grid-cols-2 gap-x-6 gap-y-5 py-5 md:grid-cols-4 md:py-6">
            {FACTS.map((f, i) => {
              const Icon = FACT_ICONS[i];
              return (
                <div key={f.k} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--gold)/0.18)] text-[hsl(var(--gold-deep))]">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-[13px] font-bold text-ink md:text-sm">{t(f.k)}</dt>
                    <dd className="mt-0.5 text-[11.5px] leading-snug text-muted-foreground md:text-xs">{t(f.v)}</dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </section>

        {/* ══ SEVAS ══════════════════════════════════════════════════════ */}
        <section id="offer-seva" className="vk-section relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-white via-amber-50/50 to-white">
          <PetalFall count={7} />
          <div className="vk-container relative">
            <Reveal>
              <SectionHeading
                align="center"
                eyebrow={t("Choose Your Offering")}
                title={t("Vaikuntha Ekadashi Sevas")}
                subtitle={t("Tap an amount to offer that seva. Sankalpa is taken in your name and your receipt reaches you on WhatsApp.")}
              />
            </Reveal>
            <FestivalSevaGrid sevas={SEVAS} impacts={IMPACTS} highlightedSlug={highlightedSlug} onSelect={setSelected} />
            <p className="mt-8 text-center text-xs text-muted-foreground">
              {t("Minimum donation Rs. 100 · 80G Tax Exemption available · Secured by Razorpay · Donations go to Hare Krishna Movement India, Visakhapatnam")}
            </p>
          </div>
        </section>

        <PhonePeUpiCard campaign="Vaikuntha Ekadashi" />
        <OrnamentDivider className="my-2" />

        {/* ══ ABOUT ══════════════════════════════════════════════════════ */}
        <section id="about" className="vk-section scroll-mt-20">
          <div className="vk-container">
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <Reveal>
                <span className="vk-pill-soft">{t("About the day")}</span>
                <h2 className="vk-h2 mt-4">{t("The day of liberation")}</h2>
                <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted-foreground md:text-base md:leading-8">
                  {ABOUT.map((para) => (
                    <p key={para}>{t(para)}</p>
                  ))}
                </div>
                <button type="button" onClick={scrollToDonate} className="vk-btn-gold mt-7 h-12 px-7 text-[15px] font-bold">
                  {t("Offer Your Seva")}
                </button>
              </Reveal>
              <Reveal delay={0.08}>
                <figure className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 to-white p-7 shadow-lift ring-1 ring-[hsl(var(--gold)/0.4)] md:p-9">
                  <Sparkles className="h-6 w-6 text-[hsl(var(--gold-deep))]" />
                  <blockquote className="mt-5 space-y-1 font-serif-display text-lg italic leading-8 text-vk-800 md:text-xl">
                    {SHLOKA.sanskrit.map((line) => (
                      <p key={line}>{t(line)}</p>
                    ))}
                  </blockquote>
                  <p className="mt-5 border-l-2 border-[hsl(var(--gold)/0.7)] pl-4 text-sm leading-6 text-muted-foreground">{t(SHLOKA.meaning)}</p>
                  <figcaption className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[hsl(var(--gold-deep))]">{t(SHLOKA.source)}</figcaption>
                </figure>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ══ HOW THE DAY IS OBSERVED ════════════════════════════════════ */}
        <section className="vk-section vk-band">
          <div className="vk-container">
            <Reveal>
              <SectionHeading align="center" eyebrow={t("How the day is observed")} title={t("Four ways to keep Vaikuntha Ekadashi")} />
            </Reveal>
            <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {OBSERVANCE.map((o, i) => (
                <Reveal key={o.n} delay={i * 0.05} className="vk-card relative h-full overflow-hidden p-6">
                  <span aria-hidden className="font-heading text-5xl font-extrabold leading-none text-vk-100">
                    {o.n}
                  </span>
                  <h3 className="mt-3 text-base font-bold text-ink">{t(o.title)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(o.text)}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ WHY GIVE ═══════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 to-white py-14 md:py-20">
          <div className="vk-container">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--gold-deep))] md:text-xs">{t("Why offer a seva today")}</p>
              <h2 className="mt-3 font-heading text-[1.9rem] font-extrabold leading-tight tracking-[-0.025em] text-ink md:text-[2.5rem]">{t("Merit, devotion and liberation")}</h2>
            </Reveal>
            <div className="mx-auto mt-10 grid max-w-6xl gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {WHY_GIVE.map((w, i) => (
                <Reveal key={w.title} delay={i * 0.05} className="border-t-2 border-[hsl(var(--gold)/0.6)] pt-5">
                  <h3 className="font-heading text-lg font-bold text-ink">{t(w.title)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(w.text)}</p>
                </Reveal>
              ))}
            </div>
            <div className="mt-10 text-center">
              <button type="button" onClick={scrollToDonate} className="vk-btn-gold h-[3.25rem] px-8 text-base font-bold">
                <Heart className="h-4 w-4" /> {t("Offer Your Seva")}
              </button>
            </div>
          </div>
        </section>

        {/* ══ BANK TRANSFER ══════════════════════════════════════════════ */}
        <section className="vk-section">
          <div className="vk-container">
            <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2 lg:items-start">
              <div className="rounded-2xl border border-vk-100 bg-vk-50 px-5 py-4 text-sm leading-7 text-ink/80 md:text-base">
                {t(
                  "While making UPI or bank payments, please send a screenshot with your name, mobile, address and PAN details to our WhatsApp {phone} or email {email}, so your receipt is issued against the right donor.",
                  { phone: "\u0001", email: "\u0002" }
                )
                  .split(/(\u0001|\u0002)/)
                  .map((part, i) =>
                    part === "\u0001" ? (
                      <a key={i} className="font-bold text-vk-700 hover:text-vk-500" href="https://wa.me/917995097108" target="_blank" rel="noreferrer">
                        +91 79950 97108
                      </a>
                    ) : part === "\u0002" ? (
                      <a key={i} className="break-all font-bold text-vk-700 hover:text-vk-500" href="mailto:social@hkmvizag.org">
                        social@hkmvizag.org
                      </a>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
              </div>
              <div className="vk-card p-5 md:p-7">
                <h2 className="vk-bar-title text-lg text-ink md:text-xl">{t("Donation Through Bank (NEFT / RTGS)")}</h2>
                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {BANK_DETAILS.map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-3 rounded-xl bg-vk-50 p-4 text-sm text-ink">
                      <div className="min-w-0 flex-1">
                        <span className="block text-xs font-medium text-muted-foreground">{t(label)}:</span>
                        <span className="mt-0.5 block select-all break-words font-semibold">{value}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyField(label, value)}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-vk-500 transition-colors hover:bg-white hover:text-vk-700"
                        title={`${t("Copy")} ${t(label)}`}
                      >
                        {copiedField === label ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <DonorPrivilegesSection scrollToDonate={scrollToDonate} config={PRIVILEGE_CONFIG} />
        <FaqSection faqs={FAQS.map((f) => ({ q: t(f.q), a: t(f.a) }))} tone="blue" />
        <OtherDonationsCarousel />
      </div>

      {selected && (
        <FestivalCheckoutModal
          selected={selected}
          onClose={() => setSelected(null)}
          sourcePage={SLUG}
          festivalSlug={SLUG}
          bannerImage={BANNER_DESKTOP ?? OG_IMAGE}
          thankYouSource="the Vaikuntha Ekadashi seva programme"
          trackContentName="Vaikuntha Ekadashi"
        />
      )}

      {!selected && pastHero && !inSevas && (
        <div className="fixed bottom-[calc(var(--bottom-nav-space)+4px+env(safe-area-inset-bottom))] left-3 right-[76px] z-40 lg:hidden">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-vk-100 bg-white/95 p-2 pl-4 shadow-lift">
            <span className="min-w-0 truncate text-[13px] font-semibold text-vk-800">{t("Vaikuntha Ekadashi")}</span>
            <button type="button" onClick={scrollToDonate} className="vk-btn-gold h-11 shrink-0 px-5">
              {t("Offer Seva")}
            </button>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
