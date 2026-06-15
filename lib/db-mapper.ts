import type { Product, Size } from '@/types'

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
  created_at: string
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
  }
}
