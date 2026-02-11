'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  Users,
  UserCheck,
  ListChecks,
  Euro,
  UtensilsCrossed,
  Wallet,
  Receipt,
  TrendingDown,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageLoading } from '@/components/ui/loading'
import { CapacityBar } from '@/components/events/capacity-bar'
import { RegistrationTable } from '@/components/events/registration-table'
import { AddRegistrationDialog } from '@/components/events/add-registration-dialog'
import { ExpenseTable } from '@/components/events/expense-table'
import { AddExpenseDialog } from '@/components/events/add-expense-dialog'
import { useEvent } from '@/hooks/useEvents'
import { useEventExpenses } from '@/hooks/useExpenses'
import { useToast } from '@/components/ui/toast'
import { formatDate, formatTime, formatCurrency } from '@/lib/utils'
import type { EventStatus, EventExpense } from '@/types'

const statusToBadgeVariant: Record<EventStatus, 'draft' | 'confirmed' | 'pending' | 'cancelled' | 'attended' | 'lead' | 'default'> = {
  draft: 'draft',
  published: 'lead',
  registration_open: 'confirmed',
  registration_closed: 'pending',
  completed: 'attended',
  cancelled: 'cancelled',
}

const statusLabels: Record<EventStatus, string> = {
  draft: 'Bozza',
  published: 'Pubblicato',
  registration_open: 'Iscrizioni aperte',
  registration_closed: 'Iscrizioni chiuse',
  completed: 'Completato',
  cancelled: 'Cancellato',
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { toast } = useToast()
  const { event, registrations, summary, isLoading, error, mutate } = useEvent(id)
  const { expenses, mutate: mutateExpenses } = useEventExpenses(id)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<EventExpense | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('Sei sicura di voler eliminare questo evento? Questa azione non è reversibile.')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        toast('error', data.error || 'Errore durante l\'eliminazione')
        return
      }
      toast('success', 'Evento eliminato')
      router.push('/dashboard/events')
    } catch {
      toast('error', 'Errore di rete')
    } finally {
      setDeleting(false)
    }
  }

  if (isLoading) return <PageLoading />

  if (error || !event) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-dusty-rose font-body">
          {error ? 'Errore durante il caricamento' : 'Evento non trovato'}
        </p>
      </div>
    )
  }

  // Collect dietary requirements from confirmed/attended registrations
  const dietaryList = registrations
    .filter((r) => ['confirmed', 'attended', 'pending'].includes(r.status))
    .map((r) => r.dietary_requirements)
    .filter((d): d is string => !!d)

  const uniqueDiets = [...new Set(dietaryList)]

  return (
    <>
      <PageHeader
        title={event.title}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Aggiungi registrazione
            </Button>
            <Link href={`/dashboard/events/${id}/edit`}>
              <Button variant="secondary">
                <Pencil className="h-4 w-4" />
                Modifica
              </Button>
            </Link>
            <Button
              variant="secondary"
              onClick={handleDelete}
              loading={deleting}
              className="!text-dusty-rose !border-dusty-rose/40 hover:!bg-dusty-rose/5"
            >
              <Trash2 className="h-4 w-4" />
              Elimina
            </Button>
          </div>
        }
      />

      {/* Event info card */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant={statusToBadgeVariant[event.status]}>
                {statusLabels[event.status]}
              </Badge>
              {event.ticket_price_cents > 0 ? (
                <span className="text-sm font-body font-medium text-warm-text">
                  {formatCurrency(event.ticket_price_cents)}
                </span>
              ) : (
                <span className="text-sm font-body text-warm-muted">Gratuito</span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-warm-text font-body">
                <Calendar className="h-4 w-4 text-warm-muted flex-shrink-0" />
                <span>{formatDate(event.event_date)}</span>
              </div>

              {event.start_time && (
                <div className="flex items-center gap-2 text-sm text-warm-text font-body">
                  <Clock className="h-4 w-4 text-warm-muted flex-shrink-0" />
                  <span>
                    {formatTime(event.start_time)}
                    {event.end_time && ` - ${formatTime(event.end_time)}`}
                  </span>
                </div>
              )}

              {(event.venue_name || event.venue_address || event.city) && (
                <div className="flex items-center gap-2 text-sm text-warm-text font-body">
                  <MapPin className="h-4 w-4 text-warm-muted flex-shrink-0" />
                  <span>
                    {[event.venue_name, event.venue_address, event.city]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </div>
              )}
            </div>

            {event.description && (
              <p className="text-sm text-warm-muted font-body max-w-xl mt-2">
                {event.description}
              </p>
            )}
          </div>

          <div className="w-full md:w-64 flex-shrink-0">
            <CapacityBar
              confirmed={summary?.confirmed_count ?? 0}
              waitlisted={summary?.waitlisted_count ?? 0}
              capacity={event.capacity}
            />
          </div>
        </div>
      </Card>

      {/* Stats row */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <StatCard
            icon={Users}
            label="Registrazioni"
            value={summary.total_registrations}
          />
          <StatCard
            icon={UserCheck}
            label="Confermate"
            value={summary.confirmed_count}
            accent="sage"
          />
          <StatCard
            icon={ListChecks}
            label="Lista d'attesa"
            value={summary.waitlisted_count}
            accent="soft-blue"
          />
          <StatCard
            icon={UserCheck}
            label="Presenti"
            value={summary.attended_count}
            accent="muted-gold"
          />
          <StatCard
            icon={Euro}
            label="Ricavi"
            value={formatCurrency(summary.total_revenue_cents)}
            accent="terracotta"
          />
        </div>
      )}

      {/* Registrations table */}
      <Card title="Registrazioni" className="mb-6">
        <RegistrationTable
          registrations={registrations}
          eventId={id}
          onUpdate={() => mutate()}
        />
      </Card>

      {/* Budget section */}
      <BudgetSection
        expenses={expenses}
        eventId={id}
        onAddExpense={() => {
          setEditingExpense(null)
          setExpenseDialogOpen(true)
        }}
        onEditExpense={(expense) => {
          setEditingExpense(expense)
          setExpenseDialogOpen(true)
        }}
        onUpdate={() => mutateExpenses()}
      />

      {/* Dietary summary */}
      {uniqueDiets.length > 0 && (
        <Card title="Riepilogo diete" className="mb-6">
          <div className="space-y-2">
            {uniqueDiets.map((diet, i) => {
              const count = dietaryList.filter((d) => d === diet).length
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm font-body"
                >
                  <UtensilsCrossed className="h-3.5 w-3.5 text-warm-muted flex-shrink-0" />
                  <span className="text-warm-text">{diet}</span>
                  <span className="text-warm-muted">({count})</span>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Add registration dialog */}
      <AddRegistrationDialog
        eventId={id}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => {
          setDialogOpen(false)
          mutate()
        }}
      />

      {/* Add/edit expense dialog */}
      <AddExpenseDialog
        eventId={id}
        open={expenseDialogOpen}
        onClose={() => {
          setExpenseDialogOpen(false)
          setEditingExpense(null)
        }}
        onSuccess={() => {
          setExpenseDialogOpen(false)
          setEditingExpense(null)
          mutateExpenses()
        }}
        expense={editingExpense}
      />
    </>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Users
  label: string
  value: string | number
  accent?: string
}) {
  return (
    <div className="bg-white border border-stone rounded-none p-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon
          className={`h-4 w-4 ${accent ? `text-${accent}` : 'text-warm-muted'}`}
        />
        <span className="text-xs font-sans uppercase tracking-wider text-warm-muted">
          {label}
        </span>
      </div>
      <p
        className={`text-xl font-serif ${
          accent ? `text-${accent}` : 'text-warm-text'
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function BudgetSection({
  expenses,
  eventId,
  onAddExpense,
  onEditExpense,
  onUpdate,
}: {
  expenses: EventExpense[]
  eventId: string
  onAddExpense: () => void
  onEditExpense: (expense: EventExpense) => void
  onUpdate: () => void
}) {
  const activeExpenses = expenses.filter((e) => e.status !== 'cancelled')
  const totalBudgeted = activeExpenses.reduce((sum, e) => sum + e.budgeted_cents, 0)
  const totalPaid = activeExpenses.reduce((sum, e) => sum + e.paid_cents, 0)
  const remaining = totalBudgeted - totalPaid

  return (
    <>
      {/* Budget stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard
          icon={Wallet}
          label="Preventivato"
          value={formatCurrency(totalBudgeted)}
          accent="soft-blue"
        />
        <StatCard
          icon={Receipt}
          label="Pagato"
          value={formatCurrency(totalPaid)}
          accent="sage"
        />
        <StatCard
          icon={TrendingDown}
          label="Rimanente"
          value={formatCurrency(remaining)}
          accent={remaining < 0 ? 'dusty-rose' : 'terracotta'}
        />
      </div>

      {/* Expense table */}
      <Card className="mb-6">
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone">
          <h3 className="text-lg font-serif text-warm-text">Budget</h3>
          <Button variant="secondary" size="sm" onClick={onAddExpense}>
            <Plus className="h-4 w-4" />
            Aggiungi spesa
          </Button>
        </div>
        <ExpenseTable
          expenses={expenses}
          eventId={eventId}
          onUpdate={onUpdate}
          onEdit={onEditExpense}
        />
      </Card>
    </>
  )
}
