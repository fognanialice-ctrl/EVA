import Link from 'next/link'
import { Calendar, MapPin, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CapacityBar } from '@/components/events/capacity-bar'
import { formatDate, formatTime, formatCurrency } from '@/lib/utils'
import type { EVAEvent, EventStatus } from '@/types'

interface EventWithCounts extends EVAEvent {
  registration_count: number
  confirmed_count: number
}

interface EventCardProps {
  event: EventWithCounts
}

const statusToBadgeVariant: Record<EventStatus, 'draft' | 'confirmed' | 'pending' | 'cancelled' | 'attended' | 'lead' | 'default'> = {
  draft: 'draft',
  published: 'lead',
  registration_open: 'confirmed',
  registration_closed: 'pending',
  completed: 'attended',
  cancelled: 'cancelled',
}

const statusLabels: Record<EventStatus, string> = {
  draft: 'Bozza',
  published: 'Pubblicato',
  registration_open: 'Iscrizioni aperte',
  registration_closed: 'Iscrizioni chiuse',
  completed: 'Completato',
  cancelled: 'Cancellato',
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/dashboard/events/${event.id}`}
      className="block bg-white border border-stone rounded-none p-5 transition-colors hover:border-terracotta/50 group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-serif text-lg text-warm-text group-hover:text-terracotta transition-colors line-clamp-1">
          {event.title}
        </h3>
        <Badge variant={statusToBadgeVariant[event.status]}>
          {statusLabels[event.status]}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-warm-muted font-body">
          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{formatDate(event.event_date)}</span>
          {event.start_time && (
            <>
              <Clock className="h-3.5 w-3.5 flex-shrink-0 ml-2" />
              <span>
                {formatTime(event.start_time)}
                {event.end_time && ` - ${formatTime(event.end_time)}`}
              </span>
            </>
          )}
        </div>

        {(event.venue_name || event.city) && (
          <div className="flex items-center gap-2 text-sm text-warm-muted font-body">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="line-clamp-1">
              {[event.venue_name, event.city].filter(Boolean).join(', ')}
            </span>
          </div>
        )}
      </div>

      <CapacityBar
        confirmed={event.confirmed_count}
        waitlisted={event.registration_count - event.confirmed_count}
        capacity={event.capacity}
        className="mb-3"
      />

      <div className="flex items-center justify-between pt-3 border-t border-stone/50">
        <span className="text-sm font-body text-warm-muted">
          {event.registration_count} registrazion{event.registration_count === 1 ? 'e' : 'i'}
        </span>
        <span className="text-sm font-body font-medium text-warm-text">
          {event.ticket_price_cents > 0 ? formatCurrency(event.ticket_price_cents) : 'Gratuito'}
        </span>
      </div>
    </Link>
  )
}
