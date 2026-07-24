"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import Ornament from "@/components/Ornament";

// Asymmetric editorial grid — one hero tile, one tall tile, four standard
const tiles = [
  { src: "/assets/home-gallery-radha-krishna.webp", title: "Sri Sri Radha Madan Mohan", span: "col-span-2 row-span-2" },
  { src: "/assets/home-gallery-aarti.webp", title: "Sandhya Aarti", span: "row-span-2" },
  { src: "/assets/home-gallery-srinivasa-govinda.webp", title: "Srinivasa Govinda Darshan", span: "" },
  { src: "/assets/home-gallery-annadana.webp", title: "Annadana Seva", span: "" },
  { src: "/assets/home-banner-jagannatha-rath-yatra.webp", title: "Jagannatha Rath Yatra", span: "" },
  { src: "/assets/home-banner-chaitanya-bhavan.webp", title: "Chaitanya Bhavan", span: "" },
];

const GalleryPreview = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-white py-12 md:py-16" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold">Divine Moments</p>
          <Ornament className="mb-5" />
          <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-5xl">
            Temple Gallery
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Glimpses of darshan, worship, prasadam distribution, and festival life at Hare Krishna Vaikuntham.
          </p>
        </motion.div>

        <div className="mx-auto mb-10 grid max-w-5xl auto-rows-[140px] grid-cols-2 gap-3.5 md:auto-rows-[150px] md:grid-cols-4 md:gap-4">
          {tiles.map((img, i) => (
            <motion.div
              key={img.title}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
              className={`group relative overflow-hidden rounded-2xl shadow-warm ${img.span}`}
            >
              <Image
                src={img.src}
                alt={img.title}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[hsl(220,85%,10%,0.72)] via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="font-heading text-sm font-semibold text-background">{img.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90"
          >
            <ImageIcon className="h-4 w-4" />
            View Full Gallery
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
