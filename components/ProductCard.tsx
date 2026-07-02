"use client"

import { useCart } from '@/context/CartContext'
import type { Locale } from '@/lib/locale'
import { getStrings } from '@/lib/strings'
import { urlFor } from '@/sanity/image'
import Image from 'next/image'
import { useState } from 'react'

type Product = {
  _id: string
  name: string
  slug: { current: string }
  description: string
  price: number
  image: any
}

export default function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const { addItem, items } = useCart()
  const [added, setAdded] = useState(false)
  const t = getStrings(locale)

  const inCart = items.some((i) => i.id === product._id)

  const handleAdd = () => {
    addItem({
      id: product._id,
      name: product.name,
      slug: product.slug.current,
      price: product.price,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const imageUrl = product.image ? urlFor(product.image).width(600).height(800).url() : null

  return (
    <div className="flex flex-col border border-gray-100 group">
      <div className="w-full aspect-[3/4] bg-gray-100 relative overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-300 text-sm uppercase tracking-widest">
              {product.name}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col gap-3 flex-1">
        <h2 className="text-xl font-bold uppercase tracking-tight">
          {product.name}
        </h2>
        {product.description && (
          <p className="text-gray-500 text-sm leading-relaxed flex-1">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm uppercase tracking-widest font-bold">
            {product.price === 0 ? t.product.free : `€${product.price.toFixed(2)}`}
          </span>
          <button
            onClick={handleAdd}
            disabled={inCart}
            className="text-xs uppercase tracking-widest font-bold px-4 py-2 bg-black text-white hover:bg-raspberry transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {inCart ? t.product.inCart : added ? t.product.added : t.product.addToCart}
          </button>
        </div>
      </div>
    </div>
  )
}