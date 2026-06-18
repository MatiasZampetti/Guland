'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, PaymentMethod, Product, ShippingMethod, Size } from '@/types'
import { useSettingsStore } from '@/lib/settings-store'
import { clampPercent } from '@/lib/shipping'

interface CartStore {
  items: CartItem[]
  paymentMethod: PaymentMethod
  shippingMethod: ShippingMethod
  province: string | null
  locality: string
  /** true solo cuando la localidad fue elegida de la lista (no texto libre suelto). */
  localityConfirmed: boolean
  postalCode: string
  addItem: (product: Product, size: Size) => void
  removeItem: (productId: string, size: Size) => void
  updateQuantity: (productId: string, size: Size, quantity: number) => void
  clearCart: () => void
  setPaymentMethod: (method: PaymentMethod) => void
  setShippingMethod: (method: ShippingMethod) => void
  setProvince: (province: string | null) => void
  setLocality: (locality: string, confirmed?: boolean) => void
  setPostalCode: (postalCode: string) => void
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
      shippingMethod: null,
      province: null,
      locality: '',
      localityConfirmed: false,
      postalCode: '',

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
        set((state) => {
          const items = state.items.filter(
            (i) => !(i.product.id === productId && i.size === size)
          )
          // Al quedar el carrito vacío, también se limpian los datos del checkout
          // para que un carrito nuevo arranque en blanco.
          if (items.length === 0) {
            return { items, paymentMethod: null, shippingMethod: null, province: null, locality: '', localityConfirmed: false, postalCode: '' }
          }
          return { items }
        })
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

      clearCart: () =>
        set({
          items: [],
          paymentMethod: null,
          shippingMethod: null,
          province: null,
          locality: '',
          localityConfirmed: false,
          postalCode: '',
        }),

      setPaymentMethod: (method) => set({ paymentMethod: method }),

      setShippingMethod: (method) => set({ shippingMethod: method }),

      // Al cambiar de provincia, la localidad elegida deja de ser válida.
      setProvince: (province) =>
        set({ province, locality: '', localityConfirmed: false }),

      setLocality: (locality, confirmed = false) =>
        set({ locality, localityConfirmed: confirmed }),

      setPostalCode: (postalCode) => set({ postalCode }),

      baseTotal: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      total: () => {
        const base = get().baseTotal()
        if (get().paymentMethod !== 'efectivo_transferencia') return base
        const pct = clampPercent(useSettingsStore.getState().cashDiscountPercent)
        return Math.round(base * (1 - pct / 100))
      },

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'guland-cart' }
  )
)
