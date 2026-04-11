import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import ReduxProvider from "@/components/ReduxProvider";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hare Krishna Movement Visakhapatnam",
  description: "Spreading the timeless message of Lord Krishna through devotion, service, and community. Experience divine darshan, prasadam, and spiritual programs.",
  keywords: ["Hare Krishna", "ISKCON", "Visakhapatnam", "Temple", "Spiritual", "Krishna", "Prabhupada"],
  openGraph: {
    title: "Hare Krishna Movement Visakhapatnam",
    description: "Spreading the timeless message of Lord Krishna through devotion, service, and community.",
    type: "website",
    locale: "en_IN",
    siteName: "Hare Krishna Movement Vizag",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <html lang="en" className={`h-full antialiased`} suppressHydrationWarning>
      <body className={`${poppins.className} min-h-full flex flex-col`}>
        <ReduxProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
