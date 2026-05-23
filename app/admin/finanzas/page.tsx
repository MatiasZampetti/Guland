'use client'

import { useState, useEffect } from 'react'
import { DollarSign, ShoppingCart, TrendingUp, TrendingDown, Plus, X, Trash2 } from 'lucide-react'

interface Order {
  id: string
  total: number
  status: string
  created_at: string
}

interface Sale {
  id: string
  total: number
  created_at: string
}

interface Expense {
  id: string
  description: string
  category: string
  amount: number
  expense_date: string
  created_at: string
}

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const EXPENSE_CATEGORIES = ['general', 'stock', 'envíos', 'marketing', 'servicios', 'sueldos', 'impuestos', 'otros']

const emptyExpenseForm = {
  description: '',
  category: 'general',
  amount: '',
  expense_date: new Date().toISOString().slice(0, 10),
}

export default function AdminFinanzasPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [expenseForm, setExpenseForm] = useState(emptyExpenseForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then(r => r.json()),
      fetch('/api/sales').then(r => r.json()),
      fetch('/api/expenses').then(r => r.json()).catch(() => []),
    ]).then(([ordersData, salesData, expensesData]) => {
      setOrders(Array.isArray(ordersData) ? ordersData : [])
      setSales(Array.isArray(salesData) ? salesData : [])
      setExpenses(Array.isArray(expensesData) ? expensesData : [])
      setLoading(false)
    })
  }, [])

  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()

  const ingresosTotales =
    orders.reduce((s, o) => s + o.total, 0) + sales.reduce((s, v) => s + v.total, 0)

  const ingresosMes =
    orders.filter(o => {
      const d = new Date(o.created_at)
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear
    }).reduce((s, o) => s + o.total, 0) +
    sales.filter(v => {
      const d = new Date(v.created_at)
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear
    }).reduce((s, v) => s + v.total, 0)

  const gastosTotales = expenses.reduce((s, e) => s + e.amount, 0)
  const gastosMes = expenses.filter(e => {
    const d = new Date(e.expense_date)
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear
  }).reduce((s, e) => s + e.amount, 0)

  const balanceMes = ingresosMes - gastosMes
  const balanceTotal = ingresosTotales - gastosTotales

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(thisYear, thisMonth - 5 + i, 1)
    const mIdx = d.getMonth()
    const yr = d.getFullYear()
    const ingMes = orders.filter(o => {
      const dt = new Date(o.created_at)
      return dt.getMonth() === mIdx && dt.getFullYear() === yr
    }).reduce((s, o) => s + o.total, 0) +
    sales.filter(v => {
      const dt = new Date(v.created_at)
      return dt.getMonth() === mIdx && dt.getFullYear() === yr
    }).reduce((s, v) => s + v.total, 0)
    const gMes = expenses.filter(e => {
      const dt = new Date(e.expense_date)
      return dt.getMonth() === mIdx && dt.getFullYear() === yr
    }).reduce((s, e) => s + e.amount, 0)
    return { mes: MONTH_NAMES[mIdx], yr, ingresos: ingMes, gastos: gMes, balance: ingMes - gMes, isCurrent: i === 5 }
  })
  const maxVentas = Math.max(...monthlyData.map(m => Math.max(m.ingresos, m.gastos)), 1)

  async function handleAddExpense(e: React.FormEvent) {
    e.preventDefault()
    if (!expenseForm.description || !expenseForm.amount) return
    setSubmitting(true)

    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: expenseForm.description,
        category: expenseForm.category,
        amount: parseInt(expenseForm.amount),
        expense_date: expenseForm.expense_date,
      }),
    })

    if (res.ok) {
      const nuevo = await res.json()
      setExpenses((prev) => [nuevo, ...prev])
      setExpenseForm(emptyExpenseForm)
      setShowForm(false)
    }
    setSubmitting(false)
  }

  async function handleDeleteExpense(id: string) {
    const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
    if (res.ok) setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  const inputClass = 'w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors'
  const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5'

  const stats = [
    {
      label: 'Balance del mes',
      value: `$${balanceMes.toLocaleString('es-AR')}`,
      icon: balanceMes >= 0 ? TrendingUp : TrendingDown,
      iconBg: balanceMes >= 0 ? 'bg-green-50' : 'bg-red-50',
      iconColor: balanceMes >= 0 ? 'text-green-600' : 'text-red-600',
    },
    { label: 'Ingresos del mes', value: `$${ingresosMes.toLocaleString('es-AR')}`, icon: DollarSign, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'Gastos del mes', value: `$${gastosMes.toLocaleString('es-AR')}`, icon: TrendingDown, iconBg: 'bg-orange-50', iconColor: 'text-orange-600' },
    { label: 'Balance total', value: `$${balanceTotal.toLocaleString('es-AR')}`, icon: ShoppingCart, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
  ]

  return (
    <div className="p-4 sm:p-6 md:p-8">

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Finanzas</h1>
          <p className="mt-0.5 text-sm text-gray-400">Ingresos, gastos y balance neto</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-lg bg-[#0f0f0f] px-4 py-2.5 text-xs font-semibold tracking-wider text-white hover:bg-gray-800 transition-colors min-h-[44px]"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancelar' : 'Nuevo gasto'}
        </button>
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

          {/* Formulario de gasto */}
          {showForm && (
            <form onSubmit={handleAddExpense} className="mb-6 rounded-xl bg-white p-5 sm:p-6 shadow-sm">
              <h2 className="mb-5 text-sm font-semibold text-gray-900">Registrar gasto</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Descripción</label>
                  <input
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    placeholder="Ej: Compra de stock invierno"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Categoría</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className={inputClass}
                  >
                    {EXPENSE_CATEGORIES.map((c) => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Monto ($)</label>
                  <input
                    type="number"
                    min={1}
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    placeholder="0"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Fecha</label>
                  <input
                    type="date"
                    value={expenseForm.expense_date}
                    onChange={(e) => setExpenseForm({ ...expenseForm, expense_date: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={!expenseForm.description || !expenseForm.amount || submitting}
                  className="rounded-lg bg-[#0f0f0f] px-6 py-2.5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-gray-800 disabled:opacity-40"
                >
                  {submitting ? 'Registrando...' : 'Registrar gasto'}
                </button>
              </div>
            </form>
          )}

          {/* Bar chart */}
          <div className="rounded-xl bg-white p-5 shadow-sm mb-6">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Ingresos vs gastos por mes</h2>
              <p className="text-xs text-gray-400">Últimos 6 meses</p>
            </div>

            {ingresosTotales === 0 && gastosTotales === 0 ? (
              <div className="py-12 text-center text-sm text-gray-400">Sin movimientos aún.</div>
            ) : (
              <>
                <div className="flex items-end gap-3" style={{ height: '120px' }}>
                  {monthlyData.map((mes) => {
                    const barIng = Math.round((mes.ingresos / maxVentas) * 96)
                    const barGas = Math.round((mes.gastos / maxVentas) * 96)
                    return (
                      <div key={`${mes.mes}-${mes.yr}`} className="flex flex-1 flex-col items-center gap-1.5">
                        <div className="relative w-full flex gap-0.5 items-end" style={{ height: '96px' }}>
                          <div
                            className={`flex-1 rounded-t-sm ${mes.isCurrent ? 'bg-green-600' : 'bg-green-200'}`}
                            style={{ height: `${Math.max(barIng, 2)}px` }}
                            title={`Ingresos: $${mes.ingresos.toLocaleString('es-AR')}`}
                          />
                          <div
                            className={`flex-1 rounded-t-sm ${mes.isCurrent ? 'bg-red-600' : 'bg-red-200'}`}
                            style={{ height: `${Math.max(barGas, 2)}px` }}
                            title={`Gastos: $${mes.gastos.toLocaleString('es-AR')}`}
                          />
                        </div>
                        <span className={`text-[10px] font-medium ${mes.isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                          {mes.mes}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 flex items-center gap-4 border-t border-gray-50 pt-3 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm bg-green-600" /><span className="text-gray-500">Ingresos</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm bg-red-600" /><span className="text-gray-500">Gastos</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Monthly table */}
          <div className="rounded-xl bg-white shadow-sm overflow-hidden mb-6">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Detalle mensual</h2>
            </div>

            {ingresosTotales === 0 && gastosTotales === 0 ? (
              <div className="py-16 text-center text-sm text-gray-400">No hay movimientos registrados aún.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Mes</th>
                      <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">Ingresos</th>
                      <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">Gastos</th>
                      <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {monthlyData.filter(m => m.ingresos > 0 || m.gastos > 0).map((mes) => (
                      <tr key={`${mes.mes}-${mes.yr}`} className={`transition-colors ${mes.isCurrent ? 'bg-red-50/40' : 'hover:bg-gray-50/60'}`}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">{mes.mes} {mes.yr}</span>
                            {mes.isCurrent && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">Actual</span>}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right text-sm text-green-700">${mes.ingresos.toLocaleString('es-AR')}</td>
                        <td className="px-5 py-3.5 text-right text-sm text-red-600">${mes.gastos.toLocaleString('es-AR')}</td>
                        <td className={`px-5 py-3.5 text-right text-sm font-bold ${mes.balance >= 0 ? 'text-gray-900' : 'text-red-700'}`}>
                          ${mes.balance.toLocaleString('es-AR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Historial de gastos */}
          <div className="rounded-xl bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Historial de gastos</h2>
              <p className="text-xs text-gray-400 mt-0.5">{expenses.length} gastos registrados</p>
            </div>

            {expenses.length === 0 ? (
              <div className="py-16 text-center text-sm text-gray-400">No hay gastos registrados aún.</div>
            ) : (
              <>
                <div className="sm:hidden divide-y divide-gray-50">
                  {expenses.map((e) => (
                    <div key={e.id} className="px-5 py-3.5 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900">{e.description}</p>
                        <button
                          onClick={() => handleDeleteExpense(e.id)}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-600 capitalize">{e.category}</span>
                        <span className="text-gray-400">{new Date(e.expense_date).toLocaleDateString('es-AR')}</span>
                      </div>
                      <p className="text-sm font-bold text-red-600">-${e.amount.toLocaleString('es-AR')}</p>
                    </div>
                  ))}
                </div>
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-50">
                        <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Fecha</th>
                        <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Descripción</th>
                        <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Categoría</th>
                        <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">Monto</th>
                        <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {expenses.map((e) => (
                        <tr key={e.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-5 py-3.5 text-sm text-gray-500">{new Date(e.expense_date).toLocaleDateString('es-AR')}</td>
                          <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{e.description}</td>
                          <td className="px-5 py-3.5">
                            <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600 capitalize">{e.category}</span>
                          </td>
                          <td className="px-5 py-3.5 text-right text-sm font-bold text-red-600">-${e.amount.toLocaleString('es-AR')}</td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              onClick={() => handleDeleteExpense(e.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
