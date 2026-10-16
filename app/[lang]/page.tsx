import Navbar from "@/components/Navbar";
import TempleCarousel from "@/components/TempleCarousel";
import DarshanCountdown from "@/components/home/DarshanCountdown";
import WelcomeSection from "@/components/home/WelcomeSection";
import ExploreBento from "@/components/home/ExploreBento";
import TempleConstructionFeature from "@/components/home/TempleConstructionFeature";
import MomentsSection from "@/components/home/MomentsSection";
import SevaTiles from "@/components/home/SevaTiles";
import DivineVision from "@/components/home/DivineVision";
import ProgramsTabs from "@/components/home/ProgramsTabs";
import LatestBlogs from "@/components/home/LatestBlogs";
import HomeFAQ from "@/components/home/HomeFAQ";
import JoinCTA from "@/components/home/JoinCTA";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import Footer from "@/components/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { homeFaq } from "@/lib/faq";
import { getHeroSlides } from "@/lib/heroBanners";
import type { Metadata } from "next";

import { localized } from "@/lib/i18n/seo";
// Homepage's own canonical — previously this was inherited from a
// sitewide root-layout default that also (incorrectly) applied to every
// other page. Now that the root no longer sets one, the homepage needs
// its own explicit self-reference.
const baseMetadata: Metadata = {
  // Same as the root layout's default; set here so the Telugu home page gets
  // its translated title and description (lib/i18n/seo.ts).
  title: { absolute: "ISKCON Gambheeram Visakhapatnam | Hare Krishna Vaikuntham Temple, Vizag" },
  description:
    "ISKCON Gambheeram Visakhapatnam — the Hare Krishna Vaikuntham temple on IIM Road, Vizag. Darshan & aarti timings, prasadam, festivals and seva since 2008.",
  alternates: { canonical: "/" },
};

// FAQ rich results belong on the page that shows the FAQ (the HomeFAQ
// section), not on every page of the site.
const homeFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

// Section order follows guptvrindavandham.org: hero → live darshan /
// countdown → welcome → explore bento → mandir nirman → moments → seva
// tiles → founder → programs → blogs → FAQ → volunteer/donate CTAs.
export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const heroSlides = await getHeroSlides();
  return (
    <div className="min-h-screen bg-white pt-[var(--header-h)]">
      <JsonLd data={homeFaqJsonLd} />
      <Navbar />
      <WhatsAppFloatButton />
      <main>
        {/* Banners come with the HTML; only if the server couldn't load them does
            the carousel fall back to fetching them in the browser. */}
        <TempleCarousel slides={heroSlides ?? undefined} fetchApiBanners={!heroSlides} />
        <DarshanCountdown />
        <WelcomeSection />
        <ExploreBento lang={lang} />
        <TempleConstructionFeature />
        <MomentsSection />
        <SevaTiles />
        <DivineVision lang={lang} />
        <ProgramsTabs />
        <LatestBlogs />
        <HomeFAQ />
        <JoinCTA lang={lang} />
      </main>
      <Footer />
    </div>
  );
}

export const generateMetadata = localized(baseMetadata);
