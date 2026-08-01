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
    <section className="bg-white pt-[72px] md:pt-[92px]">
      {/* Whole banner is clickable — glides to the donation form */}
      <button
        type="button"
        onClick={scrollToDonate}
        aria-label="Donate — go to the donation form"
        className="block w-full cursor-pointer"
      >
        {/* Mobile banner (portrait) */}
        <div className="relative w-full overflow-hidden md:hidden" style={{ aspectRatio: "1080/980" }}>
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
        <div className="relative hidden w-full md:block" style={{ aspectRatio: "1920/980" }}>
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
