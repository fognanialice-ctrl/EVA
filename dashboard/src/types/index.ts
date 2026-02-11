export type ContactSource = 'website_form' | 'whatsapp' | 'manual' | 'referral' | 'instagram'
export type ContactStatus = 'lead' | 'contacted' | 'confirmed' | 'attended' | 'inactive'
export type PreferredContact = 'whatsapp' | 'email' | 'phone'
export type BillingType = 'persona_fisica' | 'partita_iva'

export type EventStatus = 'draft' | 'published' | 'registration_open' | 'registration_closed' | 'completed' | 'cancelled'
export type RegistrationStatus = 'pending' | 'confirmed' | 'waitlisted' | 'cancelled' | 'attended' | 'no_show'
export type RegistrationSource = 'dashboard' | 'public_form' | 'whatsapp' | 'manual'

export type PaymentMethod = 'paypal' | 'bank_transfer' | 'cash' | 'other'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export type ExpenseCategory = 'venue' | 'catering' | 'decoration' | 'staff' | 'supplies' | 'transport' | 'marketing' | 'other'
export type ExpenseStatus = 'quoted' | 'deposit_paid' | 'paid' | 'cancelled'

export type ActivityPerformer = 'admin' | 'system' | 'public_form'

export interface Contact {
  id: string
  first_name: string
  last_name: string | null
  email: string | null
  phone: string | null
  city: string | null
  date_of_birth: string | null
  profession: string | null
  instagram_handle: string | null
  preferred_contact_method: PreferredContact | null
  dietary_requirements: string | null
  allergies_sensitivities: string | null
  notes: string | null
  source: ContactSource
  source_detail: string | null
  status: ContactStatus
  subscribed_to_mailing: boolean
  referred_by: string | null
  gdpr_consent: boolean
  gdpr_consent_date: string | null
  photo_consent: boolean
  billing_type: BillingType | null
  codice_fiscale: string | null
  partita_iva: string | null
  ragione_sociale: string | null
  billing_address: string | null
  billing_cap: string | null
  billing_city: string | null
  billing_province: string | null
  sdi_code: string | null
  pec: string | null
  created_at: string
  updated_at: string
  tags?: Tag[]
}

export interface Tag {
  id: string
  name: string
  color: string
}

export interface ContactTag {
  contact_id: string
  tag_id: string
}

export interface EVAEvent {
  id: string
  title: string
  slug: string
  description: string | null
  event_date: string
  start_time: string | null
  end_time: string | null
  venue_name: string | null
  venue_address: string | null
  city: string | null
  capacity: number
  ticket_price_cents: number
  status: EventStatus
  created_at: string
  updated_at: string
}

export interface EventRegistration {
  id: string
  event_id: string
  contact_id: string
  status: RegistrationStatus
  dietary_requirements: string | null
  notes: string | null
  plus_one: boolean
  plus_one_name: string | null
  registration_source: RegistrationSource
  registered_at: string
  confirmed_at: string | null
  cancelled_at: string | null
  attended_at: string | null
  contact?: Contact
  event?: EVAEvent
}

export interface Payment {
  id: string
  contact_id: string
  event_id: string | null
  registration_id: string | null
  amount_cents: number
  currency: string
  method: PaymentMethod
  status: PaymentStatus
  paypal_order_id: string | null
  description: string | null
  paid_at: string | null
  created_at: string
  contact?: Contact
  event?: EVAEvent
}

export interface ActivityLog {
  id: string
  action: string
  entity_type: string | null
  entity_id: string | null
  description: string
  metadata: Record<string, unknown> | null
  performed_by: ActivityPerformer
  created_at: string
}

export interface DashboardStats {
  total_contacts: number
  mailing_subscribers: number
  upcoming_events: number
  total_revenue_cents: number
}

export interface EventExpense {
  id: string
  event_id: string
  supplier_name: string
  category: ExpenseCategory
  description: string | null
  budgeted_cents: number
  paid_cents: number
  status: ExpenseStatus
  paid_at: string | null
  invoice_ref: string | null
  created_at: string
  updated_at: string
}

export interface EventRegistrationSummary {
  event_id: string
  title: string
  event_date: string
  capacity: number
  total_registrations: number
  confirmed_count: number
  waitlisted_count: number
  attended_count: number
  cancelled_count: number
  total_revenue_cents: number
}
