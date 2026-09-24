"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import { ReactNode } from "react";

const PageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Floating WhatsApp button — global (raised above the mobile bottom nav) */}
      <WhatsAppFloatButton />
      {children}
      <Footer />
    </div>
  );
};

export default PageLayout;
