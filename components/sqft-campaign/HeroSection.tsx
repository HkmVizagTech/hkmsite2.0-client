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
    <section className="bg-white pt-[88px] md:pt-[104px]">
      {/* Whole banner is clickable — glides to the donation form */}
      <button
        type="button"
        onClick={scrollToDonate}
        aria-label="Donate — go to the donation form"
        className="block w-full cursor-pointer overflow-hidden rounded-b-3xl"
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
    </section>
  );
}
