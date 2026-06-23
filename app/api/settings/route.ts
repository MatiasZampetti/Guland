import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/require-admin'
import { DEFAULT_SETTINGS, clampPercent } from '@/lib/shipping'
import { NextResponse } from 'next/server'

type RawPostalCode = { id: string; postal_code: string; domicilio: number; sucursal: number }
type RawZone = {
  id: string
  name: string
  domicilio: number
  sucursal: number
  shipping_postal_codes: RawPostalCode[] | null
}

export async function GET() {
  const supabase = await createClient()

  const [{ data: settingsRows }, { data: zones }] = await Promise.all([
    supabase.from('store_settings').select('key, value'),
    supabase
      .from('shipping_zones')
      .select('id, name, domicilio, sucursal, sort_order, shipping_postal_codes(id, postal_code, domicilio, sucursal)')
      .order('sort_order', { ascending: true }),
  ])

  const raw = Object.fromEntries((settingsRows ?? []).map((r) => [r.key, r.value]))
  const num = (v: string | undefined, fallback: number) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : fallback
  }

  const settings = {
    whatsappNumber: (raw.whatsapp_number ?? DEFAULT_SETTINGS.whatsappNumber).replace(/[^\d]/g, '') || DEFAULT_SETTINGS.whatsappNumber,
    freeShippingThreshold: Math.max(0, num(raw.free_shipping_threshold, DEFAULT_SETTINGS.freeShippingThreshold)),
    cashDiscountPercent: clampPercent(num(raw.cash_discount_percent, DEFAULT_SETTINGS.cashDiscountPercent)),
    defaultDomicilio: Math.max(0, num(raw.default_shipping_domicilio, DEFAULT_SETTINGS.defaultDomicilio)),
    defaultSucursal: Math.max(0, num(raw.default_shipping_sucursal, DEFAULT_SETTINGS.defaultSucursal)),
    storeAddress: raw.store_address ?? DEFAULT_SETTINGS.storeAddress,
  }

  const mappedZones = ((zones as RawZone[] | null) ?? []).map((z) => ({
    id: z.id,
    name: z.name,
    domicilio: z.domicilio,
    sucursal: z.sucursal,
    postalCodes: (z.shipping_postal_codes ?? []).map((p) => ({
      id: p.id,
      postalCode: p.postal_code,
      domicilio: p.domicilio,
      sucursal: p.sucursal,
    })),
  }))

  return NextResponse.json({ settings, zones: mappedZones })
}

/** Normaliza cada setting a un valor válido antes de guardarlo. */
const FIELDS: { prop: string; key: string; normalize: (v: unknown) => string }[] = [
  { prop: 'whatsappNumber', key: 'whatsapp_number', normalize: (v) => String(v).replace(/[^\d]/g, '') },
  { prop: 'freeShippingThreshold', key: 'free_shipping_threshold', normalize: (v) => String(Math.max(0, Math.round(Number(v) || 0))) },
  { prop: 'cashDiscountPercent', key: 'cash_discount_percent', normalize: (v) => String(clampPercent(Number(v) || 0)) },
  { prop: 'defaultDomicilio', key: 'default_shipping_domicilio', normalize: (v) => String(Math.max(0, Math.round(Number(v) || 0))) },
  { prop: 'defaultSucursal', key: 'default_shipping_sucursal', normalize: (v) => String(Math.max(0, Math.round(Number(v) || 0))) },
  { prop: 'storeAddress', key: 'store_address', normalize: (v) => String(v).trim() },
]

export async function PATCH(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const body = await request.json()
  const updates = FIELDS
    .filter(({ prop }) => body[prop] !== undefined && body[prop] !== null)
    .map(({ key, prop, normalize }) => ({ key, value: normalize(body[prop]) }))

  if (updates.length === 0) return NextResponse.json({ ok: true })

  const admin = createAdminClient()
  const { error } = await admin.from('store_settings').upsert(updates, { onConflict: 'key' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
