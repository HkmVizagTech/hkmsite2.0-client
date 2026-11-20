import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devotee Login",
  robots: { index: false, follow: false },
};

export default function DevoteeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
