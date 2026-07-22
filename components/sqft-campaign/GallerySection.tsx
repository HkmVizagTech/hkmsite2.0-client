"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Ornament from "@/components/Ornament";

const gallery = [
  { src: "/assets/home-temple-construction-banner.webp", alt: "Hare Krishna Vaikuntham Temple construction" },
  { src: "/assets/vizag-temple-1.jpeg", alt: "Temple view" },
  { src: "/assets/gallery-darshan-1.jpg", alt: "Deity darshan" },
  { src: "/assets/gallery-festival-1.jpg", alt: "Festival celebration" },
  { src: "/assets/gallery-annadaan-1.jpg", alt: "Annadana Seva" },
  { src: "/assets/gallery-aarti.jpg", alt: "Evening aarti" },
];

export default function GallerySection() {
  return (
    <section className="bg-card py-16 md:py-24">
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
          {gallery.map((g) => (
            <div key={g.src + g.alt} className="group relative aspect-[4/3] overflow-hidden rounded-2xl">
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
