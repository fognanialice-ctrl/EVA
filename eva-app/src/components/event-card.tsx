import Link from 'next/link'
import type { EVAEvent } from '@/lib/types'
import { formatDate, formatTime, formatCurrency, cn } from '@/lib/utils'
import { EVENT_STATUSES } from '@/lib/constants'

interface EventCardProps {
  event: EVAEvent
  isRegistered?: boolean
  isPast?: boolean
}

export default function EventCard({ event, isRegistered, isPast }: EventCardProps) {
  const statusInfo = EVENT_STATUSES.find((s) => s.value === event.status)
  const isFree = event.ticket_price_cents === 0

  return (
    <Link href={`/eventi/${event.slug}`}>
      <article
        className={cn(
          'rounded-2xl bg-white p-5 transition-all duration-200 active:scale-[0.98]',
          isPast && 'opacity-70'
        )}
        style={{ boxShadow: '0 2px 12px rgba(61,43,31,0.05)', border: '1px solid #DDD3C4' }}
      >
        {/* Top row: date + badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-terracotta">
              {formatDate(event.event_date)}
            </p>
            <h3 className="mt-1 font-display text-[18px] font-semibold leading-tight text-warm-text">
              {event.title}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {statusInfo && event.status !== 'completed' && (
              <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-semibold text-white', statusInfo.color)}>
                {statusInfo.label}
              </span>
            )}
            {isRegistered && (
              <span className="rounded-full bg-sage px-2.5 py-1 text-[10px] font-semibold text-white">
                Iscritta
              </span>
            )}
          </div>
        </div>

        {/* Details row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-warm-muted">
          {event.start_time && (
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              {formatTime(event.start_time)}
              {event.end_time && ` – ${formatTime(event.end_time)}`}
            </span>
          )}
          {event.venue_name && (
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {event.venue_name}
            </span>
          )}
          <span className="flex items-center gap-1 font-semibold text-warm-text">
            {isFree ? 'Gratuito' : formatCurrency(event.ticket_price_cents)}
          </span>
        </div>
      </article>
    </Link>
  )
}
