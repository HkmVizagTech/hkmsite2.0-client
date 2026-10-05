import type { Metadata } from "next";

// Personal check-in links (one per registration) must never be indexed.
export const metadata: Metadata = {
  title: "Event Check-in",
  robots: { index: false, follow: false },
};

export default function CheckinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
