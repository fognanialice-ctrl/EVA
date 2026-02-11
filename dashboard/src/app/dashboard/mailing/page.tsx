'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { Mail, Download } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { PageLoading } from '@/components/ui/loading'
import { useToast } from '@/components/ui/toast'
import { cn, contactDisplayName, formatDateShort } from '@/lib/utils'
import type { Contact, Tag } from '@/types'

interface MailingContact extends Contact {
  tags: Tag[]
}

interface ContactsResponse {
  contacts: MailingContact[]
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Errore durante il caricamento')
  }
  return res.json()
}

export default function MailingPage() {
  const { toast } = useToast()
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const { data, isLoading, error, mutate } = useSWR<ContactsResponse>(
    '/api/contacts?mailing=true',
    async (url: string) => {
      // Fetch all contacts and filter for mailing subscribers
      const res = await fetch('/api/contacts')
      if (!res.ok) throw new Error('Errore durante il caricamento')
      const data = await res.json()
      const subscribers = (data.contacts || []).filter(
        (c: MailingContact) => c.subscribed_to_mailing
      )
      return { contacts: subscribers }
    }
  )

  const subscribers = data?.contacts || []

  const handleExportCSV = useCallback(async () => {
    setExporting(true)
    try {
      const res = await fetch('/api/mailing/export')
      if (!res.ok) {
        toast('error', "Errore durante l'esportazione")
        return
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'eva_mailing_list.csv'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast('success', 'Mailing list esportata con successo')
    } catch {
      toast('error', "Errore durante l'esportazione")
    } finally {
      setExporting(false)
    }
  }, [toast])

  const handleToggleSubscription = useCallback(
    async (contact: MailingContact) => {
      setTogglingId(contact.id)
      try {
        const res = await fetch(`/api/contacts/${contact.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: contact.first_name,
            last_name: contact.last_name,
            email: contact.email,
            phone: contact.phone,
            subscribed_to_mailing: false,
            gdpr_consent: contact.gdpr_consent,
            gdpr_consent_date: contact.gdpr_consent_date,
            source: contact.source,
            status: contact.status,
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          toast('error', data.error || 'Errore nella disiscrizione')
          return
        }

        toast('success', `${contactDisplayName(contact)} disiscritto dalla mailing list`)
        mutate()
      } catch {
        toast('error', 'Errore di rete')
      } finally {
        setTogglingId(null)
      }
    },
    [toast, mutate]
  )

  if (isLoading) return <PageLoading />

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-sm font-body text-dusty-rose">
          Errore nel caricamento della mailing list
        </p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Mailing List"
        description={`${subscribers.length} iscritte alla mailing list`}
        action={
          <Button
            variant="primary"
            onClick={handleExportCSV}
            loading={exporting}
          >
            <Download className="h-4 w-4" />
            Esporta CSV
          </Button>
        }
      />

      {subscribers.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="Nessuna iscritta"
          description="Non ci sono ancora contatti iscritti alla mailing list"
        />
      ) : (
        <div className="bg-white border border-stone rounded-none">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Città</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Data iscrizione</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((contact: MailingContact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <span className="font-sans font-medium">
                      {contactDisplayName(contact)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {contact.email || (
                      <span className="text-warm-muted">--</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {contact.city || (
                      <span className="text-warm-muted">--</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(contact.tags || []).map((tag) => (
                        <Badge key={tag.id} variant="default">
                          {tag.name}
                        </Badge>
                      ))}
                      {(!contact.tags || contact.tags.length === 0) && (
                        <span className="text-warm-muted text-xs">--</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDateShort(contact.created_at)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="danger"
                      size="sm"
                      loading={togglingId === contact.id}
                      onClick={() => handleToggleSubscription(contact)}
                    >
                      Disiscriviti
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
