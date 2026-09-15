"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, IndianRupee, LogOut, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    { label: "Total given", value: `₹${lifetimeTotal.toLocaleString("en-IN")}`, icon: IndianRupee },
    { label: "Sevas supported", value: sevaCount, icon: Sparkles },
    { label: "Donor since", value: donorSince ? format(new Date(donorSince), "MMM yyyy") : "—", icon: UserRound },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-2xl text-white shadow-[var(--shadow-elevated)]"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-[var(--shadow-gold)]"
              style={{ background: "var(--gradient-gold)" }}
            >
              {initials(name)}
            </span>
            <div>
              <h1 className="font-heading text-xl font-bold sm:text-2xl">{name}</h1>
              <p className="text-xs text-white/70 sm:text-sm">
                Donor ID <span className="font-mono">{donorId}</span>
                {preacherName ? (
                  <>
                    {" "}
                    · Guided by <span className="font-medium text-white/90">{preacherName}</span>
                  </>
                ) : null}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" /> Log Out
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl bg-white/10 p-3 backdrop-blur-sm sm:p-4">
              <Icon className="mb-1.5 h-4 w-4 text-gold sm:mb-2 sm:h-5 sm:w-5" />
              <p className="text-base font-bold sm:text-xl">{value}</p>
              <p className="text-[10px] text-white/70 sm:text-xs">{label}</p>
            </div>
          ))}
        </div>

        <Link href="/donate" className="w-fit">
          <Button size="sm" className="gap-1.5 bg-white text-primary hover:bg-white/90">
            <Heart className="h-3.5 w-3.5" /> Donate Again
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
