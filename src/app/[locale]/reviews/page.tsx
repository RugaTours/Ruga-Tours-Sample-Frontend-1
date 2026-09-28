import type { Metadata } from "next";
import { Stars } from "@/components/marketing/testimonials";
import { Fade } from "@/components/shared/fade";
import { Badge } from "@/components/ui/badge";
import { REVIEWS } from "@/lib/mock";

export const metadata: Metadata = { title: "Reviews — Ruga Tours" };

export default function ReviewsPage() {
  const avg = (REVIEWS.reduce((a, r) => a + r.rating, 0) / REVIEWS.length).toFixed(1);
  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Traveler Reviews</h1>
          <p className="mt-1 text-sm text-slate-500">
            {avg} average across {REVIEWS.length} reviews · imported from TripAdvisor and curated by our team.
          </p>
        </div>
        <Badge className="gap-1.5 bg-palm-light/20 px-4 py-2 text-[13px] font-bold text-palm-deep">
          <Stars n={5} className="mr-1" /> {avg} / 5 on TripAdvisor
        </Badge>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((r, i) => (
          <Fade key={r.id} delay={(i % 3) * 0.06}>
            <figure className="flex h-full flex-col rounded-card border border-line bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <Stars n={r.rating} />
                <Badge className="bg-slate-100 text-[10px] text-slate-500">via {r.source === "tripadvisor" ? "TripAdvisor" : "website"}</Badge>
              </div>
              <blockquote className="mt-3 flex-1 text-[13px] leading-relaxed text-slate-600">“{r.text}”</blockquote>
              <figcaption className="mt-4 border-t border-line pt-3 text-xs text-slate-500">
                <b className="text-ink">{r.author}</b> · {r.country} ·{" "}
                {new Date(r.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
              </figcaption>
            </figure>
          </Fade>
        ))}
      </div>
    </div>
  );
}
