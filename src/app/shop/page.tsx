'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Plus, Minus, ArrowLeft, ShoppingCart, X, Package, Truck, CheckCircle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Product {
  id: string
  name: string
  description: string
  price: number
  unit: string
  category: string
  image_url: string | null
  is_active: boolean
  stock: number
}

interface CartItem {
  product: Product
  quantity: number
}

const CATEGORY_EMOJIS: Record<string, string> = {
  ghee: '🫕',
  honey: '🍯',
  butter: '🧈',
  dairy: '🥛',
  other: '📦'
}

const CATEGORY_LABELS: Record<string, string> = {
  ghee: 'Pure Ghee',
  honey: 'Farm Honey',
  butter: 'Fresh Butter',
  dairy: 'Dairy Products',
  other: 'Specialty Items'
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [ordering, setOrdering] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderResult, setOrderResult] = useState<{ order_id: string; total_amount: number; delivery_date: string } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      if (data.success) {
        setProducts(data.products)
      }
    } catch {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  function addToCart(product: Product) {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  function removeFromCart(productId: string) {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId)
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      }
      return prev.filter(item => item.product.id !== productId)
    })
  }

  function clearItem(productId: string) {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  function getCartQuantity(productId: string): number {
    return cart.find(item => item.product.id === productId)?.quantity || 0
  }

  async function handleCheckout() {
    if (cart.length === 0) return
    setOrdering(true)
    setError('')

    try {
      const res = await fetch('/api/products/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            product_id: item.product.id,
            product_name: item.product.name,
            unit_price: item.product.price,
            quantity: item.quantity
          }))
        })
      })

      const data = await res.json()

      if (data.success) {
        setOrderSuccess(true)
        setOrderResult(data)
        setCart([])
        setCartOpen(false)
      } else {
        setError(data.message || 'Order failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setOrdering(false)
    }
  }

  // Group products by category
  const grouped = products.reduce<Record<string, Product[]>>((acc, p) => {
    const cat = p.category || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(p)
    return acc
  }, {})

  if (orderSuccess && orderResult) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-warm-white border border-border rounded-3xl p-8 shadow-shadow shadow-lg text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 rounded-full bg-green-100 border border-green-200 flex items-center justify-center mx-auto mb-5"
          >
            <CheckCircle className="text-green-600" size={32} />
          </motion.div>
          <h2 className="text-xl font-black text-brown-800 font-display mb-2">Order Confirmed! 🎉</h2>
          <p className="text-xs font-semibold text-brown-600 mb-6">
            Your order has been placed successfully. We&apos;ll deliver it with your milk tomorrow!
          </p>
          <div className="bg-cream-50 border border-border rounded-2xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-xs font-semibold text-brown-600">
              <span>Order Total</span>
              <span className="font-black text-brown-800">₹{orderResult.total_amount}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-brown-600">
              <span>Delivery Date</span>
              <span className="font-black text-brown-800">
                {new Date(orderResult.delivery_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="flex-1 inline-flex items-center justify-center h-11 bg-cream-100 border border-border text-brown-800 font-extrabold rounded-xl text-xs hover:bg-cream-200 transition-all"
            >
              Dashboard
            </Link>
            <button
              onClick={() => { setOrderSuccess(false); setOrderResult(null) }}
              className="flex-1 inline-flex items-center justify-center h-11 bg-amber-400 text-brown-800 font-extrabold rounded-xl text-xs hover:bg-amber-500 transition-all border-none cursor-pointer"
            >
              Shop More
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 font-body text-brown-800">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-warm-white/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 rounded-lg hover:bg-cream-50 transition-colors text-brown-600">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-sm font-black text-brown-800 font-display leading-tight">Amruth Farm Shop</h1>
              <p className="text-[9px] font-bold text-amber-600 uppercase tracking-wider">Fresh from our farm</p>
            </div>
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-all cursor-pointer"
          >
            <ShoppingCart size={18} className="text-amber-700" />
            {cartItemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-white text-[10px] font-black rounded-full flex items-center justify-center"
              >
                {cartItemCount}
              </motion.span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#78350f] to-[#b45309] text-white py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-amber-200 mb-4 border border-white/10 backdrop-blur-md">
              🏡 Farm Fresh Products
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display leading-tight mb-2">
              Premium Farm Products
            </h2>
            <p className="text-xs text-amber-100/80 font-semibold max-w-lg">
              Handcrafted from our dairy farm — pure ghee, raw honey, fresh butter, and more. Delivered along with your daily milk.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-amber-500" size={32} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="mx-auto text-brown-400 mb-4" size={40} />
            <h3 className="text-lg font-black text-brown-800">No products available</h3>
            <p className="text-xs font-semibold text-brown-600 mt-2">Check back soon — new farm products coming!</p>
          </div>
        ) : (
          Object.entries(grouped).map(([category, categoryProducts]) => (
            <section key={category}>
              <div className="flex items-center gap-2.5 mb-5">
                <span className="text-xl">{CATEGORY_EMOJIS[category] || '📦'}</span>
                <h3 className="text-lg font-black text-brown-800 font-display">{CATEGORY_LABELS[category] || category}</h3>
                <span className="text-[10px] font-bold text-brown-400 bg-cream-100 border border-border rounded-full px-2 py-0.5">
                  {categoryProducts.length} items
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {categoryProducts.map((product) => {
                  const inCart = getCartQuantity(product.id)
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group bg-warm-white border border-border rounded-2xl overflow-hidden shadow-shadow shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      {/* Product Image */}
                      <div className="aspect-square bg-cream-50 flex items-center justify-center relative overflow-hidden">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <span className="text-5xl opacity-50">{CATEGORY_EMOJIS[product.category] || '📦'}</span>
                        )}
                        {product.stock < 10 && product.stock > 0 && (
                          <span className="absolute top-2 left-2 text-[9px] font-black uppercase bg-red-100 text-red-600 border border-red-200 rounded-full px-2 py-0.5">
                            Only {product.stock} left
                          </span>
                        )}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-[11px] font-black uppercase text-white bg-red-500 rounded-full px-3 py-1">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-3.5">
                        <h4 className="text-sm font-black text-brown-800 leading-tight mb-0.5">{product.name}</h4>
                        {product.description && (
                          <p className="text-[10px] font-semibold text-brown-500 line-clamp-2 mb-2">{product.description}</p>
                        )}
                        <div className="flex items-end justify-between gap-2 mt-2">
                          <div>
                            <p className="text-base font-black text-brown-800">₹{product.price}</p>
                            <p className="text-[9px] font-bold text-brown-400">per {product.unit}</p>
                          </div>

                          {product.stock > 0 && (
                            <div>
                              {inCart > 0 ? (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => removeFromCart(product.id)}
                                    className="w-7 h-7 rounded-lg bg-cream-100 border border-border flex items-center justify-center text-brown-600 hover:bg-cream-200 transition-colors cursor-pointer"
                                  >
                                    <Minus size={12} />
                                  </button>
                                  <span className="text-xs font-black text-brown-800 w-5 text-center">{inCart}</span>
                                  <button
                                    onClick={() => addToCart(product)}
                                    className="w-7 h-7 rounded-lg bg-amber-400 border-none flex items-center justify-center text-brown-800 hover:bg-amber-500 transition-colors cursor-pointer"
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addToCart(product)}
                                  className="h-8 px-3 rounded-lg bg-amber-400 border-none text-[11px] font-extrabold text-brown-800 hover:bg-amber-500 transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <Plus size={12} /> Add
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </section>
          ))
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center text-xs font-semibold text-red-600">
            ⚠️ {error}
          </div>
        )}
      </main>

      {/* Floating Cart Button (Mobile) */}
      {cartItemCount > 0 && !cartOpen && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-4 right-4 z-50 lg:hidden"
        >
          <button
            onClick={() => setCartOpen(true)}
            className="w-full h-14 bg-amber-500 text-brown-800 rounded-2xl shadow-lg flex items-center justify-between px-5 border-none cursor-pointer hover:bg-amber-600 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} />
              <span className="text-sm font-black">{cartItemCount} items</span>
            </div>
            <span className="text-sm font-black">₹{cartTotal.toFixed(0)} →</span>
          </button>
        </motion.div>
      )}

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-50"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-warm-white z-50 shadow-2xl flex flex-col"
            >
              {/* Cart Header */}
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-brown-800">Your Cart</h3>
                  <p className="text-[10px] font-semibold text-brown-500">{cartItemCount} items</p>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 rounded-lg hover:bg-cream-50 transition-colors cursor-pointer bg-transparent border-none"
                >
                  <X size={18} className="text-brown-600" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="mx-auto text-brown-300 mb-3" size={32} />
                    <p className="text-xs font-semibold text-brown-500">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-3 bg-cream-50 border border-border rounded-xl p-3">
                      <div className="w-12 h-12 rounded-lg bg-cream-100 flex items-center justify-center flex-shrink-0 text-2xl">
                        {CATEGORY_EMOJIS[product.category] || '📦'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-brown-800 truncate">{product.name}</p>
                        <p className="text-[10px] font-semibold text-brown-500">₹{product.price} × {quantity}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="w-6 h-6 rounded bg-cream-200 border-none flex items-center justify-center cursor-pointer"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="text-xs font-black w-4 text-center">{quantity}</span>
                        <button
                          onClick={() => addToCart(product)}
                          className="w-6 h-6 rounded bg-amber-400 border-none flex items-center justify-center cursor-pointer"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                      <button
                        onClick={() => clearItem(product.id)}
                        className="p-1 rounded hover:bg-red-50 cursor-pointer bg-transparent border-none"
                      >
                        <X size={14} className="text-red-400" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="px-5 py-4 border-t border-border space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-brown-600">Delivery</span>
                    <span className="text-xs font-black text-green-600">FREE (with milk)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-brown-800">Total</span>
                    <span className="text-lg font-black text-brown-800">₹{cartTotal.toFixed(0)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-brown-500">
                    <Truck size={12} />
                    <span>Delivered with your milk tomorrow morning</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={ordering}
                    className={cn(
                      'w-full h-12 rounded-xl text-sm font-extrabold border-none cursor-pointer transition-all flex items-center justify-center gap-2',
                      ordering
                        ? 'bg-amber-300 text-amber-700'
                        : 'bg-amber-500 text-brown-800 hover:bg-amber-600 shadow-sm'
                    )}
                  >
                    {ordering ? (
                      <><Loader2 size={16} className="animate-spin" /> Processing...</>
                    ) : (
                      <>💳 Pay ₹{cartTotal.toFixed(0)} & Order</>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
