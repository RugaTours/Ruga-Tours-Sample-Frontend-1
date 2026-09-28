import type { Metadata } from "next";
import Image from "next/image";
import { HandHeart, Leaf, ShieldCheck, Users } from "lucide-react";
import { Fade } from "@/components/shared/fade";

export const metadata: Metadata = { title: "About Us — Ruga Tours" };

const VALUES = [
  { icon: Users, t: "Family-run, always", d: "When you book with Ruga Tours, you travel with a family — drivers, guides and planners who treat your trip like their own." },
  { icon: HandHeart, t: "Human planning, no algorithms", d: "No auto-priced itineraries. A real planner reviews every request and shapes it with you, message by message." },
  { icon: ShieldCheck, t: "Honest payments & refunds", d: "Clear Review Fee, Tours Booking Deposit and Final Balance — with a written 100% / 85% / 75% refund policy for every payment." },
  { icon: Leaf, t: "Island-first travel", d: "Small groups, local stays, village experiences — tourism that gives back to the island we call home." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <Fade>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-palm-deep">Our story</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-4xl">A Sri Lankan family, sharing our island with yours</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
            Ruga Tours began around a kitchen table in Kandy — a family of drivers, guides and hoteliers who believed
            travellers deserved more than a bus window. Today we design bespoke journeys across the island: heritage walks,
            wildlife safaris, tea-country trains and slow beach days — planned by people, never by algorithms.
          </p>
          <p className="mt-3 text-[15px] italic text-ruga-navy">"Arrive as a guest. Leave as a Island family."</p>
        </Fade>
        <Fade delay={0.1}>
          <div className="overflow-hidden rounded-card-lg shadow-lift">
            <Image src="https://images.unsplash.com/photo-1750271327963-281743a0cc30?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Sri Lankan family hospitality" width={1400} height={900} className="h-auto w-full object-cover" />
          </div>
        </Fade>
      </div>
      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((v, i) => (
          <Fade key={v.t} delay={i * 0.06}>
            <div className="h-full rounded-card border border-line bg-white p-6 shadow-soft">
              <span className="grid h-10 w-10 place-items-center rounded-card bg-ruga-navy/5"><v.icon className="h-5 w-5 text-ruga-navy" /></span>
              <h3 className="mt-3 font-display text-[15px] font-bold">{v.t}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">{v.d}</p>
            </div>
          </Fade>
        ))}
      </div>
    </div>
  );
}
