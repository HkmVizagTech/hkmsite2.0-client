"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeading from "@/components/site/SectionHeading";

interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  images: string[];
  date: string;
  category?: string;
  type?: string;
}

const FALLBACK_IMAGES = [
  { src: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1784644188208-1784644186264-WhatsAppImage2026-07-03at1.57.26PM.jpeg", alt: "Temple glimpse" },
  { src: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1784644187783-1784644186209-WhatsAppImage2026-07-03at1.56.14PM.jpeg", alt: "Temple glimpse" },
  { src: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1784644187338-1784644186154-WhatsAppImage2026-07-03at1.56.14PM2.jpeg", alt: "Temple glimpse" },
  { src: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1784644186904-1784644186068-WhatsAppImage2026-07-03at1.56.13PM.jpeg", alt: "Temple glimpse" },
  { src: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1784644186447-1784644185742-WhatsAppImage2026-07-03at1.56.13PM1.jpeg", alt: "Temple glimpse" },
];

const apiBase = () =>
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/+$/, "");

export default function GallerySection() {
  const [images, setImages] = useState<{ src: string; alt: string }[]>(FALLBACK_IMAGES);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${apiBase()}/gallery`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const items: GalleryItem[] = data.items ?? [];
        if (items.length === 0 || cancelled) return;

        const extracted: { src: string; alt: string }[] = [];
        for (const item of items) {
          for (const img of item.images) {
            extracted.push({
              src: img,
              alt: item.title || "Temple & Seva Glimpse",
            });
          }
        }
        if (extracted.length > 0 && !cancelled) {
          setImages(extracted);
        }
      } catch {
        // keep fallback images
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="vk-section vk-band">
      <div className="vk-container">
        <SectionHeading align="center" title="Temple & Seva Glimpses" />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-3 md:gap-4"
        >
          {images.map((g, i) => (
            <div key={g.src + i} className="vk-tile group aspect-[4/3]">
              <Image
                src={g.src}
                alt={g.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
