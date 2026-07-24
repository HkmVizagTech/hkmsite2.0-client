import Navbar from "@/components/Navbar";
import TempleCarousel from "@/components/TempleCarousel";
import AboutSection from "@/components/AboutSection";
import FounderSection from "@/components/FounderSection";
import SevasSection from "@/components/SevasSection";
import GalleryPreview from "@/components/GalleryPreview";
import BlogPreview from "@/components/BlogPreview";
import SubhojanamSection from "@/components/SubhojanamSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white pt-[88px] md:pt-[104px]">
      <Navbar />
      <TempleCarousel />
      <AboutSection />
      <FounderSection />
      <SevasSection />
      <GalleryPreview />
      {/* Upcoming Celebrations temporarily disabled — component kept intact
          in components/EventsPreview.tsx, just not rendered here for now. */}
      <BlogPreview />
      <SubhojanamSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
