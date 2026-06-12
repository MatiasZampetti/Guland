'use client'

import { useState, useEffect } from 'react'
import { Trash2, Plus, ChevronDown, ChevronUp, Check } from 'lucide-react'

interface PostalCode {
  id: string
  postalCode: string
  domicilio: number
  sucursal: number
}
interface Zone {
  id: string
  name: string
  domicilio: number
  sucursal: number
  postalCodes: PostalCode[]
}
interface Settings {
  whatsappNumber: string
  freeShippingThreshold: number
  cashDiscountPercent: number
  defaultDomicilio: number
  defaultSucursal: number
}

/** Input numérico que confirma el cambio al salir del foco. */
function NumberCell({
  value,
  onCommit,
  prefix,
  max,
  className = '',
}: {
  value: number
  onCommit: (v: number) => void
  prefix?: string
  max?: number
  className?: string
}) {
  const [draft, setDraft] = useState(String(value))
  useEffect(() => { setDraft(String(value)) }, [value])

  const commit = () => {
    let n = Math.max(0, Number(draft) || 0)
    if (max !== undefined) n = Math.min(max, n)
    if (n !== value) onCommit(n)
    setDraft(String(n))
  }

  return (
    <div className={`flex items-center rounded-lg border border-gray-200 bg-white px-2 focus-within:border-black ${className}`}>
      {prefix && <span className="text-xs text-gray-400">{prefix}</span>}
      <input
        type="number"
        min={0}
        max={max}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
        className="w-full bg-transparent px-1 py-1.5 text-sm text-gray-900 outline-none"
      />
    </div>
  )
}

/** Input de texto que confirma al salir del foco. */
function TextCell({
  value,
  onCommit,
  placeholder,
  className = '',
}: {
  value: string
  onCommit: (v: string) => void
  placeholder?: string
  className?: string
}) {
  const [draft, setDraft] = useState(value)
  useEffect(() => { setDraft(value) }, [value])

  const commit = () => {
    const v = draft.trim()
    if (v && v !== value) onCommit(v)
    else setDraft(value)
  }

  return (
    <input
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
      placeholder={placeholder}
      className={`rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 outline-none focus:border-black ${className}`}
    />
  )
}

function AddPostalCodeForm({ onAdd }: { onAdd: (cp: string, dom: number, suc: number) => void }) {
  const [open, setOpen] = useState(false)
  const [cp, setCp] = useState('')
  const [dom, setDom] = useState('')
  const [suc, setSuc] = useState('')

  const submit = () => {
    if (!cp.trim()) return
    onAdd(cp.trim(), Number(dom) || 0, Number(suc) || 0)
    setCp(''); setDom(''); setSuc(''); setOpen(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-black transition-colors"
      >
        <Plus className="h-3.5 w-3.5" /> Agregar código postal
      </button>
    )
  }

  return (
    <div className="mt-3 flex flex-wrap items-end gap-2 rounded-lg border border-dashed border-gray-300 p-3">
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">CP</label>
        <input
          autoFocus
          value={cp}
          onChange={(e) => setCp(e.target.value)}
          placeholder="5800"
          className="mt-1 w-24 rounded border border-gray-200 px-2 py-1.5 text-sm text-gray-900 outline-none focus:border-black"
        />
      </div>
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Domicilio $</label>
        <input
          type="number"
          value={dom}
          onChange={(e) => setDom(e.target.value)}
          placeholder="0"
          className="mt-1 w-28 rounded border border-gray-200 px-2 py-1.5 text-sm text-gray-900 outline-none focus:border-black"
        />
      </div>
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Sucursal $</label>
        <input
          type="number"
          value={suc}
          onChange={(e) => setSuc(e.target.value)}
          placeholder="0"
          className="mt-1 w-28 rounded border border-gray-200 px-2 py-1.5 text-sm text-gray-900 outline-none focus:border-black"
        />
      </div>
      <button onClick={submit} className="rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white hover:opacity-80">
        Agregar
      </button>
      <button onClick={() => setOpen(false)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50">
        Cancelar
      </button>
    </div>
  )
}

function ZoneCard({
  zone,
  onUpdateZone,
  onDeleteZone,
  onAddPostalCode,
  onUpdatePostalCode,
  onDeletePostalCode,
}: {
  zone: Zone
  onUpdateZone: (id: string, patch: Partial<Zone>) => void
  onDeleteZone: (id: string) => void
  onAddPostalCode: (zoneId: string, cp: string, dom: number, suc: number) => void
  onUpdatePostalCode: (zoneId: string, id: string, patch: Partial<PostalCode>) => void
  onDeletePostalCode: (zoneId: string, id: string) => void
}) {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <div className="rounded-xl bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 px-5 py-4">
        <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-black">
          {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>
        <TextCell
          value={zone.name}
          onCommit={(v) => onUpdateZone(zone.id, { name: v })}
          className="flex-1 min-w-[140px] font-semibold text-gray-800"
        />
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Domic.</span>
          <NumberCell value={zone.domicilio} prefix="$" onCommit={(v) => onUpdateZone(zone.id, { domicilio: v })} className="w-28" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Sucur.</span>
          <NumberCell value={zone.sucursal} prefix="$" onCommit={(v) => onUpdateZone(zone.id, { sucursal: v })} className="w-28" />
        </div>
        <button
          onClick={() => {
            if (confirm(`¿Eliminar la zona "${zone.name}" y sus códigos postales?`)) onDeleteZone(zone.id)
          }}
          className="ml-auto rounded p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {!collapsed && (
        <div className="px-5 py-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Códigos postales con precio propio
          </p>
          {zone.postalCodes.length === 0 ? (
            <p className="text-xs text-gray-400">Sin códigos postales puntuales. Se usa la tarifa base de la zona.</p>
          ) : (
            <div className="space-y-2">
              {zone.postalCodes.map((pc) => (
                <div key={pc.id} className="flex flex-wrap items-center gap-2">
                  <TextCell
                    value={pc.postalCode}
                    onCommit={(v) => onUpdatePostalCode(zone.id, pc.id, { postalCode: v })}
                    className="w-24"
                  />
                  <span className="text-[11px] text-gray-400">Domic.</span>
                  <NumberCell value={pc.domicilio} prefix="$" onCommit={(v) => onUpdatePostalCode(zone.id, pc.id, { domicilio: v })} className="w-28" />
                  <span className="text-[11px] text-gray-400">Sucur.</span>
                  <NumberCell value={pc.sucursal} prefix="$" onCommit={(v) => onUpdatePostalCode(zone.id, pc.id, { sucursal: v })} className="w-28" />
                  <button
                    onClick={() => onDeletePostalCode(zone.id, pc.id)}
                    className="rounded p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <AddPostalCodeForm onAdd={(cp, dom, suc) => onAddPostalCode(zone.id, cp, dom, suc)} />
        </div>
      )}
    </div>
  )
}

export default function AdminConfiguracionPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)
  const [savedFlash, setSavedFlash] = useState(false)
  const [showZoneForm, setShowZoneForm] = useState(false)
  const [newZone, setNewZone] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => { setSettings(data.settings); setZones(data.zones); setLoading(false) })
  }, [])

  const saveSettings = async (patch: Partial<Settings>) => {
    if (!settings) return
    const next = { ...settings, ...patch }
    setSettings(next)
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    if (res.ok) { setSavedFlash(true); setTimeout(() => setSavedFlash(false), 1500) }
  }

  const handleAddZone = async () => {
    if (!newZone.trim()) return
    const res = await fetch('/api/settings/zones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newZone.trim() }),
    })
    if (res.ok) {
      const created = await res.json()
      setZones((prev) => [...prev, created])
    }
    setNewZone(''); setShowZoneForm(false)
  }

  const handleUpdateZone = async (id: string, patch: Partial<Zone>) => {
    setZones((prev) => prev.map((z) => (z.id === id ? { ...z, ...patch } : z)))
    await fetch(`/api/settings/zones/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
  }

  const handleDeleteZone = async (id: string) => {
    setZones((prev) => prev.filter((z) => z.id !== id))
    await fetch(`/api/settings/zones/${id}`, { method: 'DELETE' })
  }

  const handleAddPostalCode = async (zoneId: string, cp: string, dom: number, suc: number) => {
    const res = await fetch('/api/settings/postal-codes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zoneId, postalCode: cp, domicilio: dom, sucursal: suc }),
    })
    if (res.ok) {
      const created = await res.json()
      setZones((prev) => prev.map((z) => (z.id === zoneId ? { ...z, postalCodes: [...z.postalCodes, created] } : z)))
    }
  }

  const handleUpdatePostalCode = async (zoneId: string, id: string, patch: Partial<PostalCode>) => {
    setZones((prev) => prev.map((z) =>
      z.id === zoneId
        ? { ...z, postalCodes: z.postalCodes.map((p) => (p.id === id ? { ...p, ...patch } : p)) }
        : z,
    ))
    await fetch(`/api/settings/postal-codes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
  }

  const handleDeletePostalCode = async (zoneId: string, id: string) => {
    setZones((prev) => prev.map((z) =>
      z.id === zoneId ? { ...z, postalCodes: z.postalCodes.filter((p) => p.id !== id) } : z,
    ))
    await fetch(`/api/settings/postal-codes/${id}`, { method: 'DELETE' })
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="mt-1 text-sm text-gray-500">Pagos, envíos y datos de contacto de la tienda</p>
        </div>
        {savedFlash && (
          <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600">
            <Check className="h-3.5 w-3.5" /> Guardado
          </span>
        )}
      </div>

      {loading || !settings ? (
        <div className="rounded-xl bg-white py-16 text-center shadow-sm">
          <p className="text-sm text-gray-400">Cargando configuración...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* General */}
          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">General</h2>
            <div className="grid grid-cols-1 gap-4 rounded-xl bg-white p-5 shadow-sm sm:grid-cols-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Número de WhatsApp</label>
                <TextCell
                  value={settings.whatsappNumber}
                  onCommit={(v) => saveSettings({ whatsappNumber: v })}
                  placeholder="5493573498196"
                  className="mt-1.5 w-full"
                />
                <p className="mt-1 text-[11px] text-gray-400">Con código de país, sin + ni espacios.</p>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Envío gratis desde $</label>
                <NumberCell
                  value={settings.freeShippingThreshold}
                  prefix="$"
                  onCommit={(v) => saveSettings({ freeShippingThreshold: v })}
                  className="mt-1.5 w-full"
                />
                <p className="mt-1 text-[11px] text-gray-400">Poné 0 para desactivar el envío gratis.</p>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Descuento efectivo/transf. %</label>
                <NumberCell
                  value={settings.cashDiscountPercent}
                  max={100}
                  onCommit={(v) => saveSettings({ cashDiscountPercent: v })}
                  className="mt-1.5 w-full"
                />
                <p className="mt-1 text-[11px] text-gray-400">Porcentaje de descuento por pago en efectivo.</p>
              </div>
            </div>
          </section>

          {/* Envíos */}
          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Zonas de envío</h2>
                <p className="mt-0.5 text-xs text-gray-400">
                  Precio base por zona, con códigos postales puntuales opcionales.
                </p>
              </div>
              <button
                onClick={() => setShowZoneForm(true)}
                className="flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-xs font-semibold text-white hover:opacity-80 transition-opacity"
              >
                <Plus className="h-4 w-4" /> Nueva zona
              </button>
            </div>

            {showZoneForm && (
              <div className="mb-4 flex items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white p-5">
                <input
                  autoFocus
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddZone(); if (e.key === 'Escape') setShowZoneForm(false) }}
                  placeholder="Nombre de zona (ej: Gran Córdoba)"
                  className="flex-1 rounded border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-black"
                />
                <button onClick={handleAddZone} className="rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:opacity-80">
                  Crear
                </button>
                <button onClick={() => { setShowZoneForm(false); setNewZone('') }} className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50">
                  Cancelar
                </button>
              </div>
            )}

            <div className="space-y-3">
              {zones.length === 0 ? (
                <div className="rounded-xl bg-white py-16 text-center shadow-sm">
                  <p className="text-sm text-gray-400">No hay zonas. Creá una para empezar.</p>
                </div>
              ) : (
                zones.map((zone) => (
                  <ZoneCard
                    key={zone.id}
                    zone={zone}
                    onUpdateZone={handleUpdateZone}
                    onDeleteZone={handleDeleteZone}
                    onAddPostalCode={handleAddPostalCode}
                    onUpdatePostalCode={handleUpdatePostalCode}
                    onDeletePostalCode={handleDeletePostalCode}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
