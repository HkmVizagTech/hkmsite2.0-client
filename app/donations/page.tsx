import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import DonationsClient from "./DonationsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DonationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DonationsClient />
      <Footer />
    </div>
  );
}
