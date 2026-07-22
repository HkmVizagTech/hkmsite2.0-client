"use client";

interface FinalCtaSectionProps {
  scrollToDonate: () => void;
}

export default function FinalCtaSection({ scrollToDonate }: FinalCtaSectionProps) {
  return (
    <section className="bg-[hsl(220,90%,12%)] py-16 text-center md:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <h2 className="mb-6 font-heading text-2xl font-bold text-white md:text-4xl">
          Every square foot you offer becomes part of the Lord&apos;s eternal home.
        </h2>
        <button
          onClick={scrollToDonate}
          className="rounded-full bg-gradient-gold px-10 py-4 text-base font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)] transition-all hover:scale-105 hover:shadow-[0_12px_32px_hsl(42,92%,46%,0.4)] md:text-lg"
        >
          Donate Now
        </button>
      </div>
    </section>
  );
}
