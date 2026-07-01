import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/require-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { customer_name, customer_email, items, total, payment_method } = body

  if (!customer_name || !customer_email || !items?.length || !total) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const admin = createAdminClient()
  const { data: order, error: orderError } = await admin
    .from('orders')
    .insert({ user_id: user?.id ?? null, customer_name, customer_email, total, payment_method: payment_method ?? 'whatsapp' })
    .select()
    .single()

  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 })

  const orderItems = items.map((item: { product_id: string; product_name: string; size: string; quantity: number; price: number }) => ({
    order_id: order.id,
    product_id: item.product_id ?? null,
    product_name: item.product_name,
    size: item.size,
    quantity: item.quantity,
    price: item.price,
  }))

  const { error: itemsError } = await admin.from('order_items').insert(orderItems)
  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 })

  return NextResponse.json(order, { status: 201 })
}
