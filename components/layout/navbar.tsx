'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, User, LogOut, LayoutDashboard, ChevronDown, Menu, X } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useUser } from '@/lib/hooks/use-user'

export function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const [isLandscape, setIsLandscape] = useState(false)
  useEffect(() => {
    const check = () => setIsLandscape(window.innerWidth > window.innerHeight)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const itemCount = useCartStore((s) => s.itemCount())
  const { user, profile, logout } = useUser()
  const [categories, setCategories] = useState<{ slug: string; label: string }[]>([])

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => setCategories(data.map((c: { slug: string; label: string }) => ({ slug: c.slug, label: c.label }))))
  }, [])

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

  const [accountOpen, setAccountOpen] = useState(false)
  useEffect(() => {
    if (!accountOpen) return
    const handler = (e: Event) => {
      if (!(e.target as Element).closest('[data-account-menu]')) setAccountOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [accountOpen])

  const handleLogout = () => logout()

  const safeUser = mounted ? user : null
  const safeProfile = mounted ? profile : null
  const safeCount = mounted ? itemCount : 0

  // Listener nativo para el hamburger — no-pasivo para poder preventDefault real
  const hamburgerRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = hamburgerRef.current
    if (!el) return
    const handler = (e: TouchEvent) => {
      e.preventDefault() // bloquea el click sintetizado; funciona porque el listener es no-pasivo
      setMobileMenuOpen(p => !p)
    }
    el.addEventListener('touchstart', handler, { passive: false })
    return () => el.removeEventListener('touchstart', handler)
  }, [])

  return (
    <>
      <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${solid ? 'bg-[#0a0a0a] border-b border-white/10' : 'bg-transparent border-b border-transparent'}`}>
        <div className="flex h-16 w-full items-center justify-between px-4 md:px-8 lg:px-20">

          {/* Izquierda */}
          <div className="flex items-center gap-3">
            {/* Hamburger — listener nativo en useEffect para controlar passive:false */}
            <span
              ref={hamburgerRef}
              role="button"
              tabIndex={0}
              className="lg:hidden flex items-center p-2 -ml-2 text-white cursor-pointer"
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', userSelect: 'none' }}
              onClick={() => setMobileMenuOpen((p) => !p)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setMobileMenuOpen(p => !p) }}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </span>

            {/* TIENDA button — solo desktop */}
            <div ref={shopMenuRef} className="relative hidden lg:block">
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
            className="absolute left-1/2 -translate-x-1/2 text-2xl sm:text-3xl md:text-5xl leading-none"
            style={{ fontFamily: 'var(--font-league)', fontWeight: 900 }}
          >
            <span className="text-white">GU</span><span className="text-red-600">-LAND</span>
          </Link>

          {/* Derecha: cuenta + carrito */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Cuenta — dropdown custom, sin Base UI, funciona en mobile y desktop */}
            <div className="relative" data-account-menu>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                href="#"
                data-account-menu
                className="flex items-center gap-1 text-white transition-opacity hover:opacity-60"
                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', textDecoration: 'none' }}
                onClick={(e) => { e.preventDefault(); setAccountOpen((p) => !p) }}
                aria-label="Mi cuenta"
                aria-expanded={accountOpen}
              >
                <User className="h-5 w-5" strokeWidth={1.5} />
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${accountOpen ? 'rotate-180' : ''}`} />
              </a>
              {accountOpen && (
                <div className="absolute right-0 top-full mt-2 z-[60] w-52 border border-white/10 bg-[#0a0a0a] shadow-xl" data-account-menu>
                  {!safeUser ? (
                    <>
                      <Link href="/cuenta/login" onClick={() => setAccountOpen(false)} className="block px-3 py-2.5 text-sm text-white/80 hover:bg-white/5">Iniciar sesión</Link>
                      <Link href="/cuenta/registro" onClick={() => setAccountOpen(false)} className="block px-3 py-2.5 text-sm text-white/80 hover:bg-white/5">Registrarse</Link>
                    </>
                  ) : (
                    <>
                      <div className="px-3 py-2 border-b border-white/10">
                        {safeProfile?.name && <p className="text-xs font-semibold text-white">{safeProfile.name}</p>}
                        <p className="text-[11px] text-gray-400">{safeUser.email}</p>
                      </div>
                      <Link href="/cuenta" onClick={() => setAccountOpen(false)} className="block px-3 py-2.5 text-sm text-white/80 hover:bg-white/5">Mi cuenta</Link>
                      {safeProfile?.is_admin && (
                        <Link href="/admin" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-white/80 hover:bg-white/5">
                          <LayoutDashboard className="h-3.5 w-3.5" />
                          Panel de administración
                        </Link>
                      )}
                      <div className="border-t border-white/10" />
                      <Link href="#" onClick={(e) => { e.preventDefault(); setAccountOpen(false); handleLogout() }} className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 hover:bg-white/5">
                        <LogOut className="h-3.5 w-3.5" />
                        Cerrar sesión
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

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
        <div className="fixed inset-0 z-40 bg-[#0a0a0a] pt-16 lg:hidden overflow-y-auto">
          <nav
            className="px-6"
            style={{
              display: 'flex',
              flexDirection: isLandscape ? 'row' : 'column',
              gap: isLandscape ? '2rem' : '0',
              paddingTop: isLandscape ? '0.75rem' : '1.5rem',
              paddingBottom: isLandscape ? '0.75rem' : '1.5rem',
            }}
          >
            {/* Columna categorías */}
            <div style={{ flex: isLandscape ? '1' : undefined }} className="flex flex-col">
              <p className="mb-3 text-[10px] font-bold tracking-[0.3em] text-white/30">TIENDA</p>
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                style={{ paddingTop: isLandscape ? '0.25rem' : '0.625rem', paddingBottom: isLandscape ? '0.25rem' : '0.625rem' }}
                className={`${isLandscape ? 'text-sm' : 'text-base'} font-semibold text-white border-b border-white/10`}
              >
                Todas las categorías
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/shop/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ paddingTop: isLandscape ? '0.25rem' : '0.625rem', paddingBottom: isLandscape ? '0.25rem' : '0.625rem' }}
                  className={`${isLandscape ? 'text-xs' : 'text-sm'} text-white/70 border-b border-white/5`}
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            {/* Columna filtros + cuenta */}
            <div
              style={{ flex: isLandscape ? '1' : undefined, marginTop: isLandscape ? '0' : '1.5rem' }}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold tracking-[0.3em] text-white/30 mb-1">FILTROS</p>
                <Link href="/shop?filter=destacados" onClick={() => setMobileMenuOpen(false)} className={`${isLandscape ? 'text-xs' : 'text-sm'} font-bold tracking-widest text-white/60 hover:text-red-500`}>DESTACADOS</Link>
                <Link href="/shop?filter=new-drops" onClick={() => setMobileMenuOpen(false)} className={`${isLandscape ? 'text-xs' : 'text-sm'} font-bold tracking-widest text-white/60 hover:text-red-500`}>NEW DROPS</Link>
                <Link href="/shop?filter=sale" onClick={() => setMobileMenuOpen(false)} className={`${isLandscape ? 'text-xs' : 'text-sm'} font-bold tracking-widest text-white/60 hover:text-red-500`}>SALE</Link>
              </div>
              <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
                <p className="text-[10px] font-bold tracking-[0.3em] text-white/30 mb-1">MI CUENTA</p>
                {!safeUser ? (
                  <>
                    <Link href="/cuenta/login" onClick={() => setMobileMenuOpen(false)} className={`${isLandscape ? 'text-xs' : 'text-sm'} text-white/60`}>Iniciar sesión</Link>
                    <Link href="/cuenta/registro" onClick={() => setMobileMenuOpen(false)} className={`${isLandscape ? 'text-xs' : 'text-sm'} text-white/60`}>Registrarse</Link>
                  </>
                ) : (
                  <>
                    {safeProfile?.name && <p className={`${isLandscape ? 'text-xs' : 'text-sm'} font-semibold text-white`}>{safeProfile.name}</p>}
                    <Link href="/cuenta" onClick={() => setMobileMenuOpen(false)} className={`${isLandscape ? 'text-xs' : 'text-sm'} text-white/60`}>Mi cuenta</Link>
                    <button type="button" onClick={() => { setMobileMenuOpen(false); handleLogout() }} className={`${isLandscape ? 'text-xs' : 'text-sm'} text-left text-red-500`}>Cerrar sesión</button>
                  </>
                )}
                <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-2">
                  <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className={`${isLandscape ? 'text-xs' : 'text-sm'} text-white/60`}>Carrito</Link>
                  <Link href="/ayuda" onClick={() => setMobileMenuOpen(false)} className={`${isLandscape ? 'text-xs' : 'text-sm'} text-white/60`}>Ayuda</Link>
                </div>
              </div>
            </div>

          </nav>
        </div>
      )}

    </>
  )
}
