"use client";

// Needs WhatsApp — completed donations that already have a real DCC
// receipt number, but the WhatsApp message was never delivered (no phone
// on file, WhatsApp wasn't configured at the time, a template/API error,
// or the number bounced). Flagged separately from "Needs Manual Receipt"
// tab, since that one is about missing receipt NUMBERS — this one is
// about receipts that exist but were never sent to the donor.

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { authFetch } from "@/lib/authClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Send, MessageCircleWarning, History, Eye } from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

// Result of a bulk window resend. Mirrors resendRecentFailedReceipts()'s
// summary in paymentCompletion.service.js.
interface BulkResult {
  dryRun: boolean;
  provider: string;
  windowHours: number;
  totalMatching: number;
  candidates: number;
  remaining: number;
  sent: number;
  skipped: number;
  failed: number;
  results: {
    id: string;
    donor?: string;
    amount?: number;
    receiptNumber?: string;
    ok?: boolean;
    skipped?: boolean;
    reason?: string | null;
    error?: string | null;
  }[];
}

interface NeedsWhatsAppDonation {
  _id: string;
  donorName: string;
  donorEmail?: string;
  donorMobile?: string;
  amount: number;
  sevaName?: string;
  type?: string;
  createdAt: string;
  receiptNumber: string;
  whatsappReceiptError?: string;
}

export default function NeedsWhatsAppTab() {
  const [list, setList] = useState<NeedsWhatsAppDonation[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const [resultById, setResultById] = useState<Record<string, string>>({});

  // Bulk window resend state.
  const [hours, setHours] = useState("9");
  const [bulkBusy, setBulkBusy] = useState<"preview" | "send" | null>(null);
  const [bulk, setBulk] = useState<BulkResult | null>(null);
  const [bulkError, setBulkError] = useState<string | null>(null);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_URL}/donations/needs-whatsapp`, { credentials: "include" });
      const json = await res.json();
      if (res.ok) setList(json.donations || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const send = async (id: string) => {
    setSending(id);
    try {
      const res = await authFetch(`${API_URL}/donations/${id}/resend-whatsapp`, { method: "POST", credentials: "include" });
      const j = await res.json().catch(() => ({}));
      setResultById((prev) => ({ ...prev, [id]: j.message || (res.ok ? "Sent" : "Failed") }));
      if (res.ok) {
        setList((prev) => (prev || []).filter((d) => d._id !== id));
      }
    } catch {
      setResultById((prev) => ({ ...prev, [id]: "Network error" }));
    } finally {
      setSending(null);
    }
  };

  // Preview (dry run) and send are the SAME endpoint — only `send` differs.
  // Preview is always the first step so the count is seen before any donor is
  // messaged, and the Send button is only offered once a preview has run.
  const runBulk = async (send: boolean) => {
    setBulkBusy(send ? "send" : "preview");
    setBulkError(null);
    try {
      const res = await authFetch(`${API_URL}/donations/resend-recent-whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ hours: Number(hours) || 9, limit: 25, send: send ? "true" : "false" }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setBulkError(j.message || `Request failed (${res.status})`);
        return;
      }
      setBulk(j as BulkResult);
      // The list of individually-sendable donations has changed underneath us.
      if (send) await fetchList();
    } catch {
      setBulkError("Network error — the sends may still be running on the server. Preview again in a minute to check.");
    } finally {
      setBulkBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageCircleWarning className="h-5 w-5 text-amber-500" /> Needs WhatsApp
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          These donations have a real DCC receipt but the WhatsApp message was never delivered — no
          phone number on file, an API/template error, or the number bounced. Review and send manually
          below (each send is a deliberate one-time action; it won't accidentally double-send).
        </p>
      </div>

      {/* Bulk window resend — for a provider outage where every send failed
          for a stretch of hours (e.g. the Flaxxa spam limit). Preview first,
          then send; both hit the same endpoint and neither can double-send. */}
      <Card className="border-amber-200 bg-amber-50/40">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start gap-2">
            <History className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold text-sm">Resend a whole window</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Use this after an outage where every receipt failed for a few hours. Preview shows
                exactly who would be messaged; nothing is sent until you press Send. Donors who
                already received a receipt are skipped automatically, so running it twice is safe.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs text-muted-foreground">Last</label>
            <input
              type="number"
              min={1}
              max={720}
              value={hours}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setHours(e.target.value)}
              className="h-9 w-20 rounded-md border border-input bg-background px-2 text-sm"
            />
            <label className="text-xs text-muted-foreground mr-1">hours</label>

            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              disabled={bulkBusy !== null}
              onClick={() => runBulk(false)}
            >
              {bulkBusy === "preview" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
              Preview
            </Button>

            {bulk && bulk.dryRun && bulk.candidates > 0 && (
              <Button
                size="sm"
                className="gap-1.5"
                disabled={bulkBusy !== null}
                onClick={() => runBulk(true)}
              >
                {bulkBusy === "send" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send {bulk.candidates} receipt{bulk.candidates === 1 ? "" : "s"}
              </Button>
            )}
          </div>

          {bulkError && <p className="text-xs text-red-600">{bulkError}</p>}

          {bulk && (
            <div className="text-xs space-y-1">
              {bulk.dryRun ? (
                <p className="font-medium">
                  {bulk.candidates === 0
                    ? `Nothing to resend in the last ${bulk.windowHours} hours.`
                    : `${bulk.candidates} receipt${bulk.candidates === 1 ? "" : "s"} would be sent via ${bulk.provider}${
                        bulk.remaining > 0 ? ` (${bulk.remaining} more after this batch)` : ""
                      }.`}
                </p>
              ) : (
                <p className="font-medium">
                  Sent {bulk.sent}
                  {bulk.skipped > 0 && `, skipped ${bulk.skipped}`}
                  {bulk.failed > 0 && `, failed ${bulk.failed}`}
                  {bulk.remaining > 0 && ` — ${bulk.remaining} still to go, press Preview then Send again.`}
                </p>
              )}

              {bulk.results.length > 0 && (
                <ul className="max-h-56 overflow-y-auto space-y-0.5 text-muted-foreground">
                  {bulk.results.map((r) => (
                    <li key={r.id}>
                      {r.donor || r.id}
                      {typeof r.amount === "number" && ` — ₹${r.amount.toLocaleString("en-IN")}`}
                      {!bulk.dryRun && (
                        <span className={r.ok ? "text-green-700" : "text-red-600"}>
                          {" · "}
                          {r.ok ? (r.skipped ? `skipped (${r.reason})` : "sent") : r.error || r.reason || "failed"}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
        </div>
      ) : !list || list.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            All caught up — every donation with a receipt has had its WhatsApp message delivered.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {list.map((d) => (
            <Card key={d._id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="font-semibold">{d.donorName} — ₹{d.amount.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.sevaName || d.type || "-"} ·{" "}
                    {d.donorMobile ? d.donorMobile : <span className="text-red-600 font-medium">no phone on file</span>} ·{" "}
                    {new Date(d.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    {" · "}Receipt: {d.receiptNumber}
                  </p>
                  {d.whatsappReceiptError && (
                    <p className="text-xs text-red-600 mt-0.5">Last error: {d.whatsappReceiptError}</p>
                  )}
                  {resultById[d._id] && (
                    <p className="text-xs mt-0.5 text-muted-foreground">{resultById[d._id]}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  disabled={sending === d._id || !d.donorMobile}
                  onClick={() => send(d._id)}
                  className="gap-1.5 shrink-0"
                  title={!d.donorMobile ? "No phone number on file — can't send" : undefined}
                >
                  {sending === d._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Send WhatsApp
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
