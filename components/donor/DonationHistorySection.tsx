"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Download, Loader2, CheckCircle2, Clock, XCircle, Repeat, IndianRupee, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Donation {
  _id: string;
  amount: number;
  sevaName?: string;
  type?: string;
  status: string;
  receiptNumber?: string;
  createdAt: string;
  isRecurring?: boolean;
  subscriptionId?: string;
}

interface Props {
  donations: Donation[];
  downloadingId: string | null;
  onDownload: (donationId: string, receiptNumber?: string) => void;
}

const statusMeta: Record<string, { icon: typeof CheckCircle2; className: string }> = {
  completed: { icon: CheckCircle2, className: "text-emerald-600 bg-emerald-50" },
  pending: { icon: Clock, className: "text-amber-600 bg-amber-50" },
  active: { icon: Clock, className: "text-amber-600 bg-amber-50" },
  failed: { icon: XCircle, className: "text-red-600 bg-red-50" },
  cancelled: { icon: XCircle, className: "text-muted-foreground bg-muted" },
};

export default function DonationHistorySection({ donations, downloadingId, onDownload }: Props) {
  const groupedByYear = useMemo(() => {
    const groups = new Map<number, Donation[]>();
    for (const d of donations) {
      const year = new Date(d.createdAt).getFullYear();
      if (!groups.has(year)) groups.set(year, []);
      groups.get(year)!.push(d);
    }
    return Array.from(groups.entries()).sort((a, b) => b[0] - a[0]);
  }, [donations]);

  if (donations.length === 0) {
    return (
      <div className="ring-gold-dashed rounded-2xl py-12 text-center">
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
          <HeartHandshake className="h-6 w-6" />
        </span>
        <p className="font-heading text-sm font-bold text-foreground">Your seva journey hasn&apos;t begun yet</p>
        <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
          Every offering, big or small, nourishes the temple&apos;s services.
        </p>
        <Link
          href="/donate"
          className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[hsl(220_90%_18%)] shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.03]"
          style={{ background: "var(--gradient-gold)" }}
        >
          <HeartHandshake className="h-4 w-4" /> Begin Your Seva
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groupedByYear.map(([year, items]) => (
        <div key={year}>
          <div className="mb-3 flex items-center gap-3">
            <h3 className="font-heading text-sm font-bold text-primary">{year}</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-gold/40 to-border" />
            <span className="text-xs text-muted-foreground">
              {items.length} donation{items.length > 1 ? "s" : ""} · ₹
              {items.reduce((sum, d) => (d.status === "completed" ? sum + d.amount : sum), 0).toLocaleString("en-IN")}
            </span>
          </div>
          <div className="space-y-2">
            {items.map((d, i) => {
              const meta = statusMeta[d.status] || statusMeta.pending;
              const StatusIcon = meta.icon;
              return (
                <motion.div
                  key={d._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(i, 6) * 0.03 }}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3.5 transition-all hover:border-gold/50 hover:shadow-warm sm:p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.className}`}>
                      <StatusIcon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="flex items-center gap-0.5 font-semibold text-foreground">
                          <IndianRupee className="h-3.5 w-3.5" />
                          {d.amount.toLocaleString("en-IN")}
                        </span>
                        {d.isRecurring && (
                          <Badge variant="secondary" className="gap-1 px-1.5 py-0 text-[10px]">
                            <Repeat className="h-2.5 w-2.5" /> Monthly
                          </Badge>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {d.sevaName || d.type || "General Donation"} · {format(new Date(d.createdAt), "d MMM yyyy")}
                      </p>
                    </div>
                  </div>
                  {d.status === "completed" && d.receiptNumber ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={downloadingId === d._id}
                      onClick={() => onDownload(d._id, d.receiptNumber)}
                      className="shrink-0 gap-1.5"
                    >
                      {downloadingId === d._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Download className="h-3.5 w-3.5" />
                      )}
                      <span className="hidden sm:inline">Receipt</span>
                    </Button>
                  ) : (
                    <span className="shrink-0 text-xs capitalize text-muted-foreground">{d.status}</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
