import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant =
  | 'confirmed'
  | 'pending'
  | 'cancelled'
  | 'attended'
  | 'draft'
  | 'lead'
  | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  confirmed: 'bg-sage/20 text-sage',
  pending: 'bg-ochre/20 text-ochre',
  cancelled: 'bg-dusty-rose/20 text-dusty-rose',
  attended: 'bg-muted-gold/20 text-muted-gold',
  draft: 'bg-warm-light/60 text-warm-muted',
  lead: 'bg-soft-blue/20 text-soft-blue',
  default: 'bg-stone/20 text-warm-text',
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-none px-2 py-0.5',
        'text-xs font-body font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
