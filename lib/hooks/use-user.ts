'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface Profile {
  id: string
  name: string
  is_admin: boolean
}

export function useUser() {
  const supabase = useRef<SupabaseClient | null>(null)
  if (!supabase.current) supabase.current = createClient()

  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const client = supabase.current!

    async function fetchProfile(userId: string) {
      const { data } = await client.from('profiles').select('*').eq('id', userId).single()
      setProfile(data ?? null)
    }

    const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        await fetchProfile(u.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  function logout() {
    // Clear any localStorage tokens Supabase may have stored client-side
    if (typeof window !== 'undefined') {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('sb-')) localStorage.removeItem(key)
      })
      // Navigate to the server-side logout route which clears cookies and redirects to /
      window.location.href = '/api/auth/logout'
    }
  }

  return { user, profile, loading, logout }
}
