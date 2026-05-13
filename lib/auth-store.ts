'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  name: string
  email: string
  isAdmin: boolean
}

// Usuarios mock — en Fase 2 esto viene de la DB
const MOCK_USERS: (AuthUser & { password: string })[] = [
  { name: 'Admin Guland', email: 'admin@guland.com', password: 'admin123', isAdmin: true },
  { name: 'Usuario Demo', email: 'demo@guland.com', password: 'demo123', isAdmin: false },
]

const ADMIN_PANEL_PASSWORD = 'admin2024'

interface AuthStore {
  user: AuthUser | null
  adminSessionActive: boolean
  login: (email: string, password: string) => 'ok' | 'invalid'
  register: (name: string, email: string, password: string) => void
  logout: () => void
  activateAdminSession: (password: string) => boolean
  deactivateAdminSession: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      adminSessionActive: false,

      login: (email, password) => {
        const found = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        )
        if (!found) return 'invalid'
        set({ user: { name: found.name, email: found.email, isAdmin: found.isAdmin } })
        return 'ok'
      },

      register: (name, email, _password) => {
        set({ user: { name, email, isAdmin: false } })
      },

      logout: () => set({ user: null, adminSessionActive: false }),

      activateAdminSession: (password) => {
        if (password === ADMIN_PANEL_PASSWORD) {
          set({ adminSessionActive: true })
          return true
        }
        return false
      },

      deactivateAdminSession: () => set({ adminSessionActive: false }),
    }),
    { name: 'guland-auth' }
  )
)
