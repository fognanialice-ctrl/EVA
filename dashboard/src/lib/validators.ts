import { z } from 'zod'

export const contactSchema = z.object({
  first_name: z.string().min(1, 'Il nome è obbligatorio'),
  last_name: z.string().optional().nullable(),
  email: z.string().email('Email non valida').optional().nullable().or(z.literal('')),
  phone: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  profession: z.string().optional().nullable(),
  instagram_handle: z.string().optional().nullable(),
  preferred_contact_method: z.enum(['whatsapp', 'email', 'phone']).optional().nullable(),
  dietary_requirements: z.string().optional().nullable(),
  allergies_sensitivities: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  source: z.enum(['website_form', 'whatsapp', 'manual', 'referral', 'instagram']).default('manual'),
  source_detail: z.string().optional().nullable(),
  status: z.enum(['lead', 'contacted', 'confirmed', 'attended', 'inactive']).default('lead'),
  subscribed_to_mailing: z.boolean().default(true),
  referred_by: z.string().uuid().optional().nullable(),
  gdpr_consent: z.boolean().default(false),
  gdpr_consent_date: z.string().optional().nullable(),
  photo_consent: z.boolean().default(false),
  billing_type: z.enum(['persona_fisica', 'partita_iva']).optional().nullable(),
  codice_fiscale: z.string().optional().nullable(),
  partita_iva: z.string().optional().nullable(),
  ragione_sociale: z.string().optional().nullable(),
  billing_address: z.string().optional().nullable(),
  billing_cap: z.string().optional().nullable(),
  billing_city: z.string().optional().nullable(),
  billing_province: z.string().max(2).optional().nullable(),
  sdi_code: z.string().optional().nullable(),
  pec: z.string().email('PEC non valida').optional().nullable().or(z.literal('')),
}).refine(
  (data) => data.email || data.phone,
  { message: 'Email o telefono è obbligatorio', path: ['email'] }
)

export const eventSchema = z.object({
  title: z.string().min(1, 'Il titolo è obbligatorio'),
  slug: z.string().min(1, 'Lo slug è obbligatorio'),
  description: z.string().optional().nullable(),
  event_date: z.string().min(1, 'La data è obbligatoria'),
  start_time: z.string().optional().nullable(),
  end_time: z.string().optional().nullable(),
  venue_name: z.string().optional().nullable(),
  venue_address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  capacity: z.number().int().min(1).default(25),
  ticket_price_cents: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published', 'registration_open', 'registration_closed', 'completed', 'cancelled']).default('draft'),
})

export const registrationSchema = z.object({
  event_id: z.string().uuid(),
  contact_id: z.string().uuid(),
  status: z.enum(['pending', 'confirmed', 'waitlisted', 'cancelled', 'attended', 'no_show']).default('pending'),
  dietary_requirements: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  plus_one: z.boolean().default(false),
  plus_one_name: z.string().optional().nullable(),
  registration_source: z.enum(['dashboard', 'public_form', 'whatsapp', 'manual']).default('dashboard'),
})

export const paymentSchema = z.object({
  contact_id: z.string().uuid(),
  event_id: z.string().uuid().optional().nullable(),
  registration_id: z.string().uuid().optional().nullable(),
  amount_cents: z.number().int().min(1, 'L\'importo deve essere maggiore di 0'),
  currency: z.string().default('EUR'),
  method: z.enum(['paypal', 'bank_transfer', 'cash', 'other']),
  status: z.enum(['pending', 'completed', 'failed', 'refunded']).default('pending'),
  description: z.string().optional().nullable(),
  paid_at: z.string().optional().nullable(),
})

export const publicRegistrationSchema = z.object({
  first_name: z.string().min(1, 'Il nome è obbligatorio'),
  email: z.string().email('Email non valida'),
  phone: z.string().optional(),
  gdpr_consent: z.literal(true, { error: 'Il consenso è obbligatorio' }),
})

export const tagSchema = z.object({
  name: z.string().min(1, 'Il nome è obbligatorio'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Colore HEX non valido'),
})

export const expenseSchema = z.object({
  event_id: z.string().uuid(),
  supplier_name: z.string().min(1, 'Il nome fornitore è obbligatorio'),
  category: z.enum(['venue', 'catering', 'decoration', 'staff', 'supplies', 'transport', 'marketing', 'other']).default('other'),
  description: z.string().optional().nullable(),
  budgeted_cents: z.number().int().min(0, 'L\'importo deve essere positivo').default(0),
  paid_cents: z.number().int().min(0, 'L\'importo deve essere positivo').default(0),
  status: z.enum(['quoted', 'deposit_paid', 'paid', 'cancelled']).default('quoted'),
  paid_at: z.string().optional().nullable(),
  invoice_ref: z.string().optional().nullable(),
})

export type ContactInput = z.infer<typeof contactSchema>
export type EventInput = z.infer<typeof eventSchema>
export type RegistrationInput = z.infer<typeof registrationSchema>
export type PaymentInput = z.infer<typeof paymentSchema>
export type PublicRegistrationInput = z.infer<typeof publicRegistrationSchema>
export type TagInput = z.infer<typeof tagSchema>
export type ExpenseInput = z.infer<typeof expenseSchema>
