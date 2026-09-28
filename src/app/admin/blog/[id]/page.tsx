"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, MapPin, Save } from "lucide-react";
import { toast } from "sonner";
import { SriLankaMap } from "@/components/map/sri-lanka";
import { Button } from "@/components/ui/button";
import { FieldError, Hint, Input, Label, Textarea } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useAuth } from "@/stores/auth";
import { useData } from "@/stores/data";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 60);

export default function BlogEditor() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { currentStaff } = useAuth();
  const { blogs, addBlogPost, updateBlogPost } = useData();
  const isNew = id === "new";
  const existing = isNew ? null : blogs.find((b) => b.id === id);

  const [t, setT] = useState(() => ({
    title: existing?.title ?? "", slug: existing?.slug ?? "", excerpt: existing?.excerpt ?? "",
    image: existing?.image ?? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
    locName: existing?.location.name ?? "", locRegion: existing?.location.region ?? "",
    locX: existing?.location.x ?? 98, locY: existing?.location.y ?? 172,
    body: existing?.content.join("\n\n") ?? "",
    readMins: String(existing?.readMins ?? 5),
    published: existing?.published ?? false,
  }));
  const [err, setErr] = useState("");

  if (!isNew && !existing) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-slate-500">Story not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/blog")}>Back to Blog Manager</Button>
      </div>
    );
  }

  const paragraphs = t.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  const save = (publish?: boolean) => {
    if (t.title.trim().length < 8) { setErr("Give the story a proper title."); return; }
    if (t.excerpt.trim().length < 30) { setErr("Excerpt should tease the story in a sentence or two."); return; }
    if (!/^https?:\/\/.+/.test(t.image)) { setErr("Hero image must be a full https:// URL."); return; }
    if (!t.locName.trim() || !t.locRegion.trim()) { setErr("Add the location name and region — every story gets pinned on the map."); return; }
    if (paragraphs.length < 2) { setErr("Write at least 2 paragraphs (blank line between them)."); return; }
    const published = publish ?? t.published;
    const payload = {
      title: t.title.trim(), slug: existing ? existing.slug : slugify(t.title) || "story-" + Date.now().toString(36),
      excerpt: t.excerpt.trim(), image: t.image.trim(),
      location: { name: t.locName.trim(), region: t.locRegion.trim(), x: t.locX, y: t.locY },
      content: paragraphs, author: "The Ruga Tours Team",
      date: existing?.date ?? "2026-09-23", readMins: Math.max(1, parseInt(t.readMins) || 5),
      published,
    };
    if (isNew) {
      addBlogPost(payload, currentStaff);
      toast.success(published ? "Story published — live on /blog 🎉" : "Draft saved — only staff can see it.");
    } else {
      updateBlogPost(existing!.id, payload);
      toast.success("Story updated.");
    }
    router.push("/admin/blog");
  };

  const set = (patch: Partial<typeof t>) => { setT((s) => ({ ...s, ...patch })); setErr(""); };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-ink"><ArrowLeft className="h-3.5 w-3.5" /> Blog Manager</Link>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight">{isNew ? "New story" : `Edit — ${existing!.title}`}</h1>
        </div>
        <span className={cn("rounded-chip px-3 py-1.5 text-[11px] font-bold", t.published ? "bg-palm-light/40 text-palm-deep" : "bg-amber-200/70 text-amber-900")}>
          {t.published ? "● Will be Published" : "✎ Draft — hidden from /blog"}
        </span>
      </div>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1fr_340px]">
        {/* editor */}
        <section className="space-y-4 rounded-card border border-line bg-white p-6 shadow-soft">
          <div>
            <Label>Title</Label>
            <Input value={t.title} onChange={(e) => set({ title: e.target.value, slug: existing ? t.slug : slugify(e.target.value) })} placeholder="Climbing Sigiriya at Sunrise: The Honest Guide" />
            {t.slug && <Hint>Slug: <b>/en/blog/{t.slug || "…"}</b></Hint>}
          </div>
          <div>
            <Label>Excerpt</Label>
            <Textarea rows={2} value={t.excerpt} onChange={(e) => set({ excerpt: e.target.value })} placeholder="One or two sentences that hook the reader on the cards…" />
          </div>
          <div>
            <Label>Hero image URL</Label>
            <Input value={t.image} onChange={(e) => set({ image: e.target.value })} placeholder="https://…" />
          </div>
          <div>
            <Label>Story body <span className="font-normal text-slate-400">(blank line between paragraphs)</span></Label>
            <Textarea rows={14} value={t.body} onChange={(e) => set({ body: e.target.value })} placeholder={"Every Sri Lanka sunrise is different…\n\nThis is the second paragraph…"} />
            <Hint>{paragraphs.length} paragraph{paragraphs.length === 1 ? "" : "s"}</Hint>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {([["Location name", "locName", "Sigiriya Rock Fortress"], ["Region", "locRegion", "Cultural Triangle"], ["Read mins", "readMins", "6"]] as const).map(([label, key, ph]) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input
                  type={key === "readMins" ? "number" : "text"} min={1}
                  value={t[key]} onChange={(e) => set({ [key]: e.target.value } as never)} placeholder={ph} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Map pin X (0–200)</Label><Input type="number" min={0} max={200} value={t.locX} onChange={(e) => set({ locX: Math.max(0, Math.min(200, +e.target.value)) })} /></div>
            <div><Label>Map pin Y (0–320)</Label><Input type="number" min={0} max={320} value={t.locY} onChange={(e) => set({ locY: Math.max(0, Math.min(320, +e.target.value)) })} /></div>
          </div>
          <FieldError msg={err} />
          <div className="flex flex-wrap gap-2 border-t border-line pt-4">
            <Button variant={t.published ? "primary" : "outline"} className={cn(t.published && "bg-palm-deep hover:bg-palm-deep/90")} onClick={() => save(true)}>
              <Eye className="h-4 w-4" /> {isNew ? "Publish now" : "Save & keep published"}
            </Button>
            <Button variant="outline" onClick={() => save(false)}><EyeOff className="h-4 w-4" /> Save as draft</Button>
            {!isNew && <Button variant="ghost" onClick={() => save()}><Save className="h-4 w-4" /> Save (unchanged status)</Button>}
          </div>
        </section>

        {/* live preview rail */}
        <div className="space-y-4 lg:sticky lg:top-20">
          <section className="overflow-hidden rounded-card border border-line bg-white shadow-soft">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.image} alt="" className="h-40 w-full object-cover transition duration-700" onError={undefined} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-chip bg-ink/45 px-2.5 py-1 text-[10.5px] font-semibold text-white backdrop-blur-sm">
                <MapPin className="h-3 w-3 text-palm-light" /> {t.locName || "Location…"}
              </span>
            </div>
            <div className="p-4">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{t.locRegion || "Region"} · {t.readMins} min read</p>
              <h3 className="mt-1 line-clamp-2 font-display text-[14.5px] font-bold leading-snug">{t.title || "Story title…"}</h3>
              <p className="mt-1 line-clamp-2 text-[11.5px] text-slate-500">{t.excerpt || "Excerpt…"}</p>
            </div>
          </section>
          <section className="rounded-card border border-line bg-white p-4 text-center shadow-soft">
            <p className="flex items-center justify-center gap-1.5 font-display text-[12.5px] font-bold"><MapPin className="h-4 w-4 text-palm-deep" /> Pin preview</p>
            <SriLankaMap stops={[{ city: t.locName || "?", x: t.locX, y: t.locY }]} route={false} className="mx-auto max-w-[140px]" />
          </section>
        </div>
      </div>
    </div>
  );
}
