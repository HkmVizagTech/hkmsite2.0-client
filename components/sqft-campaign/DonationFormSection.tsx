"use client";

import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2, User, Phone, Mail, Check, Copy, ChevronDown, MapPin, Crown, PenLine } from "lucide-react";
import SectionHeading from "@/components/site/SectionHeading";
import DonorExtrasFields from "@/components/DonorExtrasFields";
import { useDonorPrefill } from "@/lib/donorPrefill";
import type { CampaignConfig, GoldenTierConfig } from "@/lib/campaignConfig";

export interface DonorForm {
  name: string;
  email: string;
  mobile: string;
  panNumber: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  sevakName: string;
  dob: string;
}

interface DonationFormSectionProps {
  price: number;
  minCustomAmount: number;
  sqftCount: number;
  useCustom: boolean;
  customAmount: string;
  form: DonorForm;
  want80G: boolean;
  monthly: boolean;
  setMonthly: Dispatch<SetStateAction<boolean>>;
  wantsMahaPrasadam: boolean;
  mahaPrasadamEligible: boolean;
  addonsEligible: boolean;
  submitting: boolean;
  status: { type: "success" | "error"; message: string } | null;
  copiedField: string | null;
  bankDetails: {
    beneficiaryName: string;
    bankName: string;
    accountNumber: string;
    ifsc: string;
  };
  email: string;
  finalAmount: number;
  setSqftCount: (n: number) => void;
  setUseCustom: (v: boolean) => void;
  setCustomAmount: (v: string) => void;
  setForm: Dispatch<SetStateAction<DonorForm>>;
  setWant80G: (v: boolean) => void;
  setWantsMahaPrasadam: (v: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCopy: (field: string, value: string) => void;
  config: CampaignConfig;
  /** Limited premium tier, when the campaign has one (Brick Seva). */
  goldenTier?: GoldenTierConfig;
  tier: "standard" | "golden";
  onTierChange: (t: "standard" | "golden") => void;
  /** Unit wording for the ACTIVE tier — "brick" or "golden brick". */
  unitName: string;
  unitNamePlural: string;
}

const inputWrapClass = "relative";
const iconClass = "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-400";
const inputClass = "vk-input pl-10";
const labelClass = "mb-1.5 block text-[13px] font-semibold text-ink/80";
const addonBoxClass = "rounded-xl border border-vk-100 bg-vk-50/60 px-3.5 py-3";
const checkLabelClass = "flex cursor-pointer items-start gap-2.5 text-[13px] font-medium text-ink";
const checkboxClass = "mt-0.5 h-4 w-4 shrink-0 accent-vk-700";

// Preset quantities: row 1 = small (1–4), row 2 = bulk (11, 21, 51, 108).
const UNIT_PRESETS = [1, 2, 3, 4, 11, 21, 51, 108];

export default function DonationFormSection({
  price,
  minCustomAmount,
  sqftCount,
  useCustom,
  customAmount,
  form,
  want80G,
  monthly,
  setMonthly,
  wantsMahaPrasadam,
  mahaPrasadamEligible,
  addonsEligible,
  submitting,
  status,
  copiedField,
  bankDetails,
  email,
  finalAmount,
  setSqftCount,
  setUseCustom,
  setCustomAmount,
  setForm,
  setWant80G,
  setWantsMahaPrasadam,
  handleSubmit,
  handleCopy,
  config,
  goldenTier,
  tier,
  onTierChange,
  unitName,
  unitNamePlural,
}: DonationFormSectionProps) {
  const isGolden = tier === "golden" && Boolean(goldenTier);
  // Golden bricks are offered in ones and small multiples, not in 108s.
  const presets = isGolden && goldenTier ? goldenTier.presets : UNIT_PRESETS;
  // Brick campaigns only: the "your name goes on the brick" panel beside the
  // form (below it on mobile). Same laser machine as the golden tier — regular
  // bricks get the engraving; golden bricks get the engraving plus gilding.
  const engravingImage = config.engravingImage;
  const showEngravingPanel = Boolean(engravingImage);
  const goldenRemaining = goldenTier ? Math.max(0, goldenTier.total - goldenTier.taken) : 0;
  // Raw text for the "Other <unit>" quantity input — kept separate from
  // sqftCount so partially-typed values (e.g. "1" while typing "12") aren't
  // clobbered by preset matching.
  const [customSqftText, setCustomSqftText] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const lastPin = useRef("");

  // Donor pre-fill: logged-in profile auto-fills name/email/mobile; a
  // returning donor's phone lookup fills the same fields after they type
  // their 10-digit number. PAN/address are filled only when 80G/prasadam
  // are selected.
  const { lookupHint, handle80GToggle, handlePrasadamToggle } = useDonorPrefill({
    form,
    setForm,
    onMahaPrasadamSelect: (saved) => {
      setForm((prev) => {
        const blank = !prev.addressLine && !prev.city && !prev.state && !prev.pincode;
        return blank
          ? ({
              ...prev,
              addressLine: (saved.street || "").trim(),
              city: saved.city,
              state: saved.state,
              pincode: saved.pincode,
            })
          : prev;
      });
    },
  });

  // Auto-fill city & state from a 6-digit PIN code (India Post public API).
  useEffect(() => {
    const pin = form.pincode.trim();
    if (!/^\d{6}$/.test(pin)) {
      lastPin.current = "";
      return;
    }
    if (lastPin.current === pin) return;
    lastPin.current = pin;

    let cancelled = false;
    setPinLoading(true);
    setPinError(null);
    fetch(`https://api.postalpincode.in/pincode/${pin}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const rec = Array.isArray(data) ? data[0] : null;
        const po = rec?.Status === "Success" ? rec?.PostOffice?.[0] : null;
        if (po) {
          setForm((prev) => ({
            ...prev,
            city: po.District || po.Block || po.Name || prev.city,
            state: po.State || prev.state,
          }));
        } else {
          setPinError("Couldn't find that PIN code — please enter city & state manually.");
        }
      })
      .catch(() => {
        if (!cancelled) setPinError("Couldn't look up PIN code — please enter city & state manually.");
      })
      .finally(() => {
        if (!cancelled) setPinLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // Only re-run when the PIN code itself changes.
  }, [form.pincode]);

  const isCustomSqft = !useCustom && customSqftText !== "";

  const selectPreset = (n: number) => {
    setUseCustom(false);
    setCustomSqftText("");
    setSqftCount(n);
  };

  return (
    <section id="donate" className="vk-section scroll-mt-24 bg-white">
      <div className="vk-container">
        <SectionHeading
          align="center"
          eyebrow="Temple Construction Campaign"
          title={config.formHeading}
          subtitle={config.formSubheading}
        />

        {/* Two-column on desktop (form + engraving panel); stacked on mobile
            with the panel below the form. */}
        <div className={`mx-auto grid gap-6 ${showEngravingPanel ? "max-w-6xl xl:grid-cols-[minmax(0,1fr)_300px]" : "max-w-4xl"} xl:items-stretch`}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="vk-card mx-auto w-full max-w-4xl overflow-hidden !rounded-3xl"
        >
          {/* Amount summary strip */}
          <div className="flex items-center justify-between gap-3 bg-gradient-to-br from-vk-700 via-vk-600 to-vk-500 px-5 py-4 text-white sm:px-7">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
                {isGolden ? "Golden Brick Seva" : "You’re offering"}
              </p>
              <p className="text-lg font-bold text-white">
                {useCustom ? "Custom offering" : `${sqftCount} ${sqftCount === 1 ? unitName : unitNamePlural}`}
              </p>
            </div>
            <p className="shrink-0 font-heading text-2xl font-extrabold text-[hsl(var(--gold))] sm:text-3xl">
              ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "0"}
              {monthly && <span className="text-base font-bold">/mo</span>}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6 p-4 sm:p-6 lg:grid-cols-2 lg:gap-8">
            {/* Left: amount selection */}
            <div className="space-y-3">
              {/* Tier switch — only on campaigns with a limited premium tier.
                  Switching resets the quantity in the parent, so a "108
                  bricks" selection can never carry into the ₹11,000 tier. */}
              {goldenTier && (
                <div>
                  <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-vk-700">
                    Choose Your Seva
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onTierChange("standard")}
                      aria-pressed={!isGolden}
                      className={`min-h-[52px] rounded-xl border px-3 py-2.5 text-left transition-all ${
                        !isGolden
                          ? "border-vk-500 bg-vk-50 ring-2 ring-vk-500/20"
                          : "border-vk-200 bg-white hover:border-vk-400"
                      }`}
                    >
                      <span className="block text-[13px] font-semibold text-ink">
                        {config.pageTitle}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-muted-foreground">
                        ₹{config.pricePerUnit.toLocaleString("en-IN")} per {config.unitName}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onTierChange("golden")}
                      aria-pressed={isGolden}
                      className={`relative min-h-[52px] overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-all ${
                        isGolden
                          ? "border-vk-500 bg-vk-50 ring-2 ring-vk-500/20"
                          : "border-vk-200 bg-white hover:border-vk-400"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Crown className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--gold-deep))]" />
                        <span className="block text-[13px] font-semibold text-ink">
                          {goldenTier.sevaName.replace(" Seva", "")}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-[11px] text-muted-foreground">
                        ₹{goldenTier.price.toLocaleString("en-IN")} · {goldenRemaining} of{" "}
                        {goldenTier.total} left
                      </span>
                    </button>
                  </div>

                  {isGolden && (
                    <p className="mt-2 rounded-xl bg-vk-50 px-3.5 py-2 text-[11px] leading-relaxed text-muted-foreground">
                      <span className="font-semibold text-vk-700">Garbhagudi placement.</span> Your
                      name is laser-engraved on one of only {goldenTier.total} gilded bricks, laid
                      in the sanctum sanctorum.
                    </p>
                  )}
                </div>
              )}

              <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-vk-700">
                Choose Amount
              </p>
              <div className="grid grid-cols-4 gap-2">
                {presets.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => selectPreset(n)}
                    className={`min-h-[52px] rounded-xl border px-1.5 py-2 text-center transition-all ${
                      !useCustom && !isCustomSqft && sqftCount === n
                        ? "border-vk-500 bg-vk-50 ring-2 ring-vk-500/20"
                        : "border-vk-200 bg-white hover:border-vk-400"
                    }`}
                  >
                    <span className="block font-heading text-base font-extrabold text-ink sm:text-lg">{n}</span>
                    <span className="block truncate text-[10px] uppercase tracking-wide text-muted-foreground">
                      {n === 1 ? unitName : unitNamePlural}
                    </span>
                    <span className="mt-0.5 block text-[11px] font-bold text-vk-700">
                      ₹{(n * price).toLocaleString("en-IN")}
                    </span>
                  </button>
                ))}
              </div>

              {/* Other quantity — type any number of units */}
              <div
                className={`flex h-11 items-center gap-2 rounded-xl border px-3.5 transition-all ${
                  isCustomSqft ? "border-vk-500 bg-vk-50 ring-2 ring-vk-500/20" : "border-dashed border-vk-200 bg-white focus-within:border-vk-500"
                }`}
              >
                <label htmlFor="custom-sqft" className="shrink-0 text-xs font-semibold text-vk-700">
                  Other {isGolden ? "bricks" : config.unitShort}
                </label>
                <input
                  id="custom-sqft"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={100000}
                  placeholder={`Enter number of ${unitNamePlural}`}
                  value={customSqftText}
                  onFocus={() => setUseCustom(false)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^\d]/g, "");
                    setCustomSqftText(raw);
                    setUseCustom(false);
                    setSqftCount(raw === "" ? 0 : Math.max(1, Math.min(100000, Number(raw))));
                  }}
                  className="h-full w-full min-w-0 bg-transparent text-[15px] font-semibold text-foreground outline-none placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground/60"
                />
                {isCustomSqft && sqftCount > 0 && (
                  <span className="shrink-0 text-xs font-bold text-vk-700">
                    ₹{(sqftCount * price).toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {/* Other rupee amount */}
              <div
                className={`flex h-11 items-center gap-2 rounded-xl border px-3.5 transition-all ${
                  useCustom ? "border-vk-500 bg-vk-50 ring-2 ring-vk-500/20" : "border-dashed border-vk-200 bg-white focus-within:border-vk-500"
                }`}
              >
                <label htmlFor="custom-amount" className="shrink-0 text-xs font-semibold text-vk-700">
                  Other amount
                </label>
                <span className="text-sm font-semibold text-vk-700">₹</span>
                <input
                  id="custom-amount"
                  type="number"
                  min={minCustomAmount}
                  placeholder={`Min ₹${minCustomAmount}`}
                  value={customAmount}
                  onFocus={() => {
                    setUseCustom(true);
                    setCustomSqftText("");
                  }}
                  onChange={(e) => {
                    setUseCustom(true);
                    setCustomSqftText("");
                    setCustomAmount(e.target.value);
                  }}
                  className="h-full w-full min-w-0 bg-transparent text-[15px] font-semibold text-foreground outline-none placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground/60"
                />
              </div>

              {/* Bank transfer — tucked under amount selection since it's an alternative to the form on the right */}
              <details className="group rounded-xl border border-vk-100 bg-vk-50/60 px-3.5 py-2.5">
                <summary className="flex min-h-[28px] cursor-pointer list-none items-center justify-between text-[13px] font-semibold text-ink">
                  Prefer a direct bank transfer?
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-vk-100 text-vk-700 transition-all group-open:rotate-180 group-open:bg-vk-700 group-open:text-white">
                    <ChevronDown className="h-3.5 w-3.5" />
                  </span>
                </summary>
                <div className="mt-2.5 space-y-1.5 rounded-xl bg-white p-3">
                  {(
                    [
                      ["Beneficiary", bankDetails.beneficiaryName],
                      ["Bank", bankDetails.bankName],
                      ["Account No.", bankDetails.accountNumber],
                      ["IFSC", bankDetails.ifsc],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-muted-foreground">{label}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(label, value)}
                        className="flex min-w-0 items-center gap-1.5 text-right font-semibold text-ink hover:text-vk-600"
                      >
                        <span className="break-all">{value}</span>
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
                    <a href={`mailto:${email}`} className="break-all font-semibold text-vk-600 hover:underline">
                      {email}
                    </a>
                    .
                  </p>
                </div>
              </details>
            </div>

            {/* Right: details, add-ons, submit */}
            <div className="flex flex-col space-y-3">
              <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-vk-700">
                Your Details
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="donor-name" className={labelClass}>
                    Full name
                  </label>
                  <div className={inputWrapClass}>
                    <User className={iconClass} />
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
                  <label htmlFor="donor-mobile" className={labelClass}>
                    Mobile number
                  </label>
                  <div className={inputWrapClass}>
                    <Phone className={iconClass} />
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
                <label htmlFor="donor-email" className={labelClass}>
                  Email address (optional)
                </label>
                <div className={inputWrapClass}>
                  <Mail className={iconClass} />
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
              {mahaPrasadamEligible && !monthly && (
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
                  {wantsMahaPrasadam && (
                    <div className="mt-2.5 space-y-2">
                      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-vk-500" />
                        Delivery address for your Maha Prasadam courier
                      </p>
                      <input
                        type="text"
                        required
                        value={form.addressLine}
                        onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
                        className="vk-input"
                        placeholder="Door / flat no. & area, street *"
                      />
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <div className="relative sm:col-span-1">
                          <input
                            type="text"
                            required
                            inputMode="numeric"
                            maxLength={6}
                            value={form.pincode}
                            onChange={(e) =>
                              setForm({ ...form, pincode: e.target.value.replace(/[^\d]/g, "").slice(0, 6) })
                            }
                            className="vk-input pr-8"
                            placeholder="PIN code *"
                          />
                          {pinLoading && (
                            <Loader2 className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-vk-500" />
                          )}
                        </div>
                        <input
                          type="text"
                          required
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          className="vk-input"
                          placeholder="City *"
                        />
                        <input
                          type="text"
                          required
                          value={form.state}
                          onChange={(e) => setForm({ ...form, state: e.target.value })}
                          className="vk-input"
                          placeholder="State *"
                        />
                      </div>
                      {pinError ? (
                        <p className="text-[11px] text-red-600">{pinError}</p>
                      ) : (
                        <p className="text-[11px] text-muted-foreground">
                          Enter your PIN code and we&apos;ll fill in city &amp; state automatically.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

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
                onClick={() => {
                  setMonthly((m) => {
                    const next = !m;
                    if (next) setWantsMahaPrasadam(false);
                    return next;
                  });
                }}
                className={`flex min-h-[52px] w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all ${
                  monthly ? "border-vk-500 bg-vk-50 ring-2 ring-vk-500/20" : "border-vk-200 bg-white hover:border-vk-400"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                    monthly ? "border-vk-700 bg-vk-700 text-white" : "border-vk-300 bg-white"
                  }`}
                >
                  {monthly && <Check className="h-3.5 w-3.5" />}
                </span>
                <span className="flex-1">
                  <span className="block text-[13px] font-semibold text-ink">🔁 Make it a monthly seva</span>
                  <span className="block text-[11px] leading-snug text-muted-foreground">
                    {monthly && finalAmount > 0
                      ? `Auto-pay ₹${finalAmount.toLocaleString("en-IN")}${!useCustom ? ` (${sqftCount} ${sqftCount === 1 ? unitName : unitNamePlural})` : ""} every month. Cancel anytime.`
                      : `Sponsor ${unitNamePlural} automatically every month.`}
                  </span>
                </span>
              </button>

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
                ) : monthly ? (
                  <>🔁 Donate ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "—"} / month</>
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
        </motion.div>

        {showEngravingPanel && engravingImage && (
          <EngravingPanel
            image={engravingImage}
            price={config.pricePerUnit}
            unitName={config.unitName}
            isGolden={isGolden}
          />
        )}
        </div>
      </div>
    </section>
  );
}

/**
 * Brick campaigns: shows the temple's laser engraving machine and tells the
 * donor their name goes on the actual brick — for the regular ₹1,500 seva it
 * IS the engraving; for the golden tier the same engraving is then gilded.
 * Sits beside the donation form on desktop, below it on mobile.
 */
function EngravingPanel({
  image,
  price,
  unitName,
  isGolden,
}: {
  image: string;
  price: number;
  unitName: string;
  isGolden: boolean;
}) {
  return (
    <aside className="vk-card mx-auto flex w-full max-w-md flex-col overflow-hidden !rounded-3xl xl:mx-0 xl:h-full">
      <div className="relative min-h-[200px] flex-1">
        <Image
          src={image}
          alt="The laser engraving machine at the temple that inscribes donor names onto the bricks"
          fill
          sizes="(min-width: 1280px) 300px, (min-width: 640px) 448px, 100vw"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-vk-900/60 via-transparent to-transparent" />
      </div>
      <div className="p-5">
        <p className="vk-pill-soft">
          {isGolden ? "Golden tier · engraving first" : "Included with every brick"}
        </p>
        <h3 className="mt-3 font-heading text-lg font-bold leading-snug text-ink">
          Your name, engraved on your {unitName}
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
          {isGolden
            ? "Golden bricks are laser-engraved the same way — your name cut into the brick itself before it is gilded and laid in the sanctum sanctorum."
            : `For every ₹${price.toLocaleString("en-IN")} ${unitName} you sponsor, your name is laser-engraved on that very brick before it is laid in the temple.`}
        </p>
        <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
          <PenLine className="mt-0.5 h-3.5 w-3.5 shrink-0 text-vk-500" />
          Engraved by laser at the temple — no paint, nothing that fades.
        </p>
      </div>
    </aside>
  );
}
