"use client";

// UPI to match — donations whose Razorpay checkout failed or was closed and
// where the donor then chose "Pay with PhonePe / UPI" (components/
// UpiFallbackDialog). Those UPI payments go to the website UPI QR without a
// Razorpay order, so they're matched here by hand:
//   - each claim shows the amount, the name in the donor's UPI app, and when
//     they opened the app / tapped "I've paid"
//   - "Find payment" lists the order-less UPI payments Razorpay received
//     around that time (amount matches first)
//   - "Match" completes the donation through the normal pipeline
//     (receipt, 80G, DCC, WhatsApp)

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2, QrCode, RefreshCw, Search, Users, XCircle } from "lucide-react";
import UpiQrPaymentsPanel from "./UpiQrPaymentsPanel";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

// "open" = everyone who clicked Pay with PhonePe / another UPI app from the
// fallback (whether or not they then tapped "I've paid").
type Status = "open" | "matched" | "dismissed";

interface Claim {
  _id: string;
  donorName: string;
  donorMobile?: string;
  donorEmail?: string;
  amount: number;
  sevaName?: string;
  type?: string;
  sourcePage?: string;
  status: string;
  createdAt: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  receiptNumber?: string;
  upiFallback: {
    status: "opened" | "claimed" | "matched" | "dismissed";
    app?: string;
    via?: "dialog" | "strip";
    openedAt?: string;
    claimedAt?: string;
    payerName?: string;
    matchedAt?: string;
    matchedPaymentId?: string;
    note?: string;
  };
}

interface Candidate {
  id: string;
  account: string;
  amount: number;
  vpa: string;
  email: string;
  contact: string;
  rrn: string;
  createdAt: string;
  used: boolean;
  amountMatches: boolean;
  minutesFromClaim: number;
}

const fmt = (s?: string) =>
  s ? new Date(s).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }) : "—";
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const STATUS_LABEL: Record<Status, string> = {
  open: "To match",
  matched: "Matched",
  dismissed: "Dismissed",
};

export default function UpiMatchTab() {
  const [view, setView] = useState<"donors" | "qr">("donors");
  const [status, setStatus] = useState<Status>("open");
  const [claims, setClaims] = useState<Claim[] | null>(null);
  const [counts, setCounts] = useState<Partial<Record<Status, number>>>({});
  const [loading, setLoading] = useState(true);
  const [cands, setCands] = useState<Record<string, { loading: boolean; list?: Candidate[]; errors?: string[]; accounts?: string[] }>>({});
  const [manual, setManual] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<Record<string, string>>({});

  const load = async (s: Status = status) => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_URL}/donations/upi-claims?status=${s}`, { credentials: "include" });
      const json = await res.json();
      if (res.ok) {
        setClaims(json.claims || []);
        const c = json.counts || {};
        setCounts({ open: (c.claimed || 0) + (c.opened || 0), matched: c.matched || 0, dismissed: c.dismissed || 0 });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const findPayments = async (id: string) => {
    setCands((c) => ({ ...c, [id]: { loading: true } }));
    try {
      const res = await authFetch(`${API_URL}/donations/upi-claims/${id}/candidates`, { credentials: "include" });
      const json = await res.json();
      setCands((c) => ({
        ...c,
        [id]: res.ok
          ? { loading: false, list: json.payments || [], errors: json.errors || [], accounts: json.accountsChecked || [] }
          : { loading: false, list: [], errors: [json.message || "Failed to load"] },
      }));
    } catch {
      setCands((c) => ({ ...c, [id]: { loading: false, list: [], errors: ["Network error"] } }));
    }
  };

  const match = async (claim: Claim, body: { paymentId?: string; reference?: string }, force = false) => {
    setBusy(claim._id);
    setMsg((m) => ({ ...m, [claim._id]: "" }));
    try {
      const res = await authFetch(`${API_URL}/donations/upi-match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ donationId: claim._id, ...body, force }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 409 && json.needsForce) {
        if (confirm(`${json.message}`)) return match(claim, body, true);
        return;
      }
      if (!res.ok) throw new Error(json.message || "Match failed");
      setMsg((m) => ({ ...m, [claim._id]: json.message || "Matched." }));
      setTimeout(() => load(), 1200);
    } catch (e) {
      setMsg((m) => ({ ...m, [claim._id]: e instanceof Error ? e.message : "Match failed" }));
    } finally {
      setBusy(null);
    }
  };

  const dismiss = async (claim: Claim) => {
    const note = prompt(`Dismiss the UPI claim from ${claim.donorName} (${inr(claim.amount)})? Optional note:`, "");
    if (note === null) return;
    setBusy(claim._id);
    try {
      const res = await authFetch(`${API_URL}/donations/upi-dismiss`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ donationId: claim._id, note }),
      });
      if (!res.ok) alert((await res.json().catch(() => ({}))).message || "Failed");
      load();
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">UPI to match</h2>
        <p className="text-sm text-muted-foreground">
          Donors whose online payment failed or was closed and who clicked “Pay with PhonePe / UPI”, and the payments received
          on the website UPI QR. Match a donor to a payment and the receipt is sent automatically.
        </p>
      </div>

      <div className="inline-flex rounded-lg border p-1">
        <button
          onClick={() => setView("donors")}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${view === "donors" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
        >
          <Users className="h-4 w-4" /> Donors who clicked PhonePe
        </button>
        <button
          onClick={() => setView("qr")}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${view === "qr" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
        >
          <QrCode className="h-4 w-4" /> QR payments
        </button>
      </div>

      {view === "qr" ? (
        <UpiQrPaymentsPanel onMatched={() => load()} />
      ) : (
      <>

      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(STATUS_LABEL) as Status[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-full border px-3 py-1.5 text-sm ${status === s ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
          >
            {STATUS_LABEL[s]}
            {counts[s] ? <span className="ml-1.5 font-semibold">{counts[s]}</span> : null}
          </button>
        ))}
        <Button variant="ghost" size="sm" onClick={() => load()} disabled={loading}>
          <RefreshCw className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {loading && !claims ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : (claims || []).length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing here.</p>
      ) : (
        (claims || []).map((c) => {
          const cand = cands[c._id];
          const uf = c.upiFallback || ({} as Claim["upiFallback"]);
          const open = uf.status === "claimed" || uf.status === "opened";
          return (
            <Card key={c._id}>
              <CardContent className="space-y-3 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {c.donorName} · {inr(c.amount)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {c.sevaName || c.type} · {c.sourcePage} · {c.donorMobile}
                      {c.donorEmail ? ` · ${c.donorEmail}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {uf.status === "claimed" && (
                      <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">Tapped “I've paid”</span>
                    )}
                    {uf.status === "opened" && (
                      <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                        Clicked {uf.app === "phonepe" ? "PhonePe" : "UPI"} — not confirmed
                      </span>
                    )}
                    {(uf.status === "opened" || uf.status === "claimed") && (
                      <span className="rounded-md bg-muted px-2 py-1 text-xs">
                        {uf.via === "strip" ? "From the PhonePe box on the page" : "From the payment-failed pop-up"}
                      </span>
                    )}
                    <span className="rounded-md bg-muted px-2 py-1 text-xs">Razorpay: {c.status}</span>
                  </div>
                </div>

                <div className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <p>
                    <span className="text-muted-foreground">Name in UPI app:</span>{" "}
                    <strong>{uf.payerName || "—"}</strong>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Checkout started:</span> {fmt(c.createdAt)}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Opened {uf.app === "phonepe" ? "PhonePe" : "UPI app"}:</span> {fmt(uf.openedAt)}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Tapped “I've paid”:</span> {fmt(uf.claimedAt)}
                  </p>
                </div>

                {uf.status === "matched" && (
                  <p className="text-sm text-green-700">
                    <CheckCircle2 className="mr-1 inline h-4 w-4" />
                    Matched {fmt(uf.matchedAt)} {uf.matchedPaymentId ? `· ${uf.matchedPaymentId}` : ""}{" "}
                    {c.receiptNumber ? `· Receipt ${c.receiptNumber}` : ""}
                  </p>
                )}
                {uf.status === "dismissed" && <p className="text-sm text-muted-foreground">Dismissed {uf.note ? `— ${uf.note}` : ""}</p>}

                {open && (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => findPayments(c._id)} disabled={cand?.loading}>
                        {cand?.loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Search className="mr-1 h-4 w-4" />}
                        Find payment
                      </Button>
                      <Input
                        className="h-9 w-64"
                        placeholder="pay_… or UPI reference (UTR)"
                        value={manual[c._id] || ""}
                        onChange={(e) => setManual((m) => ({ ...m, [c._id]: e.target.value }))}
                      />
                      <Button
                        size="sm"
                        disabled={busy === c._id || !(manual[c._id] || "").trim()}
                        onClick={() => {
                          const v = (manual[c._id] || "").trim();
                          match(c, v.startsWith("pay_") ? { paymentId: v } : { reference: v });
                        }}
                      >
                        Match
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600" onClick={() => dismiss(c)} disabled={busy === c._id}>
                        <XCircle className="mr-1 h-4 w-4" /> Dismiss
                      </Button>
                    </div>
                    {msg[c._id] && <p className="text-sm">{msg[c._id]}</p>}

                    {cand && !cand.loading && (
                      <div className="overflow-x-auto rounded-lg border">
                        {cand.accounts && (
                          <p className="border-b bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
                            UPI payments without an order, 15 min before opening the app to 6 h after “I've paid” · accounts:{" "}
                            {cand.accounts.join(", ") || "none configured"}
                            {cand.errors && cand.errors.length ? ` · errors: ${cand.errors.join("; ")}` : ""}
                          </p>
                        )}
                        {(cand.list || []).length === 0 ? (
                          <p className="px-3 py-3 text-sm text-muted-foreground">
                            No matching payments found. Check the Razorpay dashboard and paste the payment ID or UPI reference above.
                          </p>
                        ) : (
                          <table className="w-full text-sm">
                            <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
                              <tr>
                                <th className="px-3 py-2">Time</th>
                                <th className="px-3 py-2">Amount</th>
                                <th className="px-3 py-2">Payer UPI ID</th>
                                <th className="px-3 py-2">UPI ref</th>
                                <th className="px-3 py-2">From claim</th>
                                <th className="px-3 py-2" />
                              </tr>
                            </thead>
                            <tbody>
                              {cand.list!.map((p) => (
                                <tr key={p.id} className={`border-t ${p.used ? "opacity-40" : ""}`}>
                                  <td className="px-3 py-2 whitespace-nowrap">{fmt(p.createdAt)}</td>
                                  <td className={`px-3 py-2 font-semibold ${p.amountMatches ? "text-green-700" : ""}`}>{inr(p.amount)}</td>
                                  <td className="px-3 py-2">{p.vpa || p.contact || "—"}</td>
                                  <td className="px-3 py-2 font-mono text-xs">{p.rrn || p.id}</td>
                                  <td className="px-3 py-2 whitespace-nowrap">
                                    {p.minutesFromClaim >= 0 ? "+" : ""}
                                    {p.minutesFromClaim} min
                                  </td>
                                  <td className="px-3 py-2 text-right">
                                    {p.used ? (
                                      <span className="text-xs">already matched</span>
                                    ) : (
                                      <Button size="sm" disabled={busy === c._id} onClick={() => match(c, { paymentId: p.id })}>
                                        Match
                                      </Button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
      </>
      )}
    </div>
  );
}
