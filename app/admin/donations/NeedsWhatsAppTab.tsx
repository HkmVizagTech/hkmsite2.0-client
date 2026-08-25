"use client";

// Needs WhatsApp — completed donations that already have a real DCC
// receipt number, but the WhatsApp message was never delivered (no phone
// on file, WhatsApp wasn't configured at the time, a template/API error,
// or the number bounced). Flagged separately from "Needs Manual Receipt"
// tab, since that one is about missing receipt NUMBERS — this one is
// about receipts that exist but were never sent to the donor.

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Send, MessageCircleWarning } from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

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
