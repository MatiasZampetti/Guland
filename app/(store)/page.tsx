import { Hero } from '@/components/home/hero'
import { NewDrop } from '@/components/home/new-drop'
import { FeaturedProducts } from '@/components/home/featured-products'
import { CategoryGrid } from '@/components/home/category-grid'

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
