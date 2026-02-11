import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { eventSchema } from '@/lib/validators'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Fetch event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()

    if (eventError) {
      if (eventError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Evento non trovato' },
          { status: 404 }
        )
      }
      return NextResponse.json({ error: eventError.message }, { status: 500 })
    }

    // Fetch registrations with contact info
    const { data: registrations, error: regError } = await supabase
      .from('event_registrations')
      .select(`
        *,
        contact:contacts(id, first_name, last_name, email, phone)
      `)
      .eq('event_id', id)
      .order('registered_at', { ascending: false })

    if (regError) {
      return NextResponse.json({ error: regError.message }, { status: 500 })
    }

    // Calculate summary stats
    const regs = registrations || []
    const summary = {
      total_registrations: regs.length,
      confirmed_count: regs.filter((r) => r.status === 'confirmed').length,
      waitlisted_count: regs.filter((r) => r.status === 'waitlisted').length,
      attended_count: regs.filter((r) => r.status === 'attended').length,
      cancelled_count: regs.filter((r) => r.status === 'cancelled').length,
      pending_count: regs.filter((r) => r.status === 'pending').length,
      total_revenue_cents:
        regs.filter((r) => ['confirmed', 'attended'].includes(r.status)).length *
        event.ticket_price_cents,
    }

    return NextResponse.json({ event, registrations: regs, summary })
  } catch (err) {
    console.error('GET /api/events/[id] error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    const parsed = eventSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.flatten()
      return NextResponse.json(
        { error: 'Dati non validi', details: errors },
        { status: 400 }
      )
    }

    const eventData = parsed.data

    const { data: event, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity
    await supabase.from('activity_log').insert({
      action: 'event.updated',
      entity_type: 'event',
      entity_id: event.id,
      description: `Evento aggiornato: ${event.title}`,
      performed_by: 'admin',
    })

    return NextResponse.json({ event })
  } catch (err) {
    console.error('PUT /api/events/[id] error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get event info for logging before deleting
    const { data: event } = await supabase
      .from('events')
      .select('title')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity
    await supabase.from('activity_log').insert({
      action: 'event.deleted',
      entity_type: 'event',
      entity_id: id,
      description: `Evento eliminato: ${event?.title || id}`,
      performed_by: 'admin',
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/events/[id] error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
