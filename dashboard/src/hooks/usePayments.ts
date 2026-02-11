'use client'

import useSWR from 'swr'
import type { Payment } from '@/types'

interface PaymentsFilters {
  status?: string
  method?: string
  event_id?: string
}

interface PaymentsResponse {
  payments: Payment[]
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Errore di rete' }))
    throw new Error(error.error || 'Errore durante il caricamento')
  }
  return res.json()
}

export function usePayments(filters: PaymentsFilters = {}) {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.method) params.set('method', filters.method)
  if (filters.event_id) params.set('event_id', filters.event_id)

  const queryString = params.toString()
  const url = `/api/payments${queryString ? `?${queryString}` : ''}`

  const { data, error, isLoading, mutate } = useSWR<PaymentsResponse>(url, fetcher)

  return {
    payments: data?.payments ?? [],
    isLoading,
    error,
    mutate,
  }
}
