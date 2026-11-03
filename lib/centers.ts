// Sister centres of the Hare Krishna Movement, shown on /centers and
// /centers/[slug]. Details (overview, deities, address, phone, timings) were
// compiled from the public centre pages of the Gupt Vrindavan Dham site and the
// centres' Google listings; each centre's own website is the source of truth.
export type CenterRegion = "South India" | "North India" | "West & Central India" | "East & Northeast India" | "International";

export interface CenterDeity { name: string; text: string; image: string }
export interface Center {
  slug: string;
  name: string;
  city: string;
  state: string;
  region: CenterRegion;
  /** Original photo of the centre (shown in the About section and on cards). */
  image: string;
  /** Optional stylised header artwork; the page header falls back to `image` until it is set. */
  headerImage?: string;
  /** Optional image for the card on /centers (falls back to `image`). */
  cardImage?: string;
  /** Width / height of `headerImage` so the banner is shown uncropped (default 3). */
  headerRatio?: number;
  lat: number | null;
  lng: number | null;
  placeId: string | null;
  rating: number | null;
  reviews: number | null;
  overview: string[];
  address: string | null;
  phone: string | null;
  website: string | null;
  hours: string[];
  deities: CenterDeity[];
  features: { title: string; text: string }[];
}

export const CENTER_REGIONS: CenterRegion[] = ["South India", "North India", "West & Central India", "East & Northeast India", "International"];

export const CENTERS: Center[] = [
  {
    "slug": "iskcon-bangalore",
    "name": "ISKCON Bangalore",
    "city": "Bengaluru",
    "state": "Karnataka",
    "region": "South India",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793685382479-1793685381907-ISKCONBangaloreTempleIllustration.png",
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-bangalore-hero.jpg",
    "lat": 13.0096264,
    "lng": 77.5510978,
    "placeId": "ChIJBw42C-09rjsRs7KmQUqyf3o",
    "rating": 4.7,
    "reviews": 144212,
    "overview": [
      "ISKCON Temple Bangalore is a well-known temple in South India, famous for its unique design and the part it played in promoting spirituality and culture in society. The temple is located on Hare Krishna Hill in Rajajinagar, and its spiritual and humanitarian efforts offer devotees a peaceful and eternal visit to the holy place."
    ],
    "address": "Hare Krishna Hill, Chord Rd, 1st R Block, Rajajinagar, Bengaluru, Karnataka 560010, India",
    "phone": "+91 80 2347 1956",
    "website": "iskconbangalore.org",
    "hours": [
      "Morning 4:15 – 5:15 AM",
      "Morning 7:15 AM – 1:00 PM",
      "Afternoon 4:15 – 8:20 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Radha Krishnachandra",
        "text": "Sri Sri Radha Krishnachandra, the divine couple, are worshipped as the ultimate and supreme embodiment of divine love.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-bangalore-d0.jpg"
      },
      {
        "name": "Sri Sri Krishna Balaram",
        "text": "The Lordships Sri Sri Krishna Balaram are worshipped as the supreme manifestation of protection, faith, and eternal brotherhood.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-bangalore-d1.jpg"
      },
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-bangalore-d2.jpg"
      },
      {
        "name": "Sri Prahlada Narasimha",
        "text": "Lord Narasimha and His devotee Prahlad are worshipped as symbols of protection and the triumph of devotion over evil.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-bangalore-d3.jpg"
      },
      {
        "name": "Sri Srinivasa Govinda",
        "text": "Sri Srinivasa Govinda is worshipped as the divine protector of wealth, prosperity, and devotees' well-being.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-bangalore-d4.jpg"
      },
      {
        "name": "Sri Hanuman",
        "text": "Bhakta Hanuman is worshipped as the eternal symbol of devotion, strength, and selfless service to the Lord.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-bangalore-d5.jpg"
      },
      {
        "name": "Sri Garuda Dev",
        "text": "Garuda Dev is worshipped as the eternal carrier of Lord Vishnu, symbolizing power, speed, and unwavering loyalty.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-bangalore-d6.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-bangalore-d7.jpg"
      }
    ],
    "features": [
      {
        "title": "Hari-nama Mantapa",
        "text": "A holy place for constant chanting and worship"
      },
      {
        "title": "Annadana Hall",
        "text": "Offering free prasadam as a way to show love and service."
      },
      {
        "title": "Spiritual Discourses",
        "text": "Access spiritual knowledge through Vedic literature and teachings."
      },
      {
        "title": "Gaushala",
        "text": "Dedicated fodder seva with utmost protection and care of cows."
      },
      {
        "title": "Cultural Exhibitions",
        "text": "Displaying Vedic philosophy and traditional heritage."
      },
      {
        "title": "Guest House",
        "text": "Comfortable stay experience for visitors and devotees."
      },
      {
        "title": "The Higher Taste",
        "text": "Gourmet restaurant, offering sattvic food with lunch and dinner buffets."
      },
      {
        "title": "Festival Celebrations",
        "text": "Grand celebrations of major festivals with pure devotion and joy."
      }
    ]
  },
  {
    "slug": "vaikuntha-hill-bengaluru",
    "name": "ISKCON - Vaikuntha Hill",
    "city": "Bengaluru",
    "state": "Karnataka",
    "region": "South India",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793686287665-1793686287120-ISKCONVaikunthaHillTempleComplex.png",
    "headerRatio": 2,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-vaikuntha-hill-hero.jpg",
    "lat": 12.8925244,
    "lng": 77.5488992,
    "placeId": "ChIJqWe8lOg_rjsRV5b3tvoqZzI",
    "rating": 4.7,
    "reviews": 20441,
    "overview": [
      "Known as the Rajadhiraja Govinda Temple, ISKCON Vaikuntha Hill was inaugurated on 14 June, 2022 by the Honourable President of India, Sri Ram Nath Kovind. Located in Vasanthapura, the temple is a humble offering to Srila Prabhupada on his 125th birth anniversary. The temple is widely admired for its architecture and for the Deity of Sri Rajadhiraja Govinda, a replica of Lord Venkateshwara."
    ],
    "address": "12th Main Road, Vaikunta Hill, Vasanthapura, Uttarahalli Hobli, Bengaluru, Karnataka 560061, India",
    "phone": "+91 79755 25536",
    "website": "iskconbangalore.org",
    "hours": [
      "Morning 7:15 AM – 12:40 PM",
      "Afternoon 4:15 – 8:10 PM"
    ],
    "deities": [
      {
        "name": "Sri Radha Krishnachandra",
        "text": "Radha Krishna, offering darshan to devotees, is the ultimate symbol of eternal love and faith.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-vaikuntha-hill-d0.jpg"
      },
      {
        "name": "Sri Jagannatha, Baladev and Subhadra",
        "text": "The supreme Lord Jagannnatha with his elder brother Baladev and sister Subhadra, the most merciful deities offering blessings in the age of Kali.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-vaikuntha-hill-d1.jpg"
      },
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-vaikuntha-hill-d2.jpg"
      },
      {
        "name": "Sri Sri Rajadhiraja Govinda",
        "text": "The King of Kings, the powerful form of Lord Venkateshwara, who is known for unlimited mercy, prosperity and liberation, surrenders to him.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-vaikuntha-hill-d3.jpg"
      },
      {
        "name": "Srimati Rajalakshmi Padmavati",
        "text": "Srimati Rajalakshmi Padmavati is worshipped as the divine goddess of wealth, prosperity, and auspiciousness.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-vaikuntha-hill-d4.jpg"
      },
      {
        "name": "Sri Hanuman",
        "text": "Sri Hanuman is worshipped as the eternal symbol of devotion, strength, and selfless service to the Lord.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-vaikuntha-hill-d5.jpg"
      },
      {
        "name": "Sri Garuda",
        "text": "Sri Garuda is worshipped as the eternal carrier of Lord Vishnu, symbolizing power, speed, and unwavering loyalty.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-vaikuntha-hill-d6.jpg"
      },
      {
        "name": "Sri Sudarshana Narasimha",
        "text": "The protector who appeared as the divine Sudarshana Chakra in front of Sri Yoga Narasimha to destroy evil and fear while granting powerful protection to his devotees.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-vaikuntha-hill-d7.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Srila Prabhupada is worshipped as the Founder Acharya of the Hare Krishna Movement.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-vaikuntha-hill-d8.jpg"
      }
    ],
    "features": [
      {
        "title": "Grand Temple Hall",
        "text": "Divine abode of Sri Sri Rajadhiraja Govinda and other lordships"
      },
      {
        "title": "Harinama and Meditation Hall",
        "text": "Peaceful corner for chanting and deep mantra meditation."
      },
      {
        "title": "Prasadam and Annadana Hall",
        "text": "Kichdi Vitran and nourishing cuisine are available for all"
      },
      {
        "title": "Srila Prabhupada Museum",
        "text": "Honouring the teachings of the Founder - Acharya of ISKCON"
      },
      {
        "title": "Krishna Lila Park",
        "text": "Attractive reflections of the Lord eternal pastimes"
      },
      {
        "title": "Cultural and Education Centre",
        "text": "Vedic art and heritage learning"
      },
      {
        "title": "Braj Biodiversity Park",
        "text": "12 recreated forests of Vrindavan"
      },
      {
        "title": "Hilltop Panorama",
        "text": "Scenic views from the temple top with breathtaking nature"
      }
    ]
  },
  {
    "slug": "vrindavan-chandrodaya-mandir",
    "name": "Vrindavan Chandrodaya Mandir",
    "city": "Vrindavan",
    "state": "Uttar Pradesh",
    "region": "North India",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793686854118-1793686852825-VrindavanChandrodayaMandirPanorama.png",
    "headerRatio": 2.176,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/vrindavan-chandrodaya-mandir-hero.jpg",
    "lat": 27.5718095,
    "lng": 77.6435161,
    "placeId": "ChIJZR3K4fptczkRKhsWbo_UkG4",
    "rating": 4.7,
    "reviews": 6721,
    "overview": [
      "Vrindavan Chandrodaya Mandir is the grandest and longest-standing Sri Krishna Temple on the sacred land of Vrindavan. Dedicated to and built on the glories of Lord Krishna, this temple is a true blend of traditional Indian temple and modern architecture. Inspired by Srila Prabhupada's vision, this temple complex will be a symbol of Krishna consciousness for generations to come."
    ],
    "address": "Bhaktivedanta Swami Marg, Vrindavan, Sunrakh Bangar, Uttar Pradesh 281121, India",
    "phone": "+91 85858 50033",
    "website": "vcm.org.in",
    "hours": [
      "Morning 7:00 AM – 1:00 PM",
      "Afternoon 4:00 – 8:00 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Radha Vrindavan Chandra",
        "text": "The divine couple of Vrindavan, Radha Krishna, are worshipped as the supreme embodiment of pure love and the eternal beauty of Vrindavan.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/vrindavan-chandrodaya-mandir-d0.jpg"
      },
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Incarnations of Radha Krishna and Balaram, who were revered for their famous preaching of the Hare Krishna Maha Mantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/vrindavan-chandrodaya-mandir-d1.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/vrindavan-chandrodaya-mandir-d2.jpg"
      }
    ],
    "features": [
      {
        "title": "Grand Temple Hall",
        "text": "Divine abode of the enchanting lordships"
      },
      {
        "title": "Harinam Mantapa",
        "text": "Home of the divine Surabhi cows"
      },
      {
        "title": "Prasadam and Dining",
        "text": "Sattvic and traditional Braj cuisine"
      },
      {
        "title": "Srila Prabhupada Museum",
        "text": "Honouring the Founder Acharya of the Hare Krishna Movement"
      },
      {
        "title": "Krishna Lila Park",
        "text": "Reflections of the Lord’s pastimes"
      },
      {
        "title": "Cultural Education Centre",
        "text": "Learning Art, heritage and values"
      },
      {
        "title": "Braj Nidhi Hall",
        "text": "Grand convention and cultural hall"
      },
      {
        "title": "Bio-Diversity Park",
        "text": "12 recreated forests of Vrindavan"
      }
    ]
  },
  {
    "slug": "gupt-vrindavan-dham-jaipur",
    "name": "Gupt Vrindavan Dham",
    "city": "Jaipur",
    "state": "Rajasthan",
    "region": "North India",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793687003191-1793687002827-GuptVrindavanDhamTemplePanorama.png",
    "headerRatio": 3.0,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hkm-jaipur-hero.jpg",
    "lat": 26.805611100000004,
    "lng": 75.8555243,
    "placeId": "ChIJUf57eUvIbTkRoef1PIBMoik",
    "rating": 4.7,
    "reviews": 2792,
    "overview": [
      "Gupt Vrindavan Dham is the largest cultural and spiritual centre hub, dedicated to preserving and spreading Krishna consciousness. Located in the heart of Jaipur, this divine sanctuary offers devotees and visitors a peaceful space for worship, learning, and spiritual growth."
    ],
    "address": "Hare Krishna Marg, Sector 26, Mahal Scheme, Jagatpura, Jaipur, Rajasthan 302017, India",
    "phone": "+91 97999 99881",
    "website": "guptvrindavandham.org",
    "hours": [
      "Morning 4:00 AM – 1:00 PM",
      "Afternoon 4:30 – 8:45 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Krishna Balaram",
        "text": "The Lordships Sri Sri Krishna Balaram are worshipped as the supreme manifestation of protection, faith, and eternal brotherhood.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hkm-jaipur-d0.jpg"
      },
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hkm-jaipur-d1.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hkm-jaipur-d2.jpg"
      }
    ],
    "features": [
      {
        "title": "Hari-nama Mantapa",
        "text": "A holy place for constant chanting and worship."
      },
      {
        "title": "Annadaan & Khichdi Distribution",
        "text": "Offering free prasadam as a blessing of love with devotion and service."
      },
      {
        "title": "Spiritual Discourses",
        "text": "Access spiritual knowledge through Vedic literature and teachings."
      },
      {
        "title": "Gaushala",
        "text": "Dedicated fodder seva with utmost protection and care of cows."
      },
      {
        "title": "Cultural Exhibitions",
        "text": "Displaying Vedic philosophy and traditional heritage."
      },
      {
        "title": "Guest House",
        "text": "Comfortable stay experience for visitors and devotees."
      },
      {
        "title": "Rasikam",
        "text": "Gourmet restaurant, offering sattvic food with lunch and dinner buffets."
      },
      {
        "title": "Festival Celebrations",
        "text": "Grand celebrations of major festivals with pure devotion and joy."
      }
    ]
  },
  {
    "slug": "heritage-tower-hyderabad",
    "name": "Hare Krishna Heritage Tower",
    "city": "Hyderabad",
    "state": "Telangana",
    "region": "South India",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793687054070-1793687053740-HareKrishnaHeritageTempleComplex.png",
    "headerRatio": 2.0,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-heritage-tower-hero.jpg",
    "lat": 17.3976306,
    "lng": 78.34086669999999,
    "placeId": "ChIJW7ZCZAOVyzsRArq37AQaBM4",
    "rating": 4.8,
    "reviews": 172,
    "overview": [
      "Hare Krishna Heritage Tower is an upcoming spiritual and cultural landmark envisioned to present the teachings of Lord Krishna in a grand, contemporary setting. Inspired by the mission of Srila Prabhupada, the project brings together devotion, heritage, education and immersive spiritual experiences, aiming to serve as a prominent centre for Krishna consciousness and cultural learning."
    ],
    "address": "Golden Mile Rd, Power Welfare Society, Narsingi, Kokapet, Hyderabad, Telangana 500075, India",
    "phone": "+91 70574 00400",
    "website": "harekrishnaheritagetower.org",
    "hours": [
      "Morning 7:00 AM – 1:00 PM",
      "Afternoon 4:00 – 8:00 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Radha Krishna",
        "text": "Sri Sri Radha Krishna, the divine couple, are worshipped as the ultimate and supreme embodiment of divine love.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-heritage-tower-d0.jpg"
      },
      {
        "name": "Sri Jagannatha, Baladev and Subhadra",
        "text": "The supreme Lord Jagannnatha with his elder brother Baladev and sister Subhadra, the most merciful deities offering blessings in the age of Kali.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-heritage-tower-d1.jpg"
      },
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-heritage-tower-d2.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-heritage-tower-d3.jpg"
      }
    ],
    "features": [
      {
        "title": "Grand Temple Architecture",
        "text": "A landmark spiritual structure blending Vedic heritage with modern architectural excellence."
      },
      {
        "title": "Radha Krishna Darshan",
        "text": "A dedicated space planned for the worship of Sri Sri Radha Krishna."
      },
      {
        "title": "Multi-Deity Shrines",
        "text": "Planned shrines for Nitai Gauranga, Sita Rama Lakshmana Hanuman and Srinivasa Govinda."
      },
      {
        "title": "Srila Prabhupada Tribute",
        "text": "A project envisioned to honour the teachings and legacy of Srila Prabhupada."
      },
      {
        "title": "Spiritual Learning Spaces",
        "text": "Dedicated areas planned for Bhagavad Gita teachings, cultural education and spiritual activities."
      },
      {
        "title": "Immersive Heritage Experience",
        "text": "A unique destination designed to showcase Vedic wisdom through modern experiences."
      },
      {
        "title": "Cultural & Devotional Centre",
        "text": "A place envisioned for festivals, kirtan, gatherings and devotional programs."
      },
      {
        "title": "Panoramic Tower Experience",
        "text": "A 120-metre spiritual tower designed as a landmark offering a unique visitor experience."
      }
    ]
  },
  {
    "slug": "iskcon-mysore",
    "name": "ISKCON Mysore",
    "city": "Mysuru",
    "state": "Karnataka",
    "region": "South India",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793687122364-1793687122037-ISKCONMysoreTempleinVibrantDetail.png",
    "headerRatio": 2.0,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-mysore-hero.jpg",
    "lat": 12.2855011,
    "lng": 76.633831,
    "placeId": "ChIJXbSrmqVlrzsR7Eou1oRaD6o",
    "rating": 4.7,
    "reviews": 2593,
    "overview": [
      "ISKCON Temple, Mysore, also known as Nava Brindavan Dham, is a cultural complex spanning 9 acres, peacefully reflecting the old-world charm of Hoysala architecture while blending with local culture. Built for Rs. 120 crores, the temple enriches India's glory by leading humanitarian and social efforts."
    ],
    "address": "NO.213, 18th Cross Road, Jayanagar, Kuvempu Nagara, Mysuru, Karnataka 570034, India",
    "phone": "+91 81476 54557",
    "website": "iskconmysore.org",
    "hours": [
      "Morning 4:30 AM – 1:00 PM",
      "Afternoon 4:15 – 8:30 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Krishna Balaram",
        "text": "The Lordships Sri Sri Krishna Balaram are worshipped as the supreme manifestation of protection, faith, and eternal brotherhood.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-mysore-d0.jpg"
      },
      {
        "name": "Sri Sri Nitai Gauranaga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-mysore-d1.jpg"
      },
      {
        "name": "Sri Sri Lakshmi Narasimha",
        "text": "Worshipped as the divine protector embodying fierce justice and compassionate grace.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-mysore-d2.jpg"
      },
      {
        "name": "Vasudeva Shaligram",
        "text": "Worshipped as the sacred stone manifestation of Lord Vishnu, symbolizing purity and divine presence.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-mysore-d3.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Worshipped as the Founder Acharya of the Hare Krishna Movement, guiding millions toward bhakti and enlightenment.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-mysore-d4.jpg"
      }
    ],
    "features": [
      {
        "title": "Main Prayer Hall",
        "text": "Spacious, Tranquil Hall for Darshan"
      },
      {
        "title": "Daily Prasadam Distribution",
        "text": "The temple serves free sanctified meals to devotees"
      },
      {
        "title": "Spiritual Bookstore",
        "text": "Book counter offering sacred Vedic scriptures"
      },
      {
        "title": "FOLKs",
        "text": "Membership programs for students and professionals"
      },
      {
        "title": "Prahlad School",
        "text": "“Sunday School” for Children"
      },
      {
        "title": "Sunday Love Feast",
        "text": "Weekly program with special kritan and full meal prasadam"
      },
      {
        "title": "Folk",
        "text": "Folk A community outreach program for Vedic education"
      },
      {
        "title": "Life Patron Services",
        "text": "Dedicated desk for the International Life Patron Program"
      }
    ]
  },
  {
    "slug": "iskcon-hubli",
    "name": "ISKCON Hubli",
    "city": "Hubballi",
    "state": "Karnataka",
    "region": "South India",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793687187029-1793687186748-ISKCONHubliTempleGardens.png",
    "headerRatio": 2.0,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-hubli-hero.jpg",
    "lat": 15.404799599999999,
    "lng": 75.0690017,
    "placeId": "ChIJ1URoF3DNuDsR9VZ0vWSF0sg",
    "rating": 4.6,
    "reviews": 3369,
    "overview": [
      "Located in Rayapur on the Hubli-Dharwad Road, ISKCON Hubli Temple is a serene spiritual oasis spanning 8 acres. The temple is the house of Sri Sri Radha Krishna and Sri Sri Krishna Balaram. It offers a peaceful atmosphere for darshan, kirtan and prasadam, a true blend of devotion and cultural heritage."
    ],
    "address": "Hubballi - Dharwad Rd, Rayapur, Dharwad, Hubballi, Karnataka 580009, India",
    "phone": "+91 88808 14384",
    "website": "iskconhubli.org",
    "hours": [
      "Morning 9:30 AM – 1:00 PM",
      "Afternoon 4:30 – 8:30 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Radha Govind Dev Ji",
        "text": "Sri Sri Radha Govind, the divine couple, are worshipped as the ultimate and supreme embodiment of divine love.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-hubli-d0.jpg"
      },
      {
        "name": "Sri Sri Krishna Balaram",
        "text": "The Lordships Sri Sri Krishna Balaram are worshipped as the supreme manifestation of protection, faith, and eternal brotherhood.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-hubli-d1.jpg"
      },
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-hubli-d2.jpg"
      },
      {
        "name": "Sri Sri Lakshmi Narasimha",
        "text": "Sri Sri Lakshmi Narasimha is worshipped as the divine protector of devotees, embodying the perfect balance of fierce justice and compassionate grace.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-hubli-d3.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-hubli-d4.jpg"
      }
    ],
    "features": [
      {
        "title": "Divine Darshan and Daily Aarti",
        "text": "Experience peaceful darshan with soulful aarti"
      },
      {
        "title": "Kirtan and Bhajan Experience",
        "text": "Immerse yourself in uplifting Hare Krishna Kirtans"
      },
      {
        "title": "Sunday Spiritual Retreat",
        "text": "Special Weekly experience"
      },
      {
        "title": "Spiritual Discourses",
        "text": "Timeless wisdom from Vedic Scriptures and books"
      },
      {
        "title": "Festivals and celebrations",
        "text": "Enjoy grand festival celebrations"
      },
      {
        "title": "Guest House Stay",
        "text": "Stay within the temple premises in peaceful surroundings"
      },
      {
        "title": "Youth and wellness programs",
        "text": "Participate in workshops like Yoga for Happiness"
      },
      {
        "title": "Gift shop",
        "text": "Explore a collection of devotional souvenirs"
      }
    ]
  },
  {
    "slug": "gokula-kshetram-vijayawada",
    "name": "Hare Krishna Gokula Kshetram",
    "city": "Vijayawada",
    "state": "Andhra Pradesh",
    "region": "South India",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793687261247-1793687260661-HareKrishnaGokulaKshetramTempleComplex.png",
    "headerRatio": 2.0,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-vijayawada-hero.jpg",
    "lat": 16.459623099999998,
    "lng": 80.6100172,
    "placeId": "ChIJb0dLdCnxNToRY3ClP78Kx7Y",
    "rating": 4.9,
    "reviews": 578,
    "overview": [
      "Hare Krishna Gokul Kshteram is the tallest Radha-Krishna Temple of Andhra Pradesh. Designed with unique architecture, intricate carvings, and lush gardens, the temple offers devotees a vibrant energy. By hosting several events and workshops, the temple also fosters a sense of unity among the people, day by day, making the society better."
    ],
    "address": "Survey No: 51 1B, Kunchanapalle, Mangalagiri, Kolanukonda, Andhra Pradesh 522302, India",
    "phone": "+91 73992 25533",
    "website": "hkmgokulakshetram.org",
    "hours": [
      "Morning 7:30 AM – 12:40 PM",
      "Evening 5:00 – 8:30 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Radha Krishnachandra",
        "text": "Sri Sri Radha Krishnachandra, the divine couple, are worshipped as the ultimate and supreme embodiment of divine love.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-vijayawada-d0.jpg"
      },
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-vijayawada-d1.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-vijayawada-d2.jpg"
      }
    ],
    "features": [
      {
        "title": "Darshan and Aarti",
        "text": "Powerful darshan of Sri Radha Krishna Chandra"
      },
      {
        "title": "Sankirtan and Bhajans",
        "text": "Participate in soulful Hare Krishna Kirtans"
      },
      {
        "title": "Narasimha Seva",
        "text": "Offer prayers and take part in dedicated rituals"
      },
      {
        "title": "Annadanam",
        "text": "Be part of the sacred tradition of distributing and honouring prasadam"
      },
      {
        "title": "Gita Classes",
        "text": "Engage in enlightening sessions based on Vedic wisdom"
      },
      {
        "title": "Festival celebrations",
        "text": "Celebrate major festivals like Narasimha Jayanti and Janmashtami"
      },
      {
        "title": "Meditation",
        "text": "Spend a peaceful time in chanting and meditation"
      },
      {
        "title": "Seva Opportunities",
        "text": "Contribute through various temple services"
      }
    ]
  },
  {
    "slug": "ahmedabad-bhadaj",
    "name": "Hare Krishna Mandir, Bhadaj, Ahmedabad",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "region": "West & Central India",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793687291369-1793687291037-HareKrishnaMandirReflectedinBlueWaters.png",
    "headerRatio": 2,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-ahmedabad-hero.jpg",
    "lat": 23.0982744,
    "lng": 72.4574921,
    "placeId": "ChIJkRlyALOdXjkR62v81o5SdOU",
    "rating": 4.7,
    "reviews": 7724,
    "overview": [
      "The Hare Krishna Mandir in Bhadaj is a sacred Hindu Temple dedicated to the Supreme Lord Krishna and located on Hare Krishna Mandir Rd, near Science City, Gujarat. Moreover, the temple has beautiful architecture and a spiritual atmosphere that offers devotees a path to connect with Krishna Consciousness."
    ],
    "address": "3FX4+5XG, Hare Krishna Mandir Rd, near Science City, Bhadaj, Gujarat 382722, India",
    "phone": "+91 92280 23235",
    "website": "harekrishnamandir.org",
    "hours": [
      "Morning 7:00 AM – 1:00 PM",
      "Afternoon 4:30 – 8:30 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Radha Madhav",
        "text": "The beautiful Sri Sri Radha Madhav, the eternal symbol of love and compassion, enchants the hearts of devotees with their sweet pastimes.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-ahmedabad-d0.jpg"
      },
      {
        "name": "Sri Sri Nitai Gauranaga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-ahmedabad-d1.jpg"
      },
      {
        "name": "Sri Lakshmi Narasimha Dev",
        "text": "Worshipped as the divine protector embodying fierce justice and compassionate grace.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-ahmedabad-d2.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-ahmedabad-d3.jpg"
      }
    ],
    "features": [
      {
        "title": "Grand Prayer Hall",
        "text": "Massive, air-conditioned Hall offering divine Darshan of Lordships"
      },
      {
        "title": "108-step Japa Path",
        "text": "A unique architectural feature, a dedicated path to chant the Hare Krishna Maha-mantra"
      },
      {
        "title": "Akshaya Patra Kitchen",
        "text": "One of the world’s largest automated kitchens"
      },
      {
        "title": "Nitya Annadan Hall",
        "text": "A dining facility that serves free lunch prasadam to every devotee"
      },
      {
        "title": "Goshala",
        "text": "A clean and well-maintained facility for cows"
      },
      {
        "title": "Vedic Museum",
        "text": "An interactive space featuring life-size exhibits"
      },
      {
        "title": "Matchless Gift Shop",
        "text": "Premium Souvenir shop selling high-quality spiritual products"
      },
      {
        "title": "Multi-media Theatre",
        "text": "Facility to show spiritual documentaries and host seminars"
      }
    ]
  },
  {
    "slug": "hindupur",
    "name": "Hare Krishna Movement Hindupur",
    "city": "Hindupur",
    "state": "Andhra Pradesh",
    "region": "South India",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793687394429-1793687394088-HareKrishnaHindupurTempleComplex.png",
    "headerRatio": 2.0,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-hindupur-hero.jpg",
    "lat": 13.822614699999999,
    "lng": 77.5046818,
    "placeId": "ChIJfbg9cgCjsTsRkeNsGQ9YG2c",
    "rating": 4.9,
    "reviews": 7,
    "overview": [
      "Hare Krishna Movement Hindupur is a spiritual and cultural centre serving the Hindupur–Anantapur region, with a strong focus on Vedic education and community outreach. Its distinctive initiatives include Gita Life sessions, Heritage Tours, and Anna Sri, which provides free nutritious meals to patients, attendants, and people in need."
    ],
    "address": "Siri Shine Apartment, near SBI Bank, D.B. Colony, Lakshmipuram, Hindupuram, Andhra Pradesh 515201, India",
    "phone": "+91 63643 03541",
    "website": "hkmhindupur.org",
    "hours": [
      "Morning 7:00 AM – 1:00 PM",
      "Evening 5:00 – 8:00 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Radha Krishna",
        "text": "Sri Sri Radha Krishna, the divine couple, are worshipped as the ultimate and supreme embodiment of divine love.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-hindupur-d0.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Worshipped as the Founder Acharya of the Hare Krishna Movement, guiding millions toward bhakti and enlightenment.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-hindupur-d1.jpg"
      }
    ],
    "features": [
      {
        "title": "Gita Life",
        "text": "Explore the Bhagavad Gita through two-hour sessions that connect its teachings with everyday life."
      },
      {
        "title": "FOLK Youth Programs",
        "text": "Join personality-enrichment programs that use Vedic wisdom to address challenges faced by today's youth."
      },
      {
        "title": "Anna Sri Seva",
        "text": "Support the distribution of free, hygienic and nutritious meals to patients, attendants, and people in need."
      },
      {
        "title": "Heritage Tours",
        "text": "Discover India's spiritual heritage through curated visits to sacred cities, temples, and pilgrimage destinations."
      },
      {
        "title": "Sunday Gurukul",
        "text": "Introduce children to Vedic culture through shloka learning, mantra chanting, Gita classes, and value-based activities."
      },
      {
        "title": "Gita for Kids",
        "text": "Help young learners explore the teachings of the Gita through weekly classes, stories, and cultural learning."
      },
      {
        "title": "Home Satsang",
        "text": "Bring devotional association into homes through Gita Satsangs and Krishna Sankirtans."
      },
      {
        "title": "Village Sankirtan",
        "text": "Invite the centre to conduct Sankirtan and Gita Pravachan in villages, taking spiritual learning beyond the centre."
      }
    ]
  },
  {
    "slug": "golden-temple-hyderabad",
    "name": "Hare Krishna Golden Temple",
    "city": "Hyderabad",
    "state": "Telangana",
    "region": "South India",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793687421630-1793687420988-GoldenLotusTempleinBloom.png",
    "headerRatio": 2.0,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-golden-temple-hero.jpg",
    "lat": 17.4105988,
    "lng": 78.43017909999999,
    "placeId": "ChIJPWKxiCeXyzsRnmRcr9D_MAM",
    "rating": 4.8,
    "reviews": 11265,
    "overview": [
      "The Hare Krishna Golden Temple, located in Banjara Hills, Hyderabad, is a prominent ISKCON Centre known for its striking golden-colored architecture and spiritual ambience, with the presiding deities of Sri Radha and Krishna. The temple’s quiet ambience, enchanting devotional chanting and spiritual living are truly mesmerising and something extraordinary to witness."
    ],
    "address": "svr school, NBT Nagar Rd, near Anti Corruption Bureau office, NBT Nagar, Banjara Hills, Hyderabad, Telangana 500028, India",
    "phone": "+91 95056 88881",
    "website": "hkmhyderabad.org",
    "hours": [
      "Morning 7:30 AM – 12:00 PM",
      "Evening 5:15 – 8:20 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Radha Govinda",
        "text": "The beautiful form of Radha Govind, the eternal symbol of love and compassion, enchants the hearts of devotees with their sweet pastimes.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-golden-temple-d0.jpg"
      },
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-golden-temple-d1.jpg"
      },
      {
        "name": "Swayambhu Sri Lakshmi Narasimha Swamy",
        "text": "Two-armed self-manifested deity reflecting the Lord Narasimha and Goddess Lakshmi symbolising divine protection, mercy and abundance.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-golden-temple-d2.jpg"
      },
      {
        "name": "Sri Japa Anjaneya Swamy",
        "text": "The shrine is dedicated to Lord Hanuman, showcasing courage, strength and devotion, often worshipped for success and protection.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-golden-temple-d3.jpg"
      },
      {
        "name": "Sri Garuda",
        "text": "Sri Garuda is worshipped as the eternal carrier of Lord Vishnu, symbolizing power, speed, and unwavering loyalty.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-golden-temple-d4.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-golden-temple-d5.jpg"
      }
    ],
    "features": [
      {
        "title": "Darshan and Aarti",
        "text": "Powerful darshan of Sri Lakshmi Narasimha Swamy"
      },
      {
        "title": "Sankirtan and Bhajans",
        "text": "Participate in soulful Hare Krishna Kirtans"
      },
      {
        "title": "Narasimha Seva",
        "text": "Offer prayers and take part in dedicated rituals"
      },
      {
        "title": "Annadanam",
        "text": "Be part of the sacred tradition of distributing and honouring prasadam"
      },
      {
        "title": "Gita Classes",
        "text": "Engage in enlightening sessions based on Vedic wisdom"
      },
      {
        "title": "Festival celebrations",
        "text": "Celebrate major festivals like Narasimha Jayanti and Janmashtami"
      },
      {
        "title": "Meditation",
        "text": "Spend a peaceful time in chanting and meditation"
      },
      {
        "title": "Seva Opportunities",
        "text": "Contribute through various temple services"
      }
    ]
  },
  {
    "slug": "dakshina-dwaraka-dham-chennai",
    "name": "Dakshina Dwaraka Dham, Chennai",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "region": "South India",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793687544046-1793687543727-DakshinaDwarakaDhamTempleCampus.png",
    "headerRatio": 2.0,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/dakshina-dwaraka-dham-chennai-hero.jpg",
    "lat": 12.9825156,
    "lng": 80.26713869999999,
    "placeId": "ChIJdb3lXVBdUjoRVgiiC8UptUM",
    "rating": 4.6,
    "reviews": 1127,
    "overview": [
      "Dakshina Dwaraka Dham, is located on Tiruvanmiyur Beach and is popular for its unique architecture and beautiful deities. In addition, from temple worship to youth outreach programs, all initiatives reflect the temple's dedication to spreading Vedic wisdom and compassion in society."
    ],
    "address": "63, 1st Seaward Rd, Valmiki Nagar, Thiruvanmiyur, Chennai, Tamil Nadu 600041, India",
    "phone": "+91 97890 57101",
    "website": "hkmchennai.org",
    "hours": [
      "Morning 4:30 AM – 1:00 PM",
      "Afternoon 4:15 – 8:15 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Krishna Rukmini Satyabhama",
        "text": "Lord Krishna, with his queens, Rukmini and Satyabama, stands as the King of Dwarka in the temple.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/dakshina-dwaraka-dham-chennai-d0.jpg"
      },
      {
        "name": "Sri Sri Nitai Gauranaga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/dakshina-dwaraka-dham-chennai-d1.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/dakshina-dwaraka-dham-chennai-d2.jpg"
      }
    ],
    "features": [
      {
        "title": "Prayer Hall and Darshan",
        "text": "Large, air-conditioned hall to avail the blessings of the Lordships"
      },
      {
        "title": "Daily Prasadam",
        "text": "Free sattvik food distribution to devotees"
      },
      {
        "title": "Spiritual Bookstore",
        "text": "A dedicated area for selling sacred Vedic scriptures"
      },
      {
        "title": "Japa and Meditation Area",
        "text": "Quiet corners within the temple for Mantra Meditation"
      },
      {
        "title": "Sunday Love Fest",
        "text": "Weekly grand program with special kirtan and prasadam feast."
      },
      {
        "title": "Value Education for Children",
        "text": "Regular Prahald school is held on weekends"
      },
      {
        "title": "Youth Programs (FOLK)",
        "text": "Dedicated sessions for students and professionals"
      },
      {
        "title": "Vedic Library",
        "text": "Collection of historical texts and archives"
      }
    ]
  },
  {
    "slug": "ballari",
    "name": "Hare Krishna Movement, Ballari",
    "city": "Ballari",
    "state": "Karnataka",
    "region": "South India",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793687655488-1793687655148-HareKrishnaTempleinBallari.png",
    "headerRatio": 2.0,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-ballari-hero.jpg",
    "lat": 15.162288499999999,
    "lng": 76.9361079,
    "placeId": "ChIJk7qkbHIRtzsRJ6DaihQtUXM",
    "rating": 4.4,
    "reviews": 89,
    "overview": [
      "The Hare Krishna Movement in Ballari is a vibrant spiritual centre located in the Gandhinagar area. Inspired by the teachings of Srila Prabhupada, the temple promotes spiritual well-being through regular chanting and Vedic learning. It also focuses on serving the local community with compassion and care."
    ],
    "address": "Kappagal Rd, near Brahmaiaah Temple, Beechi Nagar, Gandhi Nagar, Ballari, Karnataka 583103, India",
    "phone": null,
    "website": null,
    "hours": [
      "Morning 5:00 AM – 12:00 PM",
      "Afternoon 4:30 – 8:00 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Radha Krishna",
        "text": "Sri Sri Radha Krishna, the divine couple, are worshipped as the ultimate and supreme embodiment of divine love.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-ballari-d0.jpg"
      },
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-ballari-d1.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-ballari-d2.jpg"
      }
    ],
    "features": [
      {
        "title": "Darshan and Prayer Hall",
        "text": "Experience peaceful darshan with soulful aarti"
      },
      {
        "title": "Kirtan and Bhajan Experience",
        "text": "Immerse yourself in uplifting Hare Krishna Kirtans"
      },
      {
        "title": "Sunday Spiritual Retreat",
        "text": "Special Weekly experience"
      },
      {
        "title": "Spiritual Discourses",
        "text": "Timeless wisdom from Vedic Scriptures and books"
      },
      {
        "title": "Festivals and celebrations",
        "text": "Enjoy grand festival celebrations"
      },
      {
        "title": "Seva Opportunities",
        "text": "Contribute through Annadaan and Gauseva"
      },
      {
        "title": "Youth and wellness programs",
        "text": "Participate in workshops like Yoga for Happiness"
      },
      {
        "title": "Matchless Gift Shop",
        "text": "Explore a collection of devotional souvenirs"
      }
    ]
  },
  {
    "slug": "jodhpur",
    "name": "Hare Krishna Mandir Jodhpur",
    "city": "Jodhpur",
    "state": "Rajasthan",
    "region": "North India",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793687679566-1793687678923-HareKrishnaMandirJodhpurVEVENT.png",
    "headerRatio": 2,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-jodhpur-hero.jpg",
    "lat": 26.471212599999998,
    "lng": 73.12059250000001,
    "placeId": "ChIJx5PZeFzrQTkR9MPoLv8Mn-8",
    "rating": 4.9,
    "reviews": 56,
    "overview": [
      "Hare Krishna Mandir, Jodhpur, is a spiritual and cultural centre dedicated to spreading Krishna consciousness through deity darshan, Harinam Sankirtan, spiritual discourses, and devotional programs. With its vibrant kirtan experiences, Vedic teachings, festivals, and prasadam services, the temple offers devotees and visitors a space to experience spiritual learning and devotion."
    ],
    "address": "Hare Krishna Road, Behind ITC Welcome Road, Soder Ki Dhani, Nandra, Jodhpur, Rajasthan – 342015",
    "phone": null,
    "website": null,
    "hours": [
      "Morning 4:30 AM – 10:55 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-jodhpur-d0.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-jodhpur-d1.jpg"
      }
    ],
    "features": [
      {
        "title": "Sankirtan Hall",
        "text": "Immerse yourself in the blissful chanting of the Hare Krishna Mahamantra in the vibrant Sankirtan Hall."
      },
      {
        "title": "Sri Sri Gaura Nitai Darshan",
        "text": "Receive the divine blessings of Sri Sri Gaura Nitai and experience peaceful devotional darshan."
      },
      {
        "title": "Vedic Wisdom & Discourses",
        "text": "Explore the teachings of Bhagavad Gita and Srimad Bhagavatam through spiritual discussions."
      },
      {
        "title": "Sadhu Sanga & Spiritual Gatherings",
        "text": "Participate in devotional association, kirtans, and uplifting spiritual conversations."
      },
      {
        "title": "Festival Celebrations",
        "text": "Celebrate grand Vaishnava festivals with devotion, kirtan, and cultural programs."
      },
      {
        "title": "FOLK Youth Programs",
        "text": "Engage in youth-focused programs designed to inspire spiritual growth and values."
      },
      {
        "title": "Prasadam Experience",
        "text": "Honour delicious sanctified food and participate in prasadam services."
      },
      {
        "title": "Seva Opportunities",
        "text": "Participate in devotional service and contribute towards community initiatives."
      }
    ]
  },
  {
    "slug": "pune",
    "name": "Hare Krishna Movement, Pune",
    "city": "Pune",
    "state": "Maharashtra",
    "region": "West & Central India",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793687757751-1793687757399-IlluminatedHareKrishnaTemplePune.png",
    "headerRatio": 2.0,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-pune-hero.jpg",
    "lat": 18.548890099999998,
    "lng": 73.8132059,
    "placeId": "ChIJLVDRH8-_wjsRC_RjRNarFHc",
    "rating": 4.8,
    "reviews": 118,
    "overview": [
      "Hare Krishna Mandir, Pune, is a scenic place surrounded by mountains, offering a peaceful environment for devotees to practise spirituality and culture. Located on Baner Road, the temple is nature-centric, making it unique and ideal for visitors seeking to connect with the Lord through its natural surroundings."
    ],
    "address": "3, Baner Rd, Ward No. 8, Sadhu Vasvani Nagar, Aundh, Pune, Maharashtra 411007, India",
    "phone": "+91 96639 22433",
    "website": "hkmpune.org",
    "hours": [
      "Morning 7:00 AM – 1:00 PM",
      "Afternoon 4:30 – 8:30 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Nitai Gauranaga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-pune-d0.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-pune-d1.jpg"
      }
    ],
    "features": [
      {
        "title": "Hari-nama Mantapa",
        "text": "Sacred chanting hall"
      },
      {
        "title": "Annadana Hall",
        "text": "Free meal distribution"
      },
      {
        "title": "Book Distribution",
        "text": "Spiritual literature"
      },
      {
        "title": "Goshala",
        "text": "Cow protection facility"
      },
      {
        "title": "Cow protection facility",
        "text": "Vegetarian dining"
      },
      {
        "title": "Guest House",
        "text": "Comfortable stay"
      },
      {
        "title": "Cultural Exhibitions",
        "text": "Art and heritage"
      },
      {
        "title": "Prasadam Counters",
        "text": "Divine offerings"
      }
    ]
  },
  {
    "slug": "nandgram-dham-kota",
    "name": "Nandgram Dham, Kota",
    "city": "Kota",
    "state": "Rajasthan",
    "region": "North India",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793687787612-1793687787232-NandgramDhamTempleatNight.png",
    "headerRatio": 1.5,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-kota-hero.jpg",
    "lat": 25.111022799999997,
    "lng": 75.81958039999999,
    "placeId": "ChIJow-DS2SEbzkR7oSrx5WQBd0",
    "rating": 4.7,
    "reviews": 1115,
    "overview": [
      "Formerly known as Hare Krishna Mandir Kota, a retreat inspired by the sacred land of Nandgaon, where Lord Krishna spent his childhood. Nandgram Dham is a spiritual and cultural complex located on Mukundra Vihar on (NH-27), famous for its timeless wisdom. The temple is on a mission to spread Vedic culture in society."
    ],
    "address": "Mukundra Vihar, Hare Krishna Marg, Kota, Anandpura at, Rajasthan 324005, India",
    "phone": "+91 97998 74000",
    "website": "nandgramdham.org",
    "hours": [
      "Morning 4:30 AM – 1:00 PM",
      "Afternoon 4:30 – 8:45 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Gaur Nitai",
        "text": "Divine incarnations of Radha Krishna and Balaram who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-kota-d0.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-kota-d1.jpg"
      }
    ],
    "features": [
      {
        "title": "Sunday Feast and Prasadam Distribution",
        "text": "Grand weekly feast with delicious sattvic prasadam"
      },
      {
        "title": "Youth Programs",
        "text": "Regular Saturday and Sunday youth sessions"
      },
      {
        "title": "Yoga for Happiness",
        "text": "Special Yoga sessions with meditation and physical wellness"
      },
      {
        "title": "Bhagavad Gita Classes",
        "text": "Regular discourses and online sessions"
      },
      {
        "title": "Mantra Meditation and Japa sessions",
        "text": "Guided Hare Krishna chanting and japa programs"
      },
      {
        "title": "Cultural and family programs",
        "text": "Evening family-oriented programs"
      },
      {
        "title": "Annadaan Seva",
        "text": "Continuous charitable service to devotees"
      },
      {
        "title": "Festival celebrations",
        "text": "Grand celebrations of all major Vaishnav festivals"
      }
    ]
  },
  {
    "slug": "guwahati",
    "name": "Hare Krishna Movement, Guwahati",
    "city": "Guwahati",
    "state": "Assam",
    "region": "East & Northeast India",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793688943731-1793688943396-HareKrishnaMandirGuwahati.png",
    "headerRatio": 1.457,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-guwahati-hero.jpg",
    "lat": 26.2051369,
    "lng": 91.6955237,
    "placeId": "ChIJaxVVySZbWjcRCEUWK53Qf7M",
    "rating": 4.8,
    "reviews": 2285,
    "overview": [
      "Hare Krishna Mandir, Guwahati, is a spiritual place aimed at improving society on a large scale through various humanitarian and social initiatives. Formerly inaugurated on 15th March 2021, the temple runs several holistic programs leading the general public towards a better path."
    ],
    "address": "Hare Krishna Mandir Marg, IIT Guwahati, Ghora Jan, Guwahati, Assam 781031, India",
    "phone": "+91 70990 39770",
    "website": "hkmguwahati.org",
    "hours": [
      "Morning 4:00 AM – 1:00 PM",
      "Afternoon 4:00 – 8:00 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Radha Shyamsundar",
        "text": "The beautiful form of Radha Shyamsundar, the eternal symbol of love and compassion, enchants the hearts of devotees with their sweet pastimes.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-guwahati-d0.jpg"
      },
      {
        "name": "Sri Sri Jagannath Baladev Subhadra",
        "text": "Lord of the Universe Jagannatha offered blessed darshan with Lord Balaram and his sister Subhadra.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-guwahati-d1.jpg"
      },
      {
        "name": "Sri Sri Nitai Gauranaga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-guwahati-d2.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-guwahati-d3.jpg"
      }
    ],
    "features": [
      {
        "title": "Prayer Hall and Darshan",
        "text": "Large, air-conditioned hall to avail the blessings of the Lordships"
      },
      {
        "title": "Daily Prasadam",
        "text": "Free sattvik food distribution to devotees"
      },
      {
        "title": "Spiritual Bookstore",
        "text": "A dedicated area for selling sacred Vedic scriptures"
      },
      {
        "title": "Japa and Meditation Area",
        "text": "Quiet corners within the temple for Mantra Meditation"
      },
      {
        "title": "Sunday Love Fest",
        "text": "Weekly grand program with special kirtan and prasadam feast."
      },
      {
        "title": "Value Education for Children",
        "text": "Regular Gopal Kidz school is held on weekends"
      },
      {
        "title": "Youth Programs (FOLK",
        "text": "Dedicated sessions for students and professionals"
      },
      {
        "title": "Scenic Hilltop View",
        "text": "Brahmaputra riverside atmosphere"
      }
    ]
  },
  {
    "slug": "marwar-mandir-jodhpur",
    "name": "Hare Krishna Marwar Mandir Jodhpur",
    "city": "Jodhpur",
    "state": "Rajasthan",
    "region": "North India",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793688742366-1793688741678-IlluminatedHareKrishnaMarwarMandirPoster.png",
    "headerRatio": 1.5,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-marwar-mandir-hero.jpg",
    "lat": 26.259643399999998,
    "lng": 72.937489,
    "placeId": "ChIJaeFrJgCPQTkR7Etda0JXoJw",
    "rating": 4.3,
    "reviews": 10,
    "overview": [
      "Hare Krishna Marwar Mandir is a spiritual centre of Hare Krishna Movement Jodhpur, created to nurture devotion to Lord Krishna and offer a peaceful space for worship, spiritual learning and community gatherings in the Marwar region."
    ],
    "address": "Near, Gopal Bari, Jodhpur, Rajasthan 342024, India",
    "phone": "+91 99299 45107",
    "website": "hkmjodhpur.org",
    "hours": [
      "Morning 7:00 AM – 10:00 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-marwar-mandir-d0.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-marwar-mandir-d1.jpg"
      }
    ],
    "features": [
      {
        "title": "Deity Darshan",
        "text": "Daily darshan and aarti offer devotees a peaceful opportunity for worship and spiritual connection."
      },
      {
        "title": "Bhagavad Gita Classes",
        "text": "Weekly Bhagavad Gita sessions focus on spiritual understanding and practical application in daily life."
      },
      {
        "title": "Evening Kirtan",
        "text": "Daily congregational kirtan brings devotees together for chanting the Holy Names."
      },
      {
        "title": "Youth Programs",
        "text": "Regular youth programs provide value-based guidance and spiritual learning for young participants."
      },
      {
        "title": "Anna Daan Seva",
        "text": "The temple serves sanctified prasadam and has distributed more than 1.5 lakh meals through its community initiatives."
      },
      {
        "title": "Gau Seva",
        "text": "Cow protection and daily care are an important part of the temple’s seva activities, supported through its Gau Shala."
      },
      {
        "title": "Ekadashi Celebrations",
        "text": "Ekadashi is observed twice every month with fasting, kirtan and spiritual discourse."
      },
      {
        "title": "Festivals & Celebrations",
        "text": "Major Vaishnava festivals and devotional programs are celebrated through kirtan, prasadam and congregational participation."
      }
    ]
  },
  {
    "slug": "tirupati",
    "name": "Hare Krishna Movement, Tirupati",
    "city": "Tirupati",
    "state": "Andhra Pradesh",
    "region": "South India",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793688983320-1793688982857-VibrantHareKrishnaTempleTirupati.png",
    "headerRatio": 1.457,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-tirupati-hero.jpg",
    "lat": 13.653016399999998,
    "lng": 79.42104040000001,
    "placeId": "ChIJMzN-MJpLTToRN0EmvwW0mZM",
    "rating": 4.7,
    "reviews": 89,
    "overview": [
      "Hare Krishna Mandir, Tirupati, is widely recognised for its focus on uplifting society and helping through various humanitarian efforts. Moreover, the temple is the house of deities like Sri Sri Radha Shyamsundar, accompanied by Lalita and Vishaka. The temple meditation space offers a quiet, unique corner for devotees to feel a true connection with the lord and remain in his shelter for a lifetime."
    ],
    "address": "SH 61, Srinivasa Nagar, Ramchandra Nagar, Tirupati, Andhra Pradesh 517507, India",
    "phone": "+91 62811 11822",
    "website": "hkmtirupati.org",
    "hours": [
      "Morning 7:30 AM – 12:30 PM",
      "Afternoon 4:30 – 8:00 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Radha Shyamsundar",
        "text": "Sri Sri Radhashyamsundar, the divine couple, are worshipped as the ultimate and supreme embodiment of divine love.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-tirupati-d0.jpg"
      },
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-tirupati-d1.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-tirupati-d2.jpg"
      }
    ],
    "features": [
      {
        "title": "Divine Darshan and Daily Aarti",
        "text": "Experience peaceful darshan with soulful aarti"
      },
      {
        "title": "Kirtan and Bhajan Experience",
        "text": "Immerse yourself in uplifting Hare Krishna Kirtans"
      },
      {
        "title": "Sunday Spiritual Retreat",
        "text": "Special Weekly experience"
      },
      {
        "title": "Spiritual Discourses",
        "text": "Timeless wisdom from Vedic Scriptures and books"
      },
      {
        "title": "Festivals and celebrations",
        "text": "Enjoy grand festival celebrations"
      },
      {
        "title": "Guest House Stay",
        "text": "Stay within the temple premises in peaceful surroundings"
      },
      {
        "title": "Youth and wellness programs",
        "text": "Participate in workshops like Yoga for Happiness"
      },
      {
        "title": "Gift shop",
        "text": "Explore a collection of devotional souvenirs"
      }
    ]
  },
  {
    "slug": "iskcon-whitefield",
    "name": "ISKCON Whitefield",
    "city": "Bengaluru",
    "state": "Karnataka",
    "region": "South India",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793689142498-1793689141930-ISKCONWhitefieldTempleinDaylight.png",
    "headerRatio": 1.5,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-hare-krishna-dham-whitefield-hero.jpg",
    "lat": 12.919076299999999,
    "lng": 77.751381,
    "placeId": "ChIJ0YXBalINrjsRdaY05BZQTJ4",
    "rating": 4.0,
    "reviews": 23,
    "overview": [
      "ISKCON Hare Krishna Dham Whitefield is a spiritual and cultural centre of ISKCON Bangalore, offering worship, kirtan, Bhagavad-gita programmes, children’s activities and major Vaishnava festival celebrations. The centre also supports regular community engagement and devotional learning for devotees in Whitefield."
    ],
    "address": "Gunjur - Mugalur Rd, Halasahalli Thippasandra, Bengaluru, Karnataka 560087, India",
    "phone": "+91 63669 91519",
    "website": null,
    "hours": [],
    "deities": [
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-hare-krishna-dham-whitefield-d0.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-hare-krishna-dham-whitefield-d1.jpg"
      }
    ],
    "features": [
      {
        "title": "Gita Essentials",
        "text": "Learn the essence of all 18 chapters of the Bhagavad-gita through structured sessions, practical life lessons, discussions, meditation and kirtan."
      },
      {
        "title": "Mantra Meditation",
        "text": "Participate in guided Hare Krishna Mahamantra meditation sessions designed to introduce participants to the practice of mantra meditation and Krishna consciousness."
      },
      {
        "title": "DIVYAM Sacred Chants",
        "text": "A guided chanting programme for children and adults that teaches Bhagavad-gita verses, foundational prayers and Vedic chants with proper pronunciation and meaning."
      },
      {
        "title": "Indian Culture & Values for Kids",
        "text": "Children can learn about Indian culture, spiritual values and character building through teachings and stories from the Bhagavad-gita, Ramayana and Mahabharata."
      },
      {
        "title": "Spiritual Workshops",
        "text": "The centre conducts interactive spiritual-learning programmes such as Path of Perfection, helping participants understand and apply principles of Krishna consciousness in daily life."
      },
      {
        "title": "Kirtan & Sankirtan",
        "text": "Join congregational Hare Krishna chanting and uplifting kirtans, an important part of the centre’s regular spiritual and community programmes."
      },
      {
        "title": "Community Satsangs",
        "text": "Hare Krishna Dham conducts Bhagavad-gita sessions and spiritual gatherings across its Whitefield preaching centres, making regular devotional association accessible to local communities."
      },
      {
        "title": "Seva & Volunteering",
        "text": "Devotees can participate in voluntary devotional service, including welcoming visitors, prasadam service, event support and other forms of seva organised by Hare Krishna Dham Whitefield."
      }
    ]
  },
  {
    "slug": "gurugram",
    "name": "Hare Krishna Mandir Gurugram",
    "city": "Gurugram",
    "state": "Haryana",
    "region": "North India",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793689176375-1793689175942-HareKrishnaMandirGurugram.png",
    "headerRatio": 1.5,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-gurugram-hero.jpg",
    "lat": 28.4619438,
    "lng": 77.09041069999999,
    "placeId": "ChIJXzeQT2EZDTkREVUV4DeI1jA",
    "rating": 4.7,
    "reviews": 125,
    "overview": [
      "Hare Krishna Mandir, Gurugram, a satellite centre of Vrindavan Chandrodaya Mandir, is a spiritual centre dedicated to spreading Krishna consciousness through soulful kirtans, Bhagavad Gita teachings, spiritual discourses, and devotional programs. The temple provides a peaceful space for devotees and visitors to experience Vedic culture and deepen their connection with the Lord."
    ],
    "address": "102P, DLF Phase 5, Sector 43, Gurugram, Haryana 122009, India",
    "phone": "+91 72108 73108",
    "website": "hkmgurugram.org",
    "hours": [
      "Morning 4:30 AM – 12:30 PM",
      "Afternoon 4:00 – 8:00 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-gurugram-d0.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-gurugram-d1.jpg"
      }
    ],
    "features": [
      {
        "title": "Darshan & Aarti",
        "text": "Experience peaceful darshan and participate in daily devotional ceremonies."
      },
      {
        "title": "Harinam Sankirtan",
        "text": "Immerse yourself in blissful Hare Krishna kirtans and devotional chanting."
      },
      {
        "title": "Sunday Satsang",
        "text": "Join weekly spiritual gatherings with kirtan, discussions, and devotional activities."
      },
      {
        "title": "Bhagavad Gita Classes",
        "text": "Learn timeless spiritual wisdom through Vedic scriptures and teachings."
      },
      {
        "title": "Festival Celebrations",
        "text": "Celebrate grand Vaishnava festivals with devotion, kirtan, and cultural programs."
      },
      {
        "title": "Home Sankirtan",
        "text": "Participate in devotional gatherings and bring the joy of Krishna consciousness into homes."
      },
      {
        "title": "Youth Spiritual Programs",
        "text": "Engage in programs designed to inspire youth through spiritual knowledge and values."
      },
      {
        "title": "Seva Opportunities",
        "text": "Contribute through devotional service and community initiatives."
      }
    ]
  },
  {
    "slug": "mumbai",
    "name": "Hare Krishna Movement, Mumbai",
    "city": "Mumbai",
    "state": "Maharashtra",
    "region": "West & Central India",
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mumbai-hero.jpg",
    "lat": 19.1222054,
    "lng": 72.9178585,
    "placeId": "ChIJP4awdX7H5zsR0QQtank9-Fo",
    "rating": 5.0,
    "reviews": 47,
    "overview": [
      "The Hare Krishna Movement in Mumbai is a spiritual haven dedicated to preserving Vedic wisdom within Mumbai's modern lifestyle. Operating through different centres, this place organises soulful kirtan sessions, transformative FOLK youth programs and spiritual discourses. In addition, the movement is very popular for its Food for Life initiatives, which uplift society and eradicate hunger."
    ],
    "address": "D-401, GHP, Trinity Housing Society, near Hiranandani Hospital Road, Gautam Nagar, Ramabai Ambedkar Nagar, Powai, Mumbai, Maharashtra 400076, India",
    "phone": "+91 89763 82249",
    "website": "hkmmumbai.org",
    "hours": [
      "Open 24 hours"
    ],
    "deities": [
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mumbai-d0.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mumbai-d1.jpg"
      }
    ],
    "features": [
      {
        "title": "Darshan and Prayer Hall",
        "text": "Experience peaceful darshan with soulful aarti"
      },
      {
        "title": "Kirtan and Bhajan Experience",
        "text": "Immerse yourself in uplifting Hare Krishna Kirtans"
      },
      {
        "title": "Sunday Spiritual Retreat",
        "text": "Special Weekly experience"
      },
      {
        "title": "Spiritual Discourses",
        "text": "Timeless wisdom from Vedic Scriptures and books"
      },
      {
        "title": "Festivals and celebrations",
        "text": "Enjoy grand festival celebrations"
      },
      {
        "title": "Seva Opportunities",
        "text": "Contribute through Annadaan and Gauseva"
      },
      {
        "title": "Youth and wellness programs",
        "text": "Participate in workshops like Yoga for Happiness"
      },
      {
        "title": "Gift Shop",
        "text": "Explore a collection of devotional souvenirs"
      }
    ]
  },
  {
    "slug": "puri",
    "name": "Hare Krishna Movement, Puri",
    "city": "Puri",
    "state": "Odisha",
    "region": "East & Northeast India",
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-puri-hero.jpg",
    "lat": null,
    "lng": null,
    "placeId": null,
    "rating": null,
    "reviews": null,
    "overview": [
      "Hare Krishna Movement (HKM) Puri is a spiritual retreat in the Holy city of Sipasurubilli. House of Sri Sri Radha Madhav and Sri Nitai Gauranga, the temple emphasises Vedic wisdom and massive social welfare activities."
    ],
    "address": null,
    "phone": null,
    "website": null,
    "hours": [],
    "deities": [
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-puri-d0.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-puri-d1.jpg"
      }
    ],
    "features": [
      {
        "title": "Darshan and Prayer Hall",
        "text": "Experience peaceful darshan with soulful aarti"
      },
      {
        "title": "Kirtan and Bhajan Experience",
        "text": "Immerse yourself in uplifting Hare Krishna Kirtans"
      },
      {
        "title": "Sunday Spiritual Retreat",
        "text": "Special Weekly experience"
      },
      {
        "title": "Spiritual Discourses",
        "text": "Timeless wisdom from Vedic Scriptures and books"
      },
      {
        "title": "Festivals and celebrations",
        "text": "Enjoy grand festival celebrations"
      },
      {
        "title": "Seva Opportunities",
        "text": "Contribute through Annadaan and Gauseva"
      },
      {
        "title": "Youth and wellness programs",
        "text": "Participate in workshops like Yoga for Happiness"
      },
      {
        "title": "Matchless Gift Shop",
        "text": "Explore a collection of devotional souvenirs"
      }
    ]
  },
  {
    "slug": "bhilai",
    "name": "Hare Krishna Movement, Bhilai",
    "city": "Bhilai",
    "state": "Chhattisgarh",
    "region": "West & Central India",
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-bhilai-hero.jpg",
    "lat": 21.1920891,
    "lng": 81.34325000000001,
    "placeId": "ChIJAQAAAC0jKToRJuEoBqE9lW0",
    "rating": 4.8,
    "reviews": 427,
    "overview": [
      "Hare Krishna Movement (HKM) Bhilai, also referred to as ISKCON Bhilai, is a spiritual complex dedicated to the mission of Srila Prabhupada. Located on the Akshaya Patra Campus, the temple is described as a spiritual oasis, with a peaceful environment and a vibrant devotional atmosphere."
    ],
    "address": "ISKCON Temple, Akshaya Patra Campus, State Bank Colony, Sector 6, Bhilai, Chhattisgarh",
    "phone": null,
    "website": "iskconbhilai.org",
    "hours": [
      "Morning 7:30 AM – 12:30 PM",
      "Afternoon 4:00 – 8:20 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Radha Krishna Chandra",
        "text": "Sri Sri Radha Krishna Chandra, the divine couple, are worshipped as the ultimate and supreme embodiment of divine love.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-bhilai-d0.jpg"
      },
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-bhilai-d1.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Worshipped as the Founder Acharya of the Hare Krishna Movement, guiding millions toward bhakti and enlightenment.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-bhilai-d2.jpg"
      }
    ],
    "features": [
      {
        "title": "Divine Darshan and Daily Aarti",
        "text": "Experience peaceful darshan with soulful aarti"
      },
      {
        "title": "Kirtan and Bhajan Experience",
        "text": "Immerse yourself in uplifting Hare Krishna Kirtans"
      },
      {
        "title": "Sunday Spiritual Retreat",
        "text": "Special Weekly experience"
      },
      {
        "title": "Spiritual Discourses",
        "text": "Timeless wisdom from Vedic Scriptures and books"
      },
      {
        "title": "Festivals and celebrations",
        "text": "Enjoy grand festival celebrations"
      },
      {
        "title": "Seva Opportunities",
        "text": "Contribute through various temple services"
      },
      {
        "title": "Youth and wellness programs",
        "text": "Participate in workshops like Yoga for Happiness"
      },
      {
        "title": "Matchless Gift Shop",
        "text": "Explore a collection of devotional souvenirs"
      }
    ]
  },
  {
    "slug": "iskcon-mangalore",
    "name": "ISKCON Mangalore",
    "city": "Mangaluru",
    "state": "Karnataka",
    "region": "South India",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793690393430-1793690393096-ISKCONMangaloreTempleGardens.png",
    "headerRatio": 1.577,
    "cardImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793690393430-1793690393096-ISKCONMangaloreTempleGardens.png",
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-mangalore-hero.jpg",
    "lat": 12.877467,
    "lng": 74.83870270000001,
    "placeId": "ChIJ1Yn29TdaozsR7ui1wgZrt9U",
    "rating": 4.7,
    "reviews": 367,
    "overview": [
      "ISKCON Sri Sri Krishna Balaram Temple in Mangalore is located on PVS Kalkakunja, Off MG Road, Mangalore, Karnataka. Founded in 2002, the temple houses the deities of Lord Krishnam, Lord Balarama, Lord Chaitanya and Lord Nityananda. Moreover, with its peaceful architecture, the temple focuses on improving society by offering happiness, good health, and peace of mind to all devotees."
    ],
    "address": "PVS Kalakunj Rd, Kodailbail, Mangaluru, Karnataka 575003, India",
    "phone": "+91 96861 07444",
    "website": "iskconmangalore.org",
    "hours": [
      "Morning 4:30 AM – 1:00 PM",
      "Afternoon 4:15 – 8:15 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Krishna Balaram",
        "text": "The Lordships Sri Sri Krishna Balaram are worshipped as the supreme manifestation of protection, faith, and eternal brotherhood.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-mangalore-d0.jpg"
      },
      {
        "name": "Sri Sri Nitai Gauranaga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-mangalore-d1.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/iskcon-mangalore-d2.jpg"
      }
    ],
    "features": [
      {
        "title": "Prayer Hall and Darshan",
        "text": "Large, air-conditioned hall to avail the blessings of the Lordships"
      },
      {
        "title": "Daily Prasadam",
        "text": "Free sattvik food distribution to devotees"
      },
      {
        "title": "Spiritual Bookstore",
        "text": "A dedicated area for selling sacred Vedic scriptures"
      },
      {
        "title": "Japa and Meditation Area",
        "text": "Quiet corners within the temple for Mantra Meditation"
      },
      {
        "title": "Sunday Love Fest",
        "text": "Weekly grand program with special kirtan and prasadam feast."
      },
      {
        "title": "Value Education for Children",
        "text": "Regular Prahald school is held on weekends"
      },
      {
        "title": "Youth Programs (FOLK)",
        "text": "Dedicated sessions for students and professionals"
      },
      {
        "title": "Vedic Library",
        "text": "Collection of historical texts and archives"
      }
    ]
  },
  {
    "slug": "indore",
    "name": "Hare Krishna Mandir Indore",
    "city": "Indore",
    "state": "Madhya Pradesh",
    "region": "West & Central India",
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-indore-hero.jpg",
    "lat": 22.7590835,
    "lng": 75.9047466,
    "placeId": "ChIJ_5JBYwAdYzkRJBVZOtjQOtA",
    "rating": 5.0,
    "reviews": 7,
    "overview": [
      "Hare Krishna Mandir, Indore, is the sole Hare Krishna Movement centre in Madhya Pradesh, offering a regular programme of devotional worship and spiritual learning. The centre also organises Bhagavad Gita retreats and Bhakti Yatras, providing opportunities to study Vedic teachings and visit sacred pilgrimage places."
    ],
    "address": "House No. 68, Sector B - 6 Rd, inside Ring Road, near Bombay Hospital, Scheme No:94, Scheme No 94 Sector WA, Indore, Madhya Pradesh 452010, India",
    "phone": "+91 92570 45200",
    "website": "hkmmp.org",
    "hours": [
      "Morning 7:30 AM – 1:00 PM",
      "Afternoon 4:00 – 8:30 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-indore-d0.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-mandir-indore-d1.jpg"
      }
    ],
    "features": [
      {
        "title": "FOLK Youth Programme",
        "text": "Explore practical wisdom, mind management, focus, meditation, kirtan, and spiritual growth through the weekly youth programme."
      },
      {
        "title": "Bhagavad Gita Retreats",
        "text": "Take part in structured retreats based on the teachings and principles of Bhagavad Gita."
      },
      {
        "title": "Bhakti Yatra",
        "text": "Travel to sacred destinations through guided pilgrimages combining temple visits, kirtan, spiritual talks, and prasadam."
      },
      {
        "title": "Pushpa Alankar Seva",
        "text": "Contribute to the temple's daily tradition of beautifully adorning the Deities with fresh flowers throughout the year."
      },
      {
        "title": "Balya Bhog Seva",
        "text": "Offer the early-morning sweet preparation seva, served to the Deities daily at the temple."
      },
      {
        "title": "Annadaan Seva",
        "text": "Support the temple's initiative to provide free food to pilgrims visiting the temple."
      },
      {
        "title": "Janmashtami Celebrations",
        "text": "Experience special Abhishek, Jhulan, cultural programmes, kirtans, Maha Aarti, and Maha Prasadam during Janmashtami."
      },
      {
        "title": "Volunteer Seva",
        "text": "Get involved in the temple's various volunteer services and contribute to its devotional activities."
      }
    ]
  },
  {
    "slug": "udaipur",
    "name": "Hare Krishna Movement, Udaipur",
    "city": "Udaipur",
    "state": "Rajasthan",
    "region": "North India",
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-udaipur-hero.jpg",
    "lat": 24.5914963,
    "lng": 73.6998067,
    "placeId": "ChIJN6QQ91nlZzkRqNDrwKbFVUQ",
    "rating": 4.9,
    "reviews": 72,
    "overview": [
      "Hare Krishna Movement, Udaipur, is a spiritual centre dedicated to spreading Krishna consciousness through devotional activities, soulful kirtans, spiritual discourses, and cultural programs. Located in the beautiful city of Udaipur, the centre provides a peaceful environment for devotees and visitors to engage in bhakti, learn Vedic wisdom, and deepen their connection with the Lord."
    ],
    "address": "L87, Bhopalpura L Rd, Bhupalpura, Madhuban, Udaipur, Rajasthan 313001, India",
    "phone": null,
    "website": null,
    "hours": [
      "Morning 4:30 AM – 12:00 PM",
      "Afternoon 4:30 – 7:00 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-udaipur-d0.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-udaipur-d1.jpg"
      }
    ],
    "features": [
      {
        "title": "Darshan & Aarti",
        "text": "Experience peaceful darshan and participate in devotional aarti ceremonies."
      },
      {
        "title": "Harinam Sankirtan",
        "text": "Immerse yourself in soulful Hare Krishna kirtans and devotional chanting."
      },
      {
        "title": "Bhagavad Gita Classes",
        "text": "Learn timeless spiritual wisdom through Vedic scriptures and teachings."
      },
      {
        "title": "Spiritual Discourses",
        "text": "Gain deeper insights into Krishna consciousness through enlightening talks."
      },
      {
        "title": "Sunday Satsang",
        "text": "Join weekly gatherings filled with kirtan, spiritual discussions, and devotional activities."
      },
      {
        "title": "Festival Celebrations",
        "text": "Celebrate sacred Vaishnava festivals with devotion, kirtan, and cultural programs."
      },
      {
        "title": "Youth Spiritual Programs",
        "text": "Engage in inspiring activities that help youth connect with spiritual values."
      },
      {
        "title": "Seva Opportunities",
        "text": "Participate in devotional service and contribute towards community initiatives."
      }
    ]
  },
  {
    "slug": "amritsar",
    "name": "Hare Krishna Movement Amritsar",
    "city": "Amritsar",
    "state": "Punjab",
    "region": "North India",
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-amritsar-hero.jpg",
    "lat": 31.6505927,
    "lng": 74.87635250000001,
    "placeId": "ChIJp43VYHZjGTkR2yk2isPPeKs",
    "rating": 5.0,
    "reviews": 6,
    "overview": [
      "Hare Krishna Movement, Amritsar, is a local preaching centre in Shastri Nagar, Lawrence Road, serving as a base for spiritual outreach in the city. The centre also serves as the Amritsar starting point for the Vrindavan Heritage Yatra, connecting devotees with guided pilgrimage experiences to Vrindavan."
    ],
    "address": "201, Race Course Rd, Shastri Nagar, White Avenue, Amritsar, Punjab 143001, India",
    "phone": "+91 82829 82826",
    "website": "vcm.org.in",
    "hours": [
      "Morning 4:30 AM – 9:00 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-amritsar-d0.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-amritsar-d1.jpg"
      }
    ],
    "features": [
      {
        "title": "Daily Darshan",
        "text": "Experience daily Deity darshan and follow the temple's devotional activities from Amritsar."
      },
      {
        "title": "Soulful Kirtan",
        "text": "Join congregational chanting and devotional kirtans that form a regular part of temple activities."
      },
      {
        "title": "Spiritual Lectures",
        "text": "Explore practical spiritual wisdom through talks on Bhagavad Gita, Krishna consciousness, and devotional life."
      },
      {
        "title": "Vrindavan Heritage Yatra",
        "text": "Begin a guided pilgrimage from Amritsar to Vrindavan through the dedicated Heritage Yatra."
      },
      {
        "title": "Pilgrimage Journeys",
        "text": "Take part in organised spiritual journeys to sacred destinations such as Puri, Ayodhya, Kumbh, and Chitrakoot."
      },
      {
        "title": "Festival Celebrations",
        "text": "Experience devotional festivals including Janmashtami, Panihati Chida-dahi Utsava, and Jagannath Rath Yatra through special programmes and kirtans."
      },
      {
        "title": "Spiritual Learning",
        "text": "Attend sessions exploring topics such as real freedom, material life, devotion, and finding balance through Krishna consciousness."
      },
      {
        "title": "Life Enrichment Programs",
        "text": "Participate in outreach programmes that combine spirituality with practical life skills; HKM Punjab has conducted such programmes for students in Amritsar."
      }
    ]
  },
  {
    "slug": "noida",
    "name": "Hare Krishna Movement Noida",
    "city": "Noida",
    "state": "Uttar Pradesh",
    "region": "North India",
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-noida-hero.jpg",
    "lat": 28.584773199999997,
    "lng": 77.37699599999999,
    "placeId": "ChIJm9OwlwzlDDkR3soIiUvDsWQ",
    "rating": 4.9,
    "reviews": 111,
    "overview": [
      "Hare Krishna Movement, Noida, is a spiritual centre to practice Bhakti-yoga, meditation, and Vedic learning into the city's everyday life. The centre is also associated with Vrindavan Chandrodaya Mandir and conducts spiritual and community-oriented activities for people seeking regular engagement with Krishna consciousness."
    ],
    "address": "A-44, Block A, Sector 72, Noida, Uttar Pradesh 201316, India",
    "phone": "+91 81301 53084",
    "website": "vcm.org.in",
    "hours": [
      "Morning 7:00 AM – 12:30 PM",
      "Afternoon 4:00 – 8:00 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-noida-d0.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-noida-d1.jpg"
      }
    ],
    "features": [
      {
        "title": "Bhagavad Gita Sessions",
        "text": "Explore the teachings of the Bhagavad Gita through regular classes and guided discussions."
      },
      {
        "title": "Mantra Meditation",
        "text": "Learn the practice of mantra meditation and experience the power of focused chanting."
      },
      {
        "title": "Kirtan & Bhajan",
        "text": "Take part in melodious kirtans and devotional singing during regular gatherings."
      },
      {
        "title": "Phoolon Ki Holi",
        "text": "Experience the colourful celebration of Flower Holi with kirtan, cultural performances and pushpa abhishek."
      },
      {
        "title": "Ratha Yatra",
        "text": "Join the Noida Ratha Yatra, featuring a devotional procession, sankirtan and spiritual activities. The VCM records more than 500 participants at one such programme."
      },
      {
        "title": "Youth & Family Programmes",
        "text": "Engage in spiritual programmes designed for youth and families, including discussions, devotional activities, and value-based learning."
      },
      {
        "title": "Festival Celebrations",
        "text": "Participate in various Vaishnava festivals celebrated with kirtan, spiritual discourses, devotional offerings, and community gatherings."
      },
      {
        "title": "Prasadam",
        "text": "Honour Krishna prasadam, sanctified vegetarian food prepared and offered with devotion during gatherings and festivals."
      }
    ]
  },
  {
    "slug": "dehradun",
    "name": "Hare Krishna Movement, Dehradun",
    "city": "Dehradun",
    "state": "Uttarakhand",
    "region": "North India",
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-dehradun-hero.jpg",
    "lat": 30.3431656,
    "lng": 77.9480902,
    "placeId": "ChIJEf208YIrCTkRsGBylhEhXJY",
    "rating": 4.9,
    "reviews": 18,
    "overview": [
      "Hare Krishna Movement Dehradun is a spiritual retreat in the Himalayan foothills. Located in Sudhowala, the temple offers a serene atmosphere for deity worship, soulful kirtans and Vedic study. In addition, the temple also promoted youth empowerment through FOLK programs and community service through initiatives like Food for Life."
    ],
    "address": "Chakrata Rd, Sudhowala, Kandhauli, Uttarakhand 248015, India",
    "phone": "+91 81211 51508",
    "website": "hkmdehradun.org",
    "hours": [
      "Morning 7:30 AM – 1:00 PM",
      "Afternoon 4:00 – 8:00 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-dehradun-d0.jpg"
      },
      {
        "name": "Srila Prabhupada:",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-dehradun-d1.jpg"
      }
    ],
    "features": [
      {
        "title": "Darshan and Prayer Hall",
        "text": "Experience peaceful darshan with soulful aarti"
      },
      {
        "title": "Kirtan and Bhajan Experience",
        "text": "Immerse yourself in uplifting Hare Krishna Kirtans"
      },
      {
        "title": "Sunday Spiritual Retreat",
        "text": "Special Weekly experience"
      },
      {
        "title": "Spiritual Discourses",
        "text": "Timeless wisdom from Vedic Scriptures and books"
      },
      {
        "title": "Festivals and celebrations",
        "text": "Enjoy grand festival celebrations"
      },
      {
        "title": "Seva Opportunities",
        "text": "Contribute through Annadaan and Gauseva"
      },
      {
        "title": "Youth and wellness programs",
        "text": "Participate in workshops like Yoga for Happiness"
      },
      {
        "title": "Matchless Gift Shop",
        "text": "Explore a collection of devotional souvenirs"
      }
    ]
  },
  {
    "slug": "lucknow",
    "name": "Hare Krishna Movement, Lucknow",
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "region": "North India",
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-lucknow-hero.jpg",
    "lat": 26.8693511,
    "lng": 81.0211595,
    "placeId": "ChIJed2TJJTjmzkRn1XJP6MatOM",
    "rating": 4.7,
    "reviews": 87,
    "overview": [
      "Hare Krishna Movement, Lucknow, is a spiritual centre focused on Krishna consciousness, congregational chanting, Bhagavad-gita teachings, devotional programmes and prasadam distribution. The centre provides devotees with regular opportunities for kirtan, spiritual learning, satsang and participation in bhakti-based community activities inspired by the teachings of Srila Prabhupada."
    ],
    "address": "V29C+MCP 2/117, Vijayant Khand- 2, Vijayant Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010, India",
    "phone": "+91 95872 72825",
    "website": null,
    "hours": [
      "Closed"
    ],
    "deities": [
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-lucknow-d0.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-movement-lucknow-d1.jpg"
      }
    ],
    "features": [
      {
        "title": "Sunday Gatherings",
        "text": "Join regular Sunday programmes with chanting, spiritual association and devotional activities."
      },
      {
        "title": "Sankirtan & Kirtan",
        "text": "Take part in Hare Krishna kirtan and congregational chanting."
      },
      {
        "title": "Spiritual Teachings",
        "text": "Learn Krishna consciousness through the teachings of Srila Prabhupada."
      },
      {
        "title": "Book Distribution",
        "text": "Participate in sharing Srila Prabhupada’s spiritual books with others."
      },
      {
        "title": "Prasadam Distribution",
        "text": "Support the distribution of sanctified vegetarian prasadam."
      },
      {
        "title": "Community Outreach",
        "text": "Engage in devotional programmes that connect with the wider community."
      },
      {
        "title": "Spiritual Discourses",
        "text": "Attend talks based on Bhagavad-gita, Srimad Bhagavatam and Vaishnava philosophy."
      },
      {
        "title": "Devotee Association",
        "text": "Connect with devotees through satsang, seva and regular spiritual activities."
      }
    ]
  },
  {
    "slug": "coimbatore",
    "name": "Hare Krishna Movement, Coimbatore",
    "city": "Coimbatore",
    "state": "Tamil Nadu",
    "region": "South India",
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-coimbatore-hero.jpg",
    "lat": 11.0087835,
    "lng": 76.99621789999999,
    "placeId": "ChIJ37V7HrVZqDsRYIUhu5V_v_s",
    "rating": 4.7,
    "reviews": 53,
    "overview": [
      "Hare Krishna Movement (HKM) Coimbatore is a spiritual and cultural oasis dedicated to promoting and preserving Vedic wisdom, offering a quiet, peaceful environment for meditation, worship, and community service."
    ],
    "address": "Sowripalayam Rd, opp. Muktha apartments, Navy Nagar, Meena Estate, Coimbatore, Tamil Nadu 641028, India",
    "phone": "+91 22 6941 5100",
    "website": "iskconcenters.org",
    "hours": [
      "Morning 7:15 AM – 8:15 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Radha Krishna Chandra",
        "text": "Sri Sri Radha Krishna Chandra, the divine couple, are worshipped as the ultimate and supreme embodiment of divine love.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-coimbatore-d0.jpg"
      },
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-coimbatore-d1.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-coimbatore-d2.jpg"
      }
    ],
    "features": [
      {
        "title": "Darshan and Prayer Hall",
        "text": "Experience peaceful darshan with soulful aarti"
      },
      {
        "title": "Kirtan and Bhajan Experience",
        "text": "Immerse yourself in uplifting Hare Krishna Kirtans"
      },
      {
        "title": "Sunday Spiritual Retreat",
        "text": "Special Weekly experience"
      },
      {
        "title": "Spiritual Discourses",
        "text": "Timeless wisdom from Vedic Scriptures and books"
      },
      {
        "title": "Festivals and celebrations",
        "text": "Enjoy grand festival celebrations"
      },
      {
        "title": "Seva Opportunities",
        "text": "Contribute through Annadaan and Gauseva"
      },
      {
        "title": "Youth and wellness programs",
        "text": "Participate in workshops like Yoga for Happiness"
      },
      {
        "title": "Matchless Gift Shop",
        "text": "Explore a collection of devotional souvenirs"
      }
    ]
  },
  {
    "slug": "ihf-new-jersey-new-york",
    "name": "India Heritage Foundation, NJ/NY",
    "city": "Edison",
    "state": "New Jersey, USA",
    "region": "International",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793689802145-1793689801271-IndiaHeritageFoundationTempleFacade.png",
    "headerRatio": 1.457,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/india-heritage-foundation-njny-hero.jpg",
    "lat": 40.5232502,
    "lng": -74.41753229999999,
    "placeId": "ChIJ8y0FAubHw4kRdI0-dEYziRs",
    "rating": 4.8,
    "reviews": 169,
    "overview": [
      "Indian Heritage Foundation (NJ/NY) is a spiritual and cultural centre dedicated to protecting and promoting Vedic traditions in the Tri-State area. Located in South Plainfield, NJ, the temple offers soulful kirtans and transformational youth programs, such as FOLK and value-based education for children."
    ],
    "address": "7 Kilmer Ct, Edison, NJ 08817, USA",
    "phone": "+1 848-334-7413",
    "website": "ihf-njny.org",
    "hours": [
      "Morning 7:30 AM – 1:00 PM",
      "Evening 5:00 – 8:30 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Radha Gopinathji",
        "text": "Sri Sri Radha Gopinath, the divine couple, are worshipped as the ultimate and supreme embodiment of divine love.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/india-heritage-foundation-njny-d0.jpg"
      },
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/india-heritage-foundation-njny-d1.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/india-heritage-foundation-njny-d2.jpg"
      }
    ],
    "features": [
      {
        "title": "Darshan and Prayer Hall",
        "text": "Experience peaceful darshan with soulful aarti"
      },
      {
        "title": "Kirtan and Bhajan Experience",
        "text": "Immerse yourself in uplifting Hare Krishna Kirtans"
      },
      {
        "title": "Sunday Spiritual Retreat",
        "text": "Special Weekly experience"
      },
      {
        "title": "Art of Self-Discovery",
        "text": "Timeless wisdom from Vedic Scriptures and books"
      },
      {
        "title": "Festivals and celebrations",
        "text": "Enjoy grand festival celebrations"
      },
      {
        "title": "Seva Opportunities",
        "text": "Contribute through Annadaan and Gauseva"
      },
      {
        "title": "Youth and wellness programs",
        "text": "Participate in workshops like Yoga for Happiness"
      },
      {
        "title": "Matchless Gift Shop",
        "text": "Explore a collection of devotional souvenirs"
      }
    ]
  },
  {
    "slug": "krishna-balaram-mandir-california",
    "name": "Sri Krishna Balaram Mandir – Sunnyvale, USA",
    "city": "Milpitas",
    "state": "California, USA",
    "region": "International",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793689866328-1793689866008-SriKrishnaBalaramMandiratDusk.png",
    "headerRatio": 1.457,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/krishna-balaram-mandir-sunnyvale-usa-hero.jpg",
    "lat": 37.4328678,
    "lng": -121.8951469,
    "placeId": "ChIJNflV6tTJj4ARKP2ceHk6q7g",
    "rating": 4.8,
    "reviews": 334,
    "overview": [
      "Sri Krishna Balaram Temple is a project rooted in Indian heritage. Located at 680E Calaveras Blvd, Milpitas, the temple focuses on spreading awareness of the mission of ISKCON's spiritual master, A.C. Bhaktivedanta Swami Srila Prabhupada. The temple focuses on youth mentoring, opened children's development centres, an animation park, and 3D animated movies that showcase Indian heritage and the values of Krishna consciousness."
    ],
    "address": "680 E Calaveras Blvd, Milpitas, CA 95035, USA",
    "phone": "+1 408-657-8485",
    "website": "kbmandir.org",
    "hours": [
      "Morning 7:30 AM – 1:00 PM",
      "Evening 5:00 – 8:30 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Krishna Balaram",
        "text": "The Lordships Sri Sri Krishna Balaram are worshipped as the supreme manifestation of protection, faith, and eternal brotherhood.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/krishna-balaram-mandir-sunnyvale-usa-d0.jpg"
      },
      {
        "name": "Sri Sri Nitai Gauranaga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/krishna-balaram-mandir-sunnyvale-usa-d1.jpg"
      },
      {
        "name": "Sri Lakshmi Narasimha",
        "text": "The Lord Narasimha and Goddess Lakshmi symbolise divine protection, mercy and abundance.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/krishna-balaram-mandir-sunnyvale-usa-d2.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/krishna-balaram-mandir-sunnyvale-usa-d3.jpg"
      }
    ],
    "features": [
      {
        "title": "Sunday Gurukul",
        "text": "Children's education on Vedic yoga, culture, and heritage"
      },
      {
        "title": "Gopal Kidz Summer Camp",
        "text": "Themed campus for kids"
      },
      {
        "title": "FOLK",
        "text": "Youth programs focused on stress management"
      },
      {
        "title": "Temple Hall",
        "text": "A serene hall for prayer and quiet meditation"
      },
      {
        "title": "Cultural Centre",
        "text": "A 27,000 sq.ft facility with a large auditorium"
      },
      {
        "title": "Event Hall and Studios",
        "text": "Spaces for hosting events, birthdays and anniversaries"
      },
      {
        "title": "Goshala (Cow Sanctuary)",
        "text": "Home for cows and bulls"
      },
      {
        "title": "Trekking and Japa Trails",
        "text": "Meditative walks and trekking with a hillside stay"
      }
    ]
  },
  {
    "slug": "hare-krishna-ashram-penang",
    "name": "Hare Krishna Ashram, Malaysia",
    "city": "Penang",
    "state": "Malaysia",
    "region": "International",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793689261769-1793689261466-HareKrishnaAshramMalaysiaTemple.png",
    "headerRatio": 1.5,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-ashram-malaysia-hero.jpg",
    "lat": 5.263481,
    "lng": 100.42318619999999,
    "placeId": "ChIJN5Tvr8y5SjARVkutxqlqGvU",
    "rating": 4.6,
    "reviews": 27,
    "overview": [
      "Hare Krishna Ashram Malaysia, located in Penang, is a large temple and cultural centre built in a modern design with South Indian Chola architecture. The ashram is also revered as the Sri Sri Radha Krishna Diamond Temple, with the presiding deities Sri Sri Radha Gopinath ji, reminding devotees of the sweet atmosphere of Vrindavan."
    ],
    "address": "LOT 21128, Pengkalan Batu Kawan, Bandar Cassia, Bukit Tambun, 14110 Simpang Ampat, Penang, Malaysia",
    "phone": "+60 4-587 1637",
    "website": "harekrsnaashram.org",
    "hours": [
      "Morning 5:00 AM – 8:30 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Radha Gopinatha",
        "text": "The beautiful form of Radha Gopinath, the eternal symbol of love and compassion, enchants the hearts of devotees with their sweet pastimes.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-ashram-malaysia-d0.jpg"
      },
      {
        "name": "Sri Sri Krishna Balaram",
        "text": "Worshipped as the supreme manifestation of protection, faith, and eternal brotherhood.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-ashram-malaysia-d1.jpg"
      },
      {
        "name": "Sri Sri Nitai Gauranaga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-ashram-malaysia-d2.jpg"
      },
      {
        "name": "Sri Prahalad Narasimha",
        "text": "Peaceful four-handed deity of Lord Narasimhadeva, offering protection to his pure devotees like Prahlada.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-ashram-malaysia-d3.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-ashram-malaysia-d4.jpg"
      }
    ],
    "features": [
      {
        "title": "Vedic Cultural Centre",
        "text": "Dedicated space for spiritual education"
      },
      {
        "title": "Grand Prayer Hall",
        "text": "Large octagonal hall for kirtan and festival"
      },
      {
        "title": "Multi-purpose Banquet",
        "text": "A large facility for community events and  weddings"
      },
      {
        "title": "Vegetarian Restaurant",
        "text": "On-site dining offering Krishna Prasadam"
      },
      {
        "title": "Guest House",
        "text": "Comfortable accommodation for pilgrims and visitors"
      },
      {
        "title": "Gift Shop",
        "text": "Sells a variety of spiritual items"
      },
      {
        "title": "Sunday Feast Program",
        "text": "Weekly community gathering"
      },
      {
        "title": "Samskaras (Rites of Passage)",
        "text": "Priests for conducting ceremonies"
      }
    ]
  },
  {
    "slug": "ihf-boston",
    "name": "India Heritage Foundation - Boston",
    "city": "Shrewsbury",
    "state": "Massachusetts, USA",
    "region": "International",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793689397571-1793689396940-IndiaHeritageFoundationinBloom.png",
    "headerRatio": 1.5,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/india-heritage-foundation-boston-hero.jpg",
    "lat": 42.2811732,
    "lng": -71.7136239,
    "placeId": "ChIJvfQ4kPx544kRYLPFsHfe-zk",
    "rating": 4.9,
    "reviews": 102,
    "overview": [
      "The Indian Heritage Foundation is a premier cultural and spiritual place, dedicated to preserving and promoting India’s rich Vedic heritage. Located in Southborough, the place offers a serene environment and raises community awareness through value-based education and youth programs."
    ],
    "address": "226 R, Grafton St, Shrewsbury, MA 01545, USA",
    "phone": "+1 508-301-4108",
    "website": "ihfboston.org",
    "hours": [
      "Morning 5:00 AM – 1:00 PM",
      "Afternoon 4:30 – 8:30 PM"
    ],
    "deities": [
      {
        "name": "Sri Sri Radha Damodar",
        "text": "Sri Sri Radha Damodar, the divine couple, are worshipped as the ultimate and supreme embodiment of divine love.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/india-heritage-foundation-boston-d0.jpg"
      },
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations of Radha Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/india-heritage-foundation-boston-d1.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/india-heritage-foundation-boston-d2.jpg"
      }
    ],
    "features": [
      {
        "title": "Darshan and Prayer Hall",
        "text": "Experience peaceful darshan with soulful aarti"
      },
      {
        "title": "Kirtan and Bhajan Experience",
        "text": "Immerse yourself in uplifting Hare Krishna Kirtans"
      },
      {
        "title": "Sunday Spiritual Retreat",
        "text": "Special Weekly experience"
      },
      {
        "title": "Spiritual Discourses",
        "text": "Timeless wisdom from Vedic Scriptures and books"
      },
      {
        "title": "Festivals and celebrations",
        "text": "Enjoy grand festival celebrations"
      },
      {
        "title": "Seva Opportunities",
        "text": "Contribute through Annadaan and Gauseva"
      },
      {
        "title": "Youth and wellness programs",
        "text": "Participate in workshops like Yoga for Happiness"
      },
      {
        "title": "Matchless Gift Shop",
        "text": "Explore a collection of devotional souvenirs"
      }
    ]
  },
  {
    "slug": "hare-krishna-ashram-johor",
    "name": "Hare Krishna Ashram, Johor",
    "city": "Masai",
    "state": "Johor, Malaysia",
    "region": "International",
    "headerImage": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793689497585-1793689497304-HareKrishnaAshramJohorGardens.png",
    "headerRatio": 1.5,
    "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-ashram-johor-hero.jpg",
    "lat": 1.4866207999999999,
    "lng": 103.8677334,
    "placeId": "ChIJVSejdLRr2jER2EojWBVxLpk",
    "rating": 5.0,
    "reviews": 4,
    "overview": [
      "Hare Krishna Ashram in Johor is located in Taman Rinting, Masai. It serves as a spiritual hub for the Hare Krishna Movement in that region, focusing on spreading the spiritual values and path of Krishna consciousness through regular chanting, deity worship and helping others."
    ],
    "address": "No. 3 & 5, Jalan Balau 3, Taman Rinting, 81750 Masai, Johor",
    "phone": null,
    "website": null,
    "hours": [],
    "deities": [
      {
        "name": "Sri Sri Radha Krishna Chandra",
        "text": "Sri Sri Radha Krishna Chandra, the divine couple, are worshipped as the ultimate and supreme embodiment of divine love.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-ashram-johor-d0.jpg"
      },
      {
        "name": "Sri Sri Krishna Balaram",
        "text": "The Lordships Sri Sri Krishna Balaram are worshipped as the supreme manifestation of protection, faith, and eternal brotherhood.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-ashram-johor-d1.jpg"
      },
      {
        "name": "Sri Sri Nitai Gauranga",
        "text": "Divine incarnations Radha-Krishna and Balaram, who spread the chanting of Hare Krishna Mahamantra in the late 15th century.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-ashram-johor-d2.jpg"
      },
      {
        "name": "Srila Prabhupada",
        "text": "Founder Acharya of the Hare Krishna Movement, whose teachings constantly inspire millions towards the path of enlightenment and bhakti.",
        "image": "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/centers/hare-krishna-ashram-johor-d3.jpg"
      }
    ],
    "features": [
      {
        "title": "Divine Darshan and Daily Aarti",
        "text": "Experience peaceful darshan with soulful aarti"
      },
      {
        "title": "Kirtan and Bhajan Experience",
        "text": "Immerse yourself in uplifting Hare Krishna Kirtans"
      },
      {
        "title": "Sunday Spiritual Retreat",
        "text": "Special Weekly experience"
      },
      {
        "title": "Spiritual Discourses",
        "text": "Timeless wisdom from Vedic Scriptures and books"
      },
      {
        "title": "Festivals and celebrations",
        "text": "Enjoy grand festival celebrations"
      },
      {
        "title": "Guest House Stay",
        "text": "Stay within the temple premises in peaceful surroundings"
      },
      {
        "title": "Youth and wellness programs",
        "text": "Participate in workshops like Yoga for Happiness"
      },
      {
        "title": "Gift shop",
        "text": "Explore a collection of devotional souvenirs"
      }
    ]
  }
];

export const getCenter = (slug: string) => CENTERS.find((c) => c.slug === slug);
