import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { expenseSchema } from '@/lib/validators'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; expenseId: string }> }
) {
  try {
    const { id: eventId, expenseId } = await params
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
      .update(parsed.data)
      .eq('id', expenseId)
      .eq('event_id', eventId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity
    await supabase.from('activity_log').insert({
      action: 'expense.updated',
      entity_type: 'event_expense',
      entity_id: expense.id,
      description: `Spesa aggiornata: ${expense.supplier_name}`,
      metadata: { event_id: eventId },
      performed_by: 'admin',
    })

    return NextResponse.json({ expense })
  } catch (err) {
    console.error('PUT /api/events/[id]/expenses/[expenseId] error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; expenseId: string }> }
) {
  try {
    const { id: eventId, expenseId } = await params
    const supabase = await createClient()

    // Get expense info for logging
    const { data: expense } = await supabase
      .from('event_expenses')
      .select('supplier_name')
      .eq('id', expenseId)
      .eq('event_id', eventId)
      .single()

    const { error } = await supabase
      .from('event_expenses')
      .delete()
      .eq('id', expenseId)
      .eq('event_id', eventId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity
    await supabase.from('activity_log').insert({
      action: 'expense.deleted',
      entity_type: 'event_expense',
      entity_id: expenseId,
      description: `Spesa eliminata: ${expense?.supplier_name || expenseId}`,
      metadata: { event_id: eventId },
      performed_by: 'admin',
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/events/[id]/expenses/[expenseId] error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
