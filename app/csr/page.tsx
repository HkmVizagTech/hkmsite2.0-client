"use client";

import PageLayout from "@/components/PageLayout";
import Ornament from "@/components/Ornament";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Utensils, Hospital, Users, Clock, Phone, Mail, ChevronRight,
  ShieldCheck, Quote, Beef, BookOpen, GraduationCap, Building2,
  HeartHandshake, Target, Landmark, FileCheck2, Drumstick,
  Music, Globe, Flower2, Award,
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

function SectionHeading({
  eyebrow, title, dark = false,
}: { eyebrow: string; title: string; dark?: boolean }) {
  return (
    <div className="text-center mb-12 md:mb-16">
      <p className={`text-gold text-sm tracking-[0.2em] uppercase mb-4 font-medium`}>{eyebrow}</p>
      <Ornament className={`mb-5 ${dark ? "text-[hsl(var(--gold))]" : ""}`} />
      <h2 className={`font-heading text-3xl md:text-4xl font-bold ${dark ? "text-white" : "text-foreground"}`}>
        {title}
      </h2>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function CsrPage() {
  // One in-view ref per section keeps scroll-triggered animations cheap.
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const [intro, programsRef, subhojanam, annadaan, gau, education, partner, contact] = refs;
  const views = refs.map((r) => useInView(r, { once: true, margin: "-80px" }));
  const [vIntro, vPrograms, vSubhojanam, vAnnadaan, vGau, vEducation, vPartner, vContact] = views;

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <PageLayout>
      {/* ── HERO — text left, banner image right (like a split banner) ── */}
      <section className="relative overflow-hidden bg-[hsl(220,60%,9%)] pt-20">
        {/* Decorative glows */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gold/10 blur-3xl" aria-hidden />
        <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-primary/20 blur-3xl" aria-hidden />

        <div className="relative z-10 container mx-auto px-4 py-14 md:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: copy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            >
              <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/60">
                <Link href="/" className="hover:text-white">Home</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-white/90">Corporate Social Responsibility</span>
              </nav>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-gold">
                Corporate Social Responsibility
              </p>
              <h1 className="font-heading text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl mb-6">
                Creating a Better<br />Society for Tomorrow
              </h1>
              <p className="mb-8 max-w-xl text-base leading-relaxed text-white/75">
                Corporate Social Responsibility is a business commitment to creating a positive
                social impact through ethical practices, community engagement, volunteering and
                charitable initiatives. Partner with Hare Krishna Movement Visakhapatnam — feed the
                hungry, care for cows, educate children and uplift society through the timeless
                wisdom of the Vedas.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => scrollTo("partner-with-us")}
                  className="rounded-full bg-gradient-gold px-7 py-3.5 text-sm font-bold text-[hsl(220,60%,12%)] shadow-gold transition hover:opacity-90"
                >
                  Partner With Us
                </button>
                <button
                  onClick={() => scrollTo("our-programs")}
                  className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  Explore Our Programs
                </button>
              </div>
            </motion.div>

            {/* Right: banner image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 rotate-1 rounded-3xl bg-gradient-to-br from-gold/20 to-primary/10" aria-hidden />
              <Image
                src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677363792-1783677363601-462395264797134589073566144398536696847591n.jpg"
                alt="Prasadam distribution by Hare Krishna Movement Visakhapatnam"
                width={720} height={540} priority
                className="relative w-full rounded-2xl object-cover shadow-elevated"
              />
              {/* Floating daily-meals badge */}
              <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl bg-gradient-gold px-5 py-3.5 shadow-gold md:-left-6">
                <Utensils className="h-6 w-6 shrink-0 text-[hsl(220,60%,12%)]" />
                <div>
                  <p className="font-heading text-xl font-bold leading-none text-[hsl(220,60%,12%)]">3,000+</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[hsl(220,60%,20%)]">meals every day</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 border-t border-white/10 bg-white/5 backdrop-blur-md">
          <div className="container mx-auto grid grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
            {heroStats.map((s) => (
              <div key={s.label} className="flex flex-col items-center px-4 py-5 text-center">
                <span className="font-heading text-2xl font-bold text-gold md:text-3xl">{s.value}</span>
                <span className="mt-0.5 text-xs font-semibold text-white/90">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR PROGRAMS OVERVIEW ────────────────────────────────── */}
      <section id="our-programs" className="py-16 md:py-20 bg-white dark:bg-background" ref={programsRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={vPrograms ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          >
            <SectionHeading eyebrow="What We Do" title="Our CSR Programs" />
          </motion.div>
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p, i) => (
              <motion.button
                key={p.id}
                onClick={() => scrollTo(p.id)}
                initial={{ opacity: 0, y: 30 }} animate={vPrograms ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 * i }}
                whileHover={{ y: -6 }}
                className="group overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-shadow hover:shadow-elevated"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={p.image} alt={p.title} fill sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-gold shadow-gold">
                      <p.icon className="h-4.5 w-4.5 text-[hsl(220,60%,12%)]" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/90">{p.tag}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gold-deep">
                    Learn more <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUBHOJANAM ───────────────────────────────────────────── */}
      <section id="subhojanam" className="bg-[hsl(220,60%,10%)] py-16 md:py-20" ref={subhojanam}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={vSubhojanam ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          >
            <SectionHeading eyebrow="CSR Initiative · Hospital Meals" title="Subhojanam — Food With Dignity" dark />
          </motion.div>

          <div className="mx-auto mb-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {subhojanamHospitals.map((h, i) => (
              <motion.div
                key={h.name}
                initial={{ opacity: 0, y: 30 }} animate={vSubhojanam ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.12 * i }}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15">
                  <Hospital className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-heading text-base font-bold text-white mb-2">{h.name}</h3>
                <p className="text-sm leading-relaxed text-white/60 flex-1">{h.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Impact strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={vSubhojanam ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white/5 p-8"
          >
            <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
              {[
                { value: "3,000+", label: "Meals served daily" },
                { value: "365", label: "Days a year, without exception" },
                { value: "10.95 L+", label: "Beneficiaries every year" },
                { value: "₹25", label: "Cost of one wholesome meal" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-heading text-3xl font-bold text-gold md:text-4xl">{s.value}</p>
                  <p className="mt-1 text-xs font-semibold text-white/70">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 border-t border-white/10 pt-6 text-center text-sm leading-relaxed text-white/60">
              When a family below the poverty line is guaranteed one hot meal for every member, that
              is one less expense — savings that flow to medicine, education and dignity. Subhojanam
              is run under <strong className="text-white/90">Touchstone Charities</strong>, an
              initiative of Hare Krishna Movement Visakhapatnam.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── ANNADAAN ─────────────────────────────────────────────── */}
      <section id="annadaan" className="py-16 md:py-20 bg-white dark:bg-background" ref={annadaan}>
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={vAnnadaan ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
              <p className="text-gold text-sm tracking-[0.2em] uppercase mb-4 font-medium">CSR Initiative · Food Security</p>
              <Ornament className="mb-5" />
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                Annadaan — The Highest Charity
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The scriptures glorify Anna Daan — the donation of food — as the highest of all
                charities, for food sustains life itself. Every plate is cooked with devotion in
                hygienic kitchens, offered to the Lord, and served with love and dignity.
              </p>
            </motion.div>
          </div>

          <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }} animate={vAnnadaan ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.15 }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/10 to-gold/10 -rotate-1" />
              <Image
                src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677363792-1783677363601-462395264797134589073566144398536696847591n.jpg"
                alt="Annadaan meal distribution" width={720} height={540}
                className="relative w-full rounded-2xl object-cover shadow-elevated"
              />
              <div className="absolute -bottom-4 -right-4 rounded-2xl bg-gradient-gold px-5 py-4 text-center shadow-gold">
                <p className="font-heading text-3xl font-bold text-[hsl(220,60%,12%)]">₹25</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(220,60%,20%)]">feeds 1 person</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }} animate={vAnnadaan ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }}
            >
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">Where Your Support Goes</h3>
              <div className="space-y-3">
                {annadaanImpact.map((row) => (
                  <div key={row.period} className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
                    <p className="text-sm font-medium text-foreground">{row.period}</p>
                    <p className="whitespace-nowrap rounded-full bg-gold/10 px-3 py-1 text-xs font-bold text-gold-deep">{row.meals}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Our goal:</strong> to grow Anna Daan into a daily
                city-wide feeding network so that no one in Visakhapatnam sleeps hungry — and your
                CSR partnership is what makes that possible.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── GAU SEVA ─────────────────────────────────────────────── */}
      <section id="gau-seva" className="py-16 md:py-20 bg-white dark:bg-background" ref={gau}>
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }} animate={vGau ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }}
            >
              <p className="text-gold text-sm tracking-[0.2em] uppercase mb-4 font-medium">CSR Initiative · Cow Protection</p>
              <Ornament className="mb-5 !justify-start" />
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Gau Seva — Caring for Gau Mata
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In Vedic culture the cow is honoured as Gau Mata — a mother who gives her milk and
                everything else in service of humanity. The scriptures glorify cow protection
                (go-raksha) as one of the most meritorious of all services, pleasing Lord Krishna
                who Himself served cows as a cowherd boy in Vrindavana.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our goshala provides fresh fodder, clean water, green grass, regular veterinary
                check-ups, medicines and loving shelter for the cows in our care — 365 days a year.
              </p>
              <div className="flex flex-col gap-3">
                {gauSevaTiers.map((t) => (
                  <div key={t.title} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Drumstick className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{t.title} <span className="text-gold-deep">· {t.amount}</span></p>
                      <p className="text-xs text-muted-foreground">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }} animate={vGau ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-gold/10 to-primary/10 rotate-1" />
              <Image
                src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783676646237-1783676645536-ChatGPTImageJul102026031357PM.png"
                alt="Cows cared for at the goshala" width={600} height={440}
                className="relative w-full rounded-2xl object-cover shadow-elevated"
              />
              <div className="absolute -bottom-4 -left-4 rounded-2xl border border-border bg-card px-5 py-4 text-center shadow-elevated">
                <p className="font-heading text-2xl font-bold text-primary">go-raksha</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Service dear to Krishna</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── GITA DAAN + VALUE EDUCATION ──────────────────────────── */}
      <section id="gita-daan" className="bg-white py-16 dark:bg-background md:py-20 border-t border-border" ref={education}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={vEducation ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          >
            <SectionHeading eyebrow="CSR Initiative · Education & Values" title="Gita Daan & Value Education" />
          </motion.div>

          {/* Impact counters */}
          <div className="mx-auto mb-14 grid max-w-4xl grid-cols-2 gap-6 text-center md:grid-cols-4">
            {[
              { to: 40, suffix: " M+", label: "Gitas distributed worldwide" },
              { to: 89, suffix: "+", label: "Languages of the Gita" },
              { to: 18, suffix: "", label: "Chapters of timeless wisdom" },
              { to: 250, suffix: "", label: "₹ places one Gita in a seeker's hands" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }} animate={vEducation ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 * i }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <p className="font-heading text-3xl font-bold text-gold md:text-4xl">
                  {i < 3 ? <CountUp to={s.to} suffix={s.suffix} /> : s.to}
                </p>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
            {/* Gita Daan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={vEducation ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className="relative mb-6 overflow-hidden rounded-2xl">
                <Image
                  src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783672760162-1783672758959-ChatGPTImageJul92026043444PM.png"
                  alt="Bhagavad-Gita As It Is" width={640} height={360}
                  className="w-full object-cover"
                />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">Gita Daan — The Gift of Knowledge</h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                Srila Prabhupada called the Bhagavad Gita &ldquo;the essence of India&apos;s spiritual
                wisdom.&rdquo; Through Gita Daan we place Bhagavad-Gita As It Is into the hands of
                students, prisoners, hostel dwellers and sincere seekers — a seed of transcendental
                knowledge that can transform a life forever.
              </p>
              <div className="rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
                <p><strong className="text-foreground">Cost:</strong> ₹250 places one full edition of Bhagavad-Gita As It Is in a seeker&apos;s hands. Corporates can sponsor Gita marathon drives across schools and colleges in Andhra Pradesh.</p>
              </div>
            </motion.div>

            {/* Value education */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={vEducation ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.25 }}
            >
              {/* 1:1 glimpses collage — one featured + two stacked */}
              <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1789641527236-1789641526047-GlimpsesfromthemostexcitingVanabhojanameventconductedatourHareKrishnaVaikunthamte.jpg"
                    alt="Vanabhojanam celebration at Hare Krishna Vaikuntham" fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="grid grid-rows-2 gap-3">
                  <div className="relative overflow-hidden rounded-2xl">
                    <Image
                      src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1789641526855-1789641525984-GlimpsesfromthemostexcitingVanabhojanameventconductedatourHareKrishnaVaikunthamte1.jpg"
                      alt="Students enjoying the Vanabhojanam event" fill
                      sizes="(max-width: 1024px) 100vw, 25vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="relative overflow-hidden rounded-2xl">
                    <Image
                      src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1789641526472-1789641525685-GlimpsesfromKrishnaPulseYouthFestivalKrishnaPulsebroughttogether1200studentsfor.jpg"
                      alt="Krishna Pulse youth festival bringing together 1,200 students" fill
                      sizes="(max-width: 1024px) 100vw, 25vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </div>
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">Value Education — Building Strong Children</h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                &ldquo;It is easier to build strong children than to repair broken adults.&rdquo; Our
                value education outreach takes timeless Vedic values into schools through interactive
                sessions, cultural programs and competitions — nurturing empathy, discipline and
                purpose in the next generation.
              </p>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold-deep">
                Our curriculum imparts values such as:
              </p>
              <div className="flex flex-wrap gap-2">
                {vedicValues.map((v) => (
                  <span key={v} className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground">
                    {v}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SPIRITUAL WELLNESS & COMMUNITY ───────────────────────── */}
      <section id="spiritual-wellness" className="py-16 md:py-20 bg-white dark:bg-background" ref={intro}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={vIntro ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          >
            <SectionHeading eyebrow="Beyond the Plate" title="Spiritual Wellness & Community Programs" />
          </motion.div>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wellnessPrograms.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }} animate={vIntro ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 * i }}
                className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-warm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <p.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-base font-bold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY PARTNER WITH US ──────────────────────────────────── */}
      <section id="why-partner" className="bg-white py-16 dark:bg-background md:py-20 border-t border-border" ref={partner}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={vPartner ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          >
            <SectionHeading eyebrow="For Corporates" title="Why Partner With Us" />
          </motion.div>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {partnerBenefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }} animate={vPartner ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 * i }}
                className="flex flex-col rounded-2xl border border-border bg-card p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
                  <b.icon className="h-6 w-6 text-gold-deep" />
                </div>
                <h3 className="font-heading text-base font-bold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="mx-auto mt-16 max-w-5xl">
            <SectionHeading eyebrow="Real Stories" title="Voices of Gratitude" />
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }} animate={vPartner ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
              >
                <Quote className="h-8 w-8 text-gold/40" />
                <p className="flex-1 text-sm italic leading-relaxed text-muted-foreground">{t.quote}</p>
                <div className="border-t border-border pt-4">
                  <p className="font-heading text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNER WITH US / CONTACT ────────────────────────────── */}
      <section id="partner-with-us" className="bg-[hsl(220,60%,10%)] py-16 md:py-20" ref={contact}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={vContact ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          >
            <SectionHeading eyebrow="Collaborate With Us" title="Fulfil Your CSR Objectives" dark />
          </motion.div>

          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.2fr_1fr]">
            {/* Ways to support */}
            <motion.div
              initial={{ opacity: 0, x: -30 }} animate={vContact ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.15 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-8"
            >
              <h3 className="font-heading text-xl font-bold text-white mb-6">Ways Your Company Can Support</h3>
              <div className="space-y-4">
                {[
                  { icon: Hospital, title: "Sponsor Subhojanam Hospital Meals", desc: "₹25 per meal — fund daily meals at KGH, GGH Kakinada and Homi Bhabha Cancer Hospital, or sponsor a full day of distribution." },
                  { icon: Utensils, title: "Sponsor Annadaan", desc: "Fund daily prasadam, festival mahaprasadam drives or community feeding across Visakhapatnam." },
                  { icon: Beef, title: "Support Gau Seva", desc: "Fodder, medicines, veterinary care or shelter infrastructure for the cows in our goshala." },
                  { icon: BookOpen, title: "Fund Gita Daan & Value Education", desc: "Sponsor books, school programs and value-education contests for students across Andhra Pradesh." },
                  { icon: Building2, title: "Support the Temple of Tomorrow", desc: "Join the Square Foot Seva campaign for the Hare Krishna Vaikuntham temple project at Gambheeram." },
                  { icon: Users, title: "Employee Volunteering Programs", desc: "Engage your teams in distribution drives, goshala service days and festival volunteering." },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 15 }} animate={vContact ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15">
                      <item.icon className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-white/60">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }} animate={vContact ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.25 }}
              className="flex flex-col"
            >
              <div className="rounded-2xl border border-gold/30 bg-gradient-to-b from-gold/10 to-transparent p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-gold">CSR Queries</p>
                <h3 className="font-heading text-xl font-bold text-white mb-6 mt-2">
                  Talk to Our CSR Team
                </h3>
                <div className="space-y-4">
                  <a href="tel:+918977761187" className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                    <Phone className="h-5 w-5 shrink-0 text-gold" />
                    <div>
                      <p className="text-xs text-white/50">Call us</p>
                      <p className="text-sm font-semibold text-white">+91 89777 61187</p>
                    </div>
                  </a>
                  <a href="mailto:social@hkmvizag.org" className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                    <Mail className="h-5 w-5 shrink-0 text-gold" />
                    <div>
                      <p className="text-xs text-white/50">Write to us</p>
                      <p className="text-sm font-semibold text-white">social@hkmvizag.org</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                    <Building2 className="h-5 w-5 shrink-0 text-gold" />
                    <div>
                      <p className="text-xs text-white/50">Visit us</p>
                      <p className="text-sm font-semibold text-white">Chaitanya Bhavan, Gambhiram, Visakhapatnam</p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="mt-6 block rounded-full bg-gradient-gold py-3.5 text-center text-sm font-bold text-[hsl(220,60%,12%)] shadow-gold transition hover:opacity-90"
                >
                  Send a CSR Partnership Enquiry
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-white/50">
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-green-400" /> 80G Tax Exemption</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-green-400" /> FCRA Registered Trust</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-green-400" /> Serving since 2008</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
