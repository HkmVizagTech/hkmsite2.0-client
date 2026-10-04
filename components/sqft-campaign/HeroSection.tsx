"use client";

import Image from "next/image";
import type { CampaignConfig } from "@/lib/campaignConfig";

interface HeroSectionProps {
  scrollToDonate: () => void;
  config: CampaignConfig;
}

export default function HeroSection({ scrollToDonate, config }: HeroSectionProps) {
  const altText = `${config.pageTitle} — ${config.heroHeading1} ${config.heroHeading2}`;
  const desktopSrc = config.bannerImage || config.heroImage;
  const mobileSrc = config.bannerImageMobile || config.bannerImage || config.heroImage;

  return (
    <section className="bg-gradient-to-b from-vk-50 to-white pb-4 pt-4 md:pb-6 md:pt-6">
      <div className="vk-container">
        <div className="overflow-hidden rounded-3xl bg-vk-900 shadow-[0_24px_60px_-28px_rgba(10,18,51,0.6)]">
          {/* Whole banner is clickable — glides to the donation form */}
          <button
            type="button"
            onClick={scrollToDonate}
            aria-label="Donate — go to the donation form"
            className="block w-full cursor-pointer overflow-hidden"
          >
            {/* Mobile banner (portrait) */}
            <div className="relative w-full overflow-hidden md:hidden" style={{ aspectRatio: config.bannerMobileWidth ? `${config.bannerMobileWidth}/${config.bannerMobileHeight}` : "1080/980" }}>
              <Image
                src={mobileSrc}
                alt={altText}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
            {/* Desktop banner (landscape) */}
            <div className="relative hidden w-full md:block" style={{ aspectRatio: config.bannerWidth ? `${config.bannerWidth}/${config.bannerHeight}` : "1920/980" }}>
              <Image
                src={desktopSrc}
                alt={altText}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </button>
        </div>

        {/* A real, visible H1 — the banner above is a pure image (no
            selectable/crawlable text), so without this the page has no
            text-based top-level heading at all, which hurts both SEO and
            accessibility (screen readers, images-disabled browsing).
            Uses pageTitle (e.g. "Square Foot Seva") rather than the generic
            heroHeading1/2 branding text, since that's the actual keyword
            this page needs to rank for. */}
        <div className="px-4 pb-2 pt-6 text-center md:pt-8">
          <h1 className="vk-h2">{config.pageTitle}</h1>
        </div>
      </div>
    </section>
  );
}
