"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, Binoculars, Compass, Landmark, Leaf, Mountain, Sparkles, TreePalm, Waves } from "lucide-react";
import { Fade } from "@/components/shared/fade";
import { CATEGORIES } from "@/lib/mock";

const CAT_ICONS: Record<string, React.ReactNode> = {
  heritage: <Landmark className="h-6 w-6" />, wildlife: <Binoculars className="h-6 w-6" />,
  beaches: <Waves className="h-6 w-6" />, adventure: <Compass className="h-6 w-6" />,
  eco: <Leaf className="h-6 w-6" />, "cultural-triangle": <Sparkles className="h-6 w-6" />,
  "hill-country": <Mountain className="h-6 w-6" />, "south-coast": <TreePalm className="h-6 w-6" />,
};

export default function DestinationsPage() {
  const { locale } = useParams<{ locale: string }>();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Fade>
        <span className="text-xs font-bold uppercase tracking-widest text-palm-deep">Destinations</span>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight md:text-4xl">Eight moods of one island</h1>
        <p className="mt-2 max-w-2xl text-[13.5px] text-slate-500">Each region has its own rhythm. Pick a mood — see the places that live inside it.</p>
      </Fade>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c, i) => (
          <Fade key={c.id} delay={i * 0.04}>
            <Link href={`/${locale}/destinations/${c.id}`}
              className="group block h-full rounded-card border border-line bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-ruga-sky/60 hover:shadow-lift">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ruga-navy/5 text-ruga-navy transition group-hover:bg-ruga-navy group-hover:text-white">
                {CAT_ICONS[c.id]}
              </span>
              <h3 className="mt-4 font-display text-[17px] font-bold">{c.name}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{c.blurb}</p>
              <p className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-semibold text-palm-deep">
                {c.places.length} places <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
              </p>
            </Link>
          </Fade>
        ))}
      </div>
    </div>
  );
}
