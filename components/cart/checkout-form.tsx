'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/lib/store'
import { useSettingsStore } from '@/lib/settings-store'
import { PaymentSelector } from '@/components/cart/payment-selector'
import { LocalityAutocomplete } from '@/components/cart/locality-autocomplete'

export function CheckoutForm() {
  const baseTotal = useCartStore((s) => s.baseTotal())
  const paymentMethod = useCartStore((s) => s.paymentMethod)
  const setPaymentMethod = useCartStore((s) => s.setPaymentMethod)
  const shippingMethod = useCartStore((s) => s.shippingMethod)
  const setShippingMethod = useCartStore((s) => s.setShippingMethod)
  const province = useCartStore((s) => s.province)
  const setProvince = useCartStore((s) => s.setProvince)
  const locality = useCartStore((s) => s.locality)
  const localityConfirmed = useCartStore((s) => s.localityConfirmed)
  const setLocality = useCartStore((s) => s.setLocality)
  const postalCode = useCartStore((s) => s.postalCode)

  const load = useSettingsStore((s) => s.load)
  const loaded = useSettingsStore((s) => s.loaded)
  const zones = useSettingsStore((s) => s.zones)
  const discountPercent = useSettingsStore((s) => s.cashDiscountPercent)
  const storeAddress = useSettingsStore((s) => s.storeAddress)
  const shippingFor = useSettingsStore((s) => s.shippingFor)

  useEffect(() => {
    load()
  }, [load])

  const shipping = shippingFor(province, postalCode, shippingMethod, baseTotal)

  return (
    <div className="border border-white/10 bg-white/5 p-6">
      <p className="mb-6 text-xs font-bold tracking-[0.3em] text-white/40">TUS DATOS</p>

      <div className="space-y-6">
        {/* Forma de pago */}
        <PaymentSelector
          basePrice={baseTotal}
          value={paymentMethod}
          onChange={setPaymentMethod}
          discountPercent={discountPercent}
        />

        {/* Método de envío */}
        <div className="space-y-3">
          <p className="text-xs font-bold tracking-widest text-white/40">ENVÍO</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShippingMethod('domicilio')}
              className={`flex-1 rounded border px-3 py-2.5 text-xs font-semibold tracking-wide transition-colors ${
                shippingMethod === 'domicilio'
                  ? 'border-white bg-white text-black'
                  : 'border-white/20 text-white/60 hover:border-white/60 hover:text-white'
              }`}
            >
              A domicilio
            </button>
            <button
              type="button"
              onClick={() => setShippingMethod('sucursal')}
              className={`flex-1 rounded border px-3 py-2.5 text-xs font-semibold tracking-wide transition-colors ${
                shippingMethod === 'sucursal'
                  ? 'border-white bg-white text-black'
                  : 'border-white/20 text-white/60 hover:border-white/60 hover:text-white'
              }`}
            >
              A sucursal
            </button>
            <button
              type="button"
              onClick={() => setShippingMethod('local')}
              className={`flex-1 rounded border px-3 py-2.5 text-xs font-semibold tracking-wide transition-colors ${
                shippingMethod === 'local'
                  ? 'border-white bg-white text-black'
                  : 'border-white/20 text-white/60 hover:border-white/60 hover:text-white'
              }`}
            >
              Retiro por local
            </button>
          </div>
        </div>

        {/* Ubicación */}
        <div className="space-y-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wider text-white/50">PROVINCIA</label>
            <select
              value={province ?? ''}
              onChange={(e) => setProvince(e.target.value || null)}
              disabled={!loaded || shippingMethod === 'local'}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-red-600 disabled:opacity-50"
            >
              <option value="" className="bg-[#0f0f0f]">
                {loaded ? 'Elegí tu provincia' : 'Cargando...'}
              </option>
              {zones.map((z) => (
                <option key={z.id} value={z.name} className="bg-[#0f0f0f]">
                  {z.name}
                </option>
              ))}
              {shippingMethod === 'local' && (
                <option value="Córdoba" className="bg-[#0f0f0f]">Córdoba</option>
              )}
            </select>
          </div>

          {shippingMethod === 'local' ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wider text-white/50">LOCALIDAD</label>
              <input
                value="Villa del Rosario"
                disabled
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white opacity-50 outline-none"
              />
            </div>
          ) : (
            <LocalityAutocomplete
              province={province}
              value={locality}
              confirmed={localityConfirmed}
              onChange={setLocality}
            />
          )}
        </div>

        {/* Dirección del local (solo para retiro) */}
        {shippingMethod === 'local' && storeAddress && (
          <div className="rounded border border-white/10 bg-white/5 px-3 py-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Dirección</p>
            <p className="mt-1 text-sm text-white">{storeAddress}</p>
          </div>
        )}

        {/* Envío estimado */}
        {shipping !== null && (
          <div className="rounded border border-white/10 bg-white/5 px-3 py-2.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                {shippingMethod === 'local' ? 'Envío' : 'Envío estimado'}
              </p>
              <p className="text-sm font-semibold text-white">
                {shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-AR')}`}
              </p>
            </div>
            {shippingMethod !== 'local' && (
              <p className="mt-1 text-[11px] text-white/40">
                El costo final lo confirmamos por WhatsApp.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
