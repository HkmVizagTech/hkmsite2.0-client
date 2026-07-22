"use client";

import type { CampaignConfig } from "@/lib/campaignConfig";

interface StickyMobileBarProps {
  price: number;
  scrollToDonate: () => void;
  config: CampaignConfig;
}

export default function StickyMobileBar({ price, scrollToDonate, config }: StickyMobileBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 backdrop-blur md:hidden">
      <button
        onClick={scrollToDonate}
        className="w-full rounded-full bg-gradient-gold py-3.5 text-base font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)]"
      >
        Donate ₹{price.toLocaleString("en-IN")} / {config.unitName}
      </button>
    </div>
  );
}
