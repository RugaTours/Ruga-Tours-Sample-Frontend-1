"use client";

import { useAuth, useHydrated } from "@/stores/auth";
import { cn } from "@/lib/utils";
import { ShieldCheck, User, UserRound } from "lucide-react";
import { toast } from "sonner";

/** Mocked auth — instantly toggles Guest / Tourist / Super Admin (prototype only). */
export function RoleSwitcher({ compact = false }: { compact?: boolean }) {
  const { role, setRole } = useAuth();
  const hydrated = useHydrated();
  const items = [
    { key: "guest" as const, label: "Guest", icon: <User className="h-3.5 w-3.5" /> },
    { key: "tourist" as const, label: "Tourist", icon: <UserRound className="h-3.5 w-3.5" /> },
    { key: "admin" as const, label: "Super Admin", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  ];
  if (!hydrated) return <div className="h-10 w-[300px] animate-pulse rounded-chip bg-slate-100" />;
  if (compact) {
    return (
      <select value={role} onChange={(e) => { setRole(e.target.value as never); toast.info("Role switched (mock)."); }}
        className="h-9 rounded-chip border border-line bg-white px-2.5 text-xs font-semibold" title="Mock auth switcher">
        <option value="guest">Guest</option>
        <option value="tourist">Tourist</option>
        <option value="admin">Super Admin</option>
      </select>
    );
  }
  return (
    <div className="flex items-center gap-1 rounded-chip bg-slate-100 p-1" title="Mock auth switcher (prototype)">
      {items.map((it) => (
        <button
          key={it.key}
          onClick={() => {
            setRole(it.key);
            toast.info(
              it.key === "admin"
                ? "Super Admin mode — everything is editable, nothing is real."
                : it.key === "tourist"
                ? "Signed in as Emma Johnson (mock tourist)."
                : "Browsing as a guest."
            );
          }}
          className={cn(
            "flex items-center gap-1.5 rounded-chip px-3 py-2 text-xs font-semibold transition",
            role === it.key ? "bg-white text-ruga-navy shadow-soft" : "text-slate-500 hover:text-ink"
          )}
        >
          {it.icon} {it.label}
        </button>
      ))}
    </div>
  );
}
