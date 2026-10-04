import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Terms & Conditions",
  description:
    "Terms for using the ISKCON Gambheeram Visakhapatnam website, donations, event registrations and the Matchless Gifts store.",
  path: "/terms-and-conditions",
});

const sections = [
  {
    h: "Acceptance of Terms",
    p: "By accessing this website, making a donation, or registering for an event, you agree to these Terms & Conditions. If you do not agree, please refrain from using the website.",
  },
  {
    h: "About Us",
    p: "This website is operated by Hare Krishna Movement, Visakhapatnam (Hare Krishna Vaikuntham), a spiritual and charitable organisation located in Visakhapatnam, Andhra Pradesh, India.",
  },
  {
    h: "Donations",
    p: "All donations made through this website are voluntary contributions towards the temple's charitable, religious, and community activities including Anna Daan (food distribution), Gau Seva (cow protection), temple construction, and festival services. Donations are processed in Indian Rupees (INR) through Razorpay.",
  },
  {
    h: "80G Tax Exemption",
    p: "Eligible donations qualify for tax exemption under Section 80G of the Income Tax Act, 1961. To receive an 80G receipt, you must provide accurate PAN details at the time of donation. Receipts are issued to the name and PAN provided; corrections after issuance may not be possible.",
  },
  {
    h: "Event Registrations",
    p: "Event registrations are confirmed subject to availability. The temple reserves the right to modify event schedules, venues, or programs due to circumstances beyond our control. Registered participants will be notified of significant changes.",
  },
  {
    h: "Website Content",
    p: "All content on this website — text, images, logos, and design — is the property of Hare Krishna Movement Visakhapatnam or used with permission. Content may be shared for personal, non-commercial devotional purposes with attribution. Commercial use requires written permission.",
  },
  {
    h: "User Conduct",
    p: "You agree not to misuse the website, attempt unauthorised access, submit false information, or use the platform for any unlawful purpose.",
  },
  {
    h: "Limitation of Liability",
    p: "The website is provided on an 'as is' basis. While we strive for accuracy, we do not warrant that all information is error-free. To the maximum extent permitted by law, Hare Krishna Movement Visakhapatnam shall not be liable for indirect or consequential damages arising from website use.",
  },
  {
    h: "Governing Law",
    p: "These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Visakhapatnam, Andhra Pradesh.",
  },
  {
    h: "Contact",
    p: "Questions about these terms may be directed to social@hkmvizag.org.",
  },
];

export default function TermsAndConditions() {
  return (
    <PageLayout>
      <div className="pt-[var(--header-h)]">
        <PageHero title="Terms & Conditions" subtitle="Terms governing use of this website and our services" breadcrumb="Terms & Conditions" />
        <section className="vk-section">
          <div className="vk-container grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-12">
            {/* On-page contents — sticky on desktop */}
            <aside className="hidden lg:block">
              <nav aria-label="On this page" className="vk-card sticky top-[calc(var(--header-h)+1.5rem)] p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-vk-700">On this page</p>
                <ol className="space-y-1">
                  {sections.map((s, i) => (
                    <li key={s.h}>
                      <a
                        href={`#section-${i + 1}`}
                        className="flex gap-2 rounded-lg px-2 py-1.5 text-sm text-ink/70 transition-colors hover:bg-vk-50 hover:text-vk-700"
                      >
                        <span className="tabular-nums text-vk-400">{i + 1}.</span>
                        <span>{s.h}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <article className="vk-card min-w-0 p-5 sm:p-8 md:p-10">
              <span className="vk-pill-soft">Last updated: July 2026</span>
              <div className="vk-prose mt-2">
                {sections.map((s, i) => (
                  <section key={s.h} id={`section-${i + 1}`} className="scroll-mt-[calc(var(--header-h)+1rem)]">
                    <h2 className="!mt-8 flex items-baseline gap-3">
                      <span className="text-base font-bold tabular-nums text-vk-500">{String(i + 1).padStart(2, "0")}</span>
                      <span>{s.h}</span>
                    </h2>
                    <p className="text-muted-foreground">{s.p}</p>
                  </section>
                ))}
              </div>
            </article>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
