'use client'

import useSWR from 'swr'
import type { Contact, Tag } from '@/types'

interface ContactsFilters {
  search?: string
  status?: string
  source?: string
  tag?: string
}

interface ContactsResponse {
  contacts: Contact[]
}

interface ContactDetailResponse {
  contact: Contact & {
    tags: Tag[]
    event_registrations: Array<{
      id: string
      status: string
      registered_at: string
      event: {
        id: string
        title: string
        event_date: string
      }
    }>
    payments: Array<{
      id: string
      amount_cents: number
      currency: string
      method: string
      status: string
      description: string | null
      paid_at: string | null
      created_at: string
      event?: {
        id: string
        title: string
      }
    }>
  }
  activities: Array<{
    id: string
    action: string
    description: string
    performed_by: string
    created_at: string
  }>
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Errore di rete' }))
    throw new Error(error.error || 'Errore durante il caricamento')
  }
  return res.json()
}

export function useContacts(filters: ContactsFilters = {}) {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.status) params.set('status', filters.status)
  if (filters.source) params.set('source', filters.source)
  if (filters.tag) params.set('tag', filters.tag)

  const queryString = params.toString()
  const url = `/api/contacts${queryString ? `?${queryString}` : ''}`

  const { data, error, isLoading, mutate } = useSWR<ContactsResponse>(url, fetcher)

  return {
    contacts: data?.contacts ?? [],
    isLoading,
    error,
    mutate,
  }
}

export function useContact(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<ContactDetailResponse>(
    id ? `/api/contacts/${id}` : null,
    fetcher
  )

  return {
    contact: data?.contact ?? null,
    activities: data?.activities ?? [],
    isLoading,
    error,
    mutate,
  }
}

export function useTags() {
  const { data, error, isLoading, mutate } = useSWR<{ tags: Tag[] }>(
    '/api/tags',
    fetcher
  )

  return {
    tags: data?.tags ?? [],
    isLoading,
    error,
    mutate,
  }
}
