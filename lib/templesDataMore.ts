// Major Hindu temples across India: pilgrimage guide content (continuation of templesData.ts).
// Original writing for ISKCON Gambheeram Visakhapatnam (Hare Krishna Movement, Vizag).
// Every entry carries a `check` list of facts the temple team must verify before publishing.
// Timings in particular are taken from commonly published listings and change often.

import type { Temple } from "./templesData";

const STANDARD_NOTE =
  "Timings change on festival days, eclipses and special occasions; please confirm with the temple administration before you travel.";

export const TEMPLES_MORE: Temple[] = [
  // 1. Puri Jagannath
  {
    slug: "puri-jagannath-temple",
    name: "Sri Jagannath Temple, Puri",
    shortName: "Puri Jagannath",
    teluguName: "పూరీ శ్రీ జగన్నాథ ఆలయం",
    deity: "Sri Jagannath with Sri Baladeva, Subhadra Devi and Sudarshana",
    form: "Jagannath",
    town: "Puri",
    state: "Odisha",
    district: "Puri",
    region: "Odisha",
    summary:
      "The seaside home of Lord Jagannath, Baladeva and Subhadra in Puri, Odisha, famed for Ratha Yatra and for Sri Chaitanya Mahaprabhu's years of kirtan.",
    history: [
      "Puri, known in scripture as Purushottama Kshetra and Nilachala, is one of the four great dhamas of India. The traditional account tells of King Indradyumna, a devotee of Lord Vishnu, who longed to see the Lord and was guided to a sacred log floating in the sea. An aged carpenter offered to carve the Deities on the condition that no one disturb him; when the impatient queen opened the doors early, the forms of Jagannath, Baladeva and Subhadra were found with round eyes and unfinished hands, and the Lord accepted to be worshipped in exactly that way.",
      "The present temple, rising high above the town in the Kalinga style, is generally credited to King Anantavarman Chodaganga Deva of the Eastern Ganga dynasty in the 12th century, with later additions by his successors. The Deities are carved from neem wood and are renewed in the Nabakalebara ceremony in certain years. The temple kitchen is often described as one of the largest in the world, and the sanctified food, Mahaprasad, is shared freely among all who receive it at the Ananda Bazaar.",
      "For Gaudiya Vaishnavas, Puri is inseparable from Sri Chaitanya Mahaprabhu, who spent the later part of His life here, chanting and dancing before the Lord and leading the Ratha Yatra with His associates. Srila Prabhupada carried this festival to the world, beginning with the San Francisco Ratha Yatra in 1967, so that Lord Jagannath could bless people in every country.",
    ],
    highlights: [
      "One of the four dhamas, also called Purushottama Kshetra",
      "Annual Ratha Yatra, when the Lord comes out to meet everyone",
      "Sri Chaitanya Mahaprabhu lived in Puri in His later years",
      "Mahaprasad from one of the largest temple kitchens",
      "About 440 km from Visakhapatnam by road",
    ],
    festivals: [
      { name: "Ratha Yatra", when: "Ashadha Shukla Dwitiya, June–July" },
      { name: "Snana Yatra", when: "Jyeshtha Purnima, May–June" },
      { name: "Chandana Yatra", when: "From Akshaya Tritiya for about three weeks, April–May" },
      { name: "Nabakalebara (renewal of the Deities)", when: "Only in certain years with an extra Ashadha month" },
    ],
    timings: [
      { label: "Temple opens (Mangala Arati, commonly listed)", time: "about 5:00 AM" },
      { label: "General darshan (commonly listed)", time: "about 6:00 AM – 9:00 PM, with breaks for offerings" },
      { label: "Temple closes (Pahuda, commonly listed)", time: "late night, often around 11:00 PM–midnight" },
    ],
    timingsNote:
      "Darshan at Puri pauses several times a day for bhoga offerings and rituals, and the schedule changes on festival days; please check the Shree Jagannatha Temple Administration notices before you travel.",
    fromVizag:
      "Puri is about 440 km from Visakhapatnam. Several trains connect Visakhapatnam to Puri (around 7–9 hours); by road the drive takes about 8–9 hours.",
    howToReach: {
      road: "National highways connect Puri with Bhubaneswar (about 60 km) and the rest of Odisha, with frequent buses and taxis.",
      rail: "Puri railway station is about 2–3 km from the temple and has direct trains from Visakhapatnam.",
      air: "Biju Patnaik International Airport, Bhubaneswar, is about 60 km from Puri.",
    },
    address: "Sri Jagannath Temple, Grand Road (Bada Danda), Puri, Odisha 752001",
    placeQuery: "Shree Jagannath Temple Puri Odisha",
    website: "https://www.shreejagannatha.in",
    faqs: [
      {
        q: "Who can enter the Puri Jagannath temple?",
        a: "By long-standing temple rules, entry is limited to Hindus. All visitors can see Lord Patita Pavana at the Lion Gate and take Jagannath's darshan during Ratha Yatra.",
      },
      {
        q: "Is there a dress code at Puri?",
        a: "Traditional and modest Indian dress is expected. Mobile phones, cameras and leather items are not allowed inside and must be deposited outside.",
      },
      {
        q: "What is the best time to visit Puri?",
        a: "October to February is pleasant. Ratha Yatra in June or July is the most special time, though the town is very crowded.",
      },
      {
        q: "Where can I stay in Puri?",
        a: "Puri has many hotels, dharmashalas and guest houses, including ISKCON's guest house; book early for Ratha Yatra.",
      },
    ],
    sources: [
      "https://www.shreejagannatha.in",
      "https://en.wikipedia.org/wiki/Jagannath_Temple,_Puri",
      "https://vedabase.io/en/library/cc/madhya/",
      "https://sambadenglish.com/timing-for-darshan-at-puri-jagannath-temple-extended-till-9-pm",
    ],
    check: [
      "Current daily timings: listings conflict (5:30 AM–9 PM, 6 AM–9 PM, split sessions); confirm with SJTA",
      "Official website URL (shreejagannatha.in) is current",
      "Attribution of the temple to Anantavarman Chodaganga Deva (12th century)",
      "Current rules on phones, cameras and entry for non-Hindus",
      "Distance by road (about 440 km) and train journey time",
      "Whether ISKCON's Puri guest house currently accepts bookings",
      "PIN code 752001",
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
      "Self-manifested Vinayaka in a well on the Bahuda river near Chittoor, revered as the witness of truth and visited by Tirupati pilgrims.",
    history: [
      "Kanipakam is a village on the banks of the Bahuda river in Chittoor district. Its story begins with three brothers, one unable to speak, one unable to hear and one unable to see, who were digging a well to water their field. When the spade struck a hard stone, blood is said to have flowed from it, and at that moment the three brothers were cured. The villagers came running and found a form of Lord Vinayaka in the water. They offered so many coconuts that the coconut water flowed over a large area of land, and the place came to be called Kani-pakam, from the words for wetland and flowing.",
      "The Deity still stands in the same well, and water continues to rise around Him. Devotees believe that the self-manifested (swayambhu) form is slowly growing. The stone temple around the well is popularly said to have been built by a Chola king in the 11th century and expanded by later rulers. The name of the river is also linked to a story of two brothers, Sankha and Likhita, in which a hand cut off as punishment was restored after a bath in its waters, and so the river came to be called Bahuda.",
      "Kanipakam Vinayaka is honoured as a witness of truth. By local custom, people settle disputes by taking an oath before the Lord, and many make vows here to give up bad habits. The temple is managed by the Endowments Department of Andhra Pradesh, and the nearby shrines of Sri Varadaraja Swamy and Sri Manikanteswara Swamy are often visited on the same trip.",
    ],
    highlights: [
      "Self-manifested Vinayaka standing in a well that still holds water",
      "Traditional place for oaths of truth (satya pramanam)",
      "Long Brahmotsavam beginning on Vinayaka Chaturthi",
      "About 12 km from Chittoor and 70 km from Tirupati",
      "Nearby Varadaraja Swamy and Manikanteswara shrines",
    ],
    festivals: [
      { name: "Vinayaka Chaturthi Brahmotsavam", when: "Begins on Bhadrapada Shukla Chaturthi, August–September, for about three weeks" },
      { name: "Sankashti Chaturthi", when: "Every month, on the fourth day after the full moon" },
      { name: "Ugadi and Sankranti special pujas", when: "March–April and January" },
    ],
    timings: [
      { label: "Temple opens (commonly listed)", time: "about 4:00 AM" },
      { label: "Darshan (commonly listed)", time: "about 4:00 AM – 9:30 PM" },
    ],
    timingsNote: STANDARD_NOTE,
    fromVizag:
      "Kanipakam is roughly 800 km from Visakhapatnam. Most pilgrims take an overnight train to Tirupati (around 12–15 hours) and continue about 70 km by bus or taxi.",
    howToReach: {
      road: "APSRTC buses run from Tirupati and Chittoor to Kanipakam; from Chittoor town it is about 12 km.",
      rail: "Chittoor station is closest; Tirupati and Katpadi junctions have more trains from Visakhapatnam.",
      air: "Tirupati Airport at Renigunta is roughly 85 km away; flights from Visakhapatnam usually need a connection.",
    },
    address: "Sri Varasiddhi Vinayaka Swamy Devasthanam, Kanipakam, Irala Mandal, Chittoor district, Andhra Pradesh 517131",
    placeQuery: "Sri Varasiddhi Vinayaka Swamy Temple Kanipakam",
    faqs: [
      {
        q: "Can Kanipakam be visited along with Tirumala?",
        a: "Yes. Many pilgrims visit Kanipakam on the way to or from Tirupati, which is about two hours away by road.",
      },
      {
        q: "How long does darshan take at Kanipakam?",
        a: "On ordinary days darshan usually takes under an hour; on Vinayaka Chaturthi and holidays it can take several hours.",
      },
      {
        q: "Is there a dress code?",
        a: "Traditional, modest dress is recommended. Please check the devasthanam's current rules before your visit.",
      },
      {
        q: "Where can I stay near Kanipakam?",
        a: "The devasthanam runs some rooms near the temple, and Chittoor and Tirupati have many hotels.",
      },
    ],
    sources: [
      "https://en.wikipedia.org/wiki/Kanipakam_Vinayaka_Temple",
      "https://templesinindiainfo.com/kanipakam-temple-timings-address-sevas",
      "https://gokshetra.com/kanipakam-temple-timings-today-opening-closing-darshan",
    ],
    check: [
      "Daily timings (listings give 4:00 AM or 4:30 AM opening and 9:00 or 9:30 PM closing)",
      "Official devasthanam website URL (srikanipakadevasthanam.org is cited by some sites; not included)",
      "Builder and date: Chola king (often named as Kulothunga Chola I), 11th century",
      "Meaning of the name Kanipakam as written here",
      "Length of the Brahmotsavam (about 20–21 days)",
      "Distances: 12 km from Chittoor, 70 km from Tirupati, 85 km from Tirupati Airport",
      "Mandal (Irala) and PIN code 517131",
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
      "A modern temple of Goddess Lakshmi Narayani near Vellore, covered in gold and reached by a star-shaped path through green gardens.",
    history: [
      "Sripuram stands at Thirumalaikodi, at the southern edge of Vellore city in Tamil Nadu, in the shadow of the Eastern Ghats. Unlike most of the temples in this guide, it is a recent creation: it was built by the Sri Narayani Peedam, a spiritual trust led by Sri Sakthi Amma, and consecrated in 2007. The presiding Deity is Sri Lakshmi Narayani, a form of Goddess Mahalakshmi, the eternal consort of Lord Narayana and the giver of all good fortune.",
      "The temple is best known for its gold. The vimana and mandapam are covered with sheets of gold worked by hand in traditional temple-art styles, so that the whole shrine glows in sunlight and shines under lamps after dark. Around it lies a long star-shaped walkway set in landscaped gardens. Along the path, panels carry spiritual messages and verses, so the walk itself becomes a quiet preparation before pilgrims reach the Goddess at the centre.",
      "The campus also runs charitable activities such as food distribution and health care, and it has become one of the most visited places in the Vellore region. For pilgrims travelling from Andhra Pradesh, Sripuram is often combined with a trip to Tirupati, Kanipakam or the Jalakandeswarar temple inside Vellore Fort. Devotees remember that Lakshmi Devi is always found with Lord Narayana, and pray to Her for the gift of devotion as well as material blessings.",
    ],
    highlights: [
      "Shrine of Sri Lakshmi Narayani covered in hand-worked gold",
      "Star-shaped garden walkway leading to the sanctum",
      "Consecrated in 2007 by the Sri Narayani Peedam",
      "Beautiful evening darshan under lamps",
      "Easy to combine with Tirupati and Kanipakam",
    ],
    festivals: [
      { name: "Navaratri", when: "Ashvin month, September–October" },
      { name: "Deepavali and Lakshmi Puja", when: "October–November" },
      { name: "Tamil New Year (Puthandu)", when: "Mid-April" },
    ],
    timings: [
      { label: "Abhishekam (commonly listed)", time: "about 4:00 AM – 8:00 AM" },
      { label: "General darshan (commonly listed)", time: "about 8:00 AM – 8:00 PM" },
    ],
    timingsNote:
      "Last entry is usually earlier than closing time; please confirm timings and seva tickets with the Sripuram administration before you travel.",
    fromVizag:
      "Sripuram is roughly 850–900 km from Visakhapatnam. The practical route is an overnight train to Katpadi Junction (Vellore), then about 15 km by taxi or bus.",
    howToReach: {
      road: "Town buses and autos run from Vellore new bus stand to Sripuram, about 8 km away.",
      rail: "Katpadi Junction, the main station for Vellore, is about 15 km from the temple.",
      air: "Chennai International Airport is about 140 km away; Tirupati Airport is another option.",
    },
    address: "Sripuram, Thirumalaikodi, Vellore, Tamil Nadu 632055",
    placeQuery: "Sripuram Golden Temple Vellore",
    website: "https://www.sripuram.org",
    faqs: [
      {
        q: "Is there a dress code at Sripuram?",
        a: "Yes, modest traditional dress is required; shorts, sleeveless tops and similar clothing are generally not allowed.",
      },
      {
        q: "Can I carry a mobile phone?",
        a: "Phones, cameras and electronic items are usually not permitted and must be deposited at the entrance counter.",
      },
      {
        q: "How long does a visit take?",
        a: "Walking the star path and having darshan usually takes one to two hours, longer on weekends and holidays.",
      },
      {
        q: "When is the best time to visit?",
        a: "Evening, when the gold temple is lit up, is a favourite time; October to February is the most comfortable season.",
      },
    ],
    sources: [
      "https://www.sripuram.org",
      "https://en.wikipedia.org/wiki/Sripuram",
      "https://www.trawell.in/tamilnadu/vellore/sripuram",
    ],
    check: [
      "Darshan timings (8 AM–8 PM is common; some list 4 AM opening for abhishekam)",
      "Consecration year 2007 and current name of the founding trust",
      "Current dress code and phone rules",
      "Festival list as celebrated at Sripuram",
      "Distances: 8 km from Vellore bus stand, 15 km from Katpadi, 140 km from Chennai airport",
      "Whether trains from Visakhapatnam stop at Katpadi",
      "PIN code 632055",
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
      "The island temple of Sri Ranganatha between the Kaveri and Kollidam rivers, first of the 108 Divya Desams and home of Sri Ramanujacharya.",
    history: [
      "Srirangam is an island formed by the Kaveri and Kollidam rivers at Tiruchirappalli. Here Lord Vishnu rests on Adi Sesha as Sri Ranganatha, facing south. The traditional account says the Deity was worshipped in the Ikshvaku dynasty and given by Lord Rama to Vibhishana, who was carrying Him to Lanka. When Vibhishana set the Lord down on this island, He chose to remain, and in kindness He continues to look south towards Lanka.",
      "The temple is counted first among the 108 Divya Desams praised by the Alwars, and the Sri Vaishnava tradition calls it simply 'Koil', the temple. Its seven concentric enclosures hold a whole town of streets, homes and shrines, crowned by many gopurams; the tallest, the Rajagopuram, was completed in 1987. Sri Ramanujacharya lived here for many years, organised the worship, and is still honoured in his own shrine within the complex. In the 14th century the festival Deity was carried away for safety during invasions and returned only decades later, an episode the temple still remembers.",
      "Sri Chaitanya Mahaprabhu stayed at Srirangam for the four months of Chaturmasya during His South India tour, as the guest of Venkata Bhatta. The Chaitanya Charitamrita describes how He chanted and danced before Lord Ranganatha daily, and how the young Gopala Bhatta, who later became one of the six Goswamis of Vrindavan, served Him during that time.",
    ],
    highlights: [
      "First of the 108 Divya Desams",
      "Lord Ranganatha reclines on Adi Sesha, facing south",
      "Sri Ramanujacharya lived and served here",
      "Sri Chaitanya Mahaprabhu stayed here for Chaturmasya",
      "Seven enclosures and a towering Rajagopuram",
    ],
    festivals: [
      { name: "Vaikuntha Ekadasi (Paramapada Vasal opening)", when: "Margazhi month, December–January, within a 21-day festival" },
      { name: "Panguni Uthiram", when: "March–April" },
      { name: "Chithirai Ther (car festival)", when: "April–May" },
    ],
    timings: [
      { label: "Vishwaroopa seva (commonly listed)", time: "about 6:00 AM – 7:15 AM" },
      { label: "Morning darshan (commonly listed)", time: "about 9:00 AM – 12:00 noon" },
      { label: "Afternoon darshan (commonly listed)", time: "about 1:15 PM – 6:00 PM" },
      { label: "Evening darshan (commonly listed)", time: "about 6:45 PM – 9:00 PM" },
    ],
    timingsNote: STANDARD_NOTE,
    fromVizag:
      "Srirangam is roughly 1,100–1,200 km from Visakhapatnam. Most pilgrims fly to Tiruchirappalli via Chennai, Hyderabad or Bengaluru, or take a train to Chennai and continue by rail.",
    howToReach: {
      road: "Srirangam is about 8 km from Tiruchirappalli's Central and Chatram bus stands, with frequent town buses.",
      rail: "Srirangam station is close to the temple; Tiruchirappalli Junction is about 10 km away.",
      air: "Tiruchirappalli International Airport is about 15 km from the temple.",
    },
    address: "Sri Ranganathaswamy Temple, Srirangam, Tiruchirappalli, Tamil Nadu 620006",
    placeQuery: "Sri Ranganathaswamy Temple Srirangam",
    faqs: [
      {
        q: "Is there a dress code at Srirangam?",
        a: "Traditional dress is expected: dhoti or trousers with a shirt for men, and saree or churidar for women. Shorts are not appropriate.",
      },
      {
        q: "How long does darshan take?",
        a: "Ordinary days may need one to two hours; Vaikuntha Ekadasi and weekends can take much longer. Paid quick-darshan tickets are usually available.",
      },
      {
        q: "When is the best time to visit?",
        a: "November to February is pleasant. Vaikuntha Ekadasi is the most celebrated day but is extremely crowded.",
      },
      {
        q: "Where can I stay?",
        a: "There are guest houses in Srirangam itself and many hotels in Tiruchirappalli city.",
      },
    ],
    sources: [
      "https://www.srirangam.org",
      "https://en.wikipedia.org/wiki/Ranganathaswamy_Temple,_Srirangam",
      "https://vedabase.io/en/library/cc/madhya/9/",
      "https://www.hindu-blog.com/2016/10/srirangam-temple-darshan-timings.html",
    ],
    check: [
      "Daily timings and break periods (evening start given as 6:40 or 6:45 PM)",
      "Official website: whether srirangam.org is the temple's official site (website field not set)",
      "Rajagopuram completion year 1987",
      "Wording of the 14th-century episode of the festival Deity being taken away",
      "Distances from Tiruchirappalli bus stands, junction and airport",
      "Whether any direct Visakhapatnam–Tiruchirappalli train runs",
      "PIN code 620006",
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
      "The great temple of Goddess Meenakshi and Lord Sundareswarar at the heart of Madurai, known for its colourful gopurams and Chithirai festival.",
    history: [
      "Madurai has grown around its temple for many centuries, and the city's streets are laid out in squares around the sacred complex. The presiding Goddess is Meenakshi, the fish-eyed one, a form of Parvati, worshipped with Lord Sundareswarar, a form of Shiva. Local tradition tells that she appeared as the daughter of a Pandya king, ruled the land as a warrior queen, and when she met Sundareswarar she recognised Him as her eternal Lord. Their divine wedding is the central story of the temple, and Lord Vishnu is honoured as the brother who gave the bride away.",
      "The temple is praised in early Tamil devotional poetry, but much of the present structure dates from the 16th and 17th centuries, when the Nayak rulers of Madurai rebuilt and enlarged it after earlier damage. Its towering gopurams are covered with thousands of painted figures of gods, sages and celestial beings. Inside are the Golden Lotus Tank, where pilgrims pause before darshan, and a great hall of many carved pillars that now also houses a temple art museum.",
      "Sri Chaitanya Mahaprabhu also visited Madurai, which the Chaitanya Charitamrita calls Dakshina Mathura, during His South India pilgrimage. There He met a devoted brahmana who worshipped Lord Rama and comforted him with a teaching about Sita Devi's spiritual nature. Pilgrims from Andhra Pradesh often combine Madurai with Rameswaram and Srirangam on one trip.",
    ],
    highlights: [
      "Goddess Meenakshi and Lord Sundareswarar worshipped together",
      "Tall gopurams covered with painted sculptures",
      "Golden Lotus Tank and hall of carved pillars",
      "Chithirai festival celebrates the divine wedding",
      "Visited by Sri Chaitanya Mahaprabhu (Dakshina Mathura)",
    ],
    festivals: [
      { name: "Chithirai Thiruvizha (Meenakshi Thirukalyanam)", when: "Chithirai month, April–May" },
      { name: "Navaratri", when: "September–October" },
      { name: "Float festival (Teppam)", when: "Thai month, January–February" },
    ],
    timings: [
      { label: "Morning darshan (commonly listed)", time: "about 5:00 AM – 12:30 PM" },
      { label: "Evening darshan (commonly listed)", time: "about 4:00 PM – 9:30 PM" },
    ],
    timingsNote: STANDARD_NOTE,
    fromVizag:
      "Madurai is roughly 1,300 km from Visakhapatnam. Most pilgrims fly to Madurai via Chennai, Hyderabad or Bengaluru, or travel by train via Chennai.",
    howToReach: {
      road: "Madurai is well connected by state and private buses; the temple is in the city centre.",
      rail: "Madurai Junction is about 1.5 km from the temple.",
      air: "Madurai Airport is about 12 km from the temple.",
    },
    address: "Meenakshi Amman Temple, Madurai Main, Madurai, Tamil Nadu 625001",
    placeQuery: "Meenakshi Amman Temple Madurai",
    website: "https://maduraimeenakshi.hrce.tn.gov.in",
    faqs: [
      {
        q: "Is there a dress code at Madurai Meenakshi temple?",
        a: "Yes, traditional and modest dress is expected; shorts and sleeveless clothes are not appropriate.",
      },
      {
        q: "Are mobile phones allowed inside?",
        a: "Phones and cameras are generally not allowed inside and must be left at counters outside the gates.",
      },
      {
        q: "How long does darshan take?",
        a: "Allow two to three hours to have darshan of both shrines and see the complex; festivals and weekends take longer.",
      },
      {
        q: "Where can I stay?",
        a: "Madurai has many hotels and lodges within walking distance of the temple.",
      },
    ],
    sources: [
      "https://maduraimeenakshi.hrce.tn.gov.in",
      "https://en.wikipedia.org/wiki/Meenakshi_Temple",
      "https://vedabase.io/en/library/cc/madhya/9/",
      "https://imvoyager.com/madurai-spiritual-travel",
    ],
    check: [
      "Daily timings (listings give 4:30 AM or 5:00 AM opening and 9:30 PM or 10:00 PM closing)",
      "Official website URL (maduraimeenakshi.hrce.tn.gov.in) is current",
      "Nayak-period rebuilding (16th–17th century) wording",
      "Current phone and camera rules",
      "Teppam festival month",
      "Distances from junction (1.5 km) and airport (12 km)",
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
      "Hilltop temple in the Nallamala forest above the Krishna river, honoured as a Jyotirlinga of Lord Shiva and a Shakti Peetha of Bhramaramba Devi.",
    history: [
      "Srisailam rises in the Nallamala hills above a deep gorge of the Krishna river. The temple of Sri Mallikarjuna Swamy is counted among the twelve Jyotirlingas of Lord Shiva, and the shrine of Sri Bhramaramba Devi in the same complex is honoured as one of the Shakti Peethas, so devotees regard the hill as doubly sacred. One local story tells of a princess who worshipped the Lord with mallika (jasmine) flowers, giving rise to the name Mallikarjuna; the Goddess is said to have taken the form of a bee (bhramara) to destroy a demon, and the faint sound of humming is still associated with her shrine.",
      "The hill appears in old texts as Sriparvata, and inscriptions show that kings of many dynasties supported the temple. The Vijayanagara rulers added mandapams and gateways, and the Maratha king Shivaji is remembered for visiting and adding a gopuram. The high fortified walls around the temple are carved with scenes from the epics and Puranas.",
      "Today the temple is administered by the Srisailam Devasthanam under the Andhra Pradesh Endowments Department. The journey itself is part of the pilgrimage: the ghat road runs through the Nagarjunasagar–Srisailam Tiger Reserve, and on the way pilgrims see the Srisailam dam, Pathala Ganga where devotees bathe in the Krishna, and the Sakshi Ganapati shrine, where by tradition one 'signs in' one's visit before the Lord.",
    ],
    highlights: [
      "One of the twelve Jyotirlingas of Lord Shiva",
      "Bhramaramba Devi's shrine honoured as a Shakti Peetha",
      "Set in the Nallamala forest above the Krishna river",
      "Pathala Ganga, Sakshi Ganapati and Srisailam dam nearby",
      "Maha Shivaratri Brahmotsavam draws huge crowds",
    ],
    festivals: [
      { name: "Maha Shivaratri Brahmotsavam", when: "Magha month, February–March" },
      { name: "Ugadi Mahotsavam", when: "March–April" },
      { name: "Karthika Masam celebrations", when: "October–November" },
      { name: "Dasara (Navaratri) Mahotsavam", when: "September–October" },
    ],
    timings: [
      { label: "Temple opens (commonly listed)", time: "about 4:30 AM" },
      { label: "Morning darshan (commonly listed)", time: "about 6:00 AM – 3:30 PM" },
      { label: "Evening darshan (commonly listed)", time: "about 6:00 PM – 10:00 PM" },
    ],
    timingsNote:
      "Srisailam often revises darshan slots, sparsha (touch) darshan days and ticket quotas; please check the devasthanam's official website before you travel.",
    fromVizag:
      "Srisailam is roughly 600–650 km from Visakhapatnam by road. A common route is a train to Vijayawada or Hyderabad and then a 5–6 hour bus or taxi ride through the ghats.",
    howToReach: {
      road: "APSRTC and TSRTC buses run to Srisailam from Hyderabad, Vijayawada, Kurnool and Nandyal; forest check posts may close the ghat road at night.",
      rail: "There is no railway at Srisailam; Markapur Road is the nearest station, roughly 85 km away.",
      air: "Hyderabad's Rajiv Gandhi International Airport is roughly 200 km away.",
    },
    address: "Sri Bhramaramba Mallikarjuna Swamy Devasthanam, Srisailam, Nandyal district, Andhra Pradesh 518101",
    placeQuery: "Sri Bhramaramba Mallikarjuna Swamy Temple Srisailam",
    website: "https://www.srisailadevasthanam.org",
    faqs: [
      {
        q: "Is there a dress code at Srisailam?",
        a: "Yes, traditional dress is required, especially for sparsha darshan and sevas, for example dhoti for men and saree or churidar for women.",
      },
      {
        q: "Can devotees touch the Jyotirlinga?",
        a: "Sparsha darshan, where devotees may touch the linga, is offered on certain days and times with tickets; the schedule changes, so check before you go.",
      },
      {
        q: "Is the ghat road open at night?",
        a: "Forest check posts on the route through the tiger reserve usually restrict night travel, so plan to cross during the day.",
      },
      {
        q: "Where can I stay?",
        a: "The devasthanam and various community choultries offer rooms at Srisailam, and some can be booked online in advance.",
      },
    ],
    sources: [
      "https://www.srisailadevasthanam.org",
      "https://en.wikipedia.org/wiki/Mallikarjuna_Temple,_Srisailam",
      "https://www.deccanchronicle.com/southern-states/andhra-pradesh/srisailam-revises-darshan-timings-to-ease-pilgrim-rush-1976246",
      "https://www.thehansindia.com/andhra-pradesh/srisailam-temple-revises-protocol-darshan-timings-1104402",
    ],
    check: [
      "Daily timings and break period (listings conflict; revised in 2026)",
      "Current sparsha darshan days and timings",
      "Night closure hours of the forest ghat road",
      "Shivaji's gopuram and Vijayanagara additions (wording)",
      "Bee-humming tradition at the Bhramaramba shrine (wording)",
      "Distances: 600–650 km from Vizag, 85 km from Markapur Road, 200 km from Hyderabad airport",
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
      "Kashi, also called Varanasi or Banaras, is among the oldest living cities in the world and one of the seven sacred cities of India. At its heart is the temple of Lord Vishwanath, the Lord of the universe, worshipped as one of the twelve Jyotirlingas of Shiva. Pilgrims have come here for thousands of years to bathe in the Ganga, offer worship and remember that Lord Shiva is the greatest of Vaishnavas, always meditating on Lord Rama and Lord Krishna.",
      "The temple was attacked and destroyed more than once in medieval times. The present shrine was built in the late 18th century by Rani Ahilyabai Holkar of Indore, and in the 19th century Maharaja Ranjit Singh of Punjab offered gold to cover its domes, which is why many call it the Golden Temple of Kashi. In 2021 the Kashi Vishwanath Dham corridor opened, linking the temple directly to the Ganga ghats and giving pilgrims much more space.",
      "For devotees of Sri Chaitanya Mahaprabhu, Kashi holds special memories. The Chaitanya Charitamrita describes how Mahaprabhu stayed here, instructed Sanatana Goswami for about two months on the science of devotional service, and later turned the famous scholar Prakashananda Sarasvati and his followers towards the chanting of the holy names of Krishna. Pilgrims often visit the ghats, see the evening Ganga arati at Dashashwamedh Ghat, and remember these teachings.",
    ],
    highlights: [
      "One of the twelve Jyotirlingas, in one of the seven sacred cities",
      "Present temple built by Rani Ahilyabai Holkar",
      "Gold-covered domes offered by Maharaja Ranjit Singh",
      "Mahaprabhu taught Sanatana Goswami in Kashi",
      "Kashi Vishwanath Dham corridor links the temple to the Ganga",
    ],
    festivals: [
      { name: "Maha Shivaratri", when: "Phalguna month, February–March" },
      { name: "Shravan month Mondays", when: "July–August" },
      { name: "Rangbhari Ekadashi", when: "Phalguna month, before Holi" },
      { name: "Dev Deepawali", when: "Kartika Purnima, November" },
    ],
    timings: [
      { label: "Mangala arati (commonly listed)", time: "about 3:00 AM – 4:00 AM" },
      { label: "General darshan (commonly listed)", time: "about 4:00 AM – 11:00 PM, paused during aratis" },
      { label: "Sandhya arati (commonly listed)", time: "about 7:00 PM – 8:15 PM" },
      { label: "Shayan arati (commonly listed)", time: "about 10:30 PM – 11:00 PM" },
    ],
    timingsNote:
      "Arati tickets and special darshan are managed by the Shri Kashi Vishwanath Temple Trust; please check its official website for current schedules and booking.",
    fromVizag:
      "Varanasi is roughly 1,000–1,100 km from Visakhapatnam. Trains take around 20–30 hours depending on the route, or fly with a connection via Delhi, Hyderabad or Kolkata.",
    howToReach: {
      road: "Varanasi is well connected by highways; within the city, autos and e-rickshaws reach the corridor gates.",
      rail: "Varanasi Junction (Varanasi Cantt) and Banaras station are about 4–6 km from the temple.",
      air: "Lal Bahadur Shastri International Airport, Babatpur, is about 25 km from the temple.",
    },
    address: "Shri Kashi Vishwanath Temple, Lahori Tola, Varanasi, Uttar Pradesh 221001",
    placeQuery: "Shri Kashi Vishwanath Temple Varanasi",
    website: "https://shrikashivishwanath.org",
    faqs: [
      {
        q: "Is there a dress code at Kashi Vishwanath?",
        a: "Traditional, modest dress is expected; for sparsh (touch) darshan the trust has at times required dhoti-kurta for men and saree for women.",
      },
      {
        q: "Are phones allowed inside?",
        a: "Mobile phones, bags and electronic items are not allowed and must be deposited in lockers before entering.",
      },
      {
        q: "How long does darshan take?",
        a: "On ordinary days it can take one to two hours; Mondays, Shravan and Maha Shivaratri can take many hours.",
      },
      {
        q: "When is the best time to visit Varanasi?",
        a: "October to March is the most comfortable; Dev Deepawali in November is especially beautiful.",
      },
    ],
    sources: [
      "https://shrikashivishwanath.org",
      "https://en.wikipedia.org/wiki/Kashi_Vishwanath_Temple",
      "https://vedabase.io/en/library/cc/madhya/20/",
      "https://vedabase.io/en/library/cc/madhya/25/",
    ],
    check: [
      "Current darshan and arati timings and ticket rules",
      "Current dress code for sparsh darshan",
      "Ahilyabai Holkar construction date (commonly 1780) and Ranjit Singh gold offering",
      "Duration of Mahaprabhu's instruction to Sanatana Goswami (about two months)",
      "Train journey time and whether a direct Visakhapatnam–Varanasi train runs",
      "Distances from stations (4–6 km) and airport (about 25 km)",
      "Locality (Lahori Tola) and PIN code 221001",
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
      "Srila Prabhupada's temple of Krishna and Balaram in Raman Reti, Vrindavan, opened in 1975 and home to his samadhi and living quarters.",
    history: [
      "Vrindavan is the land of Lord Krishna's childhood pastimes, and Raman Reti, on the Parikrama Marg, is remembered as a sandy forest where Krishna and Balaram played with the cowherd boys. Srila A. C. Bhaktivedanta Swami Prabhupada lived and wrote in Vrindavan before travelling to the West in 1965, and after founding ISKCON he wished to build a temple here where devotees from all over the world could come and serve the Lord in His own land.",
      "On this land Prabhupada established the Sri Krishna Balaram Mandir, which was opened on Rama Navami in 1975. The central altar holds Sri Sri Krishna Balaram, with Sri Sri Gaura Nitai on one side and Sri Sri Radha Shyamasundar with Lalita and Vishakha on the other. Prabhupada lived in rooms on the campus that are still preserved for visitors, and he spent his final days in Vrindavan, departing from this world in November 1977. His white marble samadhi mandir now stands at the entrance, where devotees offer arati and prayers every day.",
      "The temple follows a full day of worship, from the early morning mangala arati to the evening arati, with kirtan of the Hare Krishna maha-mantra filling the courtyard. For devotees of the Hare Krishna Movement in Visakhapatnam, a visit here is a chance to see the place Srila Prabhupada loved most and to join the same kirtan that he started.",
    ],
    highlights: [
      "Founded by Srila Prabhupada, opened on Rama Navami 1975",
      "Deities of Krishna Balaram, Gaura Nitai and Radha Shyamasundar",
      "Srila Prabhupada's samadhi mandir and preserved rooms",
      "In Raman Reti, on Vrindavan's parikrama path",
      "Continuous Hare Krishna kirtan in the courtyard",
    ],
    festivals: [
      { name: "Sri Krishna Janmashtami", when: "Bhadrapada month, August–September" },
      { name: "Temple anniversary and Rama Navami", when: "Chaitra month, March–April" },
      { name: "Kartika (Damodara) month", when: "October–November" },
      { name: "Gaura Purnima", when: "Phalguna Purnima, February–March" },
    ],
    timings: [
      { label: "Prabhupada samadhi arati (commonly listed)", time: "about 4:10 AM" },
      { label: "Mangala arati (commonly listed)", time: "about 4:30 AM" },
      { label: "Morning darshan (commonly listed)", time: "about 4:30 AM – 12:45 PM" },
      { label: "Evening darshan (commonly listed)", time: "about 4:15 PM – 8:30 PM" },
    ],
    timingsNote:
      "Summer and winter schedules differ, and the evening timings shift through the year; please check the temple's official website before you travel.",
    fromVizag:
      "Vrindavan is roughly 1,600 km from Visakhapatnam. Travel by train to Mathura Junction (about 26–30 hours) or fly to Delhi and continue about 150 km by road.",
    howToReach: {
      road: "Vrindavan is about 12 km from Mathura and about 150–180 km from Delhi via the Yamuna Expressway; autos and e-rickshaws reach Raman Reti.",
      rail: "Mathura Junction is about 12–14 km from the temple and is served by long-distance trains.",
      air: "Delhi's Indira Gandhi International Airport is the usual choice; Agra airport is closer but has fewer flights.",
    },
    address: "Sri Krishna Balaram Mandir, Bhaktivedanta Swami Marg, Raman Reti, Vrindavan, Uttar Pradesh 281121",
    placeQuery: "ISKCON Sri Krishna Balaram Mandir Vrindavan",
    website: "https://www.iskconvrindavan.com",
    faqs: [
      {
        q: "Is there a dress code at ISKCON Vrindavan?",
        a: "Modest, traditional dress is recommended; devotees often wear dhoti or kurta and saree or salwar suit.",
      },
      {
        q: "When is the best time to visit?",
        a: "October to March is pleasant. Kartika month and Janmashtami are the most festive, but very crowded.",
      },
      {
        q: "Can I see Srila Prabhupada's rooms?",
        a: "Yes, Prabhupada's rooms on the campus are usually open to visitors at set times; ask at the temple office.",
      },
      {
        q: "Where can I stay?",
        a: "ISKCON runs a guest house on the campus, which should be booked in advance, and Vrindavan has many ashrams and hotels.",
      },
    ],
    sources: [
      "https://www.iskconvrindavan.com",
      "https://en.wikipedia.org/wiki/Krishna_Balaram_Mandir",
      "https://trawell.in/uttar-pradesh/vrindavan/iskcon-temple-krishna-balaram-mandir",
    ],
    check: [
      "Current summer and winter darshan timings",
      "Official website URL (iskconvrindavan.com) is current",
      "Opening date (Rama Navami, April 1975) wording",
      "Wording on continuous (24-hour) kirtan in the courtyard",
      "Visiting hours for Prabhupada's rooms",
      "Train journey time from Visakhapatnam to Mathura and direct trains",
      "Street name and PIN code 281121",
    ],
  },

  // 9. Banke Bihari
  {
    slug: "banke-bihari-temple-vrindavan",
    name: "Sri Banke Bihari Temple, Vrindavan",
    shortName: "Banke Bihari",
    teluguName: "శ్రీ బాంకే బిహారీ ఆలయం, బృందావనం",
    deity: "Sri Banke Bihari (Lord Krishna in His three-fold bending form)",
    form: "Krishna",
    town: "Vrindavan",
    state: "Uttar Pradesh",
    district: "Mathura",
    region: "Uttar Pradesh",
    summary:
      "Vrindavan's beloved temple of Banke Bihari, the Krishna Deity revealed by Swami Haridas, where a curtain is drawn every few minutes during darshan.",
    history: [
      "Banke Bihari means the enjoyer who stands bent in three places, the graceful way Lord Krishna poses with His flute. The Deity is associated with Swami Haridas, a saint and musician of the 16th century who lived in the groves of Nidhivan in Vrindavan. Tradition holds that, pleased with his devotional singing, Radha and Krishna appeared before him and, at his request, merged into one form so that devotees could have Their darshan together. This form is Banke Bihari.",
      "For many years the Deity was worshipped in Nidhivan by the followers of Swami Haridas. The present temple in the old town of Vrindavan was built in the 19th century, and the worship is still carried out by Goswami families descended from that tradition. Unlike most temples, there is no mangala arati on ordinary days, because Banke Bihari is treated as a child who should not be woken early.",
      "Devotees here pray with a very personal love. A curtain is drawn in front of the Lord every few minutes, which the priests explain as a way of protecting the devotees, since no one could bear to look away from His beauty. His lotus feet are shown only on Akshaya Tritiya, and He holds His flute only on Sharad Purnima. In the summer months, the Lord is placed in flower bungalows, and in the monsoon the Hariyali Teej swing festival brings huge crowds.",
    ],
    highlights: [
      "Krishna Deity associated with Swami Haridas of Nidhivan",
      "Curtain drawn every few minutes during darshan",
      "Charana darshan of the Lord's feet only on Akshaya Tritiya",
      "Flower bungalows in summer and swing festival in monsoon",
      "In the old town, a short walk from Nidhivan",
    ],
    festivals: [
      { name: "Sri Krishna Janmashtami (with mangala arati)", when: "Bhadrapada month, August–September" },
      { name: "Akshaya Tritiya (charana darshan)", when: "Vaisakha month, April–May" },
      { name: "Hariyali Teej (golden swing)", when: "Shravan month, July–August" },
      { name: "Sharad Purnima (flute darshan)", when: "Ashvin Purnima, October" },
    ],
    timings: [
      { label: "Summer morning darshan (commonly listed)", time: "about 7:45 AM – 12:00 noon" },
      { label: "Summer evening darshan (commonly listed)", time: "about 5:30 PM – 9:30 PM" },
      { label: "Winter morning darshan (commonly listed)", time: "about 8:45 AM – 1:00 PM" },
      { label: "Winter evening darshan (commonly listed)", time: "about 4:30 PM – 8:30 PM" },
    ],
    timingsNote:
      "Summer timings usually apply from Holi and winter timings from Diwali, and the temple has extended hours at times to manage crowds; please confirm before you travel.",
    fromVizag:
      "Vrindavan is roughly 1,600 km from Visakhapatnam. Travel by train to Mathura Junction (about 26–30 hours) or fly to Delhi and continue about 150 km by road.",
    howToReach: {
      road: "Vrindavan is about 12 km from Mathura and about 150–180 km from Delhi. Vehicles cannot reach the temple door; the last stretch is through narrow lanes on foot.",
      rail: "Mathura Junction is about 12 km away and is served by long-distance trains.",
      air: "Delhi's Indira Gandhi International Airport is the usual choice; Agra airport is closer but has fewer flights.",
    },
    address: "Sri Banke Bihari Temple, Bihari Pura, Vrindavan, Uttar Pradesh 281121",
    placeQuery: "Shri Banke Bihari Temple Vrindavan",
    faqs: [
      {
        q: "Why is the curtain closed so often at Banke Bihari?",
        a: "By tradition the curtain is drawn every few minutes, so that devotees are not overwhelmed by the Lord's beauty and the crowd keeps moving.",
      },
      {
        q: "Is it safe for elderly people and children?",
        a: "The temple gets extremely crowded, especially on weekends and festivals. Elderly visitors and families with small children should go at quieter times.",
      },
      {
        q: "Is there a dress code?",
        a: "Modest, traditional dress is recommended. Keep valuables secure in the crowd and watch out for monkeys in the lanes.",
      },
      {
        q: "Where can I stay?",
        a: "Vrindavan has many ashrams, guest houses and hotels; the ISKCON guest house in Raman Reti is about 3–4 km away.",
      },
    ],
    sources: [
      "https://en.wikipedia.org/wiki/Banke_Bihari_Temple",
      "https://www.trawell.in/uttar-pradesh/vrindavan/bankey-bihari-temple",
      "https://curlytales.com/india/travel/vrindavans-banke-bihari-temple-extends-darshan-timings-sets-up-systematic-queuing-system-for-devotees/",
    ],
    check: [
      "Current summer and winter timings (a later report gives 8 AM–1:30 PM and 4–9 PM in winter)",
      "Official website (bihariji.org is cited by some sites; not included)",
      "Construction date of the present temple (commonly given as 1864)",
      "Wording of the Radha-Krishna merged form tradition",
      "Special darshan days: charana on Akshaya Tritiya, flute on Sharad Purnima",
      "Status of any corridor or queue system under construction",
      "Distance from ISKCON Raman Reti (3–4 km) and PIN code",
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
      "Seaside Jyotirlinga of Lord Somnath at Prabhas Patan, Gujarat, rebuilt after independence and close to Bhalka Tirtha of Lord Krishna's pastimes.",
    history: [
      "Somnath stands on the Arabian Sea coast at Prabhas Patan in Gujarat and is traditionally counted first among the twelve Jyotirlingas of Lord Shiva. The name means Lord of Soma, the moon. According to the Puranic account, the moon-god was cursed by Daksha to waste away, and he worshipped Lord Shiva here to be relieved; the Lord's mercy is remembered in the waxing and waning of the moon. Prabhas is also a holy tirtha where three rivers meet the sea.",
      "Few temples have a history as moving as Somnath's. It was raided and destroyed several times in medieval centuries, most famously in the early 11th century, and each time devotees rebuilt it. After India's independence, the rebuilding was taken up on the initiative of Sardar Vallabhbhai Patel, and the Jyotirlinga was installed in 1951 in the presence of the President, Dr Rajendra Prasad. The new temple, in the Chalukya style, is managed by the Shree Somnath Trust; a pillar on the sea wall notes that there is no land in a straight line from here to the South Pole.",
      "For Vaishnavas, Prabhas is also connected with the closing pastimes of Lord Krishna. The nearby Bhalka Tirtha is honoured as the place where the hunter's arrow struck the Lord's foot, and the Dehotsarg area beside the Hiran river marks His departure from this world. Pilgrims who come for Somnath's darshan often visit these places too and remember the Lord's teachings to Uddhava.",
    ],
    highlights: [
      "Traditionally counted first among the twelve Jyotirlingas",
      "Seaside temple rebuilt after independence, installed in 1951",
      "Evening arati facing the Arabian Sea",
      "Near Bhalka Tirtha and Dehotsarg of Lord Krishna's pastimes",
      "Managed by the Shree Somnath Trust",
    ],
    festivals: [
      { name: "Maha Shivaratri", when: "Magha/Phalguna month, February–March" },
      { name: "Shravan month", when: "July–August" },
      { name: "Kartika Purnima fair", when: "October–November" },
    ],
    timings: [
      { label: "Darshan", time: "6:00 AM – 10:00 PM" },
      { label: "Aratis", time: "7:00 AM, 12:00 noon and 7:00 PM" },
      { label: "Light and sound show (commonly listed)", time: "about 8:00 PM – 9:00 PM" },
    ],
    timingsNote:
      "Darshan and arati times are as given in the Shree Somnath Trust FAQ; they may change on festival days, so please check before you travel.",
    fromVizag:
      "Somnath is roughly 2,000 km from Visakhapatnam. Most pilgrims fly to Rajkot or Ahmedabad via a connecting city and continue by road or train to Veraval.",
    howToReach: {
      road: "Somnath is about 200 km by road from Rajkot and about 400 km from Ahmedabad, with buses and taxis.",
      rail: "Veraval Junction is about 6–7 km from the temple, with trains from Ahmedabad and Rajkot.",
      air: "Rajkot and Diu are the closest regular airports; Keshod airport is nearer but has limited flights.",
    },
    address: "Shree Somnath Temple, Prabhas Patan, Gir Somnath district, Gujarat 362268",
    placeQuery: "Shree Somnath Jyotirlinga Temple Prabhas Patan",
    website: "https://somnath.org",
    faqs: [
      {
        q: "Are mobile phones allowed inside Somnath temple?",
        a: "No. Phones, cameras and bags must be deposited at the free counters before entering.",
      },
      {
        q: "Is there a dress code?",
        a: "Modest, traditional dress is recommended for all visitors.",
      },
      {
        q: "How long does darshan take?",
        a: "Usually under an hour on ordinary days; Shravan Mondays and Maha Shivaratri are much busier.",
      },
      {
        q: "Where can I stay?",
        a: "The Shree Somnath Trust runs guest houses that can be booked on its website, and Veraval has many hotels.",
      },
    ],
    sources: [
      "https://somnath.org",
      "https://somnath.org/faq",
      "https://en.wikipedia.org/wiki/Somnath_temple",
    ],
    check: [
      "Darshan closing time (Trust FAQ says 10 PM; other sites say 9 or 9:30 PM)",
      "Light and sound show timing and whether it runs in monsoon",
      "Installation date (11 May 1951) wording",
      "Wording of the Bhalka Tirtha and Dehotsarg traditions",
      "Distances: Veraval 6–7 km, Rajkot about 200 km, Ahmedabad about 400 km",
      "Current flights at Keshod and Diu airports",
      "PIN code 362268",
    ],
  },
];
