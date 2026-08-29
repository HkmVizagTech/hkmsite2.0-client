import { redirect } from "next/navigation";

// The per-event volunteer registration form has been retired.
//
// Volunteer sign-ups are no longer accepted from this website — the VCC
// volunteer system does not process registrations that originate here.
// Devotees now register inside the Vaikuntham app instead, so any old
// /volunteer/<eventId> link is sent back to /volunteer where the app
// download instructions live (rather than 404-ing).
export default function VolunteerEventRedirect() {
  redirect("/volunteer");
}
