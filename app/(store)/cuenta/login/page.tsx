'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { CheckCircle, X } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const confirmed = searchParams.get('confirmed') === 'true'
  const confirmedEmail = searchParams.get('email') || ''

  const [email, setEmail] = useState(confirmedEmail)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(confirmed)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (authError) {
      setError('Email o contraseña incorrectos.')
    } else {
      window.location.href = redirect
    }
  }

  return (
    <div className="w-full max-w-sm">

      {/* Popup confirmación */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowPopup(false)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#0f0f0f] p-8 text-center shadow-2xl">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute right-4 top-4 text-white/30 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15">
                <CheckCircle className="h-7 w-7 text-green-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.05em' }}>
              ¡CUENTA CONFIRMADA!
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Tu cuenta fue verificada exitosamente. Ya podés iniciar sesión.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-6 w-full rounded-lg bg-red-700 py-3 text-xs font-bold tracking-widest text-white hover:bg-red-800 transition-colors"
            >
              INICIAR SESIÓN
            </button>
          </div>
        </div>
      )}

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

        {error && <p className="text-xs text-red-500">{error}</p>}

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
