"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, CalendarCheck, Check, Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { Fade } from "@/components/shared/fade";
import { SriLankaMap } from "@/components/map/sri-lanka";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { DAY_TOURS } from "@/lib/mock";

export default function DayTourDetailPage() {
  const { locale, slug } = useParams<{ locale: string; slug: string }>();
  const tour = DAY_TOURS.find((t) => t.slug === slug);
  const [book, setBook] = useState(false);

  if (!tour) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-slate-500">Day tour not found.</p>
        <Link href={`/${locale}/day-tours`}><Button variant="outline" className="mt-4">Back to Day Tours</Button></Link>
      </div>
    );
  }

  const text = encodeURIComponent(`Hi Ruga Tours! I'd like to book the day tour: ${tour.name}`);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href={`/${locale}/day-tours`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> All Day Tours
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <Fade>
            <Badge className="bg-ruga-sky/15 text-ruga-navy"><Clock className="mr-1 h-3 w-3" /> {tour.duration}</Badge>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-4xl">{tour.name}</h1>
            <p className="mt-1 text-sm font-medium text-palm-deep">{tour.tagline}</p>
            <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-slate-600">{tour.description}</p>
          </Fade>

          <Fade delay={0.08}>
            <div className="mt-6 rounded-card border border-line bg-white p-5 shadow-soft">
              <h3 className="font-display text-sm font-bold">What your day includes</h3>
              <ul className="mt-3 grid gap-2 text-[13px] text-slate-600 sm:grid-cols-2">
                {["Pickup & drop-off from your hotel area", "English-speaking driver-guide", "All entrance tickets listed", "Bottled water & king coconut", "Flexible photo stops", "Timing tuned to crowds & light"].map((x) => (
                  <li key={x} className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-palm-deep" /> {x}</li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="palm" size="lg" onClick={() => setBook(true)}><CalendarCheck className="h-4 w-4" /> Book now</Button>
                <a href={`https://wa.me/94771234567?text=${text}`} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="lg"><MessageCircle className="h-4 w-4" /> WhatsApp</Button>
                </a>
                <a href={`mailto:bookings@rugatours.com?subject=${encodeURIComponent(tour.name)}&body=${text}`}>
                  <Button variant="outline" size="lg"><Mail className="h-4 w-4" /> Email</Button>
                </a>
              </div>
            </div>
          </Fade>
        </div>

        {/* Map + cities covered */}
        <Fade delay={0.12}>
          <aside className="h-fit rounded-card border border-line bg-white p-5 shadow-soft lg:sticky lg:top-24">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold">
              <MapPin className="h-4 w-4 text-palm-deep" /> Where this tour goes
            </h3>
            <SriLankaMap stops={tour.stops} className="mx-auto mt-3 max-w-[240px]" />
            <div className="mt-4 space-y-1.5">
              {tour.stops.map((s, i) => (
                <div key={s.city + i} className="flex items-center gap-2.5 rounded-[10px] bg-paper px-3 py-2 text-xs font-semibold">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ruga-navy text-[10px] text-white">{i + 1}</span>
                  {s.city}
                </div>
              ))}
            </div>
          </aside>
        </Fade>
      </div>

      <Modal open={book} onClose={() => setBook(false)} title={`Book “${tour.name}”`} sub="Choose how you'd like to talk to our team">
        <div className="grid gap-2">
          <a href={`https://wa.me/94771234567?text=${text}`} target="_blank" rel="noreferrer"
            className="flex items-center gap-3 rounded-card border border-line p-4 text-sm font-semibold transition hover:border-palm-deep hover:bg-palm-light/10">
            <MessageCircle className="h-5 w-5 text-palm-deep" /> Contact on WhatsApp
          </a>
          <a href={`mailto:bookings@rugatours.com?subject=${encodeURIComponent(tour.name)}&body=${text}`}
            className="flex items-center gap-3 rounded-card border border-line p-4 text-sm font-semibold transition hover:border-ruga-royal hover:bg-ruga-sky/10">
            <Mail className="h-5 w-5 text-ruga-royal" /> Contact by Email
          </a>
        </div>
      </Modal>
    </div>
  );
}
