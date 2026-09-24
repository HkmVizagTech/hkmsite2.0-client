"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Loader2,
  History,
  Repeat,
  UserCog,
  Heart,
  ShieldCheck,
  TrendingUp,
  CalendarDays,
  MessageSquareText,
  ChevronDown,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  Check,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { donorFetch, clearDonorToken, getDonorToken } from "@/lib/donorAuthClient";
import DonorHero from "@/components/donor/DonorHero";
import DonationHistorySection, { Donation } from "@/components/donor/DonationHistorySection";
import RecurringDonationsSection, { Subscription } from "@/components/donor/RecurringDonationsSection";
import DonorProfileSection from "@/components/donor/DonorProfileSection";
import type { PrasadamAddress } from "@/components/AddressForm";
import GivingGraphs from "./GivingGraphs";
import NextSevas from "./NextSevas";
import MyIssues from "./MyIssues";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

interface DonorProfile {
  donorId: string;
  name: string;
  mobile: string;
  email?: string;
  panNumber?: string | null;
  savedAddress?: PrasadamAddress | null;
  preacherName: string | null;
  donorSince: string;
}

interface Stats {
  lifetimeTotal: number;
  donationCount: number;
  sevaCount: number;
  donorSince: string;
}

/* Section card — matches the site's content blocks: gold uppercase eyebrow,
   icon chip, and a white rounded-3xl card with the warm site shadow. */
function SectionCard({
  icon: Icon,
  eyebrow,
  title,
  id,
  children,
  className = "",
  action,
}: {
  icon: typeof History;
  eyebrow: string;
  title: string;
  id?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      className={`scroll-mt-28 overflow-hidden rounded-3xl border border-border bg-card shadow-warm ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-border/70 bg-gradient-to-r from-gold/10 via-transparent to-transparent px-5 py-4 sm:px-7">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-[var(--shadow-gold)]"
          style={{ background: "var(--gradient-gold)" }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
          <h2 className="truncate font-heading text-lg font-bold text-foreground">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-5 sm:p-7">{children}</div>
    </motion.section>
  );
}

/* One line of the profile summary. Kept as a row rather than a form field so
   the top of the page reads as an identity card, not a settings screen. */
function DetailRow({
  icon: Icon,
  label,
  value,
  missing,
}: {
  icon: typeof Mail;
  label: string;
  value?: string | null;
  missing: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        {value ? (
          <p className="truncate text-sm font-medium text-foreground">{value}</p>
        ) : (
          <p className="truncate text-sm text-muted-foreground/70">{missing}</p>
        )}
      </div>
    </div>
  );
}

// Anchors for the quick-jump row. Every section the donor might have come
// for is named here, so the options are visible instead of found by scrolling.
const JUMP_LINKS = [
  { href: "#history", label: "Donations", icon: History },
  { href: "#insights", label: "Insights", icon: TrendingUp },
  { href: "#recurring", label: "Monthly", icon: Repeat },
  { href: "#festivals", label: "Festivals", icon: CalendarDays },
  { href: "#support", label: "Help", icon: MessageSquareText },
];

export default function DonorDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<DonorProfile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);

  const loadAll = async () => {
    const [meRes, donationsRes, statsRes, subsRes] = await Promise.all([
      donorFetch(`${API_URL}/donor/me`),
      donorFetch(`${API_URL}/donor/my-donations`),
      donorFetch(`${API_URL}/donor/stats`),
      donorFetch(`${API_URL}/donor/subscriptions`),
    ]);
    if (meRes.status === 401) {
      router.replace("/donor/login");
      return;
    }
    const [meData, donationsData, statsData, subsData] = await Promise.all([
      meRes.json(),
      donationsRes.json(),
      statsRes.json(),
      subsRes.json(),
    ]);
    setProfile(meData.donor);
    setDonations(donationsData.donations || []);
    setStats(statsData.stats || null);
    setSubscriptions(subsData.subscriptions || []);
  };

  useEffect(() => {
    if (!getDonorToken()) {
      router.replace("/donor/login");
      return;
    }
    (async () => {
      try {
        await loadAll();
      } catch {
        setError("Could not load your account. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const downloadReceipt = async (donationId: string, receiptNumber?: string) => {
    setDownloadingId(donationId);
    try {
      const res = await donorFetch(`${API_URL}/donor/receipt/${donationId}`);
      if (!res.ok) throw new Error("Could not generate receipt.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${(receiptNumber || donationId).replace(/\|/g, "-")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Could not download this receipt. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const logout = () => {
    clearDonorToken();
    router.replace("/donor/login");
  };

  if (loading) {
    return (
      <PageLayout>
        <div
          className="flex min-h-[70vh] flex-col items-center justify-center gap-4 pt-[88px] md:pt-[104px]"
          style={{ background: "var(--gradient-warm)" }}
        >
          <span
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-gold)]"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Loader2 className="h-6 w-6 animate-spin" />
          </span>
          <p className="text-sm font-medium text-muted-foreground">Preparing your seva journey…</p>
        </div>
      </PageLayout>
    );
  }

  const address = profile?.savedAddress;
  const addressLine = address
    ? [address.street, address.city, address.state, address.pincode].filter(Boolean).join(", ")
    : "";

  return (
    <PageLayout>
      {/* pt clears the fixed site navbar. */}
      <div className="pt-[88px] md:pt-[104px]" style={{ background: "var(--gradient-warm)" }}>
        <DonorHero
          name={profile?.name || "Devotee"}
          donorId={profile?.donorId || ""}
          preacherName={profile?.preacherName || null}
          lifetimeTotal={stats?.lifetimeTotal || 0}
          donationCount={stats?.donationCount || 0}
          sevaCount={stats?.sevaCount || 0}
          donorSince={stats?.donorSince || profile?.donorSince || ""}
          onLogout={logout}
        />

        <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* ── Quick jump ─────────────────────────────────────────── */}
          <nav
            aria-label="Jump to section"
            className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
          >
            {JUMP_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:border-gold/50 hover:text-foreground"
              >
                <Icon className="h-3.5 w-3.5 text-gold" />
                {label}
              </Link>
            ))}
          </nav>

          {/* ── My Profile — full width, directly under the stats ──── */}
          <div className="mt-5">
            <SectionCard
              id="profile"
              icon={UserCog}
              eyebrow="Your Details"
              title="My Profile"
              action={
                <button
                  type="button"
                  onClick={() => setEditingProfile((v) => !v)}
                  aria-expanded={editingProfile}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground"
                >
                  {editingProfile ? "Close" : "Edit details"}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${editingProfile ? "rotate-180" : ""}`}
                  />
                </button>
              }
            >
              {/* Summary first — most visits are to read these, not change
                  them, so the form stays folded away until asked for. */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <DetailRow icon={Phone} label="Mobile" value={profile?.mobile} missing="—" />
                <DetailRow icon={Mail} label="Email" value={profile?.email} missing="Not added yet" />
                <DetailRow
                  icon={CreditCard}
                  label="PAN · for 80G"
                  value={profile?.panNumber || ""}
                  missing="Add for 80G certificates"
                />
                <DetailRow
                  icon={MapPin}
                  label="Prasadam address"
                  value={addressLine}
                  missing="No address saved"
                />
              </div>

              {editingProfile && profile && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-6 overflow-hidden border-t border-border pt-6"
                >
                  <DonorProfileSection
                    profile={profile}
                    donorFetch={donorFetch}
                    apiUrl={API_URL}
                    onSaved={(updated) => setProfile((p) => (p ? { ...p, ...updated } : p))}
                  />
                </motion.div>
              )}
            </SectionCard>
          </div>

          {/* ── Everything else ────────────────────────────────────── */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <div className="space-y-6">
              <SectionCard id="history" icon={History} eyebrow="Your Sevas" title="Donation History">
                <DonationHistorySection
                  donations={donations}
                  downloadingId={downloadingId}
                  onDownload={downloadReceipt}
                />
              </SectionCard>

              <SectionCard id="insights" icon={TrendingUp} eyebrow="Giving Insights" title="Your Giving at a Glance">
                <GivingGraphs />
              </SectionCard>

              <SectionCard id="recurring" icon={Repeat} eyebrow="Monthly Seva" title="Recurring Donations">
                <RecurringDonationsSection
                  subscriptions={subscriptions}
                  donorFetch={donorFetch}
                  apiUrl={API_URL}
                  onChanged={loadAll}
                />
              </SectionCard>

              <SectionCard id="support" icon={MessageSquareText} eyebrow="Support" title="Questions or Issues">
                <MyIssues />
              </SectionCard>
            </div>

            <div className="space-y-6 lg:sticky lg:top-28">
              <SectionCard id="festivals" icon={CalendarDays} eyebrow="Festivals & Occasions" title="Upcoming Sevas">
                <NextSevas />
              </SectionCard>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: 0.05 }}
                className="relative overflow-hidden rounded-3xl text-white shadow-[var(--shadow-elevated)]"
                style={{ background: "var(--gradient-navy)" }}
              >
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl"
                  style={{ background: "var(--gradient-gold)", opacity: 0.25 }}
                />
                <div className="relative z-10 p-6 sm:p-7">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                    Continue Your Seva
                  </p>
                  <h3 className="font-heading text-xl font-bold leading-snug">
                    Every offering nurtures the temple&apos;s service
                  </h3>
                  <p className="mt-2 text-sm text-white/75">
                    Support the deities, cows, and community — your seva continues to bloom.
                  </p>
                  <Link
                    href="/donate"
                    className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[hsl(220_90%_18%)] shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.03]"
                    style={{ background: "var(--gradient-gold)" }}
                  >
                    <Heart className="h-4 w-4" /> Donate Now
                  </Link>
                </div>
              </motion.div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Check className="h-3.5 w-3.5 text-emerald-600" /> Every completed offering has a receipt
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  Search your history by seva, month or receipt number, then download the PDF — all donations
                  are 80G tax-exempt.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-10 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-gold" />
            All donations are 80G tax-exempt · Receipts are available instantly for every completed offering.
          </p>
        </main>
      </div>
    </PageLayout>
  );
}
