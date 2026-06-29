import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import { client } from '@/sanity/client'

type Product = {
  _id: string
  name: string
  slug: { current: string }
  description: string
  price: number
  image: any
}

export const metadata = {
  title: 'Shop',
  description: 'Download free art and tools by Miriam Schwartz — Studio Mitsch.',
}

export default async function ShopPage() {
  const products = await client.fetch<Product[]>(
    `*[_type == "product" && isActive == true] | order(name asc) {
      _id, name, slug, description, price, image
    }`
  )

  return (
    <div>
      <Header logoColor="black" burgerColor="black" />
      <main className="max-w-6xl mx-auto px-8 pt-48 pb-section">
        <h1 className="text-6xl md:text-7xl font-bold uppercase tracking-tight mb-4">
          Shop
        </h1>
        <p className="text-gray-500 text-sm uppercase tracking-widest mb-16">
          Free downloads — more to come.
        </p>

        {products.length === 0 ? (
          <p className="text-gray-400 text-sm uppercase tracking-widest">
            No products yet — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}