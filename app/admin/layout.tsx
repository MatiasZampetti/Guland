import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminGuard } from '@/components/admin/admin-guard'

export const metadata = { title: 'Admin — Guland' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex h-screen overflow-hidden bg-[#F4F4F5] font-[family-name:var(--font-inter)]">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </AdminGuard>
  )
}
