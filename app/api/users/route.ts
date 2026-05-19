import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/require-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  const admin = createAdminClient()

  const [{ data: profiles, error }, { data: orders }, authResult] = await Promise.all([
    admin.from('profiles').select('id, name, is_admin, created_at').order('created_at', { ascending: false }),
    admin.from('orders').select('user_id, total'),
    admin.auth.admin.listUsers({ perPage: 1000 }),
  ])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const emailMap = new Map(
    (authResult.data?.users ?? []).map((u) => [u.id, u.email ?? ''])
  )

  const orderMap = new Map<string, { count: number; total: number }>()
  for (const o of orders ?? []) {
    if (!o.user_id) continue
    const prev = orderMap.get(o.user_id) ?? { count: 0, total: 0 }
    orderMap.set(o.user_id, { count: prev.count + 1, total: prev.total + (o.total || 0) })
  }

  const users = (profiles ?? []).map((p) => ({
    id: p.id,
    name: p.name || 'Sin nombre',
    email: emailMap.get(p.id) ?? '',
    is_admin: p.is_admin,
    created_at: p.created_at,
    order_count: orderMap.get(p.id)?.count ?? 0,
    total_spent: orderMap.get(p.id)?.total ?? 0,
  }))

  return NextResponse.json(users)
}
