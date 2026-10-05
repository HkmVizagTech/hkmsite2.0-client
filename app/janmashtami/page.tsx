import JanmashtamiClient from "./JanmashtamiClient";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Janmashtami Sevas",
  description: "Offer Sri Krishna Janmashtami sevas online at ISKCON Gambheeram Visakhapatnam — Abhisheka, Chappan Bhog, Annadana, Go Seva, Pushpalankara and more.",
  path: "/janmashtami",
  image: "/assets/home-event-janmashtami.webp"
});

export default function JanmashtamiPage() {
  return (
    <JanmashtamiClient />
  );
}
