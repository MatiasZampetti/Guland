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
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="mt-1 text-sm text-gray-500">{products.length} productos en total</p>
        </div>
        <Button className="gap-2 rounded-lg bg-black text-xs font-semibold tracking-wider text-white hover:bg-gray-800">
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
          className="w-full max-w-sm rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-black"
        />
      </div>

      {/* Tabla */}
      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Producto</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Categoría</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Precio</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Talles</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Estado</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-gray-100">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                  </div>
                </td>
                <td className="px-6 py-3.5">
                  <span className="capitalize text-sm text-gray-600">{product.category}</span>
                </td>
                <td className="px-6 py-3.5 text-sm font-semibold text-gray-900">
                  ${product.price.toLocaleString('es-AR')}
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {product.sizes.map((s) => (
                      <span key={s} className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-600">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex gap-1.5">
                    {product.isNew && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">Nuevo</span>
                    )}
                    {product.featured && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-700">Destacado</span>
                    )}
                    {!product.isNew && !product.featured && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">Activo</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-3.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 outline-none hover:bg-gray-100 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                        <Pencil className="h-3.5 w-3.5" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-sm text-red-600 cursor-pointer focus:text-red-600">
                        <Trash2 className="h-3.5 w-3.5" /> Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">
            No se encontraron productos.
          </div>
        )}
      </div>
    </div>
  )
}
