import { client } from '@/sanity/client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getDownloadUrl } from '@/lib/getDownloadUrl'
import Link from 'next/link'

type Product = {
  name: string
  slug: { current: string }
  downloadKey: string
}

export const metadata = {
  title: 'Order Confirmed',
  description: 'Your download is ready.',
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ slugs?: string; session_id?: string }>
}) {
  const { slugs } = await searchParams
  const slugList = slugs ? slugs.split(',') : []

  // Fetch products matching the slugs
  const products = await client.fetch<Product[]>(
    `*[_type == "product" && slug.current in $slugs] {
      name, slug, downloadKey
    }`,
    { slugs: slugList }
  )

  // Generate pre-signed download URLs for products that have a downloadKey
  const downloads = await Promise.all(
    products.map(async (product) => {
      if (!product.downloadKey) return { name: product.name, url: null }
      const url = await getDownloadUrl(product.downloadKey)
      return { name: product.name, url }
    })
  )

  return (
    <div>
      <Header />
      <main className="max-w-3xl mx-auto px-8 pt-48 pb-section">
        <h1 className="text-6xl md:text-7xl font-bold uppercase tracking-tight mb-6">
          Thank you!
        </h1>
        <p className="text-gray-600 leading-relaxed mb-16">
          Your order is confirmed. Download your files below — links expire after one hour.
        </p>

        {downloads.length === 0 ? (
          <p className="text-gray-400 text-sm uppercase tracking-widest">
            No downloads found.
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
                    Download
                  </a>
                ) : (
                  <span className="text-xs uppercase tracking-widest text-gray-400">
                    Coming soon
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        <Link
          href="/shop"
          className="text-sm uppercase tracking-widest font-bold text-black hover:text-raspberry transition-colors"
        >
          ← Back to shop
        </Link>
      </main>
      <Footer />
    </div>
  )
}
