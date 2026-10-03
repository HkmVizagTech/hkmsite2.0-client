// Visitor FAQ shown on the homepage. Answers only restate facts that are
// already published elsewhere on the site (address, darshan windows from the
// navbar, 80G note from the seva pages) — keep it that way when editing.
export interface FaqItem {
  q: string;
  a: string;
}

export const homeFaq: FaqItem[] = [
  {
    q: "Is this ISKCON Gambheeram Visakhapatnam?",
    a: "Yes. This is ISKCON Gambheeram Visakhapatnam, also known as Hare Krishna Movement Vizag, located in Gambheeram, Visakhapatnam. We are a centre of the International Society for Krishna Consciousness (ISKCON), serving the community since 2008.",
  },
  {
    q: "Where is the temple located?",
    a: "Chaitanya Bhavan, Hare Krishna Vaikuntham Cultural Centre, IIM Road, opposite Akshaya Patra Foundation, Gambhiram, Visakhapatnam, Andhra Pradesh 531163. Use the “Get Directions” button in the footer to navigate there with Google Maps.",
  },
  {
    q: "What are the darshan timings?",
    a: "Darshan is open from 4:30 AM to 5:00 AM (Mangala Aarti), 7:15 AM to 12:20 PM, and 4:15 PM to 8:15 PM. The live darshan status is shown at the top of every page, and the full aarti schedule is on the Daily Schedule page.",
  },
  {
    q: "Are donations eligible for tax exemption?",
    a: "Yes. Donations to the temple sevas qualify for 80G tax benefits. Enter your PAN while donating so your receipt can be issued for the exemption — receipts are sent on WhatsApp and are also available from Donor Login.",
  },
  {
    q: "How can I volunteer at the temple?",
    a: "We welcome volunteers for festivals, prasadam distribution, Subhojanam and temple services. Register on the Volunteer page and our team will reach out with upcoming seva opportunities.",
  },
  {
    q: "Which festivals are celebrated at the temple?",
    a: "All major Vaishnava festivals are celebrated — including Sri Krishna Janmashtami, Radhashtami, Govardhan Puja, Gaura Purnima, Rath Yatra and every Ekadashi. See the Vaishnava Calendar for upcoming dates.",
  },
];
