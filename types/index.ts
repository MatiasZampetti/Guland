export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'

/** Medidas (en cm) de un talle para la guía de talles. */
export interface SizeMeasurements {
  pecho: string
  cintura: string
  cadera: string
}

/**
 * Guía de talles editable por producto. Columnas fijas (pecho/cintura/cadera);
 * el admin completa los valores por talle. Campos vacíos => se usa el default.
 */
export interface SizeGuide {
  measurements: Partial<Record<Size, SizeMeasurements>>
  note?: string
}

export type Category = string

export type PaymentMethod =
  | 'tarjeta_1pago'
  | 'tarjeta_3cuotas'
  | 'efectivo_transferencia'
  | null

export type ShippingMethod = 'domicilio' | 'sucursal' | 'local' | null

export interface Product {
  id: string
  slug: string
  name: string
  price: number
  category: Category
  images: string[]
  sizes: Size[]
  stock?: Record<string, number>
  description: string
  featured?: boolean
  isNew?: boolean
  isOnSale?: boolean
  inHome?: boolean
  sizeGuide?: SizeGuide
}

export interface CartItem {
  product: Product
  size: Size
  quantity: number
}
