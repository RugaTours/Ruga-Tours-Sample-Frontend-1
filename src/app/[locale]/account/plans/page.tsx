"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, CalendarDays, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Fade } from "@/components/shared/fade";
import { dF, daysBetween, fmt } from "@/lib/utils";
import { useData } from "@/stores/data";

export default function PlansPage() {
  const { locale } = useParams<{ locale: string }>();
  const plans = useData((s) => s.plans.filter((p) => p.owner));

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">My Trips</h1>
          <p className="mt-0.5 text-xs text-slate-500">Every plan lives in one place — submit, pay, track, get refunds.</p>
        </div>
        <Link href={`/${locale}/tailor-make`}><Button variant="palm"><Plus className="h-4 w-4" /> New plan</Button></Link>
      </div>

      {plans.length === 0 && (
        <p className="mt-8 rounded-card border border-dashed border-line p-8 text-center text-sm text-slate-500">
          No trips yet. <Link className="font-semibold text-ruga-royal" href={`/${locale}/tailor-make`}>Plan your first trip →</Link>
        </p>
      )}

      <div className="mt-5 space-y-3">
        {plans.map((p, i) => (
          <Fade key={p.ref} delay={i * 0.05}>
            <Link href={`/${locale}/account/plans/${p.ref}`}
              className="group block rounded-card border border-line bg-white p-5 shadow-soft transition hover:border-ruga-sky hover:shadow-lift">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-display text-[15px] font-bold">{p.ref}</span>
                    <StatusBadge status={p.status} />
                    <span className="rounded-chip bg-slate-100 px-2 py-0.5 text-[10.5px] font-semibold capitalize text-slate-500">
                      {p.type.replace("_asis", " (as-is)").replace("_customized", " (customized)").replace("package", "package").replace("custom", "tailor-made")}
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5" /> {dF(p.start)} → {dF(p.end)} · {daysBetween(p.start, p.end)} nights
                    {p.pkgName && <> · {p.pkgName}</>}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {p.total && (
                    <div className="text-right">
                      <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Confirmed total</p>
                      <p className="tnum font-display text-[17px] font-extrabold text-ruga-navy">{fmt(p.total, p.currency)}</p>
                    </div>
                  )}
                  <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-ruga-navy" />
                </div>
              </div>
            </Link>
          </Fade>
        ))}
      </div>
    </div>
  );
}
