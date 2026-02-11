import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { capturePayPalOrder } from '@/lib/paypal'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(
        new URL('/dashboard/payments?error=missing_token', request.url)
      )
    }

    // Capture the PayPal order
    const captureResult = await capturePayPalOrder(token)

    if (captureResult.status !== 'COMPLETED') {
      // Update payment as failed
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('paypal_order_id', token)

      return NextResponse.redirect(
        new URL('/dashboard/payments?error=capture_failed', request.url)
      )
    }

    // Update payment status to completed
    const { data: payment, error } = await supabase
      .from('payments')
      .update({
        status: 'completed',
        paid_at: new Date().toISOString(),
      })
      .eq('paypal_order_id', token)
      .select('*, contact:contacts(id, first_name, last_name)')
      .single()

    if (error) {
      console.error('Error updating payment after capture:', error)
      return NextResponse.redirect(
        new URL('/dashboard/payments?error=update_failed', request.url)
      )
    }

    // Log activity
    const contactName = payment.contact
      ? `${payment.contact.first_name}${payment.contact.last_name ? ' ' + payment.contact.last_name : ''}`
      : 'Sconosciuto'

    await supabase.from('activity_log').insert({
      action: 'payment.completed',
      entity_type: 'payment',
      entity_id: payment.id,
      description: `Pagamento PayPal completato: ${(payment.amount_cents / 100).toFixed(2)} EUR da ${contactName}`,
      performed_by: 'system',
    })

    return NextResponse.redirect(
      new URL('/dashboard/payments?success=payment_completed', request.url)
    )
  } catch (err) {
    console.error('GET /api/paypal/capture error:', err)
    return NextResponse.redirect(
      new URL('/dashboard/payments?error=server_error', request.url)
    )
  }
}
