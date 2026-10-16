"use client";

import PageLayout from "@/components/PageLayout";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import { useRazorpayPreload } from "@/lib/useRazorpayPreload";
import SectionHeading from "@/components/site/SectionHeading";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TouchstoneCharitiesLogo from "@/assets/TouchstoneCharitiesLogo.png";
import HKMLogoBlack from "@/assets/HKMLogoBlack.jpg";
import {
  Utensils, Hospital, Users, Clock, Heart, Phone, Mail,
  ChevronRight, ShieldCheck, X, CheckCircle2, Loader2, Quote, User
} from "lucide-react";
import { newEventId, getMetaBrowserData, trackInitiateCheckout, trackPurchase } from "@/lib/metaPixel";
import { useAttribution } from "@/lib/useAttribution";
import { useDonorPrefill } from "@/lib/donorPrefill";
import { prefillEmail } from "@/lib/razorpayPrefill";

type RazorpayConstructor = new (options: Record<string, unknown>) => { open: () => void };
const apiBase = () => (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/+$/, "");

const stats = [
  { icon: Utensils, value: "3,000+", label: "Meals Served Daily", sub: "Hot, nutritious, hygienic" },
  { icon: Hospital, value: "3", label: "Government Hospitals", sub: "KGH Vizag · GGH Kakinada · Homi Bhabha Visakhapatnam" },
  { icon: Users, value: "10,95,000+", label: "Annual Beneficiaries", sub: "Patients & attendants" },
  { icon: Clock, value: "365", label: "Days a Year", sub: "No holidays, no breaks" },
];

const donationTiers = [
  { meals: "500 Meals", amount: "₹12,500", amountValue: 12500, popular: false, icon: "🍱" },
  { meals: "400 Meals", amount: "₹10,000", amountValue: 10000, popular: true, icon: "⭐" },
  { meals: "300 Meals", amount: "₹7,500", amountValue: 7500, popular: false, icon: "🍱" },
  { meals: "200 Meals", amount: "₹5,000", amountValue: 5000, popular: false, icon: "🍱" },
  { meals: "100 Meals", amount: "₹2,500", amountValue: 2500, popular: false, icon: "🍱" },
];

const mealProcess = [
  { step: "01", title: "Kitchen Preparation", desc: "Every morning, our trained cooks prepare fresh, hygienic meals in our dedicated kitchen following strict quality standards." },
  { step: "02", title: "Quality Check", desc: "Each batch is inspected for nutrition, hygiene and taste before it is packaged and prepared for distribution." },
  { step: "03", title: "Hospital Distribution", desc: "Volunteers carry the meals to KGH Visakhapatnam, GGH Kakinada and Homi Bhabha Cancer Hospital & Research Centre, Visakhapatnam, and distribute directly to patients and their families." },
  { step: "04", title: "Consistent Service", desc: "This cycle runs every single day of the year — 365 days, without exception, rain or shine." },
];

const testimonials = [
  {
    quote: "When my mother was admitted at KGH, we couldn't afford both food and medicine. The Subhojanam meals were a blessing from God.",
    name: "Ramesh K.",
    role: "Patient Attendant · KGH Visakhapatnam",
  },
  {
    quote: "I've been volunteering for two years. Seeing the gratitude in people's eyes when they receive a warm meal is the most fulfilling experience of my life.",
    name: "Priya S.",
    role: "Volunteer · Subhojanam Programme",
  },
  {
    quote: "The nutritious food helped my father recover faster. We are forever grateful to the Hare Krishna Movement for this noble service.",
    name: "Suresh M.",
    role: "Patient Family · GGH Kakinada",
  },
];

export default function SubhojanamPage() {
  const ref1 = useRef(null); const ref2 = useRef(null);
  const ref3 = useRef(null); const ref4 = useRef(null);
  const ref5 = useRef(null); const ref6 = useRef(null);
  const inView1 = useInView(ref1, { once: true, margin: "-80px" });
  const inView2 = useInView(ref2, { once: true, margin: "-80px" });
  const inView3 = useInView(ref3, { once: true, margin: "-80px" });
  const inView4 = useInView(ref4, { once: true, margin: "-80px" });
  const inView5 = useInView(ref5, { once: true, margin: "-80px" });
  const inView6 = useInView(ref6, { once: true, margin: "-80px" });

  const [checkoutTier, setCheckoutTier] = useState<{ meals: string; amountValue: number } | null>(null);
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const attribution = useAttribution("/subhojanam");
  const razorpayReady = useRazorpayPreload();

  // Donor pre-fill: logged-in profile auto-fills name/email/mobile; a
  // returning donor's phone lookup fills the same fields after they type
  // their 10-digit number.
  const { lookupHint, prefill } = useDonorPrefill({
    form,
    setForm,
  });

  const closeCheckout = () => {
    if (!submitting) {
      setCheckoutTier(null);
      setStatus(null);
      setForm(
        prefill
          ? { name: prefill.name, email: prefill.email, mobile: prefill.mobile }
          : { name: "", email: "", mobile: "" }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus(null);
    if (!checkoutTier) return;
    if (!form.name.trim()) {
      setStatus({ type: "error", message: "Please fill in your name and phone number." }); return;
    }
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) {
      setStatus({ type: "error", message: "Please enter a valid 10-digit mobile number." }); return;
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus({ type: "error", message: "Please enter a valid email address, or leave it blank." }); return;
    }
    setSubmitting(true);
    try {
      const metaEventId = newEventId();
      const metaBrowser = getMetaBrowserData();
      const orderRes = await fetch(`${apiBase()}/payments/order`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account: "touchstone", sourcePage: "/subhojanam", utm: attribution.payload().utm, sevaName: "Subhojanam", name: form.name.trim(), email: form.email.trim().toLowerCase(), mobile: form.mobile.trim(), amount: checkoutTier.amountValue, metaEventId, metaFbp: metaBrowser.fbp, metaFbc: metaBrowser.fbc }),
      });
      if (!orderRes.ok) { const body = await orderRes.json().catch(() => ({})); throw new Error(body.message || "Unable to create payment order."); }
      const order = await orderRes.json();
      await razorpayReady();
      const win = window as unknown as { Razorpay?: RazorpayConstructor };
      if (!win.Razorpay) throw new Error("Razorpay checkout is unavailable.");
      new win.Razorpay({
        key: order.key, amount: Math.round(checkoutTier.amountValue * 100), currency: "INR",
        name: "Touchstone Charities", description: `Subhojanam — ${checkoutTier.meals}`,
        order_id: order.orderId, prefill: { name: form.name, email: prefillEmail(form.email), contact: form.mobile },
        notes: { sourcePage: "/subhojanam", sevaName: "Subhojanam" },
        handler: async (response: Record<string, string>) => {
          try {
            const verifyRes = await fetch(`${apiBase()}/payments/verify`, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ donationId: order.donationId, razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature }),
            });
            if (!verifyRes.ok) throw new Error("Payment verification failed.");
            trackPurchase({ value: checkoutTier.amountValue, eventId: metaEventId, content_name: "Subhojanam" });
            window.location.assign(`/payment/thank-you?type=donation&seva=${encodeURIComponent("Subhojanam")}&amount=${checkoutTier.amountValue}&source=${encodeURIComponent("the Subhojanam meal programme")}`);
          } catch (err) { setStatus({ type: "error", message: err instanceof Error ? err.message : "Payment verification failed." }); }
          finally { setSubmitting(false); }
        },
        modal: { ondismiss: () => setSubmitting(false) }, theme: { color: "#D69E2E" },
      }).open();
    } catch (err) { setStatus({ type: "error", message: err instanceof Error ? err.message : "Something went wrong." }); setSubmitting(false); }
  };

  return (
    <PageLayout>
      <WhatsAppFloatButton />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-vk-50 to-white pt-[var(--header-h)]">
        <div>
          <div className="relative isolate overflow-hidden bg-vk-900">
            <Image
              src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677363792-1783677363601-462395264797134589073566144398536696847591n.jpg"
              alt="Subhojanam meal distribution at hospital"
              fill priority sizes="(min-width: 1280px) 1248px, 100vw"
              className="-z-10 object-cover object-center"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-vk-900/95 via-vk-900/65 to-vk-900/25" />
            <div className="flex min-h-[520px] flex-col justify-end px-5 pb-10 pt-8 md:min-h-[600px] md:px-12 md:pb-14">
              <div className="mb-auto flex flex-wrap items-center justify-between gap-3 pb-10">
                <nav aria-label="Breadcrumb" className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white/85 backdrop-blur md:text-[13px]">
                  <Link href="/" className="hover:text-white">Home</Link>
                  <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                  <span className="text-white" aria-current="page">Subhojanam</span>
                </nav>
                {/* Trust badge */}
                <span className="vk-pill-light !normal-case !tracking-normal">
                  <ShieldCheck className="h-4 w-4 text-[hsl(var(--gold))]" />
                  Under Touchstone Charities
                </span>
              </div>
              <div className="max-w-3xl">
                <span className="vk-pill-light mb-4">Free Hospital Meal Programme</span>
                <h1 className="vk-h1 mb-5 !text-white">
                  No patient should<br />choose between<br />
                  <span className="text-vk-300">food and medicine.</span>
                </h1>
                <p className="mb-7 max-w-lg text-[15px] leading-relaxed text-white/80 md:text-base">
                  Subhojanam provides free, hygienic, and nutritious meals every day to patients
                  and their attendants at government hospitals in Visakhapatnam, Kakinada and at the
                  Homi Bhabha Cancer Hospital &amp; Research Centre, Visakhapatnam.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => document.getElementById("donate-section")?.scrollIntoView({ behavior: "smooth" })}
                    className="vk-btn-gold h-12 px-7 text-[15px] font-bold"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                    Sponsor a Meal
                  </button>
                  <button
                    onClick={() => document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })}
                    className="vk-btn-ghost-light h-12 px-7"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-3 md:mt-5 md:grid-cols-4 md:gap-4">
            {stats.map((s) => (
              <div key={s.label} className="vk-card flex flex-col items-center p-4 text-center md:p-5">
                <span className="vk-icon-chip mb-2.5">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="font-heading text-2xl font-extrabold text-vk-700 md:text-3xl">{s.value}</span>
                <span className="mt-0.5 text-[13px] font-semibold text-ink">{s.label}</span>
                <span className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT THE PROGRAMME ──────────────────────────────────── */}
      <section id="about-section" className="vk-section scroll-mt-[var(--header-h)]" ref={ref1}>
        <div className="vk-container">
          <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2 md:gap-14">
            <motion.div
              initial={{ opacity: 0, x: -30 }} animate={inView1 ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }}
            >
              <span className="vk-pill mb-3">The Programme</span>
              <h2 className="vk-h2 mb-5">Feeding Hope, One Meal at a Time</h2>
              <p className="vk-lead mb-4">
                Annadana is one of the greatest forms of charity. Our Subhojanam Programme provides free, hygienic,
                and nutritious meals to underprivileged patients and their attendants in government hospitals.
              </p>
              <p className="vk-lead mb-6">
                Many families stay hungry to save money for medicine. Our programme ensures they never have
                to make that impossible choice. Every meal is prepared with love in hygienic kitchens following
                strict quality standards, and served with devotion.
              </p>
              <div className="flex flex-col gap-3">
                <div className="vk-card flex items-center gap-3 p-4">
                  <span className="vk-icon-chip"><Hospital className="h-5 w-5" /></span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">KGH Hospital, Visakhapatnam</p>
                    <p className="text-xs text-muted-foreground">1,700+ meals served daily</p>
                  </div>
                </div>
                <div className="vk-card flex items-center gap-3 p-4">
                  <span className="vk-icon-chip"><Hospital className="h-5 w-5" /></span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">GGH Hospital, Kakinada</p>
                    <p className="text-xs text-muted-foreground">Up to 500 meals served daily</p>
                  </div>
                </div>
                <div className="vk-card flex items-center gap-3 p-4">
                  <span className="vk-icon-chip"><Hospital className="h-5 w-5" /></span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">Homi Bhabha Cancer Hospital &amp; Research Centre, Visakhapatnam</p>
                    <p className="text-xs text-muted-foreground">Tata Memorial Centre · Up to 500 meals served daily</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -30 }} animate={inView1 ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-2 -rotate-1 rounded-3xl bg-gradient-to-br from-vk-100 to-vk-50 md:-inset-4" />
              <Image
                src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677363792-1783677363601-462395264797134589073566144398536696847591n.jpg"
                alt="Volunteers serving meals at hospital" width={600} height={440}
                className="relative w-full rounded-3xl object-cover shadow-lift"
              />
              <div className="absolute -bottom-4 right-3 rounded-2xl bg-vk-700 px-5 py-4 text-center text-white shadow-lift md:-right-4">
                <p className="font-heading text-3xl font-extrabold">365</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Days a Year</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="vk-section vk-band" ref={ref2}>
        <div className="vk-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={inView2 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          >
            <SectionHeading align="center" eyebrow="Our Process" title="From Kitchen to Patient" />
          </motion.div>
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
            {mealProcess.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 30 }} animate={inView2 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.15 * i }}
                className="vk-card relative overflow-hidden p-6"
              >
                <span className="absolute right-5 top-4 select-none font-heading text-5xl font-extrabold text-vk-100">{p.step}</span>
                <span className="vk-pill-soft relative mb-4">{p.step}</span>
                <h3 className="relative mb-2 text-base font-bold text-ink">{p.title}</h3>
                <p className="relative text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="vk-section" ref={ref3}>
        <div className="vk-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={inView3 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          >
            <SectionHeading align="center" eyebrow="Real Stories" title="Voices of Gratitude" />
          </motion.div>
          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3 md:gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }} animate={inView3 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                className="vk-card flex flex-col gap-4 p-6"
              >
                <span className="vk-icon-chip"><Quote className="h-5 w-5" /></span>
                <p className="flex-1 font-serif-display text-[15px] italic leading-relaxed text-ink/80">{t.quote}</p>
                <div className="border-t border-vk-100 pt-4">
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DONATE ───────────────────────────────────────────────── */}
      <section id="donate-section" className="vk-section vk-band scroll-mt-[var(--header-h)]" ref={ref4}>
        <div className="vk-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={inView4 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          >
            <SectionHeading
              align="center"
              eyebrow="Support Us"
              title="Choose Your Contribution"
              subtitle="Every rupee you donate goes directly to providing nutritious meals for patients and their families. ₹25 sponsors one meal. Your generosity saves families from impossible choices."
            />
          </motion.div>
          <div className="mx-auto grid max-w-5xl gap-3 lg:grid-cols-5 lg:gap-4">
            {donationTiers.map((tier, i) => (
              <motion.button
                key={tier.meals}
                onClick={() => { setCheckoutTier({ meals: tier.meals, amountValue: tier.amountValue }); trackInitiateCheckout({ value: tier.amountValue, content_name: "Subhojanam" }); }}
                initial={{ opacity: 0, y: 20 }} animate={inView4 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 * i }}
                whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                className={`relative flex min-h-[52px] items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all lg:flex-col lg:items-start lg:rounded-2xl lg:p-5 ${
                  tier.popular
                    ? "border-vk-500 bg-vk-50 ring-2 ring-vk-500/20"
                    : "border-vk-200 bg-white hover:border-vk-400"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-2.5 left-4 whitespace-nowrap rounded-full bg-[hsl(var(--gold))] px-2 py-0.5 text-[10px] font-bold text-ink">
                    Most Popular
                  </span>
                )}
                <span className="text-2xl lg:mt-1" aria-hidden>{tier.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-heading text-xl font-extrabold text-vk-700">{tier.amount}</span>
                  <span className="mt-0.5 block text-[13px] text-muted-foreground">for {tier.meals}</span>
                </span>
                <span className="vk-btn-gold h-10 shrink-0 px-4 text-[13px] font-bold lg:mt-2 lg:w-full">
                  Donate Now
                </span>
              </motion.button>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            ₹25 = 1 Meal · All donations go to Touchstone Charities for Subhojanam
          </p>
        </div>
      </section>

      {/* ── TRUST & TRANSPARENCY ─────────────────────────────────── */}
      <section className="vk-section" ref={ref5}>
        <div className="vk-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView5 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl"
          >
            <div className="mb-6 text-center">
              <span className="vk-pill-soft">Run Under</span>
            </div>
            <div className="mb-8 flex flex-wrap items-center justify-center gap-8 md:gap-10">
              <Image src={TouchstoneCharitiesLogo} alt="Touchstone Charities" width={220} height={220} className="h-20 w-auto object-contain" />
              <span className="hidden h-14 w-px bg-vk-100 sm:block" aria-hidden />
              <Image src={HKMLogoBlack} alt="Srila Prabhupada's Hare Krishna Movement Visakhapatnam" width={300} height={162} className="h-14 w-auto max-w-full object-contain" />
            </div>
            <div className="vk-card p-6 text-center">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Subhojanam is a charitable programme run under{" "}
                <span className="font-semibold text-ink">Touchstone Charities</span>, an initiative
                by <span className="font-semibold text-ink">Hare Krishna Movement Visakhapatnam</span> —
                one of the trusts of Srila Prabhupada&apos;s ISKCON Gambheeram Visakhapatnam.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-vk-500" /> FCRA Registered Trust</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-vk-500" /> 80G Tax Exemption Available</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-vk-500" /> Serving since 2018</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── GET INVOLVED ─────────────────────────────────────────── */}
      <section className="vk-section vk-band" ref={ref6}>
        <div className="vk-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={inView6 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl"
          >
            <SectionHeading
              align="center"
              eyebrow="Get Involved"
              title="You Can Make a Difference"
              subtitle="Shoulder the social responsibility of providing nutritious food to those battling health issues. Your generosity earns their prayers and brings immense happiness to your family."
            />
            <div className="grid gap-4 sm:grid-cols-3 md:gap-5">
              {[
                { icon: Heart, title: "Donate", desc: "Sponsor meals directly. Every ₹25 feeds one person.", cta: "Donate Now", action: () => document.getElementById("donate-section")?.scrollIntoView({ behavior: "smooth" }) },
                { icon: Users, title: "Volunteer", desc: "Join our kitchen or distribution team. No experience needed.", cta: "Join Us", action: () => window.location.href = "/contact" },
                { icon: Phone, title: "Contact Us", desc: "Call +91 89777 61187 or write to social@hkmvizag.org", cta: "Get in Touch", action: () => window.location.href = "/contact" },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }} animate={inView6 ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 + i * 0.15 }}
                  className="vk-card flex flex-col p-6 text-center"
                >
                  <span className="vk-icon-chip mx-auto mb-4">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mb-2 text-base font-bold text-ink">{item.title}</h3>
                  <p className="mb-5 flex-1 break-words text-sm text-muted-foreground">{item.desc}</p>
                  <button
                    onClick={item.action}
                    className={`${item.title === "Donate" ? "vk-btn-gold" : "vk-btn-outline"} mt-auto h-11 w-full`}
                  >
                    {item.cta}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CHECKOUT MODAL ───────────────────────────────────────── */}
      {checkoutTier && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-vk-900/60 p-3 backdrop-blur-sm sm:items-center sm:p-4" onClick={closeCheckout}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Sponsor ${checkoutTier.meals}`}
            className="vk-card max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto overscroll-contain !rounded-3xl shadow-lift sm:max-h-[calc(100dvh-2rem)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-vk-700 via-vk-600 to-vk-500 px-5 py-4 text-white sm:px-7">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">Touchstone Charities · Subhojanam</p>
                  <h3 className="text-lg font-bold text-white">Sponsor {checkoutTier.meals}</h3>
                </div>
                <button onClick={closeCheckout} aria-label="Close" className="-mr-2 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-3 flex items-end justify-between gap-3 rounded-xl bg-white/10 px-3.5 py-2.5">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">You are donating</p>
                  <p className="text-xs text-white/80">for {checkoutTier.meals}</p>
                </div>
                <p className="shrink-0 font-heading text-2xl font-extrabold text-[hsl(var(--gold))] sm:text-3xl">₹{checkoutTier.amountValue.toLocaleString("en-IN")}</p>
              </div>
            </div>
            {status?.type === "success" ? (
              <div className="flex flex-col items-center p-6 py-8 text-center">
                <CheckCircle2 className="mb-3 h-14 w-14 text-green-500" />
                <h4 className="mb-1 font-heading font-bold text-ink">Hare Krishna! 🙏</h4>
                <p className="mb-6 text-sm text-muted-foreground">{status.message}</p>
                <button onClick={closeCheckout} className="vk-btn-primary h-11 px-6">Close</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-6">
                <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-vk-700">Your Details</p>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label htmlFor="sj-name" className="mb-1.5 block text-[13px] font-semibold text-ink/80">Full Name <span className="text-red-600">*</span></label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-400" />
                      <input id="sj-name" type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="vk-input pl-10" placeholder="Full Name" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="sj-email" className="mb-1.5 block text-[13px] font-semibold text-ink/80">Email Address <span className="font-normal text-muted-foreground">(optional)</span></label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-400" />
                      <input id="sj-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="vk-input pl-10" placeholder="Email Address (optional)" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="sj-mobile" className="mb-1.5 block text-[13px] font-semibold text-ink/80">Mobile Number <span className="text-red-600">*</span></label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-400" />
                      <input id="sj-mobile" type="tel" required maxLength={10} inputMode="numeric" value={form.mobile} onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value.replace(/[^\d]/g, "").slice(0, 10) }))} className="vk-input pl-10" placeholder="10-digit Mobile Number" />
                    </div>
                  </div>
                </div>
                {lookupHint}
                {status?.type === "error" && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700">{status.message}</p>}
                <button type="submit" disabled={submitting} className="vk-btn-gold h-12 w-full text-[15px] font-bold">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4 fill-current" />}
                  {submitting ? "Processing..." : `Donate ₹${checkoutTier.amountValue.toLocaleString("en-IN")} Now`}
                </button>
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-vk-500" /> Secured by Razorpay</span>
                  <span aria-hidden>·</span>
                  <span>Funds go to Touchstone Charities</span>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
