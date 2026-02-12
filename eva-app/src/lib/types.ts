export type EventStatus = 'draft' | 'published' | 'registration_open' | 'registration_closed' | 'completed' | 'cancelled'
export type RegistrationStatus = 'pending' | 'confirmed' | 'waitlisted' | 'cancelled' | 'attended' | 'no_show'
export type RegistrationSource = 'dashboard' | 'public_form' | 'whatsapp' | 'manual'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type PreferredContact = 'whatsapp' | 'email' | 'phone'

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
  photo_consent: boolean
  auth_user_id: string | null
  created_at: string
  updated_at: string
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
  event?: EVAEvent
}

export interface Payment {
  id: string
  contact_id: string
  event_id: string | null
  registration_id: string | null
  amount_cents: number
  currency: string
  status: PaymentStatus
  description: string | null
  paid_at: string | null
  created_at: string
}
