// Governing Council of the Hare Krishna Movement, shown on /governance and /governance/<slug>.
// Content and portraits from the movement's council pages (guptvrindavandham.org/governance), used with permission.
// Images on our R2: governance/<slug>.webp (photo), governance/cutout-<slug>.webp (transparent cut-out),
// governance/council-banner(-mobile).webp (group). The first member is the Chairman.
export type Contribution = { title: string; text: string };
export type Video = { title: string; text: string; id: string };
export type CouncilMember = {
  slug: string; name: string; image: string; cutout: string; roles: string[]; honours: string[];
  summary: string; years: number; vision: string; expertise: string[];
  contributions: Contribution[]; videos: Video[]; bio: string[];
};

export const COUNCIL_BANNER = "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/governance/council-banner.webp";
export const COUNCIL_BANNER_MOBILE = "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/governance/council-banner-mobile.webp";

export const COUNCIL: CouncilMember[] = [
  {
    "slug": "sri-madhu-pandit-dasa",
    "name": "Sri Madhu Pandit Dasa",
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/governance/sri-madhu-pandit-dasa.webp",
    "cutout": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/governance/cutout-sri-madhu-pandit-dasa.webp",
    "roles": [
      "Chairman & Mentor, Global Hare Krishna Movement",
      "President, ISKCON Bangalore",
      "Chairman, The Akshaya Patra Foundation"
    ],
    "honours": [
      "Padma Shri",
      "Gandhi Peace Prize",
      "National Award for Child Welfare",
      "Nikkei Asia Prize"
    ],
    "summary": "Madhu Pandit Dasa is the Chairman of the Global Hare Krishna Movement and Trustee of the Akshaya Patra Foundation, guiding the world's largest NGO school meal program, and is the visionary force behind the iconic Vrindavan Chandrodaya Mandir.",
    "years": 45,
    "vision": "Inspired by the teachings and vision of ISKCON's founder-acharya, His Divine Grace A.C. Bhaktivedanta Swami Prabhupada, Sri Madhu Pandit Dasa joined the Hare Krishna Movement in 1981 while pursuing his M.Tech in Civil Engineering at IIT Bombay. Over four decades, he carried that vision forward and established the world's largest NGO school meal program by founding The Akshaya Patra Foundation.",
    "expertise": [
      "Institution Building",
      "Akshaya Patra Operations",
      "Temple Architecture & Planning",
      "Spiritual Leadership",
      "Public-Private Partnerships",
      "Heritage Preservation"
    ],
    "contributions": [
      {
        "title": "Governance & Institution Building",
        "text": "Pioneered a Public-Private Partnership model for Akshaya Patra's operations, now regarded as a benchmark in transparent, large-scale NGO governance."
      },
      {
        "title": "Heritage Preservation",
        "text": "As Chairman of the India Heritage Foundation, works to preserve and promote India's spiritual and cultural heritage among children and youth."
      },
      {
        "title": "Value-Based Education",
        "text": "As Chairman of Basil Woods Institutions, shapes education that blends academic learning with Vedic values for the next generation."
      },
      {
        "title": "Spiritual Discourse",
        "text": "Regularly teaches on the Bhagavad-gita and Srimad Bhagavatam, guiding thousands through discourses, publications, and the Soulful Japa program."
      }
    ],
    "videos": [
      {
        "title": "Sri Madhu Pandit Dasa on Srila Prabhupada's Recognition as 'Vishwa Guru' - Maha Kumbha Mela 2025",
        "text": "Sri Madhu Pandit Dasa, Chairman of the Global Hare Krishna Movement, spoke on the achievements of Srila Prabhupada in spreading Sanatana dharma worldwide during a special event at the Maha Kumbh Mela in Prayagraj.",
        "id": "dSrv4WB7snM"
      },
      {
        "title": "My speech on Akshaya Patra's 4 billionth meal celebration at the UN Council Chambers, New York",
        "text": "Sri Madhu Pandit Dasa's address at the United Nations marking Akshaya Patra's 4 billionth meal served.",
        "id": "efYmHzwGCsU"
      },
      {
        "title": "How to avoid distractions while chanting?",
        "text": "Sri Madhu Pandit Dasa shares the art of chanting the Holy Names, a practical guide towards meditation as recommended in the scriptures.",
        "id": "9o-yYpNAgZA"
      }
    ],
    "bio": [
      "Madhu Pandit Dasa was born in Nagercoil, Tamil Nadu. He became a full-time member of ISKCON in 1981 while doing his M.Tech in Civil Engineering from IIT-Bombay. Since then, he has successfully conceived and implemented many large scale public service projects that positively impact millions of people. He has also worked tirelessly to preserve and promote Indian spirituality, culture and heritage among children and youth for their holistic well-being. He is the Chairman and Mentor, Global Hare Krishna Movement and the President of ISKCON Bangalore.",
      "Madhu Pandit Dasa is the Trustee and Chairman of The Akshaya Patra Foundation, which has contributed immensely to alleviate classroom hunger and improve the nutrition levels of children studying in government schools in India. He has led Akshaya Patra to become an efficient Public-Private Partnership (PPP) and an admired social innovation. He provides visionary guidance for the world's largest NGO run school meal programme.",
      "He is also the Chairman of Vrindavan Chandrodaya Mandir and India Heritage Foundation. His stellar contributions have been appreciated through prestigious awards and accolades like Padma Shri, Gandhi Peace Prize, National Award for Child Welfare, Nikkei Asia Prize and Distinguished Alumnus Award by IIT-Bombay."
    ]
  },
  {
    "slug": "sri-chanchalapathi-dasa",
    "name": "Sri Chanchalapathi Dasa",
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/governance/sri-chanchalapathi-dasa.webp",
    "cutout": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/governance/cutout-sri-chanchalapathi-dasa.webp",
    "roles": [
      "Vice Chairman, Governing Body Committee",
      "Vice Chairman, The Akshaya Patra Foundation",
      "President, Vrindavan Chandrodaya Mandir"
    ],
    "honours": [],
    "summary": "Sri Chanchalapathi Dasa is the Vice Chairman and Co-Mentor of the Global Hare Krishna Movement and Co-Founder of The Akshaya Patra Foundation, the world's largest NGO-run school meal program.",
    "years": 40,
    "vision": "Born in 1963 in Bengaluru, Sri Chanchalapathi Dasa was introduced to the teachings of Srila Prabhupada as an undergraduate at PSG College of Technology, Coimbatore. He went on to pursue a Master's in Electrical Communication Engineering at the Indian Institute of Science, Bengaluru, before dedicating his life fully to Hare Krishna Movement in 1984.",
    "expertise": [
      "Akshaya Patra Strategy & Growth",
      "Vaishnava Scholarship",
      "Cultural Media & Storytelling",
      "Heritage Tourism",
      "Public Speaking & Writing",
      "Institutional Governance"
    ],
    "contributions": [
      {
        "title": "Vaishnava Scholarship & Writing",
        "text": "A published author, his articles on Vaishnava philosophy and spirituality have appeared in national platforms like The Speaking Tree."
      },
      {
        "title": "Public Speaking & Thought Leadership",
        "text": "Regularly invited to speak at premier institutions, including a talk at IIM Bangalore, bridging leadership, spirituality, and modern life."
      },
      {
        "title": "Institutional Strategy",
        "text": "As Vice Chairman, guides the strategic direction of The Akshaya Patra Foundation's continued nationwide growth and operations."
      },
      {
        "title": "Science & Spirituality Dialogue",
        "text": "Through his own YouTube platform, explores the intersection of modern science and Vedic wisdom for a new generation of seekers."
      }
    ],
    "videos": [
      {
        "title": "Why doesn't God simply call us directly if He wants us to be with Him? | HG Chanchalapati Dasa",
        "text": "His Grace Chanchalapati Dasa explores the complexities of the spiritual journey and the role of individual agency in seeking connection with the divine.",
        "id": "XfpYcyanknM"
      },
      {
        "title": "The Theory of Everything - The Vedanta Perspective",
        "text": "Listen to Srimad-Bhagavatam lectures given daily by the devotees at ISKCON Bangalore.",
        "id": "h8FqJnzxwnQ"
      },
      {
        "title": "UN Event | Akshaya Patra's Milestone: 4 Billion Meals Celebrated at the United Nations",
        "text": "Akshaya Patra's milestone of serving 4 billion meals, celebrated at the United Nations Trusteeship Council Chambers, New York.",
        "id": "0KvGC0H_8KY"
      }
    ],
    "bio": [
      "Chanchalapathi Dasa was born in 1963 in Bangalore, Karnataka. While an undergraduate student at PSG College of Technology, Coimbatore, he became interested in the message and mission of Srila Prabhupada. Later, he joined the Indian Institute of Science, Bangalore, for the Masters programme in Electrical Communication Engineering. He became a full-time dedicated member of ISKCON Bangalore in 1984 and has conceived various spiritual, cultural and social development programmes in the service of humanity. He led the creation of Little Krishna, a world-class animation series on the childhood pastimes of Krishna. He is the Vice Chairman of Akshaya Patra and directs the strategy, growth, and governance of the Foundation.",
      "Chanchalapathi Dasa is the Vice Chairman of the Governing Body Committee and Senior Vice President of ISKCON Bangalore. He is also the President of Vrindavan Chandrodaya Mandir, a unique heritage and culture tourism infrastructure project poised to become the tallest Krishna temple in the world."
    ]
  },
  {
    "slug": "sri-jai-chaitanya-dasa",
    "name": "Sri Jai Chaitanya Dasa",
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/governance/sri-jai-chaitanya-dasa.webp",
    "cutout": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/governance/cutout-sri-jai-chaitanya-dasa.webp",
    "roles": [
      "Member, Governing Body Committee",
      "Temple President, Hare Krishna Movement Chennai"
    ],
    "honours": [],
    "summary": "Jai Chaitanya Dasa is the director of Krishna Lila Theme Park developing in Bangalore. He is the leader of organic farming and deity worship in temples.",
    "years": 41,
    "vision": "A dedicated practitioner who bridges ancient Vedic traditions with sustainable modern practices, specializing in authentic deity worship and eco-friendly agricultural methods that honor Lord Krishna's connection with nature.",
    "expertise": [
      "Expertise in Deity Worship",
      "In charge of Organic Farming",
      "In charge of Rural Development & Sustainability",
      "Establishing Vaishnava Tradition",
      "Economic & Social Welfare",
      "Nature Harmony"
    ],
    "contributions": [
      {
        "title": "Deity Worship Standards",
        "text": "He has gained deep understanding of Pancharatra system so that he can re-establish the system of original deity worship to all the temples of ISKCON. With his work, he made sure to carry out the detailing and manner in regular worship. This way, he set up the respect of Vedic tradition, and the devotion among devotees."
      },
      {
        "title": "Organic Farming Leadership",
        "text": "He has been active in promoting the organic farming and rural development projects for a long time. By uplifting the idea of agriculture, he has made a community that supports and contributes in the actions of nature harmony. It is the ideal way to echo Lord Krishna's lifestyle in Vrindavan."
      },
      {
        "title": "Krishna Lila Theme Park",
        "text": "He is supervising the constructional working of Krishna Lila Theme Park in Vaikuntha Hills. It is a huge project that is intending to showcase the divine pastimes of Lord Krishna. This project will be modeled in a way that it will connect the visitors and storytell Lord's Leela in Vrindavan."
      },
      {
        "title": "Rural Development Programs",
        "text": "As he leads the rural development, he has established some communities to work upon the sustainable practices. His work ensures that the villages expand the models of eco-friendly agricultural practices. It will provide a spiritual and self-sufficient lifestyle."
      }
    ],
    "videos": [
      {
        "title": "Finer Facets of Spiritual Life I Sri Jai Chaitanya Dasa I SB 4.9.12 I 17.11.2021",
        "text": "Listen to Srimad-Bhagavatam lectures given daily by the devotees at ISKCON Bangalore. These lectures enlighten you about the science of God and you will learn more about Spiritual science.",
        "id": "RMEKDzK1flE"
      },
      {
        "title": "The importance of etiquette and rules I Sri Jai Chaitanya Dasa I SB 4.6.40 I 29.09.2022",
        "text": "The importance of etiquette and rules",
        "id": "SZKVumCkOxE"
      },
      {
        "title": "The importance of etiquette and rules I Sri Jai Chaitanya Dasa I SB 4.6.40 I 29.09.2022",
        "text": "The importance of etiquette and rules",
        "id": "fkSFwTkCxLU"
      }
    ],
    "bio": [
      "Jai Chaitanya Dasa was born in 1966 in Trivandradrum Kerala. He came in touch with the teachings of Srila Prabhupada while pursuing his undergraduate course in Commerce at the Mahatma Gandhi College, Trivandrum. He joined ISKCON Bangalore in 1984. He has a deep understanding of the Pancharatra system of Deity worship and meticulously introduced this authentic Vedic tradition in the temples of the movement.",
      "Jai Chaitanya Dasa is a pioneer of ISKCON Bangalore’s organic farming and rural development programs. He was the President of the Bio-Dynamic Association of India and Secretary of the Asian Fairtrade Producers Association. He has strived to establish self-sufficient farm communities by practising sustainable organic agriculture and develop effective marketing strategies for their produce. He envisions a society where every individual can live in harmony with nature in a caring, giving and responsible manner. He is a member of the Governing Body Committee and serves as the Temple President of Hare Krishna Movement, Chennai. He is also the Project Director of the Krishna Lila Theme Park in Bangalore."
    ]
  },
  {
    "slug": "sri-stoka-krishna-swami",
    "name": "Sri Stoka Krishna Swami",
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/governance/sri-stoka-krishna-swami.webp",
    "cutout": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/governance/cutout-sri-stoka-krishna-swami.webp",
    "roles": [
      "Member, Governing Body Committee",
      "Dean of Vaishnava Studies"
    ],
    "honours": [],
    "summary": "Stoka Krishna Swami is the President of ISKCON Mysore. He is the member of Governor Body Committee of HKM, and the dean of Vaishnava studies.",
    "years": 36,
    "vision": "A scholarly spiritual leader who transformed from a successful IIT engineer to a dedicated teacher of Vaishnava philosophy, inspiring thousands through his deep understanding of Vedic scriptures and practical application of Krishna Consciousness.",
    "expertise": [
      "Teaching Vaishnava Knowledge",
      "Former Infosys Technologies",
      "Temple Management",
      "Society Upliftment",
      "Scriptural Guide",
      "Inspiring Speaker"
    ],
    "contributions": [
      {
        "title": "Public Speaker",
        "text": "He talks on the various topics of Vedic Scriptures with thousands of people, inspires them towards Krishna Consciousness. By his ability to explain complex original texts of scriptures into simple language, he attracts many youth, professionals to devotion."
      },
      {
        "title": "Leadership in Chennai",
        "text": "Under his lead, many families have changed the path to Krishna's devotion. He has made a community of devotees to spread this bliss furthermore. Those who accepted the devotional life under his guide, has built their life in harmony, discipline and bhakti."
      },
      {
        "title": "Dean of Vaishnava Studies",
        "text": "He plans systematic courses on Vaishnava tradition & history. It helps the devotees to build a deep knowledge about the practices that are followed in temple. Also, he makes sure to deliver easy-to-access and original education to all the attenders and devotees."
      },
      {
        "title": "Services at ISKCON Mysore",
        "text": "He has initiated many programs to build a strong and devoted community of Lord Krishna. Such efforts strengthen the overall temple's culture by preserving it this way. Also, his leading ability makes these efforts very impactful on many people, including the youngsters."
      }
    ],
    "videos": [
      {
        "title": "Daily Gita Discourse | HH Stoka Krishna Swami | 12-07-2020",
        "text": "Listen to Srimad-Bhagavatam lectures given daily by the devotees at ISKCON Bangalore. These lectures enlighten you about the science of God and you will learn more about Spiritual science.",
        "id": "iEr1D3tSZnI"
      },
      {
        "title": "Daily Evening Bhagavatam Discourse | HH Stoka Krishna Swami | SB 1.16.16 | 18-01-2023",
        "text": "Daily Evening Bhagavatam Discourse",
        "id": "hd4IJZQfiIQ"
      },
      {
        "title": "The Significance of Initiation in Spiritual Journey I HH Stoka Krishna Swami I SB 3.16.7 I 24.8.2023",
        "text": "The Significance of Initiation in Spiritual Journey",
        "id": "HTmu0qoziAk"
      }
    ],
    "bio": [
      "Stoka Krishna Swami was born in 1960 in Mysore, Karnataka. He completed his Bachelors in Electrical Engineering from REC Nagpur. He worked as a lecturer in Malnad College of Engineering, Hassan. Before joining ISKCON in 1989, he also worked for Infosys Technologies Ltd. and Tata Boroughs Ltd. He accepted Sanyasa, the renounced order of spiritual life in 2018. He is a respected teacher and speaker on the philosophy of Krishna Consciousness.",
      "Stoka Krishna Swami is a member of Governing Body Committee of the Hare Krishna Movement. He is currently heading the activities of the Hare Krishna Movement, Chennai. He is also serving as the Dean of Vaishnava Studies and regularly conducts Vaishnava philosophical courses like Bhakti Shastri for devotees across India. He was the President of ISKCON Mysore and initiated several programs for the holistic development of local communities."
    ]
  },
  {
    "slug": "sri-amitasana-dasa",
    "name": "Sri Amitasana Dasa",
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/governance/sri-amitasana-dasa.webp",
    "cutout": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/governance/cutout-sri-amitasana-dasa.webp",
    "roles": [
      "President, Hare Krishna Movement Mumbai",
      "Governing Council Member, Hare Krishna Movement India"
    ],
    "honours": [],
    "summary": "Sri Amitasana Dasa is the President of the Hare Krishna Movement, Jaipur & Mumbai, and leads Akshaya Chaitanya, a mission feeding thousands of children and hospital patients across Mumbai every single day.",
    "years": 34,
    "vision": "Sri Amitasana Dasa completed his B.Tech in Computer Science from REC Kurukshetra and went on to work as a software engineer at Kirloskar Computer Services in Bengaluru. It was during this time that he came across the teachings of Srila Prabhupada, and in 1992 he left his corporate career to join Hare Krishna Movement as a full-time missionary.",
    "expertise": [
      "Applied Spirituality",
      "Youth Mentorship",
      "Corporate Workshops",
      "Akshaya Chaitanya Operations",
      "Vedic Counseling",
      "Public Speaking"
    ],
    "contributions": [
      {
        "title": "Youth Mentorship",
        "text": "Through his \"Life Sublime\" program, provides one-on-one spiritual counseling to help young professionals navigate life with clarity and purpose."
      },
      {
        "title": "Applied Spirituality for Professionals",
        "text": "A sought-after speaker, he conducts corporate workshops that translate the Bhagavad Gita's wisdom into practical tools for the modern workplace."
      },
      {
        "title": "Institutional Governance",
        "text": "As a Governing Council Member of the Hare Krishna Movement in India, contributes to strategic decisions that shape the movement nationwide."
      },
      {
        "title": "Humanitarian Outreach",
        "text": "Continues to expand hunger-relief efforts through Akshaya Chaitanya and Akshaya Patra, extending their reach to new communities across Maharashtra."
      }
    ],
    "videos": [
      {
        "title": "Foundation to Success & Happiness - Spiritual Quotient | Amitasana Dasa | TEDxNITIE",
        "text": "Amitasana Das, President of HKM Mumbai, shares his insights on how developing a foundation of spiritual intelligence can lead to success and happiness in all aspects of life.",
        "id": "MZuvFqU3yNs"
      },
      {
        "title": "THIS WORLD A MUSAFIRKHANA | SHORT STORIES WITH AMITASANA DAS | HKM Mumbai",
        "text": "\"Short Stories with Amitasana Das\" is a series of short videos to pass on extremely simple but important messages to better our life and improve our perspective.",
        "id": "0pGkwlAOMPY"
      },
      {
        "title": "What's the most important in life? | HG Amitasana Das",
        "text": "His Grace Amitasana Prabhu, President of Hare Krishna Movement in Mumbai and Jaipur, on three decades of selfless service in Srila Prabhupada's movement.",
        "id": "imMNi-5wgrE"
      }
    ],
    "bio": [
      "Amitasana Dasa was born in 1969 in Namrup, Assam, India. He completed B. Tech. in Computer Science from REC Kurukshetra. He later worked in Kirloskar Computer Services, Bangalore and joined ISKCON Bangalore in 1992. He has organised seminars, workshops and counselling programs to benefit students and professionals from all over the country. He has guided hundreds of people, especially youth, to lead a life of happiness and fulfilment.",
      "Amitasana Dasa is the President of Hare Krishna Movement, Mumbai and Governing Council Member of Hare Krishna Movement, India. He is also the President of Akshaya Patra operations in Maharashtra. Under his Governance, the Foundation has implemented several development initiatives in the region."
    ]
  },
  {
    "slug": "sri-vasudev-keshav-dasa",
    "name": "Sri Vasudev Keshav Dasa",
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/governance/sri-vasudev-keshav-dasa.webp",
    "cutout": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/governance/cutout-sri-vasudev-keshav-dasa.webp",
    "roles": [
      "Treasurer & Zonal Secretary, Governing Body Committee",
      "Vice President, ISKCON Bangalore"
    ],
    "honours": [],
    "summary": "Vasudev Keshav Dasa is the Vice President of ISKCON Bangalore. He is the dean of National Institute of Value Education. Also, serving as Treasurer & Zonal Secretary.",
    "years": 27,
    "vision": "An innovative educator and skilled administrator who leverages his technical background to create comprehensive value-based education programs, ensuring the next generation grows with strong moral and spiritual foundations alongside modern knowledge.",
    "expertise": [
      "Design Educational Programs",
      "Treasurer & Zonal Secretary",
      "Head of Deity Services",
      "Spiritual Counseling",
      "Dean of NIVE",
      "Former Wipro Systems Engineer"
    ],
    "contributions": [
      {
        "title": "Value Education",
        "text": "He has developed creative programs at NIVE. Under his direction, children's life is uplifting with mental and spiritual moral values. Such programs are helpful in rooting the life of children with spirituality in this Modern World."
      },
      {
        "title": "Deity Services",
        "text": "As the head of Deity Services Department, he oversees the high-standard worship practices of devotees at ISKCON temples. His excellent leadership has maintained the community of devotees, keeping them inspired and devoted towards temple services and worship."
      },
      {
        "title": "Leadership at ISKCON Bangalore",
        "text": "He leads the overall temple management, like outreaching people for communities, spreading the value-based education to school-going children, and ensuring the proper following of high-standards deity worshipping in the ISKCON temples."
      },
      {
        "title": "Educational Visionary",
        "text": "By the development of value-education, cultural programs, and other spiritual activities, he is ensuring a bright future for the next generation. It's a blend of perfect academic and spirituality that is rooted to the morals of the Krishna Consciousness."
      }
    ],
    "videos": [
      {
        "title": "Benefits of Chanting Hare Krishna Maha-mantra | HG Vasudev Keshav Dasa",
        "text": "Listen to Srimad-Bhagavatam lectures given daily by the devotees at ISKCON Bangalore. These lectures enlighten you about the science of God and you will learn more about Spiritual science.",
        "id": "6ovOoEtHy8M"
      },
      {
        "title": "The Purity of a Pure Devotee | HG Vasudev Keshav Dasa | SB 4.1.14 | 2019-05-09",
        "text": "How glorious is the purity of a pure devotee when compared to the Ganges?",
        "id": "XB_ieJoBfXg"
      },
      {
        "title": "Become Qualified to See God I Sri Vasudev Keshav Dasa I SB 6.4.46 I 24.11.2022",
        "text": "Become Qualified to See God",
        "id": "ruk6e-MvLkY"
      }
    ],
    "bio": [
      "Vasudev Keshav Dasa was born in 1973 in Kolkata, West Bengal. He studied B.Tech in Electronics and Communication Engineering from REC Warangal and worked in Wipro Systems as a Systems Engineer. He joined ISKCON Bangalore as a full-time missionary in 1998. As the Head of the Deities related services, he has ensured that high standards of worship are maintained in the temples of the Hare Krishna Movement.",
      "He is serving as the Treasurer and Zonal Secretary of Governing Body Committee and the Vice President of ISKCON Bangalore. He is also the Dean of the National Institute of Value Education (NIVE), which is imparting Value Education to hundreds of children so that they grow to become responsible citizens. He has designed learning programs to bring about holistic development in young minds by enriching their physical, mental and spiritual well-being."
    ]
  },
  {
    "slug": "sri-rajiv-lochan-dasa",
    "name": "Sri Rajiv Lochan Dasa",
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/governance/sri-rajiv-lochan-dasa.webp",
    "cutout": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/governance/cutout-sri-rajiv-lochan-dasa.webp",
    "roles": [
      "Zonal Secretary, Governing Body Committee",
      "Temple President, ISKCON Hubli"
    ],
    "honours": [],
    "summary": "Rajiv Lochan Dasa is the President of ISKCON Hubli. He leads the construction and management of Radha Krishna Mandir. Also, oversees Akshaya Patra, the world largest Kitchen in Hubli.",
    "years": 32,
    "vision": "A globally recognized leader in large-scale food service management and temple construction, combining operational excellence with spiritual devotion to serve millions of underprivileged children while spreading Krishna Consciousness through kirtan and scriptural teachings.",
    "expertise": [
      "Featured in NatGeo Mega Kitchens",
      "Zonal Secretary, HKM",
      "Lead the Radha Krishna Mandir",
      "Expert in Kirtan & Lectures",
      "Temple Management",
      "Akshaya Patra Establishment"
    ],
    "contributions": [
      {
        "title": "Global Recognition",
        "text": "The Hubli's Akshaya Patra Kitchen has been shown in a well-made documentary of 'Mega Kitchens' series on National Geographic Channel. It is one of the most popular documentaries that features the cleanliness, maintenance, and the large-scale food making inside the Kitchen."
      },
      {
        "title": "Inspiring Teacher",
        "text": "He attracts thousands of people through his blissful Harinam Sankirtan. He delivers spiritual lectures, and translates the meaning in simpler explanations of Bhagavad Gita and Srimad Bhagavatam. A lot of families have addressed him as their spiritual guide."
      },
      {
        "title": "Akshaya Patra in Hubli",
        "text": "Under his leadership, millions of underprivileged school-going children receive meals. It provides them a balanced nutrients and healthy meal, everyday. He is serving lakhs of future generation of this country, supporting their healthy lifestyle and education."
      },
      {
        "title": "Radha Krishna Mandir",
        "text": "Under his direction, the temple is foreseen as the cultural and spiritual attraction for thousands of visitors. The temple will serve as a hub of devotional practices, like proper deity worship, practice chanting Hare Krishna Mahamantra, engaging in group dancing, prasadam, etc."
      }
    ],
    "videos": [
      {
        "title": "भौतिक प्रकृति का वर्णन",
        "text": "आज से 5000 साल पहले भगवान श्री कृष्ण इस पृथ्वी पर प्रकट हुए और अपनी दिव्य लीलाओं द्वारा सभी के मन एवं हृदय पर अधिपत्य स्थापित कर लिया। शास्त्र के अनुसार ये लीलाएं हमारे हृदय को सभी दूषित पदाथों से शुद्ध करके हमें वास्तविक आनंद का स्वाद लेने में सहायक होती हैं।",
        "id": "CzyJZ1Z8_yc"
      },
      {
        "title": "राम कथा",
        "text": "Hear the pastimes of Lord Ram from Ramayana by Sri Rajiv Lochan Dasa, President - ISKCON Hubli.",
        "id": "dTZf_lu9N2g"
      },
      {
        "title": "Krishna Katha, कृष्ण कथा",
        "text": "भगवान श्री कृष्ण का अपने हृदय में स्वागत करने के लिए तैयार हो जाइए, क्योकि श्री कृष्ण जन्माष्टमी का दिन निकट आ रहा हैं। वृंदावन चंद्रोदय मंदिर प्रस्तुत कर रहा है 30 दिवसीय जन्माष्टमी का एक अविस्मरणीय अनुभव।",
        "id": "lrZZYis_Gn0"
      }
    ],
    "bio": [
      "Rajiv Lochan Dasa was born in Sonipat, Haryana. He studied Bachelors in Science at St. Joseph’s College (Bangalore) and joined ISKCON Bangalore in 1993. He is known for leading ecstatic kirtans and delivering inspiring lectures on Bhagavad-gita and Srimad Bhagavatam.",
      "Rajiv Lochan Dasa is currently serving as Zonal Secretary of the Governing Body Committee, Hare Krishna Movement and Temple President, ISKCON Hubli. He is supervising the construction of a magnificent Radha Krishna Temple in Hubli. He is the President of Akshaya Patra in Hubli and leads the operations of the world’s largest kitchen there. This best-in-class infrastructure was showcased in National Geographic Channel’s popular documentary series called Mega Kitchens."
    ]
  },
  {
    "slug": "sri-satya-gaura-chandra-dasa",
    "name": "Sri Satya Gaura Chandra Dasa",
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/governance/sri-satya-gaura-chandra-dasa.webp",
    "cutout": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/governance/cutout-sri-satya-gaura-chandra-dasa.webp",
    "roles": [
      "Zonal Secretary, Governing Body Committee",
      "President, Hare Krishna Movement Hyderabad",
      "Trustee, The Akshaya Patra Foundation"
    ],
    "honours": [],
    "summary": "Satya Gaura Chandra Dasa is the leader of Hare Krishna Movement in Hyderabad. Also, as a Charitable Trust of Akshaya Patra in Telangana and Andhra Pradesh, he served many meals.",
    "years": 28,
    "vision": "A gold medalist engineer turned spiritual leader who combines academic excellence with compassionate service, establishing multiple kitchen facilities across South India to serve underprivileged children while training spiritual missionaries.",
    "expertise": [
      "Gold Medal in B-tech Engineering",
      "Akshaya Patra Operations",
      "Leadership of HKM Hyderabad",
      "Trustee of Akshaya Patra Foundation",
      "Zonal Secretary of HKM",
      "Social Welfare"
    ],
    "contributions": [
      {
        "title": "Social Upliftment",
        "text": "He prioritizes combining the prasadam service with the social welfare activity. Many underprivileged children are still far from getting education due to lack of adequate meal. This necessity has been fulfilled by him by reaching thousands of children, and offering them one time, full nutritious meal of vegetable Khichdi."
      },
      {
        "title": "Training & Development",
        "text": "He has trained many devotees and the missionaries and improved their way of preaching and strengthening their devotional spirit. Under his teachings, the foundation of Hare Krishna Movement has become more powerful and prepared a lot of spiritual leaders."
      },
      {
        "title": "Charitable Trustee",
        "text": "He has founded the Hare Krishna Charitable Trust to serve the most needful communities in the society. Through the distribution of vegetable khichdi prasadam to many school-going poor children, he has ensured the welfare of each and every section of the society."
      },
      {
        "title": "Akshaya Patra Expansion",
        "text": "Under his instructions, the temple has successfully established Akshaya Patra Kitchens in Kandi, Narasingi, Vijayawada, Vishakhapatnam, and more places. This has fulfilled the hunger of lakhs of underprivileged children, boosting their digestion and improving the lifestyle."
      }
    ],
    "videos": [
      {
        "title": "Dealing with Devotees | HG Satya Gaura Chandra Dasa | Hare Krishna Mandir",
        "text": "Satya Gaura Chandra Dasa is the President of the Hare Krishna Movement in Hyderabad, India. He is also the Zonal Secretary of the Governing Body Committee for Telangana and Andhra Pradesh states. He is a Trustee of Akshaya Patra, a non-profit organization that provides mid-day meals to school children in India.",
        "id": "senL7tsYLu4"
      },
      {
        "title": "Determined Planning | HG Satya Gaura Chandra Dasa | SB 4.4.2 | 2019-07-19",
        "text": "Listen to Srimad-Bhagavatam lectures given daily by the devotees at ISKCON Bangalore. These lectures enlighten you about the science of God and you will learn more about Spiritual science.",
        "id": "2VOyMSQ_Wgo"
      },
      {
        "title": "Fearless and auspicious path | HG Satya Gaura Chandra Dasa | SB 6.1.17 | 05-12-2019",
        "text": "When one follows the path of bhakti in the footsteps of pure devotees, he is on an auspicious path that can make him fearless.",
        "id": "fpNgEkLCq0M"
      }
    ],
    "bio": [
      "Satya Gaura Chandra Dasa was born in Rajahmundry, Andhra Pradesh. He is a Gold Medalist in B.Tech (Mechanical Engineering) at Jawaharlal Nehru Technological University, Kakinada. After completing M.Tech from IIT-Chennai, he worked in Novell, a multinational IT firm, before joining ISKCON Bangalore in 1997. He has rendered various services ranging from managing the temple administration to training and development of full-time missionaries.",
      "He is currently serving as the Zonal Secretary of the Governing Body Committee and the President of Hare Krishna Movement, Hyderabad. He initiated the Hare Krishna Charitable Trust, which is extensively feeding the underprivileged sections of society. He is a Trustee of Akshaya Patra and heads its operations in Telangana and Andhra Pradesh. He has set up kitchens in Kandi, Narasingi, Vishakapatnam, Vijayawada and various other locations, thus enabling the Foundation to serve hygienic and nutritious mid-day meals to lakhs of children."
    ]
  },
  {
    "slug": "sri-suvyakta-narasimha-dasa",
    "name": "Sri Suvyakta Narasimha Dasa",
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/governance/sri-suvyakta-narasimha-dasa.webp",
    "cutout": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/governance/cutout-sri-suvyakta-narasimha-dasa.webp",
    "roles": [
      "Senior Vice President, Hare Krishna Movement Chennai"
    ],
    "honours": [],
    "summary": "Sri Suvyakta Narasimha Dasa is the temple President of the Hare Krishna Movement in Chennai and oversees Akshaya Patra operations in Tamil Nadu, with a vision of setting up centralized kitchens across India.",
    "years": 27,
    "vision": "Born in Muvattupuzha town, Ernakulam district, Kerala, in 1973, Sri Suvyakta Narasimha Dasa graduated in Mechanical Engineering from MSRIT, Bengaluru, and later earned his Master's degree in Engineering from UVCE. In August 1999, he left his professional career behind and dedicated his life to Krishna consciousness by joining ISKCON Bangalore.",
    "expertise": [
      "Kitchen Systems Engineering",
      "Large-Scale Infrastructure",
      "Temple Construction",
      "Akshaya Patra Operations",
      "Vaishnava Philosophy",
      "Community Leadership"
    ],
    "contributions": [
      {
        "title": "Spiritual Discourse",
        "text": "Regularly delivers lectures on the Srimad Bhagavatam and Bhagavad Gita, reaching thousands of viewers through his active YouTube presence."
      },
      {
        "title": "Youth & Cultural Outreach",
        "text": "Oversees youth engagement programs like FOLK at Hare Krishna Movement, Chennai, connecting young people with Vedic culture and values."
      },
      {
        "title": "Institutional Governance",
        "text": "As a Governing Body member of the Hare Krishna Movement, contributes to strategic decisions shaping the movement's direction nationwide."
      },
      {
        "title": "Infrastructure Planning",
        "text": "Continues to apply his engineering background to plan and guide large-scale temple and kitchen infrastructure projects across the country."
      }
    ],
    "videos": [
      {
        "title": "Mahabharata - Short Stories | Part 1 | His Grace Suvyakta Narasimha Dasa",
        "text": "The Mahabharata is considered one of the greatest itihasas ever known, containing lessons in the path to achieve the ultimate success of human life.",
        "id": "qJyfzzwImdg"
      },
      {
        "title": "Decoding the Mystery: Mind, Intelligence, Brain and AI | His Grace Suvyakta Narasimha Dasa",
        "text": "Decoding the Mystery: Mind, Intelligence, Brain and AI",
        "id": "YODNqI3a4-o"
      },
      {
        "title": "Faith - The basis of Science | His Grace Suvyakta Narasimha Dasa",
        "text": "Faith - The basis of Science",
        "id": "ILSF2UrS7B4"
      }
    ],
    "bio": [
      "Suvyakta Narasimha Dasa was born in 1973 in Moovattupuzha in Kerala. He completed B.E. (Mechanical) from M S Ramaiah Institute of Technology and secured 5th rank in Bangalore University. After graduation, he worked in Lincoln Helios India Ltd. as a Design Engineer. After becoming a full-time missionary of ISKCON Bangalore in 1999, he has been dedicating his skills and expertise for the welfare of society.",
      "Suvyakta Narasimha Dasa successfully designed and operationalised Akshaya Patra’s centralised kitchens in Vrindavan, Lucknow, Jaipur and other locations. He has been instrumental in the setting up of the sprawling Vrindavan Chandrodaya Mandir campus. He is currently serving as Senior Vice President of Hare Krishna Movement, Chennai and also overseeing the operations of Akshaya Patra in Tamil Nadu."
    ]
  }
];

export const councilMember = (slug: string) => COUNCIL.find((m) => m.slug === slug);
