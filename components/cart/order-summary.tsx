'use client'

import { useCartStore } from '@/lib/store'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

const WHATSAPP_NUMBER = '5493573498196'

export function OrderSummary() {
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total())
  const shipping = total >= 30000 ? 0 : 3500

  const handleCheckout = () => {
    const lines = items.map(
      (item) =>
        `• ${item.product.name} — Talle: ${item.size} — Cant: ${item.quantity} — $${(item.product.price * item.quantity).toLocaleString('es-AR')}`
    )

    const envio = shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-AR')}`

    const message = [
      '¡Hola! Quiero realizar el siguiente pedido:',
      '',
      ...lines,
      '',
      `Envío: ${envio}`,
      `*Total: $${(total + shipping).toLocaleString('es-AR')}*`,
    ].join('\n')

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div className="border border-white/10 bg-white/5 p-6">
      <p className="mb-6 text-xs font-bold tracking-[0.3em] text-white/40">RESUMEN DEL PEDIDO</p>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-white/60">
          <span>Subtotal</span>
          <span>${total.toLocaleString('es-AR')}</span>
        </div>
        <div className="flex justify-between text-white/60">
          <span>Envío</span>
          <span>{shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-AR')}`}</span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between text-sm font-semibold">
        <span>Total</span>
        <span>${(total + shipping).toLocaleString('es-AR')}</span>
      </div>

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
