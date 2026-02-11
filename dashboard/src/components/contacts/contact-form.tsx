'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { contactSchema } from '@/lib/validators'
import { CONTACT_SOURCES, CONTACT_STATUSES, PREFERRED_CONTACTS, BILLING_TYPES } from '@/lib/constants'
import { useToast } from '@/components/ui/toast'
import { Input, Textarea } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Contact } from '@/types'

interface ContactFormProps {
  contact?: Contact
  onSuccess?: () => void
}

type FormErrors = Record<string, string>

export function ContactForm({ contact, onSuccess }: ContactFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEditing = !!contact

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const [formData, setFormData] = useState({
    first_name: contact?.first_name ?? '',
    last_name: contact?.last_name ?? '',
    email: contact?.email ?? '',
    phone: contact?.phone ?? '',
    city: contact?.city ?? '',
    date_of_birth: contact?.date_of_birth ?? '',
    profession: contact?.profession ?? '',
    instagram_handle: contact?.instagram_handle ?? '',
    preferred_contact_method: contact?.preferred_contact_method ?? '',
    dietary_requirements: contact?.dietary_requirements ?? '',
    allergies_sensitivities: contact?.allergies_sensitivities ?? '',
    notes: contact?.notes ?? '',
    source: contact?.source ?? 'manual',
    source_detail: contact?.source_detail ?? '',
    status: contact?.status ?? 'lead',
    subscribed_to_mailing: contact?.subscribed_to_mailing ?? true,
    referred_by: contact?.referred_by ?? '',
    gdpr_consent: contact?.gdpr_consent ?? false,
    gdpr_consent_date: contact?.gdpr_consent_date ?? '',
    photo_consent: contact?.photo_consent ?? false,
    billing_type: contact?.billing_type ?? '',
    codice_fiscale: contact?.codice_fiscale ?? '',
    partita_iva: contact?.partita_iva ?? '',
    ragione_sociale: contact?.ragione_sociale ?? '',
    billing_address: contact?.billing_address ?? '',
    billing_cap: contact?.billing_cap ?? '',
    billing_city: contact?.billing_city ?? '',
    billing_province: contact?.billing_province ?? '',
    sdi_code: contact?.sdi_code ?? '',
    pec: contact?.pec ?? '',
  })

  function updateField(field: string, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    // Prepare data for validation: convert empty strings to null for optional fields
    const dataForValidation = {
      ...formData,
      last_name: formData.last_name || null,
      email: formData.email || null,
      phone: formData.phone || null,
      city: formData.city || null,
      date_of_birth: formData.date_of_birth || null,
      profession: formData.profession || null,
      instagram_handle: formData.instagram_handle || null,
      preferred_contact_method: formData.preferred_contact_method || null,
      dietary_requirements: formData.dietary_requirements || null,
      allergies_sensitivities: formData.allergies_sensitivities || null,
      notes: formData.notes || null,
      source_detail: formData.source_detail || null,
      referred_by: formData.referred_by || null,
      gdpr_consent_date: formData.gdpr_consent_date || null,
      billing_type: formData.billing_type || null,
      codice_fiscale: formData.codice_fiscale || null,
      partita_iva: formData.partita_iva || null,
      ragione_sociale: formData.ragione_sociale || null,
      billing_address: formData.billing_address || null,
      billing_cap: formData.billing_cap || null,
      billing_city: formData.billing_city || null,
      billing_province: formData.billing_province || null,
      sdi_code: formData.sdi_code || null,
      pec: formData.pec || null,
    }

    const parsed = contactSchema.safeParse(dataForValidation)
    if (!parsed.success) {
      const fieldErrors: FormErrors = {}
      parsed.error.issues.forEach((err) => {
        const field = err.path.join('.')
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)

    try {
      const url = isEditing ? `/api/contacts/${contact.id}` : '/api/contacts'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      const json = await res.json()

      if (!res.ok) {
        if (json.details?.fieldErrors) {
          setErrors(
            Object.fromEntries(
              Object.entries(json.details.fieldErrors).map(
                ([k, v]) => [k, Array.isArray(v) ? v[0] : String(v)]
              )
            )
          )
        }
        toast('error', json.error || 'Errore durante il salvataggio')
        return
      }

      toast(
        'success',
        isEditing ? 'Contatto aggiornato' : 'Contatto creato'
      )

      if (onSuccess) {
        onSuccess()
      } else {
        router.push(`/dashboard/contacts/${json.contact.id}`)
      }
    } catch {
      toast('error', 'Errore di rete')
    } finally {
      setLoading(false)
    }
  }

  const sourceOptions = [
    { value: '', label: 'Seleziona...' },
    ...CONTACT_SOURCES.map((s) => ({ value: s.value, label: s.label })),
  ]
  const statusOptions = [
    { value: '', label: 'Seleziona...' },
    ...CONTACT_STATUSES.map((s) => ({ value: s.value, label: s.label })),
  ]
  const preferredOptions = [
    { value: '', label: 'Nessuna preferenza' },
    ...PREFERRED_CONTACTS.map((s) => ({ value: s.value, label: s.label })),
  ]
  const billingOptions = [
    { value: '', label: 'Non specificato' },
    ...BILLING_TYPES.map((s) => ({ value: s.value, label: s.label })),
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dati base */}
      <Card title="Dati base">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome *"
            value={formData.first_name}
            onChange={(e) => updateField('first_name', e.target.value)}
            error={errors.first_name}
            placeholder="Nome"
          />
          <Input
            label="Cognome"
            value={formData.last_name}
            onChange={(e) => updateField('last_name', e.target.value)}
            error={errors.last_name}
            placeholder="Cognome"
          />
          <Input
            label="Data di nascita"
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => updateField('date_of_birth', e.target.value)}
            error={errors.date_of_birth}
          />
          <Input
            label="Professione"
            value={formData.profession}
            onChange={(e) => updateField('profession', e.target.value)}
            error={errors.profession}
            placeholder="Professione"
          />
        </div>
      </Card>

      {/* Contatto */}
      <Card title="Contatto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            error={errors.email}
            placeholder="email@esempio.it"
          />
          <Input
            label="Telefono"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            error={errors.phone}
            placeholder="+39 333 1234567"
          />
          <Input
            label="Instagram"
            value={formData.instagram_handle}
            onChange={(e) => updateField('instagram_handle', e.target.value)}
            error={errors.instagram_handle}
            placeholder="@username"
          />
          <Select
            label="Metodo preferito"
            value={formData.preferred_contact_method}
            onChange={(e) => updateField('preferred_contact_method', e.target.value)}
            error={errors.preferred_contact_method}
            options={preferredOptions}
          />
          <Input
            label="Citta"
            value={formData.city}
            onChange={(e) => updateField('city', e.target.value)}
            error={errors.city}
            placeholder="Genova"
          />
        </div>
      </Card>

      {/* Profilo */}
      <Card title="Profilo">
        <div className="grid grid-cols-1 gap-4">
          <Textarea
            label="Esigenze alimentari"
            value={formData.dietary_requirements}
            onChange={(e) => updateField('dietary_requirements', e.target.value)}
            error={errors.dietary_requirements}
            placeholder="Vegetariana, vegana, celiaca..."
          />
          <Textarea
            label="Allergie / sensibilita"
            value={formData.allergies_sensitivities}
            onChange={(e) => updateField('allergies_sensitivities', e.target.value)}
            error={errors.allergies_sensitivities}
            placeholder="Allergie o intolleranze..."
          />
          <Textarea
            label="Note"
            value={formData.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            error={errors.notes}
            placeholder="Note interne..."
          />
        </div>
      </Card>

      {/* Tracking */}
      <Card title="Tracking">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Fonte"
            value={formData.source}
            onChange={(e) => updateField('source', e.target.value)}
            error={errors.source}
            options={sourceOptions}
          />
          <Input
            label="Dettaglio fonte"
            value={formData.source_detail}
            onChange={(e) => updateField('source_detail', e.target.value)}
            error={errors.source_detail}
            placeholder="Es. nome evento, campagna..."
          />
          <Select
            label="Stato"
            value={formData.status}
            onChange={(e) => updateField('status', e.target.value)}
            error={errors.status}
            options={statusOptions}
          />
          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="subscribed_to_mailing"
              checked={formData.subscribed_to_mailing}
              onChange={(e) => updateField('subscribed_to_mailing', e.target.checked)}
              className="h-4 w-4 rounded-none border-stone text-terracotta focus:ring-terracotta/40"
            />
            <label htmlFor="subscribed_to_mailing" className="text-sm font-sans text-warm-text">
              Iscritta alla mailing list
            </label>
          </div>
        </div>
      </Card>

      {/* GDPR */}
      <Card title="GDPR">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="gdpr_consent"
              checked={formData.gdpr_consent}
              onChange={(e) => updateField('gdpr_consent', e.target.checked)}
              className="h-4 w-4 rounded-none border-stone text-terracotta focus:ring-terracotta/40"
            />
            <label htmlFor="gdpr_consent" className="text-sm font-sans text-warm-text">
              Consenso GDPR
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="photo_consent"
              checked={formData.photo_consent}
              onChange={(e) => updateField('photo_consent', e.target.checked)}
              className="h-4 w-4 rounded-none border-stone text-terracotta focus:ring-terracotta/40"
            />
            <label htmlFor="photo_consent" className="text-sm font-sans text-warm-text">
              Consenso foto/video
            </label>
          </div>
          {formData.gdpr_consent && (
            <Input
              label="Data consenso GDPR"
              type="date"
              value={formData.gdpr_consent_date}
              onChange={(e) => updateField('gdpr_consent_date', e.target.value)}
              error={errors.gdpr_consent_date}
            />
          )}
        </div>
      </Card>

      {/* Fatturazione */}
      <Card title="Fatturazione">
        <div className="space-y-4">
          <Select
            label="Tipo fatturazione"
            value={formData.billing_type}
            onChange={(e) => updateField('billing_type', e.target.value)}
            error={errors.billing_type}
            options={billingOptions}
          />

          {formData.billing_type && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <Input
                label="Codice fiscale"
                value={formData.codice_fiscale}
                onChange={(e) => updateField('codice_fiscale', e.target.value)}
                error={errors.codice_fiscale}
                placeholder="RSSMRA85M01H501Z"
              />
              {formData.billing_type === 'partita_iva' && (
                <>
                  <Input
                    label="Partita IVA"
                    value={formData.partita_iva}
                    onChange={(e) => updateField('partita_iva', e.target.value)}
                    error={errors.partita_iva}
                    placeholder="12345678901"
                  />
                  <Input
                    label="Ragione sociale"
                    value={formData.ragione_sociale}
                    onChange={(e) => updateField('ragione_sociale', e.target.value)}
                    error={errors.ragione_sociale}
                    placeholder="Ragione sociale"
                  />
                  <Input
                    label="Codice SDI"
                    value={formData.sdi_code}
                    onChange={(e) => updateField('sdi_code', e.target.value)}
                    error={errors.sdi_code}
                    placeholder="0000000"
                  />
                  <Input
                    label="PEC"
                    type="email"
                    value={formData.pec}
                    onChange={(e) => updateField('pec', e.target.value)}
                    error={errors.pec}
                    placeholder="pec@esempio.it"
                  />
                </>
              )}
              <Input
                label="Indirizzo"
                value={formData.billing_address}
                onChange={(e) => updateField('billing_address', e.target.value)}
                error={errors.billing_address}
                placeholder="Via Roma 1"
              />
              <Input
                label="CAP"
                value={formData.billing_cap}
                onChange={(e) => updateField('billing_cap', e.target.value)}
                error={errors.billing_cap}
                placeholder="16121"
              />
              <Input
                label="Citta"
                value={formData.billing_city}
                onChange={(e) => updateField('billing_city', e.target.value)}
                error={errors.billing_city}
                placeholder="Genova"
              />
              <Input
                label="Provincia"
                value={formData.billing_province}
                onChange={(e) => updateField('billing_province', e.target.value)}
                error={errors.billing_province}
                placeholder="GE"
                maxLength={2}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Azioni */}
      <div className="flex items-center gap-3 justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          Annulla
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {isEditing ? 'Salva modifiche' : 'Crea contatto'}
        </Button>
      </div>
    </form>
  )
}
