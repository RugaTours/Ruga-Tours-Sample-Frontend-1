"use client";

import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";
import { REVIEWS } from "@/lib/mock";
import { Fade } from "@/components/shared/fade";
import { Badge } from "@/components/ui/badge";

export function Stars({ n, className }: { n: number; className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${className ?? ""}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < n ? "fill-amber-star text-amber-star" : "text-slate-300"}`} />
      ))}
    </span>
  );
}

/** Homepage testimonials strip — admin-curated TripAdvisor reviews. */
export function Testimonials() {
  const featured = REVIEWS.filter((r) => r.featured).slice(0, 4);
  return (
    <section className="evening rounded-card-lg p-6 md:p-10">
      <Fade>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Badge className="bg-white/10 text-palm-light">via TripAdvisor · curated by our team</Badge>
            <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              Guests who left as family
            </h2>
          </div>
          <a href="https://tripadvisor.com" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-chip border border-white/20 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10">
            Read all reviews <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </Fade>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {featured.map((r, i) => (
          <Fade key={r.id} delay={i * 0.06}>
            <motion.figure
              whileHover={{ y: -4 }}
              className="flex h-full flex-col rounded-card border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
            >
              <Stars n={r.rating} />
              <blockquote className="mt-3 flex-1 text-[13px] leading-relaxed text-slate-200">“{r.text}”</blockquote>
              <figcaption className="mt-4 text-xs text-slate-400">
                <span className="font-bold text-white">{r.author}</span> · {r.country} · {new Date(r.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
              </figcaption>
            </motion.figure>
          </Fade>
        ))}
      </div>
    </section>
  );
}
