import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createPayPalOrder } from '@/lib/paypal'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { amount_cents, description, contact_id, event_id, registration_id } = body

    if (!amount_cents || !contact_id) {
      return NextResponse.json(
        { error: 'Importo e contatto sono obbligatori' },
        { status: 400 }
      )
    }

    if (typeof amount_cents !== 'number' || amount_cents < 1) {
      return NextResponse.json(
        { error: "L'importo deve essere maggiore di 0" },
        { status: 400 }
      )
    }

    // Create PayPal order
    const { id: orderId, approvalUrl } = await createPayPalOrder(
      amount_cents,
      description || 'Pagamento EVA'
    )

    if (!orderId) {
      return NextResponse.json(
        { error: "Errore nella creazione dell'ordine PayPal" },
        { status: 500 }
      )
    }

    // Create pending payment record in DB
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        contact_id,
        event_id: event_id || null,
        registration_id: registration_id || null,
        amount_cents,
        currency: 'EUR',
        method: 'paypal',
        status: 'pending',
        paypal_order_id: orderId,
        description: description || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating payment record:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity
    await supabase.from('activity_log').insert({
      action: 'payment.paypal_order_created',
      entity_type: 'payment',
      entity_id: payment.id,
      description: `Ordine PayPal creato: ${orderId} (${(amount_cents / 100).toFixed(2)} EUR)`,
      performed_by: 'admin',
    })

    return NextResponse.json({
      orderId,
      approvalUrl,
      paymentId: payment.id,
    })
  } catch (err) {
    console.error('POST /api/paypal/create-order error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
