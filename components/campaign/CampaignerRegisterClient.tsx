"use client";

// Shared campaigner registration for all P2P campaign types (SQFT,
// JANMASHTAMI). Approval-first: successful registration shows a
// "pending admin approval" state — the campaign link is only shared
// once an admin approves (status → active). If the registrant is
// already approved, their live link is shown instead.

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Megaphone, Loader2, Check, Copy, Share2, ExternalLink, Target, ShieldCheck, Clock, UserRound,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";

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
      <main className="bg-white dark:bg-background pt-20">
        <section className="bg-[hsl(220,90%,12%)] py-12 text-center md:py-16">
          <div className="container mx-auto max-w-2xl px-4">
            <Megaphone className="mx-auto mb-3 h-10 w-10 text-gold" />
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
              {config.heroEyebrow}
            </p>
            <h1 className="mb-3 font-heading text-3xl font-bold text-white md:text-5xl">
              {config.heroTitle}
            </h1>
            <p className="mx-auto max-w-xl text-sm text-white/80 md:text-base">
              {config.heroSubtitle}
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-xl px-4">
            {result ? (
              isApproved ? (
                /* ---------- Already approved (existing active campaigner) ---------- */
                <div className="rounded-2xl border-2 border-gold/40 bg-card p-6 text-center md:p-8">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-gold">
                    <Check className="h-7 w-7 text-[hsl(220,90%,12%)]" />
                  </div>
                  <h2 className="mb-2 font-heading text-2xl font-bold text-primary">Welcome back!</h2>
                  <p className="mb-5 text-sm text-muted-foreground">
                    Your campaign is already approved — here is your live link.
                  </p>
                  <div className="mb-4 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
                    <p className="flex-1 truncate text-left text-sm font-semibold text-foreground">{shareUrl}</p>
                    <button
                      onClick={handleCopy}
                      aria-label="Copy campaign link"
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-gold/10 hover:text-gold"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(config.whatsappShareText(shareUrl))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-gold py-3 text-sm font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)]"
                    >
                      <Share2 className="h-4 w-4" /> Share on WhatsApp
                    </a>
                    <Link
                      href={`${config.campaignPathPrefix}/${result.campaigner.slug}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-gold py-3 text-sm font-bold text-gold hover:bg-gold/10"
                    >
                      <ExternalLink className="h-4 w-4" /> View My Campaign Page
                    </Link>
                  </div>
                </div>
              ) : (
                /* ---------- Pending admin approval ---------- */
                <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-6 text-center md:p-8">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                    <Clock className="h-7 w-7 text-amber-600" />
                  </div>
                  <h2 className="mb-2 font-heading text-2xl font-bold text-amber-900">
                    {result.existing ? "Your registration is awaiting approval" : "Hare Krishna! Registration received 🙏"}
                  </h2>
                  <p className="mx-auto max-w-md text-sm text-amber-800">
                    {result.existing
                      ? "You have already registered — our team is reviewing it. You will receive your personal campaign link once approved."
                      : "Thank you for stepping forward for this seva. Our team will review your registration, and once approved you will receive your personal campaign link to share with friends and family."}
                  </p>
                </div>
              )
            ) : (
              /* ---------- Registration form ---------- */
              <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-5 shadow-lg md:p-8">
                <div className="mb-4 grid gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your full name *"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email address *"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile number *"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold"
                  />
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
                    <UserRound className="h-4 w-4 shrink-0 text-gold" />
                    <select
                      required
                      value={form.devoteeId}
                      onChange={(e) => setForm({ ...form, devoteeId: e.target.value })}
                      className="w-full bg-transparent text-sm outline-none"
                    >
                      <option value="">
                        {devoteesLoading ? "Loading devotees…" : "Select the devotee you know *"}
                      </option>
                      {devotees.map((d) => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  {config.showGoalSqft && (
                    <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
                      <Target className="h-4 w-4 shrink-0 text-gold" />
                      <input
                        type="number"
                        min={1}
                        max={100000}
                        placeholder="Personal goal in square feet (optional)"
                        value={form.goalSqft}
                        onChange={(e) => setForm({ ...form, goalSqft: e.target.value })}
                        className="w-full bg-transparent text-sm outline-none"
                      />
                    </div>
                  )}
                  <textarea
                    rows={3}
                    maxLength={300}
                    placeholder="A short message for your supporters (optional)"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold"
                  />
                </div>

                {error && (
                  <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold py-3.5 text-base font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.02] disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Submitting…
                    </>
                  ) : (
                    "Register My Campaign"
                  )}
                </button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                  Your registration will be reviewed by our team. Your email and mobile are never shown publicly.
                </p>
              </form>
            )}
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
