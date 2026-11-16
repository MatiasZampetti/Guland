import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/require-admin'
import { NextResponse } from 'next/server'

// Los pedidos se cierran por WhatsApp: no hay endpoint público para crearlos.
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
