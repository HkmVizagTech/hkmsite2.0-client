"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Loader2, Repeat, IndianRupee, CalendarClock, XCircle, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface Subscription {
  subscriptionId: string;
  sevaName: string;
  amount: number;
  status: string;
  startedAt: string;
  lastChargedAt: string | null;
  chargeCount: number;
}

interface Props {
  subscriptions: Subscription[];
  donorFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  apiUrl: string;
  onChanged: () => void;
}

const statusLabel: Record<string, { text: string; className: string }> = {
  active: { text: "Active", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  pending: { text: "Starting soon", className: "border-amber-200 bg-amber-50 text-amber-700" },
  cancelled: { text: "Cancelled", className: "border-border bg-muted text-muted-foreground" },
  completed: { text: "Completed", className: "border-sky-200 bg-sky-50 text-sky-700" },
  failed: { text: "Failed", className: "border-red-200 bg-red-50 text-red-700" },
};

export default function RecurringDonationsSection({ subscriptions, donorFetch, apiUrl, onChanged }: Props) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cancel = async (subscriptionId: string) => {
    setCancellingId(subscriptionId);
    setError(null);
    try {
      const res = await donorFetch(`${apiUrl}/donor/subscriptions/${subscriptionId}/cancel`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Could not cancel this subscription.");
      onChanged();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  if (subscriptions.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-vk-200 bg-vk-50/50 px-4 py-10 text-center">
        <span className="vk-icon-chip mx-auto mb-3 !h-12 !w-12 !rounded-2xl">
          <Repeat className="h-6 w-6" />
        </span>
        <p className="font-heading text-base font-bold text-ink">No monthly sevas yet</p>
        <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
          Choose a seva with monthly giving — your support renews automatically.
        </p>
        <Link
          href="/donate"
          className="vk-btn-outline mt-4 h-10 px-4 text-[13px]"
        >
          <Link2 className="h-3.5 w-3.5" /> Explore Sevas
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700">{error}</div>
      )}
      {subscriptions.map((sub) => {
        const meta = statusLabel[sub.status] || statusLabel.pending;
        const canCancel = sub.status === "active" || sub.status === "pending";
        return (
          <div
            key={sub.subscriptionId}
            className="flex flex-col gap-3 rounded-xl border border-vk-100 bg-white p-3.5 transition-all hover:border-vk-300 hover:shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-4"
          >
            <div className="flex min-w-0 items-start gap-3">
              <span className="vk-icon-chip !h-10 !w-10">
                <Repeat className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="break-words font-heading font-bold text-ink">{sub.sevaName}</p>
                  <Badge variant="outline" className={meta.className}>
                    {meta.text}
                  </Badge>
                </div>
                <p className="mt-0.5 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
                  <IndianRupee className="h-3.5 w-3.5 text-vk-500" />
                  {sub.amount.toLocaleString("en-IN")} / month · {sub.chargeCount} charge{sub.chargeCount === 1 ? "" : "s"} so far
                </p>
                <p className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                  <CalendarClock className="h-3 w-3 text-vk-500" />
                  Started {format(new Date(sub.startedAt), "d MMM yyyy")}
                  {sub.lastChargedAt ? ` · Last charged ${format(new Date(sub.lastChargedAt), "d MMM yyyy")}` : ""}
                </p>
              </div>
            </div>
            {canCancel && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={cancellingId === sub.subscriptionId}
                    className="h-10 shrink-0 gap-1.5 self-start rounded-xl border-red-200 bg-white px-4 text-red-700 hover:bg-red-50 hover:text-red-700 sm:self-center"
                  >
                    {cancellingId === sub.subscriptionId ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5" />
                    )}
                    Cancel
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel this recurring donation?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will no longer be auto-charged ₹{sub.amount.toLocaleString("en-IN")}/month for {sub.sevaName}. This
                      can&apos;t be undone — you can always start a new monthly seva later.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep it</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => cancel(sub.subscriptionId)}
                    >
                      Yes, cancel
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        );
      })}
    </div>
  );
}
