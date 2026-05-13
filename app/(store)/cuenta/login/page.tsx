'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import { Button } from '@/components/ui/button'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const { login } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    await new Promise((r) => setTimeout(r, 400))
    const result = login(email, password)
    setLoading(false)
    if (result === 'ok') {
      router.push(redirect)
    } else {
      setError(true)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest text-white/40">CUENTA</p>
        <h1 className="mt-1 text-5xl leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
          INICIAR SESIÓN
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold tracking-wider text-white/50">EMAIL</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-600"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold tracking-wider text-white/50">CONTRASEÑA</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-600"
          />
        </div>

        {error && <p className="text-xs text-red-500">Email o contraseña incorrectos.</p>}

        <Button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-lg bg-red-700 py-6 text-xs font-bold tracking-widest text-white hover:bg-red-800 disabled:opacity-50"
        >
          {loading ? 'INGRESANDO...' : 'INICIAR SESIÓN'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/40">
        ¿No tenés cuenta?{' '}
        <Link href="/cuenta/registro" className="font-semibold text-white underline underline-offset-4 hover:opacity-60">
          Registrate
        </Link>
      </p>

      <div className="mt-8 rounded-lg border border-dashed border-white/10 p-4 text-xs text-white/30">
        <p className="font-semibold">Cuentas de prueba:</p>
        <p className="mt-1">Admin: admin@guland.com / admin123</p>
        <p>Demo: demo@guland.com / demo123</p>
        <p className="mt-1 text-white/20">Contraseña del panel: admin2024</p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <Suspense fallback={<div className="text-sm text-white/40">Cargando...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
