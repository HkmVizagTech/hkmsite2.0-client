"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

// Curated rail of the temple's other online donation pages. Art is chosen so
// it crops gracefully in the rounded card frame (banners with baked-in text
// are avoided here for the same reason as on the seva grid).
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
      "https://res.cloudinary.com/ddmzeqpkc/image/upload/f_auto,q_auto/phase_1",
  },
  {
    href: "/brick-seva-campaign",
    title: "Brick Seva",
    tagline: "Sponsor a sacred brick",
    image: "/assets/vizag-temple-1.jpeg",
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
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1786100757954-1786100756855-annadan2.jpg",
  },
  {
    href: "/gau-seva",
    title: "Gau Seva",
    tagline: "Serve Gau Mata",
    image: "/assets/donations-gau-seva-real.jpeg",
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
    align: "center",
    loop: true,
    containScroll: "trimSnaps",
    slidesToScroll: 1,
    dragFree: false,
  });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const router = useRouter();

  // Coverflow look: the centred slide is pushed to the front at full size,
  // while both neighbours recede, shrink and slide out behind it. Live on
  // every "scroll" event so the motion is smooth while dragging / scrolling.
  const applyCoverflow = useCallback(() => {
    if (!emblaApi) return;
    const viewportRect = emblaApi.rootNode().getBoundingClientRect();
    const viewportCenter = viewportRect.left + viewportRect.width / 2;
    emblaApi.slideNodes().forEach((node) => {
      const rect = node.getBoundingClientRect();
      const slideCenter = rect.left + rect.width / 2;
      const off = (slideCenter - viewportCenter) / (rect.width / 2);
      const abs = Math.min(Math.abs(off), 2);
      const front = abs < 0.6;
      const scale = front ? 1 : 1 - Math.min(abs, 1.5) * 0.22;
      const translateX = off === 0 ? 0 : Math.sign(off) * Math.min(abs, 1.5) * 16;
      const translateY = front ? 0 : 5;
      const opacity = abs >= 2 ? 0 : 1 - Math.max(0, abs - 0.55) * 0.42;
      const zIndex = front ? 30 : Math.max(3, 24 - Math.floor(abs * 8));
      node.style.transform = `translate3d(${translateX}%, ${translateY}%, 0) scale(${scale})`;
      node.style.opacity = opacity.toFixed(3);
      node.style.zIndex = String(zIndex);
    });
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    applyCoverflow();
    const onSelect = () => {
      applyCoverflow();
      setSelected(emblaApi.selectedScrollSnap());
    };
    const onResize = () => applyCoverflow();
    emblaApi.on("scroll", applyCoverflow);
    emblaApi.on("select", onSelect);
    window.addEventListener("resize", onResize);
    return () => {
      emblaApi.off("scroll", applyCoverflow);
      emblaApi.off("select", onSelect);
      window.removeEventListener("resize", onResize);
    };
  }, [emblaApi, applyCoverflow]);

  // Pause auto-advance while hovering or dragging.
  useEffect(() => {
    if (!emblaApi) return;
    const down = () => setPaused(true);
    const up = () => setPaused(false);
    emblaApi.on("pointerDown", down);
    emblaApi.on("pointerUp", up);
    return () => {
      emblaApi.off("pointerDown", down);
      emblaApi.off("pointerUp", up);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || paused) return;
    const id = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(id);
  }, [emblaApi, paused]);

  const snapCount = emblaApi
    ? emblaApi.scrollSnapList().length
    : OTHER_DONATIONS.length;

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
        <div className="mb-10 text-center md:mb-12">
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
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex items-stretch gap-4 py-6 md:gap-5">
              {OTHER_DONATIONS.map((d, i) => (
                <button
                  key={d.href}
                  type="button"
                  aria-label={d.title}
                  onClick={() => {
                    if (selected === i) router.push(d.href);
                    else emblaApi?.scrollTo(i);
                  }}
                  className="shrink-0 grow-0 basis-[58%] cursor-pointer select-none outline-none sm:basis-[44%] lg:basis-[32%]"
                  style={{ willChange: "transform, opacity" }}
                >
                  <div
                    className={
                      "relative aspect-[4/3] w-full overflow-hidden rounded-2xl border text-left transition-[border-color,box-shadow] duration-500 " +
                      (selected === i
                        ? "border-[rgba(217,163,74,0.85)] shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
                        : "border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.35)]")
                    }
                  >
                    <Image
                      src={d.image}
                      alt={d.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 58vw, (max-width: 1024px) 44vw, 32vw"
                      className="object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, ${C.deepGreen}E6 0%, rgba(46,28,19,0.5) 42%, rgba(46,28,19,0.1) 72%, transparent 100%)`,
                      }}
                    />
                    {/* Gold accent line on the front card */}
                    <div
                      className={
                        "absolute inset-x-0 top-0 h-[3px] origin-left transition-transform duration-500 " +
                        (selected === i
                          ? "scale-x-100"
                          : "scale-x-0")
                      }
                      style={{
                        background: `linear-gradient(to right, ${C.gold}, ${C.softGold})`,
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                      <p
                        className="text-[10px] font-bold uppercase tracking-[0.22em]"
                        style={{ color: C.softGold }}
                      >
                        {d.tagline}
                      </p>
                      <h3 className="mt-1 text-base font-bold leading-snug text-white drop-shadow md:text-xl">
                        {d.title}
                      </h3>
                    </div>
                    <span
                      className={
                        "absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider " +
                        (selected === i
                          ? "opacity-100"
                          : "opacity-40")
                      }
                      style={{ background: C.gold, color: C.deepGreen }}
                    >
                      Donate
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </button>
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
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/80 transition-all duration-300 hover:border-[rgba(217,163,74,0.8)] hover:text-[#EECC8B]"
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
                  background:
                    i === selected ? C.gold : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next donations"
            onClick={() => emblaApi?.scrollNext()}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/80 transition-all duration-300 hover:border-[rgba(217,163,74,0.8)] hover:text-[#EECC8B]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}