'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import { useDebounce } from '@/hooks/useDebounce'
import { cn, contactDisplayName } from '@/lib/utils'
import { PAYMENT_METHODS, PAYMENT_STATUSES } from '@/lib/constants'
import type { Contact, EVAEvent } from '@/types'
import { ExternalLink } from 'lucide-react'

interface PaymentFormProps {
  onSuccess?: () => void
}

const methodOptions = PAYMENT_METHODS.map((m) => ({ value: m.value, label: m.label }))
const statusOptions = PAYMENT_STATUSES.map((s) => ({ value: s.value, label: s.label }))

export function PaymentForm({ onSuccess }: PaymentFormProps) {
  const { toast } = useToast()

  // Form state
  const [contactId, setContactId] = useState('')
  const [contactSearch, setContactSearch] = useState('')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [contactResults, setContactResults] = useState<Contact[]>([])
  const [showContactDropdown, setShowContactDropdown] = useState(false)

  const [eventId, setEventId] = useState('')
  const [events, setEvents] = useState<EVAEvent[]>([])

  const [amountEur, setAmountEur] = useState('')
  const [method, setMethod] = useState<string>('bank_transfer')
  const [status, setStatus] = useState<string>('completed')
  const [description, setDescription] = useState('')
  const [paidAt, setPaidAt] = useState(new Date().toISOString().split('T')[0])

  const [submitting, setSubmitting] = useState(false)
  const [generatingPaypal, setGeneratingPaypal] = useState(false)
  const [paypalUrl, setPaypalUrl] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const dropdownRef = useRef<HTMLDivElement>(null)
  const debouncedSearch = useDebounce(contactSearch, 300)

  // Search contacts
  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 2) {
      setContactResults([])
      return
    }

    const controller = new AbortController()

    fetch(`/api/contacts?search=${encodeURIComponent(debouncedSearch)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setContactResults(data.contacts || [])
        setShowContactDropdown(true)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Contact search error:', err)
        }
      })

    return () => controller.abort()
  }, [debouncedSearch])

  // Fetch events for dropdown
  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events || [])
      })
      .catch((err) => {
        console.error('Events fetch error:', err)
      })
  }, [])

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowContactDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function selectContact(contact: Contact) {
    setContactId(contact.id)
    setSelectedContact(contact)
    setContactSearch(contactDisplayName(contact))
    setShowContactDropdown(false)
    setContactResults([])
  }

  function clearContact() {
    setContactId('')
    setSelectedContact(null)
    setContactSearch('')
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}

    if (!contactId) {
      newErrors.contact = 'Seleziona un contatto'
    }

    const cents = Math.round(parseFloat(amountEur) * 100)
    if (!amountEur || isNaN(cents) || cents < 1) {
      newErrors.amount = "L'importo deve essere maggiore di 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const amountCents = Math.round(parseFloat(amountEur) * 100)

      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_id: contactId,
          event_id: eventId || null,
          amount_cents: amountCents,
          currency: 'EUR',
          method,
          status,
          description: description || null,
          paid_at: status === 'completed' && paidAt ? new Date(paidAt).toISOString() : null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast('error', data.error || 'Errore nella creazione del pagamento')
        return
      }

      toast('success', 'Pagamento registrato con successo')
      onSuccess?.()
    } catch {
      toast('error', 'Errore di rete')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGeneratePaypalLink() {
    if (!validate()) return

    setGeneratingPaypal(true)
    setPaypalUrl('')

    try {
      const amountCents = Math.round(parseFloat(amountEur) * 100)

      const res = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount_cents: amountCents,
          description: description || 'Pagamento EVA',
          contact_id: contactId,
          event_id: eventId || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast('error', data.error || "Errore nella creazione dell'ordine PayPal")
        return
      }

      const data = await res.json()
      setPaypalUrl(data.approvalUrl)
      toast('success', 'Link PayPal generato con successo')
    } catch {
      toast('error', 'Errore di rete')
    } finally {
      setGeneratingPaypal(false)
    }
  }

  const eventOptions = [
    { value: '', label: 'Nessun evento' },
    ...events.map((e) => ({ value: e.id, label: e.title })),
  ]

  return (
    <Card title="Dati pagamento">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Contact autocomplete */}
        <div ref={dropdownRef} className="relative">
          <Input
            label="Contatto *"
            placeholder="Cerca per nome, email..."
            value={contactSearch}
            onChange={(e) => {
              setContactSearch(e.target.value)
              if (selectedContact) {
                clearContact()
              }
            }}
            error={errors.contact}
          />
          {selectedContact && (
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs font-body text-sage">
                Selezionato: {contactDisplayName(selectedContact)}
                {selectedContact.email ? ` (${selectedContact.email})` : ''}
              </span>
              <button
                type="button"
                onClick={clearContact}
                className="text-xs text-dusty-rose hover:underline"
              >
                Cambia
              </button>
            </div>
          )}
          {showContactDropdown && contactResults.length > 0 && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-stone rounded-none shadow-lg max-h-48 overflow-y-auto">
              {contactResults.map((contact) => (
                <button
                  key={contact.id}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm font-body text-warm-text hover:bg-cream transition-colors"
                  onClick={() => selectContact(contact)}
                >
                  <span className="font-sans font-medium">
                    {contactDisplayName(contact)}
                  </span>
                  {contact.email && (
                    <span className="text-warm-muted ml-2">{contact.email}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Event select */}
        <Select
          label="Evento (opzionale)"
          options={eventOptions}
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        />

        {/* Amount */}
        <Input
          label="Importo (EUR) *"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={amountEur}
          onChange={(e) => setAmountEur(e.target.value)}
          error={errors.amount}
        />

        {/* Method */}
        <Select
          label="Metodo di pagamento"
          options={methodOptions}
          value={method}
          onChange={(e) => {
            setMethod(e.target.value)
            setPaypalUrl('')
          }}
        />

        {/* PayPal flow */}
        {method === 'paypal' && (
          <div className="border border-stone/50 bg-cream/50 p-4 space-y-3">
            <p className="text-sm font-body text-warm-text">
              Per i pagamenti PayPal, genera un link di pagamento da inviare al contatto.
            </p>
            <Button
              type="button"
              variant="primary"
              loading={generatingPaypal}
              onClick={handleGeneratePaypalLink}
            >
              Genera link pagamento
            </Button>
            {paypalUrl && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  readOnly
                  value={paypalUrl}
                  className="flex-1 rounded-none border border-stone bg-white px-3 py-2 text-sm font-body text-warm-text"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <a
                  href={paypalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-terracotta hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Apri
                </a>
              </div>
            )}
          </div>
        )}

        {/* Non-PayPal fields */}
        {method !== 'paypal' && (
          <>
            {/* Status */}
            <Select
              label="Stato"
              options={statusOptions}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />

            {/* Description */}
            <Input
              label="Descrizione (opzionale)"
              placeholder="Note sul pagamento..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Paid at */}
            {status === 'completed' && (
              <Input
                label="Data pagamento"
                type="date"
                value={paidAt}
                onChange={(e) => setPaidAt(e.target.value)}
              />
            )}

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <Button type="submit" loading={submitting}>
                Registra pagamento
              </Button>
            </div>
          </>
        )}
      </form>
    </Card>
  )
}
