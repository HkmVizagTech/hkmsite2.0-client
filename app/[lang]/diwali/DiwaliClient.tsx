"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Copy, Heart, ShieldCheck } from "lucide-react";
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
import StoryTimeline from "@/components/festival/StoryTimeline";
import DiyaRow from "@/components/festival/DiyaRow";
import { Mandala, OrnamentDivider, PetalFall } from "@/components/festival/FestivalDecor";
import { BANK_DETAILS, BANNER_DESKTOP, BANNER_MOBILE, DAYS, DIWALI_DATE_ISO, DIWALI_DATE_LABEL, FAQS, IMPACTS, OG_IMAGE, PRIVILEGE_CONFIG, SEVAS, STRIP } from "@/lib/diwali";

const SLUG = "diwali";
const istDate = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
const dayDiff = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);

export default function DiwaliClient() {
  const t = useT();
  const [selected, setSelected] = useState<SevaSelection | null>(null);
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [pastHero, setPastHero] = useState(false);
  const [hideBar, setHideBar] = useState(false);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const scrolledRef = useRef(false);

  // Days to Diwali, worked out after mount so the server and the first client render agree.
  useEffect(() => {
    setDaysLeft(dayDiff(istDate(new Date()), DIWALI_DATE_ISO));
  }, []);

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

  // The floating "Offer Seva" bar appears after the hero and hides while a donation section is on screen.
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const targets = ["offer-seva", "finale"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
        setHideBar(visible.size > 0);
      },
      { threshold: 0.12 }
    );
    targets.forEach((el) => io.observe(el));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const scrollToDonate = () => document.getElementById("offer-seva")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const copyField = (label: string, value: string) => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopiedField(label);
    window.setTimeout(() => setCopiedField(null), 1500);
  };

  const countdown =
    daysLeft === null
      ? null
      : daysLeft > 1
        ? t("{n} days to Diwali", { n: daysLeft })
        : daysLeft === 1
          ? t("1 day to Diwali")
          : daysLeft === 0
            ? t("Diwali is today")
            : null;

  const GOLD = { backgroundImage: "var(--gradient-gold)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } as const;

  return (
    <PageLayout>
      <div className="overflow-x-clip bg-white pt-[var(--header-h)]">
        {/* ══ BANNER ═════════════════════════════════════════════════════ */}
        <section className="bg-[#fff6e0]">
          <h1 className="sr-only">
            {t("Light a Lamp")} {t("this Diwali")}, {t(DIWALI_DATE_LABEL)}
          </h1>
          <a href="#offer-seva" className="block" aria-label={t("Offer Your Seva")}>
            <picture>
              <source media="(max-width: 640px)" srcSet={BANNER_MOBILE} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BANNER_DESKTOP} alt={t("Diwali")} fetchPriority="high" className="block h-auto w-full" />
            </picture>
          </a>
        </section>

        {/* ══ INTRO — the date, a line of welcome, lit lamps ═══════════════ */}
        <section className="relative isolate overflow-hidden bg-[radial-gradient(120%_100%_at_50%_0%,#fff3d6_0%,#fffaf0_55%,#ffffff_100%)]">
          <Mandala className="absolute -right-24 -top-10 -z-10 h-[360px] w-[360px] md:right-10 md:h-[440px] md:w-[440px]" />
          <PetalFall count={7} className="-z-[5]" />
          <div className="vk-container flex flex-col items-center py-10 text-center md:py-14">
            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--gold-deep))] md:text-xs">
              {t("Dipavali")} · {t(DIWALI_DATE_LABEL)}
              {countdown && <span className="rounded-full bg-gradient-gold px-2.5 py-0.5 text-[10px] tracking-wider text-ink">{countdown}</span>}
            </p>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground md:text-lg md:leading-8">
              {t("The festival of lights is the lighting of lamps for the Lord. Offer a seva at Hare Krishna Vaikuntham, Gambheeram, with sankalpa taken in your name.")}
            </p>
            <DiyaRow count={7} className="mt-7" />
          </div>
        </section>

        {/* ══ THE FIVE DAYS — ticker ═════════════════════════════════════ */}
        <div className="border-y border-[hsl(var(--gold)/0.35)] bg-gradient-to-r from-amber-50 via-white to-amber-50">
          <ul className="vk-container flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--gold-deep))] md:gap-x-9 md:text-xs">
            {STRIP.map((d, i) => (
              <li key={d} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden className="hidden h-1 w-1 rounded-full bg-[hsl(var(--gold))] sm:block" />}
                {t(d)}
              </li>
            ))}
          </ul>
        </div>

        {/* ══ SEVAS — the donation, straight after the hero ═════════════ */}
        <section id="offer-seva" className="vk-section scroll-mt-16 bg-gradient-to-b from-white via-amber-50/50 to-white">
          <div className="vk-container">
            <Reveal>
              <SectionHeading
                align="center"
                eyebrow={t("Choose Your Offering")}
                title={t("Diwali Sevas")}
                subtitle={t("Tap an amount to offer that seva. Sankalpa is taken in your name and your receipt reaches you on WhatsApp.")}
              />
            </Reveal>
            <FestivalSevaGrid sevas={SEVAS} impacts={IMPACTS} highlightedSlug={highlightedSlug} onSelect={setSelected} />
            <p className="mt-8 text-center text-xs text-muted-foreground">
              {t("Minimum donation Rs. 100 · 80G Tax Exemption available · Secured by Razorpay · Donations go to Hare Krishna Movement India, Visakhapatnam")}
            </p>
          </div>
        </section>

        <PhonePeUpiCard campaign="Diwali" />
        <OrnamentDivider className="my-2" />

        {/* ══ THE FIVE DAYS ══════════════════════════════════════════════ */}
        <section id="days" className="vk-section vk-band scroll-mt-20">
          <div className="vk-container">
            <Reveal>
              <SectionHeading align="center" eyebrow={t("Five days of light")} title={t("The Days of Diwali")} />
            </Reveal>
            <StoryTimeline steps={DAYS.map((d) => ({ n: d.n, title: d.title, text: d.text, date: d.date }))} />
          </div>
        </section>

        {/* ══ FINAL CALL + BANK ══════════════════════════════════════════ */}
        <section id="finale" className="vk-section scroll-mt-16">
          <div className="vk-container">
            <Reveal className="mx-auto max-w-3xl text-center">
              <h2 className="vk-h2">
                {t("Let your seva be a lamp")} <span style={GOLD}>{t("that keeps burning")}</span>
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground md:text-lg md:leading-8">
                {t("Sankalpa is taken in your name, your receipt reaches your WhatsApp the moment the payment is confirmed, and every donation is eligible for 80G.")}
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                <button type="button" onClick={scrollToDonate} className="vk-btn-gold h-[3.25rem] px-8 text-base font-bold">
                  <Heart className="h-4 w-4" /> {t("Offer Your Seva")}
                </button>
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-[hsl(var(--gold-deep))]" /> {t("80G · Secure Razorpay checkout")}
                </span>
              </div>
            </Reveal>

            <div className="mx-auto mt-12 grid max-w-6xl gap-5 lg:grid-cols-2 lg:items-start">
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
          bannerImage={OG_IMAGE}
          thankYouSource="the Diwali seva programme"
          trackContentName="Diwali"
        />
      )}

      {!selected && pastHero && !hideBar && (
        <div className="fixed bottom-[calc(var(--bottom-nav-space)+4px+env(safe-area-inset-bottom))] left-3 right-[76px] z-40 lg:hidden">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-vk-100 bg-white/95 p-2 pl-4 shadow-lift">
            <span className="min-w-0 truncate text-[13px] font-semibold text-vk-800">{t("Diwali Seva")}</span>
            <button type="button" onClick={scrollToDonate} className="vk-btn-gold h-11 shrink-0 px-5">
              {t("Offer Seva")}
            </button>
          </div>
        </div>
      )}
      {!selected && pastHero && !hideBar && (
        <button type="button" onClick={scrollToDonate} className="vk-btn-gold fixed bottom-6 right-24 z-40 hidden h-12 items-center gap-2 px-6 text-sm font-bold shadow-gold lg:inline-flex">
          <Heart className="h-4 w-4" /> {t("Offer Seva")}
        </button>
      )}
    </PageLayout>
  );
}
