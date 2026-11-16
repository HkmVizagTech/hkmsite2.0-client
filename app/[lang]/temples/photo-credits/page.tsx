import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { TEMPLES } from "@/lib/templesData";
import { TEMPLE_PHOTOS } from "@/lib/templePhotos";

// Attribution for the free-licence (Wikimedia Commons) photos used in the temple guide. Kept off the temple pages
// themselves; not indexed.
export const metadata = { title: "Temple guide photo credits", robots: { index: false, follow: true } };

export default function PhotoCreditsPage() {
  return (
    <PageLayout background="#ffffff">
      <div className="bg-white pt-[var(--header-h)]">
        <div className="vk-container py-14">
          <div className="mx-auto max-w-3xl">
            <Link href="/temples" className="text-[13px] font-semibold text-[#1E3A8A] hover:underline">← Hindu Temples in India</Link>
            <h1 className="mt-4 font-heading text-3xl font-bold text-[#0A1233]">Photo credits</h1>
            <p className="mt-2 text-[14px] leading-7 text-[#0A1233]/60">Photos in the temple guide are from Wikimedia Commons, used under the licences shown (CC BY, CC BY-SA, CC0 or public domain). Thank you to the photographers.</p>
            <div className="mt-8 space-y-7">
              {TEMPLES.filter((t) => TEMPLE_PHOTOS[t.slug]?.length).map((t) => (
                <section key={t.slug}>
                  <h2 className="font-heading text-lg font-bold text-[#0A1233]">{t.shortName}</h2>
                  <ul className="mt-2 space-y-1 text-[13px] text-[#0A1233]/65">
                    {TEMPLE_PHOTOS[t.slug].map((p, i) => (
                      <li key={p.src}>Photo {i + 1}: {p.source ? <a href={p.source} target="_blank" rel="noopener noreferrer nofollow" className="text-[#1E3A8A] hover:underline">{p.credit ?? "Wikimedia Commons"}</a> : p.credit} {p.license ? `(${p.license})` : ""}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
