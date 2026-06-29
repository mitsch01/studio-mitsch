import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { redirect } from 'next/navigation'
import clientPromise from '@/mongodb'
import { client as sanityClient } from '@/sanity/client'
import { getDownloadUrl } from '@/lib/getDownloadUrl'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LogoutButton from '@/components/LogoutButton'

type Order = {
  _id: string
  slugs: string[]
  createdAt: string
  amount: number
  currency: string
}

type Product = {
  name: string
  slug: { current: string }
  downloadKey: string
}

export default async function DashboardPage() {
  // 1. Verify JWT from cookie
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) redirect('/account/login')

  let user: { id: string; email: string; name: string }
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    )
    user = payload as typeof user
  } catch {
    redirect('/account/login')
  }

  // 2. Fetch orders from MongoDB
  const mongo = await clientPromise
  const db = mongo.db('studio-mitsch-prod')
  const orders = await db
    .collection('orders')
    .find({ customerEmail: user.email })
    .sort({ createdAt: -1 })
    .toArray()

  // 3. Collect all unique slugs across orders
  const allSlugs = [...new Set(orders.flatMap((o) => o.slugs ?? []))]

  // 4. Fetch matching products from Sanity
  const products = await sanityClient.fetch<Product[]>(
    `*[_type == "product" && slug.current in $slugs] {
      name, slug, downloadKey
    }`,
    { slugs: allSlugs }
  )

  // 5. Build a slug → download URL map
  const downloadMap: Record<string, string | null> = {}
  await Promise.all(
    products.map(async (product) => {
      if (product.downloadKey) {
        downloadMap[product.slug.current] = await getDownloadUrl(product.downloadKey)
      } else {
        downloadMap[product.slug.current] = null
      }
    })
  )

  const productMap: Record<string, Product> = {}
  products.forEach((p) => {
    productMap[p.slug.current] = p
  })

  return (
    <div>
      <Header />
      <main className="max-w-3xl mx-auto px-8 pt-48 pb-section">
        {/* Header */}
        <div className="flex justify-between items-start mb-16">
          <div>
            <h1 className="text-5xl font-bold uppercase tracking-tight mb-2">
              My Account
            </h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
          <LogoutButton />
        </div>

        {/* Downloads */}
        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-widest text-gray-900 mb-8">
            My Downloads
          </h2>

          {orders.length === 0 ? (
            <p className="text-gray-700 text-sm uppercase tracking-widest">
              No purchases yet.{' '}
              <a href="/shop" className="text-black font-bold hover:text-raspberry transition-colors ml-4">
                Visit the shop →
              </a>
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-gray-100">
              {orders.map((order) => (
                <li key={order._id.toString()} className="py-6">
                  <p className="text-xs uppercase tracking-widest text-gray-800 mb-4">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {(order.slugs ?? []).map((slug: string) => {
                      const product = productMap[slug]
                      const url = downloadMap[slug]
                      return (
                        <li key={slug} className="flex items-center justify-between">
                          <span className="font-bold uppercase tracking-tight text-sm">
                            {product?.name ?? slug}
                          </span>
                          {url ? (
                            <a
                              href={url}
                              download
                              className="text-xs uppercase tracking-widest font-bold px-4 py-2 bg-black text-white hover:bg-raspberry transition-colors"
                            >
                              Download
                            </a>
                          ) : (
                            <span className="text-xs uppercase tracking-widest text-gray-400">
                              Coming soon
                            </span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* App subscriptions */}
        <section>
          <h2 className="text-xs uppercase tracking-widest text-gray-900 mb-4">
            App Subscriptions
          </h2>
          <p className="text-sm text-gray-800 leading-relaxed">
            Managing your app subscription? Subscriptions are handled directly
            through the App Store or Google Play. Visit the store where you
            purchased the app to manage or cancel your subscription.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}