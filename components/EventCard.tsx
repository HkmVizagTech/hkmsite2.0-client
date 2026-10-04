"use client";

import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";

export interface EventCardProps {
  event: {
    _id?: string;
    title: string;
    date: string;
    time?: string;
    location?: string;
    description?: string;
    image?: string;
    featured?: boolean;
  };
  href?: string;
  smallCard?: boolean;
  /** When the admin linked a separate registration/landing page, open it in a new tab. */
  external?: boolean;
}

import { useEffect, useState } from "react";

function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; mins: number; secs: number }>({ days: 0, hours: 0, mins: 0, secs: 0 });
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);
  if (new Date(targetDate).getTime() < Date.now()) return null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-vk-700">
      <span className="mr-0.5 text-muted-foreground">Starts in:</span>
      {[
        `${timeLeft.days}d`,
        `${timeLeft.hours}h`,
        `${timeLeft.mins}m`,
        `${timeLeft.secs}s`,
      ].map((v, i) => (
        <span key={i} className="rounded-lg bg-vk-100 px-2 py-1 tabular-nums">
          {v}
        </span>
      ))}
    </div>
  );
}

export default function EventCard({ event, href, smallCard, external }: EventCardProps) {
  const formattedDate = event.date ? new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : event.date;
  const now = Date.now();
  const eventTime = event.date ? new Date(event.date).getTime() : 0;
  const isCompleted = eventTime < now;
  const Tag: any = external ? "a" : Link;
  const d = event.date ? new Date(event.date) : null;
  const validDate = d && !Number.isNaN(d.getTime()) ? d : null;
  return (
    <Tag
      href={href || "/events"}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={smallCard ? "group block h-full focus:outline-none" : "group col-span-full block focus:outline-none"}
    >
      <div
        className={
          smallCard
            ? "vk-card vk-card-hover flex h-full min-h-[240px] flex-col items-start overflow-hidden p-2 pb-5"
            : "vk-card vk-card-hover flex flex-col gap-5 overflow-hidden p-3 md:flex-row md:items-center md:gap-6 md:p-4"
        }
      >
        <div
          className={
            smallCard
              ? "relative mb-3 flex h-36 w-full items-center justify-center overflow-hidden rounded-xl bg-vk-100 md:h-44"
              : "relative flex aspect-[16/10] w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-vk-100 md:aspect-square md:h-44 md:w-44"
          }
        >
          {event.image && (
            <Image src={event.image} alt={event.title} fill sizes="(max-width: 640px) 100vw, 200px" className="object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: "center" }} />
          )}
          {event.featured && (
            <div className="absolute left-2 top-2 z-10 rounded-full bg-vk-700 px-2.5 py-1 text-xs font-semibold text-white shadow">
              Featured
            </div>
          )}
          {!event.featured && validDate && (
            <div className="absolute left-2 top-2 z-10 min-w-[48px] rounded-xl bg-white/95 px-2 py-1.5 text-center leading-none shadow-md">
              <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-vk-500">
                {validDate.toLocaleDateString("en-IN", { month: "short" })}
              </span>
              <span className="mt-0.5 block text-base font-extrabold text-vk-800">{validDate.getDate()}</span>
            </div>
          )}
          {(event as any).registrationForm?.enabled && (
            <div className="absolute bottom-3 right-3 z-10">
              <span className="rounded-full bg-vk-700 px-3 py-1 text-sm font-semibold text-white shadow">Register</span>
            </div>
          )}
          <div className="absolute right-2 top-2 z-10">
            <span className={`rounded-full px-2 py-1 text-xs font-bold shadow-sm ${isCompleted ? "bg-white/95 text-ink/60" : "animate-pulse bg-vk-500 text-white"}`}>
              {isCompleted ? "Completed" : "Soon"}
            </span>
          </div>
        </div>
        <div className={smallCard ? "flex w-full flex-1 flex-col items-start justify-between px-2 text-left" : "flex grow flex-col justify-center px-2 pb-2 md:px-0 md:pb-0"}>
          <h3 className={smallCard ? "mb-1 text-sm font-bold text-ink transition-colors group-hover:text-vk-700 md:text-base" : "mb-2 text-xl font-bold text-ink transition-colors group-hover:text-vk-700 md:text-2xl"}>{event.title}</h3>
          <p className={smallCard ? "mb-2 line-clamp-2 text-xs text-muted-foreground" : "mb-3 line-clamp-2 text-sm text-muted-foreground"}>{event.description}</p>
          <div className={smallCard ? "flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground" : "flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground"}>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-vk-500" /> {formattedDate}
            </span>
            {event.time && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-vk-500" /> {event.time}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-vk-500" /> {event.location}
              </span>
            )}
          </div>
          {event.date && <Countdown targetDate={event.date} />}
        </div>
      </div>
    </Tag>
  );
}
