"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, Binoculars, Compass, Landmark, Leaf, MapPin, Mountain, Route, Sparkles, TreePalm, Users, Waves } from "lucide-react";
import { Fade } from "@/components/shared/fade";
import { HeroGallery } from "@/components/marketing/hero-gallery";
import { Testimonials } from "@/components/marketing/testimonials";
import { PACKAGES, CATEGORIES } from "@/lib/mock";
import { getDict } from "@/i18n/dict";
import { fmt, usdTo } from "@/lib/utils";
import { useAuth, useHydrated } from "@/stores/auth";
import { TOURIST } from "@/lib/mock";
import type { Currency } from "@/lib/types";

const CAT_ICONS: Record<string, React.ReactNode> = {
  heritage: <Landmark className="h-5 w-5" />,
  wildlife: <Binoculars className="h-5 w-5" />,
  beaches: <Waves className="h-5 w-5" />,
  adventure: <Compass className="h-5 w-5" />,
  eco: <Leaf className="h-5 w-5" />,
  "cultural-triangle": <Sparkles className="h-5 w-5" />,
  "hill-country": <Mountain className="h-5 w-5" />,
  "south-coast": <TreePalm className="h-5 w-5" />,
};

export default function HomePage() {
  const { locale } = useParams<{ locale: string }>();
  const dict = getDict(locale);
  const { role } = useAuth();
  const hydrated = useHydrated();
  const ccy = (hydrated && role === "tourist" ? TOURIST.currency : "USD") as Currency;
  const featured = PACKAGES.slice(0, 3);

  return (
    <>
      {/* ============ FULL-WIDTH HERO WITH GALLERY SWITCHER ============ */}
      <HeroGallery locale={locale} dict={dict} />

      <div className="mx-auto max-w-7xl px-4">
        {/* ============ WHO WE ARE ============ */}
      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          { icon: <Users className="h-5 w-5" />, t: "Humans, not algorithms", d: "Every trip is reviewed and refined by a real Sri Lankan planner — before, during and after you pay anything." },
          { icon: <Landmark className="h-5 w-5" />, t: "Local to the bone", d: "Founded by an International Business Management graduate who grew up exploring every bend of this island." },
          { icon: <Sparkles className="h-5 w-5" />, t: "Honest staged payments", d: "Small Review Fee for custom plans, a deposit to book, the rest before you fly. Bank transfer price = online price, always." },
        ].map((c, i) => (
          <Fade key={c.t} delay={i * 0.06}>
            <div className="h-full rounded-card border border-line bg-white p-6 shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-palm-light/20 text-palm-deep">{c.icon}</span>
              <h3 className="mt-4 font-display text-[15px] font-bold">{c.t}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-500">{c.d}</p>
            </div>
          </Fade>
        ))}
      </section>

      {/* ============ DESTINATION CATEGORIES ============ */}
      <section className="mt-20">
        <Fade>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">Where will the island take you?</h2>
            <Link href={`/${locale}/destinations`} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ruga-royal hover:underline">
              All destinations <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Fade>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <Fade key={c.id} delay={i * 0.04}>
              <Link href={`/${locale}/destinations/${c.id}`}
                className="group block h-full rounded-card border border-line bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:border-ruga-sky/60 hover:shadow-lift">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ruga-navy/5 text-ruga-navy transition group-hover:bg-ruga-navy group-hover:text-white">
                  {CAT_ICONS[c.id]}
                </span>
                <h3 className="mt-3 font-display text-[15px] font-bold">{c.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{c.blurb}</p>
                <p className="mt-2.5 text-[11px] font-semibold text-palm-deep">{c.places.length} places →</p>
              </Link>
            </Fade>
          ))}
        </div>
      </section>

      {/* ============ FEATURED PACKAGES ============ */}
      <section className="mt-20">
        <Fade>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">Packages our guests love</h2>
              <p className="mt-1.5 text-[13px] text-slate-500">Book as-is with just your arrival date — or customize any of them into your own plan.</p>
            </div>
            <Link href={`/${locale}/packages`} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ruga-royal hover:underline">
              All packages <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Fade>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {featured.map((p, i) => (
            <Fade key={p.id} delay={i * 0.06}>
              <Link href={`/${locale}/packages/${p.slug}`}
                className="group block h-full overflow-hidden rounded-card border border-line bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
                <div className="flex h-28 items-end bg-gradient-to-br from-ruga-navy via-ruga-royal to-palm-deep p-4">
                  <span className="rounded-chip bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                    {p.days} Days · {p.nights} Nights
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-[16px] font-bold group-hover:text-ruga-royal">{p.name}</h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">{p.summary}</p>
                  <p className="tnum mt-3 text-lg font-extrabold text-ruga-navy">
                    from {fmt(usdTo(p.pricePP, ccy), ccy)} <span className="text-[11px] font-medium text-slate-400">/ person</span>
                  </p>
                </div>
              </Link>
            </Fade>
          ))}
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="mt-20">
        <Testimonials />
      </section>

      {/* ============ FINAL CTA ============ */}
      <Fade>
        <section className="hero-grad mt-20 rounded-card-lg px-6 py-12 text-center text-white md:py-16">
          <h2 className="mx-auto max-w-2xl font-display text-2xl font-extrabold tracking-tight md:text-4xl">
            Tell us your dates. We’ll build the island around them.
          </h2>
          <Link href={`/${locale}/tailor-make`} className="mt-6 inline-flex h-12 items-center gap-2 rounded-btn bg-white px-8 text-sm font-semibold text-ruga-navy transition hover:bg-ruga-sky/10">
            <Route className="h-4 w-4" /> {dict.cta.tailorMake}
          </Link>
        </section>
      </Fade>
    </div>
    </>
  );
}
