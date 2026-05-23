import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/require-admin'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const featured = searchParams.get('featured')
  const is_new = searchParams.get('is_new')
  const is_on_sale = searchParams.get('is_on_sale')
  const category_slug = searchParams.get('category_slug')
  const slug = searchParams.get('slug')

  const supabase = await createClient()
  let query = supabase.from('products').select('*')

  if (slug) query = query.eq('slug', slug)
  if (featured === 'true') query = query.eq('featured', true)
  if (is_new === 'true') query = query.eq('is_new', true)
  if (is_on_sale === 'true') query = query.eq('is_on_sale', true)
  if (category_slug) query = query.eq('category_slug', category_slug)

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const body = await request.json()
  const { slug, name, price, category_slug, description, images, sizes, stock, featured, is_new, is_on_sale } = body

  if (!slug || !name || !price || !category_slug || !images?.length || !sizes?.length) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('products')
    .insert({ slug, name, price, category_slug, description: description ?? '', images, sizes, stock: stock ?? {}, featured: !!featured, is_new: !!is_new, is_on_sale: !!is_on_sale })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
