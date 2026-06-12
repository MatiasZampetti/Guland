'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store'
import { Product, Size } from '@/types'

interface AddToCartButtonProps {
  product: Product
  selectedSize: Size | null
}

export function AddToCartButton({ product, selectedSize }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)

  const canAdd = !!selectedSize

  const handleAdd = () => {
    if (!canAdd) return
    addItem(product, selectedSize!)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const label = () => {
    if (!selectedSize) return 'SELECCIONÁ UN TALLE'
    if (added) return 'AGREGADO ✓'
    return 'AGREGAR AL CARRITO'
  }

  return (
    <Button
      onClick={handleAdd}
      disabled={!canAdd}
      className={`flex-1 rounded-none py-6 text-xs tracking-widest transition-colors ${
        added
          ? 'bg-green-800 hover:bg-green-800'
          : 'bg-red-700 hover:bg-red-800'
      }`}
    >
      {label()}
    </Button>
  )
}
