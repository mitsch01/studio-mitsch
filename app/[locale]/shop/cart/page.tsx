"use client"

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { useCart } from '@/context/CartContext'
import { getLocaleFromPath, localizedHref, type Locale } from '@/lib/locale'
import { getStrings } from '@/lib/strings'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CartPage() {
  const { items, removeItem, total } = useCart()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const locale = getLocaleFromPath(pathname) as Locale
  const t = getStrings(locale)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      if (total === 0) {
        const meRes = await fetch('/api/auth/me')
        const meData = await meRes.json()
        const customerEmail = meData.user?.email ?? null

        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slugs: items.map((i) => i.slug),
            customerEmail,
          }),
        })

        const slugs = items.map((i) => i.slug).join(',')
        router.push(localizedHref(`/shop/success?slugs=${slugs}`, locale))
        return
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <Header logoColor="black" burgerColor="black" />
      <main className="flex-1 max-w-3xl mx-auto px-8 pt-48 pb-section">
        <h1 className="text-6xl md:text-7xl font-bold uppercase tracking-tight mb-16">
          {t.cart.heading}
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col gap-6">
            <p className="text-gray-400 text-sm uppercase tracking-widest">
              {t.cart.empty}
            </p>
            <Link
              href={localizedHref('/shop', locale)}
              className="text-sm uppercase tracking-widest font-bold text-black hover:text-raspberry transition-colors w-fit"
            >
              {t.cart.backToShop}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            <ul className="flex flex-col divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between items-center py-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold uppercase tracking-tight">
                      {item.name}
                    </span>
                    <span className="text-sm text-gray-400 uppercase tracking-widest">
                      {item.price === 0 ? t.product.free : `€${item.price.toFixed(2)}`}
                    </span>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs uppercase tracking-widest text-gray-400 hover:text-raspberry transition-colors"
                  >
                    {t.cart.remove}
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center border-t border-black pt-6">
              <span className="text-sm uppercase tracking-widest font-bold">
                {t.cart.total}
              </span>
              <span className="text-sm uppercase tracking-widest font-bold">
                {total === 0 ? t.product.free : `€${total.toFixed(2)}`}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={localizedHref('/shop', locale)}
                className="text-sm uppercase tracking-widest font-bold text-black hover:text-raspberry transition-colors py-3 w-fit"
              >
                {t.cart.continueShopping}
              </Link>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="flex-1 bg-black text-white text-sm uppercase tracking-widest font-bold py-3 hover:bg-raspberry transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t.cart.redirecting : t.cart.checkout}
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}