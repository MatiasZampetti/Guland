import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/require-admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { categoryId, q, a } = await request.json()
  if (!categoryId || !q || !a) return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('faq_items')
    .insert({ category_id: categoryId, question: q, answer: a })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id, q: data.question, a: data.answer }, { status: 201 })
}
