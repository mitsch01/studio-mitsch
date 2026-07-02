import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { locales, type Locale } from "@/lib/locale";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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
        <>
          <head>
            <link rel="alternate" hrefLang="de" href="https://studio-mitsch.de" />
            <link rel="alternate" hrefLang="en" href="https://studio-mitsch.de/en" />
            <link rel="alternate" hrefLang="x-default" href="https://studio-mitsch.de" />
          </head>
          <main className="flex-1">{children}</main>
        </>
      </CartProvider>
    </AuthProvider>
  );
}