"use client";

export default function FounderSection() {
  return (
    <section className="vk-section bg-white">
      <div className="vk-container">
        <figure className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-vk-100 via-vk-50 to-white px-6 py-10 text-center md:px-12 md:py-12">
          <p className="mb-4 font-heading text-base font-semibold text-vk-700 md:text-lg">
            yat karoṣi yad aśnāsi yaj juhoṣi dadāsi yat
yat tapasyasi kaunteya tat kuruṣva mad-arpaṇam
          </p>
          <blockquote className="mb-6 font-serif-display text-xl italic leading-relaxed text-ink md:text-2xl">
            &ldquo;Whatever you do, whatever you eat, whatever you offer or give away, whatever austerity
            you perform — do it as an offering to Me.&rdquo;
          </blockquote>
          <figcaption>
            <span className="vk-pill-soft">— Bhagavad Gita 9.27</span>
            <p className="mt-2 text-xs text-muted-foreground">
              Spoken by Lord Sri Krishna
            </p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
