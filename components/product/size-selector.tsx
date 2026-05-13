'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Size } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface SizeSelectorProps {
  available: Size[]
  selected: Size | null
  onSelect: (size: Size) => void
}

const sizeGuide = [
  { talle: 'XS', pecho: '82–86', cintura: '64–68', cadera: '88–92' },
  { talle: 'S',  pecho: '87–91', cintura: '69–73', cadera: '93–97' },
  { talle: 'M',  pecho: '92–96', cintura: '74–78', cadera: '98–102' },
  { talle: 'L',  pecho: '97–102', cintura: '79–84', cadera: '103–108' },
  { talle: 'XL', pecho: '103–108', cintura: '85–90', cadera: '109–114' },
  { talle: 'XXL', pecho: '109–116', cintura: '91–98', cadera: '115–122' },
]

export function SizeSelector({ available, selected, onSelect }: SizeSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs tracking-wider text-white/30">TALLE</p>
        <button
          onClick={() => setOpen(true)}
          className="text-xs text-white/30 underline underline-offset-2 cursor-pointer hover:text-white transition-colors"
        >
          Guía de talles
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as Size[]).map((size) => {
          const isAvailable = available.includes(size)
          return (
            <Button
              key={size}
              variant="outline"
              size="sm"
              disabled={!isAvailable}
              onClick={() => isAvailable && onSelect(size)}
              className={`h-10 w-14 rounded-none text-xs p-0 ${
                selected === size
                  ? 'bg-red-700 text-white border-red-700 hover:bg-red-700 hover:text-white'
                  : isAvailable
                  ? 'hover:border-white hover:text-white'
                  : 'opacity-30 cursor-not-allowed line-through'
              }`}
            >
              {size}
            </Button>
          )
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md bg-[#0f0f0f] border border-white/10 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle
              style={{ fontFamily: 'var(--font-bebas)', fontSize: '2rem', lineHeight: 1 }}
              className="text-white"
            >
              GUÍA DE TALLES
            </DialogTitle>
          </DialogHeader>

          <p className="text-xs text-white/40 -mt-1 mb-4">Medidas en centímetros</p>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-3 text-left text-[10px] font-bold tracking-widest text-white/30">TALLE</th>
                <th className="pb-3 text-center text-[10px] font-bold tracking-widest text-white/30">PECHO</th>
                <th className="pb-3 text-center text-[10px] font-bold tracking-widest text-white/30">CINTURA</th>
                <th className="pb-3 text-center text-[10px] font-bold tracking-widest text-white/30">CADERA</th>
              </tr>
            </thead>
            <tbody>
              {sizeGuide.map((row, i) => (
                <tr
                  key={row.talle}
                  className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
                >
                  <td className="py-3 pl-1 font-bold text-white">{row.talle}</td>
                  <td className="py-3 text-center text-white/60">{row.pecho}</td>
                  <td className="py-3 text-center text-white/60">{row.cintura}</td>
                  <td className="py-3 text-center text-white/60">{row.cadera}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-4 text-[11px] leading-relaxed text-white/30">
            Si estás entre dos talles, te recomendamos elegir el más grande para un fit más cómodo.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  )
}
