"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { Fade } from "@/components/shared/fade";
import { Stars } from "@/components/marketing/testimonials";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/mock";

export default function CategoryPage() {
  const { locale, category } = useParams<{ locale: string; category: string }>();
  const cat = CATEGORIES.find((c) => c.id === category);
  if (!cat) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-slate-500">Category not found.</p>
        <Link href={`/${locale}/destinations`}><Button variant="outline" className="mt-4">Back to Destinations</Button></Link>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href={`/${locale}/destinations`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> All Destinations
      </Link>
      <Fade>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight md:text-4xl">{cat.name}</h1>
        <p className="mt-1 text-sm text-palm-deep">{cat.blurb}</p>
      </Fade>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cat.places.map((p, i) => (
          <Fade key={p.name} delay={i * 0.05}>
            <div className="h-full rounded-card border border-line bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-[16px] font-bold">{p.name}</h3>
                <Stars n={Math.round(p.rating)} />
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{p.blurb}</p>
              <p className="mt-3 flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-400">
                <MapPin className="h-3.5 w-3.5 text-palm-deep" /> {cat.name} · Sri Lanka · rated {p.rating}
              </p>
            </div>
          </Fade>
        ))}
      </div>
    </div>
  );
}
