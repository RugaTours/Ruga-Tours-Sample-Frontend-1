"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowRight, CalendarCheck, Clock, Mail, MessageCircle } from "lucide-react";
import { Fade } from "@/components/shared/fade";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { DAY_TOURS } from "@/lib/mock";
import type { DayTour } from "@/lib/types";

function BookChooser({ tour, onClose }: { tour: DayTour | null; onClose: () => void }) {
  const text = encodeURIComponent(`Hi Ruga Tours! I'd like to book the day tour: ${tour?.name ?? ""}`);
  return (
    <Modal open={!!tour} onClose={onClose} title={`Book “${tour?.name}”`} sub="Choose how you'd like to talk to our team">
      <div className="grid gap-2">
        <a href={`https://wa.me/94771234567?text=${text}`} target="_blank" rel="noreferrer"
          className="flex items-center gap-3 rounded-card border border-line p-4 text-sm font-semibold transition hover:border-palm-deep hover:bg-palm-light/10">
          <MessageCircle className="h-5 w-5 text-palm-deep" /> Contact on WhatsApp
        </a>
        <a href={`mailto:bookings@rugatours.com?subject=${encodeURIComponent(tour?.name ?? "")}&body=${text}`}
          className="flex items-center gap-3 rounded-card border border-line p-4 text-sm font-semibold transition hover:border-ruga-royal hover:bg-ruga-sky/10">
          <Mail className="h-5 w-5 text-ruga-royal" /> Contact by Email
        </a>
      </div>
    </Modal>
  );
}

export default function DayToursPage() {
  const { locale } = useParams<{ locale: string }>();
  const [booking, setBooking] = useState<DayTour | null>(null);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Fade>
        <span className="text-xs font-bold uppercase tracking-widest text-palm-deep">Day Tours</span>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight md:text-4xl">One perfect day, twelve ways</h1>
        <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-slate-500">
          Guided single-day adventures with pickup, tickets and timing all handled. Tap a tour to see its route on the island map.
        </p>
      </Fade>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DAY_TOURS.map((t, i) => (
          <Fade key={t.id} delay={i * 0.03}>
            <div className="flex h-full flex-col rounded-card border border-line bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
              <Link href={`/${locale}/day-tours/${t.slug}`} className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="rounded-chip bg-ruga-sky/15 px-2.5 py-1 text-[11px] font-semibold text-ruga-navy">
                    <Clock className="mr-1 inline h-3 w-3" />{t.duration}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-[16px] font-bold">{t.name}</h3>
                <p className="mt-0.5 text-xs font-medium text-palm-deep">{t.tagline}</p>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-500">{t.description}</p>
                <p className="mt-2.5 text-[11px] font-semibold text-ruga-royal">{t.cities.join(" · ")}</p>
              </Link>
              <div className="mt-4 flex gap-2">
                <Link href={`/${locale}/day-tours/${t.slug}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">Map & details <ArrowRight className="h-3.5 w-3.5" /></Button>
                </Link>
                <Button variant="palm" size="sm" className="flex-1" onClick={() => setBooking(t)}>
                  <CalendarCheck className="h-3.5 w-3.5" /> Book now
                </Button>
              </div>
            </div>
          </Fade>
        ))}
      </div>
      <BookChooser tour={booking} onClose={() => setBooking(null)} />
    </div>
  );
}
