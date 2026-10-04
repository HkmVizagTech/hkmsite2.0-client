import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Refund & Cancellation Policy · Hare Krishna Movement Visakhapatnam",
  description: "Refund and cancellation policy for donations and event registrations at Hare Krishna Movement Visakhapatnam.",
};

const sections = [
  {
    h: "Donations",
    p: "Donations made to Hare Krishna Movement Visakhapatnam are voluntary contributions to charitable and religious causes and are generally non-refundable once processed.",
  },
  {
    h: "Erroneous or Duplicate Transactions",
    p: "If a donation was made in error — such as a duplicate payment, an incorrect amount due to a technical issue, or an unauthorised transaction — please write to us at social@hkmvizag.org within 7 days of the transaction with your payment reference number. Genuine cases will be reviewed and, where approved, refunded to the original payment method within 7–10 working days.",
  },
  {
    h: "80G Receipt Implications",
    p: "If an 80G tax-exemption receipt has already been issued for a donation, a refund may not be possible, as issued receipts are reported to tax authorities. Please verify donation details carefully before completing payment.",
  },
  {
    h: "Event Registrations",
    p: "Where a paid event or program is cancelled by the temple, registered participants will be offered a full refund or the option to transfer their registration to a future event. Participant-initiated cancellations are handled per the specific event's terms communicated at registration.",
  },
  {
    h: "Failed Transactions",
    p: "If your payment was debited but the donation/registration was not confirmed, the amount is typically auto-reversed by your bank within 5–7 working days. If it is not, contact us with the transaction reference and we will assist in tracing it with our payment gateway.",
  },
  {
    h: "How to Request a Refund",
    p: "Email social@hkmvizag.org with: your full name, date of transaction, amount, payment reference/UTR number, and reason for the request. We aim to respond within 3 working days.",
  },
];

export default function RefundPolicy() {
  return (
    <PageLayout>
      <div className="pt-[var(--header-h)]">
        <PageHero title="Refund & Cancellation Policy" subtitle="Our policy on refunds for donations and registrations" breadcrumb="Refund Policy" />
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
