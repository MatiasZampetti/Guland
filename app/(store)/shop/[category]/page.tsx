'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { dbToProduct, hasStock, inStockSizes, type DBProduct } from '@/lib/db-mapper'
import { type Product, Category, Size } from '@/types'
import { ProductGrid } from '@/components/shop/product-grid'
import { FiltersSidebar } from '@/components/shop/filters-sidebar'
import { SlidersHorizontal } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

type ShopFilter = 'destacados' | 'new-drops' | 'sale' | null

interface Props {
  params: Promise<{ category: string }>
}

export default function CategoryPage({ params }: Props) {
  const { category } = use(params)
  const router = useRouter()

  const [categoryLabel, setCategoryLabel] = useState<string | null>(null)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [notFoundFlag, setNotFoundFlag] = useState(false)
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([])
  const [selectedFilter, setSelectedFilter] = useState<ShopFilter>(null)

  useEffect(() => {
    // Validate category and load products in parallel
    Promise.all([
      fetch('/api/categories').then((r) => r.json()),
      fetch(`/api/products?category_slug=${category}`).then((r) => r.json()),
    ]).then(([cats, prods]) => {
      const cat = cats.find((c: { slug: string; label: string }) => c.slug === category)
      if (!cat) { setNotFoundFlag(true); return }
      setCategoryLabel(cat.label)
      setAllProducts((prods as DBProduct[]).map(dbToProduct))
    })
  }, [category])

  if (notFoundFlag) notFound()

  const handleSizeToggle = (size: Size) =>
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )

  const handleCategoryChange = (cat: Category | null) => {
    setSelectedSizes([])
    setSelectedFilter(null)
    router.push(cat ? `/shop/${cat}` : '/shop')
  }

  const handleClear = () => {
    setSelectedSizes([])
    setSelectedFilter(null)
    router.push('/shop')
  }

  const filtered = allProducts.filter((p) => {
    if (!hasStock(p)) return false
    const matchesSize = selectedSizes.length > 0 ? selectedSizes.some((s) => inStockSizes(p).includes(s)) : true
    const matchesFilter =
      selectedFilter === 'destacados' ? !!p.featured :
      selectedFilter === 'new-drops' ? !!p.isNew :
      selectedFilter === 'sale' ? !!p.isOnSale :
      true
    return matchesSize && matchesFilter
  })

  const sidebarProps = {
    selectedCategory: category as Category,
    selectedSizes,
    selectedFilter,
    onCategoryChange: handleCategoryChange,
    onSizeToggle: handleSizeToggle,
    onFilterChange: setSelectedFilter,
    onClear: handleClear,
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-5 py-8 sm:py-12">
      <div className="mb-6 sm:mb-8 md:mb-10 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl sm:text-7xl leading-none md:text-9xl" style={{ fontFamily: 'var(--font-bebas)' }}>
            {categoryLabel ? categoryLabel.toUpperCase() : category.toUpperCase()}
          </h1>
          <p className="mt-1 text-xs font-semibold tracking-widest text-white/40">
            {filtered.length} PRODUCTOS
          </p>
        </div>

        <Sheet>
          <SheetTrigger className="md:hidden shrink-0 flex items-center gap-2 rounded border border-white/20 px-3 py-2 text-xs font-semibold tracking-widest text-white/70 hover:border-white hover:text-white transition-colors min-h-[44px]">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            FILTROS
          </SheetTrigger>
          <SheetContent side="left" className="bg-[#0a0a0a] border-white/10 text-white w-[min(18rem,85vw)] p-6">
            <SheetHeader className="mb-6 p-0">
              <SheetTitle className="text-white text-xs font-bold tracking-widest">FILTROS</SheetTitle>
            </SheetHeader>
            <FiltersSidebar {...sidebarProps} hideHeader />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-8 sm:gap-12">
        <div className="hidden md:block">
          <FiltersSidebar {...sidebarProps} />
        </div>
        <div className="flex-1 min-w-0">
          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  )
}
