'use client'

import { useState, useEffect } from 'react'
import { Input, Textarea } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { slugify } from '@/lib/utils'
import { EVENT_STATUSES } from '@/lib/constants'
import type { EVAEvent } from '@/types'

interface EventFormProps {
  event?: EVAEvent
  onSuccess?: () => void
}

interface FormErrors {
  [key: string]: string
}

export function EventForm({ event, onSuccess }: EventFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  const [form, setForm] = useState({
    title: event?.title || '',
    slug: event?.slug || '',
    description: event?.description || '',
    event_date: event?.event_date || '',
    start_time: event?.start_time || '',
    end_time: event?.end_time || '',
    venue_name: event?.venue_name || '',
    venue_address: event?.venue_address || '',
    city: event?.city || '',
    capacity: event?.capacity || 25,
    ticket_price_eur: event ? (event.ticket_price_cents / 100).toString() : '0',
    status: event?.status || 'draft',
  })

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && form.title) {
      setForm((prev) => ({ ...prev, slug: slugify(form.title) }))
    }
  }, [form.title, slugManuallyEdited])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setErrors((prev) => ({ ...prev, [name]: '' }))

    if (name === 'slug') {
      setSlugManuallyEdited(true)
    }

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Convert price to cents
    const priceEur = parseFloat(form.ticket_price_eur) || 0
    const priceCents = Math.round(priceEur * 100)

    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description || null,
      event_date: form.event_date,
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      venue_name: form.venue_name || null,
      venue_address: form.venue_address || null,
      city: form.city || null,
      capacity: Number(form.capacity),
      ticket_price_cents: priceCents,
      status: form.status,
    }

    try {
      const url = event ? `/api/events/${event.id}` : '/api/events'
      const method = event ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.details?.fieldErrors) {
          const fieldErrors: FormErrors = {}
          for (const [key, msgs] of Object.entries(data.details.fieldErrors)) {
            fieldErrors[key] = (msgs as string[])[0]
          }
          setErrors(fieldErrors)
        }
        toast('error', data.error || 'Errore durante il salvataggio')
        return
      }

      toast('success', event ? 'Evento aggiornato' : 'Evento creato')
      onSuccess?.()
    } catch {
      toast('error', 'Errore di rete')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Titolo"
          name="title"
          value={form.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="Nome dell'evento"
          required
        />
        <Input
          label="Slug"
          name="slug"
          value={form.slug}
          onChange={handleChange}
          error={errors.slug}
          placeholder="nome-evento"
        />
      </div>

      <Textarea
        label="Descrizione"
        name="description"
        value={form.description}
        onChange={handleChange}
        error={errors.description}
        placeholder="Descrivi l'evento..."
        rows={4}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Data evento"
          name="event_date"
          type="date"
          value={form.event_date}
          onChange={handleChange}
          error={errors.event_date}
          required
        />
        <Input
          label="Ora inizio"
          name="start_time"
          type="time"
          value={form.start_time}
          onChange={handleChange}
          error={errors.start_time}
        />
        <Input
          label="Ora fine"
          name="end_time"
          type="time"
          value={form.end_time}
          onChange={handleChange}
          error={errors.end_time}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Location"
          name="venue_name"
          value={form.venue_name}
          onChange={handleChange}
          error={errors.venue_name}
          placeholder="Nome del luogo"
        />
        <Input
          label="Indirizzo"
          name="venue_address"
          value={form.venue_address}
          onChange={handleChange}
          error={errors.venue_address}
          placeholder="Via..."
        />
        <Input
          label="Città"
          name="city"
          value={form.city}
          onChange={handleChange}
          error={errors.city}
          placeholder="es. Genova"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Capienza"
          name="capacity"
          type="number"
          min={1}
          value={form.capacity}
          onChange={handleChange}
          error={errors.capacity}
        />
        <Input
          label="Prezzo biglietto (EUR)"
          name="ticket_price_eur"
          type="number"
          min={0}
          step={0.01}
          value={form.ticket_price_eur}
          onChange={handleChange}
          error={errors.ticket_price_cents}
          placeholder="0.00"
        />
        <Select
          label="Stato"
          name="status"
          value={form.status}
          onChange={handleChange}
          error={errors.status}
          options={EVENT_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-stone">
        <Button type="submit" loading={loading}>
          {event ? 'Salva modifiche' : 'Crea evento'}
        </Button>
      </div>
    </form>
  )
}
