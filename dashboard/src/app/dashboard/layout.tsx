import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { ToastProvider } from '@/components/ui/toast'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-cream">
        <Sidebar />
        <Topbar />

        <main className="ml-[260px] pt-[60px]">
          <div className="mx-auto max-w-6xl px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  )
}
