'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { EventRegistration, EventStatus, RegistrationStatus } from '@/lib/types'
import { REGISTRATION_STATUSES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface RegistrationActionProps {
  eventId: string
  contactId: string
  eventStatus: EventStatus
  isFull: boolean
  existingRegistration: EventRegistration | null
  defaultDietary: string
}

export default function RegistrationAction({
  eventId,
  contactId,
  eventStatus,
  isFull,
  existingRegistration,
  defaultDietary,
}: RegistrationActionProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Already registered (not cancelled)
  if (existingRegistration && existingRegistration.status !== 'cancelled') {
    return (
      <RegisteredView
        registration={existingRegistration}
        onCancel={async () => {
          setLoading(true)
          setError('')
          const supabase = createClient()
          const { error: updateError } = await supabase
            .from('event_registrations')
            .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
            .eq('id', existingRegistration.id)

          setLoading(false)
          if (updateError) {
            setError('Errore nella cancellazione. Riprova.')
            return
          }
          router.refresh()
        }}
        loading={loading}
        error={error}
      />
    )
  }

  // Registration not open
  if (eventStatus !== 'registration_open') {
    return (
      <div className="rounded-2xl bg-white p-5 text-center" style={{ boxShadow: '0 2px 12px rgba(61,43,31,0.05)', border: '1px solid #DDD3C4' }}>
        <p className="text-[14px] font-medium text-warm-muted">
          {eventStatus === 'registration_closed'
            ? 'Le iscrizioni per questo evento sono chiuse.'
            : eventStatus === 'completed'
              ? 'Questo evento si è già svolto.'
              : 'Le iscrizioni non sono ancora aperte.'}
        </p>
      </div>
    )
  }

  // Full
  if (isFull) {
    return (
      <div className="rounded-2xl bg-white p-5 text-center" style={{ boxShadow: '0 2px 12px rgba(61,43,31,0.05)', border: '1px solid #DDD3C4' }}>
        <p className="text-[14px] font-medium text-warm-muted">
          L&apos;evento è al completo. Contattaci per la lista d&apos;attesa.
        </p>
      </div>
    )
  }

  // Can register — show form
  return (
    <RegistrationForm
      eventId={eventId}
      contactId={contactId}
      defaultDietary={defaultDietary}
      wasCancelled={existingRegistration?.status === 'cancelled'}
    />
  )
}

function RegisteredView({
  registration,
  onCancel,
  loading,
  error,
}: {
  registration: EventRegistration
  onCancel: () => void
  loading: boolean
  error: string
}) {
  const [confirmCancel, setConfirmCancel] = useState(false)
  const statusInfo = REGISTRATION_STATUSES.find((s) => s.value === registration.status)

  return (
    <div className="rounded-2xl bg-white p-5" style={{ boxShadow: '0 2px 12px rgba(61,43,31,0.05)', border: '1px solid #DDD3C4' }}>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-[16px] font-semibold text-warm-text">La tua iscrizione</h3>
        {statusInfo && (
          <span className={cn('rounded-full px-3 py-1 text-[11px] font-semibold text-white', statusInfo.color)}>
            {statusInfo.label}
          </span>
        )}
      </div>

      {registration.plus_one && registration.plus_one_name && (
        <p className="mt-3 text-[13px] text-warm-muted">
          +1: {registration.plus_one_name}
        </p>
      )}

      {error && (
        <div className="mt-3 rounded-xl bg-red-50 p-3 text-center text-[13px] text-red-600">
          {error}
        </div>
      )}

      {/* Cancel flow */}
      {!confirmCancel ? (
        <button
          onClick={() => setConfirmCancel(true)}
          className="mt-4 w-full rounded-xl py-3 text-[13px] font-semibold text-dusty-rose transition-colors hover:bg-red-50"
          style={{ border: '1px solid #C4A0A0' }}
        >
          Cancella iscrizione
        </button>
      ) : (
        <div className="mt-4 space-y-2">
          <p className="text-center text-[13px] text-warm-muted">Sei sicura di voler cancellare?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmCancel(false)}
              disabled={loading}
              className="flex-1 rounded-xl py-3 text-[13px] font-semibold text-warm-muted transition-colors"
              style={{ border: '1px solid #DDD3C4' }}
            >
              No, torna indietro
            </button>
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 rounded-xl bg-dusty-rose py-3 text-[13px] font-semibold text-white transition-colors disabled:opacity-50"
            >
              {loading ? 'Cancellando...' : 'Sì, cancella'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function RegistrationForm({
  eventId,
  contactId,
  defaultDietary,
  wasCancelled,
}: {
  eventId: string
  contactId: string
  defaultDietary: string
  wasCancelled: boolean
}) {
  const router = useRouter()
  const [dietary, setDietary] = useState(defaultDietary)
  const [notes, setNotes] = useState('')
  const [plusOne, setPlusOne] = useState(false)
  const [plusOneName, setPlusOneName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    const { error: insertError } = await supabase
      .from('event_registrations')
      .insert({
        event_id: eventId,
        contact_id: contactId,
        status: 'pending' as RegistrationStatus,
        dietary_requirements: dietary || null,
        notes: notes || null,
        plus_one: plusOne,
        plus_one_name: plusOne ? plusOneName || null : null,
        registration_source: 'public_form',
      })

    setLoading(false)

    if (insertError) {
      setError('Errore nell\'iscrizione. Riprova.')
      return
    }

    router.refresh()
  }

  const inputClass =
    'w-full rounded-xl border bg-white px-3.5 py-2.5 text-[14px] font-medium text-warm-text placeholder:text-warm-light placeholder:font-normal focus:border-terracotta focus:ring-1 focus:ring-terracotta'
  const inputBorder = { borderColor: '#DDD3C4' }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-5"
      style={{ boxShadow: '0 2px 12px rgba(61,43,31,0.05)', border: '1px solid #DDD3C4' }}
    >
      <h3 className="mb-4 font-display text-[16px] font-semibold text-warm-text">
        {wasCancelled ? 'Iscriviti di nuovo' : 'Iscriviti'}
      </h3>

      <div className="space-y-3">
        {/* Dietary */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[1px] text-warm-muted">
            Esigenze alimentari
          </label>
          <input
            type="text"
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            placeholder="es. Vegetariana, celiaca..."
            className={inputClass}
            style={inputBorder}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[1px] text-warm-muted">
            Note
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Qualcosa che dovremmo sapere?"
            rows={2}
            className={`${inputClass} resize-none`}
            style={{ ...inputBorder, lineHeight: '1.5' }}
          />
        </div>

        {/* Plus one */}
        <div>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl p-1">
            <input
              type="checkbox"
              checked={plusOne}
              onChange={(e) => setPlusOne(e.target.checked)}
              className="h-5 w-5 rounded accent-terracotta"
            />
            <span className="text-[13px] font-medium text-warm-text">Porterò un&apos;accompagnatrice (+1)</span>
          </label>
          {plusOne && (
            <input
              type="text"
              value={plusOneName}
              onChange={(e) => setPlusOneName(e.target.value)}
              placeholder="Nome dell'accompagnatrice"
              className={`mt-2 ${inputClass}`}
              style={inputBorder}
            />
          )}
        </div>
      </div>

      {error && (
        <div className="mt-3 rounded-xl bg-red-50 p-3 text-center text-[13px] text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full rounded-[14px] py-4 text-[15px] font-semibold text-white shadow-lg transition-all duration-300 active:scale-[0.96] active:opacity-90 disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg, #C4704B, #B3613E)' }}
      >
        {loading ? 'Iscrizione in corso...' : 'Conferma iscrizione'}
      </button>
    </form>
  )
}
