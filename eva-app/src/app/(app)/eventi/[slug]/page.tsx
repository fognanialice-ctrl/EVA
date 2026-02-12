import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatTime, formatCurrency } from '@/lib/utils'
import type { EVAEvent, EventRegistration } from '@/lib/types'
import RegistrationAction from './registration-action'

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch event by slug
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single() as { data: EVAEvent | null }

  if (!event) {
    notFound()
  }

  // Get member's contact
  const { data: contact } = await supabase
    .from('contacts')
    .select('id, dietary_requirements')
    .eq('auth_user_id', user!.id)
    .single()

  // Check if member is already registered
  let existingRegistration: EventRegistration | null = null
  if (contact) {
    const { data } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', event.id)
      .eq('contact_id', contact.id)
      .order('registered_at', { ascending: false })
      .limit(1)
      .single() as { data: EventRegistration | null }
    existingRegistration = data
  }

  // Count confirmed registrations for capacity bar
  const { count: confirmedCount } = await supabase
    .from('event_registrations')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', event.id)
    .in('status', ['pending', 'confirmed', 'waitlisted'])

  const spotsUsed = confirmedCount || 0
  const spotsLeft = Math.max(0, event.capacity - spotsUsed)
  const capacityPercent = event.capacity > 0 ? Math.min(100, Math.round((spotsUsed / event.capacity) * 100)) : 0
  const isFull = spotsLeft === 0
  const isFree = event.ticket_price_cents === 0
  const canRegister = event.status === 'registration_open' && !isFull && contact

  return (
    <main className="min-h-dvh bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-cream/95 backdrop-blur-[20px]" style={{ borderBottom: '1px solid #DDD3C4' }}>
        <div className="mx-auto flex max-w-[500px] items-center gap-3 px-5 py-3">
          <Link href="/eventi" className="flex items-center text-warm-muted transition-colors hover:text-terracotta">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="font-display text-lg font-semibold text-warm-text">Dettaglio evento</h1>
        </div>
      </header>

      <div className="mx-auto max-w-[500px] px-5 pb-8 pt-6">
        {/* Event title + date */}
        <p className="text-[13px] font-semibold uppercase tracking-wide text-terracotta">
          {formatDate(event.event_date)}
        </p>
        <h2 className="mt-2 font-display text-[26px] font-semibold leading-tight text-warm-text">
          {event.title}
        </h2>

        {/* Details card */}
        <div className="mt-5 rounded-2xl bg-white p-5" style={{ boxShadow: '0 2px 12px rgba(61,43,31,0.05)', border: '1px solid #DDD3C4' }}>
          <div className="space-y-3">
            {/* Time */}
            {event.start_time && (
              <DetailRow icon="clock">
                {formatTime(event.start_time)}
                {event.end_time && ` – ${formatTime(event.end_time)}`}
              </DetailRow>
            )}

            {/* Venue */}
            {event.venue_name && (
              <DetailRow icon="pin">
                <span className="font-semibold">{event.venue_name}</span>
                {event.venue_address && (
                  <span className="block text-[12px] text-warm-muted">{event.venue_address}</span>
                )}
                {event.city && (
                  <span className="block text-[12px] text-warm-muted">{event.city}</span>
                )}
              </DetailRow>
            )}

            {/* Price */}
            <DetailRow icon="tag">
              <span className="font-semibold">
                {isFree ? 'Ingresso gratuito' : formatCurrency(event.ticket_price_cents)}
              </span>
            </DetailRow>
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <div className="mt-4 rounded-2xl bg-white p-5" style={{ boxShadow: '0 2px 12px rgba(61,43,31,0.05)', border: '1px solid #DDD3C4' }}>
            <h3 className="mb-3 font-display text-[16px] font-semibold text-warm-text">Descrizione</h3>
            <p className="whitespace-pre-line text-[14px] leading-relaxed text-warm-muted">
              {event.description}
            </p>
          </div>
        )}

        {/* Capacity bar */}
        <div className="mt-4 rounded-2xl bg-white p-5" style={{ boxShadow: '0 2px 12px rgba(61,43,31,0.05)', border: '1px solid #DDD3C4' }}>
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-warm-text">Disponibilità</p>
            <p className="text-[13px] font-semibold text-terracotta">
              {spotsLeft} {spotsLeft === 1 ? 'posto' : 'posti'} su {event.capacity}
            </p>
          </div>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-stone/50">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${capacityPercent}%`,
                background: isFull
                  ? '#C4A0A0'
                  : capacityPercent > 80
                    ? '#C9A84C'
                    : 'linear-gradient(90deg, #7A8B6F, #8B9B7F)',
              }}
            />
          </div>
        </div>

        {/* Registration action */}
        {contact && (
          <div className="mt-5">
            <RegistrationAction
              eventId={event.id}
              contactId={contact.id}
              eventStatus={event.status}
              isFull={isFull}
              existingRegistration={existingRegistration}
              defaultDietary={contact.dietary_requirements || ''}
            />
          </div>
        )}
      </div>
    </main>
  )
}

function DetailRow({ icon, children }: { icon: 'clock' | 'pin' | 'tag'; children: React.ReactNode }) {
  const icons = {
    clock: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9A8E86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    pin: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9A8E86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    tag: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9A8E86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  }

  return (
    <div className="flex items-start gap-3 text-[14px] text-warm-text">
      <div className="mt-0.5 shrink-0">{icons[icon]}</div>
      <div>{children}</div>
    </div>
  )
}
