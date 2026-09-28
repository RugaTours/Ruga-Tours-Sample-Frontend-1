import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-chip px-2.5 py-1 text-[11px] font-semibold",
        className
      )}
      {...props}
    />
  );
}
export function Dot() {
  return <span className="h-1.5 w-1.5 rounded-full bg-current" />;
}
