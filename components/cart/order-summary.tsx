'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useSettingsStore } from '@/lib/settings-store'
import { clampPercent } from '@/lib/shipping'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

const paymentLabels: Record<string, string> = {
  tarjeta_1pago: 'Tarjeta — 1 pago',
  tarjeta_3cuotas: 'Tarjeta — 3 cuotas sin interés',
  efectivo_transferencia: 'Efectivo / Transferencia',
}

const shippingLabels: Record<string, string> = {
  domicilio: 'A domicilio',
  sucursal: 'A sucursal',
  local: 'Retiro por local',
}

export function OrderSummary() {
  const items = useCartStore((s) => s.items)
  const paymentMethod = useCartStore((s) => s.paymentMethod)
  const shippingMethod = useCartStore((s) => s.shippingMethod)
  const province = useCartStore((s) => s.province)
  const locality = useCartStore((s) => s.locality)
  const localityConfirmed = useCartStore((s) => s.localityConfirmed)
  const postalCode = useCartStore((s) => s.postalCode)
  const total = useCartStore((s) => s.total())
  const baseTotal = useCartStore((s) => s.baseTotal())

  const load = useSettingsStore((s) => s.load)
  const whatsappNumber = useSettingsStore((s) => s.whatsappNumber)
  const freeShippingThreshold = useSettingsStore((s) => s.freeShippingThreshold)
  const discountPercent = clampPercent(useSettingsStore((s) => s.cashDiscountPercent))
  const storeAddress = useSettingsStore((s) => s.storeAddress)
  const shippingFor = useSettingsStore((s) => s.shippingFor)

  useEffect(() => {
    load()
  }, [load])

  const shipping = shippingFor(province, postalCode, shippingMethod, baseTotal)

  const isReady =
    !!paymentMethod &&
    !!shippingMethod &&
    !!province &&
    locality.trim() !== '' &&
    localityConfirmed

  const efectivoLabel = `Efectivo / Transferencia (−${discountPercent}%)`
  const pagoLabelOf = (m: string) =>
    m === 'efectivo_transferencia' ? efectivoLabel : paymentLabels[m]

  const handleCheckout = () => {
    if (!isReady || shipping === null) return

    const lines = items.map((item) => {
      const unitPrice = paymentMethod === 'efectivo_transferencia'
        ? Math.round(item.product.price * (1 - discountPercent / 100))
        : item.product.price
      const lineTotal = unitPrice * item.quantity
      return `• ${item.product.name} — Talle: ${item.size} — Cant: ${item.quantity} — $${lineTotal.toLocaleString('es-AR')}`
    })

    const envioCosto = shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-AR')}`
    const envioMetodo = shippingMethod ? shippingLabels[shippingMethod] : ''
    const pagoLabel = paymentMethod ? pagoLabelOf(paymentMethod) : 'No especificado'

    const cuotaInfo = paymentMethod === 'tarjeta_3cuotas'
      ? ` (3x $${Math.round((total + shipping) / 3).toLocaleString('es-AR')})`
      : ''

    const message = [
      '¡Hola! Quiero realizar el siguiente pedido:',
      '',
      ...lines,
      '',
      shippingMethod === 'local' && storeAddress
        ? `Envío: ${envioMetodo} — ${province}, ${locality}, ${storeAddress} —`
        : `Envío: ${envioMetodo} — ${province}, ${locality}`,
      `Costo de envío: ${envioCosto} (a confirmar)`,
      `Forma de pago: ${pagoLabel}`,
      `*Total: $${(total + shipping).toLocaleString('es-AR')}${cuotaInfo}*`,
    ].join('\n')

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const isEfectivo = paymentMethod === 'efectivo_transferencia'
  const discount = baseTotal - total
  const finalTotal = total + (shipping ?? 0)
  const freeShippingEnabled = freeShippingThreshold > 0
  const faltaParaGratis = freeShippingThreshold - total

  return (
    <div className="border border-white/10 bg-white/5 p-6">
      <p className="mb-6 text-xs font-bold tracking-[0.3em] text-white/40">RESUMEN DEL PEDIDO</p>

      {/* Forma de pago seleccionada */}
      {paymentMethod && (
        <div className="mb-4 rounded border border-white/10 bg-white/5 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Forma de pago</p>
          <p className="mt-0.5 text-xs font-medium text-white">{pagoLabelOf(paymentMethod)}</p>
        </div>
      )}

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-white/60">
          <span>Subtotal</span>
          <span>${baseTotal.toLocaleString('es-AR')}</span>
        </div>
        {isEfectivo && (
          <div className="flex justify-between text-green-400">
            <span>Descuento ({discountPercent}%)</span>
            <span>−${discount.toLocaleString('es-AR')}</span>
          </div>
        )}
        <div className="flex justify-between text-white/60">
          <span>Envío</span>
          <span>
            {shipping === null
              ? 'A calcular'
              : shipping === 0
                ? 'Gratis'
                : `$${shipping.toLocaleString('es-AR')}`}
          </span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between text-sm font-semibold">
        <span>Total</span>
        <span className={isEfectivo ? 'text-green-400' : ''}>
          ${finalTotal.toLocaleString('es-AR')}
        </span>
      </div>

      {paymentMethod === 'tarjeta_3cuotas' && (
        <p className="mt-1.5 text-xs text-white/40">
          3x ${Math.round(finalTotal / 3).toLocaleString('es-AR')} sin interés
        </p>
      )}

      {freeShippingEnabled && faltaParaGratis > 0 && (
        <p className="mt-3 text-xs text-white/40">
          Te faltan ${faltaParaGratis.toLocaleString('es-AR')} para envío gratis
        </p>
      )}

      {!isReady && (
        <div className="mt-6 flex items-start gap-2 rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2.5">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <p className="text-xs text-amber-400">
            Es obligatorio completar tus datos antes de finalizar la compra por WhatsApp.
          </p>
        </div>
      )}

      <Button
        onClick={handleCheckout}
        disabled={!isReady}
        className="mt-4 w-full rounded-none bg-[#25D366] py-6 text-xs font-bold tracking-widest hover:bg-[#1ebe5d] text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#25D366]"
      >
        FINALIZAR POR WHATSAPP →
      </Button>

      {isReady && (
        <p className="mt-3 text-center text-xs text-white/20">
          Te vamos a responder a la brevedad
        </p>
      )}
    </div>
  )
}
