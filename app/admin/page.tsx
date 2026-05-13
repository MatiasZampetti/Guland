import Link from 'next/link'
import { TrendingUp, ShoppingCart, Package, Users } from 'lucide-react'
import { mockStats, mockOrders } from '@/lib/admin-mock-data'

const statusLabel: Record<string, string> = {
  pendiente: 'Pendiente',
  en_proceso: 'En proceso',
  enviado: 'Enviado',
  completado: 'Completado',
  cancelado: 'Cancelado',
}

const statusColor: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  en_proceso: 'bg-blue-100 text-blue-800',
  enviado: 'bg-purple-100 text-purple-800',
  completado: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800',
}

const pct = (curr: number, prev: number) => (((curr - prev) / prev) * 100).toFixed(0)

export default function AdminPage() {
  const stats = [
    {
      label: 'Ingresos del mes',
      value: `$${mockStats.ingresosMes.toLocaleString('es-AR')}`,
      change: `+${pct(mockStats.ingresosMes, mockStats.ingresosAnterior)}%`,
      icon: TrendingUp,
      positive: true,
    },
    {
      label: 'Pedidos del mes',
      value: mockStats.pedidosMes,
      change: `+${pct(mockStats.pedidosMes, mockStats.pedidosAnterior)}%`,
      icon: ShoppingCart,
      positive: true,
    },
    {
      label: 'Productos',
      value: mockStats.totalProductos,
      change: null,
      icon: Package,
      positive: true,
    },
    {
      label: 'Usuarios',
      value: mockStats.totalUsuarios,
      change: null,
      icon: Users,
      positive: true,
    },
  ]

  const recentOrders = mockOrders.slice(0, 5)

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Panel de control</h1>
        <p className="mt-1 text-sm text-gray-500">Resumen general — Mayo 2026</p>
      </div>

      {/* Stats */}
      <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map(({ label, value, change, icon: Icon }) => (
          <div key={label} className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">{label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
                {change && (
                  <p className="mt-1 text-xs font-medium text-green-600">{change} vs mes anterior</p>
                )}
              </div>
              <div className="rounded-lg bg-gray-100 p-2">
                <Icon className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Últimos pedidos */}
      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 sm:px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-900">Últimos pedidos</h2>
          <Link href="/admin/pedidos" className="text-xs font-medium text-gray-400 hover:text-black">
            Ver todos →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">ID</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Cliente</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Fecha</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Total</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-3.5 text-xs font-mono font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-3.5">
                    <p className="text-sm font-medium text-gray-900">{order.cliente}</p>
                    <p className="text-xs text-gray-400">{order.email}</p>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-500">{order.fecha}</td>
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
        </div>
      </div>
    </div>
  )
}
