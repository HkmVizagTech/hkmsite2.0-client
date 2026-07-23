"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Loader2, ShieldCheck, User, Phone, Mail, Check, Copy,
  UtensilsCrossed, Heart, BookOpen, Star,
  ChevronDown, ChevronLeft, ChevronRight,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import Ornament from "@/components/Ornament";
import FaqSection from "@/components/sqft-campaign/FaqSection";
import FounderSection from "@/components/sqft-campaign/FounderSection";

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
/* Config                                                              */
/* ------------------------------------------------------------------ */

const EKADASHI_CONFIG = {
  pageTitle: "Shayani Ekadashi Seva",
  metaTitle: "Shayani Ekadashi Seva | Hare Krishna Vaikuntham Temple, Visakhapatnam",
  metaDesc:
    "Donate on Shayani Ekadashi as Lord Vishnu begins His four months of divine rest. Sponsor seva at the Hare Krishna Vaikuntham Temple on one of the year's most sacred days.",
  ogTitle: "Shayani Ekadashi Seva — Hare Krishna Vaikuntham Temple",
  ogDesc:
    "Offer seva on Shayani Ekadashi at the Hare Krishna Vaikuntham Temple. Your donation sustains daily worship, sacred bhog, and festive arrangements during Chaturmas.",
  ogImage: "https://guptvrindavandham.org/media/landingpage/Ashadhi_Ekadashi.webp",
  heroImage: "https://guptvrindavandham.org/media/landingpage/Ashadhi_Ekadashi.webp",
  heroTagline: "A seva initiative of Hare Krishna Movement Visakhapatnam",
  heroHeading1: "Shayani Ekadashi",
  heroHeading2: "Seva",
  heroDesc:
    "Donate on Shayani Ekadashi (Ashadhi Ekadashi) as Lord Vishnu begins His four months of divine rest, and offer seva at the Hare Krishna Vaikuntham Temple on one of the year's most sacred days.",
  formHeading: "Donate for Ekadashi Seva",
  formSubheading:
    "Your donation on this sacred day supports special puja arrangements, sacred bhog, and temple seva performed at the Hare Krishna Vaikuntham Temple.",
  phone: "+91 89777 61187",
  phoneHref: "tel:+918977761187",
  email: "social@hkmvizag.org",
  orderType: "EKADASHI",
};

const TIERS = [
  { label: "Anna Daan", amount: 501, description: "Feed devotees with sanctified prasadam on Ekadashi" },
  { label: "Gau Seva", amount: 1001, description: "Support cow care and protection on this sacred day" },
  { label: "Vastra & Alankara", amount: 2101, description: "Dress and adorn the Deities for the festival" },
  { label: "Maha Seva", amount: 5001, description: "Contribute to all Ekadashi arrangements at the temple" },
];

const SEVA_CARDS = [
  {
    title: "Anna Daan Seva",
    description: "Feed devotees and the underprivileged with sanctified prasadam on Ekadashi — the highest form of charity.",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677363792-1783677363601-462395264797134589073566144398536696847591n.jpg",
    href: "/donate/anna-daan-seva",
    icon: UtensilsCrossed,
  },
  {
    title: "Gau Seva",
    description: "Serve the sacred cows with fodder, care, and shelter — an act Lord Krishna Himself cherishes.",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783676646237-1783676645536-ChatGPTImageJul102026031357PM.png",
    href: "/donate/gau-seva",
    icon: Heart,
  },
  {
    title: "Vastra & Alankara Seva",
    description: "Offer beautiful garments and ornaments to Sri Sri Radha Madan Mohan for the festival.",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677419371-1783677418690-DietyPhotos.jpeg",
    href: "/alankara-vastra-seva",
    icon: Star,
  },
  {
    title: "Temple Construction",
    description: "Contribute to the ongoing construction of the Hare Krishna Vaikuntham Temple — an eternal offering.",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677157979-1783677157883-Screenshot2026-07-10152227.png",
    href: "/sqft-seva-campaign",
    icon: BookOpen,
  },
];

const SIGNIFICANCE_POINTS = [
  {
    title: "Divine Rest Begins",
    text: "Lord Vishnu enters His four-month period of Yog Nidra (divine sleep) on Shayani Ekadashi. Donations made on this day are believed to reach the Lord directly during this sacred time.",
  },
  {
    title: "Purification of Sins",
    text: "Scriptures state that charity performed on Shayani Ekadashi purifies past karmas and brings prosperity to the giver's household throughout Chaturmas.",
  },
  {
    title: "Auspicious Beginnings",
    text: "Any auspicious ceremony or seva performed on this day carries manifold merit. The spiritual vibrations of the temple are especially elevated during this period.",
  },
  {
    title: "Special Grace Throughout Chaturmas",
    text: "Devotees who serve with sincerity during Shayani Ekadashi are believed to receive Lord Vishnu's special grace throughout the four months of Chaturmas.",
  },
];

const WHY_DONATE_SECTIONS = [
  {
    title: "A Sacred Opportunity to Serve",
    text: "As Lord Vishnu enters His divine rest, devotees are given a rare window to earn deep spiritual merit through seva. Your contribution on this day helps sustain the daily worship, festive arrangements, and upkeep of the Hare Krishna Vaikuntham Temple, allowing you to take part in the Lord's service even from a distance.",
  },
  {
    title: "Seva That Reaches the Lord Directly",
    text: "Every rupee offered on Shayani Ekadashi goes toward special puja arrangements, sacred bhog preparation, decoration of the Deities, and the temple's daily rituals. Donating on this day is considered a direct offering placed at the Lord's lotus feet, carrying significance beyond an ordinary act of charity.",
  },
  {
    title: "Blessings for You and Your Family",
    text: "Scriptures state that charity performed on Ekadashi, especially Shayani Ekadashi, purifies past karmas and brings prosperity to the giver's household. As the Lord begins His four months of Yog Nidra, devotees who serve with sincerity during this period are believed to receive His special grace throughout Chaturmas.",
  },
  {
    title: "Be Part of the Temple's Ongoing Worship",
    text: "The Hare Krishna Vaikuntham Temple continues its daily seva through the support of devotees like you. Your Shayani Ekadashi donation ensures that the worship, bhog, and celebrations at the temple continue uninterrupted, connecting you to the temple's spiritual mission even if you cannot visit in person.",
  },
];

const FAQS = [
  {
    q: "What is Shayani Ekadashi?",
    a: "Shayani Ekadashi (also known as Ashadhi Ekadashi) is one of the most sacred Ekadashi days in the Hindu calendar. It marks the day Lord Vishnu enters His four-month period of divine sleep (Yog Nidra) on the cosmic ocean. Donations and seva performed on this day are considered extremely auspicious.",
  },
  {
    q: "Why should I donate on Shayani Ekadashi?",
    a: "Donating on Shayani Ekadashi is believed to purify past karmas and bring prosperity. As the Lord begins His divine rest, your seva sustains the temple's worship and carries special spiritual merit throughout the four months of Chaturmas.",
  },
  {
    q: "How will my donation be used?",
    a: "Your donation supports special puja arrangements, sacred bhog preparation, decoration of the Deities, and the temple's daily rituals during the Ekadashi celebrations. For specific sevas like Anna Daan or Gau Seva, your contribution directly funds those activities.",
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
    q: "Is it safe to donate online here?",
    a: "Yes. All payments are processed through Razorpay, a PCI-DSS-compliant payment gateway. We never see or store your card details. You may also donate via direct bank transfer using the details on this page.",
  },
];

const SHLOKA = {
  sanskrit: "एकादश्या यतः पुण्यं ततः कोटिगुणं भवेत् । अश्वमेधशतं चैव विष्णोर्नामस्मरणं तथा ॥",
  translation: "The merit gained from observing Ekadashi is multiplied by a crore. Even greater is the merit of chanting the holy names of Lord Vishnu.",
  reference: "Padma Purana",
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const inputWrapClass =
  "relative flex items-center rounded-lg border border-border bg-card focus-within:border-gold transition-colors";
const inputClass =
  "h-10 w-full bg-transparent pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground";
const labelClass = "mb-1 block text-[11px] font-medium text-muted-foreground";

export default function ShayaniEkadashiClient() {
  const router = useRouter();
  const [tierIndex, setTierIndex] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", mobile: "", panNumber: "" });
  const [want80G, setWant80G] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [significanceExpanded, setSignificanceExpanded] = useState(false);
  const [whyDonateExpanded, setWhyDonateExpanded] = useState(false);

  const finalAmount = useCustom ? Number(customAmount) || 0 : TIERS[tierIndex]?.amount || 0;
  const galleryRef = useRef<HTMLDivElement>(null);

  const BANK_DETAILS = {
    beneficiaryName: "HARE KRISHNA MOVEMENT INDIA",
    bankName: "IDFC FIRST BANK LTD",
    accountNumber: "10091415313",
    ifsc: "IDFB0080412",
  };

  const scrollToDonate = () => {
    document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCopy = (field: string, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (finalAmount < 1) {
      setStatus({ type: "error", message: "Please select a valid amount." });
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
          sourcePage: "/shayani-ekadashi",
          type: EKADASHI_CONFIG.orderType,
          sevaName: TIERS[tierIndex]?.label || "Ekadashi Seva",
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
        description: `${TIERS[tierIndex]?.label || "Ekadashi Seva"} — Hare Krishna Vaikuntham Temple`,
        order_id: order.orderId,
        prefill: { name: form.name, email: form.email, contact: form.mobile },
        notes: { sourcePage: "/shayani-ekadashi", sevaName: TIERS[tierIndex]?.label || "Ekadashi Seva", sevaType: EKADASHI_CONFIG.orderType },
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
            const sevaLabel = TIERS[tierIndex]?.label || "Ekadashi Seva";
            router.push(`/shayani-ekadashi/thank-you?seva=${encodeURIComponent(sevaLabel)}&amount=${finalAmount}`);
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

  return (
    <PageLayout>
      <main className="bg-background">
        {/* ── Hero Banner ── */}
        <section className="bg-[#faf3df] pt-[72px] md:pt-[92px]">
          <button
            type="button"
            onClick={scrollToDonate}
            aria-label="Donate — go to the donation form"
            className="block w-full cursor-pointer"
          >
            <Image
              src={EKADASHI_CONFIG.heroImage}
              alt="Shayani Ekadashi Seva — Hare Krishna Vaikuntham Temple"
              width={1672}
              height={941}
              priority
              sizes="100vw"
              className="h-auto w-full"
            />
          </button>
        </section>

        {/* ── Spiritual Significance ── */}
        <section className="bg-card py-10 md:py-16">
          <div className="container mx-auto max-w-4xl px-4">
            <Ornament className="mb-6" />
            <div className="text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                The divine occasion
              </p>
              <h2 className="mb-8 font-heading text-2xl font-bold text-primary md:text-3xl">
                Spiritual Significance of Devshayani Ekadashi
              </h2>
            </div>

            {/* Shloka */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-8 rounded-2xl border border-gold/20 bg-gold/5 p-6 text-center md:p-8"
            >
              <p className="mb-4 font-heading text-lg leading-relaxed text-primary md:text-xl">
                {SHLOKA.sanskrit}
              </p>
              <p className="mb-2 text-sm italic leading-relaxed text-muted-foreground md:text-base">
                &ldquo;{SHLOKA.translation}&rdquo;
              </p>
              <p className="text-xs font-semibold text-gold">— {SHLOKA.reference}</p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-muted-foreground md:text-base"
            >
              Contributing to Devshayani Ekadashi is one of the most meaningful ways to serve the Lord
              as He begins His divine rest. Your donation supports special puja arrangements, sacred bhog,
              and temple seva performed at the Hare Krishna Vaikuntham Temple on this holy day.
            </motion.p>
          </div>
        </section>

        {/* ── Donation Form ── */}
        <section id="donate" className="scroll-mt-24 bg-card py-10 md:py-16">
          <div className="container mx-auto max-w-4xl px-4">
            <Ornament className="mb-4" />
            <div className="mb-6 text-center">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                Ekadashi Seva
              </p>
              <h2 className="mb-2 font-heading text-2xl font-bold text-primary md:text-3xl">
                {EKADASHI_CONFIG.formHeading}
              </h2>
              <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground">
                {EKADASHI_CONFIG.formSubheading}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden rounded-[28px] border border-border bg-white shadow-elevated"
            >
              {/* Amount summary strip */}
              <div className="flex items-center justify-between gap-3 bg-gradient-gold px-6 py-4 sm:px-8">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(220,90%,12%)]/70">
                    You&apos;re offering
                  </p>
                  <p className="text-lg font-extrabold text-[hsl(220,90%,12%)] sm:text-xl">
                    {useCustom ? "Custom offering" : TIERS[tierIndex]?.label || "Select a tier"}
                  </p>
                </div>
                <p className="text-2xl font-extrabold text-[hsl(220,90%,12%)] sm:text-3xl">
                  ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "0"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="grid gap-6 p-5 sm:p-7 lg:grid-cols-2 lg:gap-8">
                {/* Left: amount selection */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Choose Your Seva
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {TIERS.map((tier, i) => (
                      <button
                        key={tier.amount}
                        type="button"
                        onClick={() => { setUseCustom(false); setTierIndex(i); }}
                        className={`rounded-lg border px-3 py-3 text-left transition-colors ${
                          !useCustom && tierIndex === i
                            ? "border-gold bg-gold/10"
                            : "border-border bg-card hover:border-gold/60"
                        }`}
                      >
                        <span className="mb-1 block text-sm font-bold text-primary">{tier.label}</span>
                        <span className="mb-1 block text-[11px] leading-snug text-muted-foreground">
                          {tier.description}
                        </span>
                        <span className="block text-base font-extrabold text-gold">
                          ₹{tier.amount.toLocaleString("en-IN")}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Custom amount */}
                  <div
                    className={`flex items-center gap-3 rounded-lg border px-3 transition-colors ${
                      useCustom ? "border-gold bg-gold/5" : "border-border bg-card"
                    }`}
                  >
                    <label htmlFor="custom-amount" className="shrink-0 text-xs font-medium text-muted-foreground">
                      Other amount
                    </label>
                    <span className="text-sm text-foreground">₹</span>
                    <input
                      id="custom-amount"
                      type="number"
                      min={101}
                      placeholder="Min ₹101"
                      value={customAmount}
                      onFocus={() => setUseCustom(true)}
                      onChange={(e) => {
                        setUseCustom(true);
                        setCustomAmount(e.target.value);
                      }}
                      className="h-10 w-full min-w-0 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground"
                    />
                  </div>

                  {/* Bank transfer */}
                  <details className="group rounded-lg border border-border bg-background/60 px-3 py-2">
                    <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold text-foreground">
                      Prefer a direct bank transfer?
                      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mt-2.5 space-y-1.5">
                      {(
                        [
                          ["Beneficiary", BANK_DETAILS.beneficiaryName],
                          ["Bank", BANK_DETAILS.bankName],
                          ["Account No.", BANK_DETAILS.accountNumber],
                          ["IFSC", BANK_DETAILS.ifsc],
                        ] as const
                      ).map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between gap-2 text-xs">
                          <span className="text-muted-foreground">{label}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(label, value)}
                            className="flex items-center gap-1.5 font-semibold text-foreground hover:text-gold"
                          >
                            {value}
                            {copiedField === label ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      ))}
                      <p className="pt-1 text-[11px] leading-relaxed text-muted-foreground">
                        Email your transaction reference and PAN (for 80G) to{" "}
                        <a href={`mailto:${EKADASHI_CONFIG.email}`} className="font-semibold text-gold">
                          {EKADASHI_CONFIG.email}
                        </a>
                        .
                      </p>
                    </div>
                  </details>
                </div>

                {/* Right: details, add-ons, submit */}
                <div className="flex flex-col space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="donor-name" className={labelClass}>Full name</label>
                      <div className={inputWrapClass}>
                        <User className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
                        <input
                          id="donor-name"
                          type="text"
                          required
                          placeholder="Your name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="donor-mobile" className={labelClass}>Mobile number</label>
                      <div className={inputWrapClass}>
                        <Phone className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
                        <input
                          id="donor-mobile"
                          type="tel"
                          required
                          placeholder="10-digit mobile"
                          value={form.mobile}
                          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="donor-email" className={labelClass}>Email address</label>
                    <div className={inputWrapClass}>
                      <Mail className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
                      <input
                        id="donor-email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* 80G */}
                  {finalAmount > 999 && (
                    <div className="rounded-lg border border-border bg-background/60 px-3 py-2">
                      <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-foreground">
                        <input
                          type="checkbox"
                          checked={want80G}
                          onChange={(e) => setWant80G(e.target.checked)}
                          className="h-3.5 w-3.5 shrink-0 accent-[hsl(42,92%,46%)]"
                        />
                        I need an 80G tax exemption receipt
                      </label>
                      {want80G && (
                        <input
                          id="donor-pan"
                          type="text"
                          placeholder="PAN number *"
                          value={form.panNumber}
                          onChange={(e) => setForm({ ...form, panNumber: e.target.value.toUpperCase() })}
                          className="mt-2 h-9 w-full rounded-lg border border-border bg-card px-3 text-xs uppercase outline-none focus:border-gold"
                        />
                      )}
                    </div>
                  )}

                  {status && (
                    <p
                      className={`rounded-lg px-3 py-2 text-xs font-medium ${
                        status.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"
                      }`}
                    >
                      {status.message}
                    </p>
                  )}

                  <div className="flex-1" />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-gold text-sm font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                      </>
                    ) : (
                      <>Donate ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "—"}</>
                    )}
                  </button>
                  <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                    Secure payment via Razorpay · UPI, cards &amp; netbanking accepted
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        {/* ── Ekadashi Daan ── */}
        <section className="bg-background py-10 md:py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <Ornament className="mb-6" />
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                Sacred offerings
              </p>
              <h2 className="font-heading text-2xl font-bold text-primary md:text-3xl">
                Ashadhi Ekadashi Daan
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {SEVA_CARDS.map((seva, i) => (
                <motion.div
                  key={seva.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-gold/40"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={seva.image}
                      alt={seva.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <seva.icon className="h-6 w-6 text-gold" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 font-heading text-base font-bold text-primary">
                      {seva.title}
                    </h3>
                    <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                      {seva.description}
                    </p>
                    <Link
                      href={seva.href}
                      className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-xs font-semibold text-gold transition-colors hover:bg-gold/10"
                    >
                      Donate
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Significance Points ── */}
        <section className="bg-card py-10 md:py-16">
          <div className="container mx-auto max-w-4xl px-4">
            <Ornament className="mb-6" />
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                Why this day matters
              </p>
              <h2 className="font-heading text-2xl font-bold text-primary md:text-3xl">
                Significance of Devshayani Ekadashi
              </h2>
            </div>

            <div className="space-y-4">
              {SIGNIFICANCE_POINTS.map((point, i) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="rounded-2xl border border-border bg-background p-5 md:p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                      <span className="text-sm font-bold">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="mb-2 font-heading text-base font-bold text-primary md:text-lg">
                        {point.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {point.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Donate on Ekadashi ── */}
        <section className="bg-background py-10 md:py-16">
          <div className="container mx-auto max-w-4xl px-4">
            <Ornament className="mb-6" />
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                The divine merit
              </p>
              <h2 className="font-heading text-2xl font-bold text-primary md:text-3xl">
                Why Donate on Shayani Ekadashi?
              </h2>
            </div>

            <div className="space-y-8">
              {WHY_DONATE_SECTIONS.map((section, i) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="rounded-2xl border border-border bg-card p-6 md:p-8"
                >
                  <h3 className="mb-4 font-heading text-lg font-bold text-primary md:text-xl">
                    {section.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {section.text}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/sqft-seva-campaign"
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3 text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
              >
                Donate for Construction of Radha Krishna Temple
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQs ── */}
        <FaqSection faqs={FAQS} />

        {/* ── Founder's words ── */}
        <FounderSection />

        {/* ── Sticky mobile donate bar ── */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 backdrop-blur md:hidden">
          <button
            onClick={scrollToDonate}
            className="w-full rounded-full bg-gradient-gold py-3.5 text-base font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)]"
          >
            Donate ₹{TIERS[tierIndex]?.amount.toLocaleString("en-IN") || "501"} / seva
          </button>
        </div>
      </main>
    </PageLayout>
  );
}
