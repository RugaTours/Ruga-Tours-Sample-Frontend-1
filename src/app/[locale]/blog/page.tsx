"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, MapPin, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Fade } from "@/components/shared/fade";
import { useData } from "@/stores/data";
import { useHydrated } from "@/stores/auth";
import { dF } from "@/lib/utils";

export default function BlogPage() {
  const { locale } = useParams<{ locale: string }>();
  const hydrated = useHydrated();
  const posts = useData((s) => s.blogs.filter((b) => b.published));

  if (!hydrated) return <div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-slate-400">Loading stories…</div>;
  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <Fade>
        <div className="text-center">
          <Badge className="bg-ruga-sky/15 text-ruga-navy"><BookOpen className="h-3.5 w-3.5" /> Islanders’ Notebook</Badge>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight md:text-5xl">Stories from the Island</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
            Written by our own planners and guides — honest, unhurried, and pinned to the places they’re about.
          </p>
        </div>
      </Fade>

      {posts.length === 0 && (
        <p className="mt-12 rounded-card border border-dashed border-line p-10 text-center text-sm text-slate-400">No stories published yet — drafts are in the works ✍️</p>
      )}

      {/* ---------- featured post ---------- */}
      {featured && (
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <Link href={`/${locale}/blog/${featured.slug}`} className="group relative mt-10 block overflow-hidden rounded-card-lg shadow-lift">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={featured.image} alt={featured.title} className="h-[420px] w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.04]" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-palm-light text-ruga-navy"><Sparkles className="h-3 w-3" /> Featured story</Badge>
                <Badge className="bg-white/15 text-white backdrop-blur"><MapPin className="h-3 w-3" /> {featured.location.name} · {featured.location.region}</Badge>
              </div>
              <h2 className="mt-3 max-w-2xl font-display text-2xl font-extrabold leading-tight text-white md:text-4xl">{featured.title}</h2>
              <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-white/85">{featured.excerpt}</p>
              <p className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-palm-light transition group-hover:gap-3.5">
                Read the story <ArrowRight className="h-4 w-4" />
              </p>
            </div>
          </Link>
        </motion.div>
      )}

      {/* ---------- rest of grid ---------- */}
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((b, i) => (
          <motion.article
            key={b.id}
            initial={{ opacity: 0, y: 28, rotate: i % 2 === 0 ? 0.6 : -0.6 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8 }}
            className="group overflow-hidden rounded-card border border-line bg-white shadow-soft"
          >
            <Link href={`/${locale}/blog/${b.slug}`}>
              <div className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.image} alt={b.title} className="h-52 w-full object-cover transition duration-[900ms] group-hover:scale-[1.07]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent opacity-70" />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-chip bg-ink/45 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                  <MapPin className="h-3 w-3 text-palm-light" /> {b.location.name}
                </span>
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-chip bg-white/90 px-2.5 py-1 text-[10.5px] font-bold text-ruga-navy">
                  <Clock className="h-3 w-3" /> {b.readMins} min read
                </span>
              </div>
              <div className="p-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{b.location.region} · {dF(b.date)}</p>
                <h3 className="mt-1.5 font-display text-[16.5px] font-bold leading-snug transition group-hover:text-ruga-royal">{b.title}</h3>
                <p className="mt-1.5 line-clamp-3 text-[12.5px] leading-relaxed text-slate-600">{b.excerpt}</p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-palm-deep transition group-hover:gap-3">
                  Keep reading <ArrowRight className="h-3.5 w-3.5" />
                </p>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
