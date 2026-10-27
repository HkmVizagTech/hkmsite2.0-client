"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Copy, Heart, ShieldCheck } from "lucide-react";
import { useT } from "@/components/i18n/LocaleProvider";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/site/SectionHeading";
import PhonePeUpiCard from "@/components/PhonePeUpiCard";
import ScenePoster from "@/components/festival/ScenePoster";
import FaqSection from "@/components/sqft-campaign/FaqSection";
import DonorPrivilegesSection from "@/components/sqft-campaign/DonorPrivilegesSection";
import OtherDonationsCarousel from "@/components/pitru-paksha/OtherDonationsCarousel";
import FestivalSevaGrid, { type SevaSelection } from "@/components/festival/FestivalSevaGrid";
import FestivalCheckoutModal from "@/components/festival/FestivalCheckoutModal";
import { useDiwaliMotion } from "@/components/diwali/useDiwaliMotion";
import { BANK_DETAILS, DAYS, DIWALI_DATE_ISO, DIWALI_DATE_LABEL, FAQS, IMPACTS, OG_IMAGE, PRIVILEGE_CONFIG, SEVAS, STRIP } from "@/lib/diwali";

// The 3D scene (three.js) is loaded in the browser only, after the page has painted.
const DiwaliScene = dynamic(() => import("@/components/diwali/DiwaliScene"), { ssr: false });

/** Mounts a 3D scene only when its section is about to scroll into view (saves a WebGL context on phones). */
function LazyScene({ variant, state, className = "" }: { variant: "hero" | "stage" | "finale"; state?: { intro: number; progress?: number }; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (e) => {
        if (e[0]?.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`absolute inset-0 ${className}`}>
      {show && <DiwaliScene variant={variant} state={state} />}
    </div>
  );
}

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
  const rootRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef(false);
  const heroState = useRef({ intro: 0 }).current;
  const stageState = useRef({ intro: 1, progress: 0 }).current;
  useDiwaliMotion(rootRef, heroState, stageState);

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
      <div ref={rootRef} className="overflow-x-clip bg-[#070d27] pt-[var(--header-h)]">
        {/* ══ HERO — a lotus diya, a rangoli that blooms, fireworks, lanterns and little Krishna ═══════════ */}
        <section className="relative isolate overflow-hidden bg-[radial-gradient(120%_90%_at_72%_22%,#3b1b73_0%,#16143f_46%,#070d27_100%)] text-white">
          <ScenePoster className="left-1/2 top-[19svh] w-[62vw] max-w-[260px] -translate-x-1/2 lg:left-auto lg:right-[15%] lg:top-[24%] lg:w-[340px] lg:max-w-none lg:translate-x-0" />
          <DiwaliScene variant="hero" state={heroState} className="z-0" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[40%] bg-gradient-to-t from-[#070d27] via-[#070d27]/70 to-transparent" />
          <div className="vk-container relative z-10 flex min-h-[calc(100svh-var(--header-h))] flex-col justify-end pb-10 pt-[50svh] md:justify-start md:pb-24 md:pt-24">
            <div className="max-w-xl lg:max-w-[38rem]">
              <p data-hero-fade className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200 md:text-xs">
                <span aria-hidden className="h-px w-8 bg-amber-300/70" /> {t("Dipavali")} · {t(DIWALI_DATE_LABEL)}
                {countdown && <span className="rounded-full bg-amber-300 px-2.5 py-0.5 text-[10px] tracking-wider text-[#1d1b20]">{countdown}</span>}
              </p>
              <h1 className="mt-4 font-heading text-[2.6rem] font-extrabold leading-[1.03] tracking-[-0.03em] sm:text-6xl lg:text-[4.4rem]">
                <span data-hero-fade className="block">{t("Light a Lamp")}</span>
                <span data-hero-fade className="block" style={GOLD}>{t("this Diwali")}</span>
              </h1>
              <p data-hero-fade className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/80 md:text-lg md:leading-8">
                {t("The festival of lights is the lighting of lamps for the Lord. Offer a seva at Hare Krishna Vaikuntham, Gambheeram, with sankalpa taken in your name.")}
              </p>
              <div data-hero-fade className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                <button type="button" onClick={scrollToDonate} className="vk-btn-gold h-[3.25rem] px-8 text-base font-bold">
                  {t("Offer Your Seva")} <ArrowRight className="h-4 w-4" />
                </button>
                <a href="#days" className="text-sm font-semibold text-white/80 transition-colors hover:text-white">
                  {t("The five days →")}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ══ THE FIVE DAYS — ticker ═══════════════════════════════════════ */}
        <div className="border-y border-amber-300/25 bg-[#070d27]">
          <ul className="vk-container flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-200/90 md:gap-x-9 md:text-xs">
            {STRIP.map((d, i) => (
              <li key={d} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden className="hidden h-1 w-1 rounded-full bg-amber-300/60 sm:block" />}
                {t(d)}
              </li>
            ))}
          </ul>
        </div>

        {/* ══ SEVAS — the donation, straight after the hero ═══════════════ */}
        <section id="offer-seva" className="relative scroll-mt-16 overflow-hidden bg-[radial-gradient(100%_60%_at_50%_0%,#1b1a5c_0%,#0c1342_50%,#070d27_100%)] py-14 text-white md:py-20">
          <div className="vk-container">
            <div data-reveal>
              <SectionHeading
                light
                align="center"
                eyebrow={t("Choose Your Offering")}
                title={t("Diwali Sevas")}
                subtitle={t("Tap an amount to offer that seva. Sankalpa is taken in your name and your receipt reaches you on WhatsApp.")}
              />
            </div>
            <div data-group>
              <FestivalSevaGrid sevas={SEVAS} impacts={IMPACTS} highlightedSlug={highlightedSlug} onSelect={setSelected} variant="dark" />
            </div>
            <p className="mt-8 text-center text-xs text-white/55">
              {t("Minimum donation Rs. 100 · 80G Tax Exemption available · Secured by Razorpay · Donations go to Hare Krishna Movement India, Visakhapatnam")}
            </p>
          </div>
          <div className="mt-8 [&_section]:pb-2">
            <PhonePeUpiCard campaign="Diwali" />
          </div>
        </section>

        {/* ══ THE FIVE DAYS — a sticky 3D stage that plays each day as you scroll ═══════ */}
        <section id="days" data-days className="relative scroll-mt-20 bg-[#070d27] pt-14 text-white md:pt-20">
          <div className="vk-container">
            <div data-reveal>
              <SectionHeading light align="center" eyebrow={t("Five days of light")} title={t("The Days of Diwali")} subtitle={t("Scroll to walk through the festival, day by day.")} />
            </div>
            <div className="grid gap-x-12 lg:grid-cols-[1fr_1.05fr]">
              <div className="sticky top-[calc(var(--header-h)+8px)] z-10 order-1 lg:static lg:order-2 lg:z-auto">
                <div className="lg:sticky lg:top-[calc(var(--header-h)+28px)]">
                  <div data-stage className="relative h-[48svh] min-h-[300px] max-h-[560px] w-full overflow-hidden rounded-3xl bg-[radial-gradient(110%_100%_at_60%_20%,#3b1b73_0%,#14123f_52%,#070d27_100%)] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10 lg:h-[min(66svh,600px)]">
                    <LazyScene variant="stage" state={stageState} />
                  </div>
                </div>
              </div>
              <div data-steps className="order-2 lg:order-1">
                {DAYS.map((d) => (
                  <div key={d.n} data-step-card className="km-step flex min-h-[46svh] items-center py-3 lg:min-h-[54svh] lg:py-4">
                    <div className="relative w-full rounded-2xl border border-amber-300/20 bg-white/[0.05] p-6 pt-8 md:p-8 md:pt-10">
                      <span className="absolute -top-5 left-6 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-gold font-heading text-lg font-extrabold text-ink shadow-gold">{d.n}</span>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200">{t(d.date)}</p>
                      <h3 className="mt-1 font-heading text-xl font-bold text-white md:text-2xl">{t(d.title)}</h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-white/75 md:text-base md:leading-7">{t(d.text)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ FINALE — the last call to donate ═══════════════════════════ */}
        <section id="finale" className="relative isolate scroll-mt-16 overflow-hidden bg-[radial-gradient(110%_100%_at_75%_30%,#3b1b73_0%,#14123f_48%,#070d27_100%)] py-16 text-white md:py-24">
          <div className="vk-container relative z-10">
            <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div data-reveal>
                <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200 md:text-xs">
                  <span aria-hidden className="h-px w-8 bg-amber-300/70" /> {t("Offer your seva")}
                </p>
                <h2 className="mt-4 font-heading text-[2rem] font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-5xl">
                  {t("Let your seva be a lamp")} <span style={GOLD}>{t("that keeps burning")}</span>
                </h2>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/75 md:text-lg md:leading-8">
                  {t("Sankalpa is taken in your name, your receipt reaches your WhatsApp the moment the payment is confirmed, and every donation is eligible for 80G.")}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <button type="button" onClick={scrollToDonate} className="vk-btn-gold h-[3.25rem] px-8 text-base font-bold">
                    <Heart className="h-4 w-4" /> {t("Offer Your Seva")}
                  </button>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-white/70">
                    <ShieldCheck className="h-4 w-4 text-amber-300" /> {t("80G · Secure Razorpay checkout")}
                  </span>
                </div>
              </div>
              <div className="relative h-[260px] md:h-[360px]">
                <LazyScene variant="finale" />
              </div>
            </div>

            <div className="mx-auto mt-12 grid max-w-6xl gap-5 lg:grid-cols-2 lg:items-start">
              <div className="rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4 text-sm leading-7 text-white/80 md:text-base">
                {t(
                  "While making UPI or bank payments, please send a screenshot with your name, mobile, address and PAN details to our WhatsApp {phone} or email {email}, so your receipt is issued against the right donor.",
                  { phone: "\u0001", email: "\u0002" }
                )
                  .split(/(\u0001|\u0002)/)
                  .map((part, i) =>
                    part === "\u0001" ? (
                      <a key={i} className="font-bold text-amber-200 hover:text-amber-100" href="https://wa.me/917995097108" target="_blank" rel="noreferrer">
                        +91 79950 97108
                      </a>
                    ) : part === "\u0002" ? (
                      <a key={i} className="break-all font-bold text-amber-200 hover:text-amber-100" href="mailto:social@hkmvizag.org">
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
