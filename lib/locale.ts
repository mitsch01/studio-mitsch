export const locales = ["de", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "de";

export function hasLocalePrefix(pathname: string): boolean {
  const first = pathname.split("/").filter(Boolean)[0];
  return (locales as readonly string[]).includes(first);
}

export function getLocaleFromPath(pathname: string): Locale {
  const first = pathname.split("/").filter(Boolean)[0];
  return (locales as readonly string[]).includes(first) ? (first as Locale) : defaultLocale;
}

// Turns a bare path ("/blog") into the correct locale-aware href
export function localizedHref(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

// For the DE/EN toggle — takes the CURRENT pathname and returns the
// equivalent path in the target locale, so switching language keeps you on the same page
export function switchLocalePath(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  const stripped = hasLocalePrefix(pathname) ? segments.slice(1) : segments;
  const pathWithoutLocale = stripped.length ? `/${stripped.join("/")}` : "/";
  return localizedHref(pathWithoutLocale, targetLocale);
}