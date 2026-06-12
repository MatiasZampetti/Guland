'use client'

import { PaymentMethod } from '@/types'
import { clampPercent } from '@/lib/shipping'

interface PaymentSelectorProps {
  /** Monto base sobre el que se muestran los importes (precio o total del carrito). */
  basePrice: number
  value: PaymentMethod
  onChange: (method: PaymentMethod) => void
  /** Porcentaje de descuento por efectivo/transferencia. */
  discountPercent?: number
}

export function PaymentSelector({ basePrice, value, onChange, discountPercent = 15 }: PaymentSelectorProps) {
  const pct = clampPercent(discountPercent)
  const discounted = Math.round(basePrice * (1 - pct / 100))
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold tracking-widest text-white/40">FORMA DE PAGO</p>

      {/* Botones principales */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(value?.startsWith('tarjeta') ? value : 'tarjeta_1pago')}
          className={`flex-1 rounded border px-3 py-2.5 text-xs font-semibold tracking-wide transition-colors ${
            value?.startsWith('tarjeta')
              ? 'border-white bg-white text-black'
              : 'border-white/20 text-white/60 hover:border-white/60 hover:text-white'
          }`}
        >
          Tarjeta
        </button>
        <button
          type="button"
          onClick={() => onChange('efectivo_transferencia')}
          className={`flex-1 rounded border px-3 py-2.5 text-xs font-semibold tracking-wide transition-colors ${
            value === 'efectivo_transferencia'
              ? 'border-green-400 bg-green-400/10 text-green-400'
              : 'border-white/20 text-white/60 hover:border-white/60 hover:text-white'
          }`}
        >
          Efectivo / Transf.
        </button>
      </div>

      {/* Sub-opciones tarjeta */}
      {value?.startsWith('tarjeta') && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange('tarjeta_1pago')}
            className={`flex-1 rounded border px-3 py-2 text-xs transition-colors ${
              value === 'tarjeta_1pago'
                ? 'border-white/60 bg-white/10 text-white'
                : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'
            }`}
          >
            <span className="block font-semibold">${basePrice.toLocaleString('es-AR')}</span>
            <span className="block text-[10px] mt-0.5 opacity-70">1 pago</span>
          </button>
          <button
            type="button"
            onClick={() => onChange('tarjeta_3cuotas')}
            className={`flex-1 rounded border px-3 py-2 text-xs transition-colors ${
              value === 'tarjeta_3cuotas'
                ? 'border-white/60 bg-white/10 text-white'
                : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'
            }`}
          >
            <span className="block font-semibold">3x ${Math.round(basePrice / 3).toLocaleString('es-AR')}</span>
            <span className="block text-[10px] mt-0.5 opacity-70">cuotas s/i</span>
          </button>
        </div>
      )}

      {/* Info efectivo */}
      {value === 'efectivo_transferencia' && (
        <div className="rounded border border-green-500/30 bg-green-500/10 px-3 py-2.5">
          <p className="text-lg font-semibold text-green-400">
            ${discounted.toLocaleString('es-AR')}
          </p>
          <p className="text-xs text-green-400/70">{pct}% de descuento aplicado</p>
        </div>
      )}
    </div>
  )
}
