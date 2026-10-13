"use client";

import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import DonationForm from "@/components/DonationForm";
import PhonePeUpiCard from "@/components/PhonePeUpiCard";
import FaqSection from "@/components/sqft-campaign/FaqSection";
import DonorPrivilegesSection from "@/components/sqft-campaign/DonorPrivilegesSection";
import OtherDonationsCarousel from "@/components/pitru-paksha/OtherDonationsCarousel";
import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock,
  Copy,
  FileCheck2,
  Flame,
  Gift,
  Heart,
  MapPin,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Sunrise,
  UtensilsCrossed,
  X,
} from "lucide-react";
import type { Seva } from "@/lib/sevaConfig";
import type { CampaignConfig } from "@/lib/campaignConfig";

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

// Bhagavad-gita 4.8 — the Lord's own statement of why He appears, which is
// what Vijayadashami celebrates. The rendering below is a plain paraphrase,
// not a quotation from any particular published translation.
const SHLOKA = {
  sanskrit: [
    "paritāṇāya sādhūnāṁ vināśāya ca duṣkṛtām",
    "dharma-saṁsthāpanārthāya sambhavāmi yuge yuge",
  ],
  meaning:
    "To protect the devoted, to put an end to those who do harm, and to re-establish dharma, I appear in every age.",
  source: "Bhagavad-gita 4.8",
};

const REASONS = [
  {
    icon: Flame,
    title: "The day victory is granted",
    text: "Vijayadashami is the tenth day, when the Lord's victory over adharma is complete. Seva offered now is traditionally held to clear the obstacles standing in a family's way.",
  },
  {
    icon: Sunrise,
    title: "An auspicious beginning",
    text: "Anything begun on Vijayadashami — a study, a business, a vow — is said to carry the day's blessing. Many families start the year's charity here.",
  },
  {
    icon: ScrollText,
    title: "Ayudha & Saraswati Puja",
    text: "Tools, instruments and books are placed before the Lord and worshipped, acknowledging that every skill a person holds was given, not earned.",
  },
  {
    icon: Heart,
    title: "Charity that keeps giving",
    text: "Your offering feeds visitors, cares for the goshala cows and sustains the worship performed every single day at Hare Krishna Vaikuntham.",
  },
];

const PRIVILEGES = [
  {
    icon: ScrollText,
    title: "Sankalpa in your name",
    text: "The seva is offered with sankalpa in your name and your family's gotra on the festival day itself.",
  },
  {
    icon: FileCheck2,
    title: "80G tax exemption",
    text: "Every donation is eligible for 80G. Add your PAN at checkout and the exemption receipt is issued against it.",
  },
  {
    icon: Clock,
    title: "Receipt on WhatsApp",
    text: "Your receipt reaches your WhatsApp as soon as the payment is confirmed — no waiting, no follow-up call.",
  },
  {
    icon: Gift,
    title: "Maha Prasadam at home",
    text: "Ask for Maha Prasadam at checkout and sanctified prasadam is posted to the address you give us.",
  },
];

// Config for the shared <DonorPrivilegesSection>. That component only reads
// `type`, `unitName` and `engravingImage` — its privilege copy and both
// carousels (Donor Privileges and Other Privileges) are its own, which is
// exactly what we want here: the same block the Pitru Paksha and Square Foot
// pages show. type "SQFT" selects the generic carousel; "BRICK" would switch
// it to the laser-engraving lede, which is not relevant to a festival seva.
// The remaining fields exist only to satisfy CampaignConfig, and `privileges`
// is filled in properly so it stays correct if the component ever reads it.
const VIJAYADASHAMI_PRIVILEGE_CONFIG: CampaignConfig = {
  type: "SQFT",
  pageTitle: "Vijayadashami Seva",
  metaTitle: "Vijayadashami Seva | Hare Krishna Vaikuntham Temple, Visakhapatnam",
  metaDesc:
    "Offer Annadana, Gau Seva, Yajamana, Pushpalankara, Mantapa, Vastrabharana and Homam seva for Vijayadashami.",
  ogTitle: "Vijayadashami Seva",
  ogDesc: "Offer your seva on the day of the Lord's victory over adharma.",
  ogImage: DESKTOP_BANNER,
  pricePerUnit: 100,
  unitName: "seva",
  unitNamePlural: "sevas",
  unitShort: "seva",
  minCustomAmount: 100,
  phone: "+91 89777 61187",
  phoneHref: "tel:+918977761187",
  email: "social@hkmvizag.org",
  heroImage: DESKTOP_BANNER,
  aboutImage: DESKTOP_BANNER,
  heroTagline: "A seva initiative of Hare Krishna Movement Visakhapatnam",
  heroHeading1: "Vijayadashami",
  heroHeading2: "Seva Online",
  heroDesc:
    "Offer Annadana, Gau Seva and the festival sevas on the tenth day of Navaratri.",
  formHeading: "Offer Your Seva",
  formSubheading: "Sankalpa is taken in your name on the festival day.",
  privileges: PRIVILEGES,
  higherPrivileges: [],
  statsApiEndpoint: "",
  orderType: "VIJAYADASHAMI",
};

const BANK_DETAILS = [
  { label: "Beneficiary Name", value: "HARE KRISHNA MOVEMENT INDIA" },
  { label: "Bank Name", value: "IDFC FIRST BANK LTD" },
  { label: "A/c No", value: "10091415313" },
  { label: "IFSC Code", value: "IDFB0080412" },
];

const FAQS = [
  {
    q: "When is Vijayadashami 2026 and when is my seva performed?",
    a: "Vijayadashami falls on Tuesday, 20 October 2026. Every seva booked up to that morning is offered on the day itself, during the festival worship at Hare Krishna Vaikuntham, Gambheeram.",
  },
  {
    q: "Will the sankalpa be taken in my name?",
    a: "Yes. Enter the name the seva should be offered under in the 'Sevak name' field at checkout — you can give your own name, a family member's, or the name of someone you wish to offer it for. The gotra is taken along with it.",
  },
  {
    q: "Do I get an 80G tax exemption receipt?",
    a: "Yes, all donations to Hare Krishna Movement India are eligible for 80G. Tick the 80G option at checkout and enter your PAN; the exemption receipt is issued against that PAN and sent with your donation receipt.",
  },
  {
    q: "How will I receive my receipt?",
    a: "Your receipt is sent to your WhatsApp number as soon as the payment is confirmed, usually within a minute. If it has not arrived in ten minutes, call us on the number above and we will resend it.",
  },
  {
    q: "Can I offer more than one seva?",
    a: "Yes. Complete one seva, then pick the next from the list — each is recorded and receipted separately, so you get a separate 80G receipt for each.",
  },
  {
    q: "Can I pay by UPI or bank transfer instead?",
    a: "Yes. Use the UPI card on this page, or the NEFT/RTGS details below. For UPI and bank transfers, please WhatsApp us a screenshot with your name, mobile, address and PAN so we can issue your receipt against the right donor.",
  },
  {
    q: "Is there a minimum donation?",
    a: "Yes, the smallest donation we can accept is Rs. 100. Below that the payment-gateway and receipting costs leave nothing for the seva itself.",
  },
];

const formatAmount = (amount: number) => amount.toLocaleString("en-IN");

type Selection = { seva: Seva; amount: number | null };

export default function VijayadashamiClient() {
  const [selected, setSelected] = useState<Selection | null>(null);
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const scrolledRef = useRef(false);

  // Land the donor on the sevas, not the banner. Most arrivals come from an
  // ad or a WhatsApp broadcast that already showed them the artwork, so the
  // top of the page is a second look at something they have seen.
  //
  // A ?seva= deep link (used by the pending-payment reminder) wins: it goes
  // to that specific card instead of the top of the grid. Both run through
  // this one effect so they can never fight each other mid-scroll.
  useEffect(() => {
    if (scrolledRef.current) return;
    scrolledRef.current = true;
    const slug = new URLSearchParams(window.location.search).get("seva");
    const matched = slug && SEVAS.some((seva) => seva.slug === slug) ? slug : null;
    if (matched) setHighlightedSlug(matched);
    const targetId = matched ? `seva-card-${matched}` : "offer-seva";
    const timer = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: matched ? "center" : "start",
      });
    }, 450);
    return () => window.clearTimeout(timer);
  }, []);

  // Modal housekeeping: lock the page behind it and close on Escape.
  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  // The shared privileges section ends in an "Offer Seva" CTA and expects
  // the page to supply the scroll.
  const scrollToDonate = () => {
    document.getElementById("offer-seva")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copyField = (label: string, value: string) => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopiedField(label);
    window.setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <PageLayout>
      <div className="overflow-x-hidden bg-white pt-[var(--header-h)]">
        {/* ══ HERO ══════════════════════════════════════════ */}
        <section className="bg-gradient-to-b from-vk-50 to-white">
          <a href="#offer-seva" className="block bg-vk-900">
            <picture>
              <source media="(max-width: 640px)" srcSet={MOBILE_BANNER} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={DESKTOP_BANNER}
                alt="Vijayadashami celebrations at ISKCON Gambheeram Visakhapatnam"
                className="block h-auto w-full"
              />
            </picture>
          </a>
        </section>

        {/* ══ SEVAS ═════════════════════════════════════════ */}
        <section id="offer-seva" className="vk-section scroll-mt-24">
          <div className="vk-container">
            <SectionHeading
              align="center"
              eyebrow="Choose Your Offering"
              title="Vijayadashami Sevas"
              subtitle="Tap an amount to offer that seva. Sankalpa is taken in your name and your receipt reaches you on WhatsApp."
            />

            <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-5 md:gap-6">
              {SEVAS.map((seva) => (
                <article
                  key={seva.slug}
                  id={`seva-card-${seva.slug}`}
                  className={`vk-card vk-card-hover group flex w-full scroll-mt-24 flex-col overflow-hidden sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] ${
                    highlightedSlug === seva.slug ? "ring-2 ring-vk-500 ring-offset-2" : ""
                  }`}
                >
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
            </div>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              Minimum donation Rs. 100 · 80G Tax Exemption available · Secured by Razorpay ·
              Donations go to Hare Krishna Movement India, Visakhapatnam
            </p>
          </div>
        </section>

        {/* Direct PhonePe / UPI payment, for donors who can't use Razorpay */}
        <PhonePeUpiCard campaign="Vijayadashami" />

        {/* ══ INTRO + SHLOKA ═══════════════════════════════════ */}
        <section className="vk-section vk-band">
          <div className="vk-container">
            <Reveal className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.35fr_0.65fr] md:items-center">
              <div>
                <span className="vk-pill mb-4">Hare Krishna Movement</span>
                <h1 className="vk-h1">Vijayadashami</h1>
                <p className="mt-4 inline-flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-vk-700">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" />
                    <time dateTime={FESTIVAL_DATE_ISO}>{FESTIVAL_DATE_LABEL}</time>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    Hare Krishna Vaikuntham, Gambheeram
                  </span>
                </p>
                <p className="vk-lead mt-5 max-w-4xl md:text-lg md:leading-8">
                  On the tenth day of Navaratri the Lord&apos;s victory over adharma is complete. At
                  Hare Krishna Vaikuntham the day is kept with abhishekam, the Vijayadashami homam,
                  a grand flower alankara for Sri Sri Radha Madan Mohan, and Annadana for every
                  person who comes for darshan. Offer a seva and your sankalpa is made in your name
                  on the day.
                </p>
                <a href="#offer-seva" className="vk-btn-gold mt-6 inline-flex h-12 px-7 text-[15px] font-bold">
                  Offer Your Seva
                </a>
              </div>

              <div className="vk-card p-6 md:p-7">
                <span className="vk-icon-chip">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div className="mt-4 space-y-1.5 font-serif-display text-[15px] italic leading-7 text-vk-800 md:text-base">
                  {SHLOKA.sanskrit.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <p className="mt-4 border-l-4 border-vk-300 pl-4 text-sm leading-6 text-muted-foreground">
                  {SHLOKA.meaning}
                </p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-vk-700">
                  {SHLOKA.source}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ TRUST BADGES ═════════════════════════════════════ */}
        <section className="border-y border-vk-100 bg-white py-4">
          <div className="vk-container flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {TRUST_BADGES.map((badge) => (
              <span
                key={badge.label}
                className="inline-flex items-center gap-2 text-xs font-semibold text-vk-800 md:text-sm"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-vk-100 text-vk-700">
                  <badge.icon className="h-3.5 w-3.5" />
                </span>
                {badge.label}
              </span>
            ))}
          </div>
        </section>

        {/* ══ WHY THIS DAY ═════════════════════════════════════ */}
        <section className="vk-section">
          <div className="vk-container">
            <SectionHeading
              align="center"
              eyebrow="Why Vijayadashami"
              title="The Day Victory Is Granted"
              subtitle="Four reasons families choose this day above any other to offer their seva for the year."
            />
            <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {REASONS.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.06} className="vk-card h-full p-6">
                  <span className="vk-icon-chip">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ BANK TRANSFER ════════════════════════════════════ */}
        <section className="pt-10 md:pt-16">
          <div className="vk-container">
            <div className="mx-auto max-w-6xl rounded-2xl border border-vk-100 bg-vk-50 px-5 py-4 text-sm leading-7 text-ink/80 md:text-base">
              While making UPI or bank payments, please send a screenshot with your name, mobile,
              address and PAN details to our WhatsApp{" "}
              <a className="font-bold text-vk-700 hover:text-vk-500" href="tel:+918977761187">
                +91 89777 61187
              </a>{" "}
              or email{" "}
              <a
                className="break-all font-bold text-vk-700 hover:text-vk-500"
                href="mailto:social@hkmvizag.org"
              >
                social@hkmvizag.org
              </a>
              , so your receipt is issued against the right donor.
            </div>
          </div>
        </section>

        <section className="pb-10 pt-5 md:pb-16 md:pt-6">
          <div className="vk-container">
            <div className="vk-card mx-auto max-w-6xl p-5 md:p-8">
              <h2 className="vk-bar-title text-lg text-ink md:text-xl">
                Donation Through Bank (NEFT / RTGS)
              </h2>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {BANK_DETAILS.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-xl bg-vk-50 p-4 text-sm text-ink"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="block text-xs font-medium text-muted-foreground">
                        {label}:
                      </span>
                      <span className="mt-0.5 block select-all break-words font-semibold">
                        {value}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyField(label, value)}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-vk-500 transition-colors hover:bg-white hover:text-vk-700"
                      title={`Copy ${label}`}
                    >
                      {copiedField === label ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ DONOR PRIVILEGES — the shared block, same as /pitru-paksha ═════ */}
        <DonorPrivilegesSection
          scrollToDonate={scrollToDonate}
          config={VIJAYADASHAMI_PRIVILEGE_CONFIG}
        />

        {/* ══ FAQ ═══════════════════════════════════════════ */}
        <FaqSection faqs={FAQS} tone="blue" />

        {/* ══ OTHER SEVAS ══════════════════════════════════════ */}
        <OtherDonationsCarousel />
      </div>

      {/* ══ CHECKOUT MODAL ═══════════════════════════════════ */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-vk-900/70 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Offer ${selected.seva.title}`}
          onMouseDown={(event) => {
            // Backdrop only — a drag that starts inside the panel must not close it.
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <div className="vijd-modal relative max-h-[92vh] w-full max-w-2xl overflow-y-auto overflow-x-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
            <style>{`
              .vijd-modal::-webkit-scrollbar { width: 6px; }
              .vijd-modal::-webkit-scrollbar-track { background: transparent; }
              .vijd-modal::-webkit-scrollbar-thumb { background: #B9C8FB; border-radius: 9999px; }
            `}</style>

            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-vk-100 bg-white/95 px-5 py-3.5 backdrop-blur">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-vk-600">
                  Vijayadashami Seva
                </p>
                <p className="truncate text-base font-bold text-ink">{selected.seva.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-vk-600 transition-colors hover:bg-vk-50 hover:text-vk-800"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5">
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
                variant="stacked"
              />
            </div>
          </div>
        </div>
      )}

      {/* ══ STICKY MOBILE DONATE BAR ════════════════════════════ */}
      {!selected && (
        <div className="fixed bottom-[calc(var(--bottom-nav-space)+4px+env(safe-area-inset-bottom))] left-3 right-[76px] z-40 lg:hidden">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-vk-100 bg-white/95 p-2 pl-4 shadow-lift backdrop-blur">
            <span className="min-w-0 truncate text-[13px] font-semibold text-vk-800">
              Vijayadashami Seva
            </span>
            <a href="#offer-seva" className="vk-btn-gold h-11 shrink-0 px-5">
              Offer Seva
            </a>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
