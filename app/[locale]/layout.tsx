import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { locales, type Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// hreflang links — rendered into the root <head> by Next.js (resolved against metadataBase)
export const metadata: Metadata = {
  alternates: {
    languages: {
      de: "/",
      en: "/en",
      "x-default": "/",
    },
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return (
    <AuthProvider>
      <CartProvider>
        <main className="flex-1">{children}</main>
      </CartProvider>
    </AuthProvider>
  );
}