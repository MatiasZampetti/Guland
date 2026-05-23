'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, MoreHorizontal, Search, CheckCircle, X, Tag, Upload, ImagePlus, Pencil } from 'lucide-react'
import { dbToProduct, type DBProduct } from '@/lib/db-mapper'
import { type Product, Size } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
type Visibilidad = 'tienda' | 'new' | 'sale'
type ActivePanel = 'producto' | 'categorias' | null

const emptyForm = {
  name: '',
  price: '',
  category: '',
  sizes: [] as Size[],
  stock: {} as Record<string, number>,
  description: '',
  image1: '',
  image1File: null as File | null,
  image1Preview: '',
  image2: '',
  image2File: null as File | null,
  image2Preview: '',
  visibilidad: 'tienda' as Visibilidad,
  featured: false,
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
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('todos')
  const [submitting, setSubmitting] = useState(false)

  const allFilterCats = ['todos', ...categories.map((c) => c.slug)]

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then((data: DBProduct[]) => setProducts(data.map(dbToProduct)))
    fetch('/api/categories').then(r => r.json()).then(setCategories)
  }, [])

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.includes(search.toLowerCase())
    const matchCat = catFilter === 'todos' || p.category === catFilter
    return matchSearch && matchCat
  })

  function togglePanel(panel: ActivePanel) {
    setActivePanel((v) => (v === panel ? null : panel))
    setLastAdded(null)
    if (editingId) {
      setEditingId(null)
      setForm(emptyForm)
    }
  }

  function startEdit(product: Product) {
    const visibilidad: Visibilidad = product.isNew ? 'new' : product.isOnSale ? 'sale' : 'tienda'
    setForm({
      name: product.name,
      price: String(product.price),
      category: product.category,
      sizes: product.sizes as Size[],
      stock: product.stock ?? {},
      description: product.description,
      image1: product.images[0] ?? '',
      image1File: null,
      image1Preview: '',
      image2: product.images[1] ?? '',
      image2File: null,
      image2Preview: '',
      visibilidad,
      featured: product.featured ?? false,
    })
    setEditingId(product.id)
    setActivePanel('producto')
    setLastAdded(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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

    const images: string[] = []
    if (form.image1File) images.push(await uploadImage(form.image1File, 'products'))
    else if (form.image1) images.push(form.image1)
    if (form.image2File) images.push(await uploadImage(form.image2File, 'products'))
    else if (form.image2) images.push(form.image2)

    const stockClean = Object.fromEntries(
      form.sizes.map((s) => [s, form.stock[s] ?? 0])
    )

    const payload = {
      name: form.name,
      price: parseInt(form.price),
      category_slug: form.category,
      description: form.description,
      images,
      sizes: form.sizes,
      stock: stockClean,
      featured: form.featured,
      is_new: form.visibilidad === 'new',
      is_on_sale: form.visibilidad === 'sale',
    }

    if (editingId) {
      // Editar producto existente
      const res = await fetch(`/api/products/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const updated = await res.json()
        setProducts((prev) => prev.map((p) => p.id === editingId ? dbToProduct(updated as DBProduct) : p))
        setLastAdded({ name: form.name, action: 'updated' })
        setForm(emptyForm)
        setEditingId(null)
        setActivePanel(null)
      }
    } else {
      // Nuevo producto
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: slugify(form.name), ...payload }),
      })
      if (res.ok) {
        const newProd = await res.json()
        setProducts((prev) => [dbToProduct(newProd as DBProduct), ...prev])
        setLastAdded({ name: form.name, action: 'added' })
        setForm(emptyForm)
        setActivePanel(null)
      }
    }
    setSubmitting(false)
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
    <div className="p-4 sm:p-6 md:p-8">

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
                          onChange={(e) => setSizeStock(s, parseInt(e.target.value) || 0)}
                          className="w-full bg-transparent text-sm text-gray-900 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

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

            <div className="sm:col-span-2">
              <label className={labelClass}>Aparece en</label>
              <div className="flex flex-wrap gap-2">
                {([{ value: 'tienda', label: 'Solo tienda' }, { value: 'new', label: 'New Drop' }, { value: 'sale', label: 'Sale' }] as { value: Visibilidad; label: string }[]).map(({ value, label }) => (
                  <button key={value} type="button" onClick={() => setForm({ ...form, visibilidad: value })}
                    className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors ${form.visibilidad === value ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'}`}
                  >{label}</button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Destacado en home</label>
              <button type="button" onClick={() => setForm({ ...form, featured: !form.featured })}
                className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors ${form.featured ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'}`}
              >{form.featured ? 'Sí, destacado' : 'No destacado'}</button>
            </div>
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
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
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
                <div className="flex flex-wrap gap-1">
                  {product.sizes.map((s) => {
                    const qty = product.stock?.[s]
                    return (
                      <span key={s} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                        {s}{typeof qty === 'number' ? ` · ${qty}` : ''}
                      </span>
                    )
                  })}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {product.isNew && <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">New Drop</span>}
                  {product.isOnSale && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">Sale</span>}
                  {product.featured && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">Destacado</span>}
                  {!product.isNew && !product.featured && !product.isOnSale && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">Tienda</span>}
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
                    <div className="flex flex-wrap gap-1">
                      {product.sizes.map((s) => {
                        const qty = product.stock?.[s]
                        return (
                          <span key={s} className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-600">
                            {s}{typeof qty === 'number' ? ` · ${qty}` : ''}
                          </span>
                        )
                      })}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5 flex-wrap">
                      {product.isNew && <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">New Drop</span>}
                      {product.isOnSale && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">Sale</span>}
                      {product.featured && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">Destacado</span>}
                      {!product.isNew && !product.featured && !product.isOnSale && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">Tienda</span>}
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
