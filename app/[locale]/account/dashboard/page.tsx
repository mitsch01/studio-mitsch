import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LogoutButton from "@/components/LogoutButton";
import Tooltip from "@/components/Tooltip";
import type { Locale } from "@/lib/locale";
import { localizedHref } from "@/lib/locale";
import { getStrings } from "@/lib/strings";
import clientPromise from "@/mongodb";
import { client as sanityClient } from "@/sanity/client";
import { jwtVerify } from "jose";
import { Settings } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

type Order = {
  _id: string;
  slugs: string[];
  createdAt: string;
  amount: number;
  currency: string;
};

type Product = {
  name: string;
  slug: { current: string };
  downloadKey: string;
};

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getStrings(locale as Locale);

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) redirect(localizedHref("/account/login", locale as Locale));

  let user: { id: string; email: string; name: string };
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!),
    );
    user = payload as typeof user;
  } catch {
    redirect(localizedHref("/account/login", locale as Locale));
  }

  const mongo = await clientPromise;
  const db = mongo.db("studio-mitsch-prod");
  const orders = await db
    .collection("orders")
    .find({ customerEmail: user.email })
    .sort({ createdAt: -1 })
    .toArray();

  const allSlugs = [...new Set(orders.flatMap((o) => o.slugs ?? []))];

  const products = await sanityClient.fetch<Product[]>(
    `*[_type == "product" && slug.current in $slugs] {
      name, slug, downloadKey
    }`,
    { slugs: allSlugs },
  );

  const productMap: Record<string, Product> = {};
  products.forEach((p) => { productMap[p.slug.current] = p; });

  return (
    <div>
      <Header />
      <main className="max-w-3xl mx-auto px-8 pt-48 pb-section">
        <div className="flex justify-between items-start mb-16 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-2">
              {t.account.dashboardHeading}
            </h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <Tooltip label={t.account.settings}>
              <Link
                href={localizedHref("/account/settings", locale as Locale)}
                aria-label={t.account.settings}
                className="text-black hover:text-raspberry transition-colors"
              >
                <Settings size={20} />
              </Link>
            </Tooltip>
            <Tooltip label={t.account.logout}>
              <LogoutButton locale={locale as Locale} />
            </Tooltip>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-widest text-gray-900 mb-8">
            {t.account.myDownloads}
          </h2>

          {orders.length === 0 ? (
            <p className="text-gray-700 text-sm uppercase tracking-widest">
              {t.account.noPurchases}{" "}
              <a
                href={localizedHref("/shop", locale as Locale)}
                className="text-black font-bold hover:text-raspberry transition-colors ml-4"
              >
                {t.account.visitShop}
              </a>
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-gray-100">
              {orders.map((order) => (
                <li key={order._id.toString()} className="py-6">
                  <p className="text-xs uppercase tracking-widest text-gray-800 mb-4">
                    {new Date(order.createdAt).toLocaleDateString(
                      locale === "de" ? "de-DE" : "en-GB",
                      { day: "2-digit", month: "long", year: "numeric" }
                    )}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {(order.slugs ?? []).map((slug: string) => {
                      const product = productMap[slug];
                      const hasFile = product?.downloadKey;
                      return (
                        <li key={slug} className="flex items-center justify-between">
                          <span className="font-bold uppercase tracking-tight text-sm">
                            {product?.name ?? slug}
                          </span>
                          {hasFile ? (
                            <a
                              href={`/api/download?slug=${slug}`}
                              download
                              className="text-xs uppercase tracking-widest font-bold px-4 py-2 bg-black text-white hover:bg-raspberry transition-colors"
                            >
                              {t.account.download}
                            </a>
                          ) : (
                            <span className="text-xs uppercase tracking-widest text-gray-400">
                              {t.account.comingSoon}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-widest text-gray-900 mb-4">
            {t.account.appSubscriptions}
          </h2>
          <p className="text-sm text-gray-800 leading-relaxed">
            {t.account.appSubscriptionsBody}
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}