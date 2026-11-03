"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, Truck, Search, PackageX, MapPin } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/site/Reveal";

const MOCK_PHONE = "6302787849";

const MOCK_ORDER = {
  orderNumber: "HKM-240871",
  phone: MOCK_PHONE,
  status: "shipped",
  courier: "India Post",
  trackingId: "EE123456789IN",
  items: [
    { title: "Bhagavad-gita As It Is", qty: 1 },
    { title: "Srimad-Bhagavatam (Canto 1)", qty: 2 },
  ],
  timeline: [
    { key: "placed", label: "Order placed", date: "28 Oct 2026" },
    { key: "packed", label: "Packed", date: "29 Oct 2026" },
    { key: "shipped", label: "Shipped", date: "30 Oct 2026" },
    { key: "delivered", label: "Delivered", date: null },
  ],
};

const STEP_ICONS = { placed: CheckCircle2, packed: Package, shipped: Truck, delivered: CheckCircle2 } as const;

export default function TrackOrder({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const query = initialQuery.trim();
  const found = query === MOCK_PHONE;
  const activeIdx = MOCK_ORDER.timeline.findLastIndex((s) => s.date);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (q) router.push(`/track/${encodeURIComponent(q)}`);
  };

  return (
    <PageLayout>
      <div className="pt-[var(--header-h)]">
        <PageHero
          eyebrow="Matchless Gifts"
          title="Track Your Order"
          subtitle="Enter your order number or the phone number you ordered with to see where your parcel is."
          breadcrumb="Track Order"
        />

        <section className="vk-section">
          <div className="vk-container max-w-3xl">
            <Reveal>
              <form onSubmit={submit} className="vk-card flex flex-col gap-3 p-5 sm:flex-row md:p-6">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-400" />
                  <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Order Number or Phone Number"
                    aria-label="Order number or phone number"
                    className="vk-input !pl-11"
                  />
                </div>
                <button type="submit" className="vk-btn-primary h-12 gap-2 px-6">
                  <Search className="h-4 w-4" /> Track Order
                </button>
              </form>
            </Reveal>

            {query && !found && (
              <Reveal>
                <div className="mt-8 rounded-3xl bg-vk-50 px-6 py-14 text-center">
                  <span className="vk-icon-chip mx-auto mb-4 !h-14 !w-14 !rounded-2xl !bg-white">
                    <PackageX className="h-7 w-7" />
                  </span>
                  <p className="font-heading text-lg font-bold text-ink">No track orders found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We couldn&apos;t find any order for &ldquo;{query}&rdquo;. Please check the number and try again.
                  </p>
                  <Link href="/contact" className="vk-btn-primary mx-auto mt-6 h-11 px-6">
                    Need help? Contact us
                  </Link>
                </div>
              </Reveal>
            )}

            {found && (
              <Reveal>
                <div className="vk-card mt-8 overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-navy px-5 py-5 text-white md:px-8">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/60">Order number</p>
                      <p className="font-heading text-xl font-extrabold">{MOCK_ORDER.orderNumber}</p>
                    </div>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-700">
                      Shipped
                    </span>
                  </div>

                  <div className="p-5 md:p-8">
                    <h3 className="vk-bar-title text-lg text-foreground">Order Progress</h3>
                    <ol className="mt-6">
                      {MOCK_ORDER.timeline.map((s, i) => {
                        const Icon = STEP_ICONS[s.key as keyof typeof STEP_ICONS];
                        const done = i <= activeIdx;
                        const last = i === MOCK_ORDER.timeline.length - 1;
                        return (
                          <li key={s.key} className="relative flex gap-4 pb-7 last:pb-0">
                            {!last && (
                              <span
                                className={`absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-0.5 ${
                                  i < activeIdx ? "bg-vk-500" : "bg-vk-100"
                                }`}
                              />
                            )}
                            <span
                              className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                                done ? "bg-vk-700 text-white shadow-lift" : "bg-vk-50 text-muted-foreground"
                              }`}
                            >
                              <Icon className="h-[18px] w-[18px]" />
                            </span>
                            <div className="pt-1.5">
                              <p className={`text-[15px] font-bold ${done ? "text-ink" : "text-muted-foreground"}`}>
                                {s.label}
                              </p>
                              <p className="text-xs text-muted-foreground">{s.date ?? "Pending"}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ol>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {[
                        { icon: Truck, label: "Courier", value: MOCK_ORDER.courier },
                        { icon: MapPin, label: "Tracking ID", value: MOCK_ORDER.trackingId },
                      ].map((d) => (
                        <div key={d.label} className="flex items-center gap-3 rounded-2xl bg-vk-50 p-4">
                          <span className="vk-icon-chip !bg-white">
                            <d.icon className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-xs text-muted-foreground">{d.label}</p>
                            <p className="text-sm font-bold text-ink">{d.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <h3 className="vk-bar-title mt-8 text-lg text-foreground">Items</h3>
                    <ul className="mt-3 divide-y divide-vk-100 text-sm">
                      {MOCK_ORDER.items.map((it) => (
                        <li key={it.title} className="flex justify-between gap-4 py-3">
                          <span className="font-medium text-ink">{it.title}</span>
                          <span className="text-muted-foreground">× {it.qty}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
