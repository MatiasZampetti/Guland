'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductGalleryProps {
  images: string[]
  name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0)
  const hasMultiple = images.length > 1

  const goPrev = () => setSelected((s) => (s - 1 + images.length) % images.length)
  const goNext = () => setSelected((s) => (s + 1) % images.length)

  return (
    <div className="flex flex-col gap-3">
      {/* Imagen principal con flechas en hover */}
      <div className="group relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
        <img
          src={images[selected]}
          alt={name}
          className="h-full w-full object-cover"
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 hover:bg-black/50 group-hover:opacity-100"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Imagen siguiente"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 hover:bg-black/50 group-hover:opacity-100"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails — fila horizontal */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden border-2 transition-colors ${
                selected === i ? 'border-white' : 'border-transparent opacity-50'
              }`}
            >
              <img src={img} alt={`${name} ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
