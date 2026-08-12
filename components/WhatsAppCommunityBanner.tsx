"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const WHATSAPP_COMMUNITY_LINK =
  "https://chat.whatsapp.com/D7HPe7vGmh8Ia0aHLJlne6";

const APPEAR_DELAY_MS = 4000;

export default function WhatsAppCommunityBanner({
  message = "Join our WhatsApp Community",
  link = WHATSAPP_COMMUNITY_LINK,
}: {
  message?: string;
  link?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), APPEAR_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="fixed bottom-16 md:bottom-6 left-4 right-4 md:left-6 md:right-auto z-40 max-w-lg"
        >
          <div className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/80 px-4 py-3 shadow-xl backdrop-blur-xl dark:bg-neutral-900/80">
            {/* Green accent bar */}
            <div className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-[#25D366]" />

            {/* WhatsApp icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]">
              <svg
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 fill-white"
              >
                <path d="M16.001 3C9.096 3 3.5 8.596 3.5 15.5c0 2.42.69 4.68 1.887 6.6L3 29l7.09-2.35a12.42 12.42 0 0 0 5.91 1.5c6.905 0 12.5-5.596 12.5-12.5S22.906 3 16.001 3Zm0 22.688a10.15 10.15 0 0 1-5.176-1.42l-.371-.22-4.207 1.394 1.412-4.1-.242-.386a10.13 10.13 0 0 1-1.604-5.456c0-5.606 4.582-10.188 10.19-10.188 5.606 0 10.187 4.582 10.187 10.188 0 5.605-4.581 10.188-10.189 10.188Zm5.583-7.634c-.306-.153-1.81-.893-2.09-.994-.28-.102-.484-.153-.688.153-.204.306-.79.994-.968 1.198-.178.204-.357.23-.663.077-.306-.153-1.292-.476-2.462-1.518-.91-.812-1.525-1.815-1.703-2.121-.178-.306-.019-.472.134-.624.137-.137.306-.357.459-.535.153-.178.204-.306.306-.51.102-.204.051-.383-.026-.535-.077-.153-.688-1.658-.943-2.271-.248-.596-.5-.516-.688-.525-.178-.009-.382-.011-.586-.011-.204 0-.535.077-.815.383-.28.306-1.069 1.044-1.069 2.548 0 1.503 1.094 2.956 1.247 3.16.153.204 2.153 3.287 5.216 4.608.729.314 1.297.502 1.74.643.731.232 1.396.199 1.921.121.586-.088 1.81-.74 2.065-1.454.255-.714.255-1.325.178-1.454-.076-.128-.28-.204-.586-.357Z" />
              </svg>
            </div>

            {/* Text + CTA */}
            <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
                {message}
              </p>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#1ebe5d] hover:shadow-md active:scale-95"
              >
                Join Now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </a>
            </div>

            {/* Close button */}
            <button
              onClick={handleDismiss}
              aria-label="Dismiss banner"
              className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
