import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { expenseSchema } from '@/lib/validators'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: expenses, error } = await supabase
      .from('event_expenses')
      .select('*')
      .eq('event_id', id)
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ expenses: expenses || [] })
  } catch (err) {
    console.error('GET /api/events/[id]/expenses error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const parsed = expenseSchema.safeParse({ ...body, event_id: eventId })
    if (!parsed.success) {
      const errors = parsed.error.flatten()
      return NextResponse.json(
        { error: 'Dati non validi', details: errors },
        { status: 400 }
      )
    }

    const { data: expense, error } = await supabase
      .from('event_expenses')
      .insert(parsed.data)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity
    await supabase.from('activity_log').insert({
      action: 'expense.created',
      entity_type: 'event_expense',
      entity_id: expense.id,
      description: `Spesa aggiunta: ${expense.supplier_name}`,
      metadata: { event_id: eventId },
      performed_by: 'admin',
    })

    return NextResponse.json({ expense }, { status: 201 })
  } catch (err) {
    console.error('POST /api/events/[id]/expenses error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
