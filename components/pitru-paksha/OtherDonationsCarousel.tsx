"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Ornament from "@/components/Ornament";

const C = {
  deepGreen: "#3A211A",
  emerald: "#5B3A24",
  teal: "#A4713A",
  gold: "#D9A34A",
  softGold: "#EECC8B",
  magenta: "#B54B2E",
  lightMint: "#FBF5E4",
} as const;

interface DonationCard {
  href: string;
  title: string;
  tagline: string;
  image: string;
}

// A curated rail of the temple's other online donation pages. Cards use the
// same imagery as the campaigns themselves, so the set stays in sync when a
// page's banner is refreshed.
const OTHER_DONATIONS: DonationCard[] = [
  {
    href: "/alankara-vastra-seva",
    title: "Vastra & Alankara Seva",
    tagline: "Adorn the Lordships",
    image:
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677419371-1783677418690-DietyPhotos.jpeg",
  },
  {
    href: "/sqft-seva-campaign",
    title: "Square Foot Seva",
    tagline: "Be a part of the temple",
    image:
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1786528614525-1786528613759-ChatGPTImageAug122026022735PM.webp",
  },
  {
    href: "/brick-seva-campaign",
    title: "Brick Seva",
    tagline: "Sponsor a sacred brick",
    image:
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785588189215-1785588187426-brick-hero-desk.webp",
  },
  {
    href: "/gita-daan-seva",
    title: "Gita Daan Seva",
    tagline: "Share the Song of God",
    image:
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783672760162-1783672758959-ChatGPTImageJul92026043444PM.png",
  },
  {
    href: "/govardhan-puja",
    title: "Govardhan Puja",
    tagline: "Annual festival sevas",
    image:
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1789476038584-1789476037499-govardhan-desk.webp",
  },
  {
    href: "/ekadashi",
    title: "Ekadashi Seva",
    tagline: "Observe the sacred fast",
    image:
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/ekadashi-posters/ad%20poster%201%2016-9%20%20final%20.jpg.webp",
  },
  {
    href: "/anna-daan-seva",
    title: "Anna Daan Seva",
    tagline: "The highest charity",
    image:
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785586501452-1785586500800-annadan-banner-desk.webp",
  },
  {
    href: "/gau-seva",
    title: "Gau Seva",
    tagline: "Serve Gau Mata",
    image:
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785586948250-1785586945893-Gau-banner-desk.webp",
  },
  {
    href: "/subhojanam",
    title: "Subhojanam",
    tagline: "Hospital prasadam seva",
    image:
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677363792-1783677363601-462395264797134589073566144398536696847591n.jpg",
  },
];

export default function OtherDonationsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    containScroll: "trimSnaps",
  });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Gentle auto-advance — pauses while the pointer is over the rail.
  useEffect(() => {
    if (!emblaApi || paused) return;
    const id = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(id);
  }, [emblaApi, paused]);

  const snapCount = emblaApi ? emblaApi.scrollSnapList().length : OTHER_DONATIONS.length;

  return (
    <section
      className="relative overflow-hidden px-4 py-14 md:py-20"
      style={{
        background: `linear-gradient(160deg, ${C.emerald} 0%, ${C.deepGreen} 55%, ${C.magenta}55 160%)`,
      }}
    >
      {/* Soft glow accents */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full blur-[110px]"
        style={{ background: `${C.gold}22` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-80 rounded-full blur-[110px]"
        style={{ background: `${C.teal}26` }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <Ornament className="mx-auto mb-6" />
          <p
            className="text-xs font-semibold uppercase tracking-[0.28em] md:text-sm"
            style={{ color: C.softGold }}
          >
            Continue your seva
          </p>
          <h2
            className="mt-2 text-3xl font-bold text-white md:text-4xl"
            style={{ textShadow: `0 0 40px ${C.gold}33` }}
          >
            Other Donations
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
            Beyond Pitru Paksha, your devotion can bless the temple in many
            ways — from feeding and cow care to the very stones of the Lord&apos;s
            abode.
          </p>
        </div>

        <div
          className="-mx-4"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div ref={emblaRef} className="overflow-hidden px-4 pb-2">
            <div className="flex gap-5">
              {OTHER_DONATIONS.map((d) => (
                <div
                  key={d.href}
                  className="min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-[calc(50%-0.625rem)] md:basis-[calc(50%-0.625rem)] lg:basis-[calc(33.333%-0.834rem)]"
                >
                  <Link
                    href={d.href}
                    className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[rgba(217,163,74,0.7)] hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
                  >
                    <Image
                      src={d.image}
                      alt={d.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, ${C.deepGreen}E6 0%, rgba(46,28,19,0.55) 45%, rgba(46,28,19,0.12) 75%, transparent 100%)`,
                      }}
                    />
                    {/* Gold accent line on hover */}
                    <div
                      className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                      style={{
                        background: `linear-gradient(to right, ${C.gold}, ${C.softGold})`,
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p
                        className="text-[10px] font-bold uppercase tracking-[0.22em]"
                        style={{ color: C.softGold }}
                      >
                        {d.tagline}
                      </p>
                      <h3 className="mt-1.5 text-lg font-bold leading-snug text-white drop-shadow md:text-xl">
                        {d.title}
                      </h3>
                    </div>
                    <span
                      className="absolute right-4 top-4 inline-flex translate-y-1 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                      style={{ background: C.gold, color: C.deepGreen }}
                    >
                      Donate
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots + arrows */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            type="button"
            aria-label="Previous donations"
            onClick={() => emblaApi?.scrollPrev()}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/80 transition-all hover:border-[rgba(217,163,74,0.8)] hover:text-[#EECC8B]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: snapCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => emblaApi?.scrollTo(i)}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === selected ? 24 : 6,
                  background: i === selected ? C.gold : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next donations"
            onClick={() => emblaApi?.scrollNext()}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/80 transition-all hover:border-[rgba(217,163,74,0.8)] hover:text-[#EECC8B]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}