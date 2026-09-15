"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, History, Repeat, UserCog } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { donorFetch, clearDonorToken, getDonorToken } from "@/lib/donorAuthClient";
import DonorHero from "@/components/donor/DonorHero";
import DonationHistorySection, { Donation } from "@/components/donor/DonationHistorySection";
import RecurringDonationsSection, { Subscription } from "@/components/donor/RecurringDonationsSection";
import DonorProfileSection from "@/components/donor/DonorProfileSection";
import type { PrasadamAddress } from "@/components/AddressForm";

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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {error && <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</div>}

        {profile && stats && (
          <DonorHero
            name={profile.name}
            donorId={profile.donorId}
            preacherName={profile.preacherName}
            lifetimeTotal={stats.lifetimeTotal}
            donationCount={stats.donationCount}
            sevaCount={stats.sevaCount}
            donorSince={stats.donorSince || profile.donorSince}
            onLogout={logout}
          />
        )}

        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="history" className="gap-1.5">
              <History className="h-3.5 w-3.5" /> <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="recurring" className="gap-1.5">
              <Repeat className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Recurring</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-1.5">
              <UserCog className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="rounded-2xl border border-border bg-card p-4 sm:p-6">
            <DonationHistorySection donations={donations} downloadingId={downloadingId} onDownload={downloadReceipt} />
          </TabsContent>

          <TabsContent value="recurring" className="rounded-2xl border border-border bg-card p-4 sm:p-6">
            <RecurringDonationsSection
              subscriptions={subscriptions}
              donorFetch={donorFetch}
              apiUrl={API_URL}
              onChanged={loadAll}
            />
          </TabsContent>

          <TabsContent value="profile" className="rounded-2xl border border-border bg-card p-4 sm:p-6">
            {profile && (
              <DonorProfileSection
                profile={profile}
                donorFetch={donorFetch}
                apiUrl={API_URL}
                onSaved={(updated) => setProfile((p) => (p ? { ...p, ...updated } : p))}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
