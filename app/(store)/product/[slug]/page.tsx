'use client'

import { use, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { products } from '@/lib/mock-data'
import { Size } from '@/types'
import { ProductGallery } from '@/components/product/product-gallery'
import { SizeSelector } from '@/components/product/size-selector'
import { AddToCartButton } from '@/components/product/add-to-cart-button'
import { Separator } from '@/components/ui/separator'

interface Props {
  params: Promise<{ slug: string }>
}

export default function ProductPage({ params }: Props) {
  const { slug } = use(params)
  const product = products.find((p) => p.slug === slug)
  if (!product) notFound()

  const [selectedSize, setSelectedSize] = useState<Size | null>(null)

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <nav className="mb-8 flex gap-2 text-xs text-white/40">
        <Link href="/" className="hover:text-white">Inicio</Link>
        <span>/</span>
        <Link href={`/shop/${product.category}`} className="hover:text-white capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-white/80">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col gap-6">
          <div>
            <p className="mb-1 text-xs font-bold tracking-widest text-white/40">
              {product.category.toUpperCase()}
            </p>
            <h1 className="text-4xl font-light" style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.5rem' }}>
              {product.name}
            </h1>
            <p className="mt-3 text-2xl font-semibold">
              ${product.price.toLocaleString('es-AR')}
            </p>
          </div>

          <Separator />

          <SizeSelector
            available={product.sizes}
            selected={selectedSize}
            onSelect={setSelectedSize}
          />

          <AddToCartButton product={product} selectedSize={selectedSize} />

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
