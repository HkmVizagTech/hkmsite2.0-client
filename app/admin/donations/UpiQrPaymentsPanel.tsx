"use client";

// QR payments — every payment received on the website UPI QR (Razorpay
// qr_TkXLOSHxVdX10H), fetched live from Razorpay. Each one shows the donor it's
// already matched to, or the donors who clicked "Pay with PhonePe" for the same
// amount around that time, with one-click Match. Matching completes the
// donation through the normal receipt / 80G / WhatsApp pipeline.

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, RefreshCw } from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

interface OpenClaim {
  _id: string;
  donorName: string;
  donorMobile?: string;
  amount: number;
  sevaName?: string;
  sourcePage?: string;
  minutesFromClaim?: number;
  upiFallback?: { status?: string; openedAt?: string; claimedAt?: string; payerName?: string };
}

interface QrPayment {
  id: string;
  amount: number;
  vpa: string;
  contact: string;
  email: string;
  rrn: string;
  createdAt: string;
  matchedTo: { _id: string; donorName: string; amount: number; sevaName?: string; receiptNumber?: string } | null;
  suggestions: OpenClaim[];
}

const fmt = (s?: string) =>
  s ? new Date(s).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }) : "—";
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const ago = (m?: number) => (m === undefined ? "" : m >= 0 ? `paid ${m} min after` : `paid ${-m} min before`);

export default function UpiQrPaymentsPanel({ onMatched }: { onMatched?: () => void }) {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<{ qrId: string; account: string; payments: QrPayment[]; openClaims: OpenClaim[] } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<Record<string, string>>({});
  const [pick, setPick] = useState<Record<string, string>>({});

  const load = async (d = days) => {
    setLoading(true);
    setError("");
    try {
      const res = await authFetch(`${API_URL}/donations/upi-qr-payments?days=${d}`, { credentials: "include" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error([json.message, ...(json.errors || [])].filter(Boolean).join(" · ") || "Could not load QR payments");
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load QR payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const match = async (payment: QrPayment, donationId: string, force = false) => {
    setBusy(payment.id);
    setMsg((m) => ({ ...m, [payment.id]: "" }));
    try {
      const res = await authFetch(`${API_URL}/donations/upi-match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ donationId, paymentId: payment.id, force }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 409 && json.needsForce) {
        if (confirm(json.message)) return match(payment, donationId, true);
        return;
      }
      if (!res.ok) throw new Error(json.message || "Match failed");
      setMsg((m) => ({ ...m, [payment.id]: json.message || "Matched." }));
      onMatched?.();
      setTimeout(() => load(), 1000);
    } catch (e) {
      setMsg((m) => ({ ...m, [payment.id]: e instanceof Error ? e.message : "Match failed" }));
    } finally {
      setBusy(null);
    }
  };

  const unmatched = (data?.payments || []).filter((p) => !p.matchedTo).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {[1, 7, 30].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`rounded-full border px-3 py-1.5 text-sm ${days === d ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
          >
            {d === 1 ? "Last 24 hours" : `Last ${d} days`}
          </button>
        ))}
        <Button variant="ghost" size="sm" onClick={() => load()} disabled={loading}>
          <RefreshCw className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
        {data && (
          <span className="text-xs text-muted-foreground">
            QR {data.qrId} · {data.payments.length} payments · {unmatched} not matched
          </span>
        )}
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {loading && !data ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Fetching payments from Razorpay…
        </div>
      ) : data && data.payments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No payments on the QR in this period.</p>
      ) : (
        (data?.payments || []).map((p) => (
          <Card key={p.id} className={p.matchedTo ? "opacity-70" : ""}>
            <CardContent className="space-y-2 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">
                    {inr(p.amount)} · {fmt(p.createdAt)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    From {p.vpa || p.contact || "unknown UPI ID"} · UPI ref <span className="font-mono">{p.rrn || "—"}</span> ·{" "}
                    <span className="font-mono text-xs">{p.id}</span>
                  </p>
                </div>
                {p.matchedTo ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Matched to {p.matchedTo.donorName}
                    {p.matchedTo.receiptNumber ? ` · ${p.matchedTo.receiptNumber}` : ""}
                  </span>
                ) : (
                  <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">Not matched</span>
                )}
              </div>

              {!p.matchedTo && (
                <>
                  {p.suggestions.length > 0 ? (
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-muted-foreground">Donors who clicked PhonePe for {inr(p.amount)} around then:</p>
                      {p.suggestions.map((s) => (
                        <div key={s._id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm">
                          <span>
                            <strong>{s.donorName}</strong> · {s.donorMobile} · {s.sevaName} ({s.sourcePage})
                            {s.upiFallback?.payerName ? <> · UPI name <strong>{s.upiFallback.payerName}</strong></> : null}
                            <span className="text-muted-foreground"> · {ago(s.minutesFromClaim)} {s.upiFallback?.status === "claimed" ? "“I've paid”" : "opening PhonePe"}</span>
                          </span>
                          <Button size="sm" disabled={busy === p.id} onClick={() => match(p, s._id)}>
                            Match
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No donor with the same amount clicked PhonePe around this time.</p>
                  )}
                  {(data?.openClaims || []).length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        className="h-9 rounded-md border bg-background px-2 text-sm"
                        value={pick[p.id] || ""}
                        onChange={(e) => setPick((x) => ({ ...x, [p.id]: e.target.value }))}
                      >
                        <option value="">Match to another donor…</option>
                        {(data?.openClaims || []).map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.donorName} · {inr(c.amount)} · {c.sevaName} · {fmt(c.upiFallback?.openedAt)}
                          </option>
                        ))}
                      </select>
                      <Button size="sm" variant="outline" disabled={!pick[p.id] || busy === p.id} onClick={() => match(p, pick[p.id])}>
                        Match
                      </Button>
                    </div>
                  )}
                </>
              )}
              {msg[p.id] && <p className="text-sm">{msg[p.id]}</p>}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
