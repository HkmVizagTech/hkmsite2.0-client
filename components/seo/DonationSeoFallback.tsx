import Link from "next/link";
import { DONATION_SEO, type DonationSeoKey, type DonationSeoEntry } from "@/lib/donationSeo";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/**
 * Server-rendered stand-in for a donation page while its interactive
 * client component (which reads ?amount= etc.) hydrates. It is what
 * crawlers and no-JS visitors receive: a real <h1>, intro text and the seva
 * options with amounts, laid out in the site's own style so the swap to the
 * full page is calm.
 */
export default function DonationSeoFallback({ page }: { page: DonationSeoKey }) {
  const e: DonationSeoEntry = DONATION_SEO[page];
  return (
    <div className="min-h-screen bg-white pt-[var(--header-h)]">
      <section className="bg-gradient-to-b from-vk-100 via-vk-50 to-white">
        <div className="vk-container py-12 text-center md:py-16">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink/60">
            <Link href="/">Home</Link> <span aria-hidden>›</span>{" "}
            {e.sevas.length > 0 && (
              <>
                <Link href="/donate">Donate</Link> <span aria-hidden>›</span>{" "}
              </>
            )}
            <span className="font-semibold text-vk-700">{e.breadcrumb}</span>
          </nav>
          <h1 className="vk-h1 mx-auto max-w-4xl">{e.h1}</h1>
          <div className="mx-auto mt-5 max-w-3xl space-y-3">
            {e.intro.map((p) => (
              <p key={p} className="vk-lead">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {e.sevas.length > 0 && (
        <section className="vk-section">
          <div className="vk-container">
            <h2 className="vk-h2 mb-6 text-center">Seva options</h2>
            <ul className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {e.sevas.map((s) => (
                <li key={s.name} className="vk-card p-5">
                  <h3 className="text-lg font-bold text-ink">{s.name}</h3>
                  {s.amounts && s.amounts.length > 0 && (
                    <p className="mt-2 text-sm text-ink/70">{s.amounts.map(inr).join(" · ")}</p>
                  )}
                  {s.note && <p className="mt-1 text-sm text-muted-foreground">{s.note}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
