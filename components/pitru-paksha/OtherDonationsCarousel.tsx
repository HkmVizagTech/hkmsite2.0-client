"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/site/SectionHeading";

interface DonationCard {
  href: string;
  title: string;
  tagline: string;
  blurb: string;
  image: string;
}

// Curated rail of the temple's other online donation pages. Art is chosen so
// it crops gracefully in the rounded card frame (banners with baked-in text
// are avoided here for the same reason as on the seva grid).
const OTHER_DONATIONS: DonationCard[] = [
  {
    href: "/alankara-vastra-seva",
    title: "Vastra & Alankara Seva",
    tagline: "Adorn the Lordships",
    blurb: "Offer silks, ornaments and fresh garlands for the daily shringar of the Deities.",
    image:
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677419371-1783677418690-DietyPhotos.jpeg",
  },
  {
    href: "/sqft-seva-campaign",
    title: "Square Foot Seva",
    tagline: "Be a part of the temple",
    blurb: "Sponsor a square foot of the Vaikuntham temple and leave a permanent offering.",
    image:
      "https://res.cloudinary.com/ddmzeqpkc/image/upload/f_auto,q_auto/phase_1",
  },
  {
    href: "/brick-seva-campaign",
    title: "Brick Seva",
    tagline: "Sponsor a sacred brick",
    blurb: "Every brick you offer becomes part of the Lord's abode for generations.",
    image:
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1790154837849-1790154837122-brick.webp",
  },
  {
    href: "/gita-daan-seva",
    title: "Gita Daan Seva",
    tagline: "Share the Song of God",
    blurb: "Place the Bhagavad Gita into the hands of a seeker and share timeless wisdom.",
    image:
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783672760162-1783672758959-ChatGPTImageJul92026043444PM.png",
  },
  {
    href: "/govardhan-puja",
    title: "Govardhan Puja",
    tagline: "Annual festival sevas",
    blurb: "Participate in the Annakut offering and the worship of Giri Govardhan.",
    image:
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1790154839039-1790154837479-govardhan.webp",
  },
  {
    href: "/ekadashi",
    title: "Ekadashi Seva",
    tagline: "Observe the sacred fast",
    blurb: "Honour the most auspicious day of the fortnight with fasting and seva.",
    image:
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/ekadashi-posters/ad%20poster%201%2016-9%20%20final%20.jpg.webp",
  },
  {
    href: "/anna-daan-seva",
    title: "Anna Daan Seva",
    tagline: "The highest charity",
    blurb: "Serve sanctified prasadam to those who need it most — the greatest of all gifts.",
    image:
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1786100757954-1786100756855-annadan2.jpg",
  },
  {
    href: "/gau-seva",
    title: "Gau Seva",
    tagline: "Serve Gau Mata",
    blurb: "Provide fodder, shelter and loving care for the temple's sacred cows.",
    image:
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1790154838469-1790154837450-gauseva.webp",
  },
  {
    href: "/subhojanam",
    title: "Subhojanam",
    tagline: "Hospital prasadam seva",
    blurb: "Free, wholesome meals for patients and families at Vizag's hospitals.",
    image:
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677363792-1783677363601-462395264797134589073566144398536696847591n.jpg",
  },
];

/** "Other Donations" rail — a snap scroller of the temple's other seva pages. */
export default function OtherDonationsCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className="vk-section bg-white">
      <div className="vk-container">
        <SectionHeading
          align="center"
          eyebrow="Continue your seva"
          title="Other Donations"
          subtitle="Beyond Pitru Paksha, your devotion can bless the temple in many ways — from feeding and cow care to the very stones of the Lord's abode."
        />

        <div
          ref={scrollerRef}
          className="vk-scroller -mx-4 px-4 pb-4 md:-mx-6 md:px-6"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") scrollByCards(-1);
            if (e.key === "ArrowRight") scrollByCards(1);
          }}
        >
          {OTHER_DONATIONS.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="vk-card vk-card-hover group flex w-[78%] shrink-0 flex-col overflow-hidden sm:w-[46%] lg:w-[calc(25%-12px)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-vk-900">
                <Image
                  src={d.image}
                  alt={d.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-vk-600">
                  {d.tagline}
                </p>
                <h3 className="mt-1 text-lg font-bold leading-snug text-ink">{d.title}</h3>
                <p className="mb-4 mt-2 text-sm leading-6 text-muted-foreground">{d.blurb}</p>
                <span className="vk-btn-gold mt-auto h-10 self-start px-4 text-[13px]">
                  Donate
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label="Previous donations"
            onClick={() => scrollByCards(-1)}
            className="vk-btn-outline h-11 w-11 !rounded-full !p-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next donations"
            onClick={() => scrollByCards(1)}
            className="vk-btn-outline h-11 w-11 !rounded-full !p-0"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
