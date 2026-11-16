// Kept tiny so client components can link to temples without pulling in the temple data.
/** Our own temple has its full page at /iskcon-vizag-temple; the guide links there instead of a second copy. */
export const OWN_TEMPLE_SLUG = "hare-krishna-vaikuntham-iskcon-gambheeram-visakhapatnam";
export const templeHref = (slug: string) => (slug === OWN_TEMPLE_SLUG ? "/iskcon-vizag-temple" : `/temples/${slug}`);
