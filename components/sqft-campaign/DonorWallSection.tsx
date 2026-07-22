"use client";

import { Users } from "lucide-react";
import Ornament from "@/components/Ornament";

interface DonorEntry {
  name: string;
  amount: number;
  sqft: number;
  time: string;
}

interface DonorWallSectionProps {
  stats: {
    latest: DonorEntry[];
    largest: DonorEntry[];
  } | null;
  wallTab: "latest" | "largest";
  setWallTab: (t: "latest" | "largest") => void;
  price: number;
}

const donorLabel = (d: DonorEntry, price: number) => {
  const sqft = Math.floor(d.amount / price);
  return sqft >= 1
    ? `${sqft} square ${sqft === 1 ? "foot" : "feet"}`
    : `₹${d.amount.toLocaleString("en-IN")}`;
};

export default function DonorWallSection({
  stats,
  wallTab,
  setWallTab,
  price,
}: DonorWallSectionProps) {
  const wallEntries = wallTab === "latest" ? stats?.latest || [] : stats?.largest || [];

  return (
    <section className="bg-card py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <Ornament className="mb-6" />
        <h2 className="mb-2 text-center font-heading text-2xl font-bold text-primary md:text-4xl">
          Respected Contributors
        </h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Join the devotees building the Lord&apos;s home.
        </p>

        <div className="mb-6 flex justify-center gap-2">
          {(["latest", "largest"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setWallTab(tab)}
              className={`rounded-full px-6 py-2 text-sm font-semibold capitalize transition-colors ${
                wallTab === tab
                  ? "bg-primary text-white"
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {wallEntries.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-background px-5 py-8 text-center text-sm text-muted-foreground">
            Be the first devotee to sponsor a square foot of the temple.
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
            {wallEntries.map((d, i) => (
              <li
                key={`${d.name}-${d.time}-${i}`}
                className="flex items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-xs font-bold text-gold">
                    {d.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{d.name}</p>
                    <p className="text-xs text-muted-foreground">
                      offered <span className="font-semibold text-gold">{donorLabel(d, price)}</span>
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{d.time}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
