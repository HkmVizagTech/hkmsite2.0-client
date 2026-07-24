"use client";

import { useState, useEffect, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { newEventId, getMetaBrowserData, trackPurchase } from "@/lib/metaPixel";
import { motion } from "framer-motion";
import {
  ChevronRight, CheckCircle2, Loader2, ShieldCheck,
  ChevronDown, Copy, Check, Building2, UtensilsCrossed, FileCheck2, Landmark, Sparkles,
} from "lucide-react";
import { getSevaBySlug, sevas, getSevaHref } from "@/lib/sevaConfig";
import Ornament from "@/components/Ornament";
import PageLayout from "@/components/PageLayout";
import AddressForm from "@/components/AddressForm";
import type { PrasadamAddress } from "@/components/AddressForm";

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

interface Donor {
  name: string;
  amount: number;
  time: string;
}

// Shown on every seva page — matches the Square Foot Seva campaign privileges.
const SEVA_PRIVILEGES = [
  { icon: UtensilsCrossed, title: "Sanctified Prasadam", text: "Receive the Lord's prasadam as a blessing for your seva (within India)." },
  { icon: Sparkles, title: "Deity Blessings", text: "Your name is included in the sankalpa offered to Their Lordships." },
  { icon: FileCheck2, title: "Email Receipt", text: "An instant receipt for every donation, the moment payment succeeds." },
  { icon: Landmark, title: "80G Tax Exemption", text: "Donations qualify for exemption under Section 80G of the Income Tax Act." },
];

const BANK_DETAILS = {
  beneficiaryName: "HARE KRISHNA MOVEMENT INDIA",
  bankName: "IDFC FIRST BANK LTD",
  accountNumber: "10091415313",
  ifsc: "IDFB0080412",
};

const FAQS = [
  {
    q: "Will I receive a donation receipt?",
    a: "Yes. An email receipt is sent automatically the moment your payment is confirmed. If you request an 80G certificate during checkout, that follows separately once your PAN is verified.",
  },
  {
    q: "Is this donation eligible for tax exemption?",
    a: "Yes, donations to Hare Krishna Movement Visakhapatnam qualify for tax exemption under Section 80G of the Income Tax Act. Check the '80G receipt' box during checkout and provide your PAN.",
  },
  {
    q: "Is it safe to donate online here?",
    a: "Yes. All payments are processed through Razorpay, a PCI-DSS-compliant payment gateway used by thousands of Indian organizations. We never see or store your card details.",
  },
  {
    q: "Can I donate via bank transfer instead of card/UPI?",
    a: "Yes — see the bank transfer details below. Please email us your transaction reference and PAN (if you need an 80G receipt) after transferring.",
  },
  {
    q: "Can I donate from outside India?",
    a: "Yes, international cards are accepted through the same checkout. For large international transfers, please contact us directly for wire transfer details.",
  },
];

export default function DonateSevaPage({ params }: { params: Promise<{ seva: string }> }) {
  const { seva: slug } = use(params);
  const seva = getSevaBySlug(slug);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tierIndex, setTierIndex] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", mobile: "", panNumber: "" });
  const [want80G, setWant80G] = useState(false);
  const [wantsMahaPrasadam, setWantsMahaPrasadam] = useState(false);
  const [address, setAddress] = useState<PrasadamAddress>({ street: "", city: "", state: "", pincode: "", country: "India" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [donors, setDonors] = useState<Donor[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const form = document.getElementById("donation-form");
    if (!form) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!seva) return;
    const amountParam = searchParams.get("amount");
    if (amountParam) {
      const idx = seva.tiers.findIndex((t) => t.amount === Number(amountParam));
      if (idx >= 0) setTierIndex(idx);
      else {
        setUseCustom(true);
        setCustomAmount(amountParam);
      }
    }
  }, [seva, searchParams]);

  useEffect(() => {
    if (!seva) return;
    (async () => {
      try {
        const res = await fetch(
          `${apiBase()}/seva-stats?sevaName=${encodeURIComponent(seva.title)}&category=${encodeURIComponent(seva.category)}&limit=10`
        );
        if (res.ok) {
          const data = await res.json();
          setDonors(data.donors || []);
        }
      } catch {}
    })();
  }, [seva]);

  if (!seva) {
    notFound();
  }
  if (seva.externalHref) {
    redirect(seva.externalHref);
  }

  const finalAmount = useCustom ? Number(customAmount) || 0 : seva.tiers[tierIndex]?.amount || 0;

  useEffect(() => {
    if (finalAmount <= 999) {
      if (want80G) setWant80G(false);
      if (wantsMahaPrasadam) {
        setWantsMahaPrasadam(false);
        setAddress({ street: "", city: "", state: "", pincode: "", country: "India" });
      }
    }
  }, [finalAmount, want80G, wantsMahaPrasadam]);

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
      setStatus({ type: "error", message: "Please enter a valid amount." });
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
          account: seva.account,
          sourcePage: `/donate/${seva.slug}`,
          type: seva.category,
          sevaName: seva.title,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          mobile: form.mobile.trim(),
          amount: finalAmount,
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

      await loadRazorpay();
      const win = window as unknown as { Razorpay?: RazorpayConstructor };
      if (!win.Razorpay) throw new Error("Razorpay checkout is unavailable.");

      new win.Razorpay({
        key: order.key,
        amount: Math.round(finalAmount * 100),
        currency: "INR",
        name: "Hare Krishna Movement Vizag",
        description: seva.title,
        order_id: order.orderId,
        prefill: { name: form.name, email: form.email, contact: form.mobile },
        notes: { sourcePage: `/donate/${seva.slug}`, sevaName: seva.title, sevaType: seva.category },
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
            trackPurchase({ value: finalAmount, eventId: metaEventId, content_name: seva.title });
            router.push(`/payment/thank-you?type=donation&seva=${encodeURIComponent(seva.title)}&amount=${finalAmount}&source=${encodeURIComponent("our seva programmes")}`);
            setDonors((d) => [{ name: `${form.name.split(" ")[0]} ${form.name.split(" ").slice(-1)[0].charAt(0)}.`, amount: finalAmount, time: "just now" }, ...d]);
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

  const otherSevas = sevas.filter((s) => s.slug !== seva.slug);

  return (
    <PageLayout>
    <main className="bg-white">
      {/* Hero */}
      {seva.heroImageDesktop && seva.heroImageMobile ? (
        // Dedicated, fully-designed banner (title/CTA baked into the image
        // itself) — shown plain and clear, no dark overlay or duplicate
        // heading on top, since that would fight the banner's own text.
        <section className="relative overflow-hidden pt-20">
          <h1 className="sr-only">{seva.title}</h1>
          <nav className="flex items-center gap-1.5 bg-card px-4 py-2.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{seva.title}</span>
          </nav>
          <button
            onClick={() => document.getElementById("donation-form")?.scrollIntoView({ behavior: "smooth" })}
            className="block w-full text-left"
            aria-label={`Donate to ${seva.title}`}
          >
            <div className="relative hidden w-full md:block" style={{ aspectRatio: "1925 / 817" }}>
              <Image src={seva.heroImageDesktop} alt={seva.title} fill priority sizes="100vw" className="object-cover" />
            </div>
            <div className="relative w-full md:hidden" style={{ aspectRatio: "941 / 1672" }}>
              <Image src={seva.heroImageMobile} alt={seva.title} fill priority sizes="100vw" className="object-cover" />
            </div>
          </button>
        </section>
      ) : (
        <section className="relative overflow-hidden pt-20">
          <div className="relative aspect-[16/7] w-full md:aspect-[21/7]">
            <Image src={seva.image} alt={seva.title} fill priority sizes="100vw" className="object-cover" />
            {/* Lightened from the previous 35%/85% dark gradient so the
                banner photo itself reads clearly, while keeping just
                enough contrast for the white heading text at the bottom. */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(220,85%,10%,0.08)_0%,hsl(220,85%,8%,0.55)_100%)]" />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-10 text-center md:pb-14">
            <nav className="mb-4 flex items-center gap-1.5 text-xs text-background/70">
              <Link href="/" className="hover:text-background">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-background">{seva.title}</span>
            </nav>
            <span className="mb-3 text-3xl">{seva.icon}</span>
            <h1 className="mb-2 font-heading text-3xl font-bold text-background md:text-5xl">{seva.title}</h1>
            <p className="max-w-xl text-sm text-background/85 md:text-base">{seva.tagline}</p>
          </div>
        </section>
      )}

      <div className="container mx-auto grid gap-10 px-4 py-14 lg:grid-cols-[1fr_420px]">
        {/* Left column — description + supplementary content. order-2 on
            mobile so the payment form (right column) appears first, right
            after the hero, instead of requiring a long scroll past this. */}
        <div className="order-2 lg:order-1">
          <Ornament className="mb-5 !justify-start" />
          <h2 className="mb-4 font-heading text-2xl font-bold">About This Seva</h2>
          <p className="mb-8 leading-relaxed text-muted-foreground">{seva.description}</p>

          {/* Live Donor Wall — real data */}
          {donors.length > 0 && (
            <div className="mb-10">
              <div className="mb-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-green-600">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                  </span>
                  Live
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Recent Devotees Supporting This Seva
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {donors.map((d, i) => (
                  <motion.div
                    key={`${d.name}-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(42,92%,56%,0.15)] text-xs font-bold text-gold">
                      {d.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{d.name}</p>
                      <p className="text-[11px] text-muted-foreground">Donated ₹{d.amount.toLocaleString("en-IN")} · {d.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Other sevas */}
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Other Ways to Serve
          </h3>
          <div className="mb-12 flex flex-wrap gap-2">
            {otherSevas.map((s) => (
              <Link
                key={s.slug}
                href={getSevaHref(s)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
              >
                {s.icon} {s.shortTitle}
              </Link>
            ))}
          </div>

          {/* Bank transfer alternative */}
          <div className="mb-12 rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold">
              <Building2 className="h-5 w-5 text-primary" /> Prefer a Direct Bank Transfer?
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              You can also donate via NEFT/RTGS/UPI directly to our temple account. Please email us your
              transaction reference and PAN (if you need an 80G receipt) to <a href="mailto:social@hkmvizag.org" className="text-primary underline">social@hkmvizag.org</a>.
            </p>
            <div className="space-y-2 rounded-xl bg-muted/40 p-4 text-sm">
              {Object.entries({
                "Beneficiary Name": BANK_DETAILS.beneficiaryName,
                "Bank Name": BANK_DETAILS.bankName,
                "Account Number": BANK_DETAILS.accountNumber,
                "IFSC Code": BANK_DETAILS.ifsc,
              }).map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">{label}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(label, value)}
                    className="flex items-center gap-1.5 font-semibold text-foreground hover:text-primary"
                  >
                    {value}
                    {copiedField === label ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="mb-4 font-heading text-lg font-bold">Frequently Asked Questions</h3>
            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <div key={faq.q} className="overflow-hidden rounded-xl border border-border">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold"
                  >
                    {faq.q}
                    <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="border-t border-border px-4 py-3.5 text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: sticky donation form. order-1 on mobile so this (and the
            amount tiers below) appears right after the hero, not after the
            long description/donor-wall/FAQ content in the left column. */}
        <div id="donation-form" className="order-1 scroll-mt-24 lg:order-2 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-elevated">
            {status?.type === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-6 text-center"
              >
                <CheckCircle2 className="mb-3 h-12 w-12 text-green-500" />
                <h3 className="mb-2 font-heading text-lg font-bold">Thank You!</h3>
                <p className="mb-6 text-sm text-muted-foreground">{status.message}</p>
                <button
                  onClick={() => { setStatus(null); router.push("/"); }}
                  className="rounded-full bg-gradient-gold px-6 py-2.5 text-sm font-bold text-[hsl(220,60%,12%)]"
                >
                  Back to Home
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Choose an Amount
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {seva.tiers.map((tier, i) => (
                    <button
                      key={tier.label}
                      type="button"
                      onClick={() => { setTierIndex(i); setUseCustom(false); }}
                      className={`rounded-xl border-[1.5px] px-3 py-3 text-center text-sm font-semibold transition-all ${
                        !useCustom && tierIndex === i
                          ? "border-[hsl(var(--gold-deep))] bg-[hsl(42,92%,56%,0.12)] text-gold"
                          : "border-border hover:border-[hsl(var(--gold-deep))]"
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setUseCustom(true)}
                  className={`w-full rounded-xl border-[1.5px] px-3 py-3 text-sm font-semibold transition-all ${
                    useCustom ? "border-[hsl(var(--gold-deep))] bg-[hsl(42,92%,56%,0.12)] text-gold" : "border-border hover:border-[hsl(var(--gold-deep))]"
                  }`}
                >
                  Enter a custom amount
                </button>

                <div className="rounded-2xl bg-gradient-gold p-[2px] shadow-gold">
                  <div className="rounded-[calc(1rem-2px)] bg-card p-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">You are donating</p>
                    <p className="font-heading text-4xl font-extrabold text-gold drop-shadow-sm">
                      ₹{finalAmount ? finalAmount.toLocaleString("en-IN") : "0"}
                    </p>
                    <p className="text-xs font-semibold text-muted-foreground">{seva.title}</p>
                  </div>
                </div>

                {useCustom && (
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-muted-foreground">Amount (₹)</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                      placeholder="Enter amount"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">Full Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    placeholder="10-digit mobile number"
                  />
                </div>

                {finalAmount > 999 && (
                <>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={want80G}
                    onChange={(e) => setWant80G(e.target.checked)}
                    className="rounded"
                  />
                  I want an 80G tax exemption receipt
                </label>
                {want80G && (
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-muted-foreground">PAN Number</label>
                    <input
                      required
                      value={form.panNumber}
                      onChange={(e) => setForm({ ...form, panNumber: e.target.value.toUpperCase() })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm uppercase outline-none focus:border-primary"
                      placeholder="ABCDE1234F"
                      maxLength={10}
                    />
                  </div>
                )}
                </>
                )}

                {finalAmount > 999 && (
                  <div className="rounded-lg border border-border bg-background/60 px-3 py-2">
                    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
                      <input
                        type="checkbox"
                        checked={wantsMahaPrasadam}
                        onChange={(e) => setWantsMahaPrasadam(e.target.checked)}
                        className="h-4 w-4 shrink-0 rounded accent-[hsl(42,92%,46%)]"
                      />
                      🙏 I&apos;d like Maha Prasadam delivered
                    </label>
                    {wantsMahaPrasadam && <AddressForm address={address} setAddress={setAddress} />}
                  </div>
                )}

                {status?.type === "error" && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{status.message}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold py-3.5 text-[15px] font-bold text-[hsl(220,60%,12%)] shadow-gold transition-transform hover:scale-[1.02] disabled:opacity-60"
                >
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
                  ) : (
                    <>🪔 Donate ₹{finalAmount ? finalAmount.toLocaleString("en-IN") : "0"} Now</>
                  )}
                </button>
                <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" /> Secured by Razorpay
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Donor privileges — moved below the payment form */}
      <section className="border-t border-border bg-white">
        <div className="container mx-auto grid grid-cols-2 gap-4 px-4 py-8 lg:grid-cols-4">
          {SEVA_PRIVILEGES.map((p) => (
            <div key={p.title} className="flex items-start gap-3">
              <p.icon className="mt-0.5 h-6 w-6 shrink-0 text-gold" />
              <div>
                <p className="text-sm font-bold text-primary">{p.title}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sticky mobile donate bar — the form sits below the fold on phones */}
      {showSticky && (
      <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 pt-1 lg:hidden">
        <button
          onClick={() => document.getElementById("donation-form")?.scrollIntoView({ behavior: "smooth" })}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-gold px-5 py-2 text-xs font-bold text-[hsl(220,60%,12%)] shadow-gold"
        >
          🪔 Donate Now
        </button>
      </div>
      )}
    </main>
    </PageLayout>
  );
}
