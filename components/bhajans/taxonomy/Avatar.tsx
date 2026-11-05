import PersonAvatar from "../PersonAvatar";

/** Round portrait; a designed initials disc (e.g. JG for Jiva Goswami) when there is no image or it fails to load. */
export default function Avatar({ name, src, className = "h-24 w-24", sizes = "120px", textClass = "text-2xl" }: { name: string; src?: string; className?: string; sizes?: string; textClass?: string }) {
  return <PersonAvatar name={name} src={src} className={`shadow-[0_4px_12px_-6px_rgba(15,31,92,.25)] ${className}`} sizes={sizes} textClass={textClass} />;
}
