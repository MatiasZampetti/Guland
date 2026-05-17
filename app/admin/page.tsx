import Link from 'next/link'
import { DollarSign, ShoppingCart, TrendingUp, Users, ArrowUpRight } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'

const statusLabel: Record<string, string> = {
  pendiente: 'Pendiente',
  en_proceso: 'En proceso',
  enviado: 'Enviado',
  completado: 'Completado',
  cancelado: 'Cancelado',
}

const statusColor: Record<string, string> = {
  pendiente: 'bg-amber-100 text-amber-800',
  en_proceso: 'bg-blue-100 text-blue-800',
  enviado: 'bg-purple-100 text-purple-800',
  completado: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800',
}

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export default async function AdminPage() {
  const admin = createAdminClient()

  const [{ data: orders }, { data: sales }, { data: profiles }] = await Promise.all([
    admin.from('orders').select('id, customer_name, customer_email, total, status, created_at').order('created_at', { ascending: false }),
    admin.from('sales').select('product_name, quantity, total, created_at'),
    admin.from('profiles').select('id'),
  ])

  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear

  const isThisMonth = (d: string) => {
    const dt = new Date(d)
    return dt.getMonth() === thisMonth && dt.getFullYear() === thisYear
  }
  const isLastMonth = (d: string) => {
    const dt = new Date(d)
    return dt.getMonth() === lastMonth && dt.getFullYear() === lastMonthYear
  }

  const ordersThisMonth = (orders ?? []).filter(o => isThisMonth(o.created_at))
  const ordersLastMonth = (orders ?? []).filter(o => isLastMonth(o.created_at))

  const ingresosMes = ordersThisMonth.reduce((s, o) => s + o.total, 0)
  const ingresosAnterior = ordersLastMonth.reduce((s, o) => s + o.total, 0)
  const pedidosMes = ordersThisMonth.length
  const pedidosAnterior = ordersLastMonth.length
  const totalAcumulado = (orders ?? []).reduce((s, o) => s + o.total, 0)
  const totalUsuarios = profiles?.length ?? 0

  const pct = (curr: number, prev: number) => {
    if (prev === 0) return null
    const v = (((curr - prev) / prev) * 100).toFixed(0)
    return `${Number(v) >= 0 ? '+' : ''}${v}%`
  }

  // Last 6 months bar chart
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const offset = i - 5
    const d = new Date(thisYear, thisMonth + offset, 1)
    const mIdx = d.getMonth()
    const yr = d.getFullYear()
    const total = (orders ?? [])
      .filter(o => { const dt = new Date(o.created_at); return dt.getMonth() === mIdx && dt.getFullYear() === yr })
      .reduce((s, o) => s + o.total, 0)
    return { mes: MONTH_NAMES[mIdx], ventas: total, isCurrent: i === 5 }
  })
  const maxVentas = Math.max(...monthlyData.map(m => m.ventas), 1)

  // Top products from sales
  const productMap = new Map<string, { name: string; count: number }>()
  for (const s of sales ?? []) {
    const prev = productMap.get(s.product_name) ?? { name: s.product_name, count: 0 }
    productMap.set(s.product_name, { ...prev, count: prev.count + (s.quantity ?? 1) })
  }
  const topProductos = Array.from(productMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)
  const maxCount = Math.max(...topProductos.map(p => p.count), 1)

  const recentOrders = (orders ?? []).slice(0, 5)

  const stats = [
    {
      label: 'Ingresos del mes',
      value: `$${ingresosMes.toLocaleString('es-AR')}`,
      change: pct(ingresosMes, ingresosAnterior),
      icon: DollarSign,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      label: 'Pedidos del mes',
      value: pedidosMes,
      change: pct(pedidosMes, pedidosAnterior),
      icon: ShoppingCart,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Total acumulado',
      value: `$${totalAcumulado.toLocaleString('es-AR')}`,
      change: null,
      icon: TrendingUp,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'Clientes',
      value: totalUsuarios,
      change: null,
      icon: Users,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ]

  return (
    <div className="p-4 sm:p-6 md:p-8">

      {/* Header */}
      <div className="mb-6 sm:mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Panel de control</h1>
          <p className="mt-0.5 text-sm text-gray-400">{MONTH_NAMES[thisMonth]} {thisYear}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0f0f0f] text-xs font-bold text-white">
          GL
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map(({ label, value, change, icon: Icon, iconBg, iconColor }) => (
          <div key={label} className="rounded-xl bg-white p-4 sm:p-5 shadow-sm">
            <div className="sm:hidden">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 truncate">{label}</p>
              <p className="mt-1.5 text-sm font-bold text-gray-900 leading-none">{value}</p>
              {change && (
                <div className="mt-1.5 flex items-center gap-0.5">
                  <ArrowUpRight className="h-3 w-3 text-green-500 shrink-0" />
                  <p className="text-[11px] font-medium text-green-600">{change}</p>
                </div>
              )}
            </div>
            <div className="hidden sm:flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">{label}</p>
                <p className="mt-1.5 text-2xl font-bold text-gray-900 leading-none">{value}</p>
                {change && (
                  <div className="mt-1.5 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3 text-green-500 shrink-0" />
                    <p className="text-xs font-medium text-green-600">{change} vs anterior</p>
                  </div>
                )}
              </div>
              <div className={`shrink-0 rounded-xl p-2.5 ${iconBg}`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* Bar chart */}
        <div className="md:col-span-2 rounded-xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Ventas recientes</h2>
              <p className="text-xs text-gray-400">Ingresos por mes (últimos 6 meses)</p>
            </div>
            <Link href="/admin/finanzas" className="text-xs font-medium text-gray-400 hover:text-black transition-colors">
              Ver finanzas →
            </Link>
          </div>
          <div className="flex items-end gap-2" style={{ height: '96px' }}>
            {monthlyData.map((mes) => {
              const barH = Math.round((mes.ventas / maxVentas) * 72)
              return (
                <div key={mes.mes} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="relative w-full" style={{ height: '72px' }}>
                    <div
                      className={`absolute bottom-0 w-full rounded-t-sm transition-all ${mes.isCurrent ? 'bg-red-600' : 'bg-gray-200'}`}
                      style={{ height: `${Math.max(barH, 2)}px` }}
                    />
                  </div>
                  <span className={`text-[10px] font-medium ${mes.isCurrent ? 'text-red-600' : 'text-gray-400'}`}>
                    {mes.mes}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex items-center gap-4 border-t border-gray-50 pt-4">
            <div>
              <p className="text-[10px] text-gray-400">Total acumulado</p>
              <p className="text-sm font-bold text-gray-900">${totalAcumulado.toLocaleString('es-AR')}</p>
            </div>
            <div className="h-8 w-px bg-gray-100" />
            <div>
              <p className="text-[10px] text-gray-400">Este mes</p>
              <p className="text-sm font-bold text-gray-900">${ingresosMes.toLocaleString('es-AR')}</p>
            </div>
          </div>
        </div>

        {/* Top productos */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Top productos</h2>
            <Link href="/admin/productos" className="text-xs font-medium text-gray-400 hover:text-black transition-colors">
              Ver todos →
            </Link>
          </div>
          {topProductos.length === 0 ? (
            <p className="text-sm text-gray-400">Sin ventas aún.</p>
          ) : (
            <ul className="space-y-4">
              {topProductos.map((p) => (
                <li key={p.name}>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-gray-700 truncate">{p.name}</p>
                    <p className="shrink-0 text-xs font-semibold text-gray-900">{p.count} uds</p>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-red-600"
                      style={{ width: `${Math.round((p.count / maxCount) * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Últimos pedidos */}
      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">Últimos pedidos</h2>
          <Link href="/admin/pedidos" className="text-xs font-medium text-gray-400 hover:text-black transition-colors">
            Ver todos →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">No hay pedidos aún.</div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <div key={order.id} className="px-5 py-3.5 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-mono text-gray-400">{order.id.slice(0, 8)}</p>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusColor[order.status]}`}>
                      {statusLabel[order.status]}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
                  <p className="text-xs text-gray-400">{order.customer_email}</p>
                  <div className="flex items-center justify-between pt-0.5">
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('es-AR')}</p>
                    <p className="text-sm font-semibold text-gray-900">${order.total.toLocaleString('es-AR')}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">ID</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Cliente</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Fecha</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Total</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3.5 text-xs font-mono font-medium text-gray-500">{order.id.slice(0, 8)}</td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
                        <p className="text-xs text-gray-400">{order.customer_email}</p>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('es-AR')}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">
                        ${order.total.toLocaleString('es-AR')}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusColor[order.status]}`}>
                          {statusLabel[order.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
