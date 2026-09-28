"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, CalendarDays, Heart, Tent, Users } from "lucide-react";
import { Fade } from "@/components/shared/fade";
import { PACKAGES, TOURIST } from "@/lib/mock";
import { fmt, usdTo } from "@/lib/utils";
import { useAuth, useHydrated } from "@/stores/auth";
import type { Currency, Pkg } from "@/lib/types";

const COLLECTIONS: { id: Pkg["collection"]; label: string; icon: React.ReactNode; blurb: string }[] = [
  { id: "round_tour", label: "Round Tours", icon: <Users className="h-4 w-4" />, blurb: "Grand loops covering the island's greatest hits" },
  { id: "honeymoon", label: "Honeymoon Tours", icon: <Heart className="h-4 w-4" />, blurb: "Slow, private, unforgettable — crafted for two" },
  { id: "family", label: "Family Tours", icon: <Users className="h-4 w-4" />, blurb: "Small legs, big imaginations, zero stress for parents" },
  { id: "wildlife", label: "Wildlife Tours", icon: <Tent className="h-4 w-4" />, blurb: "Leopards, elephants and the island's Big Five" },
];

export default function PackagesPage() {
  const { locale } = useParams<{ locale: string }>();
  const { role } = useAuth();
  const hydrated = useHydrated();
  const ccy = (hydrated && role === "tourist" ? TOURIST.currency : "USD") as Currency;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Fade>
        <span className="text-xs font-bold uppercase tracking-widest text-palm-deep">Packages</span>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight md:text-4xl">Book a journey, not just a trip</h1>
        <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-slate-500">
          Every package works two ways: <b>book it as-is</b> with just your arrival date and headcount (no Review Fee), or <b>customize</b> it into your own plan with a human planner.
        </p>
      </Fade>

      {COLLECTIONS.filter((col) => PACKAGES.some((p) => p.collection === col.id)).map((col) => (
        <section key={col.id} className="mt-12">
          <Fade>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ruga-navy/5 text-ruga-navy">{col.icon}</span>
              <div>
                <h2 className="font-display text-xl font-bold">{col.label}</h2>
                <p className="text-xs text-slate-500">{col.blurb}</p>
              </div>
            </div>
          </Fade>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PACKAGES.filter((p) => p.collection === col.id).map((p, i) => (
              <Fade key={p.id} delay={i * 0.05}>
                <Link href={`/${locale}/packages/${p.slug}`}
                  className="group block h-full overflow-hidden rounded-card border border-line bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
                  <div className="relative flex h-32 items-end bg-gradient-to-br from-ruga-navy via-ruga-royal to-palm-deep p-4">
                    <span className="rounded-chip bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                      <CalendarDays className="mr-1 inline h-3 w-3" />{p.days} Days · {p.nights} Nights
                    </span>
                  </div>
                  <div className="flex flex-col p-5">
                    <h3 className="font-display text-[16px] font-bold group-hover:text-ruga-royal">{p.name}</h3>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">{p.summary}</p>
                    <div className="mt-3 flex items-end justify-between">
                      <p className="tnum text-lg font-extrabold text-ruga-navy">
                        {fmt(usdTo(p.pricePP, ccy), ccy)} <span className="text-[11px] font-medium text-slate-400">/ person</span>
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-palm-deep group-hover:underline">
                        View journey <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Fade>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
