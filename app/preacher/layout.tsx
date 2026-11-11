import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preacher Portal",
  robots: { index: false, follow: false },
};

export default function PreacherLayout({ children }: { children: React.ReactNode }) {
  return children;
}
