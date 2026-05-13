'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { ShoppingBag, User, LogOut, LayoutDashboard, ChevronDown, Menu, X } from 'lucide-react'
import { categories } from '@/lib/mock-data'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store'
import { useAuthStore } from '@/lib/auth-store'

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const isHome = pathname === '/'

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const itemCount = useCartStore((s) => s.itemCount())
  const { user, logout, activateAdminSession } = useAuthStore()

  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const getScrollY = () =>
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0

    const check = () => {
      const y = getScrollY()
      setScrolled(y > 80)
      if (y > 80) setShopMenuOpen(false)
    }

    // Revisión inicial por si la página ya vino scrolleada
    check()

    window.addEventListener('scroll', check, { passive: true })
    document.addEventListener('scroll', check, { passive: true })
    // touchmove cubre el scroll en iOS/Android donde scroll no siempre dispara
    window.addEventListener('touchmove', check, { passive: true })
    window.addEventListener('touchend', check, { passive: true })

    return () => {
      window.removeEventListener('scroll', check)
      document.removeEventListener('scroll', check)
      window.removeEventListener('touchmove', check)
      window.removeEventListener('touchend', check)
    }
  }, [])

  const solid = !isHome || scrolled

  const [shopMenuOpen, setShopMenuOpen] = useState(false)
  const shopMenuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shopMenuRef.current && !shopMenuRef.current.contains(e.target as Node)) {
        setShopMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const [adminModalOpen, setAdminModalOpen] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminError, setAdminError] = useState(false)

  const handleAdminLogin = () => {
    const ok = activateAdminSession(adminPassword)
    if (ok) {
      setAdminModalOpen(false)
      setAdminPassword('')
      setAdminError(false)
      router.push('/admin')
    } else {
      setAdminError(true)
    }
  }

  const safeUser = mounted ? user : null
  const safeCount = mounted ? itemCount : 0

  return (
    <>
      <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${solid ? 'bg-[#0a0a0a] border-b border-white/10' : 'bg-transparent border-b border-transparent'}`}>
        <div className="flex h-16 w-full items-center justify-between px-4 md:px-8 lg:px-20">

          {/* Izquierda */}
          <div className="flex items-center gap-3">
            {/* Hamburger — solo mobile */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen((p) => !p)}
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* TIENDA button — solo desktop */}
            <div ref={shopMenuRef} className="relative hidden md:block">
              <button
                onClick={() => setShopMenuOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-widest transition-colors ${solid ? 'border-white/20 text-white hover:bg-red-700 hover:border-red-700' : 'border-white text-white hover:bg-white hover:text-black'}`}
              >
                TIENDA
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${shopMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {shopMenuOpen && (
                <div className="absolute left-0 top-full z-50 w-56 pt-2">
                  <div className="border border-white/10 bg-[#0a0a0a] p-5 shadow-xl">
                    <p className="mb-3 text-[10px] font-bold tracking-[0.25em] text-white/30">CATEGORÍAS</p>
                    <ul className="space-y-2">
                      <li>
                        <Link href="/shop" onClick={() => setShopMenuOpen(false)} className="block text-sm text-white/60 transition-colors hover:text-red-500">
                          Todas
                        </Link>
                      </li>
                      {categories.map((cat) => (
                        <li key={cat.slug}>
                          <Link href={`/shop/${cat.slug}`} onClick={() => setShopMenuOpen(false)} className="block text-sm text-white/60 transition-colors hover:text-red-500">
                            {cat.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="my-4 border-t border-white/10" />
                    <Link href="/shop?filter=destacados" onClick={() => setShopMenuOpen(false)} className="block text-xs font-bold tracking-[0.2em] text-white/80 transition-colors hover:text-red-500">DESTACADOS</Link>
                    <div className="my-4 border-t border-white/10" />
                    <Link href="/shop?filter=new-drops" onClick={() => setShopMenuOpen(false)} className="block text-xs font-bold tracking-[0.2em] text-white/80 transition-colors hover:text-red-500">NEW DROPS</Link>
                    <div className="my-4 border-t border-white/10" />
                    <Link href="/shop?filter=sale" onClick={() => setShopMenuOpen(false)} className="block text-xs font-bold tracking-[0.2em] text-white/80 transition-colors hover:text-red-500">SALE</Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Centro: logo */}
          <Link
            href="/"
            onClick={(e) => {
              if (isHome) {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
            className="absolute left-1/2 -translate-x-1/2 text-3xl md:text-5xl leading-none"
            style={{ fontFamily: 'var(--font-league)', fontWeight: 900 }}
          >
            <span className="text-white">GU</span><span className="text-red-600">-LAND</span>
          </Link>

          {/* Derecha: cuenta + carrito */}
          <div className="flex items-center gap-4 md:gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 outline-none text-white transition-opacity hover:opacity-60">
                <User className="h-5 w-5" strokeWidth={1.5} />
                {safeUser && <ChevronDown className="h-3 w-3" />}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {!safeUser ? (
                  <>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/cuenta/login')}>Iniciar sesión</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/cuenta/registro')}>Registrarse</DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <div className="px-2 py-1.5">
                      <p className="text-xs font-semibold text-gray-900">{safeUser.name}</p>
                      <p className="text-[11px] text-gray-400">{safeUser.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/cuenta')}>Mi cuenta</DropdownMenuItem>
                    {safeUser.isAdmin && (
                      <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => { setAdminError(false); setAdminPassword(''); setAdminModalOpen(true) }}>
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        Panel de administración
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer gap-2 text-red-600 focus:text-red-600">
                      <LogOut className="h-3.5 w-3.5" />
                      Cerrar sesión
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/cart" className="relative flex items-center text-white transition-opacity hover:opacity-60">
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {safeCount > 0 && (
                <span className={`absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${solid ? 'bg-red-600 text-white' : 'bg-white text-black'}`}>
                  {safeCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0a0a0a] pt-16 md:hidden overflow-y-auto">
          <nav className="flex flex-col px-6 py-8 gap-1">
            <p className="mb-4 text-[10px] font-bold tracking-[0.3em] text-white/30">TIENDA</p>
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="py-3 text-lg font-semibold text-white border-b border-white/10">
              Todas las categorías
            </Link>
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/shop/${cat.slug}`} onClick={() => setMobileMenuOpen(false)} className="py-3 text-base text-white/70 border-b border-white/5">
                {cat.label}
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/shop?filter=destacados" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold tracking-widest text-white/60 hover:text-red-500">DESTACADOS</Link>
              <Link href="/shop?filter=new-drops" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold tracking-widest text-white/60 hover:text-red-500">NEW DROPS</Link>
              <Link href="/shop?filter=sale" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold tracking-widest text-red-500">SALE</Link>
            </div>
            <div className="mt-8 border-t border-white/10 pt-6 flex flex-col gap-3">
              <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="text-sm text-white/60">Carrito</Link>
              <Link href="/cuenta/login" onClick={() => setMobileMenuOpen(false)} className="text-sm text-white/60">Mi cuenta</Link>
              <Link href="/ayuda" onClick={() => setMobileMenuOpen(false)} className="text-sm text-white/60">Ayuda</Link>
            </div>
          </nav>
        </div>
      )}

      {/* Modal admin */}
      <Dialog open={adminModalOpen} onOpenChange={setAdminModalOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.6rem', lineHeight: 1 }}>
              PANEL DE ADMINISTRACIÓN
            </DialogTitle>
            <DialogDescription>
              Ingresá la contraseña de administrador para continuar.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex flex-col gap-4">
            <input
              type="password"
              placeholder="Contraseña de administrador"
              value={adminPassword}
              onChange={(e) => { setAdminPassword(e.target.value); setAdminError(false) }}
              onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black"
              autoFocus
            />
            {adminError && <p className="text-xs text-red-500">Contraseña incorrecta. Intentá de nuevo.</p>}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setAdminModalOpen(false)} className="flex-1 rounded-lg text-xs">Cancelar</Button>
              <Button onClick={handleAdminLogin} className="flex-1 rounded-lg bg-black text-xs text-white hover:bg-gray-800">Ingresar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
