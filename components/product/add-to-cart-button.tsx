'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store'
import { Product, Size, PaymentMethod } from '@/types'

interface AddToCartButtonProps {
  product: Product
  selectedSize: Size | null
  paymentMethod: PaymentMethod
}

export function AddToCartButton({ product, selectedSize, paymentMethod }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem)
  const setPaymentMethodStore = useCartStore((s) => s.setPaymentMethod)
  const [added, setAdded] = useState(false)

  const canAdd = !!selectedSize && !!paymentMethod

  const handleAdd = () => {
    if (!canAdd) return
    addItem(product, selectedSize!)
    setPaymentMethodStore(paymentMethod)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const label = () => {
    if (!selectedSize) return 'SELECCIONÁ UN TALLE'
    if (!paymentMethod) return 'ELEGÍ FORMA DE PAGO'
    if (added) return 'AGREGADO ✓'
    return 'AGREGAR AL CARRITO'
  }

  return (
    <Button
      onClick={handleAdd}
      disabled={!canAdd}
      className={`w-full rounded-none py-6 text-xs tracking-widest transition-colors ${
        added
          ? 'bg-green-800 hover:bg-green-800'
          : 'bg-red-700 hover:bg-red-800'
      }`}
    >
      {label()}
    </Button>
  )
}
