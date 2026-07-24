"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const defaultSlides = [
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

const TempleCarousel = () => {
  const [slides, setSlides] = useState(defaultSlides);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  useEffect(() => {
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
  }, []);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next]);

  useEffect(() => {
    setCurrent(0);
  }, [slides.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dx > 10 && dx > dy * 1.5) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
    isSwiping.current = false;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
    isSwiping.current = false;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isSwiping.current) return;
    const dx = e.clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
    isSwiping.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const dx = Math.abs(e.clientX - touchStartX.current);
    if (dx > 5) isSwiping.current = true;
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  const currentSlide = slides[current] || slides[0];
  const hasLink = Boolean(currentSlide.linkUrl);
  const isExternal = hasLink && /^https?:\/\//i.test(currentSlide.linkUrl);

  const slideImages = (
    <>
      <Image
        src={currentSlide.mobileSrc}
        alt={currentSlide.title}
        fill
        sizes="100vw"
        className="object-cover object-center md:hidden"
        priority
      />
      <Image
        src={currentSlide.src}
        alt={currentSlide.title}
        fill
        sizes="100vw"
        className="hidden object-cover object-center md:block"
        priority
      />
    </>
  );

  return (
    <section
      className="relative w-full overflow-hidden bg-foreground aspect-[1080/1350] md:aspect-[1920/700]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor: "grab" }}
    >
      <AnimatePresence custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.25, 0.8, 0.25, 1] }}
          className="absolute inset-0"
        >
          {!hasLink ? (
            slideImages
          ) : isExternal ? (
            <a
              href={currentSlide.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 block cursor-pointer"
              aria-label={currentSlide.title}
            >
              {slideImages}
            </a>
          ) : (
            <Link href={currentSlide.linkUrl} className="absolute inset-0 block cursor-pointer" aria-label={currentSlide.title}>
              {slideImages}
            </Link>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default TempleCarousel;
