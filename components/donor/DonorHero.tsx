"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, LogOut, Sparkles, UserRound } from "lucide-react";
import { format } from "date-fns";

interface Props {
  name: string;
  donorId: string;
  preacherName: string | null;
  lifetimeTotal: number;
  donationCount: number;
  sevaCount: number;
  donorSince: string;
  onLogout: () => void;
}

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "D";

export default function DonorHero({
  name,
  donorId,
  preacherName,
  lifetimeTotal,
  donationCount,
  sevaCount,
  donorSince,
  onLogout,
}: Props) {
  const stats = [
    { label: "Total given", value: `₹${lifetimeTotal.toLocaleString("en-IN")}`, icon: Heart, accent: true },
    { label: "Sevas supported", value: sevaCount, icon: Sparkles },
    { label: "Donations made", value: donationCount, icon: UserRound },
  ];

  return (
    <div className="relative -mt-8 overflow-hidden pt-8 text-white">
      {/* Backdrop — navy hero gradient with soft gold glows, echoing the login page */}
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl"
        style={{ background: "var(--gradient-gold)", opacity: 0.22 }}
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full blur-3xl bg-primary/40"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* Identity row */}
        <div className="flex flex-wrap items-start justify-between gap-4 py-8 sm:py-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-[var(--shadow-gold)] ring-4 ring-white/15 sm:h-20 sm:w-20 sm:text-2xl"
              style={{ background: "var(--gradient-gold)" }}
            >
              {initials(name)}
            </motion.span>
            <div>
              <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.22em] text-gold">Donor Portal</p>
              <h1 className="font-heading text-2xl font-bold leading-tight sm:text-3xl">{name}</h1>
              <p className="mt-1 text-xs text-white/70 sm:text-sm">
                Donor ID <span className="font-mono">{donorId}</span>
                {preacherName ? (
                  <>
                    {" · "}Guided by <span className="font-medium text-white/90">{preacherName}</span>
                  </>
                ) : null}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/donate"
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-[hsl(220_90%_18%)] shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.03] sm:text-sm"
              style={{ background: "var(--gradient-gold)" }}
            >
              <Heart className="h-3.5 w-3.5" /> Donate Again
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 rounded-full border border-white/25 px-4 py-2 text-xs font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white sm:text-sm"
            >
              <LogOut className="h-3.5 w-3.5" /> Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Stat cards — overlap the gradient's bottom edge onto the page background */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {stats.map(({ label, value, icon: Icon, accent }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className={`rounded-2xl border p-4 shadow-warm sm:p-5 ${
                accent
                  ? "border-gold/40 bg-gradient-to-br from-white to-amber-50/80"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    accent ? "text-white shadow-[var(--shadow-gold)]" : "bg-gold/10 text-gold"
                  }`}
                  style={accent ? { background: "var(--gradient-gold)" } : undefined}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
              </div>
              <p className="mt-2.5 font-heading text-2xl font-bold text-foreground sm:text-3xl">{value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
