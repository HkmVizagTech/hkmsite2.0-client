// Vaishnava temples of Andhra Pradesh: pilgrimage guide content.
// Original writing for ISKCON Gambheeram Visakhapatnam (Hare Krishna Movement, Vizag).
// Every entry carries a `check` list of facts the temple team must verify before publishing.
// Timings in particular are taken from commonly published listings and change often.

export type TempleRegion = "North Coastal Andhra" | "Godavari Districts" | "Krishna & Guntur" | "Rayalaseema";

export type Temple = {
  slug: string;
  name: string;
  shortName: string;
  teluguName: string;
  deity: string;
  form: string;
  town: string;
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
  sources: string[];
  check: string[];
};

const STANDARD_NOTE =
  "Timings change on festival days, eclipses and special occasions; please confirm with the devasthanam before you travel.";

export const TEMPLES: Temple[] = [
  // 1. Simhachalam
  {
    slug: "simhachalam-varaha-lakshmi-narasimha-temple",
    name: "Simhachalam Sri Varaha Lakshmi Narasimha Swamy Temple",
    shortName: "Simhachalam",
    teluguName: "సింహాచలం శ్రీ వరాహ లక్ష్మీ నృసింహ స్వామి దేవస్థానం",
    deity: "Sri Varaha Lakshmi Narasimha Swamy",
    form: "Narasimha",
    town: "Simhachalam, Visakhapatnam",
    district: "Visakhapatnam",
    region: "North Coastal Andhra",
    summary:
      "Hilltop shrine of Sri Varaha Lakshmi Narasimha in Visakhapatnam, where the Lord stays covered in sandal paste except on Chandanotsavam day.",
    history: [
      "Simhachalam, the hill of the lion, rises on the north-western edge of Visakhapatnam. Local tradition connects it with Prahlada Maharaja: after the Lord protected him from Hiranyakashipu, Prahlada is said to have asked to see Him in a combined form of Varaha and Narasimha, the two avatars who rescued the earth and His devotee from the two demon brothers. The Deity here is worshipped in that unique combined form, lovingly called Appanna by the people of north coastal Andhra.",
      "For almost the whole year the Lord is kept covered in a thick layer of sandalwood paste, so that He appears like a smooth linga-shaped form. Only on Chandanotsavam day, in the month of Vaisakha, is the paste removed so that pilgrims may see His original form (nija rupa darshan) for a few hours, after which fresh sandal is applied again. Stone inscriptions on the temple walls, many from the Eastern Ganga period, record gifts from kings and devotees over several centuries, and the present stone structure in the Kalinga style is generally dated to around the 13th century.",
      "For followers of Sri Chaitanya Mahaprabhu, Simhachalam is especially dear: the Chaitanya Charitamrita records that Mahaprabhu visited the Lord here, whom it calls Jiyada Nrsimha, during His South India pilgrimage, and offered prayers in ecstatic love. The Kalyana Mandapam, the Kappa Stambham pillar that devotees embrace for blessings, and the Gangadhara spring on the hill are all part of a pilgrim's visit.",
    ],
    highlights: [
      "Lord appears as Varaha and Narasimha in one Deity",
      "Nija rupa darshan only once a year, on Chandanotsavam",
      "Visited by Sri Chaitanya Mahaprabhu (Jiyada Nrsimha)",
      "Kalinga-style stone temple with many old inscriptions",
      "About 16 km from Visakhapatnam city centre",
    ],
    festivals: [
      { name: "Chandanotsavam (nija rupa darshan)", when: "Vaisakha Shukla Tritiya (Akshaya Tritiya), April–May" },
      { name: "Sri Swamy Kalyanotsavam", when: "Chaitra month, March–April" },
      { name: "Giri Pradakshina", when: "Ashadha Purnima, June–July" },
      { name: "Narasimha Jayanti", when: "Vaisakha Shukla Chaturdashi, April–May" },
    ],
    timings: [
      { label: "Suprabhata seva (commonly listed)", time: "about 4:00 AM" },
      { label: "Morning darshan (commonly listed)", time: "about 7:00 AM – 4:00 PM" },
      { label: "Evening darshan (commonly listed)", time: "about 6:00 PM – 9:00 PM" },
    ],
    timingsNote: STANDARD_NOTE,
    fromVizag:
      "Simhachalam is within Visakhapatnam, about 16 km from the city centre; city buses and ghat-road buses run up to the hilltop, or you can drive or take a cab in about 40 minutes.",
    howToReach: {
      road: "Regular APSRTC city buses connect Visakhapatnam to the foot of the hill and up the ghat road to the temple.",
      rail: "Visakhapatnam Junction is about 16 km away, and the small Simhachalam station lies at the foot of the hill.",
      air: "Visakhapatnam Airport is roughly 12–15 km from the temple.",
    },
    address: "Sri Varaha Lakshmi Narasimha Swamy Devasthanam, Simhachalam, Visakhapatnam, Andhra Pradesh 530028",
    placeQuery: "Sri Varaha Lakshmi Narasimha Swamy Temple Simhachalam Visakhapatnam",
    faqs: [
      {
        q: "When can I see the original form of Simhachalam Narasimha Swamy?",
        a: "Only on Chandanotsavam day, which falls on Akshaya Tritiya in Vaisakha (April or May). On all other days the Lord is covered in sandal paste.",
      },
      {
        q: "Is there a dress code at Simhachalam?",
        a: "Traditional Indian dress is recommended and is generally expected for paid sevas. Please check the devasthanam's current rules before your visit.",
      },
      {
        q: "How long does darshan take?",
        a: "On ordinary weekdays darshan can take under an hour; on weekends, Ekadasi and festival days the queues can take several hours.",
      },
      {
        q: "Where can I stay near Simhachalam?",
        a: "Most pilgrims stay in Visakhapatnam city, which has a wide range of hotels; the devasthanam also runs some guest rooms on the hill, which should be confirmed in advance.",
      },
    ],
    sources: [
      "https://en.wikipedia.org/wiki/Varaha_Lakshmi_Narasimha_temple,_Simhachalam",
      "https://www.thehansindia.com/news/cities/visakhapatnam/darshan-timings-at-simhachalam-extended-688687",
      "https://www.hindu-blog.com/2013/05/simhachalam-temple-timings-sri-varaha.html",
      "https://vedabase.io/en/library/cc/madhya/8/",
    ],
    check: [
      "Current daily timings: published listings conflict (7 AM–4 PM / 6–9 PM vs other splits); confirm suprabhatam and darshan hours with the devasthanam",
      "Official devasthanam website URL (not included)",
      "Dating of the present structure (13th century, Eastern Ganga) and inscription details",
      "Exact dates/months of Kalyanotsavam and Giri Pradakshina",
      "Dress code rules currently enforced",
      "Distances: 16 km from city centre, 12–15 km from airport",
      "Availability of devasthanam cottages/rooms",
      "PIN code 530028",
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
    district: "Tirupati",
    region: "Rayalaseema",
    summary:
      "The hill shrine of Sri Venkateswara on the Seven Hills above Tirupati, one of the most visited Vaishnava temples in the world.",
    history: [
      "Tirumala stands on the Seshachalam range, whose seven peaks are traditionally understood as the coils of Adi Sesha, the serpent bed of Lord Vishnu. According to the Puranic accounts, the Lord came down to this hill as Srinivasa to bless the people of Kali-yuga, married Sri Padmavathi, the daughter of King Akasa Raja, and has stood here ever since as Venkateswara, the Lord of Venkata hill. Devotees see His standing form, with one hand pointing to His lotus feet, as an invitation to take shelter of Him.",
      "The temple is praised in the hymns of the Alwars, the Tamil Vaishnava poet-saints, and its walls carry hundreds of inscriptions from the Pallava, Chola, Pandya and Vijayanagara periods. Sri Ramanujacharya is remembered for organising the system of worship, and the Vijayanagara emperor Krishnadevaraya visited several times and made rich offerings. The saint-composer Annamacharya sang thousands of songs to the Lord here. The sanctum is crowned by the gold-covered Ananda Nilayam vimana.",
      "Sri Chaitanya Mahaprabhu also visited Tirumala and Tirupati during His South India tour, as recorded in the Chaitanya Charitamrita. Today the temple is administered by Tirumala Tirupati Devasthanams (TTD), which also runs free meals (annaprasadam), accommodation and many charities for pilgrims.",
    ],
    highlights: [
      "Lord Venkateswara stands on the Seven Hills (Seshachalam)",
      "Glorified by the Alwars and Annamacharya",
      "Visited by Sri Chaitanya Mahaprabhu on His South India tour",
      "Gold-covered Ananda Nilayam vimana over the sanctum",
      "Administered by Tirumala Tirupati Devasthanams (TTD)",
    ],
    festivals: [
      { name: "Srivari Annual Brahmotsavam", when: "September–October (Navaratri Brahmotsavam in some years as well)" },
      { name: "Vaikuntha Ekadasi (Vaikuntha Dwara darshan)", when: "December–January" },
      { name: "Ratha Saptami", when: "January–February" },
    ],
    timings: [
      { label: "Suprabhatam", time: "about 3:00 AM" },
      { label: "Sarva darshan", time: "through most of the day, in slots; check TTD for the day's schedule" },
      { label: "Ekantha seva (temple closes)", time: "late night, around 1:00–1:30 AM" },
    ],
    timingsNote:
      "Darshan slots, token systems and ticket quotas are changed by TTD from time to time; please check the official TTD website before you travel.",
    fromVizag:
      "Tirumala is roughly 750–800 km from Visakhapatnam. Most pilgrims take an overnight train to Tirupati (around 12–15 hours) and then go up the ghat road by bus or taxi, about 22 km.",
    howToReach: {
      road: "From Tirupati, TTD and APSRTC buses and taxis go up the ghat road to Tirumala, or pilgrims can climb the stone steps from Alipiri or Srivari Mettu.",
      rail: "Tirupati railway station is served by direct trains from Visakhapatnam, and Renigunta Junction is nearby.",
      air: "Tirupati Airport at Renigunta is about 40 km from Tirumala; flights from Visakhapatnam usually need a connection.",
    },
    address: "Sri Venkateswara Swamy Temple, Tirumala, Tirupati district, Andhra Pradesh 517504",
    placeQuery: "Sri Venkateswara Swamy Temple Tirumala",
    website: "https://www.tirumala.org",
    faqs: [
      {
        q: "Is there a dress code for Tirumala darshan?",
        a: "Yes. TTD asks for traditional dress, for example dhoti or kurta-pyjama for men and saree or churidar with dupatta for women, especially for special-entry and seva darshan.",
      },
      {
        q: "How long does darshan take at Tirumala?",
        a: "With a pre-booked special entry or time-slot token it may take two to four hours; free sarva darshan without a token can take much longer on busy days.",
      },
      {
        q: "Where can pilgrims stay?",
        a: "TTD runs guest houses and cottages at Tirumala and Tirupati that can be booked through its official website, and there are many private hotels in Tirupati.",
      },
      {
        q: "Should I visit Tiruchanur first?",
        a: "Many pilgrims by tradition have darshan of Sri Padmavathi Ammavaru at Tiruchanur as part of the Tirumala pilgrimage; it is about 5 km from Tirupati.",
      },
    ],
    sources: [
      "https://www.tirumala.org",
      "https://en.wikipedia.org/wiki/Venkateswara_Temple,_Tirumala",
      "https://vedabase.io/en/library/cc/madhya/9/",
    ],
    check: [
      "Current suprabhatam and ekantha seva times",
      "Current dress code wording from TTD",
      "Brahmotsavam months for the coming year",
      "Distance by road from Visakhapatnam (750–800 km) and train journey time",
      "Whether any direct Visakhapatnam–Tirupati flight currently operates",
      "Airport distance (about 40 km) and ghat road distance (about 22 km)",
      "Official website: tirumala.org vs ttdevasthanams.ap.gov.in for bookings",
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
    district: "Tirupati",
    region: "Rayalaseema",
    summary:
      "Temple of Sri Padmavathi Devi, the eternal consort of Lord Venkateswara, at Tiruchanur on the outskirts of Tirupati.",
    history: [
      "Tiruchanur, also called Alamelu Mangapuram, is the abode of Sri Padmavathi Devi, the divine consort of Lord Venkateswara. According to tradition, Goddess Lakshmi appeared here in a golden lotus in the temple tank, the Padma Sarovaram, and was later united in marriage with Lord Srinivasa. Because of this, devotees regard a visit to the Mother as an important part of the Tirumala pilgrimage, approaching the Lord through her mercy.",
      "The Goddess is seen seated on a lotus, holding lotuses in her upper hands and showing gestures of blessing and protection. The temple complex also has shrines for Sri Krishna with Balarama, Sri Sundararaja Swamy and Sri Suryanarayana Swamy. Like the Tirumala temple, it is managed by Tirumala Tirupati Devasthanams, and it follows a full daily programme of sevas. Friday is regarded as the Goddess's special day, when an elaborate abhishekam is performed and the temple is usually busier than on other weekdays, so pilgrims who prefer a quieter darshan often choose another day.",
      "For Vaishnavas, Sri Padmavathi represents the compassionate nature of the Lord's internal energy, who recommends sincere souls to Him. Her annual Karthika Brahmotsavam ends with Panchami Theertham, when the Goddess's sacred bath takes place in the Padma Sarovaram and thousands of pilgrims bathe in the tank.",
    ],
    highlights: [
      "Abode of Sri Padmavathi, consort of Lord Venkateswara",
      "Padma Sarovaram tank, where the Goddess is said to have appeared",
      "Shrine of Sri Krishna and Balarama in the complex",
      "About 5 km from Tirupati town, managed by TTD",
    ],
    festivals: [
      { name: "Karthika Brahmotsavam with Panchami Theertham", when: "Karthika month, November–December" },
      { name: "Float festival (Teppotsavam)", when: "Usually around May–June" },
      { name: "Varalakshmi Vratam", when: "Sravana month, July–August" },
    ],
    timings: [
      { label: "Suprabhatam (commonly listed)", time: "early morning, around 4:30 AM" },
      { label: "Temple closes (commonly listed)", time: "about 9:00 PM" },
    ],
    timingsNote:
      "Timings differ on Fridays and festival days, and there is usually a midday break; please check the TTD website before you travel.",
    fromVizag:
      "Tiruchanur is about 5 km from Tirupati, which is roughly 750 km from Visakhapatnam; the overnight train to Tirupati followed by a short auto or bus ride is the usual route.",
    howToReach: {
      road: "Local buses, autos and taxis run frequently between Tirupati town and Tiruchanur, about 5 km away.",
      rail: "Tirupati railway station is the nearest major station, with direct trains from Visakhapatnam.",
      air: "Tirupati Airport at Renigunta is roughly 15 km away.",
    },
    address: "Sri Padmavathi Ammavari Temple, Tiruchanur, Tirupati, Andhra Pradesh 517503",
    placeQuery: "Sri Padmavathi Ammavari Temple Tiruchanur Tirupati",
    website: "https://www.tirumala.org",
    faqs: [
      {
        q: "Should I visit Tiruchanur before or after Tirumala?",
        a: "Customs vary; many pilgrims visit the Mother first or on the same trip. What matters most is to have her darshan as part of the pilgrimage.",
      },
      {
        q: "Is there a dress code?",
        a: "Traditional dress is advised, as at other TTD temples; please confirm the current rules with TTD.",
      },
      {
        q: "How long does darshan take?",
        a: "On ordinary days darshan usually takes under an hour, but Fridays, holidays and Brahmotsavam days are much busier.",
      },
    ],
    sources: [
      "https://www.tirumala.org/PatAtThiruchanoorSevas.aspx",
      "https://en.wikipedia.org/wiki/Padmavathi_Temple",
      "https://www.inkl.com/news/darshan-timings-changed-at-tiruchanur-temple",
    ],
    check: [
      "Suprabhatam time (listings vary between 3:30 AM on Fridays, 4:30 AM and 5:30 AM)",
      "Sarva darshan hours and the midday break",
      "Teppotsavam month",
      "Names of sub-shrines in the complex",
      "Airport distance (about 15 km)",
      "PIN code 517503",
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
    district: "Tirupati",
    region: "Rayalaseema",
    summary:
      "Large temple in the heart of Tirupati town where the Lord rests on Adi Sesha as Sri Govindaraja, linked by tradition to Sri Ramanujacharya.",
    history: [
      "The Sri Govindaraja Swamy temple is the great temple of Tirupati town itself, a short walk from the railway station. Here the Lord is worshipped in a reclining form on Adi Sesha, and devotees affectionately regard Him as the elder brother of Lord Venkateswara. Tradition holds that Sri Ramanujacharya consecrated the Deity in the 12th century (often given as 1130 CE), and that the town of Tirupati grew up around this temple.",
      "Before Govindaraja was installed, the main Deity here is said to have been Sri Parthasarathy, Krishna as the chariot driver of Arjuna, whose shrine remains within the complex. The temple was enlarged over the centuries, and its towering eastern gopuram, built in the Vijayanagara period, is one of the landmarks of Tirupati. Inside there are shrines of the Alwars, Sri Andal and Sri Ramanuja. The temple is also an important centre of the Sri Vaishnava tradition in Tirupati, where the Tamil hymns of the Alwars, the Divya Prabandham, are recited as part of the worship, and the daily programme follows the traditional Vaikhanasa or Pancharatra pattern of the region's great temples.",
      "Many pilgrims visit Govindaraja Swamy when they come for Tirumala darshan. The temple is managed by Tirumala Tirupati Devasthanams and celebrates its own annual Brahmotsavam with processions through the streets around the temple.",
    ],
    highlights: [
      "Reclining Lord Govindaraja on Adi Sesha",
      "Consecrated, by tradition, by Sri Ramanujacharya",
      "Shrine of Sri Parthasarathy (Krishna) within the complex",
      "Tall Vijayanagara-era gopuram near Tirupati railway station",
    ],
    festivals: [
      { name: "Annual Brahmotsavam", when: "Usually around May–June (Vaisakha)" },
      { name: "Float festival (Teppotsavam)", when: "Usually February–March" },
      { name: "Vaikuntha Ekadasi", when: "December–January" },
    ],
    timings: [
      { label: "Temple opens (commonly listed)", time: "about 5:00 AM" },
      { label: "Temple closes (commonly listed)", time: "about 9:00 PM, with breaks for sevas" },
    ],
    timingsNote: STANDARD_NOTE,
    fromVizag:
      "The temple is in central Tirupati, roughly 750 km from Visakhapatnam; take a train to Tirupati and walk or take an auto from the station.",
    howToReach: {
      road: "The temple is in the centre of Tirupati town, within easy reach of the main bus stand by auto or taxi.",
      rail: "Tirupati railway station is a few minutes' walk from the temple.",
      air: "Tirupati Airport at Renigunta is roughly 15 km away.",
    },
    address: "Sri Govindaraja Swamy Temple, Tirupati, Andhra Pradesh 517501",
    placeQuery: "Sri Govindaraja Swamy Temple Tirupati",
    website: "https://www.tirumala.org",
    faqs: [
      {
        q: "How far is the Govindaraja Swamy temple from Tirupati railway station?",
        a: "It is very close, usually a short walk of a few minutes.",
      },
      {
        q: "How long does darshan take?",
        a: "On most days darshan is quick, often within 30–60 minutes, but festival days are busier.",
      },
      {
        q: "Is there a dress code?",
        a: "Traditional, modest dress is advised, as at other TTD temples.",
      },
    ],
    sources: [
      "https://en.wikipedia.org/wiki/Govindaraja_Temple,_Tirupati",
      "https://www.incredibleindia.gov.in/en/andhra-pradesh/tirupati/sri-govindaraja-swamy-temple",
      "https://trawell.in/andhra/tirupati/govindaraja-swami-temple",
    ],
    check: [
      "Consecration year 1130 CE (traditional date)",
      "Worship tradition followed (Vaikhanasa vs Pancharatra); wording kept general",
      "Account of Sri Parthasarathy as earlier presiding Deity",
      "Brahmotsavam month (stated as Vaisakha, May–June; not confirmed by an official source)",
      "Teppotsavam month",
      "Daily opening/closing times and break times",
      "PIN code 517501",
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
    district: "Kakinada",
    region: "Godavari Districts",
    summary:
      "Ratnagiri hill temple of Sri Satyanarayana Swamy at Annavaram, famous across Andhra for the Satyanarayana Vratam performed by families.",
    history: [
      "Annavaram sits on Ratnagiri hill beside the Pampa river, on the main road and railway between Visakhapatnam and Rajahmundry. The Lord here is Sri Veera Venkata Satyanarayana Swamy, Lord Vishnu worshipped as the giver of truth and fulfilment of sincere vows. Local tradition says the Deity revealed Himself to a pious landholder in a dream, and the self-manifested form was found on the hill and installed in the late 19th century.",
      "The main Deity is unusual: the Lord stands together with His consort Sri Anantha Lakshmi, and Lord Shiva is also present, while the structure beneath is understood to represent Brahma, so that the shrine is often described as embodying the Trimurti, with Lord Vishnu at the centre. The temple building itself is designed to look like a chariot, with wheels carved at its base.",
      "Annavaram is best known for the Sri Satyanarayana Swamy Vratam, the worship described in the Skanda Purana. Newly married couples and families come in large numbers to perform the vratam in the temple's halls, and the devasthanam conducts many batches every day. For Vaishnavas it is a reminder that the Lord is satisfied by sincere devotion and truthful living. Many pilgrims travelling along the coast stop here for darshan on the way to or from Visakhapatnam.",
    ],
    highlights: [
      "Hilltop temple on Ratnagiri beside the Pampa river",
      "Main centre for Sri Satyanarayana Vratam in Andhra Pradesh",
      "Temple built in the shape of a chariot",
      "On the Visakhapatnam–Rajahmundry highway and rail line",
    ],
    festivals: [
      { name: "Sri Swamy Kalyana Mahotsavam", when: "Vaisakha month, April–May" },
      { name: "Karthika month celebrations and Giri Pradakshina", when: "October–November" },
      { name: "Devi Navaratri", when: "September–October" },
    ],
    timings: [
      { label: "Suprabhata seva (commonly listed)", time: "about 3:30 AM" },
      { label: "Sarva darshan (commonly listed)", time: "about 6:00 AM – 12:30 PM and 1:00 PM – 9:00 PM" },
      { label: "Satyanarayana Vratam batches begin", time: "from about 6:00 AM" },
    ],
    timingsNote: STANDARD_NOTE,
    fromVizag:
      "Annavaram is about 120 km from Visakhapatnam, roughly 2.5–3 hours by road on NH16, and many express and passenger trains stop at Annavaram station.",
    howToReach: {
      road: "APSRTC buses on the Visakhapatnam–Rajahmundry route stop at Annavaram, and devasthanam buses go up the hill.",
      rail: "Annavaram railway station on the Visakhapatnam–Vijayawada line is close to the foot of the hill.",
      air: "Rajahmundry Airport is roughly 80 km away and Visakhapatnam Airport about 120 km away.",
    },
    address: "Sri Veera Venkata Satyanarayana Swamy Devasthanam, Ratnagiri, Annavaram, Kakinada district, Andhra Pradesh 533406",
    placeQuery: "Sri Veera Venkata Satyanarayana Swamy Temple Annavaram",
    faqs: [
      {
        q: "Can we perform the Satyanarayana Vratam at Annavaram?",
        a: "Yes. The devasthanam conducts the vratam in batches through the day for a fee; tickets are available at the temple and may also be booked online.",
      },
      {
        q: "How long should I plan for a visit?",
        a: "Darshan alone may take one to two hours; with the vratam, plan for half a day.",
      },
      {
        q: "Is there accommodation at Annavaram?",
        a: "The devasthanam runs choultries and cottages on the hill; booking ahead is advised on auspicious days.",
      },
      {
        q: "Is there a dress code?",
        a: "Traditional dress is recommended, especially for couples performing the vratam.",
      },
    ],
    sources: [
      "https://en.wikipedia.org/wiki/Annavaram_temple",
      "https://gokshetra.com/annavaram-satyanarayana-swamy-temple-darshan-guide",
      "https://assets.thehansindia.com/andhra-pradesh/kakinada-annavaram-temple-opens-from-6-am-to-10-am-629971",
    ],
    check: [
      "Date and story of the Deity's installation (late 19th century, often given as 1891)",
      "Description of Trimurti form and consort's name (Sri Anantha Lakshmi)",
      "Darshan and suprabhatam timings",
      "Kalyana Mahotsavam date (Vaisakha Ekadasi?)",
      "Official devasthanam website and online booking portal",
      "Distance from Rajahmundry Airport (about 80 km)",
      "PIN code 533406",
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
    district: "Nandyal",
    region: "Rayalaseema",
    summary:
      "Forest kshetra in the Nallamala hills with nine shrines of Lord Narasimha, held to be where He appeared to protect Prahlada.",
    history: [
      "Ahobilam lies in the Nallamala forest and is revered as the place where Lord Narasimha appeared from a pillar to protect Prahlada and end the tyranny of Hiranyakashipu. Tradition says that the demigods, seeing the Lord's fierce form, cried out 'Aho balam', 'what strength', and from this the name Ahobilam is explained. A sheer rock cleft on the hill, called the Ugra Stambham, is pointed out as the pillar from which He emerged.",
      "The kshetra has two main temples: Lower Ahobilam, with Sri Prahlada Varada Lakshmi Narasimha, and Upper Ahobilam, about 8 km up the hill, with the cave shrine of Sri Ahobila Narasimha. Around them are nine shrines of the Lord in different moods, the Nava Narasimhas: Jwala, Ahobila, Malola, Kroda, Karanja, Bhargava, Yogananda, Chatravata and Pavana. Several are reached only by forest paths or jeep tracks, and the Bhavanasini stream flows through the valley. The worship is traditionally associated with the Ahobila Mutt, a Sri Vaishnava monastic lineage.",
      "For followers of Sri Chaitanya, Ahobilam is also a place His lotus feet touched: the Chaitanya Charitamrita mentions His visit to Ahovala Nrsimha during His South India pilgrimage. Pilgrims usually spend at least a full day to see the main shrines.",
    ],
    highlights: [
      "Nine shrines of Lord Narasimha in one forest valley",
      "Ugra Stambham, the rock pillar linked to the Lord's appearance",
      "Lower and Upper Ahobilam temples about 8 km apart",
      "Mentioned in the Chaitanya Charitamrita (Ahovala Nrsimha)",
    ],
    festivals: [
      { name: "Annual Brahmotsavam", when: "Phalguna month, February–March" },
      { name: "Narasimha Jayanti", when: "Vaisakha Shukla Chaturdashi, April–May" },
      { name: "Sankranti Parveta Utsavam (Deity visits nearby villages)", when: "January onwards" },
    ],
    timings: [
      { label: "Lower Ahobilam (commonly listed)", time: "about 6:30 AM – 1:00 PM and 3:00 PM – 8:00 PM" },
      { label: "Upper Ahobilam (commonly listed)", time: "about 7:00 AM – 1:00 PM and 2:00 PM – 7:00 PM" },
      { label: "Forest shrines", time: "daylight hours only; access depends on season and forest rules" },
    ],
    timingsNote:
      "Timings of the forest shrines depend on weather and access; please confirm with the temple office at Lower Ahobilam before you travel, and avoid trekking after dark.",
    fromVizag:
      "Ahobilam is roughly 700–750 km from Visakhapatnam. A practical route is an overnight train to Nandyal or Kurnool, then road travel of about 70–110 km via Allagadda.",
    howToReach: {
      road: "Buses and taxis run from Nandyal and Allagadda to Lower Ahobilam; local jeeps take pilgrims to the hill shrines.",
      rail: "Nandyal railway station, about 70 km away, is the most convenient railhead.",
      air: "Kurnool (Orvakal) Airport is roughly 120 km away; Hyderabad and Tirupati airports are further.",
    },
    address: "Sri Lakshmi Narasimha Swamy Devasthanam, Ahobilam, Allagadda mandal, Nandyal district, Andhra Pradesh 518543",
    placeQuery: "Sri Prahlada Varada Lakshmi Narasimha Swamy Temple Lower Ahobilam",
    faqs: [
      {
        q: "How much time is needed to see all nine Narasimha shrines?",
        a: "Most pilgrims need one and a half to two days, as several shrines involve trekking or jeep rides through the forest.",
      },
      {
        q: "Is the Ahobilam trek difficult?",
        a: "Some paths, especially to Jwala and Pavana Narasimha, are steep and rocky; elderly pilgrims may prefer to see the main temples and the shrines reachable by vehicle.",
      },
      {
        q: "What is the best time to visit Ahobilam?",
        a: "The cooler months from October to February are most comfortable; the monsoon can make forest paths slippery.",
      },
      {
        q: "Where can I stay?",
        a: "There is limited accommodation at Lower Ahobilam, including guest houses run by the temple and mutts; book in advance where possible.",
      },
    ],
    sources: [
      "https://en.wikipedia.org/wiki/Ahobilam",
      "https://www.holidify.com/places/anantapur/ahobilam-temple-sightseeing-4064.html",
      "https://vedabase.io/en/library/cc/madhya/9/",
    ],
    check: [
      "Darshan timings for Lower and Upper Ahobilam",
      "Brahmotsavam month (Phalguna) and Parveta utsavam details",
      "Role of Ahobila Mutt in temple administration",
      "Road distance from Visakhapatnam (700–750 km) and from Nandyal (about 70 km)",
      "Kurnool Airport distance (about 120 km)",
      "Forest access rules for Pavana Narasimha and other shrines",
      "PIN code 518543",
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
    district: "Guntur",
    region: "Krishna & Guntur",
    summary:
      "Hill shrine at Mangalagiri where Lord Narasimha accepts panakam, sweet jaggery water, offered through His open mouth.",
    history: [
      "Mangalagiri, the auspicious hill, lies between Vijayawada and Guntur. Halfway up the hill is the shrine of Sri Panakala Narasimha Swamy, where there is no full-sized Deity but an opening in the rock in the form of the Lord's open mouth. Devotees offer panakam, a drink of jaggery water flavoured with spices, which the priest pours into the mouth. Pilgrims observe that the Lord seems to accept about half of whatever is offered, and the rest is returned as prasadam, and that ants are not seen despite so much sweet liquid on the hill.",
      "The local legend tells that Lord Narasimha slew the demon Namuchi here, and that the hill itself resembles an elephant. At the foot of the hill stands the temple of Sri Lakshmi Narasimha Swamy with a very tall gopuram, raised in the early 19th century under the patronage of a local ruler, Raja Vasireddy Venkatadri Naidu. A third shrine of the Lord's consort, Sri Rajyalakshmi, is found on top of the hill.",
      "Because panakam is offered only during the day, the hill shrine closes by mid-afternoon, while the lower temple stays open into the evening. For pilgrims, the simple offering of sweet water is a beautiful lesson that the Lord accepts even the humblest gift offered with love.",
    ],
    highlights: [
      "Lord Narasimha accepts panakam (jaggery water) at the hill shrine",
      "Tall gopuram of the lower Lakshmi Narasimha temple",
      "Between Vijayawada and Guntur, about 12 km from Vijayawada",
      "Hill shrine closes by mid-afternoon",
    ],
    festivals: [
      { name: "Annual Brahmotsavam", when: "Phalguna month, February–March" },
      { name: "Narasimha Jayanti", when: "Vaisakha Shukla Chaturdashi, April–May" },
      { name: "Vaikuntha Ekadasi", when: "December–January" },
    ],
    timings: [
      { label: "Panakala Swamy hill shrine (commonly listed)", time: "about 7:00 AM – 3:00 PM" },
      { label: "Lower Lakshmi Narasimha temple", time: "morning and evening; confirm hours locally" },
    ],
    timingsNote:
      "The hill shrine closes in the afternoon and panakam offerings may be restricted on festival days; please confirm with the devasthanam before you travel.",
    fromVizag:
      "Mangalagiri is about 360–380 km from Visakhapatnam. Trains to Vijayawada take around 5–7 hours, and the temple is about 12 km further by road.",
    howToReach: {
      road: "Buses and autos run frequently from Vijayawada and Guntur to Mangalagiri on NH16.",
      rail: "Mangalagiri has a small station on the Vijayawada–Guntur line; Vijayawada Junction has far more trains.",
      air: "Vijayawada Airport at Gannavaram is roughly 30 km away.",
    },
    address: "Sri Panakala Lakshmi Narasimha Swamy Temple, Mangalagiri, Guntur district, Andhra Pradesh 522503",
    placeQuery: "Sri Panakala Lakshmi Narasimha Swamy Temple Mangalagiri",
    faqs: [
      {
        q: "What is panakam and can pilgrims offer it?",
        a: "Panakam is a sweet drink of jaggery and water. Pilgrims can buy an offering ticket at the hill shrine and the priest offers it to the Lord.",
      },
      {
        q: "What time should I reach Mangalagiri?",
        a: "Go in the morning, since the Panakala Swamy shrine on the hill closes by mid-afternoon.",
      },
      {
        q: "How do I reach the hill shrine?",
        a: "There are steps and a road up the hill; the climb by steps is moderate and usually takes 20–30 minutes.",
      },
    ],
    sources: [
      "https://en.wikipedia.org/wiki/Lakshmi_Narasimha_Temple,_Mangalagiri",
      "https://hindupad.com/mangalagiri-temple-timings-opening-closing-times-of-mangalagiri-temples/",
      "https://www.bhaktikalpa.com/india_temple_details.aspx?id=7808",
    ],
    check: [
      "Panakala Swamy closing time (3:00 PM vs 3:30 PM in listings)",
      "Lower temple timings",
      "Gopuram builder and date (Raja Vasireddy Venkatadri Naidu, early 19th century)",
      "Name of the hilltop consort shrine (Sri Rajyalakshmi)",
      "Brahmotsavam month",
      "Distance from Visakhapatnam (360–380 km) and from Vijayawada (about 12 km)",
      "Duration of the step climb",
      "PIN code 522503",
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
    district: "Eluru",
    region: "Godavari Districts",
    summary:
      "Chinna Tirupati: hill temple of Sri Venkateswara near Eluru, named after the sage Dwaraka who found the self-manifested Deity.",
    history: [
      "Dwaraka Tirumala, lovingly called Chinna Tirupati, is a hill temple of Lord Venkateswara in Eluru district. Its name comes from the sage Dwaraka, who according to tradition performed long penance here and discovered the self-manifested Deity inside an anthill. Only the upper half of this original form is visible, as the Lord's feet are understood to remain in the earth for the devotion of Bali Maharaja in the lower worlds.",
      "Tradition says that a full standing Deity of the Lord was later installed behind the original form so that devotees could also worship His lotus feet; this installation is often attributed to Sri Ramanujacharya. Both forms are worshipped together in the sanctum. The temple was supported over the centuries by local rulers and zamindars, and the present complex with its gopurams and mandapams has grown steadily under the AP Endowments Department.",
      "Many families in the Godavari districts fulfil vows here that they had made to the Lord of Tirumala, and the temple observes two Brahmotsavams a year, reflecting the belief that the Lord was found in one season and the full Deity installed in another. For devotees from Visakhapatnam it is one of the most accessible Venkateswara temples. Pilgrims usually climb the hill by road or by the steps, and the hilltop setting makes it a peaceful place to spend half a day.",
    ],
    highlights: [
      "Known as Chinna Tirupati (little Tirupati)",
      "Self-manifested upper-half Deity with a full Deity behind",
      "Named after sage Dwaraka, who found the Lord in an anthill",
      "Two Brahmotsavams every year",
    ],
    festivals: [
      { name: "Vaisakha Brahmotsavam", when: "April–May" },
      { name: "Ashwayuja Brahmotsavam", when: "September–October" },
      { name: "Vaikuntha Ekadasi", when: "December–January" },
    ],
    timings: [
      { label: "Suprabhatam (commonly listed)", time: "about 4:00 AM" },
      { label: "Darshan (commonly listed)", time: "about 6:00 AM – 1:00 PM and 3:00 PM – 9:00 PM" },
    ],
    timingsNote: STANDARD_NOTE,
    fromVizag:
      "Dwaraka Tirumala is roughly 270–300 km from Visakhapatnam, about 5–6 hours by road via Rajahmundry; by train, alight at Eluru or Bhimadolu and continue by road.",
    howToReach: {
      road: "Buses run from Eluru (about 40 km) and Rajahmundry to Dwaraka Tirumala, and devasthanam buses climb to the hilltop.",
      rail: "Bhimadolu is the nearest station, roughly 15 km away, while Eluru has many more trains.",
      air: "Rajahmundry Airport and Vijayawada Airport are each roughly 70–100 km away.",
    },
    address: "Sri Venkateswara Swamy Devasthanam, Dwaraka Tirumala, Eluru district, Andhra Pradesh 534426",
    placeQuery: "Sri Venkateswara Swamy Temple Dwaraka Tirumala",
    faqs: [
      {
        q: "Why is Dwaraka Tirumala called Chinna Tirupati?",
        a: "Because Lord Venkateswara is worshipped here as at Tirumala, and many devotees offer vows and hair here when they cannot travel to Tirupati.",
      },
      {
        q: "How long does darshan take?",
        a: "On ordinary days usually under an hour; Saturdays and festival days are much busier.",
      },
      {
        q: "Is accommodation available?",
        a: "The devasthanam runs cottages and choultries; booking in advance is advised for weekends.",
      },
    ],
    sources: [
      "https://en.wikipedia.org/wiki/Dwaraka_Tirumala",
      "https://templesinindiainfo.com/dwaraka-tirumala-temple-timings-darshan-timings-and-seva/",
      "https://traveltriangle.com/blog/dwaraka-tirumala-temple/",
    ],
    check: [
      "Darshan timings and any midday break",
      "Attribution of full Deity installation to Sri Ramanujacharya",
      "Explanation of the half-visible Deity (Bali Maharaja tradition)",
      "Distance from Visakhapatnam (270–300 km), Eluru (about 40 km), Bhimadolu (about 15 km)",
      "Official devasthanam website",
      "PIN code 534426",
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
    district: "Srikakulam",
    region: "North Coastal Andhra",
    summary:
      "Rare temple of Lord Vishnu as Kurma, the tortoise avatar, near Srikakulam; a place linked with Sri Chaitanya Mahaprabhu's pastimes.",
    history: [
      "Srikurmam, near the coast in Srikakulam district, is one of the very few temples in India where Lord Vishnu is worshipped as Kurma, the tortoise avatar who supported Mandara mountain during the churning of the milk ocean. The Deity is a stone form of the tortoise, and unusually the Lord faces west; the temple has two flagstaffs, one at the east and one at the west. The Sweta Pushkarini tank beside the temple is considered sacred.",
      "The temple's stone halls carry fine carvings and inscriptions, many from the Eastern Ganga period, and its outer corridor has rows of carved pillars. Tradition credits Sri Ramanujacharya with confirming the Vaishnava form of worship here, and Sri Narahari Tirtha of the Madhva tradition is also associated with the temple. Within the campus a sanctuary cares for star tortoises.",
      "For Gaudiya Vaishnavas, Kurma-kshetra is a sacred memory: the Chaitanya Charitamrita describes how Sri Chaitanya Mahaprabhu, on His South India tour, stayed at the house of a brahmana named Kurma and then embraced and healed the leper Vasudeva, teaching that sincere chanting of Krishna's names is the essence of religion. Srikurmam is commonly identified as this Kurma-kshetra, and many devotees visit to remember that pastime.",
    ],
    highlights: [
      "Rare temple of the Kurma (tortoise) avatar",
      "Deity faces west; two dhwaja stambhas",
      "Linked to Sri Chaitanya's healing of the leper Vasudeva",
      "Sweta Pushkarini tank and star tortoise sanctuary",
    ],
    festivals: [
      { name: "Dolotsavam", when: "Phalguna Purnima, February–March" },
      { name: "Kurma Jayanti", when: "Usually May–June" },
      { name: "Vaikuntha Ekadasi", when: "December–January" },
    ],
    timings: [
      { label: "Temple open (commonly listed)", time: "about 6:00 AM – 7:45 PM" },
      { label: "Abhishekam (commonly listed)", time: "early morning, about 4:30 – 6:00 AM" },
    ],
    timingsNote:
      "Some listings show a midday break; please confirm current timings with the temple office before you travel.",
    fromVizag:
      "Srikurmam is roughly 120–130 km from Visakhapatnam, about 3 hours by road via Srikakulam; it is about 13–15 km from Srikakulam town.",
    howToReach: {
      road: "Buses and autos run from Srikakulam town to Srikurmam, roughly 13–15 km away.",
      rail: "Srikakulam Road (Amadalavalasa) is the nearest major railway station, roughly 25–30 km away.",
      air: "Visakhapatnam Airport is the nearest, roughly 120 km away.",
    },
    address: "Sri Kurmanatha Swamy Temple, Srikurmam, Gara mandal, Srikakulam district, Andhra Pradesh 532404",
    placeQuery: "Sri Kurmanatha Swamy Temple Srikurmam Srikakulam",
    faqs: [
      {
        q: "What is special about the Srikurmam temple?",
        a: "It is among the few temples in India where Lord Vishnu is worshipped as Kurma, the tortoise avatar, and the Deity faces west.",
      },
      {
        q: "Can I visit Srikurmam and Arasavalli in one day from Vizag?",
        a: "Yes, many pilgrims combine Srikurmam with the Arasavalli Sun temple near Srikakulam in a day trip by road.",
      },
      {
        q: "Is there a dress code?",
        a: "Modest traditional dress is recommended; please follow any instructions from the temple staff.",
      },
    ],
    sources: [
      "https://en.wikipedia.org/wiki/Sri_Kurmam",
      "https://www.bhaktibharat.com/en/mandir/kurmanatha-swamy-temple",
      "https://vedabase.io/en/library/cc/madhya/7/",
    ],
    check: [
      "Darshan timings (6:00 AM – 7:45 PM listed most often; split sessions in other listings)",
      "Kurma Jayanti date/month",
      "Role of Ramanujacharya and Narahari Tirtha",
      "Whether any Chaitanya Mahaprabhu padapitha or memorial exists at Srikurmam",
      "Status of the star tortoise sanctuary",
      "Distance from Srikakulam town and from Srikakulam Road station",
      "PIN code 532404",
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
    district: "Dr. B.R. Ambedkar Konaseema",
    region: "Godavari Districts",
    summary:
      "Temple of Sri Lakshmi Narasimha at Antarvedi, where the Vasishta Godavari meets the Bay of Bengal, famed for its Bhishma Ekadasi Kalyanam.",
    history: [
      "Antarvedi lies at the tip of the Konaseema delta, where the Vasishta branch of the Godavari flows into the Bay of Bengal. The place is associated with the sage Vasishta, and local tradition says Lord Narasimha appeared here at his request to destroy the demon Raktavilochana, whose drops of blood were producing new demons. The Lord is worshipped with Sri Lakshmi seated on His lap, and the Deity faces west towards the river.",
      "The present temple is generally said to have been rebuilt in the 19th century by a local devotee family, though worship at this sacred confluence is much older. The temple has a tall gopuram, and pilgrims bathe at the Sagara Sangamam, the meeting point of river and sea, before darshan. Nearby is a lighthouse and a small shrine of Sri Ashwaroodhamba, regarded as the Lord's protector goddess.",
      "The greatest event of the year is the Kalyana Mahotsavam, the divine wedding of the Lord, held around Bhishma Ekadasi in the month of Magha, followed by the Rathotsavam, when the Deity is taken around in a large wooden chariot. Hundreds of thousands of devotees gather from across the Godavari districts for these days. The temple administration and local volunteers arrange queues and food for the crowds.",
    ],
    highlights: [
      "At the confluence of the Vasishta Godavari and the Bay of Bengal",
      "Deity faces west towards the river",
      "Kalyanam and Rathotsavam around Bhishma Ekadasi",
      "Sagara Sangamam holy bath near the temple",
    ],
    festivals: [
      { name: "Kalyana Mahotsavam and Rathotsavam", when: "Around Bhishma Ekadasi, Magha month, January–February" },
      { name: "Narasimha Jayanti", when: "Vaisakha Shukla Chaturdashi, April–May" },
      { name: "Karthika Purnima sea bath", when: "October–November" },
    ],
    timings: [
      { label: "Darshan (commonly listed)", time: "about 6:00 AM – 1:00 PM and 3:30 PM – 7:30 PM" },
    ],
    timingsNote: STANDARD_NOTE,
    fromVizag:
      "Antarvedi is roughly 260–300 km from Visakhapatnam, about 6–7 hours by road via Rajahmundry and Razole.",
    howToReach: {
      road: "Buses run from Rajahmundry, Amalapuram and Razole to Antarvedi; the last stretch is through the Konaseema countryside.",
      rail: "Narsapur station is the nearest across the river (with a road bridge or ferry connection); Rajahmundry is the nearest major junction.",
      air: "Rajahmundry Airport is roughly 100 km away.",
    },
    address: "Sri Lakshmi Narasimha Swamy Temple, Antarvedi, Sakhinetipalli mandal, Dr. B.R. Ambedkar Konaseema district, Andhra Pradesh 533252",
    placeQuery: "Sri Lakshmi Narasimha Swamy Temple Antarvedi",
    faqs: [
      {
        q: "When is the Antarvedi Kalyanam?",
        a: "The Lord's wedding festival is held around Bhishma Ekadasi in the month of Magha (January–February); exact dates are announced each year by the temple.",
      },
      {
        q: "Can we bathe in the sea at Antarvedi?",
        a: "Pilgrims bathe at the confluence, but currents can be strong; stay in shallow water and follow local instructions.",
      },
      {
        q: "Is there accommodation at Antarvedi?",
        a: "There are some choultries and lodges; more options are available in Razole, Amalapuram or Narsapur.",
      },
    ],
    sources: [
      "https://en.wikipedia.org/wiki/Lakshmi_Narasimha_Temple,_Antarvedi",
      "https://hindupad.com/bhishma-ekadashi-at-antarvedi-narasimha-swamy-temple-in-andhra-pradesh/",
      "https://www.thehansindia.com/andhra-pradesh/sri-lakshmi-narasimha-swamy-kalyana-mahotsavam-celebrated-with-great-fervor-at-antarvedi-728933",
    ],
    check: [
      "Darshan timings (listings vary between 6 AM – 7 PM and split sessions)",
      "Who rebuilt the present temple and when (19th century, local family)",
      "Name and status of Sri Ashwaroodhamba shrine",
      "Exact sequence of Kalyanam and Rathotsavam relative to Bhishma Ekadasi",
      "Narsapur access (bridge/ferry) and distance to Rajahmundry Airport",
      "District name format and PIN code 533252",
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
    district: "Dr. B.R. Ambedkar Konaseema",
    region: "Godavari Districts",
    summary:
      "Konaseema Tirupati: Sri Venkateswara temple at Vadapalli on the Godavari, crowded on Saturdays with devotees doing pradakshinas.",
    history: [
      "Vadapalli is a village on the banks of the Godavari in Atreyapuram mandal of Konaseema, and its temple of Lord Venkateswara is known affectionately as Konaseema Tirupati. Local tradition says the Deity, carved in red sandalwood, came floating down the Godavari and was found by villagers, who installed Him on the river bank. Because of this, the Lord is regarded as having come to the delta by His own will to bless the people there.",
      "The temple grew in popularity in recent decades, and today it draws very large crowds on Saturdays, the day especially dear to Lord Venkateswara. A well-known practice among devotees is to circumambulate the temple eleven times on seven consecutive Saturdays with a prayer in the heart. The complex is maintained under the AP Endowments Department and has been expanded with new halls and queue lines.",
      "Vadapalli is a short distance from Ryali and Ravulapalem, so pilgrims often visit Vadapalli and the Jagan Mohini Kesava temple at Ryali together. The annual Brahmotsavam and Kalyanotsavam are the main festivals, when the Lord is taken out in procession on various vahanas. The calm, green setting of the Godavari delta, with coconut groves and canals all around, adds to the sweetness of the pilgrimage, and many visitors also take a short walk to the river bank after darshan.",
    ],
    highlights: [
      "Popularly called Konaseema Tirupati",
      "Deity said to have come floating down the Godavari",
      "Very large crowds on Saturdays",
      "Close to Ryali and Ravulapalem",
    ],
    festivals: [
      { name: "Kalyanotsavam", when: "Usually Chaitra month, March–April" },
      { name: "Annual Brahmotsavam", when: "Usually October–November" },
      { name: "Vaikuntha Ekadasi", when: "December–January" },
    ],
    timings: [
      { label: "Darshan, Sunday–Friday (commonly listed)", time: "about 6:00 AM – 1:00 PM and 4:00 PM – 8:00 PM" },
      { label: "Saturdays", time: "extended hours from early morning" },
    ],
    timingsNote:
      "Saturday and festival timings are extended and change often; please confirm with the temple office before you travel.",
    fromVizag:
      "Vadapalli is roughly 220–240 km from Visakhapatnam, about 4.5–5 hours by road via Rajahmundry and Ravulapalem.",
    howToReach: {
      road: "Buses and autos run from Ravulapalem (about 10 km) and Rajahmundry to Vadapalli.",
      rail: "Rajahmundry is the nearest major railway station, roughly 35–40 km away.",
      air: "Rajahmundry Airport is roughly 40–50 km away.",
    },
    address: "Sri Venkateswara Swamy Temple, Vadapalli, Atreyapuram mandal, Dr. B.R. Ambedkar Konaseema district, Andhra Pradesh",
    placeQuery: "Sri Venkateswara Swamy Temple Vadapalli Konaseema",
    faqs: [
      {
        q: "Which is the best day to visit Vadapalli?",
        a: "Saturdays are the most auspicious and the most crowded; visit on a weekday if you want a quieter darshan.",
      },
      {
        q: "What is the seven-Saturday vow?",
        a: "Many devotees circumambulate the temple eleven times on seven consecutive Saturdays as an offering of prayer to the Lord.",
      },
      {
        q: "Can I visit Ryali and Vadapalli together?",
        a: "Yes, the two temples are close to each other in Atreyapuram mandal and are easily covered in one trip.",
      },
    ],
    sources: [
      "https://eastgodavari.ap.gov.in/?p=213028",
      "https://gotirupati.com/?p=66467",
      "https://www.thehansindia.com/news/cities/rajahmundry/brahmotsavams-at-vadapalli-temple-from-tomorrow-1136674",
    ],
    check: [
      "Legend of the red sandalwood Deity floating down the Godavari",
      "Date of founding (one source says 1759; not included)",
      "Weekday and Saturday timings",
      "Kalyanotsavam and Brahmotsavam months",
      "Distances from Ravulapalem, Rajahmundry station and airport",
      "Full postal address with PIN code",
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
    district: "Sri Sathya Sai",
    region: "Rayalaseema",
    summary:
      "Kadiri temple of Lord Narasimha, held to have appeared from the roots of a khadri tree, known for its great chariot festival.",
    history: [
      "Kadiri takes its name from the khadri tree. According to local tradition, after slaying Hiranyakashipu, Lord Narasimha's anger did not subside and He wandered through the forests of this region, finally manifesting from the roots of a khadri tree. The self-manifested Deity shows the Lord tearing the demon, with Prahlada standing beside Him in prayer, a reminder that the Lord's fierce form is always for the protection of His devotee.",
      "Temple inscriptions and local histories connect the shrine with the Vijayanagara kings, including Bukka Raya, and it was later supported by other rulers of the region. The temple has large prakaras, gopurams and mandapams typical of the Vijayanagara style. Devotees speak of a special feature: after the abhishekam the Deity appears to perspire, and the priests wipe the Lord's form with cloth.",
      "Kadiri's Brahmotsavam is one of the major festivals of Rayalaseema, and its Rathotsavam draws huge crowds who pull the tall chariot through the town with long ropes. A long-standing local custom is that members of the Muslim community also bring offerings for the Lord on the chariot festival day, a sign of the shrine's place in the whole region's life. Pilgrims often sit for a while in the temple's mandapams after darshan to chant and hear about the Lord.",
    ],
    highlights: [
      "Lord Narasimha with Prahlada, self-manifested near a khadri tree",
      "Vijayanagara-era temple complex",
      "Grand Rathotsavam during the Phalguna Brahmotsavam",
      "Deity said to perspire after the abhishekam",
    ],
    festivals: [
      { name: "Annual Brahmotsavam and Rathotsavam", when: "Phalguna month, February–March" },
      { name: "Narasimha Jayanti", when: "Vaisakha Shukla Chaturdashi, April–May" },
      { name: "Vaikuntha Ekadasi", when: "December–January" },
    ],
    timings: [
      { label: "Morning darshan (commonly listed)", time: "about 6:30 AM – 12:30 PM" },
      { label: "Evening darshan (commonly listed)", time: "about 4:30 PM – 8:30 PM" },
    ],
    timingsNote: STANDARD_NOTE,
    fromVizag:
      "Kadiri is roughly 850–950 km from Visakhapatnam. The practical route is an overnight train to Tirupati or Dharmavaram and then road or rail onward to Kadiri.",
    howToReach: {
      road: "APSRTC buses connect Kadiri with Anantapur, Tirupati, Puttaparthi and Bengaluru.",
      rail: "Kadiri has its own station on the Dharmavaram–Pakala line, with limited trains.",
      air: "Puttaparthi Airport has very limited service; Bengaluru and Tirupati airports are the practical options, roughly 150–200 km away.",
    },
    address: "Sri Khadri Lakshmi Narasimha Swamy Temple, Kadiri, Sri Sathya Sai district, Andhra Pradesh 515591",
    placeQuery: "Sri Lakshmi Narasimha Swamy Temple Kadiri",
    faqs: [
      {
        q: "When is the Kadiri Rathotsavam?",
        a: "The chariot festival takes place during the annual Brahmotsavam in Phalguna (February–March); dates are announced each year.",
      },
      {
        q: "How long does darshan take at Kadiri?",
        a: "On normal days darshan is usually quick, but the Brahmotsavam days are extremely crowded.",
      },
      {
        q: "Where can I stay?",
        a: "Kadiri town has lodges and temple choultries; Puttaparthi and Anantapur have more options.",
      },
    ],
    sources: [
      "https://www.trawell.in/andhra/anantapur/kadiri-lakshmi-narasimha-swamy-temple",
      "https://www.deccanchronicle.com/nation/current-affairs/130323/all-set-for-kadiri-rathotsavam-5-lakh-devotees-expected.html",
      "https://utsav.gov.in/view-event/sri-lakshmi-narasimha-swamy-brahmotsavams-2024-kadiri-sri-sathysa-sai-district-andhra-pradesh",
    ],
    check: [
      "Darshan timings",
      "Role of Bukka Raya and other kings in building the temple",
      "Perspiring Deity tradition (wording)",
      "Brahmotsavam month (Phalguna) and Rathotsavam details",
      "Road distance from Visakhapatnam (850–950 km) and airport options",
      "PIN code 515591",
    ],
  },

  // 13. Ramatheertham
  {
    slug: "ramatheertham-sri-rama-temple-vizianagaram",
    name: "Ramatheertham Sri Rama Temple",
    shortName: "Ramatheertham",
    teluguName: "రామతీర్థం శ్రీ సీతారామ స్వామి ఆలయం",
    deity: "Sri Sita Rama Swamy (with Lakshmana)",
    form: "Rama",
    town: "Ramatheertham, Nellimarla mandal",
    district: "Vizianagaram",
    region: "North Coastal Andhra",
    summary:
      "Ancient Sri Rama kshetra near Vizianagaram, with a temple at the foot of Bodikonda hill and a hilltop shrine linked with Lord Rama.",
    history: [
      "Ramatheertham is a village in Nellimarla mandal, about 12 km from Vizianagaram, set among rocky hills. Local tradition holds that Lord Sri Rama, with Sita Devi and Lakshmana, passed through this area during the forest exile, and the name, the holy waters of Rama, is connected with a sacred pond where, according to one account, the Deities were found. Worship of Sri Rama here is believed to be many centuries old.",
      "There are two places of worship. At the foot of the hill stands the main temple of Sri Sita Rama Swamy, long supported by the Pusapati royal family of Vizianagaram. On the summit of the hill known as Bodikonda stands a shrine of Lord Rama beside a small pond, reached by a climb over rock steps. The surrounding hills also preserve Buddhist and Jain remains, showing that the site has been a sacred centre for a very long time.",
      "For pilgrims from Visakhapatnam, Ramatheertham is an easy day trip, and it is especially lively during Sri Rama Navami, when the divine wedding of Sita and Rama is celebrated, and on Vaikuntha Ekadasi. Pilgrims who climb the hill are rewarded with a wide view of the countryside, and the quiet setting makes it a good place for chanting the holy names of the Lord.",
    ],
    highlights: [
      "Ancient Sri Rama kshetra about 12 km from Vizianagaram",
      "Hilltop Rama shrine on Bodikonda with a sacred pond",
      "Foothill temple supported by the Vizianagaram royal family",
      "Easy day trip from Visakhapatnam",
    ],
    festivals: [
      { name: "Sri Rama Navami Kalyanam", when: "Chaitra Shukla Navami, March–April" },
      { name: "Vaikuntha Ekadasi", when: "December–January" },
    ],
    timings: [
      { label: "Temple open (commonly listed)", time: "about 6:00 AM – 7:00 PM" },
      { label: "Nitya Kalyanam (commonly listed)", time: "morning, about 9:00 – 10:30 AM" },
    ],
    timingsNote: STANDARD_NOTE,
    fromVizag:
      "Ramatheertham is roughly 60–65 km from Visakhapatnam, about 1.5–2 hours by road via Vizianagaram.",
    howToReach: {
      road: "Buses and autos go from Vizianagaram bus station to Ramatheertham, about 12 km away.",
      rail: "Vizianagaram Junction is the nearest major station; Nellimarla station is also nearby.",
      air: "Visakhapatnam Airport is roughly 70 km away.",
    },
    address: "Sri Sita Rama Swamy Temple, Ramatheertham, Nellimarla mandal, Vizianagaram district, Andhra Pradesh 535218",
    placeQuery: "Sri Rama Temple Ramatheertham Vizianagaram",
    faqs: [
      {
        q: "Is the climb to the hilltop shrine difficult?",
        a: "The path to the top of Bodikonda is over rock steps and can be tiring in the heat; go early in the morning and carry water.",
      },
      {
        q: "Can I visit Ramatheertham as a day trip from Vizag?",
        a: "Yes, it is about 60–65 km from Visakhapatnam and can easily be covered in half a day.",
      },
      {
        q: "When is the best time to visit?",
        a: "The cooler months from October to February are pleasant; Sri Rama Navami is the most festive time.",
      },
    ],
    sources: [
      "https://en.wikipedia.org/wiki/Ramateertham",
      "https://vizianagaram.ap.gov.in/?p=37864",
      "https://templesinindiainfo.com/?p=15252",
    ],
    check: [
      "Official name of the foothill temple and its Telugu name",
      "Hill name (Bodikonda vs Bavikonda) and details of the hilltop shrine after recent rebuilding",
      "Legend of the Deities found in a pond",
      "Role of the Pusapati family/trust",
      "Timings (listings vary: 5 AM – 8 PM, 6 AM – 7 PM)",
      "PIN code 535218",
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
    district: "YSR Kadapa",
    region: "Rayalaseema",
    summary:
      "Vijayanagara-era temple of Sri Kodandarama near Kadapa, where Sita, Rama and Lakshmana are carved from one stone; now managed by TTD.",
    history: [
      "Vontimitta, a short drive from Kadapa, is home to one of the grandest Rama temples in South India. The Deities of Sri Rama, Sita Devi and Lakshmana are carved together from a single block of stone, and for this reason the place is sometimes called Ekasila Nagaram. A well-known local feature is that Hanuman is not present beside the Lord in the main sanctum, in contrast to most Rama temples; he is worshipped elsewhere in the complex.",
      "The temple's large stone structure, with its tall gopurams and finely carved pillared mandapam, belongs largely to the Vijayanagara period of the 16th century and later additions. Local tradition credits two devotees, Vontudu and Mittudu, with founding the shrine, giving the village its name. The poet Bammera Pothana, who rendered the Srimad Bhagavatam into Telugu, is associated by a local tradition with this place, as is the saint Annamacharya.",
      "Since 2015 the temple has been administered by Tirumala Tirupati Devasthanams, and Andhra Pradesh holds its official Sri Rama Navami celebrations here. A special feature is the Sita Rama Kalyanam performed on the full-moon night of Chaitra, under the moonlight. Thousands of devotees attend, and TTD makes special arrangements for pilgrims on this occasion every year.",
    ],
    highlights: [
      "Sita, Rama and Lakshmana carved from a single stone",
      "Vijayanagara-era gopurams and pillared mandapam",
      "Kalyanam held on the full-moon night of Chaitra",
      "Administered by TTD since 2015",
    ],
    festivals: [
      { name: "Sri Rama Navami Brahmotsavam", when: "Chaitra month, March–April" },
      { name: "Sita Rama Kalyanam (moonlit)", when: "Chaitra Purnima, March–April" },
      { name: "Vaikuntha Ekadasi", when: "December–January" },
    ],
    timings: [
      { label: "Morning darshan (commonly listed)", time: "about 6:00 AM – 1:00 PM" },
      { label: "Evening darshan (commonly listed)", time: "about 2:00 PM – 8:00 PM" },
    ],
    timingsNote:
      "TTD may change timings during Brahmotsavam and festivals; please check the official TTD website before you travel.",
    fromVizag:
      "Vontimitta is roughly 800–850 km from Visakhapatnam. Take a train to Kadapa (or Tirupati) and continue about 25 km by road.",
    howToReach: {
      road: "Vontimitta lies on the Kadapa–Rajampet road, about 25 km from Kadapa, with frequent buses.",
      rail: "Kadapa railway station is the convenient railhead; Vontimitta also has a small halt station.",
      air: "Kadapa Airport is roughly 30–35 km away, and Tirupati Airport is roughly 110 km away.",
    },
    address: "Sri Kodandarama Swamy Temple, Vontimitta, YSR Kadapa district, Andhra Pradesh 516134",
    placeQuery: "Sri Kodandarama Swamy Temple Vontimitta",
    website: "https://www.tirumala.org",
    faqs: [
      {
        q: "Why is there no Hanuman in the main sanctum at Vontimitta?",
        a: "Local tradition explains that the Deities depict a time before Lord Rama met Hanuman; the exact story varies, and Hanuman is worshipped elsewhere in the temple.",
      },
      {
        q: "When is the Vontimitta Kalyanam?",
        a: "The Sita Rama Kalyanam is held on the full-moon night during the Chaitra Brahmotsavam; TTD announces the dates each year.",
      },
      {
        q: "Can I combine Vontimitta with Tirumala?",
        a: "Yes, Vontimitta is roughly 110–130 km from Tirupati by road and is often visited on the same trip.",
      },
    ],
    sources: [
      "https://en.wikipedia.org/wiki/Kodandarama_Temple,_Vontimitta",
      "https://gotirupati.com/?p=16341",
      "https://hindupad.com/vontimitta-balalayam/",
    ],
    check: [
      "Darshan timings (listings conflict)",
      "Explanation of Hanuman's absence and his location in the complex",
      "Vontudu and Mittudu founding tradition and dating",
      "Association of Pothana and Annamacharya (wording)",
      "TTD takeover year (2015) and state Sri Rama Navami celebrations",
      "Distances from Kadapa, Kadapa Airport and Tirupati",
      "PIN code 516134",
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
    district: "Dr. B.R. Ambedkar Konaseema",
    region: "Godavari Districts",
    summary:
      "Ryali temple where one saligrama Deity shows Lord Kesava in front and Mohini at the back, near Ravulapalem in Konaseema.",
    history: [
      "Ryali, a village near Ravulapalem in Konaseema, is known for a Deity found almost nowhere else. Carved from a single black saligrama stone, it shows Lord Vishnu as Kesava on the front and, on the back, His Mohini form, the enchanting avatar He took to distribute nectar to the demigods after the churning of the ocean. Pilgrims are shown both sides of the Lord during darshan, and a small stream of water is said to appear constantly near the Lord's feet, understood as the Ganga flowing from Vishnu's feet.",
      "Local tradition says a king of the region, often named Vikrama Deva, was guided in a dream to the place where the Deity lay hidden. While he was travelling by chariot, the linchpin of the chariot fell off at this spot, and the village took its name from the Telugu word for 'fell'. The temple is usually dated to the 11th century, and it faces the Shiva temple of Sri Uma Kamandaleswara Swamy across the road, so that pilgrims visit both.",
      "For Vaishnavas, Ryali is a beautiful reminder of the Lord's Mohini pastime described in the Srimad Bhagavatam, in which He protects the devotees and bewilders the envious. The annual Kalyanam in Chaitra is the main festival.",
    ],
    highlights: [
      "One saligrama Deity: Kesava in front, Mohini at the back",
      "Water is said to appear constantly at the Lord's feet",
      "Faces the Uma Kamandaleswara Shiva temple",
      "Close to Vadapalli and Ravulapalem",
    ],
    festivals: [
      { name: "Sri Swamy Kalyanam", when: "Chaitra month, March–April" },
      { name: "Vaikuntha Ekadasi", when: "December–January" },
    ],
    timings: [
      { label: "Morning darshan (commonly listed)", time: "about 6:00 AM – 12:30 PM" },
      { label: "Evening darshan (commonly listed)", time: "about 3:00 PM – 8:00 PM" },
    ],
    timingsNote: STANDARD_NOTE,
    fromVizag:
      "Ryali is roughly 220–240 km from Visakhapatnam, about 4.5–5 hours by road via Rajahmundry and Ravulapalem.",
    howToReach: {
      road: "Buses and autos run from Ravulapalem and Rajahmundry to Ryali.",
      rail: "Rajahmundry is the nearest major railway station, roughly 35–40 km away.",
      air: "Rajahmundry Airport is roughly 40–50 km away.",
    },
    address: "Sri Jagan Mohini Kesava Swamy Temple, Ryali, Atreyapuram mandal, Dr. B.R. Ambedkar Konaseema district, Andhra Pradesh",
    placeQuery: "Sri Jaganmohini Kesava Swamy Temple Ryali",
    faqs: [
      {
        q: "Can I see both Kesava and Mohini at Ryali?",
        a: "Yes, the priests usually show both the front and back of the Deity, often with a lamp; ask politely if you are unsure.",
      },
      {
        q: "Can I combine Ryali with other temples?",
        a: "Yes, Vadapalli Sri Venkateswara temple is close by, and Antarvedi can be added on a longer Konaseema trip.",
      },
      {
        q: "Is there a dress code?",
        a: "Modest traditional dress is recommended.",
      },
    ],
    sources: [
      "https://en.wikipedia.org/wiki/Ryali",
      "https://eastgodavari.ap.gov.in/?p=4943",
      "https://temple.yatradham.org/temple/sri-jaganmohini-kesava-swamy-temple",
    ],
    check: [
      "Darshan timings (listings vary)",
      "Builder (Vikrama Deva vs Chola king) and 11th-century dating",
      "Water-at-the-feet tradition (wording)",
      "Kalyanam dates in Chaitra",
      "Distances from Ravulapalem, Rajahmundry station and airport",
      "Full postal address with PIN code",
    ],
  },
];
