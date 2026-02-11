'use client'

import { useState, useEffect } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { EXPENSE_CATEGORIES, EXPENSE_STATUSES } from '@/lib/constants'
import type { EventExpense } from '@/types'

interface AddExpenseDialogProps {
  eventId: string
  open: boolean
  onClose: () => void
  onSuccess: () => void
  expense?: EventExpense | null
}

const defaultForm = {
  supplier_name: '',
  category: 'other',
  description: '',
  budgeted_eur: '',
  paid_eur: '',
  status: 'quoted',
  invoice_ref: '',
}

export function AddExpenseDialog({
  eventId,
  open,
  onClose,
  onSuccess,
  expense,
}: AddExpenseDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = !!expense

  useEffect(() => {
    if (expense) {
      setForm({
        supplier_name: expense.supplier_name,
        category: expense.category,
        description: expense.description || '',
        budgeted_eur: (expense.budgeted_cents / 100).toFixed(2),
        paid_eur: (expense.paid_cents / 100).toFixed(2),
        status: expense.status,
        invoice_ref: expense.invoice_ref || '',
      })
    } else {
      setForm(defaultForm)
    }
    setErrors({})
  }, [expense, open])

  function handleClose() {
    setForm(defaultForm)
    setErrors({})
    setLoading(false)
    onClose()
  }

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    // Client-side validation
    const newErrors: Record<string, string> = {}
    if (!form.supplier_name.trim()) {
      newErrors.supplier_name = 'Il nome fornitore è obbligatorio'
    }

    const budgetedCents = Math.round(parseFloat(form.budgeted_eur || '0') * 100)
    const paidCents = Math.round(parseFloat(form.paid_eur || '0') * 100)

    if (isNaN(budgetedCents) || budgetedCents < 0) {
      newErrors.budgeted_eur = 'Importo non valido'
    }
    if (isNaN(paidCents) || paidCents < 0) {
      newErrors.paid_eur = 'Importo non valido'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      const body = {
        supplier_name: form.supplier_name.trim(),
        category: form.category,
        description: form.description.trim() || null,
        budgeted_cents: budgetedCents,
        paid_cents: paidCents,
        status: form.status,
        paid_at: form.status === 'paid' ? new Date().toISOString() : (expense?.paid_at || null),
        invoice_ref: form.invoice_ref.trim() || null,
      }

      const url = isEditing
        ? `/api/events/${eventId}/expenses/${expense.id}`
        : `/api/events/${eventId}/expenses`

      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        toast('error', data.error || 'Errore durante il salvataggio')
        return
      }

      toast('success', isEditing ? 'Spesa aggiornata' : 'Spesa aggiunta')
      setForm(defaultForm)
      onSuccess()
    } catch {
      toast('error', 'Errore di rete')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={isEditing ? 'Modifica spesa' : 'Aggiungi spesa'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome fornitore"
          value={form.supplier_name}
          onChange={(e) => update('supplier_name', e.target.value)}
          placeholder="es. Dimora Almayer"
          error={errors.supplier_name}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Categoria"
            options={EXPENSE_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
          />

          <Select
            label="Stato"
            options={EXPENSE_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Preventivato (€)"
            type="number"
            step="0.01"
            min="0"
            value={form.budgeted_eur}
            onChange={(e) => update('budgeted_eur', e.target.value)}
            placeholder="0.00"
            error={errors.budgeted_eur}
          />

          <Input
            label="Pagato (€)"
            type="number"
            step="0.01"
            min="0"
            value={form.paid_eur}
            onChange={(e) => update('paid_eur', e.target.value)}
            placeholder="0.00"
            error={errors.paid_eur}
          />
        </div>

        <Input
          label="Rif. fattura/ricevuta"
          value={form.invoice_ref}
          onChange={(e) => update('invoice_ref', e.target.value)}
          placeholder="es. FT-2026/001"
        />

        <Input
          label="Descrizione/note"
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Dettagli sulla spesa..."
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Annulla
          </Button>
          <Button type="submit" loading={loading}>
            {isEditing ? 'Salva' : 'Aggiungi'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
