'use client'

import { useCartStore } from '@/lib/store'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

const WHATSAPP_NUMBER = '5493573498196'

const paymentLabels: Record<string, string> = {
  tarjeta_1pago: 'Tarjeta — 1 pago',
  tarjeta_3cuotas: 'Tarjeta — 3 cuotas sin interés',
  efectivo_transferencia: 'Efectivo / Transferencia (−15%)',
}

export function OrderSummary() {
  const items = useCartStore((s) => s.items)
  const paymentMethod = useCartStore((s) => s.paymentMethod)
  const total = useCartStore((s) => s.total())
  const baseTotal = useCartStore((s) => s.baseTotal())
  const shipping = total >= 30000 ? 0 : 3500

  const handleCheckout = () => {
    const lines = items.map((item) => {
      const unitPrice = paymentMethod === 'efectivo_transferencia'
        ? Math.round(item.product.price * 0.85)
        : item.product.price
      const lineTotal = unitPrice * item.quantity
      return `• ${item.product.name} — Talle: ${item.size} — Cant: ${item.quantity} — $${lineTotal.toLocaleString('es-AR')}`
    })

    const envio = shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-AR')}`
    const pagoLabel = paymentMethod ? paymentLabels[paymentMethod] : 'No especificado'

    // Para tarjeta 3 cuotas, mostrar también el valor de cada cuota
    const cuotaInfo = paymentMethod === 'tarjeta_3cuotas'
      ? ` (3x $${Math.round((total + shipping) / 3).toLocaleString('es-AR')})`
      : ''

    const message = [
      '¡Hola! Quiero realizar el siguiente pedido:',
      '',
      ...lines,
      '',
      `Envío: ${envio}`,
      `Forma de pago: ${pagoLabel}`,
      `*Total: $${(total + shipping).toLocaleString('es-AR')}${cuotaInfo}*`,
    ].join('\n')

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const isEfectivo = paymentMethod === 'efectivo_transferencia'
  const discount = baseTotal - total

  return (
    <div className="border border-white/10 bg-white/5 p-6">
      <p className="mb-6 text-xs font-bold tracking-[0.3em] text-white/40">RESUMEN DEL PEDIDO</p>

      {/* Forma de pago seleccionada */}
      {paymentMethod && (
        <div className="mb-4 rounded border border-white/10 bg-white/5 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Forma de pago</p>
          <p className="mt-0.5 text-xs font-medium text-white">{paymentLabels[paymentMethod]}</p>
        </div>
      )}

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-white/60">
          <span>Subtotal</span>
          <span>${baseTotal.toLocaleString('es-AR')}</span>
        </div>
        {isEfectivo && (
          <div className="flex justify-between text-green-400">
            <span>Descuento (15%)</span>
            <span>−${discount.toLocaleString('es-AR')}</span>
          </div>
        )}
        <div className="flex justify-between text-white/60">
          <span>Envío</span>
          <span>{shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-AR')}`}</span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between text-sm font-semibold">
        <span>Total</span>
        <span className={isEfectivo ? 'text-green-400' : ''}>
          ${(total + shipping).toLocaleString('es-AR')}
        </span>
      </div>

      {paymentMethod === 'tarjeta_3cuotas' && (
        <p className="mt-1.5 text-xs text-white/40">
          3x ${Math.round((total + shipping) / 3).toLocaleString('es-AR')} sin interés
        </p>
      )}

      {total < 30000 && (
        <p className="mt-3 text-xs text-white/40">
          Te faltan ${(30000 - total).toLocaleString('es-AR')} para envío gratis
        </p>
      )}

      <Button
        onClick={handleCheckout}
        className="mt-6 w-full rounded-none bg-[#25D366] py-6 text-xs font-bold tracking-widest hover:bg-[#1ebe5d] text-white"
      >
        FINALIZAR POR WHATSAPP →
      </Button>

      <p className="mt-3 text-center text-xs text-white/20">
        Te vamos a responder a la brevedad
      </p>
    </div>
  )
}
