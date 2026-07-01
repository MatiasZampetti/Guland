import type { Product, Size, SizeGuide } from '@/types'

/**
 * Columnas necesarias para renderizar una card de producto (grilla / home).
 * Omite `description` (texto pesado que no se usa en las cards) para aligerar la query.
 */
export const CARD_COLUMNS =
  'id, slug, name, price, category_slug, images, sizes, stock, featured, is_new, is_on_sale, in_home, created_at'

export interface DBProduct {
  id: string
  slug: string
  name: string
  price: number
  category_slug: string
  description?: string
  images: string[]
  sizes: string[]
  stock?: Record<string, number> | null
  featured: boolean
  is_new: boolean
  is_on_sale: boolean
  in_home: boolean
  size_guide?: SizeGuide | null
  created_at: string
}

/** Talles con stock > 0. Si el producto no trackea stock, devuelve todos los talles. */
export function inStockSizes(p: Pick<Product, 'sizes' | 'stock'>): Size[] {
  const stock = p.stock ?? {}
  if (Object.keys(stock).length === 0) return p.sizes as Size[]
  return (p.sizes as Size[]).filter(s => (stock[s] ?? 0) > 0)
}

/** True si el producto tiene al menos un talle con stock. */
export function hasStock(p: Pick<Product, 'sizes' | 'stock'>): boolean {
  return inStockSizes(p).length > 0
}

export function dbToProduct(p: DBProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    category: p.category_slug,
    description: p.description ?? '',
    images: p.images,
    sizes: p.sizes as Size[],
    stock: p.stock ?? {},
    featured: p.featured,
    isNew: p.is_new,
    isOnSale: p.is_on_sale,
    inHome: p.in_home,
    sizeGuide: p.size_guide ?? undefined,
  }
}
