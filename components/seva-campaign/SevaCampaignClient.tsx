"use client";

import { useState, useRef, useEffect } from "react";
import { useAttribution } from "@/lib/useAttribution";
import SearchParamsWatcher from "@/components/SearchParamsWatcher";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Loader2, ShieldCheck, User, Phone, Mail, Check, Copy,
  ChevronDown, ChevronLeft, ChevronRight, Quote, Heart, Building2,
} from "lucide-react";
import SectionHeading from "@/components/site/SectionHeading";
import PageLayout from "@/components/PageLayout";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import { useRazorpayPreload } from "@/lib/useRazorpayPreload";
import { useScrollToDonate } from "@/lib/useScrollToDonate";
import { newEventId, getMetaBrowserData, trackPurchase } from "@/lib/metaPixel";
import ImportanceSection from "@/components/sqft-campaign/ImportanceSection";
import FaqSection from "@/components/sqft-campaign/FaqSection";
import FounderSection from "@/components/sqft-campaign/FounderSection";
import AddressForm from "@/components/AddressForm";
import type { PrasadamAddress } from "@/components/AddressForm";
import DonorExtrasFields from "@/components/DonorExtrasFields";
import { getSevaCampaignConfig, GAU_CAMPAIGN, type SevaCampaignConfig } from "@/lib/sevaCampaignConfig";
import { useDonorPrefill } from "@/lib/donorPrefill";
import { useUpiFallback } from "@/components/UpiFallbackDialog";

type RazorpayConstructor = new (options: Record<string, unknown>) => { open: () => void };

const apiBase = () =>
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/+$/, "");

const BANK_DETAILS = {
  beneficiaryName: "HARE KRISHNA MOVEMENT INDIA",
  bankName: "IDFC FIRST BANK LTD",
  accountNumber: "10091415313",
  ifsc: "IDFB0080412",
};

interface Donor {
  name: string;
  amount: number;
  time: string;
}

interface SevaStats {
  donors: Donor[];
  totalAmount: number;
  donorCount: number;
}

// Vaikuntham Blue donation-card styling.
const inputWrapClass = "relative";
const inputIconClass = "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-400";
const inputClass = "vk-input pl-10";
const labelClass = "mb-1.5 block text-[13px] font-semibold text-ink/80";
const stepLabelClass = "text-[13px] font-bold uppercase tracking-[0.08em] text-vk-700";
const addonBoxClass = "rounded-xl border border-vk-100 bg-vk-50/60 px-3.5 py-3";
const checkLabelClass = "flex cursor-pointer items-start gap-2.5 text-[13px] font-medium text-ink";
const checkboxClass = "mt-0.5 h-4 w-4 shrink-0 accent-vk-700";
const chipBase = "min-h-[52px] rounded-xl border px-3 py-2.5 transition-all";
const chipOn = "border-vk-500 bg-vk-50 ring-2 ring-vk-500/20";
const chipOff = "border-vk-200 bg-white hover:border-vk-400";

function unitImpact(amount: number, config: SevaCampaignConfig): string | null {
  const unit = config.unit;
  if (!unit || !Number.isFinite(amount) || amount < unit.price) return null;
  const count = Math.floor(amount / unit.price);
  return `${count.toLocaleString("en-IN")} ${count === 1 ? unit.singular : unit.plural}`;
}

export default function SevaCampaignClient({ slug }: { slug: string }) {
  const config: SevaCampaignConfig = getSevaCampaignConfig(slug) ?? GAU_CAMPAIGN;
  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => new URLSearchParams());
  const attribution = useAttribution(config.path);
  const razorpayReady = useRazorpayPreload();
  const { offerUpi, upiFallbackDialog } = useUpiFallback();
  useScrollToDonate();

  const [tierIndex, setTierIndex] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", mobile: "", panNumber: "", sevakName: "", dob: "" });
  const [want80G, setWant80G] = useState(false);
  const [monthly, setMonthly] = useState(false);
  const [wantsMahaPrasadam, setWantsMahaPrasadam] = useState(false);
  const [address, setAddress] = useState<PrasadamAddress>({ street: "", city: "", state: "", pincode: "", country: "India" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showSticky, setShowSticky] = useState(false);
  const [stats, setStats] = useState<SevaStats | null>(null);

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

  const formRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const amountParam = searchParams.get("amount");
    if (amountParam) {
      const amt = Number(amountParam);
      const idx = config.tiers.findIndex((t) => t.amount === amt);
      if (idx >= 0) {
        setTierIndex(idx);
        setUseCustom(false);
      } else if (amt > 0) {
        setUseCustom(true);
        setCustomAmount(String(amt));
      }
      setTimeout(() => {
        document.getElementById("donate")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 500);
    }
    // Only react to the first amount param — config stays stable.
  }, [searchParams]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${apiBase()}/seva-stats?sevaName=${encodeURIComponent(config.pageTitle)}&category=${encodeURIComponent(config.category)}&limit=5`
        );
        if (res.ok) setStats(await res.json());
      } catch {}
    })();
  }, [config.pageTitle, config.category]);

  const finalAmount = useCustom ? Number(customAmount) || 0 : config.tiers[tierIndex]?.amount || 0;
  const impact = unitImpact(finalAmount, config);
  const addonsEligible = finalAmount > 999;

  useEffect(() => {
    if (!addonsEligible) {
      if (want80G) setWant80G(false);
      if (wantsMahaPrasadam) {
        setWantsMahaPrasadam(false);
        setAddress({ street: "", city: "", state: "", pincode: "", country: "India" });
      }
    }
  }, [addonsEligible]);

  const galleryPages = config.gallery.photos.reduce< typeof config.gallery.photos[]>(
    (pages, photo, i) => {
      const pageIndex = Math.floor(i / 6);
      if (!pages[pageIndex]) pages[pageIndex] = [];
      pages[pageIndex].push(photo);
      return pages;
    },
    []
  );

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
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus({ type: "error", message: "Please enter a valid email address, or leave it blank." });
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) {
      setStatus({ type: "error", message: "Please enter a valid 10-digit mobile number." });
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
      // Shared donor/seva fields for both one-time and monthly flows.
      const baseBody = {
        account: config.account,
        sourcePage: config.path,
        // Page hero banner — used as the header image of the pending-payment WhatsApp reminder.
        bannerImage: config.bannerImage,
        utm: attribution.payload().utm,
        type: config.type,
        sevaName: config.pageTitle,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.trim(),
        amount: finalAmount,
        sevakName: form.sevakName.trim() || undefined,
        dob: form.dob || undefined,
        certificate: want80G,
        panNumber: want80G ? form.panNumber.trim() : undefined,
        metaEventId,
        metaFbp: metaBrowser.fbp,
        metaFbc: metaBrowser.fbc,
      };

      // Monthly autopay → Razorpay Subscription; one-time → Razorpay Order.
      const endpoint = monthly ? "/payments/subscription" : "/payments/order";
      const createRes = await fetch(`${apiBase()}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          monthly
            ? { ...baseBody, sevaUnitLabel: impact || undefined }
            : {
                ...baseBody,
                mahaprasadam: wantsMahaPrasadam,
                prasadamAddress: wantsMahaPrasadam
                  ? { street: address.street.trim(), city: address.city.trim(), state: address.state.trim(), pincode: address.pincode.trim(), country: "India" }
                  : undefined,
              }
        ),
      });

      if (!createRes.ok) {
        throw new Error(
          monthly
            ? "Unable to start the monthly donation. Please try again."
            : "Unable to create payment order. Please try again."
        );
      }
      const created = await createRes.json();

      await razorpayReady();
      const win = window as unknown as { Razorpay?: RazorpayConstructor };
      if (!win.Razorpay) {
        offerUpi({ donationId: created.donationId, orderId: created.orderId, amount: monthly ? 0 : finalAmount, campaign: config.pageTitle, donorName: form.name });
        return;
      }

      const checkoutOptions: Record<string, unknown> = {
        key: created.key,
        name: "Hare Krishna Movement Vizag",
        description: `${config.pageTitle}${monthly ? " — Monthly" : ""} — Hare Krishna Vaikuntham Temple`,
        prefill: { name: form.name, email: form.email, contact: form.mobile },
        notes: { sourcePage: config.path, sevaName: config.pageTitle, sevaType: config.type },
        handler: async (response: Record<string, string>) => {
          try {
            const verifyRes = await fetch(`${apiBase()}/payments/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                donationId: created.donationId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                razorpay_subscription_id: response.razorpay_subscription_id,
              }),
            });
            if (!verifyRes.ok) throw new Error("Payment verification failed.");
            trackPurchase({ value: finalAmount, eventId: metaEventId, content_name: config.pageTitle });
            window.location.assign(`/payment/thank-you?type=seva&seva=${encodeURIComponent(config.pageTitle)}&amount=${finalAmount}&source=${encodeURIComponent("the " + config.pageTitle.toLowerCase() + " programme")}${monthly ? "&recurring=1" : ""}`);
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
            offerUpi({ donationId: created.donationId, orderId: created.orderId, amount: monthly ? 0 : finalAmount, campaign: config.pageTitle, donorName: form.name });
          },
        },
        theme: { color: "#D69E2E" },
      };
      // Subscriptions authorise via subscription_id (no amount/order_id);
      // one-time payments pass the order and amount.
      if (monthly) {
        checkoutOptions.subscription_id = created.subscriptionId;
      } else {
        checkoutOptions.amount = Math.round(finalAmount * 100);
        checkoutOptions.currency = "INR";
        checkoutOptions.order_id = created.orderId;
      }

      new win.Razorpay(checkoutOptions).open();
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Something went wrong." });
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      {upiFallbackDialog}
      <SearchParamsWatcher onChange={setSearchParams} />
      <WhatsAppFloatButton />
      <main className="bg-white pt-[var(--header-h)] dark:bg-background">
        {/* ── Hero Banner (plain banner image — no content overlay) ── */}
        <section className="bg-gradient-to-b from-vk-50 to-white pb-2 pt-4 md:pt-6">
          <div className="vk-container">
            <button
              type="button"
              onClick={scrollToDonate}
              aria-label="Donate — go to the donation form"
              className="block w-full cursor-pointer overflow-hidden rounded-3xl bg-vk-900 shadow-[0_24px_60px_-28px_rgba(10,18,51,0.6)]"
            >
              <Image
                src={config.bannerImageMobile || config.bannerImage || config.heroImage}
                alt={`${config.pageTitle} — ${config.heroHeading1} ${config.heroHeading2}`}
                width={config.bannerMobileWidth ?? 941}
                height={config.bannerMobileHeight ?? 1672}
                priority
                sizes="100vw"
                className="block h-auto w-full md:hidden"
              />
              <Image
                src={config.bannerImage || config.heroImage}
                alt={`${config.pageTitle} — ${config.heroHeading1} ${config.heroHeading2}`}
                width={config.bannerWidth ?? 1672}
                height={config.bannerHeight ?? 941}
                priority
                sizes="(min-width: 1280px) 1248px, 100vw"
                className="hidden h-auto w-full md:block"
              />
            </button>
          </div>
        </section>

        {/* A real, visible H1 — the banner above is a pure image (no
            selectable/crawlable text), so without this the page has no
            text-based top-level heading at all, which hurts both SEO and
            accessibility (screen readers, images-disabled browsing). */}
        <div className="vk-container pb-1 pt-6 text-center md:pt-8">
          <h1 className="vk-h2 mx-auto max-w-4xl">
            {config.heroHeading1} <span className="text-vk-600">— {config.heroHeading2}</span>
          </h1>
        </div>

        {/* ── Donation Form ── */}
        <section id="donate" ref={formRef} className="scroll-mt-28 py-8 md:py-12">
          <div className="vk-container">
            <div className="mx-auto max-w-5xl">
              <SectionHeading
                align="center"
                eyebrow="Temple Service Campaign"
                title={config.formHeading}
                subtitle={config.formSubheading}
                className="!mb-6 md:!mb-8"
              />

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="vk-card overflow-hidden !rounded-3xl"
              >
                {/* Amount summary strip */}
                <div className="flex items-center justify-between gap-3 bg-gradient-to-br from-vk-700 via-vk-600 to-vk-500 px-5 py-4 text-white sm:px-7">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
                      You&apos;re offering
                    </p>
                    <p className="text-base font-bold leading-snug text-white sm:text-xl">
                      {useCustom
                        ? "Custom offering"
                        : config.tiers[tierIndex]?.label || "Select a tier"}
                    </p>
                  </div>
                  <p className="shrink-0 font-heading text-2xl font-extrabold text-[hsl(var(--gold))] sm:text-3xl">
                    ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "0"}
                    {monthly && <span className="text-base font-bold">/mo</span>}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 p-4 sm:p-6 lg:grid-cols-2 lg:gap-8">
                  {/* Left: amount selection */}
                  <div className="min-w-0 space-y-3">
                    <p className={stepLabelClass}>
                      Choose Your Offering
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {config.tiers.map((tier, i) => (
                        <button
                          key={tier.amount}
                          type="button"
                          aria-pressed={!useCustom && tierIndex === i}
                          onClick={() => { setUseCustom(false); setTierIndex(i); }}
                          className={`${chipBase} text-left ${!useCustom && tierIndex === i ? chipOn : chipOff}`}
                        >
                          <span className="mb-0.5 block text-[13px] font-semibold leading-snug text-ink">{tier.label}</span>
                          <span className="mb-1 block text-[11px] leading-snug text-muted-foreground">
                            {tier.description}
                          </span>
                          <span className="block text-base font-extrabold text-vk-700">
                            ₹{tier.amount.toLocaleString("en-IN")}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Custom amount */}
                    <div
                      className={`flex h-11 items-center gap-2 rounded-xl border px-3.5 transition-all ${
                        useCustom ? "border-vk-500 bg-vk-50 ring-2 ring-vk-500/20" : "border-dashed border-vk-200 bg-white focus-within:border-vk-500"
                      }`}
                    >
                      <label htmlFor="custom-amount" className="shrink-0 text-[13px] font-medium text-ink/70">
                        Other amount
                      </label>
                      <span className="text-sm font-semibold text-vk-700">₹</span>
                      <input
                        id="custom-amount"
                        type="number"
                        min={config.minCustomAmount}
                        placeholder={`Min ₹${config.minCustomAmount}`}
                        value={customAmount}
                        onFocus={() => setUseCustom(true)}
                        onChange={(e) => {
                          setUseCustom(true);
                          setCustomAmount(e.target.value);
                        }}
                        className="h-full w-full min-w-0 bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-muted-foreground"
                      />
                    </div>
                    {impact && (
                      <p className="rounded-xl bg-vk-50 px-3.5 py-2 text-xs font-semibold text-vk-700">
                        🙏 {useCustom ? "Your donation " : "This offering "}supports {impact}
                      </p>
                    )}

                    {/* Bank transfer */}
                    <details className="group rounded-xl border border-vk-100 bg-vk-50/60 px-3.5 py-3">
                      <summary className="flex min-h-[24px] cursor-pointer list-none items-center justify-between gap-2 text-[13px] font-semibold text-ink">
                        <span className="inline-flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-vk-500" />
                          Prefer a direct bank transfer?
                        </span>
                        <ChevronDown className="h-4 w-4 shrink-0 text-vk-500 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="mt-3 space-y-1">
                        {(
                          [
                            ["Beneficiary", BANK_DETAILS.beneficiaryName],
                            ["Bank", BANK_DETAILS.bankName],
                            ["Account No.", BANK_DETAILS.accountNumber],
                            ["IFSC", BANK_DETAILS.ifsc],
                          ] as const
                        ).map(([label, value]) => (
                          <div key={label} className="flex flex-wrap items-center justify-between gap-x-2 text-xs">
                            <span className="text-muted-foreground">{label}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(label, value)}
                              className="flex min-h-[32px] min-w-0 items-center gap-1.5 break-all text-left font-semibold text-ink hover:text-vk-700"
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
                          <a href="mailto:social@hkmvizag.org" className="font-semibold text-vk-600 underline underline-offset-2">
                            social@hkmvizag.org
                          </a>
                          .
                        </p>
                      </div>
                    </details>
                  </div>

                  {/* Right: details, add-ons, submit */}
                  <div className="flex min-w-0 flex-col space-y-3">
                    <p className={stepLabelClass}>Your Details</p>
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
                    {addonsEligible && (
                      <div className={addonBoxClass}>
                        <label className={checkLabelClass}>
                          <input
                            type="checkbox"
                            checked={want80G}
                            onChange={(e) => {
                              setWant80G(e.target.checked);
                              handle80GToggle(e.target.checked);
                            }}
                            className={checkboxClass}
                          />
                          I need an 80G tax exemption receipt
                        </label>
                        {want80G && (
                          <input
                            id="donor-pan"
                            type="text"
                            placeholder="PAN number *"
                            aria-label="PAN number"
                            value={form.panNumber}
                            onChange={(e) => setForm({ ...form, panNumber: e.target.value.toUpperCase() })}
                            className="vk-input mt-2.5 uppercase"
                          />
                        )}
                      </div>
                    )}

                    {/* Maha Prasadam (one-time donations only) */}
                    {addonsEligible && !monthly && (
                      <div className={addonBoxClass}>
                        <label className={checkLabelClass}>
                          <input
                            type="checkbox"
                            checked={wantsMahaPrasadam}
                            onChange={(e) => {
                              setWantsMahaPrasadam(e.target.checked);
                              handlePrasadamToggle(e.target.checked);
                            }}
                            className={checkboxClass}
                          />
                          🙏 I&apos;d like Maha Prasadam delivered
                        </label>
                        {wantsMahaPrasadam && <AddressForm address={address} setAddress={setAddress} />}
                      </div>
                    )}

                    {/* Monthly autopay toggle */}
                    <button
                      type="button"
                      aria-pressed={monthly}
                      onClick={() => {
                        setMonthly((m) => {
                          const next = !m;
                          if (next) setWantsMahaPrasadam(false);
                          return next;
                        });
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all ${monthly ? chipOn : chipOff}`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                          monthly ? "border-vk-700 bg-vk-700 text-white" : "border-vk-300 bg-white"
                        }`}
                      >
                        {monthly && <Check className="h-3.5 w-3.5" />}
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-bold text-vk-800">🔁 Make it a monthly seva</span>
                        <span className="block text-xs leading-snug text-muted-foreground">
                          {monthly && finalAmount > 0
                            ? `Auto-pay ₹${finalAmount.toLocaleString("en-IN")}${impact ? ` (${impact})` : ""} every month. Cancel anytime.`
                            : "Give this offering automatically every month."}
                        </span>
                      </span>
                    </button>

                    {status && (
                      <p
                        role={status.type === "error" ? "alert" : undefined}
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
                      className="vk-btn-gold h-12 w-full text-[15px] font-bold"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                        </>
                      ) : monthly ? (
                        <>🔁 Donate ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "—"} / month</>
                      ) : (
                        <><Heart className="h-4 w-4 fill-current" /> Donate ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "—"}</>
                      )}
                    </button>
                    <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
                      <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-vk-500" />
                      Secure payment via Razorpay · UPI, cards &amp; netbanking accepted
                    </p>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section className="vk-section vk-band">
          <div className="vk-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="vk-card mx-auto grid max-w-6xl items-stretch overflow-hidden !rounded-3xl md:grid-cols-2"
            >
              <div className="relative min-h-[240px] md:min-h-[360px]">
                <Image
                  src={config.about.image}
                  alt={config.pageTitle}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center p-6 md:p-10">
                <span className="vk-pill mb-4 self-start">{config.about.eyebrow}</span>
                <h2 className="vk-h2">{config.about.heading}</h2>
                <div className="mt-3 space-y-3">
                  {config.about.paragraphs.map((p, i) => (
                    <p key={i} className="vk-lead">
                      {p}
                    </p>
                  ))}
                </div>
                <button
                  onClick={scrollToDonate}
                  className="vk-btn-gold mt-6 h-12 self-start px-8"
                >
                  <Heart className="h-4 w-4 fill-current" /> {config.about.ctaLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Impact ── */}
        <section className="vk-section">
          <div className="vk-container">
            <SectionHeading
              align="center"
              eyebrow="Why it matters"
              title={`The Significance of ${config.pageTitle}`}
            />
            <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {config.impactItems.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="vk-card vk-card-hover p-5 md:p-6"
                >
                  <span className="vk-icon-chip mb-4">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mb-1.5 text-base font-bold text-ink">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── What your donation does ── */}
        <section className="vk-section vk-band">
          <div className="vk-container">
            <SectionHeading
              align="center"
              eyebrow="What your offering does"
              title="Where Your Donation Goes"
            />
            <div className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-2 md:gap-4">
              {config.features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="vk-card flex gap-4 p-4 md:p-5"
                >
                  <span className="vk-icon-chip">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="mb-1 text-sm font-bold text-ink md:text-[15px]">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Donor privileges ── */}
        <section className="vk-section">
          <div className="vk-container">
            <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-navy px-5 py-10 md:px-10 md:py-14">
              <div aria-hidden className="absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full bg-white/5" />
              <SectionHeading
                align="center"
                light
                eyebrow="Our gratitude to every donor"
                title="Donor Privileges"
              />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                {config.privileges.map((p, i) => (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <span className="vk-icon-chip mb-4 !bg-white/10 !text-[hsl(var(--gold))]">
                      <p.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mb-1.5 text-base font-bold text-white">{p.title}</h3>
                    <p className="text-sm leading-relaxed text-white/70">{p.text}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8 text-center md:mt-10">
                <button
                  onClick={scrollToDonate}
                  className="vk-btn-gold h-12 px-10"
                >
                  <Heart className="h-4 w-4 fill-current" /> Donate Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="vk-section">
          <div className="vk-container">
            <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
              <SectionHeading
                eyebrow="What Our Devotees Say"
                title="Voices of Devotion"
                className="!mb-0"
              />
              <div className="hidden shrink-0 gap-2 sm:flex">
                <button
                  type="button"
                  aria-label="Scroll left"
                  onClick={() => testimonialsRef.current?.scrollBy({ left: -400, behavior: "smooth" })}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-vk-200 bg-white text-vk-700 transition hover:border-vk-500 hover:bg-vk-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Scroll right"
                  onClick={() => testimonialsRef.current?.scrollBy({ left: 400, behavior: "smooth" })}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-vk-200 bg-white text-vk-700 transition hover:border-vk-500 hover:bg-vk-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            <motion.div
              ref={testimonialsRef}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="vk-scroller pb-4"
            >
              {config.testimonials.map((t) => (
                <div
                  key={t.name}
                  className="vk-card flex w-[85%] max-w-[380px] shrink-0 flex-col p-5 sm:w-96 md:p-6"
                >
                  <Quote className="mb-3 h-7 w-7 text-vk-300" />
                  <p className="mb-5 flex-1 text-sm leading-relaxed text-ink/85 md:text-[15px]">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 border-t border-vk-100 pt-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-vk-100 text-sm font-bold text-vk-700">
                      {t.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Recent devotees supporting this seva ── */}
        {stats && stats.donors.length > 0 && (
          <section className="vk-section vk-band">
            <div className="vk-container">
              <div className="mx-auto max-w-5xl">
                <div className="mb-6 flex flex-col items-center justify-center gap-2 text-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-green-700">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                    </span>
                    Live
                  </span>
                  <h2 className="vk-h3">
                    Recent Devotees Supporting This Seva
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {stats.donors.slice(0, 5).map((d, i) => (
                    <motion.div
                      key={`${d.name}-${i}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="vk-card flex items-center gap-3 px-3.5 py-2.5"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-vk-700 text-xs font-bold text-white">
                        {d.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{d.name}</p>
                        <p className="text-[11px] text-muted-foreground">Donated ₹{d.amount.toLocaleString("en-IN")} · {d.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Gallery ── */}
        {config.gallery.photos.length > 0 && (
          <section className="vk-section">
            <div className="vk-container">
              <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
                <SectionHeading
                  eyebrow={config.gallery.eyebrow}
                  title={config.gallery.heading}
                  subtitle={config.gallery.subtitle}
                  className="!mb-0"
                />
                {galleryPages.length > 1 && (
                  <div className="hidden shrink-0 gap-2 sm:flex">
                    <button
                      type="button"
                      aria-label="Scroll left"
                      onClick={() => galleryRef.current?.scrollBy({ left: -galleryRef.current.offsetWidth, behavior: "smooth" })}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-vk-200 bg-white text-vk-700 transition hover:border-vk-500 hover:bg-vk-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Scroll right"
                      onClick={() => galleryRef.current?.scrollBy({ left: galleryRef.current.offsetWidth, behavior: "smooth" })}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-vk-200 bg-white text-vk-700 transition hover:border-vk-500 hover:bg-vk-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              <div
                ref={galleryRef}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {galleryPages.map((page, pageIndex) => (
                  <div key={pageIndex} className="w-full min-w-0 shrink-0 snap-start">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                      {page.map((photo, i) => (
                        <motion.div
                          key={photo.src + i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.06, duration: 0.5 }}
                          className="vk-tile aspect-[4/3]"
                        >
                          <Image
                            src={photo.src}
                            alt={photo.caption}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 50vw, 33vw"
                            className="object-cover"
                          />
                          <div className="vk-tile-caption !p-3 md:!p-4">
                            <p className="line-clamp-2 text-xs font-semibold text-white md:text-sm">{photo.caption}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {galleryPages.length > 1 && (
                <div className="mt-4 flex justify-center gap-1.5 sm:hidden">
                  {galleryPages.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to page ${i + 1}`}
                      onClick={() => {
                        const container = galleryRef.current;
                        if (container) {
                          container.scrollTo({ left: i * container.offsetWidth, behavior: "smooth" });
                        }
                      }}
                      className="h-1.5 rounded-full bg-vk-200 transition-all hover:bg-vk-500"
                      style={{ width: 24 }}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Power of Giving ── */}
        <ImportanceSection />

        {/* ── FAQs ── */}
        <FaqSection faqs={config.faqs} />

        {/* ── Founder's words ── */}
        <FounderSection />

        {/* ── Sticky mobile donate bar ── */}
        {showSticky && (
          <div className="fixed bottom-[calc(var(--bottom-nav-space)+4px+env(safe-area-inset-bottom))] left-3 right-[76px] z-40 lg:hidden">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-vk-100 bg-white/95 p-2 pl-4 shadow-lift backdrop-blur">
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium text-muted-foreground">{config.pageTitle}</p>
                <p className="font-heading text-base font-extrabold text-vk-800">
                  ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "—"}
                  {monthly && <span className="text-xs font-bold">/mo</span>}
                </p>
              </div>
              <button
                onClick={scrollToDonate}
                className="vk-btn-gold h-11 shrink-0 px-5"
              >
                <Heart className="h-4 w-4 fill-current" /> Donate Now
              </button>
            </div>
          </div>
        )}
      </main>
    </PageLayout>
  );
}
