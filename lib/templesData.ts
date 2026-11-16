// Vaishnava temples of Andhra Pradesh: pilgrimage guide content.
// Original writing for ISKCON Gambheeram Visakhapatnam (Hare Krishna Movement, Vizag).
// Every entry carries a `check` list of facts the temple team must verify before publishing.
// Timings in particular are taken from commonly published listings and change often.

export type TempleRegion = "North Coastal Andhra" | "Godavari Districts" | "Krishna & Guntur" | "Rayalaseema" | (string & {});

export type Temple = {
  slug: string;
  name: string;
  shortName: string;
  teluguName: string;
  deity: string;
  form: string;
  town: string;
  state: string;             // e.g. "Andhra Pradesh" (the guide covers temples across India)
  district: string;
  region: TempleRegion;
  summary: string;
  history: string[];
  highlights: string[];
  festivals: { name: string; when: string }[];
  timings: { label: string; time: string }[];
  timingsNote: string;
  fromVizag: string;
  howToReach: { road: string; rail: string; air: string };
  address: string;
  placeQuery: string;
  website?: string;
  faqs: { q: string; a: string }[];
  /** Optional long-form sections (detailed story pages): e.g. History in detail, Architecture, Daily worship, Visitor guide. */
  sections?: { heading: string; body: string[] }[];
  sources: string[];
  check: string[];
};

const STANDARD_NOTE =
  "Timings change on festival days, eclipses and special occasions; please confirm with the devasthanam before you travel.";

const TEMPLES_AP: Temple[] = [
  // 1. Simhachalam
  {
    slug: "simhachalam-varaha-lakshmi-narasimha-temple",
    name: "Simhachalam Sri Varaha Lakshmi Narasimha Swamy Temple",
    shortName: "Simhachalam",
    teluguName: "సింహాచలం శ్రీ వరాహ లక్ష్మీ నృసింహ స్వామి దేవస్థానం",
    deity: "Sri Varaha Lakshmi Narasimha Swamy",
    form: "Narasimha",
    town: "Simhachalam, Visakhapatnam",
    state: "Andhra Pradesh",
    district: "Visakhapatnam",
    region: "North Coastal Andhra",
    summary:
      "Hilltop shrine of Sri Varaha Lakshmi Narasimha in Visakhapatnam, where the Lord stays covered in sandal paste except on Chandanotsavam day.",
    history: [
      "Simhachalam, a name that means the hill of the lion, is a range of hills about 16 km from Visakhapatnam. On it stands the temple of Sri Varaha Lakshmi Narasimha Swamy, where Lord Vishnu is worshipped in His Varaha Narasimha form. Devotees across north coastal Andhra call Him Simhadri Appanna.",
      "For almost the whole year the Deity is kept covered in sandalwood paste. Only on Chandanotsavam, which falls on Vaisakha Shuddha Tadiya (Akshaya Tritiya), is the paste removed so that pilgrims can see the Lord's original form (nija rupa darshan). According to temple tradition, the Deity is then covered again with about twelve manugus of fresh sandal paste.",
      "The temple is built of dark granite and is richly carved; it faces west and has a stone chariot with stone wheels and horses. Its inscriptions include records of the Chola king Kulottunga I (1098–99 CE), the Velanadu chief Gonka III (1137–56 CE) and the Eastern Ganga king Narasimha I, who built parts of the central shrine. The Kappa Stambham pillar is believed by devotees to have healing powers.",
      "The Chaitanya Charitamrita records that Sri Chaitanya Mahaprabhu visited this Deity, called there Jiyada Nrsimha, during His South India tour; seeing the Lord, He offered obeisances, then danced, sang and offered prayers in ecstatic love.",
    ],
    highlights: [
      "Lord worshipped in His Varaha Narasimha form",
      "Nija rupa darshan only once a year, on Chandanotsavam",
      "Visited by Sri Chaitanya Mahaprabhu (Jiyada Nrsimha)",
      "Granite temple with inscriptions from the 11th century onwards",
      "About 16 km from Visakhapatnam",
    ],
    festivals: [
      { name: "Chandanotsavam (nija rupa darshan)", when: "Vaisakha Shuddha Tadiya (Akshaya Tritiya), April–May" },
      { name: "Kalyanam", when: "March–April" },
      { name: "Giri Pradakshina (32 km walk around the hill)", when: "Ashadha Purnima, June–July" },
    ],
    timings: [
      { label: "Darshan (as listed by Incredible India)", time: "7:00 AM – 4:00 PM and 6:00 PM – 9:00 PM" },
    ],
    timingsNote:
      "Timings change on Chandanotsavam and other festival days. Please confirm current timings with the temple before you travel.",
    fromVizag:
      "Simhachalam is within Visakhapatnam, about 16 km from the city, and is connected by both road and rail.",
    howToReach: {
      road: "Simhachalam is connected to Visakhapatnam city by road.",
      rail: "Visakhapatnam railway station is the nearest major station; Simhachalam is also connected by rail.",
      air: "Visakhapatnam International Airport is the nearest airport.",
    },
    address: "Sri Varaha Lakshmi Narasimha Swamy Devasthanam, Simhachalam, Visakhapatnam, Andhra Pradesh",
    placeQuery: "Sri Varaha Lakshmi Narasimha Swamy Temple Simhachalam Visakhapatnam",
    faqs: [
      {
        q: "When can I see the original form of Simhachalam Narasimha Swamy?",
        a: "Only on Chandanotsavam day, Vaisakha Shuddha Tadiya (Akshaya Tritiya), in April or May. On all other days the Lord is covered in sandal paste.",
      },
      {
        q: "When is the Simhachalam Giri Pradakshina?",
        a: "It is held on Ashadha Purnima (June–July), when devotees walk about 32 km around Simhachalam hill.",
      },
      {
        q: "What are the darshan timings?",
        a: "Incredible India lists 7:00 AM – 4:00 PM and 6:00 PM – 9:00 PM. Timings change on festival days, so please confirm with the temple before you travel.",
      },
    ],
    sources: [
      "https://visakhapatnam.ap.gov.in/?p=2809",
      "https://www.incredibleindia.gov.in/en/andhra-pradesh/visakhapatnam/varaha-lakshmi-narasimha-temple",
      "https://www.deccanchronicle.com/southern-states/andhra-pradesh/thousands-witness-lord-simhadri-appannas-annual-darshan-1876107",
      "https://www.deccanchronicle.com/southern-states/andhra-pradesh/thousands-participate-as-simhachalam-giri-pradakshina-begins-1890513",
      "https://vedabase.io/en/library/cc/madhya/8/3/",
      "https://vedabase.io/en/library/cc/madhya/8/4/",
    ],
    check: [
      "Current daily darshan timings (Incredible India lists 7 AM–4 PM / 6–9 PM; news reports show changes over time)",
      "Official devasthanam website URL (not included)",
      "Exact month of the Kalyanam (district portal says March–April)",
      "Dress code and accommodation on the hill (removed, no valid source)",
      "Prahlada legend of the combined Varaha-Narasimha form (removed, no valid source)",
      "PIN code (removed; 530028 unverified)",
    ],
  },

  // 2. Tirumala
  {
    slug: "tirumala-sri-venkateswara-swamy-temple",
    name: "Tirumala Sri Venkateswara Swamy Temple",
    shortName: "Tirumala",
    teluguName: "తిరుమల శ్రీ వేంకటేశ్వర స్వామి ఆలయం",
    deity: "Sri Venkateswara Swamy (Srinivasa, Balaji)",
    form: "Venkateswara",
    town: "Tirumala",
    state: "Andhra Pradesh",
    district: "Tirupati",
    region: "Rayalaseema",
    summary:
      "The hill shrine of Sri Venkateswara on Venkatadri above Tirupati, administered by Tirumala Tirupati Devasthanams (TTD).",
    history: [
      "According to the temple legend published by TTD, Adisesha was transformed into the Seshadri range, with his hood becoming Venkatadri, the abode of Lord Venkateswara. The legend tells that the Lord, searching for Goddess Lakshmi, stayed in an ant-hill on Venkatadri, appeared as Srinivasa, and married Padmavathi, the daughter of King Akasa Raja. Brahma and Shiva then explained that He chose to remain on the seven hills to liberate people in Kali-yuga.",
      "TTD's history of the temple records that a Pallava queen, Samavai (Perundevi), gave the silver Bhoga Srinivasa Deity in 614 CE, and that the Ananda Nilaya wall and vimana were built between 1244 and 1250 CE. Sri Ramanujacharya (1017–1137) visited Tirumala three times and streamlined the rituals according to the Vaikhanasa Agama. Copper statues of the Vijayanagara emperor Krishnadevaraya and his two queens were installed in 1517. The poet-saint Tallapaka Annamacharya wrote over 32,000 songs in praise of the Lord.",
      "The Chaitanya Charitamrita records that Sri Chaitanya Mahaprabhu came to Tirupati and Tirumala during His South India tour, saw the four-armed Deity there and went on to Venkata Hill.",
    ],
    highlights: [
      "Lord Venkateswara on Venkatadri, one of the Seven Hills",
      "Gold-covered Ananda Nilayam vimana over the sanctum",
      "Annamacharya wrote over 32,000 songs to the Lord",
      "Visited by Sri Chaitanya Mahaprabhu on His South India tour",
      "Administered by Tirumala Tirupati Devasthanams (TTD)",
    ],
    festivals: [
      { name: "Srivari Annual Brahmotsavam", when: "September–October in 2026; in an Adhika Masa year such as 2026, TTD holds a second Brahmotsavam in October" },
      { name: "Vaikuntha Ekadasi (ten days of Vaikuntha Dwara darshan)", when: "December–January" },
      { name: "Ratha Saptami (Lord rides seven vahanams in one day)", when: "January–February" },
    ],
    timings: [
      { label: "Darshan", time: "Through most of the day in slots; check TTD for the day's schedule" },
    ],
    timingsNote:
      "Darshan slots, token systems and ticket quotas are changed by TTD from time to time. Please confirm current timings with the temple before you travel, using the official TTD website.",
    fromVizag:
      "From Visakhapatnam most pilgrims travel by train to Tirupati and then go up to Tirumala by road. Tirupati railway station is about 26 km from Tirumala.",
    howToReach: {
      road: "Buses run from Tirupati to Tirumala about every two minutes. Pilgrims can also climb the footpaths from Alipiri (about 11 km) or Srivari Mettu near Chandragiri (about 6 km). TTD bans vehicles on the ghat road between midnight and 3 AM.",
      rail: "Tirupati railway station, about 26 km away, is the nearest station; Tirumala has no station of its own.",
      air: "The nearest airport is near Renigunta, about 15 km from Tirupati.",
    },
    address: "Sri Venkateswara Swamy Temple, Tirumala, Tirupati district, Andhra Pradesh",
    placeQuery: "Sri Venkateswara Swamy Temple Tirumala",
    website: "https://www.tirumala.org",
    faqs: [
      {
        q: "Is there a dress code for Tirumala darshan?",
        a: "Yes. TTD asks men to wear dhoti or pyjama with an upper cloth, and women to wear a saree or half-saree with blouse, or churidar with pyjama and upper cloth. Shorts and tight clothes are not permitted. Please check the current rules on tirumala.org.",
      },
      {
        q: "Can I walk up to Tirumala?",
        a: "Yes. The Alipiri footpath is about 11 km and the Srivari Mettu footpath, which starts near Chandragiri, is about 6 km.",
      },
      {
        q: "Where can pilgrims book darshan, sevas and rooms?",
        a: "Through TTD's official booking website, ttdevasthanams.ap.gov.in.",
      },
    ],
    sources: [
      "https://www.tirumala.org/TempleLegend.aspx",
      "https://www.tirumala.org/TTDTempleHistory.aspx",
      "https://www.tirumala.org/Howtoreach_TirupatiandTirumala.aspx",
      "https://www.tirumala.org/DressCode.aspx",
      "https://news.tirumala.org/radha-sapthami-in-tirumala-on-feb-14/",
      "https://www.deccanchronicle.com/southern-states/andhra-pradesh/ttd-readies-tirumala-for-10-day-vaikunta-dwara-darshan-1927019",
      "https://www.thehansindia.com/news/cities/tirupathi/brahmotsavams-a-living-tradition-of-tirumala-1121252",
      "https://vedabase.io/en/library/cc/madhya/9/64/",
    ],
    check: [
      "Current suprabhatam and ekantha seva times (removed, no official source found)",
      "Brahmotsavam dates for the coming year",
      "Road distance and train time from Visakhapatnam (removed)",
      "Whether any direct Visakhapatnam–Tirupati flight currently operates",
      "Free annaprasadam and darshan-duration claims (removed, no source checked)",
      "PIN code (removed; 517504 unverified)",
    ],
  },

  // 3. Tiruchanur
  {
    slug: "tiruchanur-sri-padmavathi-ammavari-temple",
    name: "Tiruchanur Sri Padmavathi Ammavari Temple",
    shortName: "Tiruchanur",
    teluguName: "తిరుచానూరు శ్రీ పద్మావతి అమ్మవారి ఆలయం",
    deity: "Sri Padmavathi Ammavaru (Alamelu Manga)",
    form: "Padmavathi",
    town: "Tiruchanur (Alamelu Mangapuram), Tirupati",
    state: "Andhra Pradesh",
    district: "Tirupati",
    region: "Rayalaseema",
    summary:
      "Temple of Sri Padmavathi Devi, the consort of Lord Venkateswara, at Tiruchanur near Tirupati, managed by TTD.",
    history: [
      "Tiruchanur, also called Alamelu Mangapuram, is the abode of Sri Padmavathi Devi, consort of Lord Venkateswara and a form of Goddess Mahalakshmi. According to the temple legend published by TTD, Mahalakshmi performed penance for twelve years at a pushkarini on the banks of the Swarnamukhi river, and in the thirteenth year appeared as Padmavathi on a golden lotus in the centre of the tank, on Panchami in the month of Karthika under Uttarashadha nakshatra. That tank is the Padma Sarovaram.",
      "The temple compound also has the shrine of Sri Krishna Swamy (Alagiyaperumal), with Balarama on His right, which TTD records as the earliest shrine there, dating to at least 1221 CE, and the 16th-century shrine of Sri Sundararaja Swamy. The Sri Suryanarayana Swamy temple stands opposite the Padma Sarovaram.",
      "The annual Karthika Brahmotsavam ends with Panchami Theertham, when the Sudarshana Chakrattalwar is given a holy dip in the Padma Sarovaram and large numbers of pilgrims bathe in the tank. Friday is the Goddess's special day, with abhishekam in the early morning.",
    ],
    highlights: [
      "Abode of Sri Padmavathi, consort of Lord Venkateswara",
      "Padma Sarovaram, where the Goddess is said to have appeared on a golden lotus",
      "Shrine of Sri Krishna with Balarama in the complex",
      "Managed by Tirumala Tirupati Devasthanams (TTD)",
    ],
    festivals: [
      { name: "Karthika Brahmotsavam with Panchami Theertham", when: "Karthika month, November–December" },
      { name: "Vasantotsavam", when: "May" },
      { name: "Float festival, Navaratri and Ratha Saptami", when: "Dates announced by TTD each year" },
    ],
    timings: [
      { label: "Suprabhatam", time: "4:30 AM (3:30 AM on Fridays)" },
      { label: "Friday abhishekam", time: "5:30 AM" },
      { label: "Ekantha seva", time: "9:30 PM (9:45 PM on Fridays)" },
    ],
    timingsNote:
      "Seva times are as published by TTD and change on festival days. Please confirm current timings with the temple before you travel.",
    fromVizag:
      "From Visakhapatnam, take a train to Tirupati; Tiruchanur is about 5 km from Tirupati by road.",
    howToReach: {
      road: "Tiruchanur is about 5 km from Tirupati by road.",
      rail: "Tirupati railway station is the nearest major station.",
      air: "Tirupati Airport near Renigunta is the nearest airport.",
    },
    address: "Sri Padmavathi Ammavari Temple, Tiruchanur, Tirupati, Andhra Pradesh",
    placeQuery: "Sri Padmavathi Ammavari Temple Tiruchanur Tirupati",
    website: "https://www.tirumala.org",
    faqs: [
      {
        q: "What is Panchami Theertham?",
        a: "It is the last day of the Karthika Brahmotsavam, when the Sudarshana Chakrattalwar is given a holy dip in the Padma Sarovaram and pilgrims bathe in the tank.",
      },
      {
        q: "Is there a dress code?",
        a: "TTD says traditional dress is expected for sevas, and cell phones and electronic items are not allowed.",
      },
      {
        q: "What is special about Fridays?",
        a: "Suprabhatam is earlier (3:30 AM), and abhishekam, vastralankaram and Lakshmi puja are performed for the Goddess.",
      },
    ],
    sources: [
      "https://www.tirumala.org/PatAtThiruchanoorTempleLegend.aspx",
      "https://www.tirumala.org/PatAtThiruchanoorSevas.aspx",
      "https://www.tirumala.org/TemplesAtTiruchanoor.aspx",
      "https://news.tirumala.org/?p=2516",
      "https://thehansindia.com/news/cities/tirupathi/religious-fervour-marks-panchami-theertham-927708",
    ],
    check: [
      "Sarva darshan hours and any midday break (not published on the TTD seva page)",
      "Months of the float festival (Teppotsavam) and Varalakshmi Vratam",
      "Whether 5 km is measured from Tirupati town centre or railway station",
      "PIN code (removed; 517503 unverified)",
    ],
  },

  // 4. Govindaraja
  {
    slug: "tirupati-sri-govindaraja-swamy-temple",
    name: "Sri Govindaraja Swamy Temple, Tirupati",
    shortName: "Govindaraja Swamy, Tirupati",
    teluguName: "తిరుపతి శ్రీ గోవిందరాజ స్వామి ఆలయం",
    deity: "Sri Govindaraja Swamy",
    form: "Govindaraja",
    town: "Tirupati",
    state: "Andhra Pradesh",
    district: "Tirupati",
    region: "Rayalaseema",
    summary:
      "Large temple in the heart of Tirupati town, consecrated by Sri Ramanujacharya in 1130 CE and managed by TTD.",
    history: [
      "The Sri Govindaraja Swamy temple stands in the heart of Tirupati and is one of the oldest and most important temples of the town. According to the temple legend recorded by TTD, the Deity of Govindaraja had been brought from Chidambaram to Tirupati for safekeeping. Sri Ramanujacharya, directed in a dream, found the Deity with the king's help and advised him to build a temple and houses for those who serve in it. Ramanujacharya consecrated the temple in 1130 CE.",
      "Before Govindaraja was installed, Sri Parthasarathy, Krishna as Arjuna's charioteer, was the presiding Deity; He is still worshipped in a shrine within the complex. The outer gopuram, a seven-storeyed tower with eleven kalasas from the 14th–15th century, is carved with scenes from the Bhagavatam, the Ramayana and the life of Lord Venkateswara. Worship follows the Vaikhanasa Agama.",
      "The temple's annual Brahmotsavam is the Vaisakha festival. A Garuda Seva is held on every full-moon day.",
    ],
    highlights: [
      "Consecrated by Sri Ramanujacharya in 1130 CE",
      "Shrine of Sri Parthasarathy (Krishna) within the complex",
      "Seven-storeyed outer gopuram with eleven kalasas",
      "Pournami Garuda Seva every full-moon day",
    ],
    festivals: [
      { name: "Annual Brahmotsavam (Vaisakha festival)", when: "Vaisakha month, April–May" },
      { name: "Float festival (Teppotsavam)", when: "Dates announced by TTD each year" },
      { name: "Pournami Garuda Seva", when: "Every full-moon day" },
    ],
    timings: [
      { label: "Temple opens (Suprabhata seva)", time: "by 5:00 AM" },
      { label: "Temple closes (Ekantha seva)", time: "by 9:00 PM" },
    ],
    timingsNote:
      "Opening and closing times are as published by TTD; darshan pauses for sevas during the day. Please confirm current timings with the temple before you travel.",
    fromVizag:
      "From Visakhapatnam, take a train to Tirupati; the temple is in the centre of Tirupati town.",
    howToReach: {
      road: "The temple is in the centre of Tirupati town.",
      rail: "Tirupati railway station is the nearest station.",
      air: "Tirupati Airport near Renigunta is the nearest airport, about 15 km from Tirupati.",
    },
    address: "Sri Govindaraja Swamy Temple, Tirupati, Andhra Pradesh",
    placeQuery: "Sri Govindaraja Swamy Temple Tirupati",
    website: "https://www.tirumala.org",
    faqs: [
      {
        q: "Who consecrated the Govindaraja Swamy temple?",
        a: "TTD records that Sri Ramanujacharya consecrated the temple in 1130 CE.",
      },
      {
        q: "What are the temple timings?",
        a: "According to TTD the temple opens by 5 AM with Suprabhata seva and closes by 9 PM with Ekantha seva. Please confirm before you travel.",
      },
      {
        q: "Is there a Krishna shrine in the temple?",
        a: "Yes. Sri Parthasarathy, who was the presiding Deity before Govindaraja was installed, is worshipped in a shrine within the complex.",
      },
    ],
    sources: [
      "https://www.tirumala.org/TemplesAtTirupathi.aspx",
      "https://www.incredibleindia.gov.in/en/andhra-pradesh/tirupati/sri-govindaraja-swamy-temple",
      "https://www.tirumala.org/Howtoreach_TirupatiandTirumala.aspx",
    ],
    check: [
      "Walking distance from Tirupati railway station (removed, no valid source)",
      "Exact Brahmotsavam and Teppotsavam dates for the coming year",
      "Dress code (removed; assumed same as other TTD temples)",
      "PIN code (removed; 517501 unverified)",
    ],
  },

  // 5. Annavaram
  {
    slug: "annavaram-sri-veera-venkata-satyanarayana-swamy-temple",
    name: "Annavaram Sri Veera Venkata Satyanarayana Swamy Temple",
    shortName: "Annavaram",
    teluguName: "అన్నవరం శ్రీ వీర వేంకట సత్యనారాయణ స్వామి దేవస్థానం",
    deity: "Sri Veera Venkata Satyanarayana Swamy",
    form: "Satyanarayana",
    town: "Annavaram",
    state: "Andhra Pradesh",
    district: "Kakinada",
    region: "Godavari Districts",
    summary:
      "Ratnagiri hill temple of Sri Satyanarayana Swamy at Annavaram, where devotees perform the Satyanarayana Vratam in large numbers.",
    history: [
      "Annavaram's temple of Sri Veera Venkata Satyanarayana Swamy stands on Ratnagiri hill on the banks of the river Pampa, in Kakinada district. It is one of the best-known pilgrimage centres of Andhra Pradesh.",
      "The shrine has two storeys: the lower one holds a yantra and the upper one the Deities. The main Deity is about four metres tall and cylindrical, and is described as one form embodying the Trimurti: according to the district portal, the base in the lower sanctum represents Brahma, the middle portion Shiva and the upper part, in the upper sanctum, Vishnu. A sundial on the premises shows Indian Standard Time.",
      "Devotees come in large numbers to perform the Sri Satyanarayana Swamy Vratam in the temple's vratam mandapams. On Karthika Purnima alone, thousands perform the vratam, and lakhs walk the Giri Pradakshina around the hill.",
    ],
    highlights: [
      "Hilltop temple on Ratnagiri beside the Pampa river",
      "Main centre for Sri Satyanarayana Vratam in Andhra Pradesh",
      "Single Deity described as embodying the Trimurti",
      "On the Chennai–Howrah main railway line",
    ],
    festivals: [
      { name: "Sri Swamy Kalyana Mahotsavam", when: "Vaisakha Ekadasi, May" },
      { name: "Giri Pradakshina", when: "Karthika Purnima, October–November" },
      { name: "Sarannavaratrulu (Navaratri)", when: "Asviyuja month, September–October" },
    ],
    timings: [
      { label: "Darshan and vratams", time: "Daily from early morning; confirm hours with the devasthanam" },
    ],
    timingsNote: "Please confirm current timings with the temple before you travel.",
    fromVizag:
      "Annavaram is on the Chennai–Howrah main railway line, which also serves Visakhapatnam. By road it is 72 km from Rajahmundry and 51 km from Kakinada.",
    howToReach: {
      road: "Annavaram is 32 km from Pithapuram, 51 km from Kakinada and 72 km from Rajahmundry by road.",
      rail: "Annavaram railway station is on the Chennai–Howrah main line.",
      air: "Rajahmundry Airport and Visakhapatnam Airport are the nearest airports.",
    },
    address: "Sri Veera Venkata Satyanarayana Swamy Devasthanam, Annavaram, Sankhavaram mandal, Kakinada district, Andhra Pradesh 533406",
    placeQuery: "Sri Veera Venkata Satyanarayana Swamy Temple Annavaram",
    faqs: [
      {
        q: "Can we perform the Satyanarayana Vratam at Annavaram?",
        a: "Yes. The devasthanam conducts the vratam in its vratam mandapams for a fee, with different ticket categories.",
      },
      {
        q: "Is there accommodation at Annavaram?",
        a: "Yes. The devasthanam runs cottages, choultries and guest houses on the hill.",
      },
      {
        q: "When is the Kalyana Mahotsavam?",
        a: "The Lord's Kalyana Mahotsavam is held on Vaisakha Ekadasi, in May.",
      },
    ],
    sources: [
      "https://eastgodavari.ap.gov.in/lord-sri-veera-venkata-satya-narayana-swamy-vari-devasthanam-annavaram/",
      "https://kakinada.ap.gov.in/?p=3362",
      "https://www.deccanchronicle.com/southern-states/andhra-pradesh/thousands-throng-annavaram-temple-for-satyanarayana-pooja-1915149",
    ],
    check: [
      "Daily darshan, suprabhatam and vratam batch timings (removed, no valid source)",
      "Story and date of the Deity's discovery (1891 dream legend removed, no valid source)",
      "Name of the Lord's consort (Sri Anantha Lakshmi) and chariot-shaped temple design (removed, no valid source)",
      "Road distance from Visakhapatnam (removed)",
      "Official devasthanam website and online booking portal",
      "Dress code (removed)",
    ],
  },

  // 6. Ahobilam
  {
    slug: "ahobilam-nava-narasimha-temples",
    name: "Ahobilam Sri Lakshmi Narasimha Swamy Temples (Nava Narasimha Kshetra)",
    shortName: "Ahobilam",
    teluguName: "అహోబిలం శ్రీ లక్ష్మీ నృసింహ స్వామి దేవస్థానం",
    deity: "Sri Ahobila Narasimha Swamy and Sri Prahlada Varada Narasimha Swamy",
    form: "Narasimha",
    town: "Ahobilam, Allagadda mandal",
    state: "Andhra Pradesh",
    district: "Nandyal",
    region: "Rayalaseema",
    summary:
      "Kshetra in the Nallamala hills of Nandyal district with nine shrines of Lord Narasimha, visited by Sri Chaitanya Mahaprabhu as Ahovala-nrsimha.",
    history: [
      "Ahobilam lies in the Nallamala hills of Allagadda mandal, Nandyal district. According to temple tradition, this is where Lord Narasimha killed Hiranyakashipu and saved Prahlada. The Ahobila Mutt records two explanations of the name: that the demigods praised the Lord's fierce strength as \"Ahobala\", and that it refers to the great cave where Garuda worshipped Him. A cleft in the mountain called the Ugra Stambham is pointed out by tradition as the place from which the Lord appeared.",
      "The kshetra has two parts. Lower Ahobilam, at the foot of the hill, has the temple of Sri Prahlada Varada Narasimha. Upper Ahobilam has the shrine of Sri Ahobila Narasimha, and around the hills are the nine shrines of the Nava Narasimhas: Jwala, Ahobila, Malola, Kroda, Karanja, Bhargava, Yogananda, Kshatravata (Chatravata) and Pavana. Jwala and Pavana are the hardest to reach. The jeeyars of Sri Ahobila Mutt, a Sri Vaishnava monastic lineage, serve as hereditary trustees.",
      "The Chaitanya Charitamrita (Madhya 9.16–17) records that Sri Chaitanya Mahaprabhu visited Ahovala-nrsimha on His South India pilgrimage and offered many prayers to the Lord.",
    ],
    highlights: [
      "Nine shrines of Lord Narasimha (Nava Narasimhas) in the Nallamala hills",
      "Ugra Stambham, the rock cleft linked by tradition to the Lord's appearance",
      "Lower Ahobilam (Prahlada Varada) and Upper Ahobilam (Ahobila Narasimha)",
      "Visited by Sri Chaitanya Mahaprabhu (Chaitanya Charitamrita, Madhya 9.16–17)",
    ],
    festivals: [
      { name: "Annual Brahmotsavam", when: "February–March (Masi / Phalguna)" },
      { name: "Narasimha Jayanti Brahmotsavam", when: "Vaisakha month, April–May" },
    ],
    timings: [
      { label: "Darshan hours", time: "please confirm with the temple office at Lower Ahobilam" },
    ],
    timingsNote: "Please confirm current timings with the temple before you travel.",
    fromVizag:
      "Ahobilam is a long journey from Visakhapatnam. The nearest towns are Allagadda (about 28 km), Nandyal (about 68 km) and Kurnool (about 160 km); most pilgrims travel by train to Nandyal or Kurnool and continue by road.",
    howToReach: {
      road: "Local buses run between Allagadda and Ahobilam. The road between Lower and Upper Ahobilam is about 8 km, and some shrines are reached only on foot.",
      rail: "Nandyal, about 68 km away, and Kurnool, about 160 km away, are the convenient railway towns.",
      air: "Please check the nearest airport and onward road connections before you travel.",
    },
    address: "Sri Lakshmi Narasimha Swamy Devasthanam, Ahobilam, Allagadda mandal, Nandyal district, Andhra Pradesh",
    placeQuery: "Sri Prahlada Varada Lakshmi Narasimha Swamy Temple Lower Ahobilam",
    website: "https://ahobilamutt.org",
    faqs: [
      {
        q: "Which Ahobilam shrines are hardest to reach?",
        a: "The Ahobila Mutt notes that Jwala and Pavana Narasimha are the hardest to reach; Jwala takes about an hour's climb over rock and a narrow path, and a guide is recommended for Jwala and the Ugra Stambham.",
      },
      {
        q: "Is it safe to go into the forest alone?",
        a: "Stay on known routes. In a reported incident, pilgrims returning from Pavana Narasimha lost their way in the Nallamala forest, and forest officials advised visitors to avoid unfamiliar routes because of wild animals.",
      },
      {
        q: "Where can I stay?",
        a: "The Ahobila Mutt runs the Malola Guest House at Ahobilam and a free annadanam for pilgrims; please contact the Mutt in advance.",
      },
    ],
    sources: [
      "https://ahobilamutt.org/visit-ahobilam/",
      "https://nandyal.ap.gov.in/temple-tourism/",
      "https://vedabase.io/en/library/cc/madhya/9/16/",
      "https://vedabase.io/en/library/cc/madhya/9/17/",
      "https://www.deccanchronicle.com/southern-states/andhra-pradesh/grandeur-marks-brahmotsavams-at-ahobilam-temple-1876884",
      "https://www.deccanchronicle.com/southern-states/andhra-pradesh/six-devotees-rescued-safely-from-nallamala-forest-1980897",
    ],
    check: [
      "Darshan timings for Lower and Upper Ahobilam (no official source found)",
      "Current Brahmotsavam dates for the coming year",
      "Road distance and best route from Visakhapatnam",
      "Nearest airport and distance",
      "Current guest house contact and booking details (Ahobila Mutt)",
      "PIN code (518543 seen only on non-official sites)",
    ],
  },

  // 7. Mangalagiri
  {
    slug: "mangalagiri-panakala-lakshmi-narasimha-temple",
    name: "Mangalagiri Sri Panakala Lakshmi Narasimha Swamy Temple",
    shortName: "Mangalagiri",
    teluguName: "మంగళగిరి శ్రీ పానకాల లక్ష్మీ నృసింహ స్వామి ఆలయం",
    deity: "Sri Panakala Lakshmi Narasimha Swamy",
    form: "Narasimha",
    town: "Mangalagiri",
    state: "Andhra Pradesh",
    district: "Guntur",
    region: "Krishna & Guntur",
    summary:
      "Hill shrine at Mangalagiri near Vijayawada where Lord Narasimha is offered panakam (jaggery water), visited by Sri Chaitanya Mahaprabhu as Pana-nrsimha.",
    history: [
      "Mangalagiri lies about 10 km from Vijayawada in Guntur district. On the hill is the shrine of Sri Lakshmi Narasimha Swamy, popularly called Panakala Narasimha Swamy or Panakala Swamy, because devotees offer Him panakam, a drink of jaggery dissolved in water. The priests pour the panakam into the Lord's mouth. According to temple tradition, the Lord accepts about half of what is offered and the rest is returned to the devotee as prasadam. A second temple of Sri Lakshmi Narasimha Swamy stands at the foot of the hill.",
      "The Chaitanya Charitamrita (Madhya 9.66–67) records that Sri Chaitanya Mahaprabhu visited the temple of Pana-nrsimha and offered obeisances and prayers in ecstatic love. In his purport, Srila Prabhupada identifies Pana-nrsimha (Panakal-narasimha) with the Mangalagiri hills near Vijayawada, notes that pilgrims climb about six hundred steps to reach the shrine, and mentions that a large fair is held there in March.",
      "The annual Brahmotsavam ends with a Rathotsavam (chariot festival), when devotees pull the Lord's chariot through Mangalagiri town.",
    ],
    highlights: [
      "Lord Narasimha is offered panakam (jaggery water) at the hill shrine",
      "Visited by Sri Chaitanya Mahaprabhu (Chaitanya Charitamrita, Madhya 9.66)",
      "Lower Lakshmi Narasimha temple at the foot of the hill",
      "About 10 km from Vijayawada",
    ],
    festivals: [
      { name: "Annual Brahmotsavam and Rathotsavam", when: "Around March (Phalguna)" },
    ],
    timings: [
      { label: "Panakala Swamy hill shrine (AP Endowments listing)", time: "about 7:00 AM – 3:30 PM" },
      { label: "Lower Lakshmi Narasimha temple", time: "please confirm with the temple" },
    ],
    timingsNote: "Please confirm current timings with the temple before you travel.",
    fromVizag:
      "Mangalagiri is about 10 km from Vijayawada. From Visakhapatnam, take a train or bus to Vijayawada and continue by road.",
    howToReach: {
      road: "Mangalagiri is on the Vijayawada–Chennai highway, about 10 km from Vijayawada; buses and autos run from Vijayawada and Guntur.",
      rail: "Vijayawada Junction is the nearest major railway station.",
      air: "Vijayawada Airport at Gannavaram is the nearest airport.",
    },
    address: "Sri Panakala Lakshmi Narasimha Swamy Temple, Mangalagiri, Guntur district, Andhra Pradesh",
    placeQuery: "Sri Panakala Lakshmi Narasimha Swamy Temple Mangalagiri",
    faqs: [
      {
        q: "What is panakam?",
        a: "Panakam is jaggery dissolved in water. It is offered to Lord Narasimha at the hill shrine, and the priests pour it into the Lord's mouth.",
      },
      {
        q: "What time should I reach Mangalagiri?",
        a: "Go in the morning. The AP Endowments listing shows the hill shrine open until about 3:30 PM; please confirm on the day.",
      },
      {
        q: "Did Sri Chaitanya Mahaprabhu visit Mangalagiri?",
        a: "Yes. The Chaitanya Charitamrita (Madhya 9.66) records His visit to Pana-nrsimha, which Srila Prabhupada's purport places in the Mangalagiri hills near Vijayawada.",
      },
    ],
    sources: [
      "https://guntur.ap.gov.in/religious-tourism/",
      "https://tms.ap.gov.in/panmgl/cnt/about-temple",
      "https://vedabase.io/en/library/cc/madhya/9/66/",
      "https://www.thehansindia.com/andhra-pradesh/guntur-rathotsavam-of-sri-panakala-swamy-organised-786678",
    ],
    check: [
      "Hill shrine timings (7:00 AM – 3:30 PM seen in AP Endowments TMS listing; confirm current hours)",
      "Lower temple timings",
      "Nearest airport (Vijayawada/Gannavaram) and its distance: no valid source found",
      "Gopuram builder and date (Raja Vasireddy Venkatadri Naidu, 1807–09) — removed, no valid source found",
      "Brahmotsavam start tithi and dates for the coming year",
      "Number of steps to the hill shrine today (600 per CC purport)",
      "PIN code (522503 seen only on non-official sites)",
    ],
  },

  // 8. Dwaraka Tirumala
  {
    slug: "dwaraka-tirumala-sri-venkateswara-swamy-temple",
    name: "Dwaraka Tirumala Sri Venkateswara Swamy Temple",
    shortName: "Dwaraka Tirumala",
    teluguName: "ద్వారకా తిరుమల శ్రీ వేంకటేశ్వర స్వామి ఆలయం",
    deity: "Sri Venkateswara Swamy",
    form: "Venkateswara",
    town: "Dwaraka Tirumala",
    state: "Andhra Pradesh",
    district: "Eluru",
    region: "Godavari Districts",
    summary:
      "Chinna Tirupati: hill temple of Sri Venkateswara near Eluru, named after the sage Dwaraka who, by tradition, found the self-manifested Deity in an anthill.",
    history: [
      "Dwaraka Tirumala, also called Chinna Tirupati, is about 42 km from Eluru. According to the devasthanam, the place is named after the sage Dwaraka, who located the self-manifested Deity of Lord Sri Venkateswara in an anthill (valmikam) after severe penance. Devotees who are unable to travel to Tirumala offer their vows, donations and tonsure here.",
      "Two Deities stand under one vimana. The self-manifested Deity is visible only from the bust upward; according to temple tradition, the Lord's feet are in the earth, offered to Bali Chakravarthi in Patala for his daily worship. Because worship was felt to be incomplete without the Lord's feet, a full standing Deity was installed behind Him according to the Vaikhanasa Agama, and temple tradition holds that this was done by Sri Ramanujacharya. Tiru Kalyanotsavam is therefore celebrated twice a year: in Vaisakha for the self-manifested Deity and in Aswayuja for the installed Deity.",
      "The devasthanam credits the vimana, mandapa, gopuram and prakara walls to Dharma Appa Rao (1762–1827), and the gold ornaments and silver vahanas to Rani Chinnamma Rao of Mylavaram (1877–1902). The main five-storeyed rajagopuram faces south, and daily worship follows the Vaikhanasa Agama.",
    ],
    highlights: [
      "Known as Chinna Tirupati",
      "Self-manifested Deity with a full standing Deity behind, under one vimana",
      "Named after sage Dwaraka, who by tradition found the Lord in an anthill",
      "Tiru Kalyanotsavam celebrated twice a year (Vaisakha and Aswayuja)",
    ],
    festivals: [
      { name: "Vaisakha Tiru Kalyanotsavam / Brahmotsavam", when: "Vaisakha Shukla Chaturdashi, April–May" },
      { name: "Aswayuja Tiru Kalyanotsavam / Brahmotsavam", when: "Aswayuja Shukla Chaturdashi, September–October" },
      { name: "Mukkoti / Vaikuntha Dwara Darshan", when: "Dhanurmasa Ekadasi, December–January" },
      { name: "Giri Pradakshina", when: "Kanuma day, January" },
      { name: "Teppotsavam", when: "Karthika Shukla Dwadashi, October–November" },
    ],
    timings: [
      { label: "Suprabhatam", time: "4:00 AM (Saturday & Sunday); 4:30 AM (Monday–Friday)" },
      { label: "Darshan", time: "6:00 AM – 1:00 PM, 3:00 PM – 5:30 PM, 7:00 PM – 9:00 PM" },
      { label: "Ekanta seva (temple closes)", time: "9:00 PM" },
    ],
    timingsNote: "Timings as published by the devasthanam. Please confirm current timings with the temple before you travel.",
    fromVizag:
      "Dwaraka Tirumala is about 17 km from Bhimadole railway station on the Visakhapatnam–Vijayawada main line, and about 42 km from Eluru. Trains such as the Simhadri Express stop at Bhimadole.",
    howToReach: {
      road: "The temple is about 15 km from Bhimadole junction on the Vijayawada–Rajahmundry highway, 42 km from Eluru and 50 km from Tadepalligudem, with APSRTC buses from Eluru, Vijayawada and many other depots.",
      rail: "Bhimadole railway station, about 17 km away on the Vijayawada–Visakhapatnam line, is the nearest station; Eluru has more trains.",
      air: "Rajahmundry Airport is the nearest airport listed by India Tourism.",
    },
    address: "Sri Venkateswara Swamy Vari Devasthanam, Dwaraka Tirumala, Eluru district, Andhra Pradesh 534426",
    placeQuery: "Sri Venkateswara Swamy Temple Dwaraka Tirumala",
    website: "http://www.dwarakatirumala.org",
    faqs: [
      {
        q: "Why is Dwaraka Tirumala called Chinna Tirupati?",
        a: "The devasthanam explains that devotees who cannot go to Tirumala (Pedda Tirupati) can offer their donations, tonsure and prayers to Lord Venkateswara here.",
      },
      {
        q: "Is darshan free?",
        a: "Sarva darshan is free. The devasthanam also lists paid Seeghra darshan (Rs 100) and Athi Seeghra darshan (Rs 200); please confirm current rates.",
      },
      {
        q: "Is accommodation available?",
        a: "Yes. The devasthanam runs choultries, cottages and dormitories, and rooms can be booked online through MeeSeva.",
      },
    ],
    sources: [
      "http://www.dwarakatirumala.org/aboutus.html",
      "http://www.dwarakatirumala.org/festivals.html",
      "http://www.dwarakatirumala.org/routemap.html",
      "http://www.dwarakatirumala.org/accommodation.html",
      "https://www.incredibleindia.gov.in/en/festivals-and-events/andhra-pradesh/dwaraka-tirumala-brahmotsavam",
      "https://www.deccanchronicle.com/nation/current-affairs/160516/dwaraka-tirimula-known-as-china-tirupati-set-for-mega-fete.html",
    ],
    check: [
      "Darshan timings (devasthanam site shows slightly different splits on its About and Festivals pages)",
      "Current darshan ticket rates",
      "Road distance and travel time from Visakhapatnam",
      "Whether the official site is now on https / a new URL",
    ],
  },

  // 9. Srikurmam
  {
    slug: "srikurmam-sri-kurmanatha-swamy-temple",
    name: "Srikurmam Sri Kurmanatha Swamy Temple",
    shortName: "Srikurmam",
    teluguName: "శ్రీకూర్మం శ్రీ కూర్మనాథ స్వామి ఆలయం",
    deity: "Sri Kurmanatha Swamy",
    form: "Kurma",
    town: "Srikurmam, Gara mandal",
    state: "Andhra Pradesh",
    district: "Srikakulam",
    region: "North Coastal Andhra",
    summary:
      "Rare temple of Lord Vishnu as Kurma, the tortoise avatar, near Srikakulam; identified as the Kurma-kshetra visited by Sri Chaitanya Mahaprabhu.",
    history: [
      "Srikurmam, near Srikakulam, is a temple of Lord Vishnu as Kurma, the tortoise avatar, worshipped here as Sri Kurmanatha. India Tourism describes the Deity as carved from black stone, about 2.5 feet tall, aligned with its head facing west, and notes that the temple has dhwaja stambhas (flagstaffs) on both its east and west sides. The Swetha Pushkarini is the temple tank, and the campus has a park for star tortoises.",
      "The temple's inscriptions span many centuries. Srila Prabhupada's purport to the Chaitanya Charitamrita records, from the Prapannamrita, that Sri Ramanujacharya came here and, recognising the Deity as a form of Lord Vishnu, established elaborate worship; that the temple later came under the Vijayanagara king; and that it was worshipped by Vaishnavas of the Madhva sampradaya. It cites an inscription of Narahari Tirtha dated 1281 CE.",
      "The Chaitanya Charitamrita (Madhya 7.113–150) describes how Sri Chaitanya Mahaprabhu came to Kurma-kshetra, stayed at the house of a brahmana named Kurma, and embraced and cured the leper brahmana Vasudeva, instructing both to chant the holy name constantly. Srila Prabhupada's purport locates Kurma-kshetra east of Srikakulam Road station.",
    ],
    highlights: [
      "Temple of the Kurma (tortoise) avatar of Lord Vishnu",
      "Dhwaja stambhas on both the east and west sides",
      "Kurma-kshetra of the Chaitanya Charitamrita, where Mahaprabhu healed Vasudeva",
      "Swetha Pushkarini tank and star tortoise park",
    ],
    festivals: [
      { name: "Dolotsavam (three days)", when: "Around Holi, February–March" },
      { name: "Vaikuntha Ekadasi", when: "December–January" },
    ],
    timings: [
      { label: "Darshan hours", time: "please confirm with the temple office" },
    ],
    timingsNote: "Please confirm current timings with the temple before you travel.",
    fromVizag:
      "Srikurmam is about 20 km from Srikakulam town, and Visakhapatnam Airport is about 115–120 km away. Most pilgrims from Vizag travel by road via Srikakulam.",
    howToReach: {
      road: "Buses, taxis and private vehicles run from Srikakulam (about 20 km), Vizianagaram and nearby towns.",
      rail: "Srikakulam Road station on the Howrah–Chennai main line is about 20–22 km away.",
      air: "Visakhapatnam International Airport is about 115–120 km away.",
    },
    address: "Sri Kurmanatha Swamy Temple, Srikurmam, Gara mandal, Srikakulam district, Andhra Pradesh",
    placeQuery: "Sri Kurmanatha Swamy Temple Srikurmam Srikakulam",
    faqs: [
      {
        q: "What is special about the Srikurmam temple?",
        a: "Lord Vishnu is worshipped here as Kurma, the tortoise avatar. The Deity is aligned with its head facing west, and the temple has flagstaffs on both its east and west sides.",
      },
      {
        q: "What is the connection with Sri Chaitanya Mahaprabhu?",
        a: "The Chaitanya Charitamrita (Madhya 7) describes His visit to Kurma-kshetra, where He blessed the brahmana Kurma and healed the leper Vasudeva.",
      },
      {
        q: "When is the best time to visit?",
        a: "India Tourism suggests October to March, preferably early morning or evening.",
      },
    ],
    sources: [
      "https://www.incredibleindia.gov.in/en/andhra-pradesh/srikakulam/srikurmam",
      "https://srikakulam.ap.gov.in/religious-tourism/",
      "https://vedabase.io/en/library/cc/madhya/7/",
      "https://vedabase.io/en/library/cc/madhya/7/113/",
      "https://www.thehansindia.com/posts/index/andhra-pradesh/2018-09-03/30-cr-to-improve-amenities-at-temple/409402",
    ],
    check: [
      "Darshan timings (no official source found)",
      "Dolotsavam dates for the coming year",
      "Current status of the star tortoise park",
      "Road distance and travel time from Visakhapatnam",
      "Whether any Chaitanya Mahaprabhu memorial exists at Srikurmam",
      "PIN code (532404 seen only on non-official sites)",
    ],
  },

  // 10. Antarvedi
  {
    slug: "antarvedi-sri-lakshmi-narasimha-swamy-temple",
    name: "Antarvedi Sri Lakshmi Narasimha Swamy Temple",
    shortName: "Antarvedi",
    teluguName: "అంతర్వేది శ్రీ లక్ష్మీ నృసింహ స్వామి ఆలయం",
    deity: "Sri Lakshmi Narasimha Swamy",
    form: "Narasimha",
    town: "Antarvedi, Sakhinetipalli mandal",
    state: "Andhra Pradesh",
    district: "Dr. B.R. Ambedkar Konaseema",
    region: "Godavari Districts",
    summary:
      "Temple of Sri Lakshmi Narasimha at Antarvedi, where the Vasishta Godavari meets the Bay of Bengal, famed for its Kalyanam and chariot festival around Bhishma Ekadasi.",
    history: [
      "Antarvedi is in Sakhinetipalli mandal of Konaseema district, where the Vasishta Godavari meets the Bay of Bengal. According to the temple legend recorded by the district administration, the sage Vasishta had his ashram here. When the demon Raktavilochana killed Vasishta's sons, the sage prayed to Lord Narasimha, who killed the demon with His Sudarshana chakra, and Vasishta then installed the Lord at Antarvedi. The Raktakulya stream and the Chakra Teertham are connected with this story.",
      "The Lord is worshipped with Sri Lakshmi seated on His lap, and the main Deity faces west rather than east. The Konaseema district describes the temple as built between the 15th and 16th centuries, and the district's account adds that it fell into ruin and was rebuilt with the help of devotees, as recorded in a stone inscription in the temple. The Sagara Sangamam and Chakra Teertham are holy bathing places nearby.",
      "The main festival is the Kalyana Mahotsavam in Magha. The divine wedding is performed on the night before Bhishma Ekadasi and the Rathotsavam (chariot festival) follows on Bhishma Ekadasi. The festival draws large crowds of devotees.",
    ],
    highlights: [
      "Where the Vasishta Godavari meets the Bay of Bengal",
      "Main Deity faces west",
      "Kalyanam and Rathotsavam around Bhishma Ekadasi",
      "Sagara Sangamam and Chakra Teertham bathing places",
    ],
    festivals: [
      { name: "Kalyana Mahotsavam and Rathotsavam", when: "Magha month, around Bhishma Ekadasi (January–February)" },
      { name: "Narasimha Jayanti", when: "Vaisakha Shukla Chaturdashi, April–May" },
    ],
    timings: [
      { label: "Darshan hours", time: "please confirm with the temple office" },
    ],
    timingsNote: "Please confirm current timings with the temple before you travel.",
    fromVizag:
      "Antarvedi is about 100 km from Rajahmundry, 65 km from Amalapuram and 130 km from Kakinada. From Visakhapatnam, travel to Rajahmundry or Amalapuram and continue by road.",
    howToReach: {
      road: "Antarvedi is about 65 km from Amalapuram and 100 km from Rajahmundry; special buses are arranged during the annual festival.",
      rail: "Rajahmundry, about 100 km away, is the nearest major railway station.",
      air: "Rajahmundry Airport is the nearest major airport.",
    },
    address: "Sri Lakshmi Narasimha Swamy Vari Devasthanam, Antarvedi, Sakhinetipalli mandal, Dr. B.R. Ambedkar Konaseema district, Andhra Pradesh 533252",
    placeQuery: "Sri Lakshmi Narasimha Swamy Temple Antarvedi",
    faqs: [
      {
        q: "When is the Antarvedi Kalyanam?",
        a: "The Kalyanam is performed on the night before Bhishma Ekadasi in Magha (January–February), and the chariot festival follows on Bhishma Ekadasi; exact dates are announced each year.",
      },
      {
        q: "Which way does the Deity face?",
        a: "The main Deity at Antarvedi faces west instead of east.",
      },
      {
        q: "Is there accommodation at Antarvedi?",
        a: "The district administration lists a TTD choultry at Antarvedi; please confirm availability with the devasthanam in advance.",
      },
    ],
    sources: [
      "https://eastgodavari.ap.gov.in/?p=8403",
      "https://eastgodavari.ap.gov.in/?p=213302",
      "https://konaseema.ap.gov.in/tourism-2/",
      "https://www.thehansindia.com/andhra-pradesh/sri-lakshmi-narasimha-swamy-kalyana-mahotsavam-celebrated-with-great-fervor-at-antarvedi-728933",
      "https://www.deccanchronicle.com/southern-states/andhra-pradesh/arrangements-in-place-for-antarvedi-lakshmi-narasimha-swamy-kalyanotsavam-1933150",
    ],
    check: [
      "Darshan timings (no official source found)",
      "Dating of the present structure (Konaseema portal: 15th–16th century; East Godavari portal mentions a later reconstruction with a 1923 foundation stone; other sources give 1823/1824)",
      "Kalyanam and Rathotsavam dates for the coming year",
      "Road distance and travel time from Visakhapatnam",
      "Nearest airport and distance",
      "Current TTD choultry and contact details",
    ],
  },

  // 11. Vadapalli
  {
    slug: "vadapalli-sri-venkateswara-swamy-temple",
    name: "Vadapalli Sri Venkateswara Swamy Temple",
    shortName: "Vadapalli",
    teluguName: "వాడపల్లి శ్రీ వేంకటేశ్వర స్వామి ఆలయం",
    deity: "Sri Venkateswara Swamy",
    form: "Venkateswara",
    town: "Vadapalli, Atreyapuram mandal",
    state: "Andhra Pradesh",
    district: "Dr. B.R. Ambedkar Konaseema",
    region: "Godavari Districts",
    summary:
      "Sri Venkateswara temple at Vadapalli in the Godavari delta, popularly called the Tirupati of Konaseema, about 10 km from Ravulapalem.",
    history: [
      "Vadapalli is a village in the Godavari delta, about 10 km from Ravulapalem, and its temple of Lord Venkateswara is popularly known as the Tirupati of Konaseema, or Konaseema Tirumala. The Lord is worshipped here with His consorts Sridevi and Bhudevi, and news reports describe it as a centuries-old Vaishnava shrine that draws devotees from across the Godavari districts.",
      "Devotees believe that the Lord is pleased with those who circumambulate the temple eleven times (eleven pradakshinas) and that He fulfils their prayers. The roof around the temple is inscribed with Govinda namas, the names of the Lord.",
      "The main festival is the annual nine-day Brahmotsavam, held around October–November, when the Lord is taken out on a different vahana each day and Srinivasa Kalyanam is performed. The festival ends with Avabhritha Snanam (Chakra Snanam) on the banks of the Gautami Godavari.",
    ],
    highlights: [
      "Popularly called the Tirupati of Konaseema",
      "Lord Venkateswara with Sridevi and Bhudevi",
      "Tradition of eleven pradakshinas around the temple",
      "Nine-day Brahmotsavam ending with a holy bath in the Gautami Godavari",
    ],
    festivals: [
      { name: "Annual Brahmotsavam (with Srinivasa Kalyanam)", when: "Usually October–November; dates are announced each year" },
    ],
    timings: [],
    timingsNote: "Please confirm current timings with the temple before you travel.",
    fromVizag:
      "Vadapalli is in the Konaseema area of the Godavari delta, about 10 km from Ravulapalem; from Visakhapatnam, travel by road or rail towards Rajahmundry and continue by road.",
    howToReach: {
      road: "Vadapalli is about 10 km from Ravulapalem; buses and autos connect the nearby towns.",
      rail: "Rajahmundry (Rajamahendravaram) is the nearest major railway station.",
      air: "Rajahmundry Airport is the nearest airport.",
    },
    address: "Sri Venkateswara Swamy Temple, Vadapalli, Atreyapuram mandal, Dr. B.R. Ambedkar Konaseema district, Andhra Pradesh",
    placeQuery: "Sri Venkateswara Swamy Temple Vadapalli Konaseema",
    faqs: [
      {
        q: "Why is Vadapalli called the Tirupati of Konaseema?",
        a: "Because Lord Venkateswara, the Lord of Tirumala, is worshipped here, and it is the best-known Venkateswara shrine of the Konaseema region.",
      },
      {
        q: "What is the pradakshina tradition at Vadapalli?",
        a: "Devotees believe the Lord is pleased when they circumambulate the temple eleven times with a prayer, and that He fulfils their wishes.",
      },
      {
        q: "When is the Vadapalli Brahmotsavam?",
        a: "The nine-day Brahmotsavam is usually held around October–November; the temple announces the dates each year.",
      },
    ],
    sources: [
      "https://eastgodavari.ap.gov.in/?p=213028",
      "https://www.thehansindia.com/news/cities/rajahmundry/brahmotsavams-at-vadapalli-temple-from-tomorrow-1136674",
      "https://www.thehansindia.com/news/cities/rajahmundry/devotional-fervour-marks-brahmotsavams-1139266",
      "https://www.deccanchronicle.com/southern-states/andhra-pradesh/aptdc-launches-one-day-vijayawadavadapalli-pilgrimage-tour-1976830",
    ],
    check: [
      "Daily darshan timings, including Saturday hours (none published from an official source)",
      "Origin legend of the Deity (red sandalwood Deity floating down the Godavari was removed as unsourced)",
      "Whether a seven-Saturday vow is part of the pradakshina tradition (removed as unsourced)",
      "Kalyanotsavam date outside the Brahmotsavam",
      "Road distance from Visakhapatnam and distances to Rajahmundry station and airport",
      "Mandal (Atreyapuram) and full postal address with PIN code",
    ],
  },

  // 12. Kadiri
  {
    slug: "kadiri-sri-khadri-lakshmi-narasimha-swamy-temple",
    name: "Kadiri Sri Khadri Lakshmi Narasimha Swamy Temple",
    shortName: "Kadiri",
    teluguName: "కదిరి శ్రీ ఖాద్రీ లక్ష్మీ నృసింహ స్వామి ఆలయం",
    deity: "Sri Khadri Lakshmi Narasimha Swamy",
    form: "Narasimha",
    town: "Kadiri",
    state: "Andhra Pradesh",
    district: "Sri Sathya Sai",
    region: "Rayalaseema",
    summary:
      "Kadiri temple of Lord Narasimha in Sri Sathya Sai district, one of the renowned shrines of Rayalaseema, known for its great Rathotsavam.",
    history: [
      "The temple of Sri Lakshmi Narasimha Swamy at Kadiri is described by the district administration as one of the renowned shrines of Rayalaseema. According to temple tradition, after Lord Narasimha killed Hiranyakashipu His anger did not subside and He roamed the forests, until Prahlada and other devotees prayed to Him and He became calm at this place. Devotees believe the Lord emerged from the roots of a khadri tree and blessed Prahlada here, and the temple was later built around that spot. Another local account says the demigods worshipped the Lord on the nearby hill called Stotradri.",
      "The temple stands in a large square compound with high walls and a gopuram over each of its four entrances. Most of its inscriptions date from the Vijayanagara period, when the four rajagopurams were built.",
      "The annual Brahmotsavam, with the Lord's Kalyanotsavam and the Rathotsavam, is held in February–March, when lakhs of devotees from Andhra Pradesh, Karnataka, Telangana and Tamil Nadu gather and pull the great chariot through the town with long ropes. By a centuries-old custom, local Muslims offer pepper to the Lord on Rathotsavam day.",
    ],
    highlights: [
      "Lord Narasimha believed to have emerged from the roots of a khadri tree",
      "Four gopurams; inscriptions mostly from the Vijayanagara period",
      "Rathotsavam in February–March draws lakhs of devotees",
      "Centuries-old custom of local Muslims offering pepper on Rathotsavam day",
    ],
    festivals: [
      { name: "Annual Brahmotsavam, Kalyanotsavam and Rathotsavam", when: "February–March; dates are announced each year" },
    ],
    timings: [],
    timingsNote: "Please confirm current timings with the temple before you travel.",
    fromVizag:
      "Kadiri is in Rayalaseema, far from Visakhapatnam; it is about 44 km from Puttaparthi and 176 km from Bengaluru, so most pilgrims from Vizag travel by train or air towards Puttaparthi, Tirupati or Bengaluru and continue by road.",
    howToReach: {
      road: "Kadiri is well connected by road; it is about 44 km from Puttaparthi and 176 km from Bengaluru.",
      rail: "Please check current train services to Kadiri before you travel.",
      air: "Kempegowda International Airport, Bengaluru (Devanahalli), is about 151 km away.",
    },
    address: "Sri Khadri Lakshmi Narasimha Swamy Temple, Kadiri, Sri Sathya Sai district, Andhra Pradesh",
    placeQuery: "Sri Lakshmi Narasimha Swamy Temple Kadiri",
    faqs: [
      {
        q: "When is the Kadiri Rathotsavam?",
        a: "The chariot festival is held every year in February or March as part of the annual Brahmotsavam; the exact dates are announced each year.",
      },
      {
        q: "Where can I stay in Kadiri?",
        a: "The district administration lists a government R&B guest house and many private hotels in Kadiri town.",
      },
    ],
    sources: [
      "https://srisathyasai.ap.gov.in/?p=2805",
      "https://www.deccanchronicle.com/nation/current-affairs/130323/all-set-for-kadiri-rathotsavam-5-lakh-devotees-expected.html",
      "https://www.deccanchronicle.com/nation/in-other-news/040323/kadiri-narasimha-temple-holds-celestial-wedding.html",
    ],
    check: [
      "Daily darshan timings (none from an official source)",
      "Removed as unsourced: Bukka Raya's role, the 'perspiring Deity' tradition, and the description of the Deity's iconography",
      "Railway station and train services at Kadiri",
      "Road distance from Visakhapatnam",
      "PIN code (515591 was listed earlier; not verified)",
      "Official temple website, if any",
    ],
  },

  // 13. Ramatheertham
  {
    slug: "ramatheertham-sri-rama-temple-vizianagaram",
    name: "Ramatheertham Sri Rama Temple",
    shortName: "Ramatheertham",
    teluguName: "రామతీర్థం శ్రీ సీతారామ స్వామి ఆలయం",
    deity: "Sri Ramachandra Swamy (with Sita and Lakshmana)",
    form: "Rama",
    town: "Ramatheertham, Nellimarla mandal",
    state: "Andhra Pradesh",
    district: "Vizianagaram",
    region: "North Coastal Andhra",
    summary:
      "Sri Rama kshetra near Vizianagaram, with the Ramachandra Swamy temple below and the Kodanda Rama temple on Bodikonda hill.",
    history: [
      "Ramatheertham, in Nellimarla mandal of Vizianagaram district, is held sacred because of its traditional connection with Lord Sri Rama; several spots around the village are associated with Him. In the Ramachandra Swamy temple, the Deities of Rama, Sita and Lakshmana are adorned with silver kavachas. A lake lies near the temple, and a Rama Stambham installed by Pedda Jeeyar stands in the complex.",
      "The site is formed by three parallel hill ranges. On Bodikonda, the southernmost, are places associated with Lord Rama and the Kodanda Rama temple on the hilltop. After the idol of Lord Rama there was vandalised in December 2020, the state government rebuilt the hill temple, and new idols of Rama, Sita and Lakshmana were consecrated in April 2022. The hills also preserve Jain caves and sculptures and the remains of a large Buddhist monastery, showing that the area has been a religious centre for a very long time.",
      "Sri Rama Navami and Vaikuntha Ekadasi are celebrated with great devotion, and a giri pradakshina (circumambulation of the hill) is held on Vaikuntha Ekadasi.",
    ],
    highlights: [
      "Ramachandra Swamy temple with Rama, Sita and Lakshmana in silver kavachas",
      "Kodanda Rama temple on Bodikonda hill, rebuilt and reconsecrated in 2022",
      "Giri pradakshina on Vaikuntha Ekadasi",
      "Jain and Buddhist remains on the surrounding hills",
      "About 70 km from Visakhapatnam",
    ],
    festivals: [
      { name: "Sri Rama Navami", when: "Chaitra Shukla Navami, March–April" },
      { name: "Vaikuntha Ekadasi with giri pradakshina", when: "December–January" },
    ],
    timings: [
      { label: "Temple open (Vizianagaram district portal)", time: "6:00 AM – 7:00 PM" },
    ],
    timingsNote: "Please confirm current timings with the temple before you travel.",
    fromVizag:
      "Ramatheertham is about 70 km from Visakhapatnam by road via Vizianagaram, and an easy day trip from the city.",
    howToReach: {
      road: "Buses and autos run from Vizianagaram to Ramatheertham.",
      rail: "Vizianagaram railway station is the nearest major station, about 15 km away.",
      air: "Visakhapatnam Airport is the nearest airport.",
    },
    address: "Sri Ramachandra Swamy Temple, Ramatheertham, Nellimarla mandal, Vizianagaram district, Andhra Pradesh",
    placeQuery: "Sri Rama Temple Ramatheertham Vizianagaram",
    faqs: [
      {
        q: "Can I visit Ramatheertham as a day trip from Vizag?",
        a: "Yes. It is about 70 km from Visakhapatnam via Vizianagaram and can be covered in a day.",
      },
      {
        q: "What are the temple timings?",
        a: "The Vizianagaram district portal lists the temple as open from 6:00 AM to 7:00 PM. Please confirm with the temple before you travel.",
      },
      {
        q: "When is the most festive time to visit?",
        a: "Sri Rama Navami and Vaikuntha Ekadasi, when a giri pradakshina of the hill is also held.",
      },
    ],
    sources: [
      "https://vizianagaram.ap.gov.in/?p=37864",
      "https://www.deccanchronicle.com/nation/in-other-news/260422/idols-consecrated-atop-400-year-old-ram-temple.html",
    ],
    check: [
      "Official name and Telugu name of the main temple (district portal calls it the Ramachandra Swamy temple)",
      "Removed as unsourced: Deities found in a pond, Rama passing through during exile, Pusapati family patronage, Nitya Kalyanam time",
      "Current timings (6 AM – 7 PM from district portal) and hilltop temple hours",
      "Nature of the climb to the Bodikonda hilltop temple",
      "PIN code (535218 was listed earlier; not verified)",
    ],
  },

  // 14. Vontimitta
  {
    slug: "vontimitta-sri-kodandarama-swamy-temple",
    name: "Vontimitta Sri Kodandarama Swamy Temple",
    shortName: "Vontimitta",
    teluguName: "ఒంటిమిట్ట శ్రీ కోదండరామ స్వామి ఆలయం",
    deity: "Sri Kodandarama Swamy (Sita, Rama and Lakshmana)",
    form: "Rama",
    town: "Vontimitta",
    state: "Andhra Pradesh",
    district: "YSR Kadapa",
    region: "Rayalaseema",
    summary:
      "Temple of Sri Kodandarama in Kadapa district, known as Ekasila Nagaram; the state's official Sita Rama Kalyanam is held here under TTD.",
    history: [
      "The Sri Kodandarama Swamy temple at Vontimitta in Kadapa district is popularly called Andhra Ayodhya. The place is also known as Ekasila Nagaram, because the presiding Deities, Sri Rama, Sita Devi and Lakshmana, are carved from a single stone. It is a rare Rama temple without Lord Hanuman in the main shrine.",
      "The temple is a protected monument under the Archaeological Survey of India. It has been administered by Tirumala Tirupati Devasthanams (TTD) since 2015 and is recognised by the state government as a State Temple.",
      "After the bifurcation of Andhra Pradesh, the official state celebration of Sri Rama Navami moved here from Bhadrachalam. The highlight of the annual Brahmotsavam in Chaitra is the Sita Rama Kalyanam, held at night under the moonlight at the Kalyana Vedika, where the state government offers silk robes and talambralu (sacred rice) to the divine couple.",
    ],
    highlights: [
      "Sita, Rama and Lakshmana carved from a single stone (Ekasila Nagaram)",
      "Rare Rama temple without Hanuman in the main shrine",
      "State Sita Rama Kalyanam held at night under the moonlight",
      "ASI-protected monument, administered by TTD since 2015",
    ],
    festivals: [
      { name: "Sri Rama Navami Brahmotsavam", when: "Chaitra month, March–April" },
      { name: "Sita Rama Kalyanam (by moonlight)", when: "During the Chaitra Brahmotsavam, near Chaitra Purnima; TTD announces the date each year" },
    ],
    timings: [],
    timingsNote:
      "Please confirm current timings with the temple before you travel; TTD publishes special timings during the Brahmotsavam.",
    fromVizag:
      "Vontimitta is in Kadapa district in Rayalaseema, a long journey from Visakhapatnam; the usual route is by train to Kadapa or Tirupati and then onward by road.",
    howToReach: {
      road: "Vontimitta is in Kadapa district and is reached by road from Kadapa town.",
      rail: "Kadapa is the nearest major railway station.",
      air: "Kadapa Airport and Tirupati Airport are the nearest airports.",
    },
    address: "Sri Kodandarama Swamy Temple, Vontimitta, YSR Kadapa district, Andhra Pradesh",
    placeQuery: "Sri Kodandarama Swamy Temple Vontimitta",
    website: "https://www.tirumala.org",
    faqs: [
      {
        q: "Why is Vontimitta called Ekasila Nagaram?",
        a: "Because the presiding Deities of Sri Rama, Sita and Lakshmana are carved from a single stone.",
      },
      {
        q: "When is the Vontimitta Kalyanam?",
        a: "The Sita Rama Kalyanam is held at night under the moonlight during the Chaitra Brahmotsavam; TTD announces the dates each year.",
      },
      {
        q: "Who manages the Vontimitta temple?",
        a: "Tirumala Tirupati Devasthanams (TTD) has administered the temple since 2015, and it is a protected monument of the Archaeological Survey of India.",
      },
    ],
    sources: [
      "https://www.thehansindia.com/news/cities/tirupathi/9-day-sri-kodandarama-swamy-brahmotsavam-to-begin-today-873018",
      "https://www.thehansindia.com/news/cities/tirupathi/religious-fervour-marks-sita-rama-kalyanam-at-vontimitta-962070",
      "https://www.deccanchronicle.com/southern-states/andhra-pradesh/ontimitta-temple-brahmotsavams-begin-today-1946436",
      "https://www.deccanchronicle.com/southern-states/andhra-pradesh/ttd-to-make-gold-plated-kavachams-for-vontimitta-temple-deities-1976569",
      "https://www.deccanchronicle.com/nation/in-other-news/060423/sita-rama-marriage-held-in-moonlit-night-at-vontimitta.html",
    ],
    check: [
      "Daily darshan timings (none from an official non-festival source)",
      "Removed as unsourced: Vijayanagara/16th-century dating, Vontudu and Mittudu founding legend, Pothana and Annamacharya links, explanation of Hanuman's absence",
      "Exact tithi of the Kalyanam (held near Chaitra Purnima)",
      "Distances from Kadapa, Kadapa Airport, Tirupati and Visakhapatnam",
      "PIN code (516134 was listed earlier; not verified)",
      "A TTD page specific to Vontimitta to use as the website link",
    ],
  },

  // 15. Ryali
  {
    slug: "ryali-sri-jagan-mohini-kesava-swamy-temple",
    name: "Ryali Sri Jagan Mohini Kesava Swamy Temple",
    shortName: "Ryali",
    teluguName: "ర్యాలి శ్రీ జగన్మోహిని కేశవ స్వామి ఆలయం",
    deity: "Sri Jagan Mohini Kesava Swamy",
    form: "Mohini",
    town: "Ryali, Atreyapuram mandal",
    state: "Andhra Pradesh",
    district: "Dr. B.R. Ambedkar Konaseema",
    region: "Godavari Districts",
    summary:
      "Ryali temple where one saligrama Deity shows Lord Kesava in front and Mohini at the back, about 40 km from Rajahmundry.",
    history: [
      "Ryali lies between the Vasishta and Gautami branches of the Godavari, about 40 km from Rajahmundry. Its Deity, Sri Jagan Mohini Kesava Swamy, is a self-manifested black saligrama stone about five feet high, showing Lord Vishnu as Kesava on the front and His Mohini form on the back. Around Him are carved Lakshmi, Bhudevi, Narada, Krishna lifting Govardhana, Adisesha, Garuda and Ganga, and according to temple tradition the Ganga flows from the Lord's feet.",
      "The Srimad Bhagavatam describes how the Lord appeared as Mohini to distribute the nectar to the demigods after the churning of the ocean. According to temple tradition, a flower fell from Mohini's hair at this place, and the village takes its name from the Telugu word for 'fell'.",
      "Temple tradition also holds that in the 11th century, when the area was forest under Chola rule, King Raja Vikrama Deva was told in a dream that the Lord lay underground here; the Deity was found where a nail of his chariot fell, and he built a small temple. The temple was renovated in 1936. The Shiva temple of Sri Uma Kamandaleswara Swamy faces the Vishnu temple.",
    ],
    highlights: [
      "One saligrama Deity: Kesava in front, Mohini at the back",
      "Temple tradition that the Ganga flows from the Lord's feet",
      "Faces the Uma Kamandaleswara Shiva temple",
      "Between the Vasishta and Gautami branches of the Godavari",
    ],
    festivals: [
      { name: "Sri Jagan Mohini Kesava Swamy Kalyanam", when: "Chaitra Shukla Navami to Purnima, March–April" },
      { name: "Sri Venugopala Swamy Kalyanam", when: "Jyeshtha Shukla Ekadasi to Purnima, June" },
      { name: "Sri Krishna Ashtami", when: "Sravana Bahula Ashtami, August" },
      { name: "Bhishma Ekadasi and Mukkoti (Vaikuntha) Ekadasi", when: "As per the Telugu calendar" },
    ],
    timings: [],
    timingsNote: "Please confirm current timings with the temple before you travel.",
    fromVizag:
      "Ryali is about 40 km from Rajahmundry; from Visakhapatnam, travel by road or rail to Rajahmundry and continue by road.",
    howToReach: {
      road: "Ryali is about 40 km from Rajahmundry, 34 km from Amalapuram and 74 km from Kakinada by road.",
      rail: "Rajahmundry (Rajamahendravaram) is the nearest major railway station, about 40 km away.",
      air: "Rajahmundry Airport is the nearest airport.",
    },
    address: "Sri Jagan Mohini Kesava Swamy Temple, Ryali, Atreyapuram mandal, Dr. B.R. Ambedkar Konaseema district, Andhra Pradesh",
    placeQuery: "Sri Jaganmohini Kesava Swamy Temple Ryali",
    faqs: [
      {
        q: "What is unique about the Ryali Deity?",
        a: "A single saligrama stone shows Lord Vishnu as Kesava on the front and as Mohini on the back.",
      },
      {
        q: "Is there accommodation at Ryali?",
        a: "The East Godavari district portal lists a temple choultry and a small guest house; please confirm availability with the temple.",
      },
      {
        q: "When is the main festival?",
        a: "The Lord's Kalyanam, from Chaitra Shukla Navami to Purnima (March–April).",
      },
    ],
    sources: [
      "https://eastgodavari.ap.gov.in/?p=4943",
      "https://vedabase.io/en/library/sb/8/9/",
    ],
    check: [
      "Darshan timings (none from an official source)",
      "Removed as unsourced: constant water at the Lord's feet, village name from the chariot linchpin (the district portal links it to Mohini's flower)",
      "District portal page was last updated in 2017; confirm accommodation and administration details",
      "Current district (Konaseema) and mandal (Atreyapuram) after reorganisation",
      "Distance from Visakhapatnam and from Rajahmundry Airport",
      "Full postal address with PIN code",
    ],
  },
];

import { TEMPLES_MORE } from "./templesDataMore";
import { TEMPLES_MORE2 } from "./templesDataMore2";
import { TEMPLES_MORE3 } from "./templesDataMore3";

/** Guide order: Simhachalam (closest to Vizag) first, then the famous temples of India, then the rest of Andhra Pradesh. */
const FIRST = [
  "simhachalam-varaha-lakshmi-narasimha-temple", "tirumala-sri-venkateswara-swamy-temple", "puri-jagannath-temple",
  "iskcon-mayapur-chandrodaya-mandir", "iskcon-vrindavan-krishna-balaram-mandir", "dwarkadhish-temple-dwarka",
  "kashi-vishwanath-temple-varanasi", "ram-mandir-ayodhya", "kanipakam-varasiddhi-vinayaka-temple", "srirangam-ranganathaswamy-temple",
  "sripuram-golden-temple-vellore", "madurai-meenakshi-amman-temple", "srisailam-mallikarjuna-swamy-temple", "guruvayur-sri-krishna-temple",
  "udupi-sri-krishna-matha", "padmanabhaswamy-temple-thiruvananthapuram", "banke-bihari-temple-vrindavan", "radha-raman-temple-vrindavan",
  "prem-mandir-vrindavan", "krishna-janmabhoomi-mathura", "shrinathji-temple-nathdwara", "badrinath-temple", "kedarnath-temple",
  "somnath-temple-gujarat", "vaishno-devi-katra", "rameswaram-ramanathaswamy-temple", "mahakaleshwar-temple-ujjain",
]
const ALL = [...TEMPLES_AP, ...TEMPLES_MORE, ...TEMPLES_MORE2, ...TEMPLES_MORE3];
export const TEMPLES: Temple[] = [
  ...FIRST.map((s) => ALL.find((t) => t.slug === s)).filter((t): t is Temple => !!t),
  ...ALL.filter((t) => !FIRST.includes(t.slug)),
];
