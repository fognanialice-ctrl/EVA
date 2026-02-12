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
