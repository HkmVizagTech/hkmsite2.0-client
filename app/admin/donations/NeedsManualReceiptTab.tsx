"use client";

// Needs Manual Receipt — completed donations where DCC already has the
// transaction on record (their "Transaction details exist" response) but
// we never captured a receipt number. DCC's API is create-only with no
// lookup/search endpoint, so this can't be auto-fetched — this list exists
// to make resolving the backlog fast: find each one in DCC directly, paste
// the receipt number, done.

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, ExternalLink, AlertTriangle } from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

interface NeedsReceiptDonation {
  _id: string;
  donorName: string;
  donorEmail?: string;
  donorMobile?: string;
  amount: number;
  sevaName?: string;
  type?: string;
  createdAt: string;
  dccSyncStatus?: string;
  dccSyncError?: string;
  razorpayPaymentId?: string;
  utrNumber?: string;
}

export default function NeedsManualReceiptTab() {
  const [list, setList] = useState<NeedsReceiptDonation[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_URL}/donations/needs-manual-receipt`, { credentials: "include" });
      const json = await res.json();
      if (res.ok) setList(json.donations || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const save = async (id: string) => {
    const val = (values[id] || "").trim();
    if (!val) return;
    setSaving(id);
    try {
      const res = await authFetch(`${API_URL}/donations/${id}/receipt-number`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ receiptNumber: val }),
      });
      if (res.ok) {
        setSavedIds((prev) => new Set(prev).add(id));
      } else {
        const j = await res.json().catch(() => ({}));
        alert(j.message || "Failed to save receipt number.");
      }
    } catch {
      alert("Network error while saving.");
    } finally {
      setSaving(null);
    }
  };

  const pending = (list || []).filter((d) => !savedIds.has(d._id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" /> Needs Manual Receipt
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          DCC already has these transactions on record from a prior sync attempt, but never sent back a
          receipt number — their API has no way to look one up automatically. Find each one in{" "}
          <a href="https://vhkmsurabhi.com" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-0.5">
            DCC <ExternalLink className="h-3 w-3" />
          </a>{" "}
          by donor name, amount, and date, then paste the receipt number below.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
        </div>
      ) : pending.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {list && list.length > 0 && list.every((d) => savedIds.has(d._id))
              ? "All caught up — every receipt on this list has been entered."
              : "Nothing here right now — no donations are waiting on a manual DCC receipt."}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {pending.map((d) => (
            <Card key={d._id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="font-semibold">{d.donorName} — ₹{d.amount.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.sevaName || d.type || "-"} · {d.donorEmail || d.donorMobile || "no contact"} ·{" "}
                    {new Date(d.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    {d.razorpayPaymentId && <> · {d.razorpayPaymentId}</>}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Input
                    placeholder="e.g. HKMI|2026|D/VSP|5413"
                    value={values[d._id] || ""}
                    onChange={(e) => setValues({ ...values, [d._id]: e.target.value })}
                    className="w-56"
                  />
                  <Button
                    size="sm"
                    disabled={saving === d._id || !(values[d._id] || "").trim()}
                    onClick={() => save(d._id)}
                    className="gap-1.5"
                  >
                    {saving === d._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
