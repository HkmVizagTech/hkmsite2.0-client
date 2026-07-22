"use client";

import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import Ornament from "@/components/Ornament";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import TouchstoneCharitiesLogo from "@/assets/TouchstoneCharitiesLogo.png";
import HKMLogoBlack from "@/assets/HKMLogoBlack.jpg";
import { Utensils, Hospital, Users, Clock, Heart, TrendingUp, Target, X, CheckCircle2, Loader2 } from "lucide-react";

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

const stats = [
  { icon: Utensils, value: "3,000+", label: "Meals Served Daily" },
  { icon: Hospital, value: "2", label: "Government Hospitals" },
  { icon: Users, value: "10,95,000+", label: "Annual Beneficiaries" },
  { icon: Clock, value: "365", label: "Days a Year" },
];

const donationTiers = [
  { meals: "500 Meals", amount: "₹12,500", amountValue: 12500, popular: false },
  { meals: "400 Meals", amount: "₹10,000", amountValue: 10000, popular: true },
  { meals: "300 Meals", amount: "₹7,500", amountValue: 7500, popular: false },
  { meals: "200 Meals", amount: "₹5,000", amountValue: 5000, popular: false },
  { meals: "100 Meals", amount: "₹2,500", amountValue: 2500, popular: false },
];

const impactStories = [
  {
    quote: "When my mother was admitted at KGH, we couldn't afford both food and medicine. The Subhojanam meals were a blessing from God.",
    name: "Ramesh K.",
    role: "Patient Attendant, KGH Visakhapatnam",
  },
  {
    quote: "I've been volunteering with the programme for two years. Seeing the gratitude in people's eyes when they receive a warm meal is the most fulfilling experience.",
    name: "Priya S.",
    role: "Volunteer, Subhojanam Programme",
  },
  {
    quote: "The nutritious food helped my father recover faster. We are forever grateful to the Hare Krishna Movement for this noble service.",
    name: "Suresh M.",
    role: "Patient Family, GGH Kakinada",
  },
];

export default function SubhojanamPage() {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const inView1 = useInView(ref1, { once: true, margin: "-80px" });
  const inView2 = useInView(ref2, { once: true, margin: "-80px" });
  const inView3 = useInView(ref3, { once: true, margin: "-80px" });
  const inView4 = useInView(ref4, { once: true, margin: "-80px" });
  const inView5 = useInView(ref5, { once: true, margin: "-80px" });

  const [checkoutTier, setCheckoutTier] = useState<{ meals: string; amountValue: number } | null>(null);
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const closeCheckout = () => {
    if (!submitting) {
      setCheckoutTier(null);
      setStatus(null);
      setForm({ name: "", email: "", mobile: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    if (!checkoutTier) return;

    if (!form.name.trim() || !form.email.trim() || !form.mobile.trim()) {
      setStatus({ type: "error", message: "Please fill in your name, email, and phone number." });
      return;
    }

    setSubmitting(true);
    try {
      const orderRes = await fetch(`${apiBase()}/payments/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Subhojanam donations belong to Touchstone Charities, a
          // separate trust from the main HKM account -- this MUST use
          // its own Razorpay account so funds settle correctly.
          account: "touchstone",
          sourcePage: "/subhojanam",
          sevaName: "Subhojanam",
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          mobile: form.mobile.trim(),
          amount: checkoutTier.amountValue,
        }),
      });

      if (!orderRes.ok) {
        const body = await orderRes.json().catch(() => ({}));
        throw new Error(body.message || "Unable to create payment order. Please try again.");
      }
      const order = await orderRes.json();

      await loadRazorpay();
      const win = window as unknown as { Razorpay?: RazorpayConstructor };
      if (!win.Razorpay) throw new Error("Razorpay checkout is unavailable.");

      new win.Razorpay({
        key: order.key,
        amount: Math.round(checkoutTier.amountValue * 100),
        currency: "INR",
        name: "Touchstone Charities",
        description: `Subhojanam — ${checkoutTier.meals}`,
        order_id: order.orderId,
        prefill: { name: form.name, email: form.email, contact: form.mobile },
        notes: { sourcePage: "/subhojanam", sevaName: "Subhojanam" },
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
            setStatus({ type: "success", message: "Thank you! Your donation has been received. Hare Krishna 🙏" });
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
      <PageHero
        title="Subhojanam"
        subtitle="Free, hygienic, and nutritious meals for the underprivileged"
        breadcrumb="Subhojanam"
        backgroundImage="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677363792-1783677363601-462395264797134589073566144398536696847591n.jpg"
      />
      <section className="py-24 bg-background" ref={ref1}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView1 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <p className="text-gold text-sm tracking-[0.2em] uppercase mb-4 font-medium">The Programme</p>
            <Ornament className="mb-5" />
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Feeding Hope, One Meal at a Time
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Annadana is one of the greatest forms of charity. Our Subhojanam Programme focuses on 
                providing free, hygienic, and nutritious meals to underprivileged patients and their 
                attendants in government hospitals.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Many families choose to stay hungry just to save money for medicine and treatment costs 
                of their loved ones. Our programme ensures they don&apos;t have to make that difficult choice.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every meal we serve is prepared with love and devotion in hygienic kitchens, 
                following strict quality standards to ensure nutritious and wholesome food reaches 
                every beneficiary.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView1 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Image src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677363792-1783677363601-462395264797134589073566144398536696847591n.jpg" alt="Subhojanam food distribution" width={600} height={400} className="rounded-2xl shadow-elevated w-full" />
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-card" ref={ref2}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-gold text-sm tracking-[0.2em] uppercase mb-4 font-medium">Our Impact</p>
            <Ornament className="mb-5" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Numbers That Matter</h2>
          </motion.div>
          <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView2 ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="bg-background rounded-2xl p-6 border border-border text-center"
              >
                <s.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-1">{s.value}</div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView2 ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="bg-background rounded-2xl p-6 border border-border"
            >
              <Hospital className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-heading text-lg font-bold text-foreground mb-1">KGH Hospital</h3>
              <p className="text-muted-foreground text-sm mb-2">Visakhapatnam</p>
              <p className="text-primary font-bold">Up to 500 meals served daily</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView2 ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="bg-background rounded-2xl p-6 border border-border"
            >
              <Hospital className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-heading text-lg font-bold text-foreground mb-1">GGH Hospital</h3>
              <p className="text-muted-foreground text-sm mb-2">Kakinada</p>
              <p className="text-primary font-bold">Up to 500 meals served daily</p>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-background" ref={ref3}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView3 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-gold text-sm tracking-[0.2em] uppercase mb-4 font-medium">Stories of Impact</p>
            <Ornament className="mb-5" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Voices of Gratitude</h2>
          </motion.div>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            {impactStories.map((story, i) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView3 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="text-primary text-4xl font-heading mb-3">&quot;</div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">{story.quote}</p>
                <div>
                  <p className="font-heading font-semibold text-foreground">{story.name}</p>
                  <p className="text-xs text-muted-foreground">{story.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 bg-card" ref={ref4}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView4 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-gold text-sm tracking-[0.2em] uppercase mb-4 font-medium">Support Us</p>
            <Ornament className="mb-5" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your Contribution
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every rupee you donate goes directly towards providing nutritious meals. 
              Help us extend our reach to more beneficiaries and hospitals.
            </p>
          </motion.div>
          <div className="max-w-3xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {donationTiers.map((tier, i) => (
              <motion.div
                key={tier.meals}
                initial={{ opacity: 0, y: 20 }}
                animate={inView4 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className={`rounded-2xl p-6 border text-center ${
                  tier.popular
                    ? "bg-gradient-gold text-[hsl(220,60%,12%)] border-transparent shadow-gold"
                    : "bg-background border-border"
                }`}
              >
                {tier.popular && (
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80">Most Popular</span>
                )}
                <div className={`font-heading text-2xl font-bold mt-2 mb-1 ${tier.popular ? "" : "text-foreground"}`}>
                  {tier.amount}
                </div>
                <p className={`text-sm mb-4 ${tier.popular ? "opacity-80" : "text-muted-foreground"}`}>
                  for {tier.meals}
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCheckoutTier({ meals: tier.meals, amountValue: tier.amountValue })}
                  className={`w-full py-2.5 rounded-full font-semibold text-sm transition-opacity hover:opacity-90 ${
                    tier.popular
                      ? "bg-[hsl(220,60%,12%)] text-[hsl(var(--gold))]"
                      : "bg-gradient-gold text-[hsl(220,60%,12%)]"
                  }`}
                >
                  Donate
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Transparency — Touchstone Charities attribution */}
      <section className="border-y border-border bg-card py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <div className="flex flex-wrap items-center justify-center gap-8">
              <Image
                src={TouchstoneCharitiesLogo}
                alt="Touchstone Charities"
                width={220}
                height={220}
                className="h-20 w-auto object-contain"
              />
              <span className="hidden h-14 w-px bg-border sm:block" aria-hidden />
              <Image
                src={HKMLogoBlack}
                alt="Srila Prabhupada's Hare Krishna Movement Visakhapatnam"
                width={300}
                height={162}
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Subhojanam is run under <span className="font-semibold text-foreground">Touchstone Charities</span>,
              an initiative by <span className="font-semibold text-foreground">Hare Krishna Movement Visakhapatnam</span> —
              one of the trusts of Srila Prabhupada&apos;s ISKCON Gambheeram Visakhapatnam.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background" ref={ref5}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView5 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="grid grid-cols-3 gap-6 mb-12">
              {[
                { icon: Heart, title: "Donate", desc: "Sponsor meals for the needy" },
                { icon: TrendingUp, title: "Volunteer", desc: "Join our serving team" },
                { icon: Target, title: "Spread the Word", desc: "Share our mission" },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView5 ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Shoulder the social responsibility of providing nutritious food to those battling health issues. 
              Your generosity will earn you their prayers of gratitude and bring immense happiness to you and your loved ones.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Touchstone Charities checkout modal */}
      {checkoutTier && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4"
          onClick={closeCheckout}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold">Sponsor {checkoutTier.meals}</h3>
              <button onClick={closeCheckout} aria-label="Close">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {status?.type === "success" ? (
              <div className="flex flex-col items-center py-6 text-center">
                <CheckCircle2 className="mb-3 h-12 w-12 text-green-500" />
                <p className="mb-6 text-sm text-muted-foreground">{status.message}</p>
                <button
                  onClick={closeCheckout}
                  className="rounded-full bg-gradient-gold px-6 py-2.5 text-sm font-bold text-[hsl(220,60%,12%)]"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="rounded-xl bg-[hsl(42,92%,56%,0.1)] p-3 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">You are donating</p>
                  <p className="font-heading text-2xl font-bold text-gold">
                    ₹{checkoutTier.amountValue.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-muted-foreground">to Touchstone Charities · Subhojanam</p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={form.mobile}
                    onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    placeholder="10-digit mobile number"
                  />
                </div>

                {status?.type === "error" && (
                  <p className="text-sm text-destructive">{status.message}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold py-3 text-sm font-bold text-[hsl(220,60%,12%)] disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {submitting ? "Processing..." : `Donate ₹${checkoutTier.amountValue.toLocaleString("en-IN")} Now`}
                </button>
                <p className="text-center text-xs text-muted-foreground">
                  Payment goes to Touchstone Charities, an initiative by Hare Krishna Movement Visakhapatnam.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
