import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { name, email, password } = await request.json()
  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    user_metadata: { name },
    email_confirm: true,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  await admin.from('profiles').insert({
    id: data.user.id,
    name,
    is_admin: false,
  })

  return NextResponse.json({ user: data.user }, { status: 201 })
}
