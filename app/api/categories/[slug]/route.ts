import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/supabase/require-admin'
import { NextResponse } from 'next/server'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { slug } = await params
  const admin = createAdminClient()
  const { error } = await admin.from('categories').delete().eq('slug', slug)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
