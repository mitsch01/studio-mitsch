import type { Locale } from "@/lib/locale";
import { client } from "@/sanity/client";

export type ServicePackage = {
  id: string;
  title: string;
  price: number;
  priceFrom: boolean;
  unit: string | null;
  description: string | null;
  features: string[];
  note: string | null;
  ctaLabel: string;
  featured: boolean;
  badge: string | null;
};

// Löst jedes { de, en }-Feld in die angefragte Sprache auf, mit Deutsch als Fallback
const PROJECTION = `{
  "id": _id,
  "title": coalesce(title[$locale], title.de),
  price,
  "priceFrom": coalesce(priceFrom, false),
  "unit": coalesce(unit[$locale], unit.de),
  "description": coalesce(description[$locale], description.de),
  "features": coalesce(features[]{ "text": coalesce(@[$locale], @.de) }.text, []),
  "note": coalesce(note[$locale], note.de),
  "ctaLabel": coalesce(ctaLabel[$locale], ctaLabel.de),
  "featured": coalesce(featured, false),
  "badge": coalesce(badge[$locale], badge.de)
}`;

export async function getServicePackages(locale: Locale): Promise<ServicePackage[]> {
  return client.fetch(
    `*[_type == "servicePackage"] | order(orderRank asc) ${PROJECTION}`,
    { locale },
  );
}
