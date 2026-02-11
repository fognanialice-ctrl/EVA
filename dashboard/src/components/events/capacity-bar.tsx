import { cn } from '@/lib/utils'

interface CapacityBarProps {
  confirmed: number
  waitlisted: number
  capacity: number
  className?: string
}

export function CapacityBar({ confirmed, waitlisted, capacity, className }: CapacityBarProps) {
  const total = confirmed + waitlisted
  const confirmedPercent = capacity > 0 ? Math.min((confirmed / capacity) * 100, 100) : 0
  const waitlistedPercent = capacity > 0 ? Math.min((waitlisted / capacity) * 100, 100 - confirmedPercent) : 0

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between text-xs font-body text-warm-muted">
        <span>{total}/{capacity} posti</span>
        {total >= capacity && (
          <span className="text-dusty-rose font-medium">Completo</span>
        )}
      </div>
      <div className="h-2 w-full bg-stone/40 rounded-none overflow-hidden flex">
        {confirmedPercent > 0 && (
          <div
            className="h-full bg-sage transition-all duration-300"
            style={{ width: `${confirmedPercent}%` }}
          />
        )}
        {waitlistedPercent > 0 && (
          <div
            className="h-full bg-ochre transition-all duration-300"
            style={{ width: `${waitlistedPercent}%` }}
          />
        )}
      </div>
    </div>
  )
}
