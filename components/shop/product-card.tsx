import Link from 'next/link'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
  dark?: boolean
}

export function ProductCard({ product, dark = false }: ProductCardProps) {
  const textColor = dark ? 'text-white' : 'text-black'
  const mutedColor = dark ? 'text-white/40' : 'text-black/40'

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
        <p className={`text-[10px] sm:text-[11px] font-bold tracking-widest ${mutedColor}`}>
          {product.category.toUpperCase()}
        </p>
        <p className={`mt-0.5 text-xs sm:text-sm font-medium line-clamp-1 ${textColor}`}>{product.name}</p>
        <p className={`mt-0.5 text-xs sm:text-sm font-semibold ${textColor}`}>
          ${product.price.toLocaleString('es-AR')}
        </p>
      </div>
    </Link>
  )
}
