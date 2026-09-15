"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, History, Repeat, UserCog, Heart, ShieldCheck, TrendingUp, CalendarDays, MessageSquareText } from "lucide-react";
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
  children,
  className = "",
}: {
  icon: typeof History;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      className={`overflow-hidden rounded-3xl border border-border bg-card shadow-warm ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-border/70 bg-gradient-to-r from-gold/10 via-transparent to-transparent px-5 py-4 sm:px-7">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-[var(--shadow-gold)]"
          style={{ background: "var(--gradient-gold)" }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
          <h2 className="font-heading text-lg font-bold text-foreground">{title}</h2>
        </div>
      </div>
      <div className="p-5 sm:p-7">{children}</div>
    </motion.section>
  );
}

export default function DonorDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<DonorProfile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4" style={{ background: "var(--gradient-warm)" }}>
        <span
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-gold)]"
          style={{ background: "var(--gradient-gold)" }}
        >
          <Loader2 className="h-6 w-6 animate-spin" />
        </span>
        <p className="text-sm font-medium text-muted-foreground">Preparing your seva journey…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-warm)" }}>
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

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
          {/* Left column — the giving story */}
          <div className="space-y-6">
            <SectionCard icon={History} eyebrow="Your Sevas" title="Donation History">
              <DonationHistorySection donations={donations} downloadingId={downloadingId} onDownload={downloadReceipt} />
            </SectionCard>

            <SectionCard icon={TrendingUp} eyebrow="Giving Insights" title="Your Giving at a Glance">
              <GivingGraphs />
            </SectionCard>

            <SectionCard icon={Repeat} eyebrow="Monthly Seva" title="Recurring Donations">
              <RecurringDonationsSection
                subscriptions={subscriptions}
                donorFetch={donorFetch}
                apiUrl={API_URL}
                onChanged={loadAll}
              />
            </SectionCard>

            <SectionCard icon={MessageSquareText} eyebrow="Support" title="Questions or Issues">
              <MyIssues />
            </SectionCard>
          </div>

          {/* Right column — account details & continue-the-journey */}
          <div className="space-y-6">
            <SectionCard icon={CalendarDays} eyebrow="Festivals & Occasions" title="Upcoming Sevas">
              <NextSevas />
            </SectionCard>

            <SectionCard icon={UserCog} eyebrow="Your Details" title="My Profile">
              {profile ? (
                <DonorProfileSection
                  profile={profile}
                  donorFetch={donorFetch}
                  apiUrl={API_URL}
                  onSaved={(updated) => setProfile((p) => (p ? { ...p, ...updated } : p))}
                />
              ) : null}
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
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">Continue Your Seva</p>
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
          </div>
        </div>

        <p className="mt-10 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-gold" />
          All donations are 80G tax-exempt · Receipts are available instantly for every completed offering.
        </p>
      </main>
    </div>
  );
}
