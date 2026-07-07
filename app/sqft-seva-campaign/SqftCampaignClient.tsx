"use client";

/**
 * Square Foot Seva Campaign — standalone landing page (VCM-style).
 * Intentionally has NO site Navbar/Footer (ad-campaign friendly, like /janmashtami).
 *
 * All editable campaign copy lives in the CAMPAIGN config object below.
 * Live stats come from GET /seva-stats/sqft-campaign (goal configurable via
 * SQFT_CAMPAIGN_GOAL env var on Railway).
 */

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Phone, ShieldCheck, Loader2, CheckCircle2, ChevronDown, Copy, Check,
  Building2, Award, FileCheck2, Sparkles, UtensilsCrossed, ScrollText,
  Landmark, HeartHandshake, Users,
} from "lucide-react";

type RazorpayConstructor = new (options: Record<string, unknown>) => { open: () => void };

const apiBase = () =>
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/+$/, "");

const loadRazorpay = () =>
  new Promise<void>((resolve, reject) => {
    const win = window as unknown as { Razorpay?: RazorpayConstructor };
    if (win.Razorpay) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Unable to load Razorpay")));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Razorpay"));
    document.body.appendChild(script);
  });

/* ------------------------------------------------------------------ */
/* Campaign configuration — edit copy, images and privileges here.     */
/* ------------------------------------------------------------------ */

const CAMPAIGN = {
  pricePerSqft: 6000,
  minCustomAmount: 500,
  phone: "+91 9063 020 108",
  phoneHref: "tel:+919063020108",
  email: "info@harekrishnavizag.org",
  heroImage: "/assets/home-temple-construction-banner.webp",
  aboutImage: "/assets/vizag-temple-1.jpeg",
  gallery: [
    { src: "/assets/home-temple-construction-banner.webp", alt: "Hare Krishna Vaikuntham Temple construction" },
    { src: "/assets/vizag-temple-1.jpeg", alt: "Temple view" },
    { src: "/assets/gallery-darshan-1.jpg", alt: "Deity darshan" },
    { src: "/assets/gallery-festival-1.jpg", alt: "Festival celebration" },
    { src: "/assets/gallery-annadaan-1.jpg", alt: "Annadana Seva" },
    { src: "/assets/gallery-aarti.jpg", alt: "Evening aarti" },
  ],
};

const PRIVILEGES = [
  {
    icon: UtensilsCrossed,
    title: "Sanctified Prasadam",
    text: "Receive the Lord's prasadam from the temple as a blessing for your seva (within India).",
  },
  {
    icon: Sparkles,
    title: "Puja Participation",
    text: "Participate in the pujas conducted on the auspicious inauguration day of the temple.",
  },
  {
    icon: FileCheck2,
    title: "Contribution Certificate",
    text: "A digital certificate honouring your valued contribution to the temple construction.",
  },
  {
    icon: Landmark,
    title: "80G Tax Exemption",
    text: "Donations qualify for tax exemption under Section 80G of the Income Tax Act.",
  },
];

const HIGHER_PRIVILEGES = [
  {
    icon: ScrollText,
    title: "Name Inscription",
    text: "Larger contributions are honoured with the donor's family name inscribed at the temple.",
  },
  {
    icon: Award,
    title: "Maha Prasadam Box",
    text: "A special Maha prasadam box offered to Their Lordships, sent to your home.",
  },
  {
    icon: HeartHandshake,
    title: "Special Family Pujas",
    text: "Pujas performed in the temple on special occasions of your family — birthdays and anniversaries.",
  },
  {
    icon: Building2,
    title: "Inauguration Invitation",
    text: "A personal invitation to the grand Prana Pratistha ceremonies of Their Lordships.",
  },
];

const FAQS = [
  {
    q: "What is Square Foot Seva?",
    a: "Square Foot Seva invites you to sponsor one or more square feet of the Hare Krishna Vaikuntham Temple's construction at ₹6,000 per square foot. Every square foot you sponsor becomes a permanent part of the Lord's abode.",
  },
  {
    q: "How will my donation be utilised?",
    a: "Your donation directly funds temple construction — materials like cement, steel and stone, and the services of architects, engineers, craftsmen and artisans building the Hare Krishna Vaikuntham Temple in Visakhapatnam.",
  },
  {
    q: "Is my donation eligible for 80G tax exemption?",
    a: "Yes. Donations to Hare Krishna Movement qualify for tax exemption under Section 80G of the Income Tax Act. Select the '80G receipt' option during checkout and provide your PAN.",
  },
  {
    q: "Will I receive a receipt?",
    a: "Yes. An email receipt is sent automatically the moment your payment is confirmed. Your 80G certificate follows separately once your PAN is verified.",
  },
  {
    q: "When will I receive prasadam?",
    a: "Donors within India can expect to receive prasadam within a month of their donation. Our team will reach out for your address details.",
  },
  {
    q: "What is the minimum amount I can donate?",
    a: `While one square foot is ₹${CAMPAIGN.pricePerSqft.toLocaleString("en-IN")}, contributions of any amount from ₹${CAMPAIGN.minCustomAmount} are gratefully accepted — every rupee is laid into the Lord's home with devotion.`,
  },
  {
    q: "Is it safe to donate online here?",
    a: "Yes. All payments are processed through Razorpay, a PCI-DSS-compliant payment gateway. We never see or store your card details. You may also donate via direct bank transfer using the details on this page.",
  },
  {
    q: "Who is the inspiration behind this project?",
    a: "Srila Prabhupada, Founder-Acharya of the worldwide Hare Krishna Movement, whose vision of grand temples for Sri Krishna inspires devotees to build magnificent centres of devotion, culture and compassion.",
  },
];

const BANK_DETAILS = {
  beneficiaryName: "HARE KRISHNA MOVEMENT INDIA",
  bankName: "IDFC FIRST BANK LTD",
  accountNumber: "10091415313",
  ifsc: "IDFB0080412",
};

/* ------------------------------------------------------------------ */

interface DonorEntry {
  name: string;
  amount: number;
  sqft: number;
  time: string;
}

interface CampaignStats {
  pricePerSqft: number;
  goalSqft: number;
  sqftRaised: number;
  totalAmount: number;
  donorCount: number;
  percent: number;
  latest: DonorEntry[];
  largest: DonorEntry[];
}

const donorLabel = (d: DonorEntry) =>
  d.sqft >= 1
    ? `${d.sqft} square ${d.sqft === 1 ? "foot" : "feet"}`
    : `₹${d.amount.toLocaleString("en-IN")}`;

/** Animated counter that eases up to `value`. */
function CountUp({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const reduce = useReducedMotion();
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const dur = 1400;
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, reduce]);

  // If value updates after animation (live stats refresh), snap to it.
  useEffect(() => {
    if (started.current) setDisplay(value);
  }, [value]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export default function SqftCampaignClient() {
  const reduce = useReducedMotion();

  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [wallTab, setWallTab] = useState<"latest" | "largest">("latest");

  const [sqftCount, setSqftCount] = useState(1);
  const [useCustom, setUseCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [form, setForm] = useState({ name: "", email: "", mobile: "", panNumber: "" });
  const [want80G, setWant80G] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const price = stats?.pricePerSqft || CAMPAIGN.pricePerSqft;
  const finalAmount = useCustom ? Number(customAmount) || 0 : sqftCount * price;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${apiBase()}/seva-stats/sqft-campaign`, { cache: "no-store" });
        if (res.ok) setStats(await res.json());
      } catch {}
    })();
  }, []);

  const handleCopy = (field: string, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const scrollToDonate = () => {
    document.getElementById("donate")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (finalAmount < CAMPAIGN.minCustomAmount) {
      setStatus({ type: "error", message: `Minimum donation is ₹${CAMPAIGN.minCustomAmount}.` });
      return;
    }
    if (!form.name.trim() || !form.email.trim() || !form.mobile.trim()) {
      setStatus({ type: "error", message: "Please fill in your name, email, and phone number." });
      return;
    }
    if (want80G && !form.panNumber.trim()) {
      setStatus({ type: "error", message: "PAN number is required for an 80G receipt." });
      return;
    }

    setSubmitting(true);
    try {
      const orderRes = await fetch(`${apiBase()}/payments/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: "default",
          sourcePage: "/sqft-seva-campaign",
          type: "SQFT",
          sevaName: "Square Foot Seva",
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          mobile: form.mobile.trim(),
          amount: finalAmount,
          certificate: want80G,
          panNumber: want80G ? form.panNumber.trim() : undefined,
        }),
      });

      if (!orderRes.ok) throw new Error("Unable to create payment order. Please try again.");
      const order = await orderRes.json();

      await loadRazorpay();
      const win = window as unknown as { Razorpay?: RazorpayConstructor };
      if (!win.Razorpay) throw new Error("Razorpay checkout is unavailable.");

      new win.Razorpay({
        key: order.key,
        amount: Math.round(finalAmount * 100),
        currency: "INR",
        name: "Hare Krishna Movement Vizag",
        description: "Square Foot Seva — Hare Krishna Vaikuntham Temple",
        order_id: order.orderId,
        prefill: { name: form.name, email: form.email, contact: form.mobile },
        notes: {
          sourcePage: "/sqft-seva-campaign",
          sevaName: "Square Foot Seva",
          sevaType: "SQFT",
        },
        handler: async (response: Record<string, string>) => {
          try {
            const verifyRes = await fetch(`${apiBase()}/payments/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                donationId: order.donationId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            if (!verifyRes.ok) throw new Error("Payment verification failed.");
            setStatus({
              type: "success",
              message: "Thank you! Your square feet have been offered to Their Lordships. Hare Krishna 🙏",
            });
            const nameParts = form.name.trim().split(/\s+/);
            const displayName =
              nameParts.length === 1
                ? nameParts[0]
                : `${nameParts[0]} ${nameParts[nameParts.length - 1].charAt(0)}.`;
            const entry: DonorEntry = {
              name: displayName,
              amount: finalAmount,
              sqft: Math.floor(finalAmount / price),
              time: "just now",
            };
            setStats((s) =>
              s
                ? {
                    ...s,
                    totalAmount: s.totalAmount + finalAmount,
                    donorCount: s.donorCount + 1,
                    sqftRaised: Math.floor((s.totalAmount + finalAmount) / price),
                    percent: Math.min(
                      100,
                      Math.round(((s.totalAmount + finalAmount) / (s.goalSqft * price)) * 10000) / 100
                    ),
                    latest: [entry, ...s.latest],
                  }
                : s
            );
          } catch (err) {
            setStatus({
              type: "error",
              message: err instanceof Error ? err.message : "Payment verification failed.",
            });
          } finally {
            setSubmitting(false);
          }
        },
        modal: { ondismiss: () => setSubmitting(false) },
        theme: { color: "#D69E2E" },
      }).open();
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Something went wrong." });
      setSubmitting(false);
    }
  };

  const percent = stats?.percent ?? 0;
  const gridSquares = 40; // foundation grid — each square = 2.5% of the goal
  const filledSquares = Math.round((percent / 100) * gridSquares);

  const wallEntries = wallTab === "latest" ? stats?.latest || [] : stats?.largest || [];

  return (
    <main className="bg-background">
      {/* ---------- Minimal campaign header ---------- */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[hsl(220,90%,12%)]/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/assets/logo.png" alt="Hare Krishna Movement Vizag" width={38} height={38} className="rounded-full" />
            <div className="leading-tight">
              <p className="font-heading text-sm font-bold text-white md:text-base">Hare Krishna Vaikuntham</p>
              <p className="text-[10px] uppercase tracking-widest text-gold">Square Foot Seva</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <a
              href={CAMPAIGN.phoneHref}
              className="hidden items-center gap-1.5 text-sm text-white/85 hover:text-white sm:flex"
            >
              <Phone className="h-4 w-4 text-gold" />
              {CAMPAIGN.phone}
            </a>
            <button
              onClick={scrollToDonate}
              className="rounded-full bg-gradient-gold px-5 py-2 text-sm font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)] transition-transform hover:scale-105"
            >
              Donate
            </button>
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden pt-16">
        <div className="relative min-h-[72vh] w-full md:min-h-[80vh]">
          <Image
            src={CAMPAIGN.heroImage}
            alt="Hare Krishna Vaikuntham Temple"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(220,85%,10%,0.55)_0%,hsl(220,85%,8%,0.5)_45%,hsl(220,85%,8%,0.92)_100%)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-14 text-center md:pb-20">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold md:text-xs"
            >
              A fundraising initiative of Hare Krishna Movement Visakhapatnam
            </motion.p>
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-4 max-w-3xl font-heading text-4xl font-bold text-white md:text-6xl"
            >
              Hare Krishna Vaikuntham Temple
            </motion.h1>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-6 max-w-2xl text-sm text-white/90 md:text-lg"
            >
              Be a part of the temple in the making — sponsor one or more square feet of construction.
            </motion.p>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col items-center gap-4"
            >
              <p className="rounded-full border border-gold/50 bg-white/5 px-6 py-2 font-heading text-lg font-bold text-gold md:text-2xl">
                ₹{price.toLocaleString("en-IN")} <span className="text-sm font-normal text-white/80 md:text-base">per square foot</span>
              </p>
              <button
                onClick={scrollToDonate}
                className="rounded-full bg-gradient-gold px-10 py-3.5 text-base font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)] transition-transform hover:scale-105 md:text-lg"
              >
                Donate Now
              </button>
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-white/80 md:text-sm">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-gold" /> Prasadam from the temple</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-gold" /> Puja on inauguration day</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-gold" /> 80G tax exemption</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------- Live progress: the Foundation Grid ---------- */}
      <section className="bg-[hsl(220,90%,12%)] py-14 md:py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">Our heartfelt gratitude for your kind support</p>
          <h2 className="mb-8 font-heading text-2xl font-bold text-white md:text-4xl">
            <CountUp value={stats?.sqftRaised ?? 0} />{" "}
            <span className="text-gold">square feet</span> offered so far
          </h2>

          {/* Foundation grid — each square is a piece of the temple's ground */}
          <div
            className="mx-auto mb-4 grid max-w-2xl gap-1 sm:gap-1.5"
            style={{ gridTemplateColumns: "repeat(20, minmax(0, 1fr))" }}
            role="img"
            aria-label={`${percent}% of the campaign goal raised`}
          >
            {Array.from({ length: gridSquares }).map((_, i) => (
              <motion.div
                key={i}
                initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: reduce ? 0 : i * 0.02, duration: 0.3 }}
                className={`aspect-square rounded-[3px] ${
                  i < filledSquares
                    ? "bg-gradient-gold shadow-[0_0_8px_hsl(42,92%,56%,0.5)]"
                    : "border border-white/15 bg-white/5"
                }`}
              />
            ))}
          </div>

          <p className="mb-1 font-heading text-xl font-bold text-gold md:text-2xl">{percent}% raised</p>
          <p className="text-sm text-white/75">
            {(stats?.sqftRaised ?? 0).toLocaleString("en-IN")} square feet raised of a goal of{" "}
            {(stats?.goalSqft ?? 5000).toLocaleString("en-IN")} square feet
          </p>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-white/60">
            <Users className="h-3.5 w-3.5" />
            {(stats?.donorCount ?? 0).toLocaleString("en-IN")} devotees have contributed
          </p>
        </div>
      </section>

      {/* ---------- Donation form ---------- */}
      <section id="donate" className="scroll-mt-20 bg-background py-14 md:py-20">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-2 font-heading text-2xl font-bold text-primary md:text-4xl">Sponsor Your Square Feet</h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Every square foot becomes a permanent part of the Lord&apos;s abode.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-card p-5 shadow-lg md:p-8"
          >
            {/* Square feet selector */}
            <p className="mb-3 text-sm font-semibold text-foreground">Choose your seva</p>
            <div className="mb-3 grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    setUseCustom(false);
                    setSqftCount(n);
                  }}
                  className={`rounded-xl border-2 px-2 py-3 text-center transition-colors ${
                    !useCustom && sqftCount === n
                      ? "border-gold bg-gold/10"
                      : "border-border bg-background hover:border-gold/50"
                  }`}
                >
                  <span className="block font-heading text-lg font-bold text-primary">{n}</span>
                  <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                    sq {n === 1 ? "foot" : "feet"}
                  </span>
                  <span className="mt-1 block text-xs font-semibold text-gold">
                    ₹{(n * price).toLocaleString("en-IN")}
                  </span>
                </button>
              ))}
            </div>

            <div className="mb-5 flex flex-col gap-2 sm:flex-row">
              <div className="flex flex-1 items-center gap-2 rounded-xl border-2 border-border bg-background px-3 py-2">
                <label htmlFor="sqft-count" className="whitespace-nowrap text-xs font-semibold text-muted-foreground">
                  More sq ft:
                </label>
                <input
                  id="sqft-count"
                  type="number"
                  min={1}
                  max={999}
                  value={useCustom ? "" : sqftCount}
                  onChange={(e) => {
                    setUseCustom(false);
                    setSqftCount(Math.max(1, Math.min(999, Number(e.target.value) || 1)));
                  }}
                  className="w-full bg-transparent text-sm font-semibold outline-none"
                />
              </div>
              <div
                className={`flex flex-1 items-center gap-2 rounded-xl border-2 px-3 py-2 ${
                  useCustom ? "border-gold bg-gold/5" : "border-border bg-background"
                }`}
              >
                <label htmlFor="custom-amount" className="whitespace-nowrap text-xs font-semibold text-muted-foreground">
                  Other amount ₹:
                </label>
                <input
                  id="custom-amount"
                  type="number"
                  min={CAMPAIGN.minCustomAmount}
                  placeholder={`${CAMPAIGN.minCustomAmount}+`}
                  value={customAmount}
                  onFocus={() => setUseCustom(true)}
                  onChange={(e) => {
                    setUseCustom(true);
                    setCustomAmount(e.target.value);
                  }}
                  className="w-full bg-transparent text-sm font-semibold outline-none"
                />
              </div>
            </div>

            {/* Donor details */}
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                required
                placeholder="Full name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold"
              />
              <input
                type="tel"
                required
                placeholder="Mobile number *"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold"
              />
              <input
                type="email"
                required
                placeholder="Email address *"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold sm:col-span-2"
              />
            </div>

            <label className="mb-3 flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={want80G}
                onChange={(e) => setWant80G(e.target.checked)}
                className="h-4 w-4 accent-[hsl(42,92%,46%)]"
              />
              I need an 80G tax exemption receipt
            </label>
            {want80G && (
              <input
                type="text"
                placeholder="PAN number *"
                value={form.panNumber}
                onChange={(e) => setForm({ ...form, panNumber: e.target.value.toUpperCase() })}
                className="mb-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm uppercase outline-none focus:border-gold"
              />
            )}

            {status && (
              <p
                className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium ${
                  status.type === "success"
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {status.message}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold py-3.5 text-base font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Processing…
                </>
              ) : (
                <>Donate ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "—"}</>
              )}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-gold" />
              Secure payment via Razorpay · UPI, cards &amp; netbanking accepted
            </p>
          </form>

          {/* Bank transfer */}
          <div className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6">
            <p className="mb-3 flex items-center gap-2 font-heading text-base font-bold text-primary">
              <Building2 className="h-4 w-4 text-gold" /> Prefer direct bank transfer?
            </p>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              {(
                [
                  ["Beneficiary", BANK_DETAILS.beneficiaryName],
                  ["Bank", BANK_DETAILS.bankName],
                  ["Account No.", BANK_DETAILS.accountNumber],
                  ["IFSC", BANK_DETAILS.ifsc],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-2 rounded-lg bg-background px-3 py-2">
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt>
                    <dd className="font-semibold text-foreground">{value}</dd>
                  </div>
                  <button
                    type="button"
                    aria-label={`Copy ${label}`}
                    onClick={() => handleCopy(label, value)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-gold/10 hover:text-gold"
                  >
                    {copiedField === label ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              After transferring, please email your transaction reference and PAN (for 80G) to{" "}
              <a href={`mailto:${CAMPAIGN.email}`} className="font-semibold text-gold">{CAMPAIGN.email}</a>.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Donor privileges ---------- */}
      <section className="bg-card py-14 md:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-heading text-2xl font-bold text-primary md:text-4xl">Donor Privileges</h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Every contributor of at least one square foot receives these privileges.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRIVILEGES.map((p) => (
              <div key={p.title} className="rounded-2xl border border-border bg-background p-5 text-center">
                <p.icon className="mx-auto mb-3 h-8 w-8 text-gold" />
                <h3 className="mb-1.5 font-heading text-base font-bold text-primary">{p.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <h3 className="mb-2 font-heading text-xl font-bold text-primary md:text-2xl">Higher Seva Privileges</h3>
            <p className="mb-6 text-sm text-muted-foreground">Offered with gratitude to larger contributions, based on donation level.</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {HIGHER_PRIVILEGES.map((p) => (
                <div key={p.title} className="rounded-2xl border border-gold/30 bg-background p-5 text-center">
                  <p.icon className="mx-auto mb-3 h-8 w-8 text-gold" />
                  <h3 className="mb-1.5 font-heading text-base font-bold text-primary">{p.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- About / inspiration ---------- */}
      <section className="bg-background py-14 md:py-20">
        <div className="container mx-auto grid max-w-5xl items-center gap-8 px-4 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={CAMPAIGN.aboutImage}
              alt="Hare Krishna Vaikuntham Temple"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">Inspiration &amp; Aspiration</p>
            <h2 className="mb-4 font-heading text-2xl font-bold text-primary md:text-3xl">
              A spiritual landmark rising in Visakhapatnam
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              The Hare Krishna Vaikuntham Temple at Gambheeram is destined to become a beacon of devotion,
              culture and compassion for the City of Destiny — with grand temple halls for Their Lordships,
              an Annadana hall serving free sanctified meals, and centres for Vedic education and outreach.
            </p>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground md:text-base">
              Inspired by the vision of Srila Prabhupada, Founder-Acharya of the worldwide Hare Krishna
              Movement, this temple is being built brick by brick, square foot by square foot, through the
              devotion of thousands of well-wishers like you.
            </p>
            <button
              onClick={scrollToDonate}
              className="rounded-full bg-gradient-gold px-8 py-3 text-sm font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)] transition-transform hover:scale-105"
            >
              Sponsor a Square Foot
            </button>
          </div>
        </div>
      </section>

      {/* ---------- Gallery ---------- */}
      <section className="bg-card py-14 md:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="mb-8 text-center font-heading text-2xl font-bold text-primary md:text-3xl">
            Temple &amp; Seva Glimpses
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {CAMPAIGN.gallery.map((g) => (
              <div key={g.src + g.alt} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="bg-background py-14 md:py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-center font-heading text-2xl font-bold text-primary md:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={f.q} className="overflow-hidden rounded-xl border border-border bg-card">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-foreground md:text-base">{f.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-gold transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <p className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Donor wall: Latest / Largest ---------- */}
      <section className="bg-card py-14 md:py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-2 text-center font-heading text-2xl font-bold text-primary md:text-3xl">
            Respected Contributors
          </h2>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            Join the devotees building the Lord&apos;s home.
          </p>

          <div className="mb-5 flex justify-center gap-2">
            {(["latest", "largest"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setWallTab(tab)}
                className={`rounded-full px-6 py-2 text-sm font-semibold capitalize transition-colors ${
                  wallTab === tab
                    ? "bg-primary text-white"
                    : "bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {wallEntries.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-background px-5 py-8 text-center text-sm text-muted-foreground">
              Be the first devotee to sponsor a square foot of the temple.
            </p>
          ) : (
            <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
              {wallEntries.map((d, i) => (
                <li key={`${d.name}-${d.time}-${i}`} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {d.name} <span className="font-normal text-muted-foreground">offered</span>{" "}
                      <span className="font-bold text-gold">{donorLabel(d)}</span>
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{d.time}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ---------- Final CTA + trust footer ---------- */}
      <section className="bg-[hsl(220,90%,12%)] py-14 text-center md:py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-4 font-heading text-2xl font-bold text-white md:text-4xl">
            Every square foot you offer becomes part of the Lord&apos;s eternal home.
          </h2>
          <button
            onClick={scrollToDonate}
            className="rounded-full bg-gradient-gold px-10 py-3.5 text-base font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)] transition-transform hover:scale-105 md:text-lg"
          >
            Donate Now
          </button>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[hsl(220,90%,10%)] pb-24 pt-10 text-center md:pb-10">
        <div className="container mx-auto max-w-3xl space-y-3 px-4">
          <p className="font-heading text-sm font-bold text-white">Hare Krishna Movement Visakhapatnam</p>
          <p className="text-xs leading-relaxed text-white/60">
            Gambheeram, Visakhapatnam, Andhra Pradesh. Donations are eligible for tax exemption under
            Section 80G of the Income Tax Act, 1961.
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-white/75">
            <a href={CAMPAIGN.phoneHref} className="flex items-center gap-1.5 hover:text-white">
              <Phone className="h-3.5 w-3.5 text-gold" /> {CAMPAIGN.phone}
            </a>
            <a href={`mailto:${CAMPAIGN.email}`} className="hover:text-white">{CAMPAIGN.email}</a>
          </p>
          <p className="text-[11px] text-white/40">
            <Link href="/privacy-policy" className="hover:text-white/70">Privacy</Link>
            {" · "}
            <Link href="/terms-and-conditions" className="hover:text-white/70">Terms</Link>
            {" · "}
            <Link href="/refund-policy" className="hover:text-white/70">Refunds</Link>
          </p>
        </div>
      </footer>

      {/* ---------- Sticky mobile donate bar ---------- */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 backdrop-blur md:hidden">
        <button
          onClick={scrollToDonate}
          className="w-full rounded-full bg-gradient-gold py-3 text-base font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)]"
        >
          Donate ₹{price.toLocaleString("en-IN")} / sq ft
        </button>
      </div>
    </main>
  );
}
