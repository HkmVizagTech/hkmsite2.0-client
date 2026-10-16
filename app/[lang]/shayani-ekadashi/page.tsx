import { permanentRedirect } from "next/navigation";

// /shayani-ekadashi moved to the reusable /ekadashi campaign page. Redirect
// permanently so existing links, ads and utm_builder bookmarks keep working.
export default function ShayaniEkadashiPage() {
  permanentRedirect("/ekadashi");
}