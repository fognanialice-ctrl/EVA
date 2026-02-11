'use client'

import { useParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/page-header'
import { Card } from '@/components/ui/card'
import { PageLoading } from '@/components/ui/loading'
import { EventForm } from '@/components/events/event-form'
import { useEvent } from '@/hooks/useEvents'

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { event, isLoading, error } = useEvent(id)

  if (isLoading) return <PageLoading />

  if (error || !event) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-dusty-rose font-body">
          {error ? 'Errore durante il caricamento' : 'Evento non trovato'}
        </p>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title={`Modifica: ${event.title}`}
        description="Aggiorna i dettagli dell'evento"
      />

      <Card>
        <EventForm
          event={event}
          onSuccess={() => {
            router.push(`/dashboard/events/${id}`)
            router.refresh()
          }}
        />
      </Card>
    </>
  )
}
