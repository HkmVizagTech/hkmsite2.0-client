"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Download,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  Repeat,
  IndianRupee,
  HeartHandshake,
  Search,
  X,
} from "lucide-react";
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

// How many rows to show before "Show more". A donor of ten years can have
// hundreds of entries; rendering them all buries the filters off-screen.
const PAGE_SIZE = 12;

export default function DonationHistorySection({ donations, downloadingId, onDownload }: Props) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState<"all" | number>("all");
  const [receiptsOnly, setReceiptsOnly] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const years = useMemo(() => {
    const set = new Set(donations.map((d) => new Date(d.createdAt).getFullYear()));
    return Array.from(set).sort((a, b) => b - a);
  }, [donations]);

  // Matches the things a donor actually remembers about a donation: what it
  // was for, roughly when, how much, or the receipt number from the PDF or
  // the WhatsApp message they're holding.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return donations.filter((d) => {
      if (year !== "all" && new Date(d.createdAt).getFullYear() !== year) return false;
      if (receiptsOnly && !(d.status === "completed" && d.receiptNumber)) return false;
      if (!q) return true;
      const haystack = [
        d.sevaName,
        d.type,
        d.receiptNumber,
        String(d.amount),
        d.amount.toLocaleString("en-IN"),
        format(new Date(d.createdAt), "d MMM yyyy"),
        format(new Date(d.createdAt), "MMMM"),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [donations, query, year, receiptsOnly]);

  const groupedByYear = useMemo(() => {
    const groups = new Map<number, Donation[]>();
    for (const d of filtered.slice(0, visible)) {
      const y = new Date(d.createdAt).getFullYear();
      if (!groups.has(y)) groups.set(y, []);
      groups.get(y)!.push(d);
    }
    return Array.from(groups.entries()).sort((a, b) => b[0] - a[0]);
  }, [filtered, visible]);

  const filtering = query.trim() !== "" || year !== "all" || receiptsOnly;

  const resetFilters = () => {
    setQuery("");
    setYear("all");
    setReceiptsOnly(false);
    setVisible(PAGE_SIZE);
  };

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
    <div className="space-y-5">
      {/* ── Find a donation ──────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="relative flex items-center rounded-xl border border-border bg-background transition-colors focus-within:border-gold">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder="Search by seva, receipt number, amount or month"
            className="h-11 w-full bg-transparent pl-10 pr-10 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Year + receipt filters. Horizontally scrollable on a phone so a
            donor with many years of history never gets a wrapped, jumbled row. */}
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          <FilterChip active={year === "all"} onClick={() => { setYear("all"); setVisible(PAGE_SIZE); }}>
            All years
          </FilterChip>
          {years.map((y) => (
            <FilterChip key={y} active={year === y} onClick={() => { setYear(y); setVisible(PAGE_SIZE); }}>
              {y}
            </FilterChip>
          ))}
          <FilterChip
            active={receiptsOnly}
            onClick={() => { setReceiptsOnly((v) => !v); setVisible(PAGE_SIZE); }}
          >
            With receipt
          </FilterChip>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            {filtering ? (
              <>
                <span className="font-semibold text-foreground">{filtered.length}</span> of {donations.length}{" "}
                donations
              </>
            ) : (
              <>
                <span className="font-semibold text-foreground">{donations.length}</span> donation
                {donations.length === 1 ? "" : "s"} · ₹
                {donations
                  .reduce((sum, d) => (d.status === "completed" ? sum + d.amount : sum), 0)
                  .toLocaleString("en-IN")}{" "}
                given
              </>
            )}
          </span>
          {filtering && (
            <button type="button" onClick={resetFilters} className="font-medium text-primary hover:underline">
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-10 text-center">
          <p className="text-sm font-medium text-foreground">No donations match that search</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try a seva name, a year, or part of the receipt number.
          </p>
          <button type="button" onClick={resetFilters} className="mt-3 text-sm font-medium text-primary hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-7">
            {groupedByYear.map(([y, items]) => (
              <div key={y}>
                <div className="mb-3 flex items-center gap-3">
                  <h3 className="font-heading text-sm font-bold text-primary">{y}</h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-gold/40 to-border" />
                  <span className="text-xs text-muted-foreground">
                    {items.length} donation{items.length > 1 ? "s" : ""} · ₹
                    {items
                      .reduce((sum, d) => (d.status === "completed" ? sum + d.amount : sum), 0)
                      .toLocaleString("en-IN")}
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
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.className}`}
                          >
                            <StatusIcon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
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
                              {d.sevaName || d.type || "General Donation"} ·{" "}
                              {format(new Date(d.createdAt), "d MMM yyyy")}
                            </p>
                            {/* The receipt number is what a donor is given to
                                quote — searchable above, so show it here too. */}
                            {d.receiptNumber && (
                              <p className="truncate font-mono text-[10px] text-muted-foreground/80">
                                {d.receiptNumber}
                              </p>
                            )}
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

          {filtered.length > visible && (
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="w-full rounded-xl border border-border bg-background py-3 text-sm font-medium text-primary transition-colors hover:border-gold/50"
            >
              Show {Math.min(PAGE_SIZE, filtered.length - visible)} more
              <span className="text-muted-foreground"> · {filtered.length - visible} remaining</span>
            </button>
          )}
        </>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-gold bg-gold/10 text-foreground"
          : "border-border bg-background text-muted-foreground hover:border-gold/50 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
