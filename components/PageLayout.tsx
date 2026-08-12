"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppCommunityBanner from "@/components/WhatsAppCommunityBanner";
import { ReactNode } from "react";

const PageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {children}
      <Footer />
      <WhatsAppCommunityBanner />
    </div>
  );
};

export default PageLayout;
