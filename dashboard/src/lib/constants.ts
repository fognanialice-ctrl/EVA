export const CONTACT_SOURCES = [
  { value: 'website_form', label: 'Form sito' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'manual', label: 'Manuale' },
  { value: 'referral', label: 'Referral' },
  { value: 'instagram', label: 'Instagram' },
] as const

export const CONTACT_STATUSES = [
  { value: 'lead', label: 'Lead', color: 'bg-soft-blue' },
  { value: 'contacted', label: 'Contattata', color: 'bg-ochre' },
  { value: 'confirmed', label: 'Confermata', color: 'bg-sage' },
  { value: 'attended', label: 'Presente', color: 'bg-muted-gold' },
  { value: 'inactive', label: 'Inattiva', color: 'bg-warm-light' },
] as const

export const EVENT_STATUSES = [
  { value: 'draft', label: 'Bozza', color: 'bg-warm-light' },
  { value: 'published', label: 'Pubblicato', color: 'bg-soft-blue' },
  { value: 'registration_open', label: 'Iscrizioni aperte', color: 'bg-sage' },
  { value: 'registration_closed', label: 'Iscrizioni chiuse', color: 'bg-ochre' },
  { value: 'completed', label: 'Completato', color: 'bg-muted-gold' },
  { value: 'cancelled', label: 'Cancellato', color: 'bg-dusty-rose' },
] as const

export const REGISTRATION_STATUSES = [
  { value: 'pending', label: 'In attesa', color: 'bg-ochre' },
  { value: 'confirmed', label: 'Confermata', color: 'bg-sage' },
  { value: 'waitlisted', label: 'Lista d\'attesa', color: 'bg-soft-blue' },
  { value: 'cancelled', label: 'Cancellata', color: 'bg-dusty-rose' },
  { value: 'attended', label: 'Presente', color: 'bg-muted-gold' },
  { value: 'no_show', label: 'Assente', color: 'bg-warm-light' },
] as const

export const PAYMENT_METHODS = [
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank_transfer', label: 'Bonifico' },
  { value: 'cash', label: 'Contanti' },
  { value: 'other', label: 'Altro' },
] as const

export const PAYMENT_STATUSES = [
  { value: 'pending', label: 'In attesa', color: 'bg-ochre' },
  { value: 'completed', label: 'Completato', color: 'bg-sage' },
  { value: 'failed', label: 'Fallito', color: 'bg-dusty-rose' },
  { value: 'refunded', label: 'Rimborsato', color: 'bg-warm-light' },
] as const

export const PREFERRED_CONTACTS = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Telefono' },
] as const

export const BILLING_TYPES = [
  { value: 'persona_fisica', label: 'Persona fisica' },
  { value: 'partita_iva', label: 'Partita IVA' },
] as const

export const EXPENSE_CATEGORIES = [
  { value: 'venue', label: 'Venue' },
  { value: 'catering', label: 'Catering' },
  { value: 'decoration', label: 'Decorazioni' },
  { value: 'staff', label: 'Staff' },
  { value: 'supplies', label: 'Materiali' },
  { value: 'transport', label: 'Trasporto' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'other', label: 'Altro' },
] as const

export const EXPENSE_STATUSES = [
  { value: 'quoted', label: 'Preventivo', color: 'bg-soft-blue' },
  { value: 'deposit_paid', label: 'Acconto versato', color: 'bg-ochre' },
  { value: 'paid', label: 'Pagato', color: 'bg-sage' },
  { value: 'cancelled', label: 'Cancellato', color: 'bg-dusty-rose' },
] as const
