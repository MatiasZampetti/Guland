import Link from 'next/link'
import { products } from '@/lib/mock-data'
import { ProductCard } from '@/components/shop/product-card'
import { AnimatedTitle } from '@/components/ui/animated-title'

export function NewDrop() {
  const newProducts = products.filter((p) => p.isNew).slice(0, 4)

  return (
    <section id="new-drop" className="bg-[#0f0f0f] px-4 sm:px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl">

        <div className="mb-6 sm:mb-8 flex items-baseline justify-between gap-4">
          <AnimatedTitle
            className="text-4xl sm:text-5xl leading-none text-white md:text-7xl"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            NEW DROPS
          </AnimatedTitle>
          <Link
            href="/shop?filter=new-drops"
            className="shrink-0 text-xs font-semibold tracking-widest text-white/40 underline underline-offset-4 hover:text-white transition-colors"
          >
            VER TODO →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} dark />
          ))}
        </div>
      </div>
    </section>
  )
}
