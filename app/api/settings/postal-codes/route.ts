import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/require-admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { zoneId, postalCode, domicilio, sucursal } = await request.json()
  if (!zoneId || !postalCode || !String(postalCode).trim()) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('shipping_postal_codes')
    .insert({
      zone_id: zoneId,
      postal_code: String(postalCode).trim(),
      domicilio: Math.max(0, Number(domicilio) || 0),
      sucursal: Math.max(0, Number(sucursal) || 0),
    })
    .select('id, postal_code, domicilio, sucursal')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(
    { id: data.id, postalCode: data.postal_code, domicilio: data.domicilio, sucursal: data.sucursal },
    { status: 201 },
  )
}
