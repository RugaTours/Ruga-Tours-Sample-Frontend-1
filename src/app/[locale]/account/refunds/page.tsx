"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { HandCoins, Mail } from "lucide-react";
import { Fade } from "@/components/shared/fade";
import { REFUND_BANDS } from "@/lib/constants";
import { cn, dF, daysBetween, fmt, TODAY } from "@/lib/utils";
import { useData } from "@/stores/data";

export default function RefundsPage() {
  const { locale } = useParams<{ locale: string }>();
  const plans = useData((s) => s.plans.filter((p) => p.owner));
  const payments = useData((s) => s.payments);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight">Refunds & Cancellations</h1>
      <p className="mt-0.5 text-xs text-slate-500">One simple policy for every payment — Review Fees, Tour Booking Deposits and Final Balances.</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {REFUND_BANDS.map((b, i) => (
          <Fade key={b.refund} delay={i * 0.05}>
            <div className={cn("rounded-card border p-5 text-center", i === 0 ? "border-palm-light bg-palm-light/10" : "border-line bg-white")}>
              <p className="font-display text-3xl font-extrabold text-ruga-navy">{b.refund}%</p>
              <p className="mt-1 text-[12px] font-bold">{b.label}</p>
              <p className="mt-0.5 text-[11.5px] text-slate-500">{b.deduct === 0 ? "no deduction" : `${b.deduct}% handling deduction`}</p>
            </div>
          </Fade>
        ))}
      </div>

      <div className="mt-6 rounded-card border border-line bg-white p-5 shadow-soft">
        <h2 className="flex items-center gap-2 font-display text-[15px] font-bold"><HandCoins className="h-4 w-4 text-ruga-navy" /> Live estimate if cancelled today ({dF(TODAY)})</h2>
        <div className="mt-3 space-y-3">
          {plans.map((p) => {
            const paid = payments.filter((pay) => pay.planRef === p.ref && (pay.status === "succeeded" || pay.status === "pending"));
            if (paid.length === 0) return null;
            const days = daysBetween(TODAY, p.start);
            const band = days >= 15 ? REFUND_BANDS[0] : days >= 8 ? REFUND_BANDS[1] : REFUND_BANDS[2];
            const total = paid.reduce((a, x) => a + x.amount, 0);
            const payout = Math.round(total * band.refund) / 100;
            return (
              <div key={p.ref} className="flex flex-wrap items-center justify-between gap-2 rounded-card bg-paper px-4 py-3">
                <div>
                  <Link href={`/${locale}/account/plans/${p.ref}`} className="text-[13px] font-bold text-ruga-royal hover:underline">{p.ref}</Link>
                  <p className="text-[11.5px] text-slate-500">Starts {dF(p.start)} — {days} days away → <b>{band.refund}% band</b></p>
                </div>
                <div className="text-right text-[12.5px]">
                  <p className="tnum text-slate-500">{fmt(total, p.currency)} paid</p>
                  <p className="tnum font-display font-extrabold text-palm-deep">≈ {fmt(payout, p.currency)} refunded (one payout)</p>
                </div>
              </div>
            );
          })}
          {!plans.some((p) => payments.some((pay) => pay.planRef === p.ref && (pay.status === "succeeded" || pay.status === "pending"))) && (
            <p className="text-sm text-slate-400">No refundable payments on your trips right now.</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-3 rounded-card border border-ruga-sky/40 bg-ruga-sky/5 p-4 text-[12.5px] leading-relaxed text-slate-600">
        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ruga-navy" />
        <div>
          To cancel and get a refund, email <b>payments@rugatours.com</b> with your plan reference. A human replies with your
          <b> full refund breakdown</b> before processing the combined payout. Paid trips are never auto-deleted — you always get reminders first.
        </div>
      </div>
    </div>
  );
}
