"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getGalleryImages, TEMPLE_GALLERY_CATEGORIES } from "@/lib/galleryApi";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";

interface Moment {
  src: string;
  title: string;
  category?: string;
}

const FALLBACK: Moment[] = [
  { src: "/assets/janmashtami-sk2.webp", title: "Janmashtami altar", category: "Festivals" },
  { src: "/assets/home-event-janmashtami.webp", title: "Darshan", category: "Deities" },
  { src: "/assets/janmashtami-sk6.webp", title: "Aarti", category: "Festivals" },
  { src: "/assets/donations-annadana-real.jpg", title: "Anna Daan", category: "Seva" },
  { src: "/assets/janmashtami-sk1.webp", title: "Prasadam seva", category: "Community" },
  { src: "/assets/vizag-temple-1.jpeg", title: "The temple", category: "Temple" },
];

const features = [
  {
    title: "Temple Festivals",
    text: "Vibrant celebrations of Janmashtami, Radhashtami, Govardhan Puja and every Ekadashi.",
    href: "/festival",
    img: "/assets/home-event-janmashtami.webp",
  },
  {
    title: "Vaikuntham Cultural Centre",
    text: "Chaitanya Bhavan — a serene space for devotion, culture and community in Gambheeram.",
    href: "/about",
    img: "/assets/vizag-temple-4.jpeg",
  },
  {
    title: "Programs & Events",
    text: "Bhagavad-gita classes, youth programs and kirtans that bring the community together.",
    href: "/events",
    img: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1789641526472-1789641525685-GlimpsesfromKrishnaPulseYouthFestivalKrishnaPulsebroughttogether1200studentsfor.jpg",
  },
];

/** GVD "Moments at …" — navy band with a swipeable photo strip and three overlapping feature cards. */
export default function MomentsSection() {
  const [moments, setMoments] = useState<Moment[]>(FALLBACK);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true, containScroll: "trimSnaps" });

  useEffect(() => {
    getGalleryImages({ status: "active" }).then((items: any[]) => {
      const flat: Moment[] = [];
      for (const item of items || []) {
        if (item.category && !TEMPLE_GALLERY_CATEGORIES.includes(item.category)) continue;
        for (const src of item.images || []) flat.push({ src, title: item.title || "Temple moment", category: item.category });
        if (flat.length >= 14) break;
      }
      if (flat.length >= 4) setMoments(flat.slice(0, 14));
    });
  }, []);

  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, moments]);

  return (
    <section className="relative">
      <div className="relative overflow-hidden bg-gradient-to-br from-vk-800 via-vk-700 to-vk-900 pb-40 pt-12 md:pb-48 md:pt-16">
        <div aria-hidden className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-vk-500/30 blur-3xl" />
        <div aria-hidden className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-vk-400/20 blur-3xl" />
        <div className="vk-container relative">
          <SectionHeading
            light
            eyebrow="Temple Highlights"
            title="Moments at Hare Krishna Vaikuntham"
            subtitle="Festivals, darshan and everyday celebrations of devotion, captured across our temple in Visakhapatnam."
            action={{ href: "/gallery", label: "View All" }}
          />
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-3 md:gap-4">
                {moments.map((m, i) => (
                  <Link
                    key={m.src + i}
                    href="/gallery"
                    className="group relative h-56 w-[72%] shrink-0 overflow-hidden rounded-2xl bg-vk-900 sm:w-[45%] md:h-72 md:w-[30%] lg:w-[23%]"
                  >
                    <Image
                      src={m.src}
                      alt={m.title}
                      fill
                      sizes="(min-width: 1024px) 300px, 70vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      {m.category && (
                        <span className="mb-1.5 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
                          {m.category}
                        </span>
                      )}
                      <p className="line-clamp-1 text-sm font-semibold text-white">{m.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-5 hidden justify-end gap-2 md:flex">
              <button
                type="button"
                aria-label="Previous photos"
                onClick={() => emblaApi?.scrollPrev()}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next photos"
                onClick={() => emblaApi?.scrollNext()}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlapping feature cards */}
      <div className="vk-container relative -mt-28 md:-mt-32">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <Link href={f.href} className="vk-card vk-card-hover group block h-full overflow-hidden">
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={f.img}
                    alt={f.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-start gap-3 p-5">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-ink">{f.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                  </div>
                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-vk-100 text-vk-700 transition-colors group-hover:bg-vk-700 group-hover:text-white">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
