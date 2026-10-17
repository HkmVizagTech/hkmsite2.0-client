// The English home page at "/" as a real route of its own (same components
// as app/[lang]/page.tsx with lang "en"). Served from a rewrite of "/" to
// "/en", Vercel still routed the bare homepage through a function in iad1
// (USA) even on cache hits; a route of its own is served at the edge like
// every other page. Visitors who chose Telugu are still sent to /te by the
// cookie rule in next.config.ts, which runs before this route is matched.
import LangLayout from "./[lang]/layout";
import Home, { generateMetadata as homeMetadata } from "./[lang]/page";

const params = Promise.resolve({ lang: "en" });

export const generateMetadata = () => homeMetadata({ params });

export default function EnglishHome() {
  return (
    <LangLayout params={params}>
      <Home params={params} />
    </LangLayout>
  );
}
