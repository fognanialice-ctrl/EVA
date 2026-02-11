'use client'

import Link from 'next/link'
import { CalendarDays, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { PageLoading } from '@/components/ui/loading'
import { EventCard } from '@/components/events/event-card'
import { useEvents } from '@/hooks/useEvents'

export default function EventsPage() {
  const { events, isLoading, error } = useEvents()

  if (isLoading) return <PageLoading />

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-dusty-rose font-body">
          Errore durante il caricamento degli eventi
        </p>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Eventi"
        description="Gestisci eventi, registrazioni e presenze"
        action={
          <Link href="/dashboard/events/new">
            <Button>
              <Plus className="h-4 w-4" />
              Nuovo evento
            </Button>
          </Link>
        }
      />

      {events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Nessun evento"
          description="Crea il tuo primo evento per iniziare a gestire le registrazioni"
          action={
            <Link href="/dashboard/events/new">
              <Button>
                <Plus className="h-4 w-4" />
                Crea evento
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </>
  )
}
