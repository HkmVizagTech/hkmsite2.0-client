"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import { ReactNode } from "react";

const PageLayout = ({ children, whatsappNumber }: { children: ReactNode; whatsappNumber?: string }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Floating WhatsApp button — global (raised above the mobile bottom nav) */}
      <WhatsAppFloatButton number={whatsappNumber} />
      {children}
      <Footer />
    </div>
  );
};

export default PageLayout;
