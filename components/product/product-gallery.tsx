'use client'

import { useState } from 'react'

interface ProductGalleryProps {
  images: string[]
  name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0)

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="aspect-[3/4] w-full overflow-hidden bg-gray-50">
        <img
          src={images[selected]}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Thumbnails — horizontal row */}
      {images.length > 1 && (
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
