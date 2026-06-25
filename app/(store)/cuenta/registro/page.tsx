'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { AlertCircle, X } from 'lucide-react'

export default function RegistroPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'verify'>('form')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [otp, setOtp] = useState('')
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showExistsPopup, setShowExistsPopup] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }

    setLoading(true)
    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/cuenta/login?confirmed=true&email=${encodeURIComponent(email)}`,
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Supabase devuelve identities vacío cuando el email ya está registrado
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      setLoading(false)
      setShowExistsPopup(true)
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
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-8 sm:py-16">
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
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8 sm:py-16">

      {/* Popup: email ya registrado */}
      {showExistsPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowExistsPopup(false)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#0f0f0f] p-8 text-center shadow-2xl">
            <button
              onClick={() => setShowExistsPopup(false)}
              className="absolute right-4 top-4 text-white/30 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15">
                <AlertCircle className="h-7 w-7 text-red-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.05em' }}>
              EMAIL YA REGISTRADO
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Este correo ya está vinculado a una cuenta existente.
            </p>
            <Link
              href={`/cuenta/login?email=${encodeURIComponent(email)}`}
              className="mt-6 inline-block w-full rounded-lg bg-red-700 py-3 text-xs font-bold tracking-widest text-white hover:bg-red-800 transition-colors"
            >
              IR A INICIAR SESIÓN
            </Link>
          </div>
        </div>
      )}

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

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-shrink-0 accent-red-600"
            />
            <span className="text-xs text-white/50 leading-relaxed">
              Acepto la{' '}
              <Link href="/privacidad" target="_blank" className="underline underline-offset-4 hover:text-white transition-colors">
                política de privacidad
              </Link>
              .
            </span>
          </label>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button
            type="submit"
            disabled={loading || !privacyAccepted}
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
