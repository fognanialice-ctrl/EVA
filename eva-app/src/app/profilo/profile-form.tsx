'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Contact {
  id: string
  first_name: string
  last_name: string | null
  email: string | null
  phone: string | null
  city: string | null
  date_of_birth: string | null
  profession: string | null
  instagram_handle: string | null
  preferred_contact_method: 'whatsapp' | 'email' | 'phone' | null
  dietary_requirements: string | null
  allergies_sensitivities: string | null
  photo_consent: boolean
}

const cardStyle = {
  boxShadow: '0 2px 12px rgba(61,43,31,0.05)',
  border: '1px solid #DDD3C4',
}

const inputClass =
  'w-full rounded-xl border bg-white px-3.5 py-2.5 text-[14px] font-medium text-warm-text placeholder:text-warm-light placeholder:font-normal focus:border-terracotta focus:ring-1 focus:ring-terracotta disabled:bg-stone/20 disabled:text-warm-light'

const inputBorder = { borderColor: '#DDD3C4' }

export default function ProfileForm({ contact }: { contact: Contact }) {
  const [form, setForm] = useState({
    first_name: contact.first_name || '',
    last_name: contact.last_name || '',
    email: contact.email || '',
    phone: contact.phone || '',
    city: contact.city || '',
    date_of_birth: contact.date_of_birth || '',
    profession: contact.profession || '',
    instagram_handle: contact.instagram_handle || '',
    preferred_contact_method: contact.preferred_contact_method || '',
    dietary_requirements: contact.dietary_requirements || '',
    allergies_sensitivities: contact.allergies_sensitivities || '',
    photo_consent: contact.photo_consent || false,
  })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    const supabase = createClient()

    const { error: updateError } = await supabase
      .from('contacts')
      .update({
        first_name: form.first_name,
        last_name: form.last_name || null,
        phone: form.phone || null,
        city: form.city || null,
        date_of_birth: form.date_of_birth || null,
        profession: form.profession || null,
        instagram_handle: form.instagram_handle || null,
        preferred_contact_method: form.preferred_contact_method || null,
        dietary_requirements: form.dietary_requirements || null,
        allergies_sensitivities: form.allergies_sensitivities || null,
        photo_consent: form.photo_consent,
      })
      .eq('id', contact.id)

    setSaving(false)

    if (updateError) {
      setError('Errore nel salvataggio. Riprova.')
      return
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSave} className="space-y-3">
      {/* Personal Info */}
      <section className="rounded-2xl bg-white p-[18px]" style={cardStyle}>
        <h3 className="mb-4 font-display text-[17px] font-semibold text-warm-text">
          Informazioni personali
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nome" value={form.first_name} onChange={(v) => updateField('first_name', v)} required />
            <Field label="Cognome" value={form.last_name} onChange={(v) => updateField('last_name', v)} />
          </div>
          <Field label="Email" type="email" value={form.email} disabled onChange={() => {}} hint="Non modificabile" />
          <Field label="Telefono" type="tel" value={form.phone} onChange={(v) => updateField('phone', v)} placeholder="+39 ..." />
          <Field label="Data di nascita" type="date" value={form.date_of_birth} onChange={(v) => updateField('date_of_birth', v)} />
          <Field label="Città" value={form.city} onChange={(v) => updateField('city', v)} placeholder="es. Genova" />
          <Field label="Professione" value={form.profession} onChange={(v) => updateField('profession', v)} placeholder="es. Designer, Insegnante..." />
        </div>
      </section>

      {/* Social & Contact */}
      <section className="rounded-2xl bg-white p-[18px]" style={cardStyle}>
        <h3 className="mb-4 font-display text-[17px] font-semibold text-warm-text">
          Come contattarti
        </h3>
        <div className="space-y-3">
          <Field label="Instagram" value={form.instagram_handle} onChange={(v) => updateField('instagram_handle', v)} placeholder="@tuohandle" />
          <div>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[1px] text-warm-muted">
              Contatto preferito
            </label>
            <div className="flex gap-2">
              {(['whatsapp', 'email', 'phone'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => updateField('preferred_contact_method', method)}
                  className="rounded-[20px] px-[22px] py-[10px] text-[13px] font-semibold transition-all duration-200 active:scale-[0.96] active:opacity-90"
                  style={
                    form.preferred_contact_method === method
                      ? { background: '#C4704B', color: 'white' }
                      : { background: 'white', color: '#8B7E74', border: '1px solid #DDD3C4' }
                  }
                >
                  {method === 'whatsapp' ? 'WhatsApp' : method === 'email' ? 'Email' : 'Telefono'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dietary & Events */}
      <section className="rounded-2xl bg-white p-[18px]" style={cardStyle}>
        <h3 className="mb-4 font-display text-[17px] font-semibold text-warm-text">
          Per i nostri eventi
        </h3>
        <div className="space-y-3">
          <TextArea
            label="Esigenze alimentari"
            value={form.dietary_requirements}
            onChange={(v) => updateField('dietary_requirements', v)}
            placeholder="es. Vegetariana, celiaca, intolleranze..."
          />
          <TextArea
            label="Allergie o sensibilità"
            value={form.allergies_sensitivities}
            onChange={(v) => updateField('allergies_sensitivities', v)}
            placeholder="es. Allergia alle noci, lattosio..."
          />
        </div>
      </section>

      {/* Photo Consent */}
      <section className="rounded-2xl bg-white p-[18px]" style={cardStyle}>
        <h3 className="mb-3 font-display text-[17px] font-semibold text-warm-text">
          Consensi
        </h3>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl p-1 transition-colors">
          <input
            type="checkbox"
            checked={form.photo_consent}
            onChange={(e) => updateField('photo_consent', e.target.checked)}
            className="mt-0.5 h-5 w-5 rounded accent-terracotta"
          />
          <span className="text-[13px] leading-relaxed text-warm-muted">
            Acconsento all&apos;utilizzo delle mie foto scattate durante gli eventi EVA
            per comunicazione e social media.
          </span>
        </label>
      </section>

      {/* Save button */}
      <div className="sticky bottom-4 pt-2">
        {error && (
          <div className="mb-2 rounded-xl bg-red-50 p-3 text-center text-[13px] text-red-600">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-[14px] py-4 text-[15px] font-semibold text-white shadow-lg transition-all duration-300 active:scale-[0.96] active:opacity-90 disabled:opacity-50"
          style={{
            background: saved
              ? '#7A8B6F'
              : 'linear-gradient(135deg, #C4704B, #B3613E)',
          }}
        >
          {saving ? 'Salvataggio...' : saved ? '✓ Salvato con successo!' : 'Salva profilo'}
        </button>
      </div>

      {/* Toast */}
      {saved && (
        <div
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl px-6 py-3 text-[13px] font-medium text-white animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{ background: '#3D2B1F' }}
        >
          Profilo aggiornato ✨
        </div>
      )}
    </form>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  disabled,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  hint?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[1px] text-warm-muted">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={inputClass}
        style={inputBorder}
      />
      {hint && <p className="mt-1 text-[10px] text-warm-light">{hint}</p>}
    </div>
  )
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[1px] text-warm-muted">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className={`${inputClass} resize-none`}
        style={{ ...inputBorder, lineHeight: '1.5' }}
      />
    </div>
  )
}
