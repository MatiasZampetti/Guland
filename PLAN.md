# Plan: Guland E-Commerce — UI (Fase 1)

## Contexto
Tienda de ropa unisex **Guland** con estética minimal/clean. Stack: Next.js (App Router), shadcn/ui, Tailwind CSS, PostgreSQL + Prisma (backend en fase 2). Esta fase construye únicamente la UI con datos mock en TypeScript, sin lógica de servidor.

---

## Setup inicial

```bash
npx create-next-app@latest guland --typescript --tailwind --app --eslint
cd guland
npx shadcn@latest init
npx shadcn@latest add button card badge separator sheet input label select
npm install zustand
```

---

## Estructura del proyecto

```
guland/
├── app/
│   ├── layout.tsx                  # Root layout: Navbar + Footer + Providers
│   ├── globals.css
│   ├── page.tsx                    # Home / Landing
│   ├── shop/
│   │   ├── page.tsx                # Catálogo completo
│   │   └── [category]/page.tsx     # Catálogo filtrado por categoría
│   ├── product/
│   │   └── [slug]/page.tsx         # Detalle de producto
│   └── cart/
│       └── page.tsx                # Carrito + Checkout
├── components/
│   ├── layout/
│   │   ├── navbar.tsx              # Logo + nav links + cart icon con badge
│   │   └── footer.tsx
│   ├── home/
│   │   ├── hero.tsx                # Hero editorial full-width
│   │   ├── category-grid.tsx       # Grid de categorías con imagen
│   │   └── featured-products.tsx   # Fila de productos destacados
│   ├── shop/
│   │   ├── product-card.tsx        # Tarjeta con hover de segunda imagen
│   │   ├── product-grid.tsx        # Grid responsivo de ProductCards
│   │   └── filters-sidebar.tsx     # Filtros: categoría, talla, precio
│   ├── product/
│   │   ├── product-gallery.tsx     # Galería con thumbnails
│   │   ├── size-selector.tsx       # Selector de talles (XS–XXL)
│   │   └── add-to-cart-button.tsx
│   └── cart/
│       ├── cart-item.tsx
│       ├── order-summary.tsx
│       └── checkout-form.tsx
├── lib/
│   ├── mock-data.ts                # Productos y categorías ficticias
│   └── store.ts                   # Zustand cart store (estado global cliente)
└── types/
    └── index.ts                   # Product, Category, CartItem, Size
```

---

## Types (`types/index.ts`)

```ts
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'
export type Category = 'buzos' | 'camperas' | 'sweaters' | 'remeras' | 'jeans' | 'bermudas'

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
}

export interface CartItem {
  product: Product
  size: Size
  quantity: number
}
```

---

## Cart store (`lib/store.ts`)

Zustand store con:
- `items: CartItem[]`
- `addItem(product, size)` — suma quantity si ya existe el mismo producto+talle
- `removeItem(productId, size)`
- `updateQuantity(productId, size, quantity)`
- `clearCart()`
- `total` (computed)
- `itemCount` (computed, para badge en navbar)

---

## Diseño visual (Minimal / Clean)

| Token | Valor |
|---|---|
| Background | `#FFFFFF` |
| Text | `#111111` |
| Muted | `#6B7280` |
| Accent/Buttons | `#111111` |
| Border | `#E5E7EB` |

- **Tipografía:** Inter (Next.js font optimization)
- Headings: `font-light tracking-tight` — estilo editorial
- shadcn theme: neutral, `radius: 0.25rem`

---

## Páginas

### Home (`app/page.tsx`)
- **Hero**: imagen full-width con texto superpuesto centrado + CTA "Ver colección"
- **Category Grid**: 6 cards en grid 2×3 (mobile) / 3×2 (desktop), imagen + nombre de categoría
- **Featured Products**: fila horizontal de 4 productos con badge "NUEVO"

### Shop (`app/shop/page.tsx` y `[category]/page.tsx`)
- Layout: sidebar de filtros + grid principal
- Filtros: checkbox por categoría, botones de talla, rango de precio
- Grid: 2 cols mobile / 3 cols tablet / 4 cols desktop
- ProductCard: hover muestra segunda imagen, badge "NUEVO", nombre, precio
- URL params para filtros: `?category=jeans&size=M`

### Detalle de producto (`app/product/[slug]/page.tsx`)
- Layout 2 columnas: galería (izq) + info (der)
- Galería: imagen principal + thumbnails debajo
- Info: nombre, precio, descripción, selector de talle, botón agregar al carrito
- Breadcrumb: Inicio / Categoría / Producto

### Carrito (`app/cart/page.tsx`)
- Layout 2 columnas: lista de items (izq) + resumen del pedido (der)
- CartItem: imagen, nombre, talle, qty (+/−), subtotal, eliminar
- OrderSummary: subtotal, envío (a definir), total, botón "Continuar"
- CheckoutForm (placeholder): nombre, email, dirección, método de pago

### Navbar
- Izquierda: logo `GULAND` (tracking-widest)
- Centro: `SHOP / BUZOS / CAMPERAS / JEANS`
- Derecha: ícono búsqueda + ícono carrito con Badge de cantidad
- Mobile: Sheet drawer con menú completo

---

## Orden de implementación

1. `types/index.ts` + `lib/mock-data.ts` + `lib/store.ts`
2. Setup shadcn + theme (`globals.css` + `tailwind.config`)
3. `Navbar` + `Footer` + `app/layout.tsx`
4. `app/page.tsx` → Hero + CategoryGrid + FeaturedProducts
5. `app/shop/page.tsx` → ProductGrid + FiltersSidebar
6. `app/shop/[category]/page.tsx` → reutiliza componentes de shop
7. `app/product/[slug]/page.tsx` → Gallery + SizeSelector + AddToCart
8. `app/cart/page.tsx` → CartItem + OrderSummary + CheckoutForm

---

## Verificación

- Navegar Home → Shop → Product Detail → Cart sin errores
- Cart badge actualiza al agregar/remover items
- Filtros de categoría y talla actualizan el grid correctamente
- Responsive en mobile (375px), tablet (768px), desktop (1280px)
- Sin llamadas a servidor/DB (todo client-side con datos mock)
