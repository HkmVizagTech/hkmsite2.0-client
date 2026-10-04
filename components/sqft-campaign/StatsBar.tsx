"use client";

import { Users, IndianRupee, Building2 } from "lucide-react";
import type { CampaignConfig } from "@/lib/campaignConfig";

interface StatsBarProps {
  stats: { sqftRaised: number; totalAmount: number; donorCount: number } | null;
  campaigner:
    | { sqftRaised: number; raisedAmount: number; donorCount: number }
    | undefined;
  price: number;
  config: CampaignConfig;
}

export default function StatsBar({ stats, campaigner, price, config }: StatsBarProps) {
  const sqft = stats
    ? Math.floor(stats.totalAmount / price)
    : campaigner
      ? Math.floor(campaigner.raisedAmount / price)
      : 0;
  const amount = stats
    ? stats.totalAmount
    : campaigner
      ? campaigner.raisedAmount
      : 0;
  const donors = stats
    ? stats.donorCount
    : campaigner
      ? campaigner.donorCount
      : 0;

  const items = [
    { icon: Building2, label: `${config.unitNamePlural} Offered`, value: `${sqft.toLocaleString("en-IN")} ${config.unitShort}` },
    { icon: IndianRupee, label: "Total Amount Collected", value: `₹${amount.toLocaleString("en-IN")}` },
    { icon: Users, label: "Devotees Contributed", value: `${donors.toLocaleString("en-IN")}` },
  ];

  return (
    <section className="relative z-10 pb-8 pt-2">
      <div className="vk-container">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-vk-700 via-vk-600 to-vk-500 p-3 shadow-[0_24px_50px_-24px_rgba(30,58,138,0.7)] md:p-4">
          <div className="grid gap-2.5 md:grid-cols-3 md:gap-3">
            {items.map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3.5 text-white">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <item.icon className="h-5 w-5 text-[hsl(var(--gold))]" />
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-xl font-extrabold leading-tight">{item.value}</p>
                  <p className="text-xs text-white/75">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
