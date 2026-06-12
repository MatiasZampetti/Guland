'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store'

export function ViewCartButton() {
  const count = useCartStore((s) => s.itemCount())
  const enabled = count > 0

  const base =
    'flex shrink-0 flex-col items-center justify-center gap-1 rounded-none px-5 text-[10px] font-semibold tracking-widest transition-colors'

  if (!enabled) {
    return (
      <button
        type="button"
        disabled
        className={`${base} cursor-not-allowed bg-white/10 text-white/30`}
      >
        <ShoppingCart className="h-5 w-5" />
        <span>VER CARRITO</span>
      </button>
    )
  }

  return (
    <Link href="/cart" className={`${base} bg-white text-black hover:bg-white/80`}>
      <ShoppingCart className="h-5 w-5" />
      <span>VER CARRITO</span>
    </Link>
  )
}
