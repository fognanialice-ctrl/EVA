'use client'

import useSWR from 'swr'
import type { EVAEvent, EventRegistration } from '@/types'

interface EventWithCounts extends EVAEvent {
  registration_count: number
  confirmed_count: number
}

interface EventsResponse {
  events: EventWithCounts[]
}

interface EventDetailResponse {
  event: EVAEvent
  registrations: (EventRegistration & { contact: { id: string; first_name: string; last_name: string | null; email: string | null; phone: string | null } })[]
  summary: {
    total_registrations: number
    confirmed_count: number
    waitlisted_count: number
    attended_count: number
    cancelled_count: number
    pending_count: number
    total_revenue_cents: number
  }
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Errore di rete' }))
    throw new Error(error.error || 'Errore durante il caricamento')
  }
  return res.json()
}

export function useEvents() {
  const { data, error, isLoading, mutate } = useSWR<EventsResponse>(
    '/api/events',
    fetcher
  )

  return {
    events: data?.events ?? [],
    isLoading,
    error,
    mutate,
  }
}

export function useEvent(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<EventDetailResponse>(
    id ? `/api/events/${id}` : null,
    fetcher
  )

  return {
    event: data?.event ?? null,
    registrations: data?.registrations ?? [],
    summary: data?.summary ?? null,
    isLoading,
    error,
    mutate,
  }
}
