'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Plus, X } from 'lucide-react'

type MetodoPago = 'efectivo' | 'transferencia' | 'mercadopago' | 'tarjeta'

interface DBSale {
  id: string
  product_id: string | null
  product_name: string
  customer_name: string
  size: string
  quantity: number
  unit_price: number
  total: number
  payment_method: MetodoPago
  created_at: string
}

interface DBProduct {
  id: string
  name: string
  price: number
  sizes: string[]
}

const metodoLabels: Record<MetodoPago, string> = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  mercadopago: 'MercadoPago',
  tarjeta: 'Tarjeta',
}

const metodoBadge: Record<MetodoPago, string> = {
  efectivo: 'bg-green-100 text-green-700',
  transferencia: 'bg-blue-100 text-blue-700',
  mercadopago: 'bg-sky-100 text-sky-700',
  tarjeta: 'bg-purple-100 text-purple-700',
}

const emptyForm = {
  cliente: '',
  productoId: '',
  productoNombre: '',
  talle: '',
  cantidad: 1,
  precioUnitario: 0,
  metodoPago: 'mercadopago' as MetodoPago,
}

export default function AdminVentasPage() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [ventas, setVentas] = useState<DBSale[]>([])
  const [products, setProducts] = useState<DBProduct[]>([])
  const [lastVenta, setLastVenta] = useState<DBSale | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/sales').then(r => r.json()),
      fetch('/api/products').then(r => r.json()),
    ]).then(([salesData, productsData]) => {
      setVentas(Array.isArray(salesData) ? salesData : [])
      setProducts((Array.isArray(productsData) ? productsData : []).map((p: DBProduct) => ({
        id: p.id, name: p.name, price: p.price, sizes: p.sizes,
      })))
      setLoading(false)
    })
  }, [])

  const selectedProduct = products.find((p) => p.id === form.productoId)
  const total = form.precioUnitario * form.cantidad

  function handleProductChange(id: string) {
    const p = products.find((pr) => pr.id === id)
    setForm((f) => ({
      ...f,
      productoId: id,
      productoNombre: p?.name ?? '',
      talle: '',
      precioUnitario: p?.price ?? 0,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.cliente || !form.productoId || !form.talle || form.cantidad < 1) return
    setSubmitting(true)

    const res = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: form.productoId,
        product_name: form.productoNombre,
        customer_name: form.cliente,
        size: form.talle,
        quantity: form.cantidad,
        unit_price: form.precioUnitario,
        payment_method: form.metodoPago,
      }),
    })

    if (res.ok) {
      const nueva = await res.json()
      setVentas((prev) => [nueva, ...prev])
      setLastVenta(nueva)
      setForm(emptyForm)
      setShowForm(false)
    }
    setSubmitting(false)
  }

  const inputClass = 'w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors'
  const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5'

  return (
    <div className="p-4 sm:p-6 md:p-8">

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Registrar venta</h1>
          <p className="mt-0.5 text-sm text-gray-400">Cada venta queda registrada en el historial</p>
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setLastVenta(null) }}
          className="flex items-center gap-2 rounded-lg bg-[#0f0f0f] px-4 py-2.5 text-xs font-semibold tracking-wider text-white hover:bg-gray-800 transition-colors min-h-[44px]"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancelar' : 'Nueva venta'}
        </button>
      </div>

      {/* Success banner */}
      {lastVenta && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3.5">
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
          <div>
            <p className="text-sm font-semibold text-green-800">Venta registrada con éxito</p>
            <p className="text-xs text-green-600 mt-0.5">
              {lastVenta.product_name} talle {lastVenta.size} × {lastVenta.quantity} ·{' '}
              <strong>${lastVenta.total.toLocaleString('es-AR')}</strong> · {metodoLabels[lastVenta.payment_method]}
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-xl bg-white p-5 sm:p-6 shadow-sm">
          <h2 className="mb-5 text-sm font-semibold text-gray-900">Nueva venta</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <div className="lg:col-span-2">
              <label className={labelClass}>Cliente</label>
              <input
                value={form.cliente}
                onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                placeholder="Nombre del cliente"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Método de pago</label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(metodoLabels) as MetodoPago[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setForm({ ...form, metodoPago: m })}
                    className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors ${
                      form.metodoPago === m
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {metodoLabels[m]}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className={labelClass}>Producto</label>
              <select
                value={form.productoId}
                onChange={(e) => handleProductChange(e.target.value)}
                className={inputClass}
                required
                disabled={loading}
              >
                <option value="">{loading ? 'Cargando...' : 'Seleccionar producto...'}</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ${p.price.toLocaleString('es-AR')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Talle</label>
              <select
                value={form.talle}
                onChange={(e) => setForm({ ...form, talle: e.target.value })}
                className={inputClass}
                required
                disabled={!selectedProduct}
              >
                <option value="">Seleccionar...</option>
                {selectedProduct?.sizes.map((s: string) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Cantidad</label>
              <input
                type="number"
                min={1}
                max={99}
                value={form.cantidad}
                onChange={(e) => setForm({ ...form, cantidad: Math.max(1, parseInt(e.target.value) || 1) })}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Precio unitario ($)</label>
              <input
                type="number"
                min={0}
                value={form.precioUnitario}
                onChange={(e) => setForm({ ...form, precioUnitario: parseInt(e.target.value) || 0 })}
                className={inputClass}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Total</label>
              <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5">
                <span className="text-lg font-bold text-gray-900">${total.toLocaleString('es-AR')}</span>
                {form.cantidad > 1 && (
                  <span className="ml-2 text-xs text-gray-400">
                    ({form.cantidad} × ${form.precioUnitario.toLocaleString('es-AR')})
                  </span>
                )}
              </div>
            </div>

          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={!form.cliente || !form.productoId || !form.talle || submitting}
              className="rounded-lg bg-[#0f0f0f] px-6 py-2.5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-gray-800 disabled:opacity-40"
            >
              {submitting ? 'Registrando...' : 'Registrar venta'}
            </button>
          </div>
        </form>
      )}

      {/* Sales history */}
      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">Historial de ventas</h2>
          <p className="text-xs text-gray-400 mt-0.5">{ventas.length} ventas registradas</p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">Cargando...</div>
        ) : ventas.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">No hay ventas registradas aún.</div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-gray-50">
              {ventas.map((v) => (
                <div key={v.id} className="px-5 py-3.5 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-mono text-gray-400">{v.id.slice(0, 8)}</p>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${metodoBadge[v.payment_method]}`}>
                      {metodoLabels[v.payment_method]}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{v.customer_name}</p>
                  <p className="text-xs text-gray-500">{v.product_name} · Talle {v.size} · ×{v.quantity}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">{new Date(v.created_at).toLocaleDateString('es-AR')}</p>
                    <p className="text-sm font-bold text-gray-900">${v.total.toLocaleString('es-AR')}</p>
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
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Producto</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Cant.</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Total</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Pago</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ventas.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3.5 text-xs font-mono text-gray-500">{v.id.slice(0, 8)}</td>
                      <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{v.customer_name}</td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm text-gray-700">{v.product_name}</p>
                        <p className="text-xs text-gray-400">Talle {v.size}</p>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{v.quantity}</td>
                      <td className="px-5 py-3.5 text-sm font-bold text-gray-900">${v.total.toLocaleString('es-AR')}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${metodoBadge[v.payment_method]}`}>
                          {metodoLabels[v.payment_method]}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-400">
                        {new Date(v.created_at).toLocaleDateString('es-AR')}
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
