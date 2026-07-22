"use client";

import Ornament from "@/components/Ornament";

export default function FounderSection() {
  return (
    <section className="bg-card py-16 md:py-24">
      <div className="container mx-auto max-w-2xl px-4 text-center">
        <Ornament className="mb-6" />
        <p className="mb-6 font-heading text-xl italic leading-relaxed text-primary md:text-2xl">
          &ldquo;I am not this body. I am a spirit soul, part and parcel of the Supreme Lord. My real
          business is to serve Him with love and devotion.&rdquo;
        </p>
        <p className="text-sm font-semibold text-gold">— Srila Prabhupada</p>
        <p className="text-xs text-muted-foreground">
          Founder-Acharya, International Society for Krishna Consciousness
        </p>
      </div>
    </section>
  );
}
