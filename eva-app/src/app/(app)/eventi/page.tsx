import { createClient } from '@/lib/supabase/server'
import EventCard from '@/components/event-card'
import type { EVAEvent, EventRegistration } from '@/lib/types'

export default async function EventiPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get member's contact_id
  const { data: contact } = await supabase
    .from('contacts')
    .select('id')
    .eq('auth_user_id', user!.id)
    .single()

  // Fetch all visible events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true }) as { data: EVAEvent[] | null }

  // Fetch member's registrations (if contact exists)
  let registrations: EventRegistration[] = []
  if (contact) {
    const { data } = await supabase
      .from('event_registrations')
      .select('*, event:events(*)')
      .eq('contact_id', contact.id)
      .neq('status', 'cancelled') as { data: EventRegistration[] | null }
    registrations = data || []
  }

  const registeredEventIds = new Set(registrations.map((r) => r.event_id))

  const today = new Date().toISOString().split('T')[0]
  const upcomingEvents = (events || []).filter((e) => e.event_date >= today && e.status !== 'completed')
  const pastEvents = (events || []).filter((e) => e.event_date < today || e.status === 'completed')

  return (
    <main className="min-h-dvh bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-cream/95 backdrop-blur-[20px]" style={{ borderBottom: '1px solid #DDD3C4' }}>
        <div className="mx-auto max-w-[500px] px-5 py-3">
          <h1 className="font-display text-lg font-semibold text-warm-text">Eventi</h1>
        </div>
      </header>

      <div className="mx-auto max-w-[500px] px-5 pb-8 pt-5">
        {/* My registrations */}
        {registrations.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-[1.5px] text-warm-muted">
              Le tue iscrizioni
            </h2>
            <div className="space-y-3">
              {registrations.map((reg) => (
                reg.event && (
                  <EventCard
                    key={reg.id}
                    event={reg.event}
                    isRegistered
                  />
                )
              ))}
            </div>
          </section>
        )}

        {/* Upcoming events */}
        {upcomingEvents.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-[1.5px] text-warm-muted">
              Prossimi eventi
            </h2>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered={registeredEventIds.has(event.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Past events */}
        {pastEvents.length > 0 && (
          <section>
            <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-[1.5px] text-warm-muted">
              Eventi passati
            </h2>
            <div className="space-y-3">
              {pastEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered={registeredEventIds.has(event.id)}
                  isPast
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {(!events || events.length === 0) && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 text-4xl">✨</div>
            <h2 className="font-display text-lg font-semibold text-warm-text">
              Nessun evento in programma
            </h2>
            <p className="mt-2 text-sm text-warm-muted">
              Nuovi eventi saranno pubblicati presto. Resta sintonizzata!
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
