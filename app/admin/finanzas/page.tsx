'use client'

import { useState, useEffect } from 'react'
import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react'

interface Order {
  id: string
  total: number
  status: string
  created_at: string
}

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export default function AdminFinanzasPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()

  const totalAcumulado = orders.reduce((s, o) => s + o.total, 0)
  const ordersThisMonth = orders.filter(o => {
    const d = new Date(o.created_at)
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear
  })
  const ingresosMes = ordersThisMonth.reduce((s, o) => s + o.total, 0)
  const completados = orders.filter(o => o.status === 'completado').length

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(thisYear, thisMonth - 5 + i, 1)
    const mIdx = d.getMonth()
    const yr = d.getFullYear()
    const monthOrders = orders.filter(o => {
      const dt = new Date(o.created_at)
      return dt.getMonth() === mIdx && dt.getFullYear() === yr
    })
    return { mes: MONTH_NAMES[mIdx], yr, ventas: monthOrders.reduce((s, o) => s + o.total, 0), count: monthOrders.length, isCurrent: i === 5 }
  })
  const maxVentas = Math.max(...monthlyData.map(m => m.ventas), 1)

  const stats = [
    { label: 'Total acumulado', value: `$${totalAcumulado.toLocaleString('es-AR')}`, icon: DollarSign, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'Ingresos este mes', value: `$${ingresosMes.toLocaleString('es-AR')}`, icon: TrendingUp, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
    { label: 'Total pedidos', value: orders.length, icon: ShoppingCart, iconBg: 'bg-red-50', iconColor: 'text-red-600' },
    { label: 'Pedidos completados', value: completados, icon: Users, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
  ]

  return (
    <div className="p-4 sm:p-6 md:p-8">

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Finanzas</h1>
        <p className="mt-0.5 text-sm text-gray-400">Ingresos basados en pedidos reales</p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-gray-400">Cargando...</div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
            {stats.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
              <div key={label} className="rounded-xl bg-white p-4 sm:p-5 shadow-sm">
                <div className="sm:hidden">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 truncate">{label}</p>
                  <p className="mt-1.5 text-sm font-bold text-gray-900 leading-none">{value}</p>
                </div>
                <div className="hidden sm:flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">{label}</p>
                    <p className="mt-1.5 text-2xl font-bold text-gray-900 leading-none">{value}</p>
                  </div>
                  <div className={`shrink-0 rounded-xl p-2.5 ${iconBg}`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div className="rounded-xl bg-white p-5 shadow-sm mb-6">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Ingresos por mes</h2>
              <p className="text-xs text-gray-400">Últimos 6 meses</p>
            </div>

            {totalAcumulado === 0 ? (
              <div className="py-12 text-center text-sm text-gray-400">Sin pedidos aún.</div>
            ) : (
              <div className="flex items-end gap-2" style={{ height: '120px' }}>
                {monthlyData.map((mes) => {
                  const barH = Math.round((mes.ventas / maxVentas) * 96)
                  return (
                    <div key={mes.mes} className="flex flex-1 flex-col items-center gap-1.5">
                      <div className="relative w-full" style={{ height: '96px' }}>
                        <div
                          className={`absolute bottom-0 w-full rounded-t-sm ${mes.isCurrent ? 'bg-red-600' : 'bg-gray-200'}`}
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
            )}
          </div>

          {/* Monthly table */}
          <div className="rounded-xl bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Detalle mensual</h2>
            </div>

            {totalAcumulado === 0 ? (
              <div className="py-16 text-center text-sm text-gray-400">No hay pedidos registrados aún.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Mes</th>
                      <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">Pedidos</th>
                      <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {monthlyData.filter(m => m.ventas > 0).map((mes) => (
                      <tr key={`${mes.mes}-${mes.yr}`} className={`transition-colors ${mes.isCurrent ? 'bg-red-50/40' : 'hover:bg-gray-50/60'}`}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">{mes.mes} {mes.yr}</span>
                            {mes.isCurrent && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">Actual</span>}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right text-sm text-gray-600">{mes.count}</td>
                        <td className="px-5 py-3.5 text-right text-sm font-bold text-gray-900">${mes.ventas.toLocaleString('es-AR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
