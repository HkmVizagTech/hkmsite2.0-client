"use client";

import { useState } from "react";
import { Check, Clock, Copy, FileCheck2, HeartHandshake, MapPin, ShieldCheck, Truck, UtensilsCrossed } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import PhonePeUpiCard from "@/components/PhonePeUpiCard";
import FaqSection from "@/components/sqft-campaign/FaqSection";
import OtherDonationsCarousel from "@/components/pitru-paksha/OtherDonationsCarousel";
import DonationForm from "@/components/DonationForm";
import { EMERGENCY, EMERGENCY_SEVAS } from "@/lib/emergencyRelief";

const STEPS = [
  { icon: HeartHandshake, title: "You give", text: "Pick a card and an amount. Payment is secure and the receipt reaches your WhatsApp in a minute." },
  { icon: UtensilsCrossed, title: "We cook", text: "Prasadam is cooked fresh in the temple kitchen by our volunteers, the same way as for daily Annadana." },
  { icon: Truck, title: "We deliver", text: "Packed meals and kits go straight to the affected families, shelters and relief camps." },
];

const TRUST = [
  { icon: FileCheck2, label: "80G Tax Exemption" },
  { icon: Clock, label: "Instant Confirmation" },
  { icon: ShieldCheck, label: "Secure Razorpay Checkout" },
  { icon: MapPin, label: "Hare Krishna Vaikuntham, Visakhapatnam" },
];

const BANK_DETAILS = [
  { label: "Beneficiary Name", value: "HARE KRISHNA MOVEMENT INDIA" },
  { label: "Bank Name", value: "IDFC FIRST BANK LTD" },
  { label: "A/c No", value: "10091415313" },
  { label: "IFSC Code", value: "IDFB0080412" },
];

const FAQS = [
  {
    q: "Where does my donation go?",
    a: "It goes to cooking and delivering food to families affected by the emergency, from the temple's own kitchen in Visakhapatnam. Nothing is spent on anything else.",
  },
  {
    q: "Do I get an 80G tax exemption receipt?",
    a: "Yes. All donations to Hare Krishna Movement India are eligible for 80G. Tick the 80G option at checkout and enter your PAN; the exemption receipt is issued against it and sent with your donation receipt.",
  },
  {
    q: "How will I receive my receipt?",
    a: "On WhatsApp, as soon as the payment is confirmed, usually within a minute. If it has not arrived in ten minutes, call us and we will resend it.",
  },
  {
    q: "Can I pay by UPI or bank transfer instead?",
    a: "Yes. Use the UPI card on this page or the NEFT/RTGS details below. Please WhatsApp us a screenshot with your name, mobile, address and PAN so we can issue your receipt.",
  },
  {
    q: "Can I volunteer or send supplies?",
    a: "Yes. Call or WhatsApp us on +91 79950 97108 and our relief team will tell you where help is needed.",
  },
  {
    q: "Is there a minimum donation?",
    a: "The smallest donation we can accept is Rs. 100.",
  },
];

export default function EmergencyReliefClient() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const scrollToDonate = () => document.getElementById("give-relief")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const copyField = (label: string, value: string) => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopiedField(label);
    window.setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <PageLayout>
      <div className="overflow-x-clip bg-white pt-[var(--header-h)]">
        {/* ══ HERO ═══════════════════════════════════════════════════════ */}
        <section className="relative isolate overflow-hidden bg-vk-900 text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={EMERGENCY.heroImage} alt="" aria-hidden className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-vk-900/70 via-vk-900/80 to-vk-900" />
          <div className="vk-container py-12 text-center md:py-20">
            <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--gold)/0.5)] bg-white/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[hsl(var(--gold))]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(var(--gold))]" />
              {EMERGENCY.active ? "Relief appeal · Live" : "Relief seva"}
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl font-heading text-3xl font-extrabold leading-tight md:text-5xl">{EMERGENCY.headline}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-white/85 md:text-lg md:leading-8">{EMERGENCY.blurb}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/60">{EMERGENCY.place}</p>
            <button type="button" onClick={scrollToDonate} className="vk-btn-gold mt-7 h-12 px-8 text-[15px] font-bold">
              Donate Now
            </button>
          </div>
        </section>

        {/* ══ TRUST STRIP ════════════════════════════════════════════════ */}
        <section className="border-b border-[hsl(var(--gold)/0.35)] bg-amber-50/60">
          <ul className="vk-container grid grid-cols-2 gap-x-5 gap-y-3 py-4 md:grid-cols-4">
            {TRUST.map((t) => (
              <li key={t.label} className="flex items-center gap-2.5 text-[12.5px] font-semibold text-ink md:text-sm">
                <t.icon className="h-[18px] w-[18px] shrink-0 text-[hsl(var(--gold-deep))]" />
                {t.label}
              </li>
            ))}
          </ul>
        </section>

        {/* ══ CARDS ══════════════════════════════════════════════════════ */}
        <section id="give-relief" className="vk-section scroll-mt-20">
          <div className="vk-container">
            <Reveal>
              <SectionHeading
                align="center"
                eyebrow="Give Relief"
                title={EMERGENCY.name}
                subtitle="Tap an amount to give. Your receipt reaches you on WhatsApp."
              />
            </Reveal>
            <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-vk-100 bg-white shadow-lift">
              <DonationForm
                seva={EMERGENCY_SEVAS[0]}
                sourcePage="emergency-relief"
                festivalSlug="emergency-relief"
                bannerImage={EMERGENCY.heroImage}
                initialAmount={1000}
                autoScrollOnMount={false}
                thankYouType="seva"
                thankYouSource="the emergency relief effort"
                trackContentName="Emergency Relief"
                variant="grid"
              />
            </div>
            <p className="mt-8 text-center text-xs text-muted-foreground">
              Minimum donation Rs. 100 · 80G Tax Exemption available · Secured by Razorpay · Donations go to Hare Krishna Movement India, Visakhapatnam
            </p>
          </div>
        </section>

        <PhonePeUpiCard campaign="Emergency Relief" />

        {/* ══ HOW IT REACHES ═════════════════════════════════════════════ */}
        <section className="vk-section vk-band">
          <div className="vk-container">
            <Reveal>
              <SectionHeading align="center" eyebrow="How It Works" title="From Your Gift to Their Plate" />
            </Reveal>
            <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.05} className="vk-card h-full p-6 text-center">
                  <span className="vk-icon-chip mx-auto">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ BANK TRANSFER ══════════════════════════════════════════════ */}
        <section className="vk-section">
          <div className="vk-container">
            <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2 lg:items-start">
              <div className="rounded-2xl border border-vk-100 bg-vk-50 px-5 py-4 text-sm leading-7 text-ink/80 md:text-base">
                While making UPI or bank payments, please send a screenshot with your name, mobile, address and PAN details to our WhatsApp{" "}
                <a className="font-bold text-vk-700 hover:text-vk-500" href="https://wa.me/917995097108" target="_blank" rel="noreferrer">
                  +91 79950 97108
                </a>{" "}
                or email{" "}
                <a className="break-all font-bold text-vk-700 hover:text-vk-500" href="mailto:social@hkmvizag.org">
                  social@hkmvizag.org
                </a>
                , so your receipt is issued against the right donor.
              </div>
              <div className="vk-card p-5 md:p-7">
                <h2 className="vk-bar-title text-lg text-ink md:text-xl">Donation Through Bank (NEFT / RTGS)</h2>
                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {BANK_DETAILS.map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-3 rounded-xl bg-vk-50 p-4 text-sm text-ink">
                      <div className="min-w-0 flex-1">
                        <span className="block text-xs font-medium text-muted-foreground">{label}:</span>
                        <span className="mt-0.5 block select-all break-words font-semibold">{value}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyField(label, value)}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-vk-500 transition-colors hover:bg-white hover:text-vk-700"
                        title={`Copy ${label}`}
                      >
                        {copiedField === label ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <FaqSection faqs={FAQS} tone="blue" />
        <OtherDonationsCarousel />
      </div>

      {(
        <div className="fixed bottom-[calc(var(--bottom-nav-space)+4px+env(safe-area-inset-bottom))] left-3 right-[76px] z-40 lg:hidden">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-vk-100 bg-white/95 p-2 pl-4 shadow-lift">
            <span className="min-w-0 truncate text-[13px] font-semibold text-vk-800">Emergency Relief</span>
            <button type="button" onClick={scrollToDonate} className="vk-btn-gold h-11 shrink-0 px-5">
              Donate
            </button>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
