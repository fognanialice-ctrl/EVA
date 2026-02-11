export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatTime(time: string): string {
  return time.slice(0, 5)
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100)
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const d = new Date(date)
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'ora'
  if (diffMins < 60) return `${diffMins} min fa`
  if (diffHours < 24) return `${diffHours}h fa`
  if (diffDays < 7) return `${diffDays}g fa`
  return formatDateShort(d)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function getInitials(firstName: string, lastName?: string | null): string {
  const first = firstName.charAt(0).toUpperCase()
  const last = lastName ? lastName.charAt(0).toUpperCase() : ''
  return first + last
}

export function contactDisplayName(contact: { first_name: string; last_name?: string | null }): string {
  return [contact.first_name, contact.last_name].filter(Boolean).join(' ')
}
