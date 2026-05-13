'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Users, HelpCircle, ExternalLink } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Panel', icon: LayoutDashboard, exact: true },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { href: '/admin/ayuda', label: 'Ayuda', icon: HelpCircle },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col bg-[#111] text-white">
      {/* Logo */}
      <div className="border-b border-white/10 px-6 py-5">
        <p className="text-2xl leading-none text-white" style={{ fontFamily: 'var(--font-bebas)' }}>
          GULAND
        </p>
        <p className="mt-0.5 text-[10px] tracking-widest text-white/30">ADMIN PANEL</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? 'bg-white/10 text-white'
                      : 'text-white/50 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Ver tienda */}
      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-white/40 transition-colors hover:text-white"
          target="_blank"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Ver tienda
        </Link>
      </div>
    </aside>
  )
}
