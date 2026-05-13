'use client'

import { Category, Size } from '@/types'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

type ShopFilter = 'destacados' | 'new-drops' | 'sale' | null

const categories: { slug: Category; label: string }[] = [
  { slug: 'buzos', label: 'Buzos' },
  { slug: 'camperas', label: 'Camperas' },
  { slug: 'sweaters', label: 'Sweaters' },
  { slug: 'remeras', label: 'Remeras' },
  { slug: 'jeans', label: 'Jeans' },
  { slug: 'bermudas', label: 'Bermudas' },
]

const sizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

interface FiltersSidebarProps {
  selectedCategory: Category | null
  selectedSizes: Size[]
  selectedFilter: ShopFilter
  onCategoryChange: (cat: Category | null) => void
  onSizeToggle: (size: Size) => void
  onFilterChange: (filter: ShopFilter) => void
  onClear: () => void
  hideHeader?: boolean
}

export function FiltersSidebar({
  selectedCategory,
  selectedSizes,
  selectedFilter,
  onCategoryChange,
  onSizeToggle,
  onFilterChange,
  onClear,
  hideHeader,
}: FiltersSidebarProps) {
  const hasFilters = selectedCategory || selectedSizes.length > 0 || selectedFilter

  return (
    <aside className="w-48 shrink-0">
      {!hideHeader && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs tracking-widest text-white/80">FILTROS</p>
          {hasFilters && (
            <button
              onClick={onClear}
              className="rounded border border-white/20 px-2.5 py-1 text-[10px] font-semibold tracking-widest text-white/60 transition-colors hover:border-white hover:text-white"
            >
              LIMPIAR
            </button>
          )}
        </div>
      )}
      {hideHeader && hasFilters && (
        <div className="flex justify-end mb-6">
          <button
            onClick={onClear}
            className="rounded border border-white/20 px-2.5 py-1 text-[10px] font-semibold tracking-widest text-white/60 transition-colors hover:border-white hover:text-white"
          >
            LIMPIAR
          </button>
        </div>
      )}

      {/* New In / Sale */}
      <div className="mb-6 flex flex-col gap-2">
        <button
          onClick={() => onFilterChange(selectedFilter === 'destacados' ? null : 'destacados')}
          className={`text-left text-xs font-bold tracking-widest transition-colors ${
            selectedFilter === 'destacados' ? 'text-red-500' : 'text-white/50 hover:text-white'
          }`}
        >
          DESTACADOS
        </button>
        <button
          onClick={() => onFilterChange(selectedFilter === 'new-drops' ? null : 'new-drops')}
          className={`text-left text-xs font-bold tracking-widest transition-colors ${
            selectedFilter === 'new-drops' ? 'text-red-500' : 'text-white/50 hover:text-white'
          }`}
        >
          NEW DROPS
        </button>
        <button
          onClick={() => onFilterChange(selectedFilter === 'sale' ? null : 'sale')}
          className={`text-left text-xs font-bold tracking-widest transition-colors ${
            selectedFilter === 'sale' ? 'text-red-500' : 'text-white/50 hover:text-white'
          }`}
        >
          SALE
        </button>
      </div>

      <Separator className="mb-6" />

      {/* Categorías */}
      <div className="mb-6">
        <p className="mb-3 text-xs font-medium tracking-wider text-white/30">CATEGORÍA</p>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onCategoryChange(null)}
              className={`text-sm transition-colors ${
                selectedCategory === null ? 'text-white font-medium' : 'text-white/40 hover:text-white'
              }`}
            >
              Todas
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.slug}>
              <button
                onClick={() => onCategoryChange(cat.slug)}
                className={`text-sm transition-colors ${
                  selectedCategory === cat.slug
                    ? 'text-white font-medium'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Separator className="mb-6" />

      {/* Talles */}
      <div>
        <p className="mb-3 text-xs font-medium tracking-wider text-white/30">TALLE</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <Button
              key={size}
              variant="outline"
              size="sm"
              onClick={() => onSizeToggle(size)}
              className={`h-8 w-10 rounded-none text-xs p-0 ${
                selectedSizes.includes(size)
                  ? 'bg-red-700 text-white border-red-700 hover:bg-red-700 hover:text-white'
                  : 'text-white/50 hover:border-white hover:text-white'
              }`}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
    </aside>
  )
}
