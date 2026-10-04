"use client";

import { ArrowRight } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

const WA_CHANNEL_LINK = "https://whatsapp.com/channel/0029VaZDEG67T8bWHjibTy2u";

/** GVD-style closing band: rounded navy card inviting visitors to the WhatsApp channel. */
export default function WhatsAppCommunityCTA() {
  return (
    <section className="py-8 md:py-12">
      <div className="vk-container">
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-vk-600 via-vk-700 to-vk-900 p-6 text-white md:p-8">
          <div aria-hidden className="absolute -bottom-20 -right-16 -z-10 h-56 w-56 rounded-full bg-white/10" />
          <div aria-hidden className="absolute -left-10 -top-12 -z-10 h-32 w-32 rounded-full bg-white/5" />
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#25D366] shadow-lg">
                <WhatsAppIcon className="h-6 w-6 fill-current text-white" />
              </div>
              <div>
                <span className="vk-pill-light mb-2">Stay Connected</span>
                <h3 className="text-xl font-bold leading-tight text-white md:text-2xl">Join Our WhatsApp Channel</h3>
                <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-white/80">
                  Get festival updates, daily spiritual wisdom &amp; connect with devotees
                </p>
              </div>
            </div>
            <a
              href={WA_CHANNEL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="vk-btn group shrink-0 self-start bg-white px-6 py-3 text-vk-800 shadow-md hover:bg-vk-50 md:self-auto"
            >
              Join Now
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
