"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, CalendarDays, Clock, MapPin, Share2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { SriLankaMap } from "@/components/map/sri-lanka";
import { Fade } from "@/components/shared/fade";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useData } from "@/stores/data";
import { useHydrated } from "@/stores/auth";
import { dF } from "@/lib/utils";

export default function BlogPostPage() {
  const { locale, slug } = useParams<{ locale: string; slug: string }>();
  const router = useRouter();
  const hydrated = useHydrated();
  const post = useData((s) => s.blogs.find((b) => b.slug === slug && b.published));
  const more = useData((s) => s.blogs.filter((b) => b.published && b.slug !== slug)).slice(0, 3);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });

  if (!hydrated) return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-slate-400">Loading story…</div>;

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-slate-500">This story doesn’t exist (or is still a draft).</p>
        <Link href={`/${locale}/blog`}><Button variant="outline" className="mt-4">Back to Blog</Button></Link>
      </div>
    );
  }

  return (
    <article>
      {/* reading progress bar */}
      <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-palm-deep via-ruga-sky to-ruga-royal" />

      {/* hero */}
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt={post.title} className="h-[52vh] min-h-[340px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-4xl px-4 pb-10">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <Link href={`/${locale}/blog`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white">
                <ArrowLeft className="h-3.5 w-3.5" /> Islanders’ Notebook
              </Link>
              <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-white md:text-5xl">{post.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-white/80">
                <span className="inline-flex items-center gap-1.5"><UserRound className="h-3.5 w-3.5" /> {post.author}</span>
                <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {dF(post.date)}</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {post.readMins} min read</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-4xl gap-10 px-4 py-10 lg:grid-cols-[1fr_260px]">
        {/* body */}
        <div className="min-w-0">
          <Fade>
            <p className="border-l-4 border-palm-deep pl-4 font-display text-[17px] font-bold leading-relaxed text-ruga-navy">{post.excerpt}</p>
          </Fade>
          {post.content.map((para, i) => (
            <Fade key={i} delay={0.05}>
              <p className="mt-6 text-[15px] leading-[1.85] text-slate-700 first:mt-8">
                {i === 0 && <span className="float-left mr-2 font-display text-5xl font-extrabold leading-[0.85] text-palm-deep">{para.charAt(0)}</span>}
                {i === 0 ? para.slice(1) : para}
              </p>
            </Fade>
          ))}
          <Fade>
            <div className="mt-10 flex items-center justify-between rounded-card bg-paper p-5">
              <p className="text-[13px] font-semibold text-slate-600">Enjoyed this? Plan your own version of the trip →</p>
              <Link href={`/${locale}/tailor-make`}><Button variant="palm" size="sm">Tailor-Make</Button></Link>
            </div>
          </Fade>
        </div>

        {/* location rail */}
        <Fade delay={0.15}>
          <aside className="h-fit space-y-4 lg:sticky lg:top-24">
            <div className="rounded-card border border-line bg-white p-5 text-center shadow-soft">
              <h3 className="flex items-center justify-center gap-1.5 font-display text-sm font-bold"><MapPin className="h-4 w-4 text-palm-deep" /> Where this story lives</h3>
              <SriLankaMap stops={[{ city: post.location.name, x: post.location.x, y: post.location.y }]} route={false} className="mx-auto mt-2 max-w-[170px]" />
              <p className="mt-1 font-display text-[14px] font-bold">{post.location.name}</p>
              <p className="text-xs text-slate-500">{post.location.region}</p>
              <Link href={`/${locale}/destinations`}><Button variant="outline" size="sm" className="mt-3 w-full">Explore destination</Button></Link>
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={() => { toast.success("Link copied (mock) — share the island! 🌴"); }}>
              <Share2 className="h-3.5 w-3.5" /> Share this story
            </Button>
          </aside>
        </Fade>
      </div>

      {/* more stories */}
      {more.length > 0 && (
        <div className="mx-auto max-w-4xl px-4 pb-16">
          <h2 className="font-display text-xl font-extrabold">More from the notebook</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {more.map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ y: -6 }}>
                <Link href={`/${locale}/blog/${b.slug}`} className="group block overflow-hidden rounded-card border border-line bg-white shadow-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.image} alt={b.title} className="h-28 w-full object-cover transition duration-700 group-hover:scale-[1.06]" />
                  <div className="p-4">
                    <Badge className="bg-palm-light/20 px-2 py-0.5 text-[10px] text-palm-deep">{b.location.name}</Badge>
                    <h3 className="mt-1.5 line-clamp-2 font-display text-[13.5px] font-bold leading-snug group-hover:text-ruga-royal">{b.title}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
