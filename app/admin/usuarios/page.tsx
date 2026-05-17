'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'

interface UserRow {
  id: string
  name: string
  email: string
  is_admin: boolean
  created_at: string
  order_count: number
  total_spent: number
}

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => {
        setUsers(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  const initials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  const isVip = (spent: number) => spent >= 150000

  return (
    <div className="p-4 sm:p-6 md:p-8">

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Usuarios</h1>
        <p className="mt-0.5 text-sm text-gray-400">{users.length} clientes registrados</p>
      </div>

      {/* Search */}
      <div className="mb-4 relative sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cliente..."
          className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white shadow-sm overflow-hidden">

        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">Cargando...</div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-gray-50">
              {filtered.map((user) => (
                <div key={user.id} className="px-5 py-3.5 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                      {initials(user.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        {isVip(user.total_spent) && (
                          <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 uppercase tracking-wide">VIP</span>
                        )}
                        {user.is_admin && (
                          <span className="shrink-0 rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-700 uppercase tracking-wide">Admin</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 text-xs text-gray-500">
                      <span>Desde {new Date(user.created_at).toLocaleDateString('es-AR')}</span>
                      <span>·</span>
                      <span>{user.order_count} pedidos</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">${user.total_spent.toLocaleString('es-AR')}</p>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="py-16 text-center text-sm text-gray-400">No se encontraron usuarios.</div>
              )}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Usuario</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Registro</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Pedidos</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Total gastado</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Rol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                            {initials(user.name)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-gray-900">{user.name}</p>
                              {isVip(user.total_spent) && (
                                <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 uppercase tracking-wide">VIP</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString('es-AR')}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{user.order_count}</td>
                      <td className="px-5 py-3.5 text-sm font-bold text-gray-900">
                        ${user.total_spent.toLocaleString('es-AR')}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${user.is_admin ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {user.is_admin ? 'Admin' : 'Cliente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-16 text-center text-sm text-gray-400">No se encontraron usuarios.</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
