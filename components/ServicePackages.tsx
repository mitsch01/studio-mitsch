import { localizedHref, type Locale } from "@/lib/locale";
import { getStrings } from "@/lib/strings";
import type { ServicePackage } from "@/sanity/queries/servicePackages";
import { Check } from "lucide-react";
import Link from "next/link";

const formatPrice = (price: number, locale: Locale) =>
  new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);

export default function ServicePackages({
  packages,
  locale,
}: {
  packages: ServicePackage[];
  locale: Locale;
}) {
  const t = getStrings(locale);
  const contactHref = localizedHref("/contact", locale);

  if (packages.length === 0) return null;

  return (
    <section id="services" className="py-section bg-gray-50">
      <div className="max-w-screen-lg mx-auto px-8">
        <h1 className="md:text-7xl text-6xl uppercase text-black pb-6 tracking-tight">
          {t.services.heading}
        </h1>
        <div className="max-w-2xl flex flex-col gap-4 pb-12">
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            {t.services.subline}
          </p>
        </div>

        {/* Grid + items-stretch keeps all cards the same height; mt-auto pins the button to the bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {packages.map((pkg) => (
            <article
              key={pkg.id}
              className={`flex flex-col gap-6 p-8 border shadow-sm ${pkg.featured
                  ? "bg-black border-black text-white"
                  : "bg-white border-gray-200 text-black"
                }`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <h3 className="text-xl font-bold tracking-tight whitespace-nowrap">{pkg.title}</h3>
                  {pkg.featured && pkg.badge && (
                    <span className="bg-raspberry text-white font-bold text-[10px] uppercase tracking-widest px-3 py-1 shrink-0">
                      {pkg.badge}
                    </span>
                  )}
                </div>
                <p className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-4xl font-extrabold tracking-tight">
                    {pkg.priceFrom && `${t.services.from} `}
                    {formatPrice(pkg.price, locale)}
                  </span>
                  {pkg.unit && (
                    <span className={pkg.featured ? "text-gray-400" : "text-gray-500"}>
                      {pkg.unit}
                    </span>
                  )}
                </p>
                {pkg.description && (
                  <p className={`leading-relaxed ${pkg.featured ? "text-gray-300" : "text-gray-600"}`}>
                    {pkg.description}
                  </p>
                )}
              </div>

              <ul className={`flex flex-col gap-3 pt-6 border-t ${pkg.featured ? "border-gray-700" : "border-gray-200"}`}>
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex gap-3 items-start leading-relaxed">
                    <Check className="w-5 h-5 mt-0.5 shrink-0 text-raspberry" aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {pkg.note && (
                <p className={`text-sm leading-relaxed ${pkg.featured ? "text-gray-400" : "text-gray-500"}`}>
                  {pkg.note}
                </p>
              )}

              <Link
                href={`${contactHref}?service=${encodeURIComponent(pkg.id)}`}
                className={`mt-auto px-6 py-3 text-center font-bold text-xs uppercase tracking-widest transition-colors no-underline ${pkg.featured
                    ? "bg-raspberry text-white hover:bg-raspberry-hover"
                    : "bg-black text-white hover:bg-raspberry"
                  }`}
              >
                {pkg.ctaLabel}
              </Link>
            </article>
          ))}
        </div>

        <p className="pt-12 text-center text-gray-600 leading-relaxed">
          {t.services.footnote}{" "}
          <Link href={contactHref} className="text-raspberry hover:text-raspberry-hover font-bold">
            {t.services.footnoteCta}
          </Link>
        </p>
      </div>
    </section>
  );
}
