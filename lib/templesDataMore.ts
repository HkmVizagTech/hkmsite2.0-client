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
    ],
    festivals: [
      { name: "Ratha Yatra", when: "Ashadha Shukla Dwitiya, June–July" },
      { name: "Snana Yatra", when: "Jyeshtha Purnima, May–June; darshan then pauses for about 15 days" },
      { name: "Chandan Yatra", when: "Begins on Akshaya Tritiya and lasts 42 days, April–June" },
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
        a: "According to the temple administration's FAQ, only Hindus are allowed inside the temple.",
      },
      {
        q: "What should I not carry into the temple?",
        a: "The temple's list of don'ts includes umbrellas, mobile phones, electronic gadgets and leather items, and footwear is not allowed in or around the temple. Bathe and wear clean clothes before entering.",
      },
      {
        q: "Is darshan available throughout the year?",
        a: "No. After Snana Yatra on Jyeshtha Purnima, the temple administration says darshan of the Deities is not available for about 15 days.",
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
      "https://puri.odisha.gov.in/en/tourism/how-to-reach",
      "https://vedabase.io/en/library/cc/madhya/13/",
    ],
    check: [
      "Current darshan hours for the public (only the ritual schedule is published)",
      "Road distance and travel time from Visakhapatnam, and current direct trains",
      "Whether to add Srila Prabhupada's 1967 San Francisco Ratha Yatra (no valid source found yet)",
      "Street address (Bada Danda) and PIN code 752001",
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
      "Foremost of the 108 Divya Desams",
      "Lord Ranganatha reclines facing south",
      "Seven enclosures and a 236-foot Rajagopuram",
      "Sri Chaitanya Mahaprabhu stayed here for Chaturmasya",
    ],
    festivals: [
      {
        name: "Vaikuntha Ekadasi (opening of the Paramapada Vasal)",
        when: "December–January, the highlight of a festival of about three weeks",
      },
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
        a: "The Paramapada Vasal is opened in the early morning of Vaikuntha Ekadasi, in December or January. The date and time change every year, so check the temple's announcements.",
      },
      {
        q: "Does the temple have rooms for devotees?",
        a: "The temple's devotee rest house bookings were temporarily stopped from 25 June 2026 for renovation; call the temple on 9486482246 for current accommodation information.",
      },
    ],
    sources: [
      "https://srirangamranganathar.hrce.tn.gov.in/",
      "https://srirangamranganathar.hrce.tn.gov.in/hrcehome/history.php?tid=25700",
      "https://srirangamranganathar.hrce.tn.gov.in/hrcehome/location.php?tid=25700",
      "https://www.dtnext.in/amp/story/news/tamilnadu/vaikunta-ekadasi-fete-celebrated-with-religious-fervour-in-srirangam-temple-818771",
      "https://vedabase.io/en/library/cc/madhya/9/",
      "https://vedabase.io/en/library/cc/adi/10/105/",
    ],
    check: [
      "Distances on the HR&CE page have no units; confirm they are kilometres",
      "Whether the rest house has reopened after renovation",
      "Dress code and paid darshan options",
      "Other festivals to list (Panguni Uthiram, Chithirai Ther were removed: no valid source)",
      "Whether to describe Srirangam as an island between the Kaveri and Kollidam (removed: no valid source)",
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
      "Thousand Pillar Hall of the Nayak period",
      "Meenakshi Thirukalyanam during the Chithirai festival",
      "Visited by Sri Chaitanya Mahaprabhu (southern Mathura)",
    ],
    festivals: [
      { name: "Chithirai festival (Meenakshi Thirukalyanam)", when: "April–May" },
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
        a: "It is celebrated during the Chithirai festival in April–May. In 2026 the Thirukalyanam took place on 28 April.",
      },
      {
        q: "What are the temple's darshan hours?",
        a: "According to the temple's HR&CE website, 5:00 AM to 12:30 PM and 4:00 PM to 10:00 PM, with changes on festival days.",
      },
    ],
    sources: [
      "https://maduraimeenakshi.hrce.tn.gov.in/",
      "https://maduraimeenakshi.hrce.tn.gov.in/hrcehome/history.php?tid=31962",
      "https://maduraimeenakshi.hrce.tn.gov.in/hrcehome/location.php?tid=31962",
      "https://www.incredibleindia.gov.in/en/tamil-nadu/madurai/meenakshi-amman-temple",
      "https://uniindia.com/tn-chithirai-festival-of-meenakshi-temple-begins-with-flag-hoisting-ceremony/south/news/3450729.html",
      "https://vedabase.io/en/library/cc/madhya/9/",
    ],
    check: [
      "Distances on the HR&CE page have no units; confirm they are kilometres",
      "Current dress code and rules on phones and cameras",
      "Golden Lotus Tank, Navaratri and Teppam festival: removed, no valid source found",
      "Date of the 2026 Thirukalyanam (28 April) as reported in the news",
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
      "Sakshi Ganapathi and Pathala Ganga nearby",
      "Maha Shivaratri draws huge crowds",
    ],
    festivals: [{ name: "Maha Shivaratri", when: "February–March" }],
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
        q: "Where should I book darshan, sevas and rooms?",
        a: "Officials advise booking only through the Srisailam Devasthanam website (srisailadevasthanam.org) or the AP Endowments Department website (aptemples.ap.gov.in), and never paying into personal accounts.",
      },
    ],
    sources: [
      "https://nandyal.ap.gov.in/temple-tourism/",
      "https://www.incredibleindia.gov.in/en/andhra-pradesh/kurnool/srisailam-temple",
      "https://apsrtc.ap.gov.in/fp_srisailam.php",
      "https://www.deccanchronicle.com/southern-states/andhra-pradesh/srisailam-revises-darshan-timings-to-ease-pilgrim-rush-1976246",
      "https://www.deccanchronicle.com/amp/southern-states/andhra-pradesh/beware-of-fake-temple-websites-officials-1919262",
    ],
    check: [
      "Shakti Peetha status of the Bhramaramba shrine: no valid source found; framed as devotees' belief",
      "Current darshan timings and sparsha darshan slots (devasthanam website did not load for checking)",
      "Nearest railway station (Incredible India says Kurnool City; Markapur Road is often used)",
      "Night closure of the forest ghat road",
      "Removed for lack of valid source: Mallika/Bhramara legends, Shivaji gopuram, Vijayanagara additions, Ugadi/Dasara/Karthika festivals",
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
        a: "Yes: Gangadarshanam Guest House near Dashashwamedh Ghat and Southern Grand Kashi in the corridor.",
      },
    ],
    sources: [
      "https://shrikashivishwanath.org",
      "https://shrikashivishwanath.org/mythology",
      "https://shrikashivishwanath.org/pdffile/FAQ_SHRI_KASHI_VISHWANTH_TEMPLE_2_0_pdf.pdf",
      "https://www.pmindia.gov.in/en/eventgallery/pm-in-uttar-pradesh-december-13-2021/",
      "https://vedabase.io/en/library/sb/12/13/16/",
      "https://vedabase.io/en/library/cc/madhya/25/",
    ],
    check: [
      "FAQ timings and Sugam Darshan fee are current",
      "Distances from Varanasi Junction and the airport",
      "Medieval destructions, 'seven sacred cities', Dev Deepawali and Shravan festivals: removed, no valid source",
      "Locality (Lahori Tola) for the address",
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
      "Srila Prabhupada's samadhi",
      "In Raman Reti, remembered as a place of Krishna and Balaram's pastimes",
    ],
    festivals: [
      { name: "Sri Krishna Janmashtami", when: "Bhadrapada month, August–September" },
      { name: "Rama Navami (temple opening day)", when: "Chaitra month, March–April" },
      { name: "Kartik month", when: "October–November" },
      { name: "Gaura Purnima", when: "Phalguna Purnima, February–March" },
    ],
    timings: [],
    timingsNote:
      "Darshan timings differ between summer and winter; check the temple's official website. " + CONFIRM_NOTE,
    fromVizag:
      "Mathura is the nearest railhead for Vrindavan, and Delhi's Indira Gandhi International Airport is the usual airport. Check current trains and flights from Visakhapatnam before you travel.",
    howToReach: {
      road: "Mathura, the district headquarters, is about 145 km from Delhi and is linked to New Delhi by expressway; autos and taxis run from Mathura to Vrindavan.",
      rail: "Mathura Junction is a major railway junction on the Delhi–Agra route.",
      air: "Indira Gandhi International Airport, New Delhi, and Agra's Kheria airport are the nearest airports to Mathura.",
    },
    address: "Sri Krishna Balaram Mandir (ISKCON), Raman Reti, Vrindavan, Mathura district, Uttar Pradesh 281121",
    placeQuery: "ISKCON Sri Krishna Balaram Mandir Vrindavan",
    website: "https://iskconvrindavan.com",
    faqs: [
      {
        q: "When did the Krishna Balaram Mandir open?",
        a: "Srila Prabhupada opened the temple and installed the Deities on Rama Navami, 20 April 1975.",
      },
      {
        q: "Where can I stay?",
        a: "ISKCON Vrindavan has a guest house that can be booked through the temple's website.",
      },
    ],
    sources: [
      "https://iskconvrindavan.com",
      "https://vedabase.io/en/library/spl/2/43/",
      "https://vedabase.io/en/library/spl/2/44/",
      "https://vedabase.io/en/library/spl/2/45/",
      "https://vedabase.io/en/library/spl/2/54/",
      "https://vedabase.io/en/library/spl/2/55/",
      "https://mathura.nic.in/how-to-reach/",
    ],
    check: [
      "Current summer and winter darshan and arati timings (official site did not expose them)",
      "Whether Prabhupada's rooms are open to visitors, and at what times",
      "Distance from Mathura Junction to the temple",
      "Street name (Bhaktivedanta Swami Marg) for the address",
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
