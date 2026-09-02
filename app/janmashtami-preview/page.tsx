import { Suspense } from "react";
import JanmashtamiClient from "./JanmashtamiClient";

export const metadata = {
  title: "PREVIEW — Sri Krishna Janmashtami | Hare Krishna Movement Vizag",
  robots: { index: false, follow: false },
};

export default function JanmashtamiPreviewPage() {
  return (
    <Suspense fallback={null}>
      <JanmashtamiClient />
    </Suspense>
  );
}
