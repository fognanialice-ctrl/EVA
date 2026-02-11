'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useContact } from '@/hooks/useContacts'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { PageLoading } from '@/components/ui/loading'
import { EmptyState } from '@/components/ui/empty-state'
import { ContactForm } from '@/components/contacts/contact-form'
import { FileText } from 'lucide-react'
import { contactDisplayName } from '@/lib/utils'

export default function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { contact, isLoading } = useContact(id)

  if (isLoading) return <PageLoading />

  if (!contact) {
    return (
      <EmptyState
        icon={FileText}
        title="Contatto non trovato"
        description="Il contatto richiesto non esiste o e stato eliminato"
        action={
          <Link href="/dashboard/contacts">
            <Button variant="primary">Torna alla lista</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div>
      <PageHeader
        title={`Modifica: ${contactDisplayName(contact)}`}
        action={
          <Link href={`/dashboard/contacts/${id}`}>
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Torna al dettaglio
            </Button>
          </Link>
        }
      />

      <div className="max-w-3xl">
        <ContactForm
          contact={contact}
          onSuccess={() => {
            router.push(`/dashboard/contacts/${id}`)
          }}
        />
      </div>
    </div>
  )
}
