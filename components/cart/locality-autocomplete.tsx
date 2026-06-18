'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { fetchLocalities } from '@/lib/localities'

interface Props {
  province: string | null
  /** Localidad confirmada en el store (texto vacío si todavía no eligió). */
  value: string
  confirmed: boolean
  /** Reporta la selección: confirmed=true solo cuando se elige de la lista. */
  onChange: (locality: string, confirmed: boolean) => void
}

// Normaliza para comparar sin acentos ni mayúsculas.
const norm = (s: string) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()

export function LocalityAutocomplete({ province, value, confirmed, onChange }: Props) {
  const [query, setQuery] = useState(value)
  const [options, setOptions] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  const disabled = !province

  // Sincroniza el texto visible con el valor confirmado del store
  // (p. ej. al recargar la página o cambiar de provincia).
  useEffect(() => {
    setQuery(value)
  }, [value, province])

  // Carga las localidades cuando hay provincia elegida.
  useEffect(() => {
    if (!province) {
      setOptions([])
      setStatus('idle')
      return
    }
    let active = true
    setStatus('loading')
    fetchLocalities(province)
      .then((list) => {
        if (!active) return
        setOptions(list)
        setStatus('ready')
      })
      .catch(() => {
        if (!active) return
        setOptions([])
        setStatus('error')
      })
    return () => {
      active = false
    }
  }, [province])

  // Cierra el dropdown al hacer click afuera.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const matches = useMemo(() => {
    const q = norm(query)
    if (!q) return options.slice(0, 50)
    return options.filter((o) => norm(o).includes(q)).slice(0, 50)
  }, [query, options])

  // Si georef falla, dejamos texto libre para no bloquear la compra.
  const fallback = status === 'error'

  const handleType = (text: string) => {
    setQuery(text)
    setOpen(true)
    // En modo fallback aceptamos texto libre; si no, queda sin confirmar
    // hasta que elija una opción de la lista.
    onChange(text, fallback)
  }

  const handlePick = (name: string) => {
    setQuery(name)
    onChange(name, true)
    setOpen(false)
  }

  const showMustPick =
    !disabled && !fallback && query.trim() !== '' && !confirmed

  return (
    <div className="flex flex-col gap-1.5" ref={wrapRef}>
      <label className="text-xs font-semibold tracking-wider text-white/50">LOCALIDAD</label>
      <div className="relative">
        <input
          type="text"
          value={query}
          disabled={disabled}
          onChange={(e) => handleType(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={
            disabled
              ? 'Elegí primero una provincia'
              : status === 'loading'
                ? 'Cargando localidades...'
                : 'Empezá a escribir tu localidad'
          }
          autoComplete="off"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        />

        {open && !disabled && !fallback && matches.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-white/10 bg-[#0f0f0f] py-1 shadow-xl">
            {matches.map((name) => (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => handlePick(name)}
                  className="block w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-white/10 hover:text-white"
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        )}

        {open && !disabled && !fallback && status === 'ready' && matches.length === 0 && query.trim() !== '' && (
          <div className="absolute z-20 mt-1 w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-4 py-2 text-xs text-white/40 shadow-xl">
            No encontramos esa localidad.
          </div>
        )}
      </div>

      {showMustPick && (
        <p className="text-[11px] text-amber-400">Elegí una localidad de la lista.</p>
      )}
      {fallback && (
        <p className="text-[11px] text-white/40">
          No pudimos cargar el listado; escribí tu localidad.
        </p>
      )}
    </div>
  )
}
