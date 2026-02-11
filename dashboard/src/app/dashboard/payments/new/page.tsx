'use client'

import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { PaymentForm } from '@/components/payments/payment-form'
import { ArrowLeft } from 'lucide-react'

export default function NewPaymentPage() {
  const router = useRouter()

  return (
    <div>
      <PageHeader
        title="Nuovo pagamento"
        description="Registra un nuovo pagamento manuale o genera un link PayPal"
        action={
          <Button
            variant="secondary"
            onClick={() => router.push('/dashboard/payments')}
          >
            <ArrowLeft className="h-4 w-4" />
            Indietro
          </Button>
        }
      />

      <div className="max-w-2xl">
        <PaymentForm
          onSuccess={() => {
            router.push('/dashboard/payments')
          }}
        />
      </div>
    </div>
  )
}
