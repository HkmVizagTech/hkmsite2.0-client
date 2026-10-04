import Link from "next/link";
import { CheckCircle2, Home, Megaphone } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { getCampaignConfig } from "@/lib/campaignConfig";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Thank You for Your Seva",
  description: "Thank you for supporting the temple construction of ISKCON Gambheeram Visakhapatnam. Hare Krishna!",
  path: "/sqft-seva-campaign/thank-you",
  noindex: true
});

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
      <main className="bg-white pt-[var(--header-h)]">
        <section className="bg-gradient-to-b from-vk-50 to-white pb-4 pt-4 md:pb-6 md:pt-6">
          <div className="vk-container">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-vk-900 via-vk-800 to-vk-700 px-6 py-12 text-center shadow-[0_24px_60px_-28px_rgba(10,18,51,0.6)] md:py-16">
              <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5" />
              <div className="relative mx-auto max-w-2xl">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-gold shadow-[var(--shadow-gold)]">
                  <CheckCircle2 className="h-11 w-11 text-vk-900" />
                </div>
                <span className="vk-pill-light mb-4">Hare Krishna 🙏</span>
                <h1 className="vk-h1 mb-4 !text-white">
                  Thank You for Your Seva
                </h1>
                <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-white/80 md:text-base">
                  {unitsLabel ? (
                    <>
                      You have sponsored <span className="font-semibold text-[hsl(var(--gold))]">{unitsLabel}</span>
                      {amountLabel ? <> ({amountLabel})</> : null} of the Hare Krishna Vaikuntham Temple.
                    </>
                  ) : amountLabel ? (
                    <>
                      Your contribution of <span className="font-semibold text-[hsl(var(--gold))]">{amountLabel}</span> has been
                      received with gratitude.
                    </>
                  ) : (
                    <>Your contribution has been received with gratitude.</>
                  )}{" "}
                  {`Every ${config.unitName} you offer becomes a permanent part of the Lord’s eternal abode.`}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="vk-section">
          <div className="vk-container">
            <div className="vk-card mx-auto max-w-2xl !rounded-3xl p-6 text-center md:p-8">
              <h2 className="vk-h3 mb-5">
                What happens next
              </h2>
              <ul className="mx-auto max-w-md space-y-3 text-left text-sm text-muted-foreground">
                <li className="flex items-start gap-3 rounded-xl bg-vk-50 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-vk-500" />
                  A payment confirmation and receipt have been emailed to you.
                </li>
                <li className="flex items-start gap-3 rounded-xl bg-vk-50 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-vk-500" />
                  If you requested an 80G certificate, it follows once your PAN is verified.
                </li>
                <li className="flex items-start gap-3 rounded-xl bg-vk-50 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-vk-500" />
                  Sanctified prasadam (within India) will be arranged and our team may reach out for details.
                </li>
              </ul>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href={`/${campaignPath}`} className="vk-btn-primary h-12 px-6">
                  <Home className="h-4 w-4" /> Back to Campaign
                </Link>
                <Link href={`/${campaignPath}/register`} className="vk-btn-outline h-12 px-6">
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
