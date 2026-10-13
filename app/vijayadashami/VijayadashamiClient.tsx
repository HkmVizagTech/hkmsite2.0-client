"use client";

import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/site/SectionHeading";
import DonationForm from "@/components/DonationForm";
import PhonePeUpiCard from "@/components/PhonePeUpiCard";
import { motion, useInView, useReducedMotion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  FileCheck2,
  Flame,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import type { Seva } from "@/lib/sevaConfig";

// ── Festival constants ───────────────────────────────────────────────
// Vijayadashami 2026 falls on Tuesday, 20 October 2026 (tenth day of
// Sharad Navaratri). Update both of these next year.
const FESTIVAL_DATE_LABEL = "Tuesday, 20 October 2026";
const FESTIVAL_DATE_ISO = "2026-10-20";

// Vijayadashami 2026 festival artwork (R2 media library).
const DESKTOP_BANNER =
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1791881259236-1791881258272-Dussehradesk.webp";
const MOBILE_BANNER =
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1791881259757-1791881258663-Dussehramob.webp";

// ── Seva definitions ─────────────────────────────────────────────────
// `category` is sent to the API as the donation `type`, and `title` as
// `sevaName`. Together with festivalSlug "vijayadashami" these are what
// dcc.service.js matches on to pick the right DCC sub-category code
// (Cultural Program 3 → Vijayadashami 106 → per-seva code 104-109).
// Change a title here and you must change the matching `sevaNameIncludes`
// entry in dcc.service.js, or the donation falls through to a generic code.
//
// Each seva carries the temple's confirmed price for Vijayadashami 2026
// (Annadana 5,555 · Yajamana 25,555 · Pushpalankara 11,111 · Mantapa
// 15,111 · Vastrabharana 9,999 · Homam 7,777), slotted into the ladder in
// place of the nearest tier. The surrounding amounts follow the
// Janmashtami ladders; Gau Seva uses the standard Gau Poshana ladder.
// Donors can also enter any amount — the "Donate Other Amount" button
// opens the same form with the custom-amount field already active.
const SEVAS: Seva[] = [
  {
    slug: "annadana-seva",
    title: "Annadana Seva",
    shortTitle: "Annadana",
    image: "/assets/donations-annadana-real.jpg",
    tagline: "Feed every devotee and visitor who comes for darshan",
    description:
      "Sponsor sanctified prasadam for the devotees, guests and the needy who come to the temple on Vijayadashami.",
    tiers: [
      { label: "Rs. 1,100", amount: 1100 },
      { label: "Rs. 2,100", amount: 2100 },
      { label: "Rs. 3,100", amount: 3100 },
      { label: "Rs. 5,555", amount: 5555 },
      { label: "Rs. 9,000", amount: 9000 },
      { label: "Rs. 11,000", amount: 11000 },
    ],
    category: "Vijayadashami",
    account: "default",
    icon: "🍚",
  },
  {
    slug: "gau-seva",
    title: "Gau Seva",
    shortTitle: "Gau Seva",
    image: "/assets/donations-gau-seva-real.jpeg",
    tagline: "Protect and nourish the cows at our goshala",
    description:
      "Offer Gau Poshana Seva — fodder, green grass, medicines and daily care for the cows at the temple goshala.",
    tiers: [
      { label: "Rs. 1,500", amount: 1500 },
      { label: "Rs. 2,500", amount: 2500 },
      { label: "Rs. 3,500", amount: 3500 },
      { label: "Rs. 5,500", amount: 5500 },
      { label: "Rs. 9,500", amount: 9500 },
      { label: "Rs. 11,500", amount: 11500 },
    ],
    category: "Vijayadashami",
    account: "default",
    icon: "🐄",
  },
  {
    slug: "yajamana-seva",
    title: "Yajamana Seva",
    shortTitle: "Yajamana",
    image: "/assets/temple-seva.jpg",
    tagline: "Be the principal sponsor of the Vijayadashami celebrations",
    description:
      "The chief sponsor of the festival — sankalpa is taken in your name and gotra, and the day's worship is offered on your behalf.",
    tiers: [
      { label: "Rs. 11,000", amount: 11000 },
      { label: "Rs. 15,000", amount: 15000 },
      { label: "Rs. 25,555", amount: 25555 },
      { label: "Rs. 51,000", amount: 51000 },
      { label: "Rs. 75,000", amount: 75000 },
      { label: "Rs. 1,08,000", amount: 108000 },
    ],
    category: "Vijayadashami",
    account: "default",
    icon: "🪔",
  },
  {
    slug: "pushpalankara-seva",
    title: "Pushpalankara Seva",
    shortTitle: "Pushpalankara",
    image: "/assets/janmashtami-sk2.webp",
    tagline: "Offer the flower decoration for Their Lordships",
    description:
      "Sponsor the fresh flower alankara for Sri Sri Radha Madan Mohan — garlands, floral canopy and the altar decoration.",
    tiers: [
      { label: "Rs. 1,100", amount: 1100 },
      { label: "Rs. 2,100", amount: 2100 },
      { label: "Rs. 3,100", amount: 3100 },
      { label: "Rs. 5,100", amount: 5100 },
      { label: "Rs. 9,000", amount: 9000 },
      { label: "Rs. 11,111", amount: 11111 },
    ],
    category: "Vijayadashami",
    account: "default",
    icon: "🌺",
  },
  {
    slug: "mantapa-seva",
    title: "Mantapa Seva",
    shortTitle: "Mantapa",
    image: "/assets/gallery-festival-1.jpg",
    tagline: "Sponsor the festival mantapa and altar decoration",
    description:
      "The decorated pavilion in which Their Lordships are seated for the festival — drapery, lighting and ornamental work.",
    tiers: [
      { label: "Rs. 1,100", amount: 1100 },
      { label: "Rs. 3,100", amount: 3100 },
      { label: "Rs. 5,100", amount: 5100 },
      { label: "Rs. 9,000", amount: 9000 },
      { label: "Rs. 15,111", amount: 15111 },
      { label: "Rs. 21,000", amount: 21000 },
    ],
    category: "Vijayadashami",
    account: "default",
    icon: "🛕",
  },
  {
    slug: "vastrabharana-seva",
    title: "Vastrabharana Seva",
    shortTitle: "Vastrabharana",
    image:
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677419371-1783677418690-DietyPhotos.jpeg",
    tagline: "Offer new garments and ornaments to the Deities",
    description:
      "Sponsor the silk vastra and abharana worn by Sri Sri Radha Madan Mohan for the Vijayadashami darshan.",
    tiers: [
      { label: "Rs. 1,100", amount: 1100 },
      { label: "Rs. 3,100", amount: 3100 },
      { label: "Rs. 5,100", amount: 5100 },
      { label: "Rs. 9,999", amount: 9999 },
      { label: "Rs. 15,000", amount: 15000 },
      { label: "Rs. 21,000", amount: 21000 },
    ],
    category: "Vijayadashami",
    account: "default",
    icon: "👗",
  },
  {
    slug: "vijayadashami-homam",
    title: "Vijayadashami Homam",
    shortTitle: "Homam",
    image: "/assets/gallery-aarti.jpg",
    tagline: "Sponsor the sacred fire sacrifice on Vijayadashami",
    description:
      "Performed for victory over obstacles and the wellbeing of your family — sankalpa and ahuti offered in your name.",
    tiers: [
      { label: "Rs. 2,500", amount: 2500 },
      { label: "Rs. 5,100", amount: 5100 },
      { label: "Rs. 7,777", amount: 7777 },
      { label: "Rs. 11,000", amount: 11000 },
      { label: "Rs. 15,000", amount: 15000 },
      { label: "Rs. 21,000", amount: 21000 },
    ],
    category: "Vijayadashami",
    account: "default",
    icon: "🔥",
  },
];

// What each amount actually funds, shown under the figure on the amount tile
// (the same treatment /pitru-paksha uses).
//
// Annadana is computed from the temple's own Anna Daan rate in sevaConfig.ts
// (Rs. 250 / 10 plates = Rs. 25 a plate), which is also what /pitru-paksha
// uses — Rs. 1,100 reads as 44 meals on both pages.
//
// The first three Gau Seva lines are the temple's own tier wording from
// sevaConfig.ts. The last three amounts have no published per-unit rate, so
// they carry a qualitative line rather than a figure invented from a rate
// that does not exist — replace them if the goshala gives exact numbers.
//
// A seva absent from this map simply shows the amount with no second line.
const IMPACTS: Record<string, Record<number, string>> = {
  "annadana-seva": {
    1100: "44 meals",
    2100: "84 meals",
    3100: "124 meals",
    5555: "222 meals",
    9000: "360 meals",
    11000: "440 meals",
  },
  "gau-seva": {
    1500: "10 cows · a day",
    2500: "Medicines & care",
    3500: "1 cow · a month",
    5500: "Fodder & upkeep",
    9500: "Green grass, all cows",
    11500: "A month of full care",
  },
};

const TRUST_BADGES = [
  { icon: FileCheck2, label: "80G Tax Exemption" },
  { icon: UtensilsCrossed, label: "Mahaprasadam Sent" },
  { icon: Clock, label: "Instant Confirmation" },
  { icon: ShieldCheck, label: "Secure Razorpay Checkout" },
];

const HIGHLIGHTS = [
  {
    icon: Flame,
    title: "Vijaya — the day of victory",
    text: "Vijayadashami marks the Lord's victory over adharma. Any undertaking begun on this day is said to carry that same blessing of success.",
  },
  {
    icon: Sparkles,
    title: "Ayudha Puja & Saraswati Puja",
    text: "Tools, instruments and books are placed before the Lord and worshipped, acknowledging that every skill we hold is His gift.",
  },
  {
    icon: Heart,
    title: "Seva in your family's name",
    text: "Every seva is offered with sankalpa in your name and gotra, and your receipt reaches you on WhatsApp.",
  },
];

const formatAmount = (amount: number) => amount.toLocaleString("en-IN");

type Selection = { seva: Seva; amount: number | null };

export default function VijayadashamiClient() {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<Selection | null>(null);
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const introRef = useRef<HTMLDivElement | null>(null);
  const introInView = useInView(introRef, { once: true, margin: "-80px" });

  // Ad / reminder deep-link: /vijayadashami?seva=annadana-seva scrolls to and
  // highlights that card. Read from window rather than useSearchParams so the
  // page needs no Suspense boundary.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("seva");
    if (!slug) return;
    if (!SEVAS.some((seva) => seva.slug === slug)) return;
    setHighlightedSlug(slug);
    const timer = window.setTimeout(() => {
      document
        .getElementById(`seva-card-${slug}`)
        ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    }, 400);
    return () => window.clearTimeout(timer);
  }, [reduce]);

  // Picking an amount swaps the grid for the checkout form — bring it into
  // view so the donor isn't left looking at an apparently unchanged screen.
  useEffect(() => {
    if (!selected) return;
    const timer = window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [selected, reduce]);

  return (
    <PageLayout>
      <div className="overflow-x-hidden bg-white pt-[var(--header-h)]">
        {/* ── HERO ────────────────────────────────────────────────── */}
        <section className="relative">
          <picture>
            <source media="(max-width: 640px)" srcSet={MOBILE_BANNER} />
            <img
              src={DESKTOP_BANNER}
              alt="Vijayadashami celebrations at ISKCON Gambheeram Visakhapatnam"
              className="block h-auto w-full"
            />
          </picture>
        </section>

        {/* ── INTRO ───────────────────────────────────────────────── */}
        <section className="vk-section bg-gradient-to-b from-vk-50 to-white" ref={introRef}>
          <div className="vk-container">
            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 24 }}
              animate={introInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-3xl text-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-vk-200 bg-white px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.08em] text-vk-700">
                <CalendarDays className="h-3.5 w-3.5" />
                <time dateTime={FESTIVAL_DATE_ISO}>{FESTIVAL_DATE_LABEL}</time>
              </span>
              <h1 className="mt-5 text-3xl font-black leading-tight text-ink md:text-5xl">
                Vijayadashami Seva at ISKCON Gambheeram
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                On the tenth day of Navaratri the Lord&apos;s victory over adharma is celebrated with
                abhishekam, homam, grand alankara and Annadana for everyone who comes for darshan.
                Offer a seva below and your sankalpa will be made in your name on the day.
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-vk-700">
                <MapPin className="h-4 w-4" />
                Hare Krishna Vaikuntham, Gambheeram, Visakhapatnam
              </p>
            </motion.div>

            <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
              {HIGHLIGHTS.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={reduce ? undefined : { opacity: 0, y: 20 }}
                  animate={introInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="vk-card p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-vk-100 text-vk-700">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEVAS ───────────────────────────────────────────────── */}
        <section className="vk-section bg-white" id="offer-seva">
          <div className="vk-container">
            <SectionHeading
              align="center"
              eyebrow="Choose Your Offering"
              title="Vijayadashami Sevas"
              subtitle="Tap an amount to offer that seva. Receipts are sent on WhatsApp."
            />

            <AnimatePresence mode="wait">
              {!selected ? (
                <motion.div
                  key="grid"
                  initial={reduce ? undefined : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mx-auto flex max-w-6xl flex-wrap justify-center gap-5 md:gap-6"
                >
                  {SEVAS.map((seva) => (
                    <article
                      key={seva.slug}
                      id={`seva-card-${seva.slug}`}
                      className={`vk-card vk-card-hover group flex w-full scroll-mt-24 flex-col overflow-hidden sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] ${
                        highlightedSlug === seva.slug ? "ring-2 ring-vk-500 ring-offset-2" : ""
                      }`}
                    >
                      {/* Card image with navy scrim + title */}
                      <div className="relative h-44 overflow-hidden bg-vk-900 md:h-48">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={seva.image}
                          alt={seva.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-vk-900/90 via-vk-900/30 to-transparent" />
                        <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
                          <span className="text-2xl drop-shadow" aria-hidden>
                            {seva.icon}
                          </span>
                          <h3 className="text-lg font-bold text-white drop-shadow-md md:text-xl">
                            {seva.title}
                          </h3>
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="flex flex-1 flex-col p-4 sm:p-5">
                        <p className="min-h-[40px] text-[13px] leading-relaxed text-muted-foreground md:text-sm">
                          {seva.description}
                        </p>
                        <div className="mt-4 space-y-2.5">
                          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                            {seva.tiers.map((tier) => (
                              <button
                                key={tier.amount}
                                type="button"
                                onClick={() => setSelected({ seva, amount: tier.amount })}
                                className="group/amt flex min-h-[64px] flex-col items-center justify-center rounded-xl border-[1.5px] border-[hsl(var(--gold)/0.6)] bg-[hsl(var(--gold)/0.1)] px-1 py-2 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-gold hover:shadow-gold sm:min-h-[68px] sm:px-1.5"
                              >
                                <span
                                  className="block whitespace-nowrap text-[17px] font-extrabold leading-none tracking-tight text-ink sm:text-lg"
                                  style={{ fontFamily: "var(--font-heading)" }}
                                >
                                  <span className="mr-px text-[0.85em] text-[hsl(var(--gold-deep))] group-hover/amt:text-ink">
                                    ₹
                                  </span>
                                  {formatAmount(tier.amount)}
                                </span>
                                {IMPACTS[seva.slug]?.[tier.amount] && (
                                  <span className="mt-1.5 block text-[10.5px] font-semibold leading-[1.2] text-ink/60 group-hover/amt:text-ink/80 sm:text-[11px]">
                                    {IMPACTS[seva.slug][tier.amount]}
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelected({ seva, amount: null })}
                            className="flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-vk-300 bg-vk-50 px-3 py-3 text-[13px] font-bold text-vk-800 transition-all duration-200 hover:border-vk-500 hover:bg-vk-100"
                          >
                            <svg
                              className="h-3 w-3 text-vk-600"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              aria-hidden
                            >
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            <span>Donate Other Amount</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={reduce ? undefined : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-5 text-center">
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="vk-btn-outline h-10 px-4 text-xs"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" /> Change Seva
                    </button>
                  </div>

                  <div ref={formRef} className="mx-auto w-full max-w-4xl scroll-mt-28">
                    <DonationForm
                      seva={selected.seva}
                      sourcePage="vijayadashami"
                      festivalSlug="vijayadashami"
                      bannerImage={DESKTOP_BANNER}
                      initialAmount={selected.amount ?? undefined}
                      startCustom={selected.amount === null}
                      thankYouType="seva"
                      thankYouSource="the Vijayadashami seva programme"
                      trackContentName="Vijayadashami"
                      variant="grid"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trust badges */}
            <div className="mx-auto mt-10 max-w-3xl">
              <p className="text-center text-[12px] font-bold uppercase tracking-[0.08em] text-vk-700" aria-hidden>
                Payment made safe &amp; simple
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                {TRUST_BADGES.map((badge) => (
                  <span
                    key={badge.label}
                    className="inline-flex items-center gap-2 rounded-full border border-vk-100 bg-white py-1.5 pl-1.5 pr-4 text-xs font-semibold text-vk-800 shadow-card md:text-sm"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-vk-100 text-vk-700">
                      <badge.icon className="h-3.5 w-3.5" />
                    </span>
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              80G Tax Exemption available · Secured by Razorpay · Donations go to Hare Krishna Movement
              India, Visakhapatnam
            </p>
          </div>
        </section>

        {/* Direct PhonePe / UPI payment, for donors who can't use Razorpay */}
        <PhonePeUpiCard campaign="Vijayadashami" />
      </div>
    </PageLayout>
  );
}
