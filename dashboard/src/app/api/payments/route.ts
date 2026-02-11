import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { paymentSchema } from '@/lib/validators'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get('status') || ''
    const method = searchParams.get('method') || ''
    const event_id = searchParams.get('event_id') || ''

    let query = supabase
      .from('payments')
      .select('*, contact:contacts(id, first_name, last_name, email), event:events(id, title, event_date)')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (method) {
      query = query.eq('method', method)
    }

    if (event_id) {
      query = query.eq('event_id', event_id)
    }

    const { data: payments, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ payments: payments || [] })
  } catch (err) {
    console.error('GET /api/payments error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const parsed = paymentSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.flatten()
      return NextResponse.json(
        { error: 'Dati non validi', details: errors },
        { status: 400 }
      )
    }

    const paymentData = parsed.data

    const { data: payment, error } = await supabase
      .from('payments')
      .insert(paymentData)
      .select('*, contact:contacts(id, first_name, last_name, email), event:events(id, title)')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity
    const contactName = payment.contact
      ? `${payment.contact.first_name}${payment.contact.last_name ? ' ' + payment.contact.last_name : ''}`
      : 'Sconosciuto'

    await supabase.from('activity_log').insert({
      action: 'payment.created',
      entity_type: 'payment',
      entity_id: payment.id,
      description: `Pagamento registrato: ${(payment.amount_cents / 100).toFixed(2)} EUR da ${contactName}`,
      performed_by: 'admin',
    })

    return NextResponse.json({ payment }, { status: 201 })
  } catch (err) {
    console.error('POST /api/payments error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
