'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, adminSessionActive } = useAuthStore()

  useEffect(() => {
    if (!user || !user.isAdmin || !adminSessionActive) {
      router.replace('/')
    }
  }, [user, adminSessionActive, router])

  if (!user || !user.isAdmin || !adminSessionActive) return null

  return <>{children}</>
}
