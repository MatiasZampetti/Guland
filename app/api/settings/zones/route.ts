import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/require-admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { name } = await request.json()
  if (!name || !String(name).trim()) {
    return NextResponse.json({ error: 'Falta nombre' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: last } = await admin
    .from('shipping_zones')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data, error } = await admin
    .from('shipping_zones')
    .insert({ name: String(name).trim(), sort_order: (last?.sort_order ?? 0) + 1 })
    .select('id, name, domicilio, sucursal')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(
    { id: data.id, name: data.name, domicilio: data.domicilio, sucursal: data.sucursal, postalCodes: [] },
    { status: 201 },
  )
}
