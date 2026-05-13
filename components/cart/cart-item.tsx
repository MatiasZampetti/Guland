'use client'

import { Minus, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store'
import { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  return (
    <div className="flex gap-4 py-4">
      <div className="h-24 w-20 shrink-0 overflow-hidden bg-white/5">
        <img
          src={item.product.images[0]}
          alt={item.product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-light">{item.product.name}</p>
            <p className="mt-0.5 text-xs text-white/40">Talle: {item.size}</p>
          </div>
          <button
            onClick={() => removeItem(item.product.id, item.size)}
            className="text-white/30 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center border border-white/10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
              className="h-8 w-8 rounded-none"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
              className="h-8 w-8 rounded-none"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-sm font-light">
            ${(item.product.price * item.quantity).toLocaleString('es-AR')}
          </p>
        </div>
      </div>
    </div>
  )
}
