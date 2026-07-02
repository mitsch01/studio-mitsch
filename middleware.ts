import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const locales = ["de", "en"] as const;
const defaultLocale = "de";

function getLocaleFromPathname(pathname: string): string | null {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return locales.includes(firstSegment as (typeof locales)[number]) ? firstSegment : null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const localeInPath = getLocaleFromPathname(pathname);
  const locale = localeInPath ?? defaultLocale;

  let response: NextResponse;

  if (!localeInPath) {
    // German is the default and stays invisible in the URL —
    // internally rewrite "/" and "/blog" etc. to "/de" and "/de/blog"
    const rewritten = req.nextUrl.clone();
    rewritten.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    response = NextResponse.rewrite(rewritten);
  } else {
    response = NextResponse.next();
  }

  // --- Auth protection for /account/*, now locale-aware ---
  const pathWithoutLocale = localeInPath
    ? pathname.slice(`/${localeInPath}`.length) || "/"
    : pathname;

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
  // Everything except: API routes, Next internals, Sanity Studio,
  // admin newsletter (unlocalized by your call above), and any file with an extension
  matcher: ["/((?!api|_next|studio|admin/newsletter|.*\\..*).*)"],
};