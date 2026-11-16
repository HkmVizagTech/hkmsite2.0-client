// Major Hindu temples across India: pilgrimage guide content (continuation of templesData.ts).
// Original writing for ISKCON Gambheeram Visakhapatnam (Hare Krishna Movement, Vizag).
// Fact-checked November 2026. Every statement is drawn from the URLs in each entry's `sources`
// (official temple/trust sites, central/state government portals, Vedabase.io, established news outlets).
// Legends are framed as temple tradition or devotees' belief. Each `check` list names what the
// temple team must still confirm before publishing.

import type { Temple } from "./templesData";

const CONFIRM_NOTE = "Please confirm current timings with the temple before you travel.";

export const TEMPLES_MORE: Temple[] = [
  // 1. Puri Jagannath
  {
    slug: "puri-jagannath-temple",
    name: "Sri Jagannath Temple, Puri",
    shortName: "Puri Jagannath",
    teluguName: "పూరీ శ్రీ జగన్నాథ ఆలయం",
    deity: "Sri Jagannath with Sri Balabhadra, Subhadra Devi and Sudarshana",
    form: "Jagannath",
    town: "Puri",
    state: "Odisha",
    district: "Puri",
    region: "Odisha",
    summary:
      "The temple of Lord Jagannath, Balabhadra and Subhadra in Puri, Odisha, one of the four dhams, famed for Ratha Yatra and for Sri Chaitanya Mahaprabhu's long stay.",
    history: [
      "Puri is known as Purushottama Kshetra and also as Neelachala, and the Shree Jagannatha Temple Administration describes it as one of the four dhams of India, with Dwarka, Badrinath and Rameswaram. The temple administration's account of the tradition tells of King Indradyumna, who set out to find the Lord worshipped as Purushottama. A great divine log of wood appeared on the seashore, and according to temple tradition Lord Vishnu Himself came in the guise of a carpenter and carved the Deities.",
      "The administration records that the present temple was built in the 12th century by King Anantavarman Chodaganga Deva and completed by Anangabhima Deva III around 1230. The Deities are carved from neem wood and are replaced in the Nabakalebara ceremony, which usually takes place in a year when an extra (leap) month falls in Ashadha.",
      "Sri Chaitanya Mahaprabhu came to Puri during the reign of King Prataparudra and spent the rest of His life there. The Chaitanya Charitamrita describes how He chanted and danced with His associates before Lord Jagannath's chariot at Ratha Yatra.",
    ],
    highlights: [
      "One of the four dhams, also called Purushottama Kshetra",
      "Ratha Yatra on the second day of the bright fortnight of Ashadha",
      "Sri Chaitanya Mahaprabhu lived in Puri in His later years",
      "Deities of neem wood, renewed in the Nabakalebara ceremony",
      "Main temple about 214 feet high, in the Kalinga style",
      "Temple kitchen (Roshaghara) with about 240 hearths",
      "Declared a National Monument in 1975",
    ],
    festivals: [
      { name: "Ratha Yatra", when: "Ashadha Shukla Dwitiya, June–July" },
      { name: "Bahuda Yatra (return journey)", when: "Ashadha Shukla Dashami, nine days after Ratha Yatra" },
      { name: "Suna Besha (golden attire on the chariots)", when: "Ashadha Shukla Ekadashi" },
      { name: "Snana Yatra", when: "Jyeshtha Purnima, May–June; darshan then pauses for about 15 days" },
      { name: "Chandan Yatra", when: "Begins on Akshaya Tritiya and lasts 42 days, April–June" },
      { name: "Dola Yatra", when: "Phalguna Shukla Dashami to Purnima, February–March" },
      { name: "Pushyabhisheka", when: "Pausha Purnima, December–January" },
      { name: "Nabakalebara (renewal of the Deities)", when: "Usually in a year with a leap month in Ashadha" },
    ],
    timings: [
      { label: "Doors opened (Dwarafita), per the temple's prescribed schedule", time: "by 4:30 AM" },
      { label: "Mangala Alati", time: "5:30 AM" },
      { label: "Sandhya Alati", time: "6:00 PM" },
      { label: "Pahuda (Deities retire, doors sealed)", time: "11:30 PM" },
    ],
    timingsNote:
      "These times are from the Shree Jagannatha Temple Administration's daily ritual schedule, which itself notes that they are not always followed exactly. Darshan pauses for offerings during the day. " +
      CONFIRM_NOTE,
    fromVizag:
      "The Puri district administration notes that there are direct buses between Puri and Visakhapatnam. Puri is a terminus on the East Coast Railway, and Khurda Road junction is 44 km from Puri.",
    howToReach: {
      road: "Buses from the stand near the Gundicha Temple run to Bhubaneswar and Cuttack every 10–15 minutes.",
      rail: "Puri railway station is a terminus on the East Coast Railway; Khurda Road junction, 44 km away, serves trains towards Chennai and western India.",
      air: "Puri has no airport. The nearest is Biju Patnaik International Airport, Bhubaneswar, about 60 km away.",
    },
    address: "Shree Jagannatha Temple, Puri, Odisha 752001",
    placeQuery: "Shree Jagannath Temple Puri Odisha",
    website: "https://www.shreejagannatha.in",
    faqs: [
      {
        q: "Who can enter the Puri Jagannath temple?",
        a: "According to the temple administration's FAQ, only Hindus are allowed inside the temple. Those who cannot enter can have darshan of Patitapabana, an image of Lord Jagannath in a niche on the eastern gate.",
      },
      {
        q: "What should I not carry into the temple?",
        a: "The temple's list of don'ts includes umbrellas, mobile phones, electronic gadgets and leather items, and footwear is not allowed in or around the temple. Bathe and wear clean clothes before entering. Free shoe and mobile stands are provided near the Lion's Gate.",
      },
      {
        q: "Is darshan available throughout the year?",
        a: "No. After Snana Yatra on Jyeshtha Purnima, the temple administration says darshan of the Deities is not available for about 15 days.",
      },
      {
        q: "What are the darshan timings at Puri?",
        a: "The temple administration says darshan is available almost throughout the day, from about 5:30 AM until late night, except on some festival days. Darshan pauses from about 8:00 to 9:15 AM for the Gopal Ballava offering.",
      },
      {
        q: "What are the names of the three chariots?",
        a: "Lord Jagannath's chariot is Nandighosa, Lord Balabhadra's is Taladhwaja and Subhadra Devi's is Darpadalana.",
      },
      {
        q: "How long do the Deities stay at the Gundicha Temple?",
        a: "Nine days. The Deities leave on Ashadha Shukla Dwitiya and return in the Bahuda Yatra on Ashadha Shukla Dashami.",
      },
      {
        q: "Where can I get Jagannath Mahaprasad?",
        a: "At Ananda Bazar, in the north-east corner of the temple's outer compound, where Mahaprasad is sold and devotees may also sit and eat it.",
      },
      {
        q: "Does the temple run guest houses?",
        a: "Yes. The temple administration lists Nilachal Bhakta Niwas, Shree Gundicha Bhakta Niwas, Neeladri Bhakta Niwas and Purushottam Bhakta Niwas, with online booking at stayatpurijagannatha.in.",
      },
    ],
    sections: [
      {
        heading: "Architecture of the Shreemandira",
        body: [
          "The temple administration describes the Shreemandira as one of the most refined examples of Kalinga temple architecture. The sanctum (vimana or deula) is a rekha deula with a curved tower, and the porch (jagamohana) is a pidha deula with a pyramid-shaped roof. With the natamandapa (audience hall) and bhogamandapa (offering hall), the four halls stand in a row from east to west on a raised platform.",
          "The main temple rises about 214 feet 8 inches above road level. Two walls enclose the complex: the outer Meghanada Prachira (665 ft x 640 ft, 20–24 ft high) and the inner Kurma Prachira (420 ft x 315 ft). The outer wall has four gates: the Singha Dwara (Lion's Gate) on the east, the Aswa Dwara on the south, the Vyaghra Dwara on the west and the Hasti Dwara on the north.",
          "In front of the eastern side stands the Aruna Stambha, a sixteen-sided monolithic pillar about 34 feet tall, brought from Konark in the reign of Dibyasingha Deva (1793–98). The temple was declared a National Monument in 1975, and its conservation was entrusted to the Archaeological Survey of India in 1979.",
        ],
      },
      {
        heading: "Shrines inside the complex",
        body: [
          "The temple administration notes that hundreds of smaller shrines and mandapas stand within the walls. The Vimala temple, facing east in the inner compound, is described as the oldest of them, and the prasad of Lord Jagannath is offered to Vimala. Goddess Lakshmi is worshipped as Gajalakshmi in her own temple in the north-west corner of the inner enclosure.",
          "Other sacred places include the Kalpabata, a banyan tree on the south side named in the Skanda and Brahma Puranas, and Koili Baikuntha on the north, where new Deities are carved and the old ones are buried during Nabakalebara. Pilgrims climb the Baisi Pahacha, the eastern flight of steps from the outer to the inner enclosure.",
        ],
      },
      {
        heading: "Daily rituals and Mahaprasad",
        body: [
          "About 85 to 90 sevakas take part in the daily rituals (niti). After the doors are opened and Mangala Alati is offered, the Deities are bathed and dressed, and a series of bhogas follows: Gopal Ballav Bhoga around 8:30 AM, the Sakala Dhupa or Raj Bhoga from 9 to 10 AM, the Bhoga Mandap offering around 11:30 AM, the Madhyahna Dhupa, and the Sandhya Dhupa in the evening. At night the Deities wear silk and flower garlands for the Badasinghara Besha before they retire around 11:30 PM.",
          "The temple kitchen, the Roshaghara, is popularly considered the largest kitchen in the world. It has about 240 hearths, food is cooked over firewood in earthen pots, and only the servitors called Suaras may cook there. The Bhoga Mandap offering is prepared mainly for pilgrims and mathas, and Mahaprasad is sold at Ananda Bazar in the north-east corner of the outer compound.",
        ],
      },
      {
        heading: "Ratha Yatra and the festival year",
        body: [
          "On Ashadha Shukla Dwitiya the Deities ride their chariots, Nandighosa, Taladhwaja and Darpadalana, to the Gundicha temple about 3 km away. The Gajapati Maharaja sweeps the chariots with a golden broom and sprinkles sandal paste in the Chhera Pahanra ritual. Hera Panchami follows during the Deities' nine-day stay, and on Ashadha Shukla Dashami they return in the Bahuda Yatra.",
          "The next day, Suna Besha, the Deities are adorned with gold ornaments on the chariots in front of the Lion's Gate. On the 13th day of the bright fortnight they return to the jewelled throne in the Niladri Bije procession. Earlier in the year, at Snana Yatra on Jyeshtha Purnima, the Deities are bathed with 108 pitchers of water on the Snana Mandapa.",
          "Nabakalebara, the renewal of the wooden Deities, falls at intervals of 8, 11, 12 or 19 years. It begins with the Banajaga Yatra on Chaitra Shukla Dashami, when servitors set out to find four sacred neem trees.",
        ],
      },
      {
        heading: "Sri Chaitanya Mahaprabhu in Puri",
        body: [
          "The Chaitanya Charitamrita records that Sri Chaitanya Mahaprabhu lived continuously in Jagannatha Puri for eighteen years, leading His devotees in kirtana. Before Ratha Yatra He personally washed and cleaned the Gundicha temple with His associates, using a hundred new waterpots and brooms supplied by the temple superintendent, Kashi Mishra. This cleaning of the Gundicha temple is described in Madhya-lila, chapter 12.",
        ],
      },
      {
        heading: "Visitor guide",
        body: [
          "The temple administration asks pilgrims to bathe and wear clean clothes, follow the queue, keep silence inside and avoid carrying food, footwear, leather items, umbrellas, phones and other gadgets. Free shoe and mobile stands are provided near the Lion's Gate barricade and near the temple office. Beware of pickpockets and monkeys.",
          "Free battery-operated vehicles carry senior citizens and differently abled devotees from Jagannatha Ballav Parking (Market Square) to the temple, and wheelchairs with ramp access are available at the North Gate. A free first-aid post with a physician works at the temple branch office.",
          "For a stay close to the temple, the administration runs Nilachal Bhakta Niwas on Grand Road next to the temple, Shree Gundicha Bhakta Niwas near the Gundicha temple, Neeladri Bhakta Niwas near the Town Police Station and Purushottam Bhakta Niwas near the Old Jail.",
        ],
      },
    ],
    sources: [
      "https://www.shreejagannatha.in",
      "https://www.shreejagannatha.in/ancient-period/",
      "https://www.shreejagannatha.in/medieval-period/",
      "https://www.shreejagannatha.in/shreekhetra/",
      "https://www.shreejagannatha.in/daily-rituals/",
      "https://www.shreejagannatha.in/major-festivals/",
      "https://www.shreejagannatha.in/nabakalebara/",
      "https://www.shreejagannatha.in/faqs/",
      "https://www.shreejagannatha.in/dos-donts/",
      "https://www.shreejagannatha.in/architecture/",
      "https://www.shreejagannatha.in/main-temple-complex/",
      "https://www.shreejagannatha.in/inner-peripheri/",
      "https://www.shreejagannatha.in/outer-periphery/",
      "https://www.shreejagannatha.in/ratha-yatra/",
      "https://www.shreejagannatha.in/darsan-facilities/",
      "https://www.shreejagannatha.in/accomodation/",
      "https://puri.odisha.gov.in/en/tourism/how-to-reach",
      "https://vedabase.io/en/library/cc/madhya/12/",
      "https://vedabase.io/en/library/cc/madhya/13/",
      "https://vedabase.io/en/library/cc/adi/13/38/",
    ],
    check: [
      "Current darshan hours for the public (only the ritual schedule is published)",
      "Road distance and travel time from Visakhapatnam, and current direct trains",
      "Whether to add Srila Prabhupada's 1967 San Francisco Ratha Yatra (no valid source found yet)",
      "Street address (Bada Danda) and PIN code 752001",
      "Entry gates: the administration's darshan page says the Lion's Gate is the only entry and the other three gates are exits; confirm whether this has changed (all four gates were reported reopened in 2024, not verified from an allowed source)",
      "Darshan pause of about 8:00–9:15 AM for Gopal Ballava (from the darshan facilities page) is still current",
      "Guest house names and the booking site stayatpurijagannatha.in are current",
      "Battery vehicle and wheelchair services for seniors and differently abled devotees are still offered",
      "Exact dates for Bahuda, Suna Besha and Dola Yatra each year (tithis only given)",
    ],
  },

  // 2. Kanipakam
  {
    slug: "kanipakam-varasiddhi-vinayaka-temple",
    name: "Sri Varasiddhi Vinayaka Swamy Temple, Kanipakam",
    shortName: "Kanipakam",
    teluguName: "కాణిపాకం శ్రీ వరసిద్ధి వినాయక స్వామి దేవస్థానం",
    deity: "Sri Varasiddhi Vinayaka Swamy (Lord Ganesha)",
    form: "Vinayaka",
    town: "Kanipakam",
    state: "Andhra Pradesh",
    district: "Chittoor",
    region: "Rayalaseema",
    summary:
      "The self-manifested Vinayaka of Kanipakam in Chittoor district, seated in a well that is always full of water.",
    history: [
      "Kanipakam is a village in Chittoor district. According to local tradition recorded by the Chittoor district administration, three brothers, one mute, one deaf and one blind, were digging a well to water their field when their tool struck a hard object. Blood flowed into the water, the three brothers were cured, and the villagers found a form of Lord Ganesha in the well. Its base could not be reached, and the Deity still sits in the well, which is always full of water.",
      "Devotees believe that this self-manifested (swayambhu) form is slowly growing. According to the Ministry of Tourism's Incredible India portal, the temple was first built in the early 11th century by the Chola emperor Kulottunga Chola I and expanded in 1336 under the Vijayanagara emperors.",
      "Devotees also believe that Lord Vinayaka here resolves disputes and removes obstacles. The annual Brahmotsavam, held around Vinayaka Chaturthi, carries the festival Deity through the temple streets on a different vahana each day.",
    ],
    highlights: [
      "Self-manifested Vinayaka seated in a well that is always full of water",
      "Annual Brahmotsavam around Vinayaka Chaturthi",
      "About 11 km from Chittoor and 68 km from Tirupati",
    ],
    festivals: [
      { name: "Vinayaka Brahmotsavam", when: "Begins around Vinayaka Chaturthi, August–September, and runs for several weeks" },
    ],
    timings: [],
    timingsNote:
      "No official timings could be confirmed for this guide. " + CONFIRM_NOTE,
    fromVizag:
      "Plan the journey via Chittoor, the nearest railway station, or Tirupati, the nearest airport. Chittoor station is about 11–12 km from the temple. Check current trains and flights from Visakhapatnam before you travel.",
    howToReach: {
      road: "APSRTC buses serve Chittoor bus stand, about 11 km away. By road the temple is about 11 km from Chittoor and 68 km from Tirupati.",
      rail: "Chittoor railway station is about 11–12 km from the temple.",
      air: "Tirupati Airport is the nearest, around 85–90 km away.",
    },
    address: "Sri Varasiddhi Vinayaka Swamy Devasthanam, Kanipakam, Chittoor district, Andhra Pradesh",
    placeQuery: "Sri Varasiddhi Vinayaka Swamy Temple Kanipakam",
    faqs: [
      {
        q: "When is the Kanipakam Brahmotsavam?",
        a: "It is held every year around Vinayaka Chaturthi. In 2026 the Ministry of Tourism listed it from 14 September to 4 October.",
      },
      {
        q: "Which is the nearest airport?",
        a: "Tirupati Airport, around 85–90 km from the temple.",
      },
    ],
    sources: [
      "https://chittoor.ap.gov.in/tourist-place/kanipakam/",
      "https://www.incredibleindia.gov.in/en/andhra-pradesh/chittoor/kanipakam-vinayaka-temple",
      "https://www.incredibleindia.gov.in/en/festivals-and-events/andhra-pradesh/kanipakam-vinayaka-brahmotsavam",
    ],
    check: [
      "Daily darshan timings (no official source found; AP Endowments portal tms.ap.gov.in did not load)",
      "Official devasthanam website URL (not set)",
      "Tradition of taking oaths before the Lord (satya pramanam): no valid source found, so removed",
      "Origin of the name Kanipakam and the Bahuda river legend: removed, no valid source",
      "Dress code, accommodation and typical darshan waiting time",
      "Mandal (Irala) and PIN code 517131 for the address",
    ],
  },

  // 3. Sripuram Golden Temple
  {
    slug: "sripuram-golden-temple-vellore",
    name: "Sripuram Golden Temple (Sri Lakshmi Narayani), Vellore",
    shortName: "Sripuram Golden Temple",
    teluguName: "శ్రీపురం స్వర్ణ దేవాలయం (శ్రీ లక్ష్మీ నారాయణి), వేలూరు",
    deity: "Sri Lakshmi Narayani (Goddess Mahalakshmi)",
    form: "Lakshmi Narayani",
    town: "Thirumalaikodi, Vellore",
    state: "Tamil Nadu",
    district: "Vellore",
    region: "Tamil Nadu",
    summary:
      "The Sri Lakshmi Narayani Golden Temple at Thirumalaikodi, Vellore, consecrated in 2007 and reached by a star-shaped path.",
    history: [
      "Sripuram, the Sri Lakshmi Narayani Golden Temple, stands at Thirumalaikodi near Vellore in Tamil Nadu and is run by the Sri Narayani Peedam. Unlike most temples in this guide it is recent: according to the temple, it was built in seven years and consecrated on 24 August 2007, based on the vision of Sri Sakthi Amma.",
      "The temple states that more than 1.5 tonnes of gold were used, in up to 15 layers on hand-etched copper plates. Pilgrims approach the shrine along a star-shaped path with twelve points. Messages lining both sides of the path speak of the purpose of human life, what one should and should not do, and the need for devotion, and visitors are encouraged to read them as they walk towards the temple.",
    ],
    highlights: [
      "Temple covered with more than 1.5 tonnes of gold",
      "Star-shaped approach path lined with spiritual messages",
      "Consecrated on 24 August 2007",
      "Open daily from 8:00 AM to 8:00 PM",
    ],
    festivals: [
      { name: "Navaratri", when: "September–October" },
      { name: "Deepavali", when: "October–November" },
    ],
    timings: [{ label: "Darshan", time: "8:00 AM – 8:00 PM" }],
    timingsNote:
      "Timings are as published on the Sripuram website. " + CONFIRM_NOTE,
    fromVizag:
      "The nearest railway station is Katpadi Junction (Vellore). The temple lists Chennai, Bengaluru and Tirupati as the nearest airports.",
    howToReach: {
      road: "The temple is at Thirumalaikodi, Vellore; taxis and local transport are available from Vellore and Katpadi.",
      rail: "Katpadi Junction (Vellore) is the nearest railway station.",
      air: "Chennai, Bengaluru and Tirupati airports are the nearest, according to the temple.",
    },
    address: "Sri Lakshmi Narayani Golden Temple, Thirumalaikodi, Vellore, Tamil Nadu 632055",
    placeQuery: "Sripuram Golden Temple Vellore",
    website: "https://www.sripuram.org",
    faqs: [
      {
        q: "Is there a dress code at Sripuram?",
        a: "Yes. The temple asks men and women to avoid sleeveless tops, low-cut garments, shorts or skirts above the knee, and hats or caps. A scarf or shawl can be used to cover up.",
      },
      {
        q: "Can I carry a mobile phone or camera?",
        a: "No. Phones, cameras and electronic gadgets are prohibited on the premises, as are large bags, outside packed food and smoking.",
      },
      {
        q: "Is there a special darshan ticket?",
        a: "The temple offers Divya Darshan Seva daily from 8:00 AM to 8:00 PM for a donation of ₹100, booked at the Sripuram ticket counters or the PRO office.",
      },
    ],
    sources: [
      "https://www.sripuram.org",
      "https://www.sripuram.org/Sripuram-golden-temple",
      "https://www.sripuram.org/Sri-lakshmi-narayani-temple",
      "https://www.sripuram.org/Vellore-golden-temple-star-path",
      "https://www.sripuram.org/darshan-timings",
      "https://www.sripuram.org/Dress-Code",
      "https://www.sripuram.org/Dos-and-Donts",
    ],
    check: [
      "Last-entry time and any early-morning abhishekam timings",
      "Divya Darshan Seva fee (₹100) is current",
      "Distances from Vellore bus stand, Katpadi Junction and the airports",
      "Whether trains from Visakhapatnam stop at Katpadi",
      "Full festival list as celebrated at Sripuram",
    ],
  },

  // 4. Srirangam
  {
    slug: "srirangam-ranganathaswamy-temple",
    name: "Sri Ranganathaswamy Temple, Srirangam",
    shortName: "Srirangam",
    teluguName: "శ్రీరంగం శ్రీ రంగనాథ స్వామి ఆలయం",
    deity: "Sri Ranganatha (Lord Vishnu reclining on Adi Sesha) with Sri Ranganayaki",
    form: "Ranganatha",
    town: "Srirangam, Tiruchirappalli",
    state: "Tamil Nadu",
    district: "Tiruchirappalli",
    region: "Tamil Nadu",
    summary:
      "The temple of Sri Ranganatha on the Kaveri at Srirangam, foremost of the 108 Divya Desams, where Sri Chaitanya Mahaprabhu spent Chaturmasya.",
    history: [
      "The Tamil Nadu HR&CE Department describes Srirangam as the foremost of the 108 Vaishnava Divya Desams, praised in hymns by ten of the Alwars. Lord Ranganatha reclines here, facing south. According to the temple's account, the sacred vimana was worshipped by Ikshvaku and his line in Ayodhya, and Lord Rama gave it to Vibhishana. As Vibhishana carried it towards Lanka he set it down on the bank of the Kaveri and could not lift it again; the Lord declared that He wished to stay there, facing south towards Lanka.",
      "The sanctum is surrounded by seven enclosures (prakarams). The administrative system established by Sri Ramanujacharya is still followed in the temple. Work on the south Rajagopuram began in the Vijayanagara period but was left unfinished; it resumed in 1979 and the tower, 236 feet tall with 13 tiers, was consecrated on 25 March 1987.",
      "The Chaitanya Charitamrita describes how Sri Chaitanya Mahaprabhu, during His South India tour, stayed for the four months of Chaturmasya at the house of Venkata Bhatta at Sri Rangam, bathing in the Kaveri and chanting and dancing in the temple daily. Venkata Bhatta's son, Gopala Bhatta, who also served the Lord at that time, later became Gopala Bhatta Goswami.",
    ],
    highlights: [
      "Foremost of the 108 Divya Desams, called Bhuloka Vaikuntham",
      "The only temple sung by all ten Alwars",
      "Lord Ranganatha reclines facing south",
      "Seven enclosures on a 156-acre island between the Kaveri and Kollidam",
      "21 gopurams, led by the 236-foot Rajagopuram",
      "644 inscriptions, from the Chola king Aditya I onwards",
      "Sri Ramanuja's shrine and temple administration",
      "Sri Chaitanya Mahaprabhu stayed here for Chaturmasya",
    ],
    festivals: [
      {
        name: "Vaikuntha Ekadasi (opening of the Paramapada Vasal)",
        when: "Margazhi (December–January), at the heart of a festival of about twenty days",
      },
      { name: "Bhoopathi Thirunal (wooden chariot festival)", when: "Thai month, January–February" },
      { name: "Panguni festival (Koradham chariot)", when: "Panguni month, March–April" },
      { name: "Chithirai festival (chariot procession)", when: "Chithirai month, April–May" },
      { name: "Sri Jayanthi Uriyadi (Krishna Janmashtami)", when: "August–September" },
    ],
    timings: [
      { label: "Darshan", time: "6:00 AM – 9:00 PM" },
      { label: "Closed", time: "7:15–9:00 AM, 12:30–2:15 PM and 5:30–7:00 PM" },
    ],
    timingsNote:
      "Timings are as published on the temple's HR&CE website for normal days; they change during festivals, and devotees are advised to arrive an hour before darshan closes. " +
      CONFIRM_NOTE,
    fromVizag:
      "Plan the journey via Tiruchirappalli, which has a railway junction and an airport. The junction is about 9 km from the temple and the airport about 15 km. Check current trains and flights from Visakhapatnam before you travel.",
    howToReach: {
      road: "Tiruchirappalli Central Bus Stand is about 10 km from the temple.",
      rail: "Srirangam railway station is about 1 km from the temple; Tiruchirappalli Junction is about 9 km away.",
      air: "Tiruchirappalli airport is about 15 km from the temple.",
    },
    address: "Arulmigu Ranganathaswamy Temple, Srirangam, Tiruchirappalli, Tamil Nadu 620006",
    placeQuery: "Sri Ranganathaswamy Temple Srirangam",
    website: "https://srirangamranganathar.hrce.tn.gov.in",
    faqs: [
      {
        q: "When is the best time to see Vaikuntha Ekadasi at Srirangam?",
        a: "The Paramapada Vasal is opened in the early morning of Vaikuntha Ekadasi, in the Tamil month of Margazhi (December or January). News reports have described the gate opening in the early hours, around 4 AM. The date and time change every year, so check the temple's announcements.",
      },
      {
        q: "What are the darshan timings at Srirangam?",
        a: "On normal days the temple's HR&CE website lists darshan from 6:00 AM to 9:00 PM, with breaks from 7:15 to 9:00 AM, 12:30 to 2:15 PM and 5:30 to 7:00 PM. The temple asks devotees to arrive an hour before darshan closes. Timings change during festivals.",
      },
      {
        q: "Does the temple have rooms for devotees?",
        a: "The temple's devotee rest house has 171 rooms, with charges listed from Rs 500 to Rs 2,000. Bookings were temporarily stopped from 25 June 2026 for renovation, so please check with the temple office for the current position. There is no online booking for these rooms.",
      },
      {
        q: "Why is Srirangam called Bhuloka Vaikuntham?",
        a: "The temple describes itself as the first of the 108 Divya Desams and the foremost of the self-manifested shrines of Lord Vishnu, known as Bhuloka Vaikuntham, Vaikuntha on earth. In Vaishnava usage the word Koil, the temple, refers to Srirangam alone.",
      },
      {
        q: "How tall is the Srirangam Rajagopuram?",
        a: "The south Rajagopuram is 236 feet tall with 13 tiers and 13 kalasas. It was completed through the efforts of the 44th Jeeyar of the Ahobila Mutt and consecrated on 25 March 1987. The temple has 21 gopurams in all.",
      },
      {
        q: "Is Srirangam temple on an island?",
        a: "Yes. The HR&CE Department describes the temple as standing on an island formed by the Kaveri and Kollidam rivers, covering about 156 acres.",
      },
      {
        q: "Did Sri Chaitanya Mahaprabhu visit Srirangam?",
        a: "Yes. The Chaitanya Charitamrita (Madhya-lila, chapter 9) records that He stayed for the four months of Chaturmasya at the home of Venkata Bhatta and visited the temple daily.",
      },
      {
        q: "Are there facilities for elderly and disabled devotees?",
        a: "The temple lists four free battery cars for elderly and differently abled devotees inside the temple complex, with the service point at the Aryabhattal Vasal near the Thayar shrine.",
      },
    ],
    sections: [
      {
        heading: "Seven prakarams and 21 gopurams",
        body: [
          "The HR&CE Department records that the temple stands on an island between the Kaveri and Kollidam rivers and covers about 156 acres. Seven rectangular enclosures surround the sanctum, and the department describes Srirangam as the only temple in India with seven prakarams. Temple tradition compares the seven walls to the seven upper worlds, from Bhuloka to Satyaloka.",
          "The innermost enclosure has herbal paintings on its ceiling and is closed to the public; devotees enter the sanctum through the Gayatri Mandapam. The outermost enclosure, the Chitrai streets, is a living town with houses on both sides, and it shelters the temple chariots.",
          "There are 21 gopurams, and the temple notes that all of them can be seen at once from the top of the Ranga Vilas Mandapam. The main entrance on the south is the Ranga Ranga Gopuram, 81 feet tall with seven tiers. The east gopuram is kept painted white; according to temple tradition this honours Vellaiyammal, a temple dancer who gave her life to stop an invading king. Over the sanctum rises the golden Pranavakara vimana, shaped like the syllable Om.",
        ],
      },
      {
        heading: "Inscriptions and history",
        body: [
          "According to the HR&CE Department, South Indian Inscriptions Volume 24, published by the Archaeological Survey of India, lists 644 inscriptions in the temple. They range from the time of the Chola king Aditya I (871–907 CE) to the Nayak period. One Tamil inscription of 1048 CE records decisions taken by the temple's governing assembly at Srirangam.",
          "Temple tradition holds that after a great flood the vimana lay buried in forest until a Chola king, Kili Cholan, found it by following a parrot's song and named the place Thiruvarangam. In his purport to the Chaitanya Charitamrita, Srila Prabhupada notes that the Alwar Tirumangai built the fourth wall and Tondaradippodi Alwar built the third wall and a tulasi garden. He also records that during an invasion the Deity was taken away for safety and reinstalled in 1371 CE, an event noted in an inscription by Vedanta Desika on the eastern wall.",
        ],
      },
      {
        heading: "Alwars and Sri Ramanuja",
        body: [
          "The temple describes Srirangam as the only shrine glorified by all ten Alwars. Tondaradippodi Alwar, who sang the Tiruppalliyezhuchi, praised no Divya Desam other than Srirangam, and according to the temple Andal and Tiruppan Alwar attained the Lord's feet here.",
          "Sri Ramanuja, born at Sriperumbudur in 1017 CE, framed the temple's administration and reformed its worship according to the Parameswara Samhita of the Pancharatra Agama. The temple notes that he also appointed people from communities other than Brahmins to temple services. His shrine, the Udaiyavar Sannidhi, stands in the fifth enclosure. Devotees believe the form worshipped there is his own body; it receives no water abhishekam, and instead a paste of saffron, edible camphor and sandal is applied twice a year, in Chithirai and Aippasi.",
        ],
      },
      {
        heading: "Daily worship and sevas",
        body: [
          "Worship follows the Pancharatra Agama in the Tenkalai tradition. A special feature listed by the temple is the morning Viswaroopa Seva, performed in the presence of a cow, a horse and an elephant. Everything here is called periya, great: the Lord is Periya Perumal, the Mother is Periya Piratti, and the festival of recitation is the Periya Adhyayana Utsavam.",
          "In the fourth enclosure, opposite the Paramapada Vasal, is the shrine of Lord Dhanvantari, where devotees pray for healing. The temple lists thirumanjanam there from 11 AM to 12 noon on Sundays, Mondays, Tuesdays, Wednesdays and Fridays for Rs 1,200, with no thirumanjanam during Margazhi. In the same enclosure a 14-foot Garudalwar sits facing the sanctum with joined palms.",
        ],
      },
      {
        heading: "Vaikuntha Ekadasi and festivals",
        body: [
          "The temple notes that festivals are held here through the whole year. The greatest is Vaikuntha Ekadasi in Margazhi, the centre of a festival that news reports have described as lasting about twenty days.",
          "On Vaikuntha Ekadasi the Paramapada Vasal, the gate to Vaikuntha, is opened in the early hours. The procession Deity, Namperumal, comes out through it wearing the ratna angi, a covering of rubies and diamonds that reports credit to the Nayak kings, and thousands of devotees follow.",
          "The temple's chariots go out in the Thai month (Bhoopathi Thirunal), in Panguni (the Koradham) and in Chithirai. At the Krishna shrine, Sri Jayanthi is celebrated with the Uriyadi festival.",
        ],
      },
      {
        heading: "Visitor guide",
        body: [
          "Darshan closes three times a day, so plan around the breaks and arrive at least an hour before closing. Free footwear counters are at the Ranga Ranga Gopuram, the East White Gopuram and the north entrance. Four free battery cars carry elderly and differently abled devotees inside the complex.",
          "The temple's rest house has 171 rooms, but bookings were paused from 25 June 2026 for renovation; check before you travel. Prasadam can be sent by post through the temple office, and festival processions are streamed live on the temple's YouTube channel.",
        ],
      },
    ],
    sources: [
      "https://srirangamranganathar.hrce.tn.gov.in/",
      "https://srirangamranganathar.hrce.tn.gov.in/hrcehome/history.php?tid=25700",
      "https://srirangamranganathar.hrce.tn.gov.in/hrcehome/speciality.php?tid=25700",
      "https://srirangamranganathar.hrce.tn.gov.in/hrcehome/structure.php?tid=25700",
      "https://srirangamranganathar.hrce.tn.gov.in/hrcehome/towers.php?tid=25700",
      "https://srirangamranganathar.hrce.tn.gov.in/hrcehome/inscription.php?tid=25700",
      "https://srirangamranganathar.hrce.tn.gov.in/hrcehome/shrines.php?tid=25700",
      "https://srirangamranganathar.hrce.tn.gov.in/hrcehome/facility.php?tid=25700",
      "https://srirangamranganathar.hrce.tn.gov.in/hrcehome/location.php?tid=25700",
      "https://www.deccanchronicle.com/140111/lifestyle-offbeat/article/thousands-worship-ranganathasamy-temple-ekadasi-day",
      "https://www.deccanchronicle.com/140112/news-current-affairs/article/fervour-marks-vaikunta-ekadasi",
      "https://vedabase.io/en/library/cc/madhya/9/",
      "https://vedabase.io/en/library/cc/madhya/9/79/",
      "https://vedabase.io/en/library/cc/adi/10/105/",
    ],
    check: [
      "Distances on the HR&CE page have no units; confirm they are kilometres",
      "Whether the rest house has reopened after renovation, and current room charges (Rs 500–2,000 listed)",
      "Dress code and paid darshan options (no official source found)",
      "Dhanvantari thirumanjanam fee (Rs 1,200) and days, as listed on the HR&CE site",
      "HR&CE claim that Srirangam is the only temple in India with seven prakarams (presented as the department's description)",
      "The HR&CE tower page gives the Rajagopuram as 11 tiers in its data table but 13 tiers in its text; 13 is used here",
      "Exact festival months for the Thai, Panguni and Chithirai chariot festivals in the coming year",
      "Vaikuntha Ekadasi festival length (Deccan Chronicle 2014 reported a 20-day festival) and the gate-opening time for the coming year",
      "Phone number removed from the rooms FAQ, per the no-phone-numbers rule",
    ],
  },

  // 5. Madurai Meenakshi
  {
    slug: "madurai-meenakshi-amman-temple",
    name: "Meenakshi Amman Temple, Madurai",
    shortName: "Madurai Meenakshi",
    teluguName: "మధురై శ్రీ మీనాక్షి అమ్మవారి ఆలయం",
    deity: "Sri Meenakshi Amman and Sri Sundareswarar",
    form: "Meenakshi",
    town: "Madurai",
    state: "Tamil Nadu",
    district: "Madurai",
    region: "Tamil Nadu",
    summary:
      "The temple of Goddess Meenakshi and Lord Sundareswarar on the Vaigai in Madurai, with 14 gopurams and the Meenakshi Thirukalyanam festival.",
    history: [
      "The temple stands on the southern bank of the Vaigai river in Madurai. Its presiding Deities are Meenakshi, a form of Parvati, and Sundareswarar, a form of Shiva. The temple's HR&CE account tells that the Pandya king Malayadhwaja and Queen Kanchanamalai prayed for a child, and a girl named Thadathagai was born from a sacrifice. She conquered many lands and, on reaching Kailash, recognised Shiva as her husband; according to the temple tradition He married her in Madurai.",
      "The HR&CE account records that sculptures and paintings were destroyed during Malik Kafur's invasion in the 14th century. The Thousand Pillar Hall was built in the time of Viswanatha Nayak, and Thirumalai Nayak (1623–1659) added the Pudhu Mandapam, the Raya Gopuram and the Teppakulam. The complex has 14 gopurams; the tallest, on the south, is 51.9 metres high.",
      "The Chaitanya Charitamrita records that Sri Chaitanya Mahaprabhu visited Madurai, which it calls southern Mathura, on His South India tour. There He met a brahmana devoted to Lord Rama and later brought him a passage from the Kurma Purana explaining that Ravana never touched Sita Devi's spiritual form.",
    ],
    highlights: [
      "Goddess Meenakshi and Lord Sundareswarar worshipped together",
      "14 gopurams; the southern tower is 51.9 metres high",
      "Thousand Pillar Hall of the Nayak period, with musical pillars",
      "Potramarai Kulam, the Golden Lotus Tank, inside the temple",
      "One of the 274 shrines sung in the Devaram hymns",
      "Meenakshi Thirukalyanam during the Chithirai festival",
      "Visited by Sri Chaitanya Mahaprabhu (southern Mathura)",
    ],
    festivals: [
      { name: "Chithirai festival (Meenakshi Thirukalyanam), about 15 days", when: "Tamil month of Chithirai, April–May" },
      { name: "Avani Moolam", when: "August–September" },
      { name: "Navaratri", when: "September–October" },
      { name: "Masi Mandala Utsavam", when: "February–March" },
    ],
    timings: [
      { label: "Morning darshan", time: "5:00 AM – 12:30 PM" },
      { label: "Evening darshan", time: "4:00 PM – 10:00 PM" },
    ],
    timingsNote:
      "Timings are as published on the temple's HR&CE website; daily pooja times may change during festivals. " +
      CONFIRM_NOTE,
    fromVizag:
      "Plan the journey via Madurai, which has a railway station and an airport close to the temple. The station is about 1.6 km away and the airport about 11 km. Check current trains and flights from Visakhapatnam before you travel.",
    howToReach: {
      road: "The temple is in the centre of Madurai city.",
      rail: "Madurai railway station is about 1.6 km from the temple.",
      air: "Madurai airport is about 11 km from the temple.",
    },
    address: "Arulmigu Meenakshi Sundareswarar Temple, Madurai, Tamil Nadu 625001",
    placeQuery: "Meenakshi Amman Temple Madurai",
    website: "https://maduraimeenakshi.hrce.tn.gov.in",
    faqs: [
      {
        q: "When is the Meenakshi Thirukalyanam?",
        a: "It is celebrated during the Chithirai festival in April–May. In 2026 the festival began with flag hoisting on 19 April and the Thirukalyanam took place on 28 April.",
      },
      {
        q: "What are the temple's darshan hours?",
        a: "According to the temple's HR&CE website, 5:00 AM to 12:30 PM and 4:00 PM to 10:00 PM, with changes on festival days.",
      },
      {
        q: "How many gopurams does the Meenakshi temple have?",
        a: "The temple has 14 gopurams. Tamil Nadu Tourism describes them as 45 to 50 metres tall, and the tallest, on the south, is 51.9 metres high.",
      },
      {
        q: "Can I take my mobile phone inside the temple?",
        a: "In 2018 the Madurai Bench of the Madras High Court ordered that mobile phones should not be carried inside, for the security of the temple, and the ban took effect on 3 March 2018. Please confirm the current rules and phone-deposit arrangements at the temple before you go.",
      },
      {
        q: "What is the best time to visit the Meenakshi temple?",
        a: "Tamil Nadu Tourism says early morning is the best time to visit the temple, and October to March is the best season to visit Madurai.",
      },
      {
        q: "What is the Golden Lotus Tank?",
        a: "The Potramarai Kulam, or Golden Lotus Tank, is the holy tank inside the temple. The HR&CE website lists it as one of the temple's specialities, along with the Teppakulam float tank.",
      },
      {
        q: "Where can I stay near the Meenakshi temple?",
        a: "Tamil Nadu Tourism lists its own Hotel Tamilnadu properties in Madurai, including one on West Veli Street near the Periyar bus stand. The temple is in the city centre, so there are many other options nearby.",
      },
      {
        q: "Did Sri Chaitanya Mahaprabhu visit Madurai?",
        a: "Yes. The Chaitanya Charitamrita (Madhya 9.178 and 9.210) records that He came to southern Mathura (Madurai), met a brahmana devoted to Lord Rama, and later returned there to give him a passage from the original Kurma Purana.",
      },
    ],
    sections: [
      {
        heading: "Origin legend and early history",
        body: [
          "According to the temple's HR&CE history, a merchant named Dhananjaya found a self-manifested (swayambhu) Shiva linga beside a pond in a Kadamba forest, where the devas were said to worship it. Temple tradition says Shiva then appeared in a dream to the Pandya king Kulasekara, who cleared the forest, built a great temple and laid out the city of Madurai around it.",
          "A Kadamba tree in the northern prakaram is pointed to as a link with this forest. The HR&CE account also connects the old name Alavai with a legend of a serpent that held its tail in its mouth to mark the boundary of the city.",
          "The temple is one of the 274 shrines praised in the Devaram hymns and is linked with the 64 divine sports (Thiruvilaiyadal) of Shiva. Madurai is described at length in Tamil literature, including Sangam works, the Kalladam, the Periyapuranam and Paranjothi Munivar's Thiruvilaiyadal Puranam.",
        ],
      },
      {
        heading: "Meenakshi's reign and wedding",
        body: [
          "The temple tradition recorded by HR&CE says that Thadathagai, the princess born to Malayadhwaja Pandya and Kanchanamala, ruled the Pandya kingdom herself before going to Kailasa. Her divine marriage to Shiva is remembered at the festival of Panguni Uthiram.",
          "According to the same tradition, Shiva then ruled Madurai as Sundara Pandya. Later He placed their son, Ugra Kumara Pandya, on the throne, and the divine couple remained in Madurai as Meenakshi and Sundareswarar.",
        ],
      },
      {
        heading: "Architecture and halls",
        body: [
          "The HR&CE records date several gopurams to the Nayak period. The southern tower was built in 1559, in the time of Viswanatha Nayak. The seven-tier eastern gopuram of the Amman shrine dates to 1569, and the five-tier gopuram on the western Aadi street of the Amman shrine to 1570.",
          "The Thousand Pillar Hall (Aayiram Kaal Mandapam) is carved with figures such as a horse rider, a Pandya king, Arjuna, Nartana Ganapathi and Rati. Tamil Nadu Tourism notes that some of its pillars are musical and give different notes when tapped.",
          "Other halls listed by HR&CE include the Kambathadi Mandapam, carved with many forms of Shiva such as Ardhanari, Nataraja, Kalyanasundareswarar and Dakshinamurthy, as well as the Oonjal, Kilikoondu, Nootrukkal and Meenakshi Nayakar Mandapams. The corridor walls carry murals of the Thiruvilaiyadal Puranam.",
        ],
      },
      {
        heading: "Festivals through the year",
        body: [
          "The Chithirai festival is the temple's most celebrated event. Tamil Nadu Tourism describes it as a 15-day celebration that begins with flag hoisting (Kodi Yetram), recreates the wedding of Meenakshi and Sundareswarar, and takes the divine couple around the streets of Madurai on a chariot. In its final days Lord Kallazhagar of Alagar Kovil arrives at the Vaigai river on a golden horse.",
          "In 2026 the wedding was held on a stage on North Aadi Street on 28 April. The Hans India reported that the thali was tied to Goddess Meenakshi at about 8:55 AM, with Lord Perumal present among the processional Deities. Entry was free through the South Tower, and pass-holders (Rs 200 and Rs 500) entered through the West Tower.",
          "Tamil Nadu Tourism also lists Avani Moolam (August–September), Navaratri (September–October) and the Masi Mandala Utsavam (February–March).",
        ],
      },
      {
        heading: "Visitor guide",
        body: [
          "Early morning is the best time for darshan, according to Tamil Nadu Tourism, and October to March is the most pleasant season in Madurai. Tamil Nadu Tourism places the temple about 1 km from Madurai's main bus station and railway station, and about 11 km from the airport.",
          "Mobile phones were banned inside the temple by order of the Madras High Court's Madurai Bench in 2018. Please check current phone, camera and dress rules at the entrance before you go in.",
          "Nearby Vaishnava temples include Koodal Azhagar Temple in the city, Alagar Kovil and Thirumohoor Kalamegaperumal Temple. Tamil Nadu Tourism runs Hotel Tamilnadu properties in Madurai for pilgrims who want government accommodation.",
        ],
      },
    ],
    sources: [
      "https://maduraimeenakshi.hrce.tn.gov.in/",
      "https://maduraimeenakshi.hrce.tn.gov.in/hrcehome/history.php?tid=31962",
      "https://maduraimeenakshi.hrce.tn.gov.in/hrcehome/location.php?tid=31962",
      "https://hrce.tn.gov.in/hrcehome/towers.php?tid=31962",
      "https://hrce.tn.gov.in/hrcehome/sculpture.php?tid=31962",
      "https://hrce.tn.gov.in/hrcehome/tanks.php?tid=31962",
      "https://hrce.tn.gov.in/hrcehome/speciality.php?tid=31962",
      "https://www.incredibleindia.gov.in/en/tamil-nadu/madurai/meenakshi-amman-temple",
      "https://www.tamilnadutourism.tn.gov.in/destinations/meenakshi-amman-temple",
      "https://www.tamilnadutourism.tn.gov.in/events/chithirai",
      "https://www.thehansindia.com/news/national/grand-meenakshi-thirukalyanam-celebrated-with-splendour-in-tns-madurai-1070044",
      "https://www.deccanchronicle.com/nation/current-affairs/280218/ban-on-devotees-carrying-mobile-phone-in-meenakshi-temple-to-be-effect.html",
      "https://vedabase.io/en/library/cc/madhya/9/",
      "https://vedabase.io/en/library/cc/madhya/9/178/",
      "https://vedabase.io/en/library/cc/madhya/9/210/",
    ],
    check: [
      "Distances on the HR&CE page have no units; confirm they are kilometres",
      "Current dress code (no official source found) and current mobile phone/camera rules and deposit counters (2018 High Court ban sourced; 2026 statewide HR&CE phone rules reported only by non-approved outlets)",
      "Darshan timings: HR&CE says 5 AM–12:30 PM / 4–10 PM; Tamil Nadu Tourism says 6 AM–12:30 PM / 4–9 PM",
      "Teppam (float) festival date: removed, no valid source found",
      "Dates of Avani Moolam, Navaratri and Masi Mandala Utsavam as listed by Tamil Nadu Tourism",
      "Gopuram dates (1559, 1569, 1570) read from truncated HR&CE tower descriptions",
      "Chithirai 2026 dates (19 April flag hoisting, 28 April Thirukalyanam) as reported in the news",
    ],
  },

  // 6. Srisailam
  {
    slug: "srisailam-mallikarjuna-swamy-temple",
    name: "Srisailam Sri Bhramaramba Mallikarjuna Swamy Temple",
    shortName: "Srisailam",
    teluguName: "శ్రీశైలం శ్రీ భ్రమరాంబ మల్లికార్జున స్వామి దేవస్థానం",
    deity: "Sri Mallikarjuna Swamy (Lord Shiva) and Sri Bhramaramba Devi",
    form: "Mallikarjuna",
    town: "Srisailam",
    state: "Andhra Pradesh",
    district: "Nandyal",
    region: "Rayalaseema",
    summary:
      "Hill temple of Sri Bhramaramba Mallikarjuna Swamy in the Nallamala range, listed among the twelve Jyotirlingas of Lord Shiva.",
    history: [
      "Srisailam lies in the northern part of the Nallamala hill range, more than 1,500 feet above sea level. The Nandyal district administration describes the presiding Deity, Sri Bhramaramba Mallikarjuna Swamy, as a natural stone formation in the shape of a linga, and lists the temple as one of the twelve Jyotirlingas of Lord Shiva. Devotees also honour the shrine of Sri Bhramaramba Devi as a Shakti Peetha.",
      "According to the district administration, the temple was built in the 14th century, and its walls are carved with elephants, hunting scenes and Lord Shiva in different forms. Pilgrims also visit nearby places such as Sakshi Ganapathi, Pathala Ganga, Sikhareswaram, Hatakeswaram and the Shivaji Spurthi Kendra.",
      "The temple is administered by the Srisailam Devasthanam under the Andhra Pradesh Endowments Department, and darshan and seva tickets are booked through the devasthanam's website or the Endowments Department's website.",
    ],
    highlights: [
      "One of the twelve Jyotirlingas of Lord Shiva",
      "In the Nallamala hills, over 1,500 feet above sea level",
      "Temple walls carved with scenes of Lord Shiva and hunting scenes",
      "Visited by Sri Chaitanya Mahaprabhu (Mallikarjuna-tirtha)",
      "Sparsha darshan: devotees may touch the Jyotirlinga in set slots",
      "11-day Maha Shivaratri Brahmotsavams",
      "Sakshi Ganapathi and Pathala Ganga nearby",
    ],
    festivals: [
      { name: "Maha Shivaratri Brahmotsavams (11 days)", when: "February–March" },
      { name: "Ugadi Mahotsavam (large padayatra from North Karnataka)", when: "March–April" },
      { name: "Kartika Masotsavam (month-long)", when: "November–December" },
    ],
    timings: [
      { label: "Morning darshan", time: "6:00 AM – 3:30 PM" },
      { label: "Evening darshan", time: "6:00 PM – 10:00 PM" },
    ],
    timingsNote:
      "Timings are as listed on the Ministry of Tourism's Incredible India page. Sparsha (touch) darshan slots were revised in August 2026 and are not available in the morning and afternoon on Saturdays, Sundays and Mondays. " +
      CONFIRM_NOTE,
    fromVizag:
      "Plan the journey via Hyderabad, whose Rajiv Gandhi International Airport is the nearest airport. Srisailam is about 210 km from Hyderabad by road. Check current routes from Visakhapatnam before you travel.",
    howToReach: {
      road: "Srisailam is about 158 km from Nandyal, 180 km from Kurnool and 210 km from Hyderabad by road.",
      rail: "The Incredible India portal lists Kurnool City as the nearest railway station.",
      air: "Rajiv Gandhi International Airport, Hyderabad, is the nearest airport.",
    },
    address: "Sri Bhramaramba Mallikarjuna Swamy Devasthanam, Srisailam, Nandyal district, Andhra Pradesh",
    placeQuery: "Sri Bhramaramba Mallikarjuna Swamy Temple Srisailam",
    website: "https://www.srisailadevasthanam.org",
    faqs: [
      {
        q: "Can devotees touch the Jyotirlinga?",
        a: "Sparsha (touch) darshan is offered in set slots with tickets. Since August 2026 it has been available only at night on Saturdays, Sundays and Mondays; check the devasthanam's website for the current schedule.",
      },
      {
        q: "Is there free sparsha darshan at Srisailam?",
        a: "In 2025 the devasthanam restarted free sparsha darshan from Tuesday to Friday, 1:45 PM to 3:45 PM, using daily tokens that carry the devotee's name and Aadhaar number. About 1,000 to 1,200 tokens were issued a day. It is not offered on major festivals, public holidays or days of heavy rush. Please confirm the current slots before you travel.",
      },
      {
        q: "What is the dress code for sparsha darshan?",
        a: "Traditional dress is required for sparsha darshan. Men wear a white pancha (dhoti) with an upper cloth, and women wear a saree or salwar kameez with a chunni.",
      },
      {
        q: "What are the darshan ticket types?",
        a: "Sarva darshan is free. Paid counters of Rs 150 and Rs 300 were reported in 2025. During the 2026 Shivaratri festival the devasthanam offered free sarva darshan, Sheeghra darshan (Rs 200) and Ati-Sheeghra darshan (Rs 500). Check current prices on the official website.",
      },
      {
        q: "When is the Maha Shivaratri festival at Srisailam?",
        a: "The temple celebrates 11-day Maha Shivaratri Brahmotsavams in February–March. In 2026 they ran from 8 to 18 February, with Maha Shivaratri on 15 February.",
      },
      {
        q: "Where should I book darshan, sevas and rooms?",
        a: "Officials advise booking only through the Srisailam Devasthanam website (srisailadevasthanam.org), which handles sevas and accommodation, or the AP Endowments Department website (aptemples.ap.gov.in). Never pay into personal accounts.",
      },
      {
        q: "Did Sri Chaitanya Mahaprabhu visit Srisailam?",
        a: "Yes. The Chaitanya Charitamrita (Madhya 9.15) records that He visited Mallikarjuna-tirtha, which Srila Prabhupada's purport identifies as Sri Saila, and inspired the people there to chant the holy name of Krishna. Madhya 9.174–175 describes a later visit to Sri Saila.",
      },
    ],
    sections: [
      {
        heading: "Sri Chaitanya at Srisailam",
        body: [
          "The Chaitanya Charitamrita (Madhya 9.15) records that Sri Chaitanya Mahaprabhu went to Mallikarjuna-tirtha, saw the Deity of Lord Shiva there, and induced all the people to chant the holy name of Krishna.",
          "In his purport Srila Prabhupada explains that Mallikarjuna is also known as Sri Saila, about one hundred miles north-east of Kurnool on the southern bank of the Krishna river, and that the Deity is one of the Jyotirlingas.",
          "Later in the same chapter (Madhya 9.174–175), Mahaprabhu walks towards Sri Saila. The text says that Lord Shiva and his wife Durga were living there in the dress of brahmanas, and were very pleased to see Him.",
        ],
      },
      {
        heading: "Darshan types and tickets",
        body: [
          "Sarva darshan is free. Paid counters of Rs 150 and Rs 300 were reported in 2025. Prices and quotas change, so please check the devasthanam's website.",
          "Sparsha darshan lets devotees touch the Jyotirlinga. In 2025 the devasthanam restarted free sparsha darshan from Tuesday to Friday, 1:45 PM to 3:45 PM, with about 1,000 to 1,200 Aadhaar-linked tokens a day; the paid counters were paused during those hours.",
          "In August 2026 the temple stopped morning and afternoon touch darshan on Saturdays, Sundays and Mondays to ease the weekend rush; it remains available at night on those days. Sparsha darshan is suspended on major festivals and on very busy days.",
        ],
      },
      {
        heading: "Dress code",
        body: [
          "Traditional dress is mandatory for sparsha darshan. Men wear a white pancha (dhoti) with an upper cloth (scarf). Women wear a saree, or a salwar kameez with a chunni.",
        ],
      },
      {
        heading: "Maha Shivaratri Brahmotsavams",
        body: [
          "Srisailam's biggest festival is the 11-day Maha Shivaratri Brahmotsavam. In 2026 it began on 8 February with Yagasala Pravesam and ended on 18 February with Pushpotsavam and Sayanotsavam. Daily vahana sevas, Pushpa Pallaki Seva, Rathotsavam and Teppotsavam are part of the festival.",
          "On Shivaratri night the temple performs the Lingodbhava Maha Nyasa Purvaka Rudrabhishekam, the Pagalankarana and the Kalyanotsavam of Lord Mallikarjuna with Goddess Bhramaramba. The festival closes with Dhwajavarohanam, when the flag is lowered from the dhwaja stambham.",
          "During the festival, arjita sevas are suspended and devotees receive alankara darshan. In 2026, sparsha darshan was allowed only for Shiva Deeksha devotees carrying the Jyotirmudi from 8 to 12 February, and was fully suspended from the night of 13 February to the end of the festival.",
        ],
      },
      {
        heading: "Ugadi and Kartika month",
        body: [
          "At Ugadi, tens of thousands of devotees from North Karnataka and the Maharashtra border walk to Srisailam through the Nallamala forest, some covering more than 600 km and carrying kavadis. They offer a saree to Goddess Bhramaramba, whom they regard as a daughter of their own household, continuing a custom handed down for generations.",
          "The month of Kartika (November–December) is celebrated as the Kartika Masotsavam. Homams, the Subrahmanyeswara Kalyanam and the Kalyanotsavam of Mallikarjuna Swamy and Bhramaramba continue through the month. On peak days only alankara darshan is given, and sparsha darshan is suspended on Saturdays, Sundays and Mondays.",
        ],
      },
      {
        heading: "Visitor guide",
        body: [
          "Book darshan, sevas and rooms only on the official websites: srisailadevasthanam.org or the AP Endowments Department's aptemples.ap.gov.in. Officials have warned devotees about fake temple websites.",
          "Srisailam is a forest hill town. The Nandyal district administration lists Sikhareswaram, Hatakeswaram, Pala Dhara–Pancha Dhara, Sakshi Ganapathi, Pathala Ganga, the Shivaji Spurthi Kendra and the Chenchu Lakshmi Tribal Museum as places worth visiting nearby.",
          "Incredible India's temperature data show April and May as the hottest months, with maximums above 42°C, while November to January is cooler. Plan for long queues on weekends, Kartika Mondays and festival days.",
        ],
      },
    ],
    sources: [
      "https://nandyal.ap.gov.in/temple-tourism/",
      "https://www.incredibleindia.gov.in/en/andhra-pradesh/kurnool/srisailam-temple",
      "https://www.srisailadevasthanam.org",
      "https://apsrtc.ap.gov.in/fp_srisailam.php",
      "https://www.deccanchronicle.com/southern-states/andhra-pradesh/srisailam-revises-darshan-timings-to-ease-pilgrim-rush-1976246",
      "https://www.deccanchronicle.com/amp/southern-states/andhra-pradesh/beware-of-fake-temple-websites-officials-1919262",
      "https://www.deccanchronicle.com/southern-states/andhra-pradesh/free-sparsha-darshan-at-srisailam-to-resume-from-july-1-1887423",
      "https://www.deccanchronicle.com/southern-states/srisailam-brahmotsvam-concludes-1864385",
      "https://deccanchronicle.com/southern-states/andhra-pradesh/srisailam-sees-massive-kannada-padayatra-for-ugadi-1869579",
      "https://deccanchronicle.com/nation/in-other-news/141123/kartika-month-restrictions-on-sparsha-darshan-at-srisailam.html",
      "https://assets.thehansindia.com/andhra-pradesh/srisailam-gears-up-for-11-day-maha-sivaratri-brahmotsavams-1046510",
      "https://vedabase.io/en/library/cc/madhya/9/15/",
      "https://vedabase.io/en/library/cc/madhya/9/174/",
      "https://vedabase.io/en/library/cc/madhya/9/175/",
    ],
    check: [
      "Shakti Peetha status of the Bhramaramba shrine: no valid source found; framed as devotees' belief",
      "Current darshan timings, sparsha darshan slots and paid ticket prices (Rs 150/300 from June 2025 news; devasthanam website is a JS app and could not be read)",
      "Whether free Tuesday–Friday sparsha darshan (1:45–3:45 PM) still runs after the August 2026 revision",
      "Dress code for general darshan (only the sparsha darshan dress code is sourced)",
      "Nearest railway station (Incredible India says Kurnool City; Markapur Road is often used)",
      "Night closure of the forest ghat road",
      "Ugadi and Kartika month dates for the coming year",
      "Removed for lack of valid source: Mallika/Bhramara legends, Shivaji gopuram, Vijayanagara additions, Tarakasura/Markandeya legends on Incredible India",
      "PIN code 518101",
    ],
  },

  // 7. Kashi Vishwanath
  {
    slug: "kashi-vishwanath-temple-varanasi",
    name: "Shri Kashi Vishwanath Temple, Varanasi",
    shortName: "Kashi Vishwanath",
    teluguName: "కాశీ శ్రీ విశ్వనాథ ఆలయం, వారణాసి",
    deity: "Sri Vishwanath (Lord Shiva) as a Jyotirlinga",
    form: "Vishwanath",
    town: "Varanasi",
    state: "Uttar Pradesh",
    district: "Varanasi",
    region: "Uttar Pradesh",
    summary:
      "The Jyotirlinga of Lord Vishwanath on the Ganga in Varanasi (Kashi), where Sri Chaitanya Mahaprabhu taught Sanatana Goswami.",
    history: [
      "Kashi Vishwanath stands on the western bank of the Ganga in Varanasi and enshrines the Jyotirlinga of Lord Shiva as Vishweshwara or Vishwanath. According to temple tradition, a single visit here brings the merit of darshan of all the Jyotirlingas. The Srimad Bhagavatam honours Lord Shiva (Shambhu) as the greatest of Vaishnavas.",
      "The Shri Kashi Vishwanath Temple Trust records that the temple in its present form was built in 1780 by Maharani Ahilyabai Holkar of Indore, and that in 1839 two of its domes were covered with gold donated by Maharaja Ranjit Singh. The temple was taken over by the Government of Uttar Pradesh in 1983 and is managed by a trust. The Kashi Vishwanath Dham was inaugurated on 13 December 2021, and pilgrims can now enter the corridor from the Ganga ghat.",
      "The Chaitanya Charitamrita describes how Sri Chaitanya Mahaprabhu instructed Sanatana Goswami in Varanasi for two months, and how Prakashananda Sarasvati and his followers joined the Lord in chanting the Hare Krishna maha-mantra.",
    ],
    highlights: [
      "One of the twelve Jyotirlingas",
      "Present temple built by Maharani Ahilyabai Holkar in 1780",
      "Two domes covered with gold donated by Maharaja Ranjit Singh",
      "Mahaprabhu taught Sanatana Goswami in Kashi",
      "Kashi Vishwanath Dham opened in 2021, with entry from the Ganga ghat",
      "Four daily aartis, from Mangala Aarti at 3 AM to Shringar Aarti at night",
      "Temple premises grew from about 3,000 to about 5 lakh sq ft with the Dham",
    ],
    festivals: [
      { name: "Maha Shivaratri", when: "February–March" },
      { name: "Rangbhari Ekadashi", when: "Phalguna month, before Holi" },
      { name: "Kartik month", when: "October–November" },
      { name: "Diwali", when: "October–November" },
      { name: "Monthly Shivaratri", when: "Every month" },
    ],
    timings: [
      { label: "Temple open", time: "3:00 AM – 11:00 PM" },
      { label: "Mangala aarti", time: "3:00 AM – 4:00 AM" },
      { label: "Darshan", time: "4:00–11:00 AM, 12:20–7:00 PM and 8:30–9:00 PM" },
      { label: "Mid-day Bhog aarti", time: "11:15 AM – 12:20 PM" },
      { label: "Sapta Rishi aarti", time: "7:00 PM – 8:15 PM" },
      { label: "Night Shringar aarti", time: "9:00 PM – 10:15 PM" },
    ],
    timingsNote:
      "Timings are from the Shri Kashi Vishwanath Temple Trust FAQ; aarti tickets are booked on the trust's website or app. " +
      CONFIRM_NOTE,
    fromVizag:
      "The nearest railway station is Varanasi Junction and the nearest airport is Lal Bahadur Shastri International Airport. Check current trains and flights from Visakhapatnam before you travel.",
    howToReach: {
      road: "The nearest bus station is the Chaudhary Charan Singh Bus Stand. Entry to the corridor from the Ganga ghat side (Gate No. 1) is allowed from 6 AM to 9 PM.",
      rail: "Varanasi Junction is the nearest railway station.",
      air: "Lal Bahadur Shastri International Airport is the nearest airport.",
    },
    address: "Shri Kashi Vishwanath Temple, Varanasi, Uttar Pradesh 221001",
    placeQuery: "Shri Kashi Vishwanath Temple Varanasi",
    website: "https://shrikashivishwanath.org",
    faqs: [
      {
        q: "Is there a dress code at Kashi Vishwanath?",
        a: "The trust says there is no dress code for darshan, but devotees are advised to wear decent clothes.",
      },
      {
        q: "Are phones allowed inside?",
        a: "No. Electronic and non-electronic gadgets, including pens, are not allowed inside. Free lockers are available at Mandir Chauk, the help desk and other points.",
      },
      {
        q: "Is there an entry fee?",
        a: "Entry is free. Sugam Darshan costs ₹300 per person and includes a shastri who escorts you near the sanctum.",
      },
      {
        q: "Does the temple trust have guest houses?",
        a: "Yes: Gangadarshanam Guest House near Dashashwamedh Ghat and Southern Grand Kashi in the corridor. The trust says both have restaurant facilities.",
      },
      {
        q: "How do I book the Mangala Aarti?",
        a: "Book on the trust's website shrikashivishwanath.org, through its official app, or at the help desk. Mangala Aarti is from 3:00 to 4:00 AM; report by 2:30 AM and enter through Gate No. 1. Aarti bookings cannot be cancelled or refunded.",
      },
      {
        q: "Can I perform Rudrabhishek at Kashi Vishwanath?",
        a: "Yes. The trust offers 1-, 5- and 11-shastri Rudrabhishek, Laghu Rudra and Maha Rudra, bookable online, between 4 AM and 6 PM. The shastri's dakshina is included in the ticket, but milk is bought separately in the temple premises.",
      },
      {
        q: "What is included in Sugam Darshan?",
        a: "For ₹300 per person, a shastri takes you near the sanctum without waiting in the queue. You also get a box of prasad and a free locker, and the shastri's dakshina is included.",
      },
      {
        q: "Can I enter from the Ganga ghat?",
        a: "Yes. Pilgrims can enter the corridor from the Ganga ghat through Gate No. 1, between 6 AM and 9 PM.",
      },
    ],
    sections: [
      {
        heading: "History in detail",
        body: [
          "The trust's history adds that in 1785 a Naubatkhana (music gallery) was built in front of the temple by the then Collector, Mohd. Ibrahim Khan, at the instance of Governor General Warren Hastings. Of the temple's three domes, two were gold-plated with Maharaja Ranjit Singh's gift in 1839; the third still remains uncovered.",
          "When the Government of Uttar Pradesh took over the temple on 28 January 1983, its management was entrusted to a trust headed by Dr Vibhuti Narayan Singh, the former Kashi Naresh, with an executive committee chaired by the Divisional Commissioner. The trust lists Adi Shankaracharya, Goswami Tulsidas, Guru Nanak, Ramakrishna Paramahamsa and Swami Vivekananda among the saints who visited the temple.",
        ],
      },
      {
        heading: "Architecture",
        body: [
          "According to Incredible India, the main temple is quadrangular and is surrounded by shrines of other deities, including Dandapani, Kaal Bhairav and Vishnu. The structure has three parts: a spire, a golden dome, and a golden spire crowned with a flag and trishul, rising to almost 15.5 metres. Because of its gold covering, the temple is also known as the Golden Temple.",
          "The Jyotirlinga is enshrined in the sanctum on a silver altar.",
        ],
      },
      {
        heading: "Kashi Vishwanath Dham corridor",
        body: [
          "PIB notes that pilgrims who bathed in the Ganga and carried Gangajal to offer at the temple used to pass through congested, poorly kept streets. The Shri Kashi Vishwanath Dham project, inaugurated on 13 December 2021, created an accessible pathway linking the temple to the banks of the river. PIB reports that the project area is about 5 lakh square feet, compared with about 3,000 square feet before.",
          "Phase 1 opened 23 buildings, including Yatri Suvidha Kendras, a Tourist Facilitation Centre, a Vedic Kendra, Mumukshu Bhavan, a Bhogshala, a City Museum, a Viewing Gallery and a food court. Ramps and escalators were provided for elderly and differently abled pilgrims. More than 40 ancient temples found during the work were restored without changing their original structure.",
        ],
      },
      {
        heading: "Daily aartis and sevas",
        body: [
          "Four aartis are performed every day: Mangala Aarti (3:00–4:00 AM), Mid-day Bhog Aarti (11:15 AM–12:20 PM), Sapta Rishi Aarti (7:00–8:15 PM) and Night Shringar Aarti (9:00–10:15 PM). Tickets are booked on the trust's website, its official app or at the help desk, and the trust treats the amount as a donation, so bookings cannot be cancelled or refunded.",
          "Rudrabhishek can be offered between 4 AM and 6 PM, with 1, 5 or 11 shastris, or as Laghu Rudra and Maha Rudra. Devotees who donate ₹11,000 for annadanam have an Annakshetra arrangement made in their name and receive free darshan, according to the trust.",
        ],
      },
      {
        heading: "Sri Chaitanya Mahaprabhu in Kashi",
        body: [
          "The Chaitanya Charitamrita (Madhya-lila 17) describes Mahaprabhu's first visit to Kashi on His way to Vrindavan. He bathed at Manikarnika Ghat, where Tapana Mishra met Him and took Him to see Lord Vishweshwara and then Bindu Madhava. Mahaprabhu stayed in Varanasi for ten days, accepting meals only at Tapana Mishra's home, and was also served by His old devotee Chandrashekhara.",
        ],
      },
      {
        heading: "Visitor guide",
        body: [
          "The temple is open from 3 AM to 11 PM, with general darshan from 4–11 AM, 12:20–7 PM and 8:30–9 PM. Entry is free; Sugam Darshan costs ₹300 per person. Phones, pens and all other gadgets must be left outside, and free lockers are available at Mandir Chauk, the Yatri Suvidha Kendras (YSK 1–3) and the help desk near Gate No. 4. The trust runs seven ticket counters, including one at Dashashwamedh Ghat.",
          "There is no dress code, but decent clothing is advised. To stay close by, the trust's Gangadarshanam Guest House is near Dashashwamedh Ghat and Southern Grand Kashi is inside the corridor.",
          "Nearby, Incredible India lists the Maa Annapurna, Vishalakshi, Kaal Bhairav and Sankat Mochan Hanuman temples, and the evening Ganga Aarti at Dashashwamedh Ghat. The trust suggests Sarnath as another place to visit.",
        ],
      },
    ],
    sources: [
      "https://shrikashivishwanath.org",
      "https://shrikashivishwanath.org/mythology",
      "https://shrikashivishwanath.org/pdffile/FAQ_SHRI_KASHI_VISHWANTH_TEMPLE_2_0_pdf.pdf",
      "https://www.pmindia.gov.in/en/eventgallery/pm-in-uttar-pradesh-december-13-2021/",
      "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1780658",
      "https://www.incredibleindia.gov.in/en/uttar-pradesh/varanasi/kashi-vishwanath-temple",
      "https://vedabase.io/en/library/sb/12/13/16/",
      "https://vedabase.io/en/library/cc/madhya/17/",
      "https://vedabase.io/en/library/cc/madhya/25/",
    ],
    check: [
      "FAQ timings and Sugam Darshan fee are current",
      "Distances from Varanasi Junction and the airport",
      "Medieval destructions, 'seven sacred cities', Dev Deepawali and Shravan festivals: removed, no valid source",
      "Locality (Lahori Tola) for the address",
      "Opening time: the trust FAQ says 3 AM, Incredible India says 2:30 AM",
      "Rudrabhishek options and the ₹11,000 annadanam donation (with free darshan) are current",
      "Locker points, help desk location (near Gate No. 4) and the seven ticket counters",
      "Whether the third dome has since been gold-plated (trust page says it remained uncovered)",
      "Spire height of about 15.5 m and the silver altar (Incredible India only)",
    ],
  },

  // 8. ISKCON Vrindavan
  {
    slug: "iskcon-vrindavan-krishna-balaram-mandir",
    name: "Sri Krishna Balaram Mandir (ISKCON Vrindavan)",
    shortName: "ISKCON Vrindavan",
    teluguName: "శ్రీ కృష్ణ బలరామ మందిరం (ఇస్కాన్ బృందావనం)",
    deity: "Sri Sri Krishna Balaram, Sri Sri Gaura Nitai and Sri Sri Radha Shyamasundar",
    form: "Krishna",
    town: "Raman Reti, Vrindavan",
    state: "Uttar Pradesh",
    district: "Mathura",
    region: "Uttar Pradesh",
    summary:
      "Srila Prabhupada's temple of Krishna and Balaram in Raman Reti, Vrindavan, opened on Rama Navami 1975 and the place of his samadhi.",
    history: [
      "ISKCON's land in Vrindavan is in Raman Reti, an area of forest and soft sand where, as the Srila Prabhupada-lilamrita relates, Krishna and Balaram enjoyed Their childhood pastimes. Srila A. C. Bhaktivedanta Swami Prabhupada chose Krishna and Balaram as the presiding Deities, and also wished to install Gaura Nitai and Radha Shyamasundar with Lalita and Vishakha.",
      "Prabhupada chose Rama Navami for the opening. On 20 April 1975 he installed the Deities for the grand opening of the Krishna Balaram Mandir, with almost a thousand disciples present and the Governor of Uttar Pradesh as guest of honour. After offering the first arati, he explained that this was an international temple where people from all over the world could come and take shelter of Gaura Nitai, Krishna Balaram and Radha Krishna.",
      "Srila Prabhupada left this world on 14 November 1977 in his room at the Krishna Balaram Mandir. Before his departure he described where his samadhi should be placed, and a space in front of the temple was prepared for it.",
    ],
    highlights: [
      "Founded by Srila Prabhupada, opened on Rama Navami, 20 April 1975",
      "Deities of Krishna Balaram, Gaura Nitai and Radha Shyamasundar",
      "Srila Prabhupada's marble samadhi mandir",
      "Srila Prabhupada's preserved quarters, where he spent his final days",
      "24-hour kirtan; mangala arati at 4:10 AM",
      "In Raman Reti, remembered as a place of Krishna and Balaram's pastimes",
    ],
    festivals: [
      { name: "Sri Krishna Janmashtami", when: "Bhadrapada month, August–September" },
      { name: "Sri Radhashtami", when: "Bhadrapada month, August–September" },
      { name: "Balaram Purnima", when: "Shravana Purnima, August" },
      { name: "Rama Navami (temple opening day)", when: "Chaitra month, March–April" },
      { name: "Kartik month, with Gopashtami", when: "October–November" },
      { name: "Gaura Purnima", when: "Phalguna Purnima, February–March" },
    ],
    timings: [{ label: "Mangala arati", time: "4:10 AM" }],
    timingsNote:
      "The temple's guest house page gives mangala arati at 4:10 AM. Darshan timings differ between summer and winter; check the temple's official website. " + CONFIRM_NOTE,
    fromVizag:
      "Mathura is the nearest railhead for Vrindavan, and Delhi's Indira Gandhi International Airport is the usual airport. Check current trains and flights from Visakhapatnam before you travel.",
    howToReach: {
      road: "Mathura, the district headquarters, is about 145 km from Delhi and is linked to New Delhi by expressway; autos and taxis run from Mathura to Vrindavan.",
      rail: "Mathura Junction is a major railway junction on the Delhi–Agra route.",
      air: "Indira Gandhi International Airport, New Delhi, and Agra's Kheria airport are the nearest airports to Mathura.",
    },
    address: "Sri Krishna Balaram Mandir (ISKCON), Bhaktivedanta Swami Marg, Raman Reti, Vrindavan, Mathura district, Uttar Pradesh 281121",
    placeQuery: "ISKCON Sri Krishna Balaram Mandir Vrindavan",
    website: "https://iskconvrindavan.com",
    faqs: [
      {
        q: "When did the Krishna Balaram Mandir open?",
        a: "Srila Prabhupada opened the temple and installed the Deities on Rama Navami, 20 April 1975.",
      },
      {
        q: "What time is mangala arati at ISKCON Vrindavan?",
        a: "The temple's website gives 4:10 AM for mangala arati. Other darshan times change between summer and winter, so please check the official website before you go.",
      },
      {
        q: "Where is Srila Prabhupada's samadhi?",
        a: "Srila Prabhupada's samadhi mandir is a carved marble shrine beside the Krishna Balaram Mandir, built where his body was placed in samadhi in 1977. It is surrounded by gardens.",
      },
      {
        q: "Can I see Srila Prabhupada's rooms?",
        a: "The temple preserves Srila Prabhupada's Quarter, the room where he spent his final days, as a memorial with his bed, desk, glasses and original manuscripts. Please ask at the temple for current visiting hours.",
      },
      {
        q: "Is there kirtan all day at ISKCON Vrindavan?",
        a: "Yes. The temple describes its 24-hour kirtan, which guests at the on-campus Krishna Balaram Guest House can hear even in the early morning.",
      },
      {
        q: "Where can I stay?",
        a: "The Sri Sri Krishna Balaram Guest House is inside the temple campus. ISKCON Vrindavan also lists the MVT Guesthouse about 100 metres behind the temple, ISKCON Seva Sadan about 8 minutes' walk away, and the Prabhupada Ashram about 1.3 km away. Rooms can be booked through the temple website.",
      },
      {
        q: "Is there a dress code?",
        a: "ISKCON Vrindavan's etiquette guide asks women to wear saris or modest clothing that does not expose the legs, and men preferably to wear dhoti-kurta or simple traditional clothes.",
      },
      {
        q: "Where can I eat near the temple?",
        a: "Govinda's Restaurant is on the ground floor of the Krishna Balaram Guest House and serves Indian and Western vegetarian dishes. The temple lists breakfast from 8:00 to 11:59 AM, lunch from 12:00 to 2:30 PM and dinner from 6:00 to 9:15 PM.",
      },
    ],
    sections: [
      {
        heading: "The Deities on the altars",
        body: [
          "Sri Sri Krishna Balaram, installed by Srila Prabhupada in 1975, are the heart of the temple. The temple describes Them as Lord Krishna and His elder brother Balarama in Their Vrindavan pastimes. They stand on the main altar, flanked by Sri Sri Radha Shyamasundar on one side and Sri Sri Gaura Nitai on the other.",
          "Gaura Nitai, Sri Chaitanya Mahaprabhu and Sri Nityananda Prabhu, represent sankirtan, the congregational chanting of the holy names. Radha Shyamasundar, also installed by Srila Prabhupada, are worshipped with daily arati and seasonal festivals. A Giriraja shila, a stone from Govardhan Hill, is also worshipped in the temple; according to Vaishnava tradition Govardhan is non-different from Krishna.",
        ],
      },
      {
        heading: "Srila Prabhupada's Samadhi",
        body: [
          "Srila Prabhupada's samadhi mandir is a marble shrine beside the Krishna Balaram Mandir, built where his body was placed in samadhi in 1977. It is decorated with fine carvings and surrounded by gardens. Devotees come here to offer respects and to sit quietly in his presence.",
          "Inside the temple compound is Srila Prabhupada's Quarter, the room where he spent his final days and left this world on 14 November 1977. The temple keeps it as a memorial with his bed, desk, glasses and original manuscripts. The Srila Prabhupada-lilamrita describes how, in those last weeks, devotees held kirtan in his room day and night.",
        ],
      },
      {
        heading: "Daily worship and kirtan",
        body: [
          "The day begins with mangala arati at 4:10 AM, and the temple encourages guests to join the full morning programme. The temple is known for its 24-hour kirtan, so the holy names are sung through the day and night.",
          "Devotees can sponsor puja for Krishna Balaram, Gaura Nitai, Radha Shyamasundar, the Giriraja shila and Srila Prabhupada's samadhi and quarters through the temple's online puja service. Festival sevas listed by the temple include abhishekam on Janmashtami, Gaura Purnima and Nityananda Trayodasi, and yajnas for Radhashtami, Balaram Purnima and Narasimha Jayanti.",
        ],
      },
      {
        heading: "Festivals",
        body: [
          "Janmashtami and the month of Kartik are the busiest times of the year, and the temple advises booking rooms well in advance for them. Rama Navami is also the temple's opening anniversary, marking the day in 1975 when Srila Prabhupada installed the Deities.",
          "Other major celebrations include Gaura Purnima, Radhashtami, Balaram Purnima and Gopashtami in Kartik.",
        ],
      },
      {
        heading: "Visitor guide",
        body: [
          "ISKCON Vrindavan's etiquette guide asks visitors to dress modestly: saris or modest clothes for women, and preferably dhoti-kurta or simple traditional wear for men. Shoes are not taken inside. Visitors are asked to respect no-photography rules, speak softly, avoid using phones near the altar, and walk clockwise when going around temples.",
          "The Sri Sri Krishna Balaram Guest House is inside the temple campus, a few steps from the temple and the samadhi. Other ISKCON stays include the MVT Guesthouse about 100 metres behind the temple, ISKCON Seva Sadan about 8 minutes' walk away and the Prabhupada Ashram about 1.3 km away on Sunrakh Road. Carry a valid photo ID for check-in.",
          "Govinda's Restaurant, on the ground floor of the guest house, serves breakfast, lunch and dinner, and the MVT Restaurant is close by.",
        ],
      },
    ],
    sources: [
      "https://iskconvrindavan.com",
      "https://iskconvrindavan.com/puja-services/sri-sri-krishna-balram",
      "https://iskconvrindavan.com/puja-services/sri-sri-radha-shyamsundar",
      "https://iskconvrindavan.com/puja-services/sri-sri-gaura-nitai",
      "https://iskconvrindavan.com/puja-services/sri-giriraja-sila",
      "https://iskconvrindavan.com/puja-services/srila-prabhupada-samadhi-puja",
      "https://iskconvrindavan.com/puja-services/srila-prabhupada-quarter",
      "https://iskconvrindavan.com/visit-vrindavan/guest-house",
      "https://iskconvrindavan.com/visit-vrindavan/holy-dham-etiquette",
      "https://iskconvrindavan.com/visit-vrindavan/dining-options",
      "https://iskconvrindavan.com/festival/gopashtami",
      "https://vedabase.io/en/library/spl/2/43/",
      "https://vedabase.io/en/library/spl/2/44/",
      "https://vedabase.io/en/library/spl/2/45/",
      "https://vedabase.io/en/library/spl/2/54/",
      "https://vedabase.io/en/library/spl/2/55/",
      "https://mathura.nic.in/how-to-reach/",
    ],
    check: [
      "Current summer and winter darshan and arati timings beyond mangala arati (4:10 AM, from the guest house page)",
      "Visiting hours for Srila Prabhupada's Quarter",
      "Photography rules inside the temple hall and samadhi (etiquette page says to respect no-photography rules; confirm where they apply)",
      "Which side of Krishna Balaram each of the other altars stands on (page text says only 'flanked by')",
      "Govinda's Restaurant meal hours (8:00–11:59 AM, 12:00–2:30 PM, 6:00–9:15 PM as listed)",
      "Months given for Radhashtami, Balaram Purnima and Gopashtami are calendar-based; confirm dates each year",
      "Distance from Mathura Junction to the temple",
      "Street name (Bhaktivedanta Swami Marg) added to the address from the guest house page; confirm",
    ],
  },

  // 9. Banke Bihari
  {
    slug: "banke-bihari-temple-vrindavan",
    name: "Sri Banke Bihari Temple, Vrindavan",
    shortName: "Banke Bihari",
    teluguName: "శ్రీ బాంకే బిహారీ ఆలయం, బృందావనం",
    deity: "Sri Banke Bihari (Lord Krishna)",
    form: "Krishna",
    town: "Vrindavan",
    state: "Uttar Pradesh",
    district: "Mathura",
    region: "Uttar Pradesh",
    summary:
      "Vrindavan's temple of Banke Bihari, the Deity who appeared to Swami Haridas in Nidhivan, where darshan is broken by a curtain drawn at intervals.",
    history: [
      "According to the temple's own account, Swami Haridas settled in the groves of Nidhivan in Vrindavan, and it was there that Bihariji appeared. Temple tradition holds that the Lord and Radha appeared together before Swami Haridas and merged into one black form, popularly known as Bihariji.",
      "The temple records that the service of the Deity was handed to Goswami Jagannath, whose descendants still perform it, and that the present temple was built in 1862, with the Goswamis themselves gathering the resources for its construction. The temple has no tradition of mangala (early morning) service, and darshan is broken by a curtain drawn at regular intervals.",
      "The Lord's feet, otherwise covered, are shown to devotees only on Akshaya Tritiya. The temple celebrates Bihar Panchami as the day of Bihariji's appearance.",
    ],
    highlights: [
      "The Deity who appeared to Swami Haridas in Nidhivan",
      "Curtain drawn at intervals during darshan",
      "Darshan of the Lord's feet only on Akshaya Tritiya",
      "Present temple built in 1862",
    ],
    festivals: [
      { name: "Bihar Panchami (appearance day of Bihariji)", when: "November–December (14 December in 2026)" },
      { name: "Akshaya Tritiya (darshan of the Lord's feet)", when: "Vaisakha month, April–May" },
    ],
    timings: [
      { label: "Winter morning (11 Nov – 24 Mar)", time: "8:45 AM – 1:00 PM" },
      { label: "Winter evening (11 Nov – 24 Mar)", time: "4:30 PM – 8:30 PM" },
    ],
    timingsNote:
      "Winter timings are from the temple portal (bihariji.org); summer timings were not published there. " + CONFIRM_NOTE,
    fromVizag:
      "Mathura is the nearest railhead for Vrindavan, and Delhi's Indira Gandhi International Airport is the usual airport. Check current trains and flights from Visakhapatnam before you travel.",
    howToReach: {
      road: "Mathura, the district headquarters, is about 145 km from Delhi and is linked to New Delhi by expressway; autos and taxis run from Mathura to Vrindavan.",
      rail: "Mathura Junction is a major railway junction on the Delhi–Agra route.",
      air: "Indira Gandhi International Airport, New Delhi, and Agra's Kheria airport are the nearest airports to Mathura.",
    },
    address: "Sri Banke Bihari Temple, Vrindavan, Mathura district, Uttar Pradesh 281121",
    placeQuery: "Shri Banke Bihari Temple Vrindavan",
    faqs: [
      {
        q: "Why is the curtain closed so often at Banke Bihari?",
        a: "It is the temple's tradition that darshan is broken by a curtain drawn at regular intervals.",
      },
      {
        q: "Is there a mangala arati at Banke Bihari?",
        a: "The temple says it has no tradition of mangala (early morning) service.",
      },
      {
        q: "When can devotees see the Lord's feet?",
        a: "Only on Akshaya Tritiya, when the cloth covering the Lord's feet is removed.",
      },
    ],
    sources: [
      "https://bihariji.org/",
      "https://bihariji.org/templehistory.php",
      "https://www.patrika.com/en/astrology-and-spirituality/darshan-of-the-feet-of-banke-bihari-only-on-akshaya-tritiya-19562126",
      "https://mathura.nic.in/how-to-reach/",
    ],
    check: [
      "Whether bihariji.org is the temple's official website today (it says it is managed by the temple's sewa adhikaris; website field not set)",
      "Summer darshan timings",
      "Construction year: the temple portal says 1862 (the earlier draft said 1864)",
      "Removed for lack of valid source: flute on Sharad Purnima, flower bungalows, Hariyali Teej swing, Janmashtami mangala arati",
      "Locality (Bihari Pura) for the address",
    ],
  },

  // 10. Somnath
  {
    slug: "somnath-temple-gujarat",
    name: "Shree Somnath Jyotirlinga Temple, Prabhas Patan",
    shortName: "Somnath",
    teluguName: "సోమనాథ జ్యోతిర్లింగ ఆలయం, ప్రభాస పట్టణం",
    deity: "Sri Somnath (Lord Shiva) as a Jyotirlinga",
    form: "Somnath",
    town: "Prabhas Patan, Somnath",
    state: "Gujarat",
    district: "Gir Somnath",
    region: "Gujarat",
    summary:
      "Seaside Jyotirlinga of Lord Somnath at Prabhas Patan, Gujarat, rebuilt after independence and close to Bhalka Tirth and Dehotsarg of Lord Krishna's pastimes.",
    history: [
      "Somnath stands on the Arabian Sea shore at Prabhas Patan in Gujarat, and the Shree Somnath Trust describes it as the first of the twelve Jyotirlingas of Lord Shiva. According to the traditions the trust records, the Moon (Chandra) was cursed by his father-in-law Daksha for favouring Rohini among his twenty-seven wives and lost his light; on Lord Brahma's advice he worshipped Lord Shiva at Prabhas and was released from the curse.",
      "The trust records that the temple was desecrated several times between the 11th and 18th centuries and rebuilt each time. The present temple was rebuilt at the resolve of Sardar Vallabhbhai Patel, who visited the ruins on 13 November 1947, and the President, Dr Rajendra Prasad, performed the pran-pratishtha on 11 May 1951. Built in the Kailas Mahameru Prasad style with a shikhara 155 feet high, it is managed by the Shree Somnath Trust. An arrow pillar at the temple, the Tirth Stambh, marks the unobstructed sea route to the South Pole.",
      "Prabhas is also connected with Lord Krishna's final pastimes. The trust identifies Bhalka Tirth, about 5 km away, as the place where the hunter Jara's arrow struck the Lord's foot, and Dehotsarg Tirth on the banks of the Hiran, about 1.5 km from the temple, as the place from which the Lord departed for His own abode.",
    ],
    highlights: [
      "First of the twelve Jyotirlingas, according to the Shree Somnath Trust",
      "Seaside temple rebuilt after independence, consecrated on 11 May 1951",
      "Near Bhalka Tirth and Dehotsarg Tirth of Lord Krishna's pastimes",
      "Triveni Ghat, the meeting point of the Hiran, Kapila and Saraswati rivers",
    ],
    festivals: [
      { name: "Maha Shivaratri", when: "February–March" },
      { name: "Shravan month", when: "July–August" },
      { name: "Kartik Purnima fair (5 days)", when: "October–November" },
      { name: "Somnath Sthapana Divas", when: "11 May" },
      { name: "Golokdham Utsav", when: "March–April" },
    ],
    timings: [
      { label: "Darshan", time: "6:00 AM – 10:00 PM" },
      { label: "Aartis", time: "7:00 AM, 12:00 noon and 7:00 PM" },
      { label: "Light and sound show (not in monsoon)", time: "8:00 PM – 9:00 PM" },
    ],
    timingsNote:
      "Timings are from the Shree Somnath Trust FAQ; another page on the trust's site gives the light and sound show as 7:45–8:45 PM. " +
      CONFIRM_NOTE,
    fromVizag:
      "The Shree Somnath Trust lists Diu (85 km), Rajkot (200 km) and Ahmedabad (390 km) as the nearest airports. Check current flights and trains from Visakhapatnam before you travel.",
    howToReach: {
      road: "Somnath is connected by bus with Diu, Rajkot and Ahmedabad.",
      rail: "Somnath railway station is about 0.5 km from the temple and Veraval about 7 km.",
      air: "The nearest airports are Diu (85 km), Rajkot (200 km) and Ahmedabad (390 km).",
    },
    address: "Shree Somnath Temple, Prabhas Patan, Gir Somnath district, Gujarat 362268",
    placeQuery: "Shree Somnath Jyotirlinga Temple Prabhas Patan",
    website: "https://somnath.org",
    faqs: [
      {
        q: "Are mobile phones allowed inside Somnath temple?",
        a: "No. Mobiles, cameras, smartwatches and other gadgets are prohibited; they can be left in the free cloak room lockers. Photography is not allowed.",
      },
      {
        q: "Is there a dress code?",
        a: "The trust allows Indian sarees, dhotis, trousers, T-shirts and skirts, but mini skirts and disrespectful dress are not permitted.",
      },
      {
        q: "Is there an entry fee?",
        a: "No, entry to the temple is free.",
      },
      {
        q: "Where can I stay?",
        a: "The Shree Somnath Trust's guest houses (Sagar Darshan Atithi Gruh, Lilavati Atithi Bhavan and Maheshwari Atithi Bhavan) can be booked on its website.",
      },
    ],
    sources: [
      "https://somnath.org",
      "https://somnath.org/jay-somnath",
      "https://somnath.org/somnath-darshan/",
      "https://somnath.org/nearest-places/",
      "https://somnath.org/faq/",
      "https://somnath.org/festivals",
    ],
    check: [
      "Light and sound show time (trust pages give 8–9 PM and 7:45–8:45 PM)",
      "Current flights at Diu and Rajkot",
      "Architectural style corrected to 'Kailas Mahameru Prasad' per the trust (draft said Chalukya)",
    ],
  },
];
