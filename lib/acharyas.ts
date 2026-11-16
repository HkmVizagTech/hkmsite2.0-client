// The acharyas of our disciplic succession, shown on /acharyas and /acharyas/<slug>.
// Content and paintings from the Hare Krishna Movement's acharya pages (harekrishnamandir.org/acharyas), reused with
// permission. Images on our R2: acharyas/<slug>-portrait.webp (4:5), acharyas/<slug>-banner.webp (wide painting),
// acharyas/acharyas-parampara-painting.webp (the group painting) and acharyas/srila-prabhupada-pastime.webp.

const R2 = "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/acharyas";

/** A heading or a paragraph of long-form text. */
export type Block = { h: string } | { p: string };
export type TimelineEvent = { title: string; year?: string; date?: string; place?: string; text?: string };
export type Book = { title: string; year?: string; text?: string };
export type Pastime = { title: string; summary: string; body: string[]; image: string };
export type AcharyaCategory =
  | "Founder-Acharya"
  | "Modern Acharyas"
  | "Six Goswamis"
  | "Pancha-tattva"
  | "Associates of Mahaprabhu"
  | "Post-Goswami Acharyas";

export type Acharya = {
  slug: string;
  name: string;
  /** "Also known as" */
  shortName: string;
  /** Role line, e.g. "Founder-Acharya of ISKCON" */
  title: string;
  category: AcharyaCategory;
  sampradaya: string;
  featured: boolean;
  /** Display dates, e.g. "1489 – 1564" (absent when unknown) */
  years?: string;
  appearance?: { date?: string; place?: string };
  disappearance?: { date?: string; place?: string };
  portrait: string;
  banner: string;
  summary: string;
  biography: Block[];
  teachings: Block[];
  qualities: Block[];
  timeline: TimelineEvent[];
  books: Book[];
  /** Slugs of the guru and disciple in the parampara, where the line is recorded */
  lineage?: { guru?: string; disciple?: string };
  pastimes?: Pastime[];
};

export const ACHARYAS_PAINTING = `${R2}/acharyas-parampara-painting.webp`;

export const ACHARYAS: Acharya[] = [
  {
    "slug": "srila-prabhupada",
    "name": "A. C. Bhaktivedanta Swami Prabhupada",
    "shortName": "Srila Prabhupada",
    "title": "Founder-Acharya of ISKCON",
    "category": "Founder-Acharya",
    "sampradaya": "Brahma-Madhva-Gaudiya Sampradaya",
    "featured": true,
    "years": "September 1, 1896 – November 14, 1977",
    "appearance": {
      "date": "September 1, 1896",
      "place": "Calcutta, Bengal Presidency, British India"
    },
    "disappearance": {
      "date": "November 14, 1977",
      "place": "Vrindavan, Uttar Pradesh, India"
    },
    "portrait": `${R2}/srila-prabhupada-portrait.webp`,
    "banner": `${R2}/srila-prabhupada-banner.webp`,
    "summary": "A. C. Bhaktivedanta Swami Prabhupada, widely known as Srila Prabhupada, was the Founder-Acharya of the International Society for Krishna Consciousness (ISKCON). He brought the teachings of Lord Sri Krishna and the practice of bhakti-yoga to people throughout the world.",
    "biography": [
      {
        "h": "Introduction"
      },
      {
        "p": "Śrīla Prabhupāda, the Founder-Ācārya of the International Society for Krishna Consciousness (ISKCON), has been described as a scholar, philosopher, cultural ambassador, author, spiritual teacher and social critic. He was all of these, but above all he was a pure devotee of Lord Kṛṣṇa and a bona fide spiritual master in the Gauḍīya Vaiṣṇava sampradāya."
      },
      {
        "p": "More than five hundred years ago Śrī Caitanya Mahāprabhu inaugurated the saṅkīrtana movement, the congregational chanting of the holy names, as the dharma for the age of Kali. He foretold that the holy name would be heard in every town and village of the world, and that a powerful servant would come to carry it there. Beginning at the age of sixty-nine with almost nothing, Śrīla Prabhupāda spread Kṛṣṇa consciousness across the world in about a dozen years, fulfilling that prophecy."
      },
      {
        "h": "Appearance in Calcutta"
      },
      {
        "p": "Śrīla Prabhupāda appeared on 1 September 1896, the day after Janmāṣṭamī, in a small house in Tollygunge, a suburb of Calcutta. His parents, Gour Mohan De and Rajani, named him Abhay Charan, meaning one who is fearless because he has taken shelter at the lotus feet of Kṛṣṇa."
      },
      {
        "p": "An astrologer who cast the child's horoscope predicted that at the age of seventy he would cross the ocean, become a great teacher of religion, and establish 108 temples of Kṛṣṇa. Seven decades later the prediction came true in every detail."
      },
      {
        "h": "A Childhood Steeped in Devotion"
      },
      {
        "p": "His father, Gour Mohan De, was a pure devotee of the Lord. When Abhay was four or five, his father gave him small Deities of Rādhā and Kṛṣṇa. With his sister, Abhay worshipped Them in play, copying the ceremonies he saw at the neighbouring Rādhā-Govinda temple. Through this daily play he developed a natural attraction to the Lord. Even as a toddler he joined the kīrtanas held in the family home."
      },
      {
        "p": "Śrīla Prabhupāda later remembered how, during the terrible plague of 1898, a bābājī led Hare Kṛṣṇa saṅkīrtana through the streets of Calcutta. People of every faith joined in, and he recalled that the epidemic subsided. When he fell ill with typhoid as a baby, a doctor prescribed chicken broth. His father refused, and when the broth was given anyway, the child vomited it at once."
      },
      {
        "p": "The family was not wealthy, but under his father's care the children never felt any lack. When Abhay was six, his father gave him a small chariot, and the boy organised his own Ratha-yātrā festival for the neighbourhood children, with his father generously supplying prasāda. His father also had him taught the mṛdaṅga, despite his mother's objections. To every saintly visitor his father made one request: please bless my son to become a servant of Śrīmatī Rādhārāṇī. Śrīla Prabhupāda felt deeply indebted to his father for this training and later dedicated his Kṛṣṇa book to him."
      },
      {
        "h": "Education and the Freedom Movement"
      },
      {
        "p": "In 1916 Abhay entered the prestigious Scottish Churches' College in Calcutta to study philosophy. In 1918, while still in college, he was married to Radharani Datta, as arranged by his father."
      },
      {
        "p": "In 1920 Mahatma Gandhi launched the non-cooperation movement against British rule, calling on Indians to boycott English schools, courts and goods. Leaders such as Motilal Nehru and C. R. Das gave up wealthy careers to join him, and foreign cloth was burned in public bonfires. Abhay was among the students who answered the call. He left his English education and began wearing hand-spun khadi."
      },
      {
        "h": "Meeting His Spiritual Master"
      },
      {
        "p": "In 1922 his close friend Narendranath Mullik urged him to meet a sādhu from Māyāpur. Having met many false sādhus, Abhay was reluctant, but he agreed to go. In the āśrama they found Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura, a scholarly sannyāsī sitting very straight and wearing small round spectacles."
      },
      {
        "p": "Even before the young men had been introduced, Bhaktisiddhānta Sarasvatī asked them why, as educated young men, they did not preach Kṛṣṇa's message throughout the world. Abhay replied that India first had to become independent, since no one would listen to a subject nation. Bhaktisiddhānta Sarasvatī answered calmly that Kṛṣṇa's message could not wait for political change; it did not depend on who ruled, and the teachings of the Bhagavad-gītā were too important to wait."
      },
      {
        "p": "As they walked away, Narendranath asked his friend what he thought. Abhay replied, \"The message of Bhagavad-gita is in the hands of a very expert person.\" In his heart he accepted Bhaktisiddhānta Sarasvatī as his spiritual master that day, and in 1933 he received formal initiation from him."
      },
      {
        "h": "The Final Order"
      },
      {
        "p": "As a householder Abhay supported his guru's mission with donations, but he longed to serve more directly. In December 1936 he wrote to Bhaktisiddhānta Sarasvatī asking how he could do so. The reply, which reached him around the time of his spiritual master's departure from this world, repeated the instruction of their first meeting: to preach what he had learned to the English-speaking world, for his own good and for the good of those who heard him. Śrīla Prabhupāda accepted this as his guru's final order and made it the mission of his life."
      },
      {
        "h": "Preaching in India"
      },
      {
        "p": "In the following years he wrote a commentary on the Bhagavad-gītā and continued to help the Gauḍīya Maṭh. In 1944 he started Back to Godhead magazine to show the public that material life is not the only reality and that the real goal of life is to return to Kṛṣṇa. He did everything himself. He wrote and edited the articles, typed the manuscripts, checked the proofs, and distributed the copies by hand. During the Second World War, when paper was scarce and the government refused him paper, he wrote to the authorities three times until permission was granted."
      },
      {
        "p": "Few people were interested, and even his family showed little sympathy for his mission. He founded a centre called the League of Devotees in Jhansi, but it did not succeed and he had to close it. Gradually he withdrew from family life to give himself fully to preaching."
      },
      {
        "h": "Vṛndāvana and Sannyāsa"
      },
      {
        "p": "He moved to Vṛndāvana and lived very simply at the historic Rādhā-Dāmodara temple, the temple of Śrīla Jīva Gosvāmī. With no income, he ate little, wore old cloth and spent his years studying and writing, collecting money only to print books. In 1959 he accepted sannyāsa. The following year he began his multi-volume translation and commentary on the eighteen-thousand-verse Śrīmad-Bhāgavatam. He also wrote Easy Journey to Other Planets. He personally presented a copy of the Śrīmad-Bhāgavatam to Prime Minister Lal Bahadur Shastri. Meanwhile his plan to take the chanting of Hare Kṛṣṇa to the world was taking shape."
      },
      {
        "h": "The Journey to America"
      },
      {
        "p": "A few days before his sixty-ninth birthday, Śrīla Prabhupāda set out for America. Sumati Morarji, the owner of the Scindia Steamship Company, gave him free passage on the cargo ship Jaladuta, on which he was the only passenger. He carried a suitcase, an umbrella, some dry cereal, about forty rupees, and several boxes of his books."
      },
      {
        "p": "The Jaladuta, commanded by Captain Arun Pandia, sailed on 13 August 1965. The voyage was hard. He suffered seasickness and dizziness and survived two heart attacks, which he attributed to Kṛṣṇa's protection. After thirty-seven days the ship reached New York. He knew no one there and had no money, no followers and no clear means of support, only his faith and his guru's order."
      },
      {
        "p": "Years later a disciple found the diary he had kept on the voyage. In it was a Bengali poem written on 18 September 1965, as the ship reached Boston harbour. In it he humbly prays to Kṛṣṇa, calling himself unqualified and asking for the Lord's power to convince the people of the West. He also expresses confidence that once Kṛṣṇa's message enters their hearts, they will become joyful and free from misery."
      },
      {
        "h": "Founding ISKCON"
      },
      {
        "p": "For about a year Śrīla Prabhupāda struggled alone in New York, living simply and lecturing wherever he was invited. In February 1966 he bought a reel-to-reel tape recorder and recorded his introduction to the Bhagavad-gītā. In July 1966, before he had even one committed follower, he incorporated the International Society for Krishna Consciousness, intended from the start for the whole world."
      },
      {
        "p": "He held classes on the Bhagavad-gītā in a rented storefront on Second Avenue and led kīrtana under a large tree in Tompkins Square Park, which is still honoured today. The young people of America, disillusioned by the Vietnam War and searching for alternatives, began to gather. The poet Allen Ginsberg, who had first heard the mahā-mantra at the Kumbha-melā in Allahabad, became an early visitor. Through chanting in the parks, distributing Back to Godhead, hosting Sunday love feasts and teaching from the scriptures, Śrīla Prabhupāda attracted his first disciples. He held the first initiation ceremony on 8 September 1966."
      },
      {
        "h": "A Worldwide Movement"
      },
      {
        "p": "In 1967 the movement spread to San Francisco, Los Angeles, Boston and Buffalo, and then abroad. His disciples in London met George Harrison of the Beatles, whose recording of the mahā-mantra reached the top of the British charts and brought the holy name to millions. Harrison later donated a manor house in the English countryside to the movement."
      },
      {
        "p": "In about a dozen years Śrīla Prabhupāda circled the globe fourteen times, opened more than a hundred temples, and initiated more than ten thousand disciples. He trained them in Deity worship and in the full culture of Kṛṣṇa consciousness. In 1972 he opened a gurukula in Dallas, Texas, to educate children on the Vedic model. He established farm communities based on simple living and high thinking, with protection for cows and bulls throughout their lives. He also trained an academy of devotee artists to illustrate his books, and founded the Bhaktivedanta Institute to present the Vedic worldview to scientists. He instructed that no one within ten miles of an ISKCON temple should go hungry, and his followers have since served millions of plates of sanctified vegetarian food."
      },
      {
        "h": "His Books"
      },
      {
        "p": "Of all his contributions, Śrīla Prabhupāda considered his books the most important. He translated and commented on the three great texts of the Gauḍīya tradition, the Bhagavad-gītā, the Śrīmad-Bhāgavatam and the Śrī Caitanya-caritāmṛta, and wrote many other works explaining Kṛṣṇa consciousness. Written in clear, modern English, they have been translated into more than eighty languages and appreciated by scholars worldwide. The Bhaktivedanta Book Trust, which he founded, is the world's largest publisher of Vedic literature."
      },
      {
        "h": "Departure"
      },
      {
        "p": "Just twelve years after writing his prayer aboard the Jaladuta, Śrīla Prabhupāda left this world on 14 November 1977 in Vṛndāvana, at the age of eighty-one. He had begun with nothing, at an age when most people retire, and had given the world a living spiritual movement."
      },
      {
        "h": "The Prophecy Fulfilled"
      },
      {
        "p": "Through Śrīla Prabhupāda's faith, determination and devotion to his spiritual master, the words Hare Kṛṣṇa Hare Rāma are now heard in streets, festivals and homes on every continent. The holy name has reached the towns and villages of the world, just as Śrī Caitanya Mahāprabhu foretold, through the life of one devoted servant."
      }
    ],
    "teachings": [
      {
        "h": "Introduction"
      },
      {
        "p": "Śrīla Prabhupāda presented the essence of Vedic knowledge exactly as it has been handed down in the Gauḍīya Vaiṣṇava sampradāya, without adding his own speculation. His books, lectures, conversations and letters contain his complete teachings. The principles below summarise the core of what he taught and lived."
      },
      {
        "h": "1. Kṛṣṇa Is the Supreme Personality of Godhead"
      },
      {
        "p": "Śrīla Prabhupāda taught that Lord Kṛṣṇa is the Supreme Personality of Godhead, the source of everything. God is not an impersonal force but a person, with an eternal form, name, qualities and pastimes. Understanding Kṛṣṇa as He is, as presented in the Bhagavad-gītā, is the beginning of real knowledge."
      },
      {
        "h": "2. We Are Eternal Parts of Kṛṣṇa"
      },
      {
        "p": "Every living being is a jīva, an eternal spiritual soul and a part and parcel of Kṛṣṇa. We are not the body. Our present condition of birth, death and suffering comes from forgetting our relationship with the Lord. Material life is not the only reality, and the human form of life is meant for understanding our spiritual identity."
      },
      {
        "h": "3. The Goal of Life Is Pure Devotional Service"
      },
      {
        "p": "The perfection of every soul is to re-establish its relationship with Kṛṣṇa and serve Him with love, without any selfish motive. This bhakti frees one from the cycle of birth and death and brings one back home, back to Godhead, to the spiritual world, where the soul lives eternally with the Lord."
      },
      {
        "h": "4. Chant Hare Kṛṣṇa"
      },
      {
        "p": "The scriptures recommend the congregational chanting of the Hare Kṛṣṇa mahā-mantra as the yuga-dharma, the religious process for the present age of Kali. It is the easiest and most sublime way to attain spiritual perfection, open to everyone regardless of background:"
      },
      {
        "p": "Hare Kṛṣṇa Hare Kṛṣṇa Kṛṣṇa Kṛṣṇa Hare Hare / Hare Rāma Hare Rāma Rāma Rāma Hare Hare."
      },
      {
        "p": "Śrīla Prabhupāda recalled from his own childhood how Calcutta's 1898 plague subsided when people of every faith joined in Hare Kṛṣṇa saṅkīrtana through the city's streets."
      },
      {
        "h": "5. Practise the Limbs of Bhakti"
      },
      {
        "p": "Chanting is supported by other practices of bhakti-yoga, such as hearing and reading the scriptures, worshipping the Deity, honouring prasāda (food offered to Kṛṣṇa), and associating with devotees. He trained his disciples carefully in Deity worship, explaining that the Lord appears as the Deity to accept our service. By serving the Deity with care, attraction to material things fades and pure love for God awakens."
      },
      {
        "h": "6. Kṛṣṇa Consciousness Is a Way of Life"
      },
      {
        "p": "Kṛṣṇa consciousness is not an armchair philosophy or a part-time religion. It is a complete way of life, in which work, family, food, education and recreation are all centred on Kṛṣṇa. He envisioned God-centred, self-sufficient farm communities based on the principle of simple living and high thinking, and he established protection for cows throughout their lives."
      },
      {
        "h": "7. Kṛṣṇa's Message Cannot Wait"
      },
      {
        "p": "From his first meeting with his spiritual master he learned that spiritual knowledge does not depend on politics or circumstances. People's real need is spiritual, and the message of the Bhagavad-gītā is so important that it must be given now, everywhere, whatever the political situation. True welfare work is to give people Kṛṣṇa consciousness."
      },
      {
        "h": "8. Follow the Order of the Spiritual Master"
      },
      {
        "p": "Śrīla Prabhupāda taught that spiritual knowledge must be received through the disciplic succession from a bona fide spiritual master. His own life showed what this means: he took his guru's instruction to preach in English as his life and soul and carried it out with unflinching determination, even in old age. Faithfully following the guru's order is the secret of spiritual success."
      },
      {
        "h": "9. Read and Distribute Transcendental Books"
      },
      {
        "p": "He considered his books to be his most important contribution and the basis of the entire movement. He urged devotees to read them regularly and to distribute them widely, so that people everywhere could receive the timeless wisdom of the Vedas in clear modern language."
      },
      {
        "h": "10. Spiritual Education from Childhood"
      },
      {
        "p": "He remembered with gratitude how his father raised him to love Kṛṣṇa: giving him Deities to worship, a chariot for Ratha-yātrā, and mṛdaṅga lessons, and praying that he would become a servant of Śrīmatī Rādhārāṇī. He taught that parents have a duty to raise their children in Kṛṣṇa consciousness. He founded gurukula schools so that children could be trained in spiritual life from an early age."
      },
      {
        "h": "11. Compassion in Action"
      },
      {
        "p": "Kṛṣṇa consciousness includes concern for every living being. He instructed that no one within ten miles of an ISKCON temple should go hungry, and his followers have since distributed millions of plates of sanctified vegetarian food. The highest compassion, he taught, is to give people both prasāda and spiritual knowledge."
      },
      {
        "h": "12. Spiritual Science, Not Sentiment"
      },
      {
        "p": "Śrīla Prabhupāda presented Kṛṣṇa consciousness as a science of the self, to be understood through reason, scripture and realisation. He founded the Bhaktivedanta Institute to challenge atheistic theories and show the relevance of the Vedic understanding of life and consciousness in the modern world."
      }
    ],
    "qualities": [
      {
        "h": "Introduction"
      },
      {
        "p": "Śrīla Prabhupāda showed the true qualities of an ācārya by his own words and deeds. The qualities below are drawn from the events of his life, from his childhood in Calcutta to his worldwide mission."
      },
      {
        "h": "1. Unflinching Faith in Kṛṣṇa"
      },
      {
        "p": "He crossed the ocean at sixty-nine with no money, no friends and no visible support, trusting completely in Kṛṣṇa's protection. When he survived two heart attacks aboard the Jaladuta, he attributed it to the Lord's mercy. In his prayer on arriving in America, he depended entirely on Kṛṣṇa's power, not his own."
      },
      {
        "h": "2. Determination to Fulfil His Guru's Order"
      },
      {
        "p": "The instruction he received in 1922 and again in his guru's final letter became the single purpose of his life. For decades, through failures and hardships, he never gave it up. He fulfilled it in old age, when most people retire."
      },
      {
        "h": "3. Fearlessness"
      },
      {
        "p": "His name, Abhay Charan, means one who is fearless because he has taken shelter of Kṛṣṇa. He lived up to it: he stood alone in New York, spoke against materialism in the heart of Western society, and started ISKCON before he had a single committed follower."
      },
      {
        "h": "4. Humility"
      },
      {
        "p": "Though empowered to change the world, he considered himself unqualified and fallen. On reaching America he prayed to Kṛṣṇa as a powerless servant, asking only to be used as an instrument. He gave all credit for his success to his spiritual master and to the Lord."
      },
      {
        "h": "5. Perseverance"
      },
      {
        "p": "For years he produced Back to Godhead entirely by himself, writing, editing, typing, proofreading and selling it on the streets. When the government refused him paper during the war, he wrote three times until permission came. When his League of Devotees in Jhansi failed, he did not lose heart but went on."
      },
      {
        "h": "6. Simplicity and Austerity"
      },
      {
        "p": "In Vṛndāvana he lived in a small room at the Rādhā-Dāmodara temple with no income. He ate little, wore old cloth, and used whatever money he collected only to print books. He cared nothing for his own comfort."
      },
      {
        "h": "7. Renunciation"
      },
      {
        "p": "He gradually gave up family life to serve his guru's mission and accepted sannyāsa in 1959. As a student he had already shown the strength to give things up when he left his English education for the freedom movement. Later he renounced everything for a far higher cause."
      },
      {
        "h": "8. Gratitude"
      },
      {
        "p": "He always spoke fondly of his father, who trained him in devotion and prayed that he would become a servant of Śrīmatī Rādhārāṇī. He felt so indebted that he dedicated his Kṛṣṇa book to him. His gratitude to his spiritual master was the driving force of his life."
      },
      {
        "h": "9. Scholarship and Literary Dedication"
      },
      {
        "p": "He translated and explained the Bhagavad-gītā, Śrīmad-Bhāgavatam and Caitanya-caritāmṛta in clear modern English, and wrote many other books. They are now in more than eighty languages and appreciated by scholars. He worked on them tirelessly, often through the night, considering them his most important service."
      },
      {
        "h": "10. Compassion for All"
      },
      {
        "p": "He saw the suffering of a world that had forgotten God and wanted to give everyone the means of real happiness. His instruction that no one within ten miles of a temple should go hungry, and his care for cows and for children's education, show his compassion for all living beings, body and soul."
      },
      {
        "h": "11. Tireless Energy"
      },
      {
        "p": "In about a dozen years, in his seventies and often in poor health, he circled the globe fourteen times. He lectured, wrote, counselled disciples, and opened more than a hundred temples. He never rested from his mission until his last days in Vṛndāvana."
      },
      {
        "h": "12. Vision and Leadership"
      },
      {
        "p": "He saw what others could not: that the restless youth of the 1960s were searching for exactly what Lord Caitanya offered. He built a worldwide institution with temples, schools, farms, a publishing house, a scientific institute and food relief programmes, and trained thousands of disciples to carry it on."
      }
    ],
    "timeline": [
      {
        "title": "Appearance of Srila Prabhupada",
        "year": "1896",
        "date": "September 1, 1896",
        "place": "Calcutta, Bengal Presidency, British India",
        "text": "Srila Prabhupada appeared in a Vaishnava family in Calcutta on September 1, 1896. From his childhood, he showed a deep inclination toward devotional life and worship of Lord Krishna."
      },
      {
        "title": "Meeting Bhaktisiddhanta Sarasvati Thakura",
        "year": "1922",
        "place": "Calcutta, India",
        "text": "Srila Prabhupada met Srila Bhaktisiddhanta Sarasvati Thakura, the renowned Gaudiya Vaishnava spiritual leader. He was instructed to spread the teachings of Lord Sri Krishna in the English-speaking world."
      },
      {
        "title": "Formal Initiation",
        "year": "1933",
        "place": "Allahabad, India",
        "text": "Srila Prabhupada formally accepted initiation from Srila Bhaktisiddhanta Sarasvati Thakura and continued his spiritual mission with determination."
      },
      {
        "title": "Accepted Sannyasa",
        "year": "1959",
        "place": "Mathura, India",
        "text": "Srila Prabhupada accepted the renounced order of life, dedicating himself completely to spreading the teachings of Krishna consciousness."
      },
      {
        "title": "Journey to the United States",
        "year": "1965",
        "date": "August 13, 1965",
        "place": "Kolkata, India",
        "text": "At the age of 69, Srila Prabhupada departed India aboard the cargo ship Jaladuta to fulfill the instruction of his spiritual master and spread Krishna consciousness in the West."
      },
      {
        "title": "Founded ISKCON",
        "year": "1966",
        "date": "July 11, 1966",
        "place": "New York City, USA",
        "text": "Srila Prabhupada formally established the International Society for Krishna Consciousness (ISKCON) in New York City, creating the foundation for a worldwide spiritual movement."
      },
      {
        "title": "Expansion of Krishna Consciousness Worldwide",
        "year": "1967",
        "date": "1977",
        "place": "Worldwide",
        "text": "Srila Prabhupada traveled extensively, establishing temples, communities, farms, and educational centers while training thousands of disciples in the principles of Krishna consciousness."
      },
      {
        "title": "Opening of Krishna-Balaram Mandir",
        "year": "1975",
        "place": "Vrindavan, Uttar Pradesh, India",
        "text": "Srila Prabhupada established the Krishna-Balaram Mandir in Vrindavan, creating an important spiritual center for ISKCON and devotees from around the world."
      },
      {
        "title": "Disappearance of Srila Prabhupada",
        "year": "1977",
        "date": "November 14, 1977",
        "place": "Vrindavan, Uttar Pradesh, India",
        "text": "Srila Prabhupada departed from this world in Vrindavan on November 14, 1977. His books, teachings, disciples, and worldwide movement continue to carry his spiritual legacy forward."
      }
    ],
    "books": [
      {
        "title": "Bhagavad-gita As It Is",
        "year": "1968",
        "text": "Srila Prabhupada's translation and commentary on the Bhagavad-gita presents the teachings of Lord Sri Krishna through the lens of the Gaudiya Vaishnava tradition. It explains the nature of the self, karma, yoga, devotion, and the ultimate purpose of human life."
      },
      {
        "title": "Srimad-Bhagavatam",
        "year": "1962–1977",
        "text": "A comprehensive translation and commentary on the Srimad-Bhagavatam, one of the principal scriptures of the Gaudiya Vaishnava tradition. Srila Prabhupada's work presents the philosophy, stories, teachings, and devotional wisdom of the Bhagavatam."
      }
    ],
    "lineage": {
      "guru": "srila-bhaktisiddhanta-sarasvati-thakura"
    },
    "pastimes": [
      {
        "title": "Srila Prabhupada's Journey to America",
        "summary": "At the age of 69, Srila Prabhupada traveled from India to America to fulfill the instruction of his spiritual master.",
        "body": [
          "In 1965, Srila Prabhupada embarked on a historic journey to the United States aboard the Jaladuta. He carried with him a small number of books, personal belongings, and an unwavering determination to share the teachings of Lord Sri Krishna.",
          "After arriving in Boston and then traveling to New York, he began his mission with very limited resources. Through his faith, perseverance, and dedication to his spiritual master's instruction, he gradually attracted people to the path of Krishna consciousness."
        ],
        "image": `${R2}/srila-prabhupada-pastime.webp`
      },
      {
        "title": "Chanting in Tompkins Square Park",
        "summary": "Srila Prabhupada introduced the chanting of the Hare Krishna maha-mantra to the public in New York City.",
        "body": [
          "Srila Prabhupada regularly led congregational chanting in Tompkins Square Park in New York City. He would sit beneath a large elm tree, play the traditional mridanga drum, and lead devotees and visitors in chanting the Hare Krishna maha-mantra.",
          "The simple practice of chanting, accompanied by devotional music and dancing, attracted many people and became one of the early public expressions of the Krishna consciousness movement in America."
        ],
        "image": `${R2}/srila-prabhupada-pastime.webp`
      }
    ]
  },
  {
    "slug": "srila-bhaktisiddhanta-sarasvati-thakura",
    "name": "Srila Bhaktisiddhanta Sarasvati Thakura",
    "shortName": "Bhaktisiddhanta Sarasvati",
    "title": "Founder of the Gaudiya Math and spiritual master of Srila Prabhupada",
    "category": "Modern Acharyas",
    "sampradaya": "Brahma-Madhva-Gaudiya",
    "featured": false,
    "years": "6 February 1874 – 1 January 1937",
    "appearance": {
      "date": "6 February 1874",
      "place": "Jagannatha Puri, Odisha"
    },
    "disappearance": {
      "date": "1 January 1937",
      "place": "Calcutta"
    },
    "portrait": `${R2}/srila-bhaktisiddhanta-sarasvati-thakura-portrait.webp`,
    "banner": `${R2}/srila-bhaktisiddhanta-sarasvati-thakura-banner.webp`,
    "summary": "Son of Bhaktivinoda Thakura and spiritual master of Srila Prabhupada, who founded the Gaudiya Math, opened 64 temples, and first sent preachers to the West.",
    "biography": [
      {
        "h": "Introduction"
      },
      {
        "p": "Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura was the spiritual master of His Divine Grace A. C. Bhaktivedanta Swami Prabhupāda and the most powerful preacher of Lord Caitanya's teachings in the early twentieth century. Son of Śrīla Bhaktivinoda Ṭhākura and disciple of Śrīla Gaura Kiśora Dāsa Bābājī Mahārāja, he took the pure teachings his father had revived and spread them across India and beyond, founding the Gauḍīya Maṭh, establishing sixty-four temples, and sending the first Gauḍīya preachers to the West."
      },
      {
        "p": "He was uncompromising in philosophy and fearless in preaching, and was known as the siṁha-guru, the lion guru. He fought caste-ism, sahajiyā imitation and impersonalism, and showed that a Vaiṣṇava is to be honoured for his devotion rather than his birth. Above all, he insisted that the sole duty of a devotee is to spread service to the Lord and His devotees."
      },
      {
        "h": "Appearance in Jagannātha Purī"
      },
      {
        "p": "Bimala Prasāda Datta, later known as Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura, appeared at 3:30 in the afternoon on 6 February 1874, the fifth day of the dark fortnight of the month of Govinda, in Jagannātha Purī, close to the temple of Lord Jagannātha. He was the fourth son of Śrīla Bhaktivinoda Ṭhākura and Śrīmatī Bhagavatī Devī, and appeared as the answer to his father's prayer for a \"ray of Viṣṇu\" to help spread Lord Caitanya's mission."
      },
      {
        "p": "He was born with his umbilical cord wrapped around his body like a brāhmaṇa's sacred thread, and an astrologer found in his chart all thirty-two marks of a mahāpuruṣa, predicting that the child would become world-famous as a teacher of life's ultimate goal. When he was six months old, Lord Jagannātha's Ratha-yātrā cart stopped before his father's house for three days. As his mother held him before the Lord, a garland fell from Lord Jagannātha's neck and encircled the child. His first grains were Jagannātha prasāda, and when his inclination was tested he embraced the Śrīmad-Bhāgavatam, foreshadowing his life as a preacher."
      },
      {
        "h": "Childhood and Education"
      },
      {
        "p": "Bimala Prasāda grew up in Bengal hearing about Kṛṣṇa from his parents. When he was seven, a Deity of Lord Kūrma was unearthed during the construction of Bhakti Bhavan, the family home in Calcutta. Bhaktivinoda Ṭhākura gave the Deity to his son, who worshipped Him daily from then on. By the same age he had memorised the entire Bhagavad-gītā and could explain its verses. His father also gave him the Hare Kṛṣṇa mahā-mantra and a Nṛsiṁha mantra, which he chanted faithfully throughout his life."
      },
      {
        "p": "He had a remarkable memory and could recall perfectly whatever he read once. Trained in printing and proof-reading at his father's press, he helped produce the journal Sajjana-toṣaṇī. He studied mathematics and astronomy with such brilliance that his tutors awarded him the title Siddhānta Sarasvatī. At the request of Śrīla Jagannātha Dāsa Bābājī Mahārāja he compiled the Navadvīpa Pañjikā, a Vaiṣṇava calendar listing the appearance and disappearance days of the associates of Lord Caitanya."
      },
      {
        "p": "In 1892 he entered Sanskrit College in Calcutta, but left in 1895 to devote himself fully to devotional service, saying that he had studied for the service of Śrī Caitanya, not for the cultivation of grammar. From 1895 to 1905 he served the royal family of Tripura in various posts. Throughout this time he lived as a strict celibate. From 1897 he observed the vows of Cāturmāsya strictly, cooking for himself only once a day, eating from the ground and sleeping on the bare earth."
      },
      {
        "h": "Initiation by Śrīla Gaura Kiśora Dāsa Bābājī"
      },
      {
        "p": "Many so-called gurus wanted to make the brilliant son of a magistrate their disciple, but Siddhānta Sarasvatī was not interested in them. When Śrīla Gaura Kiśora Dāsa Bābājī Mahārāja, the renounced paramahaṁsa who came to hear Bhaktivinoda Ṭhākura's discourses at Godruma, saw him, he gave the young man his own chanting ropes, tilaka stamp and articles of worship. Siddhānta Sarasvatī was attracted to the Bābājī's lotus feet at first sight."
      },
      {
        "p": "On his father's urging he asked for initiation in the month of Māgha, 1900. The Bābājī, reluctant to accept such a great scholar, tested him three times. First he said he would ask Mahāprabhu. Next he said he had forgotten to ask. Finally he said that Mahāprabhu had not given permission. Heartbroken, Siddhānta Sarasvatī declared that without his guru's mercy he could not go on living, and he began to weep. His determination melted the Bābājī's heart. He told him to bathe in the Sarasvatī River and then initiated him, giving the name Śrī Vārṣabhānavī-devī-dayita Dāsa, servant of the beloved of Śrīmatī Rādhārāṇī. The episode recalls Lokanātha Gosvāmī's acceptance of Narottama Dāsa Ṭhākura as his only disciple."
      },
      {
        "h": "A Billion Names at Māyāpur"
      },
      {
        "p": "In 1898 he toured Benares, Prayāga and Gayā with his father, and in 1904 and 1905 he travelled through South India, visiting Tirupati, Śrī Raṅgam and other holy places and studying the traditions of the other Vaiṣṇava sampradāyas. He also published biographies of Vaiṣṇava saints in Sajjana-toṣaṇī."
      },
      {
        "p": "In 1905, at the age of thirty-one and on his father's instruction, he began a great vow at the Yogapīṭha, the birthplace of Lord Caitanya in Māyāpur. Following Nāmācārya Haridāsa Ṭhākura, he chanted three hundred thousand names daily, completing one billion names in about nine years. He lived first in a grass hut and, from 1909, in a cottage at Vrajapattana. During this period, in 1906, he initiated his first disciple. In 1913 he set up the Bhāgavat Press in Calcutta, the first of his many printing presses."
      },
      {
        "h": "Defender of Vaiṣṇava Siddhānta"
      },
      {
        "p": "In 1911 a great controversy arose in Bengal. Caste gosvāmīs and smārta brāhmaṇas claimed that a person born outside a brāhmaṇa family could never worship the śālagrāma-śilā or become an ācārya, even after Vaiṣṇava initiation. A conference was called in the Midnapore District. Bhaktivinoda Ṭhākura, bedridden with illness, lamented that there was no one to answer them. In response his son wrote the essay Brāhmaṇa o Vaiṣṇava, comparing brāhmaṇas and Vaiṣṇavas. On hearing it the Ṭhākura sat up in joy and called him \"truly Sarasvatī\"."
      },
      {
        "p": "At the three-day conference, Siddhānta Sarasvatī first recited the scriptural glories of the brāhmaṇas, delighting his opponents, and then explained who a brāhmaṇa truly is, who a Vaiṣṇava is, and what qualifies a guru. On the final day he spoke for two hours, and no one could answer him. Thousands rushed forward to take the dust of his feet. He refused to let anyone touch his feet and always returned obeisances to anyone who offered them. Later that same year he defeated those who claimed that the name Gaura in the Gaura-gāyatrī was not eternal and that Lord Caitanya was not God."
      },
      {
        "h": "Departure of His Gurus"
      },
      {
        "p": "On 23 June 1914 Śrīla Bhaktivinoda Ṭhākura entered the eternal pastimes of the Lord at Bhakti Bhavan in Calcutta. On 17 November 1915, Utthāna Ekādaśī, Śrīla Gaura Kiśora Dāsa Bābājī Mahārāja departed at Kuliya, Navadvīpa. The heads of local temples quarrelled over where to place his body, hoping to profit from the pilgrims who would visit his samādhi. Siddhānta Sarasvatī silenced them by declaring that only a renunciate who had kept himself free from illicit association even for the last few days could touch the body. One by one they left, and he placed his guru in samādhi himself."
      },
      {
        "h": "Sannyāsa and the Gauḍīya Maṭh"
      },
      {
        "p": "Until 1918 he was absorbed mainly in chanting and publishing. Then, at the urging of his disciples, he resolved to preach on a large scale. On the full-moon day of Phālguna, 29 March 1918, at Vrajapattana in Māyāpur, he accepted sannyāsa and the name Śrī Bhaktisiddhānta Sarasvatī Gosvāmī. In November that year the Śrī Bhaktivinoda Āsana was opened at No. 1 Ultadanga Junction Road in Calcutta. In 1920 it became the Gauḍīya Maṭh, the centre of a mission that grew rapidly across India."
      },
      {
        "p": "In 1919 he re-established the Viśva-vaiṣṇava-rāja-sabhā and installed the Deity of Śrīla Bhaktivinoda Ṭhākura at Svānanda-sukhada-kuñja in Godruma. Work began in 1923 on the twenty-nine-pinnacled Śrī Caitanya Maṭh in Māyāpur. Over the next decade he founded temples in Navadvīpa-maṇḍala, throughout Bengal, in Purī, Vṛndāvana, Mathurā, Delhi, Madras and other cities, and abroad in Rangoon, London and Germany, sixty-four in all."
      },
      {
        "h": "Preaching through Print and Pilgrimage"
      },
      {
        "p": "Bhaktisiddhānta Sarasvatī considered the printing press the great mṛdaṅga, which carries the holy name much further than a drum. He established the Bhāgavat Press (1913), the Gauḍīya Printing Works (1923), the Nadia Prakash Printing Press in Māyāpur (1928) and the Paramarthi Printing Works in Cuttack (1936). He published the weekly Gauḍīya from 1922 and the Nadia Prakash, which became a daily newspaper. He also published The Harmonist in English and magazines in Hindi, Oriya and Assamese. When asked how a spiritual daily was possible, he answered that the glories of the Lord could fill a newspaper every second."
      },
      {
        "p": "He personally wrote more than 108 essays and books, including the Gauḍīya Bhāṣya on Caitanya-bhāgavata and the Anubhāṣya on Caitanya-caritāmṛta. He printed the Śrīmad-Bhāgavatam with word-for-word meanings and the works of Madhvācārya and Rāmānujācārya. He organised large diorama exhibitions in Māyāpur, Calcutta, Dacca, Kurukṣetra, Benares and Allahabad. He also revived the annual parikramā of Navadvīpa-dhāma and led thousands on the circumambulation of Vraja-maṇḍala. He identified and marked places sanctified by Lord Caitanya, including the site at Prayāga where the Lord taught Śrīla Rūpa Gosvāmī."
      },
      {
        "h": "Meeting Śrīla Prabhupāda"
      },
      {
        "p": "In 1922, at the Gauḍīya Maṭh in Calcutta, he met a young chemist named Abhay Charan De, who would become His Divine Grace A. C. Bhaktivedanta Swami Prabhupāda. At their very first meeting he asked the young man to preach Lord Caitanya's message in the English language. Śrīla Prabhupāda later recalled that he did not take up the order fully until 1958. When he did, it became the founding mission of the International Society for Krishna Consciousness, through which Bhaktisiddhānta Sarasvatī's desire to spread the holy name throughout the world was fulfilled."
      },
      {
        "h": "Sending the Message to the West"
      },
      {
        "p": "After the Gaura Pūrṇimā festival of 1933 he resolved to send preachers to Europe, in line with the desires of Lord Caitanya and Bhaktivinoda Ṭhākura. On 18 March in Madras he gave farewell instructions to Bhakti Pradīp Tīrtha Mahārāja, Bhakti Hṛdaya Bon Mahārāja and Sambidānanda Prabhu. These were later published as the essay L'Envoi. In them he explained that a preacher attracts others by living the instruction to be humbler than a blade of grass, more tolerant than a tree, free from the desire for honour, and ready to honour everyone."
      },
      {
        "p": "In May 1933 a preaching centre opened in Kensington, London. His preachers corresponded with Lord Zetland and other dignitaries, met King George V and Queen Mary at Buckingham Palace, and spoke with the Archbishop of Canterbury. By the end of the year they had lectured in Germany and France, and from 1934 they spoke at German universities, where interest in Sanskrit and Vedic culture was strong."
      },
      {
        "h": "Final Days and Departure"
      },
      {
        "p": "In October 1936 he went to Jagannātha Purī and there showed signs of illness. At Caṭaka-parvata, which is non-different from Govardhana Hill, he held festivals for Śrī Madhvācārya and for his own guru. He was often heard reciting the prayers of Śrīla Rūpa Gosvāmī and Śrīla Raghunātha Dāsa Gosvāmī, begging Govardhana for a dwelling place near His side. He told his disciples to take up sincere hari-bhajana, for not many days remained, and on 6 December he returned to Calcutta."
      },
      {
        "p": "On the morning of 31 December 1936 he asked for Narottama Dāsa Ṭhākura's song Śrī Rūpa Mañjarī and the Śikṣāṣṭaka to be sung. He had already asked his disciples to form a governing body of ten or twelve devotees to manage the mission. Among his last words were that Ṭhākura Narottama lived on the principles of Rūpa and Raghunātha, and that it is good to follow that path. He blessed all his followers, present and absent, and reminded them that their sole duty and religion was to spread service to the Lord and His devotees. At about 5:30 in the morning on Thursday, 1 January 1937, he left this world uttering the name of Kṛṣṇa."
      },
      {
        "p": "His body was carried in a vast kīrtana procession from Calcutta to Śrīdhāma Māyāpur. There it was taken to the Yogapīṭha, Śrīvāsa-aṅgana and Advaita Bhavana before reaching Vrajapattana, where he had chanted his billion names. After a night of kīrtana, he was placed in samādhi according to the rites of Śrīla Gopāla Bhaṭṭa Gosvāmī's Saṁskāra-dīpikā, while devotees sang his favourite songs."
      },
      {
        "h": "His Legacy"
      },
      {
        "p": "Śrīla Prabhupāda described his spiritual master as a \"Vaikuṇṭha man\" and especially praised his preaching against caste-ism, sahajiyā practices and impersonalism. He united Vaiṣṇavas by stressing what the four sampradāyas share and published the works and biographies of their ācāryas. He organised the Gauḍīya mission with sannyāsīs, temples, presses and a governing body. He also adopted modern means such as motor cars, printing and exhibitions in the Lord's service, setting the pattern Śrīla Prabhupāda later followed worldwide."
      },
      {
        "p": "Most of all, his order to preach in English, given in 1922 to a young man in Calcutta, became the seed of the worldwide Hare Kṛṣṇa movement. Every devotee who chants the holy name today is indebted to Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura."
      }
    ],
    "teachings": [
      {
        "h": "Introduction"
      },
      {
        "p": "Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura did not set out to teach anything new. His mission was to present the original teachings of Śrī Caitanya Mahāprabhu and the Six Gosvāmīs without addition or compromise, and to carry them to every corner of the world. His disciples called him gaura-vāṇī-śrī-mūrti, the personified teachings of Lord Caitanya. The principles below are drawn from his preaching, his writings, and his own example, as remembered by his disciple Śrīla Prabhupāda."
      },
      {
        "h": "1. Our Sole Duty Is to Spread the Holy Name"
      },
      {
        "p": "Among his last words to his disciples was the instruction that their sole duty and religion was to spread service to the Lord and His devotees. For Bhaktisiddhānta Sarasvatī, devotional service was not a private affair. A Vaiṣṇava is para-duḥkha-duḥkhī, one who is pained by the suffering of others, and the greatest welfare work is to give the holy name to people who have forgotten Kṛṣṇa."
      },
      {
        "p": "This conviction shaped his whole mission: temples in busy cities, preaching parties, exhibitions, magazines in many languages, and finally preachers sent to Europe. Śrīla Prabhupāda recalled that his guru did not like to open a centre where few people lived, because devotees are meant not to live peacefully in seclusion but to recruit Kṛṣṇa's eternal servants."
      },
      {
        "h": "2. The Printing Press Is the Bṛhat Mṛdaṅga"
      },
      {
        "p": "When he founded the Bhāgavat Press in 1913, he called it the bṛhat mṛdaṅga, the great drum. An ordinary kīrtana can be heard only a few streets away, but a printed book carries the holy name and the conclusions of the Gosvāmīs far and wide, across countries and generations."
      },
      {
        "p": "For this reason he made publishing the heart of his mission. He printed the Śrīmad-Bhāgavatam, Caitanya-caritāmṛta and the works of the Gosvāmīs and other ācāryas, and he ran presses and journals in several languages. Śrīla Prabhupāda took this instruction to heart, and book distribution became the backbone of ISKCON."
      },
      {
        "h": "3. Preaching Is Better than Imitative Solitary Bhajana"
      },
      {
        "p": "Bhaktisiddhānta Sarasvatī strongly criticised nirjana-bhajana, chanting in seclusion by those who are not yet qualified for it. In his song beginning duṣṭa mana! tumi kisera vaiṣṇava, he rebukes the mind for chanting in a solitary place merely to gain a reputation for renunciation, calling such chanting cheating."
      },
      {
        "p": "The real Vaiṣṇava does not desire material profit, fame or adoration. He thinks only of how to benefit suffering humanity. Chanting in the association of devotees and engaging in preaching purifies the heart far more than an artificial show of advanced bhajana. He himself chanted a billion names in Māyāpur, but he did so to prepare for a lifetime of preaching, not to withdraw from the world."
      },
      {
        "h": "4. A Vaiṣṇava Is Judged by Devotion, Not by Birth"
      },
      {
        "p": "Bhaktisiddhānta Sarasvatī's best-known battle was against caste-ism. Following Lord Caitanya's statement kibā vipra, kibā nyāsī, śūdra kene naya, yei kṛṣṇa-tattva-vettā, sei 'guru' haya, he taught that whoever knows the science of Kṛṣṇa is fit to be a guru, whatever family he was born in. At the Midnapore conference of 1911 he proved from scripture that a properly initiated Vaiṣṇava is fully qualified to worship the śālagrāma-śilā and to act as an ācārya."
      },
      {
        "p": "Śrīla Prabhupāda said this was his guru's great contribution: he defeated the caste gosvāmīs and their hereditary claims, just as Lord Caitanya had done. His opponents were so angered that they once tried to bribe a police officer so that they could harm him, but even the officer refused to act against a sādhu."
      },
      {
        "h": "5. Daiva-varṇāśrama: Position by Qualification"
      },
      {
        "p": "He spoke widely on daiva-varṇāśrama, the divine social order described in the Bhagavad-gītā, in which a person's place is decided by his qualities and work rather than by his birth. Brāhmaṇas, sannyāsīs and teachers should be recognised by their character, knowledge and devotion. He applied this principle in the Gauḍīya Maṭh by giving brāhmaṇa initiation and sannyāsa to qualified devotees from any background, and he revived the Vedic tridaṇḍi sannyāsa order for Vaiṣṇava preachers."
      },
      {
        "h": "6. Lord Caitanya Is the Supreme Lord"
      },
      {
        "p": "He firmly established that Śrī Caitanya Mahāprabhu is Kṛṣṇa Himself, and that His name, form, qualities and pastimes are eternal. When scholars claimed in 1911 that the name Gaura in the Gaura-gāyatrī was not eternal, he cited the Caitanya Upaniṣad, the Śvetāśvatara Upaniṣad, the Purāṇas and the Śrīmad-Bhāgavatam to prove them wrong. Largely because of his preaching, the Deity of Lord Caitanya is now worshipped throughout India, and the Gaura mantra is received by devotees everywhere."
      },
      {
        "h": "7. Follow Śrī Rūpa and Śrī Raghunātha"
      },
      {
        "p": "Bhaktisiddhānta Sarasvatī called himself a rūpānuga, a follower of Śrīla Rūpa Gosvāmī. He taught that Śrīla Sanātana, Rūpa and Raghunātha Dāsa Gosvāmīs are the ācāryas of sambandha (our relationship with Kṛṣṇa), abhidheya (the practice of devotional service) and prayojana (the goal of pure love), respectively, and that their writings contain the complete teachings of Lord Caitanya."
      },
      {
        "p": "In his last days he said that Ṭhākura Narottama lived on the principles of Rūpa and Raghunātha, and that it is good to follow that path. He would not tolerate any teaching that contradicted the Gosvāmīs, however popular it might be."
      },
      {
        "h": "8. No Compromise with Philosophical Error"
      },
      {
        "p": "He was known as the siṁha-guru, the lion guru, because he never compromised the truth. He preached against Māyāvāda impersonalism and voidism, which deny the personal form of the Lord. He also opposed sahajiyā groups who imitate the intimate pastimes of Rādhā and Kṛṣṇa while ignoring regulative principles, and false incarnations and so-called yogīs who mislead the public."
      },
      {
        "p": "Some of his own Godbrothers complained that his strong, \"chopping\" style of preaching would fail. He answered by example, and Śrīla Prabhupāda observed that it was those critics who fell away. In his view, truth spoken without compromise is the greatest kindness, because it saves people from being cheated."
      },
      {
        "h": "9. The Unity of the Four Vaiṣṇava Sampradāyas"
      },
      {
        "p": "Although uncompromising in philosophy, he was a unifier of Vaiṣṇavas. He taught that the four authorised sampradāyas, those of Madhvācārya, Rāmānujācārya, Viṣṇusvāmī and Nimbārkācārya, all agree that the Lord is the Supreme Eternal Person, to be served eternally by the living beings, and all refuted Śaṅkarācārya's impersonalism. Lord Caitanya accepted the best conclusions of each ācārya and completed them in His philosophy of acintya-bhedābheda-tattva, inconceivable oneness and difference."
      },
      {
        "p": "To show this harmony, the Śrī Caitanya Maṭh in Māyāpur honours the four sampradāya ācāryas in alcoves at its four corners. He visited their holy places, studied their worship, and published their writings and biographies."
      },
      {
        "h": "10. The Qualities of a Preacher"
      },
      {
        "p": "In 1933, sending his first preachers to Europe, he gave them instructions later published as L'Envoi. He reminded them that the highest function of the soul is to chant the glories of Hari while being humbler than a blade of grass, more tolerant than a tree, seeking no honour for oneself and offering honour to all. He said that his own guru had attracted him by living these four principles, and that his disciples could attract the whole world only by the same method."
      },
      {
        "p": "He practised this himself. He never allowed anyone to touch his feet, and whenever someone offered him obeisances he immediately offered obeisances in return. He even addressed his disciples as his friends."
      },
      {
        "h": "11. The Disciple Should Remain a Fool before the Guru"
      },
      {
        "p": "His own initiation showed the determination needed to receive a pure devotee's mercy. Refused three times by Gaura Kiśora Dāsa Bābājī, he declared that he could not live without his guru's mercy. Though a renowned scholar, he always remained a humble servant before his outwardly unlettered guru."
      },
      {
        "p": "Śrīla Prabhupāda drew from this the lesson that a disciple should remain a fool before the spiritual master, not artificially but sincerely. As soon as a disciple thinks himself wiser than the guru, his progress is lost. In the absolute realm the master and the fool reciprocate in love."
      },
      {
        "h": "12. Devotion Is the Key to Scripture"
      },
      {
        "p": "He taught that the śāstras cannot be understood by scholarship alone. As Śrīla Prabhupāda remembered him saying, for one who is not engaged in devotional service, reading all the books is like licking the outside of a honey jar. The sweetness is inside, and only service to Kṛṣṇa opens the jar. Practical devotion under a bona fide guru is therefore the real secret of understanding the scriptures."
      },
      {
        "h": "13. Strict Sādhana and Firm Vows"
      },
      {
        "p": "As a small boy, he once took a mango before it had been offered to the Deity. When his father pointed this out, he vowed never to eat mangoes again, and he kept that vow for the rest of his life. He lived as a strict brahmacārī from childhood, observed Cāturmāsya by eating from the ground and sleeping on the bare earth, and chanted three hundred thousand names daily for nine years."
      },
      {
        "p": "By this example he taught that everything should first be offered to the Lord, and that a devotee's resolve must be unshakeable. Śrīla Prabhupāda said this is the characteristic of the ācārya: he teaches by his own actions."
      },
      {
        "h": "14. Engage Everything in Kṛṣṇa's Service"
      },
      {
        "p": "Bhaktisiddhānta Sarasvatī did not reject the modern world. He used it for Kṛṣṇa. Presses, newspapers, motor cars, railways, dioramas and large public exhibitions all became instruments of preaching in his hands. This is yukta-vairāgya, practical renunciation, as taught by Śrīla Rūpa Gosvāmī: renunciation means not giving up things but using everything in the Lord's service, without personal attachment. Śrīla Prabhupāda followed the same principle worldwide."
      },
      {
        "h": "15. Cooperate for the Mission"
      },
      {
        "p": "Foreseeing the needs of the mission after his departure, he asked his disciples to form a governing body of ten or twelve devotees to manage its affairs together. One of his final statements was that \"love and rupture both should have the same end in view\": whether in agreement or disagreement, devotees must keep the service of the Lord as their single aim. Śrīla Prabhupāda later carried this instruction forward by forming the Governing Body Commission of ISKCON."
      }
    ],
    "qualities": [
      {
        "h": "Introduction"
      },
      {
        "p": "Śrīla Prabhupāda said that the ācārya teaches by his own actions. Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura's life shows the qualities of a pure Vaiṣṇava in a striking combination: he was a lion in defending the truth and humbler than a blade of grass in his personal dealings, a strict renunciate and a tireless organiser. The qualities below are drawn from incidents in his life."
      },
      {
        "h": "1. Fearlessness in Upholding the Truth"
      },
      {
        "p": "He was called the siṁha-guru, the lion guru, because he never compromised the teachings of Lord Caitanya. He stood alone against the caste gosvāmīs and smārtas, against sahajiyā groups and against impersonalists, even when it made him powerful enemies. His opponents once tried to bribe a police officer so that they could harm him. The officer refused and warned him, but he never softened his preaching."
      },
      {
        "p": "Śrīla Prabhupāda recalled that so-called saints, avatāras and yogīs who were false were all enemies of his guru, because he never compromised."
      },
      {
        "h": "2. Deep Humility"
      },
      {
        "p": "The same lion was personally the humblest of servants. He did not allow anyone to touch his feet, and whenever someone offered him obeisances he returned them at once. At the 1911 Midnapore conference, when the guards forcibly washed his feet to give the water to the crowd, he protested strongly. He addressed his disciples as his friends, and though a great scholar he remained a humble servant before his guru, who outwardly could not even read."
      },
      {
        "h": "3. Unwavering Dedication to His Guru"
      },
      {
        "p": "When Gaura Kiśora Dāsa Bābājī refused three times to initiate him, he did not give up. He declared that he could not live without his guru's mercy, and his tears finally won it. He served his guru faithfully, and at the Bābājī's departure he alone stood up to those who wanted his body for profit, and placed him in samādhi himself."
      },
      {
        "p": "Gaura Kiśora Dāsa Bābājī, who never allowed anyone to touch his feet, placed them on his disciple's head and called him \"my Prabhu\", saying he saw the renunciation of Śrī Rūpa and Śrī Raghunātha manifest in him."
      },
      {
        "h": "4. Renunciation and Austerity"
      },
      {
        "p": "He lived as a strict brahmacārī from childhood. During Cāturmāsya he cooked one simple preparation, ate it from the floor and slept on the bare ground without a pillow. For nine years he chanted three hundred thousand names a day in a grass hut and then a simple cottage at Māyāpur. When the roof leaked, he held an umbrella and went on chanting rather than lose time repairing it. He accepted a pension from the Tripura royal family for some time and then gave it up."
      },
      {
        "h": "5. Determination in Keeping Vows"
      },
      {
        "p": "As a small boy he ate a mango before it had been offered to the Lord. When his father corrected him, he vowed never to eat mangoes again and kept that vow all his life, even when his disciples later offered him mangoes. He completed his vow of a billion names in spite of travel and difficulties. His resolve, once taken, was never broken."
      },
      {
        "h": "6. Scholarship and Brilliance"
      },
      {
        "p": "He had an extraordinary memory and could recall anything he had read once. By seven he knew the Bhagavad-gītā by heart, and his tutors gave him the title Siddhānta Sarasvatī for his mastery of astronomy and mathematics. He compiled the Vaiṣṇava-mañjuṣā encyclopedia, wrote over 108 books and essays, and once gave thirty interpretations of a single Vedānta-sūtra verse. Śrīla Prabhupāda said he was called a \"living encyclopedia\", able to speak with anyone on any subject."
      },
      {
        "p": "Yet he valued learning only in Kṛṣṇa's service. He left Sanskrit College because he had studied for the service of Śrī Caitanya, not for the cultivation of grammar."
      },
      {
        "h": "7. Compassion for Suffering Souls"
      },
      {
        "p": "Śrīla Prabhupāda described his guru as para-duḥkha-duḥkhī, one who is pained by others' suffering, and as a \"cent per cent Vaiṣṇava\". His sharp preaching came from compassion: he wanted to save people from being cheated by false teachers. When one of his sannyāsī disciples was dragged back to family life, he wept, lamenting that he could not save that soul."
      },
      {
        "h": "8. Tireless Preaching Spirit"
      },
      {
        "p": "He did not want to live peacefully in seclusion. He opened centres in populated cities, led thousands on parikramā, held exhibitions across India, and lectured, wrote and debated wherever he went. In twenty years he established sixty-four temples and sent preachers to Europe. Even in his final illness at Purī he lectured for a month and a half, urging his disciples to take up sincere hari-bhajana."
      },
      {
        "h": "9. Vision and Organisational Genius"
      },
      {
        "p": "He built a worldwide mission from almost nothing. He organised sannyāsīs, brahmacārīs and householders into an active preaching society, set up printing presses and magazines in several languages, and even launched a daily newspaper. Foreseeing the future, he asked his disciples to form a governing body to manage the mission after him. Śrīla Prabhupāda later adopted this model in ISKCON."
      },
      {
        "h": "10. Respect for All Vaiṣṇava Traditions"
      },
      {
        "p": "Though firm in Gauḍīya siddhānta, he honoured the four Vaiṣṇava sampradāyas. He visited their holy places, studied their worship, published the works and lives of Madhvācārya and Rāmānujācārya, and gave their ācāryas places of honour on the Śrī Caitanya Maṭh in Māyāpur. He sought to unite the Vaiṣṇava world on the common ground of service to the Supreme Person."
      },
      {
        "h": "11. Practical Use of Everything for Kṛṣṇa"
      },
      {
        "p": "He did not reject modern means but used them for preaching: the printing press, which he called the bṛhat mṛdaṅga, along with newspapers, motor cars and railway travel, and dioramas and public exhibitions. In this he embodied yukta-vairāgya, renunciation by engaging everything in the Lord's service without personal attachment."
      },
      {
        "h": "12. Absorption in Rādhā-Kṛṣṇa and the Holy Name"
      },
      {
        "p": "Behind all his outer activity was deep inner absorption. His initiated name, Vārṣabhānavī-devī-dayita Dāsa, means servant of the one dear to Śrīmatī Rādhārāṇī. In his last days at Purī he constantly recited the prayers of Śrīla Rūpa and Raghunātha Gosvāmīs to Govardhana, and before departing he asked to hear Śrī Rūpa Mañjarī and the Śikṣāṣṭaka. He left this world chanting the name of Kṛṣṇa."
      },
      {
        "h": "Summary"
      },
      {
        "p": "Fearlessness, humility, dedication to guru, renunciation, determination, scholarship, compassion, preaching zeal, vision, respect for other Vaiṣṇavas, practical renunciation, and deep absorption in Kṛṣṇa are the qualities that made Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura the ācārya who prepared the way for the worldwide Hare Kṛṣṇa movement."
      }
    ],
    "timeline": [
      {
        "title": "Appearance",
        "year": "1874",
        "date": "6 February 1874",
        "place": "Jagannatha Puri",
        "text": "Born to Bhaktivinoda Thakura and Bhagavati Devi."
      },
      {
        "title": "Enters Sanskrit College",
        "year": "1892",
        "place": "Calcutta",
        "text": "Began college at eighteen; left in 1895."
      },
      {
        "title": "Initiation",
        "year": "1900",
        "date": "Magha, 1900",
        "place": "Godruma, Navadvip",
        "text": "Initiated by Gaura Kishora Dasa Babaji."
      },
      {
        "title": "Begins vow of chanting a billion names",
        "year": "1905",
        "place": "Yogapitha, Mayapur",
        "text": "Followed Haridasa Thakura's example."
      },
      {
        "title": "Brahmana and Vaishnava debate",
        "year": "1911",
        "place": "Midnapore",
        "text": "Established the position of a Vaishnava above caste brahmanas."
      },
      {
        "title": "Accepts sannyasa",
        "year": "1918",
        "date": "29 March 1918",
        "place": "Mayapur",
        "text": "Took the name Bhaktisiddhanta Sarasvati Gosvami."
      },
      {
        "title": "Gaudiya Math established",
        "year": "1920",
        "place": "Calcutta",
        "text": "The Bhaktivinoda Asana was renamed the Gaudiya Math."
      },
      {
        "title": "Meets Srila Prabhupada",
        "year": "1922",
        "place": "Calcutta",
        "text": "Asked him to preach Lord Chaitanya's message in English."
      },
      {
        "title": "Sends preachers to the West",
        "year": "1933",
        "place": "London; Germany",
        "text": "Gaudiya preachers lectured in England and Germany."
      },
      {
        "title": "Disappearance",
        "year": "1937",
        "date": "1 January 1937",
        "place": "Calcutta",
        "text": "Departed after establishing 64 temples."
      }
    ],
    "books": [
      {
        "title": "Navadvipa Panjika",
        "text": "The Vaishnava calendar, begun at the request of Jagannatha Dasa Babaji."
      },
      {
        "title": "Gaudiya Bhashya on Chaitanya-bhagavata",
        "text": "Commentary on Vrindavana Dasa Thakura's biography of Lord Chaitanya."
      },
      {
        "title": "Anubhashya on Chaitanya-charitamrita",
        "text": "Commentary on Sri Chaitanya-charitamrita."
      },
      {
        "title": "Achar and Acharya",
        "year": "1921",
        "text": "On the conduct and qualifications of a true acharya."
      },
      {
        "title": "The Gaudiya (magazine)",
        "year": "1922",
        "text": "Weekly journal of the Gaudiya Math."
      },
      {
        "title": "Nadia Prakash",
        "year": "1926",
        "text": "Magazine that became a daily newspaper."
      },
      {
        "title": "The Vedanta: Its Morphology and Ontology",
        "year": "1933",
        "text": "Lecture later reprinted in Back to Godhead magazine."
      }
    ],
    "lineage": {
      "guru": "srila-gaura-kishora-dasa-babaji-maharaja",
      "disciple": "srila-prabhupada"
    }
  },
  {
    "slug": "srila-gaura-kishora-dasa-babaji-maharaja",
    "name": "Srila Gaura Kishora Dasa Babaji Maharaja",
    "shortName": "Gaura Kishora Dasa Babaji",
    "title": "Paramahamsa babaji and spiritual master of Bhaktisiddhanta Sarasvati Thakura",
    "category": "Modern Acharyas",
    "sampradaya": "Brahma-Madhva-Gaudiya",
    "featured": false,
    "years": "1830s – 17 November 1915 (Utthana Ekadashi)",
    "appearance": {
      "date": "1830s",
      "place": "Vagyana, Faridpur, East Bengal"
    },
    "disappearance": {
      "date": "17 November 1915 (Utthana Ekadashi)",
      "place": "Kuliya, Navadvip"
    },
    "portrait": `${R2}/srila-gaura-kishora-dasa-babaji-maharaja-portrait.webp`,
    "banner": `${R2}/srila-gaura-kishora-dasa-babaji-maharaja-banner.webp`,
    "summary": "Renunciation personified, the illiterate paramahamsa who initiated Bhaktisiddhanta Sarasvati Thakura and taught by fearless example against hypocrisy.",
    "biography": [
      {
        "p": "Srila Gaura Kishora Dasa Babaji Maharaja, renunciation personified, appeared in the 1830s at Vagyana in Faridpur, East Bengal. He was a grain broker and householder for over twenty years. After his wife's death he took babaji initiation in Vrindavan from Bhagavata Dasa Babaji and wandered Vraja for about thirty years. From 1897 he lived in Navadvip, begging dry grains, wearing discarded cloth and refusing all comfort. He once stayed in a latrine to keep away people who came with material motives. Though blind in his last years, he exposed hypocrisy fearlessly and accepted Bhaktivinoda Thakura as his instructing guru. His one initiated disciple was Srila Bhaktisiddhanta Sarasvati Thakura. When he departed on 16 November 1915 at Kuliya, Bhaktisiddhanta Sarasvati faced down the rival babajis who wanted his body for profit and personally placed him in samadhi."
      },
      {
        "p": "He fasted completely on Ekadashi, even from water, and said that one who wants bhojana (palatable eating) spoils his bhajana. He regularly came to hear Bhaktivinoda Thakura's Bhagavatam classes at Svananda-sukhada-kunja. When Bhaktisiddhanta Sarasvati asked for initiation, he tested him three times before accepting him. Once, ashamed of hypocrites in babaji dress, he wore a fine dhoti and shawl, saying it was better to dress as a gentleman than to wear a loincloth and live immorally. He gave up a servant who secretly sent his donations to his father-in-law."
      }
    ],
    "teachings": [
      {
        "p": "Chant the holy name in the association of devotees rather than in imitation of solitary bhajana; ecstasy should be hidden, not displayed; and the harsh words of a sadhu are medicine to drive away maya."
      }
    ],
    "qualities": [
      {
        "p": "Renunciation, Fearlessness, Hatred of hypocrisy, Humility, Independence from material support"
      }
    ],
    "timeline": [
      {
        "title": "Appearance",
        "year": "1830",
        "date": "1830s",
        "place": "Vagyana, Faridpur",
        "text": "Born into a vaishya family; known as Vamsidasa."
      },
      {
        "title": "Babaji initiation",
        "place": "Vrindavan",
        "text": "Accepted babaji dress from Bhagavata Dasa Babaji."
      },
      {
        "title": "Moves to Navadvip",
        "year": "1897",
        "date": "Phalguna, 1897",
        "place": "Navadvip",
        "text": "Came on the instruction of Jagannatha Dasa Babaji."
      },
      {
        "title": "Initiates Bhaktisiddhanta Sarasvati",
        "year": "1900",
        "date": "Magha, 1900",
        "place": "Svananda-sukhada-kunja, Godruma",
        "text": "Accepted his only disciple after testing him."
      },
      {
        "title": "Loses his eyesight",
        "year": "1908",
        "place": "Navadvip",
        "text": "Became fully blind but continued his bhajana."
      },
      {
        "title": "Disappearance",
        "year": "1915",
        "date": "17 November 1915 (Utthana Ekadashi)",
        "place": "Kuliya, Navadvip",
        "text": "Bhaktisiddhanta Sarasvati placed him in samadhi."
      }
    ],
    "books": [],
    "lineage": {
      "guru": "srila-bhaktivinoda-thakura",
      "disciple": "srila-bhaktisiddhanta-sarasvati-thakura"
    }
  },
  {
    "slug": "srila-bhaktivinoda-thakura",
    "name": "Srila Bhaktivinoda Thakura",
    "shortName": "Bhaktivinoda Thakura",
    "title": "The Seventh Goswami, pioneer of the modern Krishna consciousness movement",
    "category": "Modern Acharyas",
    "sampradaya": "Brahma-Madhva-Gaudiya",
    "featured": false,
    "years": "2 September 1838 – 23 June 1914",
    "appearance": {
      "date": "2 September 1838",
      "place": "Birnagar (Ula), Nadia, West Bengal"
    },
    "disappearance": {
      "date": "23 June 1914",
      "place": "Bhakti Bhavan, Calcutta"
    },
    "portrait": `${R2}/srila-bhaktivinoda-thakura-portrait.webp`,
    "banner": `${R2}/srila-bhaktivinoda-thakura-banner.webp`,
    "summary": "Magistrate, author and acharya who revived Lord Chaitanya's movement, discovered His birthplace at Mayapur, and sent His teachings to the West.",
    "biography": [
      {
        "p": "Srila Bhaktivinoda Thakura (1838-1914), born Kedarnath Datta at Birnagar (Ula) in Nadia, revived Lord Chaitanya's movement when its pure teachings had nearly been lost. While serving as a deputy magistrate and raising a large family, he wrote over a hundred books, songs and essays explaining the philosophy of Mahaprabhu and the Goswamis, including Jaiva Dharma, Sri Chaitanya Shikshamrita and Harinama Chintamani. With Jagannatha Dasa Babaji he identified Mahaprabhu's birthplace at Mayapur. He organised the nama-hatta preaching programme and first sent Lord Chaitanya's teachings to the West. He was the instructing guru of Gaura Kishora Dasa Babaji and the father of Srila Bhaktisiddhanta Sarasvati, through whom his mission spread worldwide. On 23 June 1914 he entered the Lord's eternal pastimes at Bhakti Bhavan in Calcutta; his samadhi is at Godruma, Navadvip."
      },
      {
        "p": "Born Kedarnath Datta to Ananda-chandra Datta and Jagat-mohini Devi, he faced many hardships in youth and studied in Calcutta. He worked as a teacher in Odisha and then rose to deputy magistrate, serving in many districts. In Puri he stopped the false incarnation Bisakisen, and in Narail he began his great literary output. From 1885 his Chaitanya Press at Bhakti Bhavan published the Goswamis' works, and his magazine Sajjana-toshani spread their message. After retiring in 1894 he worshipped at Svananda-sukhada-kunja in Godruma and preached the nama-hatta throughout Bengal. In 1896 his Sri Gauranga-smarana-mangala reached McGill University in Canada."
      }
    ],
    "teachings": [
      {
        "p": "The holy name is the essence of Lord Chaitanya's teachings; Mahaprabhu's message is for all humanity; and a devotee is to be recognised by devotion, not by caste or outward dress."
      }
    ],
    "qualities": [
      {
        "p": "Scholarship, Purity, Tireless preaching, Humility, Exemplary householder life"
      }
    ],
    "timeline": [
      {
        "title": "Appearance",
        "year": "1838",
        "date": "2 September 1838",
        "place": "Birnagar (Ula), Nadia",
        "text": "Born to Ananda-chandra Datta and Jagat-mohini Devi."
      },
      {
        "title": "Appointed Deputy Magistrate",
        "year": "1866",
        "date": "5 February 1866",
        "place": "Chapra",
        "text": "Began his career as a government magistrate."
      },
      {
        "title": "Writes Datta-kaustubha",
        "year": "1874",
        "place": "Puri",
        "text": "Composed 104 Sanskrit verses on Vaishnava philosophy."
      },
      {
        "title": "Begins Sajjana-toshani",
        "year": "1881",
        "place": "Calcutta",
        "text": "Launched his Bengali spiritual journal."
      },
      {
        "title": "Literary outpouring and Vishva Vaishnava Sabha",
        "year": "1886",
        "place": "Calcutta",
        "text": "Published the Gita with Rasika-ranjana and founded the Sabha."
      },
      {
        "title": "Discovers Lord Chaitanya's birthplace",
        "year": "1888",
        "place": "Mayapur",
        "text": "Identified the Yogapitha as the Lord's birthsite."
      },
      {
        "title": "Retires from government service",
        "year": "1894",
        "date": "October 1894",
        "place": "Calcutta",
        "text": "Devoted himself fully to preaching."
      },
      {
        "title": "Deity installation at the Yogapitha",
        "year": "1895",
        "date": "21 March 1895",
        "place": "Mayapur",
        "text": "A grand installation ceremony was held on Gaura Purnima."
      },
      {
        "title": "Sends Lord Chaitanya's teachings West",
        "year": "1896",
        "place": "Calcutta",
        "text": "Sri Gauranga-smarana-mangala reached McGill University."
      },
      {
        "title": "Enters seclusion",
        "year": "1910",
        "place": "Bhakti Bhavan, Calcutta",
        "text": "Withdrew into uninterrupted bhajana."
      },
      {
        "title": "Disappearance",
        "year": "1914",
        "date": "23 June 1914",
        "place": "Bhakti Bhavan, Calcutta",
        "text": "Departed at noon; his samadhi is at Godruma, Navadvip."
      }
    ],
    "books": [
      {
        "title": "Datta-kaustubha",
        "year": "1874",
        "text": "A Sanskrit work of 104 verses on Vaishnava philosophy."
      },
      {
        "title": "Kalyana-kalpataru",
        "year": "1880",
        "text": "A book of Bengali devotional songs."
      },
      {
        "title": "Sajjana-toshani (magazine)",
        "year": "1881",
        "text": "His Bengali spiritual journal."
      },
      {
        "title": "Bhagavad-gita with Rasika-ranjana",
        "year": "1886",
        "text": "Edition with Vishvanatha Chakravarti's commentary and his own."
      },
      {
        "title": "Amrita-pravaha-bhashya",
        "year": "1886",
        "text": "Commentary on Sri Chaitanya-charitamrita."
      },
      {
        "title": "Bhagavad-gita with Vidvad-ranjana",
        "year": "1891",
        "text": "Edition with Baladeva Vidyabhushana's Gita-bhushana and his own commentary."
      },
      {
        "title": "Sriman Mahaprabhur Shiksha",
        "year": "1892",
        "text": "The teachings of Lord Chaitanya in eleven chapters."
      },
      {
        "title": "Tattva-viveka",
        "year": "1893",
        "text": "A comparison of Vaishnava philosophy with other systems."
      },
      {
        "title": "Vedarka-didhiti",
        "year": "1894",
        "text": "Sanskrit commentary on Sri Ishopanishad."
      },
      {
        "title": "Sri Gauranga-smarana-mangala",
        "year": "1896",
        "text": "Sent to universities in the West; found at McGill University."
      },
      {
        "title": "Brahma-samhita with Prakashini",
        "year": "1897",
        "text": "Translation and commentary on the fifth chapter of Brahma-samhita."
      },
      {
        "title": "Navadvipa-bhava-taranga",
        "year": "1899",
        "text": "168 verses on the holy places of Navadvip."
      },
      {
        "title": "Harinama-chintamani",
        "year": "1900",
        "text": "Haridasa Thakura's teachings on the holy name."
      },
      {
        "title": "Bhagavatarka-marichi-mala",
        "year": "1901",
        "text": "Selected verses of Srimad-Bhagavatam arranged by topic."
      },
      {
        "title": "Bhajana-rahasya",
        "year": "1902",
        "text": "A supplement to Harinama-chintamani."
      },
      {
        "title": "Sva-niyama-dvadashakam",
        "year": "1907",
        "text": "Twelve verses of self-imposed vows; his last known work."
      }
    ],
    "lineage": {
      "guru": "srila-jagannatha-dasa-babaji-maharaja",
      "disciple": "srila-gaura-kishora-dasa-babaji-maharaja"
    }
  },
  {
    "slug": "srila-jagannatha-dasa-babaji-maharaja",
    "name": "Srila Jagannatha Dasa Babaji Maharaja",
    "shortName": "Jagannatha Dasa Babaji",
    "title": "Vaishnava Sarvabhauma, who confirmed Lord Chaitanya's birthplace",
    "category": "Modern Acharyas",
    "sampradaya": "Brahma-Madhva-Gaudiya",
    "featured": false,
    "years": "c. 1750 – Phalguna new moon, after 1897",
    "appearance": {
      "date": "c. 1750",
      "place": "Tangail, Mymensingh, East Bengal"
    },
    "disappearance": {
      "date": "Phalguna new moon, after 1897",
      "place": "Kuliya, Navadvip"
    },
    "portrait": `${R2}/srila-jagannatha-dasa-babaji-maharaja-portrait.webp`,
    "banner": `${R2}/srila-jagannatha-dasa-babaji-maharaja-banner.webp`,
    "summary": "Honoured as Vaishnava Sarvabhauma, chief of the Vaishnavas, he confirmed Lord Chaitanya's birthplace in Mayapur and guided Bhaktivinoda Thakura.",
    "biography": [
      {
        "p": "Srila Jagannatha Dasa Babaji Maharaja, honoured by Bhaktivinoda Thakura as Vaishnava Sarvabhauma, chief of the Vaishnavas, appeared around 1750 in Mymensingh, East Bengal, and received babaji initiation in the line of Baladeva Vidyabhushana. A renowned siddha-baba, he divided his years between Vraja and Navadvip and lived to a great age. In old age his servant Bihari carried him in a basket, yet in kirtan he would leap up and dance. In 1893, at the site Bhaktivinoda Thakura had found, he jumped from his basket and danced in ecstasy, confirming it as Mahaprabhu's birthplace. He also asked the young Bhaktisiddhanta Sarasvati to prepare a Vaishnava calendar of the appearance and disappearance days of the Lord's associates. He gave his Govardhana-shila to Bhaktivinoda Thakura. He departed on the new-moon day of Phalguna, two weeks before Gaura Purnima, and his samadhi is at Koladvipa (Kuliya), Navadvip."
      },
      {
        "p": "He chanted for days without sleep, followed the Chaturmasya vows strictly, and once restarted a three-month purascharana vow because he had spoken a word to Bihari. He returned a rupee to a rich man, saying he could not bear its weight, and once bought rasagullas for the cows of Navadvip rather than feed hypocrites in babaji dress. He lived thirty-two years at Kuliya, offered a thousand obeisances daily to his Giridhari, and said the best time to chant is from 3 to 7 in the morning and from sunset to 11 at night."
      }
    ],
    "teachings": [
      {
        "p": "Constant chanting of the holy name and service to the Vaishnavas are the life of a devotee; the residents of the dhama are to be honoured; and the Bhagavatam must never be recited as a business."
      }
    ],
    "qualities": [
      {
        "p": "Renunciation, Humility, Ecstatic kirtan, Respect for dhama-vasis, Freedom from desire for fame"
      }
    ],
    "timeline": [
      {
        "title": "Appearance",
        "year": "1750",
        "date": "c. 1750",
        "place": "Tangail, Mymensingh",
        "text": "Born into an aristocratic family."
      },
      {
        "title": "Babaji initiation",
        "place": "Vraja",
        "text": "Accepted babaji initiation from Madhusudana Dasa Babaji."
      },
      {
        "title": "Instructs Bhaktivinoda Thakura",
        "year": "1880",
        "place": "Vrindavan",
        "text": "Bhaktivinoda Thakura received many instructions from him."
      },
      {
        "title": "Confirms Lord Chaitanya's birthplace",
        "year": "1893",
        "place": "Yogapitha, Mayapur",
        "text": "Leapt from his basket and danced at the site."
      },
      {
        "title": "Commissions the Navadvipa Panjika",
        "place": "Kuliya, Navadvip",
        "text": "Asked Bhaktisiddhanta Sarasvati to compile a Vaishnava calendar."
      },
      {
        "title": "Disappearance",
        "year": "Phalguna new moon, after 1897",
        "place": "Kuliya, Navadvip",
        "text": "Departed two weeks before Gaura Purnima."
      }
    ],
    "books": [],
    "lineage": {
      "disciple": "srila-bhaktivinoda-thakura"
    }
  },
  {
    "slug": "srila-rupa-gosvami",
    "name": "Srila Rupa Gosvami",
    "shortName": "Rupa Gosvami",
    "title": "Foremost of the Six Goswamis of Vrindavan",
    "category": "Six Goswamis",
    "sampradaya": "Brahma-Madhva-Gaudiya",
    "featured": false,
    "years": "1489 – 1564",
    "appearance": {
      "date": "1489",
      "place": "Bakla-Chandradvip (Barisal), East Bengal"
    },
    "disappearance": {
      "date": "1564",
      "place": "Vrindavan"
    },
    "portrait": `${R2}/srila-rupa-gosvami-portrait.webp`,
    "banner": `${R2}/srila-rupa-gosvami-banner.webp`,
    "summary": "The leader of the Six Goswamis and author of Bhakti-rasamrita-sindhu, whose followers, the rupanugas, include every Gaudiya Vaishnava.",
    "biography": [
      {
        "p": "Srila Rupa Gosvami (1489-1564), Rupa-manjari in Krishna-lila, is the foremost of the Six Goswamis, and all followers of Lord Chaitanya are called rupanugas, followers of Rupa. With his elder brother Sanatana he served the Bengal ruler Hussain Shah as minister (Dabir Khas), until meeting Mahaprabhu at Ramakeli inspired him to renounce everything. The Lord personally instructed him in the science of devotion for ten days at Dasasvamedha Ghat in Prayag and sent him to Vrindavan to uncover the lost holy places and write devotional literature. Settling in Vraja in 1516, he brought to light Sri Govindadeva and composed about 100,000 verses, including Bhakti-rasamrita-sindhu, Ujjvala-nilamani, Upadeshamrita, Vidagdha-madhava and Lalita-madhava. After Mahaprabhu's disappearance he held the young Gaudiya movement together. His samadhi is at the Radha-Damodara temple, beside the rooms where Srila Prabhupada later lived."
      },
      {
        "p": "Before meeting the Lord, Rupa had already written Hamsaduta. After their meeting at Ramakeli in 1514 he gave away his wealth, met the Lord again at Prayag, and later stayed with Him in Puri, where Ramananda Raya and the Lord relished the verses of his dramas. In Vrindavan his bhajana kutir at the Radha-Damodara temple and his kutir at Ter Kadamba near Nandagram became centres of his writing. The Govindaji temple, built in 1590 by Raja Man Singh, was raised for the Deity he revealed."
      }
    ],
    "teachings": [
      {
        "p": "Bhakti is the eternal function of the soul; devotional service is developed in stages from faith to love of God; one should accept whatever is favourable and reject whatever is unfavourable to devotion; and spontaneous devotion follows the mood of the residents of Vraja."
      }
    ],
    "qualities": [
      {
        "p": "Leadership, Scholarship, Poetic genius, Renunciation, Humility, Deep absorption in Radha-Krishna lila"
      }
    ],
    "timeline": [
      {
        "title": "Appearance",
        "year": "1489",
        "place": "Bakla-Chandradvip (Barisal)",
        "text": "Born to Kumaradeva and Revati Devi."
      },
      {
        "title": "Meets Lord Chaitanya at Ramakeli",
        "year": "1514",
        "place": "Ramakeli, Bengal",
        "text": "Met the Lord and soon resolved to give up his government post."
      },
      {
        "title": "Instructions at Prayag",
        "place": "Dasasvamedha Ghat, Prayag",
        "text": "Received the Lord's teachings on devotional service for ten days."
      },
      {
        "title": "Meeting with Ramananda Raya",
        "year": "1515",
        "place": "Jagannatha Puri",
        "text": "His dramas were discussed and relished by Ramananda Raya and the Lord."
      },
      {
        "title": "Settles in Vrindavan",
        "year": "1516",
        "place": "Vrindavan",
        "text": "Arrived in Vraja and began uncovering the holy places and writing."
      },
      {
        "title": "Completes Vidagdha-madhava",
        "year": "1532",
        "place": "Vrindavan",
        "text": "Finished his drama of Krishna's Vrindavan pastimes."
      },
      {
        "title": "Completes Lalita-madhava",
        "year": "1537",
        "place": "Vrindavan",
        "text": "Finished his drama of Krishna's Dvaraka pastimes."
      },
      {
        "title": "Completes Bhakti-rasamrita-sindhu",
        "year": "1541",
        "place": "Vrindavan",
        "text": "Finished his great work on the science of devotional service."
      },
      {
        "title": "Disappearance",
        "year": "1564",
        "place": "Vrindavan",
        "text": "Entered samadhi; entombed by Jiva Gosvami at the Radha-Damodara temple."
      }
    ],
    "books": [
      {
        "title": "Bhakti-rasamrita-sindhu",
        "year": "1541",
        "text": "The science of devotional service and its transcendental mellows; known in English as The Nectar of Devotion."
      },
      {
        "title": "Ujjvala-nilamani",
        "text": "A detailed analysis of the conjugal love of Radha and Krishna."
      },
      {
        "title": "Vidagdha-madhava",
        "year": "1532",
        "text": "A drama of Krishna's pastimes in Vrindavan."
      },
      {
        "title": "Lalita-madhava",
        "year": "1537",
        "text": "A drama of Krishna's pastimes in Dvaraka."
      },
      {
        "title": "Upadeshamrita",
        "text": "Eleven essential instructions for devotional life; known in English as The Nectar of Instruction."
      },
      {
        "title": "Laghu-bhagavatamrita",
        "text": "A summary of the incarnations and expansions of Krishna."
      },
      {
        "title": "Dana-keli-kaumudi",
        "text": "A one-act drama on Krishna's toll-tax pastime."
      },
      {
        "title": "Padyavali",
        "text": "An anthology of devotional verses."
      },
      {
        "title": "Stavamala",
        "text": "A collection of prayers and hymns."
      },
      {
        "title": "Hamsaduta",
        "text": "A poem written before he met Lord Chaitanya, in which a swan carries a message to Krishna."
      },
      {
        "title": "Uddhava-sandesha",
        "text": "A poem of messages between Krishna and the residents of Vraja."
      },
      {
        "title": "Mathura-mahatmya",
        "text": "On the glories of Mathura."
      },
      {
        "title": "Radha-Krishna-ganoddesha-dipika",
        "text": "A description of the associates of Radha and Krishna."
      },
      {
        "title": "Nataka-chandrika",
        "text": "A treatise on dramaturgy."
      }
    ]
  },
  {
    "slug": "srila-sanatana-gosvami",
    "name": "Srila Sanatana Gosvami",
    "shortName": "Sanatana Gosvami",
    "title": "Senior-most of the Six Goswamis of Vrindavan",
    "category": "Six Goswamis",
    "sampradaya": "Brahma-Madhva-Gaudiya",
    "featured": false,
    "years": "1488 – 1558 (Guru Purnima)",
    "appearance": {
      "date": "1488",
      "place": "Bakla-Chandradvip (Barisal), East Bengal"
    },
    "disappearance": {
      "date": "1558 (Guru Purnima)",
      "place": "Chakra-tirtha, Govardhana"
    },
    "portrait": `${R2}/srila-sanatana-gosvami-portrait.webp`,
    "banner": `${R2}/srila-sanatana-gosvami-banner.webp`,
    "summary": "The eldest of the Six Goswamis, who left high office under the Nawab of Bengal, received Lord Chaitanya's teachings in Varanasi, and established the worship of Sri Madana-mohana.",
    "biography": [
      {
        "p": "Srila Sanatana Gosvami (1488-1558), Rati-manjari or Lavanga-manjari in Krishna-lila, was the elder brother of Rupa Gosvami and the senior-most of the Six Goswamis. A great scholar, he served as revenue minister (Sakara Mallik) to the Nawab of Bengal before leaving government service to join Mahaprabhu. In Varanasi the Lord taught him for two months on sambandha, abhidheya and prayojana, the essence of Vaishnava philosophy. In Vraja he lived under trees and in simple kutirs, rediscovered holy places, and worshipped Sri Madana-mohana, whose temple became the first of Vrindavan's great temples. His books include Brihad-bhagavatamrita, Hari-bhakti-vilasa and the Dasama-tippani commentary on the Tenth Canto. On Guru Purnima, when devotees gathered at his kutir at Chakra-tirtha for the annual Govardhana parikrama he always led, they found he had left his body while chanting. His samadhi is beside the Madana-mohana temple."
      },
      {
        "p": "As a householder he wrote Sadachara-paddhati, gave food daily to brahmanas, the poor and lepers, and studied under Vidya-vachaspati, Sarvabhauma Bhattacharya and other scholars. In Vraja he moved from place to place, keeping bhajana kutirs at Vrindavan, Gokula-Mahavan, Kamyavan, Shyama-kunda and Chakra-tirtha, and was loved by the Vrajavasis as a father. The Madana-mohana temple, built with the help of the merchant Ramadasa Kapoor, was completed in 1580. Hari-bhakti-vilasa, compiled with Gopala Bhatta Gosvami, remains the standard guide to Vaishnava conduct."
      }
    ],
    "teachings": [
      {
        "p": "Sambandha, abhidheya and prayojana: knowing one's relationship with Krishna, acting in devotional service, and attaining love of God. A devotee's behaviour should follow the standards set out in Hari-bhakti-vilasa."
      }
    ],
    "qualities": [
      {
        "p": "Humility, Scholarship, Renunciation, Compassion, Charity, Love for the Vrajavasis"
      }
    ],
    "timeline": [
      {
        "title": "Appearance",
        "year": "1488",
        "place": "Bakla-Chandradvip (Barisal)",
        "text": "Born to Kumaradeva and Revati Devi."
      },
      {
        "title": "Meets Lord Chaitanya at Ramakeli",
        "year": "1514",
        "place": "Ramakeli, Bengal",
        "text": "A pivotal meeting with the Lord while serving as minister to Nawab Hussain Shah."
      },
      {
        "title": "Leaves government service",
        "place": "Gauda, Bengal",
        "text": "Escaped the Nawab's service to join the Lord."
      },
      {
        "title": "Teachings in Varanasi",
        "place": "Varanasi",
        "text": "Received Lord Chaitanya's instructions for two months."
      },
      {
        "title": "Completes Brihad-vaishnava-toshani",
        "year": "1554",
        "place": "Vrindavan",
        "text": "Finished his commentary on the Tenth Canto."
      },
      {
        "title": "Disappearance",
        "year": "1558",
        "date": "Guru Purnima, 1558",
        "place": "Chakra-tirtha, Govardhana",
        "text": "Left his body while chanting; his samadhi is beside the Madana-mohana temple."
      }
    ],
    "books": [
      {
        "title": "Brihad-bhagavatamrita",
        "text": "Explains who a devotee is, the process of devotional service, and who Krishna is."
      },
      {
        "title": "Hari-bhakti-vilasa",
        "text": "The standard Vaishnava smriti on conduct and Deity worship, compiled with Gopala Bhatta Gosvami, with the Dig-darshini commentary."
      },
      {
        "title": "Brihad-vaishnava-toshani (Dasama-tippani)",
        "year": "1554",
        "text": "Commentary on the Tenth Canto of Srimad-Bhagavatam."
      },
      {
        "title": "Lila-stava",
        "text": "Prayers describing Krishna's pastimes."
      },
      {
        "title": "Dasama-charita",
        "text": "A poetic account of the Tenth Canto pastimes."
      }
    ]
  },
  {
    "slug": "srila-raghunatha-dasa-gosvami",
    "name": "Srila Raghunatha Dasa Gosvami",
    "shortName": "Raghunatha Dasa Gosvami",
    "title": "One of the Six Goswamis of Vrindavan, the prayojana-acharya",
    "category": "Six Goswamis",
    "sampradaya": "Brahma-Madhva-Gaudiya",
    "featured": false,
    "years": "1494 – 1586 (Ashvina Shukla Dvadashi)",
    "appearance": {
      "date": "1494",
      "place": "Sri Krishnapur, near Saptagram, Hooghly"
    },
    "disappearance": {
      "date": "1586 (Ashvina Shukla Dvadashi)",
      "place": "Radha-kunda"
    },
    "portrait": `${R2}/srila-raghunatha-dasa-gosvami-portrait.webp`,
    "banner": `${R2}/srila-raghunatha-dasa-gosvami-banner.webp`,
    "summary": "One of the Six Goswamis, who gave up immense wealth to serve Lord Chaitanya in Puri and then spent over forty years in bhajana at Radha-kunda.",
    "biography": [
      {
        "p": "Srila Raghunatha Dasa Gosvami (1494-1586), Rasa-manjari in Krishna-lila, was the only son of Govardhana Majumdar, a wealthy landholder of Saptagram, yet from childhood he had no taste for material enjoyment. After repeated attempts to escape home, he received Nityananda Prabhu's mercy at the famous chida-dahi festival at Panihati and then fled to Mahaprabhu in Puri. There he lived under the care of Svarupa Damodara, practising extreme renunciation and witnessing the Lord's final pastimes. Mahaprabhu gave him His own Govardhana-shila and gunja-mala. After the Lord's departure he came to Vraja and spent over forty years in bhajana at Radha-kunda, where he inspired the excavation of Radha-kunda and Shyama-kunda. Krishnadasa Kaviraja heard Mahaprabhu's pastimes from him daily and wrote them in Chaitanya-charitamrita. His samadhi is at Radha-kunda, and he shares a disappearance day with Raghunatha Bhatta and Krishnadasa Kaviraja."
      },
      {
        "p": "He first met the Lord at Shantipur in 1510 and again in 1515, but was kept at home by his family until 1518, when he finally escaped to Puri. There the Lord entrusted him to Svarupa Damodara, under whose care he stayed about sixteen years. In Vraja he reduced eating and sleeping almost to nothing and chanted constantly. In 1545 Jiva Gosvami purchased the fields containing Radha-kunda and Shyama-kunda, and Raghunatha Dasa began their excavation. Srinivasa Acharya received his blessings before preaching in Bengal."
      }
    ],
    "teachings": [
      {
        "p": "Absolute renunciation of sense enjoyment, constant chanting of the holy name, and service to Radharani in the mood of a manjari; never hear or speak worldly talk."
      }
    ],
    "qualities": [
      {
        "p": "Renunciation, Determination, Austerity, Love in separation, Devotion to Radharani"
      }
    ],
    "timeline": [
      {
        "title": "Appearance",
        "year": "1494",
        "place": "Sri Krishnapur, Hooghly",
        "text": "Born to Govardhana Majumdar of Saptagram."
      },
      {
        "title": "First meeting with Lord Chaitanya",
        "year": "1510",
        "place": "Shantipur",
        "text": "Met the Lord at Advaita Acharya's house after His sannyasa."
      },
      {
        "title": "Second meeting",
        "year": "1515",
        "place": "Shantipur",
        "text": "Met the Lord again and was told to wait patiently at home."
      },
      {
        "title": "Panihati festival and escape to Puri",
        "year": "1518",
        "place": "Panihati; Jagannatha Puri",
        "text": "Received Nityananda's mercy at the chida-dahi festival and fled to the Lord."
      },
      {
        "title": "Lord Chaitanya's departure",
        "year": "1534",
        "place": "Jagannatha Puri",
        "text": "After about sixteen years under Svarupa Damodara, he left for Vraja."
      },
      {
        "title": "Excavation of Radha-kunda",
        "year": "1545",
        "place": "Radha-kunda",
        "text": "Began work on the two kundas after Jiva Gosvami purchased the fields."
      },
      {
        "title": "Disappearance",
        "year": "1586",
        "date": "Ashvina Shukla Dvadashi, 1586",
        "place": "Radha-kunda",
        "text": "Departed after over forty years of bhajana at Radha-kunda."
      }
    ],
    "books": [
      {
        "title": "Stavavali (Stava-mala)",
        "text": "Prayers expressing intense longing for the service of Radha and Krishna."
      },
      {
        "title": "Dana-charita",
        "text": "A poem on Krishna's toll-tax pastime."
      },
      {
        "title": "Mukta-charita",
        "text": "A poem on Krishna's pastime of growing pearls."
      }
    ]
  },
  {
    "slug": "srila-gopala-bhatta-gosvami",
    "name": "Srila Gopala Bhatta Gosvami",
    "shortName": "Gopala Bhatta Gosvami",
    "title": "One of the Six Goswamis of Vrindavan, founder of the Radha-ramana temple",
    "category": "Six Goswamis",
    "sampradaya": "Brahma-Madhva-Gaudiya",
    "featured": false,
    "years": "1503 – 1578",
    "appearance": {
      "date": "1503",
      "place": "Sri Rangam, South India"
    },
    "disappearance": {
      "date": "1578",
      "place": "Vrindavan"
    },
    "portrait": `${R2}/srila-gopala-bhatta-gosvami-portrait.webp`,
    "banner": `${R2}/srila-gopala-bhatta-gosvami-banner.webp`,
    "summary": "One of the Six Goswamis, who served Lord Chaitanya as a boy at Sri Rangam and later worshipped Sri Radha-ramana, who manifested from his shalagrama-shila in 1542.",
    "biography": [
      {
        "p": "Srila Gopala Bhatta Gosvami (1503-1578), Ananga-manjari (or Guna-manjari) in Krishna-lila, was the son of Venkata Bhatta of Sri Rangam, at whose home Mahaprabhu stayed for the four months of Chaturmasya in 1511. As a boy Gopala served the Lord and was won over by His teachings on Krishna's supremacy. Trained by his uncle and guru Prabodhananda Sarasvati, he came to Vrindavan after his parents' passing, and the Lord sent him His own seat and cloth. From the Gandaki River he brought twelve shalagrama-shilas, and in 1542, on Narasimha Chaturdashi, one of them manifested as the beautiful Deity Sri Radha-ramana, still worshipped in Vrindavan today. He compiled Hari-bhakti-vilasa with Sanatana Gosvami, wrote Sat-kriya-sara-dipika, and laid the groundwork for Jiva Gosvami's Sat-sandarbha. Srinivasa Acharya and Gopinatha Pujari were his disciples. Out of humility he asked not to be named in Chaitanya-charitamrita. His samadhi is at the Radha-ramana temple."
      },
      {
        "p": "In Vrindavan he lived as a wandering mendicant, spending nights at different kundas and his days studying and writing. He performed bhajana for many years at Sanket, between Varsana and Nandagrama, and in his later years lived at Radha-kunda with Raghunatha Dasa, Krishnadasa Kaviraja and Raghunatha Bhatta. Radha-ramana is the only one of the original Goswami Deities still in Vrindavan, served by the descendants of Gopinatha Pujari's brother Damodara Dasa."
      }
    ],
    "teachings": [
      {
        "p": "Krishna in Vrindavan is supreme over His majestic Narayana form; love surpasses power and sweetness surpasses opulence; and Vaishnava life should be guided by scripture in every stage, from birth rites to sannyasa."
      }
    ],
    "qualities": [
      {
        "p": "Humility, Scholarship, Devotion to Deity worship, Renunciation, Love in separation"
      }
    ],
    "timeline": [
      {
        "title": "Appearance",
        "year": "1503",
        "place": "Sri Rangam",
        "text": "Born to Venkata Bhatta."
      },
      {
        "title": "Serves Lord Chaitanya",
        "year": "1511",
        "date": "Chaturmasya, 1511",
        "place": "Sri Rangam",
        "text": "The Lord stayed four months at his father's home."
      },
      {
        "title": "Arrives in Vrindavan",
        "place": "Vrindavan",
        "text": "Came to Vraja at about thirty, after his parents' passing; welcomed by Rupa and Sanatana."
      },
      {
        "title": "Finds twelve shalagrama-shilas",
        "place": "Gandaki River, Nepal",
        "text": "The shilas entered his water-pot three times."
      },
      {
        "title": "Appearance of Sri Radha-ramana",
        "year": "1542",
        "date": "Narasimha Chaturdashi, 1542",
        "place": "Vrindavan",
        "text": "His Damodara shila manifested as the Deity Radha-ramana."
      },
      {
        "title": "Disappearance",
        "year": "1578",
        "place": "Vrindavan",
        "text": "Entered samadhi at the Radha-ramana temple."
      }
    ],
    "books": [
      {
        "title": "Sat-kriya-sara-dipika",
        "text": "A guide to Vaishnava samskaras and rites for householders."
      },
      {
        "title": "Samskara-dipika",
        "text": "Rules of conduct and initiation for Vaishnava sannyasis."
      },
      {
        "title": "Hari-bhakti-vilasa (editor)",
        "text": "Collected and edited Sanatana Gosvami's Vaishnava smriti, adding the Dig-darshini commentary."
      },
      {
        "title": "Commentary on Krishna-karnamrita",
        "text": "Commentary on Bilvamangala Thakura's poem."
      },
      {
        "title": "Introduction to the Sat-sandarbha",
        "text": "The original outline later developed by Jiva Gosvami."
      }
    ]
  },
  {
    "slug": "srila-raghunatha-bhatta-gosvami",
    "name": "Srila Raghunatha Bhatta Gosvami",
    "shortName": "Raghunatha Bhatta Gosvami",
    "title": "One of the Six Goswamis of Vrindavan, master reciter of Srimad-Bhagavatam",
    "category": "Six Goswamis",
    "sampradaya": "Brahma-Madhva-Gaudiya",
    "featured": false,
    "years": "1503 – c. 1579",
    "appearance": {
      "date": "1503",
      "place": "Varanasi"
    },
    "disappearance": {
      "date": "c. 1579",
      "place": "Radha-kunda"
    },
    "portrait": `${R2}/srila-raghunatha-bhatta-gosvami-portrait.webp`,
    "banner": `${R2}/srila-raghunatha-bhatta-gosvami-banner.webp`,
    "summary": "One of the Six Goswamis, famed for his sweet recitation of Srimad-Bhagavatam and for never hearing criticism of any Vaishnava.",
    "biography": [
      {
        "p": "Srila Raghunatha Bhatta Gosvami (1503-1579), Raga-manjari in Krishna-lila, was the son of Tapana Mishra of Varanasi. As a boy he washed Mahaprabhu's dishes and massaged His legs when the Lord stayed at his father's house. Later he lived with the Lord in Puri for eight months at a time, cooking for Him with such skill that Mahaprabhu relished everything he prepared. The Lord told him not to marry, to serve his devotee parents, and finally to go to Vrindavan under the care of Rupa and Sanatana. There he became famous for reciting Srimad-Bhagavatam in three melodies, often choked with ecstasy. He inspired his disciple Raja Man Singh to build the Govindaji temple and made ornaments for the Deity. He never spoke of worldly matters or listened to criticism of any Vaishnava. He is the only one of the Six Goswamis who left no books. His samadhi is at Radha-kunda and near the Govindaji temple."
      },
      {
        "p": "Before going to Vraja he served his elderly devotee parents in Varanasi for four years and studied the Bhagavatam under a realised Vaishnava, as the Lord had instructed. The Lord gave him His own neck beads, a fourteen-cubit tulasi garland worn by Lord Jagannatha, and betel, which he worshipped and wore around his neck in remembrance. Fearing desecration, Jiva Gosvami had his body cremated; his ashes rest at the Teen Goswami Samadhi at Radha-kunda and in the 64 Samadhi area near Govindaji."
      }
    ],
    "teachings": [
      {
        "p": "See every Vaishnava as engaged in Krishna's service and avoid finding fault; hear and speak only about Krishna; and relish Srimad-Bhagavatam constantly."
      }
    ],
    "qualities": [
      {
        "p": "Tolerance, Sweetness, Faultless conduct, Expertise in cooking and kirtan, Absorption in the Bhagavatam"
      }
    ],
    "timeline": [
      {
        "title": "Appearance",
        "year": "1503",
        "place": "Varanasi",
        "text": "Born to Tapana Mishra."
      },
      {
        "title": "Serves Lord Chaitanya in Varanasi",
        "place": "Varanasi",
        "text": "As a boy, washed the Lord's dishes and massaged His legs during His two-month stay."
      },
      {
        "title": "First stay in Jagannatha Puri",
        "place": "Jagannatha Puri",
        "text": "Lived with the Lord for eight months and cooked for Him."
      },
      {
        "title": "Sent to Vrindavan",
        "place": "Jagannatha Puri",
        "text": "After serving his parents for four years, returned to Puri and was sent to live under Rupa and Sanatana."
      },
      {
        "title": "Disappearance",
        "year": "1579",
        "date": "c. 1579",
        "place": "Radha-kunda",
        "text": "Departed while performing bhajana; his ashes rest at the Teen Goswami Samadhi."
      }
    ],
    "books": []
  },
  {
    "slug": "srila-jiva-gosvami",
    "name": "Srila Jiva Gosvami",
    "shortName": "Jiva Gosvami",
    "title": "One of the Six Goswamis of Vrindavan, the great philosopher of the Gaudiya sampradaya",
    "category": "Six Goswamis",
    "sampradaya": "Brahma-Madhva-Gaudiya",
    "featured": false,
    "years": "1513 – 1598",
    "appearance": {
      "date": "1513",
      "place": "Bengal"
    },
    "disappearance": {
      "date": "1598",
      "place": "Vrindavan"
    },
    "portrait": `${R2}/srila-jiva-gosvami-portrait.webp`,
    "banner": `${R2}/srila-jiva-gosvami-banner.webp`,
    "summary": "The youngest of the Six Goswamis and the greatest philosopher of the Gaudiya line, author of the Sat-sandarbha and founder of the Radha-Damodara temple.",
    "biography": [
      {
        "p": "Srila Jiva Gosvami (1513-1598), Vilasa-manjari in Krishna-lila, was the son of Anupama and nephew of Rupa and Sanatana. As an infant at Ramakeli he received the dust of Mahaprabhu's feet. As a youth he toured Navadvip with Nityananda Prabhu, who sent him to Vrindavan, studied Vedanta in Varanasi, and was then initiated by Rupa Gosvami. He defended his gurus' honour by defeating the proud scholar Rupanarayana. Srila Prabhupada called him perhaps the greatest philosopher the world has known. His roughly 400,000 verses include the Sat-sandarbha, Gopala-champu and the grammar Hari-namamrita-vyakarana. In 1542 he established Sri Sri Radha-Damodara in Seva-kunja, built a library to protect the Goswamis' manuscripts, and managed the development of Radha-kunda. He trained Srinivasa, Narottama and Shyamananda and sent them with the Goswamis' books to Bengal and Odisha. His samadhi is at the Radha-Damodara temple."
      },
      {
        "p": "When Rupa and Sanatana renounced home, the child Jiva stayed with his mother at Fatehabad, absorbed in the worship of Krishna-Balarama. After his debate with Rupanarayana, Rupa sent him away from Vrindavan, and he performed severe austerities until Sanatana reminded Rupa of the Lord's teaching of 'jiva-daya', kindness to living beings. Emperor Akbar met him at Radha-Damodara in 1570 and supported the building of Vrindavan's great temples. After Rupa and Sanatana departed, he guided the whole sampradaya, gave Srinivasa, Narottama and Shyamananda their titles, and arranged hospitality for every Bengali devotee who came to Vraja."
      }
    ],
    "teachings": [
      {
        "p": "Krishna is the Supreme Personality of Godhead, Srimad-Bhagavatam is the supreme evidence, and pure love of God is the highest goal. One should be humble for one's own sake but must not tolerate blasphemy of Vishnu or the acharyas."
      }
    ],
    "qualities": [
      {
        "p": "Scholarship, Organisational genius, Service to his gurus, Courage in defending the truth, Compassion"
      }
    ],
    "timeline": [
      {
        "title": "Appearance",
        "year": "1513",
        "place": "Bengal",
        "text": "Born to Anupama."
      },
      {
        "title": "Blessed by Lord Chaitanya",
        "year": "1514",
        "place": "Ramakeli, Bengal",
        "text": "As an infant received the dust of the Lord's lotus feet."
      },
      {
        "title": "Navadvip parikrama with Nityananda",
        "place": "Navadvip",
        "text": "Toured the nine islands with Nityananda Prabhu, who sent him to Vrindavan."
      },
      {
        "title": "Studies in Varanasi",
        "place": "Varanasi",
        "text": "Studied Vedanta under Madhusudana Vachaspati."
      },
      {
        "title": "Arrives in Vrindavan",
        "year": "1535",
        "place": "Vrindavan",
        "text": "Joined his uncles and was initiated by Rupa Gosvami."
      },
      {
        "title": "Establishes Sri Sri Radha-Damodara",
        "year": "1542",
        "place": "Seva-kunja, Vrindavan",
        "text": "Installed the Deities given to him by Rupa Gosvami."
      },
      {
        "title": "Meeting with Emperor Akbar",
        "year": "1570",
        "place": "Radha-Damodara temple, Vrindavan",
        "text": "Akbar supported the Goswamis' library and the building of temples."
      },
      {
        "title": "Completes Gopala-champu (Purva)",
        "year": "1588",
        "place": "Vrindavan",
        "text": "Finished the first part of his epic of Krishna's pastimes."
      },
      {
        "title": "Disappearance",
        "year": "1598",
        "place": "Vrindavan",
        "text": "Departed at age 85; his samadhi is at the Radha-Damodara temple."
      }
    ],
    "books": [
      {
        "title": "Tattva-sandarbha",
        "text": "Establishes Srimad-Bhagavatam as the supreme evidence of the Absolute Truth."
      },
      {
        "title": "Bhagavat-sandarbha",
        "text": "Distinguishes Brahman, Paramatma and Bhagavan and describes the Lord's energies."
      },
      {
        "title": "Paramatma-sandarbha",
        "text": "On the Supersoul, the living entities and the material world."
      },
      {
        "title": "Krishna-sandarbha",
        "text": "Establishes Krishna as the Supreme Personality of Godhead."
      },
      {
        "title": "Bhakti-sandarbha",
        "text": "On the practice and supremacy of devotional service."
      },
      {
        "title": "Priti-sandarbha",
        "text": "On love of God as the highest goal of life."
      },
      {
        "title": "Krama-sandarbha",
        "text": "Commentary on all twelve cantos of Srimad-Bhagavatam."
      },
      {
        "title": "Gopala-champu",
        "year": "1588",
        "text": "An epic of Krishna's pastimes in two parts (Purva completed 1588)."
      },
      {
        "title": "Hari-namamrita-vyakarana",
        "text": "A Sanskrit grammar in which every rule is illustrated with the holy names of the Lord."
      },
      {
        "title": "Sarva-samvadini",
        "text": "A commentary supporting the Sat-sandarbha, referring to the major Vedanta commentators."
      },
      {
        "title": "Radha-Krishna-archana-dipika",
        "text": "On the worship of Radha and Krishna together."
      },
      {
        "title": "Brahma-samhita commentary",
        "text": "Commentary on the Brahma-samhita."
      },
      {
        "title": "Locana-rocani",
        "text": "Commentary on Rupa Gosvami's Ujjvala-nilamani."
      },
      {
        "title": "Laghu-toshani",
        "year": "1582",
        "text": "Edited summary of Sanatana Gosvami's Tenth Canto commentary."
      },
      {
        "title": "Gopala-virudavali",
        "text": "Verses glorifying Krishna."
      },
      {
        "title": "Madhava-mahotsava",
        "text": "A poem on the coronation of Radha."
      },
      {
        "title": "Sankalpa-kalpavriksha",
        "text": "Prayers on the eightfold daily pastimes of Radha and Krishna."
      }
    ]
  },
  {
    "slug": "sri-srivasa-pandita",
    "name": "Sri Srivasa Pandita",
    "shortName": "Srivasa Pandita",
    "title": "Member of the Pancha-tattva",
    "category": "Pancha-tattva",
    "sampradaya": "Brahma-Madhva-Gaudiya",
    "featured": false,
    "years": "Appeared c. 1456",
    "appearance": {
      "date": "c. 1456",
      "place": "Srihatta (Sylhet), East Bengal"
    },
    "portrait": `${R2}/sri-srivasa-pandita-portrait.webp`,
    "banner": `${R2}/sri-srivasa-pandita-banner.webp`,
    "summary": "One of the Pancha-tattva and an incarnation of Narada Muni, in whose Navadvip courtyard Lord Chaitanya held His nightly sankirtana.",
    "biography": [
      {
        "p": "Srivasa Pandita is one of the Pancha-tattva and, according to Gaura-ganoddesha-dipika, an incarnation of Narada Muni; his wife Malini Devi was Krishna's nurse Ambika in Vraja. Born in Srihatta about thirty years before Lord Chaitanya, he moved to Navadvip with his brothers Srirama, Sripati and Srinidhi, where they joined the devotees gathering at Advaita Acharya's house. He and Malini cared for young Nimai almost as His parents. After the Lord returned from Gaya, Srivasa's courtyard became the centre of His nightly sankirtana. Srivasa's devotion was so complete that when his son died during kirtan he would not let the chanting stop, and Mahaprabhu consoled him by saying that He and Nityananda were now his sons. The Lord blessed him that his house would never know poverty. After Mahaprabhu took sannyasa, Srivasa lived at Kumarhatta and visited Him in Puri every year."
      },
      {
        "p": "Srivasa's niece Narayani, daughter of his eldest brother Nalina, was the mother of Vrindavana Dasa Thakura, the author of Chaitanya-bhagavata, and Narayani grew up in Srivasa's home. Srivasa had once gently urged the young scholar Nimai to give up pride of learning and take to Krishna-bhakti, and he lived to see the Lord reveal Himself fully in his own house. His home, Srivasa-angana in Mayapur, is still a place of pilgrimage."
      }
    ],
    "teachings": [
      {
        "p": "Pure devotion means serving the Lord's pleasure above all personal concerns; learning is useful only if it leads to devotion to Krishna; and congregational chanting of the holy name is the life of the devotees."
      }
    ],
    "qualities": [
      {
        "p": "Steadfast faith, Selflessness, Parental affection for the Lord, Hospitality, Devotion to sankirtana"
      }
    ],
    "timeline": [
      {
        "title": "Appearance in Srihatta",
        "year": "1456",
        "date": "c. 1456",
        "place": "Srihatta (Sylhet)",
        "text": "Appeared about thirty years before Lord Chaitanya as the second of five sons of Jaladhara Pandita."
      },
      {
        "title": "Moves to Navadvip",
        "place": "Navadvip",
        "text": "Settled on the banks of the Ganges with his brothers and joined the devotees at Advaita Acharya's house."
      },
      {
        "title": "Appearance of Lord Chaitanya",
        "year": "1486",
        "date": "Phalguna Purnima, 1486",
        "place": "Navadvip",
        "text": "Srivasa and Malini Devi helped Sachi Mata and cared for the child Nimai like parents."
      },
      {
        "title": "Nightly sankirtana at Srivasa-angana",
        "place": "Navadvip",
        "text": "After returning from Gaya, Lord Chaitanya held His nightly kirtan in Srivasa's courtyard."
      },
      {
        "title": "Lord's blessing of no poverty",
        "place": "Kumarhatta",
        "text": "Mahaprabhu blessed him that his house would never lack anything needed for worship."
      }
    ],
    "books": []
  },
  {
    "slug": "srila-madhu-pandita-gosvami",
    "name": "Srila Madhu Pandita Gosvami",
    "shortName": "Madhu Pandita",
    "title": "Founder of the Radha-Gopinatha temple, Vrindavan",
    "category": "Associates of Mahaprabhu",
    "sampradaya": "Brahma-Madhva-Gaudiya",
    "featured": false,
    "appearance": {
      "place": "Saibona, near Khardaha, Bengal"
    },
    "disappearance": {
      "place": "Vrindavan"
    },
    "portrait": `${R2}/srila-madhu-pandita-gosvami-portrait.webp`,
    "banner": `${R2}/srila-madhu-pandita-gosvami-banner.webp`,
    "summary": "A disciple of Gadadhara Pandita who recovered the ancient Gopinatha Deity at Vamsivata and established one of the seven principal Goswami temples of Vrindavan.",
    "biography": [
      {
        "p": "Srila Madhu Pandita Gosvami, a disciple of Sri Gadadhara Pandita, came from Saibona near Khardaha in Bengal and in Goloka serves in the group of Champakalata-sakhi. On his guru's order he came to Vrindavan and searched everywhere for the ancient Gopinatha Deity first installed by Vajranabha. Not finding Him, he gave up food and sat weeping at Vamsivata. After a monsoon flood swept away the old banyan tree there, his friend Paramananda Bhattacharya saw the Deity half-buried in the ground, and Madhu Pandita brought Him out. Radha-Gopinatha became one of the seven principal Goswami temples of Vrindavan; uniquely, Ananga-manjari, sent by Jahnava Mata, stands on Gopinatha's left. Madhu Pandita gave Gopinatha's garland to Srinivasa, Narottama and Shyamananda as blessings when they set out with the Goswamis' books. His samadhi is near the eastern gate of the Gopinatha temple."
      },
      {
        "p": "The original Gopinatha temple, built by Raja Saganji, one of the Shekhawat princes of Rajasthan, is believed to have opened in 1589; after its desecration by Aurangzeb's soldiers in 1670 a new temple was built beside it, and the original Deity is now worshipped in Jaipur. The same arrangement of Ananga-manjari and Radharani is followed in all Gopinatha temples of Vraja. The Bhakti-ratnakara glorifies Madhu Pandita as an abode of wonderful qualities by whose grace the Lord became manifest."
      }
    ],
    "teachings": [
      {
        "p": "The Lord reveals Himself to a devotee who longs for Him with tears; Deity worship is a direct meeting with the Lord."
      }
    ],
    "qualities": [
      {
        "p": "Intense longing for the Lord, Determination, Devotion to the Deity, Sweetness of heart"
      }
    ],
    "timeline": [
      {
        "title": "Arrives in Vrindavan",
        "place": "Vrindavan",
        "text": "Came to Vraja on the order of his guru, Gadadhara Pandita."
      },
      {
        "title": "Discovery of Sri Gopinatha",
        "place": "Vamsivata, Vrindavan",
        "text": "After a flood, the ancient Gopinatha Deity was found half-buried at Vamsivata and brought out by Madhu Pandita."
      },
      {
        "title": "Ananga-manjari installed",
        "year": "1582",
        "place": "Vrindavan",
        "text": "Jahnava Mata's visit led to the installation of Ananga-manjari beside Gopinatha."
      },
      {
        "title": "Gopinatha temple opens",
        "year": "1589",
        "place": "Vrindavan",
        "text": "The original Gopinatha temple, built by Raja Saganji, is believed to have opened."
      }
    ],
    "books": []
  },
  {
    "slug": "srila-lokanatha-gosvami",
    "name": "Srila Lokanatha Gosvami",
    "shortName": "Lokanatha Gosvami",
    "title": "Associate of Lord Chaitanya and guru of Narottama Dasa Thakura",
    "category": "Associates of Mahaprabhu",
    "sampradaya": "Brahma-Madhva-Gaudiya",
    "featured": false,
    "years": "Disappeared 1588 (Ashadha Krishna Ashtami)",
    "appearance": {
      "place": "Talakhadi, Jessore, East Bengal"
    },
    "disappearance": {
      "date": "1588 (Ashadha Krishna Ashtami)",
      "place": "Vrindavan"
    },
    "portrait": `${R2}/srila-lokanatha-gosvami-portrait.webp`,
    "banner": `${R2}/srila-lokanatha-gosvami-banner.webp`,
    "summary": "A personal associate of Lord Chaitanya, sent to Vrindavan in 1510, who worshipped Sri Radha-Vinoda and accepted only one disciple, Narottama Dasa Thakura.",
    "biography": [
      {
        "p": "Srila Lokanatha Gosvami, Lila-manjari in Krishna-lila, was the son of Padmanabha of Talakhadi in Jessore. In 1510 he met Mahaprabhu in Navadvip, who sent him ahead to Vrindavan, where he went with his close friend Bhugarbha Gosvami. He was among the first of the Lord's associates to live in Vraja, and his notes helped Rupa and Sanatana identify Krishna's pastime places. At Kishori Kunda a cowherd boy gave him the Deity Radha-Vinoda, whom he carried in a cloth bag over his heart for the rest of his life. He was so afraid of fame that he asked Krishnadasa Kaviraja not to describe him in Chaitanya-charitamrita, and he vowed never to accept disciples. Only after Mahaprabhu instructed him in a dream did he initiate Narottama Dasa Thakura, his one and only disciple. He departed around 1588; his samadhi is at the Radha-Gokulananda temple in Vrindavan."
      },
      {
        "p": "Before settling in Vraja, Lokanatha tried to follow the Lord, travelling to South India and back to Vrindavan, until Mahaprabhu appeared in a dream and told him to stay and perform bhajana. When Rupa, Sanatana, Gopala Bhatta and the other associates arrived, their company cheered him greatly. Narottama Dasa Thakura wrote his pranama mantra, glorifying him as rich only in the service of Sri Radha-Vinoda. His Radha-Vinoda Deity is now worshipped in Jaipur."
      }
    ],
    "teachings": [
      {
        "p": "Humility and freedom from the desire for fame are essential to bhajana; a disciple should first chant the holy name with attachment before initiation; and the Deity is served with one's whole body, mind and soul."
      }
    ],
    "qualities": [
      {
        "p": "Humility, Renunciation, Fear of fame, Single-minded Deity service, Love in separation"
      }
    ],
    "timeline": [
      {
        "title": "Meets Lord Chaitanya",
        "year": "1510",
        "place": "Navadvip",
        "text": "Renounced household life and was sent by the Lord to live in Vrindavan."
      },
      {
        "title": "Journey to Vraja",
        "year": "1510",
        "place": "Vrindavan",
        "text": "Travelled with Bhugarbha Gosvami through Rajmahal, Purniya and Lucknow to Vraja."
      },
      {
        "title": "Receives Radha-Vinoda",
        "place": "Kishori Kunda, Umarao",
        "text": "A cowherd boy gave him the Deity Radha-Vinoda, whom he carried in a bag over his heart."
      },
      {
        "title": "Initiates Narottama Dasa Thakura",
        "place": "Vrindavan",
        "text": "After two years of Narottama's service, and on Mahaprabhu's order in a dream, he accepted his only disciple."
      },
      {
        "title": "Disappearance",
        "year": "1588",
        "date": "Ashadha Krishna Ashtami, c. 1588",
        "place": "Vrindavan",
        "text": "Entered samadhi; his tomb is in the Radha-Gokulananda temple."
      }
    ],
    "books": []
  },
  {
    "slug": "srila-krishnadasa-kaviraja-gosvami",
    "name": "Srila Krishnadasa Kaviraja Gosvami",
    "shortName": "Krishnadasa Kaviraja",
    "title": "Author of Sri Chaitanya-charitamrita",
    "category": "Post-Goswami Acharyas",
    "sampradaya": "Brahma-Madhva-Gaudiya",
    "featured": false,
    "years": "c. 1520 – c. 1616",
    "appearance": {
      "date": "c. 1520",
      "place": "Jhamatpur, near Naihati, Bengal"
    },
    "disappearance": {
      "date": "c. 1616",
      "place": "Radha-kunda"
    },
    "portrait": `${R2}/srila-krishnadasa-kaviraja-gosvami-portrait.webp`,
    "banner": `${R2}/srila-krishnadasa-kaviraja-gosvami-banner.webp`,
    "summary": "Author of Sri Chaitanya-charitamrita, who took shelter of Rupa and Raghunatha Dasa Gosvamis and wrote the Lord's biography at Radha-kunda.",
    "biography": [
      {
        "p": "Srila Krishnadasa Kaviraja Gosvami (c. 1520-1616), Kasturi-manjari in Krishna-lila, was born at Jhamatpur near Naihati. After he defended Nityananda Prabhu's glory before his own brother, Nityananda appeared to him in a dream and sent him to Vrindavan. There he took shelter of Rupa and Sanatana and lived at Radha-kunda beside Raghunatha Dasa Gosvami, hearing daily about Mahaprabhu's final pastimes in Puri. Asked by the Vrindavan devotees to complete the story of the Lord's life, he received Madana-mohana's garland as a sign of permission. Though old, nearly blind and with trembling hands, he wrote Sri Chaitanya-charitamrita, completed around 1615. He also wrote Govinda-lilamrita, which earned him the title Kaviraja, king of poets, and a commentary on Krishna-karnamrita. His remains rest at the Teen Goswami Samadhi at Radha-kunda, and he shares a disappearance day with Raghunatha Dasa and Raghunatha Bhatta Gosvamis."
      },
      {
        "p": "His Chaitanya-charitamrita fills in the pastimes Vrindavana Dasa Thakura had outlined but not described, and draws on the diaries of Svarupa Damodara and Murari Gupta and the memories of Raghunatha Dasa. Each chapter opens with prayers to the Lord and His associates and closes with a prayer to the feet of Rupa and Raghunatha. Bhaktisiddhanta Sarasvati Thakura said that if every book were lost except Chaitanya-charitamrita, humanity would still reach the ultimate goal. Srila Prabhupada's commentary made the work known throughout the world."
      }
    ],
    "teachings": [
      {
        "p": "Lord Chaitanya is Radha and Krishna combined; Nityananda and Chaitanya are one and must be honoured equally; and one must never offend a Vaishnava."
      }
    ],
    "qualities": [
      {
        "p": "Humility, Scholarship, Poetic mastery, Respect for Vaishnavas, Single-minded devotion"
      }
    ],
    "timeline": [
      {
        "title": "Appearance",
        "year": "1520",
        "date": "c. 1520",
        "place": "Jhamatpur, near Naihati",
        "text": "Born to Bhagiratha and Sunanda."
      },
      {
        "title": "Nityananda's order in a dream",
        "place": "Jhamatpur",
        "text": "Nityananda Prabhu appeared to him and sent him to Vrindavan."
      },
      {
        "title": "Lives at Radha-kunda",
        "place": "Radha-kunda",
        "text": "Settled beside Raghunatha Dasa Gosvami and heard the Lord's pastimes from him."
      },
      {
        "title": "Madana-mohana's blessing",
        "place": "Madana-mohana temple, Vrindavan",
        "text": "The Deity's garland fell as a sign of permission to write."
      },
      {
        "title": "Completes Sri Chaitanya-charitamrita",
        "year": "1615",
        "place": "Radha-kunda",
        "text": "Finished the Lord's biography in old age."
      },
      {
        "title": "Disappearance",
        "year": "1616",
        "date": "c. 1616",
        "place": "Radha-kunda",
        "text": "His ashes rest at the Teen Goswami Samadhi."
      }
    ],
    "books": [
      {
        "title": "Sri Chaitanya-charitamrita",
        "year": "1615",
        "text": "The authoritative biography and philosophy of Lord Chaitanya."
      },
      {
        "title": "Govinda-lilamrita",
        "text": "Krishna's pastimes over a twenty-four-hour day; earned him the title Kaviraja."
      },
      {
        "title": "Commentary on Krishna-karnamrita",
        "text": "Commentary on Bilvamangala Thakura's poem."
      }
    ]
  },
  {
    "slug": "sri-srinivasa-acharya",
    "name": "Sri Srinivasa Acharya",
    "shortName": "Srinivasa Acharya",
    "title": "Acharya of the post-Goswami generation and leader of the first book-distribution party",
    "category": "Post-Goswami Acharyas",
    "sampradaya": "Brahma-Madhva-Gaudiya",
    "featured": false,
    "years": "Appeared Vaishakha Purnima, c. 1515-1519",
    "appearance": {
      "date": "Vaishakha Purnima, c. 1515-1519",
      "place": "Chakhandi, Bengal"
    },
    "portrait": `${R2}/sri-srinivasa-acharya-portrait.webp`,
    "banner": `${R2}/sri-srinivasa-acharya-banner.webp`,
    "summary": "Disciple of Gopala Bhatta Gosvami and student of Jiva Gosvami, who brought the Goswamis' books to Bengal and converted King Birhambir of Vana Vishnupur.",
    "biography": [
      {
        "p": "Sri Srinivasa Acharya was born at Chakhandi in Bengal to Gangadhara Bhattacharya, called Chaitanya Dasa, and Lakshmipriya, by the blessing of Mahaprabhu, and is described as an embodiment of the Lord's ecstasy (Mani-manjari in Krishna-lila). He was initiated by Gopala Bhatta Gosvami and trained by Jiva Gosvami, who gave him the title Acharya. He led the first book-distribution party in Gaudiya history, taking the Goswamis' manuscripts east by bullock cart. When the books were stolen near Vana Vishnupur, he won them back and converted the thief, King Birhambir, who became his disciple. He preached throughout Bengal with disciples such as Ramachandra Kaviraja, originated the Manohar Shoy style of kirtan, and co-organised the great Kheturi festival with Narottama and Shyamananda. He composed the Sad-gosvamy-ashtaka, the well-known prayers to the Six Goswamis."
      },
      {
        "p": "His father Gangadhara was so overwhelmed after witnessing Mahaprabhu's sannyasa at Katwa that he became known as Chaitanya Dasa, and the Lord blessed the couple with a son. In his youth Srinivasa met Narahari Sarakara, Gadadhara Pandita and Jahnava Devi. Prema-vilasa names 117 of his disciples, including Ramachandra Kaviraja and his brother Govinda Kaviraja. On a second visit to Vrindavan with Ramachandra, Gopala Bhatta asked him to continue preaching in Bengal rather than take up Radha-ramana's worship. His followers recorded nothing of his departure."
      }
    ],
    "teachings": [
      {
        "p": "The Goswamis' books are the treasure of the sampradaya and must be distributed; inner service in the mood of a manjari (manasa-seva) is the essence of bhajana."
      }
    ],
    "qualities": [
      {
        "p": "Scholarship, Determination, Preaching zeal, Absorption in manjari-bhava, Compassion"
      }
    ],
    "timeline": [
      {
        "title": "Appearance",
        "year": "1515",
        "date": "Vaishakha Purnima (c. 1515-1519)",
        "place": "Chakhandi, Bengal",
        "text": "Born to Gangadhara (Chaitanya Dasa) and Lakshmipriya by Lord Chaitanya's blessing."
      },
      {
        "title": "Arrives in Vrindavan",
        "place": "Vrindavan",
        "text": "Initiated by Gopala Bhatta Gosvami and trained by Jiva Gosvami."
      },
      {
        "title": "Book-distribution journey",
        "place": "Vrindavan to Bengal",
        "text": "Led the cart carrying the Goswamis' books with Narottama and Shyamananda."
      },
      {
        "title": "Books recovered at Vana Vishnupur",
        "place": "Vana Vishnupur, Bengal",
        "text": "Won back the stolen books and initiated King Birhambir."
      },
      {
        "title": "Kheturi festival",
        "year": "Gaura Purnima",
        "place": "Kheturi",
        "text": "Presided over the Deity installations at Narottama's great festival."
      },
      {
        "title": "Second visit to Vrindavan",
        "place": "Vrindavan",
        "text": "Returned with Ramachandra Kaviraja and resumed study under Jiva Gosvami."
      }
    ],
    "books": [
      {
        "title": "Sad-gosvamy-ashtaka",
        "text": "Eight prayers glorifying the Six Goswamis of Vrindavan."
      },
      {
        "title": "Commentary on the Chatuh-shloki Bhagavatam",
        "text": "Commentary on the four essential verses of Srimad-Bhagavatam."
      }
    ]
  },
  {
    "slug": "srila-narottama-dasa-thakura",
    "name": "Srila Narottama Dasa Thakura",
    "shortName": "Narottama Dasa Thakura",
    "title": "Acharya of kirtan and author of Prarthana and Prema-bhakti-chandrika",
    "category": "Post-Goswami Acharyas",
    "sampradaya": "Brahma-Madhva-Gaudiya",
    "featured": false,
    "years": "1534 – 1611",
    "appearance": {
      "date": "1534",
      "place": "Kheturi, Rajshahi, East Bengal"
    },
    "disappearance": {
      "date": "1611",
      "place": "Ganges at Gambhila, Bengal"
    },
    "portrait": `${R2}/srila-narottama-dasa-thakura-portrait.webp`,
    "banner": `${R2}/srila-narottama-dasa-thakura-banner.webp`,
    "summary": "Prince of Kheturi who became the only disciple of Lokanatha Gosvami, held the great Kheturi festival, and gave Gaudiya Vaishnavas their most beloved songs.",
    "biography": [
      {
        "p": "Srila Narottama Dasa Thakura (1534-1611), Champaka-manjari in Krishna-lila, was born a prince in Kheturi, the son of Raja Krishnananda Datta and Narayani Devi. Mahaprabhu had deposited His love in the Padma River for him, and when the teenage Narottama bathed there his complexion turned golden. He escaped his father's guards and walked to Vrindavan, where he became the only disciple of Lokanatha Gosvami and studied under Jiva Gosvami, who gave him the title Thakura. With Srinivasa and Shyamananda he brought the Goswamis' books east. At Kheturi he held the first great Gaura Purnima festival, where Mahaprabhu and His associates were seen dancing in his kirtan, and established the Garanhati style of kirtan. His Bengali songs, especially Prarthana and Prema-bhakti-chandrika, are sung by devotees everywhere. At his departure his body is said to have melted into milk in the Ganges, remembered at the Dugdha-samadhi."
      },
      {
        "p": "As an infant he refused grain that had not been offered to Krishna. At Vrindavan he served Lokanatha secretly for two years before initiation, and Radharani in a dream gave him the eternal service of boiling milk, whose burns appeared on his hands. Many brahmanas who opposed him because of his birth were defeated by his disciples Ganganarayana Chakravarti and Ramachandra Kaviraja, and leaders such as Raja Narasimha and the scholar Rupanarayana surrendered to him. Prema-vilasa lists 123 of his disciples."
      }
    ],
    "teachings": [
      {
        "p": "Pure devotion is attained by serving the spiritual master and the Vaishnavas; the holy name sung in kirtan carries the full mercy of Mahaprabhu; and a Vaishnava is never to be judged by birth."
      }
    ],
    "qualities": [
      {
        "p": "Humility, Renunciation, Mastery of kirtan, Compassion, Poetic genius"
      }
    ],
    "timeline": [
      {
        "title": "Appearance",
        "year": "1534",
        "place": "Kheturi, East Bengal",
        "text": "Born to Raja Krishnananda Datta and Narayani Devi."
      },
      {
        "title": "Receives Gaura-prema",
        "place": "Prema-tali Ghat, Padma River",
        "text": "On Nityananda's instruction he bathed in the Padma and his complexion turned golden."
      },
      {
        "title": "Escapes to Vrindavan",
        "place": "Vrindavan",
        "text": "Slipped away from the Jaygirdar's court at sixteen and walked to Vraja."
      },
      {
        "title": "Initiation by Lokanatha Gosvami",
        "place": "Vrindavan",
        "text": "Became Lokanatha's only disciple after two years of service."
      },
      {
        "title": "Book-distribution journey",
        "place": "Vrindavan to Bengal",
        "text": "Travelled with Srinivasa and Shyamananda carrying the Goswamis' books."
      },
      {
        "title": "Kheturi festival",
        "year": "Gaura Purnima",
        "place": "Kheturi",
        "text": "Installed six Deities, introduced Garanhati kirtan, and Mahaprabhu and His associates appeared in the kirtan."
      },
      {
        "title": "Disappearance",
        "year": "1611",
        "place": "Ganges at Gambhila",
        "text": "His body is said to have turned to milk in the Ganges; Dugdha-samadhi at Jiyaganj."
      }
    ],
    "books": [
      {
        "title": "Prarthana",
        "text": "Bengali songs of prayer, many centred on service as a manjari of Radharani."
      },
      {
        "title": "Prema-bhakti-chandrika",
        "text": "A Bengali poem summarising Gaudiya philosophy."
      }
    ]
  },
  {
    "slug": "sri-shyamananda-prabhu",
    "name": "Sri Shyamananda Prabhu",
    "shortName": "Shyamananda Prabhu",
    "title": "Acharya of Odisha, recipient of Radharani's anklet",
    "category": "Post-Goswami Acharyas",
    "sampradaya": "Brahma-Madhva-Gaudiya",
    "featured": false,
    "years": "Appeared c. 1535",
    "appearance": {
      "date": "c. 1535",
      "place": "Dharenda, Midnapur, Odisha"
    },
    "disappearance": {
      "place": "Narasinghapur, Odisha"
    },
    "portrait": `${R2}/sri-shyamananda-prabhu-portrait.webp`,
    "banner": `${R2}/sri-shyamananda-prabhu-banner.webp`,
    "summary": "Disciple of Hridaya Chaitanya and student of Jiva Gosvami, who received Radharani's anklet and the Shyamasundara Deity and spread Gaudiya Vaishnavism throughout Odisha.",
    "biography": [
      {
        "p": "Sri Shyamananda Prabhu was born around 1535 in Dharenda, Odisha, to Krishna Mandala and Durika, who named him Dukhi. He was initiated by Hridaya Chaitanya, a disciple of Gauridasa Pandita, and sent to study under Jiva Gosvami in Vrindavan. While sweeping the kunja one morning he found Srimati Radharani's golden anklet. When he returned it, Lalita-sakhi marked his forehead with it, the origin of the Shyamanandi tilaka. She named him Shyamananda, one who brought joy to Shyama, and Radharani gave him the Deity of Sri Shyamasundara, now worshipped at the Radha-Shyamasundara temple in Vrindavan. With Srinivasa Acharya and Narottama Dasa Thakura he carried the Goswamis' books east. With his disciple Rasikananda he spread Gaudiya Vaishnavism throughout Odisha, converting kings and landowners, stopping animal sacrifice and popularising the Reneti style of kirtan. His samadhi is at Narasinghapur in Odisha."
      },
      {
        "p": "Before going to Vrindavan he travelled widely across India on pilgrimage. Radha-Shyamasundara was received in 1578 at Nidhuvana, and in 1580 he arranged the divine marriage of Shyamasundara with Radharani (Laliji), who had manifested in the treasury of the king of Bharatpur. His guru Hridaya Chaitanya was at first angered by the change in his disciple's name and tilaka, until Shyamananda's humble surrender won him over. In Odisha he and Rasikananda converted rulers such as the landlords of Ghatshila and Govindapur and the king of Mayurbhanj. Before departing he named Rasikananda his successor."
      }
    ],
    "teachings": [
      {
        "p": "Service to Radha under the guidance of the sakhis is the highest attainment; the holy name and the Goswamis' teachings should be carried to every village."
      }
    ],
    "qualities": [
      {
        "p": "Humility, Obedience to guru, Preaching zeal, Love for Radharani, Courage"
      }
    ],
    "timeline": [
      {
        "title": "Appearance",
        "year": "1535",
        "date": "c. 1535",
        "place": "Dharenda, Odisha",
        "text": "Born to Krishna Mandala and Durika and named Dukhi."
      },
      {
        "title": "Initiation by Hridaya Chaitanya",
        "place": "Ambika Kalna",
        "text": "Received the name Dukhi Krishnadas."
      },
      {
        "title": "Studies under Jiva Gosvami",
        "place": "Vrindavan",
        "text": "Joined Srinivasa and Narottama as Jiva Gosvami's students."
      },
      {
        "title": "Finds Radharani's anklet",
        "place": "Seva-kunja, Vrindavan",
        "text": "Received the name Shyamananda and the nupura tilaka from Lalita-sakhi."
      },
      {
        "title": "Receives Sri Shyamasundara",
        "year": "1578",
        "date": "Vasanta Panchami, 1578",
        "place": "Nidhuvana, Vrindavan",
        "text": "Radharani gave him the Deity of Shyamasundara."
      },
      {
        "title": "Divine marriage of Shyamasundara",
        "year": "1580",
        "date": "Vasanta Panchami, 1580",
        "place": "Vrindavan",
        "text": "Arranged the marriage of Shyamasundara with Radharani (Laliji)."
      },
      {
        "title": "Preaching in Odisha",
        "place": "Odisha",
        "text": "With Rasikananda converted kings and landowners throughout Odisha."
      },
      {
        "title": "Disappearance",
        "place": "Narasinghapur, Odisha",
        "text": "Named Rasikananda his successor before departing."
      }
    ],
    "books": [
      {
        "title": "Vrindavana Parikrama",
        "text": "An account of the important holy places of Vraja."
      },
      {
        "title": "Upasana-sara-sangraha",
        "text": "A rare work on devotional practice following Jiva Gosvami's outline."
      }
    ]
  },
  {
    "slug": "srila-vishvanatha-chakravarti-thakura",
    "name": "Srila Vishvanatha Chakravarti Thakura",
    "shortName": "Vishvanatha Chakravarti",
    "title": "Leading acharya of the Gaudiya sampradaya in the 17th century",
    "category": "Post-Goswami Acharyas",
    "sampradaya": "Brahma-Madhva-Gaudiya",
    "featured": false,
    "years": "1638 – 1708",
    "appearance": {
      "date": "1638",
      "place": "Nadia, Bengal"
    },
    "disappearance": {
      "date": "1708",
      "place": "Vrindavan"
    },
    "portrait": `${R2}/srila-vishvanatha-chakravarti-thakura-portrait.webp`,
    "banner": `${R2}/srila-vishvanatha-chakravarti-thakura-banner.webp`,
    "summary": "The great 17th-century acharya and commentator who protected the Goswamis' teachings, wrote Sri Gurvashtaka, and trained Baladeva Vidyabhushana.",
    "biography": [
      {
        "p": "Srila Vishvanatha Chakravarti Thakura (1638-1708), Vinoda-manjari in Krishna-lila, was the great acharya who guarded Lord Chaitanya's teachings in the century after Jiva Gosvami. Born into a brahmana family in Bengal, he was a disciple of Radharamana Chakravarti in the line of Narottama Dasa Thakura. Though married young, he left for Radha-kunda, where he lived beside Raghunatha Dasa Gosvami's kutir and worshipped Sri Gokulananda and Raghunatha Dasa's Govardhana-shila. He defeated those who denied the parakiya mood of Radha and Krishna. He wrote over forty works, including Madhurya-kadambini and celebrated commentaries on Srimad-Bhagavatam and Bhagavad-gita that Srila Prabhupada consulted. His Sri Gurvashtaka is sung every morning at mangala-arati in ISKCON temples. Baladeva Vidyabhushana was his disciple. His samadhi is in the garden of the Radha-Gokulananda temple in Vrindavan."
      },
      {
        "p": "His father was Rama Narayana Chakravarti. Ordered by his guru to spend a night with his young wife, he spent it chanting the holy name. While he copied the Bhagavatam by hand, clouds shaded him and rain did not touch him. His opponents, plotting to attack him at Radha-kunda, met a young maidservant of Radharani, his siddha form, and became his followers. When doubt arose about the syllables of the kama-gayatri, Radharani appeared in a dream to confirm Krishnadasa Kaviraja's words."
      }
    ],
    "teachings": [
      {
        "p": "Radha and Krishna's love is eternally parakiya; raganuga bhakti does not reject regulated devotional practice; and the spiritual master is to be worshipped as the Lord's dearest servant."
      }
    ],
    "qualities": [
      {
        "p": "Scholarship, Sense control, Courage, Forgiveness, Rasika devotion"
      }
    ],
    "timeline": [
      {
        "title": "Appearance",
        "year": "1638",
        "place": "Nadia, Bengal",
        "text": "Born to Rama Narayana Chakravarti."
      },
      {
        "title": "First stay at Radha-kunda",
        "year": "1655",
        "date": "c. 1655",
        "place": "Radha-kunda",
        "text": "Lived with Mukunda Dasa in Krishnadasa Kaviraja's old bhajana kutir."
      },
      {
        "title": "Copies Srimad-Bhagavatam",
        "place": "Nadia, Bengal",
        "text": "Clouds shaded him and rain did not fall on him as he wrote."
      },
      {
        "title": "Receives Sri Gokulananda",
        "place": "Radha-kunda",
        "text": "Accepted the Deity after the Lord instructed him in a dream."
      },
      {
        "title": "Defends parakiya-rasa",
        "place": "Radha-kunda",
        "text": "Defeated the proponents of svakiya-vada, who became his followers."
      },
      {
        "title": "Disappearance",
        "year": "1708",
        "place": "Vrindavan",
        "text": "His samadhi is in the garden of the Radha-Gokulananda temple."
      }
    ],
    "books": [
      {
        "title": "Sarartha-darshini",
        "text": "Commentary on Srimad-Bhagavatam, consulted by Srila Prabhupada."
      },
      {
        "title": "Commentary on Bhagavad-gita",
        "text": "Commentary on the Bhagavad-gita."
      },
      {
        "title": "Madhurya-kadambini",
        "text": "Describes the stages of devotional advancement from faith to love of God."
      },
      {
        "title": "Sri Gurvashtaka",
        "text": "Eight prayers to the spiritual master, sung daily at mangala-arati."
      },
      {
        "title": "Vraja-riti-chintamani",
        "text": "On the customs and holy places of Vraja."
      },
      {
        "title": "Sri Krishna-bhavanamrita",
        "text": "A poem on the daily pastimes of Radha and Krishna."
      },
      {
        "title": "Sankalpa-kalpadruma",
        "text": "Prayers for service in the daily pastimes."
      },
      {
        "title": "Mantrartha-dipika",
        "text": "Explains the confidential meaning of the kama-gayatri mantra."
      },
      {
        "title": "Chamatkara-chandrika",
        "text": "Four stories of Radha and Krishna's pastimes."
      },
      {
        "title": "Commentary on Prema-bhakti-chandrika",
        "text": "Sanskrit commentary on Narottama Dasa Thakura's poem."
      }
    ]
  },
  {
    "slug": "srila-baladeva-vidyabhushana",
    "name": "Srila Baladeva Vidyabhushana",
    "shortName": "Baladeva Vidyabhushana",
    "title": "Author of Govinda-bhashya, the Gaudiya commentary on Vedanta-sutra",
    "category": "Post-Goswami Acharyas",
    "sampradaya": "Brahma-Madhva-Gaudiya",
    "featured": false,
    "years": "Disappeared 1768",
    "appearance": {
      "place": "Near Remuna, Balasore, Odisha"
    },
    "disappearance": {
      "date": "1768",
      "place": "Vrindavan"
    },
    "portrait": `${R2}/srila-baladeva-vidyabhushana-portrait.webp`,
    "banner": `${R2}/srila-baladeva-vidyabhushana-banner.webp`,
    "summary": "Disciple of Vishvanatha Chakravarti who wrote Govinda-bhashya at Galta, Jaipur, in 1706 and secured the Gaudiya sampradaya's standing among Vedanta schools.",
    "biography": [
      {
        "p": "Srila Baladeva Vidyabhushana, described as Gopinatha Acharya in Chaitanya-lila and Ratnavali in Krishna-lila, was born near Remuna in Odisha. A brilliant scholar, he first became a sannyasi in the Madhva line, until Radha-Damodara Deva Gosvami, a disciple of Rasikananda, introduced him to Mahaprabhu's teachings. He later studied under Vishvanatha Chakravarti Thakura in Vrindavan. In 1706, when the Ramanandis at Galta near Jaipur challenged the Gaudiyas' right to worship Govindaji because they had no Vedanta-sutra commentary, Baladeva appealed to Sri Govinda. In a dream the Lord promised to dictate one, and Baladeva wrote the Govinda-bhashya, which silenced his opponents and earned him the title Vidyabhushana, one whose ornament is knowledge. He wrote more than twenty other works, including Prameya-ratnavali and Gita-bhashya. He worshipped Sri Jaya-Vijaya Govinda and departed in Vrindavan in 1768."
      },
      {
        "p": "Before his conversion he travelled as a victorious scholar, defeating the panditas of many holy places. After his victory the Ramanandis asked him for initiation, but he declined out of respect for the Sri sampradaya. The Maharaja of Jaipur then decreed that Govindaji's arati would be performed first. He later began a commentary on Jiva Gosvami's Sat-sandarbha. Known also as Govinda Dasa, his disciples included Uddhava Dasa, whose line led to Jagannatha Dasa Babaji. His small temple at Galta still holds about a hundred shalagrama-shilas."
      }
    ],
    "teachings": [
      {
        "p": "Srimad-Bhagavatam is the natural commentary on Vedanta-sutra; Radha must be worshipped with Govinda; and every achievement is only the Lord's mercy."
      }
    ],
    "qualities": [
      {
        "p": "Scholarship, Surrender to guru, Humility, Courage in debate, Respect for other sampradayas"
      }
    ],
    "timeline": [
      {
        "title": "Appearance",
        "place": "Near Remuna, Odisha",
        "text": "Born near Remuna in Balasore district."
      },
      {
        "title": "Accepts Gaudiya Vaishnavism",
        "place": "Jagannatha Puri",
        "text": "Initiated by Radha-Damodara Deva Gosvami."
      },
      {
        "title": "Studies under Vishvanatha Chakravarti",
        "place": "Vrindavan",
        "text": "Studied Srimad-Bhagavatam and Gaudiya siddhanta."
      },
      {
        "title": "Writes Govinda-bhashya",
        "year": "1706",
        "place": "Galta, Jaipur",
        "text": "Defeated the Ramanandis and received the title Vidyabhushana."
      },
      {
        "title": "Becomes leading acharya",
        "year": "1708",
        "place": "Vrindavan",
        "text": "Led the sampradaya after Vishvanatha Chakravarti's departure."
      },
      {
        "title": "Disappearance",
        "year": "1768",
        "place": "Vrindavan",
        "text": "Entered samadhi in Vrindavan."
      }
    ],
    "books": [
      {
        "title": "Govinda-bhashya",
        "year": "1706",
        "text": "The Gaudiya commentary on Vedanta-sutra, written at Galta, Jaipur."
      },
      {
        "title": "Siddhanta-ratna",
        "text": "A work supporting the Govinda-bhashya."
      },
      {
        "title": "Prameya-ratnavali",
        "text": "A summary of the essential tenets of Gaudiya Vaishnava philosophy."
      },
      {
        "title": "Vedanta-syamantaka",
        "text": "A work on Vedanta philosophy."
      },
      {
        "title": "Siddhanta-darpana",
        "text": "A work on Vaishnava conclusions."
      },
      {
        "title": "Gita-bhushana",
        "text": "Commentary on Bhagavad-gita."
      },
      {
        "title": "Vaishnavanandini",
        "text": "Commentary on Srimad-Bhagavatam."
      },
      {
        "title": "Commentaries on the ten principal Upanishads"
      },
      {
        "title": "Aishvarya-kadambini"
      },
      {
        "title": "Sahitya-kaumudi"
      },
      {
        "title": "Chandah-kaustubha"
      },
      {
        "title": "Kavya-kaustubha"
      }
    ]
  }
];

/** Category filters, in the order of the list. */
export const CATEGORIES: AcharyaCategory[] = [...new Set(ACHARYAS.map((a) => a.category))];

/** Srila Prabhupada's portrait is a photograph (head off-centre), so it gets no painted halo. */
export const isPhoto = (a: Acharya) => a.slug === "srila-prabhupada";

export const acharyaBySlug = (slug: string) => ACHARYAS.find((a) => a.slug === slug);

/** The recorded guru-to-disciple line, eldest first (Jagannatha Dasa Babaji ... Srila Prabhupada). */
export const PARAMPARA: Acharya[] = (() => {
  const line: Acharya[] = [];
  let a = ACHARYAS.find((x) => x.lineage && !x.lineage.guru && x.lineage.disciple);
  while (a) {
    line.push(a);
    a = a.lineage?.disciple ? acharyaBySlug(a.lineage.disciple) : undefined;
  }
  return line;
})();

/** Is this a single comma-separated list (shown as chips) rather than long-form text? */
export const asList = (blocks: Block[]) =>
  blocks.length === 1 && "p" in blocks[0] && blocks[0].p.includes(",") && !/[.;]$/.test(blocks[0].p)
    ? blocks[0].p.split(",").map((s) => s.trim()).filter(Boolean)
    : null;

/** Meta description: the summary, cut on a whole word near 155 characters. */
export function acharyaDescription(a: Acharya) {
  const s = `${a.name}, ${a.title}. ${a.summary}`;
  if (s.length <= 158) return s;
  const cut = s.slice(0, 155);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "")}…`;
}

export function acharyaPersonJsonLd(a: Acharya, siteUrl: string) {
  const guru = a.lineage?.guru ? acharyaBySlug(a.lineage.guru) : undefined;
  return {
    "@type": "Person",
    "@id": `${siteUrl}/acharyas/${a.slug}#person`,
    name: a.name,
    alternateName: a.shortName,
    url: `${siteUrl}/acharyas/${a.slug}`,
    image: a.portrait,
    description: a.summary,
    jobTitle: a.title,
    ...(a.appearance?.place ? { birthPlace: a.appearance.place } : {}),
    ...(a.disappearance?.place ? { deathPlace: a.disappearance.place } : {}),
    ...(guru ? { knows: { "@type": "Person", name: guru.name, url: `${siteUrl}/acharyas/${guru.slug}` } } : {}),
  };
}

