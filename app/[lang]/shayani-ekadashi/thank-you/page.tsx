import { permanentRedirect } from "next/navigation";

// /shayani-ekadashi/thank-you moved to /ekadashi/thank-you. Redirect
// permanently so old donation-confirmation links keep working.
export default function ShayaniEkadashiThankYouPage() {
  permanentRedirect("/ekadashi/thank-you");
}