import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getDownloadUrl } from "@/lib/getDownloadUrl";
import type { Locale } from "@/lib/locale";
import { localizedHref } from "@/lib/locale";
import { getStrings } from "@/lib/strings";
import { client } from "@/sanity/client";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import Link from "next/link";

type Product = {
  name: string;
  slug: { current: string };
  downloadKey: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = getStrings(locale as Locale)
  return {
    title: t.success.heading,
    description: t.success.descriptionMeta,
  }
}

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ slugs?: string; session_id?: string }>;
}) {
  const { locale } = await params
  const t = getStrings(locale as Locale)
  const { slugs } = await searchParams;
  const slugList = slugs ? slugs.split(",") : [];

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  let isLoggedIn = false;

  if (token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
      isLoggedIn = true;
    } catch {
      isLoggedIn = false;
    }
  }

  const products = await client.fetch<Product[]>(
    `*[_type == "product" && slug.current in $slugs] {
      name, slug, downloadKey
    }`,
    { slugs: slugList },
  );

  const downloads = await Promise.all(
    products.map(async (product) => {
      if (!product.downloadKey) return { name: product.name, url: null };
      if (isLoggedIn) {
        return {
          name: product.name,
          url: `/api/download?slug=${product.slug.current}`,
        };
      }
      const extension = product.downloadKey.split(".").pop();
      const filename = `${product.name}.${extension}`;
      const url = await getDownloadUrl(product.downloadKey, filename);
      return { name: product.name, url };
    }),
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col justify-center px-8 pt-48 pb-section max-w-3xl mx-auto w-full">
        <h1 className="text-6xl md:text-7xl font-bold uppercase tracking-tight mb-6">
          {t.success.heading}
        </h1>
        <p className="text-gray-600 leading-relaxed mb-16">
          {isLoggedIn ? t.success.confirmedLoggedIn : t.success.confirmedGuest}
        </p>

        {downloads.length === 0 ? (
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-16">
            {t.success.noDownloads}
          </p>
        ) : (
          <ul className="flex flex-col gap-6 mb-16">
            {downloads.map(({ name, url }) => (
              <li key={name} className="flex items-center justify-between border-b border-gray-100 pb-6">
                <span className="font-bold uppercase tracking-tight">{name}</span>
                {url ? (
                  <a
                    href={url}
                    download
                    className="text-xs uppercase tracking-widest font-bold px-6 py-3 bg-black text-white hover:bg-raspberry transition-colors"
                  >
                    {t.success.download}
                  </a>
                ) : (
                  <span className="text-xs uppercase tracking-widest text-gray-400">
                    {t.success.comingSoon}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        {!isLoggedIn && (
          <div className="border border-black p-8 mb-16">
            <h2 className="text-lg font-bold uppercase tracking-tight mb-3">
              {t.success.accessHeading}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {t.success.accessBody}
            </p>
            <div className="flex gap-4">
              <Link
                href={localizedHref("/account/register", locale as Locale)}
                className="text-xs uppercase tracking-widest font-bold px-6 py-3 bg-black text-white hover:bg-raspberry transition-colors"
              >
                {t.success.createAccount}
              </Link>
              <Link
                href={localizedHref("/account/login", locale as Locale)}
                className="text-xs uppercase tracking-widest font-bold px-6 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors"
              >
                {t.success.login}
              </Link>
            </div>
          </div>
        )}

        <Link
          href={localizedHref("/shop", locale as Locale)}
          className="text-sm uppercase tracking-widest font-bold text-black hover:text-raspberry transition-colors"
        >
          {t.success.backToShop}
        </Link>
      </main>
      <Footer />
    </div>
  );
}