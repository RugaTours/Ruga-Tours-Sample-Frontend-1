"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MapPin, Route, Sparkles } from "lucide-react";
import { SEED_GALLERY } from "@/lib/mock";
import { SLOGAN } from "@/lib/utils";
import { useData } from "@/stores/data";
import { useAuth, useHydrated } from "@/stores/auth";
import { TOURIST } from "@/lib/mock";
import { Fade } from "@/components/shared/fade";

interface HeroGalleryProps {
  locale: string;
  dict: {
    heroKicker: string;
    sloganSub: string;
    cta: {
      tailorMake: string;
      packages: string;
    };
  };
}

export function HeroGallery({ locale, dict }: HeroGalleryProps) {
  const storePhotos = useData((s) => s.gallery);
  const photos = storePhotos && storePhotos.length > 0 ? storePhotos : SEED_GALLERY;

  const [currentIndex, setCurrentIndex] = useState(0);

  const { role } = useAuth();
  const hydrated = useHydrated();
  const name = hydrated && role === "tourist" ? `, ${TOURIST.name.split(" ")[0]}` : "";

  const currentPhoto = photos[currentIndex] || photos[0];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  // Auto-play timer for smooth background switching (5.5 seconds)
  useEffect(() => {
    if (photos.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5500);
    return () => clearInterval(timer);
  }, [handleNext, photos.length]);

  return (
    <section className="relative w-full overflow-hidden bg-slate-900 text-white min-h-[580px] md:min-h-[640px] lg:min-h-[700px] flex items-center">
      {/* ================= FULL-WIDTH ANIMATED BACKGROUND GALLERY ================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={currentPhoto.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={currentPhoto.url}
              alt={currentPhoto.caption || currentPhoto.place}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Soft, light scrim overlay: keeps photos bright & natural while ensuring text readability */}
        {/* Left scrim: darkens only where text sits, leaves the right side vibrant and natural */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent sm:w-4/5 lg:w-3/5" />
        {/* Very gentle overall wash for balance */}
        <div className="absolute inset-0 bg-black/15" />
        {/* Subtle bottom vignette to blend naturally */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* ================= FOREGROUND HERO CONTENT ================= */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:py-28">
        <div className="max-w-2xl lg:max-w-3xl">
          <Fade>
            {/* Pill Kicker */}
            <span className="inline-flex items-center gap-2 rounded-chip bg-black/40 px-3.5 py-1.5 text-[11.5px] font-semibold backdrop-blur-md border border-white/20 shadow-md">
              <MapPin className="h-3.5 w-3.5 text-palm-light" /> {dict.heroKicker}
            </span>

            {/* Main Headline */}
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
              Ayubowan{name}.<br />
              <span className="bg-gradient-to-r from-palm-light via-emerald-300 to-ruga-sky bg-clip-text text-transparent">
                Sri Lanka, planned around you.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 max-w-xl text-[15px] sm:text-base leading-relaxed text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)] font-medium">
              Dates, dreams, budget — you bring those. A real Ruga Tours planner crafts the rest, human to human. {dict.sloganSub}
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={`/${locale}/tailor-make`}
                className="inline-flex h-12 items-center gap-2 rounded-btn bg-white px-6 text-sm font-bold text-ruga-navy shadow-lg transition duration-200 hover:bg-slate-100 hover:shadow-xl hover:-translate-y-0.5"
              >
                <Route className="h-4 w-4 text-palm-deep" /> {dict.cta.tailorMake}
              </Link>
              <Link
                href={`/${locale}/packages`}
                className="inline-flex h-12 items-center gap-2 rounded-btn border border-white/40 bg-white/10 backdrop-blur-md px-6 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-white/20 hover:border-white/60 hover:-translate-y-0.5"
              >
                {dict.cta.packages} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Fade>

          {/* Slogan Ribbon */}
          <Fade delay={0.15}>
            <div className="mt-10 inline-flex items-center gap-3 rounded-card border border-white/20 bg-ink/40 px-5 py-3 backdrop-blur-md shadow-md">
              <Sparkles className="h-4 w-4 text-palm-light shrink-0" />
              <p className="font-display text-sm italic text-palm-light md:text-base">“{SLOGAN}”</p>
            </div>
          </Fade>
        </div>
      </div>

      {/* ================= SLEEK BACKGROUND PHOTO INDICATOR & CONTROLS ================= */}
      <div className="absolute bottom-6 right-6 z-10 flex items-center gap-3">
        {/* Location pill */}
        <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-3.5 py-1.5 backdrop-blur-md shadow-lg text-white">
          <MapPin className="h-3 w-3 text-palm-light shrink-0" />
          <span className="text-xs font-semibold">{currentPhoto.place}</span>
        </div>

        {/* Thumbnail switcher dots */}
        <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-3 py-2 backdrop-blur-md shadow-lg">
          {photos.map((p, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={p.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Switch background to ${p.place}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive ? "w-6 bg-palm-light shadow-sm" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
