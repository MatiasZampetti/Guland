'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function RegistroPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'verify'>('form')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }

    setLoading(true)
    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    setStep('verify')
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp.trim(),
      type: 'signup',
    })

    if (verifyError) {
      setError('Código incorrecto o expirado. Verificá e intentá de nuevo.')
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  if (step === 'verify') {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm text-center">
          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest text-white/40">VERIFICACIÓN</p>
            <h1 className="mt-1 text-5xl leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
              REVISÁ TU EMAIL
            </h1>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-8 space-y-3">
            <p className="text-sm text-white/60">
              Te enviamos un email de confirmación a
            </p>
            <p className="text-base font-semibold text-white">{email}</p>
            <p className="text-sm text-white/50 pt-2">
              Hacé click en el botón del email para activar tu cuenta. Revisá también la carpeta de spam.
            </p>
          </div>

          <button
            onClick={() => { setStep('form'); setError('') }}
            className="mt-8 text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            ← Volver al formulario
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest text-white/40">CUENTA</p>
          <h1 className="mt-1 text-5xl leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
            CREAR CUENTA
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wider text-white/50">NOMBRE</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-600"
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wider text-white/50">CONFIRMAR CONTRASEÑA</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repetí la contraseña"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-600"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-red-700 py-6 text-xs font-bold tracking-widest text-white hover:bg-red-800 disabled:opacity-50"
          >
            {loading ? 'ENVIANDO CÓDIGO...' : 'CREAR CUENTA'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-white/40">
          ¿Ya tenés cuenta?{' '}
          <Link href="/cuenta/login" className="font-semibold text-white underline underline-offset-4 hover:opacity-60">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
