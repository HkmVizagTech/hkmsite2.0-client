"use client";

/**
 * Special Occasion Seva — celebrate a birthday, anniversary, or any special
 * day by sponsoring a seva instead of (or alongside) a conventional
 * celebration. Hero images are fully-designed banners supplied directly
 * (text/CTA baked in) — rendered at their native aspect ratio, no text
 * overlay needed. Reuses the site's real seva catalog (lib/sevaConfig) so
 * every seva picked here is backed by the same live Razorpay + DCC +
 * WhatsApp receipt pipeline as the rest of the site.
 */

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ShieldCheck, Loader2, ChevronDown, Gift, Cake, Heart,
  PartyPopper, Home, Briefcase, Sparkles, UtensilsCrossed, Building2,
  FileCheck2, Clock3, User, Phone, Mail, PenLine,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/site/SectionHeading";
import { sevas, getSevaHref, type Seva } from "@/lib/sevaConfig";
import { useAttribution } from "@/lib/useAttribution";
import DonorExtrasFields from "@/components/DonorExtrasFields";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import { useDonorPrefill } from "@/lib/donorPrefill";
import { useRazorpayPreload } from "@/lib/useRazorpayPreload";
import { useScrollToDonate } from "@/lib/useScrollToDonate";
import { newEventId, getMetaBrowserData, trackInitiateCheckout, trackPurchase } from "@/lib/metaPixel";

type RazorpayConstructor = new (options: Record<string, unknown>) => { open: () => void };

const apiBase = () =>
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/+$/, "");

const OCCASIONS = [
  { label: "Birthday", icon: Cake },
  { label: "Anniversary", icon: Heart },
  { label: "Wedding", icon: Sparkles },
  { label: "New Job / Promotion", icon: Briefcase },
  { label: "Housewarming", icon: Home },
  { label: "Other Celebration", icon: PartyPopper },
];

const HERO_DESKTOP = "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1784005845291-1784005844212-ChatGPTImageJul142026104033AM.png";
const HERO_MOBILE = "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1784005846012-1784005844988-ChatGPTImageJul142026104020AM.png";

const FAQS = [
  {
    q: "How does a Special Occasion seva work?",
    a: "Choose the seva you'd like to sponsor in honour of your birthday, anniversary, or any celebration, make your offering, and receive prasadam and a certificate acknowledging your seva — done fully online in a few minutes.",
  },
  {
    q: "Which sevas can I sponsor for my occasion?",
    a: "Any of our regular sevas — Anna Daan, Gau Seva, Gita Daan, Vastra & Alankara, Brick Seva, or Square Foot Seva for the temple's construction. Pick whichever resonates with your celebration.",
  },
  {
    q: "Is this eligible for 80G tax exemption?",
    a: "Yes. Every Special Occasion seva qualifies for tax exemption under Section 80G of the Income Tax Act — select the option during checkout and provide your PAN.",
  },
  {
    q: "Can I dedicate the seva to someone else, like a family member's birthday?",
    a: "Yes — simply note their name and the occasion in the message field, and we'll keep it on record as a seva offered in their honour.",
  },
  {
    q: "Will I get a receipt and confirmation?",
    a: "Yes. You'll receive an instant confirmation, and a receipt with your seva details once processed — sent to the email and phone number you provide.",
  },
];

// Fades content in on mount — deliberately NOT scroll-gated (no
// whileInView/useInView). A near-identical pattern on this site's
// homepage left blog cards permanently invisible because their
// IntersectionObserver trigger fired before the cards existed in the
// DOM; mount-based animation can't have that failure mode; every
// section is guaranteed to become visible shortly after the page loads.
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? undefined : { opacity: 0, y: 16 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(delay, 0.4) }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// A handful of drifting sparkles over the hero — the one place this page
// spends its "one bold move": a quiet celebratory shimmer, not confetti
// clutter, that reads as festive without fighting the photograph beneath it.
function HeroSparkles() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  const sparkles = [
    { left: "8%", top: "18%", size: 5, delay: 0 },
    { left: "14%", top: "62%", size: 3, delay: 0.8 },
    { left: "22%", top: "38%", size: 4, delay: 1.6 },
    { left: "6%", top: "78%", size: 3, delay: 2.4 },
    { left: "27%", top: "12%", size: 3, delay: 1.1 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {sparkles.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-gold"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 0.5], y: [0, -14, 0] }}
          transition={{ duration: 3.5, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

const BENEFITS = [
  { icon: UtensilsCrossed, title: "Anna Daan", text: "Feed devotees and the underprivileged with sanctified prasadam" },
  { icon: Heart, title: "Gau Seva", text: "Care for the temple's cows through fodder, shelter, and medicine" },
  { icon: Building2, title: "Temple Rising", text: "Become part of the Hare Krishna Vaikuntham Temple, brick by brick" },
];

const TRUST_BADGES = [
  { icon: FileCheck2, label: "80G Tax Exemption" },
  { icon: UtensilsCrossed, label: "Mahaprasadam Sent" },
  { icon: Clock3, label: "Instant Confirmation" },
  { icon: ShieldCheck, label: "Secure Razorpay Checkout" },
];

export default function SpecialOccasionClient() {
  const reduce = useReducedMotion();
  const attribution = useAttribution("/special-occasion");
  const razorpayReady = useRazorpayPreload();
  useScrollToDonate("occasion-form");

  const [occasion, setOccasion] = useState<string>("Birthday");
  const [selectedSeva, setSelectedSeva] = useState<Seva>(sevas[2]); // Anna Daan Seva default
  const [amount, setAmount] = useState<number>(sevas[2].tiers[1].amount);
  const [useCustom, setUseCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });
  const [want80G, setWant80G] = useState(false);
  const [panNumber, setPanNumber] = useState("");

  // Donor pre-fill: logged-in profile auto-fills name/email/mobile; a
  // returning donor's phone lookup fills the same fields after they type
  // their 10-digit number. PAN is filled only when 80G is selected.
  const { lookupHint, prefill } = useDonorPrefill({
    form,
    setForm,
  });
  const [dedication, setDedication] = useState("");
  const [sevakName, setSevakName] = useState("");
  const [dob, setDob] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const finalAmount = useCustom ? Number(customAmount) || 0 : amount;

  const scrollToForm = () => {
    document.getElementById("occasion-form")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  const pickSeva = (seva: Seva) => {
    setSelectedSeva(seva);
    setUseCustom(false);
    setAmount(seva.tiers[1]?.amount || seva.tiers[0].amount);
    scrollToForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (finalAmount < 100) {
      setStatus({ type: "error", message: "Minimum contribution is ₹100." });
      return;
    }
    if (!form.name.trim()) {
      setStatus({ type: "error", message: "Please fill in your name and phone number." });
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) {
      setStatus({ type: "error", message: "Please enter a valid 10-digit mobile number." });
      return;
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus({ type: "error", message: "Please enter a valid email address, or leave it blank." });
      return;
    }
    if (want80G && !panNumber.trim()) {
      setStatus({ type: "error", message: "PAN number is required for an 80G receipt." });
      return;
    }

    setSubmitting(true);
    try {
      const metaEventId = newEventId();
      const metaBrowser = getMetaBrowserData();
      const orderRes = await fetch(`${apiBase()}/payments/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: selectedSeva.account,
          sourcePage: "/special-occasion",
          sevaName: selectedSeva.title,
          message: `Special Occasion: ${occasion}${dedication ? ` — ${dedication}` : ""}`,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          mobile: form.mobile.trim(),
          amount: finalAmount,
          certificate: want80G,
          panNumber: want80G ? panNumber.trim() : undefined,
          sevakName: sevakName.trim() || undefined,
          dob: dob || undefined,
          utm: attribution.payload().utm,
          metaEventId,
          metaFbp: metaBrowser.fbp,
          metaFbc: metaBrowser.fbc,
        }),
      });

      if (!orderRes.ok) throw new Error("Unable to create payment order. Please try again.");
      const order = await orderRes.json();

      await razorpayReady();
      const win = window as unknown as { Razorpay?: RazorpayConstructor };
      if (!win.Razorpay) throw new Error("Razorpay checkout is unavailable.");

      new win.Razorpay({
        key: order.key,
        amount: Math.round(finalAmount * 100),
        currency: "INR",
        name: "Hare Krishna Movement Vizag",
        description: `Special Occasion Seva — ${selectedSeva.title}`,
        order_id: order.orderId,
        prefill: { name: form.name, email: form.email, contact: form.mobile },
        notes: { sourcePage: "/special-occasion", sevaName: selectedSeva.title, occasion },
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
            trackPurchase({ value: finalAmount, eventId: metaEventId, content_name: selectedSeva.title });
            window.location.assign(`/payment/thank-you?type=seva&seva=${encodeURIComponent(selectedSeva.title)}&amount=${finalAmount}&source=${encodeURIComponent(`the ${occasion.toLowerCase()} celebration seva programme`)}`);
          } catch (err) {
            setStatus({ type: "error", message: err instanceof Error ? err.message : "Payment verification failed." });
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
      <WhatsAppFloatButton />
      <main className="bg-white pt-[var(--header-h)] dark:bg-background">
        {/* ---------- Hero — fully-designed banners in an inset rounded card ---------- */}
        <section className="bg-gradient-to-b from-vk-50 to-white pb-2 pt-4 md:pt-6">
          <div className="vk-container">
            <button
              onClick={scrollToForm}
              className="relative block w-full overflow-hidden rounded-3xl bg-vk-900 text-left shadow-[0_24px_60px_-28px_rgba(10,18,51,0.6)]"
              aria-label="Sponsor a seva for your special occasion"
            >
              <div className="relative hidden w-full md:block" style={{ aspectRatio: "2006 / 784" }}>
                <Image src={HERO_DESKTOP} alt="Special Occasion — sponsor a seva for your celebration" fill priority sizes="(min-width: 1280px) 1248px, 100vw" className="object-cover" />
                <HeroSparkles />
              </div>
              <div className="relative w-full md:hidden" style={{ aspectRatio: "941 / 1672" }}>
                <Image src={HERO_MOBILE} alt="Special Occasion — sponsor a seva for your celebration" fill priority sizes="100vw" className="object-cover" />
                <HeroSparkles />
              </div>
            </button>

            {/* ---------- Trust strip ---------- */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:mt-5 md:gap-3">
              {TRUST_BADGES.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-2 rounded-full border border-vk-100 bg-white px-3 py-1.5 text-xs font-semibold text-ink/80 shadow-sm md:text-[13px]"
                >
                  <b.icon className="h-3.5 w-3.5 text-vk-500" />
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Shloka band — the offering verse ---------- */}
        <section className="vk-section !pb-4 md:!pb-6">
          <div className="vk-container">
            <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-navy px-5 py-10 text-center md:px-10 md:py-12">
              <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5" />
              <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-vk-500/15 blur-2xl" />
              <div className="relative mx-auto max-w-3xl">
                <p className="mb-4 font-serif-display text-lg italic leading-relaxed text-white md:text-2xl">
                  patraṁ puṣpaṁ phalaṁ toyaṁ<br />yo me bhaktyā prayacchati
                </p>
                <p className="mx-auto mb-4 max-w-xl text-[13px] leading-relaxed text-white/75 md:text-sm">
                  &ldquo;If one offers Me with love and devotion a leaf, a flower, fruit or water, I will accept it.&rdquo;
                </p>
                <span className="vk-pill-light">Bhagavad Gita 9.26</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- Occasion picker ---------- */}
        <section className="vk-section">
          <div className="vk-container">
            <Reveal>
              <SectionHeading align="center" eyebrow="Step One" title="What Are You Celebrating?" />
            </Reveal>
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {OCCASIONS.map((o, i) => {
                const active = occasion === o.label;
                return (
                  <Reveal key={o.label} delay={i * 0.05}>
                    <button
                      onClick={() => setOccasion(o.label)}
                      aria-pressed={active}
                      className={`flex h-full min-h-[104px] w-full flex-col items-center justify-center gap-2.5 rounded-2xl border px-3 py-4 text-center transition-all ${
                        active
                          ? "border-vk-500 bg-vk-50 ring-2 ring-vk-500/20"
                          : "border-vk-200 bg-white hover:-translate-y-0.5 hover:border-vk-400"
                      }`}
                    >
                      <span className={`vk-icon-chip transition-colors ${active ? "!bg-vk-700 !text-white" : ""}`}>
                        <o.icon className="h-5 w-5" />
                      </span>
                      <span className={`text-[13px] font-semibold leading-tight ${active ? "text-vk-700" : "text-ink"}`}>{o.label}</span>
                    </button>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- Why celebrate with seva ---------- */}
        <section className="vk-section vk-band">
          <div className="vk-container">
            <Reveal>
              <SectionHeading
                as="h1"
                align="center"
                eyebrow="A Different Kind of Celebration"
                title="Mark Your Special Day with an Offering to the Lord"
                subtitle="A birthday, anniversary, or milestone is a moment of gratitude. Instead of — or alongside — the usual celebration, sponsor a seva at the Hare Krishna Vaikuntham Temple in that spirit of thanksgiving."
              />
            </Reveal>

            <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3 md:gap-5">
              {BENEFITS.map((b, i) => (
                <Reveal key={b.title} delay={i * 0.1}>
                  <div className="vk-card vk-card-hover h-full p-5 text-center md:p-6">
                    <span className="vk-icon-chip mx-auto mb-4">
                      <b.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mb-1.5 text-base font-bold text-ink">{b.title}</h3>
                    <p className="text-[13px] leading-relaxed text-muted-foreground">{b.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <p className="mx-auto mt-8 max-w-2xl text-center text-[15px] leading-relaxed text-muted-foreground md:text-base">
                Every Special Occasion seva comes with mahaprasadam, an 80G tax-exemption receipt, and the
                quiet satisfaction that your celebration became someone else&apos;s blessing too.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---------- Seva cards ---------- */}
        <section className="vk-section">
          <div className="vk-container">
            <Reveal>
              <SectionHeading align="center" eyebrow="Step Two" title="Choose a Seva for Your Occasion" />
            </Reveal>
            <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
              {sevas.map((seva, i) => {
                const active = selectedSeva.slug === seva.slug;
                return (
                  <Reveal key={seva.slug} delay={Math.min(i * 0.07, 0.35)}>
                    <div
                      className={`vk-card vk-card-hover group flex h-full flex-col overflow-hidden ${
                        active ? "!border-vk-500 ring-2 ring-vk-500/20" : ""
                      }`}
                    >
                      <div className="vk-tile relative aspect-[16/10] !rounded-none !shadow-none">
                        <Image src={seva.image} alt={seva.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                        {active && (
                          <span className="absolute right-3 top-3 z-[2] flex h-8 w-8 items-center justify-center rounded-full bg-vk-700 text-sm font-bold text-white shadow ring-2 ring-white">✓</span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="mb-1 text-lg font-bold text-ink">{seva.title}</h3>
                        <p className="mb-4 flex-1 text-[13px] leading-relaxed text-muted-foreground">{seva.tagline}</p>
                        <button
                          onClick={() => pickSeva(seva)}
                          className={`${active ? "vk-btn-primary" : "vk-btn-outline"} h-11 w-full`}
                        >
                          {active ? "Selected — Continue ↓" : `Sponsor for ${occasion}`}
                        </button>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- Donation form ---------- */}
        <section id="occasion-form" className="vk-section vk-band scroll-mt-[var(--header-h)]">
          <div className="vk-container">
            <Reveal>
              <SectionHeading
                align="center"
                eyebrow="Step Three"
                title="Complete Your Offering"
                subtitle={<>{selectedSeva.title} · for your {occasion.toLowerCase()}</>}
              />
            </Reveal>

            <Reveal delay={0.1} className="mx-auto max-w-2xl">
              <div className="vk-card overflow-hidden !rounded-3xl">
                <div className="flex items-center justify-between gap-3 bg-gradient-to-br from-vk-700 via-vk-600 to-vk-500 px-5 py-4 text-white sm:px-7">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">Special Occasion Seva</p>
                    <p className="text-lg font-bold text-white">{selectedSeva.icon} {selectedSeva.title}</p>
                    <p className="mt-0.5 text-xs text-white/75">{selectedSeva.tagline}</p>
                  </div>
                  <p className="shrink-0 font-heading text-2xl font-extrabold text-[hsl(var(--gold))] sm:text-3xl">
                    ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "—"}
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5 p-4 sm:p-6">
                  <div>
                    <p className="mb-2.5 text-[13px] font-bold uppercase tracking-[0.08em] text-vk-700">Choose a seva</p>
                    <div className="flex flex-wrap gap-2">
                      {sevas.map((seva) => (
                        <button
                          type="button"
                          key={seva.slug}
                          onClick={() => pickSeva(seva)}
                          className={`min-h-[44px] rounded-xl border px-3 py-2 text-[13px] font-semibold transition-all ${
                            selectedSeva.slug === seva.slug
                              ? "border-vk-500 bg-vk-50 text-vk-700 ring-2 ring-vk-500/20"
                              : "border-vk-200 bg-white text-ink/80 hover:border-vk-400"
                          }`}
                        >
                          {seva.icon} {seva.shortTitle}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2.5 text-[13px] font-bold uppercase tracking-[0.08em] text-vk-700">Choose an amount</p>
                    <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {selectedSeva.tiers.map((tier) => (
                        <button
                          type="button"
                          key={tier.label}
                          onClick={() => { setUseCustom(false); setAmount(tier.amount); }}
                          className={`min-h-[52px] rounded-xl border px-3 py-2.5 text-left transition-all ${
                            !useCustom && amount === tier.amount
                              ? "border-vk-500 bg-vk-50 ring-2 ring-vk-500/20"
                              : "border-vk-200 bg-white hover:border-vk-400"
                          }`}
                        >
                          <span className="block text-base font-extrabold text-vk-700">₹{tier.amount.toLocaleString("en-IN")}</span>
                          <span className="mt-0.5 block text-[11px] text-muted-foreground">{tier.label.split("/")[1]?.trim() || tier.label}</span>
                        </button>
                      ))}
                    </div>

                    <div
                      className={`flex h-11 items-center gap-2 rounded-xl border px-3.5 transition-colors ${
                        useCustom
                          ? "border-vk-500 bg-vk-50 ring-2 ring-vk-500/20"
                          : "border-dashed border-vk-200 bg-white focus-within:border-vk-500"
                      }`}
                    >
                      <label htmlFor="custom-amt" className="whitespace-nowrap text-sm font-semibold text-vk-700">Other amount ₹:</label>
                      <input
                        id="custom-amt"
                        type="number"
                        min={100}
                        placeholder="100+"
                        value={customAmount}
                        onFocus={() => setUseCustom(true)}
                        onChange={(e) => { setUseCustom(true); setCustomAmount(e.target.value); }}
                        className="h-full w-full min-w-0 bg-transparent text-[15px] font-semibold outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="mb-2.5 text-[13px] font-bold uppercase tracking-[0.08em] text-vk-700">Your Details</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label htmlFor="so-name" className="mb-1.5 block text-[13px] font-semibold text-ink/80">Full name <span className="text-red-600">*</span></label>
                        <div className="relative">
                          <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-400" />
                          <input id="so-name" type="text" required placeholder="Full name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="vk-input pl-10" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="so-mobile" className="mb-1.5 block text-[13px] font-semibold text-ink/80">Mobile number <span className="text-red-600">*</span></label>
                        <div className="relative">
                          <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-400" />
                          <input id="so-mobile" type="tel" required maxLength={10} inputMode="numeric" placeholder="Mobile number *" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/[^\d]/g, "").slice(0, 10) })} className="vk-input pl-10" />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="so-email" className="mb-1.5 block text-[13px] font-semibold text-ink/80">Email address <span className="font-normal text-muted-foreground">(optional)</span></label>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-400" />
                          <input id="so-email" type="email" placeholder="Email address (optional)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="vk-input pl-10" />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="so-dedication" className="mb-1.5 block text-[13px] font-semibold text-ink/80">Dedicate to / occasion note <span className="font-normal text-muted-foreground">(optional)</span></label>
                        <div className="relative">
                          <PenLine className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-400" />
                          <input id="so-dedication" type="text" placeholder="Dedicate to / occasion note (optional)" value={dedication} onChange={(e) => setDedication(e.target.value)} className="vk-input pl-10" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {lookupHint}

                  <div className="rounded-xl border border-vk-100 bg-vk-50/60 px-3.5 py-3">
                    <DonorExtrasFields
                      sevakName={sevakName}
                      dob={dob}
                      onSevakNameChange={setSevakName}
                      onDobChange={setDob}
                      collapsible
                    />
                  </div>

                  <div className="space-y-3 rounded-xl border border-vk-100 bg-vk-50/60 px-3.5 py-3">
                    <label className="flex cursor-pointer items-start gap-2.5 text-[13px] font-medium text-ink">
                      <input type="checkbox" checked={want80G} onChange={(e) => {
                        const next = e.target.checked;
                        setWant80G(next);
                        if (next && !panNumber.trim() && prefill?.panNumber) setPanNumber(prefill.panNumber.trim());
                      }} className="mt-0.5 h-4 w-4 shrink-0 accent-vk-700" />
                      I need an 80G tax exemption receipt
                    </label>
                    {want80G && (
                      <div>
                        <label htmlFor="so-pan" className="mb-1.5 block text-[13px] font-semibold text-ink/80">PAN number <span className="text-red-600">*</span></label>
                        <input id="so-pan" type="text" placeholder="PAN number *" value={panNumber} onChange={(e) => setPanNumber(e.target.value.toUpperCase())} className="vk-input uppercase" />
                      </div>
                    )}
                  </div>

                  {status && (
                    <p className={`rounded-xl px-3.5 py-2.5 text-[13px] font-medium ${status.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}>
                      {status.message}
                    </p>
                  )}

                  <div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="vk-btn-gold h-auto min-h-12 w-full whitespace-normal py-3 text-center text-[15px] font-bold leading-snug"
                    >
                      {submitting ? (<><Loader2 className="h-5 w-5 animate-spin" /> Processing…</>) : (<><Heart className="h-4 w-4 shrink-0 fill-current" /> Offer ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "—"} for your {occasion}</>)}
                    </button>
                    <p className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-vk-500" /> Secure payment via Razorpay</span>
                      <span aria-hidden>·</span>
                      <span className="inline-flex items-center gap-1"><FileCheck2 className="h-3.5 w-3.5 text-vk-500" /> 80G receipt available</span>
                    </p>
                  </div>
                </form>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="vk-section">
          <div className="vk-container">
            <Reveal>
              <SectionHeading align="center" eyebrow="FAQ" title="Frequently Asked Questions" />
            </Reveal>
            <div className="mx-auto max-w-3xl space-y-3">
              {FAQS.map((f, i) => {
                const isOpen = openFaq === i;
                return (
                  <Reveal key={f.q} delay={Math.min(i * 0.05, 0.3)}>
                    <div
                      className={`overflow-hidden rounded-2xl border bg-white transition-shadow ${
                        isOpen ? "border-vk-200 shadow-card" : "border-vk-100"
                      }`}
                    >
                      <h3>
                        <button
                          type="button"
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          aria-expanded={isOpen}
                          aria-controls={`so-faq-${i}`}
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-ink"
                        >
                          <span>{f.q}</span>
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all ${
                              isOpen ? "rotate-180 bg-vk-700 text-white" : "bg-vk-100 text-vk-700"
                            }`}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </span>
                        </button>
                      </h3>
                      <div
                        id={`so-faq-${i}`}
                        role="region"
                        className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                      >
                        <div className="overflow-hidden">
                          <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- Cross-promo: Square Foot Seva ---------- */}
        <section className="vk-section !pt-0">
          <div className="vk-container">
            <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-navy px-5 py-12 text-center md:px-10 md:py-16">
              <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5" />
              <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-vk-500/15 blur-2xl" />
              <div className="relative mx-auto max-w-2xl">
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-[hsl(var(--gold))]">
                  <Gift className="h-6 w-6" />
                </span>
                <h2 className="vk-h2 mb-4 !text-white">
                  Make your celebration part of something permanent
                </h2>
                <p className="mb-6 text-[15px] text-white/80 md:text-base">
                  Sponsor a Square Foot of the Hare Krishna Vaikuntham Temple&apos;s foundation in honour of your special day.
                </p>
                <Link href={getSevaHref(sevas[0])} className="vk-btn-gold h-12 px-8 text-[15px] font-bold">
                  Explore Square Foot Seva
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
