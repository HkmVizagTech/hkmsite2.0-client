// Major Hindu temples across India: pilgrimage guide content (second continuation of templesData.ts).
// Original writing for ISKCON Gambheeram Visakhapatnam (Hare Krishna Movement, Vizag).
// Every entry carries a `check` list of facts the temple team must verify before publishing.
// Sources are limited to official temple sites, government sites, Vedabase scripture and established news outlets.
// Timings are given only where such a source lists them; otherwise the page asks visitors to confirm with the temple.

import type { Temple } from "./templesData";

const CONFIRM_NOTE =
  "Please confirm current timings with the temple before you travel; they change on festival days, eclipses and special occasions.";

export const TEMPLES_MORE2: Temple[] = [
  // 1. Dwarkadhish, Dwarka
  {
    slug: "dwarkadhish-temple-dwarka",
    name: "Shri Dwarkadhish Temple (Jagat Mandir), Dwarka",
    shortName: "Dwarkadhish",
    teluguName: "ద్వారక శ్రీ ద్వారకాధీశ ఆలయం",
    deity: "Sri Dwarkadhish, Lord Krishna as the King of Dwaraka",
    form: "Krishna",
    town: "Dwarka",
    state: "Gujarat",
    district: "Devbhumi Dwarka",
    region: "Gujarat",
    summary:
      "Lord Krishna's royal home on the Gujarat coast, worshipped as Dwarkadhish, the King of Dwaraka, where the Gomti river meets the Arabian Sea.",
    history: [
      "The Srimad Bhagavatam (Tenth Canto, chapter 50) describes how Lord Krishna had a fortified city built within the sea and brought His family and the Yadus to live there safely. That city was Dwaraka, where the Lord lived as a king, and the temple at Dwarka is dedicated to Him as Dwarkadhish, the Lord of Dwaraka.",
      "According to temple tradition, as presented by Gujarat Tourism, the shrine was first established more than 2,500 years ago by Vajranabha, the great-grandson of Lord Krishna. The temple, also called Jagat Mandir, stands where the Gomti river meets the Arabian Sea. Its spire rises about 43 m, and a flag made from 52 yards of cloth flies at the top. Pilgrims pass through two doors: the Swarga Dwar and the Moksha Dwar.",
    ],
    highlights: [
      "Lord Krishna worshipped as the King of Dwaraka",
      "Spire about 43 m high with a 52-yard flag",
      "Stands where the Gomti river meets the Arabian Sea",
      "Two doors: Swarga Dwar and Moksha Dwar",
    ],
    festivals: [
      { name: "Sri Krishna Janmashtami", when: "Bhadrapada Krishna Ashtami, August–September" },
      { name: "Holi", when: "Phalguna Purnima, February–March" },
      { name: "Annakut", when: "Day after Diwali, October–November" },
    ],
    timings: [
      { label: "Morning darshan (Gujarat Tourism listing)", time: "about 7:00 AM – 12:30 PM" },
      { label: "Evening darshan (Gujarat Tourism listing)", time: "about 5:00 PM – 9:00 PM" },
    ],
    timingsNote:
      "Government listings differ slightly (another lists 6:30 AM – 1:00 PM and 5:00 PM – 9:30 PM), and the temple revises timings in special months. " +
      CONFIRM_NOTE,
    fromVizag:
      "Dwarka is roughly 2,100 km from Visakhapatnam. Most pilgrims fly to Jamnagar, Porbandar or Rajkot via a connecting city, or take a train towards Ahmedabad and continue to Dwarka.",
    howToReach: {
      road: "State buses and taxis connect Dwarka with Jamnagar, Porbandar and Rajkot.",
      rail: "Dwarka has its own railway station, a short distance from the temple.",
      air: "Porbandar airport is about 95 km away and Jamnagar airport about 145 km away.",
    },
    address: "Shri Dwarkadhish Temple, Dwarka, Devbhumi Dwarka district, Gujarat 361335",
    placeQuery: "Dwarkadhish Temple Dwarka Gujarat",
    faqs: [
      {
        q: "What are the Dwarkadhish temple timings?",
        a: "Gujarat Tourism lists about 7:00 AM – 12:30 PM and 5:00 PM – 9:00 PM. Please confirm with the temple before you go.",
      },
      {
        q: "What is Sudama Setu?",
        a: "A footbridge near the temple across the Gomti creek. Gujarat Tourism lists it as open about 7 AM – 1 PM and 4 – 7:30 PM.",
      },
      {
        q: "What is the nearest airport to Dwarka?",
        a: "Porbandar (about 95 km) and Jamnagar (about 145 km) are the nearest airports.",
      },
    ],
    sources: [
      "https://gujarattourism.com/saurashtra/devbhoomi-dwarka/dwarkadhish-temple.html",
      "https://utsav.gov.in/view-darshan/dwarkadhish-temple-live-darshan-1",
      "https://vedabase.io/en/library/sb/10/50/",
    ],
    check: [
      "Current darshan timings (Gujarat Tourism and utsav.gov.in listings differ)",
      "Official temple website URL (website field not set)",
      "Gujarat Tourism says both 'great-grandson' and 'grandson' for Vajranabha; confirm wording",
      "Whether to add 'one of the four dhamas' (no valid source found yet)",
      "Dating of the present structure (no valid source found; left out)",
      "Bet Dwarka and the Okha road bridge (no valid source found; left out)",
      "Festival months and distance from Vizag (about 2,100 km)",
      "Railway station distance from the temple; PIN code 361335",
    ],
  },

  // 2. Guruvayur
  {
    slug: "guruvayur-sri-krishna-temple",
    name: "Guruvayur Sri Krishna Temple",
    shortName: "Guruvayur",
    teluguName: "గురువాయూర్ శ్రీ కృష్ణ ఆలయం",
    deity: "Sri Guruvayurappan, Lord Vishnu worshipped as child Krishna",
    form: "Krishna",
    town: "Guruvayur",
    state: "Kerala",
    district: "Thrissur",
    region: "Kerala",
    summary:
      "Kerala's beloved temple of Guruvayurappan, the four-armed Lord worshipped as child Krishna, where the day begins with Nirmalya darshan at dawn.",
    history: [
      "The Lord at Guruvayur stands with four arms holding the conch, the Sudarshana disc, the lotus and the club, and devotees worship Him as Guruvayurappan, Krishna in His childhood form. The Deity is made of a stone known as Patala Anjana. According to temple tradition, the shrine was established by Brihaspati, the guru of the demigods, and Vayu, the god of the wind, and devotees have long called the place Bhuloka Vaikuntha, the abode of Lord Vishnu on earth.",
      "The present structure is believed to have been rebuilt in the 16th century under the Zamorin rulers of Calicut. Worship begins at dawn with Nirmalya darshan and closes at night with the Ekanta Seva. The principal offering is Krishna Nivedyam, made from rice, jaggery and ghee, and many devotees offer Thulabharam, in which goods such as rice, sugar or fruit equal to their body weight are given to the Lord.",
    ],
    highlights: [
      "Four-armed Lord worshipped as child Krishna",
      "Nirmalya darshan at dawn begins the day",
      "Thulabharam: offerings equal to one's body weight",
      "Ekadashi, Ashtami Rohini and Chembai music festival",
    ],
    festivals: [
      { name: "Guruvayur Ekadashi", when: "Vrischikam month, November–December" },
      { name: "Ashtami Rohini (Janmashtami)", when: "Chingam month, August–September" },
      { name: "Guruvayur Utsavam", when: "Kumbham month, February–March" },
      { name: "Chembai Sangeetholsavam", when: "Around Guruvayur Ekadashi" },
    ],
    timings: [
      { label: "Morning darshan (Incredible India listing)", time: "about 3:00 AM – 12:30 PM" },
      { label: "Evening darshan (Incredible India listing)", time: "about 4:30 PM – 9:15 PM" },
    ],
    timingsNote:
      "Guruvayur Devaswom adjusts darshan hours by season and on festival days. " + CONFIRM_NOTE,
    fromVizag:
      "Guruvayur is roughly 1,400 km from Visakhapatnam. Pilgrims usually take a train to Thrissur or fly to Kochi via a connecting city and continue by road.",
    howToReach: {
      road: "Buses and taxis run to Guruvayur from Thrissur and other towns in Kerala.",
      rail: "Thrissur is the nearest major railway station for long-distance trains.",
      air: "Cochin International Airport, Kochi, is the nearest major airport.",
    },
    address: "Sri Krishna Temple, East Nada, Guruvayur, Thrissur district, Kerala 680101",
    placeQuery: "Guruvayur Sri Krishna Temple Kerala",
    website: "https://guruvayurdevaswom.in",
    faqs: [
      {
        q: "What are the Guruvayur temple timings?",
        a: "Incredible India lists about 3:00 AM – 12:30 PM and 4:30 PM – 9:15 PM. Please confirm with Guruvayur Devaswom.",
      },
      {
        q: "What is Thulabharam?",
        a: "An offering in which a devotee gives the Lord goods such as rice, sugar or fruit equal to their own body weight.",
      },
      {
        q: "Is there a dress code or entry rule?",
        a: "The temple follows traditional dress and entry rules. Please check the current rules with Guruvayur Devaswom.",
      },
    ],
    sources: [
      "https://www.incredibleindia.gov.in/en/kerala/thrissur/guruvayur-sri-krishna-temple",
      "https://guruvayurdevaswom.in",
    ],
    check: [
      "Current darshan timings (other listings give 1:30 PM for the noon closing)",
      "Official website URL (guruvayurdevaswom.in returned 403 when checked)",
      "Dress code and entry rules (no valid source found; FAQ kept general)",
      "Narayaneeyam / Melpathur connection (no valid source found; left out)",
      "1970 fire and Krishnanattam (no valid source found; left out)",
      "Festival months",
      "Distances: Thrissur to Guruvayur (about 25–30 km), Kochi airport (about 80 km), Vizag (about 1,400 km)",
      "PIN code 680101",
    ],
  },

  // 3. Udupi
  {
    slug: "udupi-sri-krishna-matha",
    name: "Udupi Sri Krishna Matha",
    shortName: "Udupi Krishna",
    teluguName: "ఉడుపి శ్రీ కృష్ణ మఠం",
    deity: "Sri Krishna as Bala Krishna (the dancing Gopala of Madhvacharya)",
    form: "Krishna",
    town: "Udupi",
    state: "Karnataka",
    district: "Udupi",
    region: "Karnataka",
    summary:
      "The Krishna temple established by Sri Madhvacharya in Udupi, seen through the Navagraha window, where Sri Chaitanya Mahaprabhu danced in ecstasy.",
    history: [
      "The Chaitanya Charitamrita (Madhya-lila 9.245–249) records that Madhvacharya obtained a Deity of Krishna from a heap of gopi-chandana that had been carried in a boat, brought this dancing Gopala to Udupi and installed Him in the temple, where the Tattvavadi followers of Madhvacharya continue the worship. Karnataka Tourism dates the temple to the 13th century, around 1238 CE, and notes that Madhvacharya also established the eight Ashta Mathas. Under the Paryaya system, charge of the worship passes from one matha to the next every two years in a public ceremony.",
      "Devotees take darshan of Bala Krishna through the Navagraha Kindi, a silver-plated grille with nine openings. The Kanakana Kindi window at the back of the temple is linked, according to tradition, with the 16th-century poet-saint Kanakadasa.",
      "The same chapter of the Chaitanya Charitamrita describes Sri Chaitanya Mahaprabhu arriving at Udupi, becoming mad with ecstasy on seeing the Deity, and dancing and chanting before Him for a long time, after which He discussed devotional service with the Tattvavadi teachers.",
    ],
    highlights: [
      "Dancing Gopala Deity installed by Sri Madhvacharya",
      "Darshan through the nine-opening Navagraha Kindi",
      "Kanakana Kindi window linked with Kanakadasa",
      "Sri Chaitanya Mahaprabhu danced here (CC Madhya 9)",
      "Worship rotates among the Ashta Mathas every two years",
    ],
    festivals: [
      { name: "Sri Krishna Janmashtami", when: "August–September" },
      { name: "Paryaya (handover between mathas)", when: "Once every two years" },
      { name: "Makara Sankranti", when: "Mid-January" },
    ],
    timings: [
      { label: "Darshan (Karnataka Tourism listing)", time: "about 4:30 AM – 9:30 PM" },
    ],
    timingsNote:
      "Darshan is arranged around the matha's daily pujas, so short closures are common. " + CONFIRM_NOTE,
    fromVizag:
      "Udupi is roughly 1,300 km from Visakhapatnam. Most pilgrims fly to Mangaluru via Bengaluru or Hyderabad, or travel by train with a change for the Konkan line.",
    howToReach: {
      road: "Udupi is on the coastal highway north of Mangaluru, with frequent buses and taxis.",
      rail: "Udupi railway station is about 3 km from the temple.",
      air: "Mangaluru International Airport is about 60 km away, roughly a 90-minute drive.",
    },
    address: "Sri Krishna Matha, Car Street (Ratha Beedi), Udupi, Karnataka 576101",
    placeQuery: "Udupi Sri Krishna Matha Car Street Udupi",
    faqs: [
      {
        q: "What are the Udupi Sri Krishna Matha timings?",
        a: "Karnataka Tourism lists darshan from about 4:30 AM to 9:30 PM. Please confirm with the matha before you go.",
      },
      {
        q: "Why is darshan through a window?",
        a: "Devotees see Bala Krishna through the Navagraha Kindi, a silver-plated grille with nine openings.",
      },
      {
        q: "When is the quietest time for darshan?",
        a: "Karnataka Tourism suggests weekday mornings between about 5 and 7 AM.",
      },
    ],
    sources: [
      "https://karnatakatourism.org/tour-item/udupi-sri-krishna-temple/",
      "https://vedabase.io/en/library/cc/madhya/9/245/",
      "https://vedabase.io/en/library/cc/madhya/9/247/",
      "https://vedabase.io/en/library/cc/madhya/9/248/",
      "https://vedabase.io/en/library/cc/madhya/9/249/",
    ],
    check: [
      "Current darshan timings (other listings give 5:00 AM – 9:00 PM)",
      "Official matha website URL (website field not set)",
      "Dress code (reported elsewhere as introduced in 2026; no valid source found)",
      "Free prasadam meals (no valid source found; left out)",
      "Gaudiya link through the Madhva line (not yet sourced; left out)",
      "Festival months and next Paryaya date",
      "Distance from Vizag (about 1,300 km); PIN code 576101",
    ],
  },

  // 4. Padmanabhaswamy, Thiruvananthapuram
  {
    slug: "padmanabhaswamy-temple-thiruvananthapuram",
    name: "Sri Padmanabhaswamy Temple, Thiruvananthapuram",
    shortName: "Padmanabhaswamy",
    teluguName: "తిరువనంతపురం శ్రీ అనంత పద్మనాభ స్వామి ఆలయం",
    deity: "Sri Padmanabhaswamy, Lord Vishnu reclining on Adi Shesha",
    form: "Padmanabha",
    town: "Thiruvananthapuram",
    state: "Kerala",
    district: "Thiruvananthapuram",
    region: "Kerala",
    summary:
      "Lord Vishnu reclining on Adi Shesha in Kerala's capital, seen through three doors, and visited by Sri Chaitanya Mahaprabhu as Ananta Padmanabha.",
    history: [
      "The Lord here reclines on the serpent Adi Shesha in an image about 18 feet long, made of katu-sharkara. Because of its size, devotees see Him through three doors: the first shows His face and upper body, with a Shiva linga near His right hand and Sri Devi and Bhu Devi beside Him; the second shows Lord Brahma seated on the lotus rising from His navel; and the third shows His holy feet. Incredible India counts the temple among the 108 holy temples of Lord Vishnu.",
      "Maharaja Anizham Thirunal Marthanda Varma of Travancore carried out major renovations, rebuilt the main sanctum and replaced the old image with a new one made of 12,008 shalagrama stones and herbs. In 1750, in the Thrippadidanam ceremony, he dedicated his kingdom to the Lord, and the rulers of Travancore after him took the title Sree Padmanabha Dasa, servant of Padmanabha.",
      "The Chaitanya Charitamrita (Madhya-lila 9.241–242) records that Sri Chaitanya Mahaprabhu went to Ananta Padmanabha during His South India pilgrimage and stayed two or three days visiting the temple. Srila Prabhupada's purport to Madhya-lila 1.115 places this temple in Thiruvananthapuram.",
    ],
    highlights: [
      "Lord Vishnu reclining on Adi Shesha, seen through three doors",
      "One of the 108 holy temples of Lord Vishnu",
      "Image made of 12,008 shalagrama stones (katu-sharkara)",
      "Kingdom of Travancore dedicated to the Lord in 1750",
      "Visited by Sri Chaitanya Mahaprabhu (CC Madhya 9.241)",
    ],
    festivals: [
      { name: "Alpashy Utsavam", when: "Thulam month, October–November" },
      { name: "Painkuni Utsavam", when: "Meenam month, March–April" },
      { name: "Navaratri", when: "September–October" },
    ],
    timings: [
      { label: "Morning darshan (Incredible India listing)", time: "about 3:15 AM – 12:00 noon" },
      { label: "Evening darshan (Incredible India listing)", time: "about 5:00 PM – 7:20 PM" },
    ],
    timingsNote:
      "Darshan is given in slots with short closures for rituals. " + CONFIRM_NOTE,
    fromVizag:
      "Thiruvananthapuram is roughly 1,500 km from Visakhapatnam. Most pilgrims fly via Hyderabad, Bengaluru or Chennai, or travel by train with a change.",
    howToReach: {
      road: "The temple is in East Fort, in the centre of Thiruvananthapuram, close to the city bus stand.",
      rail: "Thiruvananthapuram Central is the nearest railway station.",
      air: "Thiruvananthapuram International Airport is the nearest airport.",
    },
    address: "Sri Padmanabhaswamy Temple, West Nada, East Fort, Thiruvananthapuram, Kerala 695023",
    placeQuery: "Sree Padmanabhaswamy Temple Thiruvananthapuram",
    website: "https://spst.in",
    faqs: [
      {
        q: "What are the Padmanabhaswamy temple timings?",
        a: "Incredible India lists about 3:15 AM – 12:00 noon and 5:00 PM – 7:20 PM. Please confirm with the temple.",
      },
      {
        q: "Why do devotees see the Lord through three doors?",
        a: "The reclining image is about 18 feet long, so His face, navel and feet are seen through three separate doors.",
      },
      {
        q: "Is there a dress code?",
        a: "The temple follows a strict traditional dress code. Please check the current rules with the temple before visiting.",
      },
    ],
    sources: [
      "https://www.incredibleindia.gov.in/en/kerala/thiruvananthapuram/sree-padmanabhaswamy-temple",
      "https://www.onmanorama.com/travel/kerala/2020/07/14/historical-facts-about-sree-padmanabhaswamy-temple-trivandrum.html",
      "https://vedabase.io/en/library/cc/madhya/9/241/",
      "https://vedabase.io/en/library/cc/madhya/1/115/",
      "https://spst.in",
    ],
    check: [
      "Current darshan timings (other listings start at 3:30 AM)",
      "Official website URL (spst.in) is current",
      "Dress code details (no valid source found; FAQ kept general)",
      "Incredible India dates Marthanda Varma's renovation to the 'mid-17th century'; he reigned in the 18th century, so the century was left out",
      "Divya Desam / Alvar hymns (not yet sourced; left out)",
      "2011 vault opening (not yet sourced; left out)",
      "Festival months; distances (airport about 6 km, Vizag about 1,500 km)",
      "PIN code 695023",
    ],
  },

  // 5. Badrinath
  {
    slug: "badrinath-temple",
    name: "Shri Badrinath Temple (Badrinarayan), Badrinath",
    shortName: "Badrinath",
    teluguName: "బదరీనాథ్ శ్రీ బదరీ నారాయణ ఆలయం",
    deity: "Sri Badrinarayan, Lord Vishnu seated in meditation",
    form: "Badrinarayan",
    town: "Badrinath",
    state: "Uttarakhand",
    district: "Chamoli",
    region: "Uttarakhand",
    summary:
      "Himalayan shrine of Lord Badrinarayan on the Alaknanda in Uttarakhand, open only from about April–May to November each year.",
    history: [
      "In the Srimad Bhagavatam (11.29), Lord Krishna sends His devotee Uddhava to His ashrama called Badarika, telling him to purify himself in its holy waters and to see the sacred Alakananda, and Uddhava goes there to perform austerities. The Badri-Kedar Temple Committee describes Badrinath as the place where Lord Vishnu, as Nara-Narayana, performed austerities for the welfare of the world.",
      "The Deity of Badrinarayan is a black stone image about one metre high, seated in meditation. According to the temple committee's account, Adi Shankaracharya recovered the Deity from the Alaknanda at Narada Kund and enshrined it, and a king of Garhwal later moved it to the present temple in the 16th century. The chief priest, the Rawal, comes from the Namboodiri Brahmins of Kerala. Pilgrims bathe in the Tapt Kund, a natural hot spring between the temple and the river, before darshan.",
      "The temple closes for winter. The committee notes that, according to tradition, a lamp is left burning when the doors close and is found still burning when they reopen, while the festival images of Uddhava and Kubera stay at the Yogadhyan Badri temple in Pandukeshwar.",
    ],
    highlights: [
      "Badarikashrama, where Uddhava was sent by Lord Krishna (SB 11.29)",
      "Black stone Deity of Lord Vishnu in meditation",
      "Tapt Kund hot spring between the temple and the Alaknanda",
      "Chief priest (Rawal) from the Namboodiri Brahmins of Kerala",
      "Open only from about April–May to November",
    ],
    festivals: [
      { name: "Opening of the temple doors", when: "April–May; date announced every year" },
      { name: "Closing of the temple doors", when: "Around November; date announced every year" },
    ],
    timings: [
      { label: "Abhishek puja (BKTC listing)", time: "about 4:00 AM – 6:30 AM" },
      { label: "Evening aarti, summer (BKTC listing)", time: "about 6:00 PM – 8:30 PM" },
      { label: "Season", time: "about April–May to November only" },
    ],
    timingsNote:
      "Badrinath is closed in winter. Opening and closing dates change every year and are announced by the Badri-Kedar Temple Committee; Char Dham pilgrims must also register on the Uttarakhand government portal. " +
      CONFIRM_NOTE,
    fromVizag:
      "Badrinath is roughly 2,200 km from Visakhapatnam. Most pilgrims travel to Delhi, Haridwar, Rishikesh or Dehradun and continue about 300 km by mountain road.",
    howToReach: {
      road: "Badrinath is reached by mountain road from Rishikesh via Joshimath; landslides can disrupt the route in the monsoon.",
      rail: "Rishikesh and Haridwar are the nearest major railheads.",
      air: "Jolly Grant Airport, Dehradun, is the nearest airport.",
    },
    address: "Shri Badrinath Temple, Badrinath, Chamoli district, Uttarakhand 246422",
    placeQuery: "Badrinath Temple Uttarakhand",
    website: "https://badrinath-kedarnath.gov.in",
    faqs: [
      {
        q: "When is Badrinath temple open?",
        a: "From about April–May to November. Exact dates change every year; check the Badri-Kedar Temple Committee announcement.",
      },
      {
        q: "Do I need to register for the yatra?",
        a: "Yes. The temple committee directs Char Dham pilgrims to the Uttarakhand registration portal, registrationandtouristcare.uk.gov.in.",
      },
      {
        q: "Where is the Lord worshipped in winter?",
        a: "The temple committee says the festival images of Uddhava and Kubera stay at Yogadhyan Badri, Pandukeshwar.",
      },
    ],
    sources: [
      "https://badrinath-kedarnath.gov.in/AboutUs/shri-badrinath.aspx",
      "https://badrinath-kedarnath.gov.in",
      "https://vedabase.io/en/library/sb/11/29/",
    ],
    check: [
      "Opening and closing dates for the coming season",
      "Daily darshan hours (BKTC page lists only puja and aarti times)",
      "Whether to add 'one of the four dhamas' (not yet sourced)",
      "Winter worship at Joshimath (BKTC page names only Pandukeshwar)",
      "Vyasa Gufa / Mana village (not yet sourced; left out)",
      "Distances: Rishikesh about 295 km, Dehradun airport about 310 km, Vizag about 2,200 km",
      "PIN code 246422",
    ],
  },

  // 6. ISKCON Mayapur
  {
    slug: "iskcon-mayapur-chandrodaya-mandir",
    name: "ISKCON Mayapur, Sri Mayapur Chandrodaya Mandir",
    shortName: "ISKCON Mayapur",
    teluguName: "ఇస్కాన్ మాయాపూర్ శ్రీ మాయాపూర్ చంద్రోదయ మందిరం",
    deity: "Sri Sri Radha Madhava with the Ashta-sakhis, Sri Pancha-tattva and Sri Prahlada-Nrsimhadeva",
    form: "Radha Madhava",
    town: "Mayapur",
    state: "West Bengal",
    district: "Nadia",
    region: "West Bengal",
    summary:
      "ISKCON's temple in Sri Mayapur Dham, Navadvipa, the land of Sri Chaitanya Mahaprabhu's appearance, home of Sri Sri Radha Madhava and the TOVP.",
    history: [
      "The Chaitanya Charitamrita (Adi-lila, chapter 13) describes how Sri Chaitanya Mahaprabhu appeared in Navadvipa on the full-moon evening of Phalguna in 1486. Gaudiya Vaishnavas honour Sri Mayapur, in Navadvipa, as the place of His birth.",
      "Srila Prabhupada wanted a temple in Mayapur, following the wish of his spiritual master, Srila Bhaktisiddhanta Sarasvati Thakura. In 1971 ISKCON secured a nine-hectare plot of land there, and in 1972 Srila Prabhupada established the Sri Mayapur Chandrodaya Mandir project. The large Deities of Sri Sri Radha Madhava were installed in 1980; four of the eight principal sakhis joined Them in 1986 and the other four in 1992. Sri Sri Pancha-tattva and Sri Sri Prahlada-Nrsimhadeva are also worshipped here.",
      "Beside the temple rises the Temple of the Vedic Planetarium (TOVP), a large new temple being built by ISKCON in Mayapur.",
    ],
    highlights: [
      "In Navadvipa, the land of Sri Chaitanya Mahaprabhu's appearance",
      "Project established by Srila Prabhupada in 1972",
      "Sri Sri Radha Madhava installed in 1980, with the Ashta-sakhis",
      "Sri Sri Pancha-tattva and Sri Sri Prahlada-Nrsimhadeva",
      "Temple of the Vedic Planetarium beside the temple",
    ],
    festivals: [
      { name: "Gaura Purnima (appearance of Sri Chaitanya Mahaprabhu)", when: "Phalguna Purnima, February–March" },
      { name: "Navadvipa Mandala Parikrama", when: "Before Gaura Purnima" },
      { name: "Sri Krishna Janmashtami", when: "August–September" },
    ],
    timings: [
      { label: "Mangala arati", time: "4:30 AM" },
      { label: "Darshan arati", time: "7:00 AM" },
      { label: "Rajabhoga arati; temple closes", time: "11:45 AM; 1:00 PM" },
      { label: "Dhoop arati; Sandhya arati", time: "4:00 PM; 6:30 PM" },
      { label: "Shayan arati; temple closes", time: "8:15 PM; 8:30 PM" },
    ],
    timingsNote:
      "Schedule as published on the ISKCON Mayapur website; it can change on festival days, so please check before you travel.",
    fromVizag:
      "Mayapur is roughly 1,000 km from Visakhapatnam. Take a train or flight to Kolkata, then continue about 130 km north by road or local train.",
    howToReach: {
      road: "Mayapur is reached by road from Kolkata via Krishnanagar.",
      rail: "Local trains from Kolkata run to Krishnanagar and Nabadwip Dham, the nearest stations.",
      air: "Netaji Subhas Chandra Bose International Airport, Kolkata, is the nearest airport.",
    },
    address: "ISKCON Sri Mayapur Chandrodaya Mandir, Sri Mayapur Dham, Nadia district, West Bengal 741313",
    placeQuery: "ISKCON Mayapur Chandrodaya Mandir",
    website: "https://www.mayapur.com",
    faqs: [
      {
        q: "What are the ISKCON Mayapur temple timings?",
        a: "Mangala arati is at 4:30 AM; the temple closes 1:00–4:00 PM and closes for the night at 8:30 PM.",
      },
      {
        q: "Who are the main Deities at Mayapur?",
        a: "Sri Sri Radha Madhava with the eight sakhis, Sri Sri Pancha-tattva and Sri Sri Prahlada-Nrsimhadeva.",
      },
      {
        q: "When is the best time to visit?",
        a: "Gaura Purnima, Mahaprabhu's appearance day in February–March, is the main festival; book stays early.",
      },
    ],
    sources: [
      "https://www.mayapur.com",
      "https://www.mayapur.com/visit/information",
      "https://www.mayapur.com/community/deitiesrm",
      "https://vedabase.io/en/library/cc/adi/13/",
    ],
    check: [
      "Current arati schedule (mayapur.com)",
      "TOVP opening status (tovp.org returned 403; no status given)",
      "Bhaktivinoda Thakura's identification of the birthplace and its year (not yet sourced; left out)",
      "Installation years of Pancha-tattva and Prahlada-Nrsimhadeva (not stated on site)",
      "Guest house and parikrama details",
      "Distances: Kolkata about 130 km, Vizag about 1,000 km",
      "PIN code 741313",
    ],
  },

  // 7. Prem Mandir, Vrindavan
  {
    slug: "prem-mandir-vrindavan",
    name: "Prem Mandir, Vrindavan",
    shortName: "Prem Mandir",
    teluguName: "బృందావనం ప్రేమ మందిరం",
    deity: "Sri Radha Krishna",
    form: "Radha Krishna",
    town: "Vrindavan",
    state: "Uttar Pradesh",
    district: "Mathura",
    region: "Uttar Pradesh",
    summary:
      "A white marble temple of Sri Radha Krishna in Vrindavan, inaugurated in 2012 by Jagadguru Kripalu Maharaj and known for its evening light show.",
    history: [
      "Prem Mandir, the 'Temple of Love', is one of the newest large temples of Vrindavan. It was inaugurated in February 2012 by the spiritual teacher Jagadguru Kripalu Maharaj. The temple is built of pure white marble, and marble Deities of Sri Radha and Krishna are worshipped in the central shrine.",
      "At sundown a sound and light show presents the pastimes of Lord Krishna, and the temple is a popular stop for pilgrims visiting the many temples of Vrindavan.",
    ],
    highlights: [
      "White marble temple inaugurated in February 2012",
      "Marble Deities of Sri Radha Krishna in the central shrine",
      "Sound and light show on Krishna's pastimes at sundown",
      "Nearest railway station: Mathura Junction",
    ],
    festivals: [
      { name: "Sri Krishna Janmashtami", when: "August–September" },
      { name: "Radhashtami", when: "August–September" },
      { name: "Holi", when: "February–March" },
    ],
    timings: [
      { label: "Morning aarti (Incredible India listing)", time: "about 5:30 AM" },
      { label: "Morning darshan (Incredible India listing)", time: "about 8:30 AM – 12:00 noon" },
      { label: "Evening darshan (Incredible India listing)", time: "about 4:30 PM – 8:30 PM" },
    ],
    timingsNote: CONFIRM_NOTE,
    fromVizag:
      "Vrindavan is roughly 1,700 km from Visakhapatnam by rail. Take a train to Mathura Junction, or fly to Delhi or Agra, and continue by road.",
    howToReach: {
      road: "Vrindavan is reached by road from Mathura, Agra and Delhi.",
      rail: "Mathura Junction is the nearest railway station.",
      air: "Agra airport and Delhi's Indira Gandhi International Airport are the nearest airports.",
    },
    address: "Prem Mandir, Vrindavan, Mathura district, Uttar Pradesh 281121",
    placeQuery: "Prem Mandir Vrindavan",
    faqs: [
      {
        q: "What are the Prem Mandir timings?",
        a: "Incredible India lists about 8:30 AM – 12:00 noon and 4:30 PM – 8:30 PM, with morning aarti at 5:30 AM.",
      },
      {
        q: "When is the light show?",
        a: "The sound and light show is held at sundown. Please confirm the day's schedule at the temple.",
      },
      {
        q: "Who built Prem Mandir?",
        a: "It was inaugurated in February 2012 by Jagadguru Kripalu Maharaj.",
      },
    ],
    sources: [
      "https://www.incredibleindia.gov.in/en/uttar-pradesh/mathura/prem-mandir",
    ],
    check: [
      "Current darshan and light show timings",
      "Official website for Prem Mandir / Jagadguru Kripalu Parishat (website field not set)",
      "Foundation stone date (14 January 2001) and Italian marble (not from a valid source; left out)",
      "Whether Sita Rama are also worshipped (not from a valid source; left out)",
      "Entry fee and phone rules",
      "Exact street address; distances (Mathura about 12 km, Vizag about 1,700 km by rail)",
      "PIN code 281121",
    ],
  },

  // 8. Radha Raman, Vrindavan
  {
    slug: "radha-raman-temple-vrindavan",
    name: "Sri Radha Raman Temple, Vrindavan",
    shortName: "Radha Raman",
    teluguName: "బృందావనం శ్రీ రాధా రమణ ఆలయం",
    deity: "Sri Radha Raman (Radharamana), Lord Krishna",
    form: "Radha Raman",
    town: "Vrindavan",
    state: "Uttar Pradesh",
    district: "Mathura",
    region: "Uttar Pradesh",
    summary:
      "One of the seven principal Deities of Vrindavan, installed by Sri Gopala Bhatta Goswami, who served Sri Chaitanya Mahaprabhu at Srirangam.",
    history: [
      "Sri Gopala Bhatta Goswami was the son of Venkata Bhatta of Srirangam. Srila Prabhupada's purport to Chaitanya Charitamrita Adi-lila 10.105 explains that in 1511, during His South India tour, Sri Chaitanya Mahaprabhu stayed four months at Venkata Bhatta's house for Chaturmasya, and the young Gopala Bhatta was able to serve Him. Gopala Bhatta later went to Vrindavan, where Mahaprabhu asked Rupa and Sanatana Goswami to care for him as a younger brother. Sanatana Goswami compiled the Hari Bhakti Vilasa and published it under Gopala Bhatta's name, and Gopala Bhatta edited it.",
      "Under the instruction of Rupa and Sanatana, Gopala Bhatta Goswami installed the Radharamana Deity, one of the seven principal Deities of Vrindavan, and the temple's priests belong to the Gaudiya sampradaya. According to temple tradition, the Lord manifested from one of Gopala Bhatta's shalagrama stones; Incredible India gives the installation as a full-moon day in 1542 (April–May).",
    ],
    highlights: [
      "One of the seven principal Deities of Vrindavan",
      "Installed by Sri Gopala Bhatta Goswami",
      "Gopala Bhatta served Mahaprabhu at Srirangam in 1511",
      "Priests belong to the Gaudiya sampradaya",
      "Installed on a full-moon day in 1542 (April–May)",
    ],
    festivals: [
      { name: "Appearance of Sri Radha Raman", when: "Vaisakha Purnima, April–May" },
      { name: "Sri Krishna Janmashtami", when: "August–September" },
    ],
    timings: [
      { label: "Darshan", time: "Morning and evening sessions; please confirm current timings with the temple" },
    ],
    timingsNote:
      "No official timetable was found for Radha Raman temple, and summer and winter schedules differ. " + CONFIRM_NOTE,
    fromVizag:
      "Vrindavan is roughly 1,700 km from Visakhapatnam by rail. Take a train to Mathura Junction, or fly to Delhi or Agra, and continue by road.",
    howToReach: {
      road: "Vrindavan is reached by road from Mathura; the temple is in the old town, best reached by e-rickshaw or on foot.",
      rail: "Mathura Junction is the nearest major railway station.",
      air: "Agra airport and Delhi's Indira Gandhi International Airport are the nearest airports.",
    },
    address: "Sri Radha Raman Temple, Vrindavan, Mathura district, Uttar Pradesh 281121",
    placeQuery: "Shri Radha Raman Temple Vrindavan",
    faqs: [
      {
        q: "Who was Gopala Bhatta Goswami?",
        a: "The son of Venkata Bhatta of Srirangam, who served Sri Chaitanya Mahaprabhu as a boy and later lived in Vrindavan.",
      },
      {
        q: "When was Sri Radha Raman installed?",
        a: "Incredible India gives a full-moon day in 1542 (April–May); the appearance is celebrated on Vaisakha Purnima.",
      },
      {
        q: "What are the Radha Raman temple timings?",
        a: "The temple opens in morning and evening sessions that change by season. Please confirm current timings locally.",
      },
    ],
    sources: [
      "https://vedabase.io/en/library/cc/adi/10/105/",
      "https://www.incredibleindia.org/content/incredible-india-v2/en/destinations/mathura-vrindavan/radha-raman-temple.html",
    ],
    check: [
      "Darshan timings (no official or news source found)",
      "Official temple website (website field not set)",
      "Shalagrama manifestation account and appearance date (Incredible India: full moon, 1542)",
      "Absence of a separate Radha Deity / crown tradition (not yet sourced; left out)",
      "Gopala Bhatta Goswami's samadhi in the temple grounds (not yet sourced; left out)",
      "Present building date (some say 1826; not yet sourced; left out)",
      "Exact locality and PIN code 281121",
    ],
  },

  // 9. Krishna Janmabhoomi, Mathura
  {
    slug: "krishna-janmabhoomi-mathura",
    name: "Shri Krishna Janmabhoomi (Janmasthan), Mathura",
    shortName: "Krishna Janmabhoomi",
    teluguName: "మథుర శ్రీ కృష్ణ జన్మభూమి",
    deity: "Lord Krishna, with Sri Radha",
    form: "Krishna",
    town: "Mathura",
    state: "Uttar Pradesh",
    district: "Mathura",
    region: "Uttar Pradesh",
    summary:
      "Mathura's main pilgrimage site, built around the place devotees honour as the prison cell where Lord Krishna appeared to Vasudeva and Devaki.",
    history: [
      "The Srimad Bhagavatam (Tenth Canto, chapter 3) describes how Lord Krishna appeared in Mathura to Vasudeva and Devaki while they were held in prison by King Kamsa, and how Vasudeva carried the newborn Lord that same night to Gokula.",
      "The Shri Krishna Janmabhoomi temple complex is Mathura's main pilgrimage site and is built around the place devotees believe to be the prison cell of the Lord's birth. Inside are paintings of Krishna's pastimes and Deities of Krishna and Radha, and the complex also has shrines of Goddess Durga and a Shiva linga, along with a library, an Ayurveda Bhavan and a guest house. On Janmashtami, devotees gather here for prayers that reach their peak at midnight, the hour of the Lord's appearance.",
    ],
    highlights: [
      "Built around the place honoured as Krishna's birthplace",
      "Paintings of Krishna's pastimes and Deities of Radha Krishna",
      "Janmashtami prayers peak at midnight",
      "Starting point for a pilgrimage through Mathura and Vraja",
    ],
    festivals: [
      { name: "Sri Krishna Janmashtami", when: "Bhadrapada Krishna Ashtami, August–September" },
      { name: "Holi", when: "February–March" },
    ],
    timings: [
      { label: "Darshan", time: "Morning and evening sessions; please confirm current timings with the temple" },
    ],
    timingsNote:
      "No official timetable was found; summer and winter timings differ. " + CONFIRM_NOTE,
    fromVizag:
      "Mathura is roughly 1,700 km from Visakhapatnam by rail. Long-distance trains reach Mathura Junction, or fly to Delhi or Agra and continue by road.",
    howToReach: {
      road: "Mathura lies on the Delhi–Agra highway, with buses and taxis from both cities.",
      rail: "Mathura Junction is the nearest railway station, a short drive from the temple.",
      air: "Agra airport and Delhi's Indira Gandhi International Airport are the nearest airports.",
    },
    address: "Shri Krishna Janmasthan, Mathura, Uttar Pradesh 281001",
    placeQuery: "Shri Krishna Janmasthan Temple Mathura",
    faqs: [
      {
        q: "What is inside the Krishna Janmabhoomi complex?",
        a: "The shrine at the birthplace, Deities of Radha Krishna, paintings of Krishna's pastimes, a Durga shrine and a Shiva linga.",
      },
      {
        q: "What are the Krishna Janmabhoomi timings?",
        a: "Timings change between summer and winter. Please confirm current timings with the temple before you go.",
      },
      {
        q: "Is there a guest house?",
        a: "Yes, Incredible India lists a guest house within the complex.",
      },
    ],
    sources: [
      "https://vedabase.io/en/library/sb/10/3/",
      "https://prod.incredibleindia.gov.in/content/incredible-india-v2/en/destinations/mathura-vrindavan/shri-krishna-janmabhoomi-temple.html",
      "https://www.incredibleindia.gov.in/en/festivals-and-events/uttar-pradesh/krishnotsav-2026",
    ],
    check: [
      "Darshan timings (no official or news source found)",
      "Official trust website (website field not set)",
      "Names of the shrines (Garbha Griha, Keshav Dev, Bhagavat Bhavan) (not yet sourced; left out)",
      "History of the site and the 20th-century trust (not yet sourced; left out)",
      "Current security rules on phones and bags",
      "Distances: Mathura Junction about 3 km, Vizag about 1,700 km by rail",
      "PIN code 281001",
    ],
  },

  // 10. Shrinathji, Nathdwara
  {
    slug: "shrinathji-temple-nathdwara",
    name: "Shrinathji Temple, Nathdwara",
    shortName: "Shrinathji",
    teluguName: "నాథద్వారా శ్రీనాథ్‌జీ ఆలయం",
    deity: "Sri Shrinathji (Sri Gopala), Lord Krishna as the lifter of Govardhana",
    form: "Shrinathji",
    town: "Nathdwara",
    state: "Rajasthan",
    district: "Rajsamand",
    region: "Rajasthan",
    summary:
      "Nathdwara's temple of Shrinathji, the Gopala Deity that Madhavendra Puri uncovered on Govardhana Hill, as told in the Chaitanya Charitamrita.",
    history: [
      "The Chaitanya Charitamrita (Madhya-lila, chapter 4) tells how Sri Madhavendra Puri, in a dream on Govardhana Hill, was shown a bush by a boy who said that He lived there and suffered from the cold. The boy said His name was Gopala, the lifter of Govardhana Hill. The next day the villagers cleared the jungle, found the Deity covered with dirt and grass, and installed Him on a stone throne on top of the hill.",
      "In his purport to Madhya-lila 4.1, Srila Prabhupada writes that, according to Bhaktivinoda Thakura, this Gopala Deity was originally installed by Vajra, the great-grandson of Krishna, and that the same Gopala is now at Nathdwara, under the care of the descendants of Vallabhacharya. Madhavendra Puri is the guru of Ishvara Puri, Sri Chaitanya Mahaprabhu's spiritual master, so for Gaudiya Vaishnavas a visit to Shrinathji is a visit to the Deity of their own line's great devotee.",
    ],
    highlights: [
      "Gopala Deity uncovered by Madhavendra Puri (CC Madhya 4)",
      "Lord Krishna as the lifter of Govardhana Hill",
      "Served by descendants of Vallabhacharya",
      "Madhavendra Puri is the guru of Mahaprabhu's guru",
    ],
    festivals: [
      { name: "Annakut", when: "Day after Diwali, October–November" },
      { name: "Sri Krishna Janmashtami", when: "August–September" },
      { name: "Holi", when: "February–March" },
    ],
    timings: [
      { label: "Darshan", time: "Several short darshans through the day; please confirm current timings with the temple" },
    ],
    timingsNote:
      "Darshan at Nathdwara is given in short sessions that change with the seasons and festivals; please check the temple board's daily schedule. " +
      CONFIRM_NOTE,
    fromVizag:
      "Nathdwara is roughly 1,800 km from Visakhapatnam. Most pilgrims fly to Udaipur via a connecting city and continue by road.",
    howToReach: {
      road: "Nathdwara is north of Udaipur, with buses and taxis from the city.",
      rail: "Udaipur City is the main railway station for Nathdwara.",
      air: "Maharana Pratap Airport, Udaipur, is the nearest airport.",
    },
    address: "Shrinathji Temple, Nathdwara, Rajsamand district, Rajasthan 313301",
    placeQuery: "Shrinathji Temple Nathdwara",
    website: "https://www.nathdwaratemple.org",
    faqs: [
      {
        q: "How is Shrinathji connected to Sri Chaitanya Mahaprabhu?",
        a: "Shrinathji is the Gopala Deity of Madhavendra Puri, the guru of Ishvara Puri, who was Mahaprabhu's spiritual master.",
      },
      {
        q: "What are the Shrinathji darshan timings?",
        a: "Darshans are short and change daily. Please check the temple board's schedule before you go.",
      },
      {
        q: "What is the nearest airport?",
        a: "Maharana Pratap Airport in Udaipur.",
      },
    ],
    sources: [
      "https://vedabase.io/en/library/cc/madhya/4/",
      "https://vedabase.io/en/library/cc/madhya/4/1/",
      "https://vedabase.io/en/library/cc/adi/9/11/",
      "https://www.nathdwaratemple.org",
    ],
    check: [
      "Darshan schedule and the eight darshans (official site content could not be read)",
      "Official website URL (nathdwaratemple.org) is current",
      "Move of the Deity to Mewar and the 1672 date (not yet sourced; left out)",
      "Pichhwai paintings and Pushti Marga wording (not yet sourced; left out)",
      "Distances: Udaipur about 50 km, Vizag about 1,800 km",
      "PIN code 313301",
    ],
  },

  // 11. Ram Mandir, Ayodhya
  {
    slug: "ram-mandir-ayodhya",
    name: "Shri Ram Janmabhoomi Mandir, Ayodhya",
    shortName: "Ram Mandir Ayodhya",
    teluguName: "అయోధ్య శ్రీ రామ జన్మభూమి మందిరం",
    deity: "Sri Ram Lalla, Lord Rama as a five-year-old child",
    form: "Rama",
    town: "Ayodhya",
    state: "Uttar Pradesh",
    district: "Ayodhya",
    region: "Uttar Pradesh",
    summary:
      "The temple at Lord Rama's birthplace in Ayodhya, consecrated on 22 January 2024, where He is worshipped as Ram Lalla, a five-year-old child.",
    history: [
      "The Srimad Bhagavatam (Ninth Canto, chapter 10) describes how Lord Ramachandra appeared as the son of King Dasharatha and ruled from Ayodhya after returning from the forest.",
      "In November 2019 the Supreme Court of India ruled that the site be handed to a trust to be formed for building a temple to Lord Rama. The Pran Pratishtha, the consecration of the main Deity, took place on 22 January 2024. The temple is built in the Nagara style of North Indian temple architecture, designed by the architect Chandrakant Sompura with his family. The Deity of Ram Lalla, about 51 inches tall and carved from black stone by the Mysuru sculptor Arun Yogiraj, shows the Lord standing as a five-year-old child. A Ram Darbar on the first floor was opened to devotees in June 2025.",
    ],
    highlights: [
      "Pran Pratishtha on 22 January 2024",
      "Lord Rama worshipped as Ram Lalla, a five-year-old child",
      "Black stone Deity carved by Arun Yogiraj of Mysuru",
      "Nagara-style temple designed by Chandrakant Sompura",
      "Free darshan passes through the Trust's official portal",
    ],
    festivals: [
      { name: "Sri Rama Navami", when: "Chaitra Shukla Navami, March–April" },
      { name: "Deepotsav (Diwali)", when: "October–November" },
      { name: "Vivah Panchami", when: "November–December" },
    ],
    timings: [
      { label: "Mangala aarti", time: "4:30 AM" },
      { label: "Shringar aarti; general darshan begins", time: "6:30 AM; 7:00 AM" },
      { label: "Raj Bhog aarti; rest period", time: "12:00 noon; 12:30 PM – 1:30 PM" },
      { label: "Sandhya aarti", time: "7:00 PM" },
      { label: "Shayan aarti; doors close", time: "9:30 PM; 10:00 PM" },
    ],
    timingsNote:
      "Schedule effective from 1 November 2026 as reported by The Hans India; darshan pauses briefly for bhog. The Trust revises timings by season, so please check its official notices before you travel.",
    fromVizag:
      "Ayodhya is roughly 1,200–1,300 km from Visakhapatnam. Pilgrims usually take a train via Varanasi or Lucknow, or fly to Ayodhya or Lucknow via a connecting city.",
    howToReach: {
      road: "Ayodhya is connected by road to Lucknow and Varanasi, with buses and taxis.",
      rail: "Ayodhya Dham Junction is the nearest railway station.",
      air: "Maharishi Valmiki International Airport, Ayodhya, is the nearest airport; Lucknow is another option.",
    },
    address: "Shri Ram Janmabhoomi Mandir, Ram Kot, Ayodhya, Uttar Pradesh 224123",
    placeQuery: "Shri Ram Janmabhoomi Mandir Ayodhya",
    website: "https://srjbtkshetra.org",
    faqs: [
      {
        q: "What are the Ram Mandir darshan timings?",
        a: "From 1 November 2026: doors open around 4 AM for Mangala aarti, general darshan from 7 AM, doors close at 10 PM.",
      },
      {
        q: "Do I need a pass for darshan?",
        a: "Passes are free and are issued only through the Trust's official booking portal, online.srjbtkshetra.org.",
      },
      {
        q: "Who carved the Ram Lalla Deity?",
        a: "Mysuru sculptor Arun Yogiraj carved the 51-inch black stone Deity, chosen from three carved for the temple.",
      },
    ],
    sources: [
      "https://www.thehansindia.com/uttarpradesh/ayodhya-ram-temple-revises-darshan-timings-from-november-1-1135895",
      "https://www.outlookindia.com/national/ram-lalla-idol-ram-mandir-consecration-ayodhya-gold-flowers-51-inch-idol-arun-yogiraj-news-344721",
      "https://www.onmanorama.com/web-stories/news/2024/01/22/ram-temple-ayodhya-nagara-style-construction-architecture.html",
      "https://www.tribuneindia.com/news/archive/nation/temple-to-come-up-at-disputed-ayodhya-site-alternative-land-for-mosque-says-sc-858566",
      "https://www.indiatvnews.com/uttar-pradesh/ram-darbar-at-ayodhya-s-ram-mandir-opens-for-devotees-check-timings-pass-details-2025-06-14-994664",
      "https://vedabase.io/en/library/sb/9/10/",
    ],
    check: [
      "Current timings after the November 2026 revision (confirm on the Trust's X account / website)",
      "Whether general darshan is open between Mangala aarti and 7 AM",
      "Official website and booking portal URLs (srjbtkshetra.org, online.srjbtkshetra.org)",
      "Wording of the Supreme Court sentence for sensitivity",
      "Bhoomi pujan (5 August 2020) and trust formation (not yet sourced; left out)",
      "Ram Darbar opening (June 2025, India TV report)",
      "Distances: airport, Lucknow (about 135 km), Vizag (about 1,200–1,300 km)",
      "PIN code 224123",
    ],
  },
];
