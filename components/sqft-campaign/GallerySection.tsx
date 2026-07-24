"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Ornament from "@/components/Ornament";

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
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto max-w-5xl px-4">
        <Ornament className="mb-6" />
        <h2 className="mb-8 text-center font-heading text-2xl font-bold text-primary md:text-3xl">
          Temple &amp; Seva Glimpses
        </h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-3 md:grid-cols-3"
        >
          {images.map((g, i) => (
            <div key={g.src + i} className="group relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={g.src}
                alt={g.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
