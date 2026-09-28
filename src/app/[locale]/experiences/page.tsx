"use client";

import { useState } from "react";
import * as Lucide from "lucide-react";
import { Fade } from "@/components/shared/fade";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EXPERIENCES } from "@/lib/mock";
import type { Experience } from "@/lib/types";

function iconFor(name: string) {
  const Icon = (Lucide as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
    name.split("-").map((s) => s[0].toUpperCase() + s.slice(1)).join("")
  ];
  return Icon ? <Icon className="h-5 w-5" /> : <Lucide.Sparkles className="h-5 w-5" />;
}

function BookNowLink({ label, kind, subject }: { label: string; kind: "email" | "whatsapp"; subject: string }) {
  const text = encodeURIComponent(`Hi Ruga Tours! I'd like to book/enquire about: ${subject}`);
  const href = kind === "whatsapp" ? `https://wa.me/94771234567?text=${text}` : `mailto:bookings@rugatours.com?subject=${encodeURIComponent(subject)}&body=${text}`;
  return (
    <a href={href} target={kind === "whatsapp" ? "_blank" : undefined} rel="noreferrer"
      className="flex items-center gap-3 rounded-card border border-line p-4 text-left text-sm font-semibold transition hover:border-palm-deep hover:bg-palm-light/10">
      {kind === "whatsapp" ? <Lucide.MessageCircle className="h-5 w-5 text-palm-deep" /> : <Lucide.Mail className="h-5 w-5 text-ruga-royal" />}
      {label}
      <Lucide.ArrowUpRight className="ml-auto h-4 w-4 text-slate-400" />
    </a>
  );
}

export default function ExperiencesPage() {
  const [sel, setSel] = useState<Experience | null>(null);
  const [booking, setBooking] = useState<Experience | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Fade>
        <span className="text-xs font-bold uppercase tracking-widest text-palm-deep">Experiences</span>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight md:text-4xl">Twelve ways to feel Sri Lanka</h1>
        <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-slate-500">
          These are the building blocks of every tailor-made trip — pick any of them inside the Tailor-Make planner, or enquire about one right here.
        </p>
      </Fade>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EXPERIENCES.map((e, i) => (
          <Fade key={e.id} delay={i * 0.03}>
            <div className="flex h-full flex-col rounded-card border border-line bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
              <button onClick={() => setSel(e)} className="flex-1 text-left">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ruga-navy/5 text-ruga-navy">{iconFor(e.icon)}</span>
                <h3 className="mt-3 font-display text-[16px] font-bold">{e.name}</h3>
                <p className="mt-0.5 text-xs font-medium text-palm-deep">{e.blurb}</p>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{e.description}</p>
              </button>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setSel(e)}>Details</Button>
                <Button variant="palm" size="sm" className="flex-1" onClick={() => setBooking(e)}>{<Lucide.CalendarCheck className="h-3.5 w-3.5" />} Book now</Button>
              </div>
            </div>
          </Fade>
        ))}
      </div>

      {/* detail modal */}
      <Modal open={!!sel} onClose={() => setSel(null)} title={sel?.name} sub={sel?.blurb}>
        <p className="text-[13px] leading-relaxed text-slate-600">{sel?.description}</p>
        <p className="mt-3 rounded-card bg-ruga-sky/10 p-3 text-xs leading-relaxed text-ruga-navy">
          Want this in your trip? Select it inside the Tailor-Make planner, or book/enquire directly below.
        </p>
        <div className="mt-4 grid gap-2">
          <BookNowLink kind="whatsapp" label="Contact on WhatsApp" subject={sel?.name ?? ""} />
          <BookNowLink kind="email" label="Contact by Email" subject={sel?.name ?? ""} />
        </div>
      </Modal>

      {/* book now chooser */}
      <Modal open={!!booking} onClose={() => setBooking(null)} title={`Book “${booking?.name}”`} sub="How should our team reach you?">
        <div className="grid gap-2">
          <BookNowLink kind="whatsapp" label="Contact on WhatsApp" subject={booking?.name ?? ""} />
          <BookNowLink kind="email" label="Contact by Email" subject={booking?.name ?? ""} />
        </div>
        <p className="mt-3 text-[11px] text-slate-400">A human from Ruga Tours replies — no bots, no automated sales funnels.</p>
      </Modal>
    </div>
  );
}
