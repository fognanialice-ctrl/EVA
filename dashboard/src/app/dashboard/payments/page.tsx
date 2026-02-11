'use client'

import { Suspense, useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CreditCard, Plus } from 'lucide-react'
import { usePayments } from '@/hooks/usePayments'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { PageLoading } from '@/components/ui/loading'
import { useToast } from '@/components/ui/toast'
import { formatCurrency, formatDateShort, contactDisplayName } from '@/lib/utils'
import { PAYMENT_METHODS, PAYMENT_STATUSES } from '@/lib/constants'
import type { Payment, PaymentStatus } from '@/types'

const statusVariantMap: Record<PaymentStatus, 'confirmed' | 'pending' | 'cancelled' | 'default'> = {
  completed: 'confirmed',
  pending: 'pending',
  failed: 'cancelled',
  refunded: 'default',
}

const methodOptions = [
  { value: '', label: 'Tutti i metodi' },
  ...PAYMENT_METHODS.map((m) => ({ value: m.value, label: m.label })),
]

const statusOptions = [
  { value: '', label: 'Tutti gli stati' },
  ...PAYMENT_STATUSES.map((s) => ({ value: s.value, label: s.label })),
]

function getStatusLabel(status: PaymentStatus): string {
  return PAYMENT_STATUSES.find((s) => s.value === status)?.label || status
}

function getMethodLabel(method: string): string {
  return PAYMENT_METHODS.find((m) => m.value === method)?.label || method
}

function PaymentsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [statusFilter, setStatusFilter] = useState('')
  const [methodFilter, setMethodFilter] = useState('')

  const { payments, isLoading, error } = usePayments({
    status: statusFilter || undefined,
    method: methodFilter || undefined,
  })

  useEffect(() => {
    const success = searchParams.get('success')
    const errorParam = searchParams.get('error')

    if (success === 'payment_completed') {
      toast('success', 'Pagamento PayPal completato con successo')
    }
    if (errorParam === 'capture_failed') {
      toast('error', 'Errore durante la cattura del pagamento PayPal')
    }
    if (errorParam === 'missing_token') {
      toast('error', 'Token PayPal mancante')
    }
    if (errorParam === 'server_error') {
      toast('error', 'Errore del server durante il pagamento')
    }
  }, [searchParams, toast])

  const totalCents = useMemo(() => {
    return payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount_cents, 0)
  }, [payments])

  if (isLoading) return <PageLoading />

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-sm font-body text-dusty-rose">
          Errore nel caricamento dei pagamenti
        </p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Pagamenti"
        description="Gestisci i pagamenti e le transazioni"
        action={
          <Button onClick={() => router.push('/dashboard/payments/new')}>
            <Plus className="h-4 w-4" />
            Nuovo pagamento
          </Button>
        }
      />

      <div className="flex items-end gap-4 mb-6">
        <div className="w-48">
          <Select
            label="Stato"
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select
            label="Metodo"
            options={methodOptions}
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          />
        </div>
      </div>

      {payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="Nessun pagamento"
          description="Non ci sono ancora pagamenti registrati"
          action={
            <Button onClick={() => router.push('/dashboard/payments/new')}>
              <Plus className="h-4 w-4" />
              Registra pagamento
            </Button>
          }
        />
      ) : (
        <div className="bg-white border border-stone rounded-none">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contatto</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Importo</TableHead>
                <TableHead>Metodo</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment: Payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {payment.contact ? (
                      <span className="font-sans font-medium">
                        {contactDisplayName(payment.contact)}
                      </span>
                    ) : (
                      <span className="text-warm-muted">--</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {payment.event ? (
                      <span>{payment.event.title}</span>
                    ) : (
                      <span className="text-warm-muted">--</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-sans font-medium">
                      {formatCurrency(payment.amount_cents)}
                    </span>
                  </TableCell>
                  <TableCell>{getMethodLabel(payment.method)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariantMap[payment.status] || 'default'}>
                      {getStatusLabel(payment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {payment.paid_at
                      ? formatDateShort(payment.paid_at)
                      : formatDateShort(payment.created_at)}
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell className="font-sans font-medium">Totale completati</TableCell>
                <TableCell />
                <TableCell>
                  <span className="font-serif text-base font-medium text-terracotta">
                    {formatCurrency(totalCents)}
                  </span>
                </TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

export default function PaymentsPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <PaymentsContent />
    </Suspense>
  )
}
