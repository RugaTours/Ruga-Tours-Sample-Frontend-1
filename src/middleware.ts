import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["en", "de", "fr"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // admin & internals pass through untouched
  if (pathname.startsWith("/admin") || pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }
  // already localized?
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) {
    return NextResponse.next();
  }
  const url = req.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
