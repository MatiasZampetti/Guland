import { ShippingMethod } from '@/types'

/** Override de precio para un código postal puntual dentro de una zona. */
export interface ShippingPostalCode {
  id: string
  postalCode: string
  domicilio: number
  sucursal: number
}

/** Zona de envío (provincia o zona propia) con tarifa base + CP puntuales. */
export interface ShippingZone {
  id: string
  name: string
  domicilio: number
  sucursal: number
  postalCodes: ShippingPostalCode[]
}

/** Config escalar de la tienda (editable desde el admin). */
export interface StoreSettings {
  whatsappNumber: string
  freeShippingThreshold: number
  cashDiscountPercent: number
  defaultDomicilio: number
  defaultSucursal: number
}

/** Limita un porcentaje a un rango válido 0–100 (evita totales negativos por config errónea). */
export const clampPercent = (n: number): number =>
  Math.min(100, Math.max(0, Number.isFinite(n) ? n : 0))

export const DEFAULT_SETTINGS: StoreSettings = {
  whatsappNumber: '5493573498196',
  freeShippingThreshold: 30000,
  cashDiscountPercent: 15,
  defaultDomicilio: 7000,
  defaultSucursal: 6000,
}

/**
 * Resuelve el costo de envío estimado.
 * Precedencia: envío gratis por umbral → CP puntual → tarifa base de la zona → tarifa por defecto.
 * Devuelve `null` cuando falta provincia o método (formulario incompleto).
 */
export function resolveShipping(
  zones: ShippingZone[],
  settings: Pick<StoreSettings, 'freeShippingThreshold' | 'defaultDomicilio' | 'defaultSucursal'>,
  provinceName: string | null,
  postalCode: string,
  method: ShippingMethod,
  baseTotal: number,
): number | null {
  if (!provinceName || !method) return null
  if (settings.freeShippingThreshold > 0 && baseTotal >= settings.freeShippingThreshold) return 0

  const zone = zones.find((z) => z.name === provinceName)
  if (zone) {
    const cp = postalCode.trim()
    const match = cp ? zone.postalCodes.find((p) => p.postalCode === cp) : undefined
    if (match) return method === 'domicilio' ? match.domicilio : match.sucursal
    return method === 'domicilio' ? zone.domicilio : zone.sucursal
  }

  return method === 'domicilio' ? settings.defaultDomicilio : settings.defaultSucursal
}
