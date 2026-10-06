// Telugu translations — keyed by the exact English source text.
// See lib/i18n/te/GLOSSARY.md for the terms to use.
//
// Home-page strings. Labels the home page shares with the navbar / footer /
// common dictionaries (Close, Donate, Donate Now, Darshan, Seva, Temple,
// Festivals, Events, Volunteer, Get Involved, Subhojanam, Anna Daan, Gau Seva,
// Square Foot Seva, Brick Seva, Janmashtami, Radhashtami, Srila Prabhupada,
// His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada) live there.
export const home: Record<string, string> = {
  // ── Shared across home sections ──
  "View All": "అన్నీ చూడండి",
  "Hare Krishna Vaikuntham": "హరే కృష్ణ వైకుంఠం",
  "Hare Krishna Vaikuntham Temple": "హరే కృష్ణ వైకుంఠం ఆలయం",
  "Hare Krishna Vaikuntham Temple, Visakhapatnam": "హరే కృష్ణ వైకుంఠం ఆలయం, విశాఖపట్నం",

  // ── Hero carousel (TempleCarousel) ──
  "Temple highlights": "ఆలయ విశేషాలు",
  "{n} of {total}: {title}": "{total}లో {n}: {title}",
  "Previous slide": "మునుపటి స్లైడ్",
  "Next slide": "తదుపరి స్లైడ్",
  "Choose slide": "స్లైడ్ ఎంచుకోండి",
  "Go to slide {n}: {title}": "స్లైడ్ {n}కి వెళ్ళండి: {title}",
  "Chaitanya Bhavan": "చైతన్య భవన్",
  "Daily Darshan": "నిత్య దర్శనం",
  "Sri Sri Radha Madan Mohan": "శ్రీ శ్రీ రాధా మదన మోహన",
  "Jagannatha Rath Yatra": "జగన్నాథ రథయాత్ర",
  "Srinivasa Govinda Temple": "శ్రీనివాస గోవింద ఆలయం",

  // ── Today's darshan + festival countdown (DarshanCountdown) ──
  "Open today's darshan photo": "నేటి దర్శనం ఫోటోను తెరవండి",
  "Today's darshan of Sri Sri Radha Madan Mohan": "శ్రీ శ్రీ రాధా మదన మోహన వారి నేటి దర్శనం",
  "Today's Darshan": "నేటి దర్శనం",
  "Show darshan photo {n}": "దర్శనం ఫోటో {n} చూడండి",
  "Upcoming Festival": "రాబోయే పండుగ",
  "See the Vaishnava calendar for upcoming celebrations.": "రాబోయే ఉత్సవాల కోసం వైష్ణవ క్యాలెండర్ చూడండి.",
  "Next Ekadashi · {date}": "తదుపరి ఏకాదశి · {date}",
  "Seva →": "సేవ →",
  "Vaishnava Calendar": "వైష్ణవ క్యాలెండర్",
  "Days": "రోజులు",
  "Hours": "గంటలు",
  "Minutes": "నిమిషాలు",
  "Seconds": "సెకన్లు",
  "Darshan photo": "దర్శనం ఫోటో",
  "Previous photo": "మునుపటి ఫోటో",
  "Next photo": "తదుపరి ఫోటో",
  "Full gallery": "పూర్తి గ్యాలరీ",

  // Upcoming entries of lib/vaishnavaCalendarData.ts shown in the countdown
  // card (festival title + description, Ekadashi title), Oct–Dec 2026.
  "Indira Ekadashi": "ఇందిరా ఏకాదశి",
  "Papankusha Ekadashi": "పాపాంకుశ ఏకాదశి",
  "Rama Ekadashi": "రమా ఏకాదశి",
  "Utthan Ekadashi": "ఉత్థాన ఏకాదశి",
  "Utpanna Ekadashi": "ఉత్పన్న ఏకాదశి",
  "Moksada Ekadashi": "మోక్షద ఏకాదశి",
  "Vijay Utsav / Appearance of Sri Madhva Acharya": "విజయోత్సవం / శ్రీ మధ్వాచార్యుల ఆవిర్భావం",
  "Vijay Utsav of Sri Ramachandra. Appearance of Sri Madhva Acharya.":
    "శ్రీ రామచంద్రుని విజయోత్సవం. శ్రీ మధ్వాచార్యుల ఆవిర్భావ దినం.",
  "Sharadiya Rasa Yatra": "శారదీయ రాసయాత్ర",
  "Sharadiya Rasa Yatra of Sri Krishna. Disappearance of Srila Murari Gupta. Beginning of Urja Vrata / Kartik Vrata.":
    "శ్రీకృష్ణుని శారదీయ రాసయాత్ర. శ్రీల మురారి గుప్తుల తిరోభావం. ఊర్జ వ్రతం / కార్తీక వ్రతం ప్రారంభం.",
  "Bahulashtami / Radha Kunda": "బహులాష్టమి / రాధా కుండం",
  "Bahulashtami. Manifestation day of Sri Radha Kunda.": "బహులాష్టమి. శ్రీ రాధా కుండం ఆవిర్భవించిన దినం.",
  "Appearance of Srila Sridhar Dev-Goswami Maharaj": "శ్రీల శ్రీధర దేవ గోస్వామి మహారాజ్ ఆవిర్భావం",
  "The grand 132nd appearance day celebration of Srila Bhakti Raksak Sridhar Dev-Goswami Maharaj. Appearance of Srila Virachandra Prabhu.":
    "శ్రీల భక్తి రక్షక శ్రీధర దేవ గోస్వామి మహారాజ్ 132వ ఆవిర్భావ మహోత్సవం. శ్రీల వీరచంద్ర ప్రభు ఆవిర్భావం.",
  "Dhanteras": "ధన త్రయోదశి",
  "Offering and placing of lamps on Vishnu Mandirs.": "విష్ణు ఆలయాలపై దీపాలు సమర్పించి వెలిగించడం.",
  "Diwali / Dipavali": "దీపావళి",
  "Dipavali. Offering and placing of lamps on Vishnu Mandirs. Go Puja (cow-worship) and Go Krida.":
    "దీపావళి. విష్ణు ఆలయాలపై దీపాలు సమర్పించి వెలిగించడం. గో పూజ (గోవుల ఆరాధన), గో క్రీడ.",
  "Govardhan Puja / Annakut Mahotsav": "గోవర్ధన పూజ / అన్నకూట మహోత్సవం",
  "Sri Govardhan Puja. Grand Annakut Mahotsav ('Rice Mountain Festival').":
    "శ్రీ గోవర్ధన పూజ. వైభవమైన అన్నకూట మహోత్సవం ('అన్నపు కొండ ఉత్సవం').",
  "Bhratri Dvitiya (Govardhan Puja)": "భ్రాతృ ద్వితీయ (గోవర్ధన పూజ)",
  "Disappearance of Srila Vasudev Ghosh Thakur. Bhratri Dvitiya (festival where brothers and sisters honour each other).":
    "శ్రీల వాసుదేవ ఘోష ఠాకూర్ తిరోభావం. భ్రాతృ ద్వితీయ (అన్నదమ్ములు, అక్కచెల్లెళ్లు ఒకరినొకరు గౌరవించుకునే పండుగ).",
  "Sri Gopashtami / Go Puja": "శ్రీ గోపాష్టమి / గో పూజ",
  "Sri Gopashtami, Sri Goshthastami, Go Puja, and Go Gras-dan. Disappearance of Sri Gadadhar Das Goswami.":
    "శ్రీ గోపాష్టమి, శ్రీ గోష్ఠాష్టమి, గో పూజ, గో గ్రాస దానం. శ్రీ గదాధర దాస గోస్వామి తిరోభావం.",
  "Rasa Yatra / Appearance of Srila Nimbarka Acharya": "రాసయాత్ర / శ్రీల నింబార్కాచార్యుల ఆవిర్భావం",
  "Rasa Yatra of Sri Krishna. End of Chaturmasya. Appearance of Srila Nimbarka Acharya.":
    "శ్రీకృష్ణుని రాసయాత్ర. చాతుర్మాస్యం ముగింపు. శ్రీల నింబార్కాచార్యుల ఆవిర్భావం.",
  "Oran Shashthi": "ఓరన్ షష్ఠి",
  "Grand festival for honouring the appearance of Sri Sri Nitai-Chaitanya Jiu at Sri Puri Dham.":
    "శ్రీ పూరీ ధామంలో శ్రీ శ్రీ నితాయ్-చైతన్య జీయు ఆవిర్భావాన్ని స్మరించే మహోత్సవం.",
  "Appearance of Srila Bhakti Sundar Govinda Maharaj": "శ్రీల భక్తి సుందర గోవింద మహారాజ్ ఆవిర్భావం",
  "The grand 98th appearance day celebration of Srila Bhakti Sundar Govinda Dev-Goswami Maharaj.":
    "శ్రీల భక్తి సుందర గోవింద దేవ గోస్వామి మహారాజ్ 98వ ఆవిర్భావ మహోత్సవం.",

  // ── Welcome (WelcomeSection) ──
  "Welcome to Hare Krishna Vaikuntham": "హరే కృష్ణ వైకుంఠానికి స్వాగతం",
  // These three render as one heading: "<first> <highlighted second> <third>".
  "ISKCON Gambheeram —": "ఇస్కాన్ గంభీరం —",
  "Visakhapatnam's home": "విశాఖపట్నంలో",
  "of Krishna bhakti": "కృష్ణ భక్తికి నిలయం",
  "Following in the footsteps of our revered Founder-Acharya Srila Prabhupada, ISKCON Visakhapatnam — Hare Krishna Movement India (HKMI) — has been conducting spiritual, educational and cultural activities in Gambheeram since 2008, bringing about physical, emotional and spiritual well-being.":
    "మా పూజ్య వ్యవస్థాపక ఆచార్యులు శ్రీల ప్రభుపాద అడుగుజాడల్లో నడుస్తూ, ఇస్కాన్ విశాఖపట్నం — హరే కృష్ణ మూవ్‌మెంట్ ఇండియా (HKMI) — 2008 నుండి గంభీరంలో ఆధ్యాత్మిక, విద్యా, సాంస్కృతిక కార్యక్రమాలు నిర్వహిస్తూ, అందరి శారీరక, మానసిక, ఆధ్యాత్మిక శ్రేయస్సుకు తోడ్పడుతోంది.",
  "HKMI draws on the timeless wisdom of the Vedic scriptures to answer life's deepest questions — offering kirtan, prasadam, Bhagavad-gita classes and seva so that every visitor can experience the joy of devotion.":
    "వేద శాస్త్రాల శాశ్వత జ్ఞానంతో HKMI జీవితంలోని లోతైన ప్రశ్నలకు సమాధానం చూపుతుంది — కీర్తన, ప్రసాదం, భగవద్గీత తరగతులు, సేవ ద్వారా ప్రతి సందర్శకుడూ భక్తిలోని ఆనందాన్ని అనుభవించేలా చేస్తుంది.",
  "If you want peace, then you must develop Krishna consciousness. This is the only way.":
    "మీకు శాంతి కావాలంటే, కృష్ణ చైతన్యాన్ని పెంపొందించుకోవాలి. ఇదే ఏకైక మార్గం.",
  "Serving since": "నుండి సేవలో",
  "2 Lakh+": "2 లక్షలు+",
  "Meals daily": "రోజూ భోజనాలు",
  "Festivals a year": "ఏటా పండుగలు",
  "Discover More": "మరింత తెలుసుకోండి",
  "Plan your visit": "మీ సందర్శనను ప్లాన్ చేసుకోండి",
  "Sri Sri Radha Madan Mohan at Hare Krishna Vaikuntham, Visakhapatnam":
    "విశాఖపట్నం హరే కృష్ణ వైకుంఠంలో శ్రీ శ్రీ రాధా మదన మోహన",
  "Play temple video": "ఆలయ వీడియో ప్లే చేయండి",
  "Years of seva": "సంవత్సరాల సేవ",
  "Temple video": "ఆలయ వీడియో",
  "Close video": "వీడియో మూసివేయండి",
  "Hare Krishna Vaikuntham temple video": "హరే కృష్ణ వైకుంఠం ఆలయ వీడియో",

  // ── Explore bento (ExploreBento) ──
  "Discover the Dham": "ధామాన్ని దర్శించండి",
  "Explore Hare Krishna Vaikuntham": "హరే కృష్ణ వైకుంఠం విశేషాలు",
  "From daily darshan and aarti to Subhojanam, Gau Seva and grand festivals — explore everything that makes our temple in Gambheeram a home for every seeker.":
    "నిత్య దర్శనం, హారతుల నుండి శుభోజనం, గో సేవ, వైభవమైన ఉత్సవాల వరకు — గంభీరంలోని మా ఆలయాన్ని ప్రతి సాధకుడికీ నిలయంగా మార్చే విశేషాలన్నీ చూడండి.",
  "Temple Festivals": "ఆలయ ఉత్సవాలు",
  "Janmashtami, Radhashtami, Govardhan Puja & more": "జన్మాష్టమి, రాధాష్టమి, గోవర్ధన పూజ & మరెన్నో",
  "Nutritious prasadam for those in need": "అవసరమైన వారికి పోషకమైన ప్రసాదం",
  "Care for our sacred cows": "పవిత్ర గోవుల సంరక్షణ",
  "Sri Srinivasa Govinda": "శ్రీ శ్రీనివాస గోవింద",
  "Darshan of the Lord of the Seven Hills": "ఏడుకొండలవాని దర్శనం",
  "Daily Aarti": "నిత్య హారతి",
  "Seven aartis from 4:30 AM": "ఉదయం 4:30 నుండి ఏడు హారతులు",
  "Serve with the devotee community": "భక్త సమాజంతో కలిసి సేవ చేయండి",
  "Anna Daan Seva": "అన్నదాన సేవ",
  "Sponsor sanctified meals": "ప్రసాద భోజనాలకు సహకరించండి",
  "Temple Seva": "ఆలయ సేవ",
  "Offerings for the Lordships": "స్వామివారికి సమర్పణలు",

  // ── Square Foot Seva feature (TempleConstructionFeature) ──
  "Mandir Nirman Seva": "ఆలయ నిర్మాణ సేవ",
  "Be a part of building the Hare Krishna Vaikuntham Temple in Visakhapatnam. Every square foot you offer brings Sri Sri Radha Madan Mohan's new home closer to completion — a seva that endures for generations.":
    "విశాఖపట్నంలో హరే కృష్ణ వైకుంఠం ఆలయ నిర్మాణంలో మీరూ భాగస్వాములు కండి. మీరు సమర్పించే ప్రతి చదరపు అడుగు శ్రీ శ్రీ రాధా మదన మోహన వారి కొత్త నివాసాన్ని పూర్తికి మరింత దగ్గర చేస్తుంది — తరతరాలు నిలిచే సేవ ఇది.",
  "A temple built for the Lord remains a place of devotion for generations.":
    "భగవంతుని కోసం నిర్మించిన ఆలయం తరతరాలకు భక్తి నిలయంగా నిలుస్తుంది.",
  // Renders as "<highlighted first> <second>".
  "80G tax benefit": "80G పన్ను మినహాయింపు",
  "on every contribution, with your receipt sent on WhatsApp.": "ప్రతి విరాళంపై లభిస్తుంది, రసీదు మీ WhatsAppకు వస్తుంది.",
  "Offer a Square Foot": "ఒక చదరపు అడుగు సమర్పించండి",
  "Temple Goal": "ఆలయ లక్ష్యం",
  "sq.ft offered": "చ.అ. సమర్పించారు",
  "Goal": "లక్ష్యం",
  "{n} sq.ft": "{n} చ.అ.",
  "Devotees": "భక్తులు",

  // ── Moments (MomentsSection) ──
  "Temple Highlights": "ఆలయ విశేషాలు",
  "Moments at Hare Krishna Vaikuntham": "హరే కృష్ణ వైకుంఠంలో మధుర క్షణాలు",
  "Festivals, darshan and everyday celebrations of devotion, captured across our temple in Visakhapatnam.":
    "విశాఖపట్నంలోని మా ఆలయంలో పండుగలు, దర్శనం, రోజువారీ భక్తి వేడుకల చిత్రాలు.",
  "Previous photos": "మునుపటి ఫోటోలు",
  "Next photos": "తదుపరి ఫోటోలు",
  "Janmashtami altar": "జన్మాష్టమి అలంకారం",
  "Aarti": "హారతి",
  "Prasadam seva": "ప్రసాద సేవ",
  "The temple": "ఆలయం",
  "Temple moment": "ఆలయ దృశ్యం",
  // Gallery categories (lib/galleryApi TEMPLE_GALLERY_CATEGORIES)
  "Deities": "శ్రీ విగ్రహాలు",
  "Community": "సమాజం",
  "Vaikuntham Cultural Centre": "వైకుంఠం సాంస్కృతిక కేంద్రం",
  "Vibrant celebrations of Janmashtami, Radhashtami, Govardhan Puja and every Ekadashi.":
    "జన్మాష్టమి, రాధాష్టమి, గోవర్ధన పూజ, ప్రతి ఏకాదశి — ఉత్సాహభరితమైన వేడుకలు.",
  "Chaitanya Bhavan — a serene space for devotion, culture and community in Gambheeram.":
    "చైతన్య భవన్ — గంభీరంలో భక్తికి, సంస్కృతికి, సమాజానికి ఒక ప్రశాంతమైన ప్రదేశం.",
  "Programs & Events": "కార్యక్రమాలు & వేడుకలు",
  "Bhagavad-gita classes, youth programs and kirtans that bring the community together.":
    "అందరినీ ఒక్కటి చేసే భగవద్గీత తరగతులు, యువజన కార్యక్రమాలు, కీర్తనలు.",

  // ── Seva tiles (SevaTiles) ──
  "Seva Opportunities": "సేవా అవకాశాలు",
  "Donate Generously, Support Our Seva": "ఉదారంగా విరాళం ఇవ్వండి, మా సేవకు తోడ్పడండి",
  "Every contribution to Hare Krishna Vaikuntham — temple construction, Anna Daan, Gau Seva or Gita Daan — helps share Krishna's mercy with thousands. All donations are eligible for 80G tax benefits.":
    "హరే కృష్ణ వైకుంఠానికి మీరు ఇచ్చే ప్రతి విరాళం — ఆలయ నిర్మాణం, అన్నదానం, గో సేవ లేదా గీతా దానం — వేలాది మందికి కృష్ణుని కృపను చేరుస్తుంది. అన్ని విరాళాలకు 80G పన్ను మినహాయింపు వర్తిస్తుంది.",
  "Festival": "పండుగ",
  "From ₹{amount}": "₹{amount} నుండి",
  "View all sevas": "అన్ని సేవలు చూడండి",
  // Seva titles from lib/sevaConfig.ts
  "Gita Daan Seva": "గీతా దాన సేవ",
  "Vastra & Alankara Seva": "వస్త్ర & అలంకార సేవ",

  // ── Founder (DivineVision) ──
  "Divine Vision": "దివ్య సంకల్పం",
  "Fulfilling Srila Prabhupada's mission in Visakhapatnam": "విశాఖపట్నంలో శ్రీల ప్రభుపాద సంకల్పాన్ని నెరవేరుస్తూ",
  "His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada, the Founder-Acharya of ISKCON, sailed to New York at the age of 69 to fulfil his spiritual master's order — to share the message of Lord Krishna with the whole world. Hare Krishna Vaikuntham is our humble offering to that mission: a temple, a kitchen for the hungry and a home for every sincere seeker in Vizag.":
    "ఇస్కాన్ వ్యవస్థాపక ఆచార్యులైన కృష్ణకృపామూర్తి శ్రీ శ్రీమద్ ఎ.సి. భక్తివేదాంత స్వామి ప్రభుపాద, తమ గురువుగారి ఆజ్ఞను నెరవేర్చడానికి — శ్రీకృష్ణుని సందేశాన్ని ప్రపంచమంతటికీ అందించడానికి — 69 ఏళ్ల వయసులో ఓడలో న్యూయార్క్‌కు ప్రయాణించారు. ఆ మహా కార్యానికి మా వినయపూర్వక సమర్పణే హరే కృష్ణ వైకుంఠం: వైజాగ్‌లో ఒక ఆలయం, ఆకలితో ఉన్నవారి కోసం ఒక వంటశాల, ప్రతి నిజమైన సాధకుడికీ ఒక నిలయం.",
  "Read the full story": "పూర్తి కథ చదవండి",
  "His teachings": "వారి బోధనలు",
  "Took Krishna consciousness worldwide": "కృష్ణ చైతన్యాన్ని ప్రపంచమంతా వ్యాపింపజేశారు",
  "Founded ISKCON in New York": "న్యూయార్క్‌లో ఇస్కాన్‌ను స్థాపించారు",
  "Translated the Gita & Bhagavatam": "గీత & భాగవతాన్ని అనువదించారు",
  "70+ vols": "70+ గ్రంథాలు",

  // ── Programs (ProgramsTabs) ──
  "Programs & Activities": "కార్యక్రమాలు & సేవలు",
  "Discover the spiritual programmes and seva opportunities that bring Krishna consciousness to Visakhapatnam every day.":
    "ప్రతిరోజూ విశాఖపట్నానికి కృష్ణ చైతన్యాన్ని అందించే ఆధ్యాత్మిక కార్యక్రమాలు, సేవా అవకాశాలను తెలుసుకోండి.",
  "Programs": "కార్యక్రమాలు",
  // Tab labels
  "Food Distribution": "అన్న వితరణ",
  "Cow Protection": "గో సంరక్షణ",
  "Education": "విద్య",
  "Volunteering": "స్వచ్ఛంద సేవ",
  "Our Projects": "మా ప్రాజెక్టులు",
  // Panel titles
  "Subhojanam & Anna Daan": "శుభోజనం & అన్నదానం",
  "Bhagavad-gita & Value Education": "భగవద్గీత & విలువల విద్య",
  "Grand Festivals": "వైభవమైన ఉత్సవాలు",
  "Serve with the Community": "సమాజంతో కలిసి సేవ చేయండి",
  // Panel text
  "Through Subhojanam we serve fresh, sanctified meals to school children and the underprivileged across Visakhapatnam every single day. Krishna prasadam nourishes both body and soul — no one within our reach should go hungry.":
    "శుభోజనం ద్వారా విశాఖపట్నం అంతటా పాఠశాల పిల్లలకు, పేదలకు ప్రతిరోజూ తాజా, పవిత్రమైన భోజనం అందిస్తున్నాము. కృష్ణ ప్రసాదం శరీరాన్నీ ఆత్మనూ పోషిస్తుంది — మాకు అందుబాటులో ఉన్న ఎవరూ ఆకలితో ఉండకూడదు.",
  "Lord Krishna is Gopala, the protector of cows. Our Gau Seva cares for the temple cows with fodder, green grass, shelter and medical attention — a seva dear to the Lord.":
    "శ్రీకృష్ణుడు గోపాలుడు — గోవులను రక్షించేవాడు. మా గో సేవ ద్వారా ఆలయ గోవులకు మేత, పచ్చగడ్డి, ఆశ్రయం, వైద్య సంరక్షణ అందిస్తున్నాము — ఇది భగవంతునికి ఎంతో ప్రియమైన సేవ.",
  "Bhagavad-gita classes, Srimad-Bhagavatam discourses and value-education programmes bring the timeless wisdom of the Vedas to students, families and professionals. Gita Daan places the Gita in thousands of hands.":
    "భగవద్గీత తరగతులు, శ్రీమద్భాగవత ప్రవచనాలు, విలువల విద్యా కార్యక్రమాలు వేదాల శాశ్వత జ్ఞానాన్ని విద్యార్థులకు, కుటుంబాలకు, ఉద్యోగులకు అందిస్తాయి. గీతా దానం ద్వారా వేలాది మంది చేతుల్లోకి భగవద్గీత చేరుతోంది.",
  "From Sri Krishna Janmashtami and Radhashtami to Govardhan Puja and Rath Yatra, our festivals fill Gambheeram with kirtan, abhishekam, drama and prasadam for thousands of guests.":
    "శ్రీకృష్ణ జన్మాష్టమి, రాధాష్టమి నుండి గోవర్ధన పూజ, రథయాత్ర వరకు — మా ఉత్సవాలు వేలాది అతిథులకు కీర్తన, అభిషేకం, నాటకాలు, ప్రసాదంతో గంభీరాన్ని నింపుతాయి.",
  "Volunteers are the heart of every festival and seva — from prasadam distribution to decorations and guest care. Offer your time and talents in the service of the Lord.":
    "ప్రసాద వితరణ నుండి అలంకరణలు, అతిథుల సేవ వరకు — ప్రతి ఉత్సవానికీ, సేవకూ స్వచ్ఛంద సేవకులే ప్రాణం. మీ సమయాన్ని, ప్రతిభను భగవంతుని సేవకు సమర్పించండి.",
  "A grand new temple for Sri Sri Radha Madan Mohan is rising in Visakhapatnam. Square Foot and Brick Seva let every devotee become a part of building the Lord's home.":
    "విశాఖపట్నంలో శ్రీ శ్రీ రాధా మదన మోహన వారి కోసం వైభవమైన కొత్త ఆలయం రూపుదిద్దుకుంటోంది. చదరపు అడుగు సేవ, ఇటుక సేవ ద్వారా ప్రతి భక్తుడూ భగవంతుని నివాస నిర్మాణంలో భాగం కావచ్చు.",
  // Buttons
  "Support Subhojanam": "శుభోజనానికి సహకరించండి",
  "Offer Gau Seva": "గో సేవ సమర్పించండి",
  "Sponsor Gita Daan": "గీతా దానానికి సహకరించండి",
  "See festivals": "పండుగలు చూడండి",
  "Become a volunteer": "స్వచ్ఛంద సేవకులుగా చేరండి",
  "Join Mandir Nirman": "ఆలయ నిర్మాణంలో భాగం కండి",
  // Photo captions
  "Prasadam distribution": "ప్రసాద వితరణ",
  "Temple cows": "ఆలయ గోవులు",
  "Spiritual discourse": "ఆధ్యాత్మిక ప్రవచనం",
  "Krishna Pulse youth festival": "కృష్ణ పల్స్ యువజనోత్సవం",
  "Grand Abhishekam": "మహా అభిషేకం",
  "Vanabhojanam": "వనభోజనం",
  "Seva volunteers": "స్వచ్ఛంద సేవకులు",
  "Foundation": "పునాది",
  "Structure": "నిర్మాణం",
  "Progress": "పురోగతి",

  // ── Blogs (LatestBlogs) — post titles/excerpts stay as published ──
  "Worth Knowing": "తెలుసుకోదగినవి",
  "Latest Blogs": "తాజా బ్లాగులు",
  "Krishna katha, festival insights and the teachings of Srila Prabhupada.":
    "కృష్ణ కథలు, పండుగల విశేషాలు, శ్రీల ప్రభుపాద బోధనలు.",
  "{n} min": "{n} నిమి.",

  // ── FAQ (HomeFAQ; questions/answers from lib/faq.ts) ──
  "FAQ": "సందేహాలు",
  "Frequently Asked Questions": "తరచుగా అడిగే ప్రశ్నలు",
  "Quick answers about visiting ISKCON Gambheeram — darshan timings, location, donations and how to get involved.":
    "ఇస్కాన్ గంభీరం సందర్శన గురించి త్వరిత సమాధానాలు — దర్శన వేళలు, చిరునామా, విరాళాలు, మీరు ఎలా పాల్గొనవచ్చు.",
  "Get in Touch": "మమ్మల్ని సంప్రదించండి",
  "Show less": "తక్కువ చూపించండి",
  "Show more": "మరిన్ని చూపించండి",
  "Is this ISKCON Gambheeram Visakhapatnam?": "ఇది ఇస్కాన్ గంభీరం విశాఖపట్నమేనా?",
  "Yes. This is ISKCON Gambheeram Visakhapatnam, also known as Hare Krishna Movement Vizag, located in Gambheeram, Visakhapatnam. We are a centre of the International Society for Krishna Consciousness (ISKCON), serving the community since 2008.":
    "అవును. ఇది ఇస్కాన్ గంభీరం విశాఖపట్నం — హరే కృష్ణ మూవ్‌మెంట్ వైజాగ్ అని కూడా పిలుస్తారు — విశాఖపట్నంలోని గంభీరంలో ఉంది. మేము అంతర్జాతీయ కృష్ణ చైతన్య సంఘం (ISKCON) కేంద్రం, 2008 నుండి సమాజానికి సేవ చేస్తున్నాము.",
  "Where is the temple located?": "ఆలయం ఎక్కడ ఉంది?",
  "Chaitanya Bhavan, Hare Krishna Vaikuntham Cultural Centre, IIM Road, opposite Akshaya Patra Foundation, Gambhiram, Visakhapatnam, Andhra Pradesh 531163. Use the “Get Directions” button in the footer to navigate there with Google Maps.":
    "చైతన్య భవన్, హరే కృష్ణ వైకుంఠం సాంస్కృతిక కేంద్రం, IIM రోడ్, అక్షయ పాత్ర ఫౌండేషన్ ఎదురుగా, గంభీరం, విశాఖపట్నం, ఆంధ్రప్రదేశ్ 531163. Google Mapsలో దారి కోసం పేజీ కింద ఉన్న “దారి తెలుసుకోండి” బటన్‌ను నొక్కండి.",
  "What are the darshan timings?": "దర్శన వేళలు ఏమిటి?",
  "Darshan is open from 4:30 AM to 5:00 AM (Mangala Aarti), 7:15 AM to 12:20 PM, and 4:15 PM to 8:15 PM. The live darshan status is shown at the top of every page, and the full aarti schedule is on the Daily Schedule page.":
    "దర్శనం ఉదయం 4:30 నుండి 5:00 వరకు (మంగళ హారతి), ఉదయం 7:15 నుండి మధ్యాహ్నం 12:20 వరకు, సాయంత్రం 4:15 నుండి రాత్రి 8:15 వరకు ఉంటుంది. దర్శనం ప్రస్తుతం తెరిచి ఉందో లేదో ప్రతి పేజీ పైభాగంలో కనిపిస్తుంది; పూర్తి హారతి వేళలు నిత్య కార్యక్రమాలు పేజీలో ఉన్నాయి.",
  "Are donations eligible for tax exemption?": "విరాళాలకు పన్ను మినహాయింపు లభిస్తుందా?",
  "Yes. Donations to the temple sevas qualify for 80G tax benefits. Enter your PAN while donating so your receipt can be issued for the exemption — receipts are sent on WhatsApp and are also available from Donor Login.":
    "అవును. ఆలయ సేవలకు ఇచ్చే విరాళాలకు 80G పన్ను మినహాయింపు లభిస్తుంది. మినహాయింపు రసీదు కోసం విరాళం ఇచ్చేటప్పుడు మీ PAN నమోదు చేయండి — రసీదులు WhatsAppలో పంపబడతాయి, దాతల లాగిన్‌లో కూడా లభిస్తాయి.",
  "How can I volunteer at the temple?": "ఆలయంలో స్వచ్ఛంద సేవ ఎలా చేయగలను?",
  "We welcome volunteers for festivals, prasadam distribution, Subhojanam and temple services. Register on the Volunteer page and our team will reach out with upcoming seva opportunities.":
    "పండుగలు, ప్రసాద వితరణ, శుభోజనం, ఆలయ సేవల కోసం స్వచ్ఛంద సేవకులకు స్వాగతం. స్వచ్ఛంద సేవ పేజీలో నమోదు చేసుకోండి — రాబోయే సేవా అవకాశాల గురించి మా బృందం మిమ్మల్ని సంప్రదిస్తుంది.",
  "Which festivals are celebrated at the temple?": "ఆలయంలో ఏ పండుగలు జరుపుకుంటారు?",
  "All major Vaishnava festivals are celebrated — including Sri Krishna Janmashtami, Radhashtami, Govardhan Puja, Gaura Purnima, Rath Yatra and every Ekadashi. See the Vaishnava Calendar for upcoming dates.":
    "శ్రీకృష్ణ జన్మాష్టమి, రాధాష్టమి, గోవర్ధన పూజ, గౌర పూర్ణిమ, రథయాత్ర, ప్రతి ఏకాదశితో సహా అన్ని ప్రధాన వైష్ణవ పండుగలను జరుపుకుంటాము. రాబోయే తేదీల కోసం వైష్ణవ క్యాలెండర్ చూడండి.",

  // ── Closing CTAs (JoinCTA) ──
  "Volunteer to Serve": "సేవకు ముందుకు రండి",
  "Offer your time and talents in the loving service of Sri Sri Radha Madan Mohan. Support festivals, prasadam distribution and outreach — come serve and be spiritually transformed.":
    "శ్రీ శ్రీ రాధా మదన మోహన వారి ప్రేమపూర్వక సేవలో మీ సమయాన్ని, ప్రతిభను సమర్పించండి. పండుగలు, ప్రసాద వితరణ, ప్రచార కార్యక్రమాలకు తోడ్పడండి — సేవ చేయండి, ఆధ్యాత్మికంగా మార్పు పొందండి.",
  "Register as Volunteer": "స్వచ్ఛంద సేవకులుగా నమోదు చేసుకోండి",
  "WhatsApp Channel": "WhatsApp ఛానెల్",
  "Join Our Divine Journey": "మా దివ్య యాత్రలో చేరండి",
  "Be a part of the Lord's divine seva": "భగవంతుని దివ్య సేవలో భాగం కండి",
  "Every contribution and every visit is an offering at the lotus feet of the Lord. Help us build Hare Krishna Vaikuntham — a centre of devotion, simplicity and spiritual awakening for Visakhapatnam.":
    "ప్రతి విరాళం, ప్రతి సందర్శన భగవంతుని పాదపద్మాల వద్ద ఒక సమర్పణ. హరే కృష్ణ వైకుంఠాన్ని నిర్మించడంలో మాకు తోడ్పడండి — విశాఖపట్నానికి భక్తి, నిరాడంబరత, ఆధ్యాత్మిక జాగృతి కేంద్రం.",
  "Visit the temple": "ఆలయాన్ని సందర్శించండి",
};
