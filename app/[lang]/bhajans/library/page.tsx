import PageLayout from "@/components/PageLayout";
import BrowseByStrip from "@/components/bhajans/taxonomy/BrowseByStrip";
import Crumbs from "@/components/bhajans/taxonomy/Crumbs";
import LibraryClient from "@/components/bhajans/library/LibraryClient";
import { localized } from "@/lib/i18n/seo";

export const generateMetadata = localized({
  title: "Your Bhajan Library",
  description: "Your liked bhajans, followed composers and recently played bhajans, saved on this device.",
  alternates: { canonical: "/bhajans/library" },
  robots: { index: false, follow: true },
});

export default function LibraryPage() {
  return (
    <PageLayout>
      <main className="overflow-x-clip bg-white pt-[var(--header-h)] text-ink">
        <header className="bg-[linear-gradient(180deg,#eef3ff_0%,#ffffff_100%)]">
          <div className="vk-container pb-6 pt-6 md:pb-8">
            <Crumbs trail={[{ name: "Your Library" }]} />
            <h1 className="font-serif-display text-[2rem] font-bold leading-tight tracking-tight sm:text-5xl">Your Library</h1>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink/80">Saved on this device. No account needed.</p>
          </div>
        </header>
        <div className="vk-container space-y-8 pb-[calc(3.5rem+var(--player-h,0px))] pt-4">
          <BrowseByStrip active="library" />
          <LibraryClient />
        </div>
      </main>
    </PageLayout>
  );
}
