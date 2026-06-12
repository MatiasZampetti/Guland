'use client'

import { create } from 'zustand'
import { ShippingMethod } from '@/types'
import {
  DEFAULT_SETTINGS,
  StoreSettings,
  ShippingZone,
  resolveShipping,
} from '@/lib/shipping'

interface SettingsStore extends StoreSettings {
  zones: ShippingZone[]
  loaded: boolean
  loading: boolean
  /** Carga la config desde la base una sola vez (idempotente). */
  load: () => Promise<void>
  /** Helper de cálculo de envío usando la config cargada. */
  shippingFor: (
    province: string | null,
    postalCode: string,
    method: ShippingMethod,
    baseTotal: number,
  ) => number | null
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...DEFAULT_SETTINGS,
  zones: [],
  loaded: false,
  loading: false,

  load: async () => {
    if (get().loaded || get().loading) return
    set({ loading: true })
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        set({ ...data.settings, zones: data.zones, loaded: true })
      }
    } catch {
      // Ante error de red se mantienen los defaults.
    } finally {
      set({ loading: false })
    }
  },

  shippingFor: (province, postalCode, method, baseTotal) =>
    resolveShipping(get().zones, get(), province, postalCode, method, baseTotal),
}))
