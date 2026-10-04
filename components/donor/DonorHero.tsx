"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, LogOut, Sparkles, UserRound } from "lucide-react";

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
    <section className="bg-gradient-to-b from-vk-50 to-white pt-4 md:pt-6">
      <div className="vk-container">
        {/* Identity card — navy gradient, same treatment as the home "Temple Goal" card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-vk-700 via-vk-600 to-vk-500 p-5 text-white shadow-[0_24px_50px_-24px_rgba(30,58,138,0.7)] sm:p-8">
          <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
          <div aria-hidden className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <motion.span
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 font-heading text-xl font-extrabold text-white ring-4 ring-white/10 backdrop-blur sm:h-20 sm:w-20 sm:text-2xl"
              >
                {initials(name)}
              </motion.span>
              <div className="min-w-0">
                <span className="vk-pill-light mb-2">Donor Portal</span>
                <h1 className="break-words font-heading text-2xl font-extrabold leading-tight tracking-[-0.02em] text-white sm:text-3xl">
                  {name}
                </h1>
                <p className="mt-1 break-words text-xs text-white/75 sm:text-sm">
                  Donor ID <span className="break-all font-mono text-white/90">{donorId}</span>
                  {preacherName ? (
                    <>
                      {" · "}Guided by <span className="font-medium text-white/90">{preacherName}</span>
                    </>
                  ) : null}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link href="/donate" className="vk-btn-gold h-11 flex-1 px-5 sm:flex-none">
                <Heart className="h-4 w-4 fill-current" /> Donate Again
              </Link>
              <button onClick={onLogout} className="vk-btn-ghost-light h-11 flex-1 px-5 sm:flex-none">
                <LogOut className="h-4 w-4" /> Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Stat tiles */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {stats.map(({ label, value, icon: Icon, accent }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className="vk-card flex items-center gap-3.5 p-4 sm:block sm:p-5"
            >
              <div className="flex items-center gap-2.5">
                <span className={`vk-icon-chip ${accent ? "!bg-vk-700 !text-white" : ""}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:text-xs">
                  {label}
                </p>
              </div>
              <p
                className={`ml-auto font-heading text-2xl font-extrabold sm:ml-0 sm:mt-3 sm:text-3xl ${
                  accent ? "text-vk-700" : "text-ink"
                }`}
              >
                {value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
