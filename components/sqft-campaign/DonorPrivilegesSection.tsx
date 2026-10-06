"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/site/SectionHeading";
import type { CampaignConfig } from "@/lib/campaignConfig";
import { SQFT_CAMPAIGN } from "@/lib/campaignConfig";
import { useT } from "@/components/i18n/LocaleProvider";

const CLOUDINARY_BASE = "https://guptvrindavandham.org/media/campaign";

const CAROUSEL_IMAGES = [
  { src: `${CLOUDINARY_BASE}/mhaprashdam_image_gallery.webp`, caption: "Maha Prasadam" },
  { src: `${CLOUDINARY_BASE}/80g_Wbxrdiv_gFmZMqH.webp`, caption: "80G Tax Exemption" },
  { src: `${CLOUDINARY_BASE}/SANKALPA_SQUARE_FEET_SEVA.webp`, caption: "Sankalpa & Aarti" },
  { src: `${CLOUDINARY_BASE}/NARSIMHA_KAVACH_SUTRA_SQUARE_FEET.webp`, caption: "Narasimha Kavach Sutra" },
  { src: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785398618210-1785398617184-sqftcert.webp", caption: "Contribution Certificate" },
  { src: `${CLOUDINARY_BASE}/narsimha_tilak_1.webp`, caption: "Narasimha Yagna Tilak" },
  { src: `${CLOUDINARY_BASE}/Picture_of_Krishna_image_gallery_YWVbbL6.webp`, caption: "Sri Krishna" },
];

const PRIVILEGES = [
  { lead: "Maha Prasadam", rest: " from the temple kitchen, sent to your home as a blessing for your seva." },
  { lead: "Sankalp and Aarti", rest: " will be performed on your name." },
  { lead: "Spiritual Books", rest: " — a special gift to deepen your journey in Krishna consciousness." },
  { lead: "80G Tax Exemption", rest: " on your donation, under Section 80G of the Income Tax Act." },
  { lead: "Digital Contribution Certificate", rest: " honouring your valued seva to the temple." },
  { lead: "Narasimha Kavach Sutra", rest: " for protection from all dangers." },
  { lead: "Narasimha Yagna Tilak", rest: " — a sacred tilak blessed during yagna." },
];

const OTHER_PRIVILEGES = [
  { src: `${CLOUDINARY_BASE}/Untitled_design.webp`, caption: "Name Inscription" },
  { src: `${CLOUDINARY_BASE}/3_UhAzXJT.png`, caption: "Special Family Pujas" },
  { src: `${CLOUDINARY_BASE}/mahaprashdam_box_image.webp`, caption: "Maha Prasadam Box" },
  { src: `${CLOUDINARY_BASE}/7.png`, caption: "Spiritual Books Set" },
  { src: `${CLOUDINARY_BASE}/6_FDX1D3S.webp`, caption: "Inauguration Invitation" },
  { src: `${CLOUDINARY_BASE}/1_vT6BI21.png`, caption: "Deity Blessings" },
  { src: `${CLOUDINARY_BASE}/4.png`, caption: "Premium Donor Gifts" },
];

function PrivilegeCarousel({ extraImage }: { extraImage?: { src: string; caption: string } }) {
  const t = useT();
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(0);

  // Brick campaigns append the temple's laser engraving machine — the image
  // that shows how a donor's name ends up on the actual brick.
  const images = extraImage ? [...CAROUSEL_IMAGES, extraImage] : CAROUSEL_IMAGES;

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 4000);
    return () => clearInterval(id);
  }, [images.length]);

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-vk-900 shadow-card sm:aspect-[5/4]"
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        const diff = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(diff) > 50) diff > 0 ? prev() : next();
      }}
    >
      {images.map((img, i) => (
        <div
          key={img.src}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <Image
            src={img.src}
            alt={t(img.caption)}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      ))}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-vk-900/40 px-2 py-1.5 backdrop-blur-sm">
        <button
          type="button"
          aria-label={t("Previous image")}
          onClick={prev}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-vk-700 transition hover:bg-white"
        >
          <ChevronLeft className="h-3 w-3" />
        </button>
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            aria-label={t("Show {caption}", { caption: t(img.caption) })}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
        <button
          type="button"
          aria-label={t("Next image")}
          onClick={next}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-vk-700 transition hover:bg-white"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function OtherPrivilegesGallery({ config = SQFT_CAMPAIGN }: { config?: CampaignConfig }) {
  const t = useT();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 380, behavior: "smooth" });
  };

  return (
    <div className="relative mt-14 md:mt-16">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h3 className="vk-h3 vk-bar-title">
          {t("Other Donor Privileges")}
        </h3>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            aria-label={t("Scroll left")}
            onClick={() => scrollBy(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-vk-200 bg-white text-vk-700 transition hover:border-vk-700 hover:bg-vk-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label={t("Scroll right")}
            onClick={() => scrollBy(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-vk-200 bg-white text-vk-700 transition hover:border-vk-700 hover:bg-vk-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <p className="vk-lead mb-6 max-w-3xl">
        {t("Each of our respected contributors who donate more than 1 {unit} will receive the following privileges based on Donation Level.", { unit: t(config.unitName) })}
      </p>

      <div
        ref={scrollerRef}
        className="vk-scroller"
      >
        {OTHER_PRIVILEGES.map((p) => (
          <div
            key={p.caption}
            className="relative aspect-[4/5] w-64 shrink-0 overflow-hidden rounded-2xl border border-vk-100 bg-vk-50 shadow-card min-[360px]:w-72 sm:w-80 lg:w-96"
          >
            <Image src={p.src} alt={t(p.caption)} fill sizes="(max-width: 640px) 320px, 384px" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DonorPrivilegesSection({ scrollToDonate, config = SQFT_CAMPAIGN }: { scrollToDonate?: () => void; config?: CampaignConfig }) {
  const t = useT();
  // Brick Seva alone: a donor's name is engraved on the very brick they
  // sponsor, so lead the privilege list with it and show the machine that
  // does the engraving in the carousel.
  const brickEngravingImage =
    config.type === "BRICK" && config.engravingImage
      ? { src: config.engravingImage, caption: "Laser Name Engraving" }
      : undefined;
  const privileges = brickEngravingImage
    ? [
        {
          lead: "Your Name on a Brick",
          rest: t(" — the {unit} you sponsor is laser-engraved with your name before it is laid in the temple.", { unit: t(config.unitName) }),
        },
        ...PRIVILEGES,
      ]
    : PRIVILEGES;

  return (
    <section className="vk-section bg-white">
      <div className="vk-container">
        <SectionHeading align="center" eyebrow={t("Our gratitude to every donor")} title={t("Donor Privileges")} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
        >
          <PrivilegeCarousel extraImage={brickEngravingImage} />

          <div>
            <p className="vk-lead mb-5">
              {t("Each of our respected contributors will receive these privileges as our heartfelt gratitude:")}
            </p>
            <ol className="space-y-3">
              {privileges.map((p, i) => (
                <li key={p.lead} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-vk-100 text-xs font-bold text-vk-700">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-ink/80 md:text-[15px]">
                    <span className="font-bold text-ink">{t(p.lead)}</span>
                    {t(p.rest)}
                  </p>
                </li>
              ))}
            </ol>

            {scrollToDonate && (
              <button
                onClick={scrollToDonate}
                className="vk-btn-gold mt-8 h-12 px-8 text-base"
              >
                {t("Donate Now")}
              </button>
            )}
          </div>
        </motion.div>

        <OtherPrivilegesGallery config={config} />
      </div>
    </section>
  );
}
