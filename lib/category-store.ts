import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CategoryItem {
  slug: string
  label: string
  image: string
}

const defaultCategories: CategoryItem[] = [
  { slug: 'buzos', label: 'Buzos', image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80' },
  { slug: 'camperas', label: 'Camperas', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80' },
  { slug: 'sweaters', label: 'Sweaters', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80' },
  { slug: 'remeras', label: 'Remeras', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80' },
  { slug: 'jeans', label: 'Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80' },
  { slug: 'bermudas', label: 'Bermudas', image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&q=80' },
]

interface CategoryStore {
  categories: CategoryItem[]
  addCategory: (cat: CategoryItem) => void
  removeCategory: (slug: string) => void
}

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set) => ({
      categories: defaultCategories,
      addCategory: (cat) =>
        set((s) => ({ categories: [...s.categories, cat] })),
      removeCategory: (slug) =>
        set((s) => ({ categories: s.categories.filter((c) => c.slug !== slug) })),
    }),
    { name: 'guland-categories' }
  )
)
