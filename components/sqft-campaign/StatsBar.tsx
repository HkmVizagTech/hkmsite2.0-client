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
    <section className="relative z-10 -mt-12 pb-8 md:-mt-16">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="grid divide-x divide-gold/20 overflow-hidden rounded-[24px] border border-gold/20 bg-gradient-to-br from-card to-background shadow-lg md:grid-cols-3">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-4 p-5 md:p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold/10">
                <item.icon className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{item.label}</p>
                <p className="text-lg font-bold text-primary">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
