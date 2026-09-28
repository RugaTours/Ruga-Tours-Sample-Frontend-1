"use client";

import { useState } from "react";
import Link from "next/link";
import { BadgeCheck, Check, FileUp, FileWarning, Lock, X } from "lucide-react";
import { toast } from "sonner";
import { QuickLKR } from "@/components/admin/currency-converter";
import { Fade } from "@/components/shared/fade";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { PAYMENT_STATUS, PAYMENT_TYPE_LABEL } from "@/lib/constants";
import { cn, dF, fmt } from "@/lib/utils";
import { useAuth } from "@/stores/auth";
import { useData } from "@/stores/data";
import type { BankReceipt } from "@/lib/types";

// Super Admin carries payments.approve; plain "Front Desk" staff do not (per-permission model, demoed here).
const CAN_APPROVE: Record<string, boolean> = {
  "Nimal Perera": true, "Sithum Fernando": false, "Amaya Silva": true,
};

export default function PaymentsPage() {
  const { currentStaff } = useAuth();
  const canApprove = CAN_APPROVE[currentStaff] ?? true;
  const payments = useData((s) => s.payments);
  const receipts = useData((s) => s.receipts);
  const plans = useData((s) => s.plans);
  const { approveReceipt, rejectReceipt, uploadReceipt, notify } = useData();

  const [reject, setReject] = useState<BankReceipt | null>(null);
  const [reason, setReason] = useState("");
  const [rErr, setRErr] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadRef, setUploadRef] = useState("");
  const [fileName, setFileName] = useState("");

  const queue = receipts.filter((r) => r.status === "pending");
  const bankPlans = plans.filter((p) => p.status === "awaiting_final_balance" && (p.total ?? 0) > 0 && (p.deposit ?? 0) > 0);

  const doApprove = (r: BankReceipt) => {
    if (!canApprove) { toast.error(`Your account lacks the payments.approve permission — ask a Super Admin. (try “${Object.keys(CAN_APPROVE)[0]}” or “Amaya Silva”)`); return; }
    approveReceipt(r.id, currentStaff);
    toast.success(`${r.ref} approved — ${r.paymentRef} marked paid, plan fully booked.`);
  };

  const doReject = () => {
    if (!canApprove || !reject) { toast.error("Permission missing."); return; }
    if (reason.trim().length < 8) { setRErr("A reason is mandatory — the tourist sees this explanation."); return; }
    rejectReceipt(reject.id, reason.trim(), currentStaff);
    setReject(null); setReason("");
    toast.warning("Receipt rejected — tourist notified with your reason and can re-submit.");
  };

  const doUploadOnBehalf = () => {
    if (!uploadRef || !fileName) { toast.error("Pick the plan and choose a file."); return; }
    uploadReceipt(uploadRef, fileName, `admin:${currentStaff}`);
    setUploadOpen(false); setUploadRef(""); setFileName("");
    toast.success("Receipt uploaded on the client’s behalf — now verify it like any other.");
  };

  return (
    <div>
      <Fade>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight">Payments & Receipts</h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Signed in as <b>{currentStaff}</b>{" "}
              {canApprove
                ? <span className="rounded-chip bg-palm-light/25 px-2 py-0.5 font-bold text-palm-deep">payments.approve ✓</span>
                : <span className="rounded-chip bg-rose-100 px-2 py-0.5 font-bold text-rose-700">payments.approve ✗ (demo)</span>}
            </p>
          </div>
          <Button variant="outline" onClick={() => setUploadOpen(true)}><FileUp className="h-4 w-4" /> Upload receipt on client’s behalf</Button>
        </div>
      </Fade>

      {/* ---------- approval queue ---------- */}
      <h2 className="mt-6 flex items-center gap-2 font-display text-base font-bold">
        <FileWarning className="h-4 w-4 text-cyan-800" /> Receipts awaiting verification <span className="tnum text-slate-400">({queue.length})</span>
      </h2>
      <div className="mt-3 space-y-3">
        {queue.map((r) => {
          const pay = payments.find((p) => p.ref === r.paymentRef);
          const plan = plans.find((p) => p.ref === r.planRef);
          return (
            <Fade key={r.id}>
              <div className="rounded-card border border-cyan-200 bg-white p-5 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-[15px] font-bold">{r.ref}</span>
                      <span className="rounded-chip bg-cyan-100 px-2.5 py-1 text-[11px] font-bold text-cyan-800">v{r.version} · pending</span>
                    </div>
                    <p className="mt-1 text-[12.5px] text-slate-600">
                      {plan?.tourist} · <Link href={`/admin/plans/${r.planRef}`} className="font-semibold text-ruga-royal hover:underline">{r.planRef}</Link> · file “{r.fileName}”
                      {r.uploadedBy !== "tourist" && <> · uploaded by {r.uploadedBy.replace("admin:", "")} on client’s behalf</>}
                    </p>
                    {pay && (
                      <p className="tnum mt-1 text-[13px]"><b>Expected: {fmt(pay.amount, pay.currency)}</b> <QuickLKR amount={pay.amount} ccy={pay.currency} /> · {PAYMENT_TYPE_LABEL[pay.type]} ({pay.ref})</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-chip bg-paper px-3 py-2 text-[11.5px] font-semibold text-slate-500">🧾 {r.fileName} <span className="text-[10px] text-slate-400">(preview unavailable in mock)</span></span>
                    <Button variant="palm" onClick={() => doApprove(r)} title={canApprove ? "" : "Permission missing"}><Check className="h-4 w-4" /> Approve</Button>
                    <Button variant="danger" onClick={() => setReject(r)}><X className="h-4 w-4" /> Reject with reason</Button>
                  </div>
                </div>
              </div>
            </Fade>
          );
        })}
        {queue.length === 0 && (
          <p className="rounded-card border border-dashed border-line p-8 text-center text-sm text-slate-400">
            Queue empty — tip: as Tourist, open <b>RGT-2026-1003</b> → Final Balance → Bank transfer → upload a receipt, then come back (or reset demo data).
          </p>
        )}
      </div>

      {/* ---------- payment history ---------- */}
      <h2 className="mt-8 flex items-center gap-2 font-display text-base font-bold"><BadgeCheck className="h-4 w-4 text-palm-deep" /> All payments</h2>
      <div className="mt-3 overflow-hidden rounded-card border border-line bg-white shadow-soft">
        <table className="w-full min-w-[760px] text-left text-[12.5px]">
          <thead>
            <tr className="bg-paper text-[11px] font-bold uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3">Receipt ref</th><th className="px-4 py-3">Plan</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Method</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-ruga-sky/5">
                <td className="px-4 py-2.5 font-bold">{p.ref}</td>
                <td className="px-4 py-2.5"><Link href={`/admin/plans/${p.planRef}`} className="text-ruga-royal hover:underline">{p.planRef}</Link></td>
                <td className="px-4 py-2.5">{PAYMENT_TYPE_LABEL[p.type]}</td>
                <td className="px-4 py-2.5 text-slate-500">{p.method === "gateway" ? "Online" : "Bank transfer"}</td>
                <td className="tnum px-4 py-2.5 font-bold">{fmt(p.amount, p.currency)} <QuickLKR amount={p.amount} ccy={p.currency} /></td>
                <td className="tnum px-4 py-2.5">{dF(p.date)}</td>
                <td className="px-4 py-2.5"><span className={cn("rounded-chip px-2.5 py-1 text-[11px] font-bold", PAYMENT_STATUS[p.status].cls)}>{PAYMENT_STATUS[p.status].label}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- reject modal ---------- */}
      <Modal open={reject !== null} onClose={() => setReject(null)} title={`Reject ${reject?.ref}`} sub="The tourist sees this exact reason — be specific and kind.">
        <Label>Rejection reason (mandatory)</Label>
        <Textarea rows={3} value={reason} onChange={(e) => { setReason(e.target.value); setRErr(""); }}
          placeholder="e.g. Amount on the slip doesn’t match the expected A$2,300 — looks like a partial transfer." />
        <FieldError msg={rErr} />
        <p className="mt-1 text-[11.5px] text-slate-500">After rejection the tourist can re-submit a corrected copy (new version). The pending payment stays open.</p>
        <Button variant="danger" className="mt-4 w-full" onClick={doReject}><Lock className="h-4 w-4" /> Reject & notify tourist</Button>
      </Modal>

      {/* ---------- upload on behalf ---------- */}
      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload receipt on client’s behalf" sub="For receipts a client emails/WhatsApps instead of uploading.">
        <Label>Plan (must be awaiting Final Balance)</Label>
        <Select value={uploadRef} onChange={(e) => setUploadRef(e.target.value)}>
          <option value="">Choose…</option>
          {bankPlans.map((p) => <option key={p.ref} value={p.ref}>{p.ref} — {p.tourist} ({fmt((p.total ?? 0) - (p.deposit ?? 0), p.currency)} due)</option>)}
        </Select>
        <div className="mt-3">
          <Label>Receipt file</Label>
          <Input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="e.g. emma-final-balance.pdf (type a filename in this mock)" />
        </div>
        <Button variant="primary" className="mt-4 w-full" onClick={doUploadOnBehalf}><FileUp className="h-4 w-4" /> Upload & queue for verification</Button>
      </Modal>
    </div>
  );
}
