'use client'

import { useState, useEffect, useRef } from 'react'
import { CheckCircle, Plus, X, Search, Trash2 } from 'lucide-react'

type MetodoPago = 'efectivo' | 'transferencia' | 'tarjeta'

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

interface CartItem {
  productoId: string
  productoNombre: string
  talle: string
  cantidad: number
  precioUnitario: number
}

const metodoLabels: Record<MetodoPago, string> = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  tarjeta: 'Tarjeta',
}

const metodoBadge: Record<MetodoPago, string> = {
  efectivo: 'bg-green-100 text-green-700',
  transferencia: 'bg-blue-100 text-blue-700',
  tarjeta: 'bg-purple-100 text-purple-700',
}

const emptyDraft = {
  productoId: '',
  productoNombre: '',
  talle: '',
  cantidad: 1,
  precioUnitario: 0,
}

export default function AdminVentasPage() {
  const [showForm, setShowForm] = useState(false)
  const [cliente, setCliente] = useState('')
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo')
  const [cart, setCart] = useState<CartItem[]>([])
  const [draft, setDraft] = useState(emptyDraft)
  const [productSearch, setProductSearch] = useState('')
  const [showProductDropdown, setShowProductDropdown] = useState(false)
  const [ventas, setVentas] = useState<DBSale[]>([])
  const [products, setProducts] = useState<DBProduct[]>([])
  const [lastVentaSummary, setLastVentaSummary] = useState<{ items: number; total: number; metodo: MetodoPago } | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowProductDropdown(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const selectedProduct = products.find((p) => p.id === draft.productoId)

  const filteredProducts = productSearch.trim() === ''
    ? products.slice(0, 8)
    : products.filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase())).slice(0, 8)

  const cartTotal = cart.reduce((s, it) => s + it.precioUnitario * it.cantidad, 0)
  const draftTotal = draft.precioUnitario * draft.cantidad

  function selectProduct(p: DBProduct) {
    setDraft({
      productoId: p.id,
      productoNombre: p.name,
      talle: '',
      cantidad: 1,
      precioUnitario: p.price,
    })
    setProductSearch(p.name)
    setShowProductDropdown(false)
  }

  function clearDraft() {
    setDraft(emptyDraft)
    setProductSearch('')
  }

  function addToCart() {
    if (!draft.productoId || !draft.talle || draft.cantidad < 1) return
    setCart((prev) => [...prev, { ...draft }])
    clearDraft()
  }

  function removeCartItem(index: number) {
    setCart((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!cliente) return

    // Auto-agregar draft pendiente si está completo
    const itemsToSend: CartItem[] = [...cart]
    if (draft.productoId && draft.talle && draft.cantidad >= 1) {
      itemsToSend.push({ ...draft })
    }
    if (itemsToSend.length === 0) return

    setSubmitting(true)
    const res = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: cliente,
        payment_method: metodoPago,
        items: itemsToSend.map((it) => ({
          product_id: it.productoId,
          product_name: it.productoNombre,
          size: it.talle,
          quantity: it.cantidad,
          unit_price: it.precioUnitario,
        })),
      }),
    })

    if (res.ok) {
      const nuevas = await res.json() as DBSale[]
      setVentas((prev) => [...nuevas.slice().reverse(), ...prev])
      const total = nuevas.reduce((s, v) => s + v.total, 0)
      setLastVentaSummary({ items: nuevas.length, total, metodo: metodoPago })
      setCart([])
      clearDraft()
      setCliente('')
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
          onClick={() => {
            setShowForm((v) => !v)
            setLastVentaSummary(null)
            if (showForm) {
              setCart([])
              clearDraft()
              setCliente('')
            }
          }}
          className="flex items-center gap-2 rounded-lg bg-[#0f0f0f] px-4 py-2.5 text-xs font-semibold tracking-wider text-white hover:bg-gray-800 transition-colors min-h-[44px]"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancelar' : 'Nueva venta'}
        </button>
      </div>

      {/* Success banner */}
      {lastVentaSummary && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3.5">
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
          <div>
            <p className="text-sm font-semibold text-green-800">Venta registrada con éxito</p>
            <p className="text-xs text-green-600 mt-0.5">
              {lastVentaSummary.items} {lastVentaSummary.items === 1 ? 'ítem' : 'ítems'} ·{' '}
              <strong>${lastVentaSummary.total.toLocaleString('es-AR')}</strong> · {metodoLabels[lastVentaSummary.metodo]}
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-xl bg-white p-5 sm:p-6 shadow-sm">
          <h2 className="mb-5 text-sm font-semibold text-gray-900">Nueva venta</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Cliente</label>
              <input
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
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
                    onClick={() => setMetodoPago(m)}
                    className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors ${
                      metodoPago === m
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {metodoLabels[m]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Carrito */}
          {cart.length > 0 && (
            <div className="mt-6">
              <label className={labelClass}>Productos agregados ({cart.length})</label>
              <div className="rounded-lg border border-gray-200 bg-gray-50 divide-y divide-gray-200">
                {cart.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{it.productoNombre}</p>
                      <p className="text-xs text-gray-500">Talle {it.talle} · ×{it.cantidad} · ${it.precioUnitario.toLocaleString('es-AR')} c/u</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 shrink-0">
                      ${(it.precioUnitario * it.cantidad).toLocaleString('es-AR')}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeCartItem(idx)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Draft product */}
          <div className="mt-6 rounded-lg border border-dashed border-gray-300 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              {cart.length === 0 ? 'Producto' : 'Agregar otro producto'}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

              <div className="sm:col-span-2 lg:col-span-3" ref={searchRef}>
                <label className={labelClass}>Buscar producto</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                  <input
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value)
                      setShowProductDropdown(true)
                      if (e.target.value === '') {
                        setDraft(emptyDraft)
                      }
                    }}
                    onFocus={() => setShowProductDropdown(true)}
                    placeholder={loading ? 'Cargando...' : 'Escribí para buscar...'}
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors"
                    autoComplete="off"
                  />
                  {showProductDropdown && filteredProducts.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                      {filteredProducts.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => selectProduct(p)}
                          className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-gray-900 truncate">{p.name}</span>
                          <span className="shrink-0 text-xs font-semibold text-gray-500">${p.price.toLocaleString('es-AR')}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {showProductDropdown && productSearch && filteredProducts.length === 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-xs text-gray-400 shadow-lg">
                      Sin coincidencias
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass}>Talle</label>
                <select
                  value={draft.talle}
                  onChange={(e) => setDraft({ ...draft, talle: e.target.value })}
                  className={inputClass}
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
                  value={draft.cantidad}
                  onChange={(e) => setDraft({ ...draft, cantidad: Math.max(1, parseInt(e.target.value) || 1) })}
                  className={inputClass}
                  disabled={!selectedProduct}
                />
              </div>

              <div>
                <label className={labelClass}>Precio unitario ($)</label>
                <input
                  type="number"
                  min={0}
                  value={draft.precioUnitario}
                  onChange={(e) => setDraft({ ...draft, precioUnitario: parseInt(e.target.value) || 0 })}
                  className={inputClass}
                  disabled={!selectedProduct}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-xs text-gray-500">
                {draft.productoId && draft.talle && (
                  <>Subtotal: <span className="font-semibold text-gray-900">${draftTotal.toLocaleString('es-AR')}</span></>
                )}
              </div>
              <button
                type="button"
                onClick={addToCart}
                disabled={!draft.productoId || !draft.talle || draft.cantidad < 1}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:border-black hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="h-3.5 w-3.5" />
                Agregar a venta
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="mt-6 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3.5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Total venta</p>
              <p className="mt-0.5 text-xs text-gray-400">
                {cart.length} {cart.length === 1 ? 'ítem agregado' : 'ítems agregados'}
                {draft.productoId && draft.talle && ' + 1 sin agregar'}
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${(cartTotal + (draft.productoId && draft.talle ? draftTotal : 0)).toLocaleString('es-AR')}
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={!cliente || (cart.length === 0 && (!draft.productoId || !draft.talle)) || submitting}
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
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${metodoBadge[v.payment_method] ?? 'bg-gray-100 text-gray-700'}`}>
                      {metodoLabels[v.payment_method] ?? v.payment_method}
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
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${metodoBadge[v.payment_method] ?? 'bg-gray-100 text-gray-700'}`}>
                          {metodoLabels[v.payment_method] ?? v.payment_method}
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
