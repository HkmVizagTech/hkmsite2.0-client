import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import ReduxProvider from "@/components/ReduxProvider";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-body",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
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
    <html
      lang="en"
      className={`${playfair.variable} ${lato.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-body">
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
