import { TEMPLE } from "@/lib/templeInfo";

/**
 * Content for the free "Understand Gita in 18 Days" course page. Edit here: the enrolment WhatsApp number, batch note and
 * FAQs all come from this file. The number defaults to the temple's own phone; change ENROL_PHONE if the course desk differs.
 */
export const ENROL_PHONE = "918977761187"; // international format, no "+" (same as TEMPLE.phone)
export const ENROL_MESSAGE = "Hare Krishna! I would like to join the free Understand Gita in 18 Days course.";
export const ENROL_URL = `https://wa.me/${ENROL_PHONE}?text=${encodeURIComponent(ENROL_MESSAGE)}`;
export const ENROL_PHONE_LABEL = TEMPLE.phone;

/**
 * WhatsApp group invite links, one per batch. After registering, the donor is sent to the group for their batch.
 * Fill the links (chat.whatsapp.com/...) below. To use a separate group per language, add keys like "adults:Telugu"
 * (batch, colon, language); the form tries that first and falls back to the plain batch key. With no link set,
 * the form falls back to a WhatsApp message to the temple number (ENROL_URL).
 */
export const WHATSAPP_GROUPS: Record<string, string> = {
  adults: "",
  youth: "",
  kids: "",
};
export function groupLink(batch: string, language: string): string {
  return WHATSAPP_GROUPS[`${batch}:${language}`] || WHATSAPP_GROUPS[batch] || "";
}
export const AGE_LABELS: Record<string, string> = { adults: "Above 25 years", youth: "16 to 25 years", kids: "15 years and below" };

export const STATS = [
  { value: 18, suffix: "", label: "Days" },
  { value: 60, suffix: "", label: "Minutes live, every day" },
  { value: 18, suffix: "", label: "Chapters explored" },
  { value: 0, suffix: "", label: "Course fee", free: true },
] as const;

export type Feature = { icon: string; title: string; text: string };
/** Icon names are mapped to lucide icons in the client component. */
export const FEATURES: Feature[] = [
  { icon: "video", title: "60 minutes live, every day", text: "A focused live session each day, so the whole Gita fits into 18 days of your routine." },
  { icon: "message", title: "Dedicated Q&A time", text: "Ask your questions to the instructor in every session and get clear, practical answers." },
  { icon: "monitor", title: "Modern online classroom", text: "Join from your phone or laptop with the latest tools for smooth, interactive sessions." },
  { icon: "youtube", title: "Live and recorded videos", text: "Missed a session? Watch the recording on the YouTube channel whenever suits you." },
  { icon: "book", title: "Study material provided", text: "Online study material is shared with you, so you can revise at your own pace." },
  { icon: "quiz", title: "Test your knowledge", text: "Take the online quiz to check what you have understood and what to revisit." },
  { icon: "languages", title: "Multilingual classes", text: "Learn in the language you are most comfortable with." },
  { icon: "users", title: "Separate batches", text: "Different batches for adults and kids, so everyone learns at the right level." },
  { icon: "clock", title: "Indian Standard Time", text: "All classes run on IST, with timings that suit working people, students and homemakers." },
];

export const CHAPTERS: { en: string; sa: string }[] = [
  { en: "Observing the Armies on the Battlefield", sa: "Arjuna-viṣāda-yoga" },
  { en: "Contents of the Gita Summarized", sa: "Sāṅkhya-yoga" },
  { en: "Karma-yoga", sa: "Karma-yoga" },
  { en: "Transcendental Knowledge", sa: "Jñāna-karma-sannyāsa-yoga" },
  { en: "Karma-yoga: Action in Krishna Consciousness", sa: "Karma-sannyāsa-yoga" },
  { en: "Dhyana-yoga", sa: "Dhyāna-yoga" },
  { en: "Knowledge of the Absolute", sa: "Jñāna-vijñāna-yoga" },
  { en: "Attaining the Supreme", sa: "Akṣara-brahma-yoga" },
  { en: "The Most Confidential Knowledge", sa: "Rāja-vidyā-rāja-guhya-yoga" },
  { en: "The Opulence of the Absolute", sa: "Vibhūti-yoga" },
  { en: "The Universal Form", sa: "Viśvarūpa-darśana-yoga" },
  { en: "Devotional Service", sa: "Bhakti-yoga" },
  { en: "Nature, the Enjoyer and Consciousness", sa: "Kṣetra-kṣetrajña-vibhāga-yoga" },
  { en: "The Three Modes of Material Nature", sa: "Guṇa-traya-vibhāga-yoga" },
  { en: "The Yoga of the Supreme Person", sa: "Puruṣottama-yoga" },
  { en: "The Divine and Demoniac Natures", sa: "Daivāsura-sampad-vibhāga-yoga" },
  { en: "The Divisions of Faith", sa: "Śraddhā-traya-vibhāga-yoga" },
  { en: "Conclusion: The Perfection of Renunciation", sa: "Mokṣa-sannyāsa-yoga" },
];

/**
 * One line per chapter: what that day's class covers. Shown on the 18-day journey.
 */
export const CHAPTER_SUMMARIES = [
  "Seeing his relatives on both sides, Arjuna is overcome by bodily attachment and lays down his bow.",
  "Krishna teaches the first lesson: we are not this body but the eternal soul.",
  "Work done for Krishna, as sacrifice, frees us from the bondage of karma.",
  "This ancient knowledge comes through disciplic succession; Krishna appears to protect the devotees.",
  "Acting in Krishna consciousness, without attachment to the results, brings real peace.",
  "Yoga's goal is to fix the mind on the Supreme; the devotee is the highest yogi.",
  "Krishna is the source of everything, material and spiritual.",
  "Whatever we remember at death decides our next destination; remember Krishna and reach Him.",
  "The most confidential knowledge: pure devotional service, offered with love.",
  "All that is wonderful in creation is a spark of Krishna's splendour.",
  "Arjuna is shown the universal form, and longs again for Krishna's two-armed form.",
  "Devotional service is the best path; Krishna describes the devotee dear to Him.",
  "The field (body), the knower of the field (the soul), and the Supersoul.",
  "Goodness, passion and ignorance bind the soul; devotion takes us beyond them.",
  "The banyan tree of material life, and Krishna, the Supreme Person, its root.",
  "The divine qualities that lead to freedom and the demoniac ones that lead to bondage.",
  "Faith in goodness, passion and ignorance, seen in food, sacrifice, austerity and charity.",
  "The perfection of renunciation: give up all varieties of religion and surrender unto Krishna.",
];

/**
 * Picture for each chapter on the 18-day journey (index 0 = chapter 1). Drop a file in /public/assets/gita/ and set it here.
 * Until a chapter has its own picture, it uses one of the placeholders below.
 */
export const CHAPTER_IMAGES: (string | null)[] = [
  "/assets/gita/ch01.webp",
  "/assets/gita/ch02.webp",
  "/assets/gita/ch03.webp",
  "/assets/gita/ch04.webp",
  "/assets/gita/ch05.webp",
  "/assets/gita/ch06.webp",
  "/assets/gita/ch07.webp",
  "/assets/gita/ch08.webp",
  "/assets/gita/ch09.webp",
  "/assets/gita/ch10.webp",
  "/assets/gita/ch11.webp",
  "/assets/gita/ch12.webp",
  "/assets/gita/ch13.webp",
  ...Array(5).fill(null),
];
export const CHAPTER_PLACEHOLDERS = ["/assets/gita/kk-scene-field.webp", "/assets/gita/kk-moment.webp"];

export const VERSE = {
  sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन",
  translit: "karmaṇy evādhikāras te mā phaleṣu kadācana",
  meaning: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of your actions.",
  ref: "Bhagavad-gita 2.47",
};

export const AUDIENCES = [
  {
    key: "adults",
    title: "Adults",
    lead: "For working professionals, homemakers and seniors who want a clear, practical understanding of the Gita.",
    points: ["Handle stress and decisions with a steady mind", "Understand karma, duty and detachment in daily life", "Classes fit around work and family time"],
  },
  {
    key: "youth",
    title: "Youth",
    lead: "For students and young professionals looking for direction, purpose and calm in a busy world.",
    points: ["Find purpose beyond marks and money", "Learn to manage pressure, anger and distraction", "Discuss your questions openly with the instructor"],
  },
  {
    key: "kids",
    title: "Kids",
    lead: "A gentle, story-based batch that introduces children to Krishna's wisdom in a fun way.",
    points: ["Short, simple and engaging explanations", "Values like honesty, courage and kindness", "A safe, friendly space to ask anything"],
  },
];

export const LANGUAGES = ["English", "Telugu", "Hindi"];
export const TIMES = ["Morning (5 AM to 9 AM)", "Afternoon (12 PM to 4 PM)", "Evening (5 PM to 8 PM)", "Night (8 PM to 10 PM)"];

export const STEPS = [
  { title: "Fill the form", text: "Tell us your name, WhatsApp number and batch (adults, youth or kids). It takes less than a minute. You must have WhatsApp on your device." },
  { title: "Get your batch", text: "We add you to the right batch group (adults, youth or kids) and share the class timings and joining link." },
  { title: "Attend and learn", text: "Join the daily 60-minute live session, ask your questions, watch recordings and take the quizzes." },
];

export const FAQS = [
  { q: "Is the course really free?", a: "Yes. The course is free. Buying books is optional." },
  { q: "Do I need any background in the Bhagavad-gita?", a: "No. The course starts from the basics and is meant for complete beginners as well as those who have read the Gita before." },
  { q: "What do I need to join?", a: "A phone or laptop with internet and WhatsApp. Class links and study material are shared in your batch's WhatsApp group." },
  { q: "What if I miss a class?", a: "Live and recorded videos are available on the YouTube channel, so you can catch up whenever you like." },
  { q: "Can my children join?", a: "Yes. There are separate batches for kids, and for adults and youth." },
  { q: "Do I have to buy a book?", a: "No. You receive online study material. If you would like a hard copy of Bhagavad-gita As It Is, you can get one, but it is entirely optional." },
  { q: "Which languages are the classes in?", a: "Classes are multilingual. Message us on WhatsApp and we will tell you the languages and timings of the batches that are open." },
];
