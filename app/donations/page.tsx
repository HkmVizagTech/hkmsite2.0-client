import DonationsClient from "./DonationsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DonationsPage() {
  return (
    <div className="min-h-screen bg-[#fff7e5]">
      <DonationsClient />
    </div>
  );
}
