'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  Mail,
  Instagram,
  Settings,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const navigation = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Contatti', href: '/dashboard/contacts', icon: Users },
  { label: 'Eventi', href: '/dashboard/events', icon: Calendar },
  { label: 'Pagamenti', href: '/dashboard/payments', icon: CreditCard },
  { label: 'Mailing', href: '/dashboard/mailing', icon: Mail },
  { label: 'Instagram', href: '/dashboard/instagram', icon: Instagram },
  { label: 'Impostazioni', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  function isActive(href: string) {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[260px] flex-col border-r border-sidebar-border bg-sidebar-bg">
      {/* Logo */}
      <div className="flex h-[60px] items-center px-6">
        <span className="font-serif text-xl font-light tracking-[0.2em] text-warm-text">
          EVA
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 font-sans text-sm transition-colors duration-150',
                    active
                      ? 'border-l-2 border-terracotta text-terracotta'
                      : 'border-l-2 border-transparent text-warm-muted hover:text-warm-text'
                  )}
                >
                  <Icon size={18} strokeWidth={1.5} />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-stone px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 font-sans text-sm text-warm-muted transition-colors duration-150 hover:text-warm-text"
        >
          <LogOut size={18} strokeWidth={1.5} />
          Esci
        </button>
      </div>
    </aside>
  )
}
