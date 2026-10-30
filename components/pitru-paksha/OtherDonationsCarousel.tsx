"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import { useT } from "@/components/i18n/LocaleProvider";

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
export const OTHER_DONATIONS: DonationCard[] = [
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
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793266487328-1793266486628-MajesticWhiteandGoldHinduTemple.png",
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

/** "Other Donations": a clean grid of the temple's other seva pages (photo on top, name below). Used on every festival and seva page. */
export default function OtherDonationsCarousel() {
  const t = useT();
  return (
    <section className="vk-section !pb-0">
      <div className="vk-container">
        <Reveal className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <span className="vk-pill mb-3">{t("Continue your seva")}</span>
          <h2 className="vk-h2">{t("Other Donations")}</h2>
        </Reveal>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3">
          {OTHER_DONATIONS.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-vk-100 bg-white shadow-[0_18px_40px_-30px_rgba(30,58,138,0.5)] transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--gold)/0.6)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-vk-50">
                <Image
                  src={d.image}
                  alt={t(d.title)}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 items-end justify-between gap-2 p-3.5 md:p-4">
                <div className="min-w-0">
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--gold-deep))]">{t(d.tagline)}</p>
                  <h3 className="mt-0.5 text-[15px] font-bold leading-snug text-vk-800 md:text-lg">{t(d.title)}</h3>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-vk-50 text-vk-700 transition-colors group-hover:bg-vk-700 group-hover:text-white">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
