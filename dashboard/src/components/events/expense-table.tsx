'use client'

import { useState } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { formatCurrency } from '@/lib/utils'
import { EXPENSE_CATEGORIES, EXPENSE_STATUSES } from '@/lib/constants'
import type { EventExpense, ExpenseStatus } from '@/types'
import { ChevronDown, Trash2 } from 'lucide-react'

interface ExpenseTableProps {
  expenses: EventExpense[]
  eventId: string
  onUpdate: () => void
  onEdit: (expense: EventExpense) => void
}

const statusToBadge: Record<ExpenseStatus, 'confirmed' | 'pending' | 'cancelled' | 'attended' | 'lead' | 'draft' | 'default'> = {
  quoted: 'lead',
  deposit_paid: 'pending',
  paid: 'confirmed',
  cancelled: 'cancelled',
}

export function ExpenseTable({ expenses, eventId, onUpdate, onEdit }: ExpenseTableProps) {
  const { toast } = useToast()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  function getCategoryLabel(value: string) {
    return EXPENSE_CATEGORIES.find((c) => c.value === value)?.label || value
  }

  function getStatusLabel(value: string) {
    return EXPENSE_STATUSES.find((s) => s.value === value)?.label || value
  }

  async function updateStatus(expenseId: string, expense: EventExpense, newStatus: ExpenseStatus) {
    setLoadingId(expenseId)
    setOpenMenuId(null)

    try {
      const res = await fetch(
        `/api/events/${eventId}/expenses/${expenseId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            supplier_name: expense.supplier_name,
            category: expense.category,
            description: expense.description,
            budgeted_cents: expense.budgeted_cents,
            paid_cents: expense.paid_cents,
            status: newStatus,
            paid_at: newStatus === 'paid' ? new Date().toISOString() : expense.paid_at,
            invoice_ref: expense.invoice_ref,
          }),
        }
      )

      if (!res.ok) {
        const data = await res.json()
        toast('error', data.error || 'Errore durante l\'aggiornamento')
        return
      }

      toast('success', `Stato aggiornato: ${getStatusLabel(newStatus)}`)
      onUpdate()
    } catch {
      toast('error', 'Errore di rete')
    } finally {
      setLoadingId(null)
    }
  }

  async function handleDelete(expenseId: string) {
    if (!confirm('Eliminare questa spesa?')) return

    setLoadingId(expenseId)
    try {
      const res = await fetch(
        `/api/events/${eventId}/expenses/${expenseId}`,
        { method: 'DELETE' }
      )

      if (!res.ok) {
        const data = await res.json()
        toast('error', data.error || 'Errore durante l\'eliminazione')
        return
      }

      toast('success', 'Spesa eliminata')
      onUpdate()
    } catch {
      toast('error', 'Errore di rete')
    } finally {
      setLoadingId(null)
    }
  }

  if (expenses.length === 0) {
    return (
      <p className="text-sm text-warm-muted font-body py-8 text-center">
        Nessuna spesa registrata
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fornitore</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead className="text-right">Preventivo</TableHead>
          <TableHead className="text-right">Pagato</TableHead>
          <TableHead>Stato</TableHead>
          <TableHead>Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell>
              <button
                type="button"
                onClick={() => onEdit(expense)}
                className="text-left hover:text-terracotta transition-colors"
              >
                <p className="font-medium text-warm-text">
                  {expense.supplier_name}
                </p>
                {expense.description && (
                  <p className="text-xs text-warm-muted truncate max-w-[200px]">
                    {expense.description}
                  </p>
                )}
              </button>
            </TableCell>
            <TableCell>
              <span className="text-sm text-warm-muted">
                {getCategoryLabel(expense.category)}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <span className="text-sm font-medium text-warm-text">
                {formatCurrency(expense.budgeted_cents)}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <span className="text-sm text-warm-text">
                {formatCurrency(expense.paid_cents)}
              </span>
            </TableCell>
            <TableCell>
              <Badge variant={statusToBadge[expense.status]}>
                {getStatusLabel(expense.status)}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <div className="relative">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={loadingId === expense.id}
                    loading={loadingId === expense.id}
                    onClick={() =>
                      setOpenMenuId(openMenuId === expense.id ? null : expense.id)
                    }
                  >
                    <span className="sr-only">Stato</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>

                  {openMenuId === expense.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenMenuId(null)}
                      />
                      <div className="absolute right-0 top-full mt-1 z-20 w-44 bg-white border border-stone rounded-none shadow-lg py-1">
                        {EXPENSE_STATUSES
                          .filter((s) => s.value !== expense.status)
                          .map((statusOption) => (
                            <button
                              key={statusOption.value}
                              onClick={() =>
                                updateStatus(expense.id, expense, statusOption.value as ExpenseStatus)
                              }
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-body text-warm-text hover:bg-cream-alt transition-colors text-left"
                            >
                              {statusOption.label}
                            </button>
                          ))}
                      </div>
                    </>
                  )}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDelete(expense.id)}
                  className="!text-dusty-rose hover:!bg-dusty-rose/5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
