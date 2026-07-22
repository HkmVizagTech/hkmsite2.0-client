"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Ornament from "@/components/Ornament";

const CAROUSEL_IMAGES = [
  { src: "/assets/donor-priv-radha-madan-mohan.jpg", caption: "Sri Radha Madan Mohan" },
  { src: "/assets/donor-priv-daily-darshan.webp", caption: "Daily Deity Darshan" },
  { src: "/assets/gallery-aarti.jpg", caption: "Sacred Aarti" },
  { src: "/assets/subhojanam.jpg", caption: "Prasadam Offering" },
];

const PRIVILEGES = [
  { lead: "Maha Prasadam", rest: " from the temple kitchen, sent to your home as a blessing for your seva." },
  { lead: "Puja & Aarti Participation", rest: " on the temple's most auspicious days, in your name." },
  { lead: "Spiritual Books", rest: " — a special gift to deepen your journey in Krishna consciousness." },
  { lead: "80G Tax Exemption", rest: " on your donation, under Section 80G of the Income Tax Act." },
  { lead: "Digital Contribution Certificate", rest: " honouring your valued seva to the temple." },
];

const OTHER_PRIVILEGES = [
  { src: "/assets/hero-temple.jpg", caption: "Name Inscription" },
  { src: "/assets/gallery-annadaan-1.jpg", caption: "Maha Prasadam" },
  { src: "/assets/gallery-class.jpg", caption: "Spiritual Books" },
  { src: "/assets/gallery-festival-1.jpg", caption: "Special Family Pujas" },
  { src: "/assets/donor-priv-radha-madan-mohan.jpg", caption: "Deity Blessings" },
  { src: "/assets/vizag-temple-1.jpeg", caption: "Inauguration Invitation" },
];

function PrivilegeCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % CAROUSEL_IMAGES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border border-border shadow-sm sm:aspect-[5/4]">
      {CAROUSEL_IMAGES.map((img, i) => (
        <div
          key={img.src}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <Image
            src={img.src}
            alt={img.caption}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
        {CAROUSEL_IMAGES[index].caption}
      </div>

      <div className="absolute bottom-4 right-4 flex gap-1.5">
        {CAROUSEL_IMAGES.map((img, i) => (
          <button
            key={img.src}
            type="button"
            aria-label={`Show ${img.caption}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-5 bg-gold" : "w-1.5 bg-white/60 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function OtherPrivilegesGallery() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 380, behavior: "smooth" });
  };

  return (
    <div className="relative mt-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h3 className="font-heading text-2xl font-bold text-primary md:text-3xl">
          Other Donor Privileges
        </h3>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollBy(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-gold hover:text-gold"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollBy(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-gold hover:text-gold"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {OTHER_PRIVILEGES.map((p) => (
          <div
            key={p.caption}
            className="relative aspect-[4/3] w-80 shrink-0 snap-start overflow-hidden rounded-2xl border border-border sm:w-96"
          >
            <Image src={p.src} alt={p.caption} fill sizes="(max-width: 640px) 320px, 384px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur">
              {p.caption}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DonorPrivilegesSection({ scrollToDonate }: { scrollToDonate?: () => void }) {
  return (
    <section className="bg-[radial-gradient(circle_at_top,_rgba(255,221,91,0.14),_transparent_45%)] bg-card py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <Ornament className="mb-6" />
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gold">Our gratitude to every donor</p>
          <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">Donor Privileges</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid items-center gap-10 lg:grid-cols-2"
        >
          <PrivilegeCarousel />

          <div>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground md:text-base">
              Each of our respected contributors will receive these privileges as our heartfelt gratitude:
            </p>
            <ol className="space-y-4">
              {PRIVILEGES.map((p, i) => (
                <li key={p.lead} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-gold">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-foreground md:text-base">
                    <span className="font-bold text-primary">{p.lead}</span>
                    {p.rest}
                  </p>
                </li>
              ))}
            </ol>

            {scrollToDonate && (
              <button
                onClick={scrollToDonate}
                className="mt-8 rounded-full bg-gradient-gold px-8 py-3.5 text-sm font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)] transition-transform hover:scale-105 md:text-base"
              >
                Donate Now
              </button>
            )}
          </div>
        </motion.div>

        <OtherPrivilegesGallery />
      </div>
    </section>
  );
}
