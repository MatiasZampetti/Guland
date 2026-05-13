'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, MoreHorizontal } from 'lucide-react'
import { products } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function AdminProductosPage() {
  const [search, setSearch] = useState('')

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.includes(search.toLowerCase())
  )

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-5 sm:mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Productos</h1>
          <p className="mt-1 text-sm text-gray-500">{products.length} productos en total</p>
        </div>
        <Button className="gap-2 rounded-lg bg-black text-xs font-semibold tracking-wider text-white hover:bg-gray-800 min-h-[44px]">
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Button>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o categoría..."
          className="w-full sm:max-w-sm rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-black"
        />
      </div>

      {/* Tabla */}
      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-gray-50">
          {filtered.map((product) => (
            <div key={product.id} className="flex items-start gap-3 px-4 py-3.5">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100">
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900 leading-tight">{product.name}</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 outline-none hover:bg-gray-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2 text-sm cursor-pointer"><Pencil className="h-3.5 w-3.5" /> Editar</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-sm text-red-600 cursor-pointer focus:text-red-600"><Trash2 className="h-3.5 w-3.5" /> Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="capitalize">{product.category}</span>
                  <span>·</span>
                  <span className="font-semibold text-gray-900">${product.price.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {product.sizes.map((s) => (
                    <span key={s} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">{s}</span>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  {product.isNew && <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">Nuevo</span>}
                  {product.featured && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">Destacado</span>}
                  {!product.isNew && !product.featured && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">Activo</span>}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="py-12 text-center text-sm text-gray-400">No se encontraron productos.</div>}
        </div>
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 md:px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Producto</th>
                <th className="px-4 md:px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Categoría</th>
                <th className="px-4 md:px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Precio</th>
                <th className="px-4 md:px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Talles</th>
                <th className="px-4 md:px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Estado</th>
                <th className="px-4 md:px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50">
                  <td className="px-4 md:px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-gray-100">
                        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-3.5">
                    <span className="capitalize text-sm text-gray-600">{product.category}</span>
                  </td>
                  <td className="px-4 md:px-6 py-3.5 text-sm font-semibold text-gray-900">
                    ${product.price.toLocaleString('es-AR')}
                  </td>
                  <td className="px-4 md:px-6 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {product.sizes.map((s) => (
                        <span key={s} className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-600">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-3.5">
                    <div className="flex gap-1.5">
                      {product.isNew && <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">Nuevo</span>}
                      {product.featured && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-700">Destacado</span>}
                      {!product.isNew && !product.featured && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">Activo</span>}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-3.5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 outline-none hover:bg-gray-100 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2 text-sm cursor-pointer"><Pencil className="h-3.5 w-3.5" /> Editar</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-sm text-red-600 cursor-pointer focus:text-red-600"><Trash2 className="h-3.5 w-3.5" /> Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-12 text-center text-sm text-gray-400">No se encontraron productos.</div>}
        </div>
      </div>
    </div>
  )
}
