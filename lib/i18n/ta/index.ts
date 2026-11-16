// ta dictionary = all area files merged. Keys are the exact English
// source strings passed to t(); values are the translations.
import { common } from "./common";
import { nav } from "./nav";
import { footer } from "./footer";
import { home } from "./home";
import { pitruPaksha } from "./pitruPaksha";
import { upi } from "./upi";
import { shared } from "./shared";
import { visit } from "./visit";
import { seo } from "./seo";
import { vaikunthaEkadashi } from "./vaikunthaEkadashi";
import { diwali } from "./diwali";
import { understandGita } from "./understandGita";
import { governance } from "./governance";
import { srilaPrabhupada } from "./srilaPrabhupada";
import { acharyas } from "./acharyas";

export const ta: Record<string, string> = { ...common, ...nav, ...footer, ...home, ...pitruPaksha, ...upi, ...shared, ...visit, ...seo, ...vaikunthaEkadashi, ...diwali, ...understandGita, ...governance, ...srilaPrabhupada, ...acharyas };
