import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  className?: string
  children: ReactNode
  title?: string
}

export function Card({ className, children, title }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-stone rounded-none',
        className
      )}
    >
      {title && (
        <div className="px-5 py-4 border-b border-stone">
          <h3 className="text-lg font-serif text-warm-text">{title}</h3>
        </div>
      )}
      <div className={title ? 'px-5 py-4' : 'p-5'}>
        {children}
      </div>
    </div>
  )
}
