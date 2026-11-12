"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getGalleryImages, TEMPLE_GALLERY_CATEGORIES } from "@/lib/galleryApi";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { useT } from "@/components/i18n/LocaleProvider";

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

/**
 * "Moments at Hare Krishna Vaikuntham": a gold-framed collage (one large photo and four smaller ones) and three
 * feature cards.
 */
export default function MomentsSection() {
  const t = useT();
  const [moments, setMoments] = useState<Moment[]>(FALLBACK);

  useEffect(() => {
    getGalleryImages({ status: "active" }).then((items: any[]) => {
      const flat: Moment[] = [];
      for (const item of items || []) {
        if (item.category && !TEMPLE_GALLERY_CATEGORIES.includes(item.category)) continue;
        for (const src of item.images || []) flat.push({ src, title: item.title || "Temple moment", category: item.category });
        if (flat.length >= 6) break;
      }
      if (flat.length >= 5) setMoments(flat.slice(0, 6));
    });
  }, []);

  const collage = moments.slice(0, 6);

  const Photo = ({ m, className, sizes, priority = false }: { m: Moment; className: string; sizes: string; priority?: boolean }) => (
    <Link href="/gallery" className={`group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-[#0A1640] ring-1 ring-[#F6C752]/50 shadow-[0_18px_40px_-24px_rgba(30,58,138,.6)] ${className}`}>
      <Image src={m.src} alt={t(m.title)} fill sizes={sizes} priority={priority} className="object-contain transition-transform duration-700 group-hover:scale-[1.03]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0A1640]/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 translate-y-1 p-3 transition-transform duration-500 group-hover:translate-y-0 md:p-4">
        {m.category && <span className="mb-1 inline-block rounded-full bg-[#F6C752] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1A1240]">{t(m.category)}</span>}
        <p className="line-clamp-1 text-sm font-semibold text-white">{t(m.title)}</p>
      </div>
    </Link>
  );

  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      <div aria-hidden className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#F6C752]/15 blur-3xl" />
      <div aria-hidden className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-vk-400/15 blur-3xl" />
      <div className="vk-container relative">
        <SectionHeading
          eyebrow={t("Temple Highlights")}
          title={t("Moments at Hare Krishna Vaikuntham")}
          subtitle={t("Festivals, darshan and everyday celebrations of devotion, captured across our temple in Visakhapatnam.")}
          action={{ href: "/gallery", label: t("View All") }}
        />

        {/* collage */}
        {collage.length >= 5 && (
          <Reveal>
            {/* equal tiles; each photo fits inside whole */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {collage.map((m, i) => (
                <Photo key={m.src + i} m={m} priority={i === 0} className="" sizes="(min-width: 768px) 33vw, 50vw" />
              ))}
            </div>
          </Reveal>
        )}
      </div>

      {/* feature cards */}
      <div className="vk-container relative mt-10 md:mt-12">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <Link href={f.href} className="vk-card vk-card-hover group block h-full overflow-hidden ring-1 ring-[#F6C752]/30">
                <div className="relative h-44 overflow-hidden">
                  <Image src={f.img} alt={t(f.title)} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex items-start gap-3 p-5">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-ink">{t(f.title)}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(f.text)}</p>
                  </div>
                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-vk-100 text-vk-700 transition-colors group-hover:bg-[#F6C752] group-hover:text-[#1A1240]">
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
