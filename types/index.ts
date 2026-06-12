export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'

export type Category = string

export type PaymentMethod =
  | 'tarjeta_1pago'
  | 'tarjeta_3cuotas'
  | 'efectivo_transferencia'
  | null

export type ShippingMethod = 'domicilio' | 'sucursal' | null

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
}

export interface CartItem {
  product: Product
  size: Size
  quantity: number
}
