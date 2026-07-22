"use client";

import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck, Loader2, CheckCircle2, ChevronDown, Copy, Check,
  Building2, Award, FileCheck2, Sparkles, UtensilsCrossed, ScrollText,
  Landmark, HeartHandshake, Users, Share2, Megaphone, Target,
  User, Phone, Mail, Minus, Plus,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import Ornament from "@/components/Ornament";
import HeroSection from "@/components/sqft-campaign/HeroSection";
import StatsBar from "@/components/sqft-campaign/StatsBar";
import DonationFormSection from "@/components/sqft-campaign/DonationFormSection";
import DonorPrivilegesSection from "@/components/sqft-campaign/DonorPrivilegesSection";
import TestimonialsSection from "@/components/sqft-campaign/TestimonialsSection";
import AboutSection from "@/components/sqft-campaign/AboutSection";
import ImportanceSection from "@/components/sqft-campaign/ImportanceSection";
import ConstructionStatusSection from "@/components/sqft-campaign/ConstructionStatusSection";
import TempleFeaturesSection from "@/components/sqft-campaign/TempleFeaturesSection";
import ProgressSection from "@/components/sqft-campaign/ProgressSection";
import GallerySection from "@/components/sqft-campaign/GallerySection";
import FounderSection from "@/components/sqft-campaign/FounderSection";
import FaqSection from "@/components/sqft-campaign/FaqSection";
import DonorWallSection from "@/components/sqft-campaign/DonorWallSection";
import FundraisingCtaSection from "@/components/sqft-campaign/FundraisingCtaSection";
import FinalCtaSection from "@/components/sqft-campaign/FinalCtaSection";
import StickyMobileBar from "@/components/sqft-campaign/StickyMobileBar";
import CampaignerCard from "@/components/sqft-campaign/CampaignerCard";
import { getCampaignConfig, type CampaignConfig, type CampaignerData, type DonorEntry } from "@/lib/campaignConfig";

type RazorpayConstructor = new (options: Record<string, unknown>) => { open: () => void };

const MAHA_PRASADAM_MIN_AMOUNT = 1000;

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

/* ------------------------------------------------------------------ */
/* Shared data (same for both campaigns)                               */
/* ------------------------------------------------------------------ */

const FAQS = (config: CampaignConfig) => [
  {
    q: `What is ${config.pageTitle}?`,
    a: `${config.pageTitle} invites you to sponsor one or more ${config.unitNamePlural} of the Hare Krishna Vaikuntham Temple's construction at ₹${config.pricePerUnit.toLocaleString("en-IN")} per ${config.unitName}. Every ${config.unitName} you sponsor becomes a permanent part of the Lord's abode.`,
  },
  {
    q: "How will my donation be utilised?",
    a: "Your donation directly funds temple construction — materials like cement, steel and stone, and the services of architects, engineers, craftsmen and artisans building the Hare Krishna Vaikuntham Temple in Visakhapatnam.",
  },
  {
    q: "Is my donation eligible for 80G tax exemption?",
    a: "Yes. Donations to Hare Krishna Movement qualify for tax exemption under Section 80G of the Income Tax Act. Select the '80G receipt' option during checkout and provide your PAN.",
  },
  {
    q: "Will I receive a receipt?",
    a: "Yes. An email receipt is sent automatically the moment your payment is confirmed. Your 80G certificate follows separately once your PAN is verified.",
  },
  {
    q: "When will I receive prasadam?",
    a: "Donors within India can expect to receive prasadam within a month of their donation. Our team will reach out for your address details.",
  },
  {
    q: `What is the minimum amount I can donate?`,
    a: `While one ${config.unitName} is ₹${config.pricePerUnit.toLocaleString("en-IN")}, contributions of any amount from ₹${config.minCustomAmount} are gratefully accepted — every rupee is laid into the Lord's home with devotion.`,
  },
  {
    q: "Is it safe to donate online here?",
    a: "Yes. All payments are processed through Razorpay, a PCI-DSS-compliant payment gateway. We never see or store your card details. You may also donate via direct bank transfer using the details on this page.",
  },
  {
    q: "Who is the inspiration behind this project?",
    a: "Srila Prabhupada, Founder-Acharya of the worldwide Hare Krishna Movement, whose vision of grand temples for Sri Krishna inspires devotees to build magnificent centres of devotion, culture and compassion.",
  },
];

/* ------------------------------------------------------------------ */

interface CampaignStats {
  pricePerSqft: number;
  goalSqft: number;
  sqftRaised: number;
  totalAmount: number;
  donorCount: number;
  percent: number;
  latest: DonorEntry[];
  largest: DonorEntry[];
}

export default function SqftCampaignClient({
  campaigner,
  campaignType = "SQFT",
}: {
  campaigner?: CampaignerData;
  campaignType?: "SQFT" | "BRICK";
}) {
  const config = getCampaignConfig(campaignType);
  const [copiedShare, setCopiedShare] = useState(false);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [wallTab, setWallTab] = useState<"latest" | "largest">("latest");

  const [sqftCount, setSqftCount] = useState(1);
  const [useCustom, setUseCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [form, setForm] = useState({ name: "", email: "", mobile: "", panNumber: "", address: "" });
  const [want80G, setWant80G] = useState(false);
  const [wantsMahaPrasadam, setWantsMahaPrasadam] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const price = config.pricePerUnit;
  const finalAmount = useCustom ? Number(customAmount) || 0 : sqftCount * price;
  const mahaPrasadamEligible = finalAmount > MAHA_PRASADAM_MIN_AMOUNT;

  useEffect(() => {
    if (!mahaPrasadamEligible && wantsMahaPrasadam) setWantsMahaPrasadam(false);
  }, [mahaPrasadamEligible, wantsMahaPrasadam]);
  const sqftRaised = stats ? Math.floor(stats.totalAmount / price) : 0;
  const percent = stats && stats.goalSqft > 0
    ? Math.min(100, Math.round((stats.totalAmount / (stats.goalSqft * price)) * 10000) / 100)
    : 0;
  const campaignerSqftRaised = campaigner ? Math.floor(campaigner.raisedAmount / price) : 0;

  const BANK_DETAILS = {
    beneficiaryName: "HARE KRISHNA MOVEMENT INDIA",
    bankName: "IDFC FIRST BANK LTD",
    accountNumber: "10091415313",
    ifsc: "IDFB0080412",
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${apiBase()}${config.statsApiEndpoint}`, { cache: "no-store" });
        if (res.ok) setStats(await res.json());
      } catch {}
    })();
  }, [config.statsApiEndpoint]);

  const handleCopy = (field: string, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const scrollToDonate = () => {
    document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (finalAmount < config.minCustomAmount) {
      setStatus({ type: "error", message: `Minimum donation is ₹${config.minCustomAmount}.` });
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
    if (wantsMahaPrasadam && !form.address.trim()) {
      setStatus({ type: "error", message: "Please provide your delivery address for Maha Prasadam." });
      return;
    }

    setSubmitting(true);
    try {
      const orderRes = await fetch(`${apiBase()}/payments/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: "default",
          sourcePage: campaigner ? `/sqft-seva-campaign/c/${campaigner.slug}` : `/${campaignType === "BRICK" ? "brick-seva-campaign" : "sqft-seva-campaign"}`,
          type: config.orderType,
          sevaName: config.pageTitle,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          mobile: form.mobile.trim(),
          amount: finalAmount,
          certificate: want80G,
          panNumber: want80G ? form.panNumber.trim() : undefined,
          campaignerSlug: campaigner?.slug || undefined,
          // TODO: backend doesn't accept these fields yet — wire up once /payments/order supports them.
          // wantsMahaPrasadam,
          // address: wantsMahaPrasadam ? form.address.trim() : undefined,
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
        description: `${config.pageTitle} — Hare Krishna Vaikuntham Temple`,
        order_id: order.orderId,
        prefill: { name: form.name, email: form.email, contact: form.mobile },
        notes: {
          sourcePage: campaigner ? `/sqft-seva-campaign/c/${campaigner.slug}` : `/${campaignType === "BRICK" ? "brick-seva-campaign" : "sqft-seva-campaign"}`,
          sevaName: config.pageTitle,
          sevaType: config.orderType,
          campaignerSlug: campaigner?.slug || "",
        },
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
              message: `Thank you! Your ${config.unitNamePlural} have been offered to Their Lordships. Hare Krishna 🙏`,
            });
            const nameParts = form.name.trim().split(/\s+/);
            const displayName =
              nameParts.length === 1
                ? nameParts[0]
                : `${nameParts[0]} ${nameParts[nameParts.length - 1].charAt(0)}.`;
            const entry: DonorEntry = {
              name: displayName,
              amount: finalAmount,
              sqft: Math.floor(finalAmount / price),
              time: "just now",
            };
            setStats((s) =>
              s
                ? {
                    ...s,
                    totalAmount: s.totalAmount + finalAmount,
                    donorCount: s.donorCount + 1,
                    latest: [entry, ...s.latest],
                  }
                : s
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
        modal: { ondismiss: () => setSubmitting(false) },
        theme: { color: "#D69E2E" },
      }).open();
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Something went wrong." });
      setSubmitting(false);
    }
  };

  const campaignPath = campaignType === "BRICK" ? "brick-seva-campaign" : "sqft-seva-campaign";
  const shareUrl = campaigner && typeof window !== "undefined"
    ? `${window.location.origin}/${campaignPath}/c/${campaigner.slug}`
    : "";

  const handleShareCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    });
  };

  return (
    <PageLayout>
      <main className="bg-background">
        {/* Hero section — full‑width cinematic banner */}
        <HeroSection
          campaigner={campaigner}
          price={price}
          scrollToDonate={scrollToDonate}
          config={config}
        />

        {/* Stats bar — slides slightly up over the hero */}
        <StatsBar stats={stats} campaigner={campaigner} price={price} config={config} />

        {/* Campaigner card (P2P pages only) */}
        {campaigner && (
          <CampaignerCard
            campaigner={campaigner}
            price={price}
            campaignerSqftRaised={campaignerSqftRaised}
            scrollToDonate={scrollToDonate}
            shareUrl={shareUrl}
            copiedShare={copiedShare}
            handleShareCopy={handleShareCopy}
            config={config}
          />
        )}

        {/* Donation form — the core interactive section */}
        <DonationFormSection
          price={price}
          minCustomAmount={config.minCustomAmount}
          sqftCount={sqftCount}
          useCustom={useCustom}
          customAmount={customAmount}
          form={form}
          want80G={want80G}
          wantsMahaPrasadam={wantsMahaPrasadam}
          mahaPrasadamEligible={mahaPrasadamEligible}
          mahaPrasadamMinAmount={MAHA_PRASADAM_MIN_AMOUNT}
          submitting={submitting}
          status={status}
          copiedField={copiedField}
          bankDetails={BANK_DETAILS}
          email={config.email}
          finalAmount={finalAmount}
          setSqftCount={setSqftCount}
          setUseCustom={setUseCustom}
          setCustomAmount={setCustomAmount}
          setForm={setForm}
          setWant80G={setWant80G}
          setWantsMahaPrasadam={setWantsMahaPrasadam}
          handleSubmit={handleSubmit}
          handleCopy={handleCopy}
          config={config}
        />

        {/* Donor privileges */}
        <DonorPrivilegesSection scrollToDonate={scrollToDonate} />

        {/* Testimonials — new */}
        <TestimonialsSection />

        {/* About / inspiration */}
        <AboutSection
          aboutImage={config.aboutImage}
          scrollToDonate={scrollToDonate}
        />

        {/* Scriptural significance of temple construction */}
        <ImportanceSection />

        {/* Temple features */}
        <TempleFeaturesSection />

        {/* Live progress — foundation grid */}
        <ProgressSection
          sqftRaised={sqftRaised}
          percent={percent}
          goalSqft={stats?.goalSqft ?? 67000}
          donorCount={stats?.donorCount ?? 0}
          config={config}
        />

        {/* Photo + video proof of ongoing construction */}
        <ConstructionStatusSection scrollToDonate={scrollToDonate} />

        {/* Gallery */}
        <GallerySection />

        {/* Founder's words */}
        <FounderSection />

        {/* FAQ */}
        <FaqSection faqs={FAQS(config)} />

        {/* Donor wall */}
        <DonorWallSection
          stats={stats}
          wallTab={wallTab}
          setWallTab={setWallTab}
          price={price}
        />

        {/* Start your fundraising campaign */}
        <FundraisingCtaSection campaignType={campaignType} />

        {/* Final CTA */}
        <FinalCtaSection scrollToDonate={scrollToDonate} />

        {/* Sticky mobile donate bar */}
        <StickyMobileBar price={price} scrollToDonate={scrollToDonate} config={config} />
      </main>
    </PageLayout>
  );
}
