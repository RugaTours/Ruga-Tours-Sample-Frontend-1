"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import {
  ArrowLeft, BadgeCheck, Building2, Check, CheckCircle2, CreditCard, FileUp,
  HandCoins, History, Lock, MessageCircle, RefreshCw, ShieldCheck, Users, Wallet, XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Fade } from "@/components/shared/fade";
import { StatusBadge } from "@/components/shared/status-badge";
import { Stars } from "@/components/marketing/testimonials";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { BANK, FLOW_STEPS, PAYMENT_STATUS, PAYMENT_TYPE_LABEL, REFUND_BANDS } from "@/lib/constants";
import { cn, dF, daysBetween, fmt, TODAY } from "@/lib/utils";
import { useData } from "@/stores/data";
import type { Payment } from "@/lib/types";

const STEP_ORDER = FLOW_STEPS.map((s) => s.key);
function stepIndex(status: string): number {
  if (status === "bank_transfer_pending") return 4;
  const i = STEP_ORDER.indexOf(status as never);
  return i === -1 ? (status === "fully_paid" ? 5 : 0) : i;
}

function refundBand(daysBefore: number) {
  return daysBefore >= 15 ? REFUND_BANDS[0] : daysBefore >= 8 ? REFUND_BANDS[1] : REFUND_BANDS[2];
}

export default function PlanDetailPage() {
  const { locale, ref } = useParams<{ locale: string; ref: string }>();
  const plan = useData((s) => s.plans.find((p) => p.ref === ref));
  const payments = useData((s) => s.payments.filter((p) => p.planRef === ref));
  const receipts = useData((s) => s.receipts.filter((r) => r.planRef === ref));
  const { payDeposit, payFinalOnline, chooseFinalBank, uploadReceipt } = useData();

  const [gateway, setGateway] = useState<null | "deposit" | "final">(null);
  const [paying, setPaying] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [uploadErr, setUploadErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  if (!plan || !plan.owner) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-slate-500">Trip not found on this account.</p>
        <Link href={`/${locale}/account/plans`}><Button variant="outline" className="mt-4">Back to My Trips</Button></Link>
      </div>
    );
  }

  const final = plan.total != null && plan.deposit != null ? plan.total - plan.deposit : null;
  const current = stepIndex(plan.status);
  const activeReceipt = receipts.find((r) => r.status === "pending") ?? receipts.find((r) => r.status === "rejected" && !receipts.some((x) => x.version > r.version));
  const reviewDone = ["in_discussion", "awaiting_tour_deposit", "awaiting_final_balance", "bank_transfer_pending", "fully_paid"].includes(plan.status);
  const daysToStart = daysBetween(TODAY, plan.start);
  const band = refundBand(daysToStart);

  const runGateway = () => {
    setPaying(true);
    setTimeout(() => {
      if (gateway === "deposit") payDeposit(plan.ref);
      else payFinalOnline(plan.ref);
      setPaying(false);
      setGateway(null);
    }, 1400);
  };

  const doUpload = () => {
    if (!fileName) { setUploadErr("Choose the receipt file you received from your bank."); return; }
    uploadReceipt(plan.ref, fileName, "tourist");
    setUploadOpen(false); setFileName("");
    toast.success("Receipt uploaded — verification usually takes 1–2 business days.");
  };

  return (
    <div>
      <Link href={`/${locale}/account/plans`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> My Trips
      </Link>
      <div className="mt-2 flex flex-wrap items-center gap-2.5">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">{plan.ref}</h1>
        <StatusBadge status={plan.status} />
      </div>
      <p className="mt-1 text-xs text-slate-500">
        {dF(plan.start)} → {dF(plan.end)} · in {Math.max(daysToStart, 0)} days · {plan.pax.adults + plan.pax.children + plan.pax.infants} travellers
        {plan.star ? <> · <Stars n={plan.star} className="ml-1" /></> : null}
        {plan.claimedBy && <> · planner: <b className="text-ruga-navy">{plan.claimedBy}</b></>}
      </p>

      {/* ---------- progress timeline ---------- */}
      <Fade>
        <div className="mt-6 flex overflow-x-auto rounded-card border border-line bg-white p-4 shadow-soft">
          {FLOW_STEPS.map((s, i) => (
            <div key={s.key} className="flex min-w-[110px] flex-1 items-start">
              <div className="flex w-full flex-col items-center text-center">
                <span className={cn(
                  "grid h-7 w-7 place-items-center rounded-full border-2 text-[11px] font-bold",
                  i < current ? "border-palm-deep bg-palm-deep text-white" : i === current ? "border-ruga-navy bg-ruga-navy text-white" : "border-line bg-white text-slate-400"
                )}>{i < current ? <Check className="h-3.5 w-3.5" /> : i + 1}</span>
                <span className={cn("mt-1.5 px-1 text-[10.5px] font-semibold leading-tight", i <= current ? "text-ruga-navy" : "text-slate-400")}>{s.label}</span>
              </div>
              {i < FLOW_STEPS.length - 1 && <div className={cn("mt-3.5 h-0.5 min-w-3 flex-1", i < current ? "bg-palm-deep" : "bg-line")} />}
            </div>
          ))}
        </div>
      </Fade>

      {/* ---------- post-review banner ---------- */}
      {plan.status === "in_discussion" && (
        <Fade>
          <div className="mt-4 flex gap-3 rounded-card border border-indigo-200 bg-indigo-50 p-4 text-[13px] leading-relaxed text-indigo-900">
            <MessageCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <b>Your human review is complete!</b> From here your plan is fine-tuned with our team directly via{" "}
              <b>{plan.contact.methods.join(" + ")}</b>. We’ll email you the full plan + budget soon — your submitted plan and shared notes stay locked for reference.
            </div>
          </div>
        </Fade>
      )}
      {plan.status === "submitted" && (
        <Fade>
          <div className="mt-4 flex gap-3 rounded-card border border-amber-200 bg-amber-50 p-4 text-[13px] text-amber-800">
            <Users className="mt-0.5 h-5 w-5 shrink-0" />
            <div>Your trip is in the review queue. A planner usually claims plans within <b>2 business days</b>, then reaches out on {plan.contact.methods.join(" + ")}. Your plan and shared note are now locked — we kept a copy for your reviewer.</div>
          </div>
        </Fade>
      )}

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">

          {/* ---------- STAGE 1: deposit ---------- */}
          {plan.status === "awaiting_tour_deposit" && plan.deposit != null && (
            <Fade>
              <section className="overflow-hidden rounded-card border-2 border-ruga-navy bg-white shadow-soft">
                <div className="flex items-center justify-between bg-gradient-to-r from-ruga-navy to-ruga-royal px-5 py-3.5 text-white">
                  <h2 className="font-display text-[15px] font-bold">Stage 1 · Tour Booking Deposit</h2>
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <Price label="Confirmed total" v={fmt(plan.total!, plan.currency)} />
                    <Price label="Deposit due" v={fmt(plan.deposit, plan.currency)} hl />
                    <Price label="Pay by" v={dF(plan.depositDue)} sub={`${daysBetween(TODAY, plan.depositDue!)} days left`} />
                  </div>
                  <p className="mt-4 text-[12.5px] leading-relaxed text-slate-600">
                    All details are agreed and locked by <b>{plan.declaredBy}</b>. Paying the deposit starts hotel, guide and vehicle bookings.
                    Prefer a quick online payment? You can also ask us to enable bank transfer for it — <b>same amount either way, no surcharges</b>.
                  </p>
                  <Button variant="palm" size="lg" className="mt-4 w-full" onClick={() => setGateway("deposit")}>
                    <CreditCard className="h-4 w-4" /> Pay Tour Booking Deposit — {fmt(plan.deposit, plan.currency)}
                  </Button>
                  <p className="mt-2 text-center text-[11px] text-slate-400">Mock checkout — no real payment. Refund policy applies from day one.</p>
                </div>
              </section>
            </Fade>
          )}

          {/* ---------- STAGE 2: final balance ---------- */}
          {plan.status === "awaiting_final_balance" && final != null && (
            <Fade>
              <section className="overflow-hidden rounded-card border-2 border-ruga-navy bg-white shadow-soft">
                <div className="flex items-center justify-between bg-gradient-to-r from-ruga-navy to-ruga-royal px-5 py-3.5 text-white">
                  <h2 className="font-display text-[15px] font-bold">Stage 2 · Final Balance</h2>
                  <Wallet className="h-5 w-5" />
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <Price label="Total" v={fmt(plan.total!, plan.currency)} />
                    <Price label="Deposit paid" v={fmt(plan.deposit!, plan.currency)} />
                    <Price label="Balance due" v={fmt(final, plan.currency)} hl />
                  </div>
                  <p className="mt-4 text-[12.5px] text-slate-600">
                    Choose how to pay the remaining <b>{fmt(final, plan.currency)}</b>{plan.finalDue ? <> before <b>{dF(plan.finalDue)}</b></> : null}{" "}
                    — <b>identical amount whichever method you pick.</b>
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <button onClick={() => setGateway("final")} className="rounded-card border-2 border-palm-deep bg-palm-light/10 p-4 text-left transition hover:bg-palm-light/20">
                      <CreditCard className="h-5 w-5 text-palm-deep" />
                      <p className="mt-2 text-[13.5px] font-bold">Pay online</p>
                      <p className="mt-0.5 text-[11.5px] text-slate-500">Card / wallet via secure gateway — instant confirmation</p>
                    </button>
                    <button onClick={() => setBankOpen(true)} className="rounded-card border-2 border-line bg-white p-4 text-left transition hover:border-ruga-sky">
                      <Building2 className="h-5 w-5 text-ruga-navy" />
                      <p className="mt-2 text-[13.5px] font-bold">Bank transfer</p>
                      <p className="mt-0.5 text-[11.5px] text-slate-500">Transfer at your bank, then upload the receipt here</p>
                    </button>
                  </div>
                </div>
              </section>
            </Fade>
          )}

          {/* ---------- STAGE 3: bank verification ---------- */}
          {plan.status === "bank_transfer_pending" && (
            <Fade>
              <section className="rounded-card border border-cyan-200 bg-cyan-50/60 p-5">
                <h2 className="flex items-center gap-2 font-display text-[15px] font-bold text-cyan-900"><RefreshCw className="h-4 w-4" /> Bank transfer verification</h2>
                <p className="mt-1 text-[12.5px] text-cyan-800">Your receipt is with our payments team — verification usually takes 1–2 business days. You’ll get a notification either way.</p>
                {activeReceipt?.status === "rejected" && (
                  <div className="mt-3 rounded-card border border-rose-200 bg-rose-50 p-4">
                    <p className="flex items-center gap-2 text-[13px] font-bold text-rose-700"><XCircle className="h-4 w-4" /> Receipt {activeReceipt.ref} was rejected</p>
                    <p className="mt-1 text-[12.5px] text-rose-700">Reason: {activeReceipt.rejectReason}</p>
                    <Button variant="outline" className="mt-3 border-rose-300" onClick={() => setUploadOpen(true)}>
                      <FileUp className="h-4 w-4" /> Re-submit receipt
                    </Button>
                  </div>
                )}
                <div className="mt-3 space-y-2">
                  {receipts.map((r) => (
                    <div key={r.id} className="flex items-center justify-between rounded-card bg-white px-4 py-2.5 text-[12.5px] shadow-soft">
                      <span><b>{r.ref}</b> · v{r.version} · {r.fileName}</span>
                      <span className={cn("rounded-chip px-2.5 py-1 text-[11px] font-bold",
                        r.status === "pending" ? "bg-cyan-100 text-cyan-800" : r.status === "approved" ? "bg-palm-light/40 text-palm-deep" : "bg-rose-100 text-rose-700")}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </Fade>
          )}

          {/* ---------- fully paid ---------- */}
          {plan.status === "fully_paid" && (
            <Fade>
              <section className="rounded-card border border-palm-light bg-palm-light/15 p-6 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-palm-deep" />
                <h2 className="mt-2 font-display text-lg font-extrabold text-palm-deep">You’re fully booked — see you in Sri Lanka! 🇱🇰</h2>
                <p className="mx-auto mt-1 max-w-md text-[12.5px] text-slate-600">Everything is confirmed and paid. Your planner will share the final day-by-day plan closer to departure.</p>
              </section>
            </Fade>
          )}

          {/* ---------- payments for this trip ---------- */}
          <section className="rounded-card border border-line bg-white p-5 shadow-soft">
            <h2 className="font-display text-[15px] font-bold">Payments on this trip</h2>
            {payments.length === 0 && <p className="mt-2 text-xs text-slate-400">No payments yet — they appear here with a receipt reference like RCPT-5001.</p>}
            <div className="mt-3 divide-y divide-line">
              {payments.map((p: Payment) => (
                <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-[12.5px]">
                  <div>
                    <p className="font-bold">{PAYMENT_TYPE_LABEL[p.type]} <span className="font-medium text-slate-400">· {p.ref}</span></p>
                    <p className="text-[11.5px] text-slate-500">{p.method === "gateway" ? "Online payment" : "Bank transfer"} · {dF(p.date)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="tnum font-bold">{fmt(p.amount, p.currency)}</span>
                    <span className={cn("rounded-chip px-2.5 py-1 text-[11px] font-bold", PAYMENT_STATUS[p.status].cls)}>{PAYMENT_STATUS[p.status].label}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ---------- refund view ---------- */}
          <section className="rounded-card border border-line bg-white p-5 shadow-soft">
            <h2 className="flex items-center gap-2 font-display text-[15px] font-bold"><HandCoins className="h-4 w-4 text-ruga-navy" /> Refund policy — what applies if you cancel today</h2>
            <p className="mt-1 text-[12px] text-slate-500">
              Same bands for every payment, anchored to your start date ({dF(plan.start)} — <b>{daysToStart} days away</b>).
              Today that’s the <b className="text-palm-deep">{band.refund}% band</b>. Refunds combine into one payout via email from our team.
            </p>
            <div className="mt-3 overflow-hidden rounded-card border border-line">
              {payments.filter((p) => p.status === "succeeded" || p.status === "pending").length === 0 && (
                <p className="px-4 py-3 text-[12px] text-slate-400">Nothing paid yet — nothing to refund.</p>
              )}
              {payments.filter((p) => p.status === "succeeded" || p.status === "pending").map((p, i) => (
                <div key={p.id} className={cn("flex items-center justify-between px-4 py-2.5 text-[12.5px]", i % 2 === 1 && "bg-paper")}>
                  <span>{PAYMENT_TYPE_LABEL[p.type]} · {p.ref}</span>
                  <span className="tnum">{fmt(p.amount, p.currency)} × {band.refund}% = <b className="text-palm-deep">{fmt(Math.round(p.amount * band.refund) / 100, p.currency)}</b></span>
                </div>
              ))}
              {payments.some((p) => p.status === "succeeded" || p.status === "pending") && (
                <div className="flex items-center justify-between border-t border-line bg-palm-light/10 px-4 py-2.5 text-[13px] font-bold">
                  <span>One combined payout</span>
                  <span className="tnum text-palm-deep">
                    {fmt(Math.round(payments.filter((p) => p.status === "succeeded" || p.status === "pending").reduce((a, p) => a + p.amount, 0) * band.refund) / 100, plan.currency)}
                  </span>
                </div>
              )}
            </div>
            <p className="mt-2 text-[11px] text-slate-400">To request a refund, email payments@rugatours.com with your plan reference — our team sends the full breakdown by email.</p>
          </section>
        </div>

        {/* ---------- right rail ---------- */}
        <div className="space-y-4">
          <section className="rounded-card border border-line bg-white p-5 shadow-soft">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold"><Lock className="h-4 w-4 text-slate-400" /> Submitted plan (locked)</h3>
            <dl className="mt-3 space-y-2 text-[12px]">
              <Row k="Type" v={plan.type === "custom" ? "Tailor-made" : plan.type === "package_asis" ? `Package (as-is): ${plan.pkgName}` : `Customized package: ${plan.pkgName}`} />
              <Row k="Budget (per person)" v={plan.type === "package_asis" ? "—" : `${fmt(plan.budgetPPMin, plan.currency)} – ${fmt(plan.budgetPPMax, plan.currency)}`} />
              <Row k="Contact via" v={plan.contact.methods.join(" + ") + (plan.contact.phone ? ` · ${plan.contact.phone}` : "")} />
              {plan.mustVisit && <Row k="Must-visit" v={plan.mustVisit} />}
              {plan.notes && <Row k="Shared note" v={`“${plan.notes}”`} />}
            </dl>
          </section>
          <section className="rounded-card border border-line bg-white p-5 shadow-soft">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold"><History className="h-4 w-4 text-slate-400" /> Version history</h3>
            <ol className="mt-3 space-y-2">
              {plan.versions.map((v, i) => (
                <li key={i} className="flex gap-2.5 text-[12px]">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ruga-navy/5 text-[10px] font-bold text-ruga-navy">v{i + 1}</span>
                  <span className={cn(i === plan.versions.length - 1 && "font-semibold text-ink", "text-slate-600")}>{v}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      {/* ---------- mock gateway modal ---------- */}
      <Modal open={gateway !== null} onClose={() => !paying && setGateway(null)}
        title={gateway === "deposit" ? "Pay Tour Booking Deposit" : "Pay Final Balance online"}
        sub="Secure checkout (simulated — no real card is charged)">
        <form onSubmit={(e) => { e.preventDefault(); runGateway(); }} className="space-y-3.5">
          <div><Label>Card number</Label><Input defaultValue="4242 4242 4242 4242" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Expiry</Label><Input defaultValue="12 / 28" /></div>
            <div><Label>CVC</Label><Input defaultValue="123" /></div>
          </div>
          <div className="flex items-center gap-2 rounded-card bg-paper p-3 text-[11.5px] text-slate-500">
            <ShieldCheck className="h-4 w-4 shrink-0 text-palm-deep" /> Amount: <b className="tnum">{gateway === "deposit" ? fmt(plan.deposit ?? 0, plan.currency) : fmt(final ?? 0, plan.currency)}</b> — same price as bank transfer.
          </div>
          <Button variant="palm" size="lg" className="w-full" type="submit" disabled={paying}>
            {paying ? <><RefreshCw className="h-4 w-4 animate-spin" /> Processing…</> : <>Confirm payment</>}
          </Button>
        </form>
      </Modal>

      {/* ---------- bank details modal ---------- */}
      <Modal open={bankOpen} onClose={() => setBankOpen(false)} title="Pay by bank transfer" sub={`Transfer exactly ${fmt(final ?? 0, plan.currency)} — same as online.`}>
        <dl className="space-y-2 rounded-card border border-line p-4 text-[12.5px]">
          <Row k="Account name" v={BANK.label} />
          <Row k="Bank / branch" v={`${BANK.bank} · ${BANK.branch}`} />
          <Row k="Account no." v={BANK.acc} />
          <Row k="SWIFT" v={BANK.swift} />
          <Row k="Reference" v={plan.ref} />
        </dl>
        <p className="mt-2 text-[11.5px] text-slate-500">{BANK.note}</p>
        <Button variant="primary" className="mt-4 w-full" onClick={() => { chooseFinalBank(plan.ref); setBankOpen(false); setUploadOpen(true); }}>
          I’ve made the transfer — upload receipt
        </Button>
      </Modal>

      {/* ---------- receipt upload modal ---------- */}
      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload your bank receipt" sub="PDF or photo from your banking app">
        <input ref={fileRef} type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => { setFileName(e.target.files?.[0]?.name ?? ""); setUploadErr(""); }} />
        <button onClick={() => fileRef.current?.click()}
          className="grid w-full place-items-center rounded-card border-2 border-dashed border-line bg-paper p-8 text-center transition hover:border-ruga-sky">
          <FileUp className="h-8 w-8 text-slate-400" />
          <p className="mt-2 text-[13px] font-semibold">{fileName || "Click to choose file"}</p>
          <p className="text-[11.5px] text-slate-400">PDF, JPG or PNG — picked up by an admin for verification</p>
        </button>
        <FieldError msg={uploadErr} />
        <p className="mt-2 text-[11.5px] text-slate-500">Each upload gets a reference (BR-2026-####). Rejected? No worries — you can re-submit a clearer copy.</p>
        <Button variant="palm" className="mt-4 w-full" onClick={doUpload}><FileUp className="h-4 w-4" /> Submit receipt</Button>
      </Modal>
    </div>
  );
}

function Price({ label, v, sub, hl }: { label: string; v: string; sub?: string; hl?: boolean }) {
  return (
    <div className={cn("rounded-card p-3", hl ? "bg-palm-light/15 ring-1 ring-palm-light" : "bg-paper")}>
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={cn("tnum mt-0.5 font-display text-[16px] font-extrabold", hl ? "text-palm-deep" : "text-ruga-navy")}>{v}</p>
      {sub && <p className="text-[10.5px] text-slate-400">{sub}</p>}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 py-1.5 border-b border-line last:border-0">
      <dt className="shrink-0 font-semibold text-slate-500">{k}</dt>
      <dd className="min-w-0 text-right font-medium">{v}</dd>
    </div>
  );
}
