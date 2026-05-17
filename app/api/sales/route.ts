import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { product_id, product_name, customer_name, size, quantity, unit_price, payment_method } = body

  if (!product_name || !customer_name || !size || !quantity || !unit_price || !payment_method) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const total = unit_price * quantity
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('sales')
    .insert({ product_id: product_id || null, product_name, customer_name, size, quantity, unit_price, total, payment_method })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
