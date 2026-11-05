import Image from "next/image";

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function initialsOf(title: string): string {
  const words = title
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return "ॐ";
  return (words[0][0] + (words[1]?.[0] || "")).toUpperCase();
}

/**
 * Square cover. Fills its parent (give the parent `relative aspect-square overflow-hidden`
 * and a radius). Uses the real cover when there is one, otherwise draws deterministic
 * blue-family art (gradient + lotus + initials) from the title.
 */
export default function CoverArt({
  title,
  src,
  className = "",
  priority = false,
  sizes = "(max-width: 640px) 45vw, 220px",
  showInitials = true,
}: {
  title: string;
  src?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  showInitials?: boolean;
}) {
  if (src) {
    // A shared composer portrait or category picture: put the song title on it so every bhajan still looks individual.
    const shared = /\/bhajans\/(authors|categories)\//.test(src);
    return (
      <div className={`absolute inset-0 bg-vk-100 [container-type:inline-size] ${className}`}>
        <Image src={src} alt="" fill unoptimized sizes={sizes} priority={priority} className="object-cover" />
        {shared && showInitials && (
          <>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0b1745]/90 via-[#0b1745]/30 to-transparent" />
            <p className="absolute inset-x-0 bottom-0 line-clamp-3 p-[7%] text-center font-serif-display text-[clamp(.8rem,8cqw,1.6rem)] font-semibold leading-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,.6)]">
              {title}
            </p>
          </>
        )}
      </div>
    );
  }

  const h = hash(title || "bhajan");
  const hue = 212 + (h % 28); // 212..239: blue to indigo
  const hue2 = 205 + ((h >> 5) % 38);
  const angle = (h >> 9) % 360;
  const petals = 8 + ((h >> 3) % 3) * 2; // 8, 10, 12
  const rot = (h >> 12) % 45;
  const id = `ca${h.toString(36)}`;
  const c1 = `hsl(${hue} 78% 22%)`;
  const c2 = `hsl(${hue2} 72% 38%)`;
  const c3 = `hsl(${hue2 + 6} 85% 62%)`;

  return (
    <div className={`absolute inset-0 ${className}`} role="img" aria-label={`${title} cover art`}>
      <svg viewBox="0 0 200 200" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <linearGradient id={`${id}g`} gradientTransform={`rotate(${angle} .5 .5)`}>
            <stop offset="0" stopColor={c1} />
            <stop offset=".6" stopColor={c2} />
            <stop offset="1" stopColor={c3} />
          </linearGradient>
          <radialGradient id={`${id}r`} cx=".5" cy=".42" r=".6">
            <stop offset="0" stopColor="#fff" stopOpacity=".28" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="200" height="200" fill={`url(#${id}g)`} />
        <rect width="200" height="200" fill={`url(#${id}r)`} />
        <g transform="translate(100 108)" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="1">
          <circle r="84" strokeOpacity=".14" />
          <circle r="70" strokeOpacity=".18" />
          <g transform={`rotate(${rot})`}>
            {Array.from({ length: petals }).map((_, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-46"
                rx="14"
                ry="34"
                fill="#fff"
                fillOpacity=".07"
                transform={`rotate(${(360 / petals) * i})`}
              />
            ))}
          </g>
          <g transform={`rotate(${rot + 180 / petals})`}>
            {Array.from({ length: petals }).map((_, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-30"
                rx="9"
                ry="22"
                fill="#fff"
                fillOpacity=".1"
                transform={`rotate(${(360 / petals) * i})`}
              />
            ))}
          </g>
          <circle r="9" fill="#F5C451" fillOpacity=".9" stroke="none" />
        </g>
        {showInitials && (
          <text
            x="100"
            y="178"
            textAnchor="middle"
            fontSize="22"
            fontWeight="700"
            letterSpacing="3"
            fill="#fff"
            fillOpacity=".85"
            fontFamily="var(--font-playfair), Georgia, serif"
          >
            {initialsOf(title)}
          </text>
        )}
      </svg>
    </div>
  );
}
