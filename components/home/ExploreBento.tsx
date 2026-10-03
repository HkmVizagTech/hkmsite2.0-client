import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";

interface Tile {
  title: string;
  blurb: string;
  href: string;
  img: string;
  /** Grid placement on lg (4-col, 3-row bento) and on mobile (2-col). */
  cls: string;
}

// 4 × 3 bento (lg). Spans add up to 12 cells — keep them balanced if editing.
const tiles: Tile[] = [
  {
    title: "Temple Festivals",
    blurb: "Janmashtami, Radhashtami, Govardhan Puja & more",
    href: "/festival",
    img: "/assets/gallery-festival-1.jpg",
    cls: "col-span-2 lg:col-span-2",
  },
  {
    title: "Subhojanam",
    blurb: "Nutritious prasadam for those in need",
    href: "/subhojanam",
    img: "/assets/subhojanam.jpg",
    cls: "row-span-2 lg:row-span-2",
  },
  {
    title: "Gau Seva",
    blurb: "Care for our sacred cows",
    href: "/gau-seva",
    img: "/assets/donations-gau-seva-real.jpeg",
    cls: "",
  },
  {
    title: "Sri Srinivasa Govinda",
    blurb: "Darshan of the Lord of the Seven Hills",
    href: "/gallery",
    img: "/assets/home-gallery-srinivasa-govinda.webp",
    cls: "row-span-2 lg:row-span-2",
  },
  {
    title: "Daily Aarti",
    blurb: "Seven aartis from 4:30 AM",
    href: "/daily-schedule",
    img: "/assets/gallery-aarti.jpg",
    cls: "",
  },
  {
    title: "Volunteer",
    blurb: "Serve with the devotee community",
    href: "/volunteer",
    img: "/assets/about-community.jpg",
    cls: "",
  },
  {
    title: "Anna Daan Seva",
    blurb: "Sponsor sanctified meals",
    href: "/anna-daan-seva",
    img: "/assets/home-gallery-annadana.webp",
    cls: "col-span-2 lg:col-span-2",
  },
  {
    title: "Temple Seva",
    blurb: "Offerings for the Lordships",
    href: "/donate",
    img: "/assets/temple-seva.jpg",
    cls: "",
  },
];

/** GVD "Explore Temple" bento — image tiles with a navy gradient and caption. */
export default function ExploreBento() {
  return (
    <section className="vk-section vk-band">
      <div className="vk-container">
        <SectionHeading
          eyebrow="Discover the Dham"
          title="Explore Hare Krishna Vaikuntham"
          subtitle="From daily darshan and aarti to Subhojanam, Gau Seva and grand festivals — explore everything that makes our temple in Gambheeram a home for every seeker."
          action={{ href: "/about", label: "View All" }}
        />
        <div className="grid grid-flow-row-dense auto-rows-[150px] grid-cols-2 gap-3 md:auto-rows-[190px] md:gap-4 lg:grid-cols-4">
          {tiles.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.04} className={t.cls}>
              <Link href={t.href} className="vk-tile group block h-full w-full">
                <Image
                  src={t.img}
                  alt={t.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover"
                />
                <div className="vk-tile-caption flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold leading-tight text-white md:text-xl">{t.title}</h3>
                    <p className="mt-1 hidden text-[13px] leading-snug text-white/80 sm:block">{t.blurb}</p>
                  </div>
                  <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors group-hover:bg-white group-hover:text-vk-800 sm:flex">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
