"use client";

// DCC receipts — every successful donation still without a DCC receipt
// number. The server pushes these to DCC automatically every 10 minutes
// (DCC answers a repeat push with the receipt it already issued) and sends the
// WhatsApp receipt as soon as a number comes back. This tab shows where each
// one stands, lets admin push now, and takes a receipt number typed in from
// DCC for the few the sweep can't safely push (see services/dccSweep.service.js
// on the server).
//
// Used by the main admin (/admin/donations, all donations) and by the
// /donations page admin (/donations/admin, that page's donations only) —
// `api` picks the endpoints.

import { useCallback, useEffect, useRef, useState } from "react";
import { authFetch } from "@/lib/authClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, ExternalLink, RefreshCw, Send, UploadCloud } from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

type State = "queued" | "retrying" | "needs_admin" | "pushing";

interface Row {
  _id: string;
  donorName: string;
  donorMobile?: string;
  amount: number;
  sevaName?: string;
  createdAt: string;
  manualEntry: boolean;
  transactionId: string | null;
  attempts: number;
  lastAttemptAt: string | null;
  lastError: string | null;
  state: State;
  reason: string | null;
  nextAttemptAt: string | null;
}

interface Status {
  configured: boolean;
  running: boolean;
  autoSince: string;
  counts: {
    missing: number;
    autoQueued: number;
    retrying: number;
    needsAdmin: number;
    pushing: number;
    beforeAutoSince: number;
    receiptNoWhatsapp: number;
    recovered7d: number;
  };
  donations: Row[];
}

const fmtDate = (v: string) =>
  new Date(v).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const STATE_BADGE: Record<State, { label: string; cls: string }> = {
  queued: { label: "Will push", cls: "bg-blue-100 text-blue-700" },
  retrying: { label: "Retrying", cls: "bg-amber-100 text-amber-700" },
  pushing: { label: "Pushing…", cls: "bg-purple-100 text-purple-700" },
  needs_admin: { label: "Needs you", cls: "bg-red-100 text-red-700" },
};

const REASON_TEXT: Record<string, string> = {
  before_auto_since: "From before the site pushed to DCC — it may already be in DCC. Check DCC, then push or enter the receipt.",
  no_transaction_id: "No payment ID / UTR, so DCC can't tell a repeat push apart — pushing again could create a second receipt. Check DCC first.",
  gave_up: "DCC kept refusing it. Correct what DCC said above (often the phone number) and push again — or enter the receipt number if it is already in DCC.",
  just_completed: "Just completed — its own push is running.",
};

export interface DccReceiptsApi {
  status: string;
  pushAll: string;
  pushOne: (id: string) => string;
  receiptNumber: (id: string) => string;
}

// Main admin: all donations.
const ALL_DONATIONS_API: DccReceiptsApi = {
  status: "/donations/dcc-status",
  pushAll: "/donations/dcc-push-all",
  pushOne: (id) => `/donations/${id}/resend-receipt`,
  receiptNumber: (id) => `/donations/${id}/receipt-number`,
};

// /donations page admin: that page's donations only.
export const DONATIONS_PAGE_API: DccReceiptsApi = {
  status: "/donations-admin/dcc-status",
  pushAll: "/donations-admin/dcc-push-all",
  pushOne: (id) => `/donations-admin/transactions/${id}/dcc-push`,
  receiptNumber: (id) => `/donations-admin/transactions/${id}/receipt-number`,
};

export default function DccReceiptsTab({ api = ALL_DONATIONS_API, scopeNote }: { api?: DccReceiptsApi; scopeNote?: string }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [includeOld, setIncludeOld] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [values, setValues] = useState<Record<string, string>>({});
  const [pushAllMsg, setPushAllMsg] = useState<string | null>(null);
  const poll = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await authFetch(`${API_URL}${api.status}${includeOld ? "?includeOld=true" : ""}`, { credentials: "include" });
      const json = await res.json();
      if (res.ok) setStatus(json);
      return json as Status;
    } finally {
      setLoading(false);
    }
  }, [includeOld, api]);

  useEffect(() => {
    setLoading(true);
    load();
    return () => {
      if (poll.current) clearTimeout(poll.current);
    };
  }, [load]);

  // While a push-all runs on the server, refresh every few seconds.
  const followRun = useCallback(() => {
    if (poll.current) clearTimeout(poll.current);
    poll.current = setTimeout(async () => {
      const s = await load().catch(() => null);
      if (s && s.running) followRun();
      else setPushAllMsg("Done — list updated.");
    }, 4000);
  }, [load]);

  const pushAll = async () => {
    setPushAllMsg(null);
    setBusy("__all");
    try {
      const res = await authFetch(`${API_URL}${api.pushAll}`, { method: "POST", credentials: "include" });
      const j = await res.json().catch(() => ({}));
      setPushAllMsg(j.message || (res.ok ? "Pushing to DCC now." : "Could not start the push."));
      if (res.ok) followRun();
    } catch {
      setPushAllMsg("Network error.");
    } finally {
      setBusy(null);
    }
  };

  const pushOne = async (row: Row) => {
    if (row.reason === "no_transaction_id" || row.reason === "before_auto_since") {
      const ok = window.confirm(
        `${REASON_TEXT[row.reason]}\n\nPush ${row.donorName} — ₹${row.amount.toLocaleString("en-IN")} to DCC now?`
      );
      if (!ok) return;
    }
    setBusy(row._id);
    try {
      const res = await authFetch(`${API_URL}${api.pushOne(row._id)}`, { method: "POST", credentials: "include" });
      const j = await res.json().catch(() => ({}));
      setNotes((n) => ({ ...n, [row._id]: res.ok ? `✓ ${j.message}` : `✗ ${j.error || j.message || "Failed"}` }));
      if (res.ok) load();
    } catch {
      setNotes((n) => ({ ...n, [row._id]: "✗ Network error" }));
    } finally {
      setBusy(null);
    }
  };

  const saveReceipt = async (row: Row) => {
    const val = (values[row._id] || "").trim();
    if (!val) return;
    setBusy(row._id);
    try {
      const res = await authFetch(`${API_URL}${api.receiptNumber(row._id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ receiptNumber: val }),
      });
      const j = await res.json().catch(() => ({}));
      setNotes((n) => ({ ...n, [row._id]: res.ok ? `✓ ${j.message}` : `✗ ${j.message || "Failed to save"}` }));
      if (res.ok) load();
    } catch {
      setNotes((n) => ({ ...n, [row._id]: "✗ Network error" }));
    } finally {
      setBusy(null);
    }
  };

  const c = status?.counts;
  const rows = status?.donations || [];
  // Rows that just got a receipt drop off the list on reload; keep their note visible.
  const doneNotes = Object.entries(notes).filter(([id, msg]) => msg.startsWith("✓") && !rows.some((r) => r._id === id));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl">
          <h2 className="text-xl font-bold">DCC receipts</h2>
          {scopeNote && <p className="text-xs font-medium text-primary mt-0.5">{scopeNote}</p>}
          <p className="text-sm text-muted-foreground mt-1">
            Every successful donation is pushed to DCC until it has a receipt number, then the donor gets the WhatsApp receipt.
            This runs by itself every 10 minutes; if DCC already has a donation, it sends back the receipt it issued.
            Rows marked <span className="font-medium text-red-600">Needs you</span> can&apos;t be pushed safely on their own — check{" "}
            <a href="https://vhkmsurabhi.com" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-0.5">
              DCC <ExternalLink className="h-3 w-3" />
            </a>{" "}
            and push or enter the receipt number.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => { setLoading(true); load(); }} className="gap-1.5">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button size="sm" onClick={pushAll} disabled={busy === "__all" || !!status?.running || !status?.configured} className="gap-1.5">
            {busy === "__all" || status?.running ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            {status?.running ? "Pushing…" : "Push all to DCC now"}
          </Button>
        </div>
      </div>

      {pushAllMsg && <p className="text-sm text-muted-foreground">{pushAllMsg}</p>}
      {status && !status.configured && (
        <p className="text-sm text-red-600">DCC is not configured on the server (DCC_API_KEY), so nothing can be pushed.</p>
      )}

      {c && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Without receipt", value: c.missing, sub: "since " + new Date(status!.autoSince).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
            { label: "Will push / retrying", value: c.autoQueued + c.retrying + c.pushing, sub: "handled automatically" },
            { label: "Needs you", value: c.needsAdmin, sub: "check DCC first", alert: c.needsAdmin > 0 },
            { label: "Recovered from DCC", value: c.recovered7d, sub: "last 7 days" },
          ].map((k) => (
            <Card key={k.label}>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className={`text-2xl font-bold ${k.alert ? "text-red-600" : ""}`}>{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {c && (c.receiptNoWhatsapp > 0 || c.beforeAutoSince > 0) && (
        <div className="text-sm text-muted-foreground space-y-1">
          {c.receiptNoWhatsapp > 0 && (
            <p>{c.receiptNoWhatsapp} donation(s) have a receipt number but the WhatsApp receipt didn&apos;t go out — see the Needs WhatsApp tab.</p>
          )}
          {c.beforeAutoSince > 0 && (
            <p>
              {c.beforeAutoSince} older donation(s) from before the site pushed to DCC have no receipt here.{" "}
              <button type="button" className="underline" onClick={() => setIncludeOld((v) => !v)}>
                {includeOld ? "Hide them" : "Show them"}
              </button>
            </p>
          )}
        </div>
      )}

      {doneNotes.length > 0 && (
        <div className="space-y-1">
          {doneNotes.map(([id, msg]) => (
            <p key={id} className="text-sm text-green-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> {msg.replace(/^✓ /, "")}
            </p>
          ))}
        </div>
      )}

      {loading && !status ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
        </div>
      ) : rows.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            All caught up — every successful donation has its DCC receipt number.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const badge = STATE_BADGE[r.state];
            const note = notes[r._id];
            return (
              <Card key={r._id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="font-semibold flex flex-wrap items-center gap-2">
                        {r.donorName} — ₹{r.amount.toLocaleString("en-IN")}
                        <Badge className={badge.cls}>{badge.label}</Badge>
                        {r.manualEntry && <Badge className="bg-muted text-foreground">Manual entry</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground break-all">
                        {r.sevaName || "-"} · {r.donorMobile || "no phone"} · {fmtDate(r.createdAt)}
                        {r.transactionId ? <> · {r.transactionId}</> : <> · no payment ID</>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {r.attempts === 0 ? "Not pushed yet" : `Pushed ${r.attempts}× · last ${r.lastAttemptAt ? fmtDate(r.lastAttemptAt) : "-"}`}
                        {r.state === "retrying" && (r.nextAttemptAt ? <> · next try {fmtDate(r.nextAttemptAt)}</> : <> · next try within 10 min</>)}
                      </p>
                      {r.lastError && <p className="text-xs text-red-600 break-words">DCC said: {r.lastError}</p>}
                      {r.reason && REASON_TEXT[r.reason] && r.state === "needs_admin" && (
                        <p className="text-xs text-amber-700">{REASON_TEXT[r.reason]}</p>
                      )}
                    </div>
                    <Button size="sm" variant="outline" disabled={busy === r._id || r.state === "pushing"} onClick={() => pushOne(r)} className="gap-1.5 shrink-0">
                      {busy === r._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Push to DCC
                    </Button>
                  </div>
                  {r.state === "needs_admin" && (
                    <div className="flex flex-wrap items-center gap-2">
                      <Input
                        placeholder="Receipt no. from DCC, e.g. HKMI|2026|D/VSP|5413"
                        value={values[r._id] || ""}
                        onChange={(e) => setValues({ ...values, [r._id]: e.target.value })}
                        className="w-full sm:w-80"
                      />
                      <Button size="sm" disabled={busy === r._id || !(values[r._id] || "").trim()} onClick={() => saveReceipt(r)} className="gap-1.5">
                        <CheckCircle2 className="h-4 w-4" /> Save &amp; send receipt
                      </Button>
                    </div>
                  )}
                  {note && <p className={`text-xs ${note.startsWith("✓") ? "text-green-700" : "text-red-600"}`}>{note}</p>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
