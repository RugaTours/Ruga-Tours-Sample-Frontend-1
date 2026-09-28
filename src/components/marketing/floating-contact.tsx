"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mail, MessageCircle, MessageSquareText, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

/** Floating Contact Us button — bottom right on every tourist page. */
export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const { locale } = useParams<{ locale: string }>();
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            className="w-60 overflow-hidden rounded-card border border-line bg-white shadow-lift"
          >
            <p className="border-b border-line bg-ruga-navy px-4 py-2.5 text-xs font-bold text-white">Contact Ruga Tours</p>
            <a href="https://wa.me/94771234567?text=Hi%20Ruga%20Tours!" target="_blank" rel="noreferrer"
              className="flex items-center gap-3 px-4 py-3 text-[13px] font-semibold hover:bg-slate-50">
              <MessageCircle className="h-4 w-4 text-palm-deep" /> WhatsApp us
            </a>
            <a href="mailto:hello@rugatours.com?subject=Trip%20enquiry"
              className="flex items-center gap-3 border-t border-slate-50 px-4 py-3 text-[13px] font-semibold hover:bg-slate-50">
              <Mail className="h-4 w-4 text-ruga-royal" /> Email us
            </a>
            <Link href={`/${locale}/contact`} onClick={() => setOpen(false)}
              className="flex items-center gap-3 border-t border-slate-50 px-4 py-3 text-[13px] font-semibold hover:bg-slate-50">
              <MessageSquareText className="h-4 w-4 text-ruga-sky" /> Enquiry form
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-palm-deep to-ruga-navy text-white shadow-lift transition hover:scale-105"
        aria-label="Contact us"
      >
        {open ? <X className="h-6 w-6" /> : <MessageSquareText className="h-6 w-6" />}
      </button>
    </div>
  );
}
