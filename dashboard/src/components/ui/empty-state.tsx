import { type ReactNode, type ComponentType } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: ComponentType<{ className?: string }>
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="mb-4 text-warm-muted">
        <Icon className="h-12 w-12 mx-auto" />
      </div>
      <h3 className="text-lg font-serif text-warm-text mb-1">{title}</h3>
      {description && (
        <p className="text-sm font-body text-warm-muted max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
