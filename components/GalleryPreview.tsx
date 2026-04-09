"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Image as ImageIcon } from "lucide-react";

const previewImages = [
  { src: "/assets/gallery-darshan-1.jpg", title: "Sri Krishna Darshan" },
  { src: "/assets/gallery-festival-1.jpg", title: "Festival Celebrations" },
  { src: "/assets/gallery-aarti.jpg", title: "Mangala Aarti" },
  { src: "/assets/gallery-festival-2.jpg", title: "Temple Decorations" },
];

const GalleryPreview = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 bg-card" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">Gallery</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
            Divine Moments
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience the beauty of daily darshan, grand festivals, and community service through our gallery.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {previewImages.map((img, i) => (
            <motion.div
              key={img.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="relative group overflow-hidden rounded-2xl aspect-square"
            >
              <Image
                src={img.src}
                alt={img.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="absolute bottom-3 left-3 right-3 text-background text-sm font-heading font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                {img.title}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <ImageIcon className="w-4 h-4" />
            View Full Gallery
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
