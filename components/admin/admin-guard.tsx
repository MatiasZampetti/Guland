'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/hooks/use-user'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, profile, loading } = useUser()

  useEffect(() => {
    if (!loading && (!user || !profile?.is_admin)) {
      router.replace('/')
    }
  }, [loading, user, profile, router])

  if (loading || !user || !profile?.is_admin) return null

  return <>{children}</>
}
