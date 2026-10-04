"use client";

import PageLayout from "@/components/PageLayout";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import SectionHeading from "@/components/site/SectionHeading";
import DonationForm from "@/components/DonationForm";
import { motion, useInView, useReducedMotion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  FileCheck2,
  Heart,
  Leaf,
  Lock,
  Moon,
  ShieldCheck,
  X,
  Quote,
  Sun,
  Sparkles,
  BookOpen,
  Utensils,
  Phone,
  ScrollText,
  ChevronDown,
  MessageCircle,
  Users,
  Navigation,
} from "lucide-react";
import { sevas, type Seva } from "@/lib/sevaConfig";

const apiBase = () => (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/+$/, "");

const WA_CHANNEL = "https://whatsapp.com/channel/0029VaZDEG67T8bWHjibTy2u";

const MAPS_DIRECTIONS_URL =
  "https://maps.app.goo.gl/Yg2imkSEDxuY5u2K9?g_st=aw";

type BannerSlide = {
  desktop: string;
  mobile: string;
  alt: string;
  linkUrl?: string;
};

const FALLBACK_BANNERS: BannerSlide[] = [
  {
    desktop: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1786539472426-1786539471654-Chaturmasbanner.webp",
    mobile: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1786539471904-1786539471306-Chaturmasbanner-mob.webp",
    alt: "Chaturmas 2026 — the four sacred months",
  },
];

const stats = [
  { icon: CalendarDays, value: "4", label: "Sacred Months", sub: "Ashadha to Kartika" },
  { icon: Moon, value: "July 29", label: "Chaturmas Begins", sub: "2026 · Devashayani" },
  { icon: Sun, value: "Nov 24", label: "Chaturmas Ends", sub: "2026 · Utthana Ekadashi" },
  { icon: Heart, value: "4", label: "Monthly Vrats", sub: "One food restriction each month" },
];

const restrictionMonths = [
  {
    month: "First Month",
    title: "Green Leafy Vegetables",
    emoji: "🥬",
    color: "from-emerald-500/20 to-green-600/10",
    border: "border-emerald-400/30",
    badge: "bg-emerald-500/15 text-emerald-700",
    avoid: ["Green leafy vegetables (shak)", "Palak (spinach)", "Methi (fenugreek)", "Saraso (mustard greens)"],
    permitted: ["Dhaniya (coriander)", "Pudina (mint)", "Cabbage", "Kari Patta (curry leaves)"],
  },
  {
    month: "Second Month",
    title: "Curds & Yogurt",
    emoji: "🥛",
    color: "from-amber-400/20 to-yellow-500/10",
    border: "border-amber-400/30",
    badge: "bg-amber-500/15 text-amber-700",
    avoid: ["Curds (yogurt)", "Raita", "Lassi", "Kadi", "Chaach (buttermilk)", "Shreekhand"],
    permitted: ["Curds as a side ingredient only", "In very small quantities"],
  },
  {
    month: "Third Month",
    title: "Milk",
    emoji: "🥛",
    color: "from-sky-400/20 to-blue-500/10",
    border: "border-sky-400/30",
    badge: "bg-sky-500/15 text-sky-700",
    avoid: ["Milk", "Milkshake", "Rabri", "Kheer", "Ice-cream", "Thandai"],
    permitted: ["Items made by curdling milk", "Paneer", "Rasgulla", "Cheese"],
  },
  {
    month: "Fourth Month",
    title: "Urad Dal",
    emoji: "🫘",
    color: "from-orange-400/20 to-red-500/10",
    border: "border-orange-400/30",
    badge: "bg-orange-500/15 text-orange-700",
    avoid: ["Items made from urad dal", "Dosa", "Urad dal pakode (vada)"],
    permitted: ["Other dals like moong", "Use moong for such preparations"],
  },
];

const primaryRules = [
  {
    icon: Leaf,
    title: "Fasting from Specific Foods",
    desc: "Avoid the specific food items prescribed for each month of the Chaturmas, as mentioned above.",
  },
  {
    icon: Utensils,
    title: "Eat Only Krishna Prasadam",
    desc: "Take food only after it has been offered to the Supreme Lord — nothing prepared for one's own sense gratification.",
  },
  {
    icon: BookOpen,
    title: "Increase Devotional Service",
    desc: "Chant the Hare Krishna mahamantra, read the Bhagavad-gita, visit the temple regularly and engage more and more in devotional activities.",
  },
];

const secondaryRules = [
  {
    icon: Heart,
    title: "Perform Charity",
    desc: "Give in charity as much as possible during these four most beneficial months.",
  },
  {
    icon: Leaf,
    title: "Plant Sacred Plants",
    desc: "Plant sacred plants such as Tulasi and Pipal, and tend to them with devotion.",
  },
  {
    icon: Moon,
    title: "Simple Austerities",
    desc: "Sleep on the floor and eat as little as possible, reducing bodily comforts.",
  },
  {
    icon: Sun,
    title: "Rise Early & Serve",
    desc: "Rise early in the morning and engage the early hours in devotional activities.",
  },
];

const benefits = [
  {
    icon: Sparkles,
    title: "Purification of Existence",
    desc: "Restricting the bodily necessities purifies the heart and reduces the pull of sense enjoyment.",
  },
  {
    icon: Heart,
    title: "Blessings of Sri Krishna",
    desc: "The Supreme Lord is immensely pleased with those who observe the Chaturmasya vrat with devotion.",
  },
  {
    icon: BookOpen,
    title: "Advancement in Devotion",
    desc: "Austerity combined with devotional service accelerates one's progress on the path of bhakti.",
  },
];

const historyEvents = [
  {
    title: "A Sudra Boy Became Narada Muni",
    desc: "As mentioned in the Srimad Bhagavatam, Narada Muni was born in his previous life as the son of a maidservant. During the Chaturmasya period he served the Mahabhagavata devotees and accepted their Mahaprasadam, receiving the blessing of seeing Krishna in that very life. He later became Narada Muni, the son of Lord Brahma.",
  },
  {
    title: "Lord Krishna Stayed in Hastinapura",
    desc: "During His presence on earth, Lord Krishna was requested by King Yudhishthira to stay in Hastinapura. Accepting the request of His devotee, the Lord stayed there with him during the Chaturmas period.",
  },
  {
    title: "Caitanya Mahaprabhu Accepted Gopal Bhatta Goswami",
    desc: "During one Chaturmasya, Lord Sri Krishna Caitanya Mahaprabhu stayed in Sri Rangam kshetra. There He transformed the heart of Venkata Bhatta to worship Lord Krishna as the Supreme Personality of Godhead, and accepted his son Gopal Bhatta as His servant.",
  },
  {
    title: "Srila Madhavendra Puri Stayed in Jagannath Puri",
    desc: "When Sri Gopala, the Deity of Srila Madhavendra Puri, asked him to bring sandalwood to apply on Him, Srila Madhavendra Puri travelled to Jagannath Puri and stayed there during the period of Chaturmas.",
  },
  {
    title: "Navadvip Devotees Visited Caitanya Mahaprabhu",
    desc: "While Sri Caitanya Mahaprabhu stayed at Jagannath Puri, all His devotees from Navadvip would visit Him every year on Rath Yatra and then remain with the Lord for the whole duration of Chaturmas.",
  },
];

const faqs = [
  {
    q: "Can we travel during Chaturmas?",
    a: "During Chaturmas the sannyasis avoid travelling and stay at one holy place while practicing intense devotional service. As a practitioner, one should try to avoid travelling as much as possible and focus on devotional activities. However, in case of urgent work or an emergency one may travel, but only as much as absolutely needed.",
  },
  {
    q: "Can children and the elderly follow it fully?",
    a: "Yes. There is no difficulty for children or the elderly to follow the Chaturmas Vrat. The rules are simple — avoid certain food items and perform devotional services as much as possible. However, in case of medicinal need, the forbidden food items may be taken as absolutely required.",
  },
  {
    q: "Is it compulsory to fast for all four months?",
    a: "Yes. The fasts recommended for Chaturmasya and other auspicious days like Ekadashi and Janmashtami are observed for advancement in spiritual life by enhancing austerity and reducing bodily demands. One who is serious about progressing on the spiritual path must strictly observe all the recommended rules.",
  },
  {
    q: "What if I miss one rule?",
    a: "One must be very careful in observing all the recommended rules of Chaturmas, for inattention affects the benefits derived from the vrat. If a rule is missed, one should pray to the Lord for forgiveness and ask for strength to follow the vrat with firm determination.",
  },
];

const trustBadges = [
  { icon: FileCheck2, label: "80G Tax Exemption" },
  { icon: Clock, label: "Instant Confirmation" },
  { icon: ShieldCheck, label: "Secure Razorpay" },
  { icon: Lock, label: "100% Goes to Seva" },
];

function SectionDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`relative h-16 md:h-24 overflow-hidden ${flip ? "rotate-180" : ""}`} aria-hidden>
      <svg viewBox="0 0 1440 96" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d="M0,64 C360,96 720,0 1080,64 C1260,96 1380,80 1440,64 L1440,96 L0,96 Z" fill="currentColor" />
      </svg>
    </div>
  );
}

export default function ChaturmasClient() {
  const reduce = useReducedMotion();
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);
  const inView1 = useInView(ref1, { once: true, margin: "-80px" });
  const inView2 = useInView(ref2, { once: true, margin: "-80px" });
  const inView3 = useInView(ref3, { once: true, margin: "-80px" });
  const inView4 = useInView(ref4, { once: true, margin: "-80px" });
  const inView5 = useInView(ref5, { once: true, margin: "-80px" });
  const inView6 = useInView(ref6, { once: true, margin: "-80px" });

  const [banners, setBanners] = useState<BannerSlide[]>(FALLBACK_BANNERS);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${apiBase()}/hero-banners`);
        if (res.ok) {
          const data = await res.json();
          const list = (data.banners || []).filter((b: any) => {
            const hay = `${b.title || ""} ${b.linkUrl || ""}`.toLowerCase();
            return hay.includes("chaturmas");
          });
          if (list.length && !cancelled) {
            setBanners(
              list.map((b: any) => ({
                desktop: b.desktopImage,
                mobile: b.mobileImage,
                alt: b.title || "Chaturmas banner",
                linkUrl: b.linkUrl || "",
              }))
            );
          }
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveSlide((c) => (c + 1) % banners.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [banners.length]);

  const moveSlide = (d: number) => {
    setActiveSlide((c) => (c + d + banners.length) % banners.length);
  };

  const [sevaPickerOpen, setSevaPickerOpen] = useState(false);
  const [selectedSeva, setSelectedSeva] = useState<Seva | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const pickerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // When the picker opens, wait for the height animation to settle, then
  // bring the step flow into view so it never appears far below the fold.
  useEffect(() => {
    if (!sevaPickerOpen) return;
    const t = window.setTimeout(() => {
      pickerRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }, 450);
    return () => window.clearTimeout(t);
  }, [sevaPickerOpen, reduce]);

  // Once a seva is chosen, the donation form is much taller than the seva
  // list — scroll its top into view so the user lands on the top of the form
  // instead of being stuck mid/bottom of it.
  useEffect(() => {
    if (!selectedSeva) return;
    const t = window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }, 250);
    return () => window.clearTimeout(t);
  }, [selectedSeva, reduce]);

  const fade = (delay = 0) =>
    reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay } };

  return (
    <PageLayout>
      <WhatsAppFloatButton />

      <div className="bg-white pt-[var(--header-h)] dark:bg-background">
      {/* ── HERO BANNER ─────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-vk-50 to-white pb-4 pt-4 md:pb-6 md:pt-6">
        <div className="vk-container">
          <div className="relative overflow-hidden rounded-3xl bg-vk-900 shadow-[0_24px_60px_-28px_rgba(10,18,51,0.6)]">
            {banners.map((banner, index) => (
              <a
                key={banner.desktop + index}
                href={banner.linkUrl || "#restrictions"}
                tabIndex={index === activeSlide ? 0 : -1}
                className={`block transition-opacity duration-1000 ease-in-out ${
                  index === activeSlide ? "relative opacity-100" : "absolute inset-0 opacity-0"
                }`}
                aria-hidden={index !== activeSlide}
              >
                <picture>
                  <source media="(max-width: 640px)" srcSet={banner.mobile} />
                  <img src={banner.desktop} alt={banner.alt} className="block h-auto w-full" />
                </picture>
              </a>
            ))}

            {banners.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => moveSlide(-1)}
                  className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-vk-800 shadow-card transition-all hover:bg-white md:flex"
                  aria-label="Previous banner"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveSlide(1)}
                  className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-vk-800 shadow-card transition-all hover:bg-white md:flex"
                  aria-label="Next banner"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {banners.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveSlide(i)}
                      aria-label={`Go to banner ${i + 1}`}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        i === activeSlide ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Date strip */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-medium text-ink md:text-base">
              <span className="font-semibold text-vk-700">July 29, 2026</span>
              <span className="text-vk-300">&mdash;</span>
              <span className="font-semibold text-vk-700">November 24, 2026</span>
              <span className="vk-pill-soft !py-1">Utthana Ekadashi</span>
            </p>
            <div className="hidden h-5 w-px bg-vk-200 md:block" aria-hidden />
            <p className="text-xs text-muted-foreground">
              Alternate panchang: July 25 – November 20, 2026
            </p>
          </div>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {stats.map((s) => (
              <div key={s.label} className="vk-card flex flex-col items-center p-4 text-center md:p-5">
                <span className="vk-icon-chip mb-2.5">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="font-heading text-xl font-extrabold text-vk-800 md:text-2xl">{s.value}</span>
                <span className="mt-1 text-[12px] font-semibold text-ink md:text-[13px]">{s.label}</span>
                <span className="mt-0.5 text-[11px] text-muted-foreground">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT IS CHATURMAS ────────────────────────────────────── */}
      <section className="vk-section" ref={ref1}>
        <div className="vk-container">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 24 }}
              animate={inView1 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <span className="vk-pill mb-4">Understanding Chaturmas</span>
              <h1 className="vk-h2">
                Chaturmas — The Four Sacred Months
              </h1>
              <div className="mt-5 space-y-4">
                <p className="vk-lead">
                  The four sacred months of the year, starting from the Hindu month of Ashadha (June–July) up to the
                  month of Kartika (October–November), are known as <strong className="text-ink">Chaturmas</strong>, literally meaning &ldquo;four months.&rdquo;
                </p>
                <p className="vk-lead">
                  It is observed by Vaishnavas in the rainy season by performing the Chaturmasya Vrat and intensive
                  devotional service, according to either the lunar or the solar calendar months.
                </p>
                <p className="vk-lead">
                  Performing devotional services, austerities, simplicity and vratas during these most beneficial months
                  results in the immense favor of the Supreme Lord Sri Krishna.
                </p>
              </div>
              <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="vk-card px-4 py-4 text-center sm:px-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-vk-600">Begins</p>
                  <p className="mt-1 font-heading text-lg font-bold text-ink">July 29, 2026</p>
                </div>
                <div className="vk-card px-4 py-4 text-center sm:px-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-vk-600">Ends</p>
                  <p className="mt-1 font-heading text-lg font-bold text-ink">Nov 24, 2026</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 24 }}
              animate={inView1 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative pb-6"
            >
              <div className="overflow-hidden rounded-3xl bg-vk-100 shadow-[0_24px_60px_-28px_rgba(10,18,51,0.45)]">
                <Image
                  src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1786540947761-1786540947567-chaturmas-2026-start-and-end-date.jpg"
                  alt="Chaturmas 2026 start and end dates"
                  width={600}
                  height={440}
                  className="w-full object-cover"
                />
              </div>
              <div className="vk-card absolute bottom-0 right-3 px-5 py-3 text-center md:right-5">
                <p className="font-heading text-3xl font-extrabold text-vk-700">120+</p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Days of Devotion</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── DONATE ───────────────────────────────────────────────── */}
      <section
        id="donate-section"
        className="vk-section vk-band"
        ref={ref6}
      >
        <div className="vk-container">
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            animate={inView6 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <SectionHeading
              align="center"
              eyebrow="Support the Temple"
              title="Offer a Seva During Chaturmas"
              subtitle="Every charity performed in these holy months yields manifold benefits. Support the ongoing worship, prasadam distribution and cow protection at ISKCON Gambheeram Visakhapatnam."
            />
          </motion.div>

          {/* Donate card — highlighted CTA panel: button on top, trust badges below */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            animate={inView6 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-3xl"
          >
            <div className="vk-card !rounded-3xl p-6 text-center sm:p-10">
              {/* CTA button — the hero of the section */}
              <button
                onClick={() => setSevaPickerOpen((o) => !o)}
                className="vk-btn-gold h-14 px-8 text-base font-bold md:text-lg"
              >
                <Sparkles className="h-5 w-5" />
                {selectedSeva ? "Choose Another Seva" : "Donate Now"}
                <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${sevaPickerOpen ? "rotate-180" : ""}`} />
              </button>
              <p className="mt-4 text-sm text-muted-foreground">
                {selectedSeva
                  ? "Pick another seva below — or keep your current selection."
                  : "Choose a seva below, then pick your offering amount."}
              </p>
            </div>
          </motion.div>

          <AnimatePresence>
            {sevaPickerOpen && (
              <motion.div
                ref={pickerRef}
                initial={reduce ? undefined : { opacity: 0, height: 0, y: -8 }}
                animate={reduce ? undefined : { opacity: 1, height: "auto", y: 0 }}
                exit={reduce ? undefined : { opacity: 0, height: 0, y: -8 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="scroll-mt-28 overflow-hidden"
              >
                <div className="mx-auto mt-10 max-w-6xl">
                  {/* Step indicator */}
                  <div className="mb-8 flex items-center justify-center gap-3 sm:gap-5">
                    {[
                      { n: 1, label: "Choose Seva" },
                      { n: 2, label: "Choose Amount" },
                    ].map((s, idx) => {
                      const active = selectedSeva ? 2 : 1;
                      const done = active > s.n;
                      const current = active === s.n;
                      return (
                        <div key={s.n} className="flex items-center gap-3">
                          {idx > 0 && (
                            <span className={`h-px w-8 sm:w-14 ${current ? "bg-vk-500" : "bg-vk-200"}`} />
                          )}
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                                done || current
                                  ? "bg-vk-700 text-white"
                                  : "border border-vk-200 bg-white text-muted-foreground"
                              } ${current ? "ring-4 ring-vk-500/15" : ""}`}
                            >
                              {done ? <Check className="h-4 w-4" /> : s.n}
                            </span>
                            <span
                              className={`hidden text-[12px] font-bold uppercase tracking-[0.08em] sm:block ${
                                current ? "text-vk-700" : done ? "text-vk-800" : "text-muted-foreground/60"
                              }`}
                            >
                              {s.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {!selectedSeva ? (
                    /* ── Step 1 · choose a seva ── */
                    <>
                      <div className="mb-7 text-center">
                        <h3 className="vk-h3">Choose Your Seva</h3>
                        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                          Every seva performed during Chaturmas yields manifold blessings — pick one below and complete
                          your offering.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        {sevas.map((seva, i) => (
                          <motion.button
                            key={seva.slug}
                            onClick={() => setSelectedSeva(seva)}
                            initial={reduce ? undefined : { opacity: 0, y: 12 }}
                            animate={reduce ? undefined : { opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.05 * i }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className="group inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-vk-200 bg-white px-5 py-2.5 text-sm font-semibold text-vk-800 shadow-card transition-colors duration-300 hover:border-vk-500 hover:bg-vk-50"
                          >
                            <span className="text-base leading-none">{seva.icon}</span>
                            {seva.shortTitle}
                            <ArrowRight className="h-3.5 w-3.5 text-vk-500 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                          </motion.button>
                        ))}
                      </div>
                    </>
                  ) : (
                    /* ── Step 2 · compact campaign-style donation form ── */
                    <>
                      <div className="mb-5 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedSeva(null)}
                          className="vk-btn-outline h-10 px-4 text-xs"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" /> Change Seva
                        </button>
                      </div>

                      {/* Compact two-column form — same style as the Square Foot campaign */}
                      <div ref={formRef} className="mx-auto w-full max-w-4xl scroll-mt-28">
                        <DonationForm
                          seva={selectedSeva}
                          sourcePage="chaturmas"
                          festivalSlug="chaturmas"
                          thankYouType="seva"
                          thankYouSource="the Chaturmas seva programme"
                          trackContentName="Chaturmas"
                          variant="grid"
                        />
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trust badges — reassurance below the seva options */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 20 }}
            animate={inView6 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-10 max-w-3xl"
          >
            <p className="text-center text-[12px] font-bold uppercase tracking-[0.08em] text-vk-700" aria-hidden>
              Payment made safe &amp; simple
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              {trustBadges.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-2 rounded-full border border-vk-100 bg-white py-1.5 pl-1.5 pr-4 text-xs font-semibold text-vk-800 shadow-card md:text-sm"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-vk-100 text-vk-700">
                    <b.icon className="h-3.5 w-3.5" />
                  </span>
                  {b.label}
                </span>
              ))}
            </div>
          </motion.div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            80G Tax Exemption available · Secured by Razorpay · Donations go to Hare Krishna Movement India, Visakhapatnam
          </p>
        </div>
      </section>

      {/* ── IMPORTANCE ──────────────────────────────────────────── */}
      <section className="vk-section bg-gradient-navy" ref={ref2}>
        <div className="vk-container">
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            animate={inView2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <SectionHeading align="center" light eyebrow="Why It Matters" title="Importance of Chaturmas" />
          </motion.div>

          {/* Featured scripture quote */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            animate={inView2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mx-auto mb-8 max-w-4xl"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center sm:p-10 md:p-12">
              <span className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[hsl(var(--gold))]">
                <Quote className="h-5 w-5" />
              </span>
              <p className="font-serif-display text-xl font-medium italic leading-relaxed text-white md:text-2xl">
                &ldquo;One who passes the Chaturmasya season without observing religious vows, austerities and chanting
                of japa, such a fool, although living, should be considered to be a dead man.&rdquo;
              </p>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--gold))]">
                Bhavishya Purana
              </p>
            </div>
          </motion.div>

          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2 md:gap-6">
            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 20 }}
              animate={inView2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-8"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[hsl(var(--gold))]">
                  <Quote className="h-5 w-5" />
                </span>
                <h3 className="font-heading text-lg font-bold text-white">Manifold Benefits</h3>
              </div>
              <p className="font-serif-display italic leading-relaxed text-white/80">
                &ldquo;There is a 4-month period in a year known as Chaturmasya wherein any Dana, Vrata, Japa and Homa
                performed brings forth countless merits — yielding multifold benefits.&rdquo;
              </p>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--gold))]">
                Lord Varaha to Bhu Devi
              </p>
            </motion.div>

            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 20 }}
              animate={inView2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-8"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[hsl(var(--gold))]">
                  <Moon className="h-5 w-5" />
                </span>
                <h3 className="font-heading text-lg font-bold text-white">The Lord&apos;s Yoga-nidra</h3>
              </div>
              <p className="text-sm leading-relaxed text-white/75 md:text-[15px]">
                The sun travels in the southern hemisphere, and Lord Narayana and all the demigods go to sleep during
                these four months — yoga-nidra, a manifestation of His internal potency. Therefore it is prohibited to
                perform materially pious work (marriages, Bhoomi Pujan, Grah Pravesh, etc.). One should instead perform
                more and more spiritual activities to receive His blessings.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOD RESTRICTIONS ───────────────────────────────────── */}
      <section id="restrictions" className="vk-section" ref={ref3}>
        <div className="vk-container">
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            animate={inView3 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <SectionHeading
              align="center"
              eyebrow="The Chaturmas Vrat"
              title="Food Restrictions"
              subtitle="During each month of Chaturmas, devotees restrict themselves from certain food items. These restrictions are aimed solely at performing austerity and pleasing Lord Krishna."
            />
          </motion.div>

          {/* Restriction cards */}
          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 md:gap-5">
            {restrictionMonths.map((m, i) => (
              <motion.div
                key={m.month}
                initial={reduce ? undefined : { opacity: 0, y: 20 }}
                animate={inView3 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.08 * i }}
                className="vk-card vk-card-hover p-5 md:p-7"
              >
                {/* Month header */}
                <div className="mb-5 flex items-center gap-3">
                  <span className="vk-icon-chip !h-12 !w-12 text-2xl">
                    {m.emoji}
                  </span>
                  <div className="min-w-0">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${m.badge}`}>
                      {m.month}
                    </span>
                    <h3 className="mt-1 font-heading text-lg font-bold text-ink">{m.title}</h3>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Avoid */}
                  <div className="rounded-xl bg-red-50/60 p-3.5">
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-red-600/80">Avoid</p>
                    <ul className="space-y-1.5">
                      {m.avoid.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-ink/80">
                          <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Permitted */}
                  <div className="rounded-xl bg-emerald-50/60 p-3.5">
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-emerald-700/80">Permitted</p>
                    <ul className="space-y-1.5">
                      {m.permitted.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-ink/80">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Global note */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            animate={inView3 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mx-auto mt-6 max-w-6xl md:mt-8"
          >
            <div className="flex flex-col items-center gap-5 rounded-3xl bg-gradient-navy p-6 md:flex-row md:p-10">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[hsl(var(--gold))]">
                <ScrollText className="h-7 w-7" />
              </span>
              <div className="text-center md:text-left">
                <h3 className="font-heading text-xl font-bold text-white">A Note for All Four Months</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75 md:text-base">
                  Throughout Chaturmas, avoid eating any <span className="font-semibold text-[hsl(var(--gold))]">non-vegetarian food</span>,{" "}
                  <span className="font-semibold text-[hsl(var(--gold))]">onion</span> and <span className="font-semibold text-[hsl(var(--gold))]">garlic</span>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── RULES & OBSERVANCE ──────────────────────────────────── */}
      <section className="vk-section vk-band" ref={ref4}>
        <div className="vk-container">
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            animate={inView4 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <SectionHeading
              align="center"
              eyebrow="How to Observe"
              title="Rules of Chaturmas"
              subtitle="Anyone can easily observe Chaturmas by following these simple primary and secondary rules."
            />
          </motion.div>

          {/* Primary rules */}
          <div className="mx-auto mb-12 max-w-5xl md:mb-14">
            <div className="mb-6 text-center">
              <span className="vk-pill">
                <Sparkles className="h-3.5 w-3.5" /> Primary Rules
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-3 md:gap-5">
              {primaryRules.map((r, i) => (
                <motion.div
                  key={r.title}
                  initial={reduce ? undefined : { opacity: 0, y: 20 }}
                  animate={inView4 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.12 * i }}
                  className="vk-card vk-card-hover relative overflow-hidden p-6 md:p-7"
                >
                  <span className="pointer-events-none absolute -right-2 -top-4 select-none font-heading text-[72px] font-extrabold text-vk-50" aria-hidden>
                    0{i + 1}
                  </span>
                  <span className="vk-icon-chip relative mb-4 !h-12 !w-12">
                    <r.icon className="h-6 w-6" />
                  </span>
                  <h3 className="relative mb-2 font-heading text-base font-bold text-ink md:text-lg">{r.title}</h3>
                  <p className="relative text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Secondary rules */}
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 text-center">
              <span className="vk-pill-soft">
                <Heart className="h-3.5 w-3.5" /> Secondary Rules
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {secondaryRules.map((r, i) => (
                <motion.div
                  key={r.title}
                  initial={reduce ? undefined : { opacity: 0, y: 20 }}
                  animate={inView4 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + 0.08 * i }}
                  className="vk-card vk-card-hover p-5"
                >
                  <span className="vk-icon-chip mb-3">
                    <r.icon className="h-5 w-5" />
                  </span>
                  <h4 className="mb-1.5 font-heading text-[15px] font-bold text-ink">{r.title}</h4>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">{r.desc}</p>
                </motion.div>
              ))}
            </div>
            <p className="mt-10 text-center font-serif-display text-[15px] italic text-vk-800/80">
              As far as possible, one should try to stay at some holy place (pilgrimage) during the period of Chaturmas.
            </p>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ────────────────────────────────────────────── */}
      <section className="vk-section" ref={ref5}>
        <div className="vk-container">
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            animate={inView5 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <SectionHeading align="center" eyebrow="The Fruit of Austerity" title="Benefits of Chaturmas Vrat" />
          </motion.div>
          <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
            <div className="space-y-4">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={reduce ? undefined : { opacity: 0, y: 20 }}
                  animate={inView5 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="vk-card vk-card-hover flex gap-4 p-5 md:p-6"
                >
                  <span className="vk-icon-chip">
                    <b.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="mb-1 font-heading text-base font-bold text-ink md:text-lg">{b.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 24 }}
              animate={inView5 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="space-y-5"
            >
              <div className="overflow-hidden rounded-3xl bg-vk-100 shadow-[0_24px_60px_-28px_rgba(10,18,51,0.45)]">
                <Image
                  src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1786540909689-1786540908653-benefits-of-chaturmas-vrat.webp"
                  alt="Benefits of Chaturmas Vrat"
                  width={600}
                  height={460}
                  className="w-full object-cover"
                />
              </div>
              <div className="vk-card flex gap-4 p-5 md:p-6">
                <span className="vk-icon-chip !h-9 !w-9 !rounded-full">
                  <Quote className="h-4 w-4" />
                </span>
                <p className="text-sm italic leading-relaxed text-ink/75 md:text-[15px]">
                  <em>apama somam amrta abhuma</em> and{" "}
                  <em>akshayyam ha vai caturmasya-yajinah sukrtam bhavati</em> — those who perform the four-month
                  penances become eligible to drink the soma-rasa beverages to become immortal and happy forever.
                  (Bhagavad-gita 2.42)
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HISTORICAL EVENTS ───────────────────────────────────── */}
      <section className="vk-section vk-band">
        <div className="vk-container">
          <SectionHeading
            align="center"
            eyebrow="Revealed Scripture"
            title="Significant Events During Chaturmas"
            subtitle="The auspicious Chaturmas period marks multiple historical events mentioned in the revealed scriptures."
          />
          <div className="mx-auto max-w-4xl">
            {historyEvents.map((ev, i) => (
              <motion.div
                key={ev.title}
                initial={reduce ? undefined : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.06 * i }}
                className="relative flex gap-3 pb-5 last:pb-0 sm:gap-5"
              >
                {i < historyEvents.length - 1 && (
                  <span className="absolute bottom-0 left-[19px] top-12 w-px bg-gradient-to-b from-vk-300 to-transparent" aria-hidden />
                )}
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-vk-700 text-white shadow-[0_6px_16px_-6px_rgba(30,58,138,0.55)]">
                  <span className="font-heading text-sm font-bold">{i + 1}</span>
                </div>
                <div className="vk-card min-w-0 flex-1 p-5 md:p-7">
                  <h3 className="mb-2 font-heading text-base font-bold text-vk-800 md:text-lg">{ev.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{ev.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOIN WHATSAPP CHANNEL ─────────────────────────────── */}
      <section className="vk-section">
        <div className="vk-container">
          <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#075e54] to-[#128c7e] p-6 shadow-[0_24px_60px_-28px_rgba(7,94,84,0.6)] md:p-10">
              <div className="flex flex-col items-center gap-5 text-center md:flex-row md:gap-6 md:text-left">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                  <svg viewBox="0 0 32 32" className="h-9 w-9 fill-white">
                    <path d="M16.001 3C9.096 3 3.5 8.596 3.5 15.5c0 2.42.69 4.68 1.887 6.6L3 29l7.09-2.35a12.42 12.42 0 0 0 5.91 1.5c6.905 0 12.5-5.596 12.5-12.5S22.906 3 16.001 3Zm0 22.688a10.15 10.15 0 0 1-5.176-1.42l-.371-.22-4.207 1.394 1.412-4.1-.242-.386a10.13 10.13 0 0 1-1.604-5.456c0-5.606 4.582-10.188 10.19-10.188 5.606 0 10.187 4.582 10.187 10.188 0 5.605-4.581 10.188-10.189 10.188Zm5.583-7.634c-.306-.153-1.81-.893-2.09-.994-.28-.102-.484-.153-.688.153-.204.306-.79.994-.968 1.198-.178.204-.357.23-.663.077-.306-.153-1.292-.476-2.462-1.518-.91-.812-1.525-1.815-1.703-2.121-.178-.306-.019-.472.134-.624.137-.137.306-.357.459-.535.153-.178.204-.306.306-.51.102-.204.051-.383-.026-.535-.077-.153-.688-1.658-.943-2.271-.248-.596-.5-.516-.688-.525-.178-.009-.382-.011-.586-.011-.204 0-.535.077-.815.383-.28.306-1.069 1.044-1.069 2.548 0 1.503 1.094 2.956 1.247 3.16.153.204 2.153 3.287 5.216 4.608.729.314 1.297.502 1.74.643.731.232 1.396.199 1.921.121.586-.088 1.81-.74 2.065-1.454.255-.714.255-1.325.178-1.454-.076-.128-.28-.204-.586-.357Z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-xl font-bold text-white md:text-2xl">Join Our WhatsApp Channel</h3>
                  <p className="mt-2 text-sm text-white/80 md:text-base">
                    Get daily spiritual updates, Chaturmas reminders, festival schedules, and connect with fellow devotees.
                  </p>
                </div>
                <a
                  href={WA_CHANNEL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vk-btn h-12 bg-white px-6 text-[#075e54] shadow-lg hover:-translate-y-0.5 hover:bg-white/95"
                >
                  <Users className="h-4 w-4" />
                  Join Channel
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="vk-section !pt-0">
        <div className="vk-container">
          <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-vk-100 via-vk-50 to-white p-5 sm:p-8 md:p-10">
            <SectionHeading align="center" eyebrow="Doubts Cleared" title="Frequently Asked Questions" />
            <div className="mx-auto max-w-3xl space-y-3">
              {faqs.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div
                    key={f.q}
                    className={`overflow-hidden rounded-2xl border bg-white transition-shadow ${
                      open ? "border-vk-200 shadow-card" : "border-vk-100"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      aria-expanded={open}
                    >
                      <span className="text-[15px] font-semibold text-ink">{f.q}</span>
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                          open ? "rotate-180 bg-vk-700 text-white" : "bg-vk-100 text-vk-700"
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </button>
                    <AnimatePresence>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONCLUSION ───────────────────────────────────────────── */}
      <section className="vk-section !pt-0">
        <div className="vk-container">
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-navy px-5 py-10 text-center shadow-[0_24px_60px_-28px_rgba(10,18,51,0.6)] sm:px-10 md:py-14"
          >
            <div className="mx-auto max-w-3xl">
              <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[hsl(var(--gold))]">
                <ScrollText className="h-7 w-7" />
              </span>
              <h2 className="vk-h2 mb-5 !text-white">
                Utilise These Holy Months
              </h2>
              <p className="mb-4 text-[15px] leading-relaxed text-white/75 md:text-base">
                Devotional activities performed during Chaturmas yield immense blessings of Lord Krishna. By reducing
                bodily necessities, staying in holy places and associating with great devotees, one should utilise this
                holy period of the year.
              </p>
              <p className="mb-8 text-[15px] leading-relaxed text-white/75 md:text-base">
                Perform more and more austerity, charity and devotional service during Chaturmas to purify one&apos;s
                existence and please Lord Sri Krishna.
              </p>
              <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <a
                  href="tel:+918977761187"
                  className="vk-btn h-12 bg-white px-6 text-vk-800 hover:bg-vk-50"
                >
                  <Phone className="h-4 w-4" />
                  Call the Temple
                </a>
                <a
                  href={WA_CHANNEL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vk-btn-ghost-light h-12 px-6"
                >
                  <MessageCircle className="h-4 w-4" />
                  Join WhatsApp Channel
                </a>
                <a
                  href={MAPS_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vk-btn-ghost-light h-12 px-6"
                >
                  <Navigation className="h-4 w-4" />
                  Visit the Temple
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      </div>

    </PageLayout>
  );
}
