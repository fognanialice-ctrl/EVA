'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/contacts': 'Contatti',
  '/dashboard/events': 'Eventi',
  '/dashboard/payments': 'Pagamenti',
  '/dashboard/mailing': 'Mailing',
  '/dashboard/instagram': 'Instagram',
  '/dashboard/settings': 'Impostazioni',
}

function getPageTitle(pathname: string): string {
  // Exact match first
  if (pageTitles[pathname]) return pageTitles[pathname]

  // Check parent paths for nested routes
  const segments = pathname.split('/')
  while (segments.length > 2) {
    segments.pop()
    const parent = segments.join('/')
    if (pageTitles[parent]) return pageTitles[parent]
  }

  return 'Dashboard'
}

export function Topbar() {
  const pathname = usePathname()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null)
    })
  }, [])

  const title = getPageTitle(pathname)
  const initial = userEmail ? userEmail.charAt(0).toUpperCase() : '?'

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-[260px] z-20',
        'flex h-[60px] items-center justify-between',
        'border-b border-stone bg-cream px-6'
      )}
    >
      <h2 className="font-serif text-lg font-normal text-warm-text">
        {title}
      </h2>

      <div className="flex items-center gap-3">
        {userEmail && (
          <span className="font-body text-xs text-warm-muted">
            {userEmail}
          </span>
        )}
        <div className="flex h-8 w-8 items-center justify-center border border-stone bg-cream-alt font-body text-xs font-medium text-warm-text">
          {initial}
        </div>
      </div>
    </header>
  )
}
