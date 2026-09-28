"use client";

import { useState } from "react";
import { ArrowRightLeft, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { CURRENCIES } from "@/lib/constants";
import { fmt, toLKR } from "@/lib/utils";
import type { Currency } from "@/lib/types";

/** One-click convert any payment amount to LKR — the client's everyday-accounts view. */
export function CurrencyConverter({ compact = false }: { compact?: boolean }) {
  const [amount, setAmount] = useState("2300");
  const [ccy, setCcy] = useState<Currency>("AUD");
  const n = parseFloat(amount) || 0;
  const lkr = toLKR(n, ccy);

  return (
    <div className={compact ? "" : "rounded-card border border-line bg-white p-5 shadow-soft"}>
      {(compact) || <h3 className="flex items-center gap-2 font-display text-sm font-bold"><ArrowRightLeft className="h-4 w-4 text-ruga-navy" /> Currency Converter</h3>}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} className="tnum w-32" />
        <Select value={ccy} onChange={(e) => setCcy(e.target.value as Currency)} className="w-24">
          {CURRENCIES.filter((c) => c !== "LKR").map((c) => <option key={c}>{c}</option>)}
        </Select>
        <span className="text-sm font-bold text-slate-400">⇒</span>
        <div className="flex items-center gap-2 rounded-card bg-palm-light/15 px-4 py-2.5">
          <Banknote className="h-4 w-4 text-palm-deep" />
          <span className="tnum font-display text-[16px] font-extrabold text-palm-deep">{fmt(lkr, "LKR")}</span>
        </div>
      </div>
      {!compact && <p className="mt-2 text-[11px] text-slate-400">Indicative rate table (mock) — used when quoting locals or reconciling bank credits.</p>}
    </div>
  );
}

export function QuickLKR({ amount, ccy }: { amount: number; ccy: Currency }) {
  if (ccy === "LKR") return null;
  return <span className="text-[11px] font-semibold text-slate-400">≈ {fmt(toLKR(amount, ccy), "LKR")}</span>;
}
