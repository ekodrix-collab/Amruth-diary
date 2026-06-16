'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const products = [
  {
    name: 'A2 Cow Milk',
    volume: '500ml / 1L / 2L',
    price: '₹60 / Litre',
    image: '/images/amruth_product_milk.png'
  },
  {
    name: 'Fresh Curd',
    volume: '500ml',
    price: '₹40',
    image: '/images/amruth_product_curd.png'
  },
  {
    name: 'Pure Cow Ghee',
    volume: '500ml',
    price: '₹450',
    image: '/images/amruth_product_ghee.png'
  },
  {
    name: 'Paneer',
    volume: '200g',
    price: '₹90',
    image: '/images/amruth_product_paneer.png'
  },
  {
    name: 'Buttermilk',
    volume: '500ml',
    price: '₹30',
    image: '/images/amruth_product_buttermilk.png'
  }
]

export function ProductsPreview() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current
      const scrollTo = direction === 'left' ? scrollLeft - 320 : scrollLeft + 320
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <section 
      id="products" 
      style={{ 
        background: 'linear-gradient(to bottom, #FAF7EF 0%, #FDFBF7 60%, #ffffff 100%)', 
        padding: '120px 0', 
        position: 'relative'
      }}
    >
      <div className="container-page">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={0}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#fff',
              border: '1.5px solid rgba(0, 102, 204, 0.15)',
              color: '#0066cc',
              borderRadius: '999px',
              padding: '6px 16px',
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '18px',
              boxShadow: '0 2px 6px rgba(0, 102, 204, 0.04)'
            }}>
              Our Products
            </div>
            <h2 style={{ 
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(2rem, 3.8vw, 3rem)', 
              fontWeight: 500, 
              color: '#0f2e5c', 
              letterSpacing: '-0.01em', 
              lineHeight: 1.2, 
              marginBottom: '16px' 
            }}>
              Understand What You&apos;re Drinking.
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>
              Pure. Natural. No Additives.
            </p>
          </div>
        </ScrollReveal>

        {/* Slider Wrapper */}
        <ScrollReveal direction="up" delay={150} duration={1000}>
          <div style={{ position: 'relative', padding: '0 48px' }}>
            
            {/* Left Arrow */}
            <button
              onClick={() => scroll('left')}
              style={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#fff',
                border: '1.5px solid rgba(15, 46, 92, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(15, 46, 92, 0.06)',
                color: '#0066cc',
                transition: 'background-color 0.2s, color 0.2s'
              }}
              className="hover:bg-[#e3f2fd] hover:text-[#0052a3]"
              aria-label="Scroll left"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Scroll Container */}
            <div
              ref={scrollContainerRef}
              style={{
                display: 'flex',
                gap: '28px',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                padding: '16px 4px',
                scrollSnapType: 'x mandatory'
              }}
              className="products-scroll-container"
            >
              {products.map((product) => (
                <div
                  key={product.name}
                  style={{
                    background: '#fff',
                    borderRadius: '20px',
                    border: '1.5px solid rgba(236, 216, 176, 0.6)',
                    minWidth: '260px',
                    width: '260px',
                    padding: '28px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    scrollSnapAlign: 'start',
                    boxShadow: '0 8px 24px rgba(15, 46, 92, 0.02)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  className="product-card hover:scale-[1.03] hover:shadow-xl group"
                >
                  {/* Product Image Container */}
                  <div style={{
                    width: '100%',
                    height: '150px',
                    position: 'relative',
                    marginBottom: '24px',
                    background: '#faf7ef',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: '1px solid rgba(236, 216, 176, 0.2)'
                  }}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      style={{ objectFit: 'contain', padding: '16px', transition: 'transform 0.5s ease' }}
                      className="group-hover:scale-110"
                    />
                  </div>

                  {/* Product Info */}
                  <h3 style={{ 
                    fontFamily: 'var(--font-playfair), Georgia, serif',
                    fontSize: '1.2rem', 
                    fontWeight: 600, 
                    color: '#0f2e5c', 
                    marginBottom: '6px' 
                  }}>
                    {product.name}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '20px', fontWeight: 600 }}>
                    {product.volume}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: 'auto', gap: '16px' }}>
                    {/* Price */}
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f2e5c' }}>
                      {product.price}
                    </span>

                    {/* Order Button (Elegant 3D Bubble style matching request) */}
                    <button style={{
                      width: '100%',
                      height: '40px',
                      borderRadius: '12px',
                      background: 'linear-gradient(to bottom, #3b82f6 0%, #1d4ed8 100%)',
                      color: '#fff',
                      border: '1px solid rgba(29, 78, 216, 0.15)',
                      fontWeight: 500,
                      fontSize: '0.85rem',
                      textTransform: 'none',
                      cursor: 'pointer',
                      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.15), 0 4px 12px rgba(29, 78, 216, 0.15)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }} className="hover:scale-[1.02] hover:shadow-md">
                      Order Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scroll('right')}
              style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#fff',
                border: '1.5px solid rgba(15, 46, 92, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(15, 46, 92, 0.06)',
                color: '#0066cc',
                transition: 'background-color 0.2s, color 0.2s'
              }}
              className="hover:bg-[#e3f2fd] hover:text-[#0052a3]"
              aria-label="Scroll right"
            >
              <ChevronRight size={22} />
            </button>

          </div>
        </ScrollReveal>
      </div>

      <style>{`
        .products-scroll-container::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 600px) {
          .products-scroll-container {
            gap: 18px !important;
          }
        }
      `}</style>
    </section>
  )
}
