// Localidades por provincia desde la API pública de georef (datos.gob.ar).
// El nombre de la provincia se pasa tal cual (georef hace matching difuso, así
// que funciona con los nombres del seed: "CABA", "Tierra del Fuego", etc.).

const cache = new Map<string, string[]>()
const inflight = new Map<string, Promise<string[]>>()

/**
 * Trae (y cachea) la lista de localidades de una provincia, ordenada alfabéticamente.
 * Lanza si la respuesta de red falla, para que la UI pueda mostrar un fallback.
 */
export async function fetchLocalities(province: string): Promise<string[]> {
  const key = province.trim().toLowerCase()
  const cached = cache.get(key)
  if (cached) return cached

  const existing = inflight.get(key)
  if (existing) return existing

  const promise = (async () => {
    const url =
      'https://apis.datos.gob.ar/georef/api/localidades' +
      `?provincia=${encodeURIComponent(province)}&campos=nombre&max=5000&orden=nombre`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`georef ${res.status}`)
    const data = (await res.json()) as { localidades?: { nombre: string }[] }
    const names = Array.from(
      new Set((data.localidades ?? []).map((l) => l.nombre).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b, 'es'))
    cache.set(key, names)
    return names
  })()

  inflight.set(key, promise)
  try {
    return await promise
  } finally {
    inflight.delete(key)
  }
}
