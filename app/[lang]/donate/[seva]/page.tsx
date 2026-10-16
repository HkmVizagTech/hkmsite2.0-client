"use client";

import { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight, Home, Heart,
  ChevronDown, Copy, Check, Building2, UtensilsCrossed, FileCheck2, Landmark, Sparkles,
} from "lucide-react";
import { getSevaBySlug, sevas, getSevaHref } from "@/lib/sevaConfig";
import PageLayout from "@/components/PageLayout";
import UpiQrCard from "@/components/UpiQrCard";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import DonationForm from "@/components/DonationForm";

import { Suspense } from "react";

const apiBase = () =>
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/+$/, "");

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

function DonateSevaPageInner({ params }: { params: Promise<{ seva: string }> }) {
  const { seva: slug } = use(params);
  const seva = getSevaBySlug(slug);
  const searchParams = useSearchParams();

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

  const amountParam = searchParams.get("amount");

  useEffect(() => {
    if (!seva) return;
    (async () => {
      try {
        const res = await fetch(
          `${apiBase()}/seva-stats?sevaName=${encodeURIComponent(seva.title)}&category=${encodeURIComponent(seva.category)}&limit=5`
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

  const handleCopy = (field: string, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const otherSevas = sevas.filter((s) => s.slug !== seva.slug);

  return (
    <PageLayout>
      <WhatsAppFloatButton />
    <main className="bg-white pt-[var(--header-h)] dark:bg-background">
      {/* Hero — full-width banner (GVD style), breadcrumb below it */}
      <section>
        <h1 className="sr-only">{seva.title}</h1>
        {seva.heroImageDesktop && seva.heroImageMobile ? (
          // Dedicated, fully-designed banner (title/CTA baked into the image
          // itself) — shown plain and clear, no dark overlay or duplicate
          // heading on top, since that would fight the banner's own text.
          <button
            onClick={() => document.getElementById("donation-form")?.scrollIntoView({ behavior: "smooth" })}
            className="block w-full overflow-hidden bg-vk-900 text-left"
            aria-label={`Donate to ${seva.title}`}
          >
            <div className="relative hidden w-full md:block" style={{ aspectRatio: "1925 / 817" }}>
              <Image src={seva.heroImageDesktop} alt={seva.title} fill priority sizes="100vw" className="object-cover" />
            </div>
            <div className="relative w-full md:hidden" style={{ aspectRatio: "941 / 1672" }}>
              <Image src={seva.heroImageMobile} alt={seva.title} fill priority sizes="100vw" className="object-cover" />
            </div>
          </button>
        ) : (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-vk-900 md:aspect-[21/7]">
            <Image src={seva.image} alt={seva.title} fill priority sizes="100vw" className="object-cover" />
          </div>
      )}
        <div className="vk-container pt-4">
          <nav
            aria-label="Breadcrumb"
            className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink/70 shadow-sm md:text-[13px]"
          >
            <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-vk-700">
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <Link href="/donate" className="transition-colors hover:text-vk-700">Donate</Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <span className="truncate font-semibold text-vk-700" aria-current="page">{seva.title}</span>
          </nav>
        </div>
      </section>

      <div className="vk-container grid gap-8 py-8 md:py-12 lg:grid-cols-[1fr_420px] lg:gap-10">
        {/* Left column — description + supplementary content. order-2 on
            mobile so the payment form (right column) appears first, right
            after the hero, instead of requiring a long scroll past this. */}
        <div className="order-2 min-w-0 lg:order-1">
          <span className="vk-pill mb-3">{seva.icon} {seva.shortTitle}</span>
          <h2 className="vk-h2">About This Seva</h2>
          <p className="vk-lead mb-8 mt-3">{seva.description}</p>

          {/* Live Donor Wall — real data */}
          {donors.length > 0 && (
            <div className="vk-card mb-8 p-5">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-green-700">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                  </span>
                  Live
                </span>
                <h3 className="text-sm font-bold text-ink">
                  Recent Devotees Supporting This Seva
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {donors.slice(0, 5).map((d, i) => (
                  <motion.div
                    key={`${d.name}-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 rounded-xl bg-vk-50 px-3.5 py-2.5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-vk-700 text-xs font-bold text-white">
                      {d.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{d.name}</p>
                      <p className="text-[11px] text-muted-foreground">Donated ₹{d.amount.toLocaleString("en-IN")} · {d.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Other sevas */}
          <h3 className="vk-bar-title mb-4 text-base text-ink">Other Ways to Serve</h3>
          <div className="mb-10 flex flex-wrap gap-2">
            {otherSevas.map((s) => (
              <Link
                key={s.slug}
                href={getSevaHref(s)}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-vk-200 bg-white px-4 py-2 text-[13px] font-medium text-ink transition-colors hover:border-vk-500 hover:bg-vk-50 hover:text-vk-700"
              >
                {s.icon} {s.shortTitle}
              </Link>
            ))}
          </div>

          {/* Offline payment options: UPI QR + Bank transfer */}
          <div className="mb-10 grid gap-4 md:grid-cols-2">
            <UpiQrCard />
            <div className="vk-card p-5 md:p-6">
              <h3 className="mb-3 flex items-center gap-2.5 text-lg font-bold text-ink">
                <span className="vk-icon-chip !h-9 !w-9">
                  <Building2 className="h-4 w-4" />
                </span>
                Prefer a Direct Bank Transfer?
              </h3>
              <p className="mb-4 text-[13px] leading-relaxed text-muted-foreground">
                You can also donate via NEFT/RTGS/UPI directly to our temple account. Please email us your
                transaction reference and PAN (if you need an 80G receipt) to <a href="mailto:social@hkmvizag.org" className="font-medium text-vk-600 underline underline-offset-2">social@hkmvizag.org</a>.
              </p>
              <div className="space-y-1 rounded-xl bg-vk-50 p-3 text-sm">
                {Object.entries({
                  "Beneficiary Name": BANK_DETAILS.beneficiaryName,
                  "Bank Name": BANK_DETAILS.bankName,
                  "Account Number": BANK_DETAILS.accountNumber,
                  "IFSC Code": BANK_DETAILS.ifsc,
                }).map(([label, value]) => (
                  <div key={label} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 rounded-lg px-1 py-1">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(label, value)}
                      className="flex min-h-[32px] min-w-0 items-center gap-1.5 break-all text-left font-semibold text-ink hover:text-vk-700"
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
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="vk-bar-title mb-4 text-lg text-ink">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {FAQS.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={faq.q}
                    className={`overflow-hidden rounded-2xl border bg-white transition-shadow ${
                      isOpen ? "border-vk-200 shadow-card" : "border-vk-100"
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-[15px] font-semibold text-ink md:px-5 md:py-4"
                    >
                      {faq.q}
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all ${
                          isOpen ? "rotate-180 bg-vk-700 text-white" : "bg-vk-100 text-vk-700"
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground md:px-5 md:pb-5">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: sticky donation form. order-1 on mobile so this (and the
            amount tiers below) appears right after the hero, not after the
            long description/donor-wall/FAQ content in the left column. */}
        <div id="donation-form" className="order-1 min-w-0 scroll-mt-28 lg:order-2 lg:sticky lg:top-28 lg:self-start">
          <DonationForm
            seva={seva}
            sourcePage={`/donate/${seva.slug}`}
            bannerImage={seva.heroImageDesktop}
            initialAmount={amountParam ? Number(amountParam) : undefined}
            onSuccess={(donor) => setDonors((d) => [donor, ...d])}
          />
        </div>
      </div>

      {/* Donor privileges — below the payment form */}
      <section className="vk-section vk-band">
        <div className="vk-container">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {SEVA_PRIVILEGES.map((p) => (
              <div key={p.title} className="vk-card flex items-start gap-3 p-4 md:p-5">
                <span className="vk-icon-chip">
                  <p.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink">{p.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky mobile donate bar — the form sits below the fold on phones */}
      {showSticky && (
      <div className="fixed bottom-[calc(var(--bottom-nav-space)+4px+env(safe-area-inset-bottom))] left-3 right-[76px] z-40 lg:hidden">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-vk-100 bg-white/95 p-2 pl-4 shadow-lift backdrop-blur">
          <p className="min-w-0 truncate text-[13px] font-semibold text-ink">{seva.title}</p>
          <button
            onClick={() => document.getElementById("donation-form")?.scrollIntoView({ behavior: "smooth" })}
            className="vk-btn-gold h-11 shrink-0 px-5"
          >
            <Heart className="h-4 w-4 fill-current" /> Donate Now
          </button>
        </div>
      </div>
      )}
    </main>
    </PageLayout>
  );
}

export default function DonateSevaPage({ params }: { params: Promise<{ seva: string }> }) {
  return (
    <Suspense fallback={null}>
      <DonateSevaPageInner params={params} />
    </Suspense>
  );
}
