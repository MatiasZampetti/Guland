'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { products, categories } from '@/lib/mock-data'
import { Category, Size } from '@/types'
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

  const categoryData = categories.find((c) => c.slug === category)
  if (!categoryData) notFound()

  const [selectedSizes, setSelectedSizes] = useState<Size[]>([])
  const [selectedFilter, setSelectedFilter] = useState<ShopFilter>(null)

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
  }

  const filtered = products.filter((p) => {
    const matchesCat = p.category === (category as Category)
    const matchesSize = selectedSizes.length > 0 ? selectedSizes.some((s) => p.sizes.includes(s)) : true
    const matchesFilter =
      selectedFilter === 'destacados' ? !!p.featured :
      selectedFilter === 'new-drops' ? !!p.isNew :
      selectedFilter === 'sale' ? !!p.isOnSale :
      true
    return matchesCat && matchesSize && matchesFilter
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
    <div className="mx-auto max-w-7xl px-4 md:px-5 py-12">
      <div className="mb-8 md:mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-7xl leading-none md:text-9xl" style={{ fontFamily: 'var(--font-bebas)' }}>
            {categoryData.label.toUpperCase()}
          </h1>
          <p className="mt-1 text-xs font-semibold tracking-widest text-white/40">
            {filtered.length} PRODUCTOS
          </p>
        </div>

        {/* Botón filtros — solo mobile */}
        <Sheet>
          <SheetTrigger className="md:hidden flex items-center gap-2 rounded border border-white/20 px-3 py-2 text-xs font-semibold tracking-widest text-white/70 hover:border-white hover:text-white transition-colors">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            FILTROS
          </SheetTrigger>
          <SheetContent side="left" className="bg-[#0a0a0a] border-white/10 text-white w-72 p-6">
            <SheetHeader className="mb-6 p-0">
              <SheetTitle className="text-white text-xs font-bold tracking-widest">FILTROS</SheetTitle>
            </SheetHeader>
            <FiltersSidebar {...sidebarProps} hideHeader />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-12">
        {/* Sidebar — solo desktop */}
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
