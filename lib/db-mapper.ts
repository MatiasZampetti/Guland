import type { Product, Size } from '@/types'

export interface DBProduct {
  id: string
  slug: string
  name: string
  price: number
  category_slug: string
  description: string
  images: string[]
  sizes: string[]
  stock?: Record<string, number> | null
  featured: boolean
  is_new: boolean
  is_on_sale: boolean
  created_at: string
}

export function dbToProduct(p: DBProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    category: p.category_slug,
    description: p.description,
    images: p.images,
    sizes: p.sizes as Size[],
    stock: p.stock ?? {},
    featured: p.featured,
    isNew: p.is_new,
    isOnSale: p.is_on_sale,
  }
}
