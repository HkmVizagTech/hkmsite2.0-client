import JanmashtamiClient from "./JanmashtamiClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Sri Krishna Janmashtami | Hare Krishna Movement Vizag",
  description:
    "Offer Sri Krishna Janmashtami sevas online for Annadana, Makhan Mishri, Go Seva, Abhisheka, Tulasi Archana and Pushpalankara.",
};

export default function JanmashtamiPage() {
  return <JanmashtamiClient />;
}
