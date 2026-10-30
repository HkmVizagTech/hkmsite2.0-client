/**
 * Cleans whatever a donor types, pastes or autofills into a mobile-number field down to a 10-digit Indian number.
 *
 * Phones and browsers often fill the number with its country code ("+91 93441 70340"). Cutting that down to the
 * first 10 digits kept the "91" and dropped the last two digits, which saved a wrong number that still looked valid
 * (9193441703). A full international form is now recognised and its prefix removed first:
 *   +91 xxxxxxxxxx / 91 xxxxxxxxxx (12 digits), 0 xxxxxxxxxx (11), 091 xxxxxxxxxx (13), 0091 xxxxxxxxxx (14).
 * A number that really starts with 91 (for example 9123456789) is left alone: it only counts as a country code
 * when it is exactly 12 digits long.
 */
export function cleanMobile(raw: string): string {
  let d = String(raw ?? "").replace(/\D/g, "");
  if (d.length === 14 && d.startsWith("0091")) d = d.slice(4);
  else if (d.length === 13 && d.startsWith("091")) d = d.slice(3);
  else if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return d.slice(0, 10);
}
