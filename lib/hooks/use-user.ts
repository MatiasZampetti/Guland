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
    let mounted = true

    async function fetchProfile(userId: string) {
      const { data } = await client.from('profiles').select('*').eq('id', userId).single()
      if (mounted) setProfile(data ?? null)
    }

    const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        await fetchProfile(u.id)
      } else {
        setProfile(null)
      }
      if (mounted) setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function logout() {
    const client = supabase.current!
    await client.auth.signOut()
    window.location.href = '/'
  }

  return { user, profile, loading, logout }
}
