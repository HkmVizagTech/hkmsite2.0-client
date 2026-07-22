import Link from "next/link";
import { CheckCircle2, Home, Megaphone } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import Ornament from "@/components/Ornament";
import { getCampaignConfig } from "@/lib/campaignConfig";

export const metadata = {
  title: "Thank You for Your Seva | Hare Krishna Vaikuntham Temple",
  robots: { index: false },
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; units?: string; type?: string }>;
}) {
  const sp = await searchParams;
  const type = sp.type === "BRICK" ? "BRICK" : "SQFT";
  const config = getCampaignConfig(type);
  const amount = Number(sp.amount) || 0;
  const units = Number(sp.units) || 0;
  const campaignPath = type === "BRICK" ? "brick-seva-campaign" : "sqft-seva-campaign";

  const amountLabel = amount > 0 ? `₹${amount.toLocaleString("en-IN")}` : "";
  const unitsLabel =
    units > 0 ? `${units.toLocaleString("en-IN")} ${units === 1 ? config.unitName : config.unitNamePlural}` : "";

  return (
    <PageLayout>
      <main className="bg-background pt-24 md:pt-28">
        <section className="bg-[hsl(220,90%,12%)] py-16 md:py-24">
          <div className="container mx-auto max-w-2xl px-4 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-gold shadow-[var(--shadow-gold)]">
              <CheckCircle2 className="h-11 w-11 text-[hsl(220,90%,12%)]" />
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">Hare Krishna 🙏</p>
            <h1 className="mb-4 font-heading text-3xl font-bold text-white md:text-5xl">
              Thank You for Your Seva
            </h1>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
              {unitsLabel ? (
                <>
                  You have sponsored <span className="font-semibold text-gold">{unitsLabel}</span>
                  {amountLabel ? <> ({amountLabel})</> : null} of the Hare Krishna Vaikuntham Temple.
                </>
              ) : amountLabel ? (
                <>
                  Your contribution of <span className="font-semibold text-gold">{amountLabel}</span> has been
                  received with gratitude.
                </>
              ) : (
                <>Your contribution has been received with gratitude.</>
              )}{" "}
              {`Every ${config.unitName} you offer becomes a permanent part of the Lord’s eternal abode.`}
            </p>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="container mx-auto max-w-2xl px-4">
            <Ornament className="mb-8" />
            <div className="rounded-2xl border border-border bg-card p-6 text-center md:p-8">
              <h2 className="mb-4 font-heading text-xl font-bold text-primary md:text-2xl">
                What happens next
              </h2>
              <ul className="mx-auto max-w-md space-y-3 text-left text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  A payment confirmation and receipt have been emailed to you.
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  If you requested an 80G certificate, it follows once your PAN is verified.
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  Sanctified prasadam (within India) will be arranged and our team may reach out for details.
                </li>
              </ul>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href={`/${campaignPath}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-8 py-3 text-sm font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)] transition-transform hover:scale-105"
                >
                  <Home className="h-4 w-4" /> Back to Campaign
                </Link>
                <Link
                  href={`/${campaignPath}/register`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-gold px-8 py-3 text-sm font-bold text-gold transition-colors hover:bg-gold/10"
                >
                  <Megaphone className="h-4 w-4" /> Start Your Own Campaign
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
