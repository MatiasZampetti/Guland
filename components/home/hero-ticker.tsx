'use client'

import { useEffect } from 'react'
import { useSettingsStore } from '@/lib/settings-store'

export function HeroTicker() {
  const load = useSettingsStore((s) => s.load)
  const freeShippingThreshold = useSettingsStore((s) => s.freeShippingThreshold)
  const freeShippingEnabled = freeShippingThreshold > 0

  useEffect(() => { load() }, [load])

  const envioText = freeShippingEnabled
    ? `ENVÍO GRATIS +$${freeShippingThreshold.toLocaleString('es-AR')}`
    : 'ENVÍOS A TODO EL PAÍS'

  const text = `GULAND CLOTHES • ${envioText} • 3 CUOTAS SIN INTERÉS • DESCUENTO EN EFECTIVO Y TRANSFERENCIA • `

  return (
    <div className="absolute bottom-0 inset-x-0 overflow-hidden bg-red-700 py-2.5">
      <div className="flex whitespace-nowrap animate-ticker">
        {[...Array(2)].map((_, i) => (
          <span
            key={i}
            className="text-white/90"
            style={{ fontFamily: 'var(--font-bebas)', fontSize: '0.95rem', letterSpacing: '0.15em' }}
          >
            {text}{text}{text}
          </span>
        ))}
      </div>
    </div>
  )
}
