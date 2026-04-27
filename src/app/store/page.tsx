'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Star, Zap, ArrowRight } from 'lucide-react'
import { products, storeInfo } from '@/lib/products'
import { CartItem, Product } from '@/types'

export default function StorePage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [addedId, setAddedId] = useState<string | null>(null)

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { product, quantity: 1 }]
    })
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1200)
  }

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0)

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-surface-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl">{storeInfo.name}</span>
        </div>
        <p className="hidden md:block text-slate-400 text-sm">{storeInfo.tagline}</p>
        <Link
          href={cart.length > 0 ? `/checkout?cart=${encodeURIComponent(JSON.stringify(cart))}` : '#'}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            cart.length > 0
              ? 'bg-brand-500 hover:bg-brand-600 text-white glow-accent'
              : 'bg-surface-card border border-surface-border text-slate-400'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {cartCount > 0 ? `${cartCount} items · ₹${cartTotal.toLocaleString()}` : 'Cart'}
          {cart.length > 0 && <ArrowRight className="w-4 h-4" />}
        </Link>
      </header>

      {/* Trust bar */}
      <div className="bg-brand-500/10 border-b border-brand-500/20 px-6 py-2 flex items-center justify-center gap-8 overflow-x-auto">
        {storeInfo.trustBadges.map((badge) => (
          <span key={badge} className="text-xs text-brand-500 whitespace-nowrap">✓ {badge}</span>
        ))}
      </div>

      {/* Products grid */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl font-bold mb-2">New Arrivals</h1>
        <p className="text-slate-400 mb-8">Hand-picked gear for your active lifestyle</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden hover:border-brand-500/40 transition-all group"
            >
              <div className="relative h-56 bg-slate-800 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-brand-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    {product.badge}
                  </span>
                )}
              </div>

              <div className="p-5">
                <div className="text-xs text-slate-500 mb-1">{product.category}</div>
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-slate-400 text-sm mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-slate-500 text-xs">({product.reviews.toLocaleString()} reviews)</span>
                  <span className="ml-auto text-xs text-green-400">🚚 {product.deliveryDays}d delivery</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-display text-2xl font-bold">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-slate-500 text-sm line-through ml-2">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      addedId === product.id
                        ? 'bg-green-500 text-white'
                        : 'bg-brand-500 hover:bg-brand-600 text-white'
                    }`}
                  >
                    {addedId === product.id ? '✓ Added' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
