import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AnimatedTitle } from '@/components/ui/animated-title'

export async function CategoryGrid() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <section id="categorias" className="bg-[#0f0f0f] px-4 sm:px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 sm:mb-8 flex items-baseline justify-between gap-4">
          <AnimatedTitle
            className="text-4xl sm:text-5xl leading-none text-white md:text-7xl"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            CATEGORÍAS
          </AnimatedTitle>
          <Link
            href="/shop"
            className="shrink-0 text-xs font-semibold tracking-widest text-white/40 underline underline-offset-4 hover:text-white transition-colors"
          >
            VER TODO →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3">
          {(categories ?? []).map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden bg-black"
            >
              <img
                src={cat.image_url}
                alt={cat.label}
                className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-60"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
                <p
                  className="text-3xl sm:text-4xl leading-none text-white md:text-5xl"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  {cat.label.toUpperCase()}
                </p>
                <p className="mt-1 text-[10px] sm:text-xs font-semibold tracking-widest text-white/60 transition-opacity group-hover:text-white/90">
                  VER MÁS →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
