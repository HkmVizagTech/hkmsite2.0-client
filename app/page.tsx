import Navbar from "@/components/Navbar";
import TempleCarousel from "@/components/TempleCarousel";
import AboutSection from "@/components/AboutSection";
import FounderSection from "@/components/FounderSection";
import SevasSection from "@/components/SevasSection";
import GalleryPreview from "@/components/GalleryPreview";
import EventsPreview from "@/components/EventsPreview";
import BlogPreview from "@/components/BlogPreview";
import SubhojanamSection from "@/components/SubhojanamSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background pt-[88px] md:pt-[104px]">
      <Navbar />
      <TempleCarousel />
      <AboutSection />
      <FounderSection />
      <SevasSection />
      <GalleryPreview />
      <EventsPreview />
      <BlogPreview />
      <SubhojanamSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
