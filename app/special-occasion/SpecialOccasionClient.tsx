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
  FileCheck2, Clock3,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import Ornament from "@/components/Ornament";
import { sevas, getSevaHref, type Seva } from "@/lib/sevaConfig";
import { getStoredTracking } from "@/lib/tracking";

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

  const [occasion, setOccasion] = useState<string>("Birthday");
  const [selectedSeva, setSelectedSeva] = useState<Seva>(sevas[2]); // Anna Daan Seva default
  const [amount, setAmount] = useState<number>(sevas[2].tiers[1].amount);
  const [useCustom, setUseCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });
  const [want80G, setWant80G] = useState(false);
  const [panNumber, setPanNumber] = useState("");
  const [dedication, setDedication] = useState("");
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
    if (!form.name.trim() || !form.email.trim() || !form.mobile.trim()) {
      setStatus({ type: "error", message: "Please fill in your name, email, and phone number." });
      return;
    }
    if (want80G && !panNumber.trim()) {
      setStatus({ type: "error", message: "PAN number is required for an 80G receipt." });
      return;
    }

    setSubmitting(true);
    try {
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
          utm: getStoredTracking() || undefined,
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
            setStatus({
              type: "success",
              message: `Thank you! Your ${selectedSeva.title} for this ${occasion.toLowerCase()} has been offered to Their Lordships. Hare Krishna 🙏`,
            });
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
      <main className="bg-background">
        {/* ---------- Hero — fully-designed banners, native aspect ratio ---------- */}
        <section className="relative overflow-hidden pt-20">
          <button onClick={scrollToForm} className="relative block w-full text-left" aria-label="Sponsor a seva for your special occasion">
            <div className="relative hidden w-full md:block" style={{ aspectRatio: "2006 / 784" }}>
              <Image src={HERO_DESKTOP} alt="Special Occasion — sponsor a seva for your celebration" fill priority sizes="100vw" className="object-cover" />
              <HeroSparkles />
            </div>
            <div className="relative w-full md:hidden" style={{ aspectRatio: "941 / 1672" }}>
              <Image src={HERO_MOBILE} alt="Special Occasion — sponsor a seva for your celebration" fill priority sizes="100vw" className="object-cover" />
              <HeroSparkles />
            </div>
          </button>
        </section>

        {/* ---------- Trust strip ---------- */}
        <section className="border-b border-border bg-[hsl(220,90%,12%)] py-3">
          <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4">
            {TRUST_BADGES.map((b) => (
              <span key={b.label} className="flex items-center gap-1.5 text-xs font-medium text-white/85 md:text-sm">
                <b.icon className="h-3.5 w-3.5 text-gold" /> {b.label}
              </span>
            ))}
          </div>
        </section>

        {/* ---------- Occasion picker ---------- */}
        <section className="bg-card py-12 md:py-16">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <Reveal>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">Step One</p>
              <h2 className="mb-7 font-heading text-xl font-bold text-primary md:text-2xl">What are you celebrating?</h2>
            </Reveal>
            <div className="flex flex-wrap justify-center gap-3">
              {OCCASIONS.map((o, i) => {
                const active = occasion === o.label;
                return (
                  <Reveal key={o.label} delay={i * 0.05}>
                    <button
                      onClick={() => setOccasion(o.label)}
                      className={`group flex w-28 flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 text-center transition-all md:w-32 ${
                        active
                          ? "border-gold bg-gradient-gold shadow-gold scale-105"
                          : "border-border bg-background hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-md"
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                          active ? "bg-white/25" : "bg-gold/10 group-hover:bg-gold/20"
                        }`}
                      >
                        <o.icon className={`h-5 w-5 ${active ? "text-[hsl(220,90%,12%)]" : "text-gold"}`} />
                      </span>
                      <span className={`text-xs font-semibold leading-tight ${active ? "text-[hsl(220,90%,12%)]" : "text-foreground"}`}>
                        {o.label}
                      </span>
                    </button>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- Why celebrate with seva ---------- */}
        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <Reveal>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">A Different Kind of Celebration</p>
              <h1 className="mb-4 font-heading text-2xl font-bold text-primary md:text-4xl">
                Mark Your Special Day with an Offering to the Lord
              </h1>
              <p className="mx-auto mb-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                A birthday, anniversary, or milestone is a moment of gratitude. Instead of — or alongside —
                the usual celebration, sponsor a seva at the Hare Krishna Vaikuntham Temple in that spirit
                of thanksgiving.
              </p>
              <Ornament className="my-8" />
            </Reveal>

            <div className="grid gap-5 sm:grid-cols-3">
              {BENEFITS.map((b, i) => (
                <Reveal key={b.title} delay={i * 0.1}>
                  <div className="rounded-2xl border border-border bg-card p-6 text-center">
                    <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                      <b.icon className="h-6 w-6 text-gold" />
                    </span>
                    <h3 className="mb-1.5 font-heading text-base font-bold text-primary">{b.title}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">{b.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <p className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Every Special Occasion seva comes with mahaprasadam, an 80G tax-exemption receipt, and the
                quiet satisfaction that your celebration became someone else's blessing too.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---------- Seva grid ---------- */}
        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <Reveal>
              <div className="mb-10 text-center">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">Step Two</p>
                <h2 className="font-heading text-2xl font-bold text-primary md:text-3xl">Choose a Seva for Your Occasion</h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {sevas.map((seva, i) => {
                const active = selectedSeva.slug === seva.slug;
                return (
                  <Reveal key={seva.slug} delay={i * 0.06}>
                    <button
                      onClick={() => pickSeva(seva)}
                      className={`group relative w-full overflow-hidden rounded-2xl border-2 bg-background text-center transition-all hover:-translate-y-1 hover:shadow-lg ${
                        active ? "border-gold shadow-gold" : "border-border"
                      }`}
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <Image src={seva.image} alt={seva.title} fill sizes="150px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <p className="absolute inset-x-0 bottom-0 translate-y-full p-2 text-left text-[10px] leading-snug text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          {seva.tagline}
                        </p>
                        {active && (
                          <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-gold text-[10px] font-bold text-[hsl(220,90%,12%)] shadow-gold">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="p-2 text-xs font-bold text-foreground md:text-sm">{seva.shortTitle}</p>
                    </button>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- Donation form ---------- */}
        <section id="occasion-form" className="scroll-mt-20 bg-background py-16 md:py-24">
          <div className="container mx-auto max-w-2xl px-4">
            <Reveal>
              <div className="mb-8 text-center">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">Step Three</p>
                <h2 className="mb-2 font-heading text-2xl font-bold text-primary md:text-4xl">Sponsor {selectedSeva.title}</h2>
                <p className="text-sm text-muted-foreground md:text-base">For your {occasion.toLowerCase()} — {selectedSeva.tagline.toLowerCase()}</p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-5 shadow-lg md:p-8">
              <p className="mb-3 text-sm font-semibold text-foreground">Choose a seva</p>
              <div className="mb-5 flex flex-wrap gap-2">
                {sevas.map((seva) => (
                  <button
                    type="button"
                    key={seva.slug}
                    onClick={() => pickSeva(seva)}
                    className={`rounded-full border-2 px-3 py-1.5 text-xs font-semibold transition-colors ${
                      selectedSeva.slug === seva.slug ? "border-gold bg-gold/10 text-primary" : "border-border text-muted-foreground hover:border-gold/50"
                    }`}
                  >
                    {seva.icon} {seva.shortTitle}
                  </button>
                ))}
              </div>

              <p className="mb-3 text-sm font-semibold text-foreground">Choose an amount</p>
              <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {selectedSeva.tiers.map((tier) => (
                  <button
                    type="button"
                    key={tier.label}
                    onClick={() => { setUseCustom(false); setAmount(tier.amount); }}
                    className={`rounded-xl border-2 px-2 py-3 text-center transition-colors ${
                      !useCustom && amount === tier.amount ? "border-gold bg-gold/10" : "border-border bg-background hover:border-gold/50"
                    }`}
                  >
                    <span className="block text-xs font-semibold text-gold">₹{tier.amount.toLocaleString("en-IN")}</span>
                    <span className="mt-0.5 block text-[10px] text-muted-foreground">{tier.label.split("/")[1]?.trim() || tier.label}</span>
                  </button>
                ))}
              </div>

              <div className="mb-5 flex items-center gap-2 rounded-xl border-2 border-border bg-background px-3 py-2 focus-within:border-gold">
                <label htmlFor="custom-amt" className="whitespace-nowrap text-xs font-semibold text-muted-foreground">Other amount ₹:</label>
                <input
                  id="custom-amt"
                  type="number"
                  min={100}
                  placeholder="100+"
                  value={customAmount}
                  onFocus={() => setUseCustom(true)}
                  onChange={(e) => { setUseCustom(true); setCustomAmount(e.target.value); }}
                  className="w-full bg-transparent text-sm font-semibold outline-none"
                />
              </div>

              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <input type="text" required placeholder="Full name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold" />
                <input type="tel" required placeholder="Mobile number *" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold" />
                <input type="email" required placeholder="Email address *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold sm:col-span-2" />
                <input type="text" placeholder="Dedicate to / occasion note (optional)" value={dedication} onChange={(e) => setDedication(e.target.value)} className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold sm:col-span-2" />
              </div>

              <label className="mb-3 flex cursor-pointer items-center gap-2 text-sm text-foreground">
                <input type="checkbox" checked={want80G} onChange={(e) => setWant80G(e.target.checked)} className="h-4 w-4 accent-[hsl(42,92%,46%)]" />
                I need an 80G tax exemption receipt
              </label>
              {want80G && (
                <input type="text" placeholder="PAN number *" value={panNumber} onChange={(e) => setPanNumber(e.target.value.toUpperCase())} className="mb-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm uppercase outline-none focus:border-gold" />
              )}

              {status && (
                <p className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium ${status.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}>
                  {status.message}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold py-3.5 text-base font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.02] disabled:opacity-60"
              >
                {submitting ? (<><Loader2 className="h-5 w-5 animate-spin" /> Processing…</>) : (<>Donate ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "—"}</>)}
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-gold" /> Secure payment via Razorpay
              </p>
            </form>
            </Reveal>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto max-w-3xl px-4">
            <Reveal>
              <h2 className="mb-8 text-center font-heading text-2xl font-bold text-primary md:text-3xl">Frequently Asked Questions</h2>
            </Reveal>
            <div className="space-y-3">
              {FAQS.map((f, i) => (
                <Reveal key={f.q} delay={i * 0.05}>
                <div className="overflow-hidden rounded-xl border border-border bg-background">
                  <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left">
                    <span className="text-sm font-semibold text-foreground md:text-base">{f.q}</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 text-gold transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && <p className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>}
                </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Cross-promo: Square Foot Seva ---------- */}
        <section className="bg-[hsl(220,90%,12%)] py-16 text-center md:py-24">
          <div className="container mx-auto max-w-2xl px-4">
            <Reveal>
            <Gift className="mx-auto mb-3 h-9 w-9 text-gold" />
            <h2 className="mb-4 font-heading text-2xl font-bold text-white md:text-3xl">
              Make your celebration part of something permanent
            </h2>
            <p className="mb-6 text-sm text-white/80 md:text-base">
              Sponsor a Square Foot of the Hare Krishna Vaikuntham Temple's foundation in honour of your special day.
            </p>
            <Link href={getSevaHref(sevas[0])} className="inline-block rounded-full bg-gradient-gold px-10 py-3.5 text-base font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)] transition-transform hover:scale-105">
              Explore Square Foot Seva
            </Link>
            </Reveal>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
