import Link from 'next/link'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
  dark?: boolean
  /** En modo catálogo (home) se ocultan los precios */
  catalog?: boolean
}

export function ProductCard({ product, catalog = false }: ProductCardProps) {
  const cashPrice = Math.round(product.price * 0.85)
  const installment = Math.round(product.price / 3)

  return (
    <Link href={`/product/${product.slug}`} className="group block">

      {/* Imagen — ambas absolute para evitar bug de hover */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-0"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} — vista alternativa`}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
        )}
        {product.isNew && (
          <span className="absolute left-3 top-3 z-10 bg-black px-2.5 py-1 text-[10px] font-bold tracking-widest text-white">
            NUEVO
          </span>
        )}
      </div>

      {/* Info */}
      <div className="mt-2 sm:mt-3">
        {/* Categoría en rojo */}
        <p className="text-[10px] sm:text-[11px] font-bold tracking-widest text-red-500">
          {product.category.toUpperCase()}
        </p>

        {/* Nombre en blanco */}
        <p className="mt-0.5 text-xs sm:text-sm font-medium line-clamp-1 text-white">
          {product.name}
        </p>

        {/* Precios — solo en /shop, no en home */}
        {!catalog && (
          <>
            <p className="mt-0.5 text-xs sm:text-sm font-semibold text-white">
              ${product.price.toLocaleString('es-AR')}
              <span className="ml-1.5 text-[10px] font-normal text-white/50">
                3x ${installment.toLocaleString('es-AR')} cuotas s/i
              </span>
            </p>
            <p className="mt-0.5 text-[10px] sm:text-[11px] text-green-400">
              Efec./transf. ${cashPrice.toLocaleString('es-AR')}
              <span className="ml-1 text-white/40">−15%</span>
            </p>
          </>
        )}
      </div>
    </Link>
  )
}
