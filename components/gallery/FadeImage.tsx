"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * A photo at its natural shape that fades in once it has loaded. Until then the
 * frame holds a soft shimmering placeholder, so the wall never looks empty or jumps.
 */
export default function FadeImage({
  src,
  alt,
  sizes,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <span className={`relative block ${loaded ? "" : "min-h-[180px] animate-pulse bg-gradient-to-br from-[#EEF2FF] to-[#E4E9F7]"}`}>
      <Image
        src={src}
        alt={alt}
        width={0}
        height={0}
        loading="lazy"
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        style={{ width: "100%", height: "auto" }}
        className={`block transition-[opacity,transform] duration-700 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
      />
    </span>
  );
}
