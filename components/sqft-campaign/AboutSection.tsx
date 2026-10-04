"use client";

import Image from "next/image";
import Reveal from "@/components/site/Reveal";
import type { CampaignConfig } from "@/lib/campaignConfig";
import { SQFT_CAMPAIGN } from "@/lib/campaignConfig";

interface AboutSectionProps {
  aboutImage: string;
  scrollToDonate: () => void;
  config?: CampaignConfig;
}

export default function AboutSection({ aboutImage, scrollToDonate, config = SQFT_CAMPAIGN }: AboutSectionProps) {
  return (
    <section className="vk-section vk-band">
      <div className="vk-container">
        <Reveal className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl shadow-card">
            <Image
              src={aboutImage}
              alt="Hare Krishna Vaikuntham Temple"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <span className="vk-pill mb-4">Inspiration &amp; Aspiration</span>
            <h2 className="vk-h2">
              Hare Krishna Vaikuntam — a sacred sanctuary in the making
            </h2>
            <p className="vk-lead mt-4">
              Nestled amidst the serene landscapes of Gambheeram in Visakhapatnam, the Hare Krishna
              Vaikuntham Cultural Centre (Chaitanya Bhavan) is envisioned as a magnificent sanctuary
              to preserve and propagate India&apos;s timeless spiritual and cultural heritage.
            </p>
            <p className="vk-lead mt-4">
              Beautifully blending modern utility with traditional Vedic architectural grace, the
              multi-storey complex will feature divine altars, a vibrant kirtan hall, and dedicated
              spaces for youth empowerment and spiritual education — serving devotion, peace and
              heritage for generations to come.
            </p>
            <p className="vk-lead mt-4">
              Inspired by the vision of Srila Prabhupada, Founder-Acharya of the worldwide Hare
              Krishna Movement, this temple is being built brick by brick, square foot by square foot,
              through the devotion of thousands of well-wishers like you.
            </p>
            <button type="button" onClick={scrollToDonate} className="vk-btn-gold mt-6 h-12 px-8 text-base">
              Sponsor a {config.unitName}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
