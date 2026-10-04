"use client";

import { BookOpen, Sparkles, Heart } from "lucide-react";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";

const SCRIPTURES = [
  {
    icon: BookOpen,
    citation: "Srimad Bhagavatam (10.3.28)",
    text: "On the auspicious day of Janmashtami, acts of devotion and charity are amplified a thousandfold. offerings made to the Lord on His appearance day purify one's family for generations.",
  },
  {
    icon: Sparkles,
    citation: "Padma Purana",
    text: "One who donates food, clothes or gold on the birthday of Lord Krishna destroys all sinful reactions and attains the supreme abode of Lord Vishnu.",
  },
  {
    icon: Heart,
    citation: "Skanda Purana",
    text: "Charity given during Janmashtami with devotion is imperishable. It nourishes the giver's soul and brings prosperity and protection to their loved ones.",
  },
];

export default function JanmashtamiImportanceSection() {
  return (
    <section className="vk-section vk-band">
      <div className="vk-container">
        {/* Header */}
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Sacred scriptures glorify devotion during the Lord's appearance"
            title={
              <>
                Significance of <span className="text-vk-600">Giving on Janmashtami</span>
              </>
            }
            subtitle="The scriptures reveal that acts of charity performed on the auspicious day of Sri Krishna Janmashtami carry immeasurable spiritual merit."
          />
        </Reveal>

        {/* Scripture cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {SCRIPTURES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.citation} delay={i * 0.12} className="h-full">
                <div className="vk-card vk-card-hover flex h-full flex-col p-6">
                  <div className="flex items-center gap-3">
                    <span className="vk-icon-chip">
                      <Icon className="h-5 w-5" />
                    </span>
                    {/* Citation tag */}
                    <span className="vk-pill-soft">{s.citation}</span>
                  </div>

                  <p className="mt-4 font-serif-display text-[15px] italic leading-relaxed text-ink/80 md:text-base">
                    {s.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
