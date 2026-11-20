"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import { ReactNode } from "react";

/** `background` (a CSS background value) paints the page's own colour behind the gap above the footer, so a themed page flows into the footer with no white band.
 *  `hideWhatsApp` drops the floating WhatsApp button and the header's WhatsApp icon (for pages that have their own floating action). */
const PageLayout = ({ children, whatsappNumber, background, hideWhatsApp = false }: { children: ReactNode; whatsappNumber?: string; background?: string; hideWhatsApp?: boolean }) => {
  return (
    <div className="min-h-screen bg-background" style={background ? { background } : undefined}>
      <Navbar hideWhatsApp={hideWhatsApp} />
      {/* Floating WhatsApp button — global (raised above the mobile bottom nav) */}
      {!hideWhatsApp && <WhatsAppFloatButton number={whatsappNumber} />}
      {children}
      <Footer />
    </div>
  );
};

export default PageLayout;
