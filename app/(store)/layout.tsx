import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { WhatsAppButton } from '@/components/layout/whatsapp-button'
import { ScrollToTop } from '@/components/layout/scroll-top'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f0f] text-white">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pt-16 min-w-0 overflow-x-hidden">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
