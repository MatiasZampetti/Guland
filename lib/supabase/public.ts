import { createClient } from '@supabase/supabase-js'

/**
 * Cliente de solo lectura sin cookies, para datos públicos (productos, categorías).
 * Al no depender de cookies, permite que las páginas que lo usan se cacheen (ISR)
 * en lugar de renderizarse de forma dinámica en cada request.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
