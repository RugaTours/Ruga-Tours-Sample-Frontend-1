"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Bell, BadgeDollarSign, Images, LayoutDashboard, ListChecks, Map, Newspaper, ShieldCheck, TriangleAlert, Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form";
import { RoleSwitcher } from "@/components/shared/role-switcher";
import { STAFF } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuth, useHydrated } from "@/stores/auth";
import { useData } from "@/stores/data";

const NAV = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/plans", icon: ListChecks, label: "Plan Queue" },
  { href: "/admin/package-bookings", icon: Map, label: "Package Bookings" },
  { href: "/admin/payments", icon: BadgeDollarSign, label: "Payments & Receipts" },
  { href: "/admin/gallery", icon: Images, label: "Gallery" },
  { href: "/admin/blog", icon: Newspaper, label: "Blog" },
  { href: "/admin/tourists", icon: Users, label: "Tourists" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const { role, currentStaff, setStaff, setRole } = useAuth();
  const unread = useData((s) => s.notifications.filter((n) => n.forRole === "staff" && !n.read).length);
  const notifs = useData((s) => s.notifications.filter((n) => n.forRole === "staff")).slice(0, 6);
  const markRead = useData((s) => s.markRead);

  useEffect(() => {
    if (hydrated && role !== "admin") return; // prompt below handles it
  }, [hydrated, role]);

  if (!hydrated) return <div className="p-16 text-center text-sm text-slate-400">Loading admin…</div>;

  if (role !== "admin") {
    return (
      <div className="grid min-h-[70vh] place-items-center bg-paper p-6">
        <div className="max-w-md rounded-card-lg border border-line bg-white p-8 text-center shadow-soft">
          <ShieldCheck className="mx-auto h-10 w-10 text-ruga-navy" />
          <h1 className="mt-3 font-display text-xl font-extrabold">Staff area — sign in required</h1>
          <p className="mt-1 text-[12.5px] text-slate-500">Prototype shortcut: switch your role to Super Admin to explore the back-office. English-only by design.</p>
          <Button variant="primary" className="mt-5 w-full" onClick={() => setRole("admin")}>
            Continue as Super Admin (demo)
          </Button>
          <Link href="/en" className="mt-3 inline-block text-xs font-semibold text-ruga-royal hover:underline">← Back to website</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-ruga-navy font-display text-sm font-extrabold text-white">R</span>
              <span className="font-display text-[15px] font-extrabold tracking-tight">Ruga Tours <span className="text-slate-400">· Admin</span></span>
            </Link>
            <Badge className="bg-palm-light/20 text-palm-deep">English-only</Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="group relative">
              <button className="relative rounded-full p-2 hover:bg-paper" onClick={() => markRead("staff")}>
                <Bell className="h-4.5 w-4.5 h-5 w-5 text-slate-500" />
                {unread > 0 && <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[9px] font-bold text-white">{unread}</span>}
              </button>
              <div className="invisible absolute right-0 top-full w-80 rounded-card border border-line bg-white p-2 opacity-0 shadow-lift transition group-hover:visible group-hover:opacity-100">
                <p className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">Staff notifications</p>
                {notifs.length === 0 && <p className="p-3 text-xs text-slate-400">All caught up.</p>}
                {notifs.map((n) => (
                  <div key={n.id} className={cn("rounded-[10px] px-2.5 py-2 text-[12px]", !n.read && "bg-ruga-sky/10")}>
                    <p className="font-bold">{n.title}</p>
                    <p className="text-slate-500">{n.body}</p>
                    <p className="mt-0.5 text-[10px] text-slate-400">{n.t}</p>
                  </div>
                ))}
              </div>
            </div>
            <Select value={currentStaff} onChange={(e) => setStaff(e.target.value)} className="w-44 text-[12.5px]">
              {STAFF.map((s) => <option key={s.id} value={s.name}>{s.name} ({s.role})</option>)}
            </Select>
            <RoleSwitcher compact />
          </div>
        </div>
        <nav className="border-t border-line">
          <div className="mx-auto flex max-w-[1400px] gap-1 overflow-x-auto px-4">
            {NAV.map((n) => {
              const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
              return (
                <Link key={n.href} href={n.href}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-[12.5px] font-semibold transition",
                    active ? "border-ruga-navy text-ruga-navy" : "border-transparent text-slate-500 hover:text-ink"
                  )}>
                  <n.icon className="h-3.5 w-3.5" /> {n.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-[1400px] px-4 py-6">
        {children}
        <p className="mt-10 flex items-center gap-2 text-center text-[11px] text-slate-400">
          <TriangleAlert className="h-3.5 w-3.5" /> Prototype: all data is mock/Zustand — resets with “Reset demo data” on the dashboard.
        </p>
      </main>
    </div>
  );
}
