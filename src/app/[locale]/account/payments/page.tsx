"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Fade } from "@/components/shared/fade";
import { PAYMENT_STATUS, PAYMENT_TYPE_LABEL } from "@/lib/constants";
import { cn, dF, fmt } from "@/lib/utils";
import { useData } from "@/stores/data";

export default function PaymentsPage() {
  const { locale } = useParams<{ locale: string }>();
  const plans = useData((s) => s.plans.filter((p) => p.owner));
  const refs = plans.map((p) => p.ref);
  const payments = useData((s) => s.payments.filter((p) => refs.includes(p.planRef)));
  const receipts = useData((s) => s.receipts.filter((r) => refs.includes(r.planRef)));

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight">Payments & Receipts</h1>
      <p className="mt-0.5 text-xs text-slate-500">Every payment gets a reference (RCPT-####); every uploaded bank receipt gets one too (BR-2026-####).</p>

      <div className="mt-5 overflow-hidden rounded-card border border-line bg-white shadow-soft">
        {payments.length === 0 && <p className="p-6 text-center text-sm text-slate-400">No payments yet.</p>}
        {payments.map((p, i) => (
          <Fade key={p.id} delay={i * 0.03}>
            <div className={cn("flex flex-wrap items-center justify-between gap-2 px-5 py-3.5", i % 2 === 1 && "bg-paper")}>
              <div>
                <p className="text-[13px] font-bold">{PAYMENT_TYPE_LABEL[p.type]} <span className="font-medium text-slate-400">· {p.ref}</span></p>
                <p className="mt-0.5 text-[11.5px] text-slate-500">
                  <Link href={`/${locale}/account/plans/${p.planRef}`} className="font-semibold text-ruga-royal hover:underline">{p.planRef}</Link> · {p.method === "gateway" ? "Online payment" : "Bank transfer"} · {dF(p.date)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="tnum text-[14px] font-bold">{fmt(p.amount, p.currency)}</span>
                <span className={cn("rounded-chip px-2.5 py-1 text-[11px] font-bold", PAYMENT_STATUS[p.status].cls)}>{PAYMENT_STATUS[p.status].label}</span>
              </div>
            </div>
          </Fade>
        ))}
      </div>

      <h2 className="mt-8 font-display text-base font-bold">Bank receipt uploads</h2>
      <div className="mt-3 overflow-hidden rounded-card border border-line bg-white shadow-soft">
        {receipts.length === 0 && <p className="p-6 text-center text-sm text-slate-400">No receipts uploaded yet — uploads appear when you pay a Final Balance by bank transfer.</p>}
        {receipts.map((r, i) => (
          <div key={r.id} className={cn("flex flex-wrap items-center justify-between gap-2 px-5 py-3.5", i % 2 === 1 && "bg-paper")}>
            <div>
              <p className="text-[13px] font-bold">{r.ref} <span className="font-medium text-slate-400">· v{r.version} · {r.fileName}</span></p>
              <p className="mt-0.5 text-[11.5px] text-slate-500">For payment {r.paymentRef} · uploaded {dF(r.createdAt)}{r.uploadedBy !== "tourist" ? ` · uploaded on your behalf by ${r.uploadedBy.replace("admin:", "")}` : ""}</p>
              {r.status === "rejected" && <p className="mt-0.5 text-[11.5px] font-semibold text-rose-600">Rejected: {r.rejectReason}</p>}
            </div>
            <span className={cn("rounded-chip px-2.5 py-1 text-[11px] font-bold",
              r.status === "pending" ? "bg-cyan-100 text-cyan-800" : r.status === "approved" ? "bg-palm-light/40 text-palm-deep" : "bg-rose-100 text-rose-700")}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
