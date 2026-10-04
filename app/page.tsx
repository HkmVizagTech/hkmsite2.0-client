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
import type { Metadata } from "next";

// Homepage's own canonical — previously this was inherited from a
// sitewide root-layout default that also (incorrectly) applied to every
// other page. Now that the root no longer sets one, the homepage needs
// its own explicit self-reference.
export const metadata: Metadata = {
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
export default function Home() {
  return (
    <div className="min-h-screen bg-white pt-[var(--header-h)]">
      <JsonLd data={homeFaqJsonLd} />
      <Navbar />
      <WhatsAppFloatButton />
      <main>
        <TempleCarousel />
        <DarshanCountdown />
        <WelcomeSection />
        <ExploreBento />
        <TempleConstructionFeature />
        <MomentsSection />
        <SevaTiles />
        <DivineVision />
        <ProgramsTabs />
        <LatestBlogs />
        <HomeFAQ />
        <JoinCTA />
      </main>
      <Footer />
    </div>
  );
}
