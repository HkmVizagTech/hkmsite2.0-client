"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, Check, Clock, Copy, FileCheck2, Flame, Gift, Heart, MapPin, Moon, ScrollText, ShieldCheck, Sparkles, UtensilsCrossed } from "lucide-react";
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
import type { Seva } from "@/lib/sevaConfig";
import { SEVAS as DIWALI_SEVAS, IMPACTS as DIWALI_IMPACTS } from "@/lib/diwali";
import type { CampaignConfig } from "@/lib/campaignConfig";

// ── Festival constants ───────────────────────────────────────────────
// Kartik Purnima 2026: Tuesday, 24 November — the full moon that closes Kartik
// (Damodar) month, Rasa Yatra, and the end of Chaturmasya. Update next year.
//
// Donations from this page are sent with festivalSlug "kartik-maas" (Kartik Purnima is the last day of
// Kartik month) so the server's existing Kartik Deepotsava DCC codes apply unchanged; sourcePage
// "kartik-purnima" keeps them separate in reports and sends payment reminders back to this page.
const FESTIVAL_DATE_LABEL = "Tuesday, 24 November 2026";
const DCC_FESTIVAL_SLUG = "kartik-maas";

const DESKTOP_BANNER = "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1795410914079-1795410911361-KartikPurnimaDesktop1600x900.png";
const MOBILE_BANNER = "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1795410913490-1795410909298-KartikPurnimaMobile1080x1350.png";

const TIERS = [
  { label: "Rs. 1,100", amount: 1100 },
  { label: "Rs. 2,100", amount: 2100 },
  { label: "Rs. 3,100", amount: 3100 },
  { label: "Rs. 5,555", amount: 5555 },
  { label: "Rs. 9,000", amount: 9000 },
  { label: "Rs. 11,000", amount: 11000 },
];

// `category` is sent to the API as the donation `type`, and `title` as `sevaName`.
// Seva titles must keep "Annadana", "Gau Seva" and "Deep Daan" in them: that is what the server's
// Kartik DCC mapping matches on.
const SEVAS: Seva[] = [
  {
    slug: "annadana-seva",
    title: "Annadana Seva",
    shortTitle: "Annadana",
    image: "/assets/donations-annadana-real.jpg",
    tagline: "Feed every devotee and visitor on Kartik Purnima",
    description:
      "Sponsor sanctified prasadam for the devotees, guests and the needy who come to the temple for darshan on the holy full moon of Kartik.",
    tiers: TIERS,
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
      "Offer Gau Poshana Seva on Kartik Purnima: fodder, green grass, medicines and daily care for the cows at the temple goshala.",
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
    slug: "kartik-purnima-deep-daan",
    title: "Kartik Purnima Deep Daan",
    shortTitle: "Purnima Deep Daan",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793155363450-1793155362796-templeshrine1500x1000.png",
    tagline: "A ghee lamp on the last evening of Damodar month",
    description:
      "Sponsor a ghee lamp offered to Sri Yashoda Damodara on the full moon of Kartik, with your sankalpa in your name.",
    tiers: TIERS,
    category: "Kartik Maas",
    account: "default",
    icon: "🪔",
  },
  {
    slug: "108-deep-daan",
    title: "108 Deep Daan",
    shortTitle: "108 Deep Daan",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793155977517-1793155976914-108deepskrishnayashodha1500x1000.webp",
    tagline: "108 lamps offered to the Lord on Kartik Purnima",
    description: "Sponsor 108 ghee lamps offered to Sri Yashoda Damodara on the holy full moon that completes Kartik month.",
    tiers: TIERS,
    category: "Kartik Maas",
    account: "default",
    icon: "🪔",
  },
  // Brick Seva and Square Foot Seva: same cards, photos and amounts as the Kartik Maas and Diwali pages
  // (they are the Vaikuntham temple-construction sevas, so they carry the "BRICK" / "SQFT" donation type).
  ...DIWALI_SEVAS.filter((s) => s.slug === "brick-seva" || s.slug === "square-foot-seva"),
];

// Every card on this page is shown as a "Special Seva" card.
const FEATURED_SLUGS = SEVAS.map((seva) => seva.slug);

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
    icon: Moon,
    title: "The full moon of Kartik",
    text: "Kartik Purnima completes Damodar month, the month Lord Krishna is worshipped as the child bound by Mother Yashoda's love.",
  },
  {
    icon: Flame,
    title: "The last lamp of the month",
    text: "Devotees offer lamps to Sri Yashoda Damodara on this final evening, completing the month of daily Deep Daan with the Damodarashtakam.",
  },
  {
    icon: Sparkles,
    title: "Rasa Yatra",
    text: "Vaishnavas celebrate this full moon as Rasa Yatra, remembering the Lord's rasa-lila with the gopis of Vrindavan.",
  },
  {
    icon: Heart,
    title: "The close of Chaturmasya",
    text: "The four-month Chaturmasya vow ends today. A seva offered on this day seals the vows and prayers of the whole season.",
  },
];

const PRIVILEGES = [
  {
    icon: ScrollText,
    title: "Sankalpa in your name",
    text: "The seva is offered on Kartik Purnima with sankalpa in your name and your family's gotra.",
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
const KARTIK_PURNIMA_PRIVILEGE_CONFIG: CampaignConfig = {
  type: "SQFT",
  pageTitle: "Kartik Purnima Seva",
  metaTitle: "Kartik Purnima Seva | Hare Krishna Vaikuntham Temple, Visakhapatnam",
  metaDesc: "Offer Annadana, Gau Seva and Deep Daan on Kartik Purnima, the full moon that completes Damodar month.",
  ogTitle: "Kartik Purnima Seva",
  ogDesc: "Offer your seva to Lord Damodar on the holy full moon of Kartik.",
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
  heroHeading1: "Kartik Purnima",
  heroHeading2: "Seva Online",
  heroDesc:
    "Offer Annadana, Gau Seva and Deep Daan to Lord Damodar on Kartik Purnima.",
  formHeading: "Offer Your Seva",
  formSubheading: "Sankalpa is taken in your name on Kartik Purnima.",
  privileges: PRIVILEGES,
  higherPrivileges: [],
  statsApiEndpoint: "",
  orderType: "KARTIK_PURNIMA",
};

const BANK_DETAILS = [
  { label: "Beneficiary Name", value: "HARE KRISHNA MOVEMENT INDIA" },
  { label: "Bank Name", value: "IDFC FIRST BANK LTD" },
  { label: "A/c No", value: "10091415313" },
  { label: "IFSC Code", value: "IDFB0080412" },
];

const FAQS = [
  {
    q: "When is Kartik Purnima 2026 and when is my seva performed?",
    a: "Kartik Purnima is on Tuesday, 24 November 2026, the full moon that completes Kartik (Damodar) month. Your seva is offered at Hare Krishna Vaikuntham, Gambheeram, with sankalpa in your name. Donations made after the day are offered in the temple's next worship.",
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
  { icon: CalendarDays, k: "Tue, 24 Nov 2026", v: "Full moon · last day of Damodar month" },
  { icon: MapPin, k: "Hare Krishna Vaikuntham", v: "Gambheeram, Visakhapatnam" },
  { icon: FileCheck2, k: "80G tax exemption", v: "Receipt against your PAN" },
  { icon: ShieldCheck, k: "Secure checkout", v: "Razorpay · receipt on WhatsApp" },
];

export default function KartikPurnimaClient() {
  const [selected, setSelected] = useState<SevaSelection | null>(null);
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [pastHero, setPastHero] = useState(false);
  const [inDonation, setInDonation] = useState(false);
  const scrolledRef = useRef(false);

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
          <h1 className="sr-only">Kartik Purnima Seva, {FESTIVAL_DATE_LABEL}</h1>
          <a href="#offer-seva" className="block">
            <picture>
              <source media="(max-width: 640px)" srcSet={MOBILE_BANNER} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={DESKTOP_BANNER} alt="Kartik Purnima, 24 November 2026, at ISKCON Gambheeram Visakhapatnam" fetchPriority="high" className="block h-auto w-full" />
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
                title="Kartik Purnima Sevas"
                subtitle="Tap an amount to offer that seva on Kartik Purnima. Sankalpa is taken in your name and your receipt reaches you on WhatsApp."
              />
            </Reveal>
            <FestivalSevaGrid featuredStyle="ivory" featuredSlugs={FEATURED_SLUGS} sevas={SEVAS} impacts={IMPACTS} highlightedSlug={highlightedSlug} onSelect={setSelected} />
            <p className="mt-8 text-center text-xs text-muted-foreground">
              Minimum donation Rs. 100 · 80G Tax Exemption available · Secured by Razorpay · Donations go to Hare Krishna Movement India, Visakhapatnam
            </p>
          </div>
        </section>

        <PhonePeUpiCard campaign="Kartik Purnima" />
        <OrnamentDivider className="my-2" />

        {/* ══ ABOUT + SHLOKA ═════════════════════════════════════════════ */}
        <section className="vk-section vk-band">
          <div className="vk-container">
            <Reveal className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.35fr_0.65fr] md:items-center">
              <div>
                <span className="vk-pill">Hare Krishna Movement</span>
                <h2 className="vk-h1 mt-4">Kartik Purnima</h2>
                <p className="vk-lead mt-5 max-w-4xl md:text-lg md:leading-8">
                  Kartik Purnima, the full moon of Tuesday, 24 November, brings Damodar month to its close. It is the last evening of lamps for Sri Yashoda
                  Damodara, the day of Rasa Yatra, and the end of Chaturmasya. Offer Annadana, Gau Seva or Deep Daan on this holy day and your sankalpa is made
                  in your name.
                </p>
                <button type="button" onClick={scrollToDonate} className="vk-btn-gold mt-6 h-12 px-7 text-[15px] font-bold">
                  Offer Your Seva
                </button>
              </div>
              <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(150deg,#0b1745_0%,#15308a_60%,#2b52c9_100%)] p-6 text-white shadow-[0_30px_60px_-34px_rgba(15,31,92,0.9)] md:p-8">
                <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,214,120,0.35),transparent_70%)]" />
                <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-[hsl(var(--gold))] ring-1 ring-white/25">
                  <Flame className="h-5 w-5" />
                </span>
                <div className="relative mt-5 space-y-1.5 font-serif-display text-lg italic leading-8 text-amber-200 md:text-xl">
                  {SHLOKA.sanskrit.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <p className="relative mt-5 border-l-4 border-[hsl(var(--gold))] pl-4 text-sm leading-6 text-white/80">{SHLOKA.meaning}</p>
                <p className="relative mt-4 text-xs font-bold uppercase tracking-[0.14em] text-[hsl(var(--gold))]">{SHLOKA.source}</p>
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
        <section id="why-kartik-purnima" className="vk-section vk-band scroll-mt-20">
          <div className="vk-container">
            <Reveal>
              <SectionHeading align="center" eyebrow="Why Kartik Purnima" title="The Holy Full Moon of Kartik" subtitle="Why devotees save a special seva for the last day of Damodar month." />
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

        {/* ══ FINAL CALL ═════════════════════════════════════════════════ */}
        <section className="vk-section !pb-2">
          <div className="vk-container">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#0b1745_0%,#1c3a9e_60%,#2f5bd3_100%)] px-6 py-10 text-center text-white md:px-12 md:py-14">
                <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
                <div aria-hidden className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/5" />
                <h2 className="relative mx-auto max-w-2xl font-heading text-[1.9rem] font-bold leading-tight md:text-4xl">
                  Complete Kartik with a seva for <span className="text-[hsl(var(--gold))]">Lord Damodar</span>
                </h2>
                <p className="relative mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/80 md:text-base">
                  Sankalpa is taken in your name on Kartik Purnima, and your receipt reaches your WhatsApp as soon as the payment is confirmed.
                </p>
                <button type="button" onClick={scrollToDonate} className="vk-btn-gold relative mt-7 h-[3.25rem] px-8 text-base font-bold">
                  <Heart className="h-4 w-4" /> Offer Your Seva
                </button>
              </div>
            </Reveal>
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

        <DonorPrivilegesSection scrollToDonate={scrollToDonate} config={KARTIK_PURNIMA_PRIVILEGE_CONFIG} />
        <FaqSection faqs={FAQS} tone="blue" />
        <OtherDonationsCarousel />
      </div>

      {selected && (
        <FestivalCheckoutModal
          selected={selected}
          onClose={() => setSelected(null)}
          sourcePage="kartik-purnima"
          festivalSlug={DCC_FESTIVAL_SLUG}
          bannerImage={DESKTOP_BANNER}
          thankYouSource="the Kartik Purnima seva programme"
          trackContentName="Kartik Purnima"
        />
      )}

      {!selected && pastHero && !inDonation && (
        <div className="fixed bottom-[calc(var(--bottom-nav-space)+4px+env(safe-area-inset-bottom))] left-3 right-[76px] z-40 lg:hidden">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-vk-100 bg-white/95 p-2 pl-4 shadow-lift">
            <span className="min-w-0 truncate text-[13px] font-semibold text-vk-800">Kartik Purnima Seva · 24 Nov</span>
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
