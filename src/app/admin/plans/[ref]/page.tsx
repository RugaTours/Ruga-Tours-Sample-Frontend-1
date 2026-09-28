"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft, Coins, Gavel, Hand, Lock, Mail, MessageCircle, PauseCircle, Phone, Play, RefreshCcwDot, UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { QuickLKR } from "@/components/admin/currency-converter";
import { Fade } from "@/components/shared/fade";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { FieldError, Hint, Input, Label, Select, Textarea } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { STAFF } from "@/lib/constants";
import { SETTINGS } from "@/lib/constants";
import { cn, dF, dISO, fmt } from "@/lib/utils";
import { useAuth } from "@/stores/auth";
import { useData } from "@/stores/data";

export default function AdminPlanDetail() {
  const { ref } = useParams<{ ref: string }>();
  const router = useRouter();
  const { currentStaff } = useAuth();
  const plan = useData((s) => s.plans.find((p) => p.ref === ref));
  const { claimPlan, toDiscussion, declareAmounts, setPlan, notify } = useData();

  const [declareOpen, setDeclareOpen] = useState(false);
  const [holdOpen, setHoldOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [total, setTotal] = useState("");
  const [deposit, setDeposit] = useState("");
  const [due, setDue] = useState(dISO(SETTINGS.depositExpiryDays));
  const [confirm, setConfirm] = useState("");
  const [dErr, setDErr] = useState("");
  const [holdReason, setHoldReason] = useState("");
  const [newAssignee, setNewAssignee] = useState("");

  if (!plan) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-slate-500">Plan not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/plans")}>Back to queue</Button>
      </div>
    );
  }

  const canDeclare = ["in_discussion", "submitted", "under_review", "package"].some(() => false) || plan.status === "in_discussion" || (plan.type === "package_asis" && ["submitted", "under_review"].includes(plan.status));

  const doClaim = () => {
    const ok = claimPlan(plan.ref, currentStaff);
    if (ok) toast.success(`${plan.ref} claimed — you own this review now. Tourist has been notified.`);
    else toast.error("Already claimed — use Reassign to take it over.");
  };

  const doDeclare = () => {
    const t = Math.round(parseFloat(total)), d = Math.round(parseFloat(deposit));
    if (!t || t <= 0) { setDErr("Enter the agreed total."); return; }
    if (!d || d <= 0 || d >= t) { setDErr("Deposit must be positive and less than the total."); return; }
    if (parseFloat(confirm) !== d) { setDErr(`Type the deposit amount (${d} ${plan.currency}) to confirm — this locks the amounts for the tourist.`); return; }
    declareAmounts(plan.ref, t, d, due, currentStaff);
    setDeclareOpen(false);
    toast.success(`Amounts declared: total ${fmt(t, plan.currency)}, deposit ${fmt(d, plan.currency)} — tourist can now pay.`);
  };

  const doHold = () => {
    if (!holdReason.trim()) { toast.error("Add a reason so the team knows why."); return; }
    setPlan(plan.ref, { status: "on_hold", prevStatus: plan.status, holdReason, holdReasonSetBy: currentStaff } as never);
    toast.info(`${plan.ref} placed on hold.`);
    setHoldOpen(false);
  };

  const doReactivate = () => {
    setPlan(plan.ref, { status: plan.prevStatus ?? "in_discussion", prevStatus: null, holdReason: null });
    toast.success(`${plan.ref} reactivated.`);
  };

  const doReassign = () => {
    if (!newAssignee) return;
    setPlan(plan.ref, { claimedBy: newAssignee });
    notify("staff", "Plan reassigned", `${plan.ref} moved from ${plan.claimedBy ?? "unclaimed"} to ${newAssignee}.`);
    toast.success(`${plan.ref} reassigned to ${newAssignee}.`);
    setReassignOpen(false);
  };

  const Row = ({ k, v }: { k: string; v: React.ReactNode }) => (
    <div className="flex justify-between gap-3 border-b border-line py-2 text-[12.5px] last:border-0">
      <span className="shrink-0 font-semibold text-slate-500">{k}</span><span className="min-w-0 text-right">{v}</span>
    </div>
  );

  return (
    <div>
      <Link href="/admin/plans" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Plan Queue
      </Link>
      <div className="mt-2 flex flex-wrap items-center gap-2.5">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">{plan.ref}</h1>
        <StatusBadge status={plan.status} />
        {plan.owner && <span className="rounded-chip bg-ruga-sky/15 px-2.5 py-1 text-[10px] font-bold text-ruga-navy">demo tourist (you)</span>}
      </div>

      {plan.status === "on_hold" && plan.holdReason && (
        <Fade>
          <div className="mt-4 flex gap-3 rounded-card border border-slate-300 bg-slate-100 p-4 text-[12.5px] text-slate-700">
            <PauseCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div><b>On hold:</b> {plan.holdReason} <span className="text-slate-400">· previously {plan.prevStatus}</span></div>
          </div>
        </Fade>
      )}

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1fr_350px]">
        {/* ------- info ------- */}
        <div className="space-y-5">
          <Fade>
            <section className="rounded-card border border-line bg-white p-5 shadow-soft">
              <h2 className="font-display text-sm font-bold">Tourist & trip</h2>
              <div className="mt-2 grid gap-x-8 sm:grid-cols-2">
                <div>
                  <Row k="Tourist" v={<><UserRound className="mr-1 inline h-3.5 w-3.5 text-slate-400" />{plan.tourist}</>} />
                  <Row k="Country / currency" v={`${plan.country} · ${plan.currency}`} />
                  <Row k="Dates" v={<span className="tnum">{dF(plan.start)} → {dF(plan.end)}</span>} />
                  <Row k="Travellers" v={`${plan.pax.adults} adult${plan.pax.adults > 1 ? "s" : ""}, ${plan.pax.children} child${plan.pax.children !== 1 ? "ren" : ""}, ${plan.pax.infants} infant${plan.pax.infants !== 1 ? "s" : ""}`} />
                  <Row k="Hotel level" v={plan.star ? `${plan.star}★` : "—"} />
                </div>
                <div>
                  <Row k="Type" v={plan.type.replace("_", " ")} />
                  {plan.pkgName && <Row k="Package" v={plan.pkgName} />}
                  <Row k="Budget (per person)" v={plan.type === "package_asis" ? "—" : <span className="tnum">{fmt(plan.budgetPPMin, plan.currency)} – {fmt(plan.budgetPPMax, plan.currency)}</span>} />
                  <Row k="Experiences" v={plan.experiences.length ? plan.experiences.join(", ") : "—"} />
                  {plan.mustVisit && <Row k="Must-visit" v={plan.mustVisit} />}
                </div>
              </div>
              {plan.notes && (
                <p className="mt-3 rounded-card bg-amber-50 px-4 py-2.5 text-[12px] italic text-amber-900">
                  Shared note: “{plan.notes}”
                </p>
              )}
            </section>
          </Fade>

          <Fade>
            <section className="rounded-card border border-line bg-white p-5 shadow-soft">
              <h2 className="font-display text-sm font-bold">Reach them (manual, after in-platform review)</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {plan.contact.methods.map((m) => (
                  <span key={m} className="inline-flex items-center gap-1.5 rounded-chip bg-paper px-3.5 py-2 text-[12px] font-semibold">
                    {m === "email" ? <Mail className="h-3.5 w-3.5 text-ruga-royal" /> : m === "whatsapp" ? <MessageCircle className="h-3.5 w-3.5 text-palm-deep" /> : <Phone className="h-3.5 w-3.5 text-slate-500" />}
                    {m}{plan.contact.phone && m !== "email" ? `: ${plan.contact.phone}` : ""}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-slate-400">Only email is automated (review-complete + bracketed workflow mails). WhatsApp / iMessage is typed by staff.</p>
            </section>
          </Fade>

          <Fade>
            <section className="rounded-card border border-line bg-white p-5 shadow-soft">
              <h2 className="flex items-center gap-2 font-display text-sm font-bold"><Lock className="h-3.5 w-3.5 text-slate-400" /> Versions</h2>
              <ol className="mt-2 space-y-1.5">
                {plan.versions.map((v, i) => (
                  <li key={i} className="flex gap-2 text-[12px]"><span className="tnum font-bold text-ruga-navy">v{i + 1}</span> {v}</li>
                ))}
              </ol>
            </section>
          </Fade>
        </div>

        {/* ------- actions rail ------- */}
        <div className="space-y-3">
          <section className="rounded-card border-2 border-ruga-navy/10 bg-white p-5 shadow-soft">
            <h2 className="font-display text-sm font-bold">Workflow</h2>
            <div className="mt-3 space-y-2">
              {!plan.claimedBy && plan.status === "submitted" && (
                <Button variant="primary" className="w-full" onClick={doClaim}><Hand className="h-4 w-4" /> Claim this plan</Button>
              )}
              {plan.status === "under_review" && plan.claimedBy === currentStaff && (
                <Button variant="palm" className="w-full" onClick={() => { toDiscussion(plan.ref); toast.success("Review complete — tourist notified by email + their channels."); }}>
                  <Gavel className="h-4 w-4" /> Mark review complete → discussion
                </Button>
              )}
              {canDeclare && (
                <Button variant="primary" className="w-full" onClick={() => { setTotal(plan.total ? String(plan.total) : ""); setDeposit(plan.deposit ? String(plan.deposit) : ""); setDeclareOpen(true); }}>
                  <Coins className="h-4 w-4" /> Declare amounts & deposit
                </Button>
              )}
              {plan.status !== "on_hold" && !["fully_paid", "cancelled", "completed"].includes(plan.status) && (
                <Button variant="outline" className="w-full" onClick={() => setHoldOpen(true)}><PauseCircle className="h-4 w-4" /> Place on hold</Button>
              )}
              {plan.status === "on_hold" && (
                <Button variant="palm" className="w-full" onClick={doReactivate}><Play className="h-4 w-4" /> Reactivate plan</Button>
              )}
              <Button variant="outline" className="w-full" onClick={() => setReassignOpen(true)}><RefreshCcwDot className="h-4 w-4" /> Reassign planner</Button>
            </div>
          </section>

          <section className="rounded-card border border-line bg-white p-5 shadow-soft">
            <h2 className="font-display text-sm font-bold">Money status</h2>
            <div className="mt-2">
              <Row k="Total" v={plan.total ? <span className="tnum font-bold">{fmt(plan.total, plan.currency)} <QuickLKR amount={plan.total} ccy={plan.currency} /></span> : "—"} />
              <Row k="Deposit" v={plan.deposit ? <span className="tnum">{fmt(plan.deposit, plan.currency)}{plan.depositDue ? ` · due ${dF(plan.depositDue)}` : ""}</span> : "—"} />
              <Row k="Amounts locked" v={plan.amountsLocked ? "Yes (deposit paid)" : "Not yet"} />
              {plan.declaredBy && <Row k="Declared by" v={plan.declaredBy} />}
            </div>
          </section>
        </div>
      </div>

      {/* ------- declare amounts modal ------- */}
      <Modal open={declareOpen} onClose={() => setDeclareOpen(false)} title={`Declare amounts — ${plan.ref}`}
        sub="The agreed human-to-human figures. Deposit payment next locks them permanently.">
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Confirmed total ({plan.currency})</Label><Input type="number" value={total} onChange={(e) => { setTotal(e.target.value); setDErr(""); }} placeholder="e.g. 2100" autoFocus /></div>
          <div><Label>Tour Booking Deposit ({plan.currency})</Label><Input type="number" value={deposit} onChange={(e) => { setDeposit(e.target.value); setDErr(""); }} placeholder="e.g. 500" /></div>
          <div className="col-span-2"><Label>Deposit due by</Label><Input type="date" value={due} onChange={(e) => setDue(e.target.value)} /></div>
          <div className="col-span-2">
            <Label>Type the deposit amount again to confirm</Label>
            <Input value={confirm} onChange={(e) => { setConfirm(e.target.value); setDErr(""); }} placeholder={`Type “${deposit || "…"}” exactly`} />
            <Hint>Safety check — the tourist pays exactly this, no taking chances.</Hint>
          </div>
        </div>
        <FieldError msg={dErr} />
        <Button variant="primary" className="mt-4 w-full" onClick={doDeclare}><Gavel className="h-4 w-4" /> Declare & notify tourist</Button>
      </Modal>

      {/* ------- hold modal ------- */}
      <Modal open={holdOpen} onClose={() => setHoldOpen(false)} title={`Place ${plan.ref} on hold`} sub="For unresponsive tourists — auto-reminders keep running.">
        <Label>Reason (visible to admins)</Label>
        <Textarea rows={3} value={holdReason} onChange={(e) => setHoldReason(e.target.value)} placeholder="e.g. No reply to 3 emails since Sep 8." />
        <Button variant="outline" className="mt-4 w-full" onClick={doHold}>Place on hold</Button>
      </Modal>

      {/* ------- reassign modal ------- */}
      <Modal open={reassignOpen} onClose={() => setReassignOpen(false)} title={`Reassign ${plan.ref}`} sub={plan.claimedBy ? `Currently with ${plan.claimedBy}` : "Currently unclaimed"}>
        <Label>Team member</Label>
        <Select value={newAssignee} onChange={(e) => setNewAssignee(e.target.value)}>
          <option value="">Choose…</option>
          {STAFF.filter((s) => s.name !== plan.claimedBy).map((s) => <option key={s.id} value={s.name}>{s.name} ({s.role})</option>)}
        </Select>
        <Button variant="primary" className="mt-4 w-full" onClick={doReassign} disabled={!newAssignee}>Reassign</Button>
      </Modal>
    </div>
  );
}
