import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLocaleFromPath } from "@/lib/locales";

/** Expose the URL locale so the root layout can set <html lang>. */
export function proxy(request: NextRequest) {
  const locale = getLocaleFromPath(request.nextUrl.pathname);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
