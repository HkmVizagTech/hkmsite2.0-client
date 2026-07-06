"use client";

import { useState, useEffect, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { getSevaBySlug, sevas } from "@/lib/sevaConfig";
import Ornament from "@/components/Ornament";

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
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

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

  if (!seva) {
    notFound();
  }

  const finalAmount = useCustom ? Number(customAmount) || 0 : seva.tiers[tierIndex]?.amount || 0;

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

    setSubmitting(true);
    try {
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
            setStatus({
              type: "success",
              message: "Thank you! Your donation has been received. Hare Krishna 🙏",
            });
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
    <main className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative aspect-[16/7] w-full md:aspect-[21/7]">
          <Image src={seva.image} alt={seva.title} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(220,85%,10%,0.35)_0%,hsl(220,85%,8%,0.85)_100%)]" />
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

      <div className="container mx-auto grid gap-10 px-4 py-14 lg:grid-cols-[1fr_420px]">
        {/* Left: description + tiers */}
        <div>
          <Ornament className="mb-5 !justify-start" />
          <h2 className="mb-4 font-heading text-2xl font-bold">About This Seva</h2>
          <p className="mb-8 leading-relaxed text-muted-foreground">{seva.description}</p>

          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Choose an Amount
          </h3>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
            className={`mb-8 w-full rounded-xl border-[1.5px] px-3 py-3 text-sm font-semibold transition-all sm:w-auto ${
              useCustom ? "border-[hsl(var(--gold-deep))] bg-[hsl(42,92%,56%,0.12)] text-gold" : "border-border hover:border-[hsl(var(--gold-deep))]"
            }`}
          >
            Enter a custom amount
          </button>

          {/* Other sevas */}
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Other Ways to Serve
          </h3>
          <div className="flex flex-wrap gap-2">
            {otherSevas.map((s) => (
              <Link
                key={s.slug}
                href={`/donate/${s.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
              >
                {s.icon} {s.shortTitle}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: sticky donation form */}
        <div className="lg:sticky lg:top-24 lg:self-start">
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
                <div className="rounded-2xl bg-[hsl(42,92%,56%,0.1)] p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">You are donating</p>
                  <p className="font-heading text-3xl font-bold text-gold">
                    ₹{finalAmount ? finalAmount.toLocaleString("en-IN") : "0"}
                  </p>
                  <p className="text-xs text-muted-foreground">{seva.title}</p>
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
    </main>
  );
}
