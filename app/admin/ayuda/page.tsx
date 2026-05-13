'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus, ChevronDown, ChevronUp, Check, X } from 'lucide-react'
import { useFaqStore, FaqCategory, FaqItem } from '@/lib/faq-store'

// ── Inline editable text ──────────────────────────────────────────────────────
function InlineEdit({
  value,
  onSave,
  multiline = false,
  className = '',
}: {
  value: string
  onSave: (v: string) => void
  multiline?: boolean
  className?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const commit = () => {
    if (draft.trim()) onSave(draft.trim())
    setEditing(false)
  }
  const cancel = () => { setDraft(value); setEditing(false) }

  if (!editing) {
    return (
      <span
        className={`cursor-pointer rounded px-1 hover:bg-gray-100 ${className}`}
        onClick={() => { setDraft(value); setEditing(true) }}
      >
        {value}
      </span>
    )
  }

  return (
    <span className="flex items-start gap-1">
      {multiline ? (
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          className={`flex-1 rounded border border-gray-300 px-2 py-1 text-sm outline-none focus:border-black ${className}`}
        />
      ) : (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel() }}
          className={`flex-1 rounded border border-gray-300 px-2 py-1 text-sm outline-none focus:border-black ${className}`}
        />
      )}
      <button onClick={commit} className="mt-0.5 rounded p-1 hover:bg-green-50 text-green-600"><Check className="h-3.5 w-3.5" /></button>
      <button onClick={cancel} className="mt-0.5 rounded p-1 hover:bg-red-50 text-red-500"><X className="h-3.5 w-3.5" /></button>
    </span>
  )
}

// ── Add item form ─────────────────────────────────────────────────────────────
function AddItemForm({ onAdd }: { onAdd: (q: string, a: string) => void }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [a, setA] = useState('')

  const submit = () => {
    if (!q.trim() || !a.trim()) return
    onAdd(q.trim(), a.trim())
    setQ(''); setA(''); setOpen(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-black transition-colors"
      >
        <Plus className="h-3.5 w-3.5" /> Agregar pregunta
      </button>
    )
  }

  return (
    <div className="mt-3 rounded-lg border border-dashed border-gray-300 p-4 space-y-3">
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Pregunta</label>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="¿Cuánto tarda el envío?"
          className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black"
        />
      </div>
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Respuesta</label>
        <textarea
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="Los envíos tardan entre..."
          rows={3}
          className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black"
        />
      </div>
      <div className="flex gap-2">
        <button onClick={submit} className="rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:opacity-80">
          Guardar
        </button>
        <button onClick={() => { setOpen(false); setQ(''); setA('') }} className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50">
          Cancelar
        </button>
      </div>
    </div>
  )
}

// ── Category card ─────────────────────────────────────────────────────────────
function CategoryCard({ cat }: { cat: FaqCategory }) {
  const { updateCategory, deleteCategory, addItem, updateItem, deleteItem } = useFaqStore()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="rounded-xl bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-black">
            {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
          <InlineEdit
            value={cat.category}
            onSave={(v) => updateCategory(cat.id, v)}
            className="text-sm font-bold tracking-widest text-gray-800"
          />
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
            {cat.items.length} {cat.items.length === 1 ? 'pregunta' : 'preguntas'}
          </span>
        </div>
        <button
          onClick={() => {
            if (confirm(`¿Eliminar la categoría "${cat.category}" y todas sus preguntas?`)) {
              deleteCategory(cat.id)
            }
          }}
          className="rounded p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Items */}
      {!collapsed && (
        <div className="divide-y divide-gray-50 px-6">
          {cat.items.map((item) => (
            <div key={item.id} className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-[10px] font-bold tracking-wider text-gray-300">P</span>
                    <InlineEdit
                      value={item.q}
                      onSave={(v) => updateItem(cat.id, item.id, v, item.a)}
                      className="flex-1 text-sm font-medium text-gray-800"
                    />
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-[10px] font-bold tracking-wider text-gray-300">R</span>
                    <InlineEdit
                      value={item.a}
                      onSave={(v) => updateItem(cat.id, item.id, item.q, v)}
                      multiline
                      className="flex-1 text-sm text-gray-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => deleteItem(cat.id, item.id)}
                  className="mt-0.5 shrink-0 rounded p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          <AddItemForm onAdd={(q, a) => addItem(cat.id, q, a)} />
          <div className="py-2" />
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminAyudaPage() {
  const { categories, addCategory } = useFaqStore()
  const [newCat, setNewCat] = useState('')
  const [showCatForm, setShowCatForm] = useState(false)

  const handleAddCategory = () => {
    if (!newCat.trim()) return
    addCategory(newCat.trim().toUpperCase())
    setNewCat('')
    setShowCatForm(false)
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Preguntas frecuentes</h1>
          <p className="mt-1 text-sm text-gray-500">
            {categories.reduce((n, c) => n + c.items.length, 0)} preguntas en {categories.length} categorías
          </p>
        </div>
        <button
          onClick={() => setShowCatForm(true)}
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-xs font-semibold text-white hover:opacity-80 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Nueva categoría
        </button>
      </div>

      {/* New category form */}
      {showCatForm && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white p-5">
          <input
            autoFocus
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategory(); if (e.key === 'Escape') setShowCatForm(false) }}
            placeholder="Nombre de categoría (ej: ENVÍOS)"
            className="flex-1 rounded border border-gray-200 px-3 py-2 text-sm uppercase tracking-wider outline-none focus:border-black"
          />
          <button onClick={handleAddCategory} className="rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:opacity-80">
            Crear
          </button>
          <button onClick={() => { setShowCatForm(false); setNewCat('') }} className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50">
            Cancelar
          </button>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="rounded-xl bg-white py-16 text-center shadow-sm">
            <p className="text-sm text-gray-400">No hay categorías. Creá una para empezar.</p>
          </div>
        ) : (
          categories.map((cat) => <CategoryCard key={cat.id} cat={cat} />)
        )}
      </div>
    </div>
  )
}
