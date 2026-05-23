'use client'

import { Minus, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store'
import { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, paymentMethod } = useCartStore()

  const unitPrice = paymentMethod === 'efectivo_transferencia'
    ? Math.round(item.product.price * 0.85)
    : item.product.price

  const lineTotal = unitPrice * item.quantity

  return (
    <div className="flex gap-3 sm:gap-4 py-4">
      <div className="h-24 w-18 sm:h-28 sm:w-20 shrink-0 overflow-hidden bg-white/5">
        <img
          src={item.product.images[0]}
          alt={item.product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 min-w-0 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-light truncate">{item.product.name}</p>
            <p className="mt-0.5 text-xs text-white/40">Talle: {item.size}</p>
          </div>
          <button
            onClick={() => removeItem(item.product.id, item.size)}
            className="shrink-0 p-1 text-white/30 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center border border-white/10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
              className="h-9 w-9 sm:h-8 sm:w-8 rounded-none"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
              className="h-9 w-9 sm:h-8 sm:w-8 rounded-none"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-light">${lineTotal.toLocaleString('es-AR')}</p>
            {paymentMethod === 'efectivo_transferencia' && (
              <p className="text-[10px] text-white/30 line-through">
                ${(item.product.price * item.quantity).toLocaleString('es-AR')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
