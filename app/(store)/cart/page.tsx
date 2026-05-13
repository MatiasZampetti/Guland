'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { CartItem } from '@/components/cart/cart-item'
import { OrderSummary } from '@/components/cart/order-summary'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { AnimatedTitle } from '@/components/ui/animated-title'

export default function CartPage() {
  const items = useCartStore((s) => s.items)

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-5 py-20 sm:py-32 text-center">
        <AnimatedTitle as="h1" className="text-4xl sm:text-6xl text-white" style={{ fontFamily: 'var(--font-bebas)' }}>
          TU CARRITO ESTÁ VACÍO
        </AnimatedTitle>
        <p className="mt-3 text-sm text-white/40">Todavía no agregaste nada.</p>
        <Link href="/shop" className="mt-8">
          <Button className="rounded-full bg-red-700 px-8 sm:px-10 py-5 text-xs font-bold tracking-widest text-white hover:opacity-80 min-h-[44px]">
            IR AL SHOP →
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-5 py-8 sm:py-12">
      <AnimatedTitle as="h1" className="mb-1 text-6xl sm:text-7xl leading-none md:text-9xl" style={{ fontFamily: 'var(--font-bebas)' }}>
        CARRITO
      </AnimatedTitle>
      <p className="mb-8 sm:mb-10 text-xs font-semibold tracking-widest text-white/40">
        {items.length} {items.length === 1 ? 'PRODUCTO' : 'PRODUCTOS'}
      </p>
      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {items.map((item, i) => (
            <div key={`${item.product.id}-${item.size}`}>
              <CartItem item={item} />
              {i < items.length - 1 && <Separator />}
            </div>
          ))}
          <Separator className="mt-4" />
          <Link href="/shop" className="mt-4 inline-block text-xs font-semibold tracking-widest text-white/40 underline underline-offset-4 hover:text-white transition-colors">
            ← SEGUIR COMPRANDO
          </Link>
        </div>
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  )
}
