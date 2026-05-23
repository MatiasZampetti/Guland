import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/require-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const body = await request.json()
  const admin = createAdminClient()

  // Soporta batch: { customer_name, payment_method, items: [{...}] }
  if (Array.isArray(body.items)) {
    const { customer_name, payment_method, items } = body
    if (!customer_name || !payment_method || items.length === 0) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }
    const rows = items.map((it: { product_id?: string | null; product_name: string; size: string; quantity: number; unit_price: number }) => ({
      product_id: it.product_id || null,
      product_name: it.product_name,
      customer_name,
      size: it.size,
      quantity: it.quantity,
      unit_price: it.unit_price,
      total: it.unit_price * it.quantity,
      payment_method,
    }))
    const { data, error } = await admin.from('sales').insert(rows).select()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  }

  // Legacy: una sola venta
  const { product_id, product_name, customer_name, size, quantity, unit_price, payment_method } = body

  if (!product_name || !customer_name || !size || !quantity || !unit_price || !payment_method) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const total = unit_price * quantity
  const { data, error } = await admin
    .from('sales')
    .insert({ product_id: product_id || null, product_name, customer_name, size, quantity, unit_price, total, payment_method })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
