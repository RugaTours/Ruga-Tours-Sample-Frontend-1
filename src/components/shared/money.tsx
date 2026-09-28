import { cn, fmt } from "@/lib/utils";
import type { Currency } from "@/lib/types";

export function Money({ amount, ccy, className }: { amount: number; ccy: Currency; className?: string }) {
  return <span className={cn("tnum font-bold", className)}>{fmt(amount, ccy)}</span>;
}
