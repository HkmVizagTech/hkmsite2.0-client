import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Privacy Policy",
  description:
    "How ISKCON Gambheeram Visakhapatnam (Hare Krishna Movement India, Visakhapatnam) collects, uses and protects your personal information.",
  path: "/privacy-policy",
});

const sections = [
  {
    h: "Information We Collect",
    p: "When you donate, register for events, or contact us, we may collect your name, email address, phone number, postal address, and PAN number (for 80G tax-exemption receipts). Payment card details are processed directly by our payment gateway (Razorpay) and are never stored on our servers.",
  },
  {
    h: "How We Use Your Information",
    p: "We use your information to process donations and issue receipts, register you for events and programs, send prasadam or donation acknowledgements to your address, communicate temple updates and festival invitations (only if you opt in), and comply with legal and tax obligations under Indian law including the Income Tax Act, 1961.",
  },
  {
    h: "Payment Processing",
    p: "All online payments are processed securely through Razorpay, a PCI-DSS-compliant payment gateway. Your card, UPI, and banking credentials are transmitted directly to Razorpay over encrypted channels. We receive only a payment confirmation and transaction reference.",
  },
  {
    h: "Data Sharing",
    p: "We do not sell, rent, or trade your personal information. Data is shared only with: our payment gateway (to process transactions), our donor-management system (to issue 80G receipts), and government authorities where required by law.",
  },
  {
    h: "Data Security",
    p: "We employ industry-standard measures — encrypted connections (HTTPS), access controls, and secure cloud infrastructure — to protect your data. While no system is completely immune, we continuously work to safeguard your information.",
  },
  {
    h: "Cookies",
    p: "Our website uses essential cookies to keep you signed in and remember preferences. We may use analytics cookies to understand site usage; these do not personally identify you.",
  },
  {
    h: "Your Rights",
    p: "You may request access to, correction of, or deletion of your personal data at any time by writing to us at social@hkmvizag.org. Note that donation records tied to 80G receipts must be retained as required by law.",
  },
  {
    h: "Changes to This Policy",
    p: "We may update this policy periodically. The latest version will always be available on this page. Continued use of the website constitutes acceptance of the updated policy.",
  },
  {
    h: "Contact Us",
    p: "For any privacy-related questions, contact: Chaitanya Bhavan, Hare Krishna Vaikuntam Cultural Centre, IIM Rd, Gambhiram, Visakhapatnam, Andhra Pradesh 531163. Email: social@hkmvizag.org",
  },
];

export default function PrivacyPolicy() {
  return (
    <PageLayout>
      <div className="pt-[var(--header-h)]">
        <PageHero title="Privacy Policy" subtitle="How we collect, use, and protect your information" breadcrumb="Privacy Policy" />
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
