import TrackOrder from "@/components/track/TrackOrder";

export default async function TrackQueryPage({ params }: { params: Promise<{ query: string }> }) {
  const { query } = await params;
  return <TrackOrder initialQuery={decodeURIComponent(query)} />;
}
