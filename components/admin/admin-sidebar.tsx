'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  TrendingUp, PlusCircle, ExternalLink, ChevronLeft, ChevronRight, HelpCircle,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/ventas', label: 'Registrar venta', icon: PlusCircle },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { href: '/admin/finanzas', label: 'Finanzas', icon: TrendingUp },
  { href: '/admin/ayuda', label: 'FAQs', icon: HelpCircle },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col bg-[#0f0f0f] text-white transition-all duration-300 overflow-hidden
        ${collapsed ? 'w-16' : 'w-16 sm:w-60'}`}
    >
      {/* Logo + toggle */}
      <div className="admin-sidebar-logo border-b border-white/10">
        {/* Mobile: always compact */}
        <div className="sm:hidden flex items-center justify-center py-5">
          <p style={{ fontFamily: 'var(--font-bebas)' }} className="text-xl leading-none">
            <span className="text-white">G</span><span className="text-red-600">L</span>
          </p>
        </div>

        {/* Desktop collapsed */}
        {collapsed && (
          <div className="hidden sm:flex flex-col items-center py-4 gap-2">
            <p style={{ fontFamily: 'var(--font-bebas)' }} className="text-xl leading-none">
              <span className="text-white">G</span><span className="text-red-600">L</span>
            </p>
            <button
              onClick={() => setCollapsed(false)}
              className="flex h-6 w-6 items-center justify-center rounded-md text-white/30 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Desktop expanded */}
        {!collapsed && (
          <div className="hidden sm:flex items-start justify-between px-5 py-5">
            <div>
              <p style={{ fontFamily: 'var(--font-bebas)' }} className="text-2xl leading-none text-white">
                GULAND
              </p>
              <p className="mt-0.5 text-[10px] tracking-widest text-white/30">ADMIN PANEL</p>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="mt-1 shrink-0 flex h-7 w-7 items-center justify-center rounded-md text-white/30 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <ul className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  title={label}
                  className={`admin-sidebar-item flex items-center rounded-lg py-2.5 transition-colors border-l-2
                    justify-center px-2
                    sm:justify-start sm:px-3 sm:gap-3
                    ${collapsed ? 'sm:justify-center sm:px-2' : ''}
                    ${active
                      ? 'border-red-600 bg-red-700/15 text-white'
                      : 'border-transparent text-white/50 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className={`text-sm truncate ${collapsed ? 'hidden' : 'hidden sm:block'}`}>
                    {label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="admin-sidebar-footer border-t border-white/10 p-2">
        <Link
          href="/"
          title="Ver tienda"
          target="_blank"
          className={`flex items-center rounded-lg py-2.5 transition-colors text-white/40 hover:text-white
            justify-center px-2
            sm:px-3 sm:gap-3
            ${collapsed ? 'sm:justify-center sm:px-2' : 'sm:justify-start'}`}
        >
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          <span className={`text-xs truncate ${collapsed ? 'hidden' : 'hidden sm:block'}`}>
            Ver tienda
          </span>
        </Link>
      </div>
    </aside>
  )
}
