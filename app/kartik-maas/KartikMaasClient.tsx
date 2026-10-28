"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, CalendarDays, Check, Clock, Copy, FileCheck2, Flame, Gift, Heart, MapPin, ScrollText, ShieldCheck, Sunrise, UtensilsCrossed } from "lucide-react";
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
import { OrnamentDivider, PetalFall } from "@/components/festival/FestivalDecor";
import LampTracker, { useKartikDay } from "@/components/kartik/LampTracker";
import type { Seva } from "@/lib/sevaConfig";
import { SEVAS as DIWALI_SEVAS, IMPACTS as DIWALI_IMPACTS } from "@/lib/diwali";
import type { CampaignConfig } from "@/lib/campaignConfig";

// ── Festival constants ───────────────────────────────────────────────
// Kartik Maas 2026 runs from Sharad Purnima, 26 October, to
// Kartik Purnima, 24 November 2026. Update these next year.
const FESTIVAL_DATE_LABEL = "26 October – 24 November 2026";
const FESTIVAL_DATE_ISO = "2026-10-26";

const DESKTOP_BANNER = "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1792847552701-1792847546420-DamodaraMonthDesktop1920x730.png";
const MOBILE_BANNER = "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1792847553526-1792847550588-DamodaraMonthMobile962x1635.png";

// `category` is sent to the API as the donation `type`, and `title` as
// `sevaName`, together with festivalSlug "kartik-maas".
const SEVAS: Seva[] = [
  {
    slug: "deep-daan-1-month",
    title: "Deep Daan for 1 Month",
    shortTitle: "Deep Daan · 1 Month",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793155363450-1793155362796-templeshrine1500x1000.png",
    tagline: "A lamp offered daily through Damodar month",
    description:
      "Sponsor a ghee lamp offered to Sri Yashoda Damodara every day of the month, with your sankalpa in your name.",
    tiers: [
      { label: "Rs. 1,100", amount: 1100 },
      { label: "Rs. 2,100", amount: 2100 },
      { label: "Rs. 3,100", amount: 3100 },
      { label: "Rs. 5,555", amount: 5555 },
      { label: "Rs. 9,000", amount: 9000 },
      { label: "Rs. 11,000", amount: 11000 },
    ],
    category: "Kartik Maas",
    account: "default",
    icon: "🪔",
  },
  {
    slug: "108-deep-daan",
    title: "108 Deep Daan",
    shortTitle: "108 Deep Daan",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793155977517-1793155976914-108deepskrishnayashodha1500x1000.webp",
    tagline: "108 lamps offered to the Lord",
    description: "Sponsor 108 ghee lamps offered to Sri Yashoda Damodara during Damodar month.",
    tiers: [
      { label: "Rs. 1,100", amount: 1100 },
      { label: "Rs. 2,100", amount: 2100 },
      { label: "Rs. 3,100", amount: 3100 },
      { label: "Rs. 5,555", amount: 5555 },
      { label: "Rs. 9,000", amount: 9000 },
      { label: "Rs. 11,000", amount: 11000 },
    ],
    category: "Kartik Maas",
    account: "default",
    icon: "🪔",
  },
  {
    slug: "annadana-seva",
    title: "Annadana Seva",
    shortTitle: "Annadana",
    image: "/assets/donations-annadana-real.jpg",
    tagline: "Feed every devotee and visitor who comes for darshan",
    description:
      "Sponsor sanctified prasadam for the devotees, guests and the needy who come to the temple during Damodar month.",
    tiers: [
      { label: "Rs. 1,100", amount: 1100 },
      { label: "Rs. 2,100", amount: 2100 },
      { label: "Rs. 3,100", amount: 3100 },
      { label: "Rs. 5,555", amount: 5555 },
      { label: "Rs. 9,000", amount: 9000 },
      { label: "Rs. 11,000", amount: 11000 },
    ],
    category: "Kartik Maas",
    account: "default",
    icon: "🍚",
  },
  {
    slug: "gau-seva",
    title: "Gau Seva",
    shortTitle: "Gau Seva",
    image: "/assets/donations-gau-seva-real.jpeg",
    tagline: "Serve the cows Lord Damodar loved",
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
    category: "Kartik Maas",
    account: "default",
    icon: "🐄",
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
    category: "Kartik Maas",
    account: "default",
    icon: "🌺",
  },
  {
    slug: "vaishnav-bhojan-seva",
    title: "Vaishnav Bhojan Seva",
    shortTitle: "Vaishnav Bhojan",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1790144104776-1790144104666-sadhuBhojan.webp",
    tagline: "Serve a sanctified meal to Vaishnavas",
    description: "Serve a sanctified meal to Vaishnavas and saintly persons during Damodar month.",
    tiers: [
      { label: "Rs. 1,100", amount: 1100 },
      { label: "Rs. 2,100", amount: 2100 },
      { label: "Rs. 3,100", amount: 3100 },
      { label: "Rs. 5,555", amount: 5555 },
      { label: "Rs. 9,000", amount: 9000 },
      { label: "Rs. 11,000", amount: 11000 },
    ],
    category: "Kartik Maas",
    account: "default",
    icon: "🍽️",
  },
  // Brick Seva and Square Foot Seva: same cards, photos and amounts as the Diwali and Vaikuntha Ekadashi pages
  // (they are the Vaikuntham temple-construction sevas, so they carry the "BRICK" / "SQFT" donation type).
  ...DIWALI_SEVAS.filter((s) => s.slug === "brick-seva" || s.slug === "square-foot-seva"),
];

const IMPACTS: Record<string, Record<number, string>> = {
  "brick-seva": DIWALI_IMPACTS["brick-seva"],
  "square-foot-seva": DIWALI_IMPACTS["square-foot-seva"],
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

// Damodarashtakam, verse 1. The meaning is a plain paraphrase.
const SHLOKA = {
  sanskrit: [
    "namāmīśvaraṁ sac-cid-ānanda-rūpaṁ",
    "lasat-kuṇḍalaṁ gokule bhrājamānam",
  ],
  meaning:
    "I offer my obeisances to Lord Damodar, whose form is eternal, full of knowledge and bliss, whose earrings swing as He shines in Gokula.",
  source: "Damodarashtakam",
};

// The Damodar lila (Srimad Bhagavatam 10.9), told in three beats.
const LILA = [
  {
    n: "1",
    title: "The butter pot",
    text: "Little Krishna broke the pot of curd and butter and ran. Mother Yashoda, stick in hand, chased the Lord whom yogis cannot catch.",
  },
  {
    n: "2",
    title: "A rope two fingers short",
    text: "She caught Him and tried to bind Him to the wooden mortar. Whatever length she added, the rope fell two fingers short.",
  },
  {
    n: "3",
    title: "Bound by love",
    text: "When Krishna saw His mother tired and sweating, He allowed Himself to be bound. That is why He is called Damodara, the one bound at the belly by a rope.",
  },
  {
    n: "4",
    title: "Dragging the mortar",
    text: "Still bound, the little Lord crawled off, dragging the heavy mortar behind Him, toward the two tall arjuna trees in the courtyard.",
  },
  {
    n: "5",
    title: "The trees fall",
    text: "The mortar stuck crosswise between the trees. He pulled, and they crashed down, freeing two radiant souls, the cursed sons of Kuvera, who bowed and offered their prayers.",
  },
];

const REASONS = [
  {
    icon: Flame,
    title: "The dearest month",
    text: "Kartik is called Damodar month because the Lord, bound by Mother Yashoda's love, is worshipped with lamps through the whole of it.",
  },
  {
    icon: Sunrise,
    title: "A daily lamp to the Lord",
    text: "The heart of the month is the daily offering of a ghee lamp to Sri Yashoda Damodara, at home or at the temple, with steady remembrance of Krishna.",
  },
  {
    icon: ScrollText,
    title: "Damodarashtakam and chanting",
    text: "The eight-verse Damodarashtakam is sung during the lamp offering, with attentive chanting of the Hare Krishna maha-mantra and daily hearing of Krishna katha.",
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
    text: "The seva is offered with sankalpa in your name and your family's gotra throughout Damodar month.",
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
const KARTIK_MAAS_PRIVILEGE_CONFIG: CampaignConfig = {
  type: "SQFT",
  pageTitle: "Kartik Maas Seva",
  metaTitle: "Kartik Maas Seva | Hare Krishna Vaikuntham Temple, Visakhapatnam",
  metaDesc:
    "Offer Deep Daan, Annadana, Gau Seva, Pushpalankara and Vaishnav Bhojan seva in Damodar (Kartik) month.",
  ogTitle: "Kartik Maas Seva",
  ogDesc: "Offer your seva to Lord Damodar in the dearest month of the year.",
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
  heroHeading1: "Kartik Maas",
  heroHeading2: "Seva Online",
  heroDesc:
    "Offer Annadana, Gau Seva and the month's sevas to Lord Damodar.",
  formHeading: "Offer Your Seva",
  formSubheading: "Sankalpa is taken in your name for Damodar month.",
  privileges: PRIVILEGES,
  higherPrivileges: [],
  statsApiEndpoint: "",
  orderType: "KARTIK_MAAS",
};

const BANK_DETAILS = [
  { label: "Beneficiary Name", value: "HARE KRISHNA MOVEMENT INDIA" },
  { label: "Bank Name", value: "IDFC FIRST BANK LTD" },
  { label: "A/c No", value: "10091415313" },
  { label: "IFSC Code", value: "IDFB0080412" },
];

const FAQS = [
  {
    q: "When is Kartik Maas 2026 and when is my seva performed?",
    a: "Kartik month (Damodar masa) runs from 26 October to 24 November 2026. Your seva is offered during the month's daily worship at Hare Krishna Vaikuntham, Gambheeram, with sankalpa in your name.",
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

const FACTS = [
  { icon: CalendarDays, k: "26 Oct – 24 Nov", v: "Thirty days of Damodar Māsa" },
  { icon: MapPin, k: "Hare Krishna Vaikuntham", v: "Gambheeram, Visakhapatnam" },
  { icon: FileCheck2, k: "80G tax exemption", v: "Receipt against your PAN" },
  { icon: ShieldCheck, k: "Secure checkout", v: "Razorpay · receipt on WhatsApp" },
];

export default function KartikMaasClient() {
  const [selected, setSelected] = useState<SevaSelection | null>(null);
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [pastHero, setPastHero] = useState(false);
  const [inDonation, setInDonation] = useState(false);
  const scrolledRef = useRef(false);
  const day = useKartikDay();

  // A ?seva= deep link (used by the pending-payment reminder) goes straight to that seva's card. Everyone else
  // lands at the top: the banner has its own Donate button, and the page must not move on its own.
  useEffect(() => {
    if (scrolledRef.current) return;
    scrolledRef.current = true;
    const slug = new URLSearchParams(window.location.search).get("seva");
    const matched = slug && SEVAS.some((seva) => seva.slug === slug) ? slug : null;
    if (!matched) return;
    setHighlightedSlug(matched);
    const timer = window.setTimeout(() => document.getElementById(`seva-card-${matched}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 450);
    return () => window.clearTimeout(timer);
  }, []);

  // The floating "Offer Seva" bar waits until the banner has scrolled away and hides while the seva cards are on screen.
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const el = document.getElementById("offer-seva");
    const io = el ? new IntersectionObserver((e) => setInDonation(e[0]?.isIntersecting ?? false), { threshold: 0.1 }) : null;
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

  return (
    <PageLayout>
      <div className="overflow-x-clip bg-white pt-[var(--header-h)]">
        {/* ══ BANNER ═════════════════════════════════════════════════════ */}
        <section className="bg-vk-900">
          <h1 className="sr-only">Kartik Maas Seva, {FESTIVAL_DATE_LABEL}</h1>
          <a href="#offer-seva" className="block">
            <picture>
              <source media="(max-width: 640px)" srcSet={MOBILE_BANNER} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={DESKTOP_BANNER} alt="Kartik Maas celebrations at ISKCON Gambheeram Visakhapatnam" fetchPriority="high" className="block h-auto w-full" />
            </picture>
          </a>
        </section>

        {/* ══ FACTS ══════════════════════════════════════════════════════ */}
        <section className="border-b border-[hsl(var(--gold)/0.35)] bg-gradient-to-r from-amber-50 via-white to-amber-50">
          <dl className="vk-container grid grid-cols-2 gap-x-6 gap-y-5 py-5 md:grid-cols-4 md:py-6">
            {FACTS.map((f) => (
              <div key={f.k} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--gold)/0.18)] text-[hsl(var(--gold-deep))]">
                  <f.icon className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0">
                  <dt className="text-[13px] font-bold text-ink md:text-sm">{f.k}</dt>
                  <dd className="mt-0.5 text-[11.5px] leading-snug text-muted-foreground md:text-xs">{f.v}</dd>
                </div>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ SEVAS ══════════════════════════════════════════════════════ */}
        <section id="offer-seva" className="vk-section relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-white via-amber-50/50 to-white">
          <PetalFall count={20} />
          <div className="vk-container relative">
            <Reveal>
              <SectionHeading
                align="center"
                eyebrow="Choose Your Offering"
                title="Kartik Maas Sevas"
                subtitle="Tap an amount to offer that seva. Sankalpa is taken in your name and your receipt reaches you on WhatsApp."
              />
            </Reveal>
            <FestivalSevaGrid featuredStyle="ivory" featuredSlugs={["deep-daan-1-month", "108-deep-daan"]} sevas={SEVAS} impacts={IMPACTS} highlightedSlug={highlightedSlug} onSelect={setSelected} />
            <p className="mt-8 text-center text-xs text-muted-foreground">
              Minimum donation Rs. 100 · 80G Tax Exemption available · Secured by Razorpay · Donations go to Hare Krishna Movement India, Visakhapatnam
            </p>
          </div>
        </section>

        <PhonePeUpiCard campaign="Kartik Maas" />
        <OrnamentDivider className="my-2" />

        {/* ══ THE DAILY LAMP ═════════════════════════════════════════════ */}
        <LampTracker onOffer={scrollToDonate} />

        {/* ══ ABOUT + SHLOKA ═════════════════════════════════════════════ */}
        <section className="vk-section vk-band">
          <div className="vk-container">
            <Reveal className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.35fr_0.65fr] md:items-center">
              <div>
                <span className="vk-pill">Hare Krishna Movement</span>
                <h2 className="vk-h1 mt-4">Kartik Maas</h2>
                <p className="vk-lead mt-5 max-w-4xl md:text-lg md:leading-8">
                  Kartik is Damodar month, when Lord Krishna is worshipped as the child bound by Mother Yashoda&apos;s love. At Hare Krishna Vaikuntham a lamp is
                  offered to Sri Damodar every evening, the Damodarashtakam is sung, and Annadana is served to everyone who comes for darshan. Offer a seva and
                  your sankalpa is made in your name.
                </p>
                <button type="button" onClick={scrollToDonate} className="vk-btn-gold mt-6 h-12 px-7 text-[15px] font-bold">
                  Offer Your Seva
                </button>
              </div>
              <div className="vk-card p-6 md:p-7">
                <span className="vk-icon-chip">
                  <Flame className="h-5 w-5" />
                </span>
                <div className="mt-4 space-y-1.5 font-serif-display text-[15px] italic leading-7 text-vk-800 md:text-base">
                  {SHLOKA.sanskrit.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <p className="mt-4 border-l-4 border-vk-300 pl-4 text-sm leading-6 text-muted-foreground">{SHLOKA.meaning}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-vk-700">{SHLOKA.source}</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ THE DAMODAR LILA ═══════════════════════════════════════════ */}
        <section id="damodar-lila" className="vk-section scroll-mt-20">
          <div className="vk-container">
            <Reveal>
              <SectionHeading align="center" eyebrow="The Damodar Lila" title="Why He is Called Damodara" subtitle="The pastime that gives this month its name, from Srimad Bhagavatam, in five moments." />
            </Reveal>
            <StoryTimeline steps={LILA} />
          </div>
        </section>

        {/* ══ WHY KARTIK ═════════════════════════════════════════════════ */}
        <section id="why-kartik" className="vk-section vk-band scroll-mt-20">
          <div className="vk-container">
            <Reveal>
              <SectionHeading align="center" eyebrow="Why Kartik Maas" title="The Month Lord Damodar Loves Most" subtitle="Four reasons families make Kartik the month of their seva for the year." />
            </Reveal>
            <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {REASONS.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.05} className="vk-card relative h-full overflow-hidden p-6">
                  <span aria-hidden className="absolute right-4 top-2 font-heading text-6xl font-extrabold leading-none text-vk-100">
                    {i + 1}
                  </span>
                  <span className="vk-icon-chip relative">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <h3 className="relative mt-4 text-base font-bold text-ink">{item.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ BANK TRANSFER ══════════════════════════════════════════════ */}
        <section className="vk-section">
          <div className="vk-container">
            <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2 lg:items-start">
              <div className="rounded-2xl border border-vk-100 bg-vk-50 px-5 py-4 text-sm leading-7 text-ink/80 md:text-base">
                While making UPI or bank payments, please send a screenshot with your name, mobile, address and PAN details to our WhatsApp{" "}
                <a className="font-bold text-vk-700 hover:text-vk-500" href="https://wa.me/917995097108" target="_blank" rel="noreferrer">
                  +91 79950 97108
                </a>{" "}
                or email{" "}
                <a className="break-all font-bold text-vk-700 hover:text-vk-500" href="mailto:social@hkmvizag.org">
                  social@hkmvizag.org
                </a>
                , so your receipt is issued against the right donor.
              </div>
              <div className="vk-card p-5 md:p-7">
                <h2 className="vk-bar-title text-lg text-ink md:text-xl">Donation Through Bank (NEFT / RTGS)</h2>
                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {BANK_DETAILS.map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-3 rounded-xl bg-vk-50 p-4 text-sm text-ink">
                      <div className="min-w-0 flex-1">
                        <span className="block text-xs font-medium text-muted-foreground">{label}:</span>
                        <span className="mt-0.5 block select-all break-words font-semibold">{value}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyField(label, value)}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-vk-500 transition-colors hover:bg-white hover:text-vk-700"
                        title={`Copy ${label}`}
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

        <DonorPrivilegesSection scrollToDonate={scrollToDonate} config={KARTIK_MAAS_PRIVILEGE_CONFIG} />
        <FaqSection faqs={FAQS} tone="blue" />
        <OtherDonationsCarousel />
      </div>

      {selected && (
        <FestivalCheckoutModal
          selected={selected}
          onClose={() => setSelected(null)}
          sourcePage="kartik-maas"
          festivalSlug="kartik-maas"
          bannerImage={DESKTOP_BANNER}
          thankYouSource="the Kartik Maas seva programme"
          trackContentName="Kartik Maas"
        />
      )}

      {!selected && pastHero && !inDonation && (
        <div className="fixed bottom-[calc(var(--bottom-nav-space)+4px+env(safe-area-inset-bottom))] left-3 right-[76px] z-40 lg:hidden">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-vk-100 bg-white/95 p-2 pl-4 shadow-lift">
            <span className="min-w-0 truncate text-[13px] font-semibold text-vk-800">Kartik Maas Seva{day !== null && day >= 1 && day <= 30 ? ` · Day ${day}` : ""}</span>
            <button type="button" onClick={scrollToDonate} className="vk-btn-gold h-11 shrink-0 px-5">
              Offer Seva
            </button>
          </div>
        </div>
      )}
      {!selected && pastHero && !inDonation && (
        <button type="button" onClick={scrollToDonate} className="vk-btn-gold fixed bottom-6 right-24 z-40 hidden h-12 items-center gap-2 px-6 text-sm font-bold shadow-gold lg:inline-flex">
          <Heart className="h-4 w-4" /> Offer Seva
        </button>
      )}
    </PageLayout>
  );
}
