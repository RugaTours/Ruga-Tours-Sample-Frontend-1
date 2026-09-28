"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, HeartHandshake, MapPin, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/stores/data";
import { useHydrated } from "@/stores/auth";
import { cn } from "@/lib/utils";
import { Fade } from "@/components/shared/fade";
import type { GalleryPhoto } from "@/lib/types";

/** Public gallery — guests welcome. Every photo was shared with recorded tourist consent. */
export default function GalleryPage() {
  const photos = useData((s) => s.gallery);
  const hydrated = useHydrated();
  const [place, setPlace] = useState("All");
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null);

  const places = ["All", ...Array.from(new Set(photos.map((p) => p.place.split(",")[1]?.trim() ?? p.place)))];
  const shown = place === "All" ? photos : photos.filter((p) => (p.place.split(",")[1]?.trim() ?? p.place) === place);

  if (!hydrated) return <div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-slate-400">Loading gallery…</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <Fade>
        <div className="text-center">
          <Badge className="bg-palm-light/25 text-palm-deep"><Camera className="h-3.5 w-3.5" /> Guest-friendly — no login needed</Badge>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight md:text-5xl">The Island, Through Our Guests’ Lenses</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
            Real frames from real Ruga trips — every photo published with the explicit, recorded consent of the traveler who took it.
          </p>
        </div>
      </Fade>

      {/* place filter chips */}
      <div className="mt-7 flex flex-wrap justify-center gap-1.5">
        {places.map((p) => (
          <button key={p} onClick={() => setPlace(p)}
            className={cn("rounded-chip px-3.5 py-2 text-xs font-semibold transition",
              place === p ? "bg-ruga-navy text-white" : "bg-white text-slate-500 ring-1 ring-line hover:text-ink")}>
            {p}
          </button>
        ))}
      </div>

      {/* animated masonry grid */}
      <motion.div layout className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <motion.figure
              key={p.id} layout
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5 }}
              className="group mb-4 break-inside-avoid cursor-zoom-in overflow-hidden rounded-card bg-white shadow-soft"
              onClick={() => setLightbox(p)}
            >
              <div className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.caption} loading="lazy"
                  className="w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06] group-hover:rotate-[0.5deg]"
                  style={{ maxHeight: 420 }} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0 opacity-0 transition duration-500 group-hover:opacity-100" />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-4 p-4 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[13.5px] font-bold leading-snug text-white drop-shadow">{p.caption}</p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-palm-light">
                    <MapPin className="h-3 w-3" /> {p.place}
                  </p>
                </figcaption>
              </div>
            </motion.figure>
          ))}
        </AnimatePresence>
      </motion.div>
      {shown.length === 0 && (
        <p className="mt-10 rounded-card border border-dashed border-line p-10 text-center text-sm text-slate-400">No photos here yet — check back soon.</p>
      )}

      <Fade>
        <p className="mt-8 flex flex-wrap items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
          <HeartHandshake className="h-3.5 w-3.5 text-palm-deep" />
          Consent ethic: photos are only ever published with logged traveler consent (name on each card) — withdrawal is one click.
        </p>
      </Fade>

      {/* lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] grid place-items-center bg-ink/80 p-4 backdrop-blur-sm" onClick={() => setLightbox(null)}>
            <motion.div initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-card-lg bg-white" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={lightbox.url} alt={lightbox.caption} className="max-h-[70vh] w-full object-cover" />
                <button onClick={() => setLightbox(null)}
                  className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-soft transition hover:bg-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 p-5">
                <div>
                  <p className="font-display text-[15px] font-bold">{lightbox.caption}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-palm-deep"><MapPin className="h-3.5 w-3.5" /> {lightbox.place}</p>
                </div>
                <p className="text-[11px] text-slate-400">Shared with consent by {lightbox.consentBy} · added by {lightbox.addedBy}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
