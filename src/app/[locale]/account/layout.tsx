"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { CreditCard, HandCoins, ListChecks, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, useHydrated } from "@/stores/auth";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useAuth();
  const hydrated = useHydrated();

  useEffect(() => {
    if (hydrated && role !== "tourist") router.replace(`/${locale}/auth/login`);
  }, [hydrated, role, locale, router]);

  if (!hydrated) return <div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-slate-400">Loading account…</div>;
  if (role !== "tourist") return null;

  const NAV = [
    { href: `/${locale}/account/plans`, icon: ListChecks, label: "My Trips" },
    { href: `/${locale}/account/payments`, icon: CreditCard, label: "Payments" },
    { href: `/${locale}/account/refunds`, icon: HandCoins, label: "Refunds" },
    { href: `/${locale}/account/profile`, icon: User, label: "Profile" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:h-fit lg:flex-col lg:rounded-card lg:border lg:border-line lg:bg-white lg:p-2 lg:shadow-soft">
          {NAV.map((n) => {
            const active = pathname.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-card px-3.5 py-2.5 text-[13px] font-semibold transition",
                  active ? "bg-ruga-navy text-white" : "text-slate-500 hover:bg-paper hover:text-ink"
                )}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
