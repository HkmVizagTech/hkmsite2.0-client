import PageLayout from "@/components/PageLayout";
import DonationsClient from "./DonationsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DonationsPage() {
  return (
    <PageLayout>
      <DonationsClient />
    </PageLayout>
  );
}
