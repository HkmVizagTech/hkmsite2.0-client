"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import { ReactNode } from "react";

/** `background` (a CSS background value) paints the page's own colour behind the gap above the footer, so a themed page flows into the footer with no white band. */
const PageLayout = ({ children, whatsappNumber, background }: { children: ReactNode; whatsappNumber?: string; background?: string }) => {
  return (
    <div className="min-h-screen bg-background" style={background ? { background } : undefined}>
      <Navbar />
      {/* Floating WhatsApp button — global (raised above the mobile bottom nav) */}
      <WhatsAppFloatButton number={whatsappNumber} />
      {children}
      <Footer />
    </div>
  );
};

export default PageLayout;
