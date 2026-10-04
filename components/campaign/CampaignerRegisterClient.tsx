"use client";

// Shared campaigner registration for all P2P campaign types (SQFT,
// JANMASHTAMI). Approval-first: successful registration shows a
// "pending admin approval" state — the campaign link is only shared
// once an admin approves (status → active). If the registrant is
// already approved, their live link is shown instead.

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Megaphone, Loader2, Check, Copy, Share2, ExternalLink, Target, ShieldCheck, Clock, UserRound, ChevronDown,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";

const labelClass = "mb-1.5 block text-[13px] font-semibold text-ink/80";
const iconClass = "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-400";

const apiBase = () =>
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/+$/, "");

export interface CampaignRegisterConfig {
  campaignType: "SQFT" | "JANMASHTAMI";
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  campaignPathPrefix: string; // e.g. "/sqft-seva-campaign/c" or "/janmashtami/c"
  showGoalSqft: boolean;
  whatsappShareText: (url: string) => string;
}

// Config lives client-side (functions can't cross the RSC boundary), keyed
// by campaignType. Server pages pass only the type string.
const CONFIGS: Record<"SQFT" | "JANMASHTAMI", CampaignRegisterConfig> = {
  SQFT: {
    campaignType: "SQFT",
    heroEyebrow: "Square Foot Seva · Hare Krishna Vaikuntham Temple",
    heroTitle: "Start Your Fundraising Campaign",
    heroSubtitle:
      "Register to get your personal campaign link. Once approved by our team, share it with friends and family and multiply your seva for the temple in the making.",
    campaignPathPrefix: "/sqft-seva-campaign/c",
    showGoalSqft: true,
    whatsappShareText: (url) =>
      `Hare Krishna! 🙏 I've started a fundraising campaign for the Hare Krishna Vaikuntham Temple. Join me — sponsor a square foot of the temple through my link: ${url}`,
  },
  JANMASHTAMI: {
    campaignType: "JANMASHTAMI",
    heroEyebrow: "Sri Krishna Janmashtami · ISKCON Gambheeram Visakhapatnam",
    heroTitle: "Become a Janmashtami Seva Campaigner",
    heroSubtitle:
      "Register to receive your personal Janmashtami seva link. Once approved by our team, share it with friends and family and invite them to offer sevas to Sri Krishna on His divine appearance day.",
    campaignPathPrefix: "/janmashtami/c",
    showGoalSqft: false,
    whatsappShareText: (url) =>
      `Hare Krishna! 🙏 Sri Krishna Janmashtami is coming — join me in offering sevas to the Lord at ISKCON Gambheeram Visakhapatnam through my link: ${url}`,
  },
};

interface RegisteredCampaigner {
  name: string;
  slug: string;
  goalSqft: number;
  status?: string;
}

interface Devotee { _id: string; name: string }

export default function CampaignerRegisterClient({ campaignType }: { campaignType: "SQFT" | "JANMASHTAMI" }) {
  const config = CONFIGS[campaignType] || CONFIGS.SQFT;
  const [form, setForm] = useState({ name: "", email: "", mobile: "", goalSqft: "", message: "", devoteeId: "" });
  const [devotees, setDevotees] = useState<Devotee[]>([]);
  const [devoteesLoading, setDevoteesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ campaigner: RegisteredCampaigner; existing: boolean; status: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`${apiBase()}/temple-devotees`)
      .then((res) => res.json())
      .then((data) => { if (data.success) setDevotees(data.devotees || []); })
      .catch(() => {})
      .finally(() => setDevoteesLoading(false));
  }, []);

  const isApproved = result?.status === "active";
  const shareUrl = result && isApproved
    ? `${typeof window !== "undefined" ? window.location.origin : ""}${config.campaignPathPrefix}/${result.campaigner.slug}`
    : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.mobile.trim()) {
      setError("Please fill in your name, email, and mobile number.");
      return;
    }
    if (!form.devoteeId) {
      setError("Please select the devotee you know from the list.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase()}/campaigners/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          mobile: form.mobile.trim(),
          goalSqft: config.showGoalSqft ? Number(form.goalSqft) || 0 : 0,
          message: form.message.trim(),
          campaignType: config.campaignType,
          devoteeId: form.devoteeId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed. Please try again.");
      setResult({ campaigner: data.campaigner, existing: !!data.existing, status: data.status || data.campaigner?.status || "pending" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <WhatsAppFloatButton />
      <main className="bg-white pt-[var(--header-h)] dark:bg-background">
        <section className="bg-gradient-to-b from-vk-50 to-white pt-4 md:pt-6 dark:from-background dark:to-background">
          <div className="vk-container">
            <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-navy px-5 py-10 text-center shadow-[0_24px_60px_-28px_rgba(10,18,51,0.6)] md:px-10 md:py-14">
              <div className="mx-auto max-w-2xl">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[hsl(var(--gold))]">
                  <Megaphone className="h-7 w-7" />
                </span>
                <span className="vk-pill-light mb-3 max-w-full whitespace-normal text-center">
                  {config.heroEyebrow}
                </span>
                <h1 className="vk-h1 !text-white">
                  {config.heroTitle}
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/85 md:text-lg">
                  {config.heroSubtitle}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="vk-section">
          <div className="vk-container">
           <div className="mx-auto max-w-xl">
            {result ? (
              isApproved ? (
                /* ---------- Already approved (existing active campaigner) ---------- */
                <div className="vk-card p-6 text-center md:p-8">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-vk-100 text-vk-700">
                    <Check className="h-7 w-7" />
                  </div>
                  <h2 className="vk-h3 mb-2">Welcome back!</h2>
                  <p className="mb-5 text-sm text-muted-foreground">
                    Your campaign is already approved — here is your live link.
                  </p>
                  <div className="mb-4 flex items-center gap-2 rounded-xl border border-vk-100 bg-vk-50 py-1.5 pl-3.5 pr-1.5">
                    <p className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-ink">{shareUrl}</p>
                    <button
                      onClick={handleCopy}
                      aria-label="Copy campaign link"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-vk-700 transition-colors hover:bg-vk-100"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(config.whatsappShareText(shareUrl))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="vk-btn-primary h-12 flex-1"
                    >
                      <Share2 className="h-4 w-4" /> Share on WhatsApp
                    </a>
                    <Link
                      href={`${config.campaignPathPrefix}/${result.campaigner.slug}`}
                      className="vk-btn-outline h-12 flex-1"
                    >
                      <ExternalLink className="h-4 w-4" /> View My Campaign Page
                    </Link>
                  </div>
                </div>
              ) : (
                /* ---------- Pending admin approval ---------- */
                <div className="vk-card p-6 text-center md:p-8">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                    <Clock className="h-7 w-7" />
                  </div>
                  <h2 className="vk-h3 mb-2">
                    {result.existing ? "Your registration is awaiting approval" : "Hare Krishna! Registration received 🙏"}
                  </h2>
                  <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
                    {result.existing
                      ? "You have already registered — our team is reviewing it. You will receive your personal campaign link once approved."
                      : "Thank you for stepping forward for this seva. Our team will review your registration, and once approved you will receive your personal campaign link to share with friends and family."}
                  </p>
                </div>
              )
            ) : (
              /* ---------- Registration form ---------- */
              <form onSubmit={handleSubmit} className="vk-card p-5 md:p-8">
                <div className="mb-5 grid gap-4">
                  <div>
                    <label htmlFor="campaigner-name" className={labelClass}>Full name</label>
                    <input
                      id="campaigner-name"
                      type="text"
                      required
                      placeholder="Your full name *"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="vk-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="campaigner-email" className={labelClass}>Email address</label>
                    <input
                      id="campaigner-email"
                      type="email"
                      required
                      placeholder="Email address *"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="vk-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="campaigner-mobile" className={labelClass}>Mobile number</label>
                    <input
                      id="campaigner-mobile"
                      type="tel"
                      required
                      placeholder="Mobile number *"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      className="vk-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="campaigner-devotee" className={labelClass}>Devotee you know</label>
                    <div className="relative">
                      <UserRound className={iconClass} />
                      <select
                        id="campaigner-devotee"
                        required
                        value={form.devoteeId}
                        onChange={(e) => setForm({ ...form, devoteeId: e.target.value })}
                        className="vk-input appearance-none pl-10 pr-10"
                      >
                        <option value="">
                          {devoteesLoading ? "Loading devotees…" : "Select the devotee you know *"}
                        </option>
                        {devotees.map((d) => (
                          <option key={d._id} value={d._id}>{d.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-400" />
                    </div>
                  </div>
                  {config.showGoalSqft && (
                    <div>
                      <label htmlFor="campaigner-goal" className={labelClass}>Personal goal (optional)</label>
                      <div className="relative">
                        <Target className={iconClass} />
                        <input
                          id="campaigner-goal"
                          type="number"
                          min={1}
                          max={100000}
                          placeholder="Personal goal in square feet (optional)"
                          value={form.goalSqft}
                          onChange={(e) => setForm({ ...form, goalSqft: e.target.value })}
                          className="vk-input pl-10"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <label htmlFor="campaigner-message" className={labelClass}>Message (optional)</label>
                    <textarea
                      id="campaigner-message"
                      rows={3}
                      maxLength={300}
                      placeholder="A short message for your supporters (optional)"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="vk-input h-auto min-h-[96px] resize-none py-2.5"
                    />
                  </div>
                </div>

                {error && (
                  <p className="mb-4 rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="vk-btn-primary h-12 w-full text-[15px] font-bold"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Submitting…
                    </>
                  ) : (
                    "Register My Campaign"
                  )}
                </button>
                <p className="mt-3 flex items-start justify-center gap-1.5 text-center text-[11px] leading-relaxed text-muted-foreground">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-vk-500" />
                  Your registration will be reviewed by our team. Your email and mobile are never shown publicly.
                </p>
              </form>
            )}
           </div>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
