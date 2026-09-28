import { Badge, Dot } from "@/components/ui/badge";
import { PLAN_STATUS } from "@/lib/constants";
import type { PlanStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }: { status: PlanStatus; className?: string }) {
  const s = PLAN_STATUS[status];
  return (
    <Badge className={cn(s.cls, className)}>
      <Dot /> {s.label}
    </Badge>
  );
}
