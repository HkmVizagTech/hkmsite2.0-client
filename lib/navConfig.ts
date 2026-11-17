import {
  Home, Info, User, Phone,
  Clock, Image, Calendar, Snowflake, BrickWall, Ruler,
  Heart, Utensils, Beef, BookOpen, Shirt, Gift,
  CalendarDays, PartyPopper, HandHeart, FileText, Flower2, Building2,
  ShoppingBag, Package, Megaphone, MapPin, Landmark, Briefcase, Globe, Music2, ScrollText,
  type LucideIcon,
} from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
}

export interface NavGroup {
  label: string;
  icon?: LucideIcon;
  items: NavLink[];
}

export type NavEntry =
  | { kind: "link"; label: string; href: string; icon?: LucideIcon }
  | { kind: "festival"; icon?: LucideIcon }
  | { kind: "customLink"; icon?: LucideIcon }
  | { kind: "group"; group: NavGroup };

// Five clear groups and Donate; the header stays short. Account links (Donor Login, My Orders) live in the
// footer and the mobile menu, not in the main menu.
export const navEntries: NavEntry[] = [
  { kind: "link", label: "Home", href: "/", icon: Home },
  { kind: "link", label: "Srila Prabhupada", href: "/founder", icon: User },
  // The current major festival, auto-picked from the Vaishnava calendar (or
  // overridden by an admin). Rendered by Navbar only when one is active.
  { kind: "festival", icon: Flower2 },
  // An optional custom nav link (name + URL) an admin can turn on, separate
  // from the major-festival highlight. Rendered by Navbar only when enabled.
  { kind: "customLink", icon: Megaphone },
  {
    kind: "group",
    group: {
      label: "About",
      icon: Info,
      items: [
        { label: "About Us", href: "/about", description: "Our mission, history & values", icon: Info },
        { label: "Our Acharyas", href: "/acharyas", description: "The disciplic succession", icon: ScrollText },
        { label: "Governance", href: "/governance", description: "The Governing Council", icon: Landmark },
        { label: "Our Centers", href: "/centers", description: "Hare Krishna Movement temples", icon: Globe },
        { label: "Contact Us", href: "/contact", description: "Visit, call, or write to us", icon: Phone },
        { label: "Donor Login", href: "/donor/login", description: "Your donations & receipts", icon: User },
        { label: "My Orders", href: "/shop/orders", description: "Track your Matchless Gifts orders", icon: Package },
      ],
    },
  },
  {
    kind: "group",
    group: {
      label: "Temple",
      icon: Clock,
      items: [
        { label: "Plan Your Visit", href: "/iskcon-vizag-temple", description: "Timings, address & map", icon: MapPin },
        { label: "Hindu Temples", href: "/temples", description: "Temple guide: timings, history & directions", icon: Landmark },
        { label: "Daily Schedule", href: "/daily-schedule", description: "Aarti timings & daily programs", icon: Clock },
        { label: "Festivals", href: "/festival", description: "Celebrations at the temple", icon: PartyPopper },
        { label: "Vaishnav Calendar", href: "/vaishnav-calendar", description: "Festivals & Ekadashis", icon: Calendar },
        { label: "Chaturmas", href: "/chaturmas", description: "Sacred four-month observance", icon: Snowflake },
        { label: "Gallery", href: "/gallery", description: "Photos from the temple", icon: Image },
      ],
    },
  },
  {
    kind: "group",
    group: {
      label: "Seva",
      icon: Heart,
      items: [
        { label: "Anna Daan", href: "/anna-daan-seva", description: "Feed the hungry", icon: Utensils },
        { label: "Subhojanam", href: "/subhojanam", description: "Free meals for patients' families", icon: Utensils },
        { label: "Gau Seva", href: "/gau-seva", description: "Cow care & protection", icon: Beef },
        { label: "Gita Daan", href: "/gita-daan-seva", description: "Distribute Bhagavad Gita", icon: BookOpen },
        { label: "Square Foot Seva", href: "/sqft-seva-campaign", description: "Sponsor the new temple, foot by foot", icon: Ruler },
        { label: "Brick Seva", href: "/brick-seva-campaign", description: "Sponsor a brick for the temple", icon: BrickWall },
        { label: "Become a Patron", href: "/patron", description: "Inscribe your family name in the temple", icon: Landmark },
        { label: "Vastra Seva", href: "/alankara-vastra-seva", description: "Deity garments & ornaments", icon: Shirt },
        { label: "Ekadashi Seva", href: "/ekadashi", description: "Donate on the sacred Ekadashi day", icon: Calendar },
        { label: "All Sevas", href: "/donate", description: "Every seva opportunity", icon: Gift },
      ],
    },
  },
  {
    kind: "group",
    group: {
      label: "Get Involved",
      icon: BookOpen,
      items: [
        { label: "Blogs", href: "/blogs", description: "Articles & spiritual insights", icon: FileText },
        { label: "Vaishnava Bhajans", href: "/bhajans", description: "Lyrics & audio of the Acharyas' songs", icon: Music2 },
        { label: "Events", href: "/events", description: "Programs & registrations", icon: CalendarDays },
        { label: "Volunteer", href: "/volunteer", description: "Serve with us", icon: HandHeart },
        { label: "Matchless Gifts Shop", href: "/shop", description: "Books & devotional gifts", icon: ShoppingBag },
        { label: "CSR Partnership", href: "/csr", description: "For companies", icon: Building2 },
        { label: "Careers", href: "https://careers.harekrishnavizag.org", description: "Work and serve with us", icon: Briefcase },
      ],
    },
  },
];

// Flat list for "is this path active?" checks (the festival/customLink slots
// resolve at runtime inside Navbar, so they have no static href to include here)
export const allNavHrefs = navEntries.flatMap((e) =>
  e.kind === "group" ? e.group.items.map((i) => i.href) : e.kind === "link" ? [e.href] : []
);

// Bottom bar items for mobile
export const bottomBarItems: {
  label: string;
  href?: string;
  icon: LucideIcon;
  groupLabel?: string;
}[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Subhojanam", href: "/subhojanam", icon: Utensils },
  { label: "Temple", icon: Clock, groupLabel: "Temple" },
  { label: "Seva", icon: Heart, groupLabel: "Seva" },
  // "More" is handled specially in the component, not in this array
];

// Utility: check if any child in a group matches the current pathname
export function isGroupActive(group: NavGroup, pathname: string): boolean {
  return group.items.some(
    (item) => pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
  );
}

// ── Pages without the mobile bottom bar ─────────────────────────────
// Donation / checkout pages keep the screen for the seva form and their own
// sticky "Donate" bar, so the bottom bar would only get in the way. Pages
// that don't render the site Navbar at all (shop, standalone campaign and
// thank-you pages) are listed too so no empty space is reserved for it.
export const HIDE_BOTTOM_NAV_PREFIXES = [
  "/donate",
  "/donations",
  "/gau-seva",
  "/anna-daan-seva",
  "/gita-daan-seva",
  "/alankara-vastra-seva",
  "/sqft-seva-campaign",
  "/brick-seva-campaign",
  "/ekadashi",
  "/shayani-ekadashi",
  "/pitru-paksha",
  "/vijayadashami",
  "/kartik-maas",
  "/emergency-relief",
  "/vaikuntha-ekadashi",
  "/diwali",
  "/govardhan-puja",
  "/radhashtami",
  "/chaturmas",
  "/special-occasion",
  // Free Gita course page: full-screen story with its own Register buttons
  "/understand-gita",
  "/srila-prabhupada",
  "/te/understand-gita",
  "/te/srila-prabhupada",
  "/subhojanam",
  "/janmashtami",
  "/janmashtami3",
  "/payment",
  "/shop",
];

export function shouldHideBottomNav(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return HIDE_BOTTOM_NAV_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
