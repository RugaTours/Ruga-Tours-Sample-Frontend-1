"use client";

import { CurrencyConverter } from "@/components/admin/currency-converter";
import { Fade } from "@/components/shared/fade";

export default function ConverterPage() {
  return (
    <div className="max-w-2xl">
      <Fade>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Currency Converter</h1>
        <p className="mt-0.5 text-xs text-slate-500">One-click foreign-amount → LKR view for quotes and bank-credit reconciliation.</p>
        <CurrencyConverter />
      </Fade>
    </div>
  );
}
