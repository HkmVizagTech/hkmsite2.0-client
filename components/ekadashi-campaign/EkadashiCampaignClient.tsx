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
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import AddressForm from "@/components/AddressForm";
import DonorExtrasFields from "@/components/DonorExtrasFields";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import { useRazorpayPreload } from "@/lib/useRazorpayPreload";
import { useScrollToDonate } from "@/lib/useScrollToDonate";
import { newEventId, getMetaBrowserData, trackPurchase } from "@/lib/metaPixel";
import type { PrasadamAddress } from "@/components/AddressForm";
import { useDonorPrefill } from "@/lib/donorPrefill";
import FaqSection from "@/components/sqft-campaign/FaqSection";
import FounderSection from "@/components/sqft-campaign/FounderSection";
import { unitImpact } from "@/lib/sevaConfig";
import type { EkadashiCampaign, EkadashiSeva } from "@/lib/ekadashiCampaign";
import { useUpiFallback } from "@/components/UpiFallbackDialog";

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

const inputWrapClass = "relative";
const inputIconClass =
  "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-400";
const inputClass = "vk-input pl-10";
const labelClass = "mb-1.5 block text-[13px] font-semibold text-ink/80";
const stepLabelClass = "mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-vk-700";
const addOnBoxClass = "rounded-xl border border-vk-100 bg-vk-50/60 px-3.5 py-3";
const addOnLabelClass = "flex cursor-pointer items-start gap-2.5 text-[13px] font-medium text-ink";

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
  const { offerUpi, upiFallbackDialog } = useUpiFallback();
  useScrollToDonate();

  // This is the permanent, festival-agnostic Ekadashi page. It always
  // renders the fixed server default (admin editing was removed), so the
  // campaign name and browser tab are the generic "Ekadashi" — never a
  // specific observance like Shayani Ekadashi.
  const name = campaign.campaignName || "Ekadashi";

  useEffect(() => {
    document.title = `${name} Seva & Annadanam | ISKCON Gambheeram Visakhapatnam`;
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

  // Donor pre-fill: logged-in profile auto-fills name/email/mobile; a
  // returning donor's phone lookup fills the same fields after they type
  // their 10-digit number. PAN/address are filled only when 80G/prasadam
  // are selected.
  const { lookupHint, handle80GToggle, handlePrasadamToggle } = useDonorPrefill({
    form,
    setForm,
    onMahaPrasadamSelect: (saved) => {
      setAddress((a) => {
        const blank = !a.street && !a.city && !a.state && !a.pincode;
        return blank ? ({ ...saved } as PrasadamAddress) : a;
      });
    },
  });

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
          // Page hero banner — used as the header image of the pending-payment WhatsApp reminder.
          bannerImage: campaign.heroImage,
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
      if (!win.Razorpay) {
        offerUpi({ donationId: order.donationId, orderId: order.orderId, amount: finalAmount, campaign: `Ekadashi — ${selectedSeva.sevaName}`, donorName: form.name });
        return;
      }

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
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            offerUpi({ donationId: order.donationId, orderId: order.orderId, amount: finalAmount, campaign: `Ekadashi — ${selectedSeva.sevaName}`, donorName: form.name });
          },
        },
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
      {upiFallbackDialog}
      <WhatsAppFloatButton />
      <main className="bg-white pt-[var(--header-h)] dark:bg-background">
        {/* ── Hero Banner ── */}
        <section className="bg-gradient-to-b from-vk-50 to-white">
          <div>
            <div className="overflow-hidden bg-vk-900">
              <button
                type="button"
                onClick={scrollToDonate}
                aria-label="Donate — go to the donation form"
                className="block w-full cursor-pointer"
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
                    className="block h-auto w-full"
                  />
                </picture>
              </button>
            </div>
          </div>
        </section>

        {/* ── Donation Form (right after banner) ── */}
        <section id="donate" className="vk-section scroll-mt-24 !pt-6 md:!pt-10">
          <div className="vk-container max-w-5xl">
            <SectionHeading
              as="h1"
              align="center"
              eyebrow="Ekadashi Seva"
              title={campaign.formHeading}
              subtitle={campaign.formSubheading}
            />

            <Reveal className="vk-card overflow-hidden !rounded-3xl">
              {/* Amount summary strip */}
              <div className="flex items-center justify-between gap-3 bg-gradient-to-br from-vk-700 via-vk-600 to-vk-500 px-5 py-4 text-white sm:px-7">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
                    You&apos;re offering
                  </p>
                  <p className="text-lg font-bold text-white">
                    {selectedSeva.label}
                  </p>
                </div>
                <p className="shrink-0 font-heading text-2xl font-extrabold text-[hsl(var(--gold))] sm:text-3xl">
                  ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "0"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="grid gap-6 p-4 sm:p-6 lg:grid-cols-2 lg:gap-8">
                {/* Left: seva + amount selection */}
                <div className="min-w-0 space-y-5">
                  {/* Step 1 — Choose Seva */}
                  <div>
                    <p className={stepLabelClass}>
                      Choose Seva
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {sevas.map((seva, i) => (
                        <button
                          key={seva.key}
                          type="button"
                          onClick={() => selectSeva(i)}
                          aria-pressed={sevaIndex === i}
                          className={`flex min-h-[52px] flex-col items-center justify-center gap-1.5 rounded-xl border px-1.5 py-3 text-center transition-all ${
                            sevaIndex === i
                              ? "border-vk-500 bg-vk-50 ring-2 ring-vk-500/20"
                              : "border-vk-200 bg-white hover:border-vk-400"
                          }`}
                        >
                          <span className="text-2xl leading-none">{seva.icon}</span>
                          <span className="text-[11px] font-bold leading-tight text-vk-800">
                            {seva.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2 — Choose Amount */}
                  <div>
                    <p className={stepLabelClass}>
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
                            className={`min-h-[52px] rounded-xl border px-3 py-2.5 text-left transition-all ${
                              !useCustom && tierIndex === i
                                ? "border-vk-500 bg-vk-50 ring-2 ring-vk-500/20"
                                : "border-vk-200 bg-white hover:border-vk-400"
                            }`}
                          >
                            <span className="block text-base font-extrabold text-vk-700">
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
                              <span className="mt-1 inline-block rounded-full bg-[hsl(var(--gold))] px-2 py-0.5 text-[10px] font-bold text-ink">
                                Most Donated
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Custom / open amount */}
                    <div className={customOnly ? "" : "mt-3"}>
                      <label htmlFor="custom-amount" className={labelClass}>
                        {customOnly ? "Enter amount" : "Enter custom amount"}
                      </label>
                      <div
                        className={`flex h-11 items-center gap-2 rounded-xl border px-3.5 transition-all ${
                          useCustom || customOnly
                            ? "border-vk-500 bg-vk-50 ring-2 ring-vk-500/20"
                            : "border-dashed border-vk-200 bg-white focus-within:border-vk-500"
                        }`}
                      >
                        <span className="text-sm font-semibold text-vk-700">₹</span>
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
                          className="h-full w-full min-w-0 bg-transparent text-[15px] font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground"
                        />
                      </div>
                    </div>
                    {customImpact && (
                      <p className="mt-2 rounded-xl bg-vk-50 px-3.5 py-2 text-xs font-semibold text-vk-700">
                        🙏 {customImpact}
                      </p>
                    )}
                  </div>

                  {/* Bank transfer */}
                  <details className="group rounded-xl border border-vk-100 bg-vk-50/60 px-3.5 py-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-[13px] font-semibold text-ink">
                      Prefer a direct bank transfer?
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-vk-100 text-vk-700 transition-transform group-open:rotate-180">
                        <ChevronDown className="h-3.5 w-3.5" />
                      </span>
                    </summary>
                    <div className="mt-3 space-y-2 rounded-xl bg-white p-3">
                      {bankLabelValues.map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between gap-2 text-xs">
                          <span className="shrink-0 text-muted-foreground">{label}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(label, value)}
                            className="flex min-w-0 items-center gap-1.5 break-all text-right font-semibold text-ink hover:text-vk-600"
                          >
                            {value}
                            {copiedField === label ? (
                              <Check className="h-3 w-3 shrink-0 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3 shrink-0 text-vk-400" />
                            )}
                          </button>
                        </div>
                      ))}
                      <p className="pt-1 text-[11px] leading-relaxed text-muted-foreground">
                        Email your transaction reference and PAN (for 80G) to{" "}
                        <a href={`mailto:${campaign.email}`} className="break-all font-semibold text-vk-600 hover:underline">
                          {campaign.email}
                        </a>
                        .
                      </p>
                    </div>
                  </details>
                </div>

                {/* Right: details, add-ons, submit */}
                <div className="flex min-w-0 flex-col space-y-3">
                  <p className={`${stepLabelClass} !mb-0`}>Your Details</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="donor-name" className={labelClass}>Full name</label>
                      <div className={inputWrapClass}>
                        <User className={inputIconClass} />
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
                        <Phone className={inputIconClass} />
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

                  {lookupHint}

                  <div>
                    <label htmlFor="donor-email" className={labelClass}>Email address (optional)</label>
                    <div className={inputWrapClass}>
                      <Mail className={inputIconClass} />
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
                    <div className={addOnBoxClass}>
                      <label className={addOnLabelClass}>
                        <input
                          type="checkbox"
                          checked={want80G}
                          onChange={(e) => {
                            setWant80G(e.target.checked);
                            handle80GToggle(e.target.checked);
                          }}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-vk-700"
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
                          className="vk-input mt-2.5 uppercase"
                        />
                      )}
                    </div>
                  )}

                  {/* Maha Prasadam */}
                  {finalAmount > 999 && (
                    <div className={addOnBoxClass}>
                      <label className={addOnLabelClass}>
                        <input
                          type="checkbox"
                          checked={wantsMahaPrasadam}
                          onChange={(e) => {
                            setWantsMahaPrasadam(e.target.checked);
                            handlePrasadamToggle(e.target.checked);
                          }}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-vk-700"
                        />
                        🙏 I&apos;d like Maha Prasadam delivered
                      </label>
                      {wantsMahaPrasadam && <AddressForm address={address} setAddress={setAddress} />}
                    </div>
                  )}

                  {status && (
                    <p
                      className={`rounded-xl px-3.5 py-2.5 text-[13px] font-medium ${
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
                    className="vk-btn-gold h-12 w-full text-[15px] font-bold disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                      </>
                    ) : (
                      <>Donate ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "—"}</>
                    )}
                  </button>
                  <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-center text-[11px] text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-vk-500" />
                    Secure payment via Razorpay · UPI, cards &amp; netbanking accepted
                  </p>
                </div>
              </form>
            </Reveal>
          </div>
        </section>

        {/* ── Spiritual Significance ── */}
        <section className="vk-section vk-band">
          <div className="vk-container max-w-4xl">
            <SectionHeading
              align="center"
              eyebrow="The divine occasion"
              title={<>Spiritual Significance of {campaign.campaignName}</>}
            />

            {/* Shloka */}
            <Reveal className="vk-card mb-6 p-6 text-center md:p-8">
              <p className="mb-4 font-heading text-lg leading-relaxed text-vk-800 md:text-xl">
                {campaign.shloka.sanskrit}
              </p>
              <p className="mb-2 font-serif-display text-[15px] italic leading-relaxed text-ink/75 md:text-base">
                &ldquo;{campaign.shloka.translation}&rdquo;
              </p>
              <p className="text-xs font-semibold text-vk-600">— {campaign.shloka.reference}</p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="vk-lead mx-auto max-w-2xl text-center">
                Contributing to {campaign.campaignName} is one of the most meaningful ways to serve the Lord
                on this most sacred of days. Your donation supports special puja arrangements, sacred bhog,
                and temple seva performed at the Hare Krishna Vaikuntham Temple on Ekadashi.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── Ekadashi Daan ── */}
        <section className="vk-section">
          <div className="vk-container max-w-6xl">
            <SectionHeading
              align="center"
              eyebrow="Sacred offerings"
              title={<>{campaign.campaignName} Daan</>}
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {campaign.sevaCards.map((seva, i) => {
                const Icon = CARD_ICONS[seva.icon || "flower"] || Flower2;
                return (
                  <Reveal
                    key={seva.title + i}
                    delay={i * 0.08}
                    className="vk-card vk-card-hover group flex flex-col overflow-hidden"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-vk-900">
                      <Image
                        src={seva.image}
                        alt={seva.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-vk-900/60 to-transparent" />
                      <span className="absolute bottom-3 left-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 text-vk-700 shadow">
                        <Icon className="h-5 w-5" />
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="mb-2 font-heading text-base font-bold text-ink md:text-lg">
                        {seva.title}
                      </h3>
                      <p className="mb-4 text-[13px] leading-relaxed text-muted-foreground">
                        {seva.description}
                      </p>
                      <Link
                        href={seva.href}
                        className="vk-btn-gold mt-auto self-start px-4 py-2"
                      >
                        Donate
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Significance Points ── */}
        <section className="vk-section vk-band">
          <div className="vk-container max-w-4xl">
            <SectionHeading
              align="center"
              eyebrow="Why this day matters"
              title={<>Significance of {campaign.campaignName}</>}
            />

            <div className="space-y-3">
              {campaign.significancePoints.map((point, i) => (
                <Reveal
                  key={point.title + i}
                  delay={i * 0.08}
                  className="vk-card p-5 md:p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="vk-icon-chip !h-9 !w-9 !rounded-full font-heading text-sm font-bold">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="mb-1.5 font-heading text-base font-bold text-ink md:text-lg">
                        {point.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                        {point.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Donate on Ekadashi ── */}
        <section className="vk-section">
          <div className="vk-container max-w-4xl">
            <SectionHeading
              align="center"
              eyebrow="The divine merit"
              title={<>Why Donate on {campaign.campaignName}?</>}
            />

            <div className="space-y-4">
              {campaign.whyDonateSections.map((section, i) => (
                <Reveal
                  key={section.title + i}
                  delay={i * 0.08}
                  className="vk-card p-6 md:p-8"
                >
                  <h3 className="vk-h3 mb-3">
                    {section.title}
                  </h3>
                  <p className="vk-lead">
                    {section.text}
                  </p>
                </Reveal>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/sqft-seva-campaign"
                className="vk-btn-gold h-auto min-h-12 whitespace-normal px-6 py-3 text-center"
              >
                Donate for Construction of Radha Krishna Temple
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQs ── */}
        <FaqSection faqs={campaign.faqs} />

        {/* ── Founder's words ── */}
        <FounderSection />

        {/* ── Sticky mobile donate bar ── */}
        {showSticky && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed bottom-[calc(var(--bottom-nav-space)+4px+env(safe-area-inset-bottom))] left-3 right-[76px] z-40 lg:hidden"
          >
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-vk-100 bg-white/95 p-2 pl-4 shadow-lift backdrop-blur">
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium text-muted-foreground">{selectedSeva.label}</p>
                <p className="font-heading text-base font-extrabold text-vk-700">
                  ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "0"}
                </p>
              </div>
              <button
                onClick={scrollToDonate}
                aria-label="Donate — go to the donation form"
                className="vk-btn-gold h-11 shrink-0 px-5"
              >
                Donate Now
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </PageLayout>
  );
}
