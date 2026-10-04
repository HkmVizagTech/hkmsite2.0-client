"use client";

import type { CampaignConfig } from "@/lib/campaignConfig";
import { SQFT_CAMPAIGN } from "@/lib/campaignConfig";
import SectionHeading from "@/components/site/SectionHeading";

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
  config?: CampaignConfig;
}

const donorLabel = (d: DonorEntry, price: number, config: CampaignConfig) => {
  const units = Math.floor(d.amount / price);
  return units >= 1
    ? `${units} ${units === 1 ? config.unitName : config.unitNamePlural}`
    : `₹${d.amount.toLocaleString("en-IN")}`;
};

export default function DonorWallSection({
  stats,
  wallTab,
  setWallTab,
  price,
  config = SQFT_CAMPAIGN,
}: DonorWallSectionProps) {
  const wallEntries = wallTab === "latest" ? stats?.latest || [] : stats?.largest || [];

  return (
    <section className="vk-section bg-white">
      <div className="vk-container">
        <SectionHeading
          align="center"
          title="Respected Contributors"
          subtitle="Join the devotees building the Lord's home."
        />

        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex gap-1 rounded-xl bg-vk-50 p-1">
              {(["latest", "largest"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setWallTab(tab)}
                  className={`min-h-[40px] rounded-lg px-6 py-2 text-sm font-semibold capitalize transition-colors ${
                    wallTab === tab
                      ? "bg-vk-700 text-white shadow-sm"
                      : "text-vk-700 hover:bg-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {wallEntries.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-vk-200 bg-vk-50 px-5 py-8 text-center text-sm text-muted-foreground">
              Be the first devotee to sponsor a {config.unitName} of the temple.
            </p>
          ) : (
            <ul className="vk-card divide-y divide-vk-100 overflow-hidden">
              {wallEntries.map((d, i) => (
                <li
                  key={`${d.name}-${d.time}-${i}`}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-vk-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-vk-100 text-xs font-bold text-vk-700">
                      {d.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{d.name}</p>
                      <p className="text-xs text-muted-foreground">
                        offered <span className="font-semibold text-vk-700">{donorLabel(d, price, config)}</span>
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{d.time}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
