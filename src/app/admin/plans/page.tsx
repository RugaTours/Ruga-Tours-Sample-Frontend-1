"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Star } from "lucide-react";
import { Fade } from "@/components/shared/fade";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { cn, dF, fmt } from "@/lib/utils";
import { useData } from "@/stores/data";
import { useAuth } from "@/stores/auth";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "submitted", label: "Queue (unclaimed)" },
  { key: "under_review", label: "Under review" },
  { key: "in_discussion", label: "In discussion" },
  { key: "awaiting_tour_deposit", label: "Deposit due" },
  { key: "awaiting_final_balance", label: "Final due" },
  { key: "bank_transfer_pending", label: "Bank pending" },
  { key: "fully_paid", label: "Fully paid" },
  { key: "on_hold", label: "On hold" },
] as const;

export default function PlanQueuePage() {
  const [filter, setFilter] = useState<string>("all");
  const { currentStaff } = useAuth();
  const plans = useData((s) => s.plans);
  const shown = filter === "all" ? plans : plans.filter((p) => p.status === filter);

  return (
    <div>
      <Fade>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Plan Queue</h1>
        <p className="mt-0.5 text-xs text-slate-500">
          Working as <b>{currentStaff}</b> — claim a plan to own its review, hold it if the tourist goes quiet, reassign between teammates.
        </p>
      </Fade>

      <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={cn("shrink-0 rounded-chip px-3.5 py-2 text-[12px] font-semibold transition",
              filter === f.key ? "bg-ruga-navy text-white" : "bg-white text-slate-500 ring-1 ring-line hover:text-ink")}>
            {f.label} <span className="tnum opacity-70">{f.key === "all" ? plans.length : plans.filter((p) => p.status === f.key).length}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-card border border-line bg-white shadow-soft">
        <table className="w-full min-w-[900px] text-left text-[12.5px]">
          <thead>
            <tr className="bg-paper text-[11px] font-bold uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3">Ref</th>
              <th className="px-4 py-3">Tourist</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Stay</th>
              <th className="px-4 py-3">Budget (pp)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Planner</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {shown.map((p) => (
              <tr key={p.ref} className="transition hover:bg-ruga-sky/5">
                <td className="px-4 py-3 font-bold">
                  <Link href={`/admin/plans/${p.ref}`} className="text-ruga-royal hover:underline">{p.ref}</Link>
                </td>
                <td className="px-4 py-3">
                  {p.tourist}
                  {p.owner && <Badge className="ml-1.5 bg-ruga-sky/15 px-1.5 py-0 text-[9px] text-ruga-navy">demo you</Badge>}
                  <span className="block text-[11px] text-slate-400">{p.country}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge className={cn("capitalize",
                    p.type === "custom" ? "bg-indigo-100 text-indigo-700" : p.type === "package_asis" ? "bg-sky-100 text-sky-700" : "bg-violet-100 text-violet-700")}>
                    {p.type.replace("_", " ")}
                  </Badge>
                  {p.pkgName && <span className="mt-0.5 block max-w-[160px] truncate text-[11px] text-slate-400">{p.pkgName}</span>}
                </td>
                <td className="tnum px-4 py-3">{dF(p.start)}<span className="block text-[11px] text-slate-400">→ {dF(p.end)}</span></td>
                <td className="px-4 py-3">
                  {p.star ? <span className="inline-flex gap-0.5">{Array.from({ length: p.star }).map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-star text-amber-star" />)}</span> : "—"}
                </td>
                <td className="tnum px-4 py-3">
                  {p.total ? <b>{fmt(p.total, p.currency)}</b> : <>{fmt(p.budgetPPMin, p.currency)} – {fmt(p.budgetPPMax, p.currency)}</>}
                </td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3">{p.claimedBy ?? <span className="text-slate-300">Unclaimed</span>}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/plans/${p.ref}`}
                    className="inline-flex items-center gap-1 rounded-chip bg-ruga-navy px-3 py-1.5 text-[11.5px] font-bold text-white hover:bg-ruga-royal">
                    Open <ArrowRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <p className="p-8 text-center text-sm text-slate-400">Nothing here — all caught up.</p>}
      </div>
    </div>
  );
}
