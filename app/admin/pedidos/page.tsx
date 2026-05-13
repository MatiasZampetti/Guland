'use client'

import { useState } from 'react'
import { mockOrders, OrderStatus } from '@/lib/admin-mock-data'

const statusLabel: Record<OrderStatus, string> = {
  pendiente: 'Pendiente',
  en_proceso: 'En proceso',
  enviado: 'Enviado',
  completado: 'Completado',
  cancelado: 'Cancelado',
}

const statusColor: Record<OrderStatus, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  en_proceso: 'bg-blue-100 text-blue-800',
  enviado: 'bg-purple-100 text-purple-800',
  completado: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800',
}

const allStatuses: (OrderStatus | 'todos')[] = ['todos', 'pendiente', 'en_proceso', 'enviado', 'completado', 'cancelado']

export default function AdminPedidosPage() {
  const [filtroEstado, setFiltroEstado] = useState<OrderStatus | 'todos'>('todos')

  const filtered = filtroEstado === 'todos'
    ? mockOrders
    : mockOrders.filter((o) => o.estado === filtroEstado)

  const total = filtered.reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pedidos</h1>
        <p className="mt-1 text-sm text-gray-500">
          {filtered.length} pedidos · ${total.toLocaleString('es-AR')} en total
        </p>
      </div>

      {/* Filtros de estado */}
      <div className="mb-4 flex flex-wrap gap-2">
        {allStatuses.map((s) => (
          <button
            key={s}
            onClick={() => setFiltroEstado(s)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              filtroEstado === s
                ? 'bg-black text-white'
                : 'bg-white text-gray-500 hover:bg-gray-100'
            }`}
          >
            {s === 'todos' ? 'Todos' : statusLabel[s]}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="rounded-xl bg-white shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">ID</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Cliente</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Fecha</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Items</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Total</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-3.5 text-xs font-mono font-semibold text-gray-900">{order.id}</td>
                <td className="px-6 py-3.5">
                  <p className="text-sm font-medium text-gray-900">{order.cliente}</p>
                  <p className="text-xs text-gray-400">{order.email}</p>
                </td>
                <td className="px-6 py-3.5 text-sm text-gray-500">{order.fecha}</td>
                <td className="px-6 py-3.5 text-sm text-gray-600">{order.items}</td>
                <td className="px-6 py-3.5 text-sm font-semibold text-gray-900">
                  ${order.total.toLocaleString('es-AR')}
                </td>
                <td className="px-6 py-3.5">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusColor[order.estado]}`}>
                    {statusLabel[order.estado]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">No hay pedidos con ese estado.</div>
        )}
      </div>
    </div>
  )
}
