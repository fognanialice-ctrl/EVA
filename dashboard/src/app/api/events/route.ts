import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { eventSchema } from '@/lib/validators'
import { slugify } from '@/lib/utils'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        event_registrations(count)
      `)
      .order('event_date', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Also fetch confirmed counts separately
    const { data: confirmedCounts } = await supabase
      .from('event_registrations')
      .select('event_id')
      .in('status', ['confirmed', 'attended'])

    const confirmedByEvent: Record<string, number> = {}
    if (confirmedCounts) {
      for (const reg of confirmedCounts) {
        confirmedByEvent[reg.event_id] = (confirmedByEvent[reg.event_id] || 0) + 1
      }
    }

    const eventsWithCounts = (events || []).map((event) => {
      const regCount = event.event_registrations?.[0]?.count ?? 0
      const { event_registrations: _, ...rest } = event
      return {
        ...rest,
        registration_count: regCount,
        confirmed_count: confirmedByEvent[event.id] || 0,
      }
    })

    return NextResponse.json({ events: eventsWithCounts })
  } catch (err) {
    console.error('GET /api/events error:', err)
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

    // Auto-generate slug from title if not provided
    if (body.title && !body.slug) {
      body.slug = slugify(body.title)
    }

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
      .insert(eventData)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity
    await supabase.from('activity_log').insert({
      action: 'event.created',
      entity_type: 'event',
      entity_id: event.id,
      description: `Evento creato: ${event.title}`,
      performed_by: 'admin',
    })

    return NextResponse.json({ event }, { status: 201 })
  } catch (err) {
    console.error('POST /api/events error:', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
