"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Home, Repeat, MessageCircle, FileText } from "lucide-react";
import PageLayout from "@/components/PageLayout";

const SHLOKA = {
  sanskrit: "दत्ते भक्त्या तद् गृह्णामि पश्य मे प्रियम् अर्जुन ।",
  translation:
    "If one offers Me with love and devotion a leaf, a flower, fruit, or water, I will accept it.",
  reference: "Bhagavad Gita 9.26",
};

export default function ThankYouClient() {
  const searchParams = useSearchParams();
  const seva = searchParams.get("seva") || "Ekadashi Seva";
  const amount = searchParams.get("amount");

  return (
    <PageLayout>
      <main className="min-h-screen bg-white pt-[var(--header-h)] dark:bg-background">
        <section className="flex min-h-[80vh] items-center justify-center bg-gradient-to-b from-vk-50 to-white py-12 md:py-16">
          <div className="vk-container">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mx-auto w-full max-w-lg text-center"
            >
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 ring-8 ring-green-500/5"
              >
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="vk-h2 mb-3"
              >
                Thank You for Your Seva!
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="vk-lead mb-8"
              >
                Your offering has been received with gratitude. May Lord Krishna bless you
                and your family.
              </motion.p>

              {/* Donation summary card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="vk-card mb-6 overflow-hidden !rounded-3xl text-left"
              >
                <div className="bg-gradient-to-br from-vk-700 via-vk-600 to-vk-500 px-5 py-4 text-white sm:px-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
                    Donation Summary
                  </p>
                  <div className="mt-1 flex items-end justify-between gap-3">
                    <p className="min-w-0 text-lg font-bold text-white">{seva}</p>
                    {amount && (
                      <p className="shrink-0 font-heading text-2xl font-extrabold text-[hsl(var(--gold))]">
                        ₹{Number(amount).toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-3 p-4 text-[13px] text-muted-foreground sm:p-5">
                  <div className="flex items-start gap-3 rounded-xl bg-vk-50 p-3">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-vk-600" />
                    <span>A PDF receipt will be sent to your email and WhatsApp number shortly.</span>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-vk-50 p-3">
                    <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-vk-600" />
                    <span>Your 80G tax exemption certificate (if applicable) will be processed separately.</span>
                  </div>
                </div>
              </motion.div>

              {/* Shloka */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-8 rounded-2xl border border-vk-100 bg-white p-5 text-center"
              >
                <p className="mb-2 font-heading text-sm leading-relaxed text-vk-800 md:text-base">
                  {SHLOKA.sanskrit}
                </p>
                <p className="mb-1 font-serif-display text-sm italic leading-relaxed text-ink/75 md:text-[15px]">
                  &ldquo;{SHLOKA.translation}&rdquo;
                </p>
                <p className="text-[11px] font-semibold text-vk-600">— {SHLOKA.reference}</p>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center"
              >
                <Link
                  href="/"
                  className="vk-btn-outline h-11 px-6"
                >
                  <Home className="h-4 w-4" />
                  Back to Home
                </Link>
                <Link
                  href="/ekadashi"
                  className="vk-btn-gold h-11 px-6"
                >
                  <Repeat className="h-4 w-4" />
                  Donate Again
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
