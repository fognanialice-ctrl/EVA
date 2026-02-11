'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { ContactForm } from '@/components/contacts/contact-form'

export default function NewContactPage() {
  const router = useRouter()

  return (
    <div>
      <PageHeader
        title="Nuovo contatto"
        description="Aggiungi un nuovo contatto al CRM"
        action={
          <Link href="/dashboard/contacts">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Torna alla lista
            </Button>
          </Link>
        }
      />

      <div className="max-w-3xl">
        <ContactForm
          onSuccess={() => {
            router.push('/dashboard/contacts')
          }}
        />
      </div>
    </div>
  )
}
