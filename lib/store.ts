'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, PaymentMethod, Product, Size } from '@/types'

interface CartStore {
  items: CartItem[]
  paymentMethod: PaymentMethod
  addItem: (product: Product, size: Size) => void
  removeItem: (productId: string, size: Size) => void
  updateQuantity: (productId: string, size: Size, quantity: number) => void
  clearCart: () => void
  setPaymentMethod: (method: PaymentMethod) => void
  /** Total ya con descuento aplicado según forma de pago */
  total: () => number
  /** Total base sin descuento (precio de tarjeta) */
  baseTotal: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      paymentMethod: null,

      addItem: (product, size) => {
        const existing = get().items.find(
          (i) => i.product.id === product.id && i.size === size
        )
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.product.id === product.id && i.size === size
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          }))
        } else {
          set((state) => ({ items: [...state.items, { product, size, quantity: 1 }] }))
        }
      },

      removeItem: (productId, size) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product.id === productId && i.size === size)
          ),
        }))
      },

      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId && i.size === size ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => set({ items: [], paymentMethod: null }),

      setPaymentMethod: (method) => set({ paymentMethod: method }),

      baseTotal: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      total: () => {
        const base = get().baseTotal()
        return get().paymentMethod === 'efectivo_transferencia'
          ? Math.round(base * 0.85)
          : base
      },

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'guland-cart' }
  )
)
