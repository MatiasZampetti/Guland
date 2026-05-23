'use client'

import { use, useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { dbToProduct, type DBProduct } from '@/lib/db-mapper'
import { type Product, type PaymentMethod, Size } from '@/types'
import { ProductGallery } from '@/components/product/product-gallery'
import { SizeSelector } from '@/components/product/size-selector'
import { AddToCartButton } from '@/components/product/add-to-cart-button'
import { Separator } from '@/components/ui/separator'

interface Props {
  params: Promise<{ slug: string }>
}

export default function ProductPage({ params }: Props) {
  const { slug } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [notFoundFlag, setNotFoundFlag] = useState(false)
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)

  useEffect(() => {
    fetch(`/api/products?slug=${slug}`)
      .then((r) => r.json())
      .then((data: DBProduct[]) => {
        if (!data?.length) { setNotFoundFlag(true); return }
        setProduct(dbToProduct(data[0]))
      })
      .catch(() => setNotFoundFlag(true))
  }, [slug])

  if (notFoundFlag) notFound()

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-5 py-8 sm:py-12">
      <nav className="mb-6 sm:mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/40 min-w-0">
        <Link href="/" className="hover:text-white shrink-0">Inicio</Link>
        <span className="shrink-0">/</span>
        <Link href={`/shop/${product.category}`} className="hover:text-white capitalize shrink-0">
          {product.category}
        </Link>
        <span className="shrink-0">/</span>
        <span className="text-white/80 truncate min-w-0">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:gap-12">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col gap-5 sm:gap-6">
          <div>
            <p className="mb-1 text-xs font-bold tracking-widest text-red-500">
              {product.category.toUpperCase()}
            </p>
            <h1 className="font-light" style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)' }}>
              {product.name}
            </h1>

            {/* Bloque informativo de precios */}
            <div className="mt-3">
              <p className="text-xl sm:text-2xl font-semibold text-white">
                ${product.price.toLocaleString('es-AR')}
              </p>
              <p className="mt-0.5 text-xs text-white/50">
                Tarjeta — 3x ${Math.round(product.price / 3).toLocaleString('es-AR')} cuotas s/i
              </p>
              <div className="mt-3 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2.5">
                <p className="text-base sm:text-lg font-semibold text-green-400">
                  ${Math.round(product.price * 0.85).toLocaleString('es-AR')}
                </p>
                <p className="text-xs text-green-400/70">
                  Efectivo o transferencia — 15% de descuento
                </p>
              </div>
            </div>

            {/* Selector de forma de pago */}
            <div className="mt-4 space-y-3">
              <p className="text-xs font-bold tracking-widest text-white/40">FORMA DE PAGO</p>

              {/* Botones principales */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod(paymentMethod?.startsWith('tarjeta') ? paymentMethod : 'tarjeta_1pago')}
                  className={`flex-1 rounded border px-3 py-2.5 text-xs font-semibold tracking-wide transition-colors ${
                    paymentMethod?.startsWith('tarjeta')
                      ? 'border-white bg-white text-black'
                      : 'border-white/20 text-white/60 hover:border-white/60 hover:text-white'
                  }`}
                >
                  Tarjeta
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('efectivo_transferencia')}
                  className={`flex-1 rounded border px-3 py-2.5 text-xs font-semibold tracking-wide transition-colors ${
                    paymentMethod === 'efectivo_transferencia'
                      ? 'border-green-400 bg-green-400/10 text-green-400'
                      : 'border-white/20 text-white/60 hover:border-white/60 hover:text-white'
                  }`}
                >
                  Efectivo / Transf.
                </button>
              </div>

              {/* Sub-opciones tarjeta */}
              {paymentMethod?.startsWith('tarjeta') && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('tarjeta_1pago')}
                    className={`flex-1 rounded border px-3 py-2 text-xs transition-colors ${
                      paymentMethod === 'tarjeta_1pago'
                        ? 'border-white/60 bg-white/10 text-white'
                        : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'
                    }`}
                  >
                    <span className="block font-semibold">${product.price.toLocaleString('es-AR')}</span>
                    <span className="block text-[10px] mt-0.5 opacity-70">1 pago</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('tarjeta_3cuotas')}
                    className={`flex-1 rounded border px-3 py-2 text-xs transition-colors ${
                      paymentMethod === 'tarjeta_3cuotas'
                        ? 'border-white/60 bg-white/10 text-white'
                        : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'
                    }`}
                  >
                    <span className="block font-semibold">3x ${Math.round(product.price / 3).toLocaleString('es-AR')}</span>
                    <span className="block text-[10px] mt-0.5 opacity-70">cuotas s/i</span>
                  </button>
                </div>
              )}

              {/* Info efectivo */}
              {paymentMethod === 'efectivo_transferencia' && (
                <div className="rounded border border-green-500/30 bg-green-500/10 px-3 py-2.5">
                  <p className="text-lg font-semibold text-green-400">
                    ${Math.round(product.price * 0.85).toLocaleString('es-AR')}
                  </p>
                  <p className="text-xs text-green-400/70">15% de descuento aplicado</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <SizeSelector
            available={product.sizes}
            selected={selectedSize}
            onSelect={setSelectedSize}
          />

          <AddToCartButton product={product} selectedSize={selectedSize} paymentMethod={paymentMethod} />

          <Separator />

          <div>
            <p className="mb-2 text-xs font-bold tracking-widest text-white/40">DESCRIPCIÓN</p>
            <p className="text-sm leading-relaxed text-white/60">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
