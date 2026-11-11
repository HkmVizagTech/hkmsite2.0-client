/** Hand-drawn seva icons for the Srila Prabhupada page, in brass-gold to match the midnight cards. */

/** A brass kalasha crowned with a coconut and mango leaves: the pot the abhishekam is poured from. */
export function KalashIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <linearGradient id="kl-brass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF1C9" />
          <stop offset=".45" stopColor="#F6C752" />
          <stop offset="1" stopColor="#B9791A" />
        </linearGradient>
        <radialGradient id="kl-coco" cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#B07A45" />
          <stop offset="1" stopColor="#6B4220" />
        </radialGradient>
      </defs>
      {/* mango leaves */}
      <path d="M16 9.5C12 9 8.5 7.5 6.5 5c3 .2 6.5 1.6 9.5 4.5Z" fill="#3E8E46" />
      <path d="M16 9.5c4-.5 7.5-2 9.5-4.5-3 .2-6.5 1.6-9.5 4.5Z" fill="#3E8E46" />
      <path d="M16 9.5c-2.6-1.4-4.6-3.6-5.2-6.4 2.2 1 4.2 3.2 5.2 6.4Z" fill="#5FB35F" />
      <path d="M16 9.5c2.6-1.4 4.6-3.6 5.2-6.4-2.2 1-4.2 3.2-5.2 6.4Z" fill="#5FB35F" />
      {/* coconut */}
      <ellipse cx="16" cy="7.4" rx="3.6" ry="3.3" fill="url(#kl-coco)" />
      <path d="M16 4.1c.3-.9.9-1.5 1.7-1.8" stroke="#6B4220" strokeWidth=".8" strokeLinecap="round" fill="none" />
      {/* rim and neck */}
      <rect x="10" y="9.6" width="12" height="2" rx="1" fill="url(#kl-brass)" />
      <path d="M12.2 11.6h7.6l-.9 2.1h-5.8Z" fill="#C98B1E" />
      {/* body */}
      <path d="M13.1 13.7C6.6 15 5.6 24.6 10.4 27.2h11.2c4.8-2.6 3.8-12.2-2.7-13.5Z" fill="url(#kl-brass)" />
      <path d="M7.9 19.4h16.2" stroke="#8B4A12" strokeWidth=".9" />
      <path d="M8.3 21.2h15.4" stroke="#8B4A12" strokeWidth=".5" opacity=".7" />
      {[10, 13, 16, 19, 22].map((x) => <circle key={x} cx={x} cy="20.3" r=".45" fill="#8B4A12" />)}
      <ellipse cx="11.3" cy="17.6" rx="1.3" ry="2.6" fill="#fff" opacity=".45" transform="rotate(20 11.3 17.6)" />
      {/* foot */}
      <path d="M11.4 27.2h9.2l1 2.4H10.4Z" fill="#C98B1E" />
    </svg>
  );
}

/** A brass plate heaped with rice, for Annadana. */
export function RicePlateIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <linearGradient id="rp-brass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF1C9" />
          <stop offset=".45" stopColor="#F6C752" />
          <stop offset="1" stopColor="#B9791A" />
        </linearGradient>
        <radialGradient id="rp-rice" cx=".4" cy=".3" r=".8">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E9E1CF" />
        </radialGradient>
      </defs>
      {/* banana-leaf edge */}
      <path d="M4 21c5-3.5 19-3.5 24 0-4 1-20 1-24 0Z" fill="#3E8E46" />
      {/* rice mound */}
      <path d="M8 21c0-6 3.6-10 8-10s8 4 8 10Z" fill="url(#rp-rice)" />
      {[[12, 16], [15, 14], [18, 15.5], [20, 18.5], [14, 18.8], [17, 19.4], [11, 19.6]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx=".75" ry=".35" fill="#D8CDB5" transform={`rotate(${(i * 37) % 90 - 45} ${x} ${y})`} />
      ))}
      {/* tulasi leaf on top */}
      <path d="M16 11c1.2-1.6 3-2 4.2-1.6-.6 1.4-2.4 2.2-4.2 1.6Z" fill="#5FB35F" />
      {/* brass plate */}
      <ellipse cx="16" cy="22.4" rx="13" ry="3.4" fill="url(#rp-brass)" />
      <ellipse cx="16" cy="21.9" rx="10.6" ry="2.1" fill="#C98B1E" opacity=".35" />
      <path d="M5.5 24.2c5.5 2.3 15.5 2.3 21 0" stroke="#8B4A12" strokeWidth=".7" fill="none" />
    </svg>
  );
}
