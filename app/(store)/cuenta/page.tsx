'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@/lib/hooks/use-user'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Package, LogOut, Loader2 } from 'lucide-react'

export default function CuentaPage() {
  const router = useRouter()
  const { user, profile, loading, logout } = useUser()

  const handleLogout = () => logout()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    )
  }

  if (!user) {
    router.replace('/cuenta/login')
    return null
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-5 py-8 sm:py-12">
      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest text-white/40">CUENTA</p>
        <h1 className="mt-1 text-5xl leading-none text-white" style={{ fontFamily: 'var(--font-bebas)' }}>
          {profile?.name ? `HOLA, ${profile.name.split(' ')[0].toUpperCase()}` : 'MI CUENTA'}
        </h1>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6">
        <p className="text-xs font-bold tracking-widest text-white/40">DATOS DE LA CUENTA</p>
        <div className="mt-4 space-y-3">
          {profile?.name && (
            <div>
              <p className="text-xs text-white/40">Nombre</p>
              <p className="text-sm font-medium text-white">{profile.name}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-white/40">Email</p>
            <p className="text-sm font-medium text-white">{user.email}</p>
          </div>
          {profile?.is_admin && (
            <div>
              <p className="text-xs text-white/40">Rol</p>
              <span className="inline-flex rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                Administrador
              </span>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-6 bg-white/10" />

      <div className="flex flex-col gap-3">
        <Link href="/shop">
          <Button variant="outline" className="w-full justify-start gap-3 rounded-lg border-white/10 text-sm text-white hover:bg-white/10 hover:text-white">
            <Package className="h-4 w-4" />
            Ver productos
          </Button>
        </Link>

        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-3 rounded-lg border-red-500/30 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  )
}
