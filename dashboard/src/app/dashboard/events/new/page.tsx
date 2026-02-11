'use client'

import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/page-header'
import { Card } from '@/components/ui/card'
import { EventForm } from '@/components/events/event-form'

export default function NewEventPage() {
  const router = useRouter()

  return (
    <>
      <PageHeader
        title="Nuovo evento"
        description="Crea un nuovo evento per la comunità"
      />

      <Card>
        <EventForm
          onSuccess={() => {
            router.push('/dashboard/events')
            router.refresh()
          }}
        />
      </Card>
    </>
  )
}
