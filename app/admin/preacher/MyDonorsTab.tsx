"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authClient";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, User, Phone, IndianRupee } from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

interface Donor {
  _id: string;
  donorId: string;
  name: string;
  mobile: string;
  email?: string;
  totalAmount: number;
  donationCount: number;
  lastDonatedAt: string | null;
}

interface DonorDonation {
  _id: string;
  amount: number;
  sevaName?: string;
  type?: string;
  status: string;
  receiptNumber?: string;
  createdAt: string;
}

export default function MyDonorsTab() {
  const [donors, setDonors] = useState<Donor[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Donor | null>(null);
  const [donations, setDonations] = useState<DonorDonation[] | null>(null);
  const [loadingDonations, setLoadingDonations] = useState(false);

  useEffect(() => {
    authFetch(`${API_URL}/preacher/my-donors`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setDonors(data.donors || []))
      .finally(() => setLoading(false));
  }, []);

  const openDonor = async (donor: Donor) => {
    setSelected(donor);
    setDonations(null);
    setLoadingDonations(true);
    try {
      const res = await authFetch(`${API_URL}/preacher/my-donors/${donor._id}/donations`, { credentials: "include" });
      const data = await res.json();
      setDonations(data.donations || []);
    } finally {
      setLoadingDonations(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">My Donors</h2>
        <p className="text-sm text-muted-foreground mt-1">Donors currently assigned to you.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
        </div>
      ) : !donors || donors.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No donors assigned to you yet — raise a receipt for a new donor to get started.</CardContent></Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {donors.map((d) => (
            <Card key={d._id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openDonor(d)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{d.name}</span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{d.donorId}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {d.mobile}
                </p>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 font-semibold text-primary">
                    <IndianRupee className="h-3.5 w-3.5" /> {d.totalAmount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-muted-foreground">{d.donationCount} donation{d.donationCount === 1 ? "" : "s"}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold">{selected.name}</h3>
                <p className="text-xs text-muted-foreground">{selected.donorId} · {selected.mobile}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            {loadingDonations ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
              </div>
            ) : (
              <div className="space-y-2">
                {(donations || []).map((d) => (
                  <div key={d._id} className="rounded-lg border border-border p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">₹{d.amount.toLocaleString("en-IN")}</span>
                      <span className="text-xs text-muted-foreground">{new Date(d.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{d.sevaName || d.type || "-"} · {d.status}</p>
                    {d.receiptNumber && <p className="text-xs text-muted-foreground mt-0.5">Receipt: {d.receiptNumber}</p>}
                  </div>
                ))}
                {donations && donations.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No donations recorded yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
