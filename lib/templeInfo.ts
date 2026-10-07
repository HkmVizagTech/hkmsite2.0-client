// Single source of truth for the temple's visitor facts — used by the visit
// guide (/iskcon-vizag-temple), the Vaikuntham page, the daily schedule and the
// site-wide HinduTemple JSON-LD, so timings and address can't drift apart.
// Change a timing here and every page + Google's structured data follow.

export const TEMPLE = {
  name: "ISKCON Gambheeram Visakhapatnam",
  alsoKnownAs: ["Hare Krishna Vaikuntham Temple", "Hare Krishna Movement Vizag", "ISKCON Vizag (Gambheeram)"],
  streetAddress: "Chaitanya Bhavan, Hare Krishna Vaikuntam Cultural Centre, IIM Rd, opp. Akshaya Patra Foundation, Gambhiram",
  locality: "Visakhapatnam",
  region: "Andhra Pradesh",
  postalCode: "531163",
  country: "IN",
  lat: 17.8791762,
  lng: 83.372373,
  phone: "+91 89777 61187",
  phoneHref: "tel:+918977761187",
  email: "social@hkmvizag.org",
  since: 2008,
  presidingDeities: "Sri Sri Radha Madan Mohan",
  newTempleDeities: "Sri Srinivasa Govinda",
} as const;

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${TEMPLE.lat},${TEMPLE.lng}`;
export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${TEMPLE.lat},${TEMPLE.lng}&z=15&output=embed`;

export const FULL_ADDRESS = `${TEMPLE.streetAddress}, ${TEMPLE.locality}, ${TEMPLE.region} ${TEMPLE.postalCode}`;

/** Darshan windows (IST). The temple rests between them. */
export const DARSHAN_HOURS = [
  { label: "Mangala darshan", opens: "04:30", closes: "05:00", display: "4:30 AM – 5:00 AM" },
  { label: "Morning darshan", opens: "07:15", closes: "12:20", display: "7:15 AM – 12:20 PM" },
  { label: "Evening darshan", opens: "16:15", closes: "20:15", display: "4:15 PM – 8:15 PM" },
] as const;

/** Daily aarti & programme schedule. */
export const DAILY_SCHEDULE = [
  { time: "4:30 AM", event: "Mangala Aarti", desc: "The first aarti of the day, offered in the pre-dawn hours to awaken the Lord from His divine rest." },
  { time: "5:00 AM", event: "Tulsi Puja & Japa", desc: "Devotees circumambulate Tulsi Devi and chant the Hare Krishna Maha-mantra on their beads." },
  { time: "7:15 AM", event: "Shringar Darshan", desc: "The deities are beautifully dressed and decorated for the morning darshan." },
  { time: "7:30 AM", event: "Guru Puja", desc: "Worship of the spiritual master with kirtan, flower offerings, and devotional songs." },
  { time: "8:00 AM", event: "Srimad Bhagavatam Class", desc: "Daily discourse on Srimad Bhagavatam, the ripened fruit of the Vedic literature." },
  { time: "12:00 PM", event: "Raj Bhog Aarti", desc: "Grand noon offering with elaborate bhog preparation for the Lord." },
  { time: "1:00 PM", event: "Prasadam Distribution", desc: "Sanctified food is distributed to all visitors and devotees present." },
  { time: "4:15 PM", event: "Temple Reopens", desc: "The temple doors reopen after the Lord's afternoon rest period." },
  { time: "6:30 PM", event: "Sandhya Aarti", desc: "Evening aarti with beautiful kirtan as the sun sets — a deeply moving ceremony." },
  { time: "7:00 PM", event: "Bhagavad Gita Class", desc: "Evening discourse on the Bhagavad Gita — the Song of God spoken by Lord Krishna." },
  { time: "8:30 PM", event: "Shayan Aarti", desc: "The final aarti of the day, putting the Lord to rest for the night." },
] as const;

export const WEEKLY_PROGRAMS = [
  { title: "Sunday Love Feast", when: "Every Sunday, 5:00 PM – 8:30 PM", desc: "Kirtan, a discourse and a sumptuous prasadam feast, open to all." },
  { title: "Saturday Satsang", when: "Every Saturday, 6:00 PM – 8:00 PM", desc: "Bhajans, questions and answers on spiritual topics, and light prasadam." },
  { title: "Ekadashi Program", when: "Twice a month, 6:00 AM – 8:00 PM", desc: "Extended kirtan, scripture readings and spiritual discussions on the fasting day." },
] as const;
