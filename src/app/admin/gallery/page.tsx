"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Images, MapPin, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Fade } from "@/components/shared/fade";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { dF } from "@/lib/utils";
import { useAuth } from "@/stores/auth";
import { useData } from "@/stores/data";
import type { GalleryPhoto } from "@/lib/types";

export default function AdminGallery() {
  const photos = useData((s) => s.gallery);
  const { addGalleryPhoto, deleteGalleryPhoto } = useData();
  const { currentStaff } = useAuth();
  const [addOpen, setAddOpen] = useState(false);
  const [del, setDel] = useState<GalleryPhoto | null>(null);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [place, setPlace] = useState("");
  const [consentBy, setConsentBy] = useState("");
  const [consentOk, setConsentOk] = useState(false);
  const [err, setErr] = useState("");

  const doAdd = () => {
    if (!/^https?:\/\/.+/.test(url)) { setErr("Paste a full https:// image URL."); return; }
    if (caption.trim().length < 5) { setErr("Give the photo a caption."); return; }
    if (!place.trim()) { setErr("Add the location visible on the card."); return; }
    if (!consentOk || !consentBy.trim()) { setErr("Policy: recorded traveler consent is required — name them and tick the box."); return; }
    addGalleryPhoto({ url, caption: caption.trim(), place: place.trim(), consentBy: consentBy.trim(), addedBy: currentStaff });
    setAddOpen(false); setUrl(""); setCaption(""); setPlace(""); setConsentBy(""); setConsentOk(false);
    toast.success("Photo published to the public gallery.");
  };

  return (
    <div>
      <Fade>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight">Gallery Manager</h1>
            <p className="mt-0.5 text-xs text-slate-500">{photos.length} live photos · public page is {"/en/gallery"} (no login needed) · additions require recorded consent</p>
          </div>
          <Button variant="primary" onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> Add photo</Button>
        </div>
      </Fade>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {photos.map((p, i) => (
          <motion.figure key={p.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="group overflow-hidden rounded-card border border-line bg-white shadow-soft">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={p.caption} className="h-44 w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
              <button onClick={() => setDel(p)} title="Delete photo"
                className="absolute right-2.5 top-2.5 rounded-full bg-white/90 p-2 text-danger shadow-soft opacity-0 transition group-hover:opacity-100 hover:bg-white">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <figcaption className="p-3.5">
              <p className="line-clamp-1 text-[12.5px] font-bold">{p.caption}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-palm-deep"><MapPin className="h-3 w-3" /> {p.place}</p>
              <p className="mt-1.5 text-[10.5px] text-slate-400">consent: {p.consentBy} · by {p.addedBy} · {dF(p.createdAt)}</p>
            </figcaption>
          </motion.figure>
        ))}
      </div>
      {photos.length === 0 && (
        <p className="rounded-card border border-dashed border-line p-10 text-center text-sm text-slate-400">
          <Images className="mx-auto mb-2 h-8 w-8" /> Gallery is empty — add the first photo.
        </p>
      )}

      {/* add modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add photo to gallery" sub="Visible to everyone on /gallery — no login. Consent is mandatory.">
        <div className="space-y-3.5">
          <div>
            <Label>Image URL</Label>
            <Input value={url} onChange={(e) => { setUrl(e.target.value); setErr(""); }} placeholder="https://…" />
            {url && /^https?:\/\/.+/.test(url) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt="preview" className="mt-2 h-32 w-full rounded-card object-cover" />
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Caption</Label><Input value={caption} onChange={(e) => { setCaption(e.target.value); setErr(""); }} placeholder="Leopard at golden hour…" /></div>
            <div><Label>Location</Label><Input value={place} onChange={(e) => { setPlace(e.target.value); setErr(""); }} placeholder="Yala National Park" /></div>
          </div>
          <div>
            <Label>Consent recorded from</Label>
            <Input value={consentBy} onChange={(e) => { setConsentBy(e.target.value); setErr(""); }} placeholder="e.g. James & Priya (AU) — WhatsApp 12 Sep" />
          </div>
          <label className="flex cursor-pointer items-start gap-2.5 rounded-card border border-line p-3.5">
            <input type="checkbox" checked={consentOk} onChange={(e) => { setConsentOk(e.target.checked); setErr(""); }} className="mt-0.5 h-4 w-4 accent-ruga-navy" />
            <span className="text-[12px] leading-relaxed text-slate-600">
              <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-palm-deep" />
              I confirm the traveler above gave <b>explicit consent</b> for this photo to appear in the public gallery (screenshot/email stored).
            </span>
          </label>
          <FieldError msg={err} />
          <Button variant="primary" className="w-full" onClick={doAdd}><Plus className="h-4 w-4" /> Publish photo</Button>
        </div>
      </Modal>

      {/* delete confirm */}
      <Modal open={del !== null} onClose={() => setDel(null)} title="Delete this photo?" sub={del ? `“${del.caption}” — ${del.place}` : ""}>
        <p className="text-[12.5px] text-slate-600">The photo disappears from the public gallery immediately. The consent record stays on file for audit.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDel(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => { deleteGalleryPhoto(del!.id); toast.warning("Photo removed from gallery."); setDel(null); }}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
