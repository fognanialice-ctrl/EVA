'use client'

import { use, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Calendar,
  Briefcase,
  Heart,
  Shield,
  Camera,
  FileText,
  Clock,
  CreditCard,
  Tag,
} from 'lucide-react'
import { cn, formatDate, formatDateShort, formatRelativeTime, contactDisplayName, getInitials, formatCurrency } from '@/lib/utils'
import { CONTACT_STATUSES, CONTACT_SOURCES, PREFERRED_CONTACTS, BILLING_TYPES } from '@/lib/constants'
import { useContact } from '@/hooks/useContacts'
import { useToast } from '@/components/ui/toast'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { PageLoading } from '@/components/ui/loading'
import { EmptyState } from '@/components/ui/empty-state'
import { ContactTags } from '@/components/contacts/contact-tags'
import type { ContactStatus } from '@/types'

const statusBadgeVariant: Record<ContactStatus, 'lead' | 'pending' | 'confirmed' | 'attended' | 'draft'> = {
  lead: 'lead',
  contacted: 'pending',
  confirmed: 'confirmed',
  attended: 'attended',
  inactive: 'draft',
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 text-warm-muted mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs font-sans text-warm-muted">{label}</p>
        <p className="text-sm font-sans text-warm-text">{value}</p>
      </div>
    </div>
  )
}

export default function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const { contact, activities, isLoading, mutate } = useContact(id)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = useCallback(async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const json = await res.json()
        toast('error', json.error || 'Errore durante l\'eliminazione')
        return
      }
      toast('success', 'Contatto eliminato')
      router.push('/dashboard/contacts')
    } catch {
      toast('error', 'Errore di rete')
    } finally {
      setDeleting(false)
      setDeleteOpen(false)
    }
  }, [id, router, toast])

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

  function getStatusLabel(status: string) {
    return CONTACT_STATUSES.find((s) => s.value === status)?.label ?? status
  }

  function getSourceLabel(source: string) {
    return CONTACT_SOURCES.find((s) => s.value === source)?.label ?? source
  }

  function getPreferredLabel(method: string | null) {
    if (!method) return null
    return PREFERRED_CONTACTS.find((s) => s.value === method)?.label ?? method
  }

  function getBillingTypeLabel(type: string | null) {
    if (!type) return null
    return BILLING_TYPES.find((s) => s.value === type)?.label ?? type
  }

  const fullName = contactDisplayName(contact)
  const initials = getInitials(contact.first_name, contact.last_name)

  return (
    <div>
      <PageHeader
        title=""
        action={
          <div className="flex items-center gap-2">
            <Link href="/dashboard/contacts">
              <Button variant="secondary">
                <ArrowLeft className="h-4 w-4" />
                Lista
              </Button>
            </Link>
            <Link href={`/dashboard/contacts/${id}/edit`}>
              <Button variant="primary">
                <Pencil className="h-4 w-4" />
                Modifica
              </Button>
            </Link>
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4" />
              Elimina
            </Button>
          </div>
        }
      />

      {/* Contact header */}
      <div className="mb-6 flex items-center gap-4">
        <div className="h-16 w-16 rounded-none bg-terracotta/10 border border-terracotta/30 flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-serif text-terracotta">{initials}</span>
        </div>
        <div>
          <h2 className="text-2xl font-serif font-light text-warm-text">{fullName}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={statusBadgeVariant[contact.status as ContactStatus] ?? 'default'}>
              {getStatusLabel(contact.status)}
            </Badge>
            <span className="text-xs font-sans text-warm-muted">
              {getSourceLabel(contact.source)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info personali */}
          <Card title="Informazioni personali">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <InfoRow icon={Mail} label="Email" value={contact.email} />
              <InfoRow icon={Phone} label="Telefono" value={contact.phone} />
              <InfoRow icon={MapPin} label="Citta" value={contact.city} />
              <InfoRow icon={Instagram} label="Instagram" value={contact.instagram_handle} />
              <InfoRow icon={Calendar} label="Data di nascita" value={contact.date_of_birth ? formatDate(contact.date_of_birth) : null} />
              <InfoRow icon={Briefcase} label="Professione" value={contact.profession} />
              <InfoRow icon={Heart} label="Metodo preferito" value={getPreferredLabel(contact.preferred_contact_method)} />
            </div>
          </Card>

          {/* Profilo / esigenze */}
          {(contact.dietary_requirements || contact.allergies_sensitivities) && (
            <Card title="Esigenze">
              {contact.dietary_requirements && (
                <div className="mb-3">
                  <p className="text-xs font-sans text-warm-muted mb-1">Esigenze alimentari</p>
                  <p className="text-sm font-sans text-warm-text">{contact.dietary_requirements}</p>
                </div>
              )}
              {contact.allergies_sensitivities && (
                <div>
                  <p className="text-xs font-sans text-warm-muted mb-1">Allergie / sensibilita</p>
                  <p className="text-sm font-sans text-warm-text">{contact.allergies_sensitivities}</p>
                </div>
              )}
            </Card>
          )}

          {/* Note */}
          {contact.notes && (
            <Card title="Note">
              <p className="text-sm font-sans text-warm-text whitespace-pre-wrap">{contact.notes}</p>
            </Card>
          )}

          {/* Storico eventi */}
          <Card title="Storico eventi">
            {contact.event_registrations && contact.event_registrations.length > 0 ? (
              <div className="space-y-3">
                {contact.event_registrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="flex items-center justify-between py-2 border-b border-stone/30 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-sans font-medium text-warm-text">
                        {reg.event?.title ?? 'Evento'}
                      </p>
                      <p className="text-xs font-sans text-warm-muted">
                        {reg.event?.event_date ? formatDate(reg.event.event_date) : ''} — Iscrizione: {formatDateShort(reg.registered_at)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        reg.status === 'confirmed'
                          ? 'confirmed'
                          : reg.status === 'attended'
                          ? 'attended'
                          : reg.status === 'cancelled'
                          ? 'cancelled'
                          : 'pending'
                      }
                    >
                      {reg.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm font-sans text-warm-muted py-2">
                Nessun evento registrato
              </p>
            )}
          </Card>

          {/* Storico pagamenti */}
          <Card title="Storico pagamenti">
            {contact.payments && contact.payments.length > 0 ? (
              <div className="space-y-3">
                {contact.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between py-2 border-b border-stone/30 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-sans font-medium text-warm-text">
                        {payment.description || payment.event?.title || 'Pagamento'}
                      </p>
                      <p className="text-xs font-sans text-warm-muted">
                        {payment.method} — {payment.paid_at ? formatDateShort(payment.paid_at) : formatDateShort(payment.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          payment.status === 'completed'
                            ? 'confirmed'
                            : payment.status === 'failed'
                            ? 'cancelled'
                            : 'pending'
                        }
                      >
                        {payment.status}
                      </Badge>
                      <span className="text-sm font-sans font-medium text-warm-text">
                        {formatCurrency(payment.amount_cents)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm font-sans text-warm-muted py-2">
                Nessun pagamento registrato
              </p>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Tag */}
          <Card title="Tag">
            <ContactTags
              contactId={id}
              tags={contact.tags || []}
              onUpdate={() => mutate()}
            />
          </Card>

          {/* Tracking */}
          <Card title="Tracking">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-sans text-warm-muted">Fonte</span>
                <span className="font-sans text-warm-text">{getSourceLabel(contact.source)}</span>
              </div>
              {contact.source_detail && (
                <div className="flex justify-between text-sm">
                  <span className="font-sans text-warm-muted">Dettaglio</span>
                  <span className="font-sans text-warm-text">{contact.source_detail}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="font-sans text-warm-muted">Mailing list</span>
                <span className="font-sans text-warm-text">{contact.subscribed_to_mailing ? 'Si' : 'No'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-sans text-warm-muted">Creato il</span>
                <span className="font-sans text-warm-text">{formatDate(contact.created_at)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-sans text-warm-muted">Aggiornato il</span>
                <span className="font-sans text-warm-text">{formatDate(contact.updated_at)}</span>
              </div>
            </div>
          </Card>

          {/* GDPR */}
          <Card title="GDPR">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className={cn('h-4 w-4', contact.gdpr_consent ? 'text-sage' : 'text-warm-muted')} />
                <span className="text-sm font-sans text-warm-text">
                  Consenso GDPR: {contact.gdpr_consent ? 'Si' : 'No'}
                </span>
              </div>
              {contact.gdpr_consent_date && (
                <p className="text-xs font-sans text-warm-muted ml-6">
                  Data: {formatDate(contact.gdpr_consent_date)}
                </p>
              )}
              <div className="flex items-center gap-2">
                <Camera className={cn('h-4 w-4', contact.photo_consent ? 'text-sage' : 'text-warm-muted')} />
                <span className="text-sm font-sans text-warm-text">
                  Consenso foto: {contact.photo_consent ? 'Si' : 'No'}
                </span>
              </div>
            </div>
          </Card>

          {/* Fatturazione */}
          {contact.billing_type && (
            <Card title="Fatturazione">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-sans text-warm-muted">Tipo</span>
                  <span className="font-sans text-warm-text">{getBillingTypeLabel(contact.billing_type)}</span>
                </div>
                {contact.codice_fiscale && (
                  <div className="flex justify-between text-sm">
                    <span className="font-sans text-warm-muted">CF</span>
                    <span className="font-sans text-warm-text font-mono text-xs">{contact.codice_fiscale}</span>
                  </div>
                )}
                {contact.partita_iva && (
                  <div className="flex justify-between text-sm">
                    <span className="font-sans text-warm-muted">P.IVA</span>
                    <span className="font-sans text-warm-text font-mono text-xs">{contact.partita_iva}</span>
                  </div>
                )}
                {contact.ragione_sociale && (
                  <div className="flex justify-between text-sm">
                    <span className="font-sans text-warm-muted">Ragione sociale</span>
                    <span className="font-sans text-warm-text">{contact.ragione_sociale}</span>
                  </div>
                )}
                {contact.sdi_code && (
                  <div className="flex justify-between text-sm">
                    <span className="font-sans text-warm-muted">SDI</span>
                    <span className="font-sans text-warm-text font-mono text-xs">{contact.sdi_code}</span>
                  </div>
                )}
                {contact.pec && (
                  <div className="flex justify-between text-sm">
                    <span className="font-sans text-warm-muted">PEC</span>
                    <span className="font-sans text-warm-text">{contact.pec}</span>
                  </div>
                )}
                {(contact.billing_address || contact.billing_city) && (
                  <div className="flex justify-between text-sm">
                    <span className="font-sans text-warm-muted">Indirizzo</span>
                    <span className="font-sans text-warm-text text-right">
                      {[contact.billing_address, contact.billing_cap, contact.billing_city, contact.billing_province]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Activity timeline */}
          <Card title="Attivita recenti">
            {activities.length > 0 ? (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <Clock className="h-3.5 w-3.5 text-warm-muted" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-sans text-warm-text truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs font-sans text-warm-muted">
                        {formatRelativeTime(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm font-sans text-warm-muted py-2">
                Nessuna attivita registrata
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Elimina contatto"
      >
        <div className="space-y-4">
          <p className="text-sm font-sans text-warm-text">
            Sei sicura di voler eliminare il contatto <strong>{fullName}</strong>?
            Questa azione non puo essere annullata.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
              Annulla
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              Elimina
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
