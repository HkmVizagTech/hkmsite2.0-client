"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FALLBACK_IMG = "/assets/home-banner-chaitanya-bhavan.webp";
const FALLBACK_IMG_MOBILE = "/assets/home-banner-chaitanya-bhavan-mobile.webp";

export interface TempleCarouselSlide {
  src: string;
  mobileSrc: string;
  title: string;
  linkUrl: string;
}

interface TempleCarouselProps {
  /** Override the default home slides with a custom banner set. */
  slides?: TempleCarouselSlide[];
  /** Set false to skip loading live banners from /hero-banners. */
  fetchApiBanners?: boolean;
}

const defaultSlides: TempleCarouselSlide[] = [
  {
    src: "/assets/home-banner-chaitanya-bhavan.webp",
    mobileSrc: "/assets/home-banner-chaitanya-bhavan-mobile.webp",
    title: "Chaitanya Bhavan",
    linkUrl: "",
  },
  {
    src: "/assets/home-banner-daily-darshan.webp",
    mobileSrc: "/assets/home-banner-daily-darshan-mobile.webp",
    title: "Daily Darshan",
    linkUrl: "",
  },
  {
    src: "/assets/home-banner-radha-madan-mohan.webp",
    mobileSrc: "/assets/home-banner-radha-madan-mohan-mobile.webp",
    title: "Sri Sri Radha Madan Mohan",
    linkUrl: "",
  },
  {
    src: "/assets/home-banner-jagannatha-rath-yatra.webp",
    mobileSrc: "/assets/home-banner-jagannatha-rath-yatra-mobile.webp",
    title: "Jagannatha Rath Yatra",
    linkUrl: "",
  },
  {
    src: "/assets/home-banner-srinivasa-govinda.webp",
    mobileSrc: "/assets/home-banner-srinivasa-govinda-mobile.webp",
    title: "Srinivasa Govinda Temple",
    linkUrl: "",
  },
];

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

/**
 * GVD-standard hero: a centred, rounded banner card with the neighbouring
 * slides peeking in at the sides (desktop), swipeable on touch, autoplaying
 * every 6s and pausing while the visitor interacts. Banners come from the
 * admin-managed /hero-banners endpoint, with bundled fallbacks.
 */
const TempleCarousel = ({ slides: propSlides, fetchApiBanners = true }: TempleCarouselProps = {}) => {
  const [slides, setSlides] = useState<TempleCarouselSlide[]>(propSlides || defaultSlides);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center", skipSnaps: false });

  useEffect(() => {
    if (!fetchApiBanners) return;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/hero-banners`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.banners) && data.banners.length > 0) {
            setSlides(
              data.banners.map((b: any) => ({
                src: b.desktopImage,
                mobileSrc: b.mobileImage,
                title: b.title,
                linkUrl: b.linkUrl || "",
              }))
            );
          }
        }
      } catch {}
    })();
  }, [fetchApiBanners]);

  // Re-measure when the slide set changes (API banners replace defaults).
  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, slides]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    const onDown = () => setPaused(true);
    emblaApi.on("pointerDown", onDown);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("pointerDown", onDown);
    };
  }, [emblaApi]);

  // Autoplay — paused on hover / after the visitor drags.
  useEffect(() => {
    if (!emblaApi || paused || slides.length < 2) return;
    const id = setInterval(() => emblaApi.scrollNext(), 6000);
    return () => clearInterval(id);
  }, [emblaApi, paused, slides.length]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const openSlide = (slide: TempleCarouselSlide, index: number) => {
    // Clicking a peeking neighbour brings it to centre instead of navigating.
    if (index !== selected) {
      emblaApi?.scrollTo(index);
      return;
    }
    if (!slide.linkUrl) return;
    if (/^https?:\/\//i.test(slide.linkUrl)) window.open(slide.linkUrl, "_blank", "noopener");
    else window.location.href = slide.linkUrl;
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Temple highlights"
      className="relative select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {slides.map((slide, i) => {
              const desktopBroken = imgErrors[slide.src];
              const mobileBroken = imgErrors[slide.mobileSrc];
              const isActive = i === selected;
              return (
                <div
                  key={`${slide.src}-${i}`}
                  className="min-w-0 shrink-0 grow-0 basis-full"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${slides.length}: ${slide.title}`}
                >
                  <div
                    role={slide.linkUrl || !isActive ? "button" : undefined}
                    tabIndex={slide.linkUrl || !isActive ? 0 : -1}
                    onClick={() => openSlide(slide, i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") openSlide(slide, i);
                    }}
                    className={`relative aspect-[962/1635] overflow-hidden bg-vk-900 md:aspect-[1920/730] ${slide.linkUrl || !isActive ? "cursor-pointer" : ""}`}
                  >
                    <Image
                      src={mobileBroken ? FALLBACK_IMG_MOBILE : slide.mobileSrc}
                      alt={slide.title}
                      fill
                      sizes="100vw"
                      draggable={false}
                      priority={i === 0}
                      className="object-cover object-center md:hidden"
                      onError={() => setImgErrors((prev) => ({ ...prev, [slide.mobileSrc]: true }))}
                    />
                    <Image
                      src={desktopBroken ? FALLBACK_IMG : slide.src}
                      alt={slide.title}
                      fill
                      sizes="100vw"
                      draggable={false}
                      priority={i === 0}
                      className="hidden object-cover object-center md:block"
                      onError={() => setImgErrors((prev) => ({ ...prev, [slide.src]: true }))}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Arrows — desktop only, over the edges of the full-width banner */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-vk-800 shadow-lg backdrop-blur transition hover:bg-white md:flex lg:left-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-vk-800 shadow-lg backdrop-blur transition hover:bg-white md:flex lg:right-6"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1.5 md:bottom-5" role="tablist" aria-label="Choose slide">
          {slides.map((s, i) => (
            <button
              key={`dot-${i}`}
              type="button"
              role="tab"
              aria-selected={i === selected}
              aria-label={`Go to slide ${i + 1}: ${s.title}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === selected ? "w-7 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default TempleCarousel;
