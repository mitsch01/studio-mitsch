"use client"

import { useCart } from '@/context/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, removeItem, total } = useCart()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      const data = await res.json()
      if (data.url) {
        router.push(data.url)
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header logoColor="black" burgerColor="black" />
      <main className="max-w-3xl mx-auto px-8 pt-48 pb-section">
        <h1 className="text-6xl md:text-7xl font-bold uppercase tracking-tight mb-16">
          Cart
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col gap-6">
            <p className="text-gray-400 text-sm uppercase tracking-widest">
              Your cart is empty.
            </p>
            <Link
              href="/shop"
              className="text-sm uppercase tracking-widest font-bold text-black hover:text-raspberry transition-colors w-fit"
            >
              ← Back to shop
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {/* Items */}
            <ul className="flex flex-col divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between items-center py-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold uppercase tracking-tight">
                      {item.name}
                    </span>
                    <span className="text-sm text-gray-400 uppercase tracking-widest">
                      {item.price === 0 ? 'Free' : `€${item.price.toFixed(2)}`}
                    </span>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs uppercase tracking-widest text-gray-400 hover:text-raspberry transition-colors"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            {/* Summary */}
            <div className="flex justify-between items-center border-t border-black pt-6">
              <span className="text-sm uppercase tracking-widest font-bold">
                Total
              </span>
              <span className="text-sm uppercase tracking-widest font-bold">
                {total === 0 ? 'Free' : `€${total.toFixed(2)}`}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="text-sm uppercase tracking-widest font-bold text-black hover:text-raspberry transition-colors py-3 w-fit"
              >
                ← Continue shopping
              </Link>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="flex-1 bg-black text-white text-sm uppercase tracking-widest font-bold py-3 hover:bg-raspberry transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Redirecting...' : 'Checkout'}
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}