'use client'

import { useState } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { formatDate, contactDisplayName } from '@/lib/utils'
import type { EventRegistration, RegistrationStatus } from '@/types'
import { Check, Clock, X, UserCheck, ChevronDown } from 'lucide-react'

interface RegistrationWithContact extends Omit<EventRegistration, 'contact'> {
  contact: {
    id: string
    first_name: string
    last_name: string | null
    email: string | null
    phone: string | null
  }
}

interface RegistrationTableProps {
  registrations: RegistrationWithContact[]
  eventId: string
  onUpdate: () => void
}

const statusToBadge: Record<RegistrationStatus, 'confirmed' | 'pending' | 'cancelled' | 'attended' | 'lead' | 'draft' | 'default'> = {
  pending: 'pending',
  confirmed: 'confirmed',
  waitlisted: 'lead',
  cancelled: 'cancelled',
  attended: 'attended',
  no_show: 'draft',
}

const statusLabels: Record<RegistrationStatus, string> = {
  pending: 'In attesa',
  confirmed: 'Confermata',
  waitlisted: 'Lista d\'attesa',
  cancelled: 'Cancellata',
  attended: 'Presente',
  no_show: 'Assente',
}

interface StatusAction {
  status: RegistrationStatus
  label: string
  icon: typeof Check
}

const statusActions: StatusAction[] = [
  { status: 'confirmed', label: 'Conferma', icon: Check },
  { status: 'waitlisted', label: 'Lista d\'attesa', icon: Clock },
  { status: 'cancelled', label: 'Cancella', icon: X },
  { status: 'attended', label: 'Presente', icon: UserCheck },
]

export function RegistrationTable({ registrations, eventId, onUpdate }: RegistrationTableProps) {
  const { toast } = useToast()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  async function updateStatus(registrationId: string, newStatus: RegistrationStatus) {
    setLoadingId(registrationId)
    setOpenMenuId(null)

    try {
      const res = await fetch(
        `/api/events/${eventId}/registrations/${registrationId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        }
      )

      if (!res.ok) {
        const data = await res.json()
        toast('error', data.error || 'Errore durante l\'aggiornamento')
        return
      }

      toast('success', `Stato aggiornato a: ${statusLabels[newStatus]}`)
      onUpdate()
    } catch {
      toast('error', 'Errore di rete')
    } finally {
      setLoadingId(null)
    }
  }

  if (registrations.length === 0) {
    return (
      <p className="text-sm text-warm-muted font-body py-8 text-center">
        Nessuna registrazione
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Contatto</TableHead>
          <TableHead>Stato</TableHead>
          <TableHead>Dieta</TableHead>
          <TableHead>+1</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {registrations.map((reg) => (
          <TableRow key={reg.id}>
            <TableCell>
              <div>
                <p className="font-medium text-warm-text">
                  {contactDisplayName(reg.contact)}
                </p>
                <p className="text-xs text-warm-muted">
                  {reg.contact.email || reg.contact.phone}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={statusToBadge[reg.status]}>
                {statusLabels[reg.status]}
              </Badge>
            </TableCell>
            <TableCell>
              <span className="text-sm text-warm-muted">
                {reg.dietary_requirements || '—'}
              </span>
            </TableCell>
            <TableCell>
              {reg.plus_one ? (
                <span className="text-sm text-warm-text">
                  {reg.plus_one_name || 'Si'}
                </span>
              ) : (
                <span className="text-sm text-warm-muted">No</span>
              )}
            </TableCell>
            <TableCell>
              <span className="text-sm text-warm-muted">
                {formatDate(reg.registered_at)}
              </span>
            </TableCell>
            <TableCell>
              <div className="relative">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={loadingId === reg.id}
                  loading={loadingId === reg.id}
                  onClick={() =>
                    setOpenMenuId(openMenuId === reg.id ? null : reg.id)
                  }
                >
                  <span className="sr-only">Azioni</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>

                {openMenuId === reg.id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenMenuId(null)}
                    />
                    <div className="absolute right-0 top-full mt-1 z-20 w-44 bg-white border border-stone rounded-none shadow-lg py-1">
                      {statusActions
                        .filter((a) => a.status !== reg.status)
                        .map((action) => {
                          const Icon = action.icon
                          return (
                            <button
                              key={action.status}
                              onClick={() => updateStatus(reg.id, action.status)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-body text-warm-text hover:bg-cream-alt transition-colors text-left"
                            >
                              <Icon className="h-3.5 w-3.5 text-warm-muted" />
                              {action.label}
                            </button>
                          )
                        })}
                    </div>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
