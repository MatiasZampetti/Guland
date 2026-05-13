import Link from 'next/link'
import { featuredProducts } from '@/lib/mock-data'
import { ProductCard } from '@/components/shop/product-card'
import { AnimatedTitle } from '@/components/ui/animated-title'

export function FeaturedProducts() {
  return (
    <section id="destacados" className="bg-[#0f0f0f] px-4 sm:px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 sm:mb-8 flex items-baseline justify-between gap-4">
          <AnimatedTitle
            className="text-4xl sm:text-5xl leading-none text-white md:text-7xl"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            DESTACADOS
          </AnimatedTitle>
          <Link
            href="/shop?filter=destacados"
            className="shrink-0 text-xs font-semibold tracking-widest text-white/40 underline underline-offset-4 hover:text-white transition-colors"
          >
            VER TODO →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} dark />
          ))}
        </div>
      </div>
    </section>
  )
}
