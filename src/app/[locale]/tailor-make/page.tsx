"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import {
  Accessibility, ArrowLeft, ArrowRight, CalendarDays, Check, Info, Lock,
  Mail, MessageCircle, Phone, RotateCcw, Send, Star, Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Fade } from "@/components/shared/fade";
import { Button } from "@/components/ui/button";
import { FieldError, Hint, Input, Label, Textarea } from "@/components/ui/form";
import { EXPERIENCES, PACKAGES, TOURIST } from "@/lib/mock";
import { SETTINGS } from "@/lib/constants";
import { cn, dF, daysBetween, dISO, fmt, usdTo } from "@/lib/utils";
import { useAuth, useHydrated } from "@/stores/auth";
import { useData } from "@/stores/data";
import { useWizard } from "@/stores/wizard";

const STEPS = ["Trip & Group", "Experiences", "Stay & Budget", "Contact & Notes", "What Happens Next", "Review & Submit"];
const TODAY = "2026-09-23";

export default function TailorMakePage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const w = useWizard();
  const { role } = useAuth();
  const hydrated = useHydrated();
  const { addPlan, notify } = useData();
  const seq = useData((s) => s.seq.plan);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const ccy = TOURIST.currency;
  const minPP = Math.ceil(usdTo(SETTINGS.minBudgetPPUSD, ccy));
  const feeUSD = SETTINGS.reviewFeeUSD;

  function validate(step: number): boolean {
    const e: Record<string, string> = {};
    if (step === 0) {
      const r = z.object({ start: z.string(), end: z.string() })
        .refine((v) => v.start > TODAY, { message: "Pick a future arrival date." })
        .refine((v) => v.end > v.start, { message: "Departure must be after arrival." })
        .safeParse({ start: w.start, end: w.end });
      if (!r.success) e.dates = r.error.issues[0].message;
      if (w.adults < 1) e.pax = "At least one adult is required.";
    }
    if (step === 1 && w.experiences.length === 0) e.exp = "Pick at least one experience to build around.";
    if (step === 2) {
      if (!w.star) e.star = "Choose a hotel comfort level.";
      const min = z.coerce.number().min(minPP, `Minimum is ${fmt(minPP, ccy)} per person (US$100 equivalent).`).safeParse(w.budgetPPMin);
      if (!min.success) e.bmin = min.error.issues[0].message;
      const max = z.coerce.number().gt(+w.budgetPPMin || 0, "Max must be greater than min.").safeParse(w.budgetPPMax);
      if (!max.success) e.bmax = max.error.issues[0].message;
    }
    if (step === 3) {
      const needsPhone = w.contactMethods.includes("whatsapp") || w.contactMethods.includes("imessage");
      if (needsPhone && !/^\+\d[\d\s]{6,16}$/.test(w.phone)) e.phone = "Enter a valid international number, e.g. +94 77 000 0000.";
    }
    if (step === 4 && !w.ack) e.ack = "Please acknowledge the process before continuing.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() { if (validate(w.step)) { w.set({ step: Math.min(5, w.step + 1) }); window.scrollTo({ top: 0, behavior: "smooth" }); } }
  function back() { w.set({ step: Math.max(0, w.step - 1) }); }

  function submit() {
    if (role !== "tourist") {
      toast.error("Sign in as a Tourist to submit (use the role switcher in the header).");
      return;
    }
    const ref = `RGT-2026-${seq}`;
    const forked = w.forkedFrom ? PACKAGES.find((p) => p.id === w.forkedFrom) : null;
    addPlan({
      id: "p" + Date.now(), ref, owner: true, type: forked ? "package_customized" : "custom",
      packageId: forked?.id, pkgName: forked?.name,
      tourist: TOURIST.name, country: TOURIST.country, currency: ccy,
      start: w.start, end: w.end, pax: { adults: w.adults, children: w.children, infants: w.infants },
      star: w.star, experiences: w.experiences, places: [], mustVisit: w.mustVisit,
      budgetPPMin: +w.budgetPPMin, budgetPPMax: +w.budgetPPMax,
      contact: { methods: w.contactMethods, phone: w.phone }, notes: w.notes,
      status: "submitted", claimedBy: null, total: null, deposit: null, depositDue: null, finalDue: null,
      amountsLocked: false, finalMethod: null, createdAt: TODAY,
      versions: [forked ? `Customized from ${forked.name}` : "Tourist original request"],
    });
    notify("staff", "New plan in queue", `${ref} (${forked ? "customized package" : "custom"}) submitted by ${TOURIST.name} — waiting to be claimed.`);
    notify("tourist", "We received your plan 🎉", `${ref} is in the review queue. A planner usually picks it up within ${SETTINGS.reviewEtaDays} business days.`);
    w.reset();
    toast.success(`${ref} submitted — Review Fee $0 (waived). Your trip is with our planners now.`);
    router.push(`/${locale}/account/plans`);
  }

  const expName = (id: string) => EXPERIENCES.find((e) => e.id === id)?.name ?? id;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">Tailor-Make Planner</h1>
          <p className="mt-1 text-xs text-slate-500">Free to plan · draft saved on this device · Review Fee ${feeUSD} {feeUSD === 0 && "(waived during launch)"}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { w.reset(); toast.info("Draft cleared."); }}>
          <RotateCcw className="h-3.5 w-3.5" /> Start over
        </Button>
      </div>

      {/* stepper */}
      <div className="mt-6 flex gap-1.5 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <div key={s} className="min-w-[92px] flex-1 text-center">
            <div className={cn("h-1.5 rounded-full", i <= w.step ? "bg-ruga-navy" : "bg-line")} />
            <p className={cn("mt-1.5 text-[10.5px] font-semibold", i === w.step ? "text-ruga-navy" : "text-slate-400")}>{s}</p>
          </div>
        ))}
      </div>

      <Fade key={w.step}>
        <div className="mt-6 rounded-card-lg border border-line bg-white p-6 shadow-soft">

          {/* ---------- STEP 0: trip & group ---------- */}
          {w.step === 0 && (
            <div>
              <h2 className="font-display text-lg font-bold">When are you flying in, and who’s coming?</h2>
              <p className="mt-0.5 text-xs text-slate-500">We plan day-by-day between your flight arrival and departure dates.</p>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div><Label>Flight arrival date</Label><Input type="date" value={w.start} min={dISO(1)} onChange={(e) => w.set({ start: e.target.value })} /></div>
                <div><Label>Flight departure date</Label><Input type="date" value={w.end} min={dISO(2)} onChange={(e) => w.set({ end: e.target.value })} /></div>
              </div>
              <FieldError msg={errors.dates} />
              {w.end > w.start && <p className="mt-2 text-xs font-semibold text-palm-deep"><CalendarDays className="mr-1 inline h-3.5 w-3.5" />{daysBetween(w.start, w.end)} nights on the island</p>}
              <div className="mt-5 grid grid-cols-3 gap-4">
                {([["Adults", "adults", "13+ yrs", 1], ["Children", "children", "2–12 yrs", 0], ["Infants", "infants", "under 2", 0]] as const).map(([label, key, sub, min]) => (
                  <div key={key}>
                    <Label>{label} <span className="font-normal text-slate-400">{sub}</span></Label>
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" size="icon" onClick={() => w.set({ [key]: Math.max(min, (w[key] as number) - 1) } as never)}>−</Button>
                      <span className="tnum w-7 text-center font-bold">{w[key]}</span>
                      <Button type="button" variant="outline" size="icon" onClick={() => w.set({ [key]: (w[key] as number) + 1 } as never)}>+</Button>
                    </div>
                  </div>
                ))}
              </div>
              <FieldError msg={errors.pax} />
              <div className="mt-5 rounded-card border border-dashed border-line p-4">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold">
                  <input type="checkbox" checked={w.access} onChange={(e) => w.set({ access: e.target.checked })} className="h-4 w-4 accent-ruga-navy" />
                  <Accessibility className="h-4 w-4 text-ruga-royal" /> Someone in our group has accessibility needs
                </label>
                {w.access && (
                  <div className="mt-2.5">
                    <Textarea rows={2} value={w.accessNotes} onChange={(e) => w.set({ accessNotes: e.target.value })} placeholder="e.g. wheelchair user — step-free rooms, minimal stairs…" />
                    <Hint>Flagged prominently for your human planner — it shapes hotel picks and day pacing.</Hint>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---------- STEP 1: experiences ---------- */}
          {w.step === 1 && (
            <div>
              <h2 className="font-display text-lg font-bold">What do you want to feel out there?</h2>
              <p className="mt-0.5 text-xs text-slate-500">Pick any of our twelve signature experiences — your planner fits them to your dates and regions.</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {EXPERIENCES.map((e) => {
                  const on = w.experiences.includes(e.id);
                  return (
                    <button key={e.id} onClick={() => w.toggleExperience(e.id)}
                      className={cn(
                        "rounded-card border p-3.5 text-left transition",
                        on ? "border-ruga-navy bg-ruga-navy text-white shadow-soft" : "border-line bg-white hover:border-ruga-sky/60"
                      )}>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold">{e.name}</span>
                        {on && <Check className="h-4 w-4" />}
                      </div>
                      <p className={cn("mt-0.5 text-[11px] leading-snug", on ? "text-white/75" : "text-slate-500")}>{e.blurb}</p>
                    </button>
                  );
                })}
              </div>
              <FieldError msg={errors.exp} />
              <div className="mt-4">
                <Label>Must-visit places or ideas <span className="font-normal text-slate-400">(optional)</span></Label>
                <Input value={w.mustVisit} onChange={(e) => w.set({ mustVisit: e.target.value })} placeholder="e.g. Pidurangala at sunrise, a scenic train ride, my grandmother’s village…" />
              </div>
            </div>
          )}

          {/* ---------- STEP 2: stay & budget ---------- */}
          {w.step === 2 && (
            <div>
              <h2 className="font-display text-lg font-bold">How do you like to stay, and what’s the budget?</h2>
              <p className="mt-0.5 text-xs text-slate-500">You pick the comfort level — our planners choose the exact hotels after your deposit and confirm every name with you first.</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {([3, 4, 5] as const).map((n) => (
                  <button key={n} onClick={() => w.set({ star: n })}
                    className={cn("rounded-card border-2 p-4 text-center transition", w.star === n ? "border-ruga-navy bg-ruga-navy/5" : "border-line hover:border-ruga-sky/60")}>
                    <span className="flex justify-center gap-0.5">{Array.from({ length: n }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-star text-amber-star" />)}</span>
                    <p className="mt-2 text-[13px] font-bold">{n === 3 ? "Comfort" : n === 4 ? "Superior" : "Luxury"}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">{n === 3 ? "Well-rated 3★ stays" : n === 4 ? "4★ hotels & villas" : "5★ boutique & resorts"}</p>
                  </button>
                ))}
              </div>
              <FieldError msg={errors.star} />
              <div className="mt-5 rounded-card border border-ruga-sky/40 bg-ruga-sky/5 p-4">
                <p className="flex items-start gap-2 text-[12.5px] font-semibold text-ruga-navy">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  Budget is <u>per person</u> — minimum <b>{fmt(minPP, ccy)}</b> (US$100 equivalent) per person.
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <Label>Budget from ({ccy}, per person)</Label>
                  <Input type="number" min={0} value={w.budgetPPMin} onChange={(e) => w.set({ budgetPPMin: e.target.value })} placeholder={`≥ ${minPP}`} />
                  <FieldError msg={errors.bmin} />
                </div>
                <div>
                  <Label>Budget up to ({ccy}, per person)</Label>
                  <Input type="number" min={0} value={w.budgetPPMax} onChange={(e) => w.set({ budgetPPMax: e.target.value })} placeholder="e.g. 1100" />
                  <FieldError msg={errors.bmax} />
                </div>
              </div>
              <Hint>This is a guideline range for your planner, not a quote. Ruga Tours never auto-prices a custom trip — the final total is agreed with you human-to-human.</Hint>
            </div>
          )}

          {/* ---------- STEP 3: contact & notes ---------- */}
          {w.step === 3 && (
            <div>
              <h2 className="font-display text-lg font-bold">How should your planner reach you?</h2>
              <p className="mt-0.5 text-xs text-slate-500">After the in-platform review, all fine-tuning happens on your preferred channels — a human messages you manually.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className={cn(chipCls, "border-ruga-navy bg-ruga-navy text-white")}><Mail className="h-3.5 w-3.5" /> Email <span className="text-[10px] opacity-75">always included</span></span>
                <button className={cn(chipCls, w.contactMethods.includes("whatsapp") ? "border-palm-deep bg-palm-deep text-white" : "border-line bg-white")} onClick={() => w.toggleContact("whatsapp")}>
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </button>
                <button className={cn(chipCls, w.contactMethods.includes("imessage") ? "border-palm-deep bg-palm-deep text-white" : "border-line bg-white")} onClick={() => w.toggleContact("imessage")}>
                  <Phone className="h-3.5 w-3.5" /> iMessage
                </button>
              </div>
              {(w.contactMethods.includes("whatsapp") || w.contactMethods.includes("imessage")) && (
                <div className="mt-4">
                  <Label>Contact number (required for WhatsApp / iMessage)</Label>
                  <Input value={w.phone} onChange={(e) => w.set({ phone: e.target.value })} placeholder="+94 77 000 0000" />
                  <FieldError msg={errors.phone} />
                </div>
              )}
              <div className="mt-5">
                <Label>Trip notes for our planning team <span className="font-normal text-slate-400">(optional)</span></Label>
                <Textarea rows={3} value={w.notes} onChange={(e) => w.set({ notes: e.target.value })} placeholder="Occasions, dietary needs, hotel names you love, pace preferences…" />
                <Hint><Lock className="mr-1 inline h-3 w-3" /> This note is <b>shared with our planning team</b> when you submit — it gives your human reviewer a better picture of your trip. It is not a private note.</Hint>
              </div>
            </div>
          )}

          {/* ---------- STEP 4: what happens next ---------- */}
          {w.step === 4 && (
            <div>
              <h2 className="font-display text-lg font-bold">Exactly what happens after you submit</h2>
              <p className="mt-0.5 text-xs text-slate-500">Read this once — it explains every payment, so nothing later is a surprise.</p>
              <div className="relative mt-5">
                {([
                  ["Send us your plan", <>Pay the <b>Review Fee</b> — <b className="text-palm-deep">currently $0 (waived)</b> for launch. Your plan joins our review queue.</>],
                  ["One expert review", <>A Ruga Tours planner reviews it within about <b>{SETTINGS.reviewEtaDays} business days</b>, then messages you on {w.contactMethods.filter((c) => c !== "email").join(" + ") || "email"} + email.</>],
                  ["We fine-tune together", <>Unlimited back-and-forth — human to human, outside the platform. <b>Your submitted plan is locked</b>; changes happen with our team.</>],
                  ["Tour Booking Deposit", <>Once we agree on the trip and final price, we load the confirmed plan here and you pay a <b>Tour Booking Deposit</b> to book hotels, guides and vehicles.</>],
                  ["Final Balance", <>Pay the rest <b>online</b> or by <b>bank transfer</b> — <b>same amount either way</b>. Bank transfer needs a receipt upload for verification.</>],
                ] as [string, React.ReactNode][]).map(([t, d], i, arr) => (
                  <div key={t} className="relative mb-4 flex gap-3.5">
                    {i < arr.length - 1 && <div className="absolute left-[13px] top-7 h-full w-0.5 bg-line" />}
                    <span className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ruga-navy text-[11.5px] font-bold text-white">{i + 1}</span>
                    <div>
                      <p className="text-[13.5px] font-bold">{t}</p>
                      <div className="mt-0.5 text-[12.5px] leading-relaxed text-slate-600">{d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <label className="flex cursor-pointer items-start gap-2.5 rounded-card border border-line p-3.5">
                <input type="checkbox" checked={w.ack} onChange={(e) => w.set({ ack: e.target.checked })} className="mt-0.5 h-4 w-4 accent-ruga-navy" />
                <span className="text-[12.5px] leading-relaxed text-slate-600">
                  I understand the <b>Review Fee</b> (custom plans only) and the later <b>Tour Booking Deposit</b> are separate payments, my submitted plan can’t be edited in the platform, and the <b>refund & cancellation policy</b> (100% / 85% / 75% bands) applies to each payment.
                </span>
              </label>
              <FieldError msg={errors.ack} />
            </div>
          )}

          {/* ---------- STEP 5: review & submit ---------- */}
          {w.step === 5 && (
            <div>
              <h2 className="font-display text-lg font-bold">One last look — then it’s with our planners</h2>
              <p className="mt-0.5 text-xs text-slate-500">After submitting, <b>you can’t edit this plan or its notes in the platform</b> — anything you forgot can be shared with our team directly.</p>
              {w.forkedFrom && (
                <p className="mt-3 rounded-card border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-amber-800">
                  Personalized version of <b>{PACKAGES.find((p) => p.id === w.forkedFrom)?.name}</b> — package pricing doesn’t apply; your final budget is agreed with your planner.
                </p>
              )}
              <div className="mt-4 overflow-hidden rounded-card border border-line">
                {([
                  ["Dates", `${dF(w.start)} → ${dF(w.end)} · ${daysBetween(w.start, w.end)} nights`],
                  ["Travellers", `${w.adults} adult${w.adults > 1 ? "s" : ""}${w.children ? `, ${w.children} child${w.children > 1 ? "ren" : ""}` : ""}${w.infants ? `, ${w.infants} infant${w.infants > 1 ? "s" : ""}` : ""}${w.access ? " · accessibility needs" : ""}`],
                  ["Experiences", w.experiences.map(expName).join(", ") || "—"],
                  ["Must-visit", w.mustVisit || "—"],
                  ["Hotel level", w.star ? `${w.star}★ ${w.star === 3 ? "Comfort" : w.star === 4 ? "Superior" : "Luxury"}` : "—"],
                  ["Budget (per person)", `${fmt(+w.budgetPPMin || 0, ccy)} – ${fmt(+w.budgetPPMax || 0, ccy)} ${ccy}`],
                  ["Contact via", `${w.contactMethods.join(" + ")}${w.phone ? ` · ${w.phone}` : ""}`],
                  ["Shared notes", w.notes ? (w.notes.length > 80 ? w.notes.slice(0, 80) + "…" : w.notes) : "—"],
                ] as const).map(([k, v], i) => (
                  <div key={k} className={cn("flex gap-3 px-4 py-2.5 text-[12.5px]", i % 2 === 1 && "bg-paper")}>
                    <span className="w-32 shrink-0 font-semibold text-slate-500">{k}</span><span>{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-card border border-palm-light bg-palm-light/10 px-4 py-3.5">
                <div>
                  <p className="text-[13px] font-bold">Review Fee</p>
                  <p className="text-[11.5px] text-slate-500">Flat fee reserving planner time — waived during launch</p>
                </div>
                <span className="font-display text-lg font-extrabold text-palm-deep">{feeUSD === 0 ? "FREE" : fmt(usdTo(feeUSD, ccy), ccy)}</span>
              </div>
              {hydrated && role !== "tourist" && (
                <p className="mt-3 flex items-start gap-2 rounded-card bg-amber-50 p-3 text-xs text-amber-800">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" /> You’re browsing as {role === "guest" ? "a guest" : "Super Admin"} — switch to the <b>Tourist</b> role (header) to submit.
                </p>
              )}
              <Button variant="palm" size="lg" className="mt-4 w-full" onClick={submit}>
                <Send className="h-4 w-4" /> Submit plan for human review
              </Button>
            </div>
          )}
        </div>
      </Fade>

      <div className="mt-5 flex justify-between">
        {w.step > 0 ? <Button variant="outline" onClick={back}><ArrowLeft className="h-4 w-4" /> Back</Button> : <span />}
        {w.step < 5 && <Button variant="primary" onClick={next}>Continue <ArrowRight className="h-4 w-4" /></Button>}
      </div>
      {w.step === 5 && (
        <Button variant="ghost" size="sm" className="mt-3 text-slate-400" onClick={() => { w.reset(); toast.info("Draft discarded."); }}>
          <Trash2 className="h-3.5 w-3.5" /> Discard this draft
        </Button>
      )}
    </div>
  );
}

const chipCls = "inline-flex cursor-pointer items-center gap-1.5 rounded-chip border px-3.5 py-2 text-[12.5px] font-semibold transition";
