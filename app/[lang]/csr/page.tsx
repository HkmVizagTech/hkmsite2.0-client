"use client";

import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Utensils, Hospital, Users, Clock, Phone, Mail, MessageCircle, ChevronRight,
  ShieldCheck, Quote, Beef, BookOpen, GraduationCap, Building2,
  HeartHandshake, Target, Landmark, FileCheck2, Drumstick,
  Music, Globe, Flower2, Award, Home, ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Shared data                                                         */
/* ------------------------------------------------------------------ */

const heroStats = [
  { icon: Utensils, value: "3,000+", label: "Meals served every single day" },
  { icon: Hospital, value: "3", label: "Government hospitals served daily" },
  { icon: Users, value: "10.95 L+", label: "Beneficiaries every year" },
  { icon: Clock, value: "365", label: "Days of service — no breaks" },
];

// CSR enquiries go straight to WhatsApp with a prefilled message — the same
// number the rest of the site uses for temple contact (+91 89777 61187).
const CSR_WHATSAPP_URL = `https://wa.me/918977761187?text=${encodeURIComponent(
  "Hare Krishna! I would like to enquire about CSR (Corporate Social Responsibility) partnership opportunities with Hare Krishna Movement Visakhapatnam."
)}`;

const programs = [
  {
    id: "subhojanam",
    icon: Hospital,
    title: "Subhojanam",
    tag: "Free hospital meals",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677363792-1783677363601-462395264797134589073566144398536696847591n.jpg",
    desc: "3,000+ hot, nutritious meals served daily to patients and their attendants at government hospitals in Visakhapatnam and Kakinada.",
  },
  {
    id: "annadaan",
    icon: Utensils,
    title: "Annadaan",
    tag: "Food for hungry souls",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1786100757954-1786100756855-annadan2.jpg",
    desc: "Sanctified prasadam distributed every day to devotees, students and the underprivileged — the highest charity in the Vedic tradition.",
  },
  {
    id: "gau-seva",
    icon: Beef,
    title: "Gau Seva",
    tag: "Cow care & protection",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783676646237-1783676645536-ChatGPTImageJul102026031357PM.png",
    desc: "Fodder, medical care and loving shelter for the sacred cows — protection of Gau Mata that Lord Krishna Himself cherishes.",
  },
  {
    id: "gita-daan",
    icon: BookOpen,
    title: "Gita Daan",
    tag: "The gift of wisdom",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783672760162-1783672758959-ChatGPTImageJul92026043444PM.png",
    desc: "Bhagavad-Gita As It Is placed in the hands of students, prisoners and seekers — transcendental knowledge that transforms lives.",
  },
  {
    id: "value-education",
    icon: GraduationCap,
    title: "Value Education",
    tag: "Character for the next generation",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1789641526472-1789641525685-GlimpsesfromKrishnaPulseYouthFestivalKrishnaPulsebroughttogether1200studentsfor.jpg",
    desc: "Timeless Vedic values taught to school children through interactive sessions, competitions and cultural programs.",
  },
  {
    id: "spiritual-wellness",
    icon: Flower2,
    title: "Spiritual Wellness",
    tag: "Gita classes & youth programs",
    image: "/assets/gallery-class.jpg",
    desc: "Daily Bhagavad Gita classes, kirtans, youth empowerment sessions and spiritual retreats — open to every section of society.",
  },
];

const subhojanamHospitals = [
  {
    name: "King George Hospital (KGH), Visakhapatnam",
    desc: "1,700+ meals served daily to patients and their attendants at Visakhapatnam's largest government hospital.",
  },
  {
    name: "Government General Hospital (GGH), Kakinada",
    desc: "Up to 500 meals served daily, extended from Visakhapatnam in 2021 to serve families in the Godavari region.",
  },
  {
    name: "Homi Bhabha Cancer Hospital & Research Centre, Visakhapatnam",
    desc: "Up to 500 meals served daily for cancer patients and their caregivers at the Tata Memorial Centre facility.",
  },
];

const annadaanImpact = [
  { period: "Daily prasadam at the temple", meals: "500+ plates every day" },
  { period: "Festival mahaprasadam (Janmashtami, Ratha Yatra & more)", meals: "5,000+ plates per festival" },
  { period: "Gita Jayanti & special occasions", meals: "2,000+ plates per occasion" },
  { period: "Emergency & community feeding drives", meals: "Regular, as need arises" },
];

const gauSevaTiers = [
  { title: "Feed 10 Cows for a Day", amount: "₹1,500", desc: "Fresh fodder and nutritious feed for ten cows" },
  { title: "Medicines for Cows", amount: "₹2,500", desc: "Essential medicines and veterinary care" },
  { title: "Feed a Cow for a Month", amount: "₹3,500", desc: "Complete nourishment for one cow for a month" },
  { title: "Green Grass for All Cows", amount: "₹9,000", desc: "A day of green grass for every cow in our care" },
];

const vedicValues = [
  "Respect", "Simplicity", "Forgiveness", "Truthfulness",
  "Non-Violence", "Good Habits", "Self-Control", "Compassion",
];

const wellnessPrograms = [
  { icon: BookOpen, title: "Daily Gita Classes", desc: "Morning and evening discourses on the Bhagavad Gita open to all, in person and online." },
  { icon: GraduationCap, title: "Youth Empowerment", desc: "Personality development, stress management and leadership sessions for college students." },
  { icon: Music, title: "Kirtan & Bhajans", desc: "Soul-stirring devotional music that connects hearts to the divine." },
  { icon: Globe, title: "Cultural Festivals", desc: "Grand celebrations of Janmashtami, Gaura Purnima, Ratha Yatra and other Vaishnava festivals." },
  { icon: Users, title: "Volunteer Engagement", desc: "Structured opportunities for corporate employees to serve hands-on with our programs." },
  { icon: HeartHandshake, title: "Spiritual Retreats", desc: "Guided retreats and seminars on Vedic wisdom for holistic well-being of mind and soul." },
];

const partnerBenefits = [
  {
    icon: FileCheck2,
    title: "80G Tax Exemption",
    desc: "All contributions qualify for tax deduction under Section 80G of the Income Tax Act, with proper receipts and documentation.",
  },
  {
    icon: ShieldCheck,
    title: "Registered & FCRA Compliant",
    desc: "Programs run under registered public charitable trusts of ISKCON Gambheeram Visakhapatnam — fully audited and transparent.",
  },
  {
    icon: Target,
    title: "Measurable Social Impact",
    desc: "Detailed impact reports with beneficiary numbers, photographs and utilization certificates for your CSR filings.",
  },
  {
    icon: Users,
    title: "Employee Volunteering",
    desc: "Involve your teams directly — meal distribution drives, goshala service days and Gita marathon volunteering.",
  },
  {
    icon: Landmark,
    title: "Schedule VII Compliant",
    desc: "Our programs align with Companies Act 2013 Schedule VII — eradicating hunger, healthcare, education and rural development.",
  },
  {
    icon: Award,
    title: "A Legacy of Trust",
    desc: "Serving Visakhapatnam since 2008 under Srila Prabhupada's ISKCON — one of the world's most trusted spiritual organisations.",
  },
];

const testimonials = [
  {
    quote: "When my mother was admitted at KGH, we couldn't afford both food and medicine. The Subhojanam meals were a blessing from God.",
    name: "Ramesh K.",
    role: "Patient Attendant · KGH Visakhapatnam",
  },
  {
    quote: "The prasadam from this temple is truly special — you can taste the love it is cooked with. I am proud to contribute every month knowing someone is fed because of it.",
    name: "Lakshmi Narayana",
    role: "Monthly Donor · Visakhapatnam",
  },
  {
    quote: "I donated medicines for the cows in my late father's name. The goshala team sent a photo of the cows with his name in the sankalpa. It felt like he was still serving Krishna.",
    name: "Anjali Rao",
    role: "Gau Seva Donor · Hyderabad",
  },
  {
    quote: "I was going through the darkest period of my life when someone handed me a copy of the Gita. That single book changed everything.",
    name: "Ramesh Chandra",
    role: "Gita Recipient · Visakhapatnam",
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Animated number counter that starts when scrolled into view. */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      // ease-out cubic
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function CsrPage() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <PageLayout>
      <div className="pt-[var(--header-h)]">
        {/* ── HERO — copy left, banner image right (GVD split banner) ── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-vk-100 via-vk-50 to-white">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-vk-300/30 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-vk-200/50 blur-3xl" />

          <div className="vk-container relative grid items-center gap-12 py-10 md:py-16 lg:grid-cols-2 lg:gap-14">
            {/* Left: copy */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <nav
                aria-label="Breadcrumb"
                className="mb-5 inline-flex max-w-full items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink/70 shadow-sm md:text-[13px]"
              >
                <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-vk-700">
                  <Home className="h-3.5 w-3.5" />
                  Home
                </Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                <span className="truncate font-semibold text-vk-700" aria-current="page">Corporate Social Responsibility</span>
              </nav>
              <div>
                <span className="vk-pill mb-4">Corporate Social Responsibility</span>
              </div>
              <h1 className="vk-h1">
                Creating a Better<br />Society for Tomorrow
              </h1>
              <p className="vk-lead mt-5 max-w-xl">
                Corporate Social Responsibility is a business commitment to creating a positive
                social impact through ethical practices, community engagement, volunteering and
                charitable initiatives. Partner with Hare Krishna Movement Visakhapatnam — feed the
                hungry, care for cows, educate children and uplift society through the timeless
                wisdom of the Vedas.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={() => scrollTo("partner-with-us")} className="vk-btn-gold px-6 py-3">
                  Partner With Us <ArrowRight className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => scrollTo("our-programs")} className="vk-btn-outline px-6 py-3">
                  Explore Our Programs
                </button>
              </div>
            </motion.div>

            {/* Right: banner image */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
              className="relative"
            >
              <div aria-hidden className="absolute -inset-3 rotate-1 rounded-[2rem] bg-gradient-to-br from-vk-300/50 via-vk-200/40 to-transparent" />
              <div className="relative overflow-hidden rounded-3xl bg-vk-100 shadow-[0_30px_60px_-28px_rgba(30,58,138,0.55)]">
                <Image
                  src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677363792-1783677363601-462395264797134589073566144398536696847591n.jpg"
                  alt="Prasadam distribution by Hare Krishna Movement Visakhapatnam"
                  width={720} height={540} priority
                  className="h-auto w-full object-cover"
                />
              </div>
              {/* Floating daily-meals badge */}
              <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl bg-white px-5 py-3.5 shadow-lift md:-left-6">
                <span className="vk-icon-chip h-10 w-10">
                  <Utensils className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-heading text-xl font-extrabold leading-none text-vk-700">3,000+</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-ink/60">meals every day</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="vk-container relative pb-10 pt-4 md:pb-14">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {heroStats.map((s) => (
                <div key={s.label} className="vk-card flex flex-col items-center px-3 py-5 text-center">
                  <span className="vk-icon-chip mb-2 h-10 w-10">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="font-heading text-2xl font-extrabold text-vk-700 md:text-3xl">{s.value}</span>
                  <span className="mt-1 text-xs font-medium text-muted-foreground md:text-[13px]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── OUR PROGRAMS OVERVIEW ────────────────────────────────── */}
        <section id="our-programs" className="vk-section scroll-mt-[var(--header-h)]">
          <div className="vk-container">
            <SectionHeading align="center" eyebrow="What We Do" title="Our CSR Programs" />
            <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
              {programs.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 0.06}>
                  <button
                    type="button"
                    onClick={() => scrollTo(p.id)}
                    className="vk-card vk-card-hover group flex h-full w-full flex-col overflow-hidden text-left"
                  >
                    <div className="vk-tile h-44 w-full rounded-none shadow-none">
                      <Image
                        src={p.image} alt={p.title} fill sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                      <div className="vk-tile-caption flex items-center gap-2 !p-4">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/90 text-vk-700">
                          <p.icon className="h-[18px] w-[18px]" />
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-white/90">{p.tag}</span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-vk-700">{p.title}</h3>
                      <p className="mt-1.5 flex-1 text-[15px] leading-relaxed text-muted-foreground">{p.desc}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-vk-500">
                        Learn more <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SUBHOJANAM — navy feature card ───────────────────────── */}
        <section id="subhojanam" className="scroll-mt-[var(--header-h)] pb-10 md:pb-16">
          <div className="vk-container">
            <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-vk-800 to-vk-900 px-5 py-10 md:px-12 md:py-14">
              <div aria-hidden className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-vk-500/20 blur-2xl" />
              <div aria-hidden className="absolute -bottom-24 -left-16 -z-10 h-64 w-64 rounded-full bg-white/5" />
              <SectionHeading align="center" light eyebrow="CSR Initiative · Hospital Meals" title="Subhojanam — Food With Dignity" />

              <div className="mb-8 grid gap-4 sm:grid-cols-2 md:mb-10 md:gap-5 lg:grid-cols-3">
                {subhojanamHospitals.map((h, i) => (
                  <Reveal key={h.name} delay={i * 0.08}>
                    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
                      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
                        <Hospital className="h-5 w-5" />
                      </span>
                      <h3 className="text-base font-bold text-white md:text-lg">{h.name}</h3>
                      <p className="mt-1.5 flex-1 text-[15px] leading-relaxed text-white/70">{h.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* Impact strip */}
              <Reveal>
                <div className="rounded-2xl bg-white p-6 md:p-8">
                  <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
                    {[
                      { value: "3,000+", label: "Meals served daily" },
                      { value: "365", label: "Days a year, without exception" },
                      { value: "10.95 L+", label: "Beneficiaries every year" },
                      { value: "₹25", label: "Cost of one wholesome meal" },
                    ].map((s) => (
                      <div key={s.label}>
                        <p className="font-heading text-3xl font-extrabold text-vk-700 md:text-4xl">{s.value}</p>
                        <p className="mt-1 text-xs font-medium text-muted-foreground md:text-[13px]">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-6 border-t border-vk-100 pt-6 text-center text-[15px] leading-relaxed text-muted-foreground">
                    When a family below the poverty line is guaranteed one hot meal for every member, that
                    is one less expense — savings that flow to medicine, education and dignity. Subhojanam
                    is run under <strong className="text-foreground">Touchstone Charities</strong>, an
                    initiative of Hare Krishna Movement Visakhapatnam.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── ANNADAAN ─────────────────────────────────────────────── */}
        <section id="annadaan" className="vk-section vk-band scroll-mt-[var(--header-h)]">
          <div className="vk-container">
            <SectionHeading
              align="center"
              eyebrow="CSR Initiative · Food Security"
              title="Annadaan — The Highest Charity"
              subtitle="The scriptures glorify Anna Daan — the donation of food — as the highest of all charities, for food sustains life itself. Every plate is cooked with devotion in hygienic kitchens, offered to the Lord, and served with love and dignity."
            />

            <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-14">
              <Reveal className="relative">
                <div aria-hidden className="absolute -inset-3 -rotate-1 rounded-[2rem] bg-gradient-to-br from-vk-200/70 to-transparent" />
                <div className="relative overflow-hidden rounded-3xl bg-vk-100 shadow-[0_30px_60px_-28px_rgba(30,58,138,0.55)]">
                  <Image
                    src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677363792-1783677363601-462395264797134589073566144398536696847591n.jpg"
                    alt="Annadaan meal distribution" width={720} height={540}
                    className="h-auto w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 right-3 rounded-2xl bg-white px-5 py-4 text-center shadow-lift md:-right-4">
                  <p className="font-heading text-3xl font-extrabold text-vk-700">₹25</p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/60">feeds 1 person</p>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <h3 className="vk-bar-title mb-5 text-xl text-foreground md:text-2xl">Where Your Support Goes</h3>
                <div className="space-y-3">
                  {annadaanImpact.map((row) => (
                    <div key={row.period} className="vk-card flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <p className="text-[15px] font-medium text-foreground">{row.period}</p>
                      <p className="vk-pill-soft shrink-0 self-start !normal-case !tracking-normal sm:self-auto">{row.meals}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-5 rounded-2xl border border-vk-200 bg-white p-4 text-[15px] leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">Our goal:</strong> to grow Anna Daan into a daily
                  city-wide feeding network so that no one in Visakhapatnam sleeps hungry — and your
                  CSR partnership is what makes that possible.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── GAU SEVA ─────────────────────────────────────────────── */}
        <section id="gau-seva" className="vk-section scroll-mt-[var(--header-h)]">
          <div className="vk-container grid items-center gap-12 md:grid-cols-2 lg:gap-14">
            <Reveal>
              <span className="vk-pill mb-4">CSR Initiative · Cow Protection</span>
              <h2 className="vk-h2">Gau Seva — Caring for Gau Mata</h2>
              <p className="vk-lead mt-5">
                In Vedic culture the cow is honoured as Gau Mata — a mother who gives her milk and
                everything else in service of humanity. The scriptures glorify cow protection
                (go-raksha) as one of the most meritorious of all services, pleasing Lord Krishna
                who Himself served cows as a cowherd boy in Vrindavana.
              </p>
              <p className="vk-lead mt-4">
                Our goshala provides fresh fodder, clean water, green grass, regular veterinary
                check-ups, medicines and loving shelter for the cows in our care — 365 days a year.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {gauSevaTiers.map((t) => (
                  <div key={t.title} className="vk-card flex items-start gap-3 p-4">
                    <span className="vk-icon-chip h-10 w-10">
                      <Drumstick className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold leading-snug text-foreground">{t.title}</p>
                      <p className="mt-0.5 font-heading text-base font-extrabold text-vk-700">{t.amount}</p>
                      <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.08} className="relative">
              <div aria-hidden className="absolute -inset-3 rotate-1 rounded-[2rem] bg-gradient-to-br from-vk-200/70 to-transparent" />
              <div className="relative overflow-hidden rounded-3xl bg-vk-100 shadow-[0_30px_60px_-28px_rgba(30,58,138,0.55)]">
                <Image
                  src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783676646237-1783676645536-ChatGPTImageJul102026031357PM.png"
                  alt="Cows cared for at the goshala" width={600} height={440}
                  className="h-auto w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 left-3 rounded-2xl bg-white px-5 py-4 text-center shadow-lift md:-left-4">
                <p className="font-heading text-2xl font-extrabold text-vk-700">go-raksha</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-ink/60">Service dear to Krishna</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── GITA DAAN + VALUE EDUCATION ──────────────────────────── */}
        <section id="gita-daan" className="vk-section vk-band scroll-mt-[var(--header-h)]">
          <div className="vk-container">
            <SectionHeading align="center" eyebrow="CSR Initiative · Education & Values" title="Gita Daan & Value Education" />

            {/* Impact counters */}
            <div className="mx-auto mb-10 grid max-w-5xl grid-cols-2 gap-3 text-center md:mb-14 md:grid-cols-4 md:gap-4">
              {[
                { to: 40, suffix: " M+", label: "Gitas distributed worldwide" },
                { to: 89, suffix: "+", label: "Languages of the Gita" },
                { to: 18, suffix: "", label: "Chapters of timeless wisdom" },
                { to: 250, suffix: "", label: "₹ places one Gita in a seeker's hands" },
              ].map((s, i) => (
                <Reveal key={s.label} delay={i * 0.06}>
                  <div className="vk-card h-full px-3 py-6">
                    <p className="font-heading text-3xl font-extrabold text-vk-700 md:text-4xl">
                      {i < 3 ? <CountUp to={s.to} suffix={s.suffix} /> : s.to}
                    </p>
                    <p className="mt-1 text-xs font-medium text-muted-foreground md:text-[13px]">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              {/* Gita Daan */}
              <Reveal>
                <article className="vk-card h-full overflow-hidden">
                  <div className="relative overflow-hidden bg-vk-100">
                    <Image
                      src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783672760162-1783672758959-ChatGPTImageJul92026043444PM.png"
                      alt="Bhagavad-Gita As It Is" width={640} height={360}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                  <div className="p-5 md:p-7">
                    <h3 className="vk-h3">Gita Daan — The Gift of Knowledge</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                      Srila Prabhupada called the Bhagavad Gita &ldquo;the essence of India&apos;s spiritual
                      wisdom.&rdquo; Through Gita Daan we place Bhagavad-Gita As It Is into the hands of
                      students, prisoners, hostel dwellers and sincere seekers — a seed of transcendental
                      knowledge that can transform a life forever.
                    </p>
                    <div className="mt-4 rounded-2xl border border-vk-100 bg-vk-50 p-4 text-[15px] leading-relaxed text-muted-foreground">
                      <p><strong className="text-foreground">Cost:</strong> ₹250 places one full edition of Bhagavad-Gita As It Is in a seeker&apos;s hands. Corporates can sponsor Gita marathon drives across schools and colleges in Andhra Pradesh.</p>
                    </div>
                  </div>
                </article>
              </Reveal>

              {/* Value education */}
              <Reveal delay={0.08}>
                <article className="vk-card h-full p-3 md:p-4">
                  {/* 1:1 glimpses collage — one featured + two stacked */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="vk-tile aspect-square shadow-none">
                      <Image
                        src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1789641527236-1789641526047-GlimpsesfromthemostexcitingVanabhojanameventconductedatourHareKrishnaVaikunthamte.jpg"
                        alt="Vanabhojanam celebration at Hare Krishna Vaikuntham" fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="grid grid-rows-2 gap-3">
                      <div className="vk-tile shadow-none">
                        <Image
                          src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1789641526855-1789641525984-GlimpsesfromthemostexcitingVanabhojanameventconductedatourHareKrishnaVaikunthamte1.jpg"
                          alt="Students enjoying the Vanabhojanam event" fill
                          sizes="(max-width: 1024px) 50vw, 25vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="vk-tile shadow-none">
                        <Image
                          src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1789641526472-1789641525685-GlimpsesfromKrishnaPulseYouthFestivalKrishnaPulsebroughttogether1200studentsfor.jpg"
                          alt="Krishna Pulse youth festival bringing together 1,200 students" fill
                          sizes="(max-width: 1024px) 50vw, 25vw"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-2 pt-5 md:p-3 md:pt-6">
                    <h3 className="vk-h3">Value Education — Building Strong Children</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                      &ldquo;It is easier to build strong children than to repair broken adults.&rdquo; Our
                      value education outreach takes timeless Vedic values into schools through interactive
                      sessions, cultural programs and competitions — nurturing empathy, discipline and
                      purpose in the next generation.
                    </p>
                    <p className="mb-3 mt-5 text-xs font-bold uppercase tracking-widest text-vk-700">
                      Our curriculum imparts values such as:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {vedicValues.map((v) => (
                        <span key={v} className="rounded-full border border-vk-200 bg-vk-50 px-3 py-1.5 text-xs font-semibold text-vk-800">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── SPIRITUAL WELLNESS & COMMUNITY ───────────────────────── */}
        <section id="spiritual-wellness" className="vk-section scroll-mt-[var(--header-h)]">
          <div className="vk-container">
            <SectionHeading align="center" eyebrow="Beyond the Plate" title="Spiritual Wellness & Community Programs" />
            <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
              {wellnessPrograms.map((p, i) => (
                <Reveal key={p.title} delay={(i % 3) * 0.06}>
                  <div className="vk-card vk-card-hover h-full p-6">
                    <span className="vk-icon-chip mb-4 h-12 w-12">
                      <p.icon className="h-6 w-6" />
                    </span>
                    <h3 className="text-lg font-bold text-foreground">{p.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{p.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY PARTNER WITH US ──────────────────────────────────── */}
        <section id="why-partner" className="vk-section vk-band scroll-mt-[var(--header-h)]">
          <div className="vk-container">
            <SectionHeading align="center" eyebrow="For Corporates" title="Why Partner With Us" />
            <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
              {partnerBenefits.map((b, i) => (
                <Reveal key={b.title} delay={(i % 3) * 0.06}>
                  <div className="vk-card vk-card-hover flex h-full flex-col p-6">
                    <span className="vk-icon-chip mb-4 h-12 w-12">
                      <b.icon className="h-6 w-6" />
                    </span>
                    <h3 className="text-lg font-bold text-foreground">{b.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{b.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
        <section className="vk-section">
          <div className="vk-container">
            <SectionHeading align="center" eyebrow="Real Stories" title="Voices of Gratitude" />
            <div className="grid gap-4 md:grid-cols-2 md:gap-5">
              {testimonials.map((t, i) => (
                <Reveal key={t.name} delay={(i % 2) * 0.06}>
                  <figure className="vk-card flex h-full flex-col gap-4 p-6 md:p-7">
                    <Quote className="h-8 w-8 text-vk-300" />
                    <blockquote className="flex-1 font-serif-display text-[17px] italic leading-relaxed text-ink/80">
                      {t.quote}
                    </blockquote>
                    <figcaption className="flex items-center gap-3 border-t border-vk-100 pt-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-vk-700 text-sm font-bold text-white">
                        {t.name.charAt(0)}
                      </span>
                      <span>
                        <span className="block text-[15px] font-semibold text-foreground">{t.name}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{t.role}</span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARTNER WITH US / CONTACT ────────────────────────────── */}
        <section id="partner-with-us" className="scroll-mt-[var(--header-h)] pb-10 md:pb-16">
          <div className="vk-container">
            <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-vk-800 to-vk-900 px-5 py-10 md:px-12 md:py-14">
              <div aria-hidden className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-vk-500/20 blur-2xl" />
              <div aria-hidden className="absolute -bottom-24 -left-16 -z-10 h-64 w-64 rounded-full bg-white/5" />
              <SectionHeading align="center" light eyebrow="Collaborate With Us" title="Fulfil Your CSR Objectives" />

              <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-8">
                {/* Ways to support */}
                <Reveal>
                  <div className="h-full rounded-2xl border border-white/10 bg-white/[0.06] p-5 md:p-7">
                    <h3 className="mb-5 text-xl font-bold text-white">Ways Your Company Can Support</h3>
                    <div className="space-y-3">
                      {[
                        { icon: Hospital, title: "Sponsor Subhojanam Hospital Meals", desc: "₹25 per meal — fund daily meals at KGH, GGH Kakinada and Homi Bhabha Cancer Hospital, or sponsor a full day of distribution." },
                        { icon: Utensils, title: "Sponsor Annadaan", desc: "Fund daily prasadam, festival mahaprasadam drives or community feeding across Visakhapatnam." },
                        { icon: Beef, title: "Support Gau Seva", desc: "Fodder, medicines, veterinary care or shelter infrastructure for the cows in our goshala." },
                        { icon: BookOpen, title: "Fund Gita Daan & Value Education", desc: "Sponsor books, school programs and value-education contests for students across Andhra Pradesh." },
                        { icon: Building2, title: "Support the Temple of Tomorrow", desc: "Join the Square Foot Seva campaign for the Hare Krishna Vaikuntham temple project at Gambheeram." },
                        { icon: Users, title: "Employee Volunteering Programs", desc: "Engage your teams in distribution drives, goshala service days and festival volunteering." },
                      ].map((item) => (
                        <div key={item.title} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                            <item.icon className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-[15px] font-semibold text-white">{item.title}</p>
                            <p className="mt-0.5 text-sm leading-relaxed text-white/65">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>

                {/* Contact card */}
                <Reveal delay={0.08} className="flex flex-col">
                  <div className="rounded-2xl bg-white p-6 md:p-7">
                    <span className="vk-pill mb-3">CSR Queries</span>
                    <h3 className="vk-h3">Talk to Our CSR Team</h3>
                    <div className="mt-5 space-y-3">
                      <a href="tel:+918977761187" className="flex items-center gap-3 rounded-xl border border-vk-100 bg-vk-50 p-4 transition hover:border-vk-300 hover:bg-white">
                        <span className="vk-icon-chip h-10 w-10 bg-white">
                          <Phone className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-xs text-muted-foreground">Call us</p>
                          <p className="text-[15px] font-semibold text-foreground">+91 89777 61187</p>
                        </div>
                      </a>
                      <a href="mailto:social@hkmvizag.org" className="flex items-center gap-3 rounded-xl border border-vk-100 bg-vk-50 p-4 transition hover:border-vk-300 hover:bg-white">
                        <span className="vk-icon-chip h-10 w-10 bg-white">
                          <Mail className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">Write to us</p>
                          <p className="break-words text-[15px] font-semibold text-foreground">social@hkmvizag.org</p>
                        </div>
                      </a>
                      <div className="flex items-center gap-3 rounded-xl border border-vk-100 bg-vk-50 p-4">
                        <span className="vk-icon-chip h-10 w-10 bg-white">
                          <Building2 className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-xs text-muted-foreground">Visit us</p>
                          <p className="text-[15px] font-semibold text-foreground">Chaitanya Bhavan, Gambhiram, Visakhapatnam</p>
                        </div>
                      </div>
                    </div>
                    <a
                      href={CSR_WHATSAPP_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="vk-btn-primary mt-6 w-full whitespace-normal py-3 text-center"
                    >
                      <MessageCircle className="h-4 w-4 shrink-0" />
                      Send a CSR Partnership Enquiry
                    </a>
                  </div>

                  <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-white/70">
                    <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> 80G Tax Exemption</span>
                    <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> FCRA Registered Trust</span>
                    <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Serving since 2008</span>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
