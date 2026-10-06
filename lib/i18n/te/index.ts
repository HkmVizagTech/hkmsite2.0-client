// Telugu dictionary = all area files merged. Keys are the exact English
// source strings passed to t(); values are the Telugu.
import { common } from "./common";
import { nav } from "./nav";
import { footer } from "./footer";
import { home } from "./home";
import { pitruPaksha } from "./pitruPaksha";
import { upi } from "./upi";
import { shared } from "./shared";

export const te: Record<string, string> = { ...common, ...nav, ...footer, ...home, ...pitruPaksha, ...upi, ...shared };
