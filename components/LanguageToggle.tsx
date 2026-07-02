"use client";

import { getLocaleFromPath, switchLocalePath } from "@/lib/locale";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LanguageToggle() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);

  return (
    <div className="relative inline-flex items-center bg-white/10 rounded-full p-1 mt-8 md:mt-14 w-fit select-none">
      {/* Sliding highlight */}
      <span
        className={`absolute top-1 bottom-1 left-1 w-9 rounded-full bg-raspberry transition-transform duration-300 ease-out ${
          locale === "en" ? "translate-x-9" : "translate-x-0"
        }`}
        aria-hidden="true"
      />
      <Link
        href={switchLocalePath(pathname, "de")}
        aria-label="Deutsch"
        aria-current={locale === "de" ? "true" : undefined}
        className={`relative z-10 w-9 text-center text-[11px] font-bold uppercase tracking-widest py-1 no-underline transition-colors ${
          locale === "de" ? "text-white" : "text-gray-200 hover:text-white"
        }`}
      >
        DE
      </Link>
      <Link
        href={switchLocalePath(pathname, "en")}
        aria-label="English"
        aria-current={locale === "en" ? "true" : undefined}
        className={`relative z-10 w-9 text-center text-[11px] font-bold uppercase tracking-widest py-1 no-underline transition-colors ${
          locale === "en" ? "text-white" : "text-gray-200 hover:text-white"
        }`}
      >
        EN
      </Link>
    </div>
  );
}