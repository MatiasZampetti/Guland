'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, MoreHorizontal, Search, CheckCircle, X, Tag, Upload, ImagePlus, Pencil, AlertTriangle } from 'lucide-react'
import { dbToProduct, type DBProduct } from '@/lib/db-mapper'
import { type Product, Size } from '@/types'
import { SIZE_GUIDE_FIELDS, DEFAULT_MEASUREMENTS, DEFAULT_GUIDE_NOTE, SIZE_ORDER } from '@/lib/size-guide'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
type Visibilidad = 'tienda' | 'new' | 'sale' | 'destacados'
type ActivePanel = 'producto' | 'categorias' | null
type StatusFilter = 'todos' | 'new' | 'sale' | 'destacados' | 'tienda' | 'home'

const HOME_LIMIT = 4

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'new', label: 'New Drop' },
  { value: 'sale', label: 'Sale' },
  { value: 'destacados', label: 'Destacados' },
  { value: 'tienda', label: 'Solo tienda' },
  { value: 'home', label: 'En home' },
]

function matchesStatus(p: Product, status: StatusFilter): boolean {
  switch (status) {
    case 'new': return !!p.isNew
    case 'sale': return !!p.isOnSale
    case 'destacados': return !!p.featured
    case 'tienda': return !p.isNew && !p.isOnSale && !p.featured
    case 'home': return !!p.inHome
    default: return true
  }
}

// ¿El producto trackea stock en al menos un talle? (números, no undefined)
function tracksStock(p: Product): boolean {
  return p.sizes.some((s) => typeof p.stock?.[s] === 'number')
}

// Suma del stock de todos los talles trackeados
function totalStock(p: Product): number {
  return p.sizes.reduce((sum, s) => {
    const qty = p.stock?.[s]
    return sum + (typeof qty === 'number' ? qty : 0)
  }, 0)
}

// Producto agotado: trackea stock y no le queda ninguna unidad
function isOutOfStock(p: Product): boolean {
  return tracksStock(p) && totalStock(p) === 0
}

const emptyForm = {
  name: '',
  price: '',
  category: '',
  sizes: [] as Size[],
  stock: {} as Record<string, number>,
  sizeGuide: {
    measurements: {} as Record<string, { pecho: string; cintura: string; cadera: string }>,
    note: '',
  },
  description: '',
  image1: '',
  image1File: null as File | null,
  image1Preview: '',
  image2: '',
  image2File: null as File | null,
  image2Preview: '',
  extraImages: [] as { file: File | null; url: string; preview: string }[],
  visibilidad: 'tienda' as Visibilidad,
  inHome: false,
}

const emptyCatForm = { label: '', imageFile: null as File | null, imagePreview: '' }

function slugify(name: string) {
  return name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const inputClass = 'w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors'
const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5'

function ImageUploadField({
  label,
  preview,
  onFile,
  required,
}: {
  label: string
  preview: string
  onFile: (file: File) => void
  required?: boolean
}) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div
        onClick={() => ref.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 transition-colors hover:border-gray-400 hover:bg-gray-100"
        style={{ minHeight: '80px' }}
      >
        {preview ? (
          <img src={preview} alt="" className="h-20 w-full rounded-lg object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 py-4 text-gray-400">
            <ImagePlus className="h-6 w-6" />
            <span className="text-xs font-medium">Subir imagen</span>
          </div>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        required={required && !preview}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f) }}
      />
    </div>
  )
}

export default function AdminProductosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<{ slug: string; label: string; image_url: string }[]>([])
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [catForm, setCatForm] = useState(emptyCatForm)
  const [lastAdded, setLastAdded] = useState<{ name: string; action: 'added' | 'updated' } | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [homeLimitWarning, setHomeLimitWarning] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('todos')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos')
  const [submitting, setSubmitting] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)
  const extraImagesRef = useRef<HTMLInputElement>(null)

  function addExtraImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length) {
      setForm((f) => ({
        ...f,
        extraImages: [...f.extraImages, ...files.map((file) => ({ file, url: '', preview: URL.createObjectURL(file) }))],
      }))
    }
    e.target.value = '' // permite volver a elegir el mismo archivo
  }

  function removeExtraImage(index: number) {
    setForm((f) => ({ ...f, extraImages: f.extraImages.filter((_, i) => i !== index) }))
  }

  const allFilterCats = ['todos', ...categories.map((c) => c.slug)]

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then((data: DBProduct[]) => setProducts(data.map(dbToProduct)))
    fetch('/api/categories').then(r => r.json()).then(setCategories)
  }, [])

  const filtered = products
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.includes(search.toLowerCase())
      const matchCat = catFilter === 'todos' || p.category === catFilter
      const matchStatus = matchesStatus(p, statusFilter)
      return matchSearch && matchCat && matchStatus
    })
    // Los productos sin stock van al final (orden relativo estable)
    .sort((a, b) => Number(isOutOfStock(a)) - Number(isOutOfStock(b)))

  function togglePanel(panel: ActivePanel) {
    setActivePanel((v) => (v === panel ? null : panel))
    setLastAdded(null)
    if (editingId) {
      setEditingId(null)
      setForm(emptyForm)
    }
  }

  function startEdit(product: Product) {
    const visibilidad: Visibilidad = product.isNew ? 'new' : product.isOnSale ? 'sale' : product.featured ? 'destacados' : 'tienda'
    setForm({
      name: product.name,
      price: String(product.price),
      category: product.category,
      sizes: product.sizes as Size[],
      stock: product.stock ?? {},
      sizeGuide: {
        measurements: Object.fromEntries(
          Object.entries(product.sizeGuide?.measurements ?? {}).map(([s, m]) => [
            s,
            { pecho: m?.pecho ?? '', cintura: m?.cintura ?? '', cadera: m?.cadera ?? '' },
          ])
        ),
        note: product.sizeGuide?.note ?? '',
      },
      description: product.description,
      image1: product.images[0] ?? '',
      image1File: null,
      image1Preview: '',
      image2: product.images[1] ?? '',
      image2File: null,
      image2Preview: '',
      extraImages: product.images.slice(2).map((url) => ({ file: null, url, preview: url })),
      visibilidad,
      inHome: product.inHome ?? false,
    })
    setEditingId(product.id)
    setActivePanel('producto')
    setLastAdded(null)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function toggleSize(s: Size) {
    setForm((f) => {
      const hasSize = f.sizes.includes(s)
      const newSizes = hasSize ? f.sizes.filter((x) => x !== s) : [...f.sizes, s]
      const newStock = { ...f.stock }
      if (hasSize) {
        delete newStock[s]
      } else if (!(s in newStock)) {
        newStock[s] = 1
      }
      return { ...f, sizes: newSizes, stock: newStock }
    })
  }

  function setSizeStock(size: Size, value: number) {
    setForm((f) => ({ ...f, stock: { ...f.stock, [size]: Math.max(0, value) } }))
  }

  function setGuideValue(size: Size, field: 'pecho' | 'cintura' | 'cadera', value: string) {
    setForm((f) => {
      const prev = f.sizeGuide.measurements[size] ?? { pecho: '', cintura: '', cadera: '' }
      return {
        ...f,
        sizeGuide: {
          ...f.sizeGuide,
          measurements: { ...f.sizeGuide.measurements, [size]: { ...prev, [field]: value } },
        },
      }
    })
  }

  function setVisibilidad(value: Visibilidad) {
    // El flag "en home" solo aplica a New Drop y Destacados
    const keepsHome = value === 'new' || value === 'destacados'
    setForm((f) => ({ ...f, visibilidad: value, inHome: keepsHome ? f.inHome : false }))
  }

  // Cuántos productos ya están "en home" en la sección de la categoría actual (excluye el que se edita)
  function homeCount(cat: Visibilidad) {
    return products.filter((p) =>
      p.id !== editingId && p.inHome && (cat === 'new' ? p.isNew : cat === 'destacados' ? p.featured : false)
    ).length
  }

  function toggleHome() {
    const cat = form.visibilidad
    if (cat !== 'new' && cat !== 'destacados') return
    // Apagar siempre se permite
    if (form.inHome) {
      setForm((f) => ({ ...f, inHome: false }))
      return
    }
    // Encender: validar tope de 4
    if (homeCount(cat) >= HOME_LIMIT) {
      const seccion = cat === 'new' ? 'New Drop' : 'Destacados'
      setHomeLimitWarning(`Ya hay ${HOME_LIMIT} productos ${seccion} en el home. Sacá uno antes de agregar otro.`)
      return
    }
    setForm((f) => ({ ...f, inHome: true }))
  }

  async function uploadImage(file: File, bucket: string): Promise<string> {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('bucket', bucket)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const { url } = await res.json()
    return url
  }

  async function handleSubmitProduct(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.price || !form.category || form.sizes.length === 0) return
    if (!editingId && !form.image1 && !form.image1File) return
    setSubmitting(true)
    setSaveError(null)

    try {
      const images: string[] = []
      if (form.image1File) images.push(await uploadImage(form.image1File, 'products'))
      else if (form.image1) images.push(form.image1)
      if (form.image2File) images.push(await uploadImage(form.image2File, 'products'))
      else if (form.image2) images.push(form.image2)
      for (const img of form.extraImages) {
        if (img.file) images.push(await uploadImage(img.file, 'products'))
        else if (img.url) images.push(img.url)
      }

      const stockClean = Object.fromEntries(
        form.sizes.map((s) => [s, form.stock[s] ?? 0])
      )

      // Guía de talles: solo guarda lo que el admin cargó (campos vacíos => default en la tienda).
      const measurements: Record<string, { pecho: string; cintura: string; cadera: string }> = {}
      for (const s of form.sizes) {
        const m = form.sizeGuide.measurements[s]
        const pecho = m?.pecho.trim() ?? ''
        const cintura = m?.cintura.trim() ?? ''
        const cadera = m?.cadera.trim() ?? ''
        if (pecho || cintura || cadera) measurements[s] = { pecho, cintura, cadera }
      }
      const size_guide = { measurements, note: form.sizeGuide.note.trim() }

      const payload = {
        name: form.name,
        price: parseInt(form.price),
        category_slug: form.category,
        description: form.description,
        images,
        sizes: form.sizes,
        stock: stockClean,
        size_guide,
        featured: form.visibilidad === 'destacados',
        is_new: form.visibilidad === 'new',
        is_on_sale: form.visibilidad === 'sale',
        in_home: form.inHome,
      }

      const res = editingId
        ? await fetch(`/api/products/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug: slugify(form.name), ...payload }),
          })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setSaveError(data?.error || `Error ${res.status}: no se pudo guardar el producto.`)
        return
      }

      const saved = await res.json()
      if (editingId) {
        setProducts((prev) => prev.map((p) => p.id === editingId ? dbToProduct(saved as DBProduct) : p))
        setLastAdded({ name: form.name, action: 'updated' })
        setEditingId(null)
      } else {
        setProducts((prev) => [dbToProduct(saved as DBProduct), ...prev])
        setLastAdded({ name: form.name, action: 'added' })
      }
      setForm(emptyForm)
      setActivePanel(null)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Error inesperado al guardar.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault()
    if (!catForm.label || !catForm.imageFile) return
    setSubmitting(true)

    const image_url = await uploadImage(catForm.imageFile, 'categories')
    const slug = slugify(catForm.label)

    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, label: catForm.label, image_url }),
    })

    if (res.ok) {
      const newCat = await res.json()
      setCategories((prev) => [...prev, newCat])
      setCatForm(emptyCatForm)
    }
    setSubmitting(false)
  }

  async function handleDeleteCategory(slug: string) {
    await fetch(`/api/categories/${slug}`, { method: 'DELETE' })
    setCategories((prev) => prev.filter((c) => c.slug !== slug))
  }

  async function handleDeleteProduct(id: string) {
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div ref={topRef} className="p-4 sm:p-6 md:p-8">

      {/* Popup: límite de productos en home */}
      {homeLimitWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setHomeLimitWarning(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-bold text-gray-900">Límite alcanzado</h3>
            <p className="mt-2 text-sm text-gray-600">{homeLimitWarning}</p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setHomeLimitWarning(null)}
                className="rounded-lg bg-[#0f0f0f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Productos</h1>
          <p className="mt-0.5 text-sm text-gray-400">{products.length} productos en catálogo</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => togglePanel('categorias')}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-semibold tracking-wider transition-colors min-h-[44px] ${
              activePanel === 'categorias' ? 'border-gray-800 bg-gray-800 text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            {activePanel === 'categorias' ? <X className="h-4 w-4" /> : <Tag className="h-4 w-4" />}
            Categorías
          </button>
          <button
            onClick={() => {
              if (activePanel === 'producto') {
                setActivePanel(null)
                setEditingId(null)
                setForm(emptyForm)
              } else {
                togglePanel('producto')
              }
            }}
            className="flex items-center gap-2 rounded-lg bg-[#0f0f0f] px-4 py-2.5 text-xs font-semibold tracking-wider text-white hover:bg-gray-800 transition-colors min-h-[44px]"
          >
            {activePanel === 'producto' ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {activePanel === 'producto' ? (editingId ? 'Cancelar edición' : 'Cancelar') : 'Nuevo producto'}
          </button>
        </div>
      </div>

      {lastAdded && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3.5">
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
          <div>
            <p className="text-sm font-semibold text-green-800">
              {lastAdded.action === 'updated' ? 'Producto actualizado' : 'Producto agregado'}
            </p>
            <p className="text-xs text-green-600 mt-0.5">{lastAdded.name} ya aparece en el catálogo.</p>
          </div>
        </div>
      )}

      {saveError && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">No se pudo guardar</p>
            <p className="text-xs text-red-600 mt-0.5">{saveError}</p>
          </div>
          <button onClick={() => setSaveError(null)} className="text-red-400 hover:text-red-600 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Panel: Categorías */}
      {activePanel === 'categorias' && (
        <div className="mb-8 rounded-xl bg-white p-5 sm:p-6 shadow-sm">
          <h2 className="mb-5 text-sm font-semibold text-gray-900">Gestionar categorías</h2>
          <div className="mb-5">
            <label className={labelClass}>Categorías actuales</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <div key={cat.slug} className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 pl-3 pr-1.5 py-1.5">
                  <img src={cat.image_url} alt={cat.label} className="h-5 w-5 rounded object-cover" />
                  <span className="text-sm font-medium text-gray-800 capitalize">{cat.label}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat.slug)}
                    className="ml-1 flex h-5 w-5 items-center justify-center rounded text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={handleAddCategory}>
            <label className={labelClass}>Agregar nueva categoría</label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <input
                  value={catForm.label}
                  onChange={(e) => setCatForm({ ...catForm, label: e.target.value })}
                  placeholder="Nombre (ej: Accesorios)"
                  className={inputClass}
                  required
                />
              </div>
              <div
                onClick={() => document.getElementById('cat-image-input')?.click()}
                className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-gray-200 px-4 py-2.5 text-sm text-gray-400 hover:border-gray-400 transition-colors"
              >
                {catForm.imagePreview
                  ? <img src={catForm.imagePreview} alt="" className="h-6 w-6 rounded object-cover" />
                  : <Upload className="h-4 w-4" />
                }
                <span className="text-xs">{catForm.imageFile ? catForm.imageFile.name : 'Imagen de portada'}</span>
              </div>
              <input
                id="cat-image-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) setCatForm({ ...catForm, imageFile: f, imagePreview: URL.createObjectURL(f) })
                }}
              />
              <button
                type="submit"
                disabled={!catForm.label || !catForm.imageFile || submitting}
                className="shrink-0 rounded-lg bg-[#0f0f0f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-40 transition-colors"
              >
                Agregar
              </button>
            </div>
            {catForm.label && <p className="mt-1.5 text-[11px] text-gray-400">Slug: <span className="font-mono">/shop/{slugify(catForm.label)}</span></p>}
          </form>
        </div>
      )}

      {/* Panel: Nuevo / Editar Producto */}
      {activePanel === 'producto' && (
        <form onSubmit={handleSubmitProduct} className="mb-8 rounded-xl bg-white p-5 sm:p-6 shadow-sm">
          <h2 className="mb-5 text-sm font-semibold text-gray-900">
            {editingId ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <div className="sm:col-span-2">
              <label className={labelClass}>Nombre</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Buzo Oversize Negro" className={inputClass} required />
            </div>

            <div>
              <label className={labelClass}>Precio ($)</label>
              <input type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="18500" className={inputClass} required />
            </div>

            <div>
              <label className={labelClass}>Categoría</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass} required>
                <option value="">Seleccionar...</option>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelClass}>Talles disponibles</label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button key={s} type="button" onClick={() => toggleSize(s)}
                    className={`rounded-lg border px-4 py-2 text-xs font-semibold transition-colors ${form.sizes.includes(s) ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'}`}
                  >{s}</button>
                ))}
              </div>
              {form.sizes.length === 0 && <p className="mt-1.5 text-[11px] text-gray-400">Seleccioná al menos un talle</p>}

              {form.sizes.length > 0 && (
                <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Stock por talle</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                    {form.sizes.map((s) => (
                      <div key={s} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
                        <span className="text-xs font-semibold text-gray-700 w-8">{s}</span>
                        <input
                          type="number"
                          min={0}
                          value={form.stock[s] ?? 0}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => setSizeStock(s, e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                          className="w-full bg-transparent text-sm text-gray-900 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {form.sizes.length > 0 && (
              <div className="sm:col-span-2 lg:col-span-3">
                <label className={labelClass}>Guía de talles (medidas en cm)</label>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="mb-2 text-[11px] text-gray-400">
                    Dejá un campo vacío para usar la medida por defecto (la del placeholder).
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[420px] border-separate border-spacing-y-1">
                      <thead>
                        <tr>
                          <th className="w-12 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Talle</th>
                          {SIZE_GUIDE_FIELDS.map((col) => (
                            <th key={col.key} className="px-1 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">{col.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {SIZE_ORDER.filter((s) => form.sizes.includes(s)).map((s) => (
                          <tr key={s}>
                            <td className="pr-2 text-xs font-semibold text-gray-700">{s}</td>
                            {SIZE_GUIDE_FIELDS.map((col) => (
                              <td key={col.key} className="px-1">
                                <input
                                  type="text"
                                  value={form.sizeGuide.measurements[s]?.[col.key] ?? ''}
                                  onChange={(e) => setGuideValue(s, col.key, e.target.value)}
                                  placeholder={DEFAULT_MEASUREMENTS[s][col.key]}
                                  className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 outline-none focus:border-gray-400"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Nota (opcional)</label>
                    <input
                      type="text"
                      value={form.sizeGuide.note}
                      onChange={(e) => setForm({ ...form, sizeGuide: { ...form.sizeGuide, note: e.target.value } })}
                      placeholder={DEFAULT_GUIDE_NOTE}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelClass}>Descripción</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describí el producto..." rows={2} className={`${inputClass} resize-none`} />
            </div>

            <div className="sm:col-span-2">
              <ImageUploadField
                label="Imagen principal *"
                preview={form.image1Preview || form.image1}
                onFile={(f) => setForm({ ...form, image1File: f, image1: '', image1Preview: URL.createObjectURL(f) })}
                required
              />
            </div>

            <div>
              <ImageUploadField
                label="Imagen secundaria (opcional)"
                preview={form.image2Preview || form.image2}
                onFile={(f) => setForm({ ...form, image2File: f, image2: '', image2Preview: URL.createObjectURL(f) })}
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelClass}>Imágenes adicionales (carrousel)</label>
              <div className="flex flex-wrap gap-3">
                {form.extraImages.map((img, i) => (
                  <div key={i} className="relative h-20 w-20">
                    <img src={img.preview} alt="" className="h-20 w-20 rounded-lg border border-gray-200 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExtraImage(i)}
                      className="absolute -right-2 -top-2 rounded-full bg-black p-1 text-white shadow-sm transition-colors hover:bg-red-600"
                      aria-label="Quitar imagen"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => extraImagesRef.current?.click()}
                  className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 transition-colors hover:border-gray-400 hover:bg-gray-100"
                >
                  <Plus className="h-5 w-5" />
                  <span className="text-[10px] font-medium">Agregar</span>
                </button>
                <input ref={extraImagesRef} type="file" accept="image/*" multiple className="hidden" onChange={addExtraImages} />
              </div>
              <p className="mt-1.5 text-[11px] text-gray-400">Se muestran en la página del producto como carrousel, en este orden.</p>
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Aparece en</label>
              <div className="flex flex-wrap gap-2">
                {([{ value: 'tienda', label: 'Solo tienda' }, { value: 'new', label: 'New Drop' }, { value: 'sale', label: 'Sale' }, { value: 'destacados', label: 'Destacados' }] as { value: Visibilidad; label: string }[]).map(({ value, label }) => (
                  <button key={value} type="button" onClick={() => setVisibilidad(value)}
                    className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors ${form.visibilidad === value ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'}`}
                  >{label}</button>
                ))}
              </div>
            </div>

            {(() => {
              const homeEnabled = form.visibilidad === 'new' || form.visibilidad === 'destacados'
              const homeLabel = form.visibilidad === 'new' ? 'New Drop en home' : form.visibilidad === 'destacados' ? 'Destacado en home' : 'En home'
              return (
                <div>
                  <label className={labelClass}>{homeLabel}</label>
                  <button type="button" onClick={toggleHome} disabled={!homeEnabled}
                    className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${form.inHome && homeEnabled ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'}`}
                  >{!homeEnabled ? 'No disponible' : form.inHome ? 'Sí, en home' : 'No en home'}</button>
                  {homeEnabled && <p className="mt-1.5 text-[11px] text-gray-400">{homeCount(form.visibilidad)}/{HOME_LIMIT} en el home</p>}
                </div>
              )
            })()}
          </div>

          <div className="mt-6 flex items-center justify-between">
            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setForm(emptyForm); setActivePanel(null) }}
                className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
              >
                Cancelar edición
              </button>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                disabled={submitting || !form.name || !form.price || !form.category || form.sizes.length === 0 || (!editingId && !form.image1 && !form.image1File)}
                className="rounded-lg bg-[#0f0f0f] px-6 py-2.5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-gray-800 disabled:opacity-40"
              >
                {submitting ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Agregar producto'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar producto..."
              className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {allFilterCats.map((c) => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors ${catFilter === c ? 'bg-[#0f0f0f] text-white' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}
              >{c}</button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Estado</span>
          {STATUS_FILTERS.map(({ value, label }) => (
            <button key={value} onClick={() => setStatusFilter(value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${statusFilter === value ? 'bg-[#0f0f0f] text-white' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}
            >{label}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="sm:hidden divide-y divide-gray-50">
          {filtered.map((product) => (
            <div key={product.id} className="flex items-start gap-3 px-4 py-3.5">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900 leading-tight">{product.name}</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 outline-none hover:bg-gray-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2 text-sm cursor-pointer" onClick={() => startEdit(product)}>
                        <Pencil className="h-3.5 w-3.5" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-sm text-red-600 cursor-pointer focus:text-red-600" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="h-3.5 w-3.5" /> Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="capitalize">{product.category}</span>
                  <span>·</span>
                  <span className="font-semibold text-gray-900">${product.price.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {product.sizes.map((s) => {
                    const qty = product.stock?.[s]
                    const agotado = qty === 0
                    return (
                      <span key={s} className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${agotado ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                        {s}{typeof qty === 'number' ? ` · ${qty}` : ''}
                      </span>
                    )
                  })}
                  {isOutOfStock(product) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                      <AlertTriangle className="h-3 w-3" /> Sin stock
                    </span>
                  )}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {product.isNew && <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">New Drop</span>}
                  {product.isOnSale && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">Sale</span>}
                  {product.featured && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">Destacado</span>}
                  {!product.isNew && !product.featured && !product.isOnSale && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">Tienda</span>}
                  {product.inHome && <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">En home</span>}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="py-16 text-center text-sm text-gray-400">No se encontraron productos.</div>}
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Producto', 'Categoría', 'Precio', 'Talles', 'Estado', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 capitalize text-sm text-gray-600">{product.category}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">${product.price.toLocaleString('es-AR')}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap items-center gap-1">
                      {product.sizes.map((s) => {
                        const qty = product.stock?.[s]
                        const agotado = qty === 0
                        return (
                          <span key={s} className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${agotado ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                            {s}{typeof qty === 'number' ? ` · ${qty}` : ''}
                          </span>
                        )
                      })}
                      {isOutOfStock(product) && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700">
                          <AlertTriangle className="h-3 w-3" /> Sin stock
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5 flex-wrap">
                      {product.isNew && <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">New Drop</span>}
                      {product.isOnSale && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">Sale</span>}
                      {product.featured && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">Destacado</span>}
                      {!product.isNew && !product.featured && !product.isOnSale && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">Tienda</span>}
                      {product.inHome && <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">En home</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 outline-none hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2 text-sm cursor-pointer" onClick={() => startEdit(product)}>
                          <Pencil className="h-3.5 w-3.5" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-sm text-red-600 cursor-pointer focus:text-red-600" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="h-3.5 w-3.5" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-16 text-center text-sm text-gray-400">No se encontraron productos.</div>}
        </div>
      </div>
    </div>
  )
}
