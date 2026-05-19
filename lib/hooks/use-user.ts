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

    async function handleSession(u: User | null) {
      if (!mounted) return
      setUser(u)
      try {
        if (u) {
          await fetchProfile(u.id)
        } else {
          setProfile(null)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    // Load initial session synchronously from storage (no network)
    client.auth.getSession().then(({ data: { session } }) => {
      handleSession(session?.user ?? null)
    })

    // Subscribe to future auth changes (sign in, sign out, token refresh)
    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') return
      handleSession(session?.user ?? null)
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
