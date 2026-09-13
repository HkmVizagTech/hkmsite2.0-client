"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, User, Phone, Download, LogOut, Heart, IndianRupee } from "lucide-react";
import { donorFetch, clearDonorToken, getDonorToken } from "@/lib/donorAuthClient";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

interface DonorProfile {
  donorId: string;
  name: string;
  mobile: string;
  email?: string;
  preacherName: string | null;
}

interface Donation {
  _id: string;
  amount: number;
  sevaName?: string;
  type?: string;
  status: string;
  receiptNumber?: string;
  createdAt: string;
}

export default function DonorDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<DonorProfile | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getDonorToken()) {
      router.replace("/donor/login");
      return;
    }
    (async () => {
      try {
        const [meRes, donationsRes] = await Promise.all([
          donorFetch(`${API_URL}/donor/me`),
          donorFetch(`${API_URL}/donor/my-donations`),
        ]);
        if (meRes.status === 401) { router.replace("/donor/login"); return; }
        const meData = await meRes.json();
        const donationsData = await donationsRes.json();
        setProfile(meData.donor);
        setDonations(donationsData.donations || []);
      } catch {
        setError("Could not load your account. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
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
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fef6e4] px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold text-[#772036]">My Donations</h1>
          <button onClick={logout} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" /> Log Out
          </button>
        </div>

        {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

        {profile && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#772036]" />
                <span className="text-lg font-bold">{profile.name}</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Donor ID</span>
                  <p className="font-mono font-semibold">{profile.donorId}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Mobile</span>
                  <p className="flex items-center gap-1 font-semibold"><Phone className="h-3.5 w-3.5" /> {profile.mobile}</p>
                </div>
                {profile.preacherName && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Your Preacher</span>
                    <p className="font-semibold">{profile.preacherName}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">Donation History</h2>
              <Link href="/donate">
                <Button size="sm" className="gap-1.5"><Heart className="h-3.5 w-3.5" /> Donate Again</Button>
              </Link>
            </div>
            {donations.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No donations found yet.</p>
            ) : (
              <div className="space-y-2">
                {donations.map((d) => (
                  <div key={d._id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                    <div>
                      <span className="flex items-center gap-1 font-semibold">
                        <IndianRupee className="h-3.5 w-3.5" /> {d.amount.toLocaleString("en-IN")}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {d.sevaName || d.type || "-"} · {new Date(d.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    {d.status === "completed" && d.receiptNumber ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={downloadingId === d._id}
                        onClick={() => downloadReceipt(d._id, d.receiptNumber)}
                        className="gap-1.5"
                      >
                        {downloadingId === d._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                        Receipt
                      </Button>
                    ) : (
                      <span className="text-xs capitalize text-muted-foreground">{d.status}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
