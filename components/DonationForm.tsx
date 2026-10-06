"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, CheckCircle2, Heart, Loader2, ShieldCheck, User, Phone, Mail } from "lucide-react";
import { type Seva, unitImpact } from "@/lib/sevaConfig";
import { newEventId, getMetaBrowserData, trackPurchase } from "@/lib/metaPixel";
import { useAttribution } from "@/lib/useAttribution";
import { useRazorpayPreload } from "@/lib/useRazorpayPreload";
import { usePaymentStatusPoller } from "@/lib/usePaymentStatusPoller";
import AddressForm from "@/components/AddressForm";
import type { PrasadamAddress } from "@/components/AddressForm";
import DonorExtrasFields from "@/components/DonorExtrasFields";
import { useDonorPrefill } from "@/lib/donorPrefill";
import { useUpiFallback } from "@/components/UpiFallbackDialog";
import { prefillEmail } from "@/lib/razorpayPrefill";

type RazorpayConstructor = new (options: Record<string, unknown>) => { open: () => void };

const apiBase = () =>
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/+$/, "");

export interface DonationDonor {
  name: string;
  amount: number;
  time: string;
}

interface DonationFormProps {
  seva: Seva;
  /** Page the donation originates from — used for attribution + receipt source. */
  sourcePage: string;
  /** Optional festival slug (e.g. "chaturmas") appended to payment orders. */
  festivalSlug?: string;
  /** Desktop hero banner of the page this form sits on. Sent with the order so
      the pending-payment WhatsApp reminder uses this page's banner as its header. */
  bannerImage?: string;
  /** Pre-select a tier (or fall back to custom amount) on mount. */
  initialAmount?: number;
  /** Called after a successful one-time/monthly payment is verified. */
  onSuccess?: (donor: DonationDonor) => void;
  /** Thank-you URL type ("donation" for seva pages, "seva" for campaign pages). */
  thankYouType?: "donation" | "seva";
  /** Source label shown on the thank-you page. */
  thankYouSource?: string;
  /** Meta-pixel content name for purchase tracking. */
  trackContentName?: string;
  /** "stacked" (default) = single-column form used on /donate/[seva] pages.
      "grid" = compact two-column campaign form (Square Foot style). */
  variant?: "stacked" | "grid";
}

// Vaikuntham Blue donation-card styling (shared by both layouts).
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
const errorClass = "rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700";

/**
 * The full donation form used on every seva page (amount tiers, custom
 * amount, monthly autopay, 80G, Maha Prasadam, sevak details). Self-contained
 * so campaign pages like Chaturmas can offer the exact same checkout.
 */
export default function DonationForm({
  seva,
  sourcePage,
  festivalSlug,
  bannerImage,
  initialAmount,
  onSuccess,
  thankYouType = "donation",
  thankYouSource = "our seva programmes",
  trackContentName,
  variant = "stacked",
}: DonationFormProps) {
  const router = useRouter();
  const attribution = useAttribution(sourcePage);
  const razorpayReady = useRazorpayPreload();
  const { offerUpi, upiFallbackDialog } = useUpiFallback();
  const { startPolling, stopPolling } = usePaymentStatusPoller({
    onCompleted: (result) => {
      router.push(`/payment/thank-you?type=${thankYouType}&seva=${encodeURIComponent(result.sevaName || seva.title)}&amount=${result.amount}&source=${encodeURIComponent(thankYouSource)}`);
    },
  });

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

  // -- Donor pre-fill (logged-in profile OR phone lookup for past donors) --
  const { lookupHint, handle80GToggle, handlePrasadamToggle } = useDonorPrefill({
    form,
    setForm,
    onMahaPrasadamSelect: (saved) => {
      setAddress((a) => {
        const blank = !a.street && !a.city && !a.state && !a.pincode;
        return blank ? { ...saved } as PrasadamAddress : a;
      });
    },
  });

  // Pre-select a tier (or custom amount) when arriving with ?amount=...
  useEffect(() => {
    if (initialAmount && initialAmount > 0) {
      const idx = seva.tiers.findIndex((t) => t.amount === initialAmount);
      if (idx >= 0) {
        setTierIndex(idx);
        setUseCustom(false);
      } else {
        setUseCustom(true);
        setCustomAmount(String(initialAmount));
      }
    }
  }, [seva, initialAmount]);

  const finalAmount = useCustom ? Number(customAmount) || 0 : seva.tiers[tierIndex]?.amount || 0;
  const customImpact = useCustom ? unitImpact(finalAmount, seva.unit) : null;
  // Bare per-unit impact (e.g. "3 Gitas") for the monthly-donation label.
  const monthlyImpact = seva.unit ? unitImpact(finalAmount, seva.unit, true) : null;

  useEffect(() => {
    if (finalAmount <= 999) {
      if (want80G) setWant80G(false);
      if (wantsMahaPrasadam) {
        setWantsMahaPrasadam(false);
        setAddress({ street: "", city: "", state: "", pincode: "", country: "India" });
      }
    }
  }, [finalAmount, want80G, wantsMahaPrasadam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (finalAmount < 1) {
      setStatus({ type: "error", message: "Please enter a valid amount." });
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

      // Shared donor/seva fields for both one-time and monthly flows.
      const baseBody = {
        account: seva.account,
        sourcePage,
        ...(festivalSlug ? { festivalSlug } : {}),
        ...(bannerImage ? { bannerImage } : {}),
        utm: attribution.payload().utm,
        type: seva.category,
        sevaName: seva.title,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.trim(),
        amount: finalAmount,
        sevakName: form.sevakName.trim() || undefined,
        dob: form.dob || undefined,
        certificate: want80G,
        panNumber: want80G ? form.panNumber.trim() : undefined,
      };

      // Monthly autopay → Razorpay Subscription; one-time → Razorpay Order.
      const endpoint = monthly ? "/payments/subscription" : "/payments/order";
      const createRes = await fetch(`${apiBase()}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          monthly
            ? { ...baseBody, sevaUnitLabel: monthlyImpact || undefined }
            : {
                ...baseBody,
                mahaprasadam: wantsMahaPrasadam,
                prasadamAddress: wantsMahaPrasadam
                  ? { street: address.street.trim(), city: address.city.trim(), state: address.state.trim(), pincode: address.pincode.trim(), country: "India" }
                  : undefined,
                metaEventId,
                metaFbp: metaBrowser.fbp,
                metaFbc: metaBrowser.fbc,
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
        offerUpi({ donationId: created.donationId, orderId: created.orderId, amount: monthly ? 0 : finalAmount, campaign: seva.title, donorName: form.name });
        return;
      }

      const checkoutOptions: Record<string, unknown> = {
        key: created.key,
        name: "Hare Krishna Movement Vizag",
        description: monthly ? `${seva.title} — Monthly` : seva.title,
        prefill: { name: form.name, email: prefillEmail(form.email), contact: form.mobile },
        notes: { sourcePage, sevaName: seva.title, sevaType: seva.category },
        handler: async (response: Record<string, string>) => {
          stopPolling(); // frontend caught it — poller not needed
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
            trackPurchase({ value: finalAmount, eventId: metaEventId, content_name: trackContentName || seva.title });
            onSuccess?.({ name: `${form.name.split(" ")[0]} ${form.name.split(" ").slice(-1)[0].charAt(0)}.`, amount: finalAmount, time: "just now" });
            router.push(
              `/payment/thank-you?type=${thankYouType}&seva=${encodeURIComponent(seva.title)}&amount=${finalAmount}&source=${encodeURIComponent(thankYouSource)}${monthly ? "&recurring=1" : ""}`
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
        modal: {
          ondismiss: () => {
            offerUpi({ donationId: created.donationId, orderId: created.orderId, amount: monthly ? 0 : finalAmount, campaign: seva.title, donorName: form.name });
            // Keep submitting=true while the poller is active so Donate button
            // stays disabled — the donor may have paid in their UPI app.
            // Clearing status shows a gentle message instead of a spinner.
            setStatus({ type: "error", message: "If you completed the payment in your UPI app, your receipt will arrive on WhatsApp shortly." });
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

      // Start polling after Razorpay opens (one-time payments only — subscriptions
      // don't have an orderId to poll against).
      if (!monthly && created.orderId) {
        startPolling(created.orderId);
      }
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Something went wrong." });
      setSubmitting(false);
    }
  };

  // Compact two-column campaign layout (Square Foot style).
  if (variant === "grid") {
    return (
      <div className="vk-card overflow-hidden !rounded-3xl">
        {/* Amount summary strip */}
        <div className="flex items-center justify-between gap-3 bg-gradient-to-br from-vk-700 via-vk-600 to-vk-500 px-5 py-4 text-white sm:px-7">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
              {monthly ? "You're offering monthly" : "You're offering"}
            </p>
            <p className="text-base font-bold leading-snug text-white sm:text-xl">{seva.title}</p>
          </div>
          <p className="shrink-0 font-heading text-2xl font-extrabold text-[hsl(var(--gold))] sm:text-3xl">
            ₹{finalAmount ? finalAmount.toLocaleString("en-IN") : "0"}
            {monthly && <span className="text-base font-bold">/mo</span>}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 p-4 sm:p-6 lg:grid-cols-2 lg:gap-8">
          {/* Left: amount selection */}
          <div className="min-w-0 space-y-3">
            <p className={stepLabelClass}>Choose Amount</p>
            <div className="grid grid-cols-2 gap-2.5">
              {seva.tiers.map((tier, i) => (
                <button
                  key={tier.label}
                  type="button"
                  aria-pressed={!useCustom && tierIndex === i}
                  onClick={() => { setTierIndex(i); setUseCustom(false); }}
                  className={`${chipBase} text-center ${!useCustom && tierIndex === i ? chipOn : chipOff}`}
                >
                  <span className="block text-[12px] font-semibold leading-snug text-ink/75">{tier.label}</span>
                  <span className="mt-0.5 block text-base font-extrabold text-vk-700 sm:text-lg">
                    ₹{tier.amount.toLocaleString("en-IN")}
                  </span>
                </button>
              ))}
            </div>

            {/* Other amount */}
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
                min={1}
                placeholder="Min ₹100"
                value={customAmount}
                onFocus={() => setUseCustom(true)}
                onChange={(e) => {
                  setUseCustom(true);
                  setCustomAmount(e.target.value);
                }}
                className="h-full w-full min-w-0 bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-muted-foreground/60"
              />
            </div>
            {customImpact && (
              <p className="rounded-xl bg-vk-50 px-3.5 py-2 text-xs font-semibold text-vk-700">🙏 {customImpact}</p>
            )}
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

            {/* Maha Prasadam (one-time donations only) */}
            {finalAmount > 999 && !monthly && (
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

            {/* 80G */}
            {finalAmount > 999 && (
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
                <span className="block text-sm font-bold text-vk-800">🔁 Make it a monthly donation</span>
                <span className="block text-xs leading-snug text-muted-foreground">
                  {monthly && finalAmount
                    ? `Auto-pay ₹${finalAmount.toLocaleString("en-IN")}${monthlyImpact ? ` (${monthlyImpact})` : ""} every month. Cancel anytime.`
                    : "Give this amount automatically every month."}
                </span>
              </span>
            </button>

            {status?.type === "error" && (
              <p role="alert" className={errorClass}>{status.message}</p>
            )}

            <div className="flex-1" />

            <button
              type="submit"
              disabled={submitting}
              className="vk-btn-gold h-12 w-full text-[15px] font-bold"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
              ) : monthly ? (
                <>🔁 Donate ₹{finalAmount ? finalAmount.toLocaleString("en-IN") : "0"} / month</>
              ) : (
                <><Heart className="h-4 w-4 fill-current" /> Donate ₹{finalAmount ? finalAmount.toLocaleString("en-IN") : "0"} Now</>
              )}
            </button>
            <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-vk-500" />
              Secure payment via Razorpay · UPI, cards &amp; netbanking accepted
            </p>
          </div>
        </form>
      </div>
    );
  }

  useEffect(() => {
    // Auto-scroll to the form on page load so donors arriving via an ad CTA or
    // WhatsApp broadcast link land directly at the payment form instead of
    // the top of the page.
    const timer = setTimeout(() => {
      document.getElementById("donate")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="donate" className="vk-card scroll-mt-28 overflow-hidden !rounded-3xl">
      {upiFallbackDialog}
      {status?.type === "success" ? (
        <div className="flex flex-col items-center px-6 py-10 text-center">
          <CheckCircle2 className="mb-3 h-12 w-12 text-green-500" />
          <h3 className="mb-2 font-heading text-lg font-bold">Thank You!</h3>
          <p className="mb-6 text-sm text-muted-foreground">{status.message}</p>
          <button
            onClick={() => { setStatus(null); router.push("/"); }}
            className="vk-btn-primary"
          >
            Back to Home
          </button>
        </div>
      ) : (
        <>
          {/* Amount summary strip */}
          <div className="bg-gradient-to-br from-vk-700 via-vk-600 to-vk-500 px-5 py-4 text-white sm:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
              {monthly ? "You are donating monthly" : "You are donating"}
            </p>
            <div className="mt-0.5 flex items-end justify-between gap-3">
              <p className="min-w-0 truncate text-base font-bold text-white">{seva.title}</p>
              <p className="shrink-0 font-heading text-3xl font-extrabold text-[hsl(var(--gold))]">
                ₹{finalAmount ? finalAmount.toLocaleString("en-IN") : "0"}
                {monthly && <span className="text-lg font-bold">/mo</span>}
              </p>
            </div>
          </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-6">
          <h3 className={stepLabelClass}>
            Choose an Amount
          </h3>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-2">
            {seva.tiers.map((tier, i) => (
              <button
                key={tier.label}
                type="button"
                aria-pressed={!useCustom && tierIndex === i}
                onClick={() => { setTierIndex(i); setUseCustom(false); }}
                className={`${chipBase} text-center text-sm font-bold ${
                  !useCustom && tierIndex === i ? `${chipOn} text-vk-800` : `${chipOff} text-ink`
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-pressed={useCustom}
            onClick={() => setUseCustom(true)}
            className={`${chipBase} w-full text-center text-sm font-semibold ${
              useCustom ? `${chipOn} text-vk-800` : "border-dashed border-vk-200 bg-white text-ink/80 hover:border-vk-400"
            }`}
          >
            Enter a custom amount
          </button>

          {useCustom && (
            <div>
              <label htmlFor="df-custom-amount" className={labelClass}>Amount (₹)</label>
              <input
                id="df-custom-amount"
                type="number"
                min={1}
                required
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="vk-input font-semibold"
                placeholder="Enter amount"
              />
              {customImpact && (
                <p className="mt-2 rounded-xl bg-vk-50 px-3.5 py-2 text-xs font-semibold text-vk-700">
                  🙏 {customImpact}
                </p>
              )}
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
              <span className="block text-sm font-bold text-vk-800">🔁 Make it a monthly donation</span>
              <span className="block text-xs text-muted-foreground">
                {monthly && finalAmount
                  ? `Auto-pay ₹${finalAmount.toLocaleString("en-IN")}${monthlyImpact ? ` (${monthlyImpact})` : ""} every month. Cancel anytime.`
                  : "Give this amount automatically every month."}
              </span>
            </span>
          </button>

          <h3 className={`${stepLabelClass} pt-2`}>Your Details</h3>
          <div>
            <label htmlFor="df-name" className={labelClass}>Full Name</label>
            <input
              id="df-name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="vk-input"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="df-email" className={labelClass}>Email (optional)</label>
            <input
              id="df-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="vk-input"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="df-mobile" className={labelClass}>Phone Number</label>
            <input
              id="df-mobile"
              type="tel"
              required
              maxLength={10}
              inputMode="numeric"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/[^\d]/g, "").slice(0, 10) })}
              className="vk-input"
              placeholder="10-digit mobile number"
            />
          </div>

          {lookupHint}

          <DonorExtrasFields
            sevakName={form.sevakName}
            dob={form.dob}
            onSevakNameChange={(v) => setForm({ ...form, sevakName: v })}
            onDobChange={(v) => setForm({ ...form, dob: v })}
            collapsible
          />

          {finalAmount > 999 && (
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
                I want an 80G tax exemption receipt
              </label>
              {want80G && (
                <div className="mt-2.5">
                  <label htmlFor="df-pan" className={labelClass}>PAN Number</label>
                  <input
                    id="df-pan"
                    required
                    value={form.panNumber}
                    onChange={(e) => setForm({ ...form, panNumber: e.target.value.toUpperCase() })}
                    className="vk-input uppercase"
                    placeholder="ABCDE1234F"
                    maxLength={10}
                  />
                </div>
              )}
            </div>
          )}

          {finalAmount > 999 && !monthly && (
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

          {status?.type === "error" && (
            <p role="alert" className={errorClass}>{status.message}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="vk-btn-gold h-12 w-full text-[15px] font-bold"
          >
            {submitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
            ) : monthly ? (
              <>🔁 Donate ₹{finalAmount ? finalAmount.toLocaleString("en-IN") : "0"} / month</>
            ) : (
              <><Heart className="h-4 w-4 fill-current" /> Donate ₹{finalAmount ? finalAmount.toLocaleString("en-IN") : "0"} Now</>
            )}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-vk-500" /> Secured by Razorpay
          </p>
        </form>
        </>
      )}
    </div>
  );
}
