import Link from 'next/link'
import { DollarSign, ShoppingCart, TrendingUp, ArrowUpRight } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

// Colores fijos por categoría (orden estable, no por ranking) — validados con dataviz/validate_palette.js
const CATEGORY_COLORS = ['#dc2626', '#2563eb', '#d97706', '#059669', '#7c3aed', '#0891b2', '#db2777']
const OTROS_COLOR = '#9ca3af'

// Genera el path SVG de una porción de torta (centro 80,80 · radio 70)
function pieSlicePath(startAngle: number, endAngle: number) {
  const cx = 80, cy = 80, r = 70
  const point = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  const [x1, y1] = point(startAngle)
  const [x2, y2] = point(endAngle)
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
}

export default async function AdminPage() {
  const admin = createAdminClient()

  const [{ data: orders }, { data: sales }, { data: products }, { data: categories }] = await Promise.all([
    admin.from('orders').select('id, total, created_at').order('created_at', { ascending: false }),
    admin.from('sales').select('product_id, product_name, quantity, total, created_at'),
    admin.from('products').select('id, category_slug'),
    admin.from('categories').select('slug, label').order('created_at', { ascending: true }),
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
  const salesThisMonth = (sales ?? []).filter(s => isThisMonth(s.created_at))
  const salesLastMonth = (sales ?? []).filter(s => isLastMonth(s.created_at))

  const ingresosMes = ordersThisMonth.reduce((s, o) => s + o.total, 0) + salesThisMonth.reduce((s, v) => s + v.total, 0)
  const ingresosAnterior = ordersLastMonth.reduce((s, o) => s + o.total, 0) + salesLastMonth.reduce((s, v) => s + v.total, 0)
  const pedidosMes = ordersThisMonth.length + salesThisMonth.length
  const pedidosAnterior = ordersLastMonth.length + salesLastMonth.length
  const totalAcumulado = (orders ?? []).reduce((s, o) => s + o.total, 0) + (sales ?? []).reduce((s, v) => s + v.total, 0)

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
      .reduce((s, o) => s + o.total, 0) +
      (sales ?? [])
        .filter(v => { const dt = new Date(v.created_at); return dt.getMonth() === mIdx && dt.getFullYear() === yr })
        .reduce((s, v) => s + v.total, 0)
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

  // Ventas por categoría
  const productCategoryMap = new Map<string, string>()
  for (const p of products ?? []) productCategoryMap.set(p.id, p.category_slug)

  const categoryQty = new Map<string, number>()
  for (const s of sales ?? []) {
    const slug = (s.product_id && productCategoryMap.get(s.product_id)) || 'otros'
    categoryQty.set(slug, (categoryQty.get(slug) ?? 0) + (s.quantity ?? 1))
  }

  const ventasPorCategoria = (categories ?? [])
    .map((c, i) => ({ label: c.label, qty: categoryQty.get(c.slug) ?? 0, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }))
    .concat(categoryQty.has('otros') ? [{ label: 'Otros', qty: categoryQty.get('otros')!, color: OTROS_COLOR }] : [])
    .filter(c => c.qty > 0)
    .sort((a, b) => b.qty - a.qty)
  const totalCategoriaQty = ventasPorCategoria.reduce((s, c) => s + c.qty, 0)

  // Ángulos de cada porción (arranca en las 12, sentido horario)
  const categorySlices = ventasPorCategoria.reduce<Array<typeof ventasPorCategoria[number] & { path: string; pct: number; endAngle: number }>>((acc, c) => {
    const startAngle = acc.length === 0 ? -Math.PI / 2 : acc[acc.length - 1].endAngle
    const endAngle = startAngle + (c.qty / totalCategoriaQty) * Math.PI * 2
    return [...acc, { ...c, path: pieSlicePath(startAngle, endAngle), pct: Math.round((c.qty / totalCategoriaQty) * 100), endAngle }]
  }, [])

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
      label: 'Ventas del mes',
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
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
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

      {/* Ventas por categoría */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Ventas por categoría</h2>
          <p className="text-xs text-gray-400">Unidades vendidas por categoría</p>
        </div>

        {categorySlices.length === 0 ? (
          <p className="text-sm text-gray-400">Sin ventas aún.</p>
        ) : (
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center">
            <svg viewBox="0 0 160 160" className="h-44 w-44 shrink-0">
              {categorySlices.map((c) => (
                <path key={c.label} d={c.path} fill={c.color}>
                  <title>{`${c.label}: ${c.qty} uds (${c.pct}%)`}</title>
                </path>
              ))}
            </svg>
            <ul className="w-full max-w-xs space-y-2.5">
              {categorySlices.map((c) => (
                <li key={c.label} className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: c.color }} />
                    <p className="truncate text-xs font-medium text-gray-700">{c.label}</p>
                  </div>
                  <p className="shrink-0 text-xs font-semibold text-gray-900">{c.qty} uds · {c.pct}%</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
