'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatedTitle } from '@/components/ui/animated-title'
import { ChevronDown } from 'lucide-react'
import { useFaqStore } from '@/lib/faq-store'

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left text-sm font-semibold tracking-wide transition-colors hover:text-white/60"
      >
        {q}
        <ChevronDown
          className={`ml-4 h-4 w-4 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.5}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[600px] pb-5' : 'max-h-0'}`}>
        <p className="text-sm leading-relaxed text-white/50">{a}</p>
      </div>
    </div>
  )
}

export default function AyudaPage() {
  const categories = useFaqStore((s) => s.categories)

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-5 py-8 sm:py-12">
      <div className="mb-8 sm:mb-12">
        <AnimatedTitle as="h1" className="text-3xl sm:text-5xl leading-none md:text-9xl" style={{ fontFamily: 'var(--font-bebas)' }}>
          AYUDA
        </AnimatedTitle>
        <p className="mt-2 text-xs font-semibold tracking-widest text-white/40">PREGUNTAS FRECUENTES</p>
      </div>

      <div className="space-y-12">
        {categories.map((section) => (
          <div key={section.id}>
            <p className="mb-2 text-[11px] font-bold tracking-widest text-white/30">{section.category}</p>
            <div>
              {section.items.map((item) => (
                <FaqItem key={item.id} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 border-t border-white/10 pt-10 text-center">
        <p className="text-sm text-white/40">¿No encontraste lo que buscabas?</p>
        <a
          href="https://wa.me/5493573498196"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-3 rounded-full bg-white px-8 py-3 text-xs font-bold tracking-widest text-black transition-opacity hover:opacity-70"
        >
          CONTACTAR POR WHATSAPP →
        </a>
        <div className="mt-6">
          <Link href="/" className="text-xs font-semibold tracking-widest text-white/30 underline underline-offset-4 hover:text-white transition-colors">
            ← VOLVER AL INICIO
          </Link>
        </div>
      </div>
    </div>
  )
}
