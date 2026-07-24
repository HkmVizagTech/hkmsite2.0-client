"use client";

import Ornament from "@/components/Ornament";

export default function FounderSection() {
  return (
    <section className="bg-card py-12 md:py-16">
      <div className="container mx-auto max-w-2xl px-4 text-center">
        <Ornament className="mb-6" />
        <p className="mb-3 font-heading text-lg text-gold md:text-xl">
          yat karoṣi yad aśnāsi yaj juhoṣi dadāsi yat
yat tapasyasi kaunteya tat kuruṣva mad-arpaṇam
        </p>
        <p className="mb-6 font-heading text-xl italic leading-relaxed text-primary md:text-2xl">
          &ldquo;Whatever you do, whatever you eat, whatever you offer or give away, whatever austerity
          you perform — do it as an offering to Me.&rdquo;
        </p>
        <p className="text-sm font-semibold text-gold">— Bhagavad Gita 9.27</p>
        <p className="text-xs text-muted-foreground">
          Spoken by Lord Sri Krishna
        </p>
      </div>
    </section>
  );
}
