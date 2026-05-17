'use client'

import { useState, useEffect } from 'react'

type OrderStatus = 'pendiente' | 'en_proceso' | 'enviado' | 'completado' | 'cancelado'

interface OrderItem {
  id: string
  product_name: string
  size: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customer_name: string
  customer_email: string
  total: number
  payment_method: string
  status: OrderStatus
  created_at: string
  order_items: OrderItem[]
}

const statusLabel: Record<OrderStatus, string> = {
  pendiente: 'Pendiente',
  en_proceso: 'En proceso',
  enviado: 'Enviado',
  completado: 'Completado',
  cancelado: 'Cancelado',
}

const statusColor: Record<OrderStatus, string> = {
  pendiente: 'bg-amber-100 text-amber-800',
  en_proceso: 'bg-blue-100 text-blue-800',
  enviado: 'bg-purple-100 text-purple-800',
  completado: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800',
}

const allStatuses: (OrderStatus | 'todos')[] = ['todos', 'pendiente', 'en_proceso', 'enviado', 'completado', 'cancelado']
const editableStatuses: OrderStatus[] = ['pendiente', 'en_proceso', 'enviado', 'completado', 'cancelado']

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState<OrderStatus | 'todos'>('todos')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  async function updateStatus(id: string, status: OrderStatus) {
    setUpdatingId(id)
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    }
    setUpdatingId(null)
  }

  const filtered = filtroEstado === 'todos'
    ? orders
    : orders.filter((o) => o.status === filtroEstado)

  const totalAmount = filtered.reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="p-4 sm:p-6 md:p-8">

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pedidos</h1>
        <p className="mt-0.5 text-sm text-gray-400">
          {filtered.length} pedidos · ${totalAmount.toLocaleString('es-AR')} en total
        </p>
      </div>

      {/* Status filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {allStatuses.map((s) => (
          <button
            key={s}
            onClick={() => setFiltroEstado(s)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              filtroEstado === s
                ? 'bg-[#0f0f0f] text-white'
                : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {s === 'todos' ? 'Todos' : statusLabel[s]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white shadow-sm overflow-hidden">

        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">Cargando...</div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-gray-50">
              {filtered.map((order) => (
                <div key={order.id} className="px-5 py-3.5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-mono text-gray-400">{order.id.slice(0, 8)}</p>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusColor[order.status]}`}>
                      {statusLabel[order.status]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
                    <p className="text-xs text-gray-400">{order.customer_email}</p>
                  </div>
                  {order.order_items?.length > 0 && (
                    <p className="text-xs text-gray-500">
                      {order.order_items.map(i => `${i.product_name} (${i.size})`).join(', ')}
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                      disabled={updatingId === order.id}
                      className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 outline-none disabled:opacity-50"
                    >
                      {editableStatuses.map(s => (
                        <option key={s} value={s}>{statusLabel[s]}</option>
                      ))}
                    </select>
                    <p className="text-sm font-bold text-gray-900">${order.total.toLocaleString('es-AR')}</p>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="py-16 text-center text-sm text-gray-400">No hay pedidos con ese estado.</div>
              )}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">ID</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Cliente</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Fecha</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Items</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Total</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3.5 text-xs font-mono font-semibold text-gray-500">{order.id.slice(0, 8)}</td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
                        <p className="text-xs text-gray-400">{order.customer_email}</p>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('es-AR')}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{order.order_items?.length ?? 0}</td>
                      <td className="px-5 py-3.5 text-sm font-bold text-gray-900">
                        ${order.total.toLocaleString('es-AR')}
                      </td>
                      <td className="px-5 py-3.5">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                          disabled={updatingId === order.id}
                          className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold outline-none cursor-pointer disabled:opacity-50 ${statusColor[order.status]}`}
                        >
                          {editableStatuses.map(s => (
                            <option key={s} value={s}>{statusLabel[s]}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-16 text-center text-sm text-gray-400">No hay pedidos con ese estado.</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
