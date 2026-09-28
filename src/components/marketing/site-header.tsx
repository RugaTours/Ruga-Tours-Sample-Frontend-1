"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { Bell, Menu, X } from "lucide-react";
import { RoleSwitcher } from "@/components/shared/role-switcher";
import { Button } from "@/components/ui/button";
import { getDict, LOCALES } from "@/i18n/dict";
import { cn } from "@/lib/utils";
import { useAuth, useHydrated } from "@/stores/auth";
import { useData } from "@/stores/data";

const NAV = [
  ["home", ""], ["about", "/about"], ["destinations", "/destinations"], ["experiences", "/experiences"],
  ["dayTours", "/day-tours"], ["packages", "/packages"], ["tailorMake", "/tailor-make"],
  ["gallery", "/gallery"], ["blog", "/blog"], ["reviews", "/reviews"], ["contact", "/contact"],
] as const;

export function SiteHeader() {
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();
  const dict = getDict(locale);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const { role } = useAuth();
  const hydrated = useHydrated();
  const { notifications, markRead } = useData();
  const mine = hydrated ? notifications.filter((n) => n.forRole === "tourist") : [];
  const unread = mine.filter((n) => !n.read).length;

  const links = (
    <>
      {NAV.map(([key, path]) => {
        const href = `/${locale}${path}`;
        const active = path === "" ? pathname === `/${locale}` : pathname.startsWith(href);
        return (
          <Link key={key} href={href} onClick={() => setMobileOpen(false)}
            className={cn(
              "whitespace-nowrap rounded-[10px] px-2.5 py-2 text-[12.5px] font-semibold transition",
              active ? "bg-palm-light/25 text-ruga-navy" : "text-slate-600 hover:text-ink hover:bg-slate-100"
            )}>
            {dict.nav[key]}
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center gap-3">
          <Link href={`/${locale}`} className="flex items-center shrink-0">
            <Image
              src="/RUGA Logo main.png"
              alt="Ruga Tours"
              width={180}
              height={92}
              priority
              className="h-10 w-auto object-contain sm:h-11"
            />
          </Link>

          <nav className="mx-auto hidden items-center gap-0.5 lg:flex">{links}</nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            {/* locale switcher (tourist side only) */}
            <div className="hidden rounded-chip border border-line px-2 py-1.5 text-[11px] font-bold text-slate-500 sm:flex sm:items-center sm:gap-1">
              {LOCALES.map((l) => (
                <Link key={l} href={pathname.replace(/^\/(en|de|fr)/, `/${l}`)}
                  className={cn("rounded px-1.5 py-0.5 uppercase", l === locale ? "bg-ruga-navy text-white" : "hover:text-ink")}>
                  {l}
                </Link>
              ))}
            </div>

            {/* notifications */}
            {hydrated && role === "tourist" && (
              <div className="relative">
                <Button variant="outline" size="icon" className="relative" onClick={() => setBellOpen((v) => !v)} aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                  {unread > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white">
                      {unread}
                    </span>
                  )}
                </Button>
                {bellOpen && (
                  <div className="absolute right-0 top-11 z-50 w-[340px] overflow-hidden rounded-card border border-line bg-white shadow-lift">
                    <div className="flex items-center justify-between border-b border-line px-3.5 py-2.5">
                      <span className="text-xs font-bold">Notifications</span>
                      <button className="text-[11px] font-semibold text-ruga-royal hover:underline" onClick={() => { markRead("tourist"); setBellOpen(false); }}>
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {mine.length === 0 && <p className="p-5 text-center text-xs text-slate-400">No notifications yet</p>}
                      {mine.slice(0, 8).map((n) => (
                        <div key={n.id} className={cn("border-b border-slate-50 px-3.5 py-3", !n.read && "bg-palm-light/10")}>
                          <p className="text-xs font-bold">{n.title}</p>
                          <p className="mt-0.5 text-[11.5px] leading-snug text-slate-500">{n.body}</p>
                          <p className="mt-1 text-[10px] text-slate-400">{n.t}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {hydrated && role === "tourist" ? (
              <Link href={`/${locale}/account/plans`}>
                <Button size="sm" variant="primary">{dict.nav.account}</Button>
              </Link>
            ) : (
              <Link href={`/${locale}/auth/login`}>
                <Button size="sm" variant="outline">Sign in</Button>
              </Link>
            )}

            <div className="hidden md:block"><RoleSwitcher /></div>

            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="flex flex-col gap-1 border-t border-line py-3 lg:hidden">
            {links}
            <div className="mt-2 px-1"><RoleSwitcher /></div>
          </div>
        )}
      </div>
    </header>
  );
}
