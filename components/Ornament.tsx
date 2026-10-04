/**
 * Subtle section divider in Vaikuntham Blue — two hairlines either side of a
 * small diamond. Kept for pages that still render it; new sections should use
 * a `vk-pill` eyebrow (via SectionHeading) instead.
 */
const Ornament = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-2.5 text-vk-400 ${className}`} aria-hidden>
    <span className="h-px w-10 bg-gradient-to-r from-transparent to-current" />
    <span className="h-1.5 w-1.5 rotate-45 rounded-[2px] bg-vk-500" />
    <span className="h-px w-10 bg-gradient-to-l from-transparent to-current" />
  </div>
);
export default Ornament;
