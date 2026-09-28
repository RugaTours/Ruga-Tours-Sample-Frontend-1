"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Facebook, Instagram, Mail, MapPin, Palmtree, Phone, Youtube } from "lucide-react";
import { SLOGAN } from "@/lib/utils";

export function SiteFooter() {
  const { locale } = useParams<{ locale: string }>();
  return (
    <footer className="evening mt-20 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-ruga-navy to-palm-deep text-white">
              <Palmtree className="h-5 w-5" />
            </span>
            <span className="leading-none">
              <span className="block font-display text-lg font-extrabold text-white">RUGA</span>
              <span className="block text-[10px] font-bold tracking-[0.28em] text-ruga-sky">TOURS</span>
            </span>
          </div>
          <p className="mt-4 text-[13px] italic text-palm-light">“{SLOGAN}”</p>
          <div className="mt-5 flex gap-3 text-slate-400">
            <Facebook className="h-4 w-4 hover:text-white" /> <Instagram className="h-4 w-4 hover:text-white" /> <Youtube className="h-4 w-4 hover:text-white" />
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-display text-sm font-bold text-white">Explore</h4>
          <ul className="space-y-2 text-[13px]">
            {[["Destinations", "/destinations"], ["Experiences", "/experiences"], ["Day Tours", "/day-tours"], ["Packages", "/packages"], ["Tailor-Make", "/tailor-make"]].map(([l, h]) => (
              <li key={h}><Link href={`/${locale}${h}`} className="hover:text-white">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-display text-sm font-bold text-white">Company</h4>
          <ul className="space-y-2 text-[13px]">
            {[["About Us", "/about"], ["Reviews", "/reviews"], ["Contact", "/contact"], ["Refund & Cancellation Policy", "/account/refunds"]].map(([l, h]) => (
              <li key={h}><Link href={`/${locale}${h}`} className="hover:text-white">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-display text-sm font-bold text-white">Talk to a human</h4>
          <ul className="space-y-2.5 text-[13px]">
            <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-palm-light" /> +94 77 123 4567 (WhatsApp / iMessage)</li>
            <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-palm-light" /> hello@rugatours.com</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-3.5 w-3.5 text-palm-light" /> 42 Galle Road, Colombo 03, Sri Lanka</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-[11px] text-slate-500">
        © 2026 Ruga Tours (Pvt) Ltd · Prototype for client review — no real bookings are made
      </div>
    </footer>
  );
}
