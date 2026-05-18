import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const email = searchParams.get('email') || ''

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const redirectUrl = email
        ? `${origin}/cuenta/login?confirmed=true&email=${encodeURIComponent(email)}`
        : `${origin}/cuenta/login?confirmed=true`
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.redirect(`${origin}/cuenta/login?error=confirmation_failed`)
}
