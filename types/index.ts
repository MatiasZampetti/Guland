export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'

export type Category =
  | 'buzos'
  | 'camperas'
  | 'sweaters'
  | 'remeras'
  | 'jeans'
  | 'bermudas'

export interface Product {
  id: string
  slug: string
  name: string
  price: number
  category: Category
  images: string[]
  sizes: Size[]
  description: string
  featured?: boolean
  isNew?: boolean
  isOnSale?: boolean
}

export interface CartItem {
  product: Product
  size: Size
  quantity: number
}
