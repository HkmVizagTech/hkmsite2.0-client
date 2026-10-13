"use client";

import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/site/SectionHeading";
import DonationForm from "@/components/DonationForm";
import { motion, useInView, useReducedMotion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
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
// Donors can also enter any amount — DonationForm always renders a
// custom-amount field beneath the tiers.
const SEVAS: Seva[] = [
  {
    slug: "annadana-seva",
    title: "Annadana Seva",
    shortTitle: "Annadana",
    image: "/assets/donations-annadana-real.jpg",
    tagline: "Feed every devotee and visitor who comes for darshan",
    description:
      "Sponsor sanctified prasadam for the devotees, guests and the needy who come to the temple on Vijayadashami. Annadana is the one offering the scriptures call greater than all others, and it is eligible for 80G tax exemption.",
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
      "Offer Gau Poshana Seva on Vijayadashami — fodder, green grass, medicines and daily care for the cows residing at the temple goshala. Serving the cow is held to please the Lord as directly as serving Him. Eligible for 80G tax exemption.",
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
      "The Yajamana is the chief sponsor of the festival — the one in whose name the day's worship, homam and offerings are performed. Sankalpa is taken in your name and your family's gotra, and prasadam is sent to your home.",
    tiers: [
      { label: "Rs. 11,000", amount: 11000 },
      { label: "Rs. 25,555", amount: 25555 },
      { label: "Rs. 51,000", amount: 51000 },
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
      "Sponsor the fresh flower alankara for Sri Sri Radha Madan Mohan on Vijayadashami — garlands, floral canopy and the decoration of the altar on the day the Lord's victory is celebrated.",
    tiers: [
      { label: "Rs. 1,100", amount: 1100 },
      { label: "Rs. 2,100", amount: 2100 },
      { label: "Rs. 3,100", amount: 3100 },
      { label: "Rs. 5,100", amount: 5100 },
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
      "The mantapa is the decorated pavilion in which Their Lordships are seated for the festival. Sponsoring it covers the drapery, lighting and ornamental work that frames the darshan every visitor receives that day.",
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
      "Sponsor the silk vastra and the abharana — the ornaments worn by Sri Sri Radha Madan Mohan on Vijayadashami. The garments offered on this day are worn for the festival darshan and kept in the Deities' wardrobe thereafter.",
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
      "The Vijayadashami homam is performed for victory over obstacles, for protection and for the wellbeing of the sponsor's family. Sankalpa is offered in your name and the ahuti is made on your behalf.",
    tiers: [
      { label: "Rs. 2,500", amount: 2500 },
      { label: "Rs. 7,777", amount: 7777 },
      { label: "Rs. 11,000", amount: 11000 },
      { label: "Rs. 21,000", amount: 21000 },
    ],
    category: "Vijayadashami",
    account: "default",
    icon: "🔥",
  },
];

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
    text: "Every seva is offered with sankalpa in your name and gotra, and your receipt reaches you on WhatsApp the same day.",
  },
];

const lowestTier = (seva: Seva) =>
  seva.tiers.reduce((min, tier) => (tier.amount < min ? tier.amount : min), seva.tiers[0].amount);

// Most sevas have one fixed price, so "From Rs. X" would be misleading;
// only the sevas that really do offer a range say "From".
const priceLabel = (seva: Seva) =>
  `${seva.tiers.length > 1 ? "From " : ""}Rs. ${formatAmount(lowestTier(seva))}`;

const formatAmount = (amount: number) => amount.toLocaleString("en-IN");

export default function VijayadashamiClient() {
  const reduce = useReducedMotion();
  const [selectedSeva, setSelectedSeva] = useState<Seva | null>(null);
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const introRef = useRef<HTMLDivElement | null>(null);
  const sevaRef = useRef<HTMLDivElement | null>(null);
  const introInView = useInView(introRef, { once: true, margin: "-80px" });
  const sevaInView = useInView(sevaRef, { once: true, margin: "-80px" });

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

  // Choosing a seva swaps the grid for the checkout form, which sits much
  // further down the page — bring it into view so the donor isn't left
  // looking at an unchanged screen.
  useEffect(() => {
    if (!selectedSeva) return;
    const timer = window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [selectedSeva, reduce]);

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
                  className="rounded-2xl border border-vk-100 bg-white p-6 shadow-card"
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
        <section className="vk-section bg-white" id="offer-seva" ref={sevaRef}>
          <div className="vk-container">
            <SectionHeading
              eyebrow="Vijayadashami Sevas"
              title="Offer Your Seva"
              subtitle="Choose a seva below, then pick your offering amount. Receipts are sent on WhatsApp."
              align="center"
            />

            <AnimatePresence mode="wait">
              {!selectedSeva ? (
                <motion.div
                  key="grid"
                  initial={reduce ? undefined : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {SEVAS.map((seva, i) => (
                    <motion.button
                      key={seva.slug}
                      id={`seva-card-${seva.slug}`}
                      type="button"
                      onClick={() => setSelectedSeva(seva)}
                      initial={reduce ? undefined : { opacity: 0, y: 20 }}
                      animate={sevaInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.45, delay: 0.06 * i }}
                      whileHover={reduce ? undefined : { y: -4 }}
                      className={`group flex scroll-mt-28 flex-col overflow-hidden rounded-2xl border bg-white text-left shadow-card transition-colors duration-300 ${
                        highlightedSlug === seva.slug
                          ? "border-vk-500 ring-2 ring-vk-500/30"
                          : "border-vk-100 hover:border-vk-400"
                      }`}
                    >
                      <div className="relative h-44 w-full overflow-hidden bg-vk-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={seva.image}
                          alt={seva.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-ink">
                          <span aria-hidden className="text-xl leading-none">
                            {seva.icon}
                          </span>
                          {seva.title}
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {seva.tagline}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm font-semibold text-vk-800">
                            {priceLabel(seva)}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-vk-700">
                            Offer Seva
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </div>
                    </motion.button>
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
                      onClick={() => setSelectedSeva(null)}
                      className="vk-btn-outline h-10 px-4 text-xs"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" /> Change Seva
                    </button>
                  </div>

                  <div ref={formRef} className="mx-auto w-full max-w-4xl scroll-mt-28">
                    <DonationForm
                      seva={selectedSeva}
                      sourcePage="vijayadashami"
                      festivalSlug="vijayadashami"
                      bannerImage={DESKTOP_BANNER}
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
      </div>
    </PageLayout>
  );
}
