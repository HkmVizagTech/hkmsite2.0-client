"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Bus, Landmark, CalendarDays, Clock, ExternalLink, MapPin, Navigation, Plane, Plus, Sparkles, TrainFront } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useT } from "@/components/i18n/LocaleProvider";
import type { Temple } from "@/lib/templesData";
import type { PlaceInfo } from "@/lib/places";
import { Eyebrow, GoogleWord, HERO_BG, IVORY, Stars, TempleArt } from "./parts";
import type { TempleCardData } from "./TemplesList";

const ease = [0.22, 0.8, 0.3, 1] as const;
const photoUrl = (name: string, w: number) => `/api/place-photo?name=${encodeURIComponent(name)}&w=${w}`;

function Rise({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.7, ease, delay }} className={className}>
      {children}
    </motion.div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 font-heading text-2xl font-bold leading-tight text-[#0F1E4A] md:text-[2.1rem]">{title}</h2>
    </>
  );
}

export default function TempleView({ temple: tm, place, directions, nearby }: { temple: Temple; place: PlaceInfo | null; directions: string; nearby: TempleCardData[] }) {
  const t = useT();
  const reduce = useReducedMotion();
  const photos = place?.photos ?? [];
  const [lead, ...rest] = photos;

  return (
    <PageLayout background={IVORY}>
      <div className="overflow-x-clip pt-[var(--header-h)]" style={{ background: IVORY }}>
        {/* ══ HERO ══ */}
        <section className="relative isolate overflow-hidden text-white" style={{ background: HERO_BG }}>
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(50%_70%_at_78%_40%,rgba(47,91,211,.5),transparent_75%),radial-gradient(35%_45%_at_8%_0%,rgba(201,150,43,.14),transparent_70%)]" />
          <div className="vk-container py-10 md:py-16">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[12.5px] font-semibold text-white/55">
              <Link href="/temples" className="inline-flex items-center gap-1 hover:text-white"><ArrowLeft className="h-3.5 w-3.5" />{t("Vaishnava Temples of Andhra Pradesh")}</Link>
            </nav>
            <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-12">
              <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
                <Eyebrow light>{tm.form} · {tm.district}</Eyebrow>
                <h1 className="mt-4 font-heading text-[2.1rem] font-bold leading-[1.06] tracking-tight text-[#FBF7EE] sm:text-[2.6rem] md:text-[3.4rem]">{tm.name}</h1>
                <p className="mt-2 font-heading text-lg font-semibold text-[#F6E3B0]/90 md:text-xl">{tm.teluguName}</p>
                <p className="mt-5 max-w-2xl text-[15.5px] leading-8 text-white/75 md:text-[17px]">{tm.summary}</p>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px]">
                  <span className="inline-flex items-center gap-1.5 text-white/80"><MapPin className="h-4 w-4 text-[#E9C46A]" />{tm.town}, {tm.district}</span>
                  {place?.rating ? <span className="inline-flex items-center gap-2"><Stars rating={place.rating} count={place.ratingCount} light /><span className="text-white/50">{t("on")}</span><GoogleWord /></span> : null}
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href={directions} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#F6C752] px-6 py-3 text-sm font-bold text-[#0F1E4A] hover:bg-[#FFD777]"><Navigation className="h-4 w-4" />{t("Get directions")}</a>
                  <a href="#timings" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white ring-1 ring-white/30 hover:ring-white"><Clock className="h-4 w-4" />{t("Darshan timings")}</a>
                </div>
              </motion.div>

              {/* photo mosaic from Google, or our artwork until there is one */}
              <motion.div initial={reduce ? false : { opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease, delay: 0.1 }}>
                {lead ? (
                  <figure>
                    <div className="grid h-[280px] grid-cols-3 grid-rows-2 gap-2 overflow-hidden rounded-[1.6rem] sm:h-[360px] md:h-[420px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photoUrl(lead.name, 1200)} alt={tm.name} className={`h-full w-full object-cover ${rest.length >= 2 ? "col-span-2 row-span-2" : "col-span-3 row-span-2"}`} />
                      {rest.slice(0, 2).map((p) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={p.name} src={photoUrl(p.name, 600)} alt="" loading="lazy" className="h-full w-full object-cover" />
                      ))}
                    </div>
                    <figcaption className="mt-2 text-right text-[11px] text-white/45">
                      {t("Photos")}: {[lead, ...rest.slice(0, 2)].map((p) => p.author).filter(Boolean).join(", ")} · <GoogleWord />
                    </figcaption>
                  </figure>
                ) : (
                  <div className="aspect-[4/3] overflow-hidden rounded-[1.6rem] ring-1 ring-white/10"><TempleArt telugu={tm.teluguName} form={tm.form} /></div>
                )}
              </motion.div>
            </div>
          </div>
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E9C46A]/60 to-transparent" />
        </section>

        {/* ══ AT A GLANCE ══ */}
        <section className="relative -mt-px border-b border-[#E7DCC3] bg-white">
          <div className="vk-container">
            <dl className="mx-auto grid max-w-6xl grid-cols-2 divide-[#E7DCC3] md:grid-cols-4 md:divide-x">
              {[
                { k: t("Presiding deity"), v: tm.deity },
                { k: t("Location"), v: `${tm.town}, ${tm.district}` },
                { k: t("From Visakhapatnam"), v: tm.fromVizag.split(/(?<=\.)\s/)[0] },
                { k: t("Region"), v: t(tm.region) },
              ].map((f) => (
                <div key={f.k} className="px-2 py-5 md:px-6">
                  <dt className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#A87A1E]">{f.k}</dt>
                  <dd className="mt-1.5 text-[13.5px] font-semibold leading-snug text-[#0F1E4A]">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ══ HISTORY ══ */}
        <section className="py-14 md:py-20">
          <div className="vk-container">
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.35fr_.65fr] lg:gap-14">
              <Rise>
                <SectionTitle eyebrow={t("History & significance")} title={`${t("The story of")} ${tm.shortName}`} />
                <div className="mt-6 space-y-5 text-[16px] leading-[1.9] text-[#0F1E4A]/80">
                  {tm.history.map((p, k) => <p key={k}>{p}</p>)}
                </div>
              </Rise>
              <Rise delay={0.08}>
                <div className="rounded-[1.4rem] bg-white p-6 ring-1 ring-[#E7DCC3] lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
                  <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#A87A1E]"><Sparkles className="h-4 w-4" />{t("Highlights")}</p>
                  <ul className="mt-4 space-y-3">
                    {tm.highlights.map((h) => (
                      <li key={h} className="flex gap-3 text-[14px] leading-6 text-[#0F1E4A]"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-[#C9962B]" />{h}</li>
                    ))}
                  </ul>
                  {tm.festivals.length > 0 && (
                    <>
                      <p className="mt-7 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#A87A1E]"><CalendarDays className="h-4 w-4" />{t("Main festivals")}</p>
                      <ul className="mt-3 divide-y divide-[#E7DCC3]">
                        {tm.festivals.map((f) => (
                          <li key={f.name} className="flex items-baseline justify-between gap-3 py-2.5 text-[13.5px]"><span className="font-semibold text-[#0F1E4A]">{f.name}</span><span className="text-right text-[#0F1E4A]/60">{f.when}</span></li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </Rise>
            </div>
          </div>
        </section>

        {/* ══ TIMINGS ══ */}
        <section id="timings" className="scroll-mt-24 bg-white py-14 md:py-20">
          <div className="vk-container">
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-14">
              <Rise>
                <SectionTitle eyebrow={t("Plan your darshan")} title={t("Darshan & seva timings")} />
                <ul className="mt-6 overflow-hidden rounded-[1.2rem] ring-1 ring-[#E7DCC3]">
                  {tm.timings.map((x, k) => (
                    <li key={x.label} className={`flex items-center justify-between gap-4 px-5 py-3.5 text-[14.5px] ${k % 2 ? "bg-white" : "bg-[#FBF7EE]"}`}>
                      <span className="font-semibold text-[#0F1E4A]">{x.label}</span><span className="font-heading font-bold tabular-nums text-[#1E3A8A]">{x.time}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[12.5px] leading-6 text-[#0F1E4A]/60">{tm.timingsNote}</p>
                {tm.website && (
                  <a href={tm.website} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1E3A8A] hover:underline">{t("Official temple website")} <ExternalLink className="h-3.5 w-3.5" /></a>
                )}
              </Rise>
              {place?.hours?.length ? (
                <Rise delay={0.08}>
                  <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#0F1E4A]/50">{t("Opening hours on")} <GoogleWord className="normal-case tracking-normal" /></p>
                  <ul className="mt-4 space-y-1.5 text-[13.5px] text-[#0F1E4A]/75">
                    {place.hours.map((h) => <li key={h}>{h}</li>)}
                  </ul>
                  <p className="mt-3 text-[12px] text-[#0F1E4A]/50">{t("As listed on Google Maps; may differ on festival days.")}</p>
                </Rise>
              ) : null}
            </div>
          </div>
        </section>

        {/* ══ HOW TO REACH ══ */}
        <section className="py-14 md:py-20">
          <div className="vk-container">
            <div className="mx-auto max-w-6xl">
              <Rise>
                <SectionTitle eyebrow={t("How to reach")} title={`${t("Getting to")} ${tm.shortName}`} />
                <p className="mt-5 max-w-3xl text-[16px] leading-8 text-[#0F1E4A]/80">{tm.fromVizag}</p>
              </Rise>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  { icon: Bus, k: t("By road"), v: tm.howToReach.road },
                  { icon: TrainFront, k: t("By train"), v: tm.howToReach.rail },
                  { icon: Plane, k: t("By air"), v: tm.howToReach.air },
                ].map((m, k) => (
                  <Rise key={m.k} delay={k * 0.06}>
                    <div className="h-full rounded-[1.3rem] bg-white p-6 ring-1 ring-[#E7DCC3]">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F1E4A] text-[#F6C752]"><m.icon className="h-5 w-5" /></span>
                      <p className="mt-4 font-heading text-base font-bold text-[#0F1E4A]">{m.k}</p>
                      <p className="mt-1.5 text-[14px] leading-6 text-[#0F1E4A]/70">{m.v}</p>
                    </div>
                  </Rise>
                ))}
              </div>
              <Rise className="mt-6 flex flex-col gap-3 rounded-[1.3rem] bg-[#0F1E4A] p-5 text-white md:flex-row md:items-center md:justify-between md:px-7">
                <p className="flex items-start gap-2 text-[14px] leading-6 text-white/80"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E9C46A]" />{place?.address ?? tm.address}</p>
                <a href={directions} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#F6C752] px-5 py-2.5 text-sm font-bold text-[#0F1E4A] hover:bg-[#FFD777]"><Navigation className="h-4 w-4" />{t("Open in Google Maps")}</a>
              </Rise>
            </div>
          </div>
        </section>

        {/* ══ PHOTOS FROM GOOGLE ══ */}
        {photos.length > 3 && (
          <section className="bg-white py-14 md:py-20">
            <div className="vk-container">
              <div className="mx-auto max-w-6xl">
                <Rise><SectionTitle eyebrow={t("Photos")} title={`${tm.shortName} ${t("in pictures")}`} /></Rise>
                <ul className="mt-8 columns-2 gap-3 md:columns-3 [&>li]:mb-3">
                  {photos.slice(3).map((p) => (
                    <li key={p.name} className="break-inside-avoid overflow-hidden rounded-2xl bg-[#0F1E4A]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photoUrl(p.name, 800)} alt={`${tm.shortName}`} loading="lazy" className="w-full" />
                      {p.author && (
                        <p className="bg-white px-3 py-1.5 text-[11px] text-[#0F1E4A]/55">
                          {p.authorUri ? <a href={p.authorUri} target="_blank" rel="noopener noreferrer nofollow" className="hover:underline">{p.author}</a> : p.author} · <GoogleWord />
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* ══ REVIEWS FROM GOOGLE ══ */}
        {place && place.reviews.length > 0 && (
          <section className="py-14 md:py-20">
            <div className="vk-container">
              <div className="mx-auto max-w-6xl">
                <Rise className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div><SectionTitle eyebrow={t("What pilgrims say")} title={t("Reviews from Google")} /></div>
                  {place.rating ? <Stars rating={place.rating} count={place.ratingCount} /> : null}
                </Rise>
                <ul className="mt-8 grid gap-4 md:grid-cols-2">
                  {place.reviews.slice(0, 4).map((r, k) => (
                    <Rise key={k} delay={(k % 2) * 0.06}>
                      <li className="flex h-full flex-col rounded-[1.3rem] bg-white p-6 ring-1 ring-[#E7DCC3]">
                        <div className="flex items-center gap-3">
                          {r.authorPhoto ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={r.authorPhoto} alt="" referrerPolicy="no-referrer" className="h-9 w-9 rounded-full" />
                          ) : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F1E4A] text-sm font-bold text-[#F6C752]">{r.author[0]}</span>}
                          <div className="min-w-0">
                            {r.authorUri ? <a href={r.authorUri} target="_blank" rel="noopener noreferrer nofollow" className="block truncate text-[14px] font-bold text-[#0F1E4A] hover:underline">{r.author}</a> : <p className="truncate text-[14px] font-bold text-[#0F1E4A]">{r.author}</p>}
                            <p className="text-[12px] text-[#0F1E4A]/50">{r.when}</p>
                          </div>
                          <span className="ml-auto"><Stars rating={r.rating} /></span>
                        </div>
                        <p className="mt-4 line-clamp-6 text-[14px] leading-7 text-[#0F1E4A]/75">{r.text}</p>
                        <p className="mt-auto pt-4 text-[11px] text-[#0F1E4A]/45">{t("Posted on")} <GoogleWord /></p>
                      </li>
                    </Rise>
                  ))}
                </ul>
                {place.mapsUri && (
                  <a href={place.mapsUri} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-[#1E3A8A] hover:underline">{t("Read all reviews on Google Maps")} <ExternalLink className="h-3.5 w-3.5" /></a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ══ FAQ ══ */}
        {tm.faqs.length > 0 && (
          <section className="bg-white py-14 md:py-20">
            <div className="vk-container">
              <div className="mx-auto max-w-3xl">
                <Rise><SectionTitle eyebrow={t("Good to know")} title={t("Frequently asked questions")} /></Rise>
                <div className="mt-8 divide-y divide-[#E7DCC3] rounded-[1.3rem] ring-1 ring-[#E7DCC3]">
                  {tm.faqs.map((f) => (
                    <details key={f.q} className="group px-5 py-4 md:px-6">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-bold text-[#0F1E4A] [&::-webkit-details-marker]:hidden">
                        {f.q}
                        <Plus className="h-4 w-4 shrink-0 text-[#A87A1E] transition-transform group-open:rotate-45" />
                      </summary>
                      <p className="mt-3 text-[14.5px] leading-7 text-[#0F1E4A]/75">{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ══ OUR TEMPLE + NEARBY ══ */}
        <section className="py-14 md:py-20">
          <div className="vk-container">
            <div className="mx-auto max-w-6xl">
              <div className="relative overflow-hidden rounded-[1.8rem] px-6 py-10 text-white md:px-12 md:py-12" style={{ background: HERO_BG }}>
                <div aria-hidden className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(246,199,82,.25),transparent)]" />
                <Eyebrow light>{t("In Visakhapatnam")}</Eyebrow>
                <h2 className="mt-4 max-w-2xl font-heading text-2xl font-bold leading-tight md:text-[2.2rem]">{t("Begin your pilgrimage with darshan at ISKCON Vizag")}</h2>
                <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/70">{t("Sri Sri Radha Madan Mohan await you at Gambheeram, with daily aartis, kirtan and prasadam.")}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/iskcon-vizag-temple" className="inline-flex items-center gap-2 rounded-full bg-[#F6C752] px-6 py-3 text-sm font-bold text-[#0F1E4A] hover:bg-[#FFD777]">{t("Plan your visit")} <ArrowUpRight className="h-4 w-4" /></Link>
                  <Link href="/anna-daan-seva" className="inline-flex items-center rounded-full px-6 py-3 text-sm font-bold text-white ring-1 ring-white/30 hover:ring-white">{t("Offer Anna Daan")}</Link>
                </div>
              </div>

              {nearby.length > 0 && (
                <div className="mt-14">
                  <SectionTitle eyebrow={t(tm.region)} title={t("More temples in this region")} />
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {nearby.map((n) => (
                      <li key={n.slug}>
                        <Link href={`/temples/${n.slug}`} className="group flex items-center gap-4 rounded-[1.2rem] bg-white p-3 ring-1 ring-[#E7DCC3] transition hover:ring-[#C9962B]/70">
                          <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#0F1E4A]">
                            {n.photo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={n.photo} alt="" loading="lazy" className="h-full w-full object-cover" />
                            ) : <span className="flex h-full w-full items-center justify-center text-[#F6C752]" style={{ background: HERO_BG }}><Landmark className="h-6 w-6" /></span>}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-heading text-[15px] font-bold text-[#0F1E4A]">{n.shortName}</span>
                            <span className="block truncate text-[12.5px] text-[#0F1E4A]/60">{n.deity}</span>
                          </span>
                          <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-[#A87A1E] transition group-hover:rotate-45" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
