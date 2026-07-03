import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import type { Locale } from '@/lib/locale'
import { getStrings } from '@/lib/strings'
import { client } from '@/sanity/client'

type Product = {
  _id: string
  name: string
  slug: { current: string }
  description: string
  price: number
  image: any
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = getStrings(locale as Locale)
  return {
    title: t.shop.heading,
    description: t.shop.descriptionMeta,
  }
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = getStrings(locale as Locale)

  const products = await client.fetch<Product[]>(
  `*[_type == "product" && isActive == true && language == $locale] | order(order asc) {
    _id, name, slug, description, price, image
  }`,
  { locale }
)

  return (
    <div >
      <Header logoColor="black" burgerColor="black" />
      <main className="max-w-6xl mx-auto px-8 pt-48 pb-section">
        <h1 className="text-6xl md:text-7xl font-bold uppercase tracking-tight mb-4">
          {t.shop.heading}
        </h1>
        <p className="text-gray-500 text-sm uppercase tracking-widest mb-16">
          {t.shop.subheading}
        </p>

        {products.length === 0 ? (
          <p className="text-gray-400 text-sm uppercase tracking-widest">
            {t.shop.noProducts}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} locale={locale as Locale} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}