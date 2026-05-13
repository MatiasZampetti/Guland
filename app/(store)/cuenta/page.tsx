'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth-store'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Package, LogOut } from 'lucide-react'

export default function CuentaPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  useEffect(() => {
    if (!user) router.replace('/cuenta/login')
  }, [user, router])

  if (!user) return null

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-5 py-8 sm:py-12">
      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest text-white/40">CUENTA</p>
        <h1 className="mt-1 text-5xl leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
          HOLA, {user.name.split(' ')[0].toUpperCase()}
        </h1>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs font-bold tracking-widest text-white/40">DATOS DE LA CUENTA</p>
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs text-white/40">Nombre</p>
            <p className="text-sm font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-xs text-white/40">Email</p>
            <p className="text-sm font-medium">{user.email}</p>
          </div>
          {user.isAdmin && (
            <div>
              <p className="text-xs text-white/40">Rol</p>
              <span className="inline-flex rounded-full bg-black px-2.5 py-0.5 text-[11px] font-semibold text-white">
                Administrador
              </span>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col gap-3">
        <Link href="/shop">
          <Button variant="outline" className="w-full justify-start gap-3 rounded-lg border-white/10 text-sm">
            <Package className="h-4 w-4" />
            Ver productos
          </Button>
        </Link>

        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-3 rounded-lg border-red-100 text-sm text-red-600 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  )
}
