// Major Hindu temples across India: pilgrimage guide content (third batch, continuation of templesData.ts).
// Original writing for ISKCON Gambheeram Visakhapatnam (Hare Krishna Movement, Vizag).
// Sources are limited to official temple/shrine-board sites, central/state government sites (ASI, tourism,
// district portals), Vedabase and established news outlets. Legends are framed as temple tradition.
// Every entry carries a `check` list of facts the temple team must verify before publishing.

import type { Temple } from "./templesData";

const CONFIRM_NOTE =
  "Timings change on festival days, eclipses and special occasions. Please confirm current timings with the temple before you travel.";

export const TEMPLES_MORE3: Temple[] = [
  // 1. Kedarnath
  {
    slug: "kedarnath-temple",
    name: "Shri Kedarnath Temple, Uttarakhand",
    shortName: "Kedarnath",
    teluguName: "శ్రీ కేదార్‌నాథ్ ఆలయం, ఉత్తరాఖండ్",
    deity: "Lord Shiva as Sri Kedarnath (Jyotirlinga)",
    form: "Kedarnath",
    town: "Kedarnath",
    state: "Uttarakhand",
    district: "Rudraprayag",
    region: "Uttarakhand",
    summary:
      "Himalayan Jyotirlinga of Lord Shiva in Garhwal, open only in the summer yatra season and reached by a long mountain trek from Gaurikund.",
    history: [
      "Kedarnath stands high in the Garhwal Himalaya, at roughly 3,580 metres according to the Shri Badarinath Kedarnath Temple Committee (BKTC), and is counted among the twelve Jyotirlingas of Lord Shiva. According to the tradition the committee records, the Pandavas sought Lord Shiva after the Kurukshetra war to be freed from the sin of killing their kinsmen. The Lord avoided them in the form of a bull and sank into the earth here, leaving the hump above the ground, which is worshipped in the shrine. Devotees believe other parts of His form appeared at Tungnath, Rudranath, Madmaheshwar and Kalpeshwar, which together with Kedarnath are known as the Panch Kedar.",
      "The temple committee associates the present stone temple with Adi Shankaracharya and describes it as more than a thousand years old, while also recording the tradition that the Pandavas first built a shrine here.",
      "Because of snow, the shrine is open only for part of the year. At the start of winter the utsava (festival) form of the Lord is carried down to Ukhimath, where worship continues through the cold months, and it returns to Kedarnath when the temple reopens in the Vaishakha season (April–May) on a date the committee announces.",
    ],
    highlights: [
      "One of the twelve Jyotirlingas of Lord Shiva",
      "Open only in the summer yatra season; winter worship at Ukhimath",
      "Trek of about 16 km from Gaurikund (pony, palki or helicopter options)",
      "Part of the Panch Kedar and the Char Dham yatra of Uttarakhand",
      "Prior yatra registration with the Uttarakhand government is advised",
    ],
    festivals: [
      { name: "Opening of the doors (kapat opening)", when: "Vaishakha season, April–May; date announced by the temple committee" },
      { name: "Maha Shivaratri (opening date announced)", when: "February–March, while the shrine is closed" },
      { name: "Closing of the doors for winter", when: "Kartika season, October–November" },
    ],
    timings: [
      { label: "Season", time: "Open only in the yatra season, roughly April/May to October/November" },
      { label: "Evening aarti (BKTC, summer)", time: "around 6:00 PM" },
    ],
    timingsNote:
      "Kedarnath is closed through the winter, and daily darshan hours are not published in detail on the official site. Please confirm current timings and the season's opening and closing dates with the Shri Badarinath Kedarnath Temple Committee before you travel.",
    fromVizag:
      "Kedarnath is more than 2,000 km from Visakhapatnam. Most pilgrims fly or take a train to Delhi, Haridwar or Rishikesh, travel by road to Sonprayag and Gaurikund, and then trek up.",
    howToReach: {
      road: "Roads from Rishikesh and Haridwar run via Rudraprayag to Sonprayag and Gaurikund; from Gaurikund the route to the temple is on foot, pony or palki.",
      rail: "Rishikesh and Haridwar are the usual railheads for the drive into the mountains.",
      air: "Jolly Grant Airport, Dehradun, is the nearest airport; helicopter shuttles to Kedarnath are booked only through the IRCTC heli-yatra portal.",
    },
    address: "Shri Kedarnath Temple, Kedarnath, Rudraprayag district, Uttarakhand 246445",
    placeQuery: "Kedarnath Temple Uttarakhand",
    website: "https://badrinath-kedarnath.gov.in",
    faqs: [
      {
        q: "When is Kedarnath temple open?",
        a: "Only during the summer yatra season, usually from April or May to October or November. The committee announces each year's dates; in winter the Lord is worshipped at Ukhimath.",
      },
      {
        q: "How long is the trek to Kedarnath?",
        a: "Uttarakhand Tourism describes a route of about 16 km from Gaurikund. Ponies, palkis and helicopter shuttles are available for those who cannot walk.",
      },
      {
        q: "Do I need to register for the Kedarnath yatra?",
        a: "The Uttarakhand government runs an online registration portal for the Char Dham yatra. Register before you travel and carry ID.",
      },
      {
        q: "How do I book a helicopter to Kedarnath?",
        a: "The temple committee states that helicopter tickets are sold only through heliyatra.irctc.co.in. Beware of other sites claiming to sell them.",
      },
    ],
    sources: [
      "https://badrinath-kedarnath.gov.in/AboutUs/shri-kedarnath.aspx",
      "https://badrinath-kedarnath.gov.in",
      "https://uttarakhandtourism.gov.in/public/destination/kedarnath",
      "https://registrationandtouristcare.uk.gov.in",
      "https://www.incredibleindia.gov.in/en/uttarakhand/kedarnath/how-to-reach-kedarnath-from-delhi",
    ],
    check: [
      "Seasonal: 2027 opening date (announced on Maha Shivaratri) and closing date; the 2026 season has ended",
      "Daily darshan hours during the season (not on the official site; listings conflict)",
      "Altitude: BKTC gives both 3,581 m and 3,584 m",
      "Trek length: sources give 14, 16, 18 and 19 km; Uttarakhand Tourism says about 16 km",
      "Adi Shankaracharya / Pandava wording for the temple's age (BKTC page gives several versions)",
      "Distance from Visakhapatnam (more than 2,000 km) and nearest railheads",
      "Whether yatra registration is mandatory or advisory this season",
      "PIN code 246445",
    ],
  },

  // 2. Vaishno Devi
  {
    slug: "vaishno-devi-katra",
    name: "Shri Mata Vaishno Devi Shrine, Katra",
    shortName: "Vaishno Devi",
    teluguName: "శ్రీ మాతా వైష్ణో దేవి ఆలయం, కట్రా",
    deity: "Mata Vaishno Devi, worshipped as three natural rock forms (Pindies) of Maha Kali, Maha Lakshmi and Maha Saraswati",
    form: "Vaishno Devi",
    town: "Katra (Bhawan on the Trikuta hills)",
    state: "Jammu and Kashmir",
    district: "Reasi",
    region: "Jammu and Kashmir",
    summary:
      "Holy cave of Mata Vaishno Devi on the Trikuta hills above Katra, Jammu and Kashmir, reached by a trek of about 12 km and open for darshan round the clock.",
    history: [
      "The shrine of Mata Vaishno Devi is a cave on the Trikuta hills above the town of Katra, at about 5,200 feet. There is no carved image inside: pilgrims have darshan of three natural rock formations, the Holy Pindies, worshipped as Maha Kali, Maha Lakshmi and Maha Saraswati.",
      "The Shrine Board itself notes that several versions of the shrine's origin are told. In one widely shared account, the Goddess as Vaishnavi left a feast held by her devotee Pandit Shridhar to escape Bhairon Nath, who pursued her into the mountains. According to tradition she meditated for nine months in a cave at Adhkuwari, the midpoint of today's route, and at the holy cave finally beheaded Bhairon Nath; a temple marks the place where his head is said to have fallen. Devotees believe the Goddess later appeared to Pandit Shridhar in a dream and guided him to the cave, and the Board traces the shrine's discovery to him, around 700 years ago.",
      "Since August 1986 the shrine has been administered by the Shri Mata Vaishno Devi Shrine Board, chaired by the Lieutenant Governor of Jammu and Kashmir. The Board reports that more than one crore pilgrims now visit each year.",
    ],
    highlights: [
      "Darshan of three natural rock Pindies, with no carved image",
      "Trek of about 12 km from Katra via Adhkuwari",
      "Darshan open round the clock through the year",
      "Bhairon temple visited after darshan at the Bhawan",
      "Free yatra registration (RFID card) required for the trek",
    ],
    festivals: [
      { name: "Navaratri (Chaitra)", when: "March–April" },
      { name: "Navaratri (Ashwin)", when: "September–October" },
    ],
    timings: [{ label: "Darshan (Shrine Board)", time: "Open round the clock, through the year" }],
    timingsNote:
      "Darshan pauses during the morning and evening aartis, and the yatra may be regulated in bad weather or heavy rush. Please confirm current timings and registration rules with the Shrine Board before you travel.",
    fromVizag:
      "Katra is more than 2,500 km from Visakhapatnam. Most pilgrims travel by train or flight to Delhi or Jammu and continue to Katra; some trains run through to Shri Mata Vaishno Devi Katra station.",
    howToReach: {
      road: "Katra is connected by road to Jammu; buses and taxis run regularly. The trek to the Bhawan starts from Katra.",
      rail: "Shri Mata Vaishno Devi Katra railway station is in Katra town; Jammu Tawi is the other main railhead.",
      air: "Jammu Airport is the nearest airport; the Shrine Board also lists a helicopter service from Katra to Sanjichhat.",
    },
    address: "Shri Mata Vaishno Devi Shrine Board, Katra, Reasi district, Jammu and Kashmir 182301",
    placeQuery: "Mata Vaishno Devi Bhawan Katra",
    website: "https://www.maavaishnodevi.org",
    faqs: [
      {
        q: "How far is the Vaishno Devi trek?",
        a: "The Shrine Board describes a trek of about 12 km from Katra to the Bhawan, with Adhkuwari roughly at the midpoint. Ponies, palkis and battery cars cover parts of the route.",
      },
      {
        q: "Is registration needed for the Vaishno Devi yatra?",
        a: "Yes. Pilgrims need a free yatra registration (RFID card), available online or at counters in Katra; carry a valid photo ID.",
      },
      {
        q: "Can I visit the original cave?",
        a: "The original cave is kept closed for much of the year and most pilgrims enter through newer tunnels; the Board opens it in lean periods and on some occasions.",
      },
      {
        q: "Is darshan available at night?",
        a: "The Shrine Board states that darshan is open round the clock, with short pauses for the daily aartis.",
      },
    ],
    sources: [
      "https://www.maavaishnodevi.org",
      "https://www.maavaishnodevi.org/about-shrine",
      "https://www.maavaishnodevi.org/blog/discovery",
      "https://www.maavaishnodevi.org/blog/introduction",
      "https://legacy.maavaishnodevi.org/katra-bhawan.aspx",
      "https://www.incredibleindia.gov.in/en/jammu-and-kashmir/jammu/vaishno-devi-temple",
    ],
    check: [
      "Trek distance: Shrine Board says about 12 km; many listings say 13 km (new Tarakote route?)",
      "Aarti timings (not confirmed from the official site; darshan pauses during aarti)",
      "RFID rules: time limits for starting and finishing the yatra after collecting the card",
      "Chairman of the Board: Lieutenant Governor (the older page says Governor)",
      "Helicopter route and whether a ropeway is now operating",
      "Through trains from Visakhapatnam to SMVD Katra (none confirmed); distance (more than 2,500 km)",
      "PIN code 182301",
    ],
  },

  // 3. Sabarimala
  {
    slug: "sabarimala-ayyappa-temple",
    name: "Sabarimala Sree Dharma Sastha Temple, Kerala",
    shortName: "Sabarimala",
    teluguName: "శబరిమల శ్రీ ధర్మశాస్తా (అయ్యప్ప స్వామి) ఆలయం",
    deity: "Lord Ayyappa (Sree Dharma Sastha)",
    form: "Ayyappa",
    town: "Sabarimala",
    state: "Kerala",
    district: "Pathanamthitta",
    region: "Kerala",
    summary:
      "Forest hill shrine of Lord Ayyappa in Kerala's Periyar Tiger Reserve, open mainly in the Mandala–Makaravilakku season and reached on foot from Pamba.",
    history: [
      "Sabarimala lies in the forested Western Ghats of Pathanamthitta district, inside the Periyar Tiger Reserve. According to temple tradition, Lord Ayyappa, also called Manikandan, is the son of Lord Shiva and Mohini, the enchanting form taken by Lord Vishnu, and the hill is where He sat in meditation after defeating the demoness Mahishi.",
      "The pilgrimage is a discipline in itself. Devotees keep a 41-day vratham of celibacy, vegetarian food and prayer, wear black or blue, and carry the irumudi kettu, a two-part bundle of offerings, on their heads. Only those carrying the irumudi climb the eighteen sacred steps, the Pathinettampadi, to the shrine. For Makaravilakku, the Lord's sacred ornaments (Thiruvabharanam) are carried in procession from the Valiyakoikkal temple at Pandalam, reaching the shrine on the festival day.",
      "The temple is administered by the Travancore Devaswom Board. It is not open all year: the main season runs from the first day of the Malayalam month of Vrischikam (mid-November) into January, and at other times the shrine opens mainly for the first few days of each Malayalam month and for Vishu. Long-standing custom has kept women of roughly 10 to 50 years from the pilgrimage; the Supreme Court ruled against this restriction in 2018, and review petitions and related questions are still before a larger bench, so pilgrims should follow the Board's current guidance.",
    ],
    highlights: [
      "Hill shrine inside the Periyar Tiger Reserve, Western Ghats",
      "41-day vratham and the irumudi kettu carried on the head",
      "Eighteen sacred steps climbed only with the irumudi",
      "About 5 km climb on foot from Pamba",
      "Darshan booked through the official virtual queue in season",
    ],
    festivals: [
      { name: "Mandala season", when: "From 1 Vrischikam (mid-November), about 41 days" },
      { name: "Mandala Pooja", when: "Late December (27 December in the 2026–27 season)" },
      { name: "Makaravilakku", when: "Makara Sankranti, around 14 January" },
      { name: "Monthly poojas and Vishu", when: "First days of each Malayalam month; Vishu in April" },
    ],
    timings: [
      { label: "Temple opens (TDB pooja schedule)", time: "5:00 AM (earlier in the main season)" },
      { label: "Ucha Pooja and midday closing (TDB)", time: "12:30 PM, closing about 1:00 PM" },
      { label: "Harivarasanam and night closing (TDB)", time: "about 9:50 PM" },
    ],
    timingsNote:
      "Sabarimala opens only on set days, and the Board changes hours during the Mandala–Makaravilakku season (doors have opened at 3:00 AM in season). Please confirm current timings with the Travancore Devaswom Board and book darshan through the official virtual queue before you travel.",
    fromVizag:
      "Sabarimala is roughly 1,500 km from Visakhapatnam. Pilgrims usually take a train or flight to Kerala, travel by road to Nilakkal and Pamba, and climb on foot from Pamba.",
    howToReach: {
      road: "Motor vehicles go only as far as Pamba (with parking at Nilakkal); from Pamba the shrine is about 5 km on foot via Neelimala.",
      rail: "Chengannur and Kottayam are commonly used railheads, with KSRTC buses to Pamba in season.",
      air: "Thiruvananthapuram and Kochi international airports are the usual airports for Sabarimala pilgrims.",
    },
    address: "Sabarimala Sree Dharma Sastha Temple, Sannidhanam, Pathanamthitta district, Kerala 689662",
    placeQuery: "Sabarimala Sree Dharma Sastha Temple",
    website: "https://sabarimalaonline.org",
    faqs: [
      {
        q: "When is Sabarimala temple open?",
        a: "Mainly in the Mandala–Makaravilakku season from mid-November to January, and for the first days of each Malayalam month and Vishu. Check TDB notices for exact dates.",
      },
      {
        q: "Do I need to book darshan at Sabarimala?",
        a: "Yes. In season the Travancore Devaswom Board manages darshan through an online virtual queue with daily limits; book early on the official portal.",
      },
      {
        q: "Who can go to Sabarimala?",
        a: "The temple welcomes devotees of all faiths. By long custom, women of about 10 to 50 years do not undertake the pilgrimage; the matter is before the Supreme Court, so follow the Board's current guidance.",
      },
      {
        q: "What is the irumudi kettu?",
        a: "A two-part bundle of offerings that pilgrims carry on their heads. Only those carrying it may climb the eighteen sacred steps to the shrine.",
      },
    ],
    sources: [
      "https://www.keralatourism.org/destination/sabarimala-temple/47/",
      "https://www.keralatourism.org/sabarimala/when-to-visit",
      "https://www.keralatourism.org/sabarimala/rituals",
      "https://travancoredevaswomboard.org/sabarimala-3/",
      "https://www.deccanchronicle.com/southern-states/kerala/sabarimala-temple-to-open-for-annual-mandala-pilgrimage-season-2004773",
      "https://www.deccanchronicle.com/nation/sabarimala-case-sc-says-it-can-hold-what-superstition-in-a-religion-is-centre-opposes-1949266",
    ],
    check: [
      "Season dates for 2026–27 (Mandala from 17 Nov 2026; Mandala Pooja 27 Dec; Makaravilakku about 14 Jan 2027)",
      "Daily timings: TDB page is dated March 2024; in-season hours differ (3:00 AM opening reported); evening reopening time not confirmed",
      "Entry-rule wording: status of the Supreme Court nine-judge bench hearing (began April 2026) and TDB's current guidance",
      "Official virtual queue portal (sabarimalaonline.org) and daily limits",
      "Railheads (Chengannur, Kottayam) and airports: not confirmed from an official page",
      "Distance from Visakhapatnam (roughly 1,500 km)",
      "PIN code 689662",
    ],
  },

  // 4. Siddhivinayak
  {
    slug: "siddhivinayak-temple-mumbai",
    name: "Shree Siddhivinayak Ganapati Temple, Prabhadevi, Mumbai",
    shortName: "Siddhivinayak",
    teluguName: "ముంబై శ్రీ సిద్ధివినాయక గణపతి ఆలయం",
    deity: "Shree Siddhivinayak (Lord Ganesha) with Riddhi and Siddhi",
    form: "Ganesha",
    town: "Prabhadevi, Mumbai",
    state: "Maharashtra",
    district: "Mumbai City",
    region: "Maharashtra",
    summary:
      "Mumbai's beloved Ganesha temple at Prabhadevi, consecrated in 1801, where the black-stone Deity's trunk turns to the right; Tuesdays draw huge crowds.",
    history: [
      "The Siddhivinayak temple at Prabhadevi in central Mumbai was first consecrated on Thursday, 19 November 1801, a date the temple trust notes is recorded in government records. Maharashtra Tourism and the Mumbai City district portal credit its building to Laxman Vithu and Deubai Patil. The first shrine was a small, simple structure housing the Deity.",
      "The Deity is carved from a single black stone about two and a half feet wide. Its most noted feature is the trunk curving to the right. Lord Ganesha has four hands, holding a lotus, an axe, prayer beads and a bowl of modaks, and Riddhi and Siddhi stand on either side. An eye is etched on His forehead, which the trust compares to the third eye of Lord Shiva.",
      "The modest shrine has grown into a large temple managed by the Shree Siddhivinayak Ganapati Temple Trust, which began a major renovation in 1990. Tuesday is Lord Ganesha's special day, and the trust keeps the temple open far into the night on Tuesdays for the crowds that come.",
    ],
    highlights: [
      "Consecrated on 19 November 1801, as recorded by the temple trust",
      "Black-stone Ganesha with the trunk turned to the right",
      "Riddhi and Siddhi stand on either side of the Lord",
      "Tuesday darshan from 3:15 AM to late night",
      "Central Mumbai location at Prabhadevi, near Dadar",
    ],
    festivals: [
      { name: "Ganesh Chaturthi", when: "Bhadrapada Shukla Chaturthi, August–September" },
      { name: "Angaraki Sankashti Chaturthi", when: "When Sankashti Chaturthi falls on a Tuesday" },
      { name: "Maghi Ganesh Jayanti", when: "Magha Shukla Chaturthi, January–February" },
    ],
    timings: [
      { label: "Kakad Aarti (Wed–Mon)", time: "5:30 AM – 6:00 AM" },
      { label: "Darshan (Wed–Mon)", time: "6:00 AM – about 9:50 PM, with short pauses for naivedya and aartis" },
      { label: "Tuesday darshan", time: "3:15 AM – about 11:30 PM, with pauses for aartis" },
    ],
    timingsNote:
      "The trust's schedule lists short breaks for naivedya at midday and for the evening aartis, and special hours on festival days. Please confirm current timings with the temple before you travel.",
    fromVizag:
      "Mumbai is roughly 1,300–1,400 km from Visakhapatnam. Direct flights take about two hours; trains from Visakhapatnam to Mumbai take around a day.",
    howToReach: {
      road: "The temple is at Prabhadevi in central Mumbai; BEST buses, taxis and app cabs reach it easily.",
      rail: "Dadar station, on Mumbai's Central and Western lines, is the nearest major station.",
      air: "Chhatrapati Shivaji Maharaj International Airport, Mumbai, is the nearest airport.",
    },
    address: "Shree Siddhivinayak Ganapati Temple, S.K. Bole Marg, Prabhadevi, Mumbai, Maharashtra 400028",
    placeQuery: "Shree Siddhivinayak Temple Prabhadevi Mumbai",
    faqs: [
      {
        q: "What are the Siddhivinayak darshan timings on Tuesday?",
        a: "On Tuesdays the trust opens early darshan from 3:15 AM and keeps darshan going until about 11:30 PM, with pauses for aartis.",
      },
      {
        q: "Is there a dress code at Siddhivinayak?",
        a: "The trust asks visitors to dress modestly, switch off mobile phones and leave footwear outside the entrance.",
      },
      {
        q: "Why is Siddhivinayak's trunk turned to the right?",
        a: "The temple trust highlights the right-turned trunk as the Deity's most distinctive feature; such forms of Ganesha are traditionally regarded with special reverence.",
      },
    ],
    sources: [
      "https://www.siddhivinayak.org/about-the-temple/",
      "https://www.siddhivinayak.org/temple-schedule/",
      "https://maharashtratourism.gov.in/tourist-intrests/temples/",
      "https://mumbaicity.gov.in/en/tourist-place/siddhivinayak-temple/",
      "https://www.incredibleindia.gov.in/en/maharashtra/mumbai/siddhivinayak-temple",
    ],
    check: [
      "Builders: government pages say Laxman Vithu and Deubai Patil; whether they were husband and wife, or contractor and donor",
      "Renovation start year (1990) and present trust name",
      "Timings from the trust's schedule page (confirm still current)",
      "Official website: the siddhivinayak.org homepage showed unrelated gambling/currency ads when fetched; confirm it is the trust's genuine, uncompromised site before linking",
      "Distances: Mumbai 1,300–1,400 km from Vizag; Dadar as nearest station",
      "Whether Angaraki and Maghi Ganesh Jayanti are the right festivals to list",
      "PIN code 400028",
    ],
  },

  // 5. Shirdi
  {
    slug: "shirdi-sai-baba-temple",
    name: "Shri Sai Baba Samadhi Mandir, Shirdi",
    shortName: "Shirdi",
    teluguName: "షిర్డీ శ్రీ సాయిబాబా సమాధి మందిరం",
    deity: "Shri Sai Baba of Shirdi (Samadhi and marble murti)",
    form: "Sai Baba",
    town: "Shirdi",
    state: "Maharashtra",
    district: "Ahilyanagar (Ahmednagar)",
    region: "Maharashtra",
    summary:
      "The Samadhi Mandir of Sri Sai Baba in Shirdi, Maharashtra, where the saint lived for decades; darshan runs from early morning with four daily aartis.",
    history: [
      "According to the chronology published by the Shri Saibaba Sansthan Trust, Sai Baba first appeared in the village of Shirdi as a youth of about sixteen, sitting under a neem tree, sometime around 1854–1857. He left and returned in 1858 with the wedding party of Chandbhai Patil's nephew, and stayed on. He lived near the neem tree, now called Gurusthan, and later in an old abandoned mosque that came to be known as Dwarkamai.",
      "Sai Baba passed away on 15 October 1918. The next day His body was laid to rest in a stone building that Bapusaheb Butti had begun building in 1915, known then as Butti Wada. That building became the Samadhi Mandir. In 1921 the Shri Saibaba Sansthan was formed with the consent of the district court, and on 7 October 1954 the large marble murti of Sai Baba that devotees see today was installed.",
      "The Sansthan Trust governs the Samadhi Mandir and the other sacred places within the premises, including Dwarkamai, Gurusthan, the Chavadi and the Lendi garden, and keeps a museum of Sai Baba's belongings. The daily worship follows four aartis, from the Kakad aarti at dawn to the Shej aarti at night.",
    ],
    highlights: [
      "Samadhi of Sai Baba, who passed away on 15 October 1918",
      "Dwarkamai, the old mosque where Sai Baba lived",
      "Four daily aartis, from Kakad at 5:15 AM to Shej at 10 PM",
      "Marble murti installed in the Samadhi Mandir in 1954",
      "Museum of Sai Baba's belongings run by the Sansthan",
    ],
    festivals: [
      { name: "Shri Rama Navami", when: "Chaitra Shukla Navami, March–April" },
      { name: "Guru Purnima", when: "Ashadha Purnima, June–July" },
      { name: "Vijayadashami (Sai Baba's Punyatithi)", when: "September–October" },
    ],
    timings: [
      { label: "Kakad Aarti (Sansthan)", time: "5:15 AM" },
      { label: "Darshan queue (Sansthan)", time: "6:00 AM – 9:30 PM" },
      { label: "Madhyan (noon) Aarti", time: "12:00 noon" },
      { label: "Dhoop Aarti", time: "At sunset" },
      { label: "Shej (night) Aarti", time: "10:00 PM" },
    ],
    timingsNote:
      "Timings change on festival days such as Rama Navami, Guru Purnima and Vijayadashami. Please confirm current timings with the Shri Saibaba Sansthan Trust before you travel.",
    fromVizag:
      "Shirdi is roughly 1,200 km from Visakhapatnam. Pilgrims travel by train to Sainagar Shirdi (or via Hyderabad, Manmad or Kopargaon), or fly to Shirdi or Hyderabad and continue by road.",
    howToReach: {
      road: "MSRTC and private buses connect Shirdi with Nashik, Ahilyanagar, Pune and Mumbai.",
      rail: "Sainagar Shirdi station is close to the temple; Kopargaon and Manmad junctions have more trains.",
      air: "Shirdi Airport is near the town; Nashik, Aurangabad and Pune airports are other options.",
    },
    address: "Shri Saibaba Sansthan Trust, Shirdi, Rahata taluka, Ahilyanagar district, Maharashtra 423109",
    placeQuery: "Shri Sai Baba Samadhi Mandir Shirdi",
    website: "https://sai.org.in",
    faqs: [
      {
        q: "What are the aarti timings at Shirdi?",
        a: "The Sansthan lists four aartis: Kakad at 5:15 AM, Madhyan at noon, Dhoop at sunset and Shej at 10:00 PM.",
      },
      {
        q: "When can I have darshan at Shirdi?",
        a: "The Sansthan's FAQ says the darshan queue opens from 6:00 AM to 9:30 PM; book passes on the Sansthan's official portal.",
      },
      {
        q: "Is there free food at Shirdi?",
        a: "The Sansthan's Prasadalaya (dining hall) serves meals from 10:00 AM to 10:00 PM.",
      },
    ],
    sources: [
      "https://sai.org.in/en/history",
      "https://sai.org.in/en/faq",
      "https://sai.org.in/en",
    ],
    check: [
      "Darshan hours (Sansthan FAQ: 6:00 AM–9:30 PM) and whether the temple opens earlier for Kakad aarti",
      "District name: Ahilyanagar (renamed from Ahmednagar); Sansthan pages still say Ahmednagar",
      "Arrival dates (approx. 1854–1857; 1858) and the 1921 Sansthan formation wording",
      "Whether the Prasadalaya meals are free or at a nominal charge",
      "Train links from Visakhapatnam to Sainagar Shirdi and the 1,200 km distance",
      "Shirdi Airport current flights",
      "PIN code 423109",
    ],
  },

  // 6. Mahakaleshwar
  {
    slug: "mahakaleshwar-temple-ujjain",
    name: "Shri Mahakaleshwar Jyotirlinga Temple, Ujjain",
    shortName: "Mahakaleshwar",
    teluguName: "ఉజ్జయిని శ్రీ మహాకాళేశ్వర జ్యోతిర్లింగ ఆలయం",
    deity: "Lord Shiva as Sri Mahakaleshwar (Jyotirlinga)",
    form: "Mahakaleshwar",
    town: "Ujjain",
    state: "Madhya Pradesh",
    district: "Ujjain",
    region: "Madhya Pradesh",
    summary:
      "South-facing Jyotirlinga of Lord Shiva in the ancient city of Ujjain, Madhya Pradesh, famed for the Bhasma Aarti performed every day at 4 AM.",
    history: [
      "Ujjain, the ancient Avantika, is home to Sri Mahakaleshwar, one of the twelve Jyotirlingas of Lord Shiva. The Ujjain district administration notes that the linga here faces south, a feature found only at Mahakaleshwar among the twelve. According to the tradition retold by Madhya Pradesh Tourism, when the city was attacked while King Chandrasena and the boy devotee Shrikhar were absorbed in worship, Lord Shiva appeared as Mahakal and protected Ujjain.",
      "The temple has passed through hard times. Official accounts record that Sultan Iltutmish invaded Ujjain in 1234–35 and demolished the temple. After the Marathas took Malwa in the 1730s, Ranoji Shinde's diwan, Ramchandra Baba Shenvi, rebuilt the temple, and the present structure dates from the fourth and fifth decades of the 18th century.",
      "The temple rises in storeys. Above the Mahakal shrine is a sanctum of Omkareshwar Shiva, and on the third storey is the image of Nagchandreshwar, which is opened for darshan only on Nag Panchami. The day begins with the Bhasma Aarti at 4:00 AM, for which passes are booked through the temple's official portal.",
    ],
    highlights: [
      "One of the twelve Jyotirlingas; the linga faces south",
      "Bhasma Aarti every morning at 4:00 AM (passes required)",
      "Nagchandreshwar shrine opened only on Nag Panchami",
      "Present temple rebuilt in the 18th century under the Marathas",
      "About 53 km from Indore's Devi Ahilyabai Holkar Airport",
    ],
    festivals: [
      { name: "Maha Shivaratri", when: "Magha/Phalguna, February–March" },
      { name: "Shravan month processions (Sawari)", when: "July–August" },
      { name: "Nag Panchami (Nagchandreshwar darshan)", when: "Shravana Shukla Panchami, July–August" },
    ],
    timings: [
      { label: "Bhasma Aarti (temple; pass required)", time: "4:00 AM" },
      { label: "Darshan (MP Tourism / Incredible India)", time: "about 4:00 AM – 11:00 PM, no afternoon break" },
      { label: "Sandhya Aarti (temple)", time: "around 6:00–7:00 PM" },
    ],
    timingsNote:
      "Aarti times shift with the season, and the temple changes arrangements in Shravan and on Maha Shivaratri. Please confirm current timings with the temple before you travel.",
    fromVizag:
      "Ujjain is roughly 1,300–1,400 km from Visakhapatnam. Many pilgrims fly to Indore (about 53 km away) or travel by train via Nagpur or Bhopal.",
    howToReach: {
      road: "Ujjain is well connected by road to Indore (about 55 km) and Bhopal.",
      rail: "Ujjain Junction (UJN) on the Western Railway is a short drive from the temple.",
      air: "Devi Ahilyabai Holkar Airport, Indore, is about 53 km from Ujjain.",
    },
    address: "Shri Mahakaleshwar Temple, Jaisinghpura, Ujjain, Madhya Pradesh 456006",
    placeQuery: "Shri Mahakaleshwar Jyotirlinga Temple Ujjain",
    website: "https://www.shrimahakaleshwar.mp.gov.in",
    faqs: [
      {
        q: "How do I book the Bhasma Aarti at Mahakaleshwar?",
        a: "Bhasma Aarti passes are booked through the temple's official website; check the portal for the current booking window and dress rules.",
      },
      {
        q: "Is Mahakaleshwar open in the afternoon?",
        a: "Yes. Madhya Pradesh Tourism lists darshan from about 4:00 AM to 11:00 PM with no afternoon break.",
      },
      {
        q: "What is special about the Mahakaleshwar linga?",
        a: "The linga faces south, which the district administration notes is unique among the twelve Jyotirlingas.",
      },
    ],
    sources: [
      "https://www.shrimahakaleshwar.mp.gov.in/history",
      "https://www.shrimahakaleshwar.mp.gov.in/temple",
      "https://ujjain.nic.in/en/tourist-place/shri-mahakaleshwar-temple/",
      "https://ujjain.nic.in/en/history/",
      "https://www.mptourism.com/mahakaleshwar-jyotirlinga-temple-ujjain-mp.html",
      "https://www.incredibleindia.gov.in/en/madhya-pradesh/ujjain/mahakaleshwar-temple",
    ],
    check: [
      "Iltutmish invasion year: temple site says 1235, district site says 1234",
      "Rebuilding credit: Ramchandra Baba Shenvi (diwan) under Ranoji Shinde, 1730s–1740s",
      "Bhasma Aarti booking window and dress code",
      "Sandhya Aarti time by season; general darshan 4 AM–11 PM",
      "Distance from Visakhapatnam (1,300–1,400 km) and train routes",
      "Official site loads with a certificate warning; confirm URL",
      "Address and PIN code 456006",
    ],
  },

  // 7. Rameswaram
  {
    slug: "rameswaram-ramanathaswamy-temple",
    name: "Arulmigu Ramanathaswamy Temple, Rameswaram",
    shortName: "Rameswaram",
    teluguName: "రామేశ్వరం శ్రీ రామనాథస్వామి ఆలయం",
    deity: "Lord Shiva as Sri Ramanathaswamy, with Parvathavardhini Amman",
    form: "Ramanatha",
    town: "Rameswaram",
    state: "Tamil Nadu",
    district: "Ramanathapuram",
    region: "Tamil Nadu",
    summary:
      "Island temple where, by tradition, Lord Rama worshipped Shiva; a Jyotirlinga and Char Dham with 22 sacred wells and a link to Sri Chaitanya's travels.",
    history: [
      "Rameswaram is an island town in the Gulf of Mannar. According to the temple's own account, Lord Rama consecrated and worshipped a Shiva linga here after the war in Lanka. He sent Hanuman to Mount Kailasa to bring a linga, and when Hanuman was delayed, Sita Devi shaped a linga from sand, which was installed as Ramanatha. To console Hanuman, Rama had the linga he brought, the Vishwalingam, installed beside it, and by tradition the first worship each day is still offered to it.",
      "The temple records describe centuries of patronage. The sanctum is credited to Parakramabahu of Sri Lanka in the 12th century; the Sethupathi rulers of Ramanathapuram added gopurams, walls and the great Nandi mandapam between the 15th and 17th centuries; and the nine-tier eastern Rajagopuram, 126 feet high, was completed between 1897 and 1904 with funds raised by the Devakottai Nattukottai Nagarathar family. The temple is honoured as the southernmost Jyotirlinga and as one of the Char Dham, along with Badrinath, Dwarka and Puri.",
      "For Gaudiya Vaishnavas, Rameswaram is remembered in the Chaitanya Charitamrita: Sri Chaitanya Mahaprabhu bathed at Dhanus-tirtha, visited the temple, and there found a passage of the Kurma Purana explaining that Ravana had carried away only an illusory Sita.",
    ],
    highlights: [
      "Jyotirlinga and one of the Char Dham pilgrimage sites",
      "22 sacred theerthams (wells and tanks) inside the temple",
      "Spatika (crystal) linga darshan early each morning",
      "Visited by Sri Chaitanya Mahaprabhu (Chaitanya Charitamrita)",
      "126-ft nine-tier eastern Rajagopuram completed in 1904",
    ],
    festivals: [
      { name: "Maha Shivaratri", when: "Magha/Phalguna, February–March" },
      { name: "Thirukalyanam", when: "Aadi month, July–August" },
      { name: "Aadi and Thai Amavasai (sea bath at Agni Theertham)", when: "July–August and January–February" },
    ],
    timings: [
      { label: "Temple opens (HR&CE)", time: "4:00 AM" },
      { label: "Spatika linga darshan (HR&CE)", time: "5:00 AM – 6:00 AM" },
      { label: "Morning darshan (HR&CE)", time: "4:00 AM – 1:00 PM" },
      { label: "Evening darshan (HR&CE)", time: "3:00 PM – 8:00 PM (temple closes by 9:00 PM)" },
      { label: "Bath in the 22 theerthams (HR&CE)", time: "5:30 AM – 12:30 PM and 3:00 PM – 7:00 PM" },
    ],
    timingsNote:
      "The temple's official page gives evening darshan until 8:00 PM but says the temple closes by 9:00 PM; hours change on festival and eclipse days. Please confirm current timings with the temple before you travel.",
    fromVizag:
      "Rameswaram is roughly 1,300–1,400 km from Visakhapatnam. Pilgrims usually take a train to Rameswaram, often via Chennai or Madurai, or fly to Madurai and continue by road or rail.",
    howToReach: {
      road: "Rameswaram is linked to the mainland by the Pamban road bridge; buses run from Madurai, Ramanathapuram and other Tamil Nadu towns.",
      rail: "Rameswaram railway station is on the island, a short distance from the temple.",
      air: "Madurai Airport is the nearest airport.",
    },
    address: "Arulmigu Ramanathaswamy Temple, Rameswaram, Ramanathapuram district, Tamil Nadu 623526",
    placeQuery: "Arulmigu Ramanathaswamy Temple Rameswaram",
    website: "https://rameswaramramanathar.hrce.tn.gov.in",
    faqs: [
      {
        q: "What is the spatika linga darshan at Rameswaram?",
        a: "It is the first darshan of the day, of a crystal linga, held from about 5:00 to 6:00 AM according to the temple's official page.",
      },
      {
        q: "When can I bathe in the 22 theerthams?",
        a: "The temple allows bathing from 5:30 AM to 12:30 PM and 3:00 PM to 7:00 PM. Carry a change of clothes; tickets are sold inside.",
      },
      {
        q: "Did Sri Chaitanya Mahaprabhu visit Rameswaram?",
        a: "Yes. The Chaitanya Charitamrita (Madhya-lila 9) describes His visit to Setubandha Rameswaram during His South India pilgrimage.",
      },
      {
        q: "Why is Rameswaram one of the Char Dham?",
        a: "Tradition counts Badrinath, Dwarka, Puri and Rameswaram as the four dhamas; Rameswaram is the only one of them dedicated to Lord Shiva.",
      },
    ],
    sources: [
      "https://rameswaramramanathar.hrce.tn.gov.in",
      "https://rameswaramramanathar.hrce.tn.gov.in/hrcehome/history.php?tid=35671",
      "https://vedabase.io/en/library/cc/madhya/9/",
      "https://www.incredibleindia.gov.in/en/tamil-nadu/rameswaram/sri-ramanathaswamy-temple",
    ],
    check: [
      "Evening closing: official page says darshan to 8:00 PM and closing by 9:00 PM",
      "Ticket fees for spatika linga darshan and theertham bath (not included)",
      "Festival list and months (Thirukalyanam in Aadi; Aadi/Thai Amavasai)",
      "Famous long corridors: not mentioned on the official page, so left out",
      "Name of the Amman (Parvathavardhini) as used by the temple",
      "Distance from Visakhapatnam and direct trains to Rameswaram",
      "PIN code 623526",
    ],
  },

  // 8. Konark
  {
    slug: "konark-sun-temple",
    name: "Sun Temple, Konark",
    shortName: "Konark",
    teluguName: "కోణార్క్ సూర్య దేవాలయం",
    deity: "Surya (the Sun God); a protected monument, not a place of daily worship",
    form: "Surya",
    town: "Konark",
    state: "Odisha",
    district: "Puri",
    region: "Odisha",
    summary:
      "13th-century temple of Surya at Konark, Odisha, built as a giant stone chariot; a UNESCO World Heritage Site cared for by the ASI as a monument.",
    history: [
      "The Sun Temple at Konark, near the Bay of Bengal about 35 km from Puri, was built in the 13th century and is generally attributed to King Narasimhadeva I of the Eastern Ganga dynasty. The Archaeological Survey of India (ASI) describes it as conceived as a gigantic chariot of the Sun God, with twelve pairs of richly carved wheels drawn by seven rearing horses.",
      "Much of the temple has been lost. The ASI notes that the sanctum, presumably once more than 68 metres high, and the dance hall (nata-mandira) have lost their roofs. The jagamohana, the audience hall about 30 metres square and 30 metres high, still stands, its roof rising in three tiers lined with life-size female figures. Within the complex are older shrines too: the Mayadevi temple of about the late 11th century, and a small brick Vaishnava temple found in 1956, where images of Lord Balarama, Varaha and Trivikrama were discovered.",
      "Konark was inscribed on the UNESCO World Heritage List in 1984. It is a protected monument in the care of the ASI and is visited as a heritage site; daily worship is not offered in the main sanctum today. Nearby, Chandrabhaga beach hosts the Chandrabhaga Mela in Magha, and the Konark Dance Festival is held at the temple every December.",
    ],
    highlights: [
      "Temple built as the Sun God's stone chariot with 24 wheels",
      "UNESCO World Heritage Site since 1984, protected by the ASI",
      "Jagamohana (audience hall) still stands about 30 m high",
      "Small Vaishnava temple with Balarama images found in 1956",
      "About 35 km from Puri; Konark Dance Festival every December",
    ],
    festivals: [
      { name: "Konark Dance Festival", when: "1–5 December" },
      { name: "Chandrabhaga Mela (Magha Saptami)", when: "Magha month, January–February" },
    ],
    timings: [{ label: "Visiting hours (ASI)", time: "Sunrise to sunset" }],
    timingsNote:
      "Konark is an ASI-protected monument; visiting hours are from sunrise to sunset and an entry ticket is required (children under 15 enter free). Please confirm current hours and fees on the ASI website before you travel.",
    fromVizag:
      "Konark is roughly 470 km from Visakhapatnam. Take a train to Puri or Bhubaneswar (around 7–9 hours) and continue about 35 km from Puri or 65 km from Bhubaneswar by road.",
    howToReach: {
      road: "The marine drive road links Konark with Puri (about 35 km); buses and taxis also run from Bhubaneswar.",
      rail: "Puri and Bhubaneswar stations, both with trains from Visakhapatnam, are the practical railheads.",
      air: "Biju Patnaik International Airport, Bhubaneswar, is the nearest airport.",
    },
    address: "Sun Temple, Konark, Puri district, Odisha 752111",
    placeQuery: "Konark Sun Temple Odisha",
    website: "https://asi.nic.in/pages/WorldHeritageKonarak",
    faqs: [
      {
        q: "Is worship performed at the Konark Sun Temple?",
        a: "Konark is a protected monument in the care of the ASI and is visited as a heritage site; daily worship is not offered in the main sanctum.",
      },
      {
        q: "What are Konark Sun Temple's timings?",
        a: "The ASI lists the monument as open from sunrise to sunset. Entry tickets are sold at the counter and online; children under 15 enter free.",
      },
      {
        q: "Who built the Konark Sun Temple?",
        a: "It dates from the 13th century and is generally attributed to King Narasimhadeva I of the Eastern Ganga dynasty.",
      },
      {
        q: "Can I visit Konark and Puri on the same trip?",
        a: "Yes. Konark is about 35 km from Puri, so pilgrims often visit it as a day trip after Lord Jagannath's darshan.",
      },
    ],
    sources: [
      "https://asi.nic.in/pages/WorldHeritageKonarak",
      "https://asi.nic.in/konarak-sun-temple-introduction/",
      "https://odishatourism.gov.in/en/places/konark-sun-temple",
      "https://www.incredibleindia.gov.in/en/odisha/puri/konark-temple",
    ],
    check: [
      "Builder: Narasimhadeva I (c. 1250) is from Ministry of Culture/Odisha listings; the ASI page fetched only says 13th century",
      "Worship status wording: confirm with ASI that no daily worship is offered in the main sanctum",
      "Visiting hours: ASI says sunrise to sunset; Odisha Tourism and Incredible India say 6:00 AM–8:00 PM",
      "Entry fee for Indian visitors (not shown on the ASI page fetched)",
      "Chandrabhaga Mela timing (Magha Saptami) and Konark Dance Festival dates",
      "Distances: 470 km from Vizag, 65 km from Bhubaneswar",
      "PIN code 752111",
    ],
  },

  // 9. Kamakhya
  {
    slug: "kamakhya-temple-guwahati",
    name: "Maa Kamakhya Devalaya, Guwahati",
    shortName: "Kamakhya",
    teluguName: "గువాహటి శ్రీ కామాఖ్య దేవి ఆలయం",
    deity: "Maa Kamakhya (a form of the Divine Mother)",
    form: "Kamakhya",
    town: "Guwahati (Nilachal hill)",
    state: "Assam",
    district: "Kamrup Metropolitan",
    region: "Assam",
    summary:
      "Ancient Shakti Peetha of Maa Kamakhya on Nilachal hill in Guwahati, Assam, rebuilt in 1565 and closed for three days each June for Ambubachi.",
    history: [
      "The Kamakhya temple stands on Nilachal hill in western Guwahati, above the Brahmaputra. According to the temple's own account, when Sati Devi gave up her body at her father Daksha's sacrifice, the places where parts of her form fell became the Shakti Peethas, and Kamakhya is where the yoni-mudra fell. The Devalaya honours it as among the most sacred of the 51 Shakti Peethas.",
      "The temple's records say an earlier, much larger stone temple was ruined, and its history becomes unclear until the rise of the Koch kingdom in the 16th century. The present temple was rebuilt in 1565 over the ruins of an 11th–12th century stone temple; masons sent by the Koch king Naranarayan are said to have turned to brick for the dome after attempts in stone failed, and the result gave rise to the distinctive Nilachal style of temple architecture.",
      "The Devalaya is managed by the Bardeuri Samaj through elected Dolois. Each June, during Ambubachi, the temple doors close to devotees for three days and reopen after a ritual bath and puja, drawing vast numbers of pilgrims to Guwahati.",
    ],
    highlights: [
      "Shakti Peetha honoured as among the most sacred of the 51",
      "Present temple rebuilt in 1565 under the Koch king Naranarayan",
      "Distinctive Nilachal-style dome",
      "Doors close for three days during Ambubachi each June",
      "On Nilachal hill, about 20 km from Guwahati airport",
    ],
    festivals: [
      { name: "Ambubachi Mahayog (Mela)", when: "June (temple closed about three days)" },
      { name: "Durga Puja", when: "Ashwin, September–October" },
    ],
    timings: [
      { label: "Temple opens for devotees (Devalaya)", time: "8:00 AM" },
      { label: "Midday closure for bhog (Devalaya)", time: "1:00 PM – 2:30 PM" },
      { label: "Doors close for the day (Devalaya)", time: "5:15 PM (aarati at 7:30 PM)" },
    ],
    timingsNote:
      "On special days the Devalaya opens at 9:00 AM and closes at sunset, and during Ambubachi the doors stay closed for about three days. Please confirm current timings with the temple before you travel.",
    fromVizag:
      "Guwahati is roughly 1,900 km from Visakhapatnam. Long-distance trains between South India and the North-East run through Visakhapatnam, or you can fly via Kolkata or Hyderabad.",
    howToReach: {
      road: "Nilachal hill is in western Guwahati; buses, taxis and app cabs go up to the temple area.",
      rail: "Kamakhya and Guwahati railway stations are both within the city.",
      air: "Lokpriya Gopinath Bordoloi International Airport, Guwahati, is the nearest airport.",
    },
    address: "Maa Kamakhya Devalaya, Nilachal Hill, Guwahati, Kamrup Metropolitan district, Assam 781010",
    placeQuery: "Kamakhya Temple Guwahati",
    website: "https://www.maakamakhya.org",
    faqs: [
      {
        q: "When is the Kamakhya temple closed?",
        a: "During Ambubachi each June the doors close for about three days; in 2026 they were closed from 23 to 25 June and reopened on the 26th.",
      },
      {
        q: "What are the Kamakhya darshan timings?",
        a: "The Devalaya lists opening for devotees at 8:00 AM, a break from 1:00 to 2:30 PM, and closing at 5:15 PM on regular days.",
      },
      {
        q: "Who manages the Kamakhya temple?",
        a: "The Bardeuri Samaj, through elected Dolois, has the customary right to manage the Devalaya.",
      },
      {
        q: "Are footwear allowed near the temple?",
        a: "No. Footwear must be left at the designated places on the approach road, before the main entrance.",
      },
    ],
    sources: [
      "https://www.maakamakhya.org",
      "https://maakamakhya.org/temple",
      "https://maakamakhya.org/history",
      "https://www.maakamakhya.org/architecture",
      "https://kamrupmetro.assam.gov.in/tourist-place-detail/218",
      "https://tourism.assam.gov.in/portlet-sub-innerpage/temples-pilgrimages",
    ],
    check: [
      "Rebuilding credit: Naranarayan (official site) vs his brother Chilarai (district tourism page)",
      "Ambubachi closure length and dates for the coming year",
      "Regular timings, and whether 5:15 PM is the final closing for darshan",
      "Description of the sanctum (natural stone and spring) was left out for lack of an official source",
      "Distances: 1,900 km from Vizag; 20 km to the airport; trains from Vizag to Guwahati",
      "PIN code 781010",
    ],
  },

  // 10. Bhadrachalam
  {
    slug: "bhadrachalam-sita-ramachandra-temple",
    name: "Sri Seetha Ramachandra Swamy Temple, Bhadrachalam",
    shortName: "Bhadrachalam",
    teluguName: "భద్రాచలం శ్రీ సీతా రామచంద్ర స్వామి దేవస్థానం",
    deity: "Sri Rama (as Vaikuntha Rama) with Sita Devi and Lakshmana",
    form: "Rama",
    town: "Bhadrachalam",
    state: "Telangana",
    district: "Bhadradri Kothagudem",
    region: "Telangana",
    summary:
      "Godavari-side temple of Sri Sita Ramachandra, built by Bhakta Ramadasu in the 17th century and famous for the Sri Rama Navami Kalyanam.",
    history: [
      "Bhadrachalam stands on the bank of the Godavari. According to the temple's tradition, a great rock was touched by the feet of Sri Rama and Sita and became the sage Bhadra, who later performed austerities for the Lord's darshan; the hill and town took his name. The Deity here is Vaikuntha Rama, a four-armed form holding the conch and disc in the upper hands and the bow in the lower left, with Sita Devi and Lakshmana.",
      "The temple records that in the 17th century a devotee named Pokala Dammakka, living in a village nearby, was guided by dreams to find the Deity on the hill and worshipped Him daily with Godavari water. Kancherla Gopanna, a revenue official under the Golconda ruler Tana Shah, then built the temple using the revenue he collected. For this he was imprisoned for twelve years. Devotees believe that Rama and Lakshmana themselves came in disguise to repay the money, after which Gopanna was released; he is remembered as Bhakta Ramadasu, whose Telugu kirtanas are still sung.",
      "Sri Rama Navami, celebrated as the divine wedding of Sita and Rama, is the temple's greatest festival. The temple's account says Tana Shah sent silk, pearls and gems for the wedding, a custom remembered in the pearls and silk offered by the state government today.",
    ],
    highlights: [
      "Temple built by Bhakta Ramadasu (Kancherla Gopanna), 17th century",
      "Four-armed Vaikuntha Rama with Sita Devi and Lakshmana",
      "Sri Rama Navami Kalyanam with pearl talambralu",
      "On the bank of the Godavari in Telangana",
      "Parnasala, linked with the Ramayana, is in the surrounding area",
    ],
    festivals: [
      { name: "Sri Rama Navami Kalyanam", when: "Chaitra Shukla Navami, March–April" },
      { name: "Vaikuntha Ekadashi (Mukkoti)", when: "Dhanurmasa, December–January" },
      { name: "Sri Rama Pattabhishekam", when: "Day after Sri Rama Navami" },
    ],
    timings: [
      { label: "Temple opens (Suprabhata Seva)", time: "4:30 AM" },
      { label: "Archana to main Deities (devasthanam)", time: "8:30–11:00 AM, 12:30–1:00 PM, 3:00–8:30 PM" },
      { label: "Midday closure (devasthanam)", time: "1:00 PM – 3:00 PM" },
      { label: "Temple closes (devasthanam)", time: "9:00 PM" },
    ],
    timingsNote:
      "Darshan pauses for sevas such as Nitya Kalyanam, Raja Bhogam and Darbaru Seva, and hours change during Sri Rama Navami and Vaikuntha Ekadashi. Please confirm current timings with the temple before you travel.",
    fromVizag:
      "Bhadrachalam is roughly 350–400 km from Visakhapatnam by road, usually via Rajahmundry; the drive takes about 8–9 hours. By rail, travel to Bhadrachalam Road (Kothagudem) and continue by road.",
    howToReach: {
      road: "TSRTC and APSRTC buses connect Bhadrachalam with Hyderabad, Khammam, Vijayawada and Rajahmundry.",
      rail: "Bhadrachalam Road station at Kothagudem is the nearest railhead.",
      air: "Rajahmundry Airport is the nearest airport; Vijayawada and Hyderabad are other options.",
    },
    address: "Sri Seetha Ramachandra Swamy Devasthanam, Bhadrachalam, Bhadradri Kothagudem district, Telangana 507111",
    placeQuery: "Sri Seetha Ramachandra Swamy Temple Bhadrachalam",
    website: "https://bhadradritemple.telangana.gov.in",
    faqs: [
      {
        q: "What are the Bhadrachalam temple timings?",
        a: "The devasthanam lists opening at 4:30 AM, a midday closure from 1:00 to 3:00 PM, and closing at 9:00 PM.",
      },
      {
        q: "Who built the Bhadrachalam temple?",
        a: "Kancherla Gopanna, a revenue official in the 17th century who became known as Bhakta Ramadasu, built it using revenue funds and was imprisoned for it.",
      },
      {
        q: "When is the Sri Rama Navami Kalyanam?",
        a: "On Chaitra Shukla Navami (March–April). It is the year's biggest festival, so book stay early.",
      },
      {
        q: "Can I stay at Bhadrachalam?",
        a: "The devasthanam runs choultries that can be booked on its website; check-in is from 6 AM.",
      },
    ],
    sources: [
      "https://bhadradritemple.telangana.gov.in/timings/",
      "https://bhadradritemple.telangana.gov.in/about_us/",
      "https://bhadradritemple.telangana.gov.in/festivals/",
      "https://www.incredibleindia.gov.in/en/telangana/khammam/bhadrachalam-hills",
      "https://www.deccanchronicle.com/southern-states/telangana/bhadrachalam-gears-up-for-grand-rama-navami-fete-cm-to-attend-celestial-wedding-1871136",
    ],
    check: [
      "General darshan hours (official page lists sevas and archana slots, not darshan windows)",
      "Pearls/silk custom from the state government (present-day practice wording)",
      "Parnasala distance and whether to mention it",
      "Festival list (Pattabhishekam, Vaikuntha Ekadashi) against the devasthanam festivals page",
      "Nearest railhead (Bhadrachalam Road, Kothagudem) and distance; nearest airport",
      "Distance from Visakhapatnam (350–400 km) and route",
      "PIN code 507111",
    ],
  },

  // 11. Yadagirigutta
  {
    slug: "yadagirigutta-lakshmi-narasimha-temple",
    name: "Sri Lakshmi Narasimha Swamy Temple, Yadagirigutta",
    shortName: "Yadagirigutta",
    teluguName: "యాదగిరిగుట్ట శ్రీ లక్ష్మీ నరసింహ స్వామి దేవస్థానం",
    deity: "Sri Lakshmi Narasimha Swamy, worshipped in a cave shrine",
    form: "Narasimha",
    town: "Yadagirigutta",
    state: "Telangana",
    district: "Yadadri Bhuvanagiri",
    region: "Telangana",
    summary:
      "Hill temple of Lord Narasimha near Hyderabad, where by tradition He revealed five forms to sage Yada; the rebuilt stone temple reopened in 2022.",
    history: [
      "Yadagirigutta is a hill between Bhongir and Raigir, about 60 km from Hyderabad. According to the temple's tradition, the sage Yada, or Yadarishi, performed austerities in a cave on this hill with the blessings of Hanuman, and Lord Narasimha appeared to him in five forms: Jwala Narasimha, Yogananda Narasimha, Gandabherunda Narasimha, Ugra Narasimha and Lakshmi Narasimha. Devotees believe that the Lord later revealed Himself in these five forms in a large cave, which remains the heart of the temple.",
      "The temple's history page links the shrine to an inscription of 1148 CE mentioning a king, Tribhuvana Malla, who built a fort on the rock at Bhongir and visited the Lord several times. It also records that Sri Krishnadevaraya prayed here for victory before a campaign.",
      "In recent years the Telangana government rebuilt the temple on a large scale. After a gap of about 66 months, the renovated temple reopened to devotees on 28 March 2022 following the Maha Kumbha Samprokshanam, when priests consecrated the golden Sudarshana Chakra atop the vimanam and the kalashas on the six gopurams. The temple was also the first in Telangana to allow devotees to perform giri pradakshina around the hill.",
    ],
    highlights: [
      "By tradition, the Lord revealed five forms to sage Yada",
      "Cave sanctum at the heart of the rebuilt stone temple",
      "Rebuilt temple reopened on 28 March 2022",
      "Golden Sudarshana Chakra visible from about 6 km away",
      "About 60 km from Hyderabad by road",
    ],
    festivals: [
      { name: "Brahmotsavam", when: "Phalguna month, February–March" },
      { name: "Narasimha Jayanti", when: "Vaishakha Shukla Chaturdashi, April–May" },
      { name: "Vaikuntha Ekadashi", when: "Dhanurmasa, December–January" },
    ],
    timings: [
      { label: "Temple opens (devasthanam)", time: "3:30 AM" },
      { label: "Darshan for all (devasthanam)", time: "7:00–9:00 AM, 10:00 AM–4:00 PM, 5:00–7:00 PM, 8:15–9:00 PM" },
      { label: "VIP break darshan (devasthanam)", time: "9:00–10:00 AM and 4:00–5:00 PM" },
      { label: "Temple closes (devasthanam)", time: "9:45 PM" },
    ],
    timingsNote:
      "Darshan pauses for sevas and offerings between these slots, and hours change on festival and eclipse days. Please confirm current timings with the temple before you travel.",
    fromVizag:
      "Yadagirigutta is roughly 650 km from Visakhapatnam. Take a train or flight to Hyderabad/Secunderabad (around 10–13 hours by train) and continue about 60 km by road.",
    howToReach: {
      road: "TSRTC runs frequent buses from Hyderabad (JBS and MGBS) to Yadagirigutta.",
      rail: "Raigir (Yadadri) station is the nearest; Secunderabad has many more trains.",
      air: "Rajiv Gandhi International Airport, Hyderabad, is the nearest airport.",
    },
    address: "Sri Lakshmi Narasimha Swamy Devasthanam, Yadagirigutta, Yadadri Bhuvanagiri district, Telangana 508115",
    placeQuery: "Sri Lakshmi Narasimha Swamy Temple Yadagirigutta",
    website: "https://yadagiriguttatemple.telangana.gov.in",
    faqs: [
      {
        q: "What are the Yadagirigutta darshan timings?",
        a: "The devasthanam opens at 3:30 AM and closes at 9:45 PM, with darshan in several slots through the day and short breaks for sevas.",
      },
      {
        q: "What are the five forms of Narasimha at Yadagirigutta?",
        a: "By tradition: Jwala, Yogananda, Gandabherunda, Ugra and Lakshmi Narasimha.",
      },
      {
        q: "When did the rebuilt Yadagirigutta temple reopen?",
        a: "The renovated temple reopened to devotees on 28 March 2022 after the Maha Kumbha Samprokshanam.",
      },
      {
        q: "Can devotees do giri pradakshina?",
        a: "Yes. The temple allows giri pradakshina around the hill; check the devasthanam for current days and timings.",
      },
    ],
    sources: [
      "https://yadagiriguttatemple.telangana.gov.in/timings/",
      "https://yadagiriguttatemple.telangana.gov.in/mythological/",
      "https://yadagiriguttatemple.telangana.gov.in/significance/",
      "https://www.deccanchronicle.com/nation/in-other-news/280322/renovated-yadadri-open-for-devotees.html",
      "https://www.deccanchronicle.com/nation/current-affairs/260322/renovated-yadadri-all-set-for-grand-opening-tomorrow.html",
      "https://www.deccanchronicle.com/southern-states/telangana/devotees-can-do-giri-pradakshina-at-yadadri-narasimha-swamy-temple-898983",
    ],
    check: [
      "Darshan slots (official page; Telugu and English versions differ slightly)",
      "Tribhuvana Malla inscription (1148 CE) and Krishnadevaraya visit wording",
      "Distance from Hyderabad (about 60 km) and nearest station (Raigir)",
      "Official website domain: yadagiriguttatemple.telangana.gov.in vs yadadritemple.telangana.gov.in",
      "Festival months (Brahmotsavam in Phalguna)",
      "Distance from Visakhapatnam (about 650 km)",
      "PIN code 508115",
    ],
  },

  // 12. Srikalahasti
  {
    slug: "srikalahasti-temple",
    name: "Sri Kalahasteeswara Swamy Temple, Srikalahasti",
    shortName: "Srikalahasti",
    teluguName: "శ్రీకాళహస్తి శ్రీ కాళహస్తీశ్వర స్వామి దేవస్థానం",
    deity: "Lord Shiva as Sri Kalahasteeswara (Vayu Linga) and Sri Gnana Prasunambika Devi",
    form: "Vayu Linga",
    town: "Srikalahasti",
    state: "Andhra Pradesh",
    district: "Tirupati",
    region: "Rayalaseema",
    summary:
      "Riverside temple of Lord Shiva as the Vayu (air) linga near Tirupati, named after a spider, serpent and elephant, and known for Rahu-Ketu poojas.",
    history: [
      "Srikalahasti stands on the bank of the Swarnamukhi river, not far from Tirupati. The temple is counted among the Pancha Bhuta Sthalas, the five shrines where Lord Shiva is worshipped as one of the five elements, and here He is honoured as the Vayu Linga, the linga of air.",
      "The town's name comes from a well-loved legend. According to tradition, a spider (Sri), a serpent (Kala) and an elephant (Hasti) each worshipped the linga with such devotion that they gave their lives, and Lord Shiva granted them liberation; the base of the linga is said to show their marks. Another story tells of Kannappa, a hunter, who, seeing blood flow from the linga, offered his own eyes to the Lord, who restored his sight and blessed him.",
      "Government tourism records credit the entrance gopurams to the Chola king Kulottunga I in the 11th century and the great Rajagopuram to the Vijayanagara period in the 16th century. The temple is regarded as a Rahu-Ketu kshetra, and unlike most temples it stays open during eclipses, performing special abhishekams instead. Maha Shivaratri is celebrated with a Brahmotsavam lasting about thirteen days.",
    ],
    highlights: [
      "Vayu (air) Linga, one of the Pancha Bhuta Sthalas",
      "Named after a spider, serpent and elephant who worshipped Shiva",
      "Kannappa, the hunter who offered his eyes, is honoured here",
      "Rahu-Ketu poojas; temple stays open during eclipses",
      "About 35 km from Tirupati on the Swarnamukhi river",
    ],
    festivals: [
      { name: "Maha Shivaratri Brahmotsavam", when: "About 13 days around Maha Shivaratri, February–March" },
      { name: "Karthika Masam", when: "October–November" },
    ],
    timings: [{ label: "Temple hours (Incredible India listing)", time: "about 5:30 AM – 9:30 PM" }],
    timingsNote:
      "Government listings differ (Andhra Pradesh Tourism gives 4:00 AM – 9:00 PM), and Rahu-Ketu pooja hours are separate. Please confirm current timings with the temple before you travel.",
    fromVizag:
      "Srikalahasti is roughly 750 km from Visakhapatnam. Many trains from Visakhapatnam to Tirupati run via Gudur and Srikalahasti; from Tirupati it is about 35 km by road.",
    howToReach: {
      road: "APSRTC buses run frequently from Tirupati and Renigunta to Srikalahasti.",
      rail: "Srikalahasti station is in the town; Tirupati and Renigunta junctions have more trains.",
      air: "Tirupati Airport at Renigunta is the nearest airport.",
    },
    address: "Sri Kalahasteeswara Swamy Devasthanam, Srikalahasti, Tirupati district, Andhra Pradesh 517644",
    placeQuery: "Sri Kalahasteeswara Swamy Temple Srikalahasti",
    faqs: [
      {
        q: "Why is Srikalahasti open during an eclipse?",
        a: "Unlike most temples, Srikalahasti keeps its rituals going during eclipses and performs special abhishekams, as it is regarded as a Rahu-Ketu kshetra.",
      },
      {
        q: "Can I do Rahu-Ketu pooja at Srikalahasti?",
        a: "Yes. The temple offers Rahu-Ketu poojas at several ticket levels inside and in mandapams outside; check current timings and fees at the temple.",
      },
      {
        q: "What is the Vayu Linga?",
        a: "Srikalahasti is one of the five Pancha Bhuta Sthalas, and here Lord Shiva is worshipped as the linga of air (vayu).",
      },
      {
        q: "Can I combine Srikalahasti with Tirupati?",
        a: "Yes. Srikalahasti is about 35 km from Tirupati, and many pilgrims visit it on the same trip.",
      },
    ],
    sources: [
      "https://www.incredibleindia.gov.in/en/andhra-pradesh/tirupati/srikalahasti-temple",
      "https://aptourism.gov.in/destinations/16/srikalahasti",
      "https://www.deccanchronicle.com/southern-states/andhra-pradesh/despite-lunar-eclipse-srikalahasti-temple-remains-open-1902163",
      "https://www.deccanchronicle.com/southern-states/andhra-pradesh/srikalahasti-gears-up-for-13-day-maha-shivaratri-brahmotsavams-1935896",
    ],
    check: [
      "Official devasthanam website (srikalahastitemple.org.in is an unofficial guide; seva booking via aptemples.ap.gov.in?); website field not set",
      "Daily timings: Incredible India 5:30 AM–9:30 PM vs AP Tourism 4:00 AM–9:00 PM",
      "Rahu-Ketu pooja hours and current ticket prices",
      "Gopuram history: Kulottunga I (11th century) and Vijayanagara Rajagopuram; the 2010 collapse and rebuilt Rajagopuram not mentioned",
      "Distance from Tirupati (about 35 km) and from Visakhapatnam (about 750 km); trains stopping at Srikalahasti",
      "Consort's name as used by the temple (Gnana Prasunambika)",
      "PIN code 517644",
    ],
  },
];
