"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Loader2, User, Phone, Mail, Check, Copy, ChevronDown } from "lucide-react";
import Ornament from "@/components/Ornament";
import type { CampaignConfig } from "@/lib/campaignConfig";

interface DonationFormSectionProps {
  price: number;
  minCustomAmount: number;
  sqftCount: number;
  useCustom: boolean;
  customAmount: string;
  form: { name: string; email: string; mobile: string; panNumber: string; address: string };
  want80G: boolean;
  wantsMahaPrasadam: boolean;
  mahaPrasadamEligible: boolean;
  mahaPrasadamMinAmount: number;
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
  setForm: (f: { name: string; email: string; mobile: string; panNumber: string; address: string }) => void;
  setWant80G: (v: boolean) => void;
  setWantsMahaPrasadam: (v: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCopy: (field: string, value: string) => void;
  config: CampaignConfig;
}

const inputWrapClass =
  "relative flex items-center rounded-lg border border-border bg-card focus-within:border-gold transition-colors";
const inputClass =
  "h-10 w-full bg-transparent pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground";
const labelClass = "mb-1 block text-[11px] font-medium text-muted-foreground";
const addonBoxClass = "rounded-lg border border-border bg-background/60 px-3 py-2";

export default function DonationFormSection({
  price,
  minCustomAmount,
  sqftCount,
  useCustom,
  customAmount,
  form,
  want80G,
  wantsMahaPrasadam,
  mahaPrasadamEligible,
  mahaPrasadamMinAmount,
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
}: DonationFormSectionProps) {
  return (
    <section id="donate" className="scroll-mt-24 bg-background py-10 md:py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <Ornament className="mb-4" />
        <div className="mb-6 text-center">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Temple Construction Campaign
          </p>
          <h2 className="mb-2 font-heading text-2xl font-bold text-primary md:text-3xl">
            {config.formHeading}
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground">
            {config.formSubheading}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-[28px] border border-border bg-card shadow-elevated"
        >
          {/* Amount summary strip */}
          <div className="flex items-center justify-between gap-3 bg-gradient-gold px-6 py-4 sm:px-8">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(220,90%,12%)]/70">
                You&apos;re offering
              </p>
              <p className="text-lg font-extrabold text-[hsl(220,90%,12%)] sm:text-xl">
                {useCustom ? "Custom offering" : `${sqftCount} ${sqftCount === 1 ? config.unitName : config.unitNamePlural}`}
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
                Choose Amount
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      setUseCustom(false);
                      setSqftCount(n);
                    }}
                    className={`rounded-lg border px-3 py-2.5 text-center transition-colors ${
                      !useCustom && sqftCount === n
                        ? "border-gold bg-gold/10"
                        : "border-border bg-card hover:border-gold/60"
                    }`}
                  >
                    <span className="block text-lg font-bold text-primary">{n}</span>
                    <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                      {n === 1 ? config.unitName : config.unitNamePlural}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-gold">
                      ₹{(n * price).toLocaleString("en-IN")}
                    </span>
                  </button>
                ))}
              </div>

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
                  min={minCustomAmount}
                  placeholder={`Min ${minCustomAmount}`}
                  value={customAmount}
                  onFocus={() => setUseCustom(true)}
                  onChange={(e) => {
                    setUseCustom(true);
                    setCustomAmount(e.target.value);
                  }}
                  className="h-10 w-full min-w-0 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground"
                />
              </div>

              {/* Bank transfer — tucked under amount selection since it's an alternative to the form on the right */}
              <details className="group rounded-lg border border-border bg-background/60 px-3 py-2">
                <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold text-foreground">
                  Prefer a direct bank transfer?
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-2.5 space-y-1.5">
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
                    <a href={`mailto:${email}`} className="font-semibold text-gold">
                      {email}
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
                  <label htmlFor="donor-name" className={labelClass}>
                    Full name
                  </label>
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
                  <label htmlFor="donor-mobile" className={labelClass}>
                    Mobile number
                  </label>
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
                <label htmlFor="donor-email" className={labelClass}>
                  Email address
                </label>
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

              {/* Maha Prasadam */}
              {mahaPrasadamEligible && (
                <div className={addonBoxClass}>
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-foreground">
                    <input
                      type="checkbox"
                      checked={wantsMahaPrasadam}
                      onChange={(e) => setWantsMahaPrasadam(e.target.checked)}
                      className="h-3.5 w-3.5 shrink-0 accent-[hsl(42,92%,46%)]"
                    />
                    🙏 I&apos;d like Maha Prasadam delivered
                  </label>
                  {wantsMahaPrasadam && (
                    <textarea
                      required
                      rows={2}
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2 text-xs outline-none focus:border-gold"
                      placeholder="Delivery address — house/flat no., street, city, state, PIN"
                    />
                  )}
                </div>
              )}

              {/* 80G */}
              <div className={addonBoxClass}>
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
  );
}
