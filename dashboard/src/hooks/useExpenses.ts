'use client'

import useSWR from 'swr'
import type { EventExpense } from '@/types'

interface ExpensesResponse {
  expenses: EventExpense[]
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Errore di rete' }))
    throw new Error(error.error || 'Errore durante il caricamento')
  }
  return res.json()
}

export function useEventExpenses(eventId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<ExpensesResponse>(
    eventId ? `/api/events/${eventId}/expenses` : null,
    fetcher
  )

  return {
    expenses: data?.expenses ?? [],
    isLoading,
    error,
    mutate,
  }
}
