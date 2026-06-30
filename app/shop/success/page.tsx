import { client } from '@/sanity/client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getDownloadUrl } from '@/lib/getDownloadUrl'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
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

  // Check if user is logged in
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  let isLoggedIn = false

  if (token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!))
      isLoggedIn = true
    } catch {
      isLoggedIn = false
    }
  }

  // Fetch products matching the slugs
  const products = await client.fetch<Product[]>(
    `*[_type == "product" && slug.current in $slugs] {
      name, slug, downloadKey
    }`,
    { slugs: slugList }
  )

  // Logged-in users: permanent links via /api/download
  // Guests: 7-day pre-signed R2 URLs
  const downloads = await Promise.all(
    products.map(async (product) => {
      if (!product.downloadKey) return { name: product.name, url: null }

      if (isLoggedIn) {
        return { name: product.name, url: `/api/download?slug=${product.slug.current}` }
      }

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
          {isLoggedIn
            ? "Your order is confirmed. Download your files below — they'll always be available in your account dashboard."
            : "Your order is confirmed. Download your files below — links are valid for 7 days."}
        </p>

        {/* Downloads */}
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

        {/* Guest prompt — only shown when not logged in */}
        {!isLoggedIn && (
          <div className="border border-black p-8 mb-16">
            <h2 className="text-lg font-bold uppercase tracking-tight mb-3">
              Access your downloads anytime
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Your download links expire after 7 days. Create a free account
              to access your purchases anytime — no expiry, no hassle.
            </p>
            <div className="flex gap-4">
              <Link
                href={`/account/register`}
                className="text-xs uppercase tracking-widest font-bold px-6 py-3 bg-black text-white hover:bg-raspberry transition-colors"
              >
                Create account
              </Link>
              <Link
                href="/account/login"
                className="text-xs uppercase tracking-widest font-bold px-6 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors"
              >
                Log in
              </Link>
            </div>
          </div>
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