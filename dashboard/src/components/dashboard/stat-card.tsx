'use client'

import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  href?: string
}

export function StatCard({ title, value, icon: Icon, trend, href }: StatCardProps) {
  const content = (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="font-serif text-3xl font-light text-warm-text">
          {value}
        </p>
        <p className="mt-1 text-sm font-sans text-warm-muted">{title}</p>
        {trend && (
          <p className="mt-2 text-xs font-body text-sage">{trend}</p>
        )}
      </div>
      <div className="flex-shrink-0 ml-4">
        <div className="flex items-center justify-center h-10 w-10 border border-stone/50 text-terracotta">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )

  const className = "bg-white border border-stone rounded-none p-5 block transition-colors hover:bg-cream/50"

  if (href) {
    return <Link href={href} className={className}>{content}</Link>
  }

  return <div className={className}>{content}</div>
}
