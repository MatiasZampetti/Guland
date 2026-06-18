import { Size, SizeGuide, SizeMeasurements } from '@/types'

/** Orden canónico de talles para mostrar la guía. */
export const SIZE_ORDER: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

/** Columnas fijas de la guía (en cm). */
export const SIZE_GUIDE_FIELDS = [
  { key: 'pecho', label: 'Pecho' },
  { key: 'cintura', label: 'Cintura' },
  { key: 'cadera', label: 'Cadera' },
] as const

/** Medidas por defecto (las que estaban hardcodeadas). Se usan como fallback. */
export const DEFAULT_MEASUREMENTS: Record<Size, SizeMeasurements> = {
  XS: { pecho: '82–86', cintura: '64–68', cadera: '88–92' },
  S: { pecho: '87–91', cintura: '69–73', cadera: '93–97' },
  M: { pecho: '92–96', cintura: '74–78', cadera: '98–102' },
  L: { pecho: '97–102', cintura: '79–84', cadera: '103–108' },
  XL: { pecho: '103–108', cintura: '85–90', cadera: '109–114' },
  XXL: { pecho: '109–116', cintura: '91–98', cadera: '115–122' },
}

export const DEFAULT_GUIDE_NOTE =
  'Si estás entre dos talles, te recomendamos elegir el más grande para un fit más cómodo.'

export interface ResolvedGuideRow extends SizeMeasurements {
  talle: Size
}

/**
 * Arma las filas a mostrar para los talles de un producto, usando los valores
 * cargados por el admin y cayendo al default por campo cuando están vacíos.
 */
export function resolveSizeGuide(
  sizes: Size[],
  guide?: SizeGuide,
): { rows: ResolvedGuideRow[]; note: string } {
  const ordered = SIZE_ORDER.filter((s) => sizes.includes(s))
  const rows = ordered.map((talle) => {
    const custom = guide?.measurements?.[talle]
    const fallback = DEFAULT_MEASUREMENTS[talle]
    return {
      talle,
      pecho: custom?.pecho?.trim() || fallback.pecho,
      cintura: custom?.cintura?.trim() || fallback.cintura,
      cadera: custom?.cadera?.trim() || fallback.cadera,
    }
  })
  return { rows, note: guide?.note?.trim() || DEFAULT_GUIDE_NOTE }
}
