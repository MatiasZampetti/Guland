import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  // signOut fires SIGNED_OUT → applyServerStorage → cookieStore.set(expired cookies)
  await supabase.auth.signOut()

  const response = NextResponse.redirect(new URL('/', request.url))

  // Belt-and-suspenders: manually expire every sb-* cookie from the request
  request.cookies.getAll().forEach(({ name }) => {
    if (name.startsWith('sb-')) {
      response.cookies.set(name, '', {
        maxAge: 0,
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
    }
  })

  return response
}
