"use client";

import { cleanMobile } from "@/lib/phone";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { useAttribution } from "@/lib/useAttribution";
import SearchParamsWatcher from "@/components/SearchParamsWatcher";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  Loader2, User, Users, Phone, Mail, Check, Copy,
  ChevronDown, Heart, Building2,
  Repeat, Receipt, Gift, Lock, Sparkles, ArrowRight, BadgeCheck, MessageCircle,
} from "lucide-react";
import { useT } from "@/components/i18n/LocaleProvider";
import type { TFunction } from "@/lib/i18n/translate";
import PageLayout from "@/components/PageLayout";
import { SEVA_WHATSAPP_NUMBER } from "@/components/WhatsAppFloatButton";
import { useRazorpayPreload } from "@/lib/useRazorpayPreload";
import { useScrollToDonate } from "@/lib/useScrollToDonate";
import { newEventId, getMetaBrowserData, trackPurchase } from "@/lib/metaPixel";
import { EdHero, EdAbout, EdImpact, EdFeatures, EdPrivileges, EdTestimonials, EdReadMore, EdFinalCta, SectionTitle, sevaMotif } from "@/components/seva-campaign/EditorialSections";
import ImportanceSection from "@/components/sqft-campaign/ImportanceSection";
import FaqSection from "@/components/sqft-campaign/FaqSection";
import FounderSection from "@/components/sqft-campaign/FounderSection";
import AddressForm from "@/components/AddressForm";
import type { PrasadamAddress } from "@/components/AddressForm";
import DonorExtrasFields from "@/components/DonorExtrasFields";
import { getSevaCampaignConfig, GAU_CAMPAIGN, type SevaCampaignConfig } from "@/lib/sevaCampaignConfig";
import { useDonorPrefill } from "@/lib/donorPrefill";
import { useUpiFallback } from "@/components/UpiFallbackDialog";
import { prefillEmail } from "@/lib/razorpayPrefill";

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
const labelClass = "mb-1.5 block text-[13px] font-semibold text-ink/80";
const checkboxClass = "mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer rounded accent-vk-700";
const toggleCardClass = "rounded-2xl border transition-colors duration-200";
const toggleCardOn = "border-vk-300 bg-vk-50/70";
const toggleCardOff = "border-vk-100 bg-white hover:border-vk-200";
const toggleLabelClass = "flex min-h-[56px] cursor-pointer items-start gap-3 p-4";

// English impact text ("20 meals") — sent to the API as sevaUnitLabel, so it
// stays in English; `t` gives the on-screen version in the page's language.
function unitImpact(amount: number, config: SevaCampaignConfig, t?: TFunction): string | null {
  const unit = config.unit;
  if (!unit || !Number.isFinite(amount) || amount < unit.price) return null;
  const count = Math.floor(amount / unit.price);
  const word = count === 1 ? unit.singular : unit.plural;
  return `${count.toLocaleString("en-IN")} ${t ? t(word) : word}`;
}

const isTextField = (el: EventTarget | null) =>
  el instanceof HTMLElement && el.matches("input:not([type=checkbox]):not([type=radio]), textarea, select");

function StepLabel({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span
        aria-hidden
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-vk-100 font-heading text-[13px] font-bold text-vk-700 ring-1 ring-vk-200"
      >
        {n}
      </span>
      <h3 className="min-w-0 font-heading text-base font-bold text-vk-900">{children}</h3>
    </div>
  );
}

type FloatInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  hint?: string;
};

/** Input with a floating label: the label sits inside the field and lifts when focused or filled. */
function FloatInput({ id, label, icon: Icon, hint, ...props }: FloatInputProps) {
  return (
    <div className="relative">
      <input
        id={id}
        placeholder=" "
        title={hint}
        {...props}
        className="peer h-14 w-full rounded-2xl border border-vk-200 bg-white pb-1.5 pl-11 pr-4 pt-5 text-[15px] font-medium text-ink outline-none transition-[border-color,box-shadow] hover:border-vk-300 focus:border-vk-500 focus:shadow-[0_0_0_4px_rgba(47,91,211,0.14)]"
      />
      <Icon aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-400 transition-colors peer-focus:text-vk-600" />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-11 right-3 top-1/2 -translate-y-1/2 truncate text-[14px] text-muted-foreground transition-all duration-150 peer-focus:top-[15px] peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-vk-600 peer-[:not(:placeholder-shown)]:top-[15px] peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold"
      >
        {label}
      </label>
    </div>
  );
}

/** Smooth height reveal for the optional sub-fields (PAN, prasadam address). */
function Expand({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function SevaCampaignClient({ slug }: { slug: string }) {
  const config: SevaCampaignConfig = getSevaCampaignConfig(slug) ?? GAU_CAMPAIGN;
  const t = useT();
  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => new URLSearchParams());
  const attribution = useAttribution(config.path);
  const razorpayReady = useRazorpayPreload();
  const { offerUpi, upiFallbackDialog } = useUpiFallback();
  useScrollToDonate();

  const [tierIndex, setTierIndex] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", mobile: "", panNumber: "", sevakName: "", dob: "", dedicationOccasion: "", dedicationNote: "" });
  const [want80G, setWant80G] = useState(false);
  const [monthly, setMonthly] = useState(false);
  const [wantsMahaPrasadam, setWantsMahaPrasadam] = useState(false);
  const [address, setAddress] = useState<PrasadamAddress>({ street: "", city: "", state: "", pincode: "", country: "India" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showSticky, setShowSticky] = useState(false);
  const [formInView, setFormInView] = useState(false);
  const [typing, setTyping] = useState(false);
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
  const summaryRef = useRef<HTMLDivElement>(null);
  const tierRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFormInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  // The phone donate bar is shown whenever the summary/pay card is off-screen.
  useEffect(() => {
    const summary = summaryRef.current;
    if (!summary) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(summary);
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
  const impactLabel = unitImpact(finalAmount, config, t);
  const addonsEligible = finalAmount > 999;
  // A row of small icons that grows (gently, log-scale) with the impact count.
  const impactCount = config.unit && finalAmount >= config.unit.price ? Math.floor(finalAmount / config.unit.price) : 0;
  const impactIcons = impactCount > 0 ? Math.min(10, Math.max(1, Math.round(Math.log2(impactCount + 1) * 1.4))) : 0;
  const customTooLow = useCustom && customAmount !== "" && Number(customAmount) < config.minCustomAmount;
  const ImpactIcon = sevaMotif(config).icon;
  const maxTier = Math.max(...config.tiers.map((x) => x.amount));
  const [bankNoteBefore, bankNoteAfter = ""] = t("Email your transaction reference and PAN (for 80G) to {email}.").split("{email}");

  // Arrow keys move between the amount tiles (radio-group pattern).
  const onTierKeyDown = (e: React.KeyboardEvent) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const n = config.tiers.length;
    const from = useCustom ? 0 : tierIndex;
    const next = (from + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) + n) % n;
    setUseCustom(false);
    setTierIndex(next);
    tierRefs.current[next]?.focus();
  };

  useEffect(() => {
    if (!addonsEligible) {
      if (want80G) setWant80G(false);
      if (wantsMahaPrasadam) {
        setWantsMahaPrasadam(false);
        setAddress({ street: "", city: "", state: "", pincode: "", country: "India" });
      }
    }
  }, [addonsEligible]);

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
        // `dob` stays a real date of birth only; the date for any other occasion travels as dedicationDate.
        dob: form.dedicationOccasion === "birthday" ? form.dob || undefined : undefined,
        dedicationOccasion: form.dedicationOccasion || undefined,
        dedicationNote: form.dedicationOccasion === "other" ? form.dedicationNote.trim() || undefined : undefined,
        dedicationDate: form.dedicationOccasion ? form.dob || undefined : undefined,
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
        prefill: { name: form.name, email: prefillEmail(form.email), contact: form.mobile },
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
    <PageLayout whatsappNumber={SEVA_WHATSAPP_NUMBER}>
      {upiFallbackDialog}
      <SearchParamsWatcher onChange={setSearchParams} />
      {/* overflow-x: clip (not hidden) where supported, so the desktop summary card can stay sticky. */}
      <MotionConfig reducedMotion="user">
      <main className="overflow-x-hidden bg-white pt-[var(--header-h)] supports-[overflow:clip]:overflow-x-clip [&_.font-serif-display]:font-heading [&_.font-serif-display]:not-italic">
        <EdHero config={config} onDonate={scrollToDonate} onHow={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })} />

        {/* ── Donation Form ── */}
        <section id="donate" ref={formRef} className="scroll-mt-28 bg-gradient-to-b from-white via-vk-50/60 to-white py-12 md:py-20">
          <div className="vk-container">
            <div className="mx-auto max-w-6xl">
              <SectionTitle
                eyebrow={t("Temple Service Campaign")}
                title={t(config.formHeading)}
                sub={t(config.formSubheading)}
              />

              <MotionConfig reducedMotion="user">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-[28px] bg-white p-1.5 shadow-[0_30px_80px_-40px_rgba(10,18,51,0.45)] ring-1 ring-vk-100 sm:p-2"
              >
                <form
                  onSubmit={handleSubmit}
                  onFocus={(e) => { if (isTextField(e.target)) setTyping(true); }}
                  onBlur={(e) => { if (!isTextField(e.relatedTarget)) setTyping(false); }}
                  className="grid gap-1.5 sm:gap-2 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)]"
                >
                  {/* ═════ LEFT: choose the offering ═════ */}
                  <div className="min-w-0 rounded-[22px] bg-[#FBF8F1] p-4 sm:p-6 lg:p-8">
                    <StepLabel n={1}>{t("Choose Your Offering")}</StepLabel>

                    {/* One-time | Monthly */}
                    <div
                      role="radiogroup"
                      aria-label={t("Donation frequency")}
                      className="relative grid grid-cols-2 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-vk-100"
                    >
                      {([false, true] as const).map((isMonthly) => {
                        const on = monthly === isMonthly;
                        return (
                          <button
                            key={String(isMonthly)}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => {
                              setMonthly(isMonthly);
                              if (isMonthly) setWantsMahaPrasadam(false);
                            }}
                            className={`relative flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vk-500 ${
                              on ? "text-vk-800" : "text-ink/70 hover:text-vk-700"
                            }`}
                          >
                            {on && (
                              <motion.span
                                layoutId="freq-pill"
                                transition={{ type: "spring", stiffness: 500, damping: 38 }}
                                className="absolute inset-0 rounded-xl bg-vk-100 ring-1 ring-vk-300 shadow-[0_8px_18px_-12px_rgba(47,91,211,0.5)]"
                              />
                            )}
                            <span className="relative inline-flex items-center gap-1.5">
                              {isMonthly ? <Repeat className={`h-4 w-4 ${on ? "text-vk-600" : ""}`} /> : <Heart className={`h-4 w-4 ${on ? "fill-gold text-gold" : ""}`} />}
                              {isMonthly ? t("Monthly") : t("One-time")}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-2 flex items-start gap-1.5 px-1 text-[12px] leading-snug text-muted-foreground" aria-live="polite">
                      <Repeat aria-hidden className="mt-0.5 h-3 w-3 shrink-0 text-vk-400" />
                      {monthly && finalAmount > 0
                        ? t("Auto-pay {amount}{impact} every month. Cancel anytime.", {
                            amount: `₹${finalAmount.toLocaleString("en-IN")}`,
                            impact: impactLabel ? ` (${impactLabel})` : "",
                          })
                        : t("Give this offering automatically every month.")}
                    </p>

                    {/* Amount tiles */}
                    <div
                      role="radiogroup"
                      aria-label={t("Choose Your Offering")}
                      onKeyDown={onTierKeyDown}
                      className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3"
                    >
                      {/* Phones: slim full-width rows (icon · amount · radio). Wider screens: the card grid. */}
                      {config.tiers.map((tier, i) => {
                        const on = !useCustom && tierIndex === i;
                        const tierImpact = unitImpact(tier.amount, config, t);
                        return (
                          <motion.button
                            key={tier.amount}
                            ref={(el) => { tierRefs.current[i] = el; }}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            tabIndex={on || (useCustom && i === 0) ? 0 : -1}
                            onClick={() => { setUseCustom(false); setTierIndex(i); }}
                            animate={{ y: on ? -3 : 0 }}
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 28 }}
                            className={`relative grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 rounded-2xl border-2 bg-white px-3 py-2.5 text-left [grid-template-areas:'icon_text_radio'] sm:min-h-[150px] sm:grid-cols-[auto_minmax(0,1fr)] sm:grid-rows-[auto_1fr] sm:items-start sm:gap-x-2 sm:rounded-3xl sm:p-4 sm:[grid-template-areas:'icon_radio'_'text_text'] transition-[border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vk-500 focus-visible:ring-offset-2 sm:p-4 ${
                              on
                                ? "border-gold shadow-[0_16px_34px_-16px_rgba(201,150,43,0.75)]"
                                : "border-transparent shadow-[0_6px_18px_-12px_rgba(10,18,51,0.35)] ring-1 ring-vk-100 hover:ring-vk-200"
                            }`}
                          >
                              {/* Plate motif: the gold rim fills as the offering grows */}
                              <span aria-hidden className="relative flex h-12 w-12 shrink-0 items-center justify-center [grid-area:icon] sm:h-14 sm:w-14">
                                <svg viewBox="0 0 56 56" className="absolute inset-0 h-full w-full -rotate-90">
                                  <circle cx="28" cy="28" r="25" fill="none" strokeWidth="4" className="stroke-vk-100" />
                                  <motion.circle
                                    cx="28" cy="28" r="25" fill="none" strokeWidth="4" strokeLinecap="round"
                                    className={on ? "stroke-gold" : "stroke-vk-300"}
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: Math.max(0.12, tier.amount / maxTier) }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.9, delay: 0.1 * i, ease: "easeOut" }}
                                  />
                                </svg>
                                <span
                                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                                    on ? "bg-vk-100 text-vk-700" : "bg-[#FBF8F1] text-vk-600"
                                  }`}
                                >
                                  <ImpactIcon className="h-[18px] w-[18px]" />
                                </span>
                              </span>
                              <span
                                aria-hidden
                                className={`flex h-6 w-6 shrink-0 items-center justify-center justify-self-end rounded-full border-2 transition-colors [grid-area:radio] ${
                                  on ? "border-gold bg-gold text-vk-900" : "border-vk-200 bg-white"
                                }`}
                              >
                                <AnimatePresence initial={false}>
                                  {on && (
                                    <motion.span
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      exit={{ scale: 0 }}
                                      transition={{ type: "spring", stiffness: 500, damping: 26 }}
                                      className="flex"
                                    >
                                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </span>
                            <span className="flex min-w-0 flex-col [grid-area:text] sm:h-full">
                            <span className="block font-heading text-[1.25rem] font-extrabold leading-none text-vk-900 sm:mt-3 sm:text-2xl">
                              ₹{tier.amount.toLocaleString("en-IN")}
                            </span>
                            <span className="mt-1 block break-words text-[13.5px] font-semibold leading-snug text-ink/80 sm:mt-1.5 sm:text-[14px] sm:text-ink">
                              {t(tier.label)}
                            </span>
                            <span className="mt-0.5 hidden break-words text-[12.5px] leading-snug text-muted-foreground sm:line-clamp-2">
                              {t(tier.description)}
                            </span>
                            {tierImpact && (
                              <span className={`mt-auto hidden items-start gap-1 self-start rounded-xl px-2 py-1 sm:mt-2 sm:inline-flex text-[11.5px] font-semibold leading-tight ${on ? "bg-gold/20 text-gold-deep" : "bg-vk-50 text-vk-700"}`}>
                                <Sparkles aria-hidden className="h-3 w-3 shrink-0" />
                                {tierImpact}
                              </span>
                            )}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Custom amount */}
                    <div className="mt-3">
                      <div
                        className={`flex h-14 items-center gap-2 rounded-2xl border-2 bg-white px-4 transition-[border-color,box-shadow] ${
                          useCustom
                            ? "border-gold shadow-[0_12px_28px_-16px_rgba(201,150,43,0.7)]"
                            : "border-dashed border-vk-200 focus-within:border-vk-500"
                        }`}
                      >
                        <label htmlFor="custom-amount" className="shrink-0 text-[13px] font-semibold text-ink/75">
                          {t("Other amount")}
                        </label>
                        <span aria-hidden className="ml-auto pl-2 font-heading text-lg font-bold text-vk-700">₹</span>
                        <input
                          id="custom-amount"
                          type="number"
                          inputMode="numeric"
                          min={config.minCustomAmount}
                          placeholder={t("Min ₹{min}", { min: config.minCustomAmount })}
                          aria-describedby="custom-amount-hint"
                          aria-invalid={customTooLow || undefined}
                          value={customAmount}
                          onFocus={() => setUseCustom(true)}
                          onChange={(e) => {
                            setUseCustom(true);
                            setCustomAmount(e.target.value);
                          }}
                          className="h-full w-[6.5rem] min-w-0 shrink bg-transparent text-left font-heading text-lg font-bold text-ink outline-none [appearance:textfield] placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                      </div>
                      <p
                        id="custom-amount-hint"
                        className={`mt-1.5 px-1 text-[11.5px] ${customTooLow ? "font-semibold text-red-600" : "text-muted-foreground"}`}
                      >
                        {t("Minimum offering is ₹{min}", { min: config.minCustomAmount })}
                      </p>
                    </div>

                    <AnimatePresence initial={false}>
                      {impactLabel && (
                        <motion.p
                          key="impact"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <span className="mt-3 flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-3 text-[13px] font-semibold text-vk-800 ring-1 ring-gold/40">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
                              <ImpactIcon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0">
                              {useCustom
                                ? t("Your donation supports {impact}", { impact: impactLabel })
                                : t("This offering supports {impact}", { impact: impactLabel })}
                            </span>
                          </span>
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Bank transfer */}
                    <details className="group mt-3 rounded-2xl bg-white px-4 ring-1 ring-vk-100 [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-2 rounded-2xl text-[13px] font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vk-500">
                        <span className="inline-flex min-w-0 items-center gap-2.5">
                          <Building2 className="h-4 w-4 shrink-0 text-vk-500" />
                          {t("Prefer a direct bank transfer?")}
                        </span>
                        <ChevronDown className="h-4 w-4 shrink-0 text-vk-500 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="space-y-1 pb-3">
                        {(
                          [
                            ["Beneficiary", BANK_DETAILS.beneficiaryName],
                            ["Bank", BANK_DETAILS.bankName],
                            ["Account No.", BANK_DETAILS.accountNumber],
                            ["IFSC", BANK_DETAILS.ifsc],
                          ] as const
                        ).map(([label, value]) => (
                          <div key={label} className="flex flex-wrap items-center justify-between gap-x-3 border-b border-vk-100 py-0.5 text-xs last:border-0">
                            <span className="text-muted-foreground">{t(label)}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(label, value)}
                              className="flex min-h-[40px] min-w-0 items-center gap-1.5 break-all text-left font-semibold text-ink hover:text-vk-700"
                            >
                              {value}
                              {copiedField === label ? (
                                <Check className="h-3.5 w-3.5 shrink-0 text-green-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5 shrink-0 text-vk-400" />
                              )}
                            </button>
                          </div>
                        ))}
                        <p className="pt-1 text-[11.5px] leading-relaxed text-muted-foreground">
                          {bankNoteBefore}
                          <a href="mailto:social@hkmvizag.org" className="font-semibold text-vk-600 underline underline-offset-2">
                            social@hkmvizag.org
                          </a>
                          {bankNoteAfter}
                        </p>
                      </div>
                    </details>
                  </div>

                  {/* ═════ RIGHT: live summary + details + pay ═════ */}
                  <div className="min-w-0 rounded-[22px] bg-white p-4 sm:p-6 lg:p-8">
                    {/* Live summary */}
                    <div className="relative hidden overflow-hidden rounded-3xl bg-gradient-to-br from-vk-100 via-vk-50 to-white p-5 lg:block text-vk-900 ring-1 ring-vk-200 sm:p-6">
                      <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border border-gold/20" />
                      <div aria-hidden className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full border border-gold/15" />
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">{t("Your offering")}</p>
                      <p className="mt-1 truncate font-heading text-[15px] font-semibold text-vk-900">{t(config.pageTitle)}</p>
                      <div className="mt-3 flex min-h-[48px] flex-wrap items-end gap-x-1.5" aria-live="polite" aria-atomic="true">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={finalAmount}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="font-heading text-[2.5rem] font-extrabold leading-none text-vk-600 [overflow-wrap:anywhere]"
                          >
                            ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "0"}
                          </motion.span>
                        </AnimatePresence>
                        {monthly && <span className="pb-1 text-sm font-semibold text-ink/60">{t("/mo")}</span>}
                      </div>
                      <p className="mt-2 break-words text-[13px] font-medium text-ink/70">
                        {useCustom ? t("Custom offering") : config.tiers[tierIndex] ? t(config.tiers[tierIndex].label) : t("Select a tier")}
                      </p>
                      <div className="mt-4 min-h-[22px]">
                        <div className="flex items-center gap-[3px] sm:gap-1" aria-hidden>
                          {Array.from({ length: 10 }).map((_, i) => {
                            const lit = i < impactIcons;
                            return (
                              <motion.span
                                key={i}
                                animate={{ opacity: lit ? 1 : 0.35, scale: lit ? 1 : 0.86 }}
                                transition={{ delay: i * 0.03, type: "spring", stiffness: 500, damping: 26 }}
                                className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full transition-colors sm:h-[22px] sm:w-[22px] ${
                                  lit ? "bg-gold text-vk-900" : "bg-vk-200/70 text-vk-400"
                                }`}
                              >
                                <ImpactIcon className="h-3 w-3" />
                              </motion.span>
                            );
                          })}
                        </div>
                        {impactLabel && (
                          <p className="mt-2 text-[12.5px] font-medium text-ink/70">
                            {t("Supports {impact}", { impact: impactLabel })}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Details — the summary card above is desktop-only; phones already see the amount on the Donate button and the sticky bar */}
                    <div className="space-y-3.5 lg:mt-6">
                      <StepLabel n={2}>{t("Your Details")}</StepLabel>
                      <FloatInput
                        id="donor-name"
                        icon={User}
                        label={t("Full name")}
                        type="text"
                        required
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                      <FloatInput
                        id="donor-mobile"
                        icon={Phone}
                        label={t("Mobile number")}
                        hint={t("10-digit mobile")}
                        type="tel"
                        required
                        maxLength={10}
                        inputMode="numeric"
                        autoComplete="tel-national"
                        value={form.mobile}
                        onChange={(e) => setForm({ ...form, mobile: cleanMobile(e.target.value) })}
                      />

                      {lookupHint}

                      <FloatInput
                        id="donor-email"
                        icon={Mail}
                        label={`${t("Email address")} ${t("(optional)")}`}
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />

                      <DonorExtrasFields
                        sevakName={form.sevakName}
                        dob={form.dob}
                        onSevakNameChange={(v) => setForm((f) => ({ ...f, sevakName: v }))}
                        onDobChange={(v) => setForm((f) => ({ ...f, dob: v }))}
                        occasion={form.dedicationOccasion}
                        occasionNote={form.dedicationNote}
                        onOccasionChange={(v) => setForm((f) => ({ ...f, dedicationOccasion: v }))}
                        onOccasionNoteChange={(v) => setForm((f) => ({ ...f, dedicationNote: v }))}
                        collapsible
                      />

                      {/* 80G */}
                      {addonsEligible && (
                        <div className={`${toggleCardClass} ${want80G ? toggleCardOn : toggleCardOff}`}>
                          <label className={toggleLabelClass}>
                            <input
                              type="checkbox"
                              checked={want80G}
                              onChange={(e) => {
                                setWant80G(e.target.checked);
                                handle80GToggle(e.target.checked);
                              }}
                              className={checkboxClass}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block text-[13px] font-bold text-ink">{t("I need an 80G tax exemption receipt")}</span>
                              <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                                {t("Save tax under Section 80G — we'll need your PAN.")}
                              </span>
                            </span>
                            <Receipt aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-vk-400" />
                          </label>
                          <Expand open={want80G}>
                            <div className="border-t border-vk-100 px-4 pb-4 pt-3">
                              <label htmlFor="donor-pan" className={labelClass}>{t("PAN number")}</label>
                              <input
                                id="donor-pan"
                                type="text"
                                autoComplete="off"
                                placeholder="ABCDE1234F"
                                value={form.panNumber}
                                onChange={(e) => setForm({ ...form, panNumber: e.target.value.toUpperCase() })}
                                className="vk-input !h-12 !rounded-2xl uppercase tracking-wider"
                              />
                            </div>
                          </Expand>
                        </div>
                      )}

                      {/* Maha Prasadam (one-time donations only) */}
                      {addonsEligible && !monthly && (
                        <div className={`${toggleCardClass} ${wantsMahaPrasadam ? toggleCardOn : toggleCardOff}`}>
                          <label className={toggleLabelClass}>
                            <input
                              type="checkbox"
                              checked={wantsMahaPrasadam}
                              onChange={(e) => {
                                setWantsMahaPrasadam(e.target.checked);
                                handlePrasadamToggle(e.target.checked);
                              }}
                              className={checkboxClass}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block text-[13px] font-bold text-ink">{t("I'd like Maha Prasadam delivered")}</span>
                              <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                                {t("Sanctified prasadam sent to your address.")}
                              </span>
                            </span>
                            <Gift aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-vk-400" />
                          </label>
                          <Expand open={wantsMahaPrasadam}>
                            <div className="border-t border-vk-100 px-4 pb-4">
                              <AddressForm address={address} setAddress={setAddress} />
                            </div>
                          </Expand>
                        </div>
                      )}
                    </div>

                    {/* Pay */}
                    <div ref={summaryRef} className="mt-5 space-y-3">
                      <AnimatePresence initial={false}>
                        {status && (
                          <motion.p
                            key={status.message}
                            role={status.type === "error" ? "alert" : "status"}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`rounded-2xl px-4 py-3 text-[13px] font-medium ${
                              status.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700 ring-1 ring-red-100"
                            }`}
                          >
                            {t(status.message)}
                          </motion.p>
                        )}
                      </AnimatePresence>
                      <motion.button
                        type="submit"
                        disabled={submitting}
                        whileTap={{ scale: 0.985 }}
                        className="vk-btn-gold group h-14 w-full rounded-2xl px-4 text-base font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vk-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-80"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> {t("Processing…")}
                          </>
                        ) : (
                          <>
                            {monthly ? <Repeat className="h-4 w-4 shrink-0" /> : <Heart className="h-4 w-4 shrink-0 fill-current" />}
                            <span className="min-w-0 truncate">
                              {monthly
                                ? t("Donate {amount} / month", { amount: `₹${finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "—"}` })
                                : t("Donate {amount}", { amount: `₹${finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "—"}` })}
                            </span>
                            <ArrowRight aria-hidden className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </motion.button>
                      <p className="text-center text-[11px] leading-snug text-muted-foreground">
                        {t("Secure payment via Razorpay · UPI, cards & netbanking accepted")}
                      </p>

                      {/* Trust strip */}
                      <ul className="grid grid-cols-3 divide-x divide-vk-100 rounded-2xl bg-vk-50/70 py-3 text-center">
                        {(
                          [
                            [Lock, "Secure payment"],
                            [BadgeCheck, "80G tax benefit"],
                            [MessageCircle, "Receipt on WhatsApp"],
                          ] as const
                        ).map(([Icon, label]) => (
                          <li key={label} className="flex min-w-0 flex-col items-center gap-1.5 px-1.5">
                            <Icon aria-hidden className="h-4 w-4 text-vk-600" />
                            <span className="break-words text-[10.5px] font-semibold leading-tight text-ink/75">{t(label)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </form>
              </motion.div>
              </MotionConfig>
            </div>
          </div>
        </section>

        <EdAbout config={config} onDonate={scrollToDonate} />
        <EdImpact config={config} />
        <EdFeatures config={config} />
        <EdPrivileges config={config} onDonate={scrollToDonate} />
        <EdTestimonials config={config} />

        {/* ── Recent devotees supporting this seva ── */}
        {stats && stats.donors.length > 0 && (
          <section className="bg-gradient-to-b from-white via-vk-50/60 to-white py-14 md:py-20">
            <div className="vk-container">
              <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
                <div className="min-w-0 text-center lg:text-left">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700 ring-1 ring-emerald-100">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75 motion-reduce:hidden" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    {t("Live")}
                  </span>
                  <h2 className="mt-4 font-heading text-[1.6rem] font-extrabold leading-tight tracking-tight text-vk-900 md:text-[2rem]">
                    {t("Recent Devotees Supporting This Seva")}
                  </h2>
                  <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-ink/65 lg:mx-0">
                    {t("Thank you to everyone who has offered this seva recently.")}
                  </p>
                  {stats.donorCount > stats.donors.length && (
                    <p className="mx-auto mt-5 inline-flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left ring-1 ring-vk-100 lg:mx-0">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vk-100 text-vk-600"><Users className="h-5 w-5" /></span>
                      <span className="min-w-0">
                        <span className="block font-heading text-xl font-extrabold leading-none text-vk-700">{stats.donorCount.toLocaleString("en-IN")}</span>
                        <span className="mt-1 block text-[12.5px] font-medium text-ink/60">{t("devotees have offered this seva")}</span>
                      </span>
                    </p>
                  )}
                  <div className="mt-6 hidden lg:block">
                    <button type="button" onClick={scrollToDonate} className="vk-btn-gold h-12 px-8 text-[15px] font-bold">
                      <Heart className="h-4 w-4 fill-current" /> {t("Join them")}
                    </button>
                  </div>
                </div>

                <div className="min-w-0">
                  <ul className="overflow-hidden rounded-3xl bg-white shadow-[0_24px_50px_-34px_rgba(47,91,211,0.45)] ring-1 ring-vk-100">
                    {stats.donors.slice(0, 5).map((d, i) => (
                      <motion.li
                        key={`${d.name}-${i}`}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: i * 0.06 }}
                        className="flex items-center gap-3 border-b border-vk-50 px-4 py-3.5 last:border-b-0 sm:gap-3.5 sm:px-5"
                      >
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-heading text-[15px] font-bold ${
                          ["bg-vk-100 text-vk-700", "bg-amber-50 text-amber-700", "bg-emerald-50 text-emerald-700"][i % 3]
                        }`}>
                          {d.name.charAt(0).toUpperCase()}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px] font-semibold text-vk-900">{d.name}</span>
                          <span className="block text-[12px] text-ink/50">{d.time}</span>
                        </span>
                        <span className="shrink-0 rounded-full bg-vk-50 px-3 py-1 font-heading text-[14px] font-bold text-vk-700 ring-1 ring-vk-100">
                          ₹{d.amount.toLocaleString("en-IN")}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="mt-5 text-center lg:hidden">
                    <button type="button" onClick={scrollToDonate} className="vk-btn-gold h-12 w-full max-w-xs px-8 text-[15px] font-bold">
                      <Heart className="h-4 w-4 fill-current" /> {t("Join them")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Gallery ── */}
        {config.gallery.photos.length > 0 && (
          <section className="bg-white py-14 md:py-24">
            <div className="vk-container">
              <SectionTitle eyebrow={t(config.gallery.eyebrow)} title={t(config.gallery.heading)} sub={t(config.gallery.subtitle)} />
              <div className="mx-auto grid max-w-6xl auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px] md:grid-cols-4 md:gap-4">
                {config.gallery.photos.map((photo, i) => (
                  <motion.figure
                    key={photo.src + i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    className={`group relative overflow-hidden rounded-3xl bg-vk-100 ${i === 0 ? "col-span-2 row-span-2" : ""}`}
                  >
                    <Image
                      src={photo.src}
                      alt={t(photo.caption)}
                      fill
                      unoptimized
                      sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-vk-900/85 to-transparent p-3 pt-10 md:p-4 md:pt-12">
                      <span className="line-clamp-2 text-[13px] font-semibold text-white md:text-sm">{t(photo.caption)}</span>
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Power of Giving ── */}
        <ImportanceSection />

        {/* ── FAQs ── */}
        <FaqSection faqs={config.faqs} />

        {/* ── Founder's words ── */}
        <FounderSection />

        <EdReadMore config={config} />
        <EdFinalCta config={config} onDonate={scrollToDonate} />

        {/* ── Sticky mobile donate bar ──
            Shows on phones/tablets while the pay button is off-screen; hides
            while the donor is typing so it never sits over an input. Inside
            the form it jumps to the summary, elsewhere to the form. */}
        <AnimatePresence>
          {showSticky && !typing && (
            <motion.div
              key="sticky-donate"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-[calc(var(--bottom-nav-space)+4px+env(safe-area-inset-bottom))] left-3 right-[76px] z-40 lg:hidden"
            >
              <div className="flex items-center justify-between gap-2 rounded-2xl border border-vk-100 bg-white p-2 pl-3.5 shadow-[0_14px_34px_-14px_rgba(10,18,51,0.45)]">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium text-muted-foreground">{t(config.pageTitle)}</p>
                  <p className="truncate font-heading text-base font-extrabold text-vk-800">
                    ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "—"}
                    {monthly && <span className="text-xs font-bold">{t("/mo")}</span>}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (formInView) summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                    else scrollToDonate();
                  }}
                  className="vk-btn-gold h-11 shrink-0 whitespace-nowrap px-4 text-sm"
                >
                  <Heart className="h-4 w-4 fill-current" /> {t("Donate")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      </MotionConfig>
    </PageLayout>
  );
}
