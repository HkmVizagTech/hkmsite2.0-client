"use client";

import { useState, useEffect } from "react";
import { useAttribution } from "@/lib/useAttribution";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Loader2, ShieldCheck, User, Phone, Mail, Check, Copy,
  UtensilsCrossed, Heart, BookOpen, Star, Flower2,
  ChevronDown, ChevronRight, type LucideIcon,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import Ornament from "@/components/Ornament";
import AddressForm from "@/components/AddressForm";
import DonorExtrasFields from "@/components/DonorExtrasFields";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import { useRazorpayPreload } from "@/lib/useRazorpayPreload";
import { useScrollToDonate } from "@/lib/useScrollToDonate";
import { newEventId, getMetaBrowserData, trackPurchase } from "@/lib/metaPixel";
import type { PrasadamAddress } from "@/components/AddressForm";
import FaqSection from "@/components/sqft-campaign/FaqSection";
import FounderSection from "@/components/sqft-campaign/FounderSection";
import { unitImpact } from "@/lib/sevaConfig";
import type { EkadashiCampaign, EkadashiSeva } from "@/lib/ekadashiCampaign";

type RazorpayConstructor = new (options: Record<string, unknown>) => { open: () => void };

const apiBase = () =>
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/+$/, "");

const SOURCE_PAGE = "/ekadashi";

/** Icon keys accepted in admin-edited seva cards, mapped to lucide icons. */
const CARD_ICONS: Record<string, LucideIcon> = {
  utensils: UtensilsCrossed,
  heart: Heart,
  star: Star,
  book: BookOpen,
  flower: Flower2,
};

const inputWrapClass =
  "relative flex items-center rounded-lg border border-border bg-card focus-within:border-gold transition-colors";
const inputClass =
  "h-10 w-full bg-transparent pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground";
const labelClass = "mb-1 block text-[11px] font-medium text-muted-foreground";

// The tier pre-selected when a seva is first shown. Falls back to the first
// tier when none is explicitly flagged as the default.
const defaultTierIndex = (seva: EkadashiSeva) => {
  const i = seva.tiers.findIndex((t) => t.default);
  return i === -1 ? 0 : i;
};

interface EkadashiCampaignClientProps {
  campaign: EkadashiCampaign;
}

export default function EkadashiCampaignClient({ campaign }: EkadashiCampaignClientProps) {
  const router = useRouter();
  const attribution = useAttribution(SOURCE_PAGE);
  const razorpayReady = useRazorpayPreload();
  useScrollToDonate();

  // Renaming the campaign (e.g. "Shayani Ekadashi" → "Kamika Ekadashi") must
  // propagate everywhere the old name appears, including the browser tab.
  const name = campaign.campaignName || "Ekadashi";
  const withName = (t: string) => t.replace(/Shayani Ekadashi/g, name);

  useEffect(() => {
    document.title = `${name} Seva | Hare Krishna Vaikuntham Temple, Visakhapatnam`;
  }, [name]);

  const sevas = campaign.sevas.length > 0
    ? campaign.sevas
    : [{ key: "general", label: "General Seva", icon: "🛕", sevaName: "General Seva", category: "GENERAL", tiers: [] }];
  const [sevaIndex, setSevaIndex] = useState(0);
  const [tierIndex, setTierIndex] = useState(() => defaultTierIndex(sevas[0]));
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", mobile: "", panNumber: "", sevakName: "", dob: "" });
  const [want80G, setWant80G] = useState(false);
  const [wantsMahaPrasadam, setWantsMahaPrasadam] = useState(false);
  const [address, setAddress] = useState<PrasadamAddress>({ street: "", city: "", state: "", pincode: "", country: "India" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const check = () => {
      const el = document.getElementById("donate");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pastForm = rect.bottom < 0;
      setShowSticky(pastForm);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  const selectedSeva = sevas[sevaIndex];
  const customOnly = selectedSeva.tiers.length === 0;
  const finalAmount =
    useCustom || customOnly
      ? Number(customAmount) || 0
      : selectedSeva.tiers[tierIndex]?.amount || 0;
  const customImpact =
    (useCustom || customOnly) ? unitImpact(finalAmount, selectedSeva.unit) : null;

  useEffect(() => {
    if (finalAmount <= 999) {
      if (want80G) setWant80G(false);
      if (wantsMahaPrasadam) {
        setWantsMahaPrasadam(false);
        setAddress({ street: "", city: "", state: "", pincode: "", country: "India" });
      }
    }
  }, [finalAmount, want80G, wantsMahaPrasadam]);

  // Switching seva resets the amount selection. Open-amount sevas (General)
  // go straight to the custom input.
  const selectSeva = (i: number) => {
    setSevaIndex(i);
    setTierIndex(defaultTierIndex(sevas[i]));
    setUseCustom(sevas[i].tiers.length === 0);
    setCustomAmount("");
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
    if (want80G && !form.panNumber.trim()) {
      setStatus({ type: "error", message: "PAN number is required for an 80G receipt." });
      return;
    }
    if (wantsMahaPrasadam && (!address.street.trim() || !address.city.trim() || !address.state.trim() || !/^\d{6}$/.test(address.pincode.trim()))) {
      setStatus({ type: "error", message: "Please complete the delivery address (door no./area, city, state and a valid 6-digit PIN code) for Maha Prasadam." });
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
          account: "default",
          sourcePage: SOURCE_PAGE,
          utm: attribution.payload().utm,
          type: selectedSeva.category,
          sevaName: selectedSeva.sevaName,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          mobile: form.mobile.trim(),
          amount: finalAmount,
          sevakName: form.sevakName.trim() || undefined,
          dob: form.dob || undefined,
          certificate: want80G,
          panNumber: want80G ? form.panNumber.trim() : undefined,
          mahaprasadam: wantsMahaPrasadam,
          prasadamAddress: wantsMahaPrasadam
            ? { street: address.street.trim(), city: address.city.trim(), state: address.state.trim(), pincode: address.pincode.trim(), country: "India" }
            : undefined,
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
        description: `${selectedSeva.sevaName} — Hare Krishna Vaikuntham Temple`,
        order_id: order.orderId,
        prefill: { name: form.name, email: form.email, contact: form.mobile },
        notes: { sourcePage: SOURCE_PAGE, sevaName: selectedSeva.sevaName, sevaType: selectedSeva.category },
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
            trackPurchase({ value: finalAmount, eventId: metaEventId, content_name: selectedSeva.sevaName });
            router.push(`/ekadashi/thank-you?seva=${encodeURIComponent(selectedSeva.sevaName)}&amount=${finalAmount}`);
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

  const bankLabelValues: Array<[string, string]> = [
    ["Beneficiary", campaign.bankDetails.beneficiaryName],
    ["Bank", campaign.bankDetails.bankName],
    ["Account No.", campaign.bankDetails.accountNumber],
    ["IFSC", campaign.bankDetails.ifsc],
  ];

  return (
    <PageLayout>
      <WhatsAppFloatButton />
      <main className="bg-white dark:bg-background">
        {/* ── Hero Banner ── */}
        <section className="bg-white dark:bg-background pt-[88px] md:pt-[104px]">
          <button
            type="button"
            onClick={scrollToDonate}
            aria-label="Donate — go to the donation form"
            className="block w-full cursor-pointer overflow-hidden rounded-b-3xl"
          >
            <picture>
              <source
                media="(max-width: 767px)"
                srcSet={campaign.heroImageMobile}
              />
              <source srcSet={campaign.heroImage} />
              <img
                src={campaign.heroImage}
                alt={`${campaign.campaignName} Seva — Hare Krishna Vaikuntham Temple`}
                fetchPriority="high"
                className="h-auto w-full"
              />
            </picture>
          </button>
        </section>

        {/* ── Donation Form (right after banner) ── */}
        <section id="donate" className="scroll-mt-24 bg-white dark:bg-background py-8 md:py-12">
          <div className="container mx-auto max-w-4xl px-4">
            <Ornament className="mb-4" />
            <div className="mb-5 text-center">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                Ekadashi Seva
              </p>
              <h2 className="mb-2 font-heading text-2xl font-bold text-primary md:text-3xl">
                {campaign.formHeading}
              </h2>
              <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground">
                {campaign.formSubheading}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden rounded-[28px] border border-border bg-white dark:bg-card shadow-elevated"
            >
              {/* Amount summary strip */}
              <div className="flex items-center justify-between gap-3 bg-gradient-gold px-6 py-4 sm:px-8">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(220,90%,12%)]/70">
                    You&apos;re offering
                  </p>
                  <p className="text-lg font-extrabold text-[hsl(220,90%,12%)] sm:text-xl">
                    {selectedSeva.label}
                  </p>
                </div>
                <p className="text-2xl font-extrabold text-[hsl(220,90%,12%)] sm:text-3xl">
                  ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "0"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="grid gap-6 p-5 sm:p-7 lg:grid-cols-2 lg:gap-8">
                {/* Left: seva + amount selection */}
                <div className="space-y-4">
                  {/* Step 1 — Choose Seva */}
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Choose Seva
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {sevas.map((seva, i) => (
                        <button
                          key={seva.key}
                          type="button"
                          onClick={() => selectSeva(i)}
                          aria-pressed={sevaIndex === i}
                          className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border px-1.5 py-3 text-center transition-colors ${
                            sevaIndex === i
                              ? "border-gold bg-gold/10"
                              : "border-border bg-card hover:border-gold/60"
                          }`}
                        >
                          <span className="text-2xl leading-none">{seva.icon}</span>
                          <span className="text-[11px] font-bold leading-tight text-primary">
                            {seva.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2 — Choose Amount */}
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Choose Amount
                    </p>
                    {!customOnly && (
                      <div className="grid grid-cols-2 gap-2">
                        {selectedSeva.tiers.map((tier, i) => (
                          <button
                            key={tier.amount}
                            type="button"
                            onClick={() => { setUseCustom(false); setTierIndex(i); }}
                            aria-pressed={!useCustom && tierIndex === i}
                            className={`rounded-lg border px-3 py-2.5 text-left transition-colors ${
                              !useCustom && tierIndex === i
                                ? "border-gold bg-gold/10"
                                : "border-border bg-card hover:border-gold/60"
                            }`}
                          >
                            <span className="block text-base font-extrabold text-gold">
                              ₹{tier.amount.toLocaleString("en-IN")}
                            </span>
                            {(selectedSeva.unit
                              ? unitImpact(tier.amount, selectedSeva.unit, true)
                              : tier.label) && (
                              <span className="block text-[11px] leading-snug text-muted-foreground">
                                {selectedSeva.unit
                                  ? unitImpact(tier.amount, selectedSeva.unit, true)
                                  : tier.label}
                              </span>
                            )}
                            {tier.popular && (
                              <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                Most Donated
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Custom / open amount */}
                    <div
                      className={`${customOnly ? "" : "mt-3"} overflow-hidden rounded-xl border-2 transition-all ${
                        useCustom || customOnly
                          ? "border-gold/60 bg-gradient-to-r from-gold/5 to-gold/10 shadow-[0_0_0_1px_rgba(214,158,46,0.15)]"
                          : "border-border bg-card hover:border-gold/30"
                      }`}
                    >
                      <label htmlFor="custom-amount" className="flex items-center gap-2 px-3.5 pt-2.5 pb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        {customOnly ? "Enter amount" : "Enter custom amount"}
                      </label>
                      <div className="flex items-center gap-2 px-3.5 pb-3">
                        <span className="text-lg font-bold text-gold">₹</span>
                        <input
                          id="custom-amount"
                          type="number"
                          min={101}
                          placeholder="Enter any amount"
                          value={customAmount}
                          onFocus={() => setUseCustom(true)}
                          onChange={(e) => {
                            setUseCustom(true);
                            setCustomAmount(e.target.value);
                          }}
                          className="h-10 w-full min-w-0 bg-transparent text-xl font-bold text-foreground outline-none placeholder:text-base placeholder:font-normal placeholder:text-muted-foreground"
                        />
                      </div>
                    </div>
                    {customImpact && (
                      <p className="mt-2 text-xs font-semibold text-gold">
                        🙏 {customImpact}
                      </p>
                    )}
                  </div>

                  {/* Bank transfer */}
                  <details className="group rounded-lg border border-border bg-white/60 px-3 py-2">
                    <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold text-foreground">
                      Prefer a direct bank transfer?
                      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mt-2.5 space-y-1.5">
                      {bankLabelValues.map(([label, value]) => (
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
                        <a href={`mailto:${campaign.email}`} className="font-semibold text-gold">
                          {campaign.email}
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
                          maxLength={10}
                          inputMode="numeric"
                          placeholder="10-digit mobile"
                          value={form.mobile}
                          onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/[^\d]/g, "").slice(0, 10) })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="donor-email" className={labelClass}>Email address (optional)</label>
                    <div className={inputWrapClass}>
                      <Mail className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
                      <input
                        id="donor-email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <DonorExtrasFields
                    sevakName={form.sevakName}
                    dob={form.dob}
                    onSevakNameChange={(v) => setForm({ ...form, sevakName: v })}
                    onDobChange={(v) => setForm({ ...form, dob: v })}
                    collapsible
                  />

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

                  {/* Maha Prasadam */}
                  {finalAmount > 999 && (
                    <div className="rounded-lg border border-border bg-background/60 px-3 py-2">
                      <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-foreground">
                        <input
                          type="checkbox"
                          checked={wantsMahaPrasadam}
                          onChange={(e) => setWantsMahaPrasadam(e.target.checked)}
                          className="h-3.5 w-3.5 shrink-0 accent-[hsl(42,92%,46%)]"
                        />
                        🙏 I&apos;d like Maha Prasadam delivered
                      </label>
                      {wantsMahaPrasadam && <AddressForm address={address} setAddress={setAddress} />}
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

        {/* ── Spiritual Significance ── */}
        <section className="bg-white dark:bg-background py-8 md:py-12">
          <div className="container mx-auto max-w-4xl px-4">
            <Ornament className="mb-4" />
            <div className="text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                The divine occasion
              </p>
              <h2 className="mb-6 font-heading text-2xl font-bold text-primary md:text-3xl">
                Spiritual Significance of {campaign.campaignName}
              </h2>
            </div>

            {/* Shloka */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-6 rounded-2xl border border-gold/20 bg-primary/5 p-6 text-center md:p-8"
            >
              <p className="mb-4 font-heading text-lg leading-relaxed text-primary md:text-xl">
                {campaign.shloka.sanskrit}
              </p>
              <p className="mb-2 text-sm italic leading-relaxed text-muted-foreground md:text-base">
                &ldquo;{campaign.shloka.translation}&rdquo;
              </p>
              <p className="text-xs font-semibold text-gold">— {campaign.shloka.reference}</p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-muted-foreground md:text-base"
            >
              Contributing to {campaign.campaignName} is one of the most meaningful ways to serve the Lord
              as He begins His divine rest. Your donation supports special puja arrangements, sacred bhog,
              and temple seva performed at the Hare Krishna Vaikuntham Temple on this holy day.
            </motion.p>
          </div>
        </section>

        {/* ── Ekadashi Daan ── */}
        <section className="bg-white dark:bg-background py-8 md:py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <Ornament className="mb-4" />
            <div className="mb-6 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                Sacred offerings
              </p>
              <h2 className="font-heading text-2xl font-bold text-primary md:text-3xl">
                {campaign.campaignName} Daan
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {campaign.sevaCards.map((seva, i) => {
                const Icon = CARD_ICONS[seva.icon || "flower"] || Flower2;
                return (
                  <motion.div
                    key={seva.title + i}
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
                        <Icon className="h-6 w-6 text-gold" />
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
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Significance Points ── */}
        <section className="bg-white dark:bg-background py-8 md:py-12">
          <div className="container mx-auto max-w-4xl px-4">
            <Ornament className="mb-4" />
            <div className="mb-6 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                Why this day matters
              </p>
              <h2 className="font-heading text-2xl font-bold text-primary md:text-3xl">
                Significance of {campaign.campaignName}
              </h2>
            </div>

            <div className="space-y-3">
              {campaign.significancePoints.map((point, i) => (
                <motion.div
                  key={point.title + i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="rounded-2xl border border-border bg-card p-5 md:p-6"
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
                        {withName(point.text)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Donate on Ekadashi ── */}
        <section className="bg-white dark:bg-background py-8 md:py-12">
          <div className="container mx-auto max-w-4xl px-4">
            <Ornament className="mb-4" />
            <div className="mb-6 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                The divine merit
              </p>
              <h2 className="font-heading text-2xl font-bold text-primary md:text-3xl">
                Why Donate on {campaign.campaignName}?
              </h2>
            </div>

            <div className="space-y-4">
              {campaign.whyDonateSections.map((section, i) => (
                <motion.div
                  key={section.title + i}
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
                    {withName(section.text)}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-center">
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
        <FaqSection faqs={campaign.faqs.map((f) => ({ ...f, q: withName(f.q), a: withName(f.a) }))} />

        {/* ── Founder's words ── */}
        <FounderSection />

        {/* ── Sticky mobile donate bar ── */}
        {showSticky && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 pt-1 md:hidden"
          >
            <button
              onClick={scrollToDonate}
              aria-label="Donate — go to the donation form"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)] transition-transform active:scale-95"
            >
              Donate Now
            </button>
          </motion.div>
        )}
      </main>
    </PageLayout>
  );
}