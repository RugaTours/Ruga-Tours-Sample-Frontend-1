"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, MapPin, Newspaper, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Fade } from "@/components/shared/fade";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { cn, dF } from "@/lib/utils";
import { useData } from "@/stores/data";
import type { BlogPost } from "@/lib/types";

export default function AdminBlog() {
  const posts = useData((s) => s.blogs);
  const { updateBlogPost, deleteBlogPost } = useData();
  const [del, setDel] = useState<BlogPost | null>(null);

  return (
    <div>
      <Fade>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight">Blog Manager</h1>
            <p className="mt-0.5 text-xs text-slate-500">
              {posts.filter((p) => p.published).length} published · {posts.filter((p) => !p.published).length} drafts — only published posts show on /blog
            </p>
          </div>
          <Link href="/admin/blog/new"><Button variant="primary"><Plus className="h-4 w-4" /> New story</Button></Link>
        </div>
      </Fade>

      <div className="mt-6 space-y-3">
        {posts.map((b, i) => (
          <motion.div key={b.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={cn("flex flex-wrap items-center gap-4 rounded-card border bg-white p-4 shadow-soft", b.published ? "border-line" : "border-dashed border-amber-300 bg-amber-50/40")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.image} alt="" className={cn("h-16 w-24 rounded-[10px] object-cover", !b.published && "opacity-70 grayscale")} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("rounded-chip px-2.5 py-0.5 text-[10.5px] font-bold", b.published ? "bg-palm-light/40 text-palm-deep" : "bg-amber-200/70 text-amber-900")}>
                  {b.published ? "● Published" : "✎ Draft"}
                </span>
                <span className="line-clamp-1 font-display text-[14px] font-bold">{b.title}</span>
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11.5px] text-slate-500">
                <span className="inline-flex items-center gap-1 font-semibold text-palm-deep"><MapPin className="h-3 w-3" /> {b.location.name}, {b.location.region}</span>
                <span>{b.content.length} paragraphs · {b.readMins} min · {b.date} · by {b.createdBy}{b.updatedAt !== b.date ? ` · edited ${dF(b.updatedAt)}` : ""}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm"
                title={b.published ? "Unpublish → becomes a draft" : "Publish → goes live on /blog"}
                onClick={() => {
                  updateBlogPost(b.id, { published: !b.published });
                  toast.success(b.published ? `“${b.title}” unpublished (now a draft).` : `“${b.title}” is live on /blog 🎉`);
                }}>
                {b.published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {b.published ? "Unpublish" : "Publish"}
              </Button>
              <Link href={`/admin/blog/${b.id}`}><Button variant="outline" size="sm"><Pencil className="h-3.5 w-3.5" /> Edit</Button></Link>
              {b.published && <Link href={`/en/blog/${b.slug}`} target="_blank"><Button variant="ghost" size="sm">View</Button></Link>}
              <Button variant="ghost" size="icon" className="text-danger hover:bg-rose-50" title="Delete story" onClick={() => setDel(b)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
        {posts.length === 0 && (
          <p className="rounded-card border border-dashed border-line p-10 text-center text-sm text-slate-400">
            <Newspaper className="mx-auto mb-2 h-8 w-8" /> No stories yet — write the first one.
          </p>
        )}
      </div>

      {/* delete confirm */}
      <Modal open={del !== null} onClose={() => setDel(null)} title="Delete this story?" sub={del ? `“${del.title}” (${del.published ? "published" : "draft"})` : ""}>
        <p className="text-[12.5px] text-slate-600">The story and its location pin are removed from the blog immediately. This can’t be undone in the mock.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDel(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => { deleteBlogPost(del!.id); toast.warning("Story deleted."); setDel(null); }}>
            <Trash2 className="h-4 w-4" /> Delete story
          </Button>
        </div>
      </Modal>
    </div>
  );
}
