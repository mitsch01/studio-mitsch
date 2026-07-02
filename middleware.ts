import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, getLocaleFromPath, hasLocalePrefix } from "@/lib/locale";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const localePrefixed = hasLocalePrefix(pathname);
  const locale = getLocaleFromPath(pathname);

  let response: NextResponse;

  if (!localePrefixed) {
    const rewritten = req.nextUrl.clone();
    rewritten.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    response = NextResponse.rewrite(rewritten);
  } else {
    response = NextResponse.next();
  }

  const pathWithoutLocale = localePrefixed ? pathname.slice(`/${locale}`.length) || "/" : pathname;

  const isAccountRoute = pathWithoutLocale.startsWith("/account");
  const isPublicAccountRoute =
    pathWithoutLocale.startsWith("/account/login") ||
    pathWithoutLocale.startsWith("/account/register") ||
    pathWithoutLocale.startsWith("/account/forgot-password") ||
    pathWithoutLocale.startsWith("/account/reset-password");

  if (isAccountRoute && !isPublicAccountRoute) {
    const token = req.cookies.get("auth_token")?.value;
    const loginPath = locale === defaultLocale ? "/account/login" : `/${locale}/account/login`;

    if (!token) {
      return NextResponse.redirect(new URL(loginPath, req.url));
    }

    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    } catch {
      return NextResponse.redirect(new URL(loginPath, req.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|studio|admin/newsletter|.*\\..*).*)"],
};