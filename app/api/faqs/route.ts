import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('faq_categories')
    .select('id, name, faq_items(id, question, answer, created_at)')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const result = (data || []).map((cat) => ({
    id: cat.id,
    category: cat.name,
    items: ((cat.faq_items as { id: string; question: string; answer: string; created_at: string }[]) || [])
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((item) => ({ id: item.id, q: item.question, a: item.answer })),
  }))

  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name } = await request.json()
  if (!name) return NextResponse.json({ error: 'Falta nombre' }, { status: 400 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('faq_categories')
    .insert({ name: (name as string).toUpperCase() })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id, category: data.name, items: [] }, { status: 201 })
}
