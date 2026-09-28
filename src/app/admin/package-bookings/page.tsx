"use client";

import Link from "next/link";
import { ArrowRight, PackageCheck } from "lucide-react";
import { Fade } from "@/components/shared/fade";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn, dF, fmt } from "@/lib/utils";
import { useData } from "@/stores/data";

export default function PackageBookingsPage() {
  const plans = useData((s) => s.plans.filter((p) => p.type === "package_asis" || p.type === "package_customized"));

  return (
    <div>
      <Fade>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Package Bookings</h1>
        <p className="mt-0.5 text-xs text-slate-500">
          As-is bookings skip the Review Fee — contact the tourist, agree details, then <b>declare the Tour Booking Deposit</b> like any other plan. Customized packages pay the Review Fee and flow through the normal queue.
        </p>
      </Fade>
      <div className="mt-5 space-y-3">
        {plans.map((p, i) => (
          <Fade key={p.ref} delay={i * 0.04}>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-white p-5 shadow-soft">
              <div className="flex items-center gap-4">
                <span className={cn("grid h-11 w-11 place-items-center rounded-card", p.type === "package_asis" ? "bg-sky-100 text-sky-700" : "bg-violet-100 text-violet-700")}>
                  <PackageCheck className="h-5 w-5" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-[14px] font-bold">{p.ref}</span>
                    <StatusBadge status={p.status} />
                    <span className={cn("rounded-chip px-2 py-0.5 text-[10px] font-bold", p.type === "package_asis" ? "bg-sky-100 text-sky-700" : "bg-violet-100 text-violet-700")}>
                      {p.type === "package_asis" ? "as-is · no review fee" : "customized · review fee"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-slate-500">
                    <b className="text-ink">{p.pkgName}</b> · {p.tourist} ({p.country}) · {p.pax.adults}+{p.pax.children}+{p.pax.infants} pax · arrives {dF(p.start)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {p.total && <span className="tnum font-display font-extrabold text-ruga-navy">{fmt(p.total, p.currency)}</span>}
                <Link href={`/admin/plans/${p.ref}`}
                  className="inline-flex items-center gap-1 rounded-chip bg-ruga-navy px-3.5 py-2 text-[11.5px] font-bold text-white hover:bg-ruga-royal">
                  Open <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </Fade>
        ))}
        {plans.length === 0 && <p className="rounded-card border border-dashed border-line p-8 text-center text-sm text-slate-400">No package bookings yet.</p>}
      </div>
    </div>
  );
}
