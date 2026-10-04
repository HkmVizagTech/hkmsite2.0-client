"use client";

import type { CampaignConfig } from "@/lib/campaignConfig";
import { SQFT_CAMPAIGN } from "@/lib/campaignConfig";

interface FinalCtaSectionProps {
  scrollToDonate: () => void;
  config?: CampaignConfig;
}

export default function FinalCtaSection({ scrollToDonate, config = SQFT_CAMPAIGN }: FinalCtaSectionProps) {
  return (
    <section className="vk-section bg-white">
      <div className="vk-container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-vk-900 via-vk-800 to-vk-700 px-6 py-12 text-center shadow-[0_24px_60px_-28px_rgba(10,18,51,0.6)] md:px-12 md:py-16">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5" />
          <h2 className="vk-h2 relative mx-auto mb-6 max-w-3xl !text-white">
            Every {config.unitName} you offer becomes part of the Lord&apos;s eternal home.
          </h2>
          <button type="button" onClick={scrollToDonate} className="vk-btn-gold relative h-12 px-8 text-base">
            Donate Now
          </button>
        </div>
      </div>
    </section>
  );
}
