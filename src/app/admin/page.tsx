"use client";

import Link from "next/link";
import CountUp from "react-countup";
import { ArrowRight, BadgeDollarSign, FileWarning, LayoutList, PauseCircle, RotateCcw, Upload } from "lucide-react";
import { toast } from "sonner";
import { CurrencyConverter, QuickLKR } from "@/components/admin/currency-converter";
import { Fade } from "@/components/shared/fade";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useData } from "@/stores/data";
import { dF, fmt, toUSD } from "@/lib/utils";

export default function AdminDashboard() {
  const plans = useData((s) => s.plans);
  const payments = useData((s) => s.payments);
  const receipts = useData((s) => s.receipts);
  const reset = useData((s) => s.reset);

  const queue = plans.filter((p) => p.status === "submitted").length;
  const active = plans.filter((p) => ["under_review", "in_discussion"].includes(p.status)).length;
  const onHold = plans.filter((p) => p.status === "on_hold").length;
  const pendingReceipts = receipts.filter((r) => r.status === "pending").length;
  const revenueUSD = payments.filter((p) => p.status === "succeeded").reduce((a, p) => a + toUSD(p.amount, p.currency), 0);
  const pendingUSD = payments.filter((p) => p.status === "pending").reduce((a, p) => a + toUSD(p.amount, p.currency), 0);

  return (
    <div>
      <Fade>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight">Good day! Here’s the island busy-board 🌴</h1>
            <p className="mt-0.5 text-xs text-slate-500">Everything below is live Zustand state — act as Tourist in another tab and watch this change.</p>
          </div>
          <Button variant="outline" onClick={() => { reset(); toast.success("Demo data reset to seeds."); }}>
            <RotateCcw className="h-4 w-4" /> Reset demo data
          </Button>
        </div>
      </Fade>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: LayoutList, label: "Waiting in queue", value: queue, hint: "claim one → start review", href: "/admin/plans" },
          { icon: RotateCcw, label: "In review / discussion", value: active, hint: "claimed by your team", href: "/admin/plans" },
          { icon: FileWarning, label: "Receipts to verify", value: pendingReceipts, hint: "bank transfers pending", href: "/admin/payments" },
          { icon: PauseCircle, label: "On hold", value: onHold, hint: "no response from tourists", href: "/admin/plans" },
        ].map((c, i) => (
          <Fade key={c.label} delay={i * 0.05}>
            <Link href={c.href} className="block rounded-card border border-line bg-white p-5 shadow-soft transition hover:shadow-lift">
              <div className="flex items-center justify-between">
                <c.icon className="h-5 w-5 text-ruga-navy" />
                <ArrowRight className="h-4 w-4 text-slate-300" />
              </div>
              <p className="tnum mt-3 font-display text-3xl font-extrabold"><CountUp end={c.value} duration={0.8} /></p>
              <p className="mt-0.5 text-[12.5px] font-bold">{c.label}</p>
              <p className="text-[11px] text-slate-400">{c.hint}</p>
            </Link>
          </Fade>
        ))}
      </div>

      <div className="mt-5 grid items-start gap-4 lg:grid-cols-[1fr_380px]">
        <Fade delay={0.1}>
          <section className="rounded-card border border-line bg-white p-5 shadow-soft">
            <h2 className="flex items-center gap-2 font-display text-sm font-bold"><BadgeDollarSign className="h-4 w-4 text-ruga-navy" /> Money in (confirmed) — Sep 2026</h2>
            <p className="tnum mt-2 font-display text-3xl font-extrabold text-ruga-navy">≈ ${revenueUSD.toFixed(2)} <span className="text-sm text-slate-400">USD equiv.</span></p>
            <p className="mt-1 text-xs text-slate-500">
              {fmt(Math.round(pendingUSD * 100) / 100, "USD")} pending bank verification · most recent:
            </p>
            <div className="mt-3 divide-y divide-line">
              {payments.slice(-4).reverse().map((p) => (
                <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-[12.5px]">
                  <span><b>{p.ref}</b> · {p.planRef}</span>
                  <span className="tnum font-bold">{fmt(p.amount, p.currency)} <QuickLKR amount={p.amount} ccy={p.currency} /></span>
                </div>
              ))}
            </div>
          </section>
        </Fade>
        <Fade delay={0.15}>
          <section>
            <CurrencyConverter />
            <div className="mt-4 rounded-card border border-amber-200 bg-amber-50 p-4 text-[12px] leading-relaxed text-amber-800">
              <Badge className="mb-1.5 bg-amber-200/60 text-amber-900"><Upload className="h-3 w-3" /> Policy reminder</Badge>
              Only Admins &amp; Super Admins approve payments. Bank receipts are <b>approved</b> or <b>rejected with a reason</b> — tourists can always re-submit after a rejection. {dF("2026-09-23")}.
            </div>
          </section>
        </Fade>
      </div>
    </div>
  );
}
