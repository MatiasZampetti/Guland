'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { dbToProduct, hasStock, inStockSizes, type DBProduct } from '@/lib/db-mapper'
import { type Product } from '@/types'
import { Category, Size } from '@/types'
import { ProductGrid } from '@/components/shop/product-grid'
import { FiltersSidebar } from '@/components/shop/filters-sidebar'
import { AnimatedTitle } from '@/components/ui/animated-title'
import { SlidersHorizontal } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

type ShopFilter = 'destacados' | 'new-drops' | 'sale' | null

function ShopContent() {
  const searchParams = useSearchParams()
  const initialFilter = (searchParams.get('filter') as ShopFilter) ?? null

  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([])
  const [selectedFilter, setSelectedFilter] = useState<ShopFilter>(initialFilter)

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data: DBProduct[]) => { setAllProducts(data.map(dbToProduct)); setLoadingProducts(false) })
      .catch(() => setLoadingProducts(false))
  }, [])

  const handleSizeToggle = (size: Size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }

  const handleClear = () => {
    setSelectedCategory(null)
    setSelectedSizes([])
    setSelectedFilter(null)
  }

  const filtered = allProducts.filter((p) => {
    if (!hasStock(p)) return false
    const matchesCat = selectedCategory ? p.category === selectedCategory : true
    const matchesSize = selectedSizes.length > 0 ? selectedSizes.some((s) => inStockSizes(p).includes(s)) : true
    const matchesFilter =
      selectedFilter === 'destacados' ? !!p.featured :
      selectedFilter === 'new-drops' ? !!p.isNew :
      selectedFilter === 'sale' ? !!p.isOnSale :
      true
    return matchesCat && matchesSize && matchesFilter
  })

  const filterLabels: Record<NonNullable<ShopFilter>, string> = {
    destacados: 'DESTACADOS',
    'new-drops': 'NEW DROPS',
    sale: 'SALE',
  }

  const activeFilters = [
    selectedFilter ? filterLabels[selectedFilter] : null,
    selectedCategory ? selectedCategory.replace(/-/g, ' ').toUpperCase() : null,
    selectedSizes.length > 0 ? `TALLE ${selectedSizes.join(', ')}` : null,
  ].filter(Boolean)

  const sidebarProps = {
    selectedCategory,
    selectedSizes,
    selectedFilter,
    onCategoryChange: setSelectedCategory,
    onSizeToggle: handleSizeToggle,
    onFilterChange: setSelectedFilter,
    onClear: handleClear,
  }

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-5 py-12">
      <div className="mb-6 sm:mb-8 md:mb-10 flex items-end justify-between gap-4">
        <div>
          <AnimatedTitle as="h1" className="text-5xl sm:text-7xl leading-none md:text-9xl" style={{ fontFamily: 'var(--font-bebas)' }}>
            TIENDA
          </AnimatedTitle>
          {activeFilters.length > 0 && (
            <p className="mt-2 text-xs font-bold tracking-widest text-red-500">
              {activeFilters.join(' · ')}
            </p>
          )}
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

      <div className="flex gap-12">
        <div className="hidden md:block">
          <FiltersSidebar {...sidebarProps} />
        </div>
        <div className="flex-1 min-w-0">
          {loadingProducts ? (
            <div className="flex items-center justify-center py-24">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            </div>
          ) : (
            <ProductGrid products={filtered} />
          )}
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-white/40 text-sm">Cargando...</div>}>
      <ShopContent />
    </Suspense>
  )
}
