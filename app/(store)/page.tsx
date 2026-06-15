import { Hero } from '@/components/home/hero'
import { NewDrop } from '@/components/home/new-drop'
import { FeaturedProducts } from '@/components/home/featured-products'
import { CategoryGrid } from '@/components/home/category-grid'

// La home se regenera (ISR) cada 5 minutos en lugar de consultar Supabase en cada request.
// Los cambios de catálogo desde el admin se reflejan dentro de ese plazo.
export const revalidate = 300

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="h-px w-full bg-[#1e1e1e]" />
      <NewDrop />
      <div className="h-px w-full bg-[#1e1e1e]" />
      <FeaturedProducts />
      <div className="h-px w-full bg-[#1e1e1e]" />
      <CategoryGrid />
    </>
  )
}
